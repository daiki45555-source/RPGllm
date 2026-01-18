class UIManager {
    // UI状態定数
    static STATES = {
        TITLE: 'TITLE',
        CHAR_MAKE: 'CHAR_MAKE',
        EVALUATION: 'EVALUATION',
        EXPLORATION: 'EXPLORATION',
        EVENT: 'EVENT',
        BATTLE: 'BATTLE'
    };

    constructor() {
        this.overlay = document.getElementById('event-overlay');
        this.dialogueContainer = document.getElementById('event-dialogue-container');
        this.speakerElement = document.getElementById('event-speaker');
        this.textElement = document.getElementById('event-text');
        this.choicesContainer = document.getElementById('event-choices');
        this.bgLayer = document.getElementById('event-background');
        this.charContainer = document.getElementById('character-container');
        this.charImg = document.getElementById('event-character-img');
        this.charImg = document.getElementById('event-character-img');
        this.sound = new SoundGenerator();
        
        // Add input listener
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.handleInput();
            });
        }
    }

    showEventOverlay(visible) {
        if (!this.overlay) return;
        if (visible) {
            this.overlay.classList.remove('hidden');
            this.overlay.classList.add('visible');
            
            // 他のUIを一時的に非表示にしてUI重複を防ぐ
            this.setNavAndFloatingUI(false);
        } else {
            this.overlay.classList.remove('visible');
            this.overlay.classList.add('hidden');
            this.clearChoices();
            
            // イベント終了後、探索モードならUIを復元
            if (this.currentState === UIManager.STATES.EXPLORATION) {
                this.setNavAndFloatingUI(true);
            }
        }
    }

    /**
     * UIの状態を一括で切り替える (C案の核心)
     * @param {string} stateName UIManager.STATES のいずれか
     */
    switchToState(stateName) {
        console.log(`[UIManager] Switching to state: ${stateName}`);
        this.currentState = stateName;

        // 全主要セクションのリスト
        const sections = {
            title: document.getElementById('title-screen-ui'),
            char: document.getElementById('character-creation'),
            eval: document.getElementById('evaluation'),
            intro: document.getElementById('introduction'),
            boot: document.getElementById('boot-screen')
        };

        // 背景レイヤー
        const bgLayer = document.getElementById('background-layer');

        // 1. まず全て非表示にする (クリーンリセット)
        Object.values(sections).forEach(sec => {
            if (sec) {
                sec.classList.add('hidden');
                sec.classList.remove('active');
                if (sec.id !== 'boot-screen' && sec.id !== 'introduction') {
                   sec.style.display = 'none';
                }
            }
        });
        
        // 特殊なイントロ、ブートの処理
        if (sections.intro) {
            sections.intro.style.display = 'none';
            sections.intro.classList.remove('active');
        }
        if (sections.boot) {
            sections.boot.style.display = 'none';
        }

        // 2. 状態に合わせて表示
        switch (stateName) {
            case UIManager.STATES.TITLE:
                if (sections.title) {
                    sections.title.style.display = 'block';
                    sections.title.classList.remove('hidden');
                }
                if (bgLayer) {
                    bgLayer.classList.remove('bg-sky', 'bg-counseling');
                    bgLayer.classList.add('bg-title');
                }
                this.setNavAndFloatingUI(false);
                break;

            case UIManager.STATES.CHAR_MAKE:
                if (sections.char) {
                    sections.char.style.display = 'block';
                    sections.char.classList.remove('hidden');
                    sections.char.classList.add('active');
                }
                if (bgLayer) {
                    bgLayer.classList.remove('bg-title', 'bg-counseling');
                    bgLayer.classList.add('bg-sky');
                }
                this.setNavAndFloatingUI(false);
                break;

            case UIManager.STATES.EVALUATION:
                if (sections.eval) {
                    sections.eval.style.display = 'block';
                    sections.eval.classList.remove('hidden');
                    sections.eval.classList.add('active');
                }
                if (bgLayer) {
                    bgLayer.classList.remove('bg-title', 'bg-sky');
                    bgLayer.classList.add('bg-counseling');
                }
                this.setNavAndFloatingUI(false);
                break;

            case UIManager.STATES.EXPLORATION:
                this.setNavAndFloatingUI(true);
                this.showEventOverlay(false); // 念のため
                break;

            case UIManager.STATES.EVENT:
                this.setNavAndFloatingUI(false);
                this.showEventOverlay(true);
                break;

            case UIManager.STATES.BATTLE:
                // 戦闘UIの表示はBattleSystemに任せるが、背景などはここで制御可能
                this.setNavAndFloatingUI(true);
                break;
        }
    }

    /**
     * ナビゲーションバーやフローティングUI(VitalGauge, LocationUI)の表示制御
     */
    setNavAndFloatingUI(visible) {
        // LocationManager
        if (window.locationManager) {
            if (visible) window.locationManager.show();
            else window.locationManager.hide();
        }

        // VitalGauge
        if (window.vitalGauge) {
            if (visible) window.vitalGauge.show();
            else window.vitalGauge.hide();
        }

        // KarmaGraph (常設コンテナ)
        const karmaContainer = document.getElementById('karma-graph-container');
        if (karmaContainer) {
            if (visible) karmaContainer.classList.remove('hidden');
            else karmaContainer.classList.add('hidden');
        }

        // Header/Footer (もしあれば)
        const header = document.querySelector('.system-header');
        const footer = document.querySelector('.system-footer');
        if (header) header.style.display = visible ? 'flex' : 'none';
        if (footer) footer.style.display = visible ? 'flex' : 'none';
    }


    renderDialogue(speaker, text, onNext) {
        if (!this.overlay) return;

        this.speakerElement.textContent = speaker;
        this.textElement.textContent = "";
        this.choicesContainer.classList.add('hidden'); // Hide choices while typing/reading
        
        // タイプライター効果
        this.isTyping = true;
        this.fullText = text;
        let i = 0;
        const speed = 30; // 30ms per character
        
        const typeNext = () => {
            if (!this.isTyping) {
                // スキップされた場合は即時表示
                this.textElement.textContent = this.fullText;
                this.currentNextCallback = onNext;
                return;
            }
            
            if (i < text.length) {
                this.textElement.textContent += text.charAt(i);
                
                // 5文字ごとにタイプライター音（負荷軽減）
                // TODO: 単音のタイプライター音を取得後に有効化
                // if (i % 5 === 0 && window.audioManager) {
                //     window.audioManager.playSE('typewriter', 0.15); // 15%音量
                // }
                
                i++;
                setTimeout(typeNext, speed);
            } else {
                // 完了
                this.isTyping = false;
                this.currentNextCallback = onNext;
            }
        };
        
        typeNext();
    }

    // タイプライター効果をスキップ
    skipTypewriter() {
        if (this.isTyping && this.fullText) {
            this.isTyping = false;
            this.textElement.textContent = this.fullText;
        }
    }

    // Call this from main event listener
    handleInput() {
        // タイプ中ならスキップ
        if (this.isTyping) {
            this.skipTypewriter();
            return;
        }
        
        if (this.currentNextCallback) {
            const cb = this.currentNextCallback;
            this.currentNextCallback = null;
            cb();
        }
    }

    renderChoices(choices, onSelect) {
        if (!this.choicesContainer) return;
        
        this.clearChoices();
        this.choicesContainer.classList.remove('hidden');

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'event-choice-btn btn-premium';
            btn.textContent = choice.text;
            if (choice.description) {
                // optional tooltip or subtext
                btn.title = choice.description;
            }
            btn.onmouseenter = () => {
                if (window.audioManager) window.audioManager.playSE('hover');
            };
            btn.onclick = (e) => {
                this.sound.playClick();
                e.stopPropagation(); // Prevent triggering the main dialogue advance
                onSelect(choice);
            };
            this.choicesContainer.appendChild(btn);
        });
    }

    clearChoices() {
        if (!this.choicesContainer) return;
        this.choicesContainer.innerHTML = '';
    }

    updateBackground(imageUrl) {
        if (this.bgLayer) {
            this.bgLayer.style.backgroundImage = `url('${imageUrl}')`;
        }
    }

    showCharacter(imagePath) {
        if (!this.charContainer || !this.charImg) return;
        
        if (imagePath) {
            this.charImg.src = imagePath;
            this.charContainer.classList.remove('hidden');
            // Optional: Add animation class
        } else {
            this.charContainer.classList.add('hidden');
        }
    }
}

// Global instance setup could happen here or in main.js
window.UIManager = UIManager;
