# 🔧 タイトル画面見切れ問題 デバッグログ

## 📅 日時
2026/01/18 03:30 - 12:00

## 👤 担当
Claude (Anthropic)

---

## 🎯 問題

タイトル画面のUI（タイトル「七つの願いが降る庭で」、「接続を開始する」ボタン、Optionボタン）が画面上部に見切れている。

---

## 🔍 調査結果

### CSS構造

```
body
└── #app (overflow: hidden, height: 100vh)
    ├── .system-header (position: fixed, top: 0)
    └── #game-container
        └── #scene-renderer
            ├── #background-layer
            └── #content-layer
                └── #introduction
                    └── #title-screen-ui
```

### 原因

1. `body` の `align-items: center` が画面を上下中央配置
2. `.system-header` が `position: fixed` で上部を占有
3. `#app` の `overflow: hidden` がはみ出し部分を非表示に
4. 結果：コンテンツが上に見切れる

---

## 🛠️ 試した修正

| # | 修正内容 | 結果 | 副作用 |
|---|----------|------|--------|
| 1 | body: align-items: flex-start | ❌ | なし |
| 2 | #content-layer: padding-top: 80px | ❌ | 背景壊れた |
| 3 | #game-container: margin-top: 60px | ❌ | なし |
| 4 | #app: overflow: visible | ❌ | 背景壊れた |
| 5 | JavaScript強制修正 | ❌ | スクロール化、背景壊れた |

---

## ⚠️ 重要発見

### レイヤー構造が別々！

| シーン | 背景レイヤー | 状態 |
|--------|-------------|------|
| タイトル画面 | #background-layer? | overflow変更で壊れる |
| キャラメイク | 同上 | 同上 |
| カルマテスト | 同上 | 同上 |
| **ジャックイベント** | **別レイヤー** | **壊れない！** |
| フィールド | また別 | overflow変更で壊れる |

**→ overflow や position の変更は慎重に！特定シーンだけ壊れる！**

---

## 💡 未検証の修正案

1. `#introduction` セクションにだけ `padding-top` を追加
2. JavaScript で `.system-header` の高さを取得して動的調整
3. `.system-header` を `position: fixed` から `sticky` に変更
4. `#scene-renderer` に `margin-top` を追加

---

## 📂 関連ファイル

- `public/style.css` - メインスタイルシート
- `public/index.html` - HTML構造
- `public/main.js` - メインロジック
- `.agent/knowledge/claude_debug_report.md` - アンチグラヴィティ君への引き継ぎ

---

## 📌 メモ

- BGM/SEは正常動作（ストーリーシーンで確認）
- アンチグラヴィティ君の `implementation_plan.md` に同じ問題の分析あり
- ユーザーは素人なのでレイヤー構造の詳細は把握していない

---

**Status: 🔄 アンチグラヴィティ君に引き継ぎ**
