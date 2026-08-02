import { NextResponse } from "next/server";
import { updateTask, setArchived } from "@/lib/db";
import { STATUSES } from "@/lib/constants";


export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  if (typeof body.archived === "boolean") {
    const result = setArchived(Number(id), body.archived ? 1 : 0);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  }
  const { title, description, dueDate, topic, status } = body;

  if (!title?.trim())       return NextResponse.json({ error: "Title is required" }, { status: 400 });
  
  if (!dueDate?.trim()) {
    return NextResponse.json({ error: "Due date is required" }, { status: 400 });
  }
  if (!topic?.trim()) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }
  if (status && !STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const result = updateTask(
    Number(id),
    title.trim(),
    description.trim(),
    dueDate.trim(),
    topic.trim(),
    status ?? "todo"
  );

  if (result.changes === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}