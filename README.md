# 📦 Parcel Delivery Backend System

### 🚀 Overview
The **Parcel Delivery Backend System** is a secure, modular, and role-based backend API built with **Express.js**, **TypeScript**, and **Mongoose**. It manages parcel deliveries, tracks their statuses, and controls user roles like `admin`, `sender`, and `receiver`.  
Inspired by courier systems like **Pathao** and **Sundarban**, this project focuses on authentication, authorization, and efficient parcel management.

## Demo Video

[Play Video Ride Booking API](https://drive.google.com/file/d/1cRPbWJx8aw_4RI1IWcWiRZt-EaUHe4dz/preview)


---

## 🧱 Tech Stack

- **Backend Framework:** Express.js (TypeScript)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Validation:** Zod
- **Environment Management:** dotenv
- **Error Handling:** Global Error Middleware

---

## 🔐 Features

### 👨‍💼 Admin
- View and manage all users and parcels  
- Block or unblock users or parcels  
- Update parcel delivery statuses  
- Monitor status logs and system activities  

### 📤 Sender
- Create new parcel delivery requests  
- Cancel parcels (if not yet dispatched)  
- View their created parcels and status history  

### 📥 Receiver
- View incoming parcels  
- Confirm parcel delivery  
- View delivery history  

---

## 🧩 Parcel Workflow

**Valid Status Flow:**
```
REQUESTED → APPROVED → DISPATCHED → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED → RETURNED/BLOCKED
```

- If **admin blocks** a parcel → `status = BLOCKED`
- If **receiver not found** → `status = RETURNED`
- All status changes are recorded in `statusLogs[]` inside the parcel schema.

---

## ⚙️ Business Rules

- Senders **cannot cancel** once parcel is dispatched.  
- Blocked users or parcels cannot perform any action.  
- Only receivers can confirm delivery.  
- Every parcel has a **unique tracking ID** (e.g., `TRK-20251005-123456`).  
- All status updates are timestamped and logged.


## 🧱 Folder Structure

```plaintext

src/
├── app.ts                          # Express app setup and routing
├── config/
│   └── env.ts                      # Environment variable configuration and validation
├── middlewares/                    # Custom middlewares for auth, validation, and errors
│   ├── checkAuth.ts                # JWT authentication middleware
│   ├── validateRequest.ts          # Request validation using Joi schemas
│   └── globalErrorHandler.ts       # Centralized error handling
├── modules/                        # Core business modules
│   ├── user/                       # User management module
│   │   ├── user.model.ts           # Mongoose User schema and model
│   │   ├── user.interface.ts       # TypeScript interfaces for User
│   │   ├── user.controller.ts      # User route handlers
│   │   ├── user.service.ts         # User business logic
│   │   ├── user.validation.ts      # Joi validation schemas for User
│   │   └── user.routes.ts          # User API routes
│   ├── parcel/                     # Parcel management module (includes status logs)
│   │   ├── parcel.model.ts         # Mongoose Parcel schema with embedded statusLog
│   │   ├── parcel.controller.ts    # Parcel route handlers
│   │   ├── parcel.service.ts       # Parcel business logic and status updates
│   │   ├── parcel.validation.ts    # Joi validation schemas for Parcel
│   │   └── parcel.routes.ts        # Parcel API routes
│   └── auth/                       # Authentication module
│       ├── auth.controller.ts      # Auth route handlers (register, login)
│       ├── auth.service.ts         # Auth business logic (JWT, bcrypt)
│       └── auth.routes.ts          # Auth API routes
├── utils/                          # Utility functions
│   ├── jwt.ts                      # JWT token generation and verification helpers
│   └── sendResponse.ts             # Standardized response formatting
└── errorHelpers/
    └── appError.ts                 # Custom AppError class for error management


````

## 🧠 API Design

### Live URL
```
https://assignment-ride-booking-api-1.onrender.com/api/v1
```

### Base URL
```
http://localhost:5000/api/v1
```


| Role      | Endpoint                          | Method | Description                          |
|-----------|----------------------------------|--------|--------------------------------------|
| Public    | `/api/v1/auth/register`           | POST   | Register as sender/receiver          |
| Public    | `/api/v1/auth/login`              | POST   | Login to get JWT token               |
| Sender    | `/api/v1/parcels`                 | POST   | Create a new parcel                  |
| Sender    | `/api/v1/parcels/me`              | GET    | View sender’s parcels                |
| Sender    | `/api/v1/parcels/cancel/:id`     | PATCH  | Cancel parcel if not dispatched      |
| Receiver  | `/api/v1/parcels/receiver`        | GET    | View incoming parcels                |
| Receiver  | `/api/v1/parcels/confirm/:id`     | PATCH  | Confirm delivery                     |
| Admin     | `/api/v1/admin/parcels`           | GET    | View all parcels                     |
| Admin     | `/api/v1/admin/block/:id`         | PATCH  | Block or unblock parcels/users       |
| All       | `/api/v1/parcels/:id/status-log`  | GET    | View parcel status logs              |


#🔹 Example Requests & Outputs </br>
###  1️⃣ Public Route: Register
Request:

````
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "Password123!",
  "role": "sender"
}

````

## Response:

````
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
````
2️⃣ Public Route: Login & Get JWT <br>
Request:
````
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
````
## Response
````
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "68e15ff7f1b8eadaa0dee375",
      "name": "John Doe",
      "role": "sender",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
````

3️⃣ Sender Route: Create Parcel
Request:
````
POST /api/v1/parcels
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "receiverName": "Jane Doe",
  "receiverAddress": "123 Receiver Rd, Dhaka",
  "weight": 2.5,
  "note": "Handle with care"
}
````
## Response:
````
{
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "_id": "68e1604df1b8eadaa0dee37a",
    "trackingId": "TRK-20251004-785050",
    "status": "PENDING",
    "sender": "68e15ff7f1b8eadaa0dee375",
    "receiverName": "Jane Doe",
    "receiverAddress": "123 Receiver Rd, Dhaka",
    "weight": 2.5,
    "note": "Handle with care",
    "statusLog": []
  }
}
````
4️⃣ Receiver Route: Confirm Parcel Delivery
Request:

````
PATCH /api/v1/parcels/68e1604df1b8eadaa0dee37a/confirm
Authorization: Bearer <JWT_TOKEN>
````
## Response:

````
{
  "success": true,
  "message": "Parcel delivery confirmed successfully",
  "data": {
    "trackingId": "TRK-20251004-785050",
    "status": "DELIVERED",
    "lastStatusLog": {
      "_id": "68e16123456f1b8eadaa0dee99",
      "status": "DELIVERED",
      "note": "Receiver confirmed delivery",
      "location": "456 Receiver Rd, Chittagong",
      "updatedBy": "68e15ff7f1b8eadaa0dee375",
      "createdAt": "2025-10-06T04:15:12.345Z"
    }
  }
}
````

5️⃣ Admin Route: View All Parcels
Request:

````
GET /api/v1/parcels
Authorization: Bearer <JWT_TOKEN>
````
## Response:
````
{
  "success": true,
  "message": "All parcels fetched successfully",
  "data": [
    {
      "_id": "68e1604df1b8eadaa0dee37a",
      "trackingId": "TRK-20251004-785050",
      "status": "DELIVERED",
      "sender": "68e15ff7f1b8eadaa0dee375",
      "receiverName": "Jane Doe",
      "receiverAddress": "123 Receiver Rd, Dhaka"
    }
  ]
}
````
6️⃣ Admin Route: Block / Unblock User or Parcel
Request:
````
PATCH /api/v1/admin/block/68e1604df1b8eadaa0dee37a
Authorization: Bearer <JWT_TOKEN>
````
## Response:
````
{
  "success": true,
  "message": "Parcel/User status updated successfully",
  "data": {
    "_id": "68e1604df1b8eadaa0dee37a",
    "status": "BLOCKED"
  }
}
````

## 🧪 Testing

- Use **Postman** for endpoint testing  
- Import the collection provided in `/postman` folder  
- Verify:
  - Authentication & JWT flow  
  - Role-based access  
  - Parcel creation, cancellation, and tracking  
  - Status history logs  

---

### 🧰 Environment Setup

# 1️⃣ Clone the Repository
```bash
git clone https://github.com/rabbi-hosen00/Parcel-Delivery-Backend-System.git
cd Parcel-Delivery-Backend-System
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create `.env` File
```
PORT=5000
DATABASE_URL=your_mongodb_uri
JWT_SECRET=your_secret
BCRYPT_SALT_ROUNDS=10
```

### 4️⃣ Run the Server
```bash
npm run dev
```


---

## 🧑‍💻 Author
**👤 Rabbi Hosen**  
📧 [rabbi.hosen00@gmail.com](mailto:rabbi.hosen00@gmail.com)  
🌐 [GitHub Profile](https://github.com/rabbi-hosen00)

---

## 🪪 License
This project is licensed under the **MIT License** – feel free to use and modify it for learning and educational purposes.

