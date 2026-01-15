window.marianneEvents = {
    rank1: {
        id: "marianne_rank1",
        title: "泥の中の祈り (Prayer in the Mud)",
        rank_requirement: 1,
        trigger: "manual",
        sequences: [
            {
                speaker: "Narrator",
                text: "貧民街の路地裏。あなたは泥の中に膝をつき、必死に何かを掘り返している修道服の女を見つける。"
            },
            {
                speaker: "Marianne",
                text: "……あ。……見られて、しまいましたか？ ふふ、驚かないでください。この子が……息ができなくて、苦しそうだったので。"
            },
            {
                speaker: "Marianne",
                text: "人間は悲鳴を上げられますけど、草花は黙って枯れるしかないでしょう？ だから、誰かが気づいてあげないと。"
            }
        ],
        choices: [
            {
                text: "「……汚くないのか？」と尋ねる",
                description: "彼女の異常性を問う。",
                // Karma changes inferred from context if not explicitly stated
                outcome_text: "泥は冷たくて、湿っていて……とても『生きている』感じがして、安心しませんか？",
                next_sequence: "end"
            },
            {
                text: "黙ってハンカチを差し出す",
                description: "彼女の汚れを拭おうとする。",
                outcome_text: "もったいないです。貴方の綺麗なハンカチが、私なんかの手で汚れてしまいます。……でも、お気持ちだけ。",
                next_sequence: "end"
            }
        ]
    },
    rank2: {
        id: "marianne_rank2",
        title: "空腹なき晩餐 (Supper Without Hunger)",
        rank_requirement: 2,
        trigger: "manual",
        sequences: [
            {
                speaker: "Narrator",
                text: "聖カストルム孤児院。マリアンヌは子供たちにスープを配っている。しかし、自分の皿はない。"
            },
            {
                speaker: "Marianne",
                text: "私はいいの。さっき、つまみ食いしちゃったから。 それに……みんなが食べている音を聞いているだけで、お腹がいっぱいになるのよ。不思議ね。"
            },
            {
                speaker: "Narrator",
                text: "嘘だ。彼女の喉が鳴ったのを、あなたは聞いた。彼女は空腹を感じているが、それを享受している。"
            }
        ],
        choices: [
            {
                text: "自分の分を分けてやる",
                description: "自己犠牲を否定する。",
                outcome_text: "い、いけません！ ……私なんかにカロリーを使うのは、資源の無駄遣いです。",
                next_sequence: "end"
            },
            {
                text: "「本当に食べていないのか？」と問いただす",
                description: "嘘を見抜く。",
                outcome_text: "……嘘をつきました。でも、足りないんです。あの子たちの明日を作るには、私の今日を差し出すのが、一番『安い』代償でしょう？",
                next_sequence: "end"
            }
        ]
    },
    rank3: {
        id: "marianne_rank3",
        title: "聖域の籠城 (Sanctuary of Lies)",
        rank_requirement: 3,
        sequences: [
            {
                speaker: "Narrator",
                text: "孤児院がゴブリンの軍勢に囲まれている。マリアンヌは静かにロザリオを握りしめている。"
            },
            {
                speaker: "Marianne",
                text: "……下がっていてください。指一本、触れさせません"
            },
            {
                speaker: "Narrator",
                text: "彼女が展開しているのは『城壁のような厚みを持つ魔力障壁』だ。物理的透過を完全に遮断している。"
            },
            {
                speaker: "System",
                text: "Mission: 彼女が作った『安全地帯』から飛び出し、無防備な敵を討て。"
            },
            {
                speaker: "Narrator",
                text: "戦闘終了。彼女は無傷で、息切れすらしていない。だが、プレイヤーの前では『疲れたフリ』をしている。"
            },
            {
                speaker: "Marianne",
                text: "あ……。はぁ、はぁ……。 す、すごい数でしたね……。私、もう立っているのがやっとで……"
            },
            {
                speaker: "System",
                text: "Insight: 彼女の額には汗一滴浮かんでいない。出力がおかしい。"
            }
        ]
    },
    rank4: {
        id: "marianne_rank4",
        title: "雑草の剪定 (The Gardener's Logic)",
        rank_requirement: 4,
        sequences: [
            {
                speaker: "Marianne",
                text: "……こんばんは。 綺麗なアジサイを咲かせるために……**余計なもの（雑草）**を抜いていただけです"
            },
            {
                speaker: "Marianne",
                text: "[Player Name]さん、教えてください。 もし貴方が、世界で一番大切な人を守るために、世界中の他の全てを燃やさなければならないとしたら。 貴方は、その松明を手に取りますか？"
            }
        ],
        choices: [
            {
                text: "燃やす。大切なものが一番だ",
                description: "愛するものを守れるなら、悪魔にでもなる",
                karma_change: { kindness: 4, perseverance: 2 },
                outcome_text: "……貴方は、とても『優しい』人ですね。 安心しました。貴方となら、私も迷わずに済みそうです",
                next_sequence: "end"
            },
            {
                text: "燃やさない。別の道を探す",
                description: "そんな極論は認めない。誰も犠牲にしない道を探す",
                karma_change: { justice: 4, bravery: 2 },
                outcome_text: "……ふふ。貴方はまるで、おとぎ話の王子様みたい。 いいでしょう。その『綺麗な道』、どこまで歩けるかお供します",
                next_sequence: "end"
            },
            {
                text: "……お前は、燃やしたのか？",
                description: "彼女の過去（紅蓮の魔女）を問う",
                karma_change: { integrity: 5, patience: -2 },
                outcome_text: "…………。 歴史書なんて、勝者が書いた創作ですから。 ……でも、もしそうだとしたら。貴方は今ここで、私という『雑草』を抜きますか？",
                next_sequence: "end"
            }
        ]
    },
    rank5: {
        id: "marianne_rank5",
        title: "Rank 5 Placeholder",
        rank_requirement: 5,
        sequences: [{ speaker: "System", text: "This event is under construction." }]
    },
    rank6: {
        id: "marianne_rank6",
        title: "Rank 6 Placeholder",
        rank_requirement: 6,
        sequences: [{ speaker: "System", text: "This event is under construction." }]
    },
    rank7: {
        id: "marianne_rank7",
        title: "Rank 7 Placeholder",
        rank_requirement: 7,
        sequences: [{ speaker: "System", text: "This event is under construction." }]
    },
    rank8: {
        id: "marianne_rank8",
        title: "Rank 8 Placeholder",
        rank_requirement: 8,
        sequences: [{ speaker: "System", text: "This event is under construction." }]
    },
    rank9: {
        id: "marianne_rank9",
        title: "Rank 9 Placeholder",
        rank_requirement: 9,
        sequences: [{ speaker: "System", text: "This event is under construction." }]
    },
    rank10: {
        id: "marianne_rank10",
        title: "Rank 10 Placeholder",
        rank_requirement: 10,
        sequences: [{ speaker: "System", text: "This event is under construction." }]
    }
};
