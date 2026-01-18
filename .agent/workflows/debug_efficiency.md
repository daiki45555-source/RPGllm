---
description: デバッグ作業の効率化ガイド - 毎回フルフローやるな！
---

# ⚔️ デバッグ時の鉄則

1. **まずデバッグモードで目的のシーンに飛べ！**
   - 起動を待つ時間は無駄です。コンソールやURLパラメータを駆使してください。
2. **フルフローテストは最後の動作確認だけ！**
   - 開発中の確認で「最初からプレイ」するのは厳禁です。
3. **毎回最初からやるな！！**
   - 特定のバグを追っている時は、その状況を直接再現することに全力を注いでください。

## 🛠️ クイック・ジャンプ (Console)
```javascript
debug.jumpTo('title')        // タイトル画面
debug.jumpTo('charCreate')   // キャラメイク
debug.jumpTo('karmaTest')    // カルマテスト
debug.jumpTo('jackEvent')    // ジャックイベント
debug.jumpTo('field')        // フィールド
debug.setStats({str:10, int:15}) // ステータス設定
```
