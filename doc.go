// Package pipelineschema validates Buildkite pipeline YAML and JSON against
// the schema embedded in this module version.
//
// Validation is deterministic and offline. It checks documented pipeline
// syntax, but successful validation does not guarantee that the Buildkite API
// will accept a pipeline.
package pipelineschema
