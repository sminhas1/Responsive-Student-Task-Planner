import { useState, useEffect } from 'react';
import { Task, ViewMode } from './types';
import { loadTasks, saveTasks, generateId } from './utils/storage';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import Calendar from './components/Calendar';
import TaskModal from './components/TaskModal';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadedTasks = loadTasks();
    if (loadedTasks.length === 0) {
      const demoTasks = createDemoTasks();
      setTasks(demoTasks);
      saveTasks(demoTasks);
    } else {
      setTasks(loadedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;

    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id
        ? { ...task, ...taskData }
        : task
    );
    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        let newStatus: Task['status'];
        if (task.status === 'todo') {
          newStatus = 'in-progress';
        } else if (task.status === 'in-progress') {
          newStatus = 'completed';
        } else {
          newStatus = 'todo';
        }

        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      }
      return task;
    }));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewTask={handleNewTask}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard tasks={tasks} onTaskClick={handleEditTask} />
        )}
        {currentView === 'list' && (
          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
          />
        )}
        {currentView === 'calendar' && (
          <Calendar tasks={tasks} onTaskClick={handleEditTask} />
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </div>
  );
}

function createDemoTasks(): Task[] {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const twoWeeks = new Date(now);
  twoWeeks.setDate(twoWeeks.getDate() + 14);
  const twoWeeksStr = twoWeeks.toISOString().split('T')[0];

  return [
    {
      id: generateId(),
      title: 'Complete Web Development Assignment',
      description: 'Build a responsive web application using HTML, CSS, JavaScript, and React. Focus on clean code and user experience.',
      category: 'assignment',
      priority: 'high',
      status: 'in-progress',
      dueDate: tomorrowStr,
      createdAt: new Date().toISOString(),
      tags: ['web-dev', 'react'],
    },
    {
      id: generateId(),
      title: 'Study for Database Midterm',
      description: 'Review chapters 1-5, practice SQL queries, and understand normalization concepts.',
      category: 'exam',
      priority: 'urgent',
      status: 'todo',
      dueDate: nextWeekStr,
      createdAt: new Date().toISOString(),
      tags: ['database', 'sql'],
    },
    {
      id: generateId(),
      title: 'Read Chapter 8: Algorithms',
      description: 'Complete reading on sorting algorithms and analyze time complexity.',
      category: 'reading',
      priority: 'medium',
      status: 'todo',
      dueDate: today,
      createdAt: new Date().toISOString(),
      tags: ['algorithms'],
    },
    {
      id: generateId(),
      title: 'Complete Lab 3: Network Security',
      description: 'Implement encryption algorithms and test security protocols.',
      category: 'lab',
      priority: 'high',
      status: 'todo',
      dueDate: nextWeekStr,
      createdAt: new Date().toISOString(),
      tags: ['security', 'networking'],
    },
    {
      id: generateId(),
      title: 'Final Project Proposal',
      description: 'Submit project proposal for integrated computing systems course.',
      category: 'project',
      priority: 'urgent',
      status: 'in-progress',
      dueDate: tomorrowStr,
      createdAt: new Date().toISOString(),
      tags: ['capstone', 'proposal'],
    },
    {
      id: generateId(),
      title: 'Code Review Session',
      description: 'Participate in peer code review for software engineering class.',
      category: 'other',
      priority: 'medium',
      status: 'completed',
      dueDate: today,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      tags: ['team', 'review'],
    },
    {
      id: generateId(),
      title: 'API Integration Assignment',
      description: 'Integrate third-party APIs and implement authentication.',
      category: 'assignment',
      priority: 'medium',
      status: 'todo',
      dueDate: twoWeeksStr,
      createdAt: new Date().toISOString(),
      tags: ['api', 'backend'],
    },
  ];
}

export default App;
