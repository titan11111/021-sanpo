/* =========================================
   1. Audio Engine
   ========================================= */
const AudioEngine = {
    ctx: null,
    bgmElement: null,
    isMuted: true,
    isPlayingBgm: false,
    useProceduralBgm: false,
    bgmInterval: null,

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        this.bgmElement = document.getElementById('bgm-audio');
        if (this.bgmElement) {
            this.bgmElement.addEventListener('error', () => {
                this.useProceduralBgm = true;
            });
        }
    },

    unlock() {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);

        if (!this.isMuted && !this.isPlayingBgm) {
            this.playBgm();
        }
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        const btn = document.getElementById('bgm-toggle');

        if (this.isMuted) {
            this.stopBgm();
            btn.textContent = 'SOUND OFF';
            btn.classList.remove('active');
        } else {
            btn.textContent = 'SOUND ON';
            btn.classList.add('active');
            this.unlock();
        }
    },

    playBgm() {
        this.isPlayingBgm = true;
        if (!this.useProceduralBgm && this.bgmElement) {
            this.bgmElement.volume = 0.4;
            const p = this.bgmElement.play();
            if (p !== undefined) {
                p.catch(() => {
                    this.useProceduralBgm = true;
                    this.startProceduralBgm();
                });
            }
        } else {
            this.startProceduralBgm();
        }
    },

    stopBgm() {
        this.isPlayingBgm = false;
        if (this.bgmElement) {
            this.bgmElement.pause();
            this.bgmElement.currentTime = 0;
        }
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    },

    startProceduralBgm() {
        if (this.bgmInterval) clearInterval(this.bgmInterval);
        let noteIndex = 0;
        const bassLine = [110, 110, 147, 131, 110, 110, 165, 147];

        const playNote = () => {
            if (!this.isPlayingBgm || this.isMuted) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = bassLine[noteIndex % bassLine.length];
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.25);
            noteIndex++;
        };
        playNote();
        this.bgmInterval = setInterval(playNote, 300);
    },

    playSe(type) {
        // ピコ（打感用）はミュート中でも鳴らす。それ以外は SOUND OFF で止める
        if (!this.ctx) return;
        if (this.isMuted && type !== 'pico') return;

        const now = this.ctx.currentTime;

        if (type === 'pico') {
            // ファミコン風「ピコッ」：高矩形 → 一瞬下げる
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(2100, now);
            osc.frequency.setValueAtTime(1400, now + 0.028);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.22, now + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
            return;
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);

        switch (type) {
            case 'select':
                osc.type = 'square';
                osc.frequency.setValueAtTime(1200, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                osc.stop(now + 0.05);
                break;
            case 'decide':
                osc.type = 'square';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.linearRampToValueAtTime(1760, now + 0.1);
                gain.gain.setValueAtTime(0.07, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.stop(now + 0.1);
                break;
            case 'item':
                osc.type = 'square';
                osc.frequency.setValueAtTime(1000, now);
                osc.frequency.linearRampToValueAtTime(2000, now + 0.25);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.25);
                osc.stop(now + 0.25);
                break;
            case 'damage':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(20, now + 0.3);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.stop(now + 0.3);
                break;
            case 'charm':
                osc.type = 'square';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.4);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.4);
                osc.stop(now + 0.4);
                break;
            default:
                osc.stop(now);
        }
    }
};

/* =========================================
   2. Game State（ストーリー本体は story.js）
   ========================================= */
const GameState = {
    scene: 'title',
    hp: 0,
    items: {},
    itemCount: 0,
    isTyping: false,
    textTimer: null
};

/* =========================================
   3. Touch / iOS helpers
   ========================================= */
function syncViewportHeight() {
    const h = (window.visualViewport && window.visualViewport.height)
        ? window.visualViewport.height
        : window.innerHeight;
    document.documentElement.style.setProperty('--vvh', h + 'px');
    fitSceneCanvas();
}

/** 場面キャンバスを枠いっぱいに広げる */
function fitSceneCanvas() {
    const canvas = document.getElementById('scene-canvas');
    const box = canvas && canvas.parentElement;
    if (!canvas || !box) return;
    const bw = box.clientWidth;
    const bh = box.clientHeight;
    if (bw < 2 || bh < 2) return;
    canvas.style.width = Math.floor(bw) + 'px';
    canvas.style.height = Math.floor(bh) + 'px';
}

function tapFeedback() {
    AudioEngine.unlock();
    AudioEngine.playSe('pico');
    if (navigator.vibrate) {
        try {
            navigator.vibrate([22, 18, 28]);
        } catch (_) {
            try { navigator.vibrate(30); } catch (__) { /* ignore */ }
        }
    }
}

function bindPress(el, handler) {
    if (!el) return;
    let armed = false;
    let lastFire = 0;
    const release = () => {
        el.classList.remove('is-pressed');
        armed = false;
    };
    const fire = (e) => {
        const now = Date.now();
        if (now - lastFire < 400) return;
        if (armed) return;
        if (e && e.cancelable && e.type === 'pointerdown') e.preventDefault();
        if (e) e.stopPropagation();
        armed = true;
        lastFire = now;
        el.classList.add('is-pressed');
        tapFeedback();
        try {
            handler(e);
        } finally {
            // transform で pointerleave が飛んでも、押下処理は完了させる
            setTimeout(release, 140);
        }
    };
    el.addEventListener('pointerdown', fire);
    // iOS で pointer が欠ける場合の保険
    el.addEventListener('click', (e) => {
        e.preventDefault();
        fire(e);
    });
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
}

let lastTap = 0;
document.addEventListener('touchstart', (e) => {
    // コマンド／UIボタンはダブルタップ防止の preventDefault 対象外（押下を潰さない）
    if (e.target.closest('.choice-btn, .item-btn, .audio-btn, button')) return;
    const now = Date.now();
    if (now - lastTap < 300) e.preventDefault();
    lastTap = now;
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    if (e.target.closest('.choice-btn, .item-btn, .audio-btn, button')) return;
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (e.target.closest('[data-scrollable], .choice-btn, .item-btn, .audio-btn, button')) return;
    e.preventDefault();
}, { passive: false });

document.addEventListener('dblclick', (e) => e.preventDefault());
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());

document.addEventListener('pointerdown', () => AudioEngine.unlock(), { once: true });
document.addEventListener('keydown', () => AudioEngine.unlock(), { once: true });

syncViewportHeight();
window.addEventListener('resize', syncViewportHeight);
window.addEventListener('orientationchange', () => setTimeout(syncViewportHeight, 120));
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncViewportHeight);
}

function resumeAudioIfNeeded() {
    if (AudioEngine.ctx && AudioEngine.ctx.state === 'suspended') {
        AudioEngine.ctx.resume();
    }
    if (!AudioEngine.isMuted && AudioEngine.isPlayingBgm && AudioEngine.bgmElement) {
        const p = AudioEngine.bgmElement.play();
        if (p && p.catch) p.catch(() => {});
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') resumeAudioIfNeeded();
});
window.addEventListener('pageshow', resumeAudioIfNeeded);
window.addEventListener('focus', resumeAudioIfNeeded);

/* =========================================
   4. Game Logic
   ========================================= */
window.addEventListener('load', () => {
    syncViewportHeight();
    AudioEngine.init();
    const canvas = document.getElementById('scene-canvas');
    SceneArt.init(canvas);
    requestAnimationFrame(() => {
        syncViewportHeight();
        requestAnimationFrame(() => {
            fitSceneCanvas();
            showScene('title');
        });
    });

    bindPress(document.getElementById('bgm-toggle'), () => {
        AudioEngine.toggleMute();
    });

    bindPress(document.getElementById('item-btn'), () => {
        openInventory();
    });
});

function startWalk() {
    AudioEngine.unlock();

    GameState.hp = 100;
    GameState.items = {};
    GameState.itemCount = 0;

    updateUI();
    showScene('start');
}

function resetGame() {
    AudioEngine.stopBgm();
    GameState.hp = 0;
    GameState.items = {};
    GameState.itemCount = 0;
    updateUI();
    document.getElementById('progress-fill').style.width = '0%';
    showScene('title');
}

function showScene(sceneId) {
    if (GameState.textTimer) clearTimeout(GameState.textTimer);
    GameState.isTyping = false;

    GameState.scene = sceneId;
    const scene = Scenes[sceneId];
    if (!scene) return;

    document.getElementById('location-name').textContent = scene.name;
    SceneArt.draw(sceneId);

    const textElem = document.getElementById('story-text');
    textElem.textContent = '';
    document.getElementById('choices').textContent = '';

    let i = 0;
    GameState.isTyping = true;

    textElem.onclick = () => {
        if (GameState.isTyping) {
            clearTimeout(GameState.textTimer);
            textElem.textContent = scene.text;
            finishTyping(scene);
        }
    };

    function type() {
        if (i < scene.text.length) {
            textElem.textContent += scene.text.charAt(i);
            i++;
            GameState.textTimer = setTimeout(type, 28);
        } else {
            finishTyping(scene);
        }
    }
    type();
    updateProgress(sceneId);
}

function finishTyping(scene) {
    GameState.isTyping = false;
    const choicesDiv = document.getElementById('choices');
    choicesDiv.textContent = '';
    choicesDiv.style.overflowY = scene.choices.length > 3 ? 'auto' : 'hidden';

    scene.choices.forEach((c) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice-btn';
        btn.textContent = '▶ ' + c.text;
        bindPress(btn, () => handleAction(c));
        choicesDiv.appendChild(btn);
    });
}

function handleAction(choice) {
    if (choice.act === 'start') {
        startWalk();
        return;
    }

    if (choice.act === 'heal') {
        GameState.hp = Math.min(999, GameState.hp + (choice.val || 10));
        updateUI();
        AudioEngine.playSe('charm');
        showScene(choice.to);
        return;
    }

    if (choice.act === 'check' || choice.act === 'judge') {
        let hasItem = false;
        if (choice.item === 'strangeGem') hasItem = GameState.items.strangeGem;
        else hasItem = GameState.items[choice.item];

        if (choice.act === 'judge') {
            if (choice.text.includes('アオイ')) hasItem = GameState.items.strangeGem;
            else if (choice.text.includes('コイン')) hasItem = GameState.items.lucky_coin;
            else if (choice.text.includes('ハンカチ')) hasItem = GameState.items.handkerchief;
        }

        let nextScene = hasItem ? choice.trueTo : choice.falseTo;
        if (!nextScene) nextScene = 'ending_bad_lie';
        showScene(nextScene);
        return;
    }

    if (choice.act === 'move') {
        showScene(choice.to);
        return;
    }

    if (choice.act === 'get') {
        const item = Items[choice.item];
        if (!GameState.items[choice.item]) {
            GameState.items[choice.item] = true;
            GameState.itemCount++;
            GameState.hp += 10;

            AudioEngine.playSe('item');
            showPopup('GET! ' + item.name, item.mark);
            flashScreen('white');
        }
        updateUI();
        setTimeout(() => showScene(choice.to), 1200);
        return;
    }

    if (choice.act === 'damage') {
        GameState.hp -= choice.val;
        AudioEngine.playSe('damage');
        flashScreen('red');
        const container = document.getElementById('game-container');
        container.classList.add('shake-anim');
        setTimeout(() => container.classList.remove('shake-anim'), 400);

        updateUI();
        if (GameState.hp <= 0) {
            setTimeout(() => showScene('ending_bad_lie'), 1000);
        } else {
            setTimeout(() => showScene(choice.to), 1000);
        }
        return;
    }

    if (choice.act === 'charmCheck') {
        AudioEngine.playSe('charm');
        flashScreen('white');
        showPopup('IQ UP!', '[CHARM]');
        GameState.hp += 20;
        updateUI();
        setTimeout(() => showScene(choice.to), 1200);
        return;
    }

    if (choice.act === 'reset') {
        resetGame();
    }
}

function openInventory() {
    if (String(GameState.scene).startsWith('title')) return;

    if (GameState.textTimer) clearTimeout(GameState.textTimer);
    GameState.isTyping = false;

    const choicesDiv = document.getElementById('choices');
    const textDiv = document.getElementById('story-text');
    textDiv.textContent = 'ショジヒン リスト';
    choicesDiv.textContent = '';
    choicesDiv.style.overflowY = 'auto';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'choice-btn';
    closeBtn.textContent = '▶ トジル';
    closeBtn.style.background = '#202040';
    bindPress(closeBtn, () => showScene(GameState.scene));
    choicesDiv.appendChild(closeBtn);

    const keys = Object.keys(GameState.items);
    if (keys.length === 0) {
        textDiv.textContent = 'ナニモ モッテイナイ...';
    } else {
        keys.forEach((key) => {
            const item = Items[key];
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'choice-btn';
            btn.textContent = '▶ ' + item.mark + ' ' + item.name;
            bindPress(btn, () => {
                textDiv.textContent = item.name + '\n\n' + item.desc;
            });
            choicesDiv.appendChild(btn);
        });
    }
}

function showPopup(text, mark) {
    const popup = document.getElementById('treasure-popup');
    document.getElementById('treasure-text').textContent = text;
    document.getElementById('treasure-icon').textContent = mark || '*';
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 1500);
}

function flashScreen(color) {
    const flash = document.getElementById('screen-flash');
    flash.className = 'screen-flash';
    void flash.offsetWidth;
    flash.classList.add(color === 'red' ? 'flash-red' : 'flash-white');
}

function updateUI() {
    document.getElementById('heart-points').textContent = GameState.hp;
    document.getElementById('treasure-count').textContent = GameState.itemCount;
}

function updateProgress(sceneId) {
    let per = 0;
    if (sceneId === 'start' || sceneId.startsWith('park') || sceneId.startsWith('cat') || sceneId.includes('convenience')) per = 10;
    else if (sceneId.includes('mansion') || sceneId.includes('police') || sceneId.includes('maid') || sceneId.includes('shed') || sceneId.includes('dog') || sceneId.includes('dining') || sceneId.includes('desk') || sceneId.includes('letter')) per = 40;
    else if (sceneId.includes('town') || sceneId.includes('bar') || sceneId.includes('fortune')) per = 60;
    else if (sceneId.includes('harbor') || sceneId.includes('station') || sceneId.includes('fisherman') || sceneId.includes('alley') || sceneId.includes('gem')) per = 80;
    else if (sceneId.includes('warehouse') || sceneId.includes('final')) per = 90;
    else if (sceneId.includes('ending') || sceneId.includes('epilogue')) per = 100;
    document.getElementById('progress-fill').style.width = per + '%';
}
