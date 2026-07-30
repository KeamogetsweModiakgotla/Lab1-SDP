"use client";

import styles from "./page.module.css";
import { useState, useRef } from "react";

export default function Home() {
  const tasks = [
    {
      id: 1,
      title: "Analysis assignment",
      description: "coms 3 subject",
      dueDate: "2026-07-31",
      topic: "fractals",
      status: "complete",
    },
  ];
  const [currTasks, setCurrTasks] = useState(tasks);
  const [currTitle, setTitle] = useState("");
  const [currDescription, setDescription] = useState("");
  const [currDueDate, setDueDate] = useState("");
  const [currTopic, setTopic] = useState("");
  const [currStatus, setStatus] = useState("todo");
  const STATUSES = ["todo", "in-progress", "complete"];

  const dialogRef = useRef(null);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>My Study Tasks.</h1>

          <ul>
            {currTasks.map((task) => (
              <li key={task.id}>
                <details>
                  <summary>{task.title}</summary>
                  <p>{task.description} </p>
                  <p>Due: {task.dueDate}</p>
                  <p>Topic: {task.topic}</p>
                  <p>Status:{task.status}</p>
                </details>
              </li>
            ))}
          </ul>

          <button onClick={() => dialogRef.current.showModal()}>Create </button>
          <dialog ref={dialogRef} className={styles.dialog}>
            <h2>New Task</h2>
            {/* fields */}
            <label>Title: </label>
            <input
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              value={currTitle}
            />
            <label>Description: </label>
            <input
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              value={currDescription}
            />
            <label>Due date: </label>
            <input
              onChange={(event) => {
                setDueDate(event.target.value);
              }}
              value={currDueDate}
              type="date"
            />
            <label>Topic: </label>
            <input
              onChange={(event) => {
                setTopic(event.target.value);
              }}
              value={currTopic}
            />
            <label>Status:</label>

            {STATUSES.map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={currStatus === s}
                  onChange={(e) => setStatus(e.target.value)}
                />
                {s}
              </label>
            ))}
            <button
              onClick={() => {
                if (currTitle.trim() !== "" && currDescription.trim()!=="" && currDueDate.trim()!=="" && currTopic.trim()!=="") {
                  setCurrTasks([
                    ...currTasks,
                    {
                      id: currTasks.length + 1,
                      title: currTitle,
                      description: currDescription,
                      dueDate: currDueDate,
                      topic: currTopic,
                      status: currStatus,
                    },
                  ]);
                  setTitle("");
                  setDescription("");
                  setDueDate("");
                  setTopic("");
                  setStatus("todo");
                  dialogRef.current.close();
                }
              }}
            >
              {" "}
              Add Task{" "}
            </button>
            <button onClick={() => dialogRef.current.close()}>Cancel</button>
          </dialog>
        </div>
      </main>
    </div>
  );
}
