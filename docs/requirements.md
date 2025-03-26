# ChartMaster Challenge - Requirements Documentation

## Project Overview
ChartMaster Challenge is an interactive trading education platform that uses TradingView charts to train users to recognize market structures through gamified challenges. The platform aims to help traders improve their skills in identifying key market patterns such as Break of Structure (BOS), Fair Value Gaps (FVG), Order Blocks (OB), and Liquidity Sweeps.

## Core Features

### 1. User Challenge Modes

#### a. Easy Mode (Quiz-Based)
- Load a read-only TradingView chart (via TradingView widget or image)
- Display multiple-choice questions related to the chart
- After submission, highlight the correct zone via image overlay or TradingView drawing layer
- Store user response, score, and completion time

#### b. Hard Mode (Drawing-Based)
- Load an interactive TradingView chart using their Charting Library
- Allow drawing using TradingView tools (line, rectangle, text)
- Prompt users to identify patterns by marking the chart
- On submission:
  - Compare drawn shapes to correct overlay (predefined)
  - Score based on position/accuracy
  - Provide visual feedback

### 2. Admin Panel (Backend + CMS)
- Upload or link custom TradingView charts
- Tag correct patterns/zones (e.g., FVG zones, BOS lines)
- Add custom multiple-choice questions for Easy Mode
- Assign difficulty level and strategy (FVG, OB, etc.)

### 3. Strategy Paths + Progress Tracking
- Users choose a strategy path (e.g., "Order Block Mastery")
- Each path has multiple challenges
- Backend tracks:
  - Completed challenges
  - Scores
  - Accuracy percentage
  - Time taken

### 4. Gamification System
- Scoring system:
  - Easy Mode: Based on correct answers
  - Hard Mode: Based on spatial accuracy + correct pattern identification
- Badges for milestones (e.g., "FVG Pro", "Sweeper Certified")
- Leaderboards: Overall & per strategy
- User Levels based on XP

### 5. Authentication + User Profile
- Signup/Login system
- User dashboard:
  - Progress overview
  - Strategy paths
  - Replay past challenges
  - Challenge history

## Technical Requirements

### Frontend
- Framework: Next.js (React-based framework)
- Chart Integration: TradingView Charting Library for interactive charts
- State Management: Redux or Context API
- Styling: Tailwind CSS or styled-components

### Backend
- Framework: Node.js with Express
- Database: PostgreSQL for structured data storage
- Authentication: Firebase Auth or Auth0
- File Storage: AWS S3 or similar for chart images

### Integration
- TradingView Charting Library API
- TradingView Widget API (for simpler chart displays)

### Deployment
- Frontend: Vercel
- Backend: Render or Heroku
- Database: Managed PostgreSQL service

## User Flow Examples

### Example 1: Easy Mode Challenge
1. User logs in
2. Selects "Liquidity Sweep" strategy path
3. Chooses an Easy Mode challenge
4. TradingView chart loads (read-only)
5. Multiple-choice question appears: "Where is the liquidity sweep in this chart?"
6. User selects an answer
7. System highlights correct area on chart
8. User receives score and feedback
9. Progress is saved to profile

### Example 2: Hard Mode Challenge
1. User logs in
2. Selects "Order Block" strategy path
3. Chooses a Hard Mode challenge
4. Interactive TradingView chart loads
5. Instruction appears: "Draw rectangles around all valid Order Blocks"
6. User uses drawing tools to mark areas
7. On submission, system overlays correct areas
8. Score is calculated based on accuracy of placement
9. User receives detailed feedback
10. Progress is saved to profile

## Market Structure Concepts
The platform will focus on teaching the following market structures:
- Break of Structure (BOS)
- Fair Value Gaps (FVG)
- Order Blocks (OB)
- Liquidity Sweeps
- Supply and Demand Zones
- Smart Money Concepts (SMC)
