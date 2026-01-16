/**
 * KarmaGraph.js - 6角形レーダーチャートでカルマを表示
 * カルマポイント20ごとに1メーター上昇、最大10メーター（200pt）
 * 
 * 6つのカルマ軸:
 * - Integrity (誠実) - 嘘をつかない、約束を守る、ルールに従う
 * - Kindness (慈悲) - 他者を傷つけない、救済を選ぶ、自己犠牲
 * - Justice (正義) - 悪を許さない、多数のために少数を切る
 * - Bravery (勇気) - リスクを恐れない、前に出る
 * - Perseverance (執念) - 手段を選ばず生き残る、合理的判断
 * - Patience (忍耐) - 快楽に流されない、耐え忍ぶ
 */

class KarmaGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn('KarmaGraph: Canvas not found:', canvasId);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        // 6つのカルマ軸（資料に基づく）
        this.axes = [
            { id: 'integrity', name: '誠実', nameEn: 'Integrity', color: '#4ecdc4' },      // シアン
            { id: 'kindness', name: '慈悲', nameEn: 'Kindness', color: '#ff6b9d' },        // ピンク
            { id: 'justice', name: '正義', nameEn: 'Justice', color: '#f7dc6f' },          // 黄
            { id: 'bravery', name: '勇気', nameEn: 'Bravery', color: '#ff6b6b' },          // 赤
            { id: 'perseverance', name: '執念', nameEn: 'Perseverance', color: '#82e0aa' }, // 緑
            { id: 'patience', name: '忍耐', nameEn: 'Patience', color: '#bb8fce' }          // 紫
        ];
        
        // カルマ値（生の値を保持、マイナスもあり得る）
        this.karma = {};
        this.axes.forEach(axis => this.karma[axis.id] = 0);
        
        // 設定
        this.maxValue = 200;  // 表示上の最大値（10メーター x 20pt）
        this.meterSize = 20;  // 1メーター = 20pt
        this.maxMeters = 10;  // 最大10メーター
        
        // キャンバスサイズ
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 30;
        
        // アニメーション用（表示用の値）
        this.animationProgress = {};
        this.axes.forEach(axis => this.animationProgress[axis.id] = 0);
        
        this.draw();
    }
    
    // カルマ値を設定（生の値）
    setKarma(id, value) {
        this.karma[id] = value;
        // 表示用には0以上に制限
        const displayValue = Math.max(0, Math.min(this.maxValue, value));
        this.animateTo(id, displayValue);
    }
    
    // カルマ値を増減
    addKarma(id, delta) {
        const newValue = (this.karma[id] || 0) + delta;
        this.setKarma(id, newValue);
    }
    
    // ポイントからメーター変換（0以上）
    pointsToMeters(points) {
        return Math.max(0, Math.floor(points / this.meterSize));
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
        
        // 背景グリッド（10段階）- 強調表示
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.25)';
        ctx.lineWidth = 1;
        
        for (let level = 1; level <= this.maxMeters; level++) {
            const levelRadius = (radius / this.maxMeters) * level;
            // 5と10の段階はより濃く
            if (level === 5 || level === 10) {
                ctx.strokeStyle = 'rgba(0, 255, 100, 0.5)';
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = 'rgba(0, 255, 100, 0.25)';
                ctx.lineWidth = 1;
            }
            this.drawHexagon(centerX, centerY, levelRadius, false);
        }
        
        // 軸線（強調）
        ctx.strokeStyle = 'rgba(0, 255, 100, 0.5)';
        ctx.lineWidth = 1;
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
        ctx.textAlign = 'center';
        
        this.axes.forEach((axis, i) => {
            const angle = (Math.PI * 2 / this.axes.length) * i - Math.PI / 2;
            const labelRadius = radius + 15;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;
            
            const meters = this.pointsToMeters(Math.max(0, this.karma[axis.id] || 0));
            
            // カルマ名
            ctx.fillStyle = axis.color;
            ctx.fillText(`${axis.name}`, x, y);
            
            // メーター表示
            ctx.fillStyle = 'rgba(0, 255, 100, 0.7)';
            ctx.fillText(`${meters}`, x, y + 12);
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
        
        // ShadowEvaluationの結果を反映
        // 診断結果を x3 で初期化（診断だけでは1メーター程度に収まるように）
        const multiplier = 3;
        
        Object.keys(karmaResult).forEach(key => {
            // 6つの主要カルマのみ表示（隠しカルマは非表示）
            const isMainKarma = this.axes.some(axis => axis.id === key);
            if (isMainKarma) {
                // 生の値を x3 で保存
                this.karma[key] = (karmaResult[key] || 0) * multiplier;
                // 表示用には0以上に制限
                const displayValue = Math.max(0, this.karma[key]);
                this.animateTo(key, displayValue);
            }
        });
        
        console.log('Karma initialized from evaluation (x3):', this.karma);
    }
    
    // 現在のカルマ値を取得（生の値）
    getKarma() {
        return { ...this.karma };
    }
    
    // メーター単位で取得
    getMeters() {
        const meters = {};
        this.axes.forEach(axis => {
            meters[axis.id] = this.pointsToMeters(Math.max(0, this.karma[axis.id] || 0));
        });
        return meters;
    }
    
    // S.I.の従順度を計算（全軸の平均メーター）
    getSIObedience() {
        const meters = this.getMeters();
        const total = Object.values(meters).reduce((sum, m) => sum + m, 0);
        return total / this.axes.length;
    }
    
    // 最も高いカルマを取得（S.I.システムで使用）
    getDominantKarma() {
        let maxValue = -Infinity;
        let dominant = null;
        
        this.axes.forEach(axis => {
            const value = this.karma[axis.id] || 0;
            if (value > maxValue) {
                maxValue = value;
                dominant = axis;
            }
        });
        
        return dominant;
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
