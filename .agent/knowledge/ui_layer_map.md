# 🗺️ 画像レイヤー管理マップ (UI Layer Map)

このドキュメントは、ゲーム内の全UI要素の重なり順（z-index）と、各シーンごとの表示・非表示状態を統合管理するためのものです。

---

## 🏗️ レイヤー構造 (z-index 順)

数値が大きいほど手前に表示されます。

| レイヤー | z-index | 主要要素 (ID/Class) | 内容・用途 |
| :--- | :--- | :--- | :--- |
| **SYSTEM_MAX** | 10000 | `.crt-overlay`, `#boot-screen` | 最前面。エフェクト、起動初期画面 |
| **MODAL** | 9000-8000 | `.save-modal`, `.inventory-modal` | システムモーダル、セーブ画面、持物 |
| **DEBUG** | 9999 | `.debug-panel`, `.debug-console` | デバッグ用UI（開発時のみ） |
| **BATTLE** | 2000 | `.battle-ui` | 戦闘画面全体 |
| **FLOATING_UI** | 1100 | `.karma-graph-ui`, `.vital-gauge-ui` | 画面端に浮かぶステータスゲージ類 |
| **EVENT_BASE** | 1000 | `#event-overlay` (`.event-layer`) | **アドベンチャーパート (会話) 階層** |
| ├── Dialogue | 10 | `.dialogue-box` | メッセージウィンドウ |
| ├── Character | 5 | `.character-display` | 立ち絵（ダイアログより後ろ） |
| └── Bg | 1 | `#event-background` | イベント専用背景 |
| **EFFECT** | 999-50 | `.glitch-overlay`, `.glitch-active::after` | 画面全体のノイズ、グリッチ、赤点滅 |
| **NAV** | 100 | `.system-header`, `.system-footer` | 画面上下の常設バー |
| **CONTENT** | 10 | `#content-layer` | ゲーム本体（タイトル、キャラメイク、カルマテスト） |
| **BACKGROUND** | 1 | `#background-layer` | 基本背景（鴉の巣、草原など） |

---

## 🎬 シーン別表示マトリックス (UI State Matrix)

各シーンで「どのレイヤーを表示(ON)し、どれを隠す(OFF)か」の定義です。

| シーン名 | Background | Nav | Content | Floating | Event | Battle |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **タイトル** | ON | OFF | ON (title) | OFF | OFF | OFF |
| **キャラメイク** | ON | ON | ON (char) | OFF | OFF | OFF |
| **カルマテスト** | ON | ON | ON (eval) | OFF | OFF | OFF |
| **探索 (街/ダンジョン)**| ON | ON | OFF | **ON** | OFF | OFF |
| **イベント中** | ON | ON | OFF | **OFF** | **ON** | OFF |
| **戦闘中** | ON | ON | OFF | ON | OFF | **ON** |

---

## 🛠️ UI操作のガイドライン

1.  **フェーズ移行時の原則**: 新しいフェーズに移る際は、まず「全レイヤーをリセット（非表示）」してから、必要なものだけを表示することを推奨します。
2.  **z-indexの競合**: 新しいUIを追加する場合、上記の表の「z-index」範囲を守って `style.css` に記述してください。
3.  **強制リセット**: デバッグジャンプなどでUIが重なった場合は、`UIManager.resetAll()` (今後実装) を通じてクリーンな状態に戻してください。

---

## 📅 更新履歴
- 2026/01/18: 初版作成。レイヤー構造とシーン別マトリックスを定義。
