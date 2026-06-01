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

### 3. 把 Project card 改成 In Progress

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

### 4. 建立 feature branch

把 issue title 轉成 slug（小寫、非英數字換成 `-`、最長 50 字元）：

```bash
git fetch origin
git checkout main && git pull origin main
git checkout -b feature/<number>-<slug>
```

範例：#42 "Add todo filter" → `feature/42-add-todo-filter`

### 5. 實作需求

根據 issue body 實作功能，遵照 `CLAUDE.md` 的規範（Angular 21、signals、OnPush 等）。

### 6. Commit 並 push

```bash
git add -A
git commit -m "feat: <issue title> (#<number>)"
git push -u origin feature/<number>-<slug>
```

### 7. 開 draft PR

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

### 8. 把 Project card 改成 In Review

重複步驟 3b 的 mutation，`optionId` 改成步驟 3a 取到的 "In Review" option id。

### 9. 完成，回報結果

告訴使用者：
- ✓ Branch: `feature/<number>-<slug>`
- ✓ PR: `<pr url>`
- ✓ Card 狀態: In Review
