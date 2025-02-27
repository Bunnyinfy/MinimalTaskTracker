
# Task Manager

A full-stack web application for managing tasks with user authentication, priority levels, categories, and deadlines.

## Features

- **User Authentication**: Secure login and registration with password hashing
- **Task Management**: Create, update, and delete tasks
- **Task Organization**: Categorize tasks with priorities, deadlines, and categories
- **Task Reminders**: Set reminders for upcoming tasks
- **Responsive UI**: Modern interface that works on desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Wouter for routing
- Shadcn/UI components
- Tailwind CSS for styling
- Framer Motion for animations

### Backend
- Express.js server
- Passport.js for authentication
- PostgreSQL database (via Neon)
- Drizzle ORM for database operations
- Zod for schema validation

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL database

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string

4. Run the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user
- `POST /api/logout` - Logout the current user
- `GET /api/user` - Get the current user

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express API
- `/shared` - Shared types and schemas
- `schema.ts` - Database schema and validation using Drizzle and Zod

This application is configured for deployment on Replit:

1. Create a new Repl with this repository
2. Set up the DATABASE_URL environment variable in the Secrets tool
3. Run the application with the Run button
4. Deploy using Replit's Deployment feature
