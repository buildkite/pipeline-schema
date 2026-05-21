const expect = require("chai").expect;
const Ajv = require("ajv");
const yaml = require("js-yaml");
const fs = require("fs");

const schema = require("../schema.json");

const validate = (name) => {
  const pipeline = yaml.safeLoad(
    fs.readFileSync(`./valid-pipelines/${name}`, "utf8"),
  );

  const ajv = new Ajv({ allErrors: true });
  var validate = ajv.compile(schema);

  var valid = validate(pipeline);
  if (!valid) {
    expect(ajv.errorsText(validate.errors)).to.eql(undefined);
  }
};

describe("schema.json", function () {
  it("should validate block steps", function () {
    validate("block.yml");
  });
  it("should validate input steps", function () {
    validate("input.yml");
  });
  it("should validate command steps", function () {
    validate("command.yml");
  });
  it("should validate env blocks", function () {
    validate("env.yml");
  });
  it("should validate blocks with extra properties", function () {
    validate("extra-properties.yml");
  });
  it("should validate step groups", function () {
    validate("group.yml");
  });
  it("should validate trigger steps", function () {
    validate("trigger.yml");
  });
  it("should validate wait steps", function () {
    validate("wait.yml");
  });
  it("should validate notify", function () {
    validate("notify.yml");
  });
  it("should validate matrix", function () {
    validate("matrix.yml");
  });
  it("should validate secrets", function () {
    validate("secrets.yml");
  });
  it("should if-changed", function () {
    validate("if-changed.yml");
  });
  it("should validate checkout flags", function () {
    validate("checkout.yml");
  });

  it("should accept checkout.flags with a subset of properties", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { flags: { clone: "--depth 1" } },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept empty string checkout.flags values", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { flags: { clone: "", fetch: "" } },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject unknown checkout.flags properties", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { flags: { submodule: "--init" } },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject non-string checkout.flags values", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { flags: { clone: ["--depth", "1"] } },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject non-object checkout.flags", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { flags: "--depth 1" },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject unknown checkout properties", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { strategy: "shallow" },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should validate checkout.flags examples against the schema", function () {
    const ajv = new Ajv({ allErrors: true });
    const flagsSchema = schema.definitions.checkout.properties.flags;
    const v = ajv.compile(flagsSchema);
    for (const example of flagsSchema.examples) {
      expect(v(example), JSON.stringify(example)).to.eql(true);
    }
    for (const [key, subSchema] of Object.entries(flagsSchema.properties)) {
      const vSub = ajv.compile(subSchema);
      for (const example of subSchema.examples || []) {
        expect(vSub(example), `${key}: ${JSON.stringify(example)}`).to.eql(
          true,
        );
      }
    }
  });

  it("should reject step keys longer than 100 characters", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", key: "a".repeat(101) }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept step keys up to 100 characters", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", key: "a".repeat(100) }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject step keys with invalid characters", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", key: "has spaces" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept step keys with interpolation expressions", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", key: "${TPU_VERSION:-tpu6e}_build_docker" },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should verify groupStep.steps uses the same-ish items as root steps", function () {
    const mainList = schema.definitions.pipelineSteps.items.anyOf;
    const groupList = schema.definitions.groupSteps.items.anyOf;
    expect(mainList.slice(0, -1)).to.eql(groupList);
    expect(mainList[mainList.length - 1].$ref).to.eql(
      "#/definitions/groupStep",
    );
  });
});
