# Forum API

Forum API is a RESTful backend service for a discussion forum, built as the final submission for Dicoding's "Menjadi Back-End Developer Expert dengan JavaScript" class. The project implements the core forum flow with user registration, authentication, threads, comments, and replies using a layered Clean Architecture approach. It is designed to show how business logic, infrastructure, and HTTP delivery can be separated clearly in a Node.js backend application.

Repository: [github.com/fajrianwarf/forum-api](https://github.com/fajrianwarf/forum-api)  

## Project Description

This project was developed as an end-to-end forum API backend focused on maintainability, testability, and clear separation of concerns. The application supports the main discussion workflow: users can register, authenticate, create threads, post comments, reply to comments, and retrieve thread details that include nested discussions.

From an architectural perspective, the codebase follows the same structure emphasized in the Dicoding backend expert path. Domain rules live separately from framework code, use cases are organized in the application layer, and infrastructure concerns such as PostgreSQL access, JWT handling, and HTTP server configuration are isolated in their own modules. This makes the project easier to extend and a solid base for future refactoring or feature development.

## Highlights

- Clean Architecture style with clear separation between `Applications`, `Domains`, `Infrastructures`, and `Interfaces`.
- JWT-based authentication using access token and refresh token.
- Thread, comment, and reply management with ownership checks.
- Soft delete behavior for comments and replies on thread detail.
- Automated testing with Jest for unit tests, repository integration tests, and server/functional tests.
- Continuous Integration using GitHub Actions on pull requests to `main`.
- Continuous Deployment using GitHub Actions on pushes to `main`.
- NGINX reverse proxy with rate limiting for `/threads` and HTTPS termination.

## Tech Stack

- Node.js
- Hapi
- PostgreSQL
- `pg`
- `@hapi/jwt`
- `bcrypt`
- Jest
- ESLint
- GitHub Actions
- NGINX
- PM2
- Certbot

## Implemented Features

- Register a new user.
- Login to receive access and refresh tokens.
- Refresh access token.
- Logout by deleting refresh token.
- Create a thread.
- View thread detail.
- Add a comment to a thread.
- Delete a comment by its owner.
- Add a reply to a comment.
- Delete a reply by its owner.
- Hide deleted comments and replies in thread detail responses.

Note: the optional `like/unlike comment` endpoint from the CI/CD and Security criteria is not implemented in this repository.

## API Overview

Base URL (local): `http://localhost:5000`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/users` | No | Register a new user |
| `POST` | `/authentications` | No | Login and get access/refresh tokens |
| `PUT` | `/authentications` | No | Refresh access token |
| `DELETE` | `/authentications` | No | Logout and remove refresh token |
| `POST` | `/threads` | Yes | Create a new thread |
| `GET` | `/threads/{threadId}` | No | Get thread detail with comments and replies |
| `POST` | `/threads/{threadId}/comments` | Yes | Add a comment to a thread |
| `DELETE` | `/threads/{threadId}/comments/{commentId}` | Yes | Soft delete a comment |
| `POST` | `/threads/{threadId}/comments/{commentId}/replies` | Yes | Add a reply to a comment |
| `DELETE` | `/threads/{threadId}/comments/{commentId}/replies/{replyId}` | Yes | Soft delete a reply |

Notes:

- Protected endpoints use `Authorization: Bearer <accessToken>`.
- API response messages follow the existing project language, which is Indonesian.
- Deleted comments are shown as `**komentar telah dihapus**`.
- Deleted replies are shown as `**balasan telah dihapus**`.

## Project Structure

```text
.
|-- .github/workflows/     # CI and CD pipelines
|-- config/                # Database config for test migration
|-- migrations/            # PostgreSQL migration files
|-- src/
|   |-- Applications/      # Use cases and security abstractions
|   |-- Commons/           # Shared exceptions and translators
|   |-- Domains/           # Entities and repository contracts
|   |-- Infrastructures/   # Postgres, JWT, bcrypt, DI container, server
|   |-- Interfaces/        # HTTP handlers and route plugins
|   `-- app.js             # Application entry point
|-- tests/                 # Integration test helpers
`-- nginx.conf             # Reverse proxy, rate limiting, HTTPS config
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL

### Installation

```bash
git clone https://github.com/fajrianwarf/forum-api.git
cd forum-api
npm install
```

### Environment Variables

Create a `.env` file in the project root and provide the variables required by the application and test environment.

Important:

- The runtime app reads the main database from `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, and `PGDATABASE`.
- Tests read the database from `PGHOST_TEST`, `PGPORT_TEST`, `PGUSER_TEST`, `PGPASSWORD_TEST`, and `PGDATABASE_TEST`.
- JWT authentication uses `ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY`, and `ACCESS_TOKEN_AGE`.
- Server configuration uses `HOST` and `PORT`.
- `npm run migrate:test up` uses [`config/database/test.json`](config/database/test.json), so make sure that file matches your local test database setup or prepare your database to match the file.

### Database Setup

Create two databases, for example:

```sql
CREATE DATABASE forumapi;
CREATE DATABASE forumapi_test;
```

Run migrations:

```bash
npm run migrate up
npm run migrate:test up
```

### Run the Application

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run start
```

Once the server starts, the API will be available at `http://localhost:5000`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run start` | Start the API with Node.js |
| `npm run start:dev` | Start the API with Nodemon |
| `npm run lint` | Run ESLint on `src/` |
| `npm run test` | Run Jest once |
| `npm run test:watch:change` | Run affected tests in watch mode |
| `npm run test:watch` | Run all tests in watch mode with coverage |
| `npm run migrate up` | Run migration for the main database |
| `npm run migrate:test up` | Run migration for the test database |

## Testing

This repository includes:

- Unit tests for entities, use cases, security abstractions, and shared exceptions.
- Repository integration tests against PostgreSQL.
- HTTP/server tests using Hapi's injection mechanism as functional API verification.

Run the full test suite:

```bash
npm run test
```

Run lint:

```bash
npm run lint
```

## CI/CD and Security Mapping

This repository was prepared to satisfy Dicoding's "CI/CD dan Security" project criteria.

### 1. Continuous Integration

Implemented in `.github/workflows/ci.yml`.

- Trigger: `pull_request` to `main`
- Runner: `ubuntu-latest`
- Node.js matrix: `18.x` and `20.x`
- PostgreSQL: GitHub Actions service container
- Steps:
  - checkout repository
  - install dependencies
  - run database migration
  - run test suite

The workflow validates the project automatically whenever a pull request targets the main branch.

### 2. Continuous Deployment

Implemented in `.github/workflows/cd.yml`.

- Trigger: `push` to `main`
- Deployment method: SSH from GitHub Actions
- Remote steps:
  - `git pull origin main`
  - `npm install`
  - `npm run migrate up`
  - `pm2 restart forum-api`

This setup assumes a server with Node.js, npm, PostgreSQL access, and a PM2 process named `forum-api`.

### 3. Rate Limiting with NGINX

Implemented in `nginx.conf`.

- Rate limit zone: `limit_req_zone $binary_remote_addr zone=one:10m rate=90r/m;`
- Protected resource: `/threads` and nested thread paths
- Reverse proxy target: `http://localhost:5000`

This configuration helps mitigate high-frequency requests against thread-related endpoints, in line with the submission requirement.

### 4. HTTPS

Implemented in `nginx.conf`.

- HTTPS listener on port `443`
- TLS certificates managed by Certbot
- HTTP traffic on port `80` redirected to HTTPS
- Configured domain:
  - `sweet-islands-grow-oddly.a276.dcdg.xyz`
  - `www.sweet-islands-grow-oddly.a276.dcdg.xyz`

## Dicoding Submission Notes

Based on the attached project criteria, the submission should include:

- A public repository link.
- An accessible HTTPS URL for the deployed Forum API, if deployment is still being used for submission.
- The root project folder in ZIP format.
- `package.json` inside the submission archive.
- `nginx.conf` in the project root.
- `.env` may be excluded from the ZIP as long as the environment variable names stay consistent.
- `node_modules` should be removed before creating the ZIP.

For Dicoding submission notes, make sure you attach both the repository URL and the HTTPS Forum API URL.

If you use this repository for submission, also make sure the GitHub Actions history shows:

- at least one successful CI run on a pull request to `main`
- at least one failed CI scenario for reviewer verification
- at least one successful CD run on a push to `main`

## Deployment Notes

The current deployment-oriented files in this repository are:

- `.github/workflows/ci.yml`
- `.github/workflows/cd.yml`
- `nginx.conf`

If you deploy to a new server, make sure the server has:

- Node.js and npm installed
- PostgreSQL ready and reachable
- PM2 installed
- NGINX installed
- TLS certificate configured for your domain
- GitHub repository secrets configured for SSH-based deployment

## Architecture Notes

The project follows the layered structure taught in Dicoding's backend expert path:

- `Domains` defines business entities and repository interfaces.
- `Applications` contains use cases and abstract security services.
- `Infrastructures` provides concrete implementations for PostgreSQL, hashing, JWT, dependency injection, and the Hapi server.
- `Interfaces` exposes HTTP handlers and routes.

This separation keeps the business logic independent from frameworks and external services.

## Acknowledgements

Built as a final submission project for Dicoding Indonesia's backend expert course.
