import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo, TodoPriority } from '../../models/todo.model';

export interface TodoFormValue {
  title: string;
  priority: TodoPriority;
}

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown.escape)': 'onCancel()',
  },
})
export class TodoFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly todo = input<Todo | null>(null);
  readonly submitted = output<TodoFormValue>();
  readonly cancelled = output<void>();

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    priority: ['medium' as TodoPriority, Validators.required],
  });

  readonly isEditMode = computed(() => this.todo() !== null);
  readonly submitLabel = computed(() => this.isEditMode() ? 'Save' : 'Add Todo');

  readonly priorities: { value: TodoPriority; label: string }[] = [
    { value: 'low',    label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high',   label: 'High' },
  ];

  constructor() {
    effect(() => {
      const todo = this.todo();
      if (todo) {
        this.form.setValue({ title: todo.title, priority: todo.priority });
      } else {
        this.form.reset({ title: '', priority: 'medium' });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitted.emit(this.form.getRawValue() as TodoFormValue);
    if (!this.isEditMode()) {
      this.form.reset({ title: '', priority: 'medium' });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
