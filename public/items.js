// Items Definition
window.ITEMS = {
    recovery: {
        'bread_crust': {
            id: 'bread_crust',
            name: 'パンの屑',
            description: 'カビの生えかけた硬いパン。胃を満たすことだけが目的。',
            tier: 1,
            hp_recovery: 10,
            price: 5
        },
        'dirty_water': {
            id: 'dirty_water',
            name: '泥水',
            description: '辛うじて飲める程度の水。喉の渇きを潤すが、腹を壊すリスクがある。',
            tier: 1,
            hp_recovery: 5,
            price: 2
        }
    },
    sanity: {
        'industrial_alcohol': {
            id: 'industrial_alcohol',
            name: '工業用アルコール',
            description: '「折れた柄」の裏メニュー。現実を忘れるには最適だが、代償は大きい。',
            tier: 1,
            hp_damage: 20,
            sanity_recovery: 30,
            price: 30
        }
    },
    combat: {
        'throwing_stone': {
            id: 'throwing_stone',
            name: 'ただの石ころ',
            description: 'その辺で拾った石。投げれば多少の牽制にはなる。',
            tier: 1,
            damage: 5,
            price: 1
        }
    }
};

window.WEAPONS = {
    // === Rank1 ===
    'rusty_shortsword': {
        id: 'rusty_shortsword',
        name: '錆びたショートソード',
        description: '手入れのされていない剣。刃こぼれが目立つ。',
        rank: 1,
        slot: 'right_hand',
        type: 'sword',
        stats: { ATK: 5 },
        price: 50
    },
    'wooden_spear': {
        id: 'wooden_spear',
        name: '木の槍',
        description: '先端を削っただけの棒。間合いだけは確保できる。',
        rank: 1,
        slot: 'right_hand',
        type: 'spear',
        stats: { ATK: 4 },
        price: 30
    },
    
    // === Rank2（救済措置用） ===
    'rusty_iron_sword': {
        id: 'rusty_iron_sword',
        name: '錆びた鉄剣',
        description: '手入れがされていない...が、まだ使える。',
        rank: 2,
        slot: 'right_hand',
        type: 'sword',
        stats: { ATK: 12 },
        price: 80
    },
    'worn_shield': {
        id: 'worn_shield',
        name: 'ボロ盾',
        description: '傷だらけの木盾。無いよりはマシ。',
        rank: 2,
        slot: 'left_hand',
        type: 'shield',
        stats: { DEF: 5 },
        price: 40
    }
};

window.ARMOR = {
    // === Rank1 ===
    'ragged_clothes': {
        id: 'ragged_clothes',
        name: 'ぼろぼろの服',
        description: '布切れを繋ぎ合わせたもの。防御力は皆無に等しい。',
        rank: 1,
        slot: 'upper_body',
        type: 'light',
        stats: { DEF: 1 },
        price: 10
    },
    
    // === Rank2（救済措置用） ===
    'rental_chestpiece': {
        id: 'rental_chestpiece',
        name: '貸し出し用の胸当て',
        description: '宿で貸し出されていた防具。使い古されている。',
        rank: 2,
        slot: 'upper_body',
        type: 'medium',
        stats: { DEF: 8 },
        price: 60
    },
    'worn_trousers': {
        id: 'worn_trousers',
        name: '使い込まれたズボン',
        description: '繕い跡が目立つが丈夫。',
        rank: 2,
        slot: 'lower_body',
        type: 'light',
        stats: { DEF: 4, SPD: 1 },
        price: 35
    }
};
