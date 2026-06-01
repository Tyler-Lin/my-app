import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  {
    path: 'todos',
    loadChildren: () =>
      import('./features/todos/todos.routes').then(m => m.todoRoutes),
  },
];
