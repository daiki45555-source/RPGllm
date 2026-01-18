# 🤖 Claude エージェント用資料箱

このフォルダは **Claude（Anthropic）** がRPGllmプロジェクトで使用する資料を保存する場所です。

---

## 📁 フォルダ構成

```
.claude/
├── README.md           # このファイル
├── knowledge/          # 知識・設定資料
│   └── project_overview.md
└── debug_logs/         # デバッグログ
    └── 2026-01-18_title_layout_debug.md
```

---

## 🤝 他のエージェントとの連携

- **アンチグラヴィティ君** (`.agent/`) - Gemini系エージェント
- **Claude** (`.claude/`) - Anthropic系エージェント

お互いの資料を参照して協力して開発を進める！

---

## 📝 使い方

1. デバッグ作業をしたら `debug_logs/` にログを残す
2. 発見した知識は `knowledge/` に保存
3. 引き継ぎ時は相手のフォルダに引き継ぎレポートを置く

---

**Created by Claude 🤖**
