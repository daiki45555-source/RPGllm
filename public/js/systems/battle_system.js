/**
 * 戦闘システム
 * 七つの願いが降る庭で - Battle System
 */

class BattleSystem {
    constructor() {
        this.inBattle = false;
        this.enemies = [];
        this.turn = 0;
        this.battleLog = [];
        this.escapeAttempts = 0;
    }

    /**
     * 戦闘を開始
     * @param {object} enemyData - 敵データ（spawnEnemy()の結果）
     */
    startBattle(enemyData) {
        if (!enemyData) return false;

        this.inBattle = true;
        this.enemies = [];
        this.turn = 1;
        this.battleLog = [];
        this.escapeAttempts = 0;

        // 敵を配置（群れ対応）
        const count = enemyData.count || 1;
        for (let i = 0; i < count; i++) {
            const enemy = JSON.parse(JSON.stringify(enemyData));
            enemy.instanceId = `${enemy.id}_${i}`;
            enemy.stats.hp = enemy.stats.maxHp;
            this.enemies.push(enemy);
        }

        this.addLog(`${enemyData.name}${count > 1 ? ` × ${count}` : ''} が現れた！`);

        // 戦闘BGMを再生（AudioManagerがあれば使用）
        if (typeof AudioManager !== 'undefined' && AudioManager.playBGM) {
            AudioManager.playBGM('battle');
        }

        // 戦闘UIを表示
        this.showBattleUI();

        return true;
    }

    /**
     * プレイヤーの攻撃
     * @param {number} targetIndex - 攻撃対象のインデックス
     */
    playerAttack(targetIndex = 0) {
        if (!this.inBattle || targetIndex >= this.enemies.length) return;

        const target = this.enemies[targetIndex];
        const player = window.gameState?.player;
        if (!player) return;

        // ダメージ計算
        const damage = this.calculateDamage(player, target);
        const isCritical = this.checkCritical(player);
        const finalDamage = isCritical ? Math.floor(damage * 1.5) : damage;

        // カルマ補正適用
        const karmaBonus = this.getKarmaDamageBonus(player, target);
        const totalDamage = Math.floor(finalDamage * (1 + karmaBonus / 100));

        // ダメージ適用
        target.stats.hp = Math.max(0, target.stats.hp - totalDamage);

        // ログ追加
        let logMsg = `${target.name}に ${totalDamage} ダメージ！`;
        if (isCritical) logMsg = `クリティカル！ ` + logMsg;
        if (karmaBonus > 0) logMsg += `（カルマ補正 +${karmaBonus}%）`;
        this.addLog(logMsg);

        // 敵が倒れたかチェック
        if (target.stats.hp <= 0) {
            this.addLog(`${target.name}を倒した！`);
            this.enemies.splice(targetIndex, 1);

            if (this.enemies.length === 0) {
                this.victory();
                return;
            }
        }

        // 敵のターン
        this.enemyTurn();
    }

    /**
     * ダメージ計算
     */
    calculateDamage(attacker, defender) {
        const atk = attacker.atk || attacker.stats?.atk || 10;
        const def = defender.def || defender.stats?.def || 0;
        return Math.max(1, atk - def);
    }

    /**
     * クリティカル判定
     */
    checkCritical(player) {
        let critRate = 5; // 基本5%

        // 誠実カルマでクリティカル率上昇
        if (typeof KarmaSystem !== 'undefined') {
            const integrity = KarmaSystem.getKarmaValue('integrity') || 0;
            critRate += integrity;
        }

        return Math.random() * 100 < critRate;
    }

    /**
     * カルマによるダメージボーナスを取得
     */
    getKarmaDamageBonus(player, enemy) {
        let bonus = 0;

        if (typeof KarmaSystem === 'undefined') return bonus;

        // 正義カルマ：人間敵へダメージ増加
        if (enemy.type === 'human') {
            const justice = KarmaSystem.getKarmaValue('justice') || 0;
            bonus += justice; // カルマ値%分ダメージ増加
        }

        // 執念カルマ：HP25%以下でATK増加
        const playerHpPercent = (player.hp / player.maxHp) * 100;
        if (playerHpPercent <= 25) {
            const perseverance = KarmaSystem.getKarmaValue('perseverance') || 0;
            bonus += perseverance;
        }

        // 嗜虐カルマ：敵HP50%以下でダメージ増加
        const enemyHpPercent = (enemy.stats.hp / enemy.stats.maxHp) * 100;
        if (enemyHpPercent <= 50) {
            const sadism = KarmaSystem.getKarmaValue('sadism') || 0;
            bonus += sadism;
        }

        return bonus;
    }

    /**
     * 敵のターン
     */
    enemyTurn() {
        if (!this.inBattle || this.enemies.length === 0) return;

        const player = window.gameState?.player;
        if (!player) return;

        for (const enemy of this.enemies) {
            // 行動判定
            const action = this.determineEnemyAction(enemy);

            if (action === 'attack') {
                const damage = this.calculateDamage(enemy.stats, player);
                
                // 慈悲カルマで被ダメージ軽減
                let damageReduction = 0;
                if (typeof KarmaSystem !== 'undefined') {
                    const kindness = KarmaSystem.getKarmaValue('kindness') || 0;
                    damageReduction = Math.floor(damage * (kindness * 0.5 / 100));
                }

                // 忍耐カルマで状態異常耐性（ここでは未実装）

                const finalDamage = Math.max(1, damage - damageReduction);
                player.hp = Math.max(0, player.hp - finalDamage);

                let logMsg = `${enemy.name}の攻撃！ ${finalDamage} ダメージ！`;
                if (damageReduction > 0) logMsg += `（慈悲で ${damageReduction} 軽減）`;
                this.addLog(logMsg);

                // プレイヤー死亡チェック
                if (player.hp <= 0) {
                    this.defeat();
                    return;
                }
            } else if (action === 'flee') {
                this.addLog(`${enemy.name}は逃げ出した！`);
                this.enemies = this.enemies.filter(e => e.instanceId !== enemy.instanceId);
                
                if (this.enemies.length === 0) {
                    this.victory();
                    return;
                }
            }
        }

        // ターン終了
        this.turn++;
        this.updateBattleUI();
    }

    /**
     * 敵の行動を決定
     */
    determineEnemyAction(enemy) {
        const behavior = enemy.behavior || {};

        // HP低下で逃走判定
        if (behavior.flee) {
            const hpPercent = (enemy.stats.hp / enemy.stats.maxHp) * 100;
            if (hpPercent <= behavior.flee.threshold) {
                if (Math.random() * 100 < behavior.flee.chance) {
                    return 'flee';
                }
            }
        }

        return 'attack';
    }

    /**
     * 逃走を試みる
     */
    attemptEscape() {
        if (!this.inBattle) return;

        const player = window.gameState?.player;
        if (!player) return;

        this.escapeAttempts++;

        // 逃走成功率計算
        const avgEnemySpd = this.enemies.reduce((sum, e) => sum + e.stats.spd, 0) / this.enemies.length;
        const playerSpd = player.spd || 10;
        let escapeChance = 50 + (playerSpd - avgEnemySpd) * 3;

        // 勇気カルマで先制/逃走ボーナス？（今回は適用しない）

        escapeChance = Math.max(10, Math.min(95, escapeChance));

        if (Math.random() * 100 < escapeChance) {
            this.addLog('うまく逃げきった！');

            // 逃走ペナルティ判定（30%）
            if (Math.random() < 0.3) {
                this.applyEscapePenalty();
            }

            this.endBattle(false);
        } else {
            this.addLog('逃げられなかった！');
            this.enemyTurn();
        }
    }

    /**
     * 逃走ペナルティ適用
     */
    applyEscapePenalty() {
        const player = window.gameState?.player;
        if (!player) return;

        // 所持金の10-20%を落とす
        const lossPercent = 10 + Math.random() * 10;
        const lossAmount = Math.floor((player.money || 0) * lossPercent / 100);

        if (lossAmount > 0) {
            player.money = (player.money || 0) - lossAmount;
            this.addLog(`逃走中に ${lossAmount}M を落とした！`);
        }
    }

    /**
     * 勝利処理
     */
    victory() {
        this.addLog('戦闘に勝利した！');

        const player = window.gameState?.player;
        if (!player) {
            this.endBattle(true);
            return;
        }

        // 報酬計算
        let totalMoney = 0;
        let totalExp = 0;
        const drops = [];

        for (const enemy of this.enemies.concat(this._defeatedEnemies || [])) {
            totalMoney += enemy.rewards?.money || 0;
            totalExp += enemy.rewards?.exp || 0;

            // ドロップ判定
            if (enemy.drops) {
                for (const drop of enemy.drops) {
                    if (Math.random() * 100 < drop.chance) {
                        drops.push(drop);
                    }
                }
            }
        }

        // 報酬付与
        player.money = (player.money || 0) + totalMoney;
        player.exp = (player.exp || 0) + totalExp;

        this.addLog(`${totalMoney}M 獲得！`);
        this.addLog(`${totalExp} EXP 獲得！`);

        for (const drop of drops) {
            this.addLog(`${drop.name}を手に入れた！`);
            // TODO: インベントリに追加
        }

        // レベルアップチェック
        this.checkLevelUp(player);

        this.endBattle(true);
    }

    /**
     * レベルアップチェック
     */
    checkLevelUp(player) {
        const expTable = [0, 20, 55, 110, 190, 300]; // 累計経験値
        const currentLevel = player.level || 1;
        const currentExp = player.exp || 0;

        // 次のレベルに必要な経験値
        let nextLevelExp = expTable[currentLevel] || (expTable[expTable.length - 1] + (currentLevel - 5) * 30);

        while (currentExp >= nextLevelExp && currentLevel < 99) {
            player.level = (player.level || 1) + 1;
            
            // ステータス上昇
            player.maxHp = (player.maxHp || 100) + 10;
            player.maxStm = (player.maxStm || 100) + 5;
            player.atk = (player.atk || 10) + 2;
            player.def = (player.def || 5) + 1;
            player.spd = (player.spd || 10) + 1;

            // HP/STM全回復
            player.hp = player.maxHp;
            player.stm = player.maxStm;

            this.addLog(`レベルアップ！ Lv.${player.level}！`);

            nextLevelExp = expTable[player.level] || (nextLevelExp + 30);
        }
    }

    /**
     * 敗北処理
     */
    defeat() {
        this.addLog('力尽きた...');

        const player = window.gameState?.player;
        if (player) {
            // カジュアルモード：所持金50%ロスト
            const lossAmount = Math.floor((player.money || 0) * 0.5);
            player.money = (player.money || 0) - lossAmount;
            
            if (lossAmount > 0) {
                this.addLog(`${lossAmount}M を失った...`);
            }

            // HP回復（拠点に戻る設定）
            player.hp = Math.floor(player.maxHp * 0.3);
        }

        this.endBattle(false);
    }

    /**
     * 戦闘終了
     * @param {boolean} isVictory - 勝利かどうか
     */
    endBattle(isVictory) {
        this.inBattle = false;
        this._defeatedEnemies = [];

        // BGM停止
        if (typeof AudioManager !== 'undefined' && AudioManager.stopBGM) {
            AudioManager.stopBGM();
        }

        // 戦闘UI非表示
        this.hideBattleUI();

        // 勝利の場合、フィールドBGMに戻す
        if (isVictory) {
            // TODO: 現在のエリアに応じたBGMを再生
        }
    }

    /**
     * ログ追加
     */
    addLog(message) {
        this.battleLog.push({
            turn: this.turn,
            message: message,
            timestamp: Date.now()
        });
        console.log(`[Battle] ${message}`);
        this.updateBattleLog();
    }

    /**
     * 戦闘UI表示
     */
    showBattleUI() {
        let battleUI = document.getElementById('battle-ui');
        
        if (!battleUI) {
            battleUI = document.createElement('div');
            battleUI.id = 'battle-ui';
            battleUI.className = 'battle-ui';
            document.body.appendChild(battleUI);
        }

        this.updateBattleUI();
        battleUI.style.display = 'block';
    }

    /**
     * 戦闘UI更新
     */
    updateBattleUI() {
        const battleUI = document.getElementById('battle-ui');
        if (!battleUI) return;

        const player = window.gameState?.player;

        battleUI.innerHTML = `
            <div class="battle-container">
                <div class="battle-enemies">
                    ${this.enemies.map((e, i) => `
                        <div class="enemy-card" data-index="${i}">
                            <img src="${e.image}" alt="${e.name}" onerror="this.style.display='none'">
                            <div class="enemy-info">
                                <div class="enemy-name">${e.name}</div>
                                <div class="enemy-hp-bar">
                                    <div class="enemy-hp-fill" style="width: ${(e.stats.hp / e.stats.maxHp) * 100}%"></div>
                                </div>
                                <div class="enemy-hp-text">${e.stats.hp} / ${e.stats.maxHp}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="battle-log" id="battle-log">
                    ${this.battleLog.slice(-5).map(log => 
                        `<div class="log-entry">${log.message}</div>`
                    ).join('')}
                </div>

                <div class="battle-actions">
                    <button class="battle-btn attack-btn" onclick="battleSystem.playerAttack(0)">
                        ⚔️ 攻撃
                    </button>
                    <button class="battle-btn escape-btn" onclick="battleSystem.attemptEscape()">
                        🏃 逃走
                    </button>
                </div>

                <div class="player-status">
                    <div class="player-hp">HP: ${player?.hp || 0} / ${player?.maxHp || 100}</div>
                    <div class="player-stm">STM: ${player?.stm || 0} / ${player?.maxStm || 100}</div>
                </div>
            </div>
        `;
    }

    /**
     * 戦闘ログ更新
     */
    updateBattleLog() {
        const logContainer = document.getElementById('battle-log');
        if (!logContainer) return;

        logContainer.innerHTML = this.battleLog.slice(-5).map(log => 
            `<div class="log-entry">${log.message}</div>`
        ).join('');

        logContainer.scrollTop = logContainer.scrollHeight;
    }

    /**
     * 戦闘UI非表示
     */
    hideBattleUI() {
        const battleUI = document.getElementById('battle-ui');
        if (battleUI) {
            battleUI.style.display = 'none';
        }
    }
}

// グローバルインスタンス
const battleSystem = new BattleSystem();

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BattleSystem, battleSystem };
}
