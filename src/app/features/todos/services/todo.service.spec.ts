import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { TodoFilter } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('addTodo', () => {
    it('appends a new todo', () => {
      service.addTodo('Buy milk');
      expect(service.todos().length).toBe(1);
      expect(service.todos()[0].title).toBe('Buy milk');
      expect(service.todos()[0].completed).toBe(false);
    });

    it('trims whitespace from title', () => {
      service.addTodo('  Buy milk  ');
      expect(service.todos()[0].title).toBe('Buy milk');
    });

    it('ignores empty or whitespace-only titles', () => {
      service.addTodo('');
      service.addTodo('   ');
      expect(service.todos().length).toBe(0);
    });

    it('sets the given priority', () => {
      service.addTodo('Task', 'high');
      expect(service.todos()[0].priority).toBe('high');
    });

    it('defaults priority to medium', () => {
      service.addTodo('Task');
      expect(service.todos()[0].priority).toBe('medium');
    });
  });

  describe('toggleTodo', () => {
    it('flips completed state', () => {
      service.addTodo('Task');
      const id = service.todos()[0].id;
      service.toggleTodo(id);
      expect(service.todos()[0].completed).toBe(true);
      service.toggleTodo(id);
      expect(service.todos()[0].completed).toBe(false);
    });

    it('updates updatedAt', () => {
      service.addTodo('Task');
      const before = service.todos()[0].updatedAt;
      service.toggleTodo(service.todos()[0].id);
      expect(service.todos()[0].updatedAt).toBeGreaterThanOrEqual(before);
    });
  });

  describe('deleteTodo', () => {
    it('removes the todo by id', () => {
      service.addTodo('A');
      service.addTodo('B');
      const id = service.todos()[0].id;
      service.deleteTodo(id);
      expect(service.todos().length).toBe(1);
      expect(service.todos()[0].title).toBe('B');
    });
  });

  describe('updateTodo', () => {
    it('updates title and priority', () => {
      service.addTodo('Old title');
      const id = service.todos()[0].id;
      service.updateTodo(id, { title: 'New title', priority: 'high' });
      expect(service.todos()[0].title).toBe('New title');
      expect(service.todos()[0].priority).toBe('high');
    });
  });

  describe('clearCompleted', () => {
    it('removes only completed todos', () => {
      service.addTodo('A');
      service.addTodo('B');
      service.toggleTodo(service.todos()[0].id);
      service.clearCompleted();
      expect(service.todos().length).toBe(1);
      expect(service.todos()[0].title).toBe('B');
    });
  });

  describe('toggleAll', () => {
    it('completes all when not all are done', () => {
      service.addTodo('A');
      service.addTodo('B');
      service.toggleAll();
      expect(service.todos().every(t => t.completed)).toBe(true);
    });

    it('marks all active when all are completed', () => {
      service.addTodo('A');
      service.addTodo('B');
      service.toggleAll();
      service.toggleAll();
      expect(service.todos().every(t => !t.completed)).toBe(true);
    });
  });

  describe('computed: filteredTodos', () => {
    beforeEach(() => {
      service.addTodo('Active');
      service.addTodo('Done');
      service.toggleTodo(service.todos()[1].id);
    });

    it('all returns everything', () => {
      service.setFilter('all');
      expect(service.filteredTodos().length).toBe(2);
    });

    it('active returns only incomplete', () => {
      service.setFilter('active');
      expect(service.filteredTodos().length).toBe(1);
      expect(service.filteredTodos()[0].title).toBe('Active');
    });

    it('completed returns only done', () => {
      service.setFilter('completed');
      expect(service.filteredTodos().length).toBe(1);
      expect(service.filteredTodos()[0].title).toBe('Done');
    });
  });

  describe('computed: counts', () => {
    it('tracks activeCount and completedCount', () => {
      service.addTodo('A');
      service.addTodo('B');
      service.toggleTodo(service.todos()[0].id);
      expect(service.activeCount()).toBe(1);
      expect(service.completedCount()).toBe(1);
      expect(service.totalCount()).toBe(2);
    });
  });

  describe('computed: allCompleted', () => {
    it('is false when list is empty', () => {
      expect(service.allCompleted()).toBe(false);
    });

    it('is true only when all todos are completed', () => {
      service.addTodo('A');
      service.toggleTodo(service.todos()[0].id);
      expect(service.allCompleted()).toBe(true);
    });
  });

  describe('localStorage persistence', () => {
    it('writes to localStorage when todos change', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      service.addTodo('Persist me');
      TestBed.flushEffects();
      expect(spy).toHaveBeenCalled();
    });
  });
});
