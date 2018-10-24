# Buildkite Pipeline JSON Schema

The official [JSON Schema](https://json-schema.org) for Buildkite’s [pipeline file format](https://buildkite.com/docs/pipelines/defining-steps). Useful for linting/validating your pipeline.yml files using tools like [YAML VSCode Extension by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml).

See:

* [schema.json](schema.json)
* [test/valid-pipelines](test/valid-pipelines)

## Roadmap

- [x] Figure out nested structures
- [ ] Add all the step properties
- [ ] Mark deprecate properties/styles
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
