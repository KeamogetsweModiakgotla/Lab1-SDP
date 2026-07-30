import "server-only";
import Database from "better-sqlite3";
import { STATUSES } from "./constants";


const db = new Database("tasks.db");

const statusList = STATUSES.map((s) => `'${s}'`).join(", ");


db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT,
    dueDate    TEXT,
    topic       TEXT,
    status      TEXT NOT NULL DEFAULT 'todo'
                CHECK (status IN (${statusList}))
  )
`);

export const getTasks = () =>
  db.prepare(`
    SELECT id, title, description, dueDate, topic, status
    FROM tasks
    ORDER BY id
  `).all();

export const addTask = (title, description, dueDate, topic, status) =>
  db.prepare(`
    INSERT INTO tasks (title, description, dueDate, topic, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, description, dueDate, topic, status);


export default db;

