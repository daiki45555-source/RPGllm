# 🏷️ イベントタグ HUB

> **イベントを識別するためのタグ管理ファイル。デバッグ・コミュニケーション用。**

---

## 📋 タグ命名規則

| 接頭辞 | 意味 | 例 |
|-------|------|-----|
| `IV` | Intro/Vital Event（序盤必須イベント） | IV1, IV2, IV3 |
| `JK` | Jack関連イベント | JK1, JK2 |
| `MA` | Marianne関連イベント | MA1, MA2 |
| `FD` | Field/探索イベント | FD1, FD2 |

---

## 🎬 序盤イベント (IV系)

| タグ | イベント名 | ファイル | 確認ポイント |
|-----|-----------|---------|-------------|
| **IV1** | オープニング / ブート画面 | `main.js` | 起動シーケンス、BGM |
| **IV2** | カルマテスト（影の審問） | `ShadowEvaluation.js` | 15問の選択肢、カルマ計算 |
| **IV3** | ジャック邂逅（プロローグ） | `prologue_event.js` | ⚠️ **UI被り問題あり** |
| **IV4** | ベッドの下調査 | `prologue_event.js` (commonContinuation) | アイテム入手イベント |
| **IV5** | プロローグ終了 → ギルド到着 | `prologue_event.js` | LocationManager起動 |

---

## 🃏 ジャック関連 (JK系)

| タグ | イベント名 | ファイル | ランク |
|-----|-----------|---------|-------|
| **JK1** | 鉄の胃袋 (The Iron Stomach) | `event_data_jack.js` | Rank 1 |
| **JK2** | 王の唾棄、友の杯 | `event_data_jack.js` | Rank 2 |
| **JK3** | 昇進という名の首輪 | `event_data_jack.js` | Rank 3 |
| **JK4** | 道化の天秤 | `event_data_jack.js` | Rank 4 |
| **JK8** | 紅蓮の勅命、水銀の救済 | `event_data_jack.js` | Rank 8 |
| **JK10** | 黒き太陽の落日 | `event_data_jack.js` | Rank 10 |

---

## 🌸 マリアンヌ関連 (MA系)

| タグ | イベント名 | ファイル | ランク |
|-----|-----------|---------|-------|
| **MA1** | 泥の中の祈り | `event_data_marianne.js` | Rank 1 |
| **MA2** | 空腹なき晩餐 | `event_data_marianne.js` | Rank 2 |
| **MA3** | 聖域の籠城 | `event_data_marianne.js` | Rank 3 |
| **MA4** | 雑草の剪定 | `event_data_marianne.js` | Rank 4 |

---

## 🎮 デバッグジャンプコマンド（✅ 実装完了）

```javascript
// URLパラメータでジャンプ
http://localhost:3000/?event=IV2  // カルマテストへ直行
http://localhost:3000/?event=IV3  // ジャック邂逅へ直行
http://localhost:3000/?event=JK1  // ジャックRank1イベントへ

// コンソールからジャンプ
debugMode.jumpToEvent('IV2')  // カルマテストへ
debugMode.jumpToEvent('JK1')  // ジャックRank1へ
```

---

## 🐛 現在のバグ一覧

| タグ | 問題 | ステータス |
|-----|------|-----------|
| **IV2** | カルマテストジャンプ不具合 | ✅ **修正済み** (2026-01-18) |
| **IV3** | UI被り（立ち絵・ダイアログが左寄せ） | 🔴 未修正 |

---

## 📝 更新履歴
- 2026-01-18: IV2ジャンプ修正 - `evaluation-section` → `evaluation` ID修正
- 2026-01-18: 初版作成
