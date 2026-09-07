from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app


test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
)

Base.metadata.create_all(bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def create_test_request():
    response = client.post(
        "/requests/",
        json={
            "title": "Test support request",
            "description": "This is a test support request.",
            "category": "Testing",
            "priority": "Medium",
            "created_by": "Test User",
        },
    )

    assert response.status_code == 201
    return response.json()


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy"
    }


def test_create_request():
    request = create_test_request()

    assert request["title"] == "Test support request"
    assert request["status"] == "New"
    assert request["priority"] == "Medium"


def test_update_request_status():
    request = create_test_request()
    request_id = request["request_id"]

    response = client.put(
        f"/requests/{request_id}/status",
        json={
            "status": "In Progress"
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "In Progress"

    history_response = client.get(
        f"/requests/{request_id}/history"
    )

    assert history_response.status_code == 200

    history = history_response.json()

    assert len(history) == 1
    assert history[0]["old_status"] == "New"
    assert history[0]["new_status"] == "In Progress"


def test_assign_request():
    request = create_test_request()
    request_id = request["request_id"]

    response = client.put(
        f"/requests/{request_id}/assign",
        json={
            "assigned_to": "Support Engineer",
            "priority": "High",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["assigned_to"] == "Support Engineer"
    assert data["priority"] == "High"
    assert data["status"] == "Assigned"


def test_add_and_get_comment():
    request = create_test_request()
    request_id = request["request_id"]

    response = client.post(
        f"/requests/{request_id}/comments",
        json={
            "author": "Test User",
            "message": "Issue reviewed successfully.",
        },
    )

    assert response.status_code == 201
    assert response.json()["author"] == "Test User"

    comments_response = client.get(
        f"/requests/{request_id}/comments"
    )

    assert comments_response.status_code == 200

    comments = comments_response.json()

    assert len(comments) == 1
    assert comments[0]["message"] == (
        "Issue reviewed successfully."
    )