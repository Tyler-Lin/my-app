---
name: github-issue-workflow
description: 當使用者貼上 GitHub issue URL（格式如 https://github.com/Tyler-Lin/my-app/issues/1）或說「幫我做 issue #N」、「開始這張卡」、「implement this issue」時觸發。自動完成：讀需求 → Project card 改 In Progress → 建 branch → 實作 → commit/push → 開 draft PR → card 改 In Review。
---

## 基本資訊

- **Owner**: `Tyler-Lin`
- **Repo**: `my-app`
- **Project**: 個人帳號下的 GitHub Project（非 org）
- **Status 欄位選項**: Ready → In Progress → In Review → Done

---

## 流程

### 1. 取得 issue 編號

從使用者貼的 URL 解析 issue number：
```
https://github.com/Tyler-Lin/my-app/issues/42  →  42
```

### 2. 讀取 issue 需求

```bash
gh issue view <number> --json number,title,body --repo Tyler-Lin/my-app
```

仔細閱讀 `title` 和 `body`，這是後續實作的依據。

### 3. 評估需求是否明確

讀完 issue 後，判斷需求是否足以直接實作。以下情況屬於「不明確」：
- body 太短或只有一句話，缺乏實作細節
- 描述了「要什麼」但沒說「怎麼做」
- 有歧義，可以有多種解讀方式

**如果需求明確** → 直接繼續步驟 4。

**如果需求不明確** → 先讀 codebase 找相關脈絡：
- 用 `Glob` 和 `Grep` 找出與需求相關的現有檔案和程式碼
- 了解目前的實作方式、命名慣例、資料結構

根據讀到的 source code，整理出：
1. **你的理解**：這個需求最可能的意思是什麼
2. **建議的實作方向**：基於現有 codebase 的具體做法（例如：在哪個 component、用哪個 service、加什麼欄位）
3. **還需要確認的問題**：真正無法從 code 推斷的部分才列出來

用以下格式回報，**等使用者確認後才繼續**：

---
**需求確認**

Issue #N：`<title>`

**我的理解：** `<基於 source code 的解讀>`

**建議實作方向：**
- `<具體做法 1，附上相關檔案路徑>`
- `<具體做法 2>`

**還需要你確認：**
- `<真正不確定的問題>`

請確認方向正確後我再繼續，或告訴我需要調整的地方。

---

### 4. 把 Project card 改成 In Progress

**步驟 3a** — 查詢 project item 和 Status 欄位資訊：

```bash
gh api graphql -f query='
  query($owner: String!, $repo: String!, $issue: Int!) {
    repository(owner: $owner, name: $repo) {
      issue(number: $issue) {
        projectItems(first: 10) {
          nodes {
            id
            project { id title }
            fieldValues(first: 20) {
              nodes {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field {
                    ... on ProjectV2SingleSelectField {
                      id
                      name
                      options { id name }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }' \
  -F owner="Tyler-Lin" -F repo="my-app" -F issue=<number>
```

從回傳結果取出：
- `projectItems.nodes[0].id` → ITEM_ID
- `projectItems.nodes[0].project.id` → PROJECT_ID
- Status 欄位的 `id` → FIELD_ID
- options 裡所有選項的 `id`（`In Progress` 和 `In Review` 都記下來，後面會用到）

**步驟 3b** — 更新狀態為 In Progress：

```bash
gh api graphql -f query='
  mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
    updateProjectV2ItemFieldValue(input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { singleSelectOptionId: $optionId }
    }) {
      projectV2Item { id }
    }
  }' \
  -F projectId="<PROJECT_ID>" \
  -F itemId="<ITEM_ID>" \
  -F fieldId="<FIELD_ID>" \
  -F optionId="<In Progress 的 option id>"
```

如果 issue 沒有連結到任何 project，跳過步驟 3，繼續往下。

### 5. 建立 worktree

把 issue title 轉成 slug（小寫、非英數字換成 `-`、最長 50 字元）。
Worktree 路徑放在 repo 的**平行目錄**，避免巢狀：

```bash
git fetch origin

# WORKTREE_PATH = repo 上層目錄 + /my-app-wt/feature-<number>-<slug>
# 例如：/Users/tyler/Desktop/workshop/my-app-wt/feature-42-add-todo-filter
git worktree add <WORKTREE_PATH> -b feature/<number>-<slug> origin/main
```

之後所有檔案操作、指令都在 `<WORKTREE_PATH>` 目錄內執行。
原本的工作目錄完全不受影響，可以同時有多個 worktree 並行。

### 6. 實作需求

在 worktree 目錄內，根據 issue body 實作功能，遵照 `CLAUDE.md` 的規範（Angular 21、signals、OnPush 等）。

### 7. Commit 並 push

在 worktree 目錄內執行：

```bash
git add -A
git commit -m "feat: <issue title> (#<number>)"
git push -u origin feature/<number>-<slug>
```

### 8. 開 draft PR

```bash
gh pr create \
  --title "feat: <issue title> (#<number>)" \
  --body "$(cat <<'EOF'
Closes #<number>

## 實作說明
<簡短說明做了什麼>
EOF
)" \
  --draft \
  --base main \
  --head feature/<number>-<slug> \
  --repo Tyler-Lin/my-app
```

### 9. 把 Project card 改成 In Review

重複步驟 4 的 mutation，`optionId` 改成 "In Review" 的 option id。

### 10. 刪除 worktree

PR 開完、card 更新後，立即清除 worktree，保持環境整潔：

```bash
# 回到原本的 repo 目錄執行
git worktree remove <WORKTREE_PATH>
```

如果 worktree 內有未追蹤的檔案導致 remove 失敗，加 `--force`：
```bash
git worktree remove --force <WORKTREE_PATH>
```

### 11. 完成，回報結果

告訴使用者：
- ✓ Branch: `feature/<number>-<slug>`
- ✓ PR: `<pr url>`
- ✓ Card 狀態: In Review
- ✓ Worktree 已清除
