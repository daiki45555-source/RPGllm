/**
 * インベントリシステム
 * 装備管理、アイテム所持、UI表示を担当
 */

class Inventory {
    constructor() {
        // 所持アイテム（消耗品）
        this.items = [];
        
        // 装備中スロット
        this.equipped = {
            right_hand: null,   // 右手（メイン武器）
            left_hand: null,    // 左手（盾/サブ武器）
            upper_body: null,   // 上半身
            lower_body: null,   // 下半身
            accessory1: null,   // アクセサリー1
            accessory2: null    // アクセサリー2（イベント拡張予定）
        };
        
        // インベントリ容量
        this.maxItems = 20;
        
        // UI要素
        this.container = null;
        this.isVisible = false;
    }
    
    /**
     * 初期化
     */
    init() {
        this.createUI();
        this.setupKeyBindings();
        console.log('[Inventory] 初期化完了');
    }
    
    /**
     * アイテム追加
     */
    addItem(itemId, quantity = 1) {
        // 武器・防具の場合
        const weapon = window.WEAPONS?.[itemId];
        const armor = window.ARMOR?.[itemId];
        const item = window.ITEMS?.recovery?.[itemId] || 
                     window.ITEMS?.sanity?.[itemId] || 
                     window.ITEMS?.combat?.[itemId];
        
        if (weapon || armor) {
            // 装備品は個別に追加
            for (let i = 0; i < quantity; i++) {
                this.items.push({
                    id: itemId,
                    type: weapon ? 'weapon' : 'armor',
                    data: weapon || armor,
                    quantity: 1
                });
            }
            console.log(`[Inventory] ${(weapon || armor).name} を入手`);
            return true;
        }
        
        if (item) {
            // 消耗品はスタック
            const existing = this.items.find(i => i.id === itemId && i.type === 'consumable');
            if (existing) {
                existing.quantity += quantity;
            } else {
                this.items.push({
                    id: itemId,
                    type: 'consumable',
                    data: item,
                    quantity: quantity
                });
            }
            console.log(`[Inventory] ${item.name} ×${quantity} を入手`);
            return true;
        }
        
        console.warn(`[Inventory] アイテム ${itemId} が見つかりません`);
        return false;
    }
    
    /**
     * アイテム削除
     */
    removeItem(itemId, quantity = 1) {
        const index = this.items.findIndex(i => i.id === itemId);
        if (index === -1) return false;
        
        const item = this.items[index];
        if (item.type === 'consumable' && item.quantity > quantity) {
            item.quantity -= quantity;
        } else {
            this.items.splice(index, 1);
        }
        return true;
    }
    
    /**
     * 装備
     */
    equip(itemId) {
        const itemIndex = this.items.findIndex(i => i.id === itemId && (i.type === 'weapon' || i.type === 'armor'));
        if (itemIndex === -1) return false;
        
        const item = this.items[itemIndex];
        const slot = item.data.slot;
        
        if (!slot) {
            console.warn(`[Inventory] ${item.data.name} は装備スロットがありません`);
            return false;
        }
        
        // 現在装備中のものを外す
        if (this.equipped[slot]) {
            this.unequip(slot);
        }
        
        // 装備
        this.equipped[slot] = item;
        this.items.splice(itemIndex, 1);
        
        console.log(`[Inventory] ${item.data.name} を ${slot} に装備`);
        this.updateUI();
        return true;
    }
    
    /**
     * 装備解除
     */
    unequip(slot) {
        const item = this.equipped[slot];
        if (!item) return false;
        
        // インベントリに戻す
        this.items.push(item);
        this.equipped[slot] = null;
        
        console.log(`[Inventory] ${item.data.name} を外した`);
        this.updateUI();
        return true;
    }
    
    /**
     * 装備ステータス合計
     */
    getEquipStats() {
        const stats = { ATK: 0, DEF: 0, MDEF: 0, SPD: 0 };
        
        Object.values(this.equipped).forEach(item => {
            if (item && item.data && item.data.stats) {
                Object.entries(item.data.stats).forEach(([key, value]) => {
                    stats[key] = (stats[key] || 0) + value;
                });
            }
        });
        
        return stats;
    }
    
    /**
     * UI作成
     */
    createUI() {
        this.container = document.createElement('div');
        this.container.id = 'inventory-modal';
        this.container.className = 'inventory-modal hidden';
        this.container.innerHTML = `
            <div class="inventory-overlay"></div>
            <div class="inventory-window">
                <div class="inventory-header">
                    <h2>📦 インベントリ</h2>
                    <button class="inventory-close" id="inventory-close">×</button>
                </div>
                <div class="inventory-content">
                    <div class="inventory-equipment">
                        <h3>装備中</h3>
                        <div class="equipment-slots" id="equipment-slots">
                            <!-- 動的生成 -->
                        </div>
                        <div class="equipment-stats" id="equipment-stats">
                            <!-- 装備ステータス -->
                        </div>
                    </div>
                    <div class="inventory-items">
                        <h3>アイテム一覧</h3>
                        <div class="item-filter">
                            <select id="item-filter">
                                <option value="all">すべて</option>
                                <option value="weapon">武器</option>
                                <option value="armor">防具</option>
                                <option value="consumable">消耗品</option>
                            </select>
                        </div>
                        <div class="item-list" id="item-list">
                            <!-- 動的生成 -->
                        </div>
                        <div class="item-detail" id="item-detail">
                            <!-- 選択アイテム詳細 -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.container);
        
        // イベント設定
        document.getElementById('inventory-close').addEventListener('click', () => this.hide());
        this.container.querySelector('.inventory-overlay').addEventListener('click', () => this.hide());
        document.getElementById('item-filter').addEventListener('change', () => this.updateItemList());
    }
    
    /**
     * UI更新
     */
    updateUI() {
        if (!this.container) return;
        
        this.updateEquipmentSlots();
        this.updateEquipmentStats();
        this.updateItemList();
    }
    
    /**
     * 装備スロット表示更新
     */
    updateEquipmentSlots() {
        const container = document.getElementById('equipment-slots');
        if (!container) return;
        
        const slotNames = {
            right_hand: '右手',
            left_hand: '左手',
            upper_body: '上半身',
            lower_body: '下半身',
            accessory1: 'アクセ1',
            accessory2: 'アクセ2'
        };
        
        container.innerHTML = Object.entries(slotNames).map(([slot, name]) => {
            const item = this.equipped[slot];
            const itemName = item ? item.data.name : 'なし';
            const itemClass = item ? 'equipped' : 'empty';
            return `
                <div class="equipment-slot ${itemClass}" data-slot="${slot}">
                    <span class="slot-name">${name}:</span>
                    <span class="slot-item">${itemName}</span>
                    ${item ? `<button class="btn-unequip" data-slot="${slot}">外す</button>` : ''}
                </div>
            `;
        }).join('');
        
        // 外すボタンのイベント
        container.querySelectorAll('.btn-unequip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.unequip(btn.dataset.slot);
            });
        });
    }
    
    /**
     * 装備ステータス表示更新
     */
    updateEquipmentStats() {
        const container = document.getElementById('equipment-stats');
        if (!container) return;
        
        const stats = this.getEquipStats();
        container.innerHTML = `
            <div class="stat-row"><span>ATK:</span><span>+${stats.ATK}</span></div>
            <div class="stat-row"><span>DEF:</span><span>+${stats.DEF}</span></div>
            <div class="stat-row"><span>SPD:</span><span>+${stats.SPD}</span></div>
        `;
    }
    
    /**
     * アイテムリスト更新
     */
    updateItemList() {
        const container = document.getElementById('item-list');
        if (!container) return;
        
        const filter = document.getElementById('item-filter')?.value || 'all';
        const filteredItems = filter === 'all' 
            ? this.items 
            : this.items.filter(i => i.type === filter);
        
        if (filteredItems.length === 0) {
            container.innerHTML = '<div class="no-items">アイテムがありません</div>';
            return;
        }
        
        container.innerHTML = filteredItems.map((item, index) => {
            const icon = this.getItemIcon(item);
            const quantityText = item.quantity > 1 ? ` ×${item.quantity}` : '';
            return `
                <div class="item-row" data-index="${index}" data-id="${item.id}">
                    <span class="item-icon">${icon}</span>
                    <span class="item-name">${item.data.name}${quantityText}</span>
                    <span class="item-rank">Rank${item.data.rank || 1}</span>
                </div>
            `;
        }).join('');
        
        // アイテム選択イベント
        container.querySelectorAll('.item-row').forEach(row => {
            row.addEventListener('click', () => this.showItemDetail(row.dataset.id));
        });
    }
    
    /**
     * アイテムアイコン取得
     */
    getItemIcon(item) {
        if (item.type === 'weapon') {
            const typeIcons = { sword: '🗡️', spear: '🔱', axe: '🪓', katana: '⚔️', shield: '🛡️' };
            return typeIcons[item.data.type] || '⚔️';
        }
        if (item.type === 'armor') {
            const slotIcons = { upper_body: '👕', lower_body: '👖', accessory1: '💍', accessory2: '💍' };
            return slotIcons[item.data.slot] || '🛡️';
        }
        return '💊';
    }
    
    /**
     * アイテム詳細表示
     */
    showItemDetail(itemId) {
        const container = document.getElementById('item-detail');
        if (!container) return;
        
        const item = this.items.find(i => i.id === itemId);
        if (!item) {
            container.innerHTML = '';
            return;
        }
        
        const stats = item.data.stats 
            ? Object.entries(item.data.stats).map(([k, v]) => `${k}+${v}`).join(' / ')
            : '';
        
        const canEquip = item.type === 'weapon' || item.type === 'armor';
        const canUse = item.type === 'consumable';
        
        container.innerHTML = `
            <div class="detail-header">
                <span class="detail-icon">${this.getItemIcon(item)}</span>
                <span class="detail-name">${item.data.name}</span>
            </div>
            <div class="detail-desc">${item.data.description || ''}</div>
            ${stats ? `<div class="detail-stats">${stats}</div>` : ''}
            <div class="detail-actions">
                ${canEquip ? `<button class="btn-equip" data-id="${itemId}">装備</button>` : ''}
                ${canUse ? `<button class="btn-use" data-id="${itemId}">使う</button>` : ''}
                <button class="btn-discard" data-id="${itemId}">捨てる</button>
            </div>
        `;
        
        // ボタンイベント
        const equipBtn = container.querySelector('.btn-equip');
        if (equipBtn) {
            equipBtn.addEventListener('click', () => {
                this.equip(itemId);
                this.showItemDetail(null);
            });
        }
        
        const discardBtn = container.querySelector('.btn-discard');
        if (discardBtn) {
            discardBtn.addEventListener('click', () => {
                if (confirm(`${item.data.name} を捨てますか？`)) {
                    this.removeItem(itemId);
                    this.updateUI();
                    this.showItemDetail(null);
                }
            });
        }
    }
    
    /**
     * キーバインド設定
     */
    setupKeyBindings() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'i' || e.key === 'I') {
                this.toggle();
            }
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }
    
    /**
     * 表示
     */
    show() {
        if (!this.container) return;
        this.container.classList.remove('hidden');
        this.isVisible = true;
        this.updateUI();
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
     * トグル
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// グローバル登録
window.Inventory = Inventory;
window.inventory = new Inventory();
