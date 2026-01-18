/**
 * デバッグモード（大器モード）
 * 七つの願いが降る庭で - Debug Mode System
 */

class DebugMode {
    constructor() {
        this.isEnabled = false;
        this.password = 'd0154723939';
        this.panelVisible = true;
        
        // イベントタグレジストリ
        this.EVENT_TAGS = {
            // IV系: 序盤必須イベント
            'IV1': { type: 'phase', target: 'title', name: 'オープニング / ブート画面' },
            'IV2': { type: 'phase', target: 'karma_test', name: 'カルマテスト（影の審問）' },
            'IV3': { type: 'event', target: 'intro', rank: 'rank1', name: 'ジャック邂逅（プロローグ）' },
            'IV4': { type: 'flag', target: 'bed_search', name: 'ベッドの下調査' },
            'IV5': { type: 'phase', target: 'exploration', name: 'プロローグ終了 → ギルド到着' },
            
            // JK系: ジャック関連
            'JK1': { type: 'event', target: 'jack', rank: 'rank1', name: '鉄の胃袋' },
            'JK2': { type: 'event', target: 'jack', rank: 'rank2', name: '王の唾棄、友の杯' },
            'JK3': { type: 'event', target: 'jack', rank: 'rank3', name: '昇進という名の首輪' },
            'JK4': { type: 'event', target: 'jack', rank: 'rank4', name: '道化の天秤' },
            'JK8': { type: 'event', target: 'jack', rank: 'rank8', name: '紅蓮の勅命、水銀の救済' },
            'JK10': { type: 'event', target: 'jack', rank: 'rank10', name: '黒き太陽の落日' },
            
            // MA系: マリアンヌ関連
            'MA1': { type: 'event', target: 'marianne', rank: 'rank1', name: '泥の中の祈り' },
            'MA2': { type: 'event', target: 'marianne', rank: 'rank2', name: '空腹なき晩餐' },
            'MA3': { type: 'event', target: 'marianne', rank: 'rank3', name: '聖域の籠城' },
            'MA4': { type: 'event', target: 'marianne', rank: 'rank4', name: '雑草の剪定' },
        };
    }

    /**
     * パスワードをチェック
     */
    checkPassword(input) {
        return input === this.password;
    }

    /**
     * デバッグモードを有効化
     */
    activate() {
        this.isEnabled = true;
        console.log('[DEBUG MODE] 大器モード有効化！');
        
        // ゲーム状態を初期化
        this.initGameState();
        
        // デバッグUIを作成
        this.createDebugUI();
        
        return true;
    }

    /**
     * デバッグ用ゲーム状態初期化（能力値MAX、カルマ10レベル）
     */
    initGameState() {
        window.gameState = window.gameState || {};
        
        // プレイヤー情報（全能力値MAX）
        window.gameState.player = {
            name: 'デバッグ主人公',
            preciousWord: 'マグノリア', // 黒騎士の名前固定
            level: 50,
            exp: 99999,
            
            // 能力値MAX
            hp: 999,
            maxHp: 999,
            stm: 999,
            maxStm: 999,
            atk: 99,
            def: 99,
            spd: 99,
            
            // 所持金MAX
            money: 999999
        };

        // カルマ10レベル（200pt）
        if (typeof KarmaSystem !== 'undefined') {
            KarmaSystem.setKarmaValue('integrity', 200);   // 誠実
            KarmaSystem.setKarmaValue('kindness', 200);    // 慈悲
            KarmaSystem.setKarmaValue('justice', 200);     // 正義
            KarmaSystem.setKarmaValue('bravery', 200);     // 勇気
            KarmaSystem.setKarmaValue('perseverance', 200);// 執念
            KarmaSystem.setKarmaValue('patience', 200);    // 忍耐
            // 隠しカルマ
            KarmaSystem.setKarmaValue('sadism', 0);        // 嗜虐
            KarmaSystem.setKarmaValue('rebel', 0);         // 反逆
        }

        // 絆情報
        window.gameState.bonds = {
            jack: { rank: 0, points: 0, unlocked: true },
            marianne: { rank: 0, points: 0, unlocked: true },
            crow: { rank: 0, points: 0, unlocked: true }
        };

        // 時間・日付
        window.gameState.time = {
            hour: 10,
            day: 1
        };

        // フラグ
        window.gameState.flags = {
            prologueComplete: true,
            metJack: true,
            joinedCrowsNest: true
        };

        console.log('[DEBUG MODE] ゲーム状態初期化完了');
    }

    /**
     * デバッグUIパネルを作成
     */
    createDebugUI() {
        // 既存のパネルがあれば削除
        const existing = document.getElementById('debug-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.className = 'debug-panel';
        panel.innerHTML = this.generatePanelHTML();
        document.body.appendChild(panel);

        // イベントリスナー設定
        this.setupEventListeners();

        console.log('[DEBUG MODE] デバッグUI作成完了');
    }

    /**
     * パネルHTMLを生成
     */
    generatePanelHTML() {
        const player = window.gameState?.player || {};
        const bonds = window.gameState?.bonds || {};

        return `
            <div class="debug-header" onclick="debugMode.togglePanel()">
                🛠️ 大器モード <span class="debug-toggle">${this.panelVisible ? '▼' : '▶'}</span>
            </div>
            <div class="debug-content" style="display: ${this.panelVisible ? 'block' : 'none'}">
                <!-- 能力値 -->
                <div class="debug-section">
                    <div class="debug-section-title">📊 能力値</div>
                    <div class="debug-row">
                        <label>HP:</label>
                        <input type="number" id="debug-hp" value="${player.hp || 100}" min="1" max="9999">
                        <span>/</span>
                        <input type="number" id="debug-maxHp" value="${player.maxHp || 100}" min="1" max="9999">
                    </div>
                    <div class="debug-row">
                        <label>STM:</label>
                        <input type="number" id="debug-stm" value="${player.stm || 100}" min="0" max="9999">
                        <span>/</span>
                        <input type="number" id="debug-maxStm" value="${player.maxStm || 100}" min="1" max="9999">
                    </div>
                    <div class="debug-row">
                        <label>ATK:</label>
                        <input type="number" id="debug-atk" value="${player.atk || 10}" min="1" max="999">
                    </div>
                    <div class="debug-row">
                        <label>DEF:</label>
                        <input type="number" id="debug-def" value="${player.def || 5}" min="0" max="999">
                    </div>
                    <div class="debug-row">
                        <label>SPD:</label>
                        <input type="number" id="debug-spd" value="${player.spd || 10}" min="1" max="999">
                    </div>
                    <div class="debug-row">
                        <label>金:</label>
                        <input type="number" id="debug-money" value="${player.money || 0}" min="0" max="9999999">
                        <span>M</span>
                    </div>
                    <div class="debug-row">
                        <label>LV:</label>
                        <input type="number" id="debug-level" value="${player.level || 1}" min="1" max="99">
                    </div>
                    <button class="debug-btn" onclick="debugMode.applyStats()">適用</button>
                </div>

                <!-- カルマ -->
                <div class="debug-section">
                    <div class="debug-section-title">⚖️ カルマ</div>
                    <div class="debug-row">
                        <label>誠実:</label>
                        <input type="range" id="debug-karma-integrity" min="0" max="200" value="200">
                        <span id="debug-karma-integrity-val">200</span>
                    </div>
                    <div class="debug-row">
                        <label>慈悲:</label>
                        <input type="range" id="debug-karma-kindness" min="0" max="200" value="200">
                        <span id="debug-karma-kindness-val">200</span>
                    </div>
                    <div class="debug-row">
                        <label>正義:</label>
                        <input type="range" id="debug-karma-justice" min="0" max="200" value="200">
                        <span id="debug-karma-justice-val">200</span>
                    </div>
                    <div class="debug-row">
                        <label>勇気:</label>
                        <input type="range" id="debug-karma-bravery" min="0" max="200" value="200">
                        <span id="debug-karma-bravery-val">200</span>
                    </div>
                    <div class="debug-row">
                        <label>執念:</label>
                        <input type="range" id="debug-karma-perseverance" min="0" max="200" value="200">
                        <span id="debug-karma-perseverance-val">200</span>
                    </div>
                    <div class="debug-row">
                        <label>忍耐:</label>
                        <input type="range" id="debug-karma-patience" min="0" max="200" value="200">
                        <span id="debug-karma-patience-val">200</span>
                    </div>
                    <div class="debug-section-title" style="margin-top: 10px;">🌑 隠しカルマ</div>
                    <div class="debug-row">
                        <label>嗜虐:</label>
                        <input type="range" id="debug-karma-sadism" min="0" max="200" value="0">
                        <span id="debug-karma-sadism-val">0</span>
                    </div>
                    <div class="debug-row">
                        <label>反逆:</label>
                        <input type="range" id="debug-karma-rebel" min="0" max="200" value="0">
                        <span id="debug-karma-rebel-val">0</span>
                    </div>
                    <button class="debug-btn" onclick="debugMode.applyKarma()">適用</button>
                </div>

                <!-- 絆 -->
                <div class="debug-section">
                    <div class="debug-section-title">💕 絆ランク</div>
                    <div class="debug-row">
                        <label>ジャック:</label>
                        <input type="number" id="debug-bond-jack" min="0" max="10" value="${bonds.jack?.rank || 0}">
                    </div>
                    <div class="debug-row">
                        <label>マリアンヌ:</label>
                        <input type="number" id="debug-bond-marianne" min="0" max="10" value="${bonds.marianne?.rank || 0}">
                    </div>
                    <div class="debug-row">
                        <label>クロウ:</label>
                        <input type="number" id="debug-bond-crow" min="0" max="10" value="${bonds.crow?.rank || 0}">
                    </div>
                    <button class="debug-btn" onclick="debugMode.applyBonds()">適用</button>
                </div>

                <!-- ゲーム状態 -->
                <div class="debug-section">
                    <div class="debug-section-title">🕐 時間・場所</div>
                    <div class="debug-row">
                        <label>時刻:</label>
                        <input type="number" id="debug-hour" min="0" max="23" value="${window.gameState?.time?.hour || 10}">
                        <span>時</span>
                    </div>
                    <div class="debug-row">
                        <label>日数:</label>
                        <input type="number" id="debug-day" min="1" max="365" value="${window.gameState?.time?.day || 1}">
                        <span>日目</span>
                    </div>
                    <button class="debug-btn" onclick="debugMode.applyTime()">適用</button>
                </div>

                <!-- イベントジャンプ（🎯 メイン機能！）-->
                <div class="debug-section">
                    <div class="debug-section-title">🎯 イベントジャンプ</div>
                    <select id="debug-event-select" class="debug-select">
                        <optgroup label="IV系: 序盤イベント">
                            <option value="IV1">IV1: オープニング</option>
                            <option value="IV2">IV2: カルマテスト</option>
                            <option value="IV3">IV3: ジャック邂逅</option>
                            <option value="IV4">IV4: ベッド調査</option>
                            <option value="IV5">IV5: ギルド到着</option>
                        </optgroup>
                        <optgroup label="JK系: ジャック">
                            <option value="JK1">JK1: 鉄の胃袋</option>
                            <option value="JK2">JK2: 王の唾棄</option>
                            <option value="JK3">JK3: 昇進の首輪</option>
                            <option value="JK4">JK4: 道化の天秤</option>
                        </optgroup>
                        <optgroup label="MA系: マリアンヌ">
                            <option value="MA1">MA1: 泥の中の祈り</option>
                            <option value="MA2">MA2: 空腹なき晩餐</option>
                        </optgroup>
                    </select>
                    <button class="debug-btn" onclick="debugMode.jumpToEvent()">ジャンプ</button>
                </div>

                <!-- 戦闘テスト -->
                <div class="debug-section">
                    <div class="debug-section-title">⚔️ 戦闘テスト</div>
                    <button class="debug-btn" onclick="debugMode.testBattle('goblin')">ゴブリン戦</button>
                    <button class="debug-btn" onclick="debugMode.testBattle('thug_a')">暴漢戦</button>
                </div>

                <!-- フェーズスキップ -->
                <div class="debug-section">
                    <div class="debug-section-title">⏭️ フェーズスキップ</div>
                    <select id="debug-phase-select" class="debug-select">
                        <option value="title">タイトル画面</option>
                        <option value="char_creation">キャラメイク</option>
                        <option value="karma_test">カルマテスト</option>
                        <option value="exploration" selected>探索フェーズ</option>
                    </select>
                    <button class="debug-btn" onclick="debugMode.skipToPhase()">スキップ</button>
                </div>

                <!-- セーブ/ロード -->
                <div class="debug-section">
                    <div class="debug-section-title">💾 セーブ/ロード</div>
                    <button class="debug-btn" onclick="debugMode.quickSave()">クイックセーブ</button>
                    <button class="debug-btn" onclick="debugMode.quickLoad()">クイックロード</button>
                    <button class="debug-btn" onclick="debugMode.openSaveUI()">セーブUI</button>
                    <button class="debug-btn" onclick="debugMode.openLoadUI()">ロードUI</button>
                </div>
            </div>
        `;
    }

    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
        // カルマスライダーの値表示更新
        const karmaTypes = ['integrity', 'kindness', 'justice', 'bravery', 'perseverance', 'patience', 'sadism', 'rebel'];
        karmaTypes.forEach(type => {
            const slider = document.getElementById(`debug-karma-${type}`);
            const valSpan = document.getElementById(`debug-karma-${type}-val`);
            if (slider && valSpan) {
                slider.addEventListener('input', () => {
                    valSpan.textContent = slider.value;
                });
            }
        });
    }

    /**
     * パネル表示/非表示切り替え
     */
    togglePanel() {
        this.panelVisible = !this.panelVisible;
        const content = document.querySelector('.debug-content');
        const toggle = document.querySelector('.debug-toggle');
        if (content) content.style.display = this.panelVisible ? 'block' : 'none';
        if (toggle) toggle.textContent = this.panelVisible ? '▼' : '▶';
    }

    /**
     * 能力値を適用
     */
    applyStats() {
        const player = window.gameState?.player;
        if (!player) return;

        player.hp = parseInt(document.getElementById('debug-hp').value) || 100;
        player.maxHp = parseInt(document.getElementById('debug-maxHp').value) || 100;
        player.stm = parseInt(document.getElementById('debug-stm').value) || 100;
        player.maxStm = parseInt(document.getElementById('debug-maxStm').value) || 100;
        player.atk = parseInt(document.getElementById('debug-atk').value) || 10;
        player.def = parseInt(document.getElementById('debug-def').value) || 5;
        player.spd = parseInt(document.getElementById('debug-spd').value) || 10;
        player.money = parseInt(document.getElementById('debug-money').value) || 0;
        player.level = parseInt(document.getElementById('debug-level').value) || 1;

        // VitalGaugeを更新
        if (window.vitalGauge) {
            window.vitalGauge.update(player.hp, player.maxHp, player.stm, player.maxStm);
        }

        console.log('[DEBUG MODE] 能力値適用:', player);
    }

    /**
     * イベントタグからジャンプ（メイン機能）
     */
    jumpToEvent(tagOrSelect) {
        // セレクトボックスから取得、または引数を使用
        const tag = tagOrSelect || document.getElementById('debug-event-select')?.value;
        if (!tag) {
            console.warn('[DEBUG MODE] イベントタグが指定されていません');
            return;
        }

        const eventInfo = this.EVENT_TAGS[tag.toUpperCase()];
        if (!eventInfo) {
            console.warn(`[DEBUG MODE] 不明なイベントタグ: ${tag}`);
            console.log('[DEBUG MODE] 利用可能なタグ:', Object.keys(this.EVENT_TAGS).join(', '));
            return;
        }

        console.log(`[DEBUG MODE] イベントジャンプ: ${tag} → ${eventInfo.name}`);

        // タイトルUIとブート画面を非表示
        const bootScreen = document.getElementById('boot-screen');
        const titleUI = document.getElementById('title-screen-ui');
        if (bootScreen) bootScreen.classList.add('hidden');
        if (titleUI) titleUI.style.display = 'none';

        switch (eventInfo.type) {
            case 'phase':
                // フェーズ系はskipToPhaseを再利用
                this.skipToPhaseInternal(eventInfo.target);
                break;

            case 'event':
                // イベント系はEventManagerを使用
                this.triggerEventDirect(eventInfo.target, eventInfo.rank);
                break;

            case 'flag':
                // フラグ系は将来的に拡張
                console.log(`[DEBUG MODE] フラグイベント ${tag} は未実装`);
                break;
        }
    }

    /**
     * イベントを直接トリガー
     */
    triggerEventDirect(charId, rankKey) {
        console.log(`[DEBUG MODE] イベントトリガー: ${charId} / ${rankKey}`);

        // イベントデータを取得
        let eventData = null;
        switch (charId) {
            case 'intro':
                eventData = window.introEvents?.[rankKey];
                break;
            case 'jack':
                eventData = window.jackEvents?.[rankKey];
                break;
            case 'marianne':
                eventData = window.marianneEvents?.[rankKey];
                break;
        }

        if (!eventData) {
            console.error(`[DEBUG MODE] イベントデータが見つかりません: ${charId}/${rankKey}`);
            return;
        }

        // EventManagerでイベント実行
        if (window.eventManager) {
            // startEventはeventDataのみを引数として受け取る
            window.eventManager.startEvent(eventData);
        } else {
            console.warn('[DEBUG MODE] EventManagerが見つかりません');
        }
    }

    /**
     * 指定したシーンにジャンプ（レガシー互換）
     */
    jumpTo(sceneName, params = {}) {
        console.log(`[DEBUG MODE] シーンジャンプ試行: ${sceneName}`, params);

        // イベントタグとして認識できるか確認
        if (this.EVENT_TAGS[sceneName.toUpperCase()]) {
            this.jumpToEvent(sceneName);
            return;
        }

        // LocationManagerが利用可能か確認
        if (window.locationManager) {
            if (typeof window.locationManager.jumpToScene === 'function') {
                window.locationManager.jumpToScene(sceneName, params);
            } else {
                this.skipToPhaseInternal(sceneName);
            }
        } else {
            console.warn('[DEBUG MODE] LocationManagerが見つかりません。初期化を待機します。');
            setTimeout(() => this.jumpTo(sceneName, params), 500);
        }
    }

    /**
     * カルマ値を直接設定
     */
    setKarma(type, value) {
        if (typeof KarmaSystem !== 'undefined') {
            KarmaSystem.setKarmaValue(type, value);
            // グラフがあれば更新
            if (window.karmaGraph) window.karmaGraph.update();
            console.log(`[DEBUG MODE] Karma更新: ${type} = ${value}`);
        }
    }

    /**
     * カルマを適用
     */
    applyKarma() {
        if (typeof KarmaSystem === 'undefined') {
            console.warn('[DEBUG MODE] KarmaSystemが見つかりません');
            return;
        }

        const karmaTypes = ['integrity', 'kindness', 'justice', 'bravery', 'perseverance', 'patience', 'sadism', 'rebel'];
        karmaTypes.forEach(type => {
            const slider = document.getElementById(`debug-karma-${type}`);
            if (slider) {
                this.setKarma(type, parseInt(slider.value));
            }
        });

        console.log('[DEBUG MODE] カルマ適用完了');
    }

    /**
     * 絆を適用
     */
    applyBonds() {
        const bonds = window.gameState?.bonds;
        if (!bonds) return;

        bonds.jack.rank = parseInt(document.getElementById('debug-bond-jack').value) || 0;
        bonds.marianne.rank = parseInt(document.getElementById('debug-bond-marianne').value) || 0;
        bonds.crow.rank = parseInt(document.getElementById('debug-bond-crow').value) || 0;

        console.log('[DEBUG MODE] 絆適用:', bonds);
    }

    /**
     * 時間を適用
     */
    applyTime() {
        if (!window.gameState) window.gameState = {};
        if (!window.gameState.time) window.gameState.time = {};

        window.gameState.time.hour = parseInt(document.getElementById('debug-hour').value) || 10;
        window.gameState.time.day = parseInt(document.getElementById('debug-day').value) || 1;

        // LocationManagerの時間も更新
        if (window.locationManager) {
            window.locationManager.gameHour = window.gameState.time.hour;
            window.locationManager.gameDay = window.gameState.time.day;
            window.locationManager.updateUI();
        }

        console.log('[DEBUG MODE] 時間適用:', window.gameState.time);
    }

    /**
     * 戦闘テスト
     */
    testBattle(enemyId) {
        if (typeof battleSystem === 'undefined' || typeof spawnEnemy === 'undefined') {
            console.warn('[DEBUG MODE] 戦闘システムが見つかりません');
            return;
        }

        const enemyData = getEnemyData(enemyId);
        if (enemyData) {
            enemyData.count = 1;
            battleSystem.startBattle(enemyData);
        }
    }

    /**
     * フェーズスキップ（UIから）
     */
    skipToPhase() {
        const select = document.getElementById('debug-phase-select');
        if (!select) return;
        this.skipToPhaseInternal(select.value);
    }

    /**
     * フェーズスキップ内部実装
     */
    skipToPhaseInternal(phase) {
        console.log(`[DEBUG MODE] フェーズスキップ: ${phase}`);
        
        switch(phase) {
            case 'title':
                location.reload();
                break;
            case 'char_creation':
                if (typeof showCharacterCreation === 'function') {
                    showCharacterCreation();
                }
                break;
            case 'karma_test':
                if (typeof startEvaluation === 'function') {
                    startEvaluation();
                }
                break;
            case 'exploration':
                if (window.locationManager) {
                    window.locationManager.show();
                    window.locationManager.updateUI();
                } else if (window.LocationManager) {
                    window.locationManager = new window.LocationManager();
                    window.locationManager.init();
                    window.locationManager.show();
                }
                break;
        }
    }

    /**
     * クイックセーブ（スロット0 = testplay）
     */
    quickSave() {
        if (window.saveManager) {
            window.saveManager.quickSave(0);
            console.log('[DEBUG MODE] クイックセーブ完了');
        } else {
            console.warn('[DEBUG MODE] SaveManagerが見つかりません');
        }
    }

    /**
     * クイックロード（スロット0 = testplay）
     */
    quickLoad() {
        if (window.saveManager) {
            window.saveManager.quickLoad(0);
            console.log('[DEBUG MODE] クイックロード完了');
        } else {
            console.warn('[DEBUG MODE] SaveManagerが見つかりません');
        }
    }

    /**
     * セーブUI表示
     */
    openSaveUI() {
        if (window.saveManager) {
            window.saveManager.showSaveUI();
        } else {
            console.warn('[DEBUG MODE] SaveManagerが見つかりません');
        }
    }

    /**
     * ロードUI表示
     */
    openLoadUI() {
        if (window.saveManager) {
            window.saveManager.showLoadUI();
        } else {
            console.warn('[DEBUG MODE] SaveManagerが見つかりません');
        }
    }
}

// グローバルインスタンス
const debugMode = new DebugMode();

// グローバル登録
window.debugMode = debugMode;
window.DebugMode = DebugMode;

// DOMContentLoadedでパスワード入力イベントを設定
document.addEventListener('DOMContentLoaded', () => {
    const debugPasswordInput = document.getElementById('debug-password');
    const bootScreen = document.getElementById('boot-screen');
    
    if (debugPasswordInput) {
        console.log('[DEBUG MODE] パスワード入力欄検出、イベント設定中...');
        
        debugPasswordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                
                if (debugMode.checkPassword(debugPasswordInput.value)) {
                    console.log('[DEBUG MODE] パスワード認証成功！大器モード起動！');
                    
                    // BGM再生
                    if (window.audioManager) {
                        window.audioManager.playBGM('./BGM/title_theme.mp3');
                    }
                    
                    // ブート画面を非表示
                    if (bootScreen) {
                        bootScreen.classList.add('hidden');
                    }
                    
                    // デバッグモード有効化
                    debugMode.activate();
                    
                    // プロローグスキップ → ロケーションマネージャー表示
                    setTimeout(() => {
                        if (window.LocationManager) {
                            window.locationManager = new window.LocationManager();
                            window.locationManager.init();
                            window.locationManager.show();
                            console.log('[DEBUG MODE] LocationManager起動完了');
                        } else {
                            console.warn('[DEBUG MODE] LocationManagerが見つかりません');
                        }
                    }, 100);
                    
                } else {
                    console.log('[DEBUG MODE] パスワードが違います:', debugPasswordInput.value);
                    debugPasswordInput.value = '';
                    debugPasswordInput.style.borderColor = '#ff0000';
                    setTimeout(() => {
                        debugPasswordInput.style.borderColor = 'rgba(255, 153, 0, 0.3)';
                    }, 500);
                }
            }
        });
        
        // パスワード入力欄クリックでブート画面クリックを無効化
        debugPasswordInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        console.log('[DEBUG MODE] イベント設定完了');
    }
});
