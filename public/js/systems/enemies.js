/**
 * 敵データ定義
 * 七つの願いが降る庭で - Enemy Data
 */

const ENEMIES = {
    // ========================================
    // ランクE - 序盤
    // ========================================
    
    goblin: {
        id: 'goblin',
        name: 'ゴブリン',
        rank: 'E',
        stats: {
            hp: 30,
            maxHp: 30,
            atk: 8,
            def: 3,
            spd: 12
        },
        type: 'monster',
        image: 'エネミー/ゴブリン.png',
        drops: [
            { item: 'goblin_fang', name: 'ゴブリンの牙', chance: 50, price: 10 },
            { item: 'herb', name: '傷薬', chance: 10, price: 50 }
        ],
        rewards: {
            money: 15,
            exp: 8
        },
        behavior: {
            attack: 80,
            flee: { condition: 'hp_below', threshold: 20, chance: 50 }
        },
        spawnCount: { min: 1, max: 2 },
        description: '最弱の敵。チュートリアル的存在'
    },

    poison_rat: {
        id: 'poison_rat',
        name: 'ポイズンラット',
        rank: 'E',
        stats: {
            hp: 20,
            maxHp: 20,
            atk: 5,
            def: 2,
            spd: 18
        },
        type: 'monster',
        image: 'エネミー/ポイズンラット.png',
        drops: [
            { item: 'poison_sac', name: '毒袋', chance: 30, price: 30 },
            { item: 'antidote', name: '解毒薬', chance: 5, price: 100 }
        ],
        rewards: {
            money: 10,
            exp: 5
        },
        behavior: {
            attack: 60,
            special: { name: '毒噛みつき', chance: 40, effect: 'poison', successRate: 50 }
        },
        spawnCount: { min: 1, max: 3 },
        description: '低HP高速。毒が厄介'
    },

    // ========================================
    // ランクD - 序盤～中盤
    // ========================================

    thug_a: {
        id: 'thug_a',
        name: '暴漢',
        rank: 'D',
        stats: {
            hp: 80,
            maxHp: 80,
            atk: 15,
            def: 8,
            spd: 10
        },
        type: 'human',
        image: 'エネミー/暴漢1.png',
        drops: [
            { item: 'stolen_goods', name: '盗品', chance: 40, price: 50 },
            { item: 'throwing_knife', name: '投げナイフ', chance: 20, price: 30 }
        ],
        rewards: {
            money: 30,
            exp: 20
        },
        behavior: {
            attack: 70,
            intimidate: { chance: 20, effect: 'atk_down', value: 10, duration: 3 },
            extort: { chance: 10, amount: 100 }
        },
        timeRestriction: { start: 20, end: 6 }, // 夜間のみ
        spawnCount: { min: 1, max: 2 },
        description: '人間敵。カルマ「正義」で追加ダメージ'
    },

    thug_b: {
        id: 'thug_b',
        name: '暴漢（ナイフ）',
        rank: 'D',
        stats: {
            hp: 60,
            maxHp: 60,
            atk: 20,
            def: 5,
            spd: 14
        },
        type: 'human',
        image: 'エネミー/暴漢2.png',
        drops: [
            { item: 'stolen_goods', name: '盗品', chance: 40, price: 50 },
            { item: 'throwing_knife_x3', name: '投げナイフ×3', chance: 30, price: 90 }
        ],
        rewards: {
            money: 35,
            exp: 22
        },
        behavior: {
            attack: 50,
            knifeThrow: { chance: 30, alwaysHit: true },
            ambush: { chance: 20, critical: true }
        },
        timeRestriction: { start: 20, end: 6 },
        spawnCount: { min: 1, max: 2 },
        description: '攻撃特化型の暴漢'
    }
};

// ========================================
// エリア別出現テーブル
// ========================================

const SPAWN_TABLES = {
    lower_main: {
        name: '下層メインストリート',
        encounterRate: 5,
        day: [
            { enemy: 'goblin', weight: 80 },
            { enemy: 'wild_dog', weight: 20 }
        ],
        night: [
            { enemy: 'goblin', weight: 60 },
            { enemy: 'wild_dog', weight: 40 }
        ]
    },

    market: {
        name: '市場',
        encounterRate: 2,
        day: [
            { enemy: 'goblin', weight: 100 }
        ],
        night: [
            { enemy: 'goblin', weight: 80 },
            { enemy: 'poison_rat', weight: 20 }
        ]
    },

    back_alley: {
        name: '裏路地',
        encounterRate: 25,
        encounterRateNight: 50,
        day: [
            { enemy: 'goblin', weight: 40 },
            { enemy: 'poison_rat', weight: 30 },
            { enemy: 'thug_a', weight: 20 },
            { enemy: 'thug_b', weight: 10 }
        ],
        night: [
            { enemy: 'goblin', weight: 20 },
            { enemy: 'poison_rat', weight: 20 },
            { enemy: 'thug_a', weight: 35 },
            { enemy: 'thug_b', weight: 25 }
        ]
    },

    highway: {
        name: '街道',
        encounterRate: 30,
        day: [
            { enemy: 'goblin', weight: 30 },
            { enemy: 'poison_rat', weight: 20 },
            { enemy: 'slime', weight: 25 },
            { enemy: 'wild_dog', weight: 15 },
            { enemy: 'bandit', weight: 10 }
        ],
        night: [
            { enemy: 'goblin', weight: 20 },
            { enemy: 'poison_rat', weight: 20 },
            { enemy: 'slime', weight: 15 },
            { enemy: 'wild_dog', weight: 20 },
            { enemy: 'skeleton', weight: 15 },
            { enemy: 'bandit', weight: 10 }
        ]
    }
};

// ========================================
// ユーティリティ関数
// ========================================

/**
 * 敵データを取得
 * @param {string} enemyId - 敵ID
 * @returns {object|null} 敵データのコピー
 */
function getEnemyData(enemyId) {
    const enemy = ENEMIES[enemyId];
    if (!enemy) return null;
    
    // ディープコピーを返す（戦闘中に変更されるため）
    return JSON.parse(JSON.stringify(enemy));
}

/**
 * エリアのエンカウントをチェック
 * @param {string} areaId - エリアID
 * @param {boolean} isNight - 夜間かどうか
 * @returns {boolean} エンカウントするかどうか
 */
function checkEncounter(areaId, isNight) {
    const table = SPAWN_TABLES[areaId];
    if (!table) return false;
    
    const rate = isNight && table.encounterRateNight 
        ? table.encounterRateNight 
        : table.encounterRate;
    
    return Math.random() * 100 < rate;
}

/**
 * エリアから敵を抽選
 * @param {string} areaId - エリアID
 * @param {boolean} isNight - 夜間かどうか
 * @returns {object|null} 敵データ
 */
function spawnEnemy(areaId, isNight) {
    const table = SPAWN_TABLES[areaId];
    if (!table) return null;
    
    const spawnList = isNight ? table.night : table.day;
    const totalWeight = spawnList.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * totalWeight;
    
    for (const spawn of spawnList) {
        roll -= spawn.weight;
        if (roll <= 0) {
            const enemyData = getEnemyData(spawn.enemy);
            if (enemyData) {
                // 群れ出現数を決定
                const count = Math.floor(
                    Math.random() * (enemyData.spawnCount.max - enemyData.spawnCount.min + 1)
                ) + enemyData.spawnCount.min;
                
                return {
                    ...enemyData,
                    count: count
                };
            }
        }
    }
    
    return null;
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ENEMIES, SPAWN_TABLES, getEnemyData, checkEncounter, spawnEnemy };
}
