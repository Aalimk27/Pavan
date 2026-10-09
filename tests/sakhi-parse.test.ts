import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDate, parseHomeNumber, parseTime, parseVerseRef, saysTimeUnknown } from "../src/lib/sakhi/parse.ts";

test("dates in the forms people actually type", () => {
  assert.deepEqual(parseDate("born 14 March 1990"), { year: 1990, month: 3, day: 14 });
  assert.deepEqual(parseDate("March 14th, 1990"), { year: 1990, month: 3, day: 14 });
  assert.deepEqual(parseDate("1990-03-14"), { year: 1990, month: 3, day: 14 });
  assert.deepEqual(parseDate("29/11/1985"), { year: 1985, month: 11, day: 29 });
  assert.deepEqual(parseDate("11/29/1985"), { year: 1985, month: 11, day: 29 });
  assert.deepEqual(parseDate("03/04/2001"), { year: 2001, month: 4, day: 3, assumedDayFirst: true });
  assert.equal(parseDate("31/02/2001"), null);
  assert.equal(parseDate("hello"), null);
});

test("times", () => {
  assert.deepEqual(parseTime("at 10:30 pm"), { hour: 22, minute: 30 });
  assert.deepEqual(parseTime("7am"), { hour: 7, minute: 0 });
  assert.deepEqual(parseTime("12:15 am"), { hour: 0, minute: 15 });
  assert.deepEqual(parseTime("22:05"), { hour: 22, minute: 5 });
  assert.deepEqual(parseTime("noon"), { hour: 12, minute: 0 });
  assert.equal(parseTime("14/03/1990"), null);
  assert.equal(saysTimeUnknown("I don't know my birth time"), true);
});

test("home numbers and verse references", () => {
  assert.equal(parseHomeNumber("my house number is 607"), "607");
  assert.equal(parseHomeNumber("flat B-1204 in Pune"), "B-1204");
  assert.equal(parseVerseRef("show me gita 2.47"), "2.47");
  assert.equal(parseVerseRef("chapter 6 verse 5"), "6.5");
});
