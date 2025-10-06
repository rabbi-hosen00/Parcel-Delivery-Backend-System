# 📦 Parcel Delivery Backend System

### 🚀 Overview
The **Parcel Delivery Backend System** is a secure, modular, and role-based backend API built with **Express.js**, **TypeScript**, and **Mongoose**. It manages parcel deliveries, tracks their statuses, and controls user roles like `admin`, `sender`, and `receiver`.  
Inspired by courier systems like **Pathao** and **Sundarban**, this project focuses on authentication, authorization, and efficient parcel management.

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

