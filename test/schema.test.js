import { expect, test } from "vitest";
import Ajv from "ajv";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

import schema from "../schema.json";

test.each([
  ["block steps", "block.yml"],
  ["input steps", "input.yml"],
  ["command steps", "command.yml"],
  ["env blocks", "env.yml"],
  ["blocks with extra properties", "extra-properties.yml"],
  ["step groups", "group.yml"],
  ["trigger steps", "trigger.yml"],
  ["wait steps", "wait.yml"],
  ["notify", "notify.yml"],
  ["matrix", "matrix.yml"],
])("should validate %s", async (label, file) => {
  const ajv = new Ajv({ allErrors: true });

  const result = await ajv.validate(schema, await loadFixture(file));

  expect(ajv.errorsText()).to.equal("No errors");
  expect(result).to.equal(true);
});

async function loadFixture(filename) {
  const file = await fs.promises.readFile(
    path.resolve("test/valid-pipelines/", filename),
    "utf8",
  );

  return yaml.load(file);
}
