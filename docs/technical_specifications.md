# ChartMaster Challenge - Technical Specifications

## System Architecture

### Frontend Architecture
- **Framework**: Next.js (React-based)
- **State Management**: Redux for global state management
- **Styling**: Tailwind CSS for utility-first styling
- **Chart Integration**: TradingView Charting Library
- **Authentication**: Firebase Auth client SDK
- **API Communication**: Axios for HTTP requests

### Backend Architecture
- **Framework**: Node.js with Express
- **API Structure**: RESTful API endpoints
- **Authentication Middleware**: Firebase Auth admin SDK
- **Database ORM**: Prisma for database interactions
- **Validation**: Joi for request validation
- **File Handling**: Multer for file uploads

### Database Schema

#### Users Table
- id (PK)
- email
- username
- password_hash (if not using Firebase)
- created_at
- updated_at
- xp_points
- level
- profile_image_url

#### Strategies Table
- id (PK)
- name
- description
- difficulty_level
- image_url
- created_at
- updated_at

#### Challenges Table
- id (PK)
- strategy_id (FK)
- title
- description
- difficulty_level
- mode (easy/hard)
- chart_url
- correct_answer_data (JSON)
- created_at
- updated_at

#### UserProgress Table
- id (PK)
- user_id (FK)
- challenge_id (FK)
- completed
- score
- accuracy_percentage
- time_taken
- attempt_count
- last_attempt_at
- created_at
- updated_at

#### Badges Table
- id (PK)
- name
- description
- image_url
- requirement_type
- requirement_value
- created_at
- updated_at

#### UserBadges Table
- id (PK)
- user_id (FK)
- badge_id (FK)
- earned_at
- created_at
- updated_at

### API Endpoints

#### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

#### Users
- GET /api/users/:id
- PUT /api/users/:id
- GET /api/users/:id/progress
- GET /api/users/:id/badges

#### Strategies
- GET /api/strategies
- GET /api/strategies/:id
- POST /api/strategies (admin)
- PUT /api/strategies/:id (admin)
- DELETE /api/strategies/:id (admin)

#### Challenges
- GET /api/challenges
- GET /api/challenges/:id
- POST /api/challenges (admin)
- PUT /api/challenges/:id (admin)
- DELETE /api/challenges/:id (admin)
- GET /api/strategies/:id/challenges

#### Progress
- POST /api/progress
- GET /api/progress/leaderboard
- GET /api/progress/leaderboard/:strategyId

#### Admin
- GET /api/admin/users
- GET /api/admin/stats
- POST /api/admin/charts/upload

## TradingView Integration

### Charting Library Integration
- **License**: Requires TradingView Charting Library license
- **Implementation**: Self-hosted JavaScript library
- **Configuration**:
  - Read-only mode for Easy Mode challenges
  - Interactive mode with drawing tools for Hard Mode challenges
  - Custom toolbar configuration
  - Saved chart states for challenge setup

### Widget API Integration
- **Implementation**: Embedded iframe for simpler chart displays
- **Configuration**:
  - Symbol and timeframe settings
  - Theme customization
  - Feature restrictions

## Deployment Architecture

### Frontend Deployment (Vercel)
- **Build Process**: Next.js build and optimization
- **Environment Variables**: Configuration for API endpoints and services
- **CDN**: Vercel Edge Network for static assets

### Backend Deployment (Render/Heroku)
- **Container**: Docker containerization
- **Scaling**: Auto-scaling based on demand
- **Environment Variables**: Database credentials, API keys, etc.

### Database Deployment
- **Service**: Managed PostgreSQL (e.g., Render Database, Heroku Postgres)
- **Backups**: Automated daily backups
- **Migrations**: Prisma migration system

## Security Considerations

### Authentication
- JWT-based authentication
- Secure password hashing
- Rate limiting for login attempts

### Data Protection
- HTTPS for all communications
- Input validation and sanitization
- SQL injection prevention via ORM
- XSS protection

### API Security
- CORS configuration
- Rate limiting
- Request validation

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading of components
- Image optimization
- Caching strategies

### Backend
- Database query optimization
- Connection pooling
- Response compression
- Caching frequently accessed data

## Monitoring and Analytics

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User behavior analytics

### Server Monitoring
- Resource utilization
- Response times
- Error rates

## Testing Strategy

### Frontend Testing
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress

### Backend Testing
- Unit tests with Jest
- API tests with Supertest
- Integration tests for database interactions
