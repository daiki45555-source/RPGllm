/**
 * セーブ/ロードマネージャー
 * 9スロット、拠点セーブ、デバッグ用フェーズスキップ対応
 */

class SaveManager {
    constructor() {
        this.STORAGE_KEY = 'gaialem_saves';
        this.MAX_SLOTS = 9;
        this.slots = this.loadAllSlots();
        this.container = null;
        this.isVisible = false;
        this.mode = 'save'; // 'save' or 'load'
    }
    
    /**
     * 初期化
     */
    init() {
        this.createUI();
        console.log('[SaveManager] 初期化完了');
    }
    
    /**
     * 全スロット読み込み
     */
    loadAllSlots() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('[SaveManager] スロット読み込みエラー:', e);
        }
        
        // 初期化：9スロット分の空データ
        const emptySlots = [];
        for (let i = 0; i < this.MAX_SLOTS; i++) {
            emptySlots.push(null);
        }
        return emptySlots;
    }
    
    /**
     * 全スロット保存
     */
    saveAllSlots() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.slots));
        } catch (e) {
            console.error('[SaveManager] スロット保存エラー:', e);
        }
    }
    
    /**
     * セーブデータ構造生成
     */
    createSaveData(slotName = '') {
        return {
            slotName: slotName,
            timestamp: Date.now(),
            player: {
                name: localStorage.getItem('player_name') || '名もなき魂',
                stats: JSON.parse(localStorage.getItem('player_stats') || '{}'),
                karma: JSON.parse(localStorage.getItem('player_karma') || '{}'),
                tags: JSON.parse(localStorage.getItem('player_tags') || '[]'),
                preciousWord: localStorage.getItem('precious_word') || ''
            },
            location: {
                currentId: window.locationManager?.currentLocationId || 'base_lodging',
                hour: window.locationManager?.currentHour || 8
            },
            inventory: {
                items: window.inventory?.items || [],
                equipped: window.inventory?.equipped || {}
            },
            flags: {
                prologueComplete: localStorage.getItem('prologue_complete') === 'true',
                bedSearchEvent: window.gameFlags?.bed_search_event || false
            },
            gamePhase: 'exploration'
        };
    }
    
    /**
     * セーブ実行
     */
    save(slotIndex, slotName = '') {
        if (slotIndex < 0 || slotIndex >= this.MAX_SLOTS) {
            console.error('[SaveManager] 無効なスロット番号:', slotIndex);
            return false;
        }
        
        const saveData = this.createSaveData(slotName);
        this.slots[slotIndex] = saveData;
        this.saveAllSlots();
        
        console.log(`[SaveManager] スロット${slotIndex + 1}にセーブ完了:`, slotName);
        
        // SE再生
        if (window.audioManager) {
            window.audioManager.playSE('click');
        }
        
        return true;
    }
    
    /**
     * ロード実行
     */
    load(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.MAX_SLOTS) {
            console.error('[SaveManager] 無効なスロット番号:', slotIndex);
            return false;
        }
        
        const saveData = this.slots[slotIndex];
        if (!saveData) {
            console.warn('[SaveManager] 空のスロット:', slotIndex);
            return false;
        }
        
        // プレイヤー情報復元
        localStorage.setItem('player_name', saveData.player.name);
        localStorage.setItem('player_stats', JSON.stringify(saveData.player.stats));
        localStorage.setItem('player_karma', JSON.stringify(saveData.player.karma));
        localStorage.setItem('player_tags', JSON.stringify(saveData.player.tags));
        localStorage.setItem('precious_word', saveData.player.preciousWord);
        localStorage.setItem('prologue_complete', saveData.flags.prologueComplete ? 'true' : 'false');
        
        // ロケーション復元
        if (window.locationManager) {
            window.locationManager.currentLocationId = saveData.location.currentId;
            window.locationManager.currentHour = saveData.location.hour;
        }
        
        // インベントリ復元
        if (window.inventory) {
            window.inventory.items = saveData.inventory.items || [];
            window.inventory.equipped = saveData.inventory.equipped || {};
        }
        
        // フラグ復元
        if (!window.gameFlags) window.gameFlags = {};
        window.gameFlags.bed_search_event = saveData.flags.bedSearchEvent;
        
        console.log(`[SaveManager] スロット${slotIndex + 1}からロード完了`);
        
        // UI更新
        if (window.locationManager) {
            window.locationManager.updateUI();
        }
        
        // SE再生
        if (window.audioManager) {
            window.audioManager.playSE('click');
        }
        
        this.hide();
        return true;
    }
    
    /**
     * スロット削除
     */
    delete(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.MAX_SLOTS) return false;
        
        this.slots[slotIndex] = null;
        this.saveAllSlots();
        console.log(`[SaveManager] スロット${slotIndex + 1}を削除`);
        
        return true;
    }
    
    /**
     * UI作成
     */
    createUI() {
        this.container = document.createElement('div');
        this.container.id = 'save-modal';
        this.container.className = 'save-modal hidden';
        this.container.innerHTML = `
            <div class="save-overlay"></div>
            <div class="save-window">
                <div class="save-header">
                    <h2 id="save-modal-title">💾 セーブ</h2>
                    <button class="save-close" id="save-close">×</button>
                </div>
                <div class="save-content">
                    <div class="save-slots" id="save-slots">
                        <!-- 動的生成 -->
                    </div>
                </div>
                <div class="save-footer">
                    <div class="save-hint">スロット1は testplay（テスト用）として予約</div>
                </div>
            </div>
        `;
        document.body.appendChild(this.container);
        
        // イベント設定
        document.getElementById('save-close').addEventListener('click', () => this.hide());
        this.container.querySelector('.save-overlay').addEventListener('click', () => this.hide());
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }
    
    /**
     * スロットリスト更新
     */
    updateSlotList() {
        const container = document.getElementById('save-slots');
        if (!container) return;
        
        const defaultNames = ['testplay', '', '', '', '', '', '', '', ''];
        
        container.innerHTML = this.slots.map((slot, index) => {
            const isEmpty = !slot;
            const slotName = slot?.slotName || defaultNames[index] || `スロット${index + 1}`;
            const timestamp = slot ? new Date(slot.timestamp).toLocaleString('ja-JP') : '';
            const playerName = slot?.player?.name || '';
            const location = slot?.location?.currentId || '';
            
            return `
                <div class="save-slot ${isEmpty ? 'empty' : 'filled'}" data-index="${index}">
                    <div class="slot-number">${index + 1}</div>
                    <div class="slot-info">
                        <div class="slot-name">${slotName}</div>
                        ${!isEmpty ? `
                            <div class="slot-details">
                                <span class="slot-player">${playerName}</span>
                                <span class="slot-location">${location}</span>
                            </div>
                            <div class="slot-timestamp">${timestamp}</div>
                        ` : '<div class="slot-empty-text">-- 空き --</div>'}
                    </div>
                    <div class="slot-actions">
                        ${this.mode === 'save' ? `
                            <button class="btn-slot-action btn-save" data-index="${index}">保存</button>
                        ` : `
                            ${!isEmpty ? `<button class="btn-slot-action btn-load" data-index="${index}">ロード</button>` : ''}
                        `}
                        ${!isEmpty ? `<button class="btn-slot-action btn-delete" data-index="${index}">削除</button>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // ボタンイベント
        container.querySelectorAll('.btn-save').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                const defaultName = index === 0 ? 'testplay' : '';
                const name = prompt('セーブ名を入力（空欄可）:', defaultName);
                if (name !== null) {
                    this.save(index, name || defaultName);
                    this.updateSlotList();
                }
            });
        });
        
        container.querySelectorAll('.btn-load').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                if (confirm('このスロットをロードしますか？')) {
                    this.load(index);
                }
            });
        });
        
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                if (confirm('このスロットを削除しますか？')) {
                    this.delete(index);
                    this.updateSlotList();
                }
            });
        });
    }
    
    /**
     * セーブUIを表示
     */
    showSaveUI() {
        this.mode = 'save';
        document.getElementById('save-modal-title').textContent = '💾 セーブ';
        this.show();
    }
    
    /**
     * ロードUIを表示
     */
    showLoadUI() {
        this.mode = 'load';
        document.getElementById('save-modal-title').textContent = '📂 ロード';
        this.show();
    }
    
    /**
     * 表示
     */
    show() {
        if (!this.container) return;
        this.container.classList.remove('hidden');
        this.isVisible = true;
        this.updateSlotList();
    }
    
    /**
     * 非表示
     */
    hide() {
        if (!this.container) return;
        this.container.classList.add('hidden');
        this.isVisible = false;
    }
    
    /**
     * クイックセーブ（デバッグ用）
     */
    quickSave(slotIndex = 0) {
        const name = slotIndex === 0 ? 'testplay' : `quick_${Date.now()}`;
        return this.save(slotIndex, name);
    }
    
    /**
     * クイックロード（デバッグ用）
     */
    quickLoad(slotIndex = 0) {
        return this.load(slotIndex);
    }
}

// グローバル登録
window.SaveManager = SaveManager;
window.saveManager = new SaveManager();
