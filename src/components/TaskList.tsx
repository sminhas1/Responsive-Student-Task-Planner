import { useState } from 'react';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../types';
import { Search, Filter, CheckCircle2, Circle, Clock, Edit2, Trash2 } from 'lucide-react';
import { formatDate, isOverdue } from '../utils/dateHelpers';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function TaskList({ tasks, onEditTask, onDeleteTask, onToggleStatus }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Tasks</h2>
        <p className="text-gray-600 mt-1">Manage and organize your academic tasks</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Categories</option>
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
              <option value="project">Project</option>
              <option value="reading">Reading</option>
              <option value="lab">Lab</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'createdAt')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="createdAt">Sort by Created</option>
            </select>
          </div>
        </div>

        {(searchQuery || filterCategory !== 'all' || filterPriority !== 'all' || filterStatus !== 'all') && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>{filteredTasks.length} tasks found</span>
          </div>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {searchQuery || filterCategory !== 'all' || filterPriority !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              onToggleStatus={() => onToggleStatus(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onToggleStatus }: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const overdue = task.status !== 'completed' && isOverdue(task.dueDate);

  const priorityColors = {
    low: 'border-l-gray-400 bg-gray-50',
    medium: 'border-l-blue-400 bg-blue-50',
    high: 'border-l-orange-400 bg-orange-50',
    urgent: 'border-l-red-400 bg-red-50',
  };

  const categoryIcons = {
    assignment: '📝',
    exam: '📊',
    project: '🚀',
    reading: '📚',
    lab: '🔬',
    other: '📌',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 border-gray-200 hover:shadow-md transition-all ${priorityColors[task.priority]}`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <button
            onClick={onToggleStatus}
            className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : task.status === 'in-progress' ? (
              <Clock className="w-6 h-6 text-yellow-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
                <span className="text-xl">{categoryIcons[task.category]}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className={`text-sm mb-3 ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <PriorityBadge priority={task.priority} />
              <CategoryBadge category={task.category} />
              <StatusBadge status={task.status} />

              <div className={`flex items-center gap-1 text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                <Clock className="w-4 h-4" />
                <span>{formatDate(task.dueDate)}</span>
                {overdue && <span className="text-xs">(Overdue)</span>}
              </div>

              {task.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded ${colors[priority as keyof typeof colors]}`}>
      {priority.toUpperCase()}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-700">
      {category}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    'todo': 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    'completed': 'bg-green-100 text-green-700',
  };

  const labels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'completed': 'Completed',
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded ${colors[status as keyof typeof colors]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}
