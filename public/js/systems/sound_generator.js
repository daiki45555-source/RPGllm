class SoundGenerator {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // Default volume
        this.masterGain.connect(this.ctx.destination);
    }

    // Ensure AudioContext is resumed (browser policy requirement)
    async init() {
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    }

    playClick() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        // High pitch short blip
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    /*
    playHover() {
        // Very subtle tick
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }
    */

    playConfirm() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        // Positive ascending triad-ish
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.setValueAtTime(554, this.ctx.currentTime + 0.1); // C#
        osc.frequency.setValueAtTime(659, this.ctx.currentTime + 0.2); // E

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.6);
    }
    
    playCancel() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }
    // --- Synthetic Sound Methods ---

    createNoiseBuffer() {
        if (this.noiseBuffer) return this.noiseBuffer;
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buffer;
        return buffer;
    }

    playGlitch() {
        this.init();
        const buffer = this.createNoiseBuffer();
        const src = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        src.buffer = buffer;
        src.loop = true;

        // Randomize playback rate for "tearing" effect
        src.playbackRate.value = 0.5 + Math.random() * 1.5;

        filter.type = 'highpass';
        filter.frequency.value = 1000;

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        // Short intense burst
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.8, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        src.start(now);
        src.stop(now + 0.25);
    }

    playNoise() {
        this.init();
        const buffer = this.createNoiseBuffer();
        const src = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        
        src.buffer = buffer;
        
        src.connect(gain);
        gain.connect(this.masterGain);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1); 

        src.start(now);
        src.stop(now + 0.15);
    }

    playHeartbeat() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.value = 60; // Low thud
        
        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    playRain() {
        this.init();
        // Since we can't easily loop generic noise nicely without filters, 
        // we'll make a short "shower" sound or just a longer noise burst
        const buffer = this.createNoiseBuffer();
        const src = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        src.buffer = buffer;
        src.loop = true;

        filter.type = 'lowpass';
        filter.frequency.value = 400; // Muffled sound

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.5); // Fade in
        
        // This is meant to be ambience, so we return control to caller? 
        // For simple SE usage, we'll just play a 5s clip for now
        src.start(now);
        
        // Auto fade out after 5s for safety in this simple implementation
        gain.gain.linearRampToValueAtTime(0, now + 5);
        src.stop(now + 5.1);
    }

    playGlassBreak() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        // High frequency sweep downwards rapidly
        osc.frequency.setValueAtTime(2000, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
        
        osc.type = 'sawtooth';

        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.15);
        
        // Add a noise layer for "shatter"
        this.playNoise();
    }

    // --- New Methods for "While You Sleep" Request ---

    playTyping() {
        // High pitched short clicks for text rendering
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        // Randomize pitch slightly for realism
        const freq = 600 + Math.random() * 200;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0.1, now); // Quiet
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    playAlarm() {
        // Urgent repetitive beep
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(880, now); // A5

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.setValueAtTime(0.5, now + 0.1);
        gain.gain.setValueAtTime(0, now + 0.11);
        
        // Double beep pattern
        gain.gain.setValueAtTime(0.5, now + 0.2);
        gain.gain.setValueAtTime(0.5, now + 0.3);
        gain.gain.setValueAtTime(0, now + 0.31);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    playPowerUp() {
        // Ascending dreamy sound
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.5);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.2);
        gain.gain.linearRampToValueAtTime(0, now + 0.6);

        osc.start(now);
        osc.stop(now + 0.7);
    }

    playPowerDown() {
        // Descending heavy sound
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(55, now + 0.4);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc.start(now);
        osc.stop(now + 0.51);
    }

    playDrone() {
        // Continuous low hum for tension
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(this.masterGain);

        // Low frequency
        osc.frequency.value = 50; 

        // Low volume
        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 2); // Slow fade in

        osc.start(now);
        
        // Stop after 10s for safety (or caller manages loop)
        gain.gain.linearRampToValueAtTime(0, now + 10);
        osc.stop(now + 10.1);
    }
}

// Export for global use
window.SoundGenerator = SoundGenerator;
