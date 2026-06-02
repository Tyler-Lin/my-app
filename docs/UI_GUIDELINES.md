# UI Design Guidelines

視覺設計規範，涵蓋色彩、typography、元件、間距、互動狀態與 dark mode 考量。

---

## 色彩系統

### Light Mode

| 用途 | Token | Tailwind |
|---|---|---|
| 主要行動（按鈕、連結、選取） | Primary | `blue-600` |
| 主要行動 hover | Primary Hover | `blue-700` |
| Focus ring | Focus | `blue-500` |
| 危險行動（刪除） | Danger | `red-500` / `red-600` |
| 危險 hover | Danger Hover | `red-700` |
| 頁面背景 | Surface | `gray-50` |
| 卡片、表單背景 | Surface Raised | `white` |
| 次要背景（tab bar） | Surface Muted | `gray-100` |
| Hover 背景 | Surface Hover | `gray-50` / `blue-50` |

### 文字層級

| 層級 | 用途 | Tailwind |
|---|---|---|
| Primary | 標題、主要內容 | `text-gray-900` |
| Secondary | 標籤、表單文字 | `text-gray-700` |
| Tertiary | 說明文字、計數 | `text-gray-500` |
| Disabled / Placeholder | 空狀態、禁用 | `text-gray-400` |
| On Primary | 主色按鈕上的文字 | `text-white` |
| Error | 驗證錯誤 | `text-red-600` |
| Link / Active | 連結、選取狀態 | `text-blue-700` |

### Priority Badge 色彩

| Priority | 背景 | 文字 |
|---|---|---|
| High | `bg-red-100` | `text-red-700` |
| Medium | `bg-yellow-100` | `text-yellow-700` |
| Low | `bg-green-100` | `text-green-700` |

---

### Dark Mode 對應

採用 Tailwind `dark:` variant，整體策略：灰階反轉，主色調整亮度。

| Light | Dark |
|---|---|
| `bg-gray-50`（頁面背景） | `dark:bg-gray-950` |
| `bg-white`（卡片） | `dark:bg-gray-900` |
| `bg-gray-100`（次要背景） | `dark:bg-gray-800` |
| `text-gray-900` | `dark:text-gray-50` |
| `text-gray-700` | `dark:text-gray-300` |
| `text-gray-500` | `dark:text-gray-400` |
| `text-gray-400` | `dark:text-gray-600` |
| `border-gray-200` / `border-gray-300` | `dark:border-gray-700` |
| `blue-600`（主色） | `dark:blue-400`（亮度提高以確保對比） |
| `red-500` / `red-600` | `dark:red-400` |

> **對比度要求**：所有文字與背景的對比度須達 WCAG AA 標準（正文 4.5:1，大字 3:1）。

---

## Typography

| 用途 | Classes |
|---|---|
| 頁面標題 H1 | `text-4xl font-bold tracking-tight` |
| Section 標題 H2 | `text-lg font-semibold` |
| 表單 Label | `text-sm font-medium` |
| 主要內文 | `text-sm` |
| 輔助文字、badge | `text-xs` |
| 行動連結（underline） | `text-xs underline` |

---

## 間距系統

| 用途 | Classes |
|---|---|
| 頁面容器寬度 | `max-w-xl mx-auto` |
| 頁面內距 | `px-4 py-10` |
| Section 間距 | `mb-8` |
| 區塊間距 | `mb-4` |
| 子區塊間距 | `mb-3` |
| 卡片 / 表單內距 | `p-4` |
| List item 內距 | `p-3` |
| 主要 flex gap | `gap-3` |
| 按鈕組 gap | `gap-2` |
| List gap | `gap-1` |

---

## 元件規範

### Button

| 類型 | 用途 | Classes |
|---|---|---|
| Primary | 主要行動（送出、儲存） | `px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500` |
| Secondary | 次要行動（取消） | `px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400` |
| Ghost | 文字行動（全選、清除） | `text-xs text-gray-500 hover:text-gray-800 underline focus:outline-none focus:ring-2 focus:ring-gray-400 rounded` |
| Danger Ghost | 危險文字行動（刪除） | `text-xs text-red-500 hover:text-red-700 underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded` |
| Icon | 圖示按鈕（編輯、刪除） | `p-1 text-gray-400 hover:text-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500` |

**Dark mode 補充：**
- Primary: 不變（藍底白字對比足夠）
- Secondary: `dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`
- Ghost: `dark:text-gray-400 dark:hover:text-gray-100`

### Input

```
px-3 py-2 border rounded-md text-sm
focus:outline-none focus:ring-2 focus:ring-blue-500
```

| 狀態 | Border |
|---|---|
| 預設 | `border-gray-300` |
| Focus | `ring-2 ring-blue-500`（border 不變） |
| Error | `border-red-400` + `aria-invalid="true"` |

**Dark mode：** `dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500`

### Badge（Priority）

```
px-2 py-0.5 text-xs font-medium rounded-full
```

Dark mode：背景不透明度降低或改用深色系（`dark:bg-red-900 dark:text-red-300`）。

### Card / 表單容器

```
bg-white border border-gray-200 rounded-lg shadow-sm p-4
```

**Dark mode：** `dark:bg-gray-900 dark:border-gray-700`

### Tab / Filter Bar

| 狀態 | Classes |
|---|---|
| 容器 | `flex gap-1 p-1 bg-gray-100 rounded-lg` |
| Active tab | `bg-white font-medium text-blue-700 shadow-sm rounded-md` |
| Inactive tab | `text-gray-500` |

**Dark mode：** 容器 `dark:bg-gray-800`，active `dark:bg-gray-700 dark:text-blue-400`

---

## 互動狀態

### Focus
所有可互動元素必須有可見的 focus 樣式：
```
focus:outline-none focus:ring-2 focus:ring-[color]-500
```
- 主要行動 → `ring-blue-500`
- 危險行動 → `ring-red-500`
- 次要行動 → `ring-gray-400`

### Hover
- 行動按鈕：顏色加深（`blue-600` → `blue-700`）
- List item：`hover:bg-gray-50`（dark: `dark:hover:bg-gray-800`）
- Icon button：`text-gray-400` → `text-blue-600` 或 `text-red-600`

### Progressive Disclosure（漸進顯示）
次要操作（編輯、刪除）預設隱藏，hover 才出現：
```
opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity
```
確保鍵盤使用者也能觸發（`focus-within`）。

### Disabled
```
disabled:opacity-50 disabled:cursor-not-allowed
```

### Transitions
- 顏色變化：`transition-colors`
- 透明度變化：`transition-opacity`

---

## 圖示

- 來源：Heroicons（stroke 風格）
- 尺寸：`w-4 h-4`（一律小尺寸）
- 顏色：`currentColor`（繼承父元素）
- 必須加 `aria-hidden="true"`（裝飾性圖示不讀給 screen reader）

---

## 設計原則

1. **Minimal** — 灰底藍色調，避免過多顏色干擾
2. **Accessible** — 所有互動可鍵盤操作，focus ring 永遠可見，顏色不是唯一資訊來源
3. **Consistent** — 相同用途使用相同的間距、顏色、圓角
4. **Progressive Disclosure** — 次要操作 hover 才顯示，保持介面整潔
5. **Dark Mode Ready** — 新元件實作時同步加上 `dark:` variant
