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

  const activeTasks = currTasks.filter((t) => !t.archived);
  const archivedTasks = currTasks.filter((t) => t.archived);

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
      setCurrTasks([...currTasks, { id, ...payload, archived:0 }]);
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

  async function handleArchive(id,archived) {
  const res = await fetch(`/api/tasks/${id}`, { method: "PATCH",
   headers: {"Content-Type": "application/json"},
   body: JSON.stringify({archived}), 
   });
  if (!res.ok) return;

  setCurrTasks(currTasks.map((t) => t.id === id ?
  {...t,archived: archived?1:0}:t));
}

function renderTask(task) {
    return (
      <li key={task.id} className={task.archived ? styles.archived : ""}>
        <details>
          <summary>
            {task.title}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleArchive(task.id, !task.archived);
              }}
            >
              {task.archived ? "Unarchive" : "Archive"}
            </button>
          </summary>
          <p>{task.description}</p>
          <p>Due: {task.dueDate}</p>
          <p>Topic: {task.topic}</p>
          <p>Status: {task.status}</p>
          {!task.archived && (
            <button onClick={() => openEdit(task)}>Edit</button>
          )}
        </details>
      </li>
    );
  }


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>My Study Tasks.</h1>

          <ul>{activeTasks.map(renderTask)}</ul>

          <button onClick={openCreate}>Create </button>

          {archivedTasks.length > 0 && (
            <>
              <h2>Archived Tasks</h2>
              <ul>{archivedTasks.map(renderTask)}</ul>
            </>
          )}

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
