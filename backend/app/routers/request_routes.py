from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException, status

from app.schemas import (
    RequestAssignmentUpdate,
    RequestStatus,
    RequestStatusUpdate,
    SupportRequestCreate,
    SupportRequestResponse,
)

router = APIRouter(
    prefix="/requests",
    tags=["Requests"]
)

support_requests_db: List[SupportRequestResponse] = []
next_request_id = 1


@router.post(
    "/",
    response_model=SupportRequestResponse,
    status_code=status.HTTP_201_CREATED
)
def create_request(request: SupportRequestCreate):
    global next_request_id

    current_time = datetime.now(timezone.utc)

    new_request = SupportRequestResponse(
        request_id=next_request_id,
        title=request.title,
        description=request.description,
        category=request.category,
        priority=request.priority,
        created_by=request.created_by,
        status=RequestStatus.new,
        assigned_to=None,
        created_at=current_time,
        updated_at=current_time,
    )

    support_requests_db.append(new_request)
    next_request_id += 1

    return new_request


@router.get("/", response_model=List[SupportRequestResponse])
def get_all_requests():
    return support_requests_db


@router.get("/{request_id}", response_model=SupportRequestResponse)
def get_request_by_id(request_id: int):
    for request in support_requests_db:
        if request.request_id == request_id:
            return request

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Request not found"
    )


@router.put("/{request_id}/status", response_model=SupportRequestResponse)
def update_request_status(request_id: int, status_update: RequestStatusUpdate):
    for request in support_requests_db:
        if request.request_id == request_id:
            request.status = status_update.status
            request.updated_at = datetime.now(timezone.utc)
            return request

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Request not found"
    )


@router.put("/{request_id}/assign", response_model=SupportRequestResponse)
def assign_request(request_id: int, assignment: RequestAssignmentUpdate):
    for request in support_requests_db:
        if request.request_id == request_id:
            request.assigned_to = assignment.assigned_to

            if assignment.priority:
                request.priority = assignment.priority

            request.status = RequestStatus.assigned
            request.updated_at = datetime.now(timezone.utc)
            return request

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Request not found"
    )