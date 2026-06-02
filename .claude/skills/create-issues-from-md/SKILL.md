---
name: create-issues-from-md
description: 當使用者提供一個 markdown 檔案路徑（通常在 docs/requirements/ 下），讀取其中每個 ## 標題作為 issue title、標題下的內文作為 issue body，自動建立 GitHub issues 並加入 GitHub Project。使用者說「把這個 md 開成卡片」、「從需求文件建立 issues」、「幫我把規劃文件加進 project」、「把 backlog 加進去」時觸發。
---

## 基本資訊

- **Owner**: `Tyler-Lin`
- **Repo**: `my-app`
- **Project ID**: `PVT_kwHOAouLzM4BZXDB`

---

## 流程

### 1. 取得 md 檔案路徑

從使用者輸入取得檔案路徑，用 Read 工具讀取內容。

### 2. 解析需求

解析規則：
- `#` 開頭的行 → 文件標題，**跳過**，不建立 issue
- `##` 開頭的行 → issue **title**
- `##` 標題到下一個 `##` 之間的內文 → issue **body**
- 忽略空白行和文件開頭的非標題內容

範例解析：
```
# Q3 規劃          → 跳過

## 新增搜尋功能     → title: "新增搜尋功能"
讓使用者可以...     → body 開始
- 搜尋框放在...     → body 繼續

## 加入標籤系統     → title: "加入標籤系統"（前一個 body 結束）
每個 todo 可以...   → body 開始
```

解析完後列出所有即將建立的 issues 讓使用者確認，**等確認後才繼續**：

```
即將建立以下 issues：
1. 新增搜尋功能
2. 加入標籤系統
3. ...

確認建立嗎？
```

### 3. 逐一建立 issue 並加入 Project

對每個解析出的需求，依序執行：

**步驟 a — 建立 GitHub issue**

```bash
gh issue create \
  --title "<title>" \
  --body "<body>" \
  --repo Tyler-Lin/my-app
```

指令會回傳 issue URL（例如 `https://github.com/Tyler-Lin/my-app/issues/5`），從 URL 取出 issue number。

**步驟 b — 取得 issue node_id**

```bash
gh api repos/Tyler-Lin/my-app/issues/<number> --jq '.node_id'
```

**步驟 c — 加入 Project**

```bash
gh api graphql -f query='
  mutation($projectId: ID!, $contentId: ID!) {
    addProjectV2ItemById(input: {
      projectId: $projectId
      contentId: $contentId
    }) {
      item { id }
    }
  }' \
  -F projectId="PVT_kwHOAouLzM4BZXDB" \
  -F contentId="<node_id>"
```

### 4. 完成，回報結果

列出所有建立的 issues：

```
✓ #5 新增搜尋功能  → https://github.com/Tyler-Lin/my-app/issues/5
✓ #6 加入標籤系統  → https://github.com/Tyler-Lin/my-app/issues/6
...

共建立 N 張卡片，已全數加入 Project。
```
