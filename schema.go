package pipelineschema

import (
	"bytes"
	_ "embed"
	"fmt"
	"sync"

	"github.com/santhosh-tekuri/jsonschema/v6"
)

//go:embed schema.json
var schemaJSON []byte

const schemaURL = "urn:buildkite:pipeline-schema"

var compiledSchema = sync.OnceValues(func() (*jsonschema.Schema, error) {
	document, err := jsonschema.UnmarshalJSON(bytes.NewReader(schemaJSON))
	if err != nil {
		return nil, fmt.Errorf("decoding embedded pipeline schema: %w", err)
	}

	compiler := jsonschema.NewCompiler()
	compiler.DefaultDraft(jsonschema.Draft7)
	compiler.AssertFormat()
	compiler.UseLoader(rejectExternalLoader{})

	if err := compiler.AddResource(schemaURL, document); err != nil {
		return nil, fmt.Errorf("adding embedded pipeline schema: %w", err)
	}

	schema, err := compiler.Compile(schemaURL)
	if err != nil {
		return nil, fmt.Errorf("compiling embedded pipeline schema: %w", err)
	}
	return schema, nil
})

type rejectExternalLoader struct{}

func (rejectExternalLoader) Load(url string) (any, error) {
	return nil, fmt.Errorf("external schema resource %q is not available", url)
}
