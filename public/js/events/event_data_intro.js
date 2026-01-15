// Introduction Event Data - Variation A: The Drunken Encounter
window.introEvents = {
    intro_sequence_a: {
        title: "The Drunken Encounter",
        sequences: [
            // Opening Ambience
            { speaker: "System", text: "……ザー……", audio: "noise" },
            { speaker: "System", text: "…………", audio: "rain" },
            
            // Jack enters
            { speaker: "？？？", text: "……あー、クソ。また降りやがった。" },
            { speaker: "？？？", text: "おい、そこで寝てる奴、踏むぞ。" },
            
            // Protagonist interaction
            { speaker: "System", text: "（……頭が痛い。雨の音がする。）" },
            { speaker: "？？？", text: "……なんだ、死体じゃねぇのか。" },
            { speaker: "？？？", text: "生きてるならどけ。俺の特等席だ。" },
            
            // Jack's reaction
            { speaker: "Jack", text: "お前、変な格好してんな。どこの部隊だ？", audio: "heartbeat" },
            { speaker: "System", text: "（男は酒臭い息を吐きながら、不躾にこちらを見下ろしている。）" },
            { speaker: "Jack", text: "……チッ、無視かよ。まあいい、俺は飲む。" },
            { speaker: "Jack", text: "……運が良かったな。俺が今、機嫌が良いってことだ。" },
            { speaker: "Jack", text: "……名は？" },
            
            // Branch point if we had choices, but for intro let's keep it linear or minimal
        ],
        choices: [
            {
                text: "名乗る",
                next_sequence: "route_intro_name",
                karma_change: { law: 1 }
            },
            {
                text: "黙っている",
                next_sequence: "route_intro_silent",
                karma_change: { chaos: 1 }
            }
        ],
        routes: {
            route_intro_name: [
                { speaker: "Jack", text: "ふーん……。聞いたことねぇ名だ。" },
                { speaker: "Jack", text: "ま、いい。俺はジャック。……傭兵だ。一応な。" },
                { speaker: "Jack", text: "行く当てがねぇならついて来い。盾くらいにはなるだろ。" }
            ],
            route_intro_silent: [
                { speaker: "Jack", text: "……口が利けないのか？ それとも俺が気に入らねぇか。" },
                { speaker: "Jack", text: "ハッ、生意気な目が気に入った。" },
                { speaker: "Jack", text: "拾ってやるよ。ボロ雑巾みたいに捨てられるまで、せいぜい足掻け。" }
            ]
        }
    }
};
