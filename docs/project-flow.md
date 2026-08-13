# Client Request & Support Workflow Platform - Project Flow

## Project Summary

This project is a full-stack web application where clients or internal users can submit support requests, track request status, and communicate with the support team. Internal team members can review requests, assign them to support engineers, update priority, add comments, and close requests after resolution.

The main purpose of this project is to build something close to a real client or internal workflow instead of a random project. The project will focus on full-stack development, backend APIs, database design, Azure deployment, testing, CI/CD, and a small AI-assisted feature.

## Problem Statement

Many teams handle client requests, support issues, internal tasks, or service requests through emails, spreadsheets, or scattered messages. This can make it difficult to track request ownership, priority, current status, comments, and resolution history.

This platform will provide one centralized place to create, manage, assign, track, and resolve requests with better visibility for both users and internal teams.

## User Roles

### Client/User

- Creates support requests
- Adds request title, description, category, priority, and attachments if needed
- Tracks request status
- Replies to comments when more information is requested

### Support Engineer

- Reviews assigned requests
- Adds comments and updates
- Changes request status
- Resolves requests after completing the work

### Admin/Manager

- Views all requests
- Assigns requests to support engineers
- Updates priority and category
- Monitors open, pending, and resolved requests

## Main Request Flow

1. User logs in.
2. User creates a new support request.
3. User enters title, description, category, priority, and attachment if needed.
4. Optional AI feature summarizes the request or suggests a category.
5. Request is saved with New status.
6. Admin or support team reviews the request.
7. Request is assigned to a support engineer.
8. Support engineer works on the request and adds comments.
9. Request status is updated during progress.
10. Request is marked as resolved.
11. Request is closed.

## Status Flow

1. New
2. In Review
3. Assigned
4. In Progress
5. More Info Required
6. Resolved
7. Closed

## Core Modules

- Authentication and role-based access
- Request creation
- Request dashboard
- Request details page
- Assignment and priority management
- Comments and communication
- Attachment upload
- Status tracking
- Dashboard summary
- Optional AI summary and category suggestion

## Planned UI Screens

### User Side

- Login page
- User dashboard
- Create request page
- Request details page
- Comment/reply section

### Support/Admin Side

- Support dashboard
- Request review page
- Assignment and priority update page
- Admin summary dashboard

## Planned Technology Stack

Frontend: React

Backend: Python, FastAPI

Database: PostgreSQL

Cloud Deployment: Azure App Service

Database Hosting: Azure Database for PostgreSQL

File Storage: Azure Blob Storage

Testing: PyTest

CI/CD: GitHub Actions

API Documentation: Swagger/OpenAPI

Version Control: GitHub

IDE: VS Code

Optional AI Feature: Azure OpenAI or OpenAI API for request summary and category suggestion

## High-Level System Flow

1. React frontend sends requests to the FastAPI backend.
2. FastAPI backend handles business logic, validation, and API responses.
3. PostgreSQL stores users, requests, comments, assignments, and status history.
4. Azure Blob Storage stores uploaded attachments.
5. Swagger/OpenAPI documents and tests backend APIs.
6. GitHub stores the project code.
7. GitHub Actions runs test cases automatically.
8. If tests pass, the application is deployed to Azure.

## CI/CD Flow

1. Developer pushes code to GitHub.
2. GitHub Actions pipeline starts automatically.
3. Backend dependencies are installed.
4. PyTest test cases are executed.
5. Frontend build is created.
6. If all tests pass, the application is deployed to Azure.
7. Updated application becomes available on Azure.

## Optional AI Feature

The AI feature will be kept small and practical. It may be used to summarize long request descriptions or suggest a request category based on the request content.

The main focus will still be full-stack development, workflow design, testing, Azure deployment, and CI/CD.

## Next Step

After this project flow is reviewed, the next step is to prepare:

- Detailed architecture
- Database design
- API list
- Azure deployment plan
- CI/CD configuration

After that, implementation can begin.
