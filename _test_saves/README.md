# _test_saves

テスト用のセーブデータ（JSON）を格納します。

## 使い方
1. `SaveManager.js` またはデバッグツールを使用して、特定のポイントでのデータをエクスポートします。
2. このフォルダに適切な名前で保存します。
3. 読み込む際は `SaveManager.loadFromJsonString()` 等を使用して復元します。

## 構成案
- `before_karma_test.json`: キャラクター作成完了、診断開始直前
- `before_jack_event.json`: プロローグ終了、鴉の巣到着時
- `field_explore.json`: 基本的な探索中のデータ
