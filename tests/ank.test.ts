import { test } from "node:test";
import assert from "node:assert/strict";
import { bhagyaAnk, homeNumber, mulank, isValidDate } from "../src/lib/ank.ts";

test("Blueprint example: 607 → Compound 13 / Root 4", () => {
  const r = homeNumber("607");
  assert.equal(r.compound, 13);
  assert.equal(r.root, 4);
  assert.deepEqual(r.chain, [13, 4]);
});

test("Home number ignores letters and prefixes but keeps digits", () => {
  const r = homeNumber("B-1204");
  assert.deepEqual(r.digits, [1, 2, 0, 4]);
  assert.equal(r.root, 7);
  assert.equal(r.ignored, "B-");
});

test("Mulank from day of birth", () => {
  assert.equal(mulank(29).compound, 11);
  assert.equal(mulank(29).root, 2);
  assert.equal(mulank(7).root, 7);
  assert.equal(mulank(19).root, 1);
  assert.throws(() => mulank(32));
});

test("Bhagya Ank from the full date", () => {
  const r = bhagyaAnk(1990, 3, 14); // 1+4+3+1+9+9+0 = 27 → 9
  assert.equal(r.compound, 27);
  assert.equal(r.root, 9);
  assert.throws(() => bhagyaAnk(2023, 2, 29));
});

test("Calendar validation", () => {
  assert.equal(isValidDate(2024, 2, 29), true);
  assert.equal(isValidDate(2023, 2, 29), false);
  assert.equal(isValidDate(2023, 4, 31), false);
});
