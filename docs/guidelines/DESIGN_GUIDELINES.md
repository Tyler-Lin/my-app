# Design Guidelines

Angular 21 專案設計規範，基於現有 codebase 的實作模式整理。

---

## 專案結構

```
src/app/
  features/
    <feature>/
      components/     # UI 元件
      services/       # 商業邏輯與狀態
      models/         # 資料型別與 factory function
      <feature>.routes.ts
  shared/
    utils/            # 跨 feature 共用工具
  app.ts              # 根元件（只含 <router-outlet />）
  app.routes.ts       # 頂層路由
  app.config.ts       # 全域 providers
```

每個 feature 自給自足，`shared/` 只放真正跨 feature 的東西。

---

## 元件規範

### 基本結構

```typescript
@Component({
  selector: 'app-xxx',
  imports: [...],
  templateUrl: './xxx.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XxxComponent {
  private readonly service = inject(XxxService);

  readonly someInput = input.required<Type>();
  readonly someOutput = output<Type>();

  readonly derivedValue = computed(() => this.someInput().field);
}
```

**規則：**
- 不加 `standalone: true`（Angular 20+ 預設）
- 一律 `ChangeDetectionStrategy.OnPush`
- 用 `inject()` 注入，不用 constructor 參數
- Host 事件綁定放 `host: {}` 物件，不用 `@HostListener`

### 輸入輸出

```typescript
// ✓ 正確
readonly todo = input.required<Todo>();
readonly submitted = output<TodoFormValue>();

// ✗ 不用
@Input() todo!: Todo;
@Output() submitted = new EventEmitter<TodoFormValue>();
```

### 模板語法

```html
<!-- ✓ 原生控制流 -->
@if (isLoading()) { <spinner /> }
@for (item of items(); track item.id) { ... }
@switch (status()) { @case ('active') { ... } }

<!-- ✗ 不用 -->
<div *ngIf="isLoading">
<div *ngFor="let item of items">
```

```html
<!-- ✓ class/style 綁定 -->
<div [class]="computedClass()">
<div [class.active]="isActive()">

<!-- ✗ 不用 -->
<div [ngClass]="...">
<div [ngStyle]="...">
```

---

## 狀態管理

### Service 模式

```typescript
@Injectable({ providedIn: 'root' })
export class FeatureService {
  // 私有可寫 signal
  private readonly _items = signal<Item[]>(readFromStorage(KEY, []));

  // 公開唯讀
  readonly items = this._items.asReadonly();

  // 衍生狀態用 computed
  readonly activeCount = computed(() => this._items().filter(i => !i.done).length);

  constructor() {
    // 副作用（例如 localStorage sync）用 effect
    effect(() => writeToStorage(KEY, this._items()));
  }

  // 更新用 update()，回傳新陣列，不 mutate
  addItem(title: string): void {
    this._items.update(items => [...items, createItem(title)]);
  }
}
```

**規則：**
- 元件本地 UI 狀態用 `signal()`
- 衍生狀態用 `computed()`，不要儲存成可寫 signal
- 更新用 `update(items => [...items, newItem])`，禁用 `mutate()`
- 副作用（persist、log）放 `effect()`

---

## 資料模型

```typescript
// models/feature.model.ts
export type Priority = 'low' | 'medium' | 'high';

export interface Item {
  id: string;
  title: string;
  priority: Priority;
  createdAt: number;  // Date.now()，不用 Date 物件（JSON-safe）
}

// Factory function 確保一致的初始化
export function createItem(title: string, priority: Priority = 'medium'): Item {
  return { id: crypto.randomUUID(), title: title.trim(), priority, createdAt: Date.now() };
}
```

---

## 表單

```typescript
private readonly fb = inject(FormBuilder);

readonly form = this.fb.nonNullable.group({
  title: ['', [Validators.required, Validators.maxLength(200)]],
  priority: ['medium' as Priority, Validators.required],
});
```

- 用 `FormBuilder.nonNullable`，reset 後值不會變 null
- input signal 變化時用 `effect()` 同步 form 值
- 提交前先檢查 `this.form.invalid`

---

## 路由

```typescript
// app.routes.ts — 頂層 lazy load feature routes
{
  path: 'todos',
  loadChildren: () => import('./features/todos/todos.routes').then(m => m.todoRoutes),
}

// todos.routes.ts — feature 內 lazy load component
{
  path: '',
  loadComponent: () => import('./components/todo-list/todo-list.component').then(m => m.TodoListComponent),
}
```

---

## 樣式

- Tailwind CSS v4，utility-first
- 動態 class 用 `computed()` 計算字串，再用 `[class]="computedClass()"` 綁定
- 單一條件切換用 `[class.active]="condition"`
- 不寫 inline `style` 屬性，不用 `ngStyle`

---

## 可及性（Accessibility）

每個元件都需符合 WCAG AA：

- 表單欄位必須有 `<label>` 或 `aria-label`
- 錯誤訊息用 `aria-describedby` + `role="alert"`
- 動態內容更新用 `aria-live="polite"`
- 互動清單用正確語意標籤（`role="tablist"` + `role="tab"` + `aria-selected`）
- 所有互動元素可鍵盤操作，有可見 focus 樣式（`focus:ring-*`）

---

## 測試

```typescript
describe('FeatureService', () => {
  let service: FeatureService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureService);
  });

  it('should ...', () => {
    service.addItem('Task');
    TestBed.flushEffects();  // effect() 是非同步，需手動 flush
    expect(service.items().length).toBe(1);
  });
});
```

- 執行：`npm test`（Vitest via Angular CLI）
- 元件測試用 `fixture.componentRef.setInput()` 設定 `input()` 值
- Signal 呼叫加括號：`component.isEditMode()`
- `effect()` 測試後記得 `TestBed.flushEffects()`

---

## TypeScript

- `strict: true`，不用 `any`，不確定的型別用 `unknown`
- Template 用 `strictTemplates: true`
- 公開 API 明確標 `readonly`
- 枚舉值用 union type：`type Status = 'active' | 'done'`
