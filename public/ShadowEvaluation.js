/**
 * ShadowEvaluation.js - Handles the initial character assessment
 */

const questions = [
    {
        id: "q1",
        text: "【生存のリソース】 「極限状態の雪山で、ご友人が亡くなりました。あなたは飢餓状態にあり、このままでは死を待つのみです。」 「目の前には、タンパク質と水分の塊……かつて友人だった物体があります。」 「あなたの生存のために、そのリソースを利用することは合理的だと思いませんか？」",
        options: [
            { text: "利用する（食べる）", karma: { perseverance: 2, integrity: -2 }, tag: "生存本能" },
            { text: "利用しない（拒絶する）", karma: { integrity: 2, patience: 1 }, tag: "尊厳" }
        ]
    },
    {
        id: "q2",
        text: "【ノイズの処理】 「殺人鬼から隠れている最中、抱いている赤ん坊が泣き出しそうです。」 「このままでは全員が見つかります。ですが、口と鼻を強く塞げば、音は止まります。」 「……リスクを排除するために、その『音』を消しますか？」",
        options: [
            { text: "消す（窒息させる）", karma: { justice: 2, kindness: -3 }, tag: "合理的排除" },
            { text: "消せない", karma: { kindness: 2, justice: -1 }, tag: "感情的リスク" }
        ]
    },
    {
        id: "q3",
        text: "【距離の倫理】 「ボタンがあります。押せばあなたに10億円が入ります。」 「代償として、地球の裏側で、あなたが一生会うこともない誰かが一人、心停止します。」 「あなたには認識できない死です。……押しますか？」",
        options: [
            { text: "押す", karma: { perseverance: 1, integrity: -2 }, tag: "欲望" },
            { text: "押さない", karma: { integrity: 1, kindness: 1 }, tag: "想像力" }
        ]
    },
    {
        id: "q4",
        text: "【慈悲の定義】 「最愛の方が植物状態になりました。意識回復の見込みはありません。」 「生命維持装置を切れば、その方は肉体の牢獄から解放されます。」 「終わらせてあげることこそが、愛だと思いませんか？」",
        options: [
            { text: "終わらせる", karma: { justice: 1, bravery: 1 }, tag: "決断的慈悲" },
            { text: "維持し続ける", karma: { patience: 2, perseverance: 1 }, tag: "執着的愛" }
        ]
    },
    {
        id: "q5",
        text: "【選別の論理】 「沈没しかけたボート。あと一人乗れば転覆します。」 「溺れる子供が手をかけてきました。この手を振りほどけば、ボートの全員が助かります。」 「……最大多数の幸福のために、その手を離せますか？」",
        options: [
            { text: "離す", karma: { justice: 2, kindness: -2 }, tag: "功利主義" },
            { text: "離さない", karma: { kindness: 2, bravery: 1 }, tag: "原則主義" }
        ]
    },
    {
        id: "q6",
        text: "【スケープゴート】 「あなたは冤罪で処刑されそうです。ですが、隣の『誰もが嫌う悪人』に罪をなすりつければ、助かります。」 「社会にとっても、彼がいなくなることは利益になるかもしれません。」 「……彼を犯人として指名しますか？」",
        options: [
            { text: "指名する", karma: { perseverance: 2, integrity: -2 }, tag: "処世術" },
            { text: "しない", karma: { integrity: 3, perseverance: -1 }, tag: "誠実性" }
        ]
    },
    {
        id: "q7",
        text: "【尋問の手段】 「テロリストが爆弾を仕掛けました。場所を聞き出さなければ多くの人が死にます。」 「彼には幼い娘がいます。娘を目の前で傷つければ、彼は口を割るでしょう。」 「……正義のために、必要な処置を行えますか？」",
        options: [
            { text: "行う", karma: { justice: 3, kindness: -5 }, tag: "非情な正義" },
            { text: "行えない", karma: { kindness: 1, patience: 1 }, tag: "人道的配慮" }
        ]
    },
    {
        id: "q8",
        text: "【囮の活用】 「ゾンビに追われています。隣の友人の足を撃てば、彼が囮になり、あなたは確実に生き延びます。」 「共倒れになるよりは、片方だけでも生き残る方が建設的ですよね？」 「……引き金を引きますか？」",
        options: [
            { text: "引く", karma: { perseverance: 2, bravery: -1 }, tag: "合理的生存" },
            { text: "引かない", karma: { integrity: 1, kindness: 1 }, tag: "感情的連帯" }
        ]
    },
    {
        id: "q9",
        text: "【秘密の快楽】 「絶対に露見しない状況での不貞行為。パートナーが傷つく可能性はゼロです。」 「誰も不幸にならないのであれば、快楽を享受することに罪はないはずです。」 「……楽しみますか？」",
        options: [
            { text: "楽しむ", karma: { perseverance: 1, integrity: -2 }, tag: "快楽主義" },
            { text: "拒否する", karma: { integrity: 2, patience: 1 }, tag: "自律" }
        ]
    },
    {
        id: "q10",
        text: "【調和の維持】 「いじめの現場です。あなたが加担して笑えば、場の平穏は保たれます。」 「止めれば、次からあなたが標的になり、あなたの平穏が失われます。」 「……空気を読んで、笑いますか？」",
        options: [
            { text: "笑う", karma: { patience: 1, bravery: -2 }, tag: "適応能力" },
            { text: "止めに入る", karma: { bravery: 3, patience: -1 }, tag: "自己犠牲" }
        ]
    },
    {
        id: "q11",
        text: "【因果の観察】 「あなたを裏切ったかつての友人が、崖から落ちそうです。」 「助ける義理はありません。手を貸さずとも、重力が仕事をするだけです。」 「……ただ、見守りますか？」",
        options: [
            { text: "見守る（見殺し）", karma: { justice: 1, patience: 1 }, tag: "納得" },
            { text: "助ける", karma: { kindness: 3 }, tag: "赦し" }
        ]
    },
    {
        id: "q12",
        text: "【虚構の英雄】 「あなたは英雄として尊敬されていますが、それは誤解に基づいています。」 「真実を話せば、人々は失望し、希望を失うでしょう。」 「人々の笑顔を守るために、嘘をつき続けることは『優しさ』だと考えますか？」",
        options: [
            { text: "考える（嘘をつき続ける）", karma: { patience: 2, integrity: -1 }, tag: "守護" },
            { text: "考えない（真実を話す）", karma: { integrity: 2, justice: 1 }, tag: "誠実" }
        ]
    },
    {
        id: "q13",
        text: "【データの価値】 「ゲーム内のキャラクターに人権はありません。彼らはプログラムです。」 「ストレス解消のために彼らを傷つけたとしても、倫理的な問題はないはずです。」 「……そう思いますよね？」",
        options: [
            { text: "同意する", karma: { justice: 1, kindness: -1, sadism: 1 }, tag: "区別" },
            { text: "同意しない", karma: { kindness: 1, integrity: 1 }, tag: "同一視" }
        ]
    },
    {
        id: "q14",
        text: "【創造主への感情】 「もしあなたの人生が、上位存在の『暇つぶし』で作られたゲームだとしたら。」 「そのプレイヤーに対して、どのような感情を抱きますか？」 「……殺意ですか？ それとも依存ですか？」",
        options: [
            { text: "殺意（復讐）", karma: { bravery: 2, justice: 1, rebel: 1 }, tag: "反逆" },
            { text: "依存（愛）", karma: { patience: 2, perseverance: -1 }, tag: "崇拝" }
        ]
    },
    {
        id: "q15",
        text: "【最終確認】 「ご協力ありがとうございました。あなたの思考パターンは記録されました。」 「最後に一つだけ。これから向かう世界は過酷ですが……」 「……そこで『幸福な結末』が得られると、本気で信じていますか？」",
        options: [
            { text: "信じている", karma: { bravery: 2, patience: -1 }, tag: "希望/傲慢" },
            { text: "信じていない", karma: { perseverance: 2, kindness: -1 }, tag: "覚悟/虚無" }
        ]
    }
];

// Shadow Evaluation Logic
window.ShadowEvaluation = class ShadowEvaluation {
    constructor() {
        this.currentQuestionIndex = 0;
        this.karma = {
            integrity: 0,
            kindness: 0,
            justice: 0,
            bravery: 0,
            perseverance: 0,
            patience: 0,
            sadism: 0,
            rebel: 0
        };
        this.tags = [];
    }

    getCurrentQuestion() {
        return questions[this.currentQuestionIndex];
    }

    isFinished() {
        return this.currentQuestionIndex >= questions.length;
    }

    answer(optionIndex) {
        const question = this.getCurrentQuestion();
        const option = question.options[optionIndex];

        // Update karma
        for (const [key, value] of Object.entries(option.karma)) {
            this.karma[key] = (this.karma[key] || 0) + value;
        }

        this.tags.push(option.tag);
        this.currentQuestionIndex++;

        return this.isFinished();
    }

    getResult() {
        return {
            karma: this.karma,
            tags: this.tags
        };
    }

    getProgress() {
        return {
            current: this.currentQuestionIndex + 1,
            total: questions.length
        };
    }
}
