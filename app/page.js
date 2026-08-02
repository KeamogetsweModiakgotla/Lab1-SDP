"use client";

import styles from "./page.module.css";
import { STATUSES } from "@/lib/constants";
import { useState, useRef, useEffect } from "react";

const today = () => new Date().toISOString().slice(0, 10);  
  

export default function Home() {

  const [currTasks, setCurrTasks] = useState([]);
  const [currTitle, setTitle] = useState("");
  const [currDescription, setDescription] = useState("");
  const [currDueDate, setDueDate] = useState("");
  const [currTopic, setTopic] = useState("");
  const [currStatus, setStatus] = useState("todo");
  const [editingId, setEditingId] = useState(null);
  const [sort, setSort] = useState("dueDate");

  const dialogRef = useRef(null);


  

  useEffect(() => {
  fetch(`/api/tasks?sort=${sort}`)
    .then((r) => r.json())
    .then(setCurrTasks);
}, [sort]);

const activeTasks = currTasks.filter((t) => !t.archived);
const archivedTasks = currTasks.filter((t) => t.archived);

async function refresh() {
    const tasks = await fetch(`/api/tasks?sort=${sort}`).then((r) => r.json());
    setCurrTasks(tasks);
  }

  
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

    const res =
      editingId === null
        ? await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/tasks/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

    if (!res.ok) return;

    await refresh();
    dialogRef.current.close();
  }


  async function handleArchive(id,archived) {
  const res = await fetch(`/api/tasks/${id}`, { 
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({archived}), 
   });
  if (!res.ok) return;

  setCurrTasks(currTasks.map((t) => t.id === id ?
  {...t,archived: archived?1:0}:t));
}





function renderTask(task) {
  const isOverdue = !task.archived && task.status !== "complete" &&
    task.dueDate < today();
    return (
      <li key={task.id} className={task.archived ? styles.archived : ""}>
        <details>
          <summary>
            {task.title}
            {isOverdue && <span className={styles.overdue}> Overdue</span>}
            <span className={styles.spacer} />
            <button
              className={task.archived ? styles.unarchiveBtn : styles.archiveBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleArchive(task.id, !task.archived);
              }}
            >
              {task.archived ? "Unarchive" : "Archive"}
            </button>
          </summary>


          <div className={styles.details}>             
            {task.description &&<p>{task.description}</p>}
          <p><span className={styles.label}>Due:</span> {task.dueDate}</p>
          <p><span className={styles.label}>Topic:</span> {task.topic}</p>
          <p><span className={styles.label}>Status:</span> {task.status}</p>
          {!task.archived && (
            <button onClick={() => openEdit(task)}>Edit</button>
          )}
          </div>
        </details>
      </li>
    );
  }


  return (
    <div className={styles.page}>
      <main className={styles.main}>
          <h1>My Study Tasks.</h1>

          <div className={styles.sortRow}>

          <label htmlFor="sort">Sort by: </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="dueDate">Due date</option>
            <option value="topic">Topic</option>
            <option value="status">Status</option>
          </select>

          <span className={styles.spacer} />

        <button className={styles.primary} onClick={openCreate}>
        + New Task
        </button>
        </div>


        {activeTasks.length === 0 ? (
          <p className={styles.empty}>No tasks yet, create one to get started.</p>
        ) : (
          <ul>{activeTasks.map(renderTask)}</ul>
        )}

        

          {archivedTasks.length > 0 && (
            <>
              <h2>Archived Tasks</h2>
              <ul>{archivedTasks.map(renderTask)}</ul>
            </>
          )}

          <dialog ref={dialogRef} className={styles.dialog}>
            <h2>{editingId === null ? "New Task" : "Edit Task"}</h2>


            <label  htmlFor="title">Title: </label>
            <input
              id="title"
              value={currTitle}
              onChange={(e) => {setTitle(e.target.value); }} />
            <label  htmlFor="description">Description: </label>
            <input 
              id="description"
              value={currDescription}
              onChange={(e) => {setDescription(e.target.value);}} />
            <label  htmlFor="dueDate">dueDdate: </label>
            <input 
              id="dueDate"
              value={currDueDate}
              type="date"
              onChange={(e) => {setDueDate(e.target.value); }} />
            <label  htmlFor="topic">Topic: </label>
            <input 
              id= "topic"
              value={currTopic}
              onChange={(e) => {setTopic(e.target.value);}} />

            <label>Status:</label>
            <div className= {styles.radioGroup}>
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
            </div>

            <div className={styles.dialogActions}>
              <button onClick={() => dialogRef.current.close()}>Cancel</button>
              <button 
              className={styles.primary}
              onClick= {handleSubmit} 
              style={{ marginTop: 0 }}
              
              >{editingId=== null ?
            "Add Task" : "Save Changes"} </button>
            </div>
          </dialog>
        
      </main>
    </div>

  );
}
