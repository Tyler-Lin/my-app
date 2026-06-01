import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';

describe('TodoListComponent', () => {
  let fixture: ComponentFixture<TodoListComponent>;
  let component: TodoListComponent;
  let service: TodoService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TodoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows empty state when no todos', () => {
    const status: HTMLElement = fixture.nativeElement.querySelector('[role="status"]');
    expect(status).toBeTruthy();
  });

  it('shows add form when button is clicked', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    fixture.detectChanges();
    expect(component.showAddForm()).toBe(true);
    expect(fixture.nativeElement.querySelector('app-todo-form')).toBeTruthy();
  });

  it('hides add form on cancel', () => {
    component.showAddForm.set(true);
    fixture.detectChanges();
    component.showAddForm.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-todo-form')).toBeFalsy();
  });

  it('renders todo items from service', () => {
    service.addTodo('Task A');
    service.addTodo('Task B');
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('app-todo-item');
    expect(items.length).toBe(2);
  });

  it('renders filter buttons', () => {
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons.length).toBe(3);
  });

  it('calls setFilter when a filter button is clicked', () => {
    service.addTodo('Task');
    fixture.detectChanges();
    const spy = vi.spyOn(service, 'setFilter');
    const tabs: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    tabs[1].click(); // Active
    expect(spy).toHaveBeenCalledWith('active');
  });

  it('shows clear completed button only when there are completed todos', () => {
    service.addTodo('Task');
    service.toggleTodo(service.todos()[0].id);
    fixture.detectChanges();
    const clearBtn: HTMLElement = fixture.nativeElement.querySelector('button[aria-label]');
    const clearCompleted = (Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[])
      .find(b => b.textContent?.includes('Clear completed'));
    expect(clearCompleted).toBeTruthy();
  });

  it('calls toggleTodo when todo is toggled', () => {
    service.addTodo('Task');
    fixture.detectChanges();
    const spy = vi.spyOn(service, 'toggleTodo');
    service.toggleTodo(service.todos()[0].id);
    expect(spy).toHaveBeenCalled();
  });

  it('onAdd calls todoService.addTodo and hides form', () => {
    component.showAddForm.set(true);
    const spy = vi.spyOn(service, 'addTodo');
    component.onAdd({ title: 'New task', priority: 'low' });
    expect(spy).toHaveBeenCalledWith('New task', 'low');
    expect(component.showAddForm()).toBe(false);
  });

  it('onEdit calls todoService.updateTodo', () => {
    service.addTodo('Task');
    const id = service.todos()[0].id;
    const spy = vi.spyOn(service, 'updateTodo');
    component.onEdit({ id, title: 'Updated', priority: 'high' });
    expect(spy).toHaveBeenCalledWith(id, { title: 'Updated', priority: 'high' });
  });
});
