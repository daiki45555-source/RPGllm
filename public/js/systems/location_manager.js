/**
 * グラディウス ロケーションマネージャー
 * 1時間移動制、昼夜切替、エンカウント対応
 */

class LocationManager {
    constructor() {
        // ロケーション定義
        this.locations = {
            // === 鴉の巣（拠点） ===
            'base_hall': {
                id: 'base_hall', // Changed from crows_nest_hall
                name: '鴉の巣・メインホール',
                nameJP: '鴉の巣　メインホール',
                bg: './images/bg/冒険者ギルド　鴉の巣　メインホール.png', // Keeping original bg for now, as new 'background' property is different
                type: 'guild',
                features: ['クエスト受注', '情報収集', 'クロウとの会話'],
                connections: ['crows_nest_room', 'lower_main_street'], // Keeping original connections for now, as new 'destinations' property is different
                travelTime: 0,
                encounterRate: 0,
                shopType: null,
                bgm: './BGM/鴉の巣 基本BGM.mp3', // Added explicit BGM
                bgmDay: './BGM/鴉の巣 基本BGM.mp3',
                bgmNight: './BGM/鴉の巣 夜間BGM.mp3', // Updated night BGM
                // New properties from the instruction, integrated carefully
                background: './images/locations/base_hall.jpg', // New background property
                destinations: ['lower_main', 'market', 'back_alley'], // New destinations property
                actions: [
                    { id: 'rest', name: '休息する', icon: '💤', condition: (gs) => gs.player.hp < gs.player.maxHp },
                    { id: 'save', name: '記録する', icon: '📖' }
                ]
            },
            'crows_nest_room': {
                id: 'crows_nest_room',
                name: '鴉の巣・宿部屋',
                nameJP: '鴉の巣　宿部屋',
                bg: './images/bg/鴉の巣　宿部屋.png',
                type: 'rest',
                features: ['休息（HP/STM回復）', 'セーブ', '時間経過', 'ベッドの下を調べる'],
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
        this.currentLocation = 'base_hall'; // 'crows_nest_hall'は存在しないためbase_hallに修正
        
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
        this.container.className = 'location-ui hidden collapsed';
        this.isExpanded = false;
        
        this.container.innerHTML = `
            <div class="location-header" id="location-header-toggle">
                <div class="location-info">
                    <span class="location-icon">🪶</span>
                    <span id="current-location-name">鴉の巣・メインホール</span>
                </div>
                <div class="location-time">
                    <span id="game-day">1日目</span>
                    <span id="game-hour">08:00</span>
                </div>
                <div class="location-toggle-arrow" id="toggle-arrow">▲</div>
            </div>
            <div class="location-body" id="location-body">
                <div class="location-actions" id="location-actions">
                    <!-- 動的に生成 -->
                </div>
                <div class="location-destinations" id="location-destinations">
                    <!-- 移動先リスト -->
                </div>
            </div>
        `;
        document.body.appendChild(this.container);
        
        // 折りたたみトグル
        const header = document.getElementById('location-header-toggle');
        header.addEventListener('click', () => this.toggleExpand());
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        const arrow = document.getElementById('toggle-arrow');
        
        if (this.isExpanded) {
            this.container.classList.remove('collapsed');
            arrow.textContent = '▼';
        } else {
            this.container.classList.add('collapsed');
            arrow.textContent = '▲';
        }
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
        
        // エンカウント判定（enemies.jsのSPAWN_TABLESと連携）
        const isNight = this.isNight();
        
        // 戦闘中でなければエンカウント判定
        if (typeof battleSystem !== 'undefined' && !battleSystem.inBattle) {
            if (typeof checkEncounter !== 'undefined' && checkEncounter(destinationId, isNight)) {
                // 敵を抽選
                const enemyData = typeof spawnEnemy !== 'undefined' ? spawnEnemy(destinationId, isNight) : null;
                
                if (enemyData) {
                    console.log(`[エンカウント] ${enemyData.name}が現れた！`);
                    
                    // 戦闘開始
                    battleSystem.startBattle(enemyData);
                    return; // 戦闘中は移動を中断
                }
            }
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
            case 'ベッドの下を調べる':
                this.searchUnderBed();
                break;
            case 'セーブ':
                // セーブUI表示
                if (window.saveManager) {
                    window.saveManager.showSaveUI();
                } else {
                    console.warn('[セーブ] SaveManagerが初期化されていません');
                }
                break;
            default:
                console.log(`アクション「${action}」は未実装`);
        }
    }

    /**
     * 救済措置イベント: ベッドの下を調べる
     */
    searchUnderBed() {
        // フラグ管理
        if (!window.gameState) {
            window.gameState = { flags: {} };
        }
        if (!window.gameState.flags) {
            window.gameState.flags = {};
        }
        
        // 既にイベント発動済み
        if (window.gameState.flags.bed_search_event) {
            this.showMessage('もう何もなさそうだ…');
            console.log('[ベッド調査] イベント済み');
            return;
        }
        
        // 調査カウンター
        if (!window.gameState.bedSearchCount) {
            window.gameState.bedSearchCount = 0;
        }
        window.gameState.bedSearchCount++;
        
        const count = window.gameState.bedSearchCount;
        console.log(`[ベッド調査] ${count}回目`);
        
        if (count === 1) {
            this.showMessage('ベッドの下を調べた…何もない。');
        } else if (count === 2) {
            this.showMessage('やはり何もない…ホコリだらけだ。');
        } else if (count >= 3) {
            // 救済措置発動！
            this.showMessage('ん？何か布に包まれた物が…');
            this.grantStarterGear();
            window.gameState.flags.bed_search_event = true;
        }
    }

    /**
     * 救済措置: Rank2装備一式を付与
     */
    grantStarterGear() {
        const items = ['rusty_iron_sword', 'worn_shield', 'rental_chestpiece', 'worn_trousers'];
        const names = [];
        
        items.forEach(itemId => {
            if (window.inventory && typeof window.inventory.addItem === 'function') {
                window.inventory.addItem(itemId);
                const weapon = window.WEAPONS?.[itemId];
                const armor = window.ARMOR?.[itemId];
                if (weapon) names.push(weapon.name);
                if (armor) names.push(armor.name);
            }
        });
        
        // SE再生
        if (window.audioManager && typeof window.audioManager.playSE === 'function') {
            window.audioManager.playSE('./SE/item_get.mp3');
        }
        
        console.log('[救済措置] Rank2装備一式を入手:', names.join(', '));
        
        // メッセージ表示
        setTimeout(() => {
            this.showMessage(`誰かが置き忘れた装備一式を見つけた！\n${names.join('、')}`);
        }, 1500);
    }

    /**
     * 簡易メッセージ表示
     */
    showMessage(text) {
        // 既存のメッセージがあれば削除
        const existing = document.getElementById('location-message');
        if (existing) existing.remove();
        
        const msgDiv = document.createElement('div');
        msgDiv.id = 'location-message';
        msgDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(0, 255, 170, 0.5);
            color: #fff;
            padding: 20px 40px;
            border-radius: 8px;
            font-size: 1.1rem;
            z-index: 9000;
            text-align: center;
            white-space: pre-line;
            animation: fadeInOut 3s ease forwards;
        `;
        msgDiv.textContent = text;
        document.body.appendChild(msgDiv);
        
        // 3秒後に消える
        setTimeout(() => msgDiv.remove(), 3000);
    }

    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
            // UIを展開状態にする
            this.container.classList.remove('collapsed');
            this.isExpanded = true;
            const arrow = document.getElementById('toggle-arrow');
            if (arrow) arrow.textContent = '▼';
            
            // 現在地のBGMを再生
            const loc = this.locations[this.currentLocation];
            if (loc) {
                this.updateBGM(loc);
            }
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
