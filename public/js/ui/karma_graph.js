/**
 * KarmaGraph.js - 6角形レーダーチャートでカルマを表示
 * カルマポイント20ごとに1メーター上昇、最大10メーター（200pt）
 */

class KarmaGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn('KarmaGraph: Canvas not found:', canvasId);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        // 6つのカルマ軸
        this.axes = [
            { id: 'vigor', name: '生命力', color: '#ff6b6b' },      // 赤
            { id: 'attunement', name: '集中力', color: '#4ecdc4' }, // シアン
            { id: 'intelligence', name: '理力', color: '#45b7d1' }, // 青
            { id: 'faith', name: '信仰', color: '#f7dc6f' },        // 黄
            { id: 'endurance', name: '持久力', color: '#82e0aa' },  // 緑
            { id: 'luck', name: '運', color: '#bb8fce' }            // 紫
        ];
        
        // カルマ値（0-200の範囲、20ごとに1メーター）
        this.karma = {};
        this.axes.forEach(axis => this.karma[axis.id] = 0);
        
        // 設定
        this.maxValue = 200;  // 最大値（10メーター x 20pt）
        this.meterSize = 20;  // 1メーター = 20pt
        this.maxMeters = 10;  // 最大10メーター
        
        // キャンバスサイズ
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 30;
        
        // アニメーション用
        this.animationProgress = {};
        this.axes.forEach(axis => this.animationProgress[axis.id] = 0);
        
        this.draw();
    }
    
    // カルマ値を設定（0-200）
    setKarma(id, value) {
        const clampedValue = Math.max(0, Math.min(this.maxValue, value));
        this.karma[id] = clampedValue;
        this.animateTo(id, clampedValue);
    }
    
    // カルマ値を増減
    addKarma(id, delta) {
        const newValue = (this.karma[id] || 0) + delta;
        this.setKarma(id, newValue);
    }
    
    // ポイントからメーター変換
    pointsToMeters(points) {
        return Math.floor(points / this.meterSize);
    }
    
    // アニメーション付きで値を更新
    animateTo(id, targetValue) {
        const startValue = this.animationProgress[id] || 0;
        const duration = 500; // ms
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // イージング（ease-out）
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.animationProgress[id] = startValue + (targetValue - startValue) * eased;
            this.draw();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // グラフを描画
    draw() {
        if (!this.ctx) return;
        
        const ctx = this.ctx;
        const centerX = this.centerX;
        const centerY = this.centerY;
        const radius = this.radius;
        
        // クリア
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 背景グリッド（10段階）
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.1)';
        ctx.lineWidth = 1;
        
        for (let level = 1; level <= this.maxMeters; level++) {
            const levelRadius = (radius / this.maxMeters) * level;
            this.drawHexagon(centerX, centerY, levelRadius, false);
        }
        
        // 軸線
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.3)';
        this.axes.forEach((axis, i) => {
            const angle = (Math.PI * 2 / this.axes.length) * i - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        });
        
        // カルマ領域（塗りつぶし）
        ctx.fillStyle = 'rgba(0, 255, 100, 0.15)';
        ctx.beginPath();
        
        this.axes.forEach((axis, i) => {
            const angle = (Math.PI * 2 / this.axes.length) * i - Math.PI / 2;
            const value = this.animationProgress[axis.id] || 0;
            const valueRadius = (radius / this.maxValue) * value;
            const x = centerX + Math.cos(angle) * valueRadius;
            const y = centerY + Math.sin(angle) * valueRadius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.closePath();
        ctx.fill();
        
        // カルマライン
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        this.axes.forEach((axis, i) => {
            const angle = (Math.PI * 2 / this.axes.length) * i - Math.PI / 2;
            const value = this.animationProgress[axis.id] || 0;
            const valueRadius = (radius / this.maxValue) * value;
            const x = centerX + Math.cos(angle) * valueRadius;
            const y = centerY + Math.sin(angle) * valueRadius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.closePath();
        ctx.stroke();
        
        // 頂点のドット
        this.axes.forEach((axis, i) => {
            const angle = (Math.PI * 2 / this.axes.length) * i - Math.PI / 2;
            const value = this.animationProgress[axis.id] || 0;
            const valueRadius = (radius / this.maxValue) * value;
            const x = centerX + Math.cos(angle) * valueRadius;
            const y = centerY + Math.sin(angle) * valueRadius;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = axis.color;
            ctx.fill();
        });
        
        // ラベル
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.fillStyle = 'rgba(0, 255, 100, 0.9)';
        ctx.textAlign = 'center';
        
        this.axes.forEach((axis, i) => {
            const angle = (Math.PI * 2 / this.axes.length) * i - Math.PI / 2;
            const labelRadius = radius + 15;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;
            
            const meters = this.pointsToMeters(this.karma[axis.id] || 0);
            ctx.fillText(`${axis.name}`, x, y);
            ctx.fillText(`${meters}/10`, x, y + 12);
        });
    }
    
    // 6角形を描画
    drawHexagon(cx, cy, r, fill = false) {
        const ctx = this.ctx;
        ctx.beginPath();
        
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        
        if (fill) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }
    
    // 診断結果からカルマを初期化
    initFromEvaluation(karmaResult) {
        if (!karmaResult) return;
        
        // ShadowEvaluationの結果を反映（初期値として設定）
        Object.keys(karmaResult).forEach(key => {
            if (this.karma.hasOwnProperty(key)) {
                // 診断結果は0-10程度なので、メーターに換算（x20）
                this.setKarma(key, karmaResult[key] * 20);
            }
        });
    }
    
    // 現在のカルマ値を取得
    getKarma() {
        return { ...this.karma };
    }
    
    // メーター単位で取得
    getMeters() {
        const meters = {};
        this.axes.forEach(axis => {
            meters[axis.id] = this.pointsToMeters(this.karma[axis.id] || 0);
        });
        return meters;
    }
    
    // S.I.の従順度を計算（全軸の平均メーター）
    getSIObedience() {
        const meters = this.getMeters();
        const total = Object.values(meters).reduce((sum, m) => sum + m, 0);
        return total / this.axes.length;
    }
    
    // 表示/非表示
    show() {
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.classList.remove('hidden');
        }
    }
    
    hide() {
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.classList.add('hidden');
        }
    }
}

// グローバルに公開
window.KarmaGraph = KarmaGraph;
