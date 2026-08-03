import { test } from "node:test";
import assert from "node:assert/strict";
import { isOverdue } from "../lib/overdue.js";

const TODAY = "2026-08-02";

test("a past due date is overdue", () => {
  assert.equal(
    isOverdue({ dueDate: "2026-07-31", status: "todo", archived: 0 }, TODAY),
    true
  );
});

test("a task due today is not yet overdue", () => {
  assert.equal(
    isOverdue({ dueDate: TODAY, status: "todo", archived: 0 }, TODAY),
    false
  );
});

test("a completed task is never overdue", () => {
  assert.equal(
    isOverdue({ dueDate: "2026-07-01", status: "complete", archived: 0 }, TODAY),
    false
  );
});

test("an archived task is never overdue", () => {
  assert.equal(
    isOverdue({ dueDate: "2026-07-01", status: "todo", archived: 1 }, TODAY),
    false
  );
});