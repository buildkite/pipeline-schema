const expect = require('chai').expect
const Ajv = require('ajv')
const yaml = require('js-yaml')
const fs = require('fs')

const schema = require('../schema.json')

const validate = (name) => {
  const pipeline = yaml.safeLoad(fs.readFileSync(`./valid-pipelines/${name}`, 'utf8'))

  const ajv = new Ajv({ allErrors: true })
  var validate = ajv.compile(schema)

  var valid = validate(pipeline)
  if (!valid) {
    expect(ajv.errorsText(validate.errors)).to.eql(undefined)
  }
}

describe('schema.json', function() {
  it('should validate block steps', function () {
    validate('block.yml')
  })
  it('should validate input steps', function () {
    validate('input.yml')
  })
  it('should validate command steps', function() {
    validate('command.yml')
  })
  it('should validate env blocks', function () {
    validate('env.yml')
  })
  it('should validate blocks with extra properties', function () {
    validate('extra-properties.yml')
  })
  it('should validate step groups', function () {
    validate('group.yml')
  })
  it('should validate trigger steps', function() {
    validate('trigger.yml')
  })
  it('should validate wait steps', function() {
    validate('wait.yml')
  })
  it('should validate notify', function() {
    validate('notify.yml')
  })
  it('should validate matrix', function() {
    validate('matrix.yml')
  })
  it('should validate environment variables in parallelism field', function() {
    validate('parallelism-env-vars.yml')
  })
  
  it('should verify groupStep.steps uses the same-ish items as root steps', function () {
    const mainList = schema.properties.steps.items.anyOf
    const groupList = schema.definitions.groupStep.properties.steps.items.anyOf
    expect(mainList.slice(0, -1)).to.eql(groupList)
    expect(mainList[mainList.length - 1].$ref).to.eql('#/definitions/groupStep')
  })
})
