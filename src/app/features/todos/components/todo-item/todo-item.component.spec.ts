import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { createTodo } from '../../models/todo.model';

describe('TodoItemComponent', () => {
  let fixture: ComponentFixture<TodoItemComponent>;
  let component: TodoItemComponent;

  const mockTodo = createTodo('Test task', 'high');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('todo', mockTodo);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders todo title', () => {
    const label: HTMLElement = fixture.nativeElement.querySelector('label');
    expect(label.textContent?.trim()).toBe('Test task');
  });

  it('renders priority badge', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(badge.textContent?.trim()).toBe('high');
  });

  it('emits toggled with todo id when checkbox changes', () => {
    const emitted: string[] = [];
    component.toggled.subscribe(id => emitted.push(id));
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    checkbox.dispatchEvent(new Event('change'));
    expect(emitted).toEqual([mockTodo.id]);
  });

  it('emits deleted with todo id when delete button clicked', () => {
    const emitted: string[] = [];
    component.deleted.subscribe(id => emitted.push(id));
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
    const deleteBtn = Array.from(buttons).find(b => b.getAttribute('aria-label')?.startsWith('Delete'));
    deleteBtn?.click();
    expect(emitted).toEqual([mockTodo.id]);
  });

  it('shows edit form when edit button is clicked', () => {
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
    const editBtn = Array.from(buttons).find(b => b.getAttribute('aria-label')?.startsWith('Edit'));
    editBtn?.click();
    fixture.detectChanges();
    expect(component.isEditing()).toBe(true);
    const form = fixture.nativeElement.querySelector('app-todo-form');
    expect(form).toBeTruthy();
  });

  it('hides edit form on cancel', () => {
    component.isEditing.set(true);
    fixture.detectChanges();
    component.isEditing.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-todo-form')).toBeFalsy();
  });

  it('emits edited and closes form on submit', () => {
    const emitted: unknown[] = [];
    component.edited.subscribe(v => emitted.push(v));
    component.onEditSubmit({ title: 'Updated', priority: 'low' });
    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ id: mockTodo.id, title: 'Updated', priority: 'low' });
    expect(component.isEditing()).toBe(false);
  });

  it('priorityBadgeClass is red for high priority', () => {
    expect(component.priorityBadgeClass()).toContain('red');
  });

  it('titleClass applies line-through when completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    fixture.componentRef.setInput('todo', completedTodo);
    fixture.detectChanges();
    expect(component.titleClass()).toContain('line-through');
  });
});
