from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SupportRequest(Base):
    __tablename__ = "support_requests"

    request_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    category: Mapped[str] = mapped_column(
        String(100),
        default="General",
        nullable=False
    )

    priority: Mapped[str] = mapped_column(
        String(20),
        default="Medium",
        nullable=False
    )

    created_by: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="New",
        nullable=False
    )

    assigned_to: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


class Comment(Base):
    __tablename__ = "comments"

    comment_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    request_id: Mapped[int] = mapped_column(
        ForeignKey("support_requests.request_id", ondelete="CASCADE"),
        nullable=False
    )

    author: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )


class StatusHistory(Base):
    __tablename__ = "status_history"

    history_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    request_id: Mapped[int] = mapped_column(
        ForeignKey("support_requests.request_id", ondelete="CASCADE"),
        nullable=False
    )

    old_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    new_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )