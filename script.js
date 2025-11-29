/* =========================================
   8-Bit Audio Controller (Web Audio API)
   ========================================= */
   const AudioController = {
    ctx: null,
    bgmElement: null,
    isMuted: false, // デフォルトはONにしておく（ユーザーのアクション待ち）
    initialized: false,

    // ユーザーが最初にボタンを押した時に呼ぶ
    init() {
        if (this.initialized) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.bgmElement = document.getElementById('bgm-audio');
        
        // BGMトグルボタンの設定
        const btn = document.getElementById('bgm-toggle');
        btn.addEventListener('click', () => {
            this.toggleSound();
        });

        this.initialized = true;
    },

    // ユーザー操作の瞬間にAudioContextを「再開」させる魔法の呪文
    async resumeContext() {
        if (!this.ctx) this.init();
        
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
        
        // BGM再生試行
        if (!this.isMuted && this.bgmElement && this.bgmElement.paused) {
            this.bgmElement.volume = 0.3;
            this.bgmElement.play().catch(e => console.log("BGM Play prevented (Click first):", e));
            this.updateBtnState(true);
        }
    },

    toggleSound() {
        if (!this.ctx) this.init();

        const btn = document.getElementById('bgm-toggle');
        if (this.isMuted) {
            // ONにする操作
            this.isMuted = false;
            this.resumeContext(); // ここでもResumeを試みる
        } else {
            // OFFにする操作
            this.isMuted = true;
            if(this.bgmElement) this.bgmElement.pause();
            this.updateBtnState(false);
        }
    },

    updateBtnState(isOn) {
        const btn = document.getElementById('bgm-toggle');
        if(isOn) {
            btn.textContent = "SOUND: ON ♪";
            btn.classList.add('active');
        } else {
            btn.textContent = "SOUND: OFF";
            btn.classList.remove('active');
        }
    },

    // ファミコン風SE生成 (Oscillator) - ファイル不要で必ず鳴る
    playSe(type) {
        // コンテキストがない、またはミュート時は鳴らさない
        if (!this.ctx || this.isMuted) return;
        
        // ここでも念の為resumeを呼ぶ（Safari対策）
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        const now = this.ctx.currentTime;

        if (type === 'select') {
            // ピッ (決定音)
            osc.type = 'square'; // ファミコンらしい矩形波
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            
            osc.start(now);
            osc.stop(now + 0.08);

        } else if (type === 'move') {
            // カッ (文字送り/移動)
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
            
            osc.start(now);
            osc.stop(now + 0.05);

        } else if (type === 'item') {
            // ジャララーン (アイテム発見) - アルペジオ
            osc.type = 'square';
            
            // ド・ミ・ソ・ド
            osc.frequency.setValueAtTime(523.25, now); 
            osc.frequency.setValueAtTime(659.25, now + 0.1); 
            osc.frequency.setValueAtTime(783.99, now + 0.2); 
            osc.frequency.setValueAtTime(1046.50, now + 0.3); 
            
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.6);
            
            osc.start(now);
            osc.stop(now + 0.6);

        } else if (type === 'start') {
            // ブォーン (開始音)
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.linearRampToValueAtTime(880, now + 0.3);
            
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
            
            osc.start(now);
            osc.stop(now + 0.5);
        }
    }
};

/* =========================================
   Game Logic
   ========================================= */
let gameState = {
    currentDay: 1,
    currentLocation: 0,
    heartPoints: 0, 
    diaryEntries: [],
    metCharacters: {},  
    treasures: {},      
    totalTreasures: 0   
};

// 証拠品データ
const treasureData = {
    "handkerchief": {
        name: "アカイ ハンカチ",
        icon: "🟥",
        description: "イニシャル『R』ガ シシュウ サレテイル。",
        rarity: "common"
    },
    "strangeGem": {
        name: "アオイ カケラ",
        icon: "💎",
        description: "コワレタ ホウセキ ノ イチブ ノ ヨウダ。",
        rarity: "rare"
    },
    "muddyBoots": {
        name: "ドロ ノ ブーツ",
        icon: "👢",
        description: "サイズ 28cm。ツチ ガ マダ シメッテイル。",
        rarity: "common"
    },
    "secretLetter": {
        name: "ナゾ ノ テガミ",
        icon: "✉️",
        description: "『ツキ ガ ノボル コロ ミナト デ...』",
        rarity: "epic"
    },
    "goldenKey": {
        name: "オウゴン ノ カギ",
        icon: "🗝️",
        description: "フルビタ ヤカタ ノ カギ ラスイ。",
        rarity: "legendary"
    }
};

// シナリオ：散歩中に事件に巻き込まれる
const days = [
    {
        day: 1,
        locations: [
            {
                name: "ヘイワ ナ コウエン",
                icon: "🌳",
                story: "イツモ ドオリ ノ サンポ ミチ。<br>トリ ノ サエズリ ガ キコエル。<br>キョウ ハ ナニモ オキラナイ... ハズダッタ。",
                choices: [{ text: "サキ ニ ススム", action: "next" }]
            },
            {
                name: "ゴウテイ ノ マエ",
                icon: "🏰",
                story: "オオキナ ヤカタ ノ マエ デ パトカー ガ トマッテイル。<br>ケイカン「キセイセン カラ ハイラナイデ！」<br>ナニカ ジケン ガ オキタ ヨウダ。",
                choices: [
                    { text: "ヤジウマ ニ キク", action: "talkToMob" },
                    { text: "ウラグチ ニ マワル", action: "next" } // 強制進行
                ]
            },
            {
                name: "ヤカタ ノ ウラニワ",
                icon: "🌿",
                story: "ウラニワ ニ シノビコンダ。<br>ダレモ イナイ...。<br>オヤ？ シゲミ ノ ナカ ニ ナニカ アル。",
                choices: [
                    { text: "アタリ を シラベル", action: "searchTreasure", treasure: "handkerchief" },
                    { text: "マド ノ ナカ を ノゾク", action: "peekWindow" }
                ]
            },
            {
                name: "ロジアウラ",
                icon: "🗑️",
                story: "アヤシイ オトコ ガ ロジウラ へ ハシッテ イッタ。<br>オイカケヨウ。<br>ゴミバコ が タオサレテ イル。",
                choices: [
                    { text: "ゴミバコ を シラベル", action: "searchTreasure", treasure: "strangeGem" },
                    { text: "キキコミ を スル", action: "talkToCat" },
                    { text: "サキ ニ ススム", action: "next" }
                ]
            },
            {
                name: "ミナト ノ ソウコ",
                icon: "⚓",
                story: "オトコ ハ ソウコ ニ ニゲコンダ。<br>ウミ ノ ニオイ ガ スル。<br>ココ ガ アジト カモ シレナイ。",
                choices: [
                    { text: "ソウコ ニ トツニュウ", action: "stormWarehouse" },
                    { text: "ウラ ニ マワル", action: "searchTreasure", treasure: "muddyBoots" }
                ]
            },
            {
                name: "ケッチャク",
                icon: "🚓",
                story: "ハンニン を オイツメタ！<br>ショウコヒン を ツキツケテ ヤレ。<br>「オマエ ガ ハンニン ダ！」",
                choices: [
                    { text: "スイリ を ヒロウ スル", action: "showDiary" }
                ]
            }
        ]
    }
];

const events = {
    talkToMob: {
        story: "「コノ ヤカタ ノ ホウセキ ガ ヌスマレタ ラスイヨ。<br>ハンニン ハ マダ チカク ニ イル カモ...」",
        points: 10,
        diary: "🗣️ 目撃情報: 宝石盗難事件が発生。犯人は逃走中。"
    },
    peekWindow: {
        story: "ヘヤ ノ ナカ は アラサレテ イル。<br>ショウケース ガ ワラレテ イル ノガ ミエタ。",
        points: 10,
        diary: "👁️ 現場確認: 屋内のショーケースが破壊されている。"
    },
    talkToCat: {
        story: "ネコ「ニャー（アッチ ニ イッタ ヨ）」<br>ネコ ガ ミナト ノ ホウ を ムイテイル キガシタ。",
        points: 5,
        diary: "🐈 猫の証言: 港の方角へ向かった可能性。"
    },
    stormWarehouse: {
        story: "「カンネン シロ！」<br>オトコ ハ オドロイテ コシ を ヌカシタ。<br>テ に ハ ホウセキ ガ ニギラレテ イル。",
        points: 50,
        diary: "💥 犯人確保: 倉庫にて宝石を持った男と遭遇。"
    }
};

// 【重要】ゲーム開始関数。ここがユーザーのクリックで発火する
async function startWalk() {
    // 1. オーディオコンテキストを再開/初期化（これで音がなるようになる）
    await AudioController.resumeContext();
    
    // 2. スタート音を鳴らす
    AudioController.playSe('start');

    // 3. ゲームリセット処理
    gameState.currentLocation = 0;
    gameState.heartPoints = 0;
    gameState.diaryEntries = [];
    gameState.metCharacters = {};
    gameState.treasures = {};
    gameState.totalTreasures = 0;

    document.getElementById('heart-points').textContent = '0';
    updateTreasureCount();
    updateProgress();
    
    // 4. フェードインして最初のシーンへ
    const screen = document.querySelector('.main-display');
    screen.style.opacity = 0;
    setTimeout(() => {
        screen.style.opacity = 1;
        showLocation();
    }, 500);
}

function showLocation() {
    const location = days[0].locations[gameState.currentLocation];
    
    // 画面更新
    document.getElementById('location-icon').textContent = location.icon;
    document.getElementById('location-name').textContent = location.name;
    document.getElementById('story-text').innerHTML = location.story;

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    location.choices.forEach(choice => {
        // 取得済みアイテムの選択肢は隠す
        if (choice.action === 'searchTreasure' && gameState.treasures[choice.treasure]) {
            return;
        }

        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        btn.onclick = () => {
            AudioController.playSe('select'); // 決定音
            handleChoice(choice.action, choice.treasure);
        };
        choicesDiv.appendChild(btn);
    });
}

function handleChoice(action, param) {
    if (action === 'next') {
        gameState.currentLocation++;
        AudioController.playSe('move');
        updateProgress();
        showLocation();
    } else if (action === 'showDiary') {
        showDiary();
    } else if (action === 'searchTreasure') {
        findTreasure(param);
    } else if (events[action]) {
        showEvent(action);
    }
}

function findTreasure(treasureId) {
    const treasure = treasureData[treasureId];
    if (!gameState.treasures[treasureId]) {
        gameState.treasures[treasureId] = treasure;
        gameState.totalTreasures++;
        gameState.heartPoints += 20;
        gameState.diaryEntries.push(`🔎 GET: ${treasure.name}`);
        
        // 演出
        AudioController.playSe('item'); // アイテムGET音
        showTreasurePopup(treasure);
        updateStats();

        // 次へ進むボタンを表示
        setTimeout(() => {
            // アイテムを見つけたらその場から立ち去る流れ
            gameState.currentLocation++;
            if (gameState.currentLocation < days[0].locations.length) {
                updateProgress();
                showLocation();
            }
        }, 2000);
    }
}

function showEvent(eventName) {
    const event = events[eventName];
    gameState.heartPoints += event.points;
    gameState.diaryEntries.push(event.diary);
    
    updateStats();
    
    // ストーリーテキスト更新
    document.getElementById('story-text').innerHTML = event.story;
    
    // ボタン更新（次へ）
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = "ツギ ヘ";
    btn.onclick = () => {
        AudioController.playSe('move');
        gameState.currentLocation++;
        updateProgress();
        showLocation();
    };
    choicesDiv.appendChild(btn);
}

function showTreasurePopup(treasure) {
    const popup = document.getElementById('treasure-popup');
    const icon = document.getElementById('treasure-icon');
    const text = document.getElementById('treasure-text');

    icon.textContent = treasure.icon;
    text.textContent = `GET! ${treasure.name}`;

    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

function updateStats() {
    document.getElementById('heart-points').textContent = gameState.heartPoints;
    updateTreasureCount();
}

function updateTreasureCount() {
    document.getElementById('treasure-count').textContent = gameState.totalTreasures;
}

function updateProgress() {
    const maxLoc = days[0].locations.length;
    const percent = ((gameState.currentLocation + 1) / maxLoc) * 100;
    document.getElementById('progress-fill').style.width = percent + '%';
}

function showDiary() {
    document.querySelector('.game-container').classList.add('menu-mode');
    document.querySelector('.main-display').style.display = 'none';
    document.getElementById('choices').style.display = 'none';
    document.getElementById('diary-screen').style.display = 'block';

    const content = document.getElementById('diary-content');
    content.innerHTML = '';
    
    gameState.diaryEntries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'diary-entry';
        div.innerHTML = entry;
        content.appendChild(div);
    });
}

function restartGame() {
    location.reload();
}

// 画面遷移ヘルパー
function showTreasureCollection() {
    AudioController.playSe('select');
    document.getElementById('diary-screen').style.display = 'none';
    document.getElementById('treasure-collection').style.display = 'block';
    
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';
    
    Object.keys(treasureData).forEach(key => {
        const data = treasureData[key];
        const isFound = gameState.treasures[key];
        
        const div = document.createElement('div');
        div.className = `treasure-item ${isFound ? '' : 'undiscovered'}`;
        div.innerHTML = `
            <div style="font-size:24px">${isFound ? data.icon : '？'}</div>
            <div>${isFound ? data.name : '----'}</div>
        `;
        grid.appendChild(div);
    });
}

function backToDiary() {
    AudioController.playSe('select'); 
    document.getElementById('treasure-collection').style.display = 'none';
    document.getElementById('diary-screen').style.display = 'block';
}

// 初期化待ち
window.addEventListener('load', () => {
    // 最初の画面状態を設定
    document.getElementById('story-text').innerHTML = "GAME START ボタン ヲ<br>オシテ ソウサ カイシ";
});
