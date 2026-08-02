import { NextResponse } from "next/server";
import { getTasks, addTask } from "@/lib/db";
import { STATUSES } from "@/lib/constants";

export async function GET(request) {
  const sort = request.nextUrl.searchParams.get("sort");
  return NextResponse.json(getTasks(sort));

}

export async function POST(request) {
  const body = await request.json();
  const { title, description, dueDate, topic, status } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!dueDate?.trim()) return NextResponse.json({ error: "Due date is required" }, { status: 400 });
  if (!topic?.trim())   return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  if (status && !STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

 

  const result = addTask(
    title.trim(),
    description.trim() ?? "",
    dueDate.trim() ?? "",
    topic.trim() ?? "",
    status ?? "todo"
  );

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

