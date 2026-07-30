"use client";

import styles from "./page.module.css";
import { STATUSES } from "@/lib/constants";
import { useState, useRef, useEffect } from "react";


export default function Home() {

  const [currTasks, setCurrTasks] = useState([]);
  const [currTitle, setTitle] = useState("");
  const [currDescription, setDescription] = useState("");
  const [currDueDate, setDueDate] = useState("");
  const [currTopic, setTopic] = useState("");
  const [currStatus, setStatus] = useState("todo");


  const dialogRef = useRef(null);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setCurrTasks);
  }, []);

  async function handleAdd() {
    if (currTitle.trim() === "") {
      return;
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: currTitle,
        description: currDescription,
        dueDate: currDueDate,
        topic: currTopic,
        status: currStatus,
      }),
    });

    if (!res.ok) return;

    const { id } = await res.json();
    setCurrTasks([
      ...currTasks,
      {
        id,
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
            <label>Title: </label>
            <input value={currTitle}
              onChange={(event) => {setTitle(event.target.value); }} />
            <label>Description: </label>
            <input value={currDescription}
              onChange={(event) => {setDescription(event.target.value);}} />
            <label>Due date: </label>
            <input value={currDueDate}
              type="date"
              onChange={(event) => {setDueDate(event.target.value); }} />
            <label>Topic: </label>
            <input value={currTopic}
              onChange={(event) => {setTopic(event.target.value);}} />
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
            <button onClick= {handleAdd} >Add Task </button>
            <button onClick={() => dialogRef.current.close()}>Cancel</button>
          </dialog>
        </div>
      </main>
    </div>
  );
}
