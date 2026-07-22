package pipelineschema

import (
	"errors"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
)

func TestEmbeddedSchemaCompiles(t *testing.T) {
	if _, err := compiledSchema(); err != nil {
		t.Fatalf("compiledSchema() error = %v", err)
	}
}

func TestExternalSchemaLoaderRejectsResources(t *testing.T) {
	if _, err := (rejectExternalLoader{}).Load("https://example.com/schema.json"); err == nil {
		t.Fatal("rejectExternalLoader.Load() error = nil")
	}
}

func TestValidateValidPipelines(t *testing.T) {
	files, err := filepath.Glob("test/valid-pipelines/*.yml")
	if err != nil {
		t.Fatal(err)
	}
	if len(files) == 0 {
		t.Fatal("no valid pipeline fixtures found")
	}

	for _, path := range files {
		t.Run(filepath.Base(path), func(t *testing.T) {
			data, err := os.ReadFile(path)
			if err != nil {
				t.Fatal(err)
			}
			if err := Validate(data); err != nil {
				t.Fatalf("Validate() error = %v", err)
			}
		})
	}
}

func TestValidateAcceptsJSON(t *testing.T) {
	if err := Validate([]byte(`{"steps":[{"command":"echo hello"}]}`)); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
}

func TestValidateNoDocuments(t *testing.T) {
	for name, input := range map[string]string{
		"empty":         "",
		"whitespace":    "  \n  \n",
		"comments only": "# a pipeline may go here\n",
	} {
		t.Run(name, func(t *testing.T) {
			if err := Validate([]byte(input)); !errors.Is(err, ErrNoDocuments) {
				t.Fatalf("Validate() error = %v, want ErrNoDocuments", err)
			}
		})
	}
}

func TestValidateMalformedYAML(t *testing.T) {
	err := Validate([]byte("steps: [\n"))
	if err == nil || !strings.Contains(err.Error(), "parsing pipeline document 1") {
		t.Fatalf("Validate() error = %v, want document parsing error", err)
	}
	var validationErr *ValidationError
	if errors.As(err, &validationErr) {
		t.Fatalf("Validate() error = %T, want source error", err)
	}
}

func TestValidateRejectsDuplicateMappingKeys(t *testing.T) {
	err := Validate([]byte("steps: []\nsteps: []\n"))
	if err == nil || !strings.Contains(err.Error(), "mapping key \"steps\" already defined") {
		t.Fatalf("Validate() error = %v, want duplicate mapping key error", err)
	}
}

func TestValidateRejectsNonStringMappingKeys(t *testing.T) {
	err := Validate([]byte("steps: []\n1: value\n"))
	if err == nil || !strings.Contains(err.Error(), "mapping key must be a string") {
		t.Fatalf("Validate() error = %v, want non-string mapping key error", err)
	}
}

func TestValidateRejectsNonJSONScalar(t *testing.T) {
	err := Validate([]byte("steps: []\nvalue: 2025-01-02\n"))
	if err == nil || !strings.Contains(err.Error(), `unsupported YAML tag "!!timestamp"`) {
		t.Fatalf("Validate() error = %v, want non-JSON value error", err)
	}
}

func TestValidateRejectsCustomYAMLTag(t *testing.T) {
	err := Validate([]byte("steps: []\nvalue: !custom data\n"))
	if err == nil || !strings.Contains(err.Error(), `unsupported YAML tag "!custom"`) {
		t.Fatalf("Validate() error = %v, want custom tag error", err)
	}
}

func TestValidateDoesNotCoerceScalars(t *testing.T) {
	validationErr := requireValidationError(t, Validate([]byte("steps:\n  - command: true\n")))
	if !hasViolation(validationErr, "/steps/0/command", "/type") {
		t.Fatalf("violations = %#v, want command type violation", validationErr.Violations)
	}
}

func TestValidateAliasesAndMergeKeys(t *testing.T) {
	input := []byte(`defaults: &defaults
  command: echo hello
steps:
  - <<: *defaults
`)
	if err := Validate(input); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
}

func TestValidateExplicitEmptyDocument(t *testing.T) {
	validationErr := requireValidationError(t, Validate([]byte("---\n")))
	if validationErr.Violations[0].Document != 1 {
		t.Fatalf("Document = %d, want 1", validationErr.Violations[0].Document)
	}
}

func TestValidateMultipleDocuments(t *testing.T) {
	input := []byte(`steps:
  - command: echo one
---
steps:
  - command: echo two
`)
	if err := Validate(input); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
}

func TestValidateEmptyDocumentInStream(t *testing.T) {
	input := []byte("steps:\n  - command: echo one\n---\n---\nsteps:\n  - command: echo three\n")
	validationErr := requireValidationError(t, Validate(input))
	for _, violation := range validationErr.Violations {
		if violation.Document == 2 && violation.InstanceLocation == "" {
			return
		}
	}
	t.Fatalf("violations = %#v, want root violation in document 2", validationErr.Violations)
}

func TestValidateAggregatesDocuments(t *testing.T) {
	input := []byte(`steps: invalid
---
steps:
  - command: echo valid
---
{}
`)
	validationErr := requireValidationError(t, Validate(input))
	documents := map[int]bool{}
	for _, violation := range validationErr.Violations {
		documents[violation.Document] = true
	}
	if !documents[1] || !documents[3] {
		t.Fatalf("violation documents = %v, want documents 1 and 3", documents)
	}
}

func TestValidateReportsMultipleViolations(t *testing.T) {
	input := []byte(`steps:
  - command: echo hello
    key: has spaces
  - command: echo hello
    key: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
`)
	validationErr := requireValidationError(t, Validate(input))
	locations := map[string]bool{}
	for _, violation := range validationErr.Violations {
		locations[violation.InstanceLocation] = true
	}
	if !locations["/steps/0/key"] || !locations["/steps/1/key"] {
		t.Fatalf("violation locations = %v, want both invalid keys", locations)
	}
}

func TestValidateAssertsRegexFormat(t *testing.T) {
	input := []byte(`steps:
  - input: Release
    fields:
      - text: Version
        key: version
        format: "["
`)
	validationErr := requireValidationError(t, Validate(input))
	if !hasViolation(validationErr, "/steps/0/fields/0/format", "/format") {
		t.Fatalf("violations = %#v, want regex format violation", validationErr.Violations)
	}
}

func TestValidateRepresentativeInvalidPipelines(t *testing.T) {
	tests := map[string]struct {
		input    string
		instance string
		keyword  string
	}{
		"key pattern": {
			input:    "steps:\n  - command: echo hello\n    key: has spaces\n",
			instance: "/steps/0/key",
			keyword:  "/pattern",
		},
		"checkout value": {
			input:    "steps:\n  - command: echo hello\n    checkout:\n      skip: yes\n",
			instance: "/steps/0/checkout/skip",
			keyword:  "/enum",
		},
		"checkout unknown key": {
			input:    "steps:\n  - command: echo hello\n    checkout:\n      skipp: true\n",
			instance: "/steps/0/checkout",
			keyword:  "/additionalProperties",
		},
		"minimum": {
			input:    "steps:\n  - command: echo hello\n    checkout:\n      depth: 0\n",
			instance: "/steps/0/checkout/depth",
			keyword:  "/minimum",
		},
		"required steps": {
			input:    "{}\n",
			instance: "",
			keyword:  "/required",
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			validationErr := requireValidationError(t, Validate([]byte(test.input)))
			if !hasViolation(validationErr, test.instance, test.keyword) {
				t.Fatalf("violations = %#v, want instance %q and keyword suffix %q", validationErr.Violations, test.instance, test.keyword)
			}
		})
	}
}

func TestValidationErrorIsDeterministicAndUseful(t *testing.T) {
	input := []byte("steps:\n  - command: echo hello\n    key: has spaces\n  - command: echo hello\n    key: also spaces\n")
	first := requireValidationError(t, Validate(input))
	second := requireValidationError(t, Validate(input))
	if !reflect.DeepEqual(first.Violations, second.Violations) {
		t.Fatalf("violations differ:\nfirst:  %#v\nsecond: %#v", first.Violations, second.Violations)
	}
	for index := 1; index < len(first.Violations); index++ {
		previous, current := first.Violations[index-1], first.Violations[index]
		if previous.InstanceLocation > current.InstanceLocation {
			t.Fatalf("violations are not sorted: %#v", first.Violations)
		}
	}
	if message := first.Error(); !strings.Contains(message, "document 1 at /steps/0/key") {
		t.Fatalf("ValidationError.Error() = %q, want document and location", message)
	}
}

func requireValidationError(t *testing.T, err error) *ValidationError {
	t.Helper()
	if err == nil {
		t.Fatal("Validate() error = nil, want *ValidationError")
	}
	var validationErr *ValidationError
	if !errors.As(err, &validationErr) {
		t.Fatalf("Validate() error = %T (%v), want *ValidationError", err, err)
	}
	if len(validationErr.Violations) == 0 {
		t.Fatal("ValidationError has no violations")
	}
	return validationErr
}

func hasViolation(err *ValidationError, instance, keywordSuffix string) bool {
	for _, violation := range err.Violations {
		if violation.InstanceLocation == instance && strings.HasSuffix(violation.KeywordLocation, keywordSuffix) {
			return true
		}
	}
	return false
}
