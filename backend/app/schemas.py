from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class RequestStatus(str, Enum):
    new = "New"
    in_review = "In Review"
    assigned = "Assigned"
    in_progress = "In Progress"
    more_info_required = "More Info Required"
    resolved = "Resolved"
    closed = "Closed"


class RequestPriority(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    urgent = "Urgent"


class SupportRequestCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    description: str = Field(..., min_length=10)
    category: str = Field(default="General", max_length=100)
    priority: RequestPriority = RequestPriority.medium
    created_by: str = Field(..., min_length=2, max_length=100)


class SupportRequestResponse(SupportRequestCreate):
    request_id: int
    status: RequestStatus
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class RequestStatusUpdate(BaseModel):
    status: RequestStatus


class RequestAssignmentUpdate(BaseModel):
    assigned_to: str = Field(..., min_length=2, max_length=100)
    priority: Optional[RequestPriority] = None