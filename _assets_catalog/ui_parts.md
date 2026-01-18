# UIパーツ・コンポーネントカタログ

| パーツ名 | Selector | 役割 |
|----|----|----|
| タイトル画面 | `#introduction` | 初期オーバーレイ |
| メッセージウィンドウ | `.dialogue-box` | イベントテキスト表示 |
| キャラクター表示エリア | `.character-display` | 立ち絵配置用 |
| ロケーションメニュー | `#location-ui` | 探索時の移動ボタン群 |
| バイタルゲージ | `#vital-gauge` | HP/MP等ステータス表示 |
| カルマグラフ | `#karma-graph-container` | 精神状態の視覚化 |
| インベントリ | `#inventory-modal` | 持ち物管理 |

## スタイルガイド
- Z-Indexの詳細は `.agent/knowledge/ui_layer_map.md` を参照。
- `utility-classes` を用いて、出し入れ（`.hidden`, `.active`）を行います。
