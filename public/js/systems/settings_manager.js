export class SettingsManager {
    constructor(audioManager) {
        this.audioManager = audioManager;
        this.settings = {
            audio: {
                bgmVolume: 50,
                seVolume: 50,
                mode: 'standard'
            },
            visual: {
                crtEnabled: true,
                terminalColor: 'green',
                textSpeed: 'normal'
            },
            system: {
                autoPace: 50,
                skipMode: 'read-only'
            }
        };
        
        // DOM Elements
        this.modal = document.getElementById('settings-modal');
        this.btnClose = document.getElementById('btn-close-settings');
        this.tabs = document.querySelectorAll('.settings-tab');
        this.panes = document.querySelectorAll('.tab-pane');
        
        // Input Elements
        this.inputs = {
            bgmVolume: document.getElementById('vol-bgm'),
            seVolume: document.getElementById('vol-se'),
            soundMode: document.getElementById('sound-mode'),
            crtToggle: document.getElementById('toggle-crt'),
            terminalColor: document.getElementById('terminal-color'),
            textSpeed: document.getElementById('text-speed'),
            resetSave: document.getElementById('btn-reset-save')
        };

        this.init();
    }

    init() {
        if (!this.modal) return;
        
        // Setup Event Listeners
        this.setupTabs();
        this.setupInputs();
        this.setupModalControl();
        
        // Apply initial defaults
        this.applySettings();
    }

    setupModalControl() {
        const btnConfig = document.getElementById('btn-settings');
        if (btnConfig) {
            btnConfig.addEventListener('click', () => this.open());
        }
        
        // Close button
        if (this.btnClose) {
            this.btnClose.addEventListener('click', () => this.close());
        }

        // Close on backdrop click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
    }

    setupTabs() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all
                this.tabs.forEach(t => t.classList.remove('active'));
                this.panes.forEach(p => p.classList.remove('active'));
                
                // Activate clicked
                tab.classList.add('active');
                const tabId = tab.dataset.tab;
                const targetPane = document.getElementById(`tab-${tabId}`);
                if (targetPane) targetPane.classList.add('active');
                
                if (this.audioManager) this.audioManager.playSE('click');
            });
        });
    }

    setupInputs() {
        // Audio Controls
        if (this.inputs.bgmVolume) {
            this.inputs.bgmVolume.addEventListener('input', (e) => {
                this.settings.audio.bgmVolume = e.target.value;
                this.updateAudio();
            });
        }
        
        if (this.inputs.seVolume) {
            this.inputs.seVolume.addEventListener('input', (e) => {
                this.settings.audio.seVolume = e.target.value;
                this.updateAudio();
            });
            // Play test sound on release
            this.inputs.seVolume.addEventListener('change', () => {
                if (this.audioManager) this.audioManager.playSE('click');
            });
        }

        // Visual Controls
        if (this.inputs.crtToggle) {
            this.inputs.crtToggle.addEventListener('change', (e) => {
                this.settings.visual.crtEnabled = e.target.checked;
                this.updateVisuals();
            });
        }

        if (this.inputs.terminalColor) {
            this.inputs.terminalColor.addEventListener('change', (e) => {
                this.settings.visual.terminalColor = e.target.value;
                this.updateVisuals();
            });
        }
        
        if (this.inputs.textSpeed) {
            this.inputs.textSpeed.addEventListener('change', (e) => {
                this.settings.visual.textSpeed = e.target.value;
                // Update global type speed if applicable
                window.dispatchEvent(new CustomEvent('settingChanged', { 
                    detail: { type: 'textSpeed', value: e.target.value } 
                }));
            });
        }

        // System Controls
        if (this.inputs.resetSave) {
            this.inputs.resetSave.addEventListener('click', () => {
                if(confirm("WARNING: accessing core memory.\nAre you sure you want to RESET REALITY? (Delete Save Data)")) {
                    this.resetData();
                }
            });
        }
    }

    updateAudio() {
        if (!this.audioManager) return;

        // Convert 0-100 scale to 0.0-1.0
        const bgmVol = this.settings.audio.bgmVolume / 100;
        const seVol = this.settings.audio.seVolume / 100;

        if (typeof this.audioManager.setBGMVolume === 'function') {
            this.audioManager.setBGMVolume(bgmVol);
        }
        if (typeof this.audioManager.setSEVolume === 'function') {
            this.audioManager.setSEVolume(seVol);
        }
    }

    updateVisuals() {
        // CRT Effect
        const crtOverlay = document.querySelector('.crt-overlay'); // Assuming this class exists or needs to be added
        if (crtOverlay) {
            crtOverlay.style.opacity = this.settings.visual.crtEnabled ? '1' : '0.1';
            crtOverlay.style.display = this.settings.visual.crtEnabled ? 'block' : 'none'; // Or just toggle a class
        }

        // Terminal Color
        const root = document.documentElement;
        let color = '#00ff41'; // default green
        switch(this.settings.visual.terminalColor) {
            case 'amber': color = '#ffb000'; break;
            case 'cyan': color = '#00ffff'; break;
            case 'red': color = '#ff0033'; break;
            case 'green': default: color = '#00ff41'; break;
        }
        root.style.setProperty('--accent-color', color);
    }

    resetData() {
        localStorage.clear();
        alert("Memory wiped. Rebooting system...");
        location.reload();
    }

    open() {
        this.modal.classList.remove('hidden');
        if (this.audioManager) this.audioManager.playSE('click');
    }

    close() {
        this.modal.classList.add('hidden');
        if (this.audioManager) this.audioManager.playSE('cancel');
    }

    applySettings() {
        this.updateVisuals();
        this.updateAudio();
    }
}
