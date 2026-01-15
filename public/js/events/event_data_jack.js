window.jackEvents = {
    rank1: {
        id: "jack_rank1",
        title: "鉄の胃袋 (The Iron Stomach)",
        rank_requirement: 1,
        trigger: "manual", // or 'auto'
        sequences: [
            {
                speaker: "Narrator",
                text: "酒場にて。路銀が尽きかけたプレイヤーに、ジャックがビールを奢りながら一枚の羊皮紙を滑らせる。"
            },
            {
                speaker: "Jack",
                text: "手っ取り早く稼ぎたいなら、ここに行け。『帝国軍』の募集だ。 腕っぷしさえあれば、過去も身分も問わない。……ま、**『魂を売る覚悟』**があれば、だがな"
            },
            {
                speaker: "Narrator",
                text: "募兵所にて。試験官の軍曹と、縛られた罪人（パンを盗んだ男）がいる。"
            },
            {
                speaker: "Officer",
                text: "帝国法 第103条。窃盗の罪は、その右腕をもって償う。 貴様への課題は一つ。この罪人の腕を切り落とせ。 躊躇なく行えれば合格。支度金として 5,000 M を支給する"
            }
        ],
        choices: [
            {
                text: "執行する (Execute)",
                description: "帝国の法に従い、躊躇なく腕を切り落とす。",
                karma_change: { justice: 3, integrity: -2 },
                outcome_text: "合格: 階級 「士官候補生」。報酬: 5,000 M。",
                next_sequence: "route_a"
            },
            {
                text: "拒絶する (Refuse)",
                description: "剣を納め、非人道的な命令を拒否する。",
                karma_change: { kindness: 2, justice: -1 },
                outcome_text: "条件付き合格: 階級 「二等兵」。報酬: 500 M。",
                next_sequence: "route_b"
            },
            {
                text: "S.I. / 狂気 (Intervene)",
                description: "剣を一閃させ、手枷の鎖だけを断ち切る",
                karma_change: { bravery: 3 },
                outcome_text: "特別合格: 階級 「傭兵（遊撃隊）」。報酬: 3,000 M。",
                next_sequence: "route_c",
                si_required: true 
            }
        ],
        routes: {
            route_a: [
                {
                    speaker: "Jack",
                    text: "……へえ、やるじゃねえか。お前、**『こっち側（システム）』**の才能あるぜ？ ま、金は金だ。奢ってくれよ、相棒"
                }
            ],
            route_b: [
                {
                    speaker: "Jack",
                    text: "ハハッ、安い給料になっちまったな。でもまあ、お前らしくていいんじゃないか？ 足りない分は、俺が美味い飯屋を教えてやるよ"
                }
            ],
            route_c: [
                {
                    speaker: "Jack",
                    text: "……お前、面白いな。法（ルール）の隙間を縫って正義を通すか。 気に入った。お前とは長い付き合いになりそうだ"
                }
            ]
        }
    },
    rank2: {
        id: "jack_rank2",
        title: "王の唾棄、友の杯 (Spit and Cheers)",
        rank_requirement: 2,
        trigger: "manual",
        sequences: [
            {
                speaker: "Narrator",
                text: "場所は帝都の回廊。プレイヤーが報告に向かう途中、衛兵たちが一斉に跪く。 現れたのは、黄金の甲冑を纏った皇帝、エル・カストルム6世。"
            },
            {
                speaker: "El Castrum VI",
                text: "……ああ、貴様か。"
            },
            // Logic to branch based on Rank 1 choice would go here in full system, for now simplifying
            {
                speaker: "El Castrum VI",
                text: "いいザマだ。何も考えず、ただ命令に従うその空虚な目……実に使い勝手の良い『雑種』だ。 精々、余のために尻尾を振れ。"
            },
             {
                speaker: "Narrator",
                text: "エルは去り際に、圧倒的な**「覇気（プレッシャー）」**を放つ。プレイヤーはその場に膝をつかされる。"
            },
            {
                speaker: "Narrator",
                text: "場所は下層の酒場。心身ともにボロボロになったプレイヤーの前に、ジャックが現れる。"
            },
            {
                speaker: "Jack",
                text: "おいおい、死にそうな顔してるな相棒！ ……ああ、聞いたぜ。 運悪く『あのクソ皇帝』に見つかったんだって？ 災難だったなぁ！"
            },
            {
                speaker: "Jack",
                text: "気にすんなって！ あの皇帝はな、ああやって他人を見下すことでしか自分の価値を感じられねえ、哀れな男なんだよ。"
            },
            {
                speaker: "Jack",
                text: "……でも、俺は知ってるぜ。お前がただの雑種じゃないってな。 俺はお前を信じてる。だから、今は飲んで忘れろ！ ほら、今日は俺の奢りだ！ **『臨時収入』**が入ったからな！ 乾杯！"
            }
        ]
    },
    rank3: {
        id: "jack_rank3",
        title: "昇進という名の首輪 (The Collar Named Promotion)",
        rank_requirement: 3,
        sequences: [
             {
                speaker: "El Castrum VI",
                text: "……帝都の西、『腐肉の谷』に野盗が住み着いたらしい。貴様、行って掃除してこい。もし**『殲滅』**できれば……貴様を『指揮官』として扱ってやってもいい。"
            },
            {
                speaker: "Narrator",
                text: "谷にて。敵の数が多すぎる。プレイヤーが囲まれ、HPが尽きかけたその時―― ガキンッ！！"
            },
            {
                speaker: "Jack",
                text: "よォ！ 散歩してたら、シケたツラした相棒を見つけてな！ 手伝うぜ！ 報酬は山分けでいいよなァ！？"
            },
             {
                speaker: "Narrator",
                text: "戦闘終了。報酬: 階級昇進 ⇒ 【帝国軍・少尉】"
            },
             {
                speaker: "Jack",
                text: "……ん？ おいおい、マジかよ。 **『少尉（コマンダー）』**だって！？ お前、出世したなぁ！！ あのケチな皇帝に認めさせるとは、大したもんだぜ相棒！"
            }
        ]
    },
    rank4: {
        id: "jack_rank4",
        title: "道化の天秤 (The Jester's Scale)",
        rank_requirement: 4,
        sequences: [
             {
                speaker: "Jack",
                text: "なあ、相棒。一つ、賭け（質問）をしよう。 **『もし、罪のない子供を一人殺せば、戦争が終わり、一万人が助かる』**としたら。 ……お前なら、そのナイフを握るか？"
            }
        ],
        choices: [
            {
                text: "殺す (一万人を救う)",
                description: "迷わず刺す。それが王の責任だ",
                karma_change: { justice: 4, perseverance: 2, integrity: -2 },
                 next_sequence: "route_a"
            },
            {
                text: "殺さない (子供を守る)",
                description: "ふざけるな。一人の命も守れないなら、一万人も救えない",
                karma_change: { kindness: 4, bravery: 2, justice: -2 },
                 next_sequence: "route_b"
            },
            {
                text: "その『条件』を作った奴を殺す",
                description: "ふざけた天秤を用意した黒幕を叩き斬る",
                karma_change: { bravery: 5, patience: -3 },
                 next_sequence: "route_c"
            }
        ],
         routes: {
            route_a: [ { speaker: "Jack", text: "……そうか。お前も、あいつ（皇帝）と同じ穴のムジナか。 合理的で、冷徹で、そして一番……悲しい生き方だ。" } ],
            route_b: [ { speaker: "Jack", text: "ハハッ！ 甘いな、砂糖菓子みたいに甘い！ だが……その甘さが、この苦い世界には必要なのかもしれねえ。" } ],
            route_c: [ { speaker: "Jack", text: "傑作だ！ まさか天秤ごと壊すとはな！ お前、やっぱり最高だよ。お前となら……あの『予言』さえも覆せるかもしれねえ" } ]
        }
    },
    rank8: {
        id: "jack_rank8",
        title: "紅蓮の勅命、水銀の救済 (Crimson & Quicksilver)",
        rank_requirement: 8,
        sequences: [
             {
                speaker: "El Castrum VI",
                text: "……死ぬことは許さん。 這いつくばってでも、友軍を盾にしてでも生き延びろ。 ……これは**『勅命（オーダー）』**だ"
            },
            {
                speaker: "Narrator",
                text: "戦闘開始。戦線崩壊。プレイヤーの前に『強化型キメラ』が現れる。"
            },
            {
                speaker: "???",
                text: "――――邪魔だ"
            },
            {
                speaker: "Narrator",
                text: "キメラの巨体が、一瞬で『十文字』に斬り裂かれる。 逆光の中、一人の男が立っている。 右手には【紅蓮の太刀・阿鼻】。左手には【水銀の脇差・叫喚】。"
            },
            {
                speaker: "Man",
                text: "……命令（オーダー）……しただろ……！"
            },
             {
                speaker: "Narrator",
                text: "プレイヤーは薄れゆく意識の中で、男の背中の温もりを感じる。 その奥底から漂うのは、**『安酒（エール）』**の酸っぱい臭い。"
            },
            {
                speaker: "System",
                text: "Insight: 貴方は「エル」と「ジャック」が同一人物であるという、**致命的な確信（Evidence）**を得ました。"
            }
        ]
    },
    rank10: {
        id: "jack_rank10",
        title: "黒き太陽の落日 (Sunset of the Black Sun)",
        rank_requirement: 10,
        sequences: [
            {
                speaker: "El Castrum VI",
                text: "……来たか。 愚かな奴だ。逃げれば、英雄として生きられたものを"
            },
            {
                speaker: "El Castrum VI",
                text: "俺はずっと探していた！ 俺よりも相応しい誰かに……『お前』に押し付けたかったんだよ！！ 俺を殺せ！！ 俺という『最強の暴力』をねじ伏せて、証明してみろ！！"
            }
        ],
        choices: [
            {
                text: "介錯する (王位を継承する)",
                description: "「俺から奪ってくれ」。その願いを叶える。",
                next_sequence: "route_a"
            },
            {
                text: "剣を収める (王位を拒絶し、共有する)",
                description: "「一人で楽になるつもりか？」。引きずり戻す。",
                next_sequence: "route_b"
            }
        ],
         routes: {
            route_a: [ { speaker: "System", text: "獲得: 【レジェンダリー：黒帝の軍服】 称号: 【皇帝】" } ],
            route_b: [ { speaker: "El Castrum VI", text: "……ハハ。……鬼か、お前は。 死ぬことすら許してくれないのか。 ……分かったよ。負けた。その代わり……半分だ。 この重さ、半分お前が持て" },
            { speaker: "System", text: "獲得: 【神器：阿鼻叫喚】 仲間: 【エル（皇帝Ver）】" } ]
        }
    }
};
