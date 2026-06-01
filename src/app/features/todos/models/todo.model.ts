export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: number;
  updatedAt: number;
}

export function createTodo(title: string, priority: TodoPriority = 'medium'): Todo {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    priority,
    createdAt: now,
    updatedAt: now,
  };
}
