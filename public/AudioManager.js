/**
 * AudioManager.js - Handles BGM and SE for Gaialem
 */

class AudioManager {
  constructor() {
    this.bgm = new Audio();
    this.bgm.loop = true;
    this.bgmVolume = 0.5;
    this.seVolume = 0.5;
    this.bgm.volume = this.bgmVolume;
    this.currentBgmPath = "";

    // SE's Audio Pool
    this.sePool = {};

    // Initialize SoundGenerator if available
    if (window.SoundGenerator) {
      this.soundGen = new window.SoundGenerator();
    }
  }

  async playBGM(path) {
    // Ensure SoundGenerator context is resumed on first BGM play (user interaction)
    if (this.soundGen) {
      this.soundGen
        .init()
        .catch((e) => console.log("AudioContext resume failed", e));
    }

    if (this.currentBgmPath === path) return;

    // Fade out current BGM if playing
    if (this.currentBgmPath) {
      await this.fadeOut();
    }

    this.bgm.src = path;
    this.currentBgmPath = path;

    try {
      await this.bgm.play();
      await this.fadeIn();
    } catch (error) {
      console.warn("Audio playback failed (interaction required?):", error);
    }
  }

  async stopBGM() {
    await this.fadeOut();
    this.bgm.pause();
    this.currentBgmPath = "";
  }

  async fadeIn(duration = 1000) {
    this.bgm.volume = 0;
    const step = 0.05;
    const interval = duration / (0.5 / step);
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        this.bgm.volume = Math.min(this.bgmVolume, this.bgm.volume + step);
        if (this.bgm.volume >= this.bgmVolume) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  }

  async fadeOut(duration = 1000) {
    const step = 0.05;
    const interval = duration / (this.bgm.volume / step);
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        this.bgm.volume = Math.max(0, this.bgm.volume - step);
        if (this.bgm.volume <= 0) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  }

  setBGMVolume(volume) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    this.bgm.volume = this.bgmVolume;
    // If SoundGenerator has master gain, update it too if we want
    if (this.soundGen && this.soundGen.masterGain) {
      // this.soundGen.masterGain.gain.value = volume * 0.6; // Scale down a bit?
    }
  }

  setSEVolume(volume) {
    this.seVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * 効果音を再生する
   * @param {string} seName - 効果音の名前 (例: 'click', 'cancel')
   * @param {number} volume - 音量 (0.0 ~ 1.0)
   */
  playSE(seName, volumeScale = 1.0) {
    const volume = this.seVolume * volumeScale;

    // 1. Try Synthetic Sound (SoundGenerator)
    // Auto-map 'glitch' -> playGlitch(), 'heartbeat' -> playHeartbeat()
    if (this.soundGen) {
      // Update SoundGenerator Global Volume for SE
      if (this.soundGen.masterGain) {
        this.soundGen.masterGain.gain.value = volume;
      }

      const methodName = `play${seName.charAt(0).toUpperCase() + seName.slice(1)}`;
      if (typeof this.soundGen[methodName] === "function") {
        try {
          this.soundGen[methodName]();
          return; // Handled synthetically
        } catch (e) {
          console.warn(`Synthetic SE error: ${seName}`, e);
        }
      }
    }

    // 2. File-based Playback
    try {
      // SE File Path Mapping
      // SE File Path Mapping
      const seFiles = {
        click: "./se/カチ.mp3",
        cancel: "./se/キャンセル.mp3",
        confirm: "./se/ピピ！.mp3",
        error: "./se/エラー　ビーブ音.mp3",
        ambience:
          "./se/エアコン※アンチグラヴィティ君へ　音うるさいから　少し下げてもいいかも※.mp3",
        hover: "./se/マウスインタラクト　カーソル移動1.mp3",
        typewriter: "./se/タイプライター.mp3",
        jack_last_battle: "./se/ジャックラストバトル.mp3",
        attack: "./se/剣で斬る（基本）.mp3",
        damage: "./se/ダメージSE(基本).mp3",
        enemy_death: "./se/敵消滅se.mp3",
      };

      const sePath = seFiles[seName];

      // If strictly mapped but missing file, log it
      if (!sePath) {
        // If it wasn't handled by SoundGenerator AND has no file, it's missing
        // console.log(`SE: ${seName} (no audio file mapped and no synthetic fallback)`);
        return;
      }

      // Create new Audio object and play
      const se = new Audio(sePath);

      // Specific volume adjustments
      let finalVolume = volume;
      if (seName === "ambience") {
        finalVolume *= 0.2; // Reduce air conditioner noise significantly
      }

      se.volume = finalVolume;
      se.play().catch((err) => {
        // console.log(`SE playback skipped: ${seName}`, err.message);
      });
    } catch (error) {
      console.log(`SE error (ignored): ${seName}`, error.message);
    }
  }
}

window.audioManager = new AudioManager();
