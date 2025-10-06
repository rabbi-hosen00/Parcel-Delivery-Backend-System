## 🛣️ API Routes & JWT Authentication

This API uses **JWT (JSON Web Token)** for authentication. Public routes do not require a token, while private routes require a valid JWT in the `Authorization` header:  


---

### 🔹 Routes Overview

| Role      | Endpoint                          | Method | Description                          | JWT Required |
|----------|-----------------------------------|--------|--------------------------------------|--------------|
| Public    | `/api/v1/auth/register`           | POST   | Register as sender/receiver          | ❌ No        |
| Public    | `/api/v1/auth/login`              | POST   | Login to get JWT token               | ❌ No        |
| Sender    | `/api/v1/parcels`                 | POST   | Create a new parcel                  | ✅ Yes       |
| Sender    | `/api/v1/parcels/me`              | GET    | View sender’s parcels                | ✅ Yes       |
| Sender    | `/api/v1/parcels/cancel/:id`      | PATCH  | Cancel parcel if not dispatched      | ✅ Yes       |
| Receiver  | `/api/v1/parcels/receiver`        | GET    | View incoming parcels                | ✅ Yes       |
| Receiver  | `/api/v1/parcels/confirm/:id`     | PATCH  | Confirm delivery                     | ✅ Yes       |
| Admin     | `/api/v1/admin/parcels`           | GET    | View all parcels                     | ✅ Yes       |
| Admin     | `/api/v1/admin/block/:id`         | PATCH  | Block or unblock parcels/users       | ✅ Yes       |
| All       | `/api/v1/parcels/:id/status-log`  | GET    | View parcel status logs              | ✅ Yes       |

---

## 🔹 Example Requests & Outputs

### 1️⃣ Public Route: Register

**Request:**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "Password123!",
  "role": "sender"
}

---

###🔹 Response

{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "68e15ff7f1b8eadaa0dee375",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "sender"
  }
}


### 🔹 Example Request: Public Route - Login & Get JWT

**Request:**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}


