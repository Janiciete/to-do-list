# Task Manager App

A beautiful, dreamy task management application built with Electron, React, and Tailwind CSS.

## Features

- **3-Panel Layout**:
  - Left: Task input form with full customization
  - Middle: Interactive calendar view (toggle between week/month)
  - Right: Organized task list sorted by due date and importance

- **Task Management**:
  - Add tasks with titles, descriptions, and due dates
  - Mark tasks as important (starred)
  - Complete tasks with a satisfying ding sound
  - Delete tasks when no longer needed

- **Recurring Tasks**:
  - Create tasks that repeat on custom intervals
  - Support for daily, weekly, and monthly recurrence
  - Automatic generation of new task instances upon completion

- **Dreamy Aesthetic**:
  - Animated gradient background
  - Glassmorphism effects with backdrop blur
  - Smooth transitions and micro-interactions
  - Elegant hover effects and animations

- **Smart Organization**:
  - Visual status indicators (overdue, urgent, normal, completed)
  - Automatic sorting by importance and due date
  - Calendar view shows tasks on their scheduled dates
  - Persistent storage using localStorage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the App

#### Development Mode

To run in development mode with hot reload:

```bash
npm run electron:dev
```

This will start both the Vite dev server and the Electron app.

#### Alternative: Run separately

1. Start the Vite dev server:
```bash
npm run dev
```

2. In another terminal, start Electron:
```bash
npm run electron
```

### Building for Production

1. Build the React app:
```bash
npm run build
```

2. Build the Electron app:
```bash
npm run electron:build
```

The packaged application will be in the `release` folder.

## Usage

1. **Adding a Task**: Fill out the form in the left panel with task details, due date, and optional recurrence settings.

2. **Viewing Tasks**:
   - Use the calendar in the middle to see tasks by date
   - Toggle between week and month views
   - Click on tasks in the calendar to mark them complete

3. **Managing Tasks**:
   - Click the circle next to a task to mark it complete (plays a ding!)
   - Click the star to toggle importance
   - Click the trash icon to delete a task

4. **Recurring Tasks**: When you complete a recurring task, a new instance is automatically created for the next occurrence.

## Tech Stack

- **Electron**: Desktop application framework
- **React**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **date-fns**: Date manipulation library
