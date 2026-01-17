class EventManager {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.events = {};
        this.activeEvent = null;
        this.currentSequenceIndex = 0;
        this.currentRoute = null; // 'route_a', 'route_b', etc.

        // Load events
        if (window.jackEvents) this.events.jack = window.jackEvents;
        if (window.marianneEvents) this.events.marianne = window.marianneEvents;
        if (window.introEvents) this.events.intro = window.introEvents;
    }

    triggerEvent(characterId, rank) {
        const charEvents = this.events[characterId];
        if (!charEvents) {
            console.error(`No events found for character: ${characterId}`);
            return;
        }

        const eventId = `${characterId}_rank${rank}`;
        // Find event object by rank key (assuming 'rankX' format matches)
        const eventKey = `rank${rank}`;
        const eventData = charEvents[eventKey];

        if (!eventData) {
            console.error(`Event not found: ${eventId}`);
            return;
        }

        console.log(`Starting Event: ${eventData.title}`);
        this.startEvent(eventData);
    }

    startEvent(eventData) {
        this.activeEvent = eventData;
        this.currentSequenceIndex = 0;
        this.currentRoute = null;
        this.uiManager.showEventOverlay(true);
        this.processSequence();
    }

    processSequence() {
        if (!this.activeEvent) return;

        // Determine which sequence array to use (main or route-specific)
        let sequenceArray = this.activeEvent.sequences;
        let index = this.currentSequenceIndex;

        // If we represent routes as separate arrays or just appended content?
        // Simpler model: If currentRoute is set, look up that route in 'routes' object
        if (this.currentRoute && this.activeEvent.routes && this.activeEvent.routes[this.currentRoute]) {
             sequenceArray = this.activeEvent.routes[this.currentRoute];
             // Reset index for the route array if we just switched? 
             // Logic: Main sequences -> Choice -> Route sequences -> End
             // We need to track where we are.
             // Let's change the state tracking: we play 'sequences', then we present 'choices'.
             // If a choice leads to a 'next_sequence' (route), we assume that's a new array to play.
        }

        if (index >= sequenceArray.length) {
            // End of current sequence array
            // Check if there are choices to present (only after main sequence)
            if (!this.currentRoute && this.activeEvent.choices) {
                this.presentChoices(this.activeEvent.choices);
            } else {
                // End of event
                this.endEvent();
            }
            return;
        }

        const step = sequenceArray[index];
        
        // Handle Audio
        if (step.audio) {
            // Assume "audio" is an SE key for SoundGenerator/AudioManager
            // Access via global or passed instance. Using window.audioManager for now as it's the main entry.
            if (window.audioManager) {
                console.log(`Playing Event Audio: ${step.audio}`);
                window.audioManager.playSE(step.audio);
            }
        }

        // Handle Background
        if (step.bg) {
            this.uiManager.updateBackground(step.bg);
        }

        // Handle BGM
        if (step.bgm) {
            let bgmPath = step.bgm;
            // Simple mapping for keys
            const bgmMap = {
                'jack_routine': './BGM/ジャックとの日常.mp3',
                'guild_theme': './BGM/鴉の巣　基本BGM　宿　メインホール.mp3', // 鴉の巣BGM
                // Add others as needed
            };
            if (bgmMap[bgmPath]) bgmPath = bgmMap[bgmPath];
            
            if (window.audioManager) {
                console.log(`Playing Event BGM: ${bgmPath}`);
                window.audioManager.playBGM(bgmPath);
            }
        }

        // Handle Character
        if (step.character !== undefined) {
             // Mapping keys to files
             const charMap = {
                 'jack_normal': './images/characters/ジャック立ち絵ノーマル.png',
                 'jack_laugh': './images/characters/ジャック立ち絵ノーマル.png', // Fallback
                 'jack_serious': './images/characters/ジャック立ち絵ノーマル.png', // Fallback
                 'none': null
             };
             
             let charPath = step.character;
             if (charMap[charPath] !== undefined) charPath = charMap[charPath];
             
             // If direct path is used in event data, use it. If mapped, use map.
             // If step.character is explicitly null or "none", hide it.
             this.uiManager.showCharacter(charPath);
        }

        this.uiManager.renderDialogue(step.speaker, step.text, () => {
            // Callback when user clicks/advances
            this.currentSequenceIndex++;
            this.processSequence();
        });
    }

    presentChoices(choices) {
        this.uiManager.renderChoices(choices, (selectedChoice) => {
            this.handleChoice(selectedChoice);
        });
    }

    handleChoice(choice) {
        console.log(`Choice selected: ${choice.text}`);
        
        // Apply Karma
        if (choice.karma_change) {
            // Apply karma changes via a KarmaManager (if exists) or just log for now
            console.log("Applying Karma:", choice.karma_change);
            // TODO: Update global game state karma
        }

        // Apply Outcome Text if any (immediate feedback)
        // For simplicity, maybe just jump to the route
        
        if (choice.next_sequence && choice.next_sequence !== 'end') {
            this.currentRoute = choice.next_sequence;
            this.currentSequenceIndex = 0; // Start of route sequence
            this.processSequence();
        } else {
             // Just show outcome text as a dialogue then end
             if (choice.outcome_text) {
                 this.uiManager.renderDialogue("System", choice.outcome_text, () => {
                     this.endEvent();
                 });
             } else {
                 this.endEvent();
             }
        }
    }

    endEvent() {
        console.log("Event Ended");
        
        // Call onComplete callback if defined
        if (this.activeEvent && typeof this.activeEvent.onComplete === 'function') {
            this.activeEvent.onComplete();
        }
        
        this.uiManager.showEventOverlay(false);
        this.activeEvent = null;
        this.currentRoute = null;
        
        // === プロローグ終了後：ロケーションシステム起動 ===
        // LocationManagerがまだ初期化されていなければ初期化
        if (!window.locationManager && window.LocationManager) {
            console.log("[EventManager] ロケーションシステムを初期化...");
            window.locationManager = new window.LocationManager();
            
            // 鴉の巣・宿部屋からスタート
            window.locationManager.currentLocation = 'crows_nest_room';
            window.locationManager.init(); // UIを作成
            window.locationManager.show(); // 表示
            console.log("[EventManager] ロケーションUI表示完了");
        } else if (window.locationManager) {
            // 既に初期化済みの場合は表示のみ
            window.locationManager.show();
            console.log("[EventManager] ロケーションUI表示完了（既存）");
        }
    }
}

// Export for global use
window.EventManager = EventManager;
