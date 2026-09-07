from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import (
    CommentCreate,
    CommentResponse,
    RequestAssignmentUpdate,
    RequestStatus,
    RequestStatusUpdate,
    StatusHistoryResponse,
    SupportRequestCreate,
    SupportRequestResponse,
)


router = APIRouter(
    prefix="/requests",
    tags=["Requests"]
)


@router.post(
    "/",
    response_model=SupportRequestResponse,
    status_code=status.HTTP_201_CREATED
)
def create_request(
    request: SupportRequestCreate,
    db: Session = Depends(get_db)
):
    current_time = datetime.now(timezone.utc)

    new_request = models.SupportRequest(
        title=request.title,
        description=request.description,
        category=request.category,
        priority=request.priority.value,
        created_by=request.created_by,
        status=RequestStatus.new.value,
        assigned_to=None,
        created_at=current_time,
        updated_at=current_time,
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request


@router.get("/", response_model=List[SupportRequestResponse])
def get_all_requests(
    db: Session = Depends(get_db)
):
    requests = db.scalars(
        select(models.SupportRequest)
        .order_by(models.SupportRequest.request_id)
    ).all()

    return requests


@router.get(
    "/{request_id}",
    response_model=SupportRequestResponse
)
def get_request_by_id(
    request_id: int,
    db: Session = Depends(get_db)
):
    request = db.get(models.SupportRequest, request_id)

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    return request


@router.put(
    "/{request_id}/status",
    response_model=SupportRequestResponse
)
def update_request_status(
    request_id: int,
    status_update: RequestStatusUpdate,
    db: Session = Depends(get_db)
):
    request = db.get(models.SupportRequest, request_id)

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    old_status = request.status
    new_status = status_update.status.value
    current_time = datetime.now(timezone.utc)

    request.status = new_status
    request.updated_at = current_time

    if old_status != new_status:
        history = models.StatusHistory(
            request_id=request_id,
            old_status=old_status,
            new_status=new_status,
            changed_at=current_time,
        )

        db.add(history)

    db.commit()
    db.refresh(request)

    return request


@router.put(
    "/{request_id}/assign",
    response_model=SupportRequestResponse
)
def assign_request(
    request_id: int,
    assignment: RequestAssignmentUpdate,
    db: Session = Depends(get_db)
):
    request = db.get(models.SupportRequest, request_id)

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    old_status = request.status
    current_time = datetime.now(timezone.utc)

    request.assigned_to = assignment.assigned_to

    if assignment.priority is not None:
        request.priority = assignment.priority.value

    request.status = RequestStatus.assigned.value
    request.updated_at = current_time

    if old_status != RequestStatus.assigned.value:
        history = models.StatusHistory(
            request_id=request_id,
            old_status=old_status,
            new_status=RequestStatus.assigned.value,
            changed_at=current_time,
        )

        db.add(history)

    db.commit()
    db.refresh(request)

    return request


@router.post(
    "/{request_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED
)
def add_comment(
    request_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db)
):
    request = db.get(models.SupportRequest, request_id)

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    new_comment = models.Comment(
        request_id=request_id,
        author=comment.author,
        message=comment.message,
        created_at=datetime.now(timezone.utc),
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment


@router.get(
    "/{request_id}/comments",
    response_model=List[CommentResponse]
)
def get_request_comments(
    request_id: int,
    db: Session = Depends(get_db)
):
    request = db.get(models.SupportRequest, request_id)

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    comments = db.scalars(
        select(models.Comment)
        .where(models.Comment.request_id == request_id)
        .order_by(models.Comment.comment_id)
    ).all()

    return comments


@router.get(
    "/{request_id}/history",
    response_model=List[StatusHistoryResponse]
)
def get_request_status_history(
    request_id: int,
    db: Session = Depends(get_db)
):
    request = db.get(models.SupportRequest, request_id)

    if request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )

    history = db.scalars(
        select(models.StatusHistory)
        .where(models.StatusHistory.request_id == request_id)
        .order_by(models.StatusHistory.history_id)
    ).all()

    return history