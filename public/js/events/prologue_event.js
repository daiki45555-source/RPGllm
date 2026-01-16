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
        audio: "error", // Fallback: se_glitch_heavy missing
      },
      {
        speaker: "System",
        text: "……個体識別ID……破損……",
      },
      {
        speaker: "System",
        text: "……排出プロセス……完了。",
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
        bgm: "jack_routine", // BGM Trigger? EventManager doesn't show BGM handling yet. I need to add that.
      },
      {
        speaker: "ジャック",
        text: "「おい、生きてるか？ それともスクラップか？」",
        character: "jack_normal",
      },
    ],
    choices: [
      {
        text: "「……」 (無言)",
        next_sequence: "route_silent",
        karma_change: { attunement: 1 },
      },
      {
        text: "「ここは……？」",
        next_sequence: "route_confirm",
        karma_change: { intelligence: 1 },
      },
      {
        text: "「あんたは……誰だ？」",
        next_sequence: "route_ask",
        karma_change: { vigor: 1 },
      },
    ],
    routes: {
      // Common flow after choice interaction, merging back or continuing
      // Since the draft has a "Scene 3" which varies slightly but converges,
      // I'll implement small reactions then merge to main flow.

      route_silent: [
        {
          speaker: "ジャック",
          text: "「反応なしか。まあ、喋れるだけマシなゴミ...かもしれねえな。」",
          character: "jack_laugh",
        },
        {
          speaker: "ジャック",
          text: "「ここはガリアレムの掃き溜め、第4層の裏路地だ。上から降ってきたんだろ？」",
          character: "jack_normal",
        },
        {
          speaker: "ジャック",
          text: "「運がいいぜ、野良犬に食われる前に俺が見つけたんだからな。」",
        },
      ],
      route_confirm: [
        {
          speaker: "ジャック",
          text: "「お？ まだ意識はあるみたいだな。」",
          character: "jack_laugh",
        },
        {
          speaker: "ジャック",
          text: "「ここはガリアレムの掃き溜め、第4層の裏路地だ。歓迎するぜ、新入りのゴミクズさんよ。」",
          character: "jack_normal",
        },
      ],
      route_ask: [
        {
          speaker: "ジャック",
          text: "「俺か？ 俺はジャック。ただの通りすがりの『掃除屋』さ。」",
          character: "jack_normal",
        },
        {
          speaker: "ジャック",
          text: "「ここはガリアレムの掃き溜め、第4層の裏路地。お前みたいなのが降ってくる場所だ。」",
        },
      ],
    },
    // ToDo: Continue to Scene 4/5.
    // Limitations of current EventManager:
    // It seems to handle 'sequences' -> 'choices' -> 'routes'.
    // It doesn't look like it supports "Play Route X THEN go back to Main Sequence".
    // I might need to chain events or loop back.
    // For this iteration, I will put the rest of the dialogue in the routes or update EventManager to handle 'next_event'.
    // Or simply make the routes long enough to cover the rest.
    // Actually, let's keep it simple: The prologue ends after the choice for this specific test, or I extend the routes to include the rest of the text.
    // I'll extend the routes to include the rest of the text (Scene 4 & 5) since they converge.
  },
};

const commonContinuation = [
  {
    speaker: "ジャック",
    text: "（酒瓶らしきものを揺らす）で？ 祝いの一杯でもどうだ？ 泥水みたいな味だが、痛み止めにはなる。",
    character: "jack_normal",
    audio: "coin_toss", // Placeholder for bottle sound
  },
  {
    speaker: "ジャック",
    text: "「......ん？」",
    character: "jack_serious",
  },
  {
    speaker: "ジャック",
    text: "「お前、目が死んでるな。いや、死んでるっていうか...『無い』のか？」",
    character: "jack_serious",
  },
  {
    speaker: "ジャック",
    text: "「ハハッ！ こりゃ傑作だ。記憶もねえ、目的もねえ、ただの『空っぽ』かよ。」",
    character: "jack_laugh",
  },
  {
    speaker: "ジャック",
    text: "「気に入った。俺も似たようなもんでね。」",
    character: "jack_normal",
  },
  {
    speaker: "ジャック",
    text: "「立てるか？ ゴミ捨て場で寝てると、回収車に持ってかれるぞ。」",
    character: "jack_normal",
  },
  {
    speaker: "ジャック",
    text: "「行く当てがねえなら来な。面白い『玩具』を拾ったとあっちゃ、捨て置けねえ。」",
    character: "jack_laugh",
  },
  // --- ギルド「鴉の巣」到着シーン ---
  {
    speaker: "Narrator",
    text: "（……どれくらい歩いただろうか。薄暗い路地を抜けた先に、古びた建物が見えてきた。）",
    bg: "./images/bg/冒険者ギルド　鴉の巣　メインホール.png",
    bgm: "guild_theme", // 鴉の巣BGMに切り替え
  },
  {
    speaker: "ジャック",
    text: "「よっし、着いたぜ。ここが俺たちの『巣』だ。」",
    character: "jack_normal",
  },
  {
    speaker: "Narrator",
    text: "（看板には『冒険者ギルド 鴉の巣』と書かれている。酒と煙草の匂いが漂う、いかにも怪しげな場所だ。）",
  },
  {
    speaker: "ジャック",
    text: "「冒険者ギルド……まあ、何でも屋みたいなもんだ。依頼を受けて、金を稼ぐ。簡単だろ？」",
    character: "jack_normal",
  },
  {
    speaker: "ジャック",
    text: "「お前、身寄りもねえんだろ？ ここなら寝床も飯もある。……俺の『紹介』で何とかなるさ。」",
    character: "jack_laugh",
  },
  {
    speaker: "Narrator",
    text: "（ジャックは受付のカウンターに向かい、何やら話をつけている。）",
  },
  {
    speaker: "ジャック",
    text: "「……よし、話はついた。3日分の宿代、立て替えといてやったぜ。」",
    character: "jack_normal",
  },
  {
    speaker: "ジャック",
    text: "「それと……ほら、これ持っとけ。」",
    character: "jack_normal",
    audio: "coin_toss",
  },
  {
    speaker: "Narrator",
    text: "（ジャックは無造作に金貨の入った袋を投げてよこした。）",
  },
  {
    speaker: "ジャック",
    text: "「1000M……まあ、ゴミにはゴミなりの値段があるってやつだ。小遣いにしとけ。」",
    character: "jack_laugh",
  },
  {
    speaker: "ジャック",
    text: "「返せとは言わねえよ。……俺への『借り』として、覚えておきゃいい。」",
    character: "jack_normal",
  },
  {
    speaker: "ジャック",
    text: "「今日はゆっくり休め。明日から……そうだな、『稼ぎ方』を教えてやるよ。」",
    character: "jack_normal",
  },
  {
    speaker: "ジャック",
    text: "「じゃあな、相棒。また明日。……ハハッ、『相棒』か。悪くねえな。」",
    character: "jack_laugh",
  },
  // --- 宿部屋シーン ---
  {
    speaker: "Narrator",
    text: "（……案内された部屋は、小さいが清潔だった。窓から差し込む夕陽が、埃を金色に照らしている。）",
    bg: "./images/bg/鴉の巣　宿部屋.png",
    character: null, // ジャックの立ち絵を消す
  },
  {
    speaker: "System",
    text: "【1000M を手に入れた】",
    audio: "item_get",
  },
  {
    speaker: "Narrator",
    text: "（ベッドに身を沈めると、疲労が一気に押し寄せてきた。）",
  },
  {
    speaker: "Narrator",
    text: "（……ガイアレム。帝都グラディウス。冒険者ギルド『鴉の巣』。）",
  },
  {
    speaker: "Narrator",
    text: "（知らない世界。知らない自分。知らない男に拾われて。）",
  },
  {
    speaker: "Narrator",
    text: "（……それでも、今は。ただ、眠ろう。）",
  },
  {
    speaker: "System",
    text: "【プロローグ終了】\\nギルド『鴉の巣』を拠点として使えるようになりました。\\n※宿代は3日分立て替え済み。4日目以降は自費になります。",
  },
];

// Append common parts to routes
window.introEvents.rank1.routes.route_silent.push(...commonContinuation);
window.introEvents.rank1.routes.route_confirm.push(...commonContinuation);
window.introEvents.rank1.routes.route_ask.push(...commonContinuation);

// Mark event as complete flag
window.introEvents.rank1.onComplete = () => {
  localStorage.setItem("prologue_complete", "true");
  console.log("Prologue Complete! Guild unlocked.");
};
