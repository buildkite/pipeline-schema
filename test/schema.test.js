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
  it("should validate checkout", function () {
    validate("checkout.yml");
  });
  it("should if-changed", function () {
    validate("if-changed.yml");
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

  it("should accept checkout.skip as a stringified boolean", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { skip: "true" } }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.skip with a non-boolean value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { skip: "yes" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject pipeline-level checkout.skip with a non-boolean value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { skip: "yes" },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept checkout on a nested command step", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: { command: "echo hello", checkout: { skip: true } } }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept pipeline-level checkout.skip", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { skip: true },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout with an unknown sub-key", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { skipp: true } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout on a non-command step", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ wait: null, checkout: { skip: true } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept checkout.depth", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { depth: 10 } }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.depth of zero", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { depth: 0 } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.depth as a negative integer", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { depth: -1 } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.depth as a string", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { depth: "10" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.depth as a float", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { depth: 1.5 } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept pipeline-level checkout.depth", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { depth: 10 },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject pipeline-level checkout.depth of zero", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { depth: 0 },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept checkout.commit_verification with 'strict'", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { commit_verification: "strict" } },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept checkout.commit_verification with 'warn'", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { commit_verification: "warn" } },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.commit_verification with an invalid string value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { commit_verification: "error" } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.commit_verification with a boolean value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { commit_verification: true } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.commit_verification with an integer value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { commit_verification: 1 } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept pipeline-level checkout.commit_verification", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { commit_verification: "strict" },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject pipeline-level checkout.commit_verification with an invalid value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { commit_verification: "error" },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(false);
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

  it("should accept step-level checkout.flags", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { flags: { clone: "--depth 1", clean: "" } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept checkout.flags on a nested command step", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: {
            command: "echo hello",
            checkout: { flags: { fetch: "--prune --tags" } },
          },
        },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject unknown step-level checkout.flags properties", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { flags: { submodule: "--init" } },
        },
      ],
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

  it("should accept step-level checkout.lfs", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { lfs: true } }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept checkout.lfs on a nested command step", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: {
            command: "echo hello",
            checkout: { lfs: false },
          },
        },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.lfs with a non-boolean value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { lfs: "yes" } }],
    };
    expect(v(pipeline)).to.eql(false);
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
