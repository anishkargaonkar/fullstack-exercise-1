import json
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import get_db

router = APIRouter(prefix="/tasks", tags=["tasks"])


class TaskCreate(BaseModel):
    title: str
    status: str
    priority: str = "normal"
    due_date: Optional[str] = None
    assignees: Optional[list[str]] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    assignees: Optional[list[str]] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    status: str
    priority: str
    due_date: Optional[str]
    assignees: Optional[list[str]]
    created_at: str
    updated_at: str


def row_to_task(row) -> dict:
    """Convert a database row to a task dict, parsing JSON assignees."""
    return {
        "id": row["id"],
        "title": row["title"],
        "status": row["status"],
        "priority": row["priority"],
        "due_date": row["due_date"],
        "assignees": json.loads(row["assignees"]) if row["assignees"] else None,
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }


@router.get("")
def list_tasks():
    """
    List all tasks from the database.
    Uses raw SQL query (no ORM).
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT id, title, status, priority, due_date, assignees, created_at, updated_at
                FROM tasks
                ORDER BY id
                """
            )
            rows = cursor.fetchall()
            tasks = [row_to_task(row) for row in rows]
            return {"tasks": tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{task_id}")
def get_task(task_id: int):
    """
    Get a single task by ID.
    Uses raw SQL query (no ORM).
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT id, title, status, priority, due_date, assignees, created_at, updated_at
                FROM tasks
                WHERE id = ?
                """,
                (task_id,),
            )
            row = cursor.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Task not found")
            return row_to_task(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("", status_code=201)
def create_task(task: TaskCreate):
    """
    Create a new task.
    Uses raw SQL query (no ORM).
    """
    try:
        # Validate status
        valid_statuses = ["pending", "in_progress", "completed", "launched"]
        if task.status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
            )

        # Validate priority
        valid_priorities = ["normal", "high"]
        if task.priority not in valid_priorities:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid priority. Must be one of: {', '.join(valid_priorities)}",
            )

        # Convert assignees list to JSON string
        assignees_json = json.dumps(task.assignees) if task.assignees else None

        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO tasks (title, status, priority, due_date, assignees)
                VALUES (?, ?, ?, ?, ?)
                """,
                (task.title, task.status, task.priority, task.due_date, assignees_json),
            )
            task_id = cursor.lastrowid

            # Fetch the created task to return with timestamps
            cursor.execute(
                """
                SELECT id, title, status, priority, due_date, assignees, created_at, updated_at
                FROM tasks
                WHERE id = ?
                """,
                (task_id,),
            )
            row = cursor.fetchone()
            return row_to_task(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.put("/{task_id}")
def update_task(task_id: int, task: TaskUpdate):
    """
    Update an existing task (partial updates supported).
    Uses raw SQL query (no ORM).
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()

            # Check if task exists
            cursor.execute("SELECT id FROM tasks WHERE id = ?", (task_id,))
            if cursor.fetchone() is None:
                raise HTTPException(status_code=404, detail="Task not found")

            # Build dynamic UPDATE query for partial updates
            update_fields = []
            values = []

            if task.title is not None:
                update_fields.append("title = ?")
                values.append(task.title)

            if task.status is not None:
                # Validate status
                valid_statuses = ["pending", "in_progress", "completed", "launched"]
                if task.status not in valid_statuses:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
                    )
                update_fields.append("status = ?")
                values.append(task.status)

            if task.priority is not None:
                # Validate priority
                valid_priorities = ["normal", "high"]
                if task.priority not in valid_priorities:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid priority. Must be one of: {', '.join(valid_priorities)}",
                    )
                update_fields.append("priority = ?")
                values.append(task.priority)

            if task.due_date is not None:
                update_fields.append("due_date = ?")
                values.append(task.due_date)

            if task.assignees is not None:
                update_fields.append("assignees = ?")
                assignees_json = json.dumps(task.assignees) if task.assignees else None
                values.append(assignees_json)

            if not update_fields:
                raise HTTPException(
                    status_code=400, detail="No fields provided for update"
                )

            # Always update the updated_at timestamp
            update_fields.append("updated_at = ?")
            values.append(datetime.utcnow().isoformat())

            # Add task_id to values for WHERE clause
            values.append(task_id)

            query = f"UPDATE tasks SET {', '.join(update_fields)} WHERE id = ?"
            cursor.execute(query, values)

            # Fetch and return the updated task
            cursor.execute(
                """
                SELECT id, title, status, priority, due_date, assignees, created_at, updated_at
                FROM tasks
                WHERE id = ?
                """,
                (task_id,),
            )
            row = cursor.fetchone()
            return row_to_task(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int):
    """
    Delete a task.
    Uses raw SQL query (no ORM).
    """
    try:
        with get_db() as conn:
            cursor = conn.cursor()

            # Check if task exists
            cursor.execute("SELECT id FROM tasks WHERE id = ?", (task_id,))
            if cursor.fetchone() is None:
                raise HTTPException(status_code=404, detail="Task not found")

            # Delete the task
            cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
            return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
