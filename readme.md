# Lift Logger (MERN Stack)

NOTE: I am currently rewriting the backend from NodeJS to Go (using Gin).

A full-stack workout tracking application built with the **MERN** stack (MongoDB, Express, React, Node.js). This app allows users to log, view, update, and delete their workouts using a **RESTful API** backend and a dynamic **React** frontend.

## Key Features
- **Workout Tracking**: Users can create, read, update, and delete workout records.
- **RESTful API**: Built with **Node.js** and **Express**, offering full CRUD functionality for workouts.
- **Responsive UI**: Developed with **React** and **CSS** for a seamless and intuitive user interface.

## Tech Stack
- **Frontend**: 
  - React
  - TypeScript
  - CSS
- **Backend**: 
  - Node.js
  - Express
  - RESTful API
- **Database**: 
  - MongoDB (NoSQL database)  

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (for local development or connection to a cloud MongoDB provider like Atlas)

### Installation
1. Clone the repository:
  ```bash
  git clone https://github.com/samuelberven/lift-logger.git
  cd lift-logger
  ```

2. Install the dependencies:
- Backend:
  ```bash
  cd backend
  npm install
  ```
- Frontend:
  ```bash
  cd frontend
  npm install
  ```
3. Set up the environment variables:
- Create a .env file in the backend folder and configure the MongoDB URI:
  ```makefile
  MONGODB_URI=your_mongodb_connection_string
  ```
4. Run the application:
- Start the backend:
  ```bash
  cd backend
  npm run dev
  ```
- Start the frontend:
  ```bash
  cd frontend
  npm start
  ```
Visit http://localhost:3000 in your browser to view the app.

## Project Structure
  ```bash
  workout-tracker/
  │
  ├── backend/              # Node.js + Express API
  │   ├── controllers/      # Workout API logic
  │   ├── models/           # PostgreSQL schema and queries
  │   ├── routes/           # API routes
  │   └── server.js         # Entry point for the backend
  │
  ├── frontend/             # React front-end
  │   ├── components/       # React components (e.g., WorkoutList, AddWorkout)
  │   ├── pages/            # React pages (e.g., Home, Login)
  │   └── App.tsx           # Entry point for React app
  │
  ├── .env                  # Environment variables (e.g., DB credentials)
  └── README.md             # Project documentation
  ```

## Future Improvements
- Quote of the Day: Display random motivational quotes or workout tips to users.
- Mobile Version: Extend the app to mobile platforms (starting with React Native).
- Implement JWT-based authentication
- User Profile Customization: Add the ability for users to personalize their workout plans and progress tracking.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
