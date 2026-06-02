import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { readFromStorage, writeToStorage } from '../utils/local-storage.util';

const THEME_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly isDark = signal<boolean>(
    readFromStorage<boolean | null>(THEME_KEY, null) ??
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  constructor() {
    effect(() => {
      this.document.documentElement.classList.toggle('dark', this.isDark());
      writeToStorage(THEME_KEY, this.isDark());
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }
}
