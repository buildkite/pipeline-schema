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

  it("should accept checkout.skip as an explicit null", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { skip: null } }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept step-level checkout.skip null alongside a pipeline-level value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { skip: true },
      steps: [{ command: "echo hello", checkout: { skip: null } }],
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

  it("should accept checkout.submodules as a stringified boolean", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { submodules: "false" } }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept checkout.submodules as an explicit null", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { submodules: null } }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.submodules with a non-boolean value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { submodules: "yes" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept pipeline-level checkout.submodules", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { submodules: false },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject pipeline-level checkout.submodules with a non-boolean value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { submodules: "yes" },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept checkout.submodules on a nested command step", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: { command: "echo hello", checkout: { submodules: true } } },
      ],
    };
    expect(v(pipeline)).to.eql(true);
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

  it("should accept checkout.depth as a positive integer string", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { depth: "10" } }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.depth as a non-numeric string", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { depth: "abc" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.depth as a string of zero", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { depth: "0" } }],
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

  // null-as-unset applies only to the boolean checkout fields
  it("should reject checkout.depth as null", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { depth: null } }],
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

  it("should accept checkout.ssh_secret", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "github_readonly" } },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  // ssh_secret is step-level only: the backend reads it from each command
  // step's checkout and never from the pipeline-level block.
  it("should reject pipeline-level checkout.ssh_secret", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { ssh_secret: "github_readonly" },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept pipeline-level checkout alongside step-level ssh_secret", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { depth: 10 },
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "github_readonly" } },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.ssh_secret with an empty string", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { ssh_secret: "" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept checkout.ssh_secret with other checkout properties", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { ssh_secret: "github_readonly", depth: 10 },
        },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept checkout.ssh_secret with underscores", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "my_ssh_key_123" } },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.ssh_secret containing dashes", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "deploy-key" } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.ssh_secret containing dots", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "deploy.key" } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.ssh_secret containing spaces", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "deploy key" } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.ssh_secret starting with 'buildkite'", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "buildkite_key" } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.ssh_secret starting with 'BUILDKITE' (uppercase)", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "BUILDKITE_KEY" } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.ssh_secret starting with 'Buildkite' (mixed case)", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "Buildkite_thing" } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.ssh_secret starting with 'bk'", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { ssh_secret: "bk_key" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.ssh_secret starting with 'BK' (uppercase)", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { ssh_secret: "BK_secret" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.ssh_secret starting with 'Bk' (mixed case)", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { ssh_secret: "Bk_thing" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept checkout.ssh_secret containing 'bk' not as a prefix", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { ssh_secret: "my_bk_key" } }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept checkout.ssh_secret containing 'buildkite' not as a prefix", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { ssh_secret: "my_buildkite_thing" },
        },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.ssh_secret starting with a digit", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "1deploy_key" } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.ssh_secret starting with an underscore", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "_deploy_key" } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept checkout.ssh_secret with digits after the leading letter", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { ssh_secret: "key_2024" } }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept checkout.ssh_secret at the 255-character maxLength", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "a".repeat(255) } },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.ssh_secret exceeding the 255-character maxLength", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { ssh_secret: "a".repeat(256) } },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.ssh_secret with a non-string value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { ssh_secret: 123 } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should validate checkout.ssh_secret examples against the schema", function () {
    const ajv = new Ajv({ allErrors: true });
    const sshSecretSchema = schema.definitions.checkout.properties.ssh_secret;
    const v = ajv.compile(sshSecretSchema);
    for (const example of sshSecretSchema.examples) {
      expect(v(example), JSON.stringify(example)).to.eql(true);
    }
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

  it("should accept checkout.commit_verification with 'off'", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { commit_verification: "off" } },
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

  it("should validate checkout examples against the schema", function () {
    const ajv = new Ajv({ allErrors: true });
    const checkoutProperties = schema.definitions.checkout.properties;
    // Subschemas are compiled standalone, so carry the document's definitions
    // along to keep any #/definitions/... refs resolvable.
    for (const [key, subSchema] of Object.entries(checkoutProperties)) {
      const v = ajv.compile({ ...subSchema, definitions: schema.definitions });
      for (const example of subSchema.examples || []) {
        expect(v(example), `${key}: ${JSON.stringify(example)}`).to.eql(true);
      }
      if (subSchema.properties) {
        for (const [nestedKey, nestedSchema] of Object.entries(
          subSchema.properties,
        )) {
          const vNested = ajv.compile({
            ...nestedSchema,
            definitions: schema.definitions,
          });
          for (const example of nestedSchema.examples || []) {
            expect(
              vNested(example),
              `${key}.${nestedKey}: ${JSON.stringify(example)}`,
            ).to.eql(true);
          }
        }
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

  it("should accept checkout.lfs as an explicit null", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { lfs: null } }],
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

  it("should reject checkout.sparse without paths", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { sparse: {} } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject non-object checkout.sparse", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { sparse: "src/" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with an empty paths array", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { sparse: { paths: [] } } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept checkout.sparse with a single path string", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        { command: "echo hello", checkout: { sparse: { paths: "src/" } } },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject checkout.sparse with a non-string, non-array paths value", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { sparse: { paths: 42 } } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with an empty single path string", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { sparse: { paths: "" } } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with a leading-dash single path string", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: "--no-cone" } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with non-string path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { sparse: { paths: [42] } } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with empty-string path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello", checkout: { sparse: { paths: [""] } } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with leading-dash path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["--no-cone"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  // The agent trims surrounding whitespace before passing paths to git, so a
  // leading space would let a "-flag" slip past the leading-dash guard.
  it("should reject checkout.sparse with leading-whitespace path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: [" --no-cone"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with trailing-whitespace path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["src/ "] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  // Go's strings.TrimSpace trims Unicode whitespace, not just ASCII spaces, so
  // any trimmed edge character could otherwise expose a leading "-flag" to git.
  it("should reject checkout.sparse with leading no-break-space path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const noBreakSpace = String.fromCharCode(0x00a0);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: [noBreakSpace + "--no-cone"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with leading thin-space path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const thinSpace = String.fromCharCode(0x2009);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: [thinSpace + "--no-cone"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with trailing ideographic-space path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const ideographicSpace = String.fromCharCode(0x3000);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["src/" + ideographicSpace] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with commas in path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["src,docs"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with newlines in path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["src\ndocs"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with carriage returns in path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["src\rdocs"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  // Control whitespace is banned everywhere, not just at the edges: the agent
  // trims with Go's unicode.IsSpace (which strips tab/VT/FF), so an internal
  // tab is never a real directory name and could mask a "-flag" once trimmed.
  it("should reject checkout.sparse with tab characters in path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["src\tdocs"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject checkout.sparse with duplicate path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["src/", "src/"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept checkout.sparse with paths", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["src/", "docs/"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept checkout.sparse with internal spaces in path items", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["my dir/"] } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept pipeline-level checkout.sparse", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { sparse: { paths: ["src/"] } },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject pipeline-level checkout.sparse without paths", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      checkout: { sparse: {} },
      steps: [{ command: "echo hello" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept checkout.sparse on a nested command step", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: {
            command: "echo hello",
            checkout: { sparse: { paths: ["src/"] } },
          },
        },
      ],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject unknown checkout.sparse properties", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [
        {
          command: "echo hello",
          checkout: { sparse: { paths: ["src/"], unknown: true } },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject an empty slack channel string", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [{ slack: "" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject a slack channel containing whitespace", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [{ slack: "team #general" }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject an empty string in a slack channels array", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [{ slack: { channels: [""] } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject an empty slack channels array", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [{ slack: { channels: [] } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject a slack object with no channels property", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [{ slack: { message: "CI announcement" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept a valid slack channel", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [{ slack: "team#general" }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should accept a slack channel using an interpolation expression", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [{ slack: "${SLACK_CHANNEL}" }],
    };
    expect(v(pipeline)).to.eql(true);
  });

  it("should reject a github_check with an unknown property", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [{ github_check: { foo: "bar" } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject a github_check output with an unknown property", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [{ github_check: { output: { bogus_field: "x" } } }],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject a github_check annotation with an invalid annotation_level", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [
        {
          github_check: {
            output: {
              annotations: [
                {
                  path: "src/main.js",
                  start_line: 1,
                  end_line: 1,
                  annotation_level: "critical",
                  message: "bad level",
                },
              ],
            },
          },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should reject a github_check annotation missing required fields", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [
        {
          github_check: {
            output: {
              annotations: [{ path: "src/main.js" }],
            },
          },
        },
      ],
    };
    expect(v(pipeline)).to.eql(false);
  });

  it("should accept a valid github_check with if", function () {
    const ajv = new Ajv({ allErrors: true });
    const v = ajv.compile(schema);
    const pipeline = {
      steps: [{ command: "echo hello" }],
      notify: [
        {
          github_check: { name: "My Check" },
          if: "build.state == 'failed'",
        },
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

  // Buildkite's schema checker uses Go's regexp (RE2), which rejects lookaround.
  // ajv (used here) accepts it, so guard against reintroducing patterns RE2 can't compile.
  it("should not use regex lookaround in any pattern", function () {
    const lookaround = /\(\?(=|!|<=|<!)/;
    const offending = [];
    const walk = (node) => {
      if (Array.isArray(node)) {
        node.forEach(walk);
      } else if (node && typeof node === "object") {
        for (const [key, value] of Object.entries(node)) {
          if (key === "pattern" && typeof value === "string") {
            if (lookaround.test(value)) offending.push(value);
          }
          walk(value);
        }
      }
    };
    walk(schema);
    expect(offending).to.eql([]);
  });

  // RE2's \s is only [\t\n\f\r ], but ajv's (ECMA) \s also matches \v and many
  // Unicode spaces, so a \s in a pattern validates differently across the two
  // engines. Use explicit character classes instead. (\d, \w and friends are
  // ASCII in both engines, so only \s/\S diverge.)
  it("should not use \\s or \\S in any pattern", function () {
    const divergentClass = /\\[sS]/;
    const offending = [];
    const walk = (node) => {
      if (Array.isArray(node)) {
        node.forEach(walk);
      } else if (node && typeof node === "object") {
        for (const [key, value] of Object.entries(node)) {
          if (key === "pattern" && typeof value === "string") {
            if (divergentClass.test(value)) offending.push(value);
          }
          walk(value);
        }
      }
    };
    walk(schema);
    expect(offending).to.eql([]);
  });
});
