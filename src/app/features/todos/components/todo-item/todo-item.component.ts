import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Todo, TodoPriority } from '../../models/todo.model';
import { TodoFormComponent, TodoFormValue } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo-item',
  imports: [TodoFormComponent],
  templateUrl: './todo-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  readonly todo = input.required<Todo>();
  readonly toggled = output<string>();
  readonly deleted  = output<string>();
  readonly edited   = output<{ id: string; title: string; priority: TodoPriority }>();

  readonly isEditing = signal(false);

  readonly priorityBadgeClass = computed(() => {
    switch (this.todo().priority) {
      case 'high':   return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default:       return 'bg-green-100 text-green-700';
    }
  });

  readonly titleClass = computed(() =>
    this.todo().completed ? 'line-through text-gray-400' : 'text-gray-800'
  );

  onEditSubmit(value: TodoFormValue): void {
    this.edited.emit({ id: this.todo().id, ...value });
    this.isEditing.set(false);
  }
}
