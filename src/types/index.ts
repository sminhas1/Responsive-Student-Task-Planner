export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  tags: string[];
}

export type TaskCategory = 'assignment' | 'exam' | 'project' | 'reading' | 'lab' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface TaskFilters {
  category?: TaskCategory;
  priority?: TaskPriority;
  status?: TaskStatus;
  search?: string;
}

export type ViewMode = 'list' | 'calendar' | 'dashboard';
