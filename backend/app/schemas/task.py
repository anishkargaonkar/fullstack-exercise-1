from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    status: str = Field(..., pattern="^(pending|in_progress|completed|launched)$")
    priority: str = Field(default="normal", pattern="^(normal|high)$")
    due_date: Optional[str] = None
    assignees: List[str] = Field(default_factory=list)


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    priority: str = Field(default="normal", pattern="^(normal|high)$")
    due_date: Optional[str] = None
    assignees: List[str] = Field(default_factory=list)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    status: Optional[str] = Field(None, pattern="^(pending|in_progress|completed|launched)$")
    priority: Optional[str] = Field(None, pattern="^(normal|high)$")
    due_date: Optional[str] = None
    assignees: Optional[List[str]] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    status: str
    priority: str
    due_date: Optional[str]
    assignees: List[str]
    created_at: str
    updated_at: str
