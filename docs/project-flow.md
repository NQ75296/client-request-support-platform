# Client Request & Support Workflow Platform - Project Flow

## Project Summary

This project is a full-stack web application where users can submit support requests and track their progress.

Support team members can review requests, assign them to support engineers, update request status, add comments, and resolve requests.

The project demonstrates full-stack development using React, FastAPI, PostgreSQL, automated testing, GitHub Actions, and cloud deployment using Render.

## Problem Statement

Many teams handle client requests, support issues, internal tasks, or service requests through emails, spreadsheets, or scattered messages.

This can make it difficult to track:

- Request ownership
- Priority
- Current status
- Assigned support engineer
- Comments
- Resolution progress

This application provides one centralized place to create, manage, assign, track, and resolve support requests.

## User Roles

### Client/User

- Creates support requests
- Adds request title
- Adds request description
- Selects category
- Selects priority
- Tracks request status

### Support Engineer

- Reviews assigned requests
- Adds comments
- Updates request status
- Resolves requests after completing the work

### Admin/Manager

- Views support requests
- Assigns requests to support engineers
- Monitors request status
- Reviews active and resolved requests

## Main Request Flow

1. User opens the support application.

2. User creates a new support request.

3. User enters:
   - Title
   - Description
   - Category
   - Priority
   - Created By

4. The React frontend sends the request to the FastAPI backend.

5. FastAPI validates the request.

6. The request is stored in PostgreSQL with the status `New`.

7. The request appears on the Support Dashboard.

8. The request can be assigned to a support engineer.

9. The support engineer can work on the request and add comments.

10. The request status can be updated during progress.

11. The request can be marked as `Resolved`.

12. The dashboard automatically updates the active and resolved request counts.

## Status Flow

1. New

2. In Review

3. Assigned

4. In Progress

5. More Info Required

6. Resolved

7. Closed

## Core Modules

- Support request creation
- Support request dashboard
- Request assignment
- Priority management
- Status management
- Comments and communication
- Status history
- Dashboard summary
- Backend API
- PostgreSQL database
- Automated API testing
- CI using GitHub Actions
- Cloud deployment using Render

## Current UI

### Request Creation

Users can create a support request by entering:

- Title
- Description
- Category
- Priority
- Created By

### Support Dashboard

The dashboard displays:

- Total Requests
- Active Requests
- Resolved Requests
- Urgent Requests

### Request Management

Each request allows the support team to:

- View request details
- Update status
- Assign a support engineer
- View comments
- Add comments

## Technology Stack

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

### CI / DevOps

- Git
- GitHub
- GitHub Actions

### Cloud Deployment

- Render Web Service for backend
- Render Static Site for frontend
- Render PostgreSQL for database

### API Documentation

- Swagger
- OpenAPI

### Development Environment

- VS Code
- PowerShell

## High-Level System Flow

1. User interacts with the React frontend.

2. React sends HTTP requests to the FastAPI REST API.

3. FastAPI validates the incoming data using Pydantic.

4. FastAPI performs backend business logic.

5. SQLAlchemy communicates with PostgreSQL.

6. PostgreSQL stores:
   - Support requests
   - Comments
   - Assignments
   - Status information
   - Status history

7. FastAPI returns a response to React.

8. React updates the user interface with the latest information.

## Architecture Flow

User

↓

React Frontend

↓

FastAPI REST API

↓

SQLAlchemy

↓

PostgreSQL Database


## API Flow Example

When a user creates a request:

React Frontend

↓

POST /requests/

↓

FastAPI

↓

Pydantic Validation

↓

SQLAlchemy

↓

PostgreSQL

↓

FastAPI Response

↓

React Dashboard Updated


## Main API Endpoints

### Health Check

GET /health

### Requests

POST /requests/

GET /requests/

GET /requests/{request_id}

### Request Status

PUT /requests/{request_id}/status

### Request Assignment

PUT /requests/{request_id}/assign

### Comments

POST /requests/{request_id}/comments

GET /requests/{request_id}/comments

### Status History

GET /requests/{request_id}/history

## Database Design

The project uses PostgreSQL with three main tables.

### support_requests

Stores:

- Request ID
- Title
- Description
- Category
- Priority
- Created By
- Status
- Assigned To
- Created At
- Updated At

### comments

Stores:

- Comment ID
- Request ID
- Author
- Message
- Created At

### status_history

Stores:

- History ID
- Request ID
- Old Status
- New Status
- Changed At

## Testing

Backend API tests were created using PyTest.

Tests include:

- Health endpoint
- Create support request
- Update request status
- Assign support request
- Add and retrieve comments

The tests run successfully both locally and through GitHub Actions.

## CI Flow

1. Developer makes a code change.

2. Developer pushes code to GitHub.

3. GitHub Actions starts automatically.

4. Backend dependencies are installed.

5. Backend PyTest tests are executed.

6. Frontend dependencies are installed.

7. Frontend linting is executed.

8. Frontend production build is created.

9. GitHub Actions shows whether the build and tests passed.

## Deployment Flow

The application is deployed using Render.

### Frontend

React application is deployed as a Render Static Site.

### Backend

FastAPI is deployed as a Render Web Service.

### Database

PostgreSQL is hosted using Render PostgreSQL.

## Production Environment Variables

### Backend

DATABASE_URL

Used by the FastAPI backend to connect to PostgreSQL.

FRONTEND_URL

Used by the backend CORS configuration to allow requests from the production frontend.

### Frontend

VITE_API_URL

Used by React to communicate with the deployed FastAPI backend.

## CORS Configuration

The frontend and backend are hosted on different Render URLs.

Because they are different origins, the backend uses CORS configuration to allow the production frontend to communicate with the API.

## Live Application

### Frontend

https://client-support-frontend-p718.onrender.com

### Backend API

https://client-support-api.onrender.com

### Swagger API Documentation

https://client-support-api.onrender.com/docs

### Backend Health Check

https://client-support-api.onrender.com/health

## Version Control

The project source code is stored on GitHub.

Repository:

https://github.com/NQ75296/client-request-support-platform

## Features Successfully Tested After Deployment

The deployed application was tested successfully for:

- Creating a request
- Displaying the request on the dashboard
- Updating request status
- Assigning a support engineer
- Adding comments
- Resolving a request
- Updating dashboard counts
- Backend health endpoint
- Frontend-to-backend communication
- PostgreSQL data storage

## Future Enhancements

The following features can be added later:

- Authentication
- Role-based access control
- File attachments
- Search and filtering
- Pagination
- Email notifications
- Better UI design
- AI request summarization
- AI category suggestion
- AI priority suggestion
- More automated tests
- Fully gated CI/CD deployment after successful tests

## Optional AI Feature

AI was considered as a future enhancement but was not part of the current MVP.

Possible future AI features include:

- Summarizing long request descriptions
- Suggesting a request category
- Suggesting request priority

The current project focuses on the full-stack workflow, API development, PostgreSQL database, automated testing, CI, and cloud deployment.

## Project Status

The core MVP has been completed and deployed successfully.

The working application includes:

- React frontend
- FastAPI backend
- PostgreSQL database
- Request creation
- Request assignment
- Status updates
- Comments
- Dashboard metrics
- PyTest automated tests
- GitHub Actions CI
- Render cloud deployment

The project is now ready for documentation, portfolio presentation, and future enhancements.