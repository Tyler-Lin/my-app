import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoFilter, TodoPriority } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent, TodoFormValue } from '../todo-form/todo-form.component';

interface FilterOption {
  value: TodoFilter;
  label: string;
}

@Component({
  selector: 'app-todo-list',
  imports: [TodoItemComponent, TodoFormComponent],
  templateUrl: './todo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  readonly todoService = inject(TodoService);

  readonly showAddForm = signal(false);

  readonly filters: FilterOption[] = [
    { value: 'all',       label: 'All' },
    { value: 'active',    label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  onAdd(value: TodoFormValue): void {
    this.todoService.addTodo(value.title, value.priority as TodoPriority);
    this.showAddForm.set(false);
  }

  onEdit(event: { id: string; title: string; priority: TodoPriority }): void {
    this.todoService.updateTodo(event.id, { title: event.title, priority: event.priority });
  }
}
