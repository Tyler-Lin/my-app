# Dark Mode 功能規劃

## 設定 Tailwind Dark Mode
在專案啟用 Tailwind CSS v4 的 dark mode 支援，採用 class 策略（手動切換）。

- 在 `src/styles.css` 加上 dark mode variant 設定
- 在 `app.ts` 或 `app.config.ts` 加入切換 dark mode 的機制（在 `<html>` 加上 `dark` class）
- 參考 `docs/guidelines/UI_GUIDELINES.md` 的 dark mode 色彩對應表

## 新增 Dark Mode 切換按鈕
在 TodoList 頁面右上角加入 light/dark 切換按鈕，讓使用者可以手動切換。

- 用 signal 管理目前的 theme 狀態
- 切換時在 `<html>` 加上或移除 `dark` class
- 偏好設定存入 localStorage，下次進入時自動套用
- 按鈕用日/夜圖示（SVG），需有 `aria-label`

## TodoListComponent 套用 Dark Mode 樣式
為 `src/app/features/todos/components/todo-list/todo-list.component.html` 加上 dark mode 樣式。

- 頁面背景：`dark:bg-gray-950`
- 標題文字：`dark:text-gray-50`
- 說明文字：`dark:text-gray-400`
- Filter tab 容器：`dark:bg-gray-800`
- Active tab：`dark:bg-gray-700 dark:text-blue-400`
- 參考 `docs/guidelines/UI_GUIDELINES.md` 的完整對應表

## TodoItemComponent 套用 Dark Mode 樣式
為 `src/app/features/todos/components/todo-item/todo-item.component.html` 加上 dark mode 樣式。

- Item hover 背景：`dark:hover:bg-gray-800`
- 標題文字（active）：`dark:text-gray-100`
- 標題文字（completed）：`dark:text-gray-600`
- Priority badge：改用深色系（`dark:bg-red-900 dark:text-red-300` 等）
- Icon button hover：`dark:hover:text-blue-400` / `dark:hover:text-red-400`

## TodoFormComponent 套用 Dark Mode 樣式
為 `src/app/features/todos/components/todo-form/todo-form.component.html` 加上 dark mode 樣式。

- 表單容器：`dark:bg-gray-900 dark:border-gray-700`
- Label 文字：`dark:text-gray-300`
- Input：`dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100`
- Secondary button：`dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`
