﻿import { Utils } from "./js/utils/utils.js";
import { SettingsManager } from "./js/systems/settings_manager.js";
const script = {
  welcome: [
    "System: Connection Established.",
    "System: User: Unknown.",
    "カウンセラー: 「……おや。迷い込んでしまいましたか？」",
    "「はじめまして。あなたが新しいクライアントですね。」",
    "「ようこそ。ここは……まあ、ただの『相談室』ですよ。」",
    "「私はあなたの担当カウンセラー。……といっても、ただの話し相手のようなものです。」",
    "「本格的な手続きを始める前に、少しだけ世間話をしませんか？」",
    "「この世界の……そう、『美しい』成り立ちについてのお話です。」",
    "「――楽な姿勢で、聞いてくださいね。」",
  ],
  fable: [
    "むかしむかし。まだ、世界がひとりぼっちで、冷たい闇のなかで泣いていたころのおはなし。",
    "行き場所のなかった　いのちたちは、導かれるようにして、この地に降り立ちました。その場所の名は、ガイアレム。",
    "ここは、あらゆる悲しみが浄化される、約束の地。誰もが　かけがえのない役割を持ち、誰もが　愛されるために作られた、完全なる調和の箱庭。",
    "ここでは、涙さえも宝石のように輝き、痛みは、美しい物語の一部として飾り付けられます。",
    "そう、まるで　すべてのものが　高らかに　生を謳歌しているかのように。",
    "ねえ、きこえますか？ 外の世界から訪れた、愛しい旅人よ。",
    "あなたは　この世界を、ガイアレムを、愛してください。その手で触れるすべてを、慈しんでください。",
    "あなたの　愛さえあれば。",
    "この　涙でできた　可哀想な世界は。明日も、明後日も、その先も。",
    "いつまでも　あたたかな命が　瞬き続けるのです。",
    "ずっと、ずっと……美しく。",
  ],
  diagnosisIntro: [
    "System: Audio_File: Corrupted.",
    "カウンセラー: 「……おっと、失礼。古いテープなもので、ノイズが混じりました。」",
    "「今の話は忘れて結構ですよ。所詮は、よくできた作り話ですから。」",
    "「さて……そろそろ本題（ゲンジツ）に戻りましょうか。」",
    "「あなたがこの世界で、どのような役割を演じるべきか。」",
    "「あなたの『魂の形』を測る……簡単な適性診断を始めます。」",
    "「準備はよろしいですか？」",
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  // Check dependencies
  if (!window.audioManager) {
    console.error("Critical Error: AudioManager not loaded.");
    alert("System Error: Audio Manager missing.");
    return;
  }
  if (!window.ShadowEvaluation) {
    console.error("Critical Error: ShadowEvaluation not loaded.");
    alert("System Error: Shadow Evaluation missing.");
    return;
  }

  const consoleOutput = document.getElementById("console-output");
  function log(message) {
    if (consoleOutput) consoleOutput.textContent = `> ${message}`;
    console.log(message);
  }

  log("Initializing local script environment...");

  // --- GAME DATA ---
  const STATS_CONFIG = [
    { id: "vigor", name: "生命力", desc: "HPと物理防御力に関与" },
    { id: "attunement", name: "集中力", desc: "MPと魔法スロットに関与" },
    { id: "endurance", name: "持久力", desc: "スタミナと頑強さに関与" },
    { id: "strength", name: "筋力", desc: "物理攻撃力と装備重量に関与" },
    { id: "dexterity", name: "技量", desc: "詠唱速度と落下ダメージ軽減に関与" },
    { id: "intelligence", name: "理力", desc: "魔術の威力に関与" },
    { id: "faith", name: "信仰", desc: "奇跡の威力と闇防御に関与" },
    { id: "luck", name: "運", desc: "アイテム発見力と状態異常蓄積に関与" },
  ];

  let playerStats = {};
  let remainingPoints = 15;
  const INITIAL_STAT_VALUE = 5;

  // Initialize stats
  STATS_CONFIG.forEach((stat) => (playerStats[stat.id] = INITIAL_STAT_VALUE));

  // --- ELEMENTS ---
  const btnStart = document.getElementById("btn-start");
  const btnOption = document.getElementById("btn-option");
  const introSection = document.getElementById("introduction");
  const introText = document.getElementById("intro-text");
  const charCreationSection = document.getElementById("character-creation");
  const evalSection = document.getElementById("evaluation");
  const counselorDialogue = document.getElementById("counselor-dialogue");
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");

  // Character Creation Elements
  const statsGrid = document.getElementById("stats-grid");
  const remainingPointsDisplay = document.getElementById("remaining-points");
  const btnConfirmCreation = document.getElementById("btn-confirm-creation");
  const creationMessage = document.getElementById("creation-message");
  const playerNameInput = document.getElementById("player-name");

  const evaluation = new window.ShadowEvaluation();

  const elements = {
    bootScreen: document.getElementById("boot-screen"),
    btnSettings: document.getElementById("btn-settings"),
    btnCloseSettings: document.getElementById("btn-close-settings"),
    settingsModal: document.getElementById("settings-modal"),
    progressionToggle: document.getElementById("progression-mode"),
    backgroundLayer: document.getElementById("background-layer"),
    settingsModal: document.getElementById("settings-modal"),
    progressionToggle: document.getElementById("progression-mode"),
    backgroundLayer: document.getElementById("background-layer"),
    audioManager: window.audioManager,
  };

  // Initialize Event System
  if (window.UIManager && window.EventManager) {
    log("Initializing Event System...");
    window.uiManager = new window.UIManager();
    window.eventManager = new window.EventManager(window.uiManager);
    // Initialize Settings Manager
    if (typeof SettingsManager !== "undefined") {
      window.settingsManager = new SettingsManager(elements.audioManager);
      log("Settings Manager initialized.");
    }
    // Debug shortcut
    window.triggerEvent = (charId, rank) =>
      window.eventManager.triggerEvent(charId, rank);
  } else {
    console.warn("Event System classes missing.");
  }

  // Initialize Karma Graph
  if (window.KarmaGraph) {
    log("Initializing Karma Graph...");
    window.karmaGraph = new window.KarmaGraph("karma-canvas");
    // ミニ版もある場合は初期化
    if (document.getElementById("karma-canvas-mini")) {
      window.karmaGraphMini = new window.KarmaGraph("karma-canvas-mini");
    }
    log("Karma Graph initialized.");
  } else {
    console.warn("KarmaGraph class not found.");
  }

  // Initialize Vital Gauge
  if (window.VitalGauge) {
    log("Initializing Vital Gauge...");
    window.vitalGauge = new window.VitalGauge();
    // 初期ステータス（デバッグ用にコンソールから操作可能）
    window.testDamage = (amount) => window.vitalGauge.takeDamage(amount);
    window.testHeal = (amount) => window.vitalGauge.heal(amount);
    log("Vital Gauge initialized.");
  } else {
    console.warn("VitalGauge class not found.");
  }

  // Initialize Inventory
  if (window.inventory) {
    log("Initializing Inventory...");
    window.inventory.init();
    log("Inventory initialized.");
  } else {
    console.warn("Inventory class not found.");
  }

  // === セーブデータからのロード状態確認 ===
  const isPrologueComplete = localStorage.getItem('prologue_complete') === 'true';
  if (isPrologueComplete && window.LocationManager) {
    log("Prologue already complete. Restoring game state...");
    
    // ブート画面とタイトルUIを非表示
    if (elements.bootScreen) {
      elements.bootScreen.classList.add('hidden');
    }
    const titleUI = document.getElementById('title-screen-ui');
    if (titleUI) {
      titleUI.style.display = 'none';
    }
    
    // LocationManager初期化・表示
    window.locationManager = new window.LocationManager();
    window.locationManager.init();
    window.locationManager.show();
    
    // VitalGaugeを表示
    if (window.vitalGauge) {
      window.vitalGauge.show();
    }
    
    // BGM再生
    if (elements.audioManager) {
      elements.audioManager.playBGM('./BGM/title_theme.mp3');
    }
    
    log("Game state restored from save.");
  }


  // State
  let isAutoProgression = true;
  let isSkipping = false;
  let typeSpeedMultiplier = 1.0;

  // Listen for Settings Changes
  window.addEventListener("settingChanged", (e) => {
    if (e.detail.type === "textSpeed") {
      switch (e.detail.value) {
        case "slow":
          typeSpeedMultiplier = 2.0;
          break;
        case "fast":
          typeSpeedMultiplier = 0.5;
          break;
        case "instant":
          typeSpeedMultiplier = 0;
          break;
        case "normal":
        default:
          typeSpeedMultiplier = 1.0;
          break;
      }
      log(`System: Text speed set to ${e.detail.value}`);
    }
  });

  // Global Hover Sound
  document.body.addEventListener("mouseover", (e) => {
    if (
      e.target.matches(
        'button, .btn-premium, .btn-console, input[type="range"], .settings-tab, .item-entry',
      )
    ) {
      if (window.audioManager) window.audioManager.playSE("hover");
    }
  });

  // --- EVENT LISTENERS ---

  // Header Controls
  const btnSkip = document.getElementById("btn-skip");
  const headerProgressionToggle = document.getElementById(
    "header-progression-toggle",
  );

  if (btnSkip) {
    btnSkip.addEventListener("click", () => {
      isSkipping = !isSkipping;
      const stateSpan = btnSkip.querySelector(".state-text");
      if (stateSpan) {
        stateSpan.textContent = isSkipping ? "ON" : "OFF";
      } else {
        btnSkip.textContent = isSkipping ? "SKIP: ON" : "SKIP: OFF";
      }
      btnSkip.classList.toggle("active", isSkipping);
      if (elements.audioManager) elements.audioManager.playSE("click");
    });
  }

  if (headerProgressionToggle) {
    headerProgressionToggle.addEventListener("change", (e) => {
      isAutoProgression = e.target.checked;
      log(
        `System: Progression mode set to ${isAutoProgression ? "AUTO" : "MANUAL"}`,
      );
      if (elements.audioManager) elements.audioManager.playSE("click");
    });
  }

  // Settings handled by SettingsManager
  if (btnOption && elements.settingsModal) {
    // Main menu option button
    btnOption.addEventListener("click", () => {
      if (window.settingsManager) window.settingsManager.open();
      if (elements.audioManager) elements.audioManager.playSE("click");
    });
  }

  // Inventory Button
  const btnInventory = document.getElementById("btn-inventory");
  if (btnInventory) {
    btnInventory.addEventListener("click", () => {
      if (window.inventory) {
        window.inventory.toggle();
      }
      if (elements.audioManager) elements.audioManager.playSE("click");
    });
  }

  // Boot Screen
  if (elements.bootScreen) {
    // パスワード入力でデバッグモード起動
    const debugPasswordInput = document.getElementById("debug-password");
    if (debugPasswordInput) {
      debugPasswordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.stopPropagation();
          if (
            window.debugMode &&
            window.debugMode.checkPassword(debugPasswordInput.value)
          ) {
            console.log("[DEBUG MODE] パスワード認証成功！大器モード起動！");
            elements.audioManager.playBGM("./BGM/title_theme.mp3");
            elements.bootScreen.classList.add("hidden");

            // デバッグモード有効化
            window.debugMode.activate();

            // プロローグスキップ → ロケーションマネージャー表示
            if (window.LocationManager) {
              window.locationManager = new window.LocationManager();
              window.locationManager.init();
              window.locationManager.show();
            }

            log("[DEBUG MODE] 大器モード起動！プロローグスキップ。");
          } else {
            console.log("[DEBUG MODE] パスワードが違います");
            debugPasswordInput.value = "";
            debugPasswordInput.style.borderColor = "#ff0000";
            setTimeout(() => {
              debugPasswordInput.style.borderColor = "rgba(255, 153, 0, 0.3)";
            }, 500);
          }
        }
      });

      // パスワード入力欄クリックでブート画面クリックを無効化
      debugPasswordInput.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    elements.bootScreen.addEventListener("click", () => {
      console.log("Boot screen clicked");
      elements.audioManager.playBGM("./BGM/title_theme.mp3");
      elements.bootScreen.classList.add("hidden");
      if (elements.backgroundLayer)
        elements.backgroundLayer.classList.add("bg-title");
      log("System: Initialization complete. Audio unlocked.");
    });
  }

  if (btnStart) {
    btnStart.addEventListener("click", () => {
      startSequence();
    });
  }

  // ロードボタン
  const btnLoad = document.getElementById("btn-load");
  if (btnLoad && window.saveManager) {
    // セーブデータがあればボタンを有効化
    const hasAnyData = window.saveManager.slots.some(slot => slot !== null);
    if (hasAnyData) {
      btnLoad.disabled = false;
    }
    
    btnLoad.addEventListener("click", () => {
      if (elements.audioManager) elements.audioManager.playSE("click");
      window.saveManager.showLoadUI();
    });
  }

  // デバッグボタン
  const btnDebug = document.getElementById("btn-debug");
  if (btnDebug) {
    btnDebug.addEventListener("click", () => {
      if (elements.audioManager) elements.audioManager.playSE("click");
      showDebugPasswordModal();
    });
  }

  // デバッグパスワード入力モーダル
  function showDebugPasswordModal() {
    // 既存のモーダルがあれば削除
    const existing = document.getElementById("debug-modal");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "debug-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 400px; padding: 2rem;">
        <header class="modal-header">
          <span class="mono-text">🛠️ DEBUG_ACCESS_PANEL</span>
          <button id="btn-close-debug" class="btn-close">×</button>
        </header>
        <div style="padding: 1.5rem;">
          <p style="margin-bottom: 1rem; color: var(--text-secondary);">開発者パスワードを入力してください</p>
          <input 
            type="password" 
            id="debug-modal-password" 
            style="width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.5); border: 1px solid var(--accent-color); color: var(--accent-color); font-family: var(--font-mono); font-size: 1rem;"
            placeholder="Password..."
            autocomplete="off"
          />
          <div id="debug-modal-error" style="color: #ff4444; margin-top: 0.5rem; font-size: 0.9rem;"></div>
          <button id="btn-debug-submit" class="btn-premium" style="width: 100%; margin-top: 1rem;">アクセス</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const passwordInput = document.getElementById("debug-modal-password");
    const submitBtn = document.getElementById("btn-debug-submit");
    const closeBtn = document.getElementById("btn-close-debug");
    const errorDiv = document.getElementById("debug-modal-error");

    passwordInput.focus();

    // 閉じるボタン
    closeBtn.addEventListener("click", () => {
      if (elements.audioManager) elements.audioManager.playSE("click");
      modal.remove();
    });

    // オーバーレイクリックで閉じる
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    // 送信処理
    function attemptLogin() {
      if (window.debugMode && window.debugMode.checkPassword(passwordInput.value)) {
        if (elements.audioManager) elements.audioManager.playSE("click");
        modal.remove();
        
        // ブート画面を非表示
        if (elements.bootScreen) {
          elements.bootScreen.classList.add("hidden");
        }
        
        // タイトルUIを非表示
        const titleUI = document.getElementById("title-screen-ui");
        if (titleUI) titleUI.style.display = "none";
        
        // BGM再生
        if (elements.audioManager) {
          elements.audioManager.playBGM("./BGM/title_theme.mp3");
        }
        
        // デバッグモード有効化
        window.debugMode.activate();
        
        // LocationManager表示
        if (window.LocationManager) {
          window.locationManager = new window.LocationManager();
          window.locationManager.init();
          window.locationManager.show();
        }
        
        log("[DEBUG MODE] 大器モード起動！プロローグスキップ。");
      } else {
        errorDiv.textContent = "ACCESS_DENIED: パスワードが違います";
        passwordInput.value = "";
        passwordInput.style.borderColor = "#ff4444";
        setTimeout(() => {
          passwordInput.style.borderColor = "var(--accent-color)";
        }, 500);
      }
    }

    submitBtn.addEventListener("click", attemptLogin);
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") attemptLogin();
    });
  }

  // --- GAME LOGIC ---

  function waitForClick() {
    return new Promise((resolve) => {
      const handler = () => {
        document.removeEventListener("click", handler);
        resolve();
      };
      setTimeout(() => {
        document.addEventListener("click", handler);
      }, 100);
    });
  }

  function typeWriter(text, element, speed = 40) {
    if (!element) return;
    let i = 0;
    element.innerHTML = "";
    return new Promise((resolve) => {
      // Instant finish if skipping
      if (isSkipping) {
        element.innerHTML = text;
        resolve();
        return;
      }

      const timer = setInterval(() => {
        if (isSkipping) {
          clearInterval(timer);
          element.innerHTML = text;
          resolve();
          return;
        }

        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          // 3文字ごとにタイプライターSE再生（一時無効化 - 単音SE待ち）
          // if (i % 3 === 0 && window.audioManager) {
          //     window.audioManager.playSE('typewriter', 0.3);
          // }
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed * typeSpeedMultiplier);
    });
  }

  async function handleProgression() {
    if (isAutoProgression) {
      await new Promise((r) => setTimeout(r, 1200));
    } else {
      await waitForClick();
    }
  }

  function renderStats() {
    if (!statsGrid) return;
    statsGrid.innerHTML = "";
    remainingPointsDisplay.textContent = remainingPoints;

    STATS_CONFIG.forEach((stat) => {
      const row = document.createElement("div");
      row.className = "stat-row";

      const label = document.createElement("div");
      label.className = "stat-label";
      label.textContent = stat.name;

      const controls = document.createElement("div");
      controls.className = "stat-controls";

      const btnMinus = document.createElement("button");
      btnMinus.className = "stat-btn";
      btnMinus.textContent = "-";
      btnMinus.onclick = () => updateStat(stat.id, -1);
      if (playerStats[stat.id] <= INITIAL_STAT_VALUE) btnMinus.disabled = true;

      const valDisplay = document.createElement("div");
      valDisplay.className = "stat-value";
      valDisplay.textContent = playerStats[stat.id];

      const btnPlus = document.createElement("button");
      btnPlus.className = "stat-btn";
      btnPlus.textContent = "+";
      btnPlus.onclick = () => updateStat(stat.id, 1);
      if (remainingPoints <= 0) btnPlus.disabled = true;

      controls.appendChild(btnMinus);
      controls.appendChild(valDisplay);
      controls.appendChild(btnPlus);

      row.appendChild(label);
      row.appendChild(controls);
      statsGrid.appendChild(row);
    });
  }

  function updateStat(id, change) {
    if (change > 0 && remainingPoints <= 0) return;
    if (change < 0 && playerStats[id] <= INITIAL_STAT_VALUE) return;

    playerStats[id] += change;
    remainingPoints -= change;

    // 効果音（エラーでも処理を止めない）
    try {
      if (elements.audioManager && elements.audioManager.playSE) {
        elements.audioManager.playSE("click");
      }
    } catch (e) {
      console.log("SE skipped:", e.message);
    }

    renderStats();
  }

  function showCharacterCreation() {
    return new Promise((resolve) => {
      charCreationSection.classList.remove("hidden");
      charCreationSection.classList.add("active");
      renderStats();

      const btnAutoStats = document.getElementById("btn-auto-stats");
      if (btnAutoStats) {
        btnAutoStats.onclick = () => {
          while (remainingPoints > 0) {
            const ids = STATS_CONFIG.map((s) => s.id);
            const randomId = ids[Math.floor(Math.random() * ids.length)];
            updateStat(randomId, 1);
          }
        };
      }

      btnConfirmCreation.onclick = () => {
        const name = playerNameInput.value.trim();

        // Black Knight Name Restriction
        const forbidden = [
          "Black Knight",
          "Schwarz",
          "黒騎士",
          "ブラックナイト",
          "Noir",
        ];
        if (
          forbidden.some((term) =>
            name.toLowerCase().includes(term.toLowerCase()),
          )
        ) {
          creationMessage.textContent =
            "FATAL ERROR: IDENTITY_RECURSION_DETECTED";
          creationMessage.style.color = "red";
          elements.audioManager.playSE("glitch");
          if (elements.soundGenerator) {
            elements.soundGenerator.playAlarm();
          }

          // Visual Glitch
          document.body.classList.add("glitch-active");
          setTimeout(
            () => document.body.classList.remove("glitch-active"),
            500,
          );
          return;
        }

        if (name.length === 0) {
          creationMessage.textContent = "※個体名を入力してください";
          elements.audioManager.playSE("click"); // Click sound as error for now
          return;
        }

        if (remainingPoints > 0) {
          creationMessage.textContent = "※リソースを全て割り振ってください";
          elements.audioManager.playSE("click");
          return;
        }

        log(
          `Created Character: ${name}, Stats: ${JSON.stringify(playerStats)}`,
        );
        localStorage.setItem("player_name", name);
        localStorage.setItem("player_stats", JSON.stringify(playerStats));

        elements.audioManager.playSE("click");
        charCreationSection.classList.remove("active");
        charCreationSection.classList.add("hidden");
        resolve();
      };
    });
  }

  async function startSequence() {
    log("Initial connection sequence started.");

    const titleUI = document.getElementById("title-screen-ui");
    if (titleUI) titleUI.style.display = "none";
    // Ensure buttons are hidden if strictly needed, but hiding container is better
    // if (btnStart) btnStart.style.display = "none";
    // if (btnOption) btnOption.style.display = "none";

    // 1. Scene Transition to Bluesky
    if (elements.backgroundLayer) {
      elements.backgroundLayer.classList.remove("bg-title");
      elements.backgroundLayer.classList.add("bg-sky");
    }

    // 2. Intro Text Sequence (Welcome & Fable)
    for (const line of script.welcome) {
      await typeWriter(line, introText);
      await handleProgression();
    }

    if (introText) introText.classList.add("fable-text");
    for (const line of script.fable) {
      await typeWriter(line, introText);
      await handleProgression();
    }

    // 3. Character Creation
    if (introSection) introSection.classList.remove("active");
    if (introSection) introSection.classList.add("hidden"); // Ensure cleanup

    await showCharacterCreation();

    // 4. Glitch & Transition to Counseling
    log("Warning: Reality flux detected.");
    document.body.classList.add("glitch-active");
    await new Promise((r) => setTimeout(r, 500));
    document.body.classList.remove("glitch-active");

    await elements.audioManager.playBGM(
      "./BGM/ゆりかご（カルマカウンセリング時のＢＧＭ）.mp3",
    );

    if (elements.backgroundLayer) {
      elements.backgroundLayer.classList.remove("bg-sky");
      elements.backgroundLayer.classList.add("bg-counseling");
    }

    if (evalSection) evalSection.classList.add("active");

    for (const line of script.diagnosisIntro) {
      await typeWriter(line, counselorDialogue);
      await handleProgression();
    }

    startEvaluation();
  }

  async function startEvaluation() {
    renderQuestion();
  }

  async function renderQuestion() {
    const q = evaluation.getCurrentQuestion();
    if (!q) return;

    const progress = evaluation.getProgress();
    log(`Evaluation Progress: ${progress.current} / ${progress.total}`);
    await typeWriter(
      `[ Question ${progress.current} / ${progress.total} ]\n${q.text}`,
      questionText,
      20,
    );

    optionsContainer.innerHTML = "";
    q.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.className = "btn-premium option-btn";
      btn.textContent = opt.text;
      btn.addEventListener("click", () => handleAnswer(index));
      optionsContainer.appendChild(btn);
    });
  }

  async function handleAnswer(index) {
    log(`Recording intent for ${evaluation.getCurrentQuestion().id}...`);
    const finished = evaluation.answer(index);

    if (finished) {
      finishEvaluation();
    } else {
      renderQuestion();
    }
  }

  async function finishEvaluation() {
    if (optionsContainer) optionsContainer.innerHTML = "";
    if (counselorDialogue) counselorDialogue.innerHTML = ""; // Clear previous dialogue
    const result = evaluation.getResult();
    log("Evaluation complete. Karma profile generated.");

    // --- NEW: Precious Keyword Input ---
    await typeWriter("カウンセラー: 「……最後に、ひとつだけ。」", questionText);
    await handleProgression();

    await typeWriter(
      "「あなたの好きな言葉は何ですか？ 物でも概念でも人の名前でも、何でもいいです。」\n「……教えてくれますか？」",
      questionText,
    );

    // Create Input Interface
    const inputWrapper = document.createElement("div");
    inputWrapper.style.display = "flex";
    inputWrapper.style.gap = "1rem";
    inputWrapper.style.marginTop = "1rem";
    inputWrapper.style.justifyContent = "center";

    const keywordInput = document.createElement("input");
    keywordInput.type = "text";
    keywordInput.maxLength = 8;
    keywordInput.placeholder = "8文字以内で入力";
    keywordInput.style.padding = "10px";
    keywordInput.style.background = "rgba(0,0,0,0.5)";
    keywordInput.style.border = "1px solid var(--accent-color)";
    keywordInput.style.color = "var(--accent-color)";
    keywordInput.style.fontFamily = "var(--font-serif)";
    keywordInput.style.fontSize = "1.2rem";

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "回答";
    confirmBtn.className = "btn-premium";
    confirmBtn.style.padding = "10px 20px";

    inputWrapper.appendChild(keywordInput);
    inputWrapper.appendChild(confirmBtn);
    optionsContainer.appendChild(inputWrapper);
    keywordInput.focus();

    const keyword = await new Promise((resolve) => {
      confirmBtn.onclick = () => {
        const val = keywordInput.value.trim();
        if (val) resolve(val);
        else {
          keywordInput.placeholder = "※何か入力してください";
          elements.audioManager.playSE("click");
        }
      };
      // Allow Enter key
      keywordInput.onkeydown = (e) => {
        if (e.key === "Enter") confirmBtn.onclick();
      };
    });

    localStorage.setItem("precious_word", keyword);
    log(`Precious Word registered: ${keyword}`);

    if (optionsContainer) optionsContainer.innerHTML = "";
    // --- END NEW ---

    const closingLines = [
      "カウンセラー: 「……ふふ。興味深いですね。」",
      "「『" + keyword + "』……。」",
      "「それは、あなただけの大切な魂の形……。」",
      "「慈しみ、あるいは……呪い。呼び方は何でも構いません。」",
      "「どうぞ、その形を忘れないで。大事になさってください……。」",
      "「……そして、この世界の様に泣かないでくださいね。」",
      "「ただ、楽しんでください……。涙でできた、この美しい箱庭で。」",
      "「ほんの一間の……夢の時間を……。」",
      "「……そう。まずは……手始めに……」",
      "「この世界には、『６つの宝物（ねがい）』が隠されています。」",
      "「……1つでも、いいですよ。」",
      "「1つ集めれば……あなたはこの世界の英雄です。」",
      "「この物語は、あなたによって救われます。」",
      "「郊外の神殿に来てください。……エンディングですよ。」",
      "「……まあ、6つすべてを集めても、かまいませんけれど。」",
      "「全てを集めた者が何を見るのか……私は、知らないのです。……ふふ。」",
    ];

    for (const line of closingLines) {
      await typeWriter(line, questionText);
      await handleProgression(); // Changed to handleProgression to respect auto/manual toggle
    }

    localStorage.setItem("player_karma", JSON.stringify(result.karma));
    localStorage.setItem("player_tags", JSON.stringify(result.tags));

    // カルマグラフを表示し、診断結果を反映
    if (window.karmaGraph) {
      window.karmaGraph.initFromEvaluation(result.karma);
      window.karmaGraph.show();

      // ミニ版も連携
      if (window.karmaGraphMini) {
        window.karmaGraphMini.initFromEvaluation(result.karma);
      }

      // S.I.従順度を更新
      const siValue = document.getElementById("si-obedience-value");
      const siSyncValue = document.getElementById("si-sync-value");
      const obedience = window.karmaGraph.getSIObedience();

      if (siValue) {
        siValue.textContent = obedience.toFixed(1);

        // レベルに応じてクラスを設定
        siValue.classList.remove("low", "mid", "high", "max");
        if (obedience < 3) siValue.classList.add("low");
        else if (obedience < 6) siValue.classList.add("mid");
        else if (obedience < 9) siValue.classList.add("high");
        else siValue.classList.add("max");
      }

      // Vital Gauge内のS.I. Syncも更新
      if (siSyncValue) {
        siSyncValue.textContent = obedience.toFixed(1);
      }

      log("Karma Graph updated with evaluation results.");
    }

    // Vital Gaugeを表示
    if (window.vitalGauge) {
      window.vitalGauge.show();
      log("Vital Gauge shown.");
    }

    await new Promise((r) => setTimeout(r, 2000));
    log("System: Deployment initiated. Redirecting to Gaialem...");

    // --- Trigger Prologue Event ---
    if (window.eventManager && window.introEvents) {
      // Hide counseling UI elements
      evalSection.classList.add("hidden");
      if (elements.backgroundLayer) {
        elements.backgroundLayer.classList.remove("bg-counseling");
      }

      // Trigger the prologue event (Jack encounter)
      // prologue_event.jsでは "rank1" として定義されている
      const prologueEventData = window.introEvents.rank1;
      if (prologueEventData) {
        console.log("Starting Prologue Event...");
        window.eventManager.startEvent(prologueEventData);
      } else {
        console.error("Prologue event data (introEvents.rank1) not found!");
      }
    }
  }

  log("Gaialem System Interface: Standby.");
});

