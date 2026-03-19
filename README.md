###### Responsive Student Task Planner ######

A production-quality, fully responsive web application for managing academic tasks and deadlines — built with React, TypeScript, and Tailwind CSS.

---

## Overview ##

This project demonstrates full-stack frontend development skills through a feature-rich student planner application. It showcases real-world patterns including component architecture, state management, data persistence, and responsive UI design — directly relevant to CSI 4160 (Integrated Computing Systems).

---

## Tech Stack

- **React 18** — Functional components, Hooks, component composition
- **TypeScript** — Full type safety across all components and utilities
- **Tailwind CSS** — Responsive, mobile-first styling
- **HTML5 / CSS3 / ES6+** — Semantic markup, modern JavaScript patterns
- **LocalStorage API** — Client-side data persistence
- **Vite** — Fast development build tool

---

## Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

Make sure you have the following installed before continuing:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js)

To check if they're installed, run:
```bash
node -v
npm -v
```

---

### Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/sminhas1/Responsive-Student-Task-Planner.git
```

**2. Navigate into the project folder**
```bash
cd Responsive-Student-Task-Planner
```

**3. Install dependencies**
```bash
npm install
```
> This installs all required packages listed in `package.json`. It may take a minute.

**4. Start the development server**
```bash
npm run dev
```

**5. Open the app in your browser**

Once the server starts, you'll see something like
```
VITE ready in 1821 ms
→ Local: http://localhost:5173/
```

Open your browser and go to: **http://localhost:5173/**

---

## Using the App

Once the app is open in your browser:

### Dashboard
- The **Dashboard** is the home view — it shows your task statistics, completion progress, and upcoming deadlines at a glance.

### Adding a Task
1. Click the **"Add Task"** button
2. Fill in the task name, category, priority, due date, and status
3. Click **Save** — your task will appear in the list immediately

### Task Categories
- Assignment, Exam, Project, Reading, Lab, Other

### Priority Levels
- Low, Medium, High, Urgent

### Filtering & Searching
- Use the **search bar** to find tasks by name
- Use the **filter dropdowns** to narrow by category, priority, or status

### Calendar View
- Click **Calendar** in the navigation to see your tasks laid out by month
- Tasks are color-coded by priority

### Data Persistence
- All tasks are **automatically saved** to your browser's LocalStorage
- Your data will still be there when you close and reopen the browser

---

## Stopping the Server

To stop the development server, go back to your terminal and press:
```
Ctrl + C
```

---

## Project Stats

| Metric | Value |
|---|---|
| Components | 6 major components |
| Lines of Code | 1,000+ |
| Features | 15+ |
| Bundle Size | 180KB (54KB gzipped) |
| Build Time | ~5 seconds |

---

## Relevance to Integrated Computing systems

This project directly addresses core Integrated Computing Systems competencies:

- **Component Integration** — Modular architecture with clear separation of concerns
- **State Management** — Centralized React state shared across multiple views
- **Data Persistence** — LocalStorage integration with automatic saving
- **System Design** — Scalable, maintainable codebase following industry best practices

---

## Author

**Shabeg Minhas** — [@sminhas1](https://github.com/sminhas1)
