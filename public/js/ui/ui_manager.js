class UIManager {
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
        } else {
            this.overlay.classList.remove('visible');
            this.overlay.classList.add('hidden');
            this.clearChoices();
        }
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
                if (i % 5 === 0 && window.audioManager) {
                    window.audioManager.playSE('typewriter', 0.15); // 15%音量
                }
                
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
