import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { createTodo } from '../../models/todo.model';

describe('TodoFormComponent', () => {
  let fixture: ComponentFixture<TodoFormComponent>;
  let component: TodoFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is in add mode when todo input is null', () => {
    expect(component.isEditMode()).toBe(false);
    expect(component.submitLabel()).toBe('Add Todo');
  });

  it('is in edit mode when todo input is provided', async () => {
    const todo = createTodo('Test task', 'high');
    fixture.componentRef.setInput('todo', todo);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isEditMode()).toBe(true);
    expect(component.submitLabel()).toBe('Save');
    expect(component.form.value.title).toBe('Test task');
    expect(component.form.value.priority).toBe('high');
  });

  it('emits submitted with form values on valid submit', () => {
    const emitted: unknown[] = [];
    component.submitted.subscribe(v => emitted.push(v));
    component.form.setValue({ title: 'New task', priority: 'low' });
    component.onSubmit();
    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ title: 'New task', priority: 'low' });
  });

  it('does not emit submitted when form is invalid', () => {
    const emitted: unknown[] = [];
    component.submitted.subscribe(v => emitted.push(v));
    component.form.setValue({ title: '', priority: 'medium' });
    component.onSubmit();
    expect(emitted.length).toBe(0);
  });

  it('emits cancelled when cancel is clicked', () => {
    const emitted: unknown[] = [];
    component.cancelled.subscribe(() => emitted.push(true));
    component.onCancel();
    expect(emitted.length).toBe(1);
  });

  it('emits cancelled on Escape key via host binding', () => {
    const emitted: unknown[] = [];
    component.cancelled.subscribe(() => emitted.push(true));
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    fixture.nativeElement.dispatchEvent(event);
    expect(emitted.length).toBe(1);
  });

  it('resets the form after adding in non-edit mode', () => {
    component.form.setValue({ title: 'Task', priority: 'high' });
    component.onSubmit();
    expect(component.form.value.title).toBe('');
    expect(component.form.value.priority).toBe('medium');
  });
});
