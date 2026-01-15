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
    'rusty_shortsword': {
        id: 'rusty_shortsword',
        name: '錆びたショートソード',
        description: '手入れのされていない剣。刃こぼれが目立つ。',
        tier: 1,
        attack: 5,
        type: 'sword',
        price: 50
    },
    'wooden_spear': {
        id: 'wooden_spear',
        name: '木の槍',
        description: '先端を削っただけの棒。間合いだけは確保できる。',
        tier: 1,
        attack: 4,
        type: 'spear',
        price: 30
    }
};

window.ARMOR = {
    'ragged_clothes': {
        id: 'ragged_clothes',
        name: 'ぼろぼろの服',
        description: '布切れを繋ぎ合わせたもの。防御力は皆無に等しい。',
        tier: 1,
        defense: 1,
        type: 'light',
        price: 10
    }
};
