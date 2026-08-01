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
  const [editingId, setEditingId] = useState(null);


  const dialogRef = useRef(null);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setCurrTasks);
  }, []);

  function openCreate() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setTopic("");
    setStatus("todo");
    dialogRef.current.showModal();
  }

  function openEdit(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setTopic(task.topic);
    setStatus(task.status);
    dialogRef.current.showModal();
  }

  async function handleSubmit() {
    if (
      currTitle.trim() === "" ||
      currDueDate.trim() === "" ||
      currTopic.trim() === ""
    ) {
      return;
    }

    const payload = {
      title: currTitle,
      description: currDescription,
      dueDate: currDueDate,
      topic: currTopic,
      status: currStatus,
    };

    if (editingId === null) {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;

      const { id } = await res.json();
      setCurrTasks([...currTasks, { id, ...payload }]);
    } else {
      const res = await fetch(`/api/tasks/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return;

      setCurrTasks(
        currTasks.map((t) => (t.id === editingId ? { ...t, ...payload } : t))
      );
    }

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
                  <button onClick={() => openEdit(task)}>Edit</button>
                </details>
              </li>
            ))}
          </ul>

          <button onClick={openCreate}>Create </button>

          <dialog ref={dialogRef} className={styles.dialog}>
            <h2>{editingId === null ? "New Task" : "Edit Task"}</h2>


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
            <button onClick= {handleSubmit} >{editingId=== null ?
            "Add Task" : "Save Changes"} </button>
            <button onClick={() => dialogRef.current.close()}>Cancel</button>
          </dialog>
        </div>
      </main>
    </div>
  );
}
