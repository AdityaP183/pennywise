# Pennywise API

Backend API for **Pennywise**, a personal and group finance management application.

The API provides authentication, user management, personal transactions, categories, groups, expense splitting, settlements, dashboards, and budgeting.

## Tech Stack

* **Java 25**
* **Spring Boot 4.1**
* **Spring Web MVC**
* **Spring Security**
* **Spring Data JPA / Hibernate**
* **PostgreSQL**
* **Flyway** — database migrations
* **JWT** — access-token authentication
* **Maven**
* **Lombok**

## API Base URL

```text
/api/v1
```

---

## Authentication

Pennywise uses a cookie-based JWT authentication system.

* **Access token** — short-lived JWT stored in an `HttpOnly` cookie.
* **Refresh token** — long-lived token stored in an `HttpOnly` cookie and persisted as a hash in PostgreSQL.
* Access tokens are refreshed without rotating the refresh token while the refresh token remains valid.
* Logout revokes the refresh token and clears both authentication cookies.

Protected endpoints require a valid access token.

---

## API Structure

### Authentication

| Method | Endpoint                | Description                     | Auth          |
| ------ | ----------------------- | ------------------------------- | ------------- |
| `POST` | `/auth/register`        | Register a new user             | Public        |
| `POST` | `/auth/login`           | Authenticate user               | Public        |
| `POST` | `/auth/refresh`         | Refresh the access token        | Refresh token |
| `POST` | `/auth/logout`          | Logout and revoke refresh token | Refresh token |
| `POST` | `/auth/change-password` | Change account password         | Protected     |

### Users

| Method   | Endpoint    | Description                   | Auth      |
| -------- | ----------- | ----------------------------- | --------- |
| `GET`    | `/users/me` | Get current user's profile    | Protected |
| `PATCH`  | `/users/me` | Update current user's profile | Protected |

### Transactions

Transactions represent both income and expenses.

| Method   | Endpoint             | Description              | Auth      |
| -------- | -------------------- | ------------------------ | --------- |
| `GET`    | `/transactions`      | List user's transactions | Protected |
| `POST`   | `/transactions`      | Create a transaction     | Protected |
| `GET`    | `/transactions/{id}` | Get a transaction        | Protected |
| `PATCH`  | `/transactions/{id}` | Update a transaction     | Protected |
| `DELETE` | `/transactions/{id}` | Delete a transaction     | Protected |

### Categories

| Method   | Endpoint           | Description       | Auth      |
| -------- | ------------------ | ----------------- | --------- |
| `GET`    | `/categories`      | List categories   | Protected |
| `POST`   | `/categories`      | Create a category | Protected |
| `GET`    | `/categories/{id}` | Get a category    | Protected |
| `PATCH`  | `/categories/{id}` | Update a category | Protected |
| `DELETE` | `/categories/{id}` | Delete a category | Protected |

### Groups

Groups allow users to manage shared expenses.

| Method   | Endpoint       | Description        | Auth      |
| -------- | -------------- | ------------------ | --------- |
| `GET`    | `/groups`      | List user's groups | Protected |
| `POST`   | `/groups`      | Create a group     | Protected |
| `GET`    | `/groups/{id}` | Get a group        | Protected |
| `PATCH`  | `/groups/{id}` | Update a group     | Protected |
| `DELETE` | `/groups/{id}` | Delete a group     | Protected |

#### Group Members

| Method   | Endpoint                        | Description                    |
| -------- | ------------------------------- | ------------------------------ |
| `GET`    | `/groups/{id}/members`          | List group members             |
| `POST`   | `/groups/{id}/members`          | Add/invite a member            |
| `PATCH`  | `/groups/{id}/members/{userId}` | Update member information/role |
| `DELETE` | `/groups/{id}/members/{userId}` | Remove a member                |

### Group Transactions

| Method   | Endpoint                                    | Description                |
| -------- | ------------------------------------------- | -------------------------- |
| `GET`    | `/groups/{id}/transactions`                 | List group transactions    |
| `POST`   | `/groups/{id}/transactions`                 | Create a group transaction |
| `GET`    | `/groups/{id}/transactions/{transactionId}` | Get a group transaction    |
| `PATCH`  | `/groups/{id}/transactions/{transactionId}` | Update a group transaction |
| `DELETE` | `/groups/{id}/transactions/{transactionId}` | Delete a group transaction |

### Balances

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| `GET`  | `/groups/{id}/balances` | Calculate member balances |

### Settlements

| Method   | Endpoint                                  | Description         |
| -------- | ----------------------------------------- | ------------------- |
| `GET`    | `/groups/{id}/settlements`                | List settlements    |
| `POST`   | `/groups/{id}/settlements`                | Record a settlement |
| `DELETE` | `/groups/{id}/settlements/{settlementId}` | Delete a settlement |

### Dashboard

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| `GET`  | `/dashboard`            | Get dashboard overview         |
| `GET`  | `/dashboard/summary`    | Get income and expense summary |
| `GET`  | `/dashboard/trends`     | Get financial trends           |
| `GET`  | `/dashboard/categories` | Get spending by category       |

### Budgets

| Method   | Endpoint        | Description     |
| -------- | --------------- | --------------- |
| `GET`    | `/budgets`      | List budgets    |
| `POST`   | `/budgets`      | Create a budget |
| `GET`    | `/budgets/{id}` | Get a budget    |
| `PATCH`  | `/budgets/{id}` | Update a budget |
| `DELETE` | `/budgets/{id}` | Delete a budget |

### Health

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| `GET`  | `/health` | Check API health |

---

## Error Handling

The API uses a consistent error response format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "must be a valid email address"
    }
  ]
}
```

Common HTTP status codes:

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| `200`  | Request successful                       |
| `201`  | Resource created                         |
| `204`  | Request successful with no response body |
| `400`  | Bad request / validation failure         |
| `401`  | Authentication required or invalid       |
| `403`  | Authenticated but not authorized         |
| `404`  | Resource or route not found              |
| `405`  | HTTP method not allowed                  |
| `500`  | Unexpected server error                  |

---

## Database

PostgreSQL is used as the primary database.

Database schema changes are managed using **Flyway migrations**.

Migration files are located at:

```text
src/main/resources/db/migration/
```
Flyway applies migrations automatically when the application starts and tracks applied migrations in its schema history table.
Hibernate is configured not to modify the database schema directly.

---

## Configuration

Environment-specific configuration is kept outside the repository.

Example variables:

```env
DB_URL=jdbc:postgresql://localhost:5432/pennywise
DB_USERNAME=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret

ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

COOKIE_SECURE=false
```

A `.env.example` file is provided as a template.

---

## Development

Run the application using Maven:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The API runs on:

```text
http://localhost:8000
```

with the API base path:

```text
http://localhost:8000/api/v1
```

---

## Current Progress

### Authentication

* [x] User registration
* [x] Login
* [x] Password hashing
* [x] JWT access tokens
* [x] Refresh tokens
* [x] HttpOnly authentication cookies
* [x] Access-token refresh
* [x] Logout and refresh-token revocation
* [x] JWT authentication filter
* [x] Protected routes
* [x] Custom authentication error responses

### Users

* [x] Get current user
* [x] Update first name
* [x] Update last name
* [ ] Change password

### Finance

* [ ] Personal transactions
* [ ] Categories
* [ ] Dashboard
* [ ] Budgets

### Groups

* [ ] Group management
* [ ] Group members
* [ ] Shared transactions
* [ ] Balance calculation
* [ ] Settlements
