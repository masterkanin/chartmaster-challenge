# ChartMaster Challenge - System Architecture

## High-Level Architecture Diagram

```
+----------------------------------+
|         Client Browser           |
+----------------------------------+
              |   ^
              v   |
+----------------------------------+
|        Next.js Frontend          |
|----------------------------------|
| - User Interface Components      |
| - TradingView Chart Integration  |
| - Authentication Client          |
| - State Management (Redux)       |
+----------------------------------+
              |   ^
              v   |
+----------------------------------+
|      Express.js Backend API      |
|----------------------------------|
| - RESTful API Endpoints          |
| - Authentication Middleware      |
| - Business Logic                 |
| - Data Validation                |
+----------------------------------+
              |   ^
              v   |
+----------------------------------+
|        PostgreSQL Database       |
|----------------------------------|
| - User Data                      |
| - Challenge Data                 |
| - Progress Tracking              |
| - Leaderboards                   |
+----------------------------------+
```

## Detailed Component Architecture

### Frontend Architecture

```
+----------------------------------+
|         Next.js Frontend         |
+----------------------------------+
| Pages                            |
|----------------------------------|
| - Home/Landing                   |
| - Authentication (Login/Signup)  |
| - Dashboard                      |
| - Challenge Selection            |
| - Easy Mode Challenge            |
| - Hard Mode Challenge            |
| - User Profile                   |
| - Leaderboards                   |
| - Admin Panel                    |
+----------------------------------+
| Components                       |
|----------------------------------|
| - Navigation                     |
| - Chart Viewer                   |
| - Drawing Tools                  |
| - Quiz Interface                 |
| - Progress Tracker               |
| - Badge Display                  |
| - Feedback Overlay               |
+----------------------------------+
| Services                         |
|----------------------------------|
| - API Client                     |
| - Authentication                 |
| - TradingView Integration        |
| - Local Storage                  |
+----------------------------------+
| State Management                 |
|----------------------------------|
| - User State                     |
| - Challenge State                |
| - Progress State                 |
| - UI State                       |
+----------------------------------+
```

### Backend Architecture

```
+----------------------------------+
|      Express.js Backend API      |
+----------------------------------+
| Middleware                       |
|----------------------------------|
| - Authentication                 |
| - Error Handling                 |
| - Request Validation             |
| - CORS                           |
| - Rate Limiting                  |
+----------------------------------+
| Controllers                      |
|----------------------------------|
| - Auth Controller                |
| - User Controller                |
| - Strategy Controller            |
| - Challenge Controller           |
| - Progress Controller            |
| - Admin Controller               |
+----------------------------------+
| Services                         |
|----------------------------------|
| - Auth Service                   |
| - User Service                   |
| - Challenge Service              |
| - Scoring Service                |
| - Gamification Service           |
+----------------------------------+
| Data Access                      |
|----------------------------------|
| - Prisma ORM                     |
| - Database Models                |
| - Query Builders                 |
+----------------------------------+
```

### Database Schema Architecture

```
+----------------------------------+
|        PostgreSQL Database       |
+----------------------------------+
| Users                            |
|----------------------------------|
| - id (PK)                        |
| - email                          |
| - username                       |
| - password_hash                  |
| - created_at                     |
| - updated_at                     |
| - xp_points                      |
| - level                          |
| - profile_image_url              |
+----------------------------------+
              | 1
              v *
+----------------------------------+
| UserProgress                     |
|----------------------------------|
| - id (PK)                        |
| - user_id (FK)                   |
| - challenge_id (FK)              |
| - completed                      |
| - score                          |
| - accuracy_percentage            |
| - time_taken                     |
| - attempt_count                  |
| - last_attempt_at                |
| - created_at                     |
| - updated_at                     |
+----------------------------------+
              ^ *
              | 1
+----------------------------------+
| Challenges                       |
|----------------------------------|
| - id (PK)                        |
| - strategy_id (FK)               |
| - title                          |
| - description                    |
| - difficulty_level               |
| - mode (easy/hard)               |
| - chart_url                      |
| - correct_answer_data (JSON)     |
| - created_at                     |
| - updated_at                     |
+----------------------------------+
              ^ *
              | 1
+----------------------------------+
| Strategies                       |
|----------------------------------|
| - id (PK)                        |
| - name                           |
| - description                    |
| - difficulty_level               |
| - image_url                      |
| - created_at                     |
| - updated_at                     |
+----------------------------------+
```

## Authentication Flow

```
+-------------+     +-------------+     +-------------+
|   Browser   |     |  Frontend   |     |   Backend   |
+-------------+     +-------------+     +-------------+
       |                   |                   |
       | Login Request     |                   |
       |------------------>|                   |
       |                   | Auth Request      |
       |                   |------------------>|
       |                   |                   | Validate Credentials
       |                   |                   |----------------+
       |                   |                   |                |
       |                   |                   |<---------------+
       |                   | JWT Token         |
       |                   |<------------------|
       | Store Token       |                   |
       |<------------------|                   |
       |                   |                   |
       | Protected Request |                   |
       |------------------>|                   |
       |                   | Request + Token   |
       |                   |------------------>|
       |                   |                   | Verify Token
       |                   |                   |----------------+
       |                   |                   |                |
       |                   |                   |<---------------+
       |                   | Protected Data    |
       |                   |<------------------|
       | Display Data      |                   |
       |<------------------|                   |
       |                   |                   |
```

## Challenge Flow - Easy Mode

```
+-------------+     +-------------+     +-------------+
|    User     |     |  Frontend   |     |   Backend   |
+-------------+     +-------------+     +-------------+
       |                   |                   |
       | Select Challenge  |                   |
       |------------------>|                   |
       |                   | Request Challenge |
       |                   |------------------>|
       |                   |                   | Fetch Challenge Data
       |                   |                   |----------------+
       |                   |                   |                |
       |                   |                   |<---------------+
       |                   | Challenge Data    |
       |                   |<------------------|
       | Display Chart     |                   |
       | & Questions       |                   |
       |<------------------|                   |
       |                   |                   |
       | Submit Answer     |                   |
       |------------------>|                   |
       |                   | Submit Answer     |
       |                   |------------------>|
       |                   |                   | Validate Answer
       |                   |                   | Calculate Score
       |                   |                   |----------------+
       |                   |                   |                |
       |                   |                   |<---------------+
       |                   | Result & Feedback |
       |                   |<------------------|
       | Display Result    |                   |
       | & Correct Answer  |                   |
       |<------------------|                   |
       |                   |                   |
```

## Challenge Flow - Hard Mode

```
+-------------+     +-------------+     +-------------+
|    User     |     |  Frontend   |     |   Backend   |
+-------------+     +-------------+     +-------------+
       |                   |                   |
       | Select Challenge  |                   |
       |------------------>|                   |
       |                   | Request Challenge |
       |                   |------------------>|
       |                   |                   | Fetch Challenge Data
       |                   |                   |----------------+
       |                   |                   |                |
       |                   |                   |<---------------+
       |                   | Challenge Data    |
       |                   |<------------------|
       | Display Chart     |                   |
       | & Drawing Tools   |                   |
       |<------------------|                   |
       |                   |                   |
       | Draw on Chart     |                   |
       |------------------>|                   |
       |                   | Store Drawings    |
       |                   |----------------+  |
       |                   |                |  |
       |                   |<---------------+  |
       |                   |                   |
       | Submit Drawing    |                   |
       |------------------>|                   |
       |                   | Submit Drawing    |
       |                   |------------------>|
       |                   |                   | Compare with Solution
       |                   |                   | Calculate Accuracy
       |                   |                   | Determine Score
       |                   |                   |----------------+
       |                   |                   |                |
       |                   |                   |<---------------+
       |                   | Result & Feedback |
       |                   |<------------------|
       | Display Overlay   |                   |
       | & Score           |                   |
       |<------------------|                   |
       |                   |                   |
```

## Deployment Architecture

```
+----------------------------------+
|           User Browser           |
+----------------------------------+
              |   ^
              v   |
+----------------------------------+
|         Vercel (Frontend)        |
|----------------------------------|
| - Next.js Application            |
| - Static Assets                  |
| - Client-side JavaScript         |
| - TradingView Integration        |
+----------------------------------+
              |   ^
              v   |
+----------------------------------+
|      Render/Heroku (Backend)     |
|----------------------------------|
| - Express.js API                 |
| - Business Logic                 |
| - Authentication                 |
| - Data Processing                |
+----------------------------------+
              |   ^
              v   |
+----------------------------------+
|    Managed PostgreSQL Service    |
|----------------------------------|
| - User Data                      |
| - Challenge Data                 |
| - Progress Data                  |
| - Relationship Management        |
+----------------------------------+
              |   ^
              v   |
+----------------------------------+
|        AWS S3 / Cloud Storage    |
|----------------------------------|
| - Chart Images                   |
| - User Uploads                   |
| - Static Assets                  |
+----------------------------------+
```

This architecture diagram provides a comprehensive overview of the ChartMaster Challenge system, showing the relationships between different components and the flow of data through the application. The modular design allows for scalability and maintainability as the platform grows.
