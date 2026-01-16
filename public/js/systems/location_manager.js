/**
 * グラディウス ロケーションマネージャー
 * 1時間移動制、昼夜切替、エンカウント対応
 */

class LocationManager {
    constructor() {
        // ロケーション定義
        this.locations = {
            // === 鴉の巣（拠点） ===
            'crows_nest_hall': {
                id: 'crows_nest_hall',
                name: '鴉の巣・メインホール',
                nameJP: '鴉の巣　メインホール',
                bg: './images/bg/冒険者ギルド　鴉の巣　メインホール.png',
                type: 'guild',
                features: ['クエスト受注', '情報収集', 'クロウとの会話'],
                connections: ['crows_nest_room', 'lower_main_street'],
                travelTime: 0,
                encounterRate: 0,
                shopType: null,
                bgmDay: './BGM/鴉の巣 基本BGM.mp3',
                bgmNight: './BGM/鴉の巣 基本BGM.mp3'
            },
            'crows_nest_room': {
                id: 'crows_nest_room',
                name: '鴉の巣・宿部屋',
                nameJP: '鴉の巣　宿部屋',
                bg: './images/bg/鴉の巣　宿部屋.png',
                type: 'rest',
                features: ['休息（HP/STM回復）', 'セーブ', '時間経過'],
                connections: ['crows_nest_hall'],
                travelTime: 0,
                encounterRate: 0,
                shopType: null,
                canRest: true
            },

            // === 下層部 ===
            'lower_main_street': {
                id: 'lower_main_street',
                name: '下層部・メインストリート',
                nameJP: 'グラディウス　下層部　メインストリート',
                bg: './images/bg/グラディウス　下層部　メインストリート　朝.png',
                type: 'street',
                features: ['通行人', '情報収集'],
                connections: ['crows_nest_hall', 'lower_market', 'lower_alley', 'emperor_plaza'],
                travelTime: 1,
                encounterRate: 0.05,
                encounterEnemies: ['ゴロツキ'],
                shopType: null,
                bgmDay: './BGM/グラディウスの町　昼.mp3',
                bgmNight: './BGM/グラディウスの町　夜.mp3'
            },
            'lower_market': {
                id: 'lower_market',
                name: '下層部・市場',
                nameJP: 'グラディウス　下層部　市場',
                bg: './images/bg/グラディウス　下層部　市場　朝.png',
                type: 'market',
                features: ['買い物（安価）', '情報収集', '露店'],
                connections: ['lower_main_street', 'lower_alley'],
                travelTime: 1,
                encounterRate: 0.02,
                shopType: 'general_cheap',
                merchants: ['食材商人', '雑貨商人', '怪しい露店商']
            },
            'lower_alley': {
                id: 'lower_alley',
                name: '下層部・裏路地',
                nameJP: 'グラディウス　下層部　裏路地',
                bg: './images/bg/グラディウス　下層部　裏路地　朝.png',
                type: 'dangerous',
                features: ['危険地帯', '闇取引', 'レアアイテム'],
                connections: ['lower_main_street', 'lower_market'],
                travelTime: 1,
                encounterRate: 0.25,
                encounterRateNight: 0.5,
                encounterEnemies: ['ゴロツキ', '巨大ネズミ', 'ならず者'],
                shopType: 'black_market'
            },

            // === 中央部 ===
            'emperor_plaza': {
                id: 'emperor_plaza',
                name: '皇帝広場',
                nameJP: 'グラディウス　皇帝広場',
                bg: './images/bg/グラディウス　皇帝広場.png',
                type: 'plaza',
                features: ['布告掲示板', '噴水', '待ち合わせスポット'],
                connections: ['lower_main_street', 'upper_main_street', 'cathedral'],
                travelTime: 1,
                encounterRate: 0,
                shopType: null,
                randomEvents: true
            },

            // === 上層部 ===
            'upper_main_street': {
                id: 'upper_main_street',
                name: '上層部・メインストリート',
                nameJP: 'グラディウス上層部メインストリート',
                bg: './images/bg/グラディウス上層部メインストリート.png',
                type: 'street',
                features: ['貴族の行き交い', '衛兵巡回'],
                connections: ['emperor_plaza', 'upper_shopping', 'royal_library'],
                travelTime: 1,
                encounterRate: 0,
                shopType: null
            },
            'upper_shopping': {
                id: 'upper_shopping',
                name: '上層部・商店街',
                nameJP: 'グラディウス上層部　商店街',
                bg: './images/bg/グラディウス上層部　商店街　朝.png',
                type: 'market',
                features: ['高級品店', '武器防具店', '魔法道具店'],
                connections: ['upper_main_street'],
                travelTime: 1,
                encounterRate: 0,
                shopType: 'premium',
                merchants: ['武器商人', '防具商人', '魔法商人', 'アクセサリー商人']
            },

            // === 特殊施設 ===
            'royal_library': {
                id: 'royal_library',
                name: '王立図書館',
                nameJP: 'グラディウス王立図書館',
                bg: './images/bg/グラディウス王立図書館.png',
                type: 'library',
                features: ['書物閲覧', '禁書庫（条件付き）', '司書'],
                connections: ['upper_main_street'],
                travelTime: 1,
                encounterRate: 0,
                shopType: null,
                bgm: './BGM/図書館BGM.mp3',
                specialNPC: '司書'
            },
            'cathedral': {
                id: 'cathedral',
                name: 'カストルム大聖堂',
                nameJP: 'カストルム大聖堂',
                bg: './images/bg/カストルム大聖堂.png',
                type: 'church',
                features: ['礼拝', '孤児院', 'マリアンヌとの会話'],
                connections: ['emperor_plaza'],
                travelTime: 1,
                encounterRate: 0,
                shopType: null,
                specialNPC: 'マリアンヌ'
            },

            // === フィールド ===
            'highway': {
                id: 'highway',
                name: '街道',
                nameJP: '街道',
                bg: './images/bg/街道（オープニングでジャックに拾われるときの）.png',
                type: 'field',
                features: ['グラディウス外部', '旅人', '野営地'],
                connections: ['lower_main_street'],
                travelTime: 2,
                encounterRate: 0.3,
                encounterEnemies: ['野犬', 'ゴブリン', '盗賊']
            }
        };

        // 現在地
        this.currentLocation = 'crows_nest_hall';
        
        // ゲーム内時間（0-23時）
        this.gameHour = 8;
        this.gameDay = 1;
        
        // UI要素
        this.container = null;
        
        this.init();
    }

    init() {
        this.createUI();
        this.updateUI();
        console.log('[LocationManager] 初期化完了');
    }

    createUI() {
        // ロケーションUIコンテナ
        this.container = document.createElement('div');
        this.container.id = 'location-ui';
        this.container.className = 'location-ui hidden';
        this.container.innerHTML = `
            <div class="location-header">
                <div class="location-time">
                    <span id="game-day">1日目</span>
                    <span id="game-hour">08:00</span>
                </div>
                <div class="location-name" id="current-location-name">鴉の巣・メインホール</div>
            </div>
            <div class="location-actions" id="location-actions">
                <!-- 動的に生成 -->
            </div>
            <div class="location-destinations" id="location-destinations">
                <!-- 移動先リスト -->
            </div>
        `;
        document.body.appendChild(this.container);
    }

    updateUI() {
        const loc = this.locations[this.currentLocation];
        
        // 現在地名更新
        document.getElementById('current-location-name').textContent = loc.name;
        
        // 時間更新
        document.getElementById('game-day').textContent = `${this.gameDay}日目`;
        document.getElementById('game-hour').textContent = 
            `${String(this.gameHour).padStart(2, '0')}:00`;
        
        // 背景更新
        this.updateBackground(loc);
        
        // アクション更新
        this.updateActions(loc);
        
        // 移動先更新
        this.updateDestinations(loc);
    }

    updateBackground(loc) {
        const bgLayer = document.getElementById('background-layer');
        if (bgLayer) {
            bgLayer.style.backgroundImage = `url('${loc.bg}')`;
        }
    }

    updateActions(loc) {
        const actionsContainer = document.getElementById('location-actions');
        actionsContainer.innerHTML = '';
        
        // 場所の機能に基づいてアクションボタン生成
        loc.features.forEach(feature => {
            const btn = document.createElement('button');
            btn.className = 'btn-location-action';
            btn.textContent = feature;
            btn.addEventListener('click', () => this.doAction(feature));
            actionsContainer.appendChild(btn);
        });
        
        // 休息可能な場所
        if (loc.canRest) {
            const restBtn = document.createElement('button');
            restBtn.className = 'btn-location-action btn-rest';
            restBtn.textContent = '休息する';
            restBtn.addEventListener('click', () => this.rest());
            actionsContainer.appendChild(restBtn);
        }
    }

    updateDestinations(loc) {
        const destContainer = document.getElementById('location-destinations');
        destContainer.innerHTML = '<h4>移動先</h4>';
        
        loc.connections.forEach(destId => {
            const dest = this.locations[destId];
            const btn = document.createElement('button');
            btn.className = 'btn-location-move';
            btn.innerHTML = `
                <span class="dest-name">${dest.name}</span>
                <span class="dest-time">${dest.travelTime}時間</span>
            `;
            btn.addEventListener('click', () => this.moveTo(destId));
            destContainer.appendChild(btn);
        });
    }

    async moveTo(destinationId) {
        const dest = this.locations[destinationId];
        
        // 時間経過
        this.advanceTime(dest.travelTime || 1);
        
        // エンカウント判定
        const encounterChance = this.isNight() ? 
            (dest.encounterRateNight || dest.encounterRate) : 
            dest.encounterRate;
        
        if (Math.random() < encounterChance && dest.encounterEnemies) {
            // エンカウント発生
            const enemy = dest.encounterEnemies[
                Math.floor(Math.random() * dest.encounterEnemies.length)
            ];
            console.log(`[エンカウント] ${enemy}が現れた！`);
            // TODO: 戦闘システム呼び出し
            // await this.triggerBattle(enemy);
        }
        
        // ランダムイベント判定
        if (dest.randomEvents && Math.random() < 0.15) {
            console.log('[ランダムイベント] 発生！');
            // TODO: ランダムイベント呼び出し
        }
        
        // 移動
        this.currentLocation = destinationId;
        
        // BGM切り替え
        this.updateBGM(dest);
        
        // UI更新
        this.updateUI();
        
        console.log(`[移動] ${dest.name}に到着（${this.gameHour}:00）`);
    }

    advanceTime(hours) {
        this.gameHour += hours;
        
        // 日付変更
        while (this.gameHour >= 24) {
            this.gameHour -= 24;
            this.gameDay++;
            console.log(`[時間経過] ${this.gameDay}日目になった`);
            
            // 365日チェック（バッドエンド）
            if (this.gameDay > 365) {
                console.log('[ゲームオーバー] ガイアレムデトックス発動');
                // TODO: バッドエンド処理
            }
        }
    }

    isNight() {
        return this.gameHour >= 20 || this.gameHour < 6;
    }

    updateBGM(loc) {
        if (window.audioManager) {
            const bgm = this.isNight() ? 
                (loc.bgmNight || loc.bgmDay || loc.bgm) : 
                (loc.bgmDay || loc.bgm);
            
            if (bgm) {
                window.audioManager.playBGM(bgm);
            }
        }
    }

    rest() {
        // 8時間休息
        console.log('[休息] 8時間休息開始...');
        this.advanceTime(8);
        
        // HP/STM回復
        if (window.vitalGauge) {
            window.vitalGauge.heal(window.vitalGauge.maxHP);
            window.vitalGauge.recoverStamina(window.vitalGauge.maxStamina);
        }
        
        console.log('[休息] HP/STM全回復！');
        this.updateUI();
    }

    doAction(action) {
        console.log(`[アクション] ${action}`);
        
        // TODO: 各アクションの実装
        switch(action) {
            case 'クエスト受注':
                // クエストボード表示
                break;
            case '情報収集':
                // ランダムヒント表示
                break;
            case '書物閲覧':
                // 図書館システム
                break;
            case '買い物（安価）':
            case '高級品店':
                // ショップシステム
                break;
            default:
                console.log(`アクション「${action}」は未実装`);
        }
    }

    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    }

    hide() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }

    // 現在地情報取得
    getCurrentLocation() {
        return this.locations[this.currentLocation];
    }

    // 時間情報取得
    getTimeInfo() {
        return {
            day: this.gameDay,
            hour: this.gameHour,
            isNight: this.isNight()
        };
    }
}

// グローバル登録
window.LocationManager = LocationManager;
