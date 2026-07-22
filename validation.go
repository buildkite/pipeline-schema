package pipelineschema

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"sort"
	"strings"

	"github.com/santhosh-tekuri/jsonschema/v6"
	"gopkg.in/yaml.v3"
)

// ErrNoDocuments is returned when the input is empty or contains only YAML
// whitespace and comments.
var ErrNoDocuments = errors.New("pipeline contains no documents")

// Violation describes one failed pipeline schema assertion.
type Violation struct {
	// Document is the one-based YAML document containing this violation.
	Document int

	// InstanceLocation is a JSON Pointer locating the invalid value in the
	// pipeline document, for example /steps/0/key.
	InstanceLocation string

	// KeywordLocation is a JSON Pointer locating the failed keyword relative
	// to the pipeline schema resource.
	KeywordLocation string

	// AbsoluteKeywordLocation identifies the absolute failed schema location
	// when validation crossed a reference. It may be empty.
	AbsoluteKeywordLocation string

	// Message is a human-readable description of the failed assertion.
	Message string
}

// ValidationError reports all schema violations found across the input
// documents.
type ValidationError struct {
	Violations []Violation
}

func (e *ValidationError) Error() string {
	var message strings.Builder
	message.WriteString("pipeline validation failed:")
	for _, violation := range e.Violations {
		location := violation.InstanceLocation
		if location == "" {
			location = "/"
		}
		fmt.Fprintf(&message, "\n  - document %d at %s: %s", violation.Document, location, violation.Message)
	}
	return message.String()
}

// Validate validates one or more Buildkite pipeline YAML or JSON documents
// against the schema embedded in this module version.
func Validate(data []byte) error {
	schema, err := compiledSchema()
	if err != nil {
		return err
	}

	decoder := yaml.NewDecoder(bytes.NewReader(data))
	var violations []Violation
	documentCount := 0

	for {
		var document yaml.Node
		err := decoder.Decode(&document)
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			return fmt.Errorf("parsing pipeline document %d: %w", documentCount+1, err)
		}

		documentCount++
		if err := validateYAMLNode(&document); err != nil {
			return fmt.Errorf("parsing pipeline document %d: %w", documentCount, err)
		}

		var value any
		if err := document.Decode(&value); err != nil {
			return fmt.Errorf("parsing pipeline document %d: %w", documentCount, err)
		}
		value, err = normalizeYAML(value)
		if err != nil {
			return fmt.Errorf("parsing pipeline document %d: %w", documentCount, err)
		}
		if err := validateDocument(schema, documentCount, value, &violations); err != nil {
			return err
		}
	}

	if documentCount == 0 {
		return ErrNoDocuments
	}
	if len(violations) == 0 {
		return nil
	}

	sort.Slice(violations, func(i, j int) bool {
		left, right := violations[i], violations[j]
		if left.Document != right.Document {
			return left.Document < right.Document
		}
		if left.InstanceLocation != right.InstanceLocation {
			return left.InstanceLocation < right.InstanceLocation
		}
		if left.KeywordLocation != right.KeywordLocation {
			return left.KeywordLocation < right.KeywordLocation
		}
		return left.Message < right.Message
	})
	violations = deduplicateViolations(violations)
	return &ValidationError{Violations: violations}
}

func validateYAMLNode(node *yaml.Node) error {
	allowed := false
	switch node.Kind {
	case yaml.DocumentNode, yaml.AliasNode:
		allowed = node.Tag == ""
	case yaml.MappingNode:
		allowed = node.Tag == "!!map"
	case yaml.SequenceNode:
		allowed = node.Tag == "!!seq"
	case yaml.ScalarNode:
		switch node.Tag {
		case "!!null", "!!bool", "!!str", "!!int", "!!float", "!!merge":
			allowed = true
		}
	}
	if !allowed {
		return fmt.Errorf("unsupported YAML tag %q at line %d, column %d", node.Tag, node.Line, node.Column)
	}
	if node.Kind == yaml.AliasNode {
		return nil
	}
	for _, child := range node.Content {
		if err := validateYAMLNode(child); err != nil {
			return err
		}
	}
	return nil
}

func normalizeYAML(value any) (any, error) {
	switch value := value.(type) {
	case nil, bool, string, json.Number,
		int, int8, int16, int32, int64,
		uint, uint8, uint16, uint32, uint64,
		float32, float64:
		return value, nil
	case []any:
		for index, item := range value {
			normalized, err := normalizeYAML(item)
			if err != nil {
				return nil, fmt.Errorf("sequence item %d: %w", index, err)
			}
			value[index] = normalized
		}
		return value, nil
	case map[string]any:
		for key, item := range value {
			normalized, err := normalizeYAML(item)
			if err != nil {
				return nil, fmt.Errorf("mapping value for %q: %w", key, err)
			}
			value[key] = normalized
		}
		return value, nil
	case map[any]any:
		normalized := make(map[string]any, len(value))
		for key, item := range value {
			stringKey, ok := key.(string)
			if !ok {
				return nil, fmt.Errorf("mapping key must be a string, got %T", key)
			}
			normalizedItem, err := normalizeYAML(item)
			if err != nil {
				return nil, fmt.Errorf("mapping value for %q: %w", stringKey, err)
			}
			normalized[stringKey] = normalizedItem
		}
		return normalized, nil
	default:
		return nil, fmt.Errorf("value must be JSON-compatible, got %T", value)
	}
}

func validateDocument(schema *jsonschema.Schema, document int, value any, violations *[]Violation) error {
	err := schema.Validate(value)
	if err == nil {
		return nil
	}

	var validationErr *jsonschema.ValidationError
	if !errors.As(err, &validationErr) {
		return fmt.Errorf("validating pipeline document %d: %w", document, err)
	}

	before := len(*violations)
	appendOutputViolations(document, validationErr.DetailedOutput(), violations)
	if len(*violations) == before {
		location := jsonPointer(validationErr.InstanceLocation)
		*violations = append(*violations, Violation{
			Document:         document,
			InstanceLocation: location,
			Message:          validationErr.Error(),
		})
	}
	return nil
}

func jsonPointer(tokens []string) string {
	var pointer strings.Builder
	for _, token := range tokens {
		pointer.WriteByte('/')
		pointer.WriteString(strings.NewReplacer("~", "~0", "/", "~1").Replace(token))
	}
	return pointer.String()
}

func appendOutputViolations(document int, unit *jsonschema.OutputUnit, violations *[]Violation) {
	if len(unit.Errors) != 0 {
		for index := range unit.Errors {
			appendOutputViolations(document, &unit.Errors[index], violations)
		}
		return
	}
	if unit.Error == nil {
		return
	}
	*violations = append(*violations, Violation{
		Document:                document,
		InstanceLocation:        unit.InstanceLocation,
		KeywordLocation:         unit.KeywordLocation,
		AbsoluteKeywordLocation: unit.AbsoluteKeywordLocation,
		Message:                 stableOutputMessage(unit),
	})
}

func stableOutputMessage(unit *jsonschema.OutputUnit) string {
	message := unit.Error.String()
	if strings.HasSuffix(unit.KeywordLocation, "/additionalProperties") &&
		strings.HasPrefix(message, "additional properties ") &&
		strings.Count(message, "', '") > 0 {
		return "additional properties not allowed"
	}
	return message
}

func deduplicateViolations(violations []Violation) []Violation {
	type violationKey struct {
		document                int
		instanceLocation        string
		absoluteKeywordLocation string
		message                 string
	}

	seen := make(map[violationKey]struct{}, len(violations))
	unique := violations[:0]
	for _, violation := range violations {
		absoluteLocation := violation.AbsoluteKeywordLocation
		if absoluteLocation == "" {
			absoluteLocation = violation.KeywordLocation
		}
		key := violationKey{
			document:                violation.Document,
			instanceLocation:        violation.InstanceLocation,
			absoluteKeywordLocation: absoluteLocation,
			message:                 violation.Message,
		}
		if _, ok := seen[key]; ok {
			continue
		}
		seen[key] = struct{}{}
		unique = append(unique, violation)
	}
	return unique
}
