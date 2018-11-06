# Buildkite Pipeline JSON Schema ![Buildkite](https://img.shields.io/buildkite/7fc0b70eb527b66ebb782dd7411becfa14d2b972dab25b48c1/master.svg?label=Tests)

A [JSON Schema](https://json-schema.org) for Buildkite’s [pipeline file format](https://buildkite.com/docs/pipelines/defining-steps), covering all current, documented options. Useful for linting/validating your pipeline.yml files using tools like [YAML VSCode Extension by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).

See:

* [schema.json](schema.json)
* [test/valid-pipelines](test/valid-pipelines)

## Roadmap

- [x] Figure out nested structures
- [x] Add all the step properties
- [x] Mark deprecate properties/styles
- [ ] Submit to http://schemastore.org/json/

## Testing

If you have [Node 10+](https://nodejs.org/en/) installed:

```shell
cd test
npm install && npm test
```

Or you can use [Docker Compose](https://docs.docker.com/compose/):

```shell
cd test
docker-compose build && docker-compose run --rm tests
```
