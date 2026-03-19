import { Task } from '../types';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, BookOpen, Calendar } from 'lucide-react';
import { isOverdue, getDaysUntil, formatDate } from '../utils/dateHelpers';

interface DashboardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function Dashboard({ tasks, onTaskClick }: DashboardProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && isOverdue(t.dueDate)).length;

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed' && !isOverdue(t.dueDate))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Overview of your academic tasks and progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Total Tasks"
          value={totalTasks}
          color="bg-blue-500"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          label="Completed"
          value={completedTasks}
          color="bg-green-500"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="In Progress"
          value={inProgressTasks}
          color="bg-yellow-500"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Overdue"
          value={overdueTasks}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming tasks. Great job!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <p className="text-sm text-gray-600 truncate">{task.description}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-medium text-gray-900">{formatDate(task.dueDate)}</div>
                    <div className="text-xs text-gray-500">{getDaysUntil(task.dueDate)} days</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Progress</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                  <span className="text-sm font-bold text-blue-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <ProgressItem label="To Do" count={todoTasks} color="bg-gray-400" />
                <ProgressItem label="In Progress" count={inProgressTasks} color="bg-yellow-400" />
                <ProgressItem label="Completed" count={completedTasks} color="bg-green-400" />
              </div>
            </div>
          </div>

          {urgentTasks > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-sm border border-red-200 p-6">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 rounded-lg p-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Urgent Attention</h3>
                  <p className="text-sm text-red-700">
                    You have {urgentTasks} urgent {urgentTasks === 1 ? 'task' : 'tasks'} requiring immediate attention.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} text-white rounded-lg p-3`}>
          {icon}
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
      {priority}
    </span>
  );
}

function ProgressItem({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">{count}</span>
    </div>
  );
}
