# VolunteerHub

VolunteerHub is a volunteer management platform designed to connect volunteers with community events efficiently and conveniently.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Installation](#installation)
- [Project Structure](#project-structure)

---

## Tech Stack

### Backend
- **Java 17**, **Spring Boot 3.5.6**, Spring Security, Spring Data JPA
- **PostgreSQL 16** with Flyway migrations (Database), **Redis** (Cache, Rate Limiting)
- JWT Authentication, MapStruct, Lombok
- Firebase Admin (Push Notifications), Thymeleaf (Email Templates)
- SpringDoc OpenAPI, Docker

### Frontend
- **React 19**, **Vite 7**, Material-UI
- React Router, Axios, Recharts
- Firebase (Push Notifications), TailwindCSS

---

## Key Features

### User Management
- Sign up and sign in with JWT Authentication
- Email Verification
- Password Reset
- Personal profile management
- Role-based authorization: User, Manager, Admin
- Follow other users

### Event Management
- Search and filter events by multiple criteria (latest, hottest, newest, etc.)
- Register for and cancel registration from events
- Manage event status and edit event details
- Review and manage event participants
- Like/Unlike events

### Posts and Interactions
- Create posts
- Comment
- Like posts
- Upload media (images, videos)

### Notifications
- In-app notification system
- Push Notifications via Firebase Cloud Messaging
- Notifications categorized by role (Admin, Manager, User)

### Dashboard and Statistics
- Admin dashboard with system-wide overview statistics
- Manager dashboard for the events an event manager is responsible for
- Visual charts
- Event and user leaderboards
- Export statistical data

### Security
- JWT Token Authentication
- Rate Limiting to prevent spam and attacks
- Fine-grained role-based authorization
- Input validation

## Installation

### Requirements
- Docker / Docker Desktop

### Configure the .env file at the project root
```
# PostgreSQL Configuration
POSTGRES_USER=volunteer
POSTGRES_PASSWORD=volunteerpass

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=

# Frontend URLs
PASSWORD_RESET_FRONTEND_URL=http://localhost:5173/reset-password
EMAIL_VERIFICATION_FRONTEND_URL=http://localhost:5173/verify-email
```

### Installing with Docker
**Requirement:** Docker installed on your machine

1. Open a terminal at the project root (the directory containing `frontend/`, `backend/`, and `docker-compose.yml`)
2. Start the stack:


    ```bash
    docker compose up --build
    ```
3. Open:
    - **Frontend:** `http://localhost:5173`
    - **Backend:** `http://localhost:8080`


The bundled database already contains the users `user1`, `manager1`, and `admin1`, each with the password `password123` — the username is also the role name.




### Manual Installation
#### Set up the database:
1. Run the following statements to create the database and user:
```
-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS volunteer_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 2. Create the User
CREATE USER IF NOT EXISTS 'volunteer'@'localhost' IDENTIFIED BY 'volunteerpass';
GRANT ALL PRIVILEGES ON volunteer_hub.* TO 'volunteer'@'localhost';
FLUSH PRIVILEGES;
```


2. Import the data: from the project root, run:
```
mysql -u <YOUR_ADMIN_USER> -p volunteer_hub < backend/src/main/resources/schema.sql
mysql -u <YOUR_ADMIN_USER> -p volunteer_hub < backend/src/main/resources/seed.sql
```


3. Configure the backend: edit `backend/src/main/resources/application.properties` and update the database settings to match the user created above:
```
# Change to the 'volunteer' user created above (or another user of your choice)
spring.datasource.username=${DB_USERNAME:volunteer}
spring.datasource.password=${DB_PASSWORD:volunteerpass}
```


4. You also need to make sure a Redis server is running
#### Backend
Open a terminal in the `backend` directory and run:
```
chmod +x mvnw
./mvnw spring-boot:run
```
Once it starts successfully, the backend is available at `http://localhost:8080`.


### Frontend
Open a terminal in the `frontend` directory and run:


```bash
npm install
npm run build
npm run preview -- --port 5173
```
The frontend is available at `http://localhost:5173`.
The bundled database already contains the users `user1`, `manager1`, and `admin1`, each with the password `password123` — the username is also the role name.

### API Documentation

After starting the backend, open Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

---

## Project Structure

```
VolunteerHub/
├── backend/
│   ├── src/main/java/com/uet/VolunteerHub/
│   │   ├── controller/       # REST Controllers
│   │   ├── service/          # Business Logic
│   │   ├── repository/       # Data Access Layer
│   │   ├── entity/           # JPA Entities
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── security/         # Security Configuration
│   │   ├── ratelimit/        # Rate Limiting
│   │   ├── events/           # Event-driven components
│   │   ├── exception/        # Exception Handling
│   │   └── configuration/    # App Configuration
│   ├── docker-compose.yml
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/              # API calls
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   └── utils/            # Utility functions
│   └── package.json
└── README.md
```

---

## Team Members

Course: Web Application Development - INT3306_2

| Name             | Student ID | Role         |
|------------------|------------|--------------|
| Nguyễn Anh Sơn   | 23021684   | Backend Dev  |
| Nguyễn Văn Phúc  | 23021664   | Backend Dev  |
| Thái Khắc Mạnh   | 23021620   | Frontend Dev |
