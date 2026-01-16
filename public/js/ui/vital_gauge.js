/**
 * VitalGauge.js - HP/STM/MPバーとカルマグラフを統合したUI
 * 
 * デザイン: 錆びた鉄枠、アナログな質感
 * 配置: 画面左上
 */

class VitalGauge {
    constructor() {
        this.container = null;
        this.stats = {
            hp: { current: 100, max: 100 },
            stm: { current: 100, max: 100 },
            mp: { current: 50, max: 50 }
        };
        
        this.init();
    }
    
    init() {
        // コンテナ作成
        this.container = document.createElement('div');
        this.container.id = 'vital-gauge';
        this.container.className = 'vital-gauge-ui hidden';
        
        this.container.innerHTML = `
            <div class="vital-gauge-header">VITAL_STATUS</div>
            
            <!-- HP Bar -->
            <div class="vital-bar-group">
                <div class="vital-bar-label">
                    <span class="vital-icon">❤</span>
                    <span class="vital-name">HP</span>
                    <span class="vital-value" id="hp-value">100/100</span>
                </div>
                <div class="vital-bar hp-bar">
                    <div class="vital-bar-fill" id="hp-fill" style="width: 100%"></div>
                    <div class="vital-bar-crack" id="hp-crack"></div>
                </div>
            </div>
            
            <!-- Stamina Bar -->
            <div class="vital-bar-group">
                <div class="vital-bar-label">
                    <span class="vital-icon">⚡</span>
                    <span class="vital-name">STM</span>
                    <span class="vital-value" id="stm-value">100/100</span>
                </div>
                <div class="vital-bar stm-bar">
                    <div class="vital-bar-fill" id="stm-fill" style="width: 100%"></div>
                </div>
            </div>
            
            <!-- MP Bar -->
            <div class="vital-bar-group">
                <div class="vital-bar-label">
                    <span class="vital-icon">💧</span>
                    <span class="vital-name">MP</span>
                    <span class="vital-value" id="mp-value">50/50</span>
                </div>
                <div class="vital-bar mp-bar">
                    <div class="vital-bar-fill" id="mp-fill" style="width: 100%"></div>
                </div>
            </div>
            
            <!-- Karma Graph (Small version) -->
            <div class="karma-mini-container">
                <canvas id="karma-canvas-mini" width="100" height="100"></canvas>
            </div>
            
            <!-- S.I. Sync -->
            <div class="si-sync-display">
                <span class="si-label">S.I. SYNC:</span>
                <span id="si-sync-value" class="si-value">0.0</span>
            </div>
        `;
        
        // game-containerに追加
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(this.container);
        } else {
            document.body.appendChild(this.container);
        }
        
        this.updateDisplay();
    }
    
    // HP更新
    setHP(current, max = null) {
        if (max !== null) this.stats.hp.max = max;
        this.stats.hp.current = Math.max(0, Math.min(current, this.stats.hp.max));
        this.updateDisplay();
        
        // 瀕死時のエフェクト
        if (this.stats.hp.current / this.stats.hp.max < 0.2) {
            this.container.classList.add('critical');
        } else {
            this.container.classList.remove('critical');
        }
    }
    
    // STM更新
    setSTM(current, max = null) {
        if (max !== null) this.stats.stm.max = max;
        this.stats.stm.current = Math.max(0, Math.min(current, this.stats.stm.max));
        this.updateDisplay();
    }
    
    // MP更新
    setMP(current, max = null) {
        if (max !== null) this.stats.mp.max = max;
        this.stats.mp.current = Math.max(0, Math.min(current, this.stats.mp.max));
        this.updateDisplay();
    }
    
    // ダメージを受ける
    takeDamage(amount) {
        this.setHP(this.stats.hp.current - amount);
        
        // ダメージエフェクト
        const hpBar = document.getElementById('hp-fill');
        if (hpBar) {
            hpBar.classList.add('damage-flash');
            setTimeout(() => hpBar.classList.remove('damage-flash'), 200);
        }
        
        // 画面端の赤いvignetteエフェクト
        if (amount > 20) {
            document.body.classList.add('damage-vignette');
            setTimeout(() => document.body.classList.remove('damage-vignette'), 500);
        }
    }
    
    // 回復
    heal(amount) {
        this.setHP(this.stats.hp.current + amount);
        
        // 回復エフェクト
        const hpBar = document.getElementById('hp-fill');
        if (hpBar) {
            hpBar.classList.add('heal-flash');
            setTimeout(() => hpBar.classList.remove('heal-flash'), 300);
        }
    }
    
    // 表示更新
    updateDisplay() {
        // HP
        const hpFill = document.getElementById('hp-fill');
        const hpValue = document.getElementById('hp-value');
        if (hpFill && hpValue) {
            const hpPercent = (this.stats.hp.current / this.stats.hp.max) * 100;
            hpFill.style.width = `${hpPercent}%`;
            hpValue.textContent = `${this.stats.hp.current}/${this.stats.hp.max}`;
        }
        
        // STM
        const stmFill = document.getElementById('stm-fill');
        const stmValue = document.getElementById('stm-value');
        if (stmFill && stmValue) {
            const stmPercent = (this.stats.stm.current / this.stats.stm.max) * 100;
            stmFill.style.width = `${stmPercent}%`;
            stmValue.textContent = `${this.stats.stm.current}/${this.stats.stm.max}`;
        }
        
        // MP
        const mpFill = document.getElementById('mp-fill');
        const mpValue = document.getElementById('mp-value');
        if (mpFill && mpValue) {
            const mpPercent = (this.stats.mp.current / this.stats.mp.max) * 100;
            mpFill.style.width = `${mpPercent}%`;
            mpValue.textContent = `${this.stats.mp.current}/${this.stats.mp.max}`;
        }
    }
    
    // 表示/非表示
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
    
    // ステータス取得
    getStats() {
        return { ...this.stats };
    }
}

// グローバルに公開
window.VitalGauge = VitalGauge;
