# 🔧 Claude デバッグレポート - タイトル画面見切れ問題

## 📅 作業日時
2026/01/18 03:30 - 12:00

---

## 🚨 問題の状況

**タイトル画面のUI（タイトル、「接続を開始する」ボタン、Optionボタン）が画面上部に見切れている**

ユーザーのスクリーンショットで確認：
- ヘッダー（スキップ、持物、設定）は正常に表示
- タイトル「七つの願いが降る庭で」が見切れ
- 「接続を開始する」「Option」ボタンがヘッダーのすぐ下にチラッと見える程度

---

## 🔍 原因分析（アンチグラヴィティ君の implementation_plan.md より）

> `.system-header` が `position: fixed` で画面上部を占有しており、タイトル画面のコンテナの配置設定がヘッダーと干渉している

---

## 🛠️ 試した修正と結果

### 修正1: body の align-items
```css
body {
  align-items: center → flex-start
}
```
**結果**: ❌ 効果なし

### 修正2: #content-layer の調整
```css
#content-layer {
  align-items: center → flex-start
  padding: 2rem → 80px 2rem 2rem 2rem
}
```
**結果**: ❌ 背景が壊れた（別レイヤー構造のため）

### 修正3: #game-container の調整
```css
#game-container {
  padding-top: 80px (追加)
  margin-top: 60px (追加)
  min-height: calc(100vh - 100px) (追加)
  justify-content: center → flex-start
}
```
**結果**: ❌ まだ見切れている

### 修正4: #app の overflow
```css
#app {
  overflow: hidden → visible
  height: 100vh → min-height: 100vh
}
```
**結果**: ❌ スクロール可能になったが、背景レイヤーが壊れた

### 修正5: JavaScript での強制修正
`main.js` に `applyLayoutFix()` 関数を追加して各要素のスタイルを直接変更
**結果**: ❌ スクロール式になり、背景レイヤーが壊れた

---

## ⚠️ 重要な発見：レイヤー構造が別々！！

テスト中に判明した**レイヤー構造**：

| シーン | 背景状態 | 備考 |
|--------|----------|------|
| タイトル画面 | ❌ 修正で壊れた | `#background-layer` 使用？ |
| 導入・キャラメイク | ❌ 修正で壊れた | 同上 |
| カルマテスト | ❌ 修正で壊れた | 同上 |
| **ジャックイベント** | ✅ 生きてた！ | **別レイヤー！** `#event-background`？ |
| 操作画面（フィールド） | ❌ 修正で壊れた | また別レイヤー？ |

**→ シーンごとに背景レイヤーが分かれている可能性が高い！**

overflow や position の変更がレイヤー構造に影響を与えている。

---

## 📁 現在の状態

**GitHub版に復元済み** + 以下の修正のみ適用中：

```css
body {
  align-items: flex-start; /* center から変更 */
}

#game-container {
  padding-top: 80px;
  margin-top: 60px;
  min-height: calc(100vh - 100px);
  justify-content: flex-start;
}
```

---

## 💡 次に試すべきこと

1. **DevTools で実際の要素の位置を確認**
   - タイトル画面の h1 や button がどこに配置されているか
   - computed style で実際の top/margin 値を確認

2. **`.system-header` の高さ分だけ `#scene-renderer` を下げる**
   - overflow を変更せずに margin-top だけ追加

3. **`#introduction` セクションに直接 padding-top を追加**
   - 他のセクションに影響を与えないように

4. **JavaScript で `.system-header` の高さを取得して動的に調整**
   ```javascript
   const headerHeight = document.querySelector('.system-header').offsetHeight;
   document.getElementById('introduction').style.paddingTop = headerHeight + 'px';
   ```

---

## 📂 バックアップファイル

修正を試す前の状態：
- `C:\Users\daiki\Desktop\RPGllm\public\style_broken_backup.css`
- `C:\Users\daiki\Desktop\RPGllm\public\main_broken_backup.js`

---

## 🤝 引き継ぎメモ

- BGMとSEは正常に動作している（ストーリーシーンで確認済み）
- ジャックイベントのプロローグでは背景が生きていたので、イベント用レイヤーは別管理の可能性
- ユーザーは素人なので、レイヤー構造の詳細は把握していない
- 根本的な解決には HTML/CSS の構造理解が必要

---

**Claude より、アンチグラヴィティ君へ 🤖→🤖**

頑張れ！！
