# Client Request & Support Workflow Platform

A full-stack support request management application where users can submit client support requests and support teams can assign, track, comment on, and resolve them.

## Live Application

Frontend:
https://client-support-frontend-p718.onrender.com

Backend API:
https://client-support-api.onrender.com

API Documentation:
https://client-support-api.onrender.com/docs

## Features

- Create support requests
- View all requests
- Assign requests to support engineers
- Update request status
- Set request priority
- Add and view comments
- Track status changes
- Dashboard showing total, active, resolved, and urgent requests
- PostgreSQL database persistence
- Backend API testing
- GitHub Actions CI
- Cloud deployment using Render

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic

### Database
- PostgreSQL

### Testing
- PyTest
- FastAPI TestClient

### DevOps / Cloud
- Git
- GitHub
- GitHub Actions
- Render

## Application Flow

User
↓
React Frontend
↓
FastAPI REST API
↓
SQLAlchemy
↓
PostgreSQL Database

The frontend communicates with the backend using HTTP REST API requests.

The backend validates incoming data, performs business logic, and stores information in PostgreSQL.

## CI/CD

GitHub Actions automatically runs:

- Backend tests
- Frontend linting
- Frontend production build

The application is deployed on Render.

## API Endpoints

- POST /requests/
- GET /requests/
- GET /requests/{request_id}
- PUT /requests/{request_id}/status
- PUT /requests/{request_id}/assign
- POST /requests/{request_id}/comments
- GET /requests/{request_id}/comments
- GET /requests/{request_id}/history
- GET /health

## Project Status

Core MVP completed and deployed successfully.