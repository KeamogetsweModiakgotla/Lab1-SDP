import { test, after } from "node:test";
import assert from "node:assert/strict";
import { rmSync } from "node:fs";

const TEST_DB = "test-tasks.db";
process.env.TASKS_DB = TEST_DB;


const dbModule = await import("../lib/db.js");
const { addTask, getTasks, setArchived } = dbModule;
const db = dbModule.default;

after(() => {
  db.close();
  rmSync(TEST_DB, { force: true });
});

test("a created task is returned by getTasks", () => {
  addTask("Read chapter 3", "notes", "2026-08-10", "maths", "todo");
  const tasks = getTasks();
  const found = tasks.find((t) => t.title === "Read chapter 3");

  assert.ok(found);
  assert.equal(found.topic, "maths");
  assert.equal(found.status, "todo");
  assert.equal(found.archived, 0);
});

test("archiving flags a task without removing it", () => {
  const { lastInsertRowid: id } = addTask(
    "Lab report", "", "2026-08-12", "chem", "todo"
  );

  setArchived(id, 1);

  const archived = getTasks().find((t) => t.id === id);
  assert.ok(archived, "task should still exist after archiving");
  assert.equal(archived.archived, 1);

  setArchived(id, 0);
  assert.equal(getTasks().find((t) => t.id === id).archived, 0);
});

test("an invalid status is rejected by the schema", () => {
  assert.throws(() =>
    addTask("Bad", "", "2026-08-15", "test", "done")
  );
});