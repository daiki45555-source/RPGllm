window.introEvents = {
    rank1: {
        title: "廃棄場での目覚め",
        id: "intro_rank1",
        sequences: [
            // Scene 1: Awakening / Glitch
            {
                speaker: "System",
                text: "……初期化シーケンス……失敗……",
                bg: "black",
                audio: "error" // Fallback: se_glitch_heavy missing
            },
            {
                speaker: "System",
                text: "……個体識別ID……破損……"
            },
            {
                speaker: "System",
                text: "……排出プロセス……完了。"
            },
            // Scene 2: Encounter
            {
                speaker: "Narrator",
                text: "（……視界がボヤけている。誰かが覗き込んでいる……）",
                bg: "./images/bg/グラディウス　下層部　裏路地　朝.png", 
                // Adding bg path. Note: EventManager.js line 88 uses this.uiManager.updateBackground(step.bg)
            },
            {
                speaker: "？？？",
                text: "「おーおー。派手に捨てられちまってまあ。」",
                // Show Jack Normal
                // Currently EventManager doesn't seem to have explicit "character sprite" handling in the snippets I saw (lines 74-96 of EventManager.js).
                // I might need to add that logic to EventManager or UIManager.
                // For now, I'll put it in 'image' key if UIManager supports it, or just rely on dialogue.
                // Re-checking EventManager: it only handles 'audio' and 'bg'. 
                // I should probably add 'image' support to EventManager/UIManager later. 
                // For now, let's assume I can pass an image path or character key.
                // I will assume a 'character' field for now and patching EventManager/UIManager if needed.
                character: "jack_normal", // Planning to Map this in UIManager
                bgm: "jack_routine" // BGM Trigger? EventManager doesn't show BGM handling yet. I need to add that.
            },
            {
                speaker: "ジャック",
                text: "「おい、生きてるか？ それともスクラップか？」",
                character: "jack_normal"
            }
        ],
        choices: [
            {
                text: "「……」 (無言)",
                next_sequence: "route_silent",
                karma_change: { "attunement": 1 }
            },
            {
                text: "「ここは……？」",
                next_sequence: "route_confirm",
                karma_change: { "intelligence": 1 }
            },
            {
                text: "「あんたは……誰だ？」",
                next_sequence: "route_ask",
                karma_change: { "vigor": 1 }
            }
        ],
        routes: {
            // Common flow after choice interaction, merging back or continuing
            // Since the draft has a "Scene 3" which varies slightly but converges, 
            // I'll implement small reactions then merge to main flow.
            
            route_silent: [
                {
                    speaker: "ジャック",
                    text: "「反応なしか。まあ、喋れるだけマシなゴミ...かもしれねえな。」",
                    character: "jack_laugh"
                },
                {
                    speaker: "ジャック",
                    text: "「ここはガリアレムの掃き溜め、第4層の裏路地だ。上から降ってきたんだろ？」",
                    character: "jack_normal"
                },
                {
                    speaker: "ジャック",
                    text: "「運がいいぜ、野良犬に食われる前に俺が見つけたんだからな。」"
                }
            ],
            route_confirm: [
                 {
                    speaker: "ジャック",
                    text: "「お？ まだ意識はあるみたいだな。」",
                    character: "jack_laugh"
                },
                {
                    speaker: "ジャック",
                    text: "「ここはガリアレムの掃き溜め、第4層の裏路地だ。歓迎するぜ、新入りのゴミクズさんよ。」",
                    character: "jack_normal"
                }
            ],
            route_ask: [
                {
                    speaker: "ジャック",
                    text: "「俺か？ 俺はジャック。ただの通りすがりの『掃除屋』さ。」",
                    character: "jack_normal"
                },
                {
                    speaker: "ジャック",
                    text: "「ここはガリアレムの掃き溜め、第4層の裏路地。お前みたいなのが降ってくる場所だ。」"
                }
            ]
        }
        // ToDo: Continue to Scene 4/5. 
        // Limitations of current EventManager:
        // It seems to handle 'sequences' -> 'choices' -> 'routes'. 
        // It doesn't look like it supports "Play Route X THEN go back to Main Sequence".
        // I might need to chain events or loop back. 
        // For this iteration, I will put the rest of the dialogue in the routes or update EventManager to handle 'next_event'.
        // Or simply make the routes long enough to cover the rest.
        // Actually, let's keep it simple: The prologue ends after the choice for this specific test, or I extend the routes to include the rest of the text.
        // I'll extend the routes to include the rest of the text (Scene 4 & 5) since they converge.
    }
};

// Append the rest of the scenes to each route for now (Convergence)
const commonContinuation = [
    {
        speaker: "ジャック",
        text: "（酒瓶らしきものを揺らす）で？ 祝いの一杯でもどうだ？ 泥水みたいな味だが、痛み止めにはなる。",
        character: "jack_normal",
        audio: "coin_toss" // Placeholder for bottle sound
    },
    {
        speaker: "ジャック",
        text: "「......ん？」",
        character: "jack_serious",
        // BGM Change plan? User said "Jack's Routine" is fine after pace ends.
        // Keeping Jack's Routine throughout.
    },
    {
        speaker: "ジャック",
        text: "「お前、目が死んでるな。いや、死んでるっていうか...『無い』のか？」",
        character: "jack_serious"
    },
    {
        speaker: "ジャック",
        text: "「ハハッ！ こりゃ傑作だ。記憶もねえ、目的もねえ、ただの『空っぽ』かよ。」",
        character: "jack_laugh"
    },
    {
        speaker: "ジャック",
        text: "「気に入った。俺も似たようなもんでね。」",
        character: "jack_normal"
    },
    {
        speaker: "ジャック",
        text: "「立てるか？ ゴミ捨て場で寝てると、回収車に持ってかれるぞ。」",
        character: "jack_normal"
    },
    {
        speaker: "ジャック",
        text: "「行く当てがねえなら来な。面白い『玩具』を拾ったとあっちゃ、捨て置けねえ。」",
        character: "jack_laugh"
    }
];

// Append common parts to routes
window.introEvents.rank1.routes.route_silent.push(...commonContinuation);
window.introEvents.rank1.routes.route_confirm.push(...commonContinuation);
window.introEvents.rank1.routes.route_ask.push(...commonContinuation);
