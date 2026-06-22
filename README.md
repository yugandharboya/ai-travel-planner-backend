# AI Travel Planner Backend

## Project Overview

The AI Travel Planner Backend is a REST API built using Node.js and Express.js. It provides secure authentication, AI-powered travel itinerary generation using Google Gemini, and trip management functionalities.

The backend supports multiple users with strict data isolation, ensuring that users can access only their own trips.

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- Google Gemini API
- JWT Authentication
- bcrypt
- mysql2
- dotenv

---

## Features

### Authentication

- User Registration
- User Login
- JWT-based Authentication
- Protected Routes

### AI Trip Generation

- Generate travel itineraries using Google Gemini.
- Generate:
  - Budget estimation
  - Hotel suggestions
  - Packing checklist
  - Day-by-day itinerary

### Trip Management

- Save generated trips.
- Retrieve all saved trips.
- Retrieve complete trip details.
- Strict user-based access control.

---

## Project Structure

```text
backend/
│
├── controllers/
│   ├── authController.js
│   ├── geminiController.js
│   ├── tripController.js
│   ├── savedTripsController.js
│   └── tripDetailsController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── geminiRoutes.js
│   └── tripRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── db/
│   ├── db.js
│   └── tables.js
│
├── utils/
│   └── jwt.js
│
├── server.js
├── package.json
└── .env
```

---

## Database Schema

### users

Stores user account information.

| Column   | Type    |
| -------- | ------- |
| id       | INT     |
| name     | VARCHAR |
| email    | VARCHAR |
| password | VARCHAR |

---

### trips

Stores main trip information.

| Column             | Type    |
| ------------------ | ------- |
| id                 | INT     |
| user_id            | INT     |
| destination        | VARCHAR |
| duration_days      | INT     |
| budget_tier        | ENUM    |
| flights_cost       | DECIMAL |
| accommodation_cost | DECIMAL |
| food_cost          | DECIMAL |
| activities_cost    | DECIMAL |
| total_cost         | DECIMAL |
| status             | ENUM    |

---

### trip_interests

Stores trip interests.

| Column        | Type    |
| ------------- | ------- |
| id            | INT     |
| trip_id       | INT     |
| interest_name | VARCHAR |

---

### itinerary_days

Stores itinerary days.

| Column     | Type |
| ---------- | ---- |
| id         | INT  |
| trip_id    | INT  |
| day_number | INT  |

---

### activities

Stores activities for each itinerary day.

| Column           | Type    |
| ---------------- | ------- |
| id               | INT     |
| itinerary_day_id | INT     |
| title            | VARCHAR |
| description      | TEXT    |
| estimated_cost   | DECIMAL |
| time_of_day      | ENUM    |

---

### hotels

Stores AI-recommended hotels.

| Column          | Type    |
| --------------- | ------- |
| id              | INT     |
| trip_id         | INT     |
| hotel_name      | VARCHAR |
| rating          | DECIMAL |
| price_per_night | DECIMAL |
| hotel_type      | VARCHAR |

---

### packing_items

Stores packing checklist items.

| Column    | Type    |
| --------- | ------- |
| id        | INT     |
| trip_id   | INT     |
| item_name | VARCHAR |
| category  | VARCHAR |
| is_packed | BOOLEAN |

---

## API Endpoints

### Authentication

### Register User

```http
POST /auth/register
```

### Login User

```http
POST /auth/login
```

---

### Gemini

### Generate Travel Plan

```http
POST /api/gemini/generate
```

Protected Route: Yes

---

### Trips

### Save Trip

```http
POST /trips
```

Protected Route: Yes

---

### Get Saved Trips

```http
GET /trips/saved
```

Protected Route: Yes

---

### Get Trip Details

```http
GET /trips/:tripId
```

Protected Route: Yes

---

## Authentication

JWT authentication is used to secure protected routes.

Clients must include the token in request headers:

```http
Authorization: Bearer <jwt_token>
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MYSQLHOST=
MYSQLUSER=
MYSQLPASSWORD=
MYSQLDATABASE=
MYSQLPORT=

JWT_SECRET=

GEMINI_API_KEY=
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to project:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

---

## Security Features

- Password hashing using bcrypt.
- JWT authentication.
- Protected API routes.
- User-specific data access.
- Strict authorization checks.

---

## Future Enhancements

- Update trip status (Saved → Visited)
- Delete/Edit trips
- Regenerate specific itinerary days
- Pagination for saved trips

---

## Author

Yugandhar Boya
