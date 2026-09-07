from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException, status

from app.schemas import (
    RequestAssignmentUpdate,
    RequestStatus,
    RequestStatusUpdate,
    SupportRequestCreate,
    SupportRequestResponse,
    CommentCreate,
    CommentResponse,
    StatusHistoryResponse,
)

router = APIRouter(
    prefix="/requests",
    tags=["Requests"]
)

support_requests_db: List[SupportRequestResponse] = []
next_request_id = 1
comments_db: List[CommentResponse] = []
next_comment_id = 1
status_history_db: List[StatusHistoryResponse] = []
next_history_id = 1

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
    global next_history_id

    for request in support_requests_db:
        if request.request_id == request_id:
            old_status = request.status

            request.status = status_update.status
            request.updated_at = datetime.now(timezone.utc)

            history = StatusHistoryResponse(
                history_id=next_history_id,
                request_id=request_id,
                old_status=old_status,
                new_status=status_update.status,
                changed_at=request.updated_at,
            )

            status_history_db.append(history)
            next_history_id += 1

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
@router.post(
    "/{request_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED
)
def add_comment(request_id: int, comment: CommentCreate):
    global next_comment_id

    request_exists = any(
        request.request_id == request_id
        for request in support_requests_db
    )

    if not request_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    new_comment = CommentResponse(
        comment_id=next_comment_id,
        request_id=request_id,
        author=comment.author,
        message=comment.message,
        created_at=datetime.now(timezone.utc),
    )

    comments_db.append(new_comment)
    next_comment_id += 1

    return new_comment


@router.get(
    "/{request_id}/comments",
    response_model=List[CommentResponse]
)
def get_request_comments(request_id: int):
    request_exists = any(
        request.request_id == request_id
        for request in support_requests_db
    )

    if not request_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    return [
        comment
        for comment in comments_db
        if comment.request_id == request_id
    ]
@router.get(
    "/{request_id}/history",
    response_model=List[StatusHistoryResponse]
)
def get_request_status_history(request_id: int):
    request_exists = any(
        request.request_id == request_id
        for request in support_requests_db
    )

    if not request_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    return [
        history
        for history in status_history_db
        if history.request_id == request_id
    ]