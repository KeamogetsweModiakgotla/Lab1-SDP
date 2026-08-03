
import Database from "better-sqlite3";
import { STATUSES } from "./constants.js";


const db = new Database(process.env.TASKS_DB ?? "tasks.db");

const statusList = STATUSES.map((s) => `'${s}'`).join(", ");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT,
    dueDate    TEXT NOT NULL,
    topic       TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'todo'
                CHECK (status IN (${statusList})),
    archived    INTEGER NOT NULL DEFAULT 0            
  )
`);

const SORTS = {
  dueDate: "dueDate",
  topic: "topic",
  status: "CASE status WHEN 'todo' THEN 1 WHEN 'in-progress' THEN 2 ELSE 3 END",
};

export const getTasks = (sort = "dueDate") =>
  db.prepare(`
    SELECT id, title, description, dueDate, topic, status, archived
    FROM tasks
    ORDER BY ${SORTS[sort] ?? SORTS.dueDate}
  `).all();  


export const addTask = (title, description, dueDate, topic, status) =>
  db.prepare(`
    INSERT INTO tasks (title, description, dueDate, topic, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, description, dueDate, topic, status);

  export const updateTask = (id, title, description, dueDate, topic, status) =>
  db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, dueDate = ?, topic = ?, status = ?
    WHERE id = ?
  `).run(title, description, dueDate, topic, status, id);

  export const setArchived = (id, archived) =>
  db.prepare("UPDATE tasks SET archived = ? WHERE id = ?").run(archived,id);

  

export default db;

