import { useState } from 'react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getMonthDates } from '../utils/dateHelpers';

interface CalendarProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function Calendar({ tasks, onTaskClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDates = getMonthDates(year, month);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Calendar</h2>
          <p className="text-gray-600 mt-1">View your tasks in calendar format</p>
        </div>

        <button
          onClick={goToToday}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Today
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              {monthNames[month]} {year}
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {monthDates.map((date, index) => {
              const dateTasks = getTasksForDate(date);
              const today = isToday(date);
              const currentMonth = isCurrentMonth(date);

              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 rounded-lg border transition-all ${
                    today
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                      : currentMonth
                      ? 'bg-white border-gray-200 hover:border-gray-300'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    today
                      ? 'text-blue-600'
                      : currentMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}>
                    {date.getDate()}
                  </div>

                  <div className="space-y-1">
                    {dateTasks.slice(0, 3).map(task => (
                      <button
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className={`w-full text-left text-xs px-2 py-1 rounded truncate transition-colors ${
                          task.priority === 'urgent'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : task.priority === 'high'
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : task.priority === 'medium'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}
                      >
                        {task.title}
                      </button>
                    ))}
                    {dateTasks.length > 3 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{dateTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Legend</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LegendItem color="bg-red-100 text-red-700" label="Urgent Priority" />
          <LegendItem color="bg-orange-100 text-orange-700" label="High Priority" />
          <LegendItem color="bg-blue-100 text-blue-700" label="Medium Priority" />
          <LegendItem color="bg-gray-100 text-gray-700" label="Low Priority" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${color}`} />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
