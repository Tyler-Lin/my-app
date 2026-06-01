import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo, TodoFilter, TodoPriority, createTodo } from '../models/todo.model';
import { readFromStorage, writeToStorage } from '../../../shared/utils/local-storage.util';

const STORAGE_KEY = 'ng21-todos';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly _todos = signal<Todo[]>(readFromStorage<Todo[]>(STORAGE_KEY, []));
  private readonly _filter = signal<TodoFilter>('all');

  readonly todos = this._todos.asReadonly();
  readonly activeFilter = this._filter.asReadonly();

  readonly filteredTodos = computed<Todo[]>(() => {
    const filter = this._filter();
    const todos = this._todos();
    switch (filter) {
      case 'active':    return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default:          return todos;
    }
  });

  readonly activeCount    = computed(() => this._todos().filter(t => !t.completed).length);
  readonly completedCount = computed(() => this._todos().filter(t => t.completed).length);
  readonly totalCount     = computed(() => this._todos().length);
  readonly allCompleted   = computed(() => this.totalCount() > 0 && this.activeCount() === 0);

  constructor() {
    effect(() => {
      writeToStorage(STORAGE_KEY, this._todos());
    });
  }

  addTodo(title: string, priority: TodoPriority = 'medium'): void {
    if (!title.trim()) return;
    this._todos.update(todos => [...todos, createTodo(title, priority)]);
  }

  updateTodo(id: string, changes: Partial<Pick<Todo, 'title' | 'priority'>>): void {
    this._todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, ...changes, updatedAt: Date.now() } : t)
    );
  }

  toggleTodo(id: string): void {
    this._todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t)
    );
  }

  deleteTodo(id: string): void {
    this._todos.update(todos => todos.filter(t => t.id !== id));
  }

  clearCompleted(): void {
    this._todos.update(todos => todos.filter(t => !t.completed));
  }

  toggleAll(): void {
    const shouldComplete = !this.allCompleted();
    this._todos.update(todos =>
      todos.map(t => ({ ...t, completed: shouldComplete, updatedAt: Date.now() }))
    );
  }

  setFilter(filter: TodoFilter): void {
    this._filter.set(filter);
  }
}
