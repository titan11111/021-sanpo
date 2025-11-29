/* =========================================
   8-Bit Audio Controller (Web Audio API)
   ========================================= */
   const AudioController = {
    ctx: null,
    bgmElement: null,
    isMuted: false, 
    initialized: false,

    init() {
        if (this.initialized) return;

        // iOS対応: webkitAudioContext
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.bgmElement = document.getElementById('bgm-audio');
        
        const btn = document.getElementById('bgm-toggle');
        // タッチデバイス対応
        const clickEvent = 'ontouchend' in document ? 'touchend' : 'click';
        btn.addEventListener(clickEvent, (e) => {
            e.preventDefault(); // ゴーストクリック防止
            this.toggleSound();
        });

        this.initialized = true;
    },

    async resumeContext() {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
        if (!this.isMuted && this.bgmElement && this.bgmElement.paused) {
            this.bgmElement.volume = 0.3;
            this.bgmElement.play().catch(e => console.log("BGM Play prevented:", e));
            this.updateBtnState(true);
        }
    },

    toggleSound() {
        if (!this.ctx) this.init();
        if (this.isMuted) {
            this.isMuted = false;
            this.resumeContext();
        } else {
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

    playSe(type) {
        if (!this.ctx || this.isMuted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        const now = this.ctx.currentTime;

        if (type === 'select') {
            // ピッ（決定）
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);

        } else if (type === 'move') {
            // カッ（移動）
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);

        } else if (type === 'item') {
            // ジャララーン（発見）
            osc.type = 'square';
            osc.frequency.setValueAtTime(523.25, now); 
            osc.frequency.setValueAtTime(659.25, now + 0.1); 
            osc.frequency.setValueAtTime(783.99, now + 0.2); 
            osc.frequency.setValueAtTime(1046.50, now + 0.3); 
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);

        } else if (type === 'meow') {
            // ★追加: ニャー（猫）
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.linearRampToValueAtTime(1200, now + 0.1); 
            osc.frequency.linearRampToValueAtTime(800, now + 0.3); 
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);

        } else if (type === 'charm') {
             // ★追加: キラリーン（お色気/魅力成功）
             osc.type = 'sine';
             osc.frequency.setValueAtTime(1000, now);
             osc.frequency.exponentialRampToValueAtTime(2000, now + 0.5);
             gainNode.gain.setValueAtTime(0, now);
             gainNode.gain.linearRampToValueAtTime(0.2, now + 0.2);
             gainNode.gain.linearRampToValueAtTime(0, now + 0.8);
             osc.start(now);
             osc.stop(now + 0.8);

        } else if (type === 'gameover') {
            // デデデーン...
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(30, now + 1.2); 
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 1.2);
            osc.start(now);
            osc.stop(now + 1.2);

        } else if (type === 'start') {
             // ブォーン
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
   Game Data (Items & Scenes)
   ========================================= */
let gameState = {
    currentSceneId: "start",
    heartPoints: 0, 
    diaryEntries: [],
    metCharacters: {},  
    treasures: {},      
    totalTreasures: 0   
};

// アイテムデータ
const treasureData = {
    "cat_snack": { 
        name: "マタタビ スナック", 
        icon: "🐟", 
        description: "ネコ ガ ダイスキ ナ オヤツ。イイコト ガ アルカモ？", 
        rarity: "common" 
    },
    "wire": { 
        name: "サビタ ハリガネ", 
        icon: "➰", 
        description: "ナニカ ノ カギ ヲ アケル ノニ ツカエソウ ダ。", 
        rarity: "common" 
    },
    "memo": { 
        name: "アンゴウ メモ", 
        icon: "📝", 
        description: "『1192』 ト カイテアル。ツクエ ノ バンゴウ カ？", 
        rarity: "common" 
    },
    "secretLetter": { 
        name: "ハンニン ノ テガミ", 
        icon: "✉️", 
        description: "『コンヤ ミナト デ ト リ ヒ キ ダ』 ト カイテアル。", 
        rarity: "epic" 
    },
    "lucky_coin": {
        name: "ラッキー コイン",
        icon: "🪙",
        description: "ネコ ガ クレタ ピカピカ ノ コイン。",
        rarity: "rare"
    },
    "strangeGem": { 
        name: "アオイ カケラ", 
        icon: "💎", 
        description: "トテモ キレイナ アオイ イシ ノ カケラ。", 
        rarity: "rare" 
    },
    "handkerchief": { 
        name: "アカイ ハンカチ", 
        icon: "🟥", 
        description: "イニシャル 『R』 ガ シシュウ サレテイル。", 
        rarity: "common" 
    }
};

/* =========================================
   シナリオデータ (大幅増量: 工数1.5倍)
   - 動物要素: 迷い猫
   - お色気(マイルド): 美人のお姉さん、警官へのウィンク
   ========================================= */
const scenes = {
    // -------------------------------------------------
    // シーン1: プロローグ & 公園（動物分岐追加）
    // -------------------------------------------------
    "start": {
        name: "ヘイワ ナ コウエン",
        icon: "🌳",
        story: "イツモ ドオリ ノ サンポ ミチ。<br>「ニャ～ン...」<br>ドコカ カラ ナキゴエ ガ キコエル。",
        choices: [
            { text: "コウエン ノ オク ヲ ミル", action: "move", target: "park_bush" },
            { text: "サキ ニ ススム", action: "move", target: "mansion_front" }
        ]
    },
    "park_bush": {
        name: "シゲミ ノ ナカ",
        icon: "🐈",
        story: "シゲミ ノ ナカ ニ マヨイ ネコ ガ イタ。<br>オナカ ヲ スカセテ イル ヨウダ。<br>ナニカ タベモノ ガ アレバ...",
        choices: [
            // おやつを持っている場合
            { text: "スナック ヲ アゲル", action: "itemCheck", item: "cat_snack", targetTrue: "cat_happy", targetFalse: "cat_ignore" },
            { text: "ナデテ ミル", action: "move", target: "cat_angry" },
            { text: "モト ノ ミチ ヘ", action: "move", target: "start" }
        ]
    },
    "cat_ignore": {
        name: "シゲミ ノ ナカ",
        icon: "🐈",
        story: "ネコ ハ アナタ ヲ ジッと ミテイル。<br>タベモノ ヲ モッテナイ ト ワカル ト、<br>プイッ ト ムコウ ヲ ムイテ シマッタ。",
        choices: [
            { text: "コンビニ ヘ イク", action: "move", target: "convenience_store" },
            { text: "サキ ニ ススム", action: "move", target: "mansion_front" }
        ]
    },
    "cat_angry": {
        name: "シゲミ ノ ナカ",
        icon: "💢",
        story: "「シャーッ！！」<br>イキナリ テ ヲ ダシタラ ヒッカカレタ！<br>IQ（ライフ）ガ ヘッテ シマッタ...",
        choices: [
            { text: "イタイ...", action: "damage", amount: 10, target: "start" }
        ]
    },
    "convenience_store": {
        name: "コンビニ",
        icon: "🏪",
        story: "コンビニ ニ ヨッタ。<br>ネコ ガ スキソウ ナ 『マタタビ スナック』 ガ ウッテイル！",
        choices: [
            { text: "スナック ヲ カウ", action: "searchTreasure", treasure: "cat_snack", target: "park_bush" }
        ]
    },
    "cat_happy": {
        name: "シゲミ ノ ナカ",
        icon: "😻",
        story: "ネコ「ニャウ〜ン♪」<br>ネコ ハ オイシソウ ニ オヤツ ヲ タベタ。<br>オレイ ニ 『キラキラ ヒカル モノ』 ヲ クレタ！",
        choices: [
            { text: "ヒロウ", action: "searchTreasure", treasure: "lucky_coin", target: "park_done" }
        ]
    },
    "park_done": {
        name: "コウエン",
        icon: "🌳",
        story: "ネコ ハ マンゾク シテ サッテ イッタ。<br>サア、サンポ ヲ ツヅケヨウ。",
        choices: [
            { text: "サキ ニ ススム", action: "move", target: "mansion_front" }
        ]
    },

    // -------------------------------------------------
    // シーン2: 屋敷前（お色気コメディ追加）
    // -------------------------------------------------
    "mansion_front": {
        name: "ゴウテイ ノ マエ",
        icon: "🏰",
        story: "パトカー ガ トマッテイル。<br>「キセイセン カラ ハイラナイデ！」<br>イカツ イ ケイカン ガ ミハッテ イル。",
        choices: [
            { text: "ジジョウ ヲ キク", action: "move", target: "police_talk" },
            { text: "ウラグチ ニ マワル", action: "move", target: "mansion_back" }
        ]
    },
    "police_talk": {
        name: "ケイカン",
        icon: "👮",
        story: "ケイカン「ココハ タチイリ キンシ ダ！」<br>トテモ キビシ ソウダ。<br>ナン トカ シテ ジョウホウ ヲ キキダセ ナイカ...",
        choices: [
            { text: "マジメ ニ キク", action: "move", target: "mansion_crowd" },
            { text: "イロジカケ スル", action: "move", target: "police_charm_fail" } // お色気選択肢
        ]
    },
    "police_charm_fail": {
        name: "ケイカン",
        icon: "💦",
        story: "アナタ ハ チョット セクシー ニ ウインク シテミタ。<br>ケイカン「...ナニ ヲ シテイルンダ キミ ハ」<br>ドンビキ サレテ シマッタ！！ ハズカシイ！",
        choices: [
            { text: "ニゲダス", action: "move", target: "mansion_back" }
        ]
    },
    "mansion_crowd": {
        name: "ヤジウマ",
        icon: "🗣️",
        story: "ヤジウマ「ゴウトウ ダッテヨ！<br>コノ ヤカタ ノ 『カホウ』 ガ ヌスマレタ ラシイ ゼ」<br>ハンニン ハ マダ チカク ニ イル カモ...。",
        choices: [
            { text: "ウラグチ ニ マワル", action: "move", target: "mansion_back" }
        ]
    },

    // -------------------------------------------------
    // シーン3: 裏庭 & 物置（ほぼ維持）
    // -------------------------------------------------
    "mansion_back": {
        name: "ヤカタ ノ ウラニワ",
        icon: "🌿",
        story: "ウラニワ ニ ハ イヌゴヤ ガ アル。<br>バンケン ハ... ネル ヲ シテイル ヨウダ。<br>マド ニハ カギ ガ カカッテ イル。",
        choices: [
            { text: "ハリガネ ヲ ツカウ", action: "itemCheck", item: "wire", targetTrue: "mansion_inside_entry", targetFalse: "mansion_back_locked" },
            { text: "モノオキ ヲ ミル", action: "move", target: "garden_shed" },
            { text: "バンケン ヲ オコス", action: "move", target: "bad_end_dog" } // 動物バッドエンド
        ]
    },
    "bad_end_dog": {
        name: "ウラニワ",
        icon: "🐕",
        story: "ワンワン！！<br>オドロイタ イヌ ニ オイカケマワ サレタ！<br>サンポ ドコロ デハ ナイ。",
        choices: [
            { text: "タイトル ヘ モドル", action: "restart" }
        ]
    },
    "mansion_back_locked": {
        name: "ヤカタ ノ ウラニワ",
        icon: "🔒",
        story: "カギ ガ カカッテ イテ アカナイ。<br>ホソナガイ カネノボウ デモ アレバ...。<br>モノオキ デモ サガシテ ミルカ。",
        choices: [
            { text: "モノオキ ヲ ミル", action: "move", target: "garden_shed" }
        ]
    },
    "garden_shed": {
        name: "モノオキ",
        icon: "🏚️",
        story: "ホコリ マミレ ノ モノオキ ダ。<br>ガラクタ ノ ナカ ニ ナニカ ツカエソウ ナ モノ ハ...。",
        choices: [
            { text: "ガラクタ ヲ アサル", action: "searchTreasure", treasure: "wire", target: "mansion_back_retry" }
        ]
    },
    "mansion_back_retry": {
        name: "ヤカタ ノ ウラニワ",
        icon: "🌿",
        story: "ハリガネ ヲ テ ニ イレタ。<br>コレ デ マド ノ カギ ヲ アケラレル カモ シレナイ。",
        choices: [
            { text: "ハリガネ ヲ ツカウ", action: "move", target: "mansion_inside_entry" }
        ]
    },
    "mansion_inside_entry": {
        name: "ヤカタ ノ ウラニワ",
        icon: "🔓",
        story: "カチャリ...。<br>カギ ガ アイタ！<br>コッソリ ナカ ニ ハイロウ。",
        choices: [
            { text: "ナカ ニ ハイル", action: "move", target: "mansion_inside_hall" }
        ]
    },

    // -------------------------------------------------
    // シーン4: 家の中（探索）
    // -------------------------------------------------
    "mansion_inside_hall": {
        name: "ヤカタ ノ ナカ",
        icon: "🏠",
        story: "シツナイ ハ クライ...。<br>ショサイ ノ ツクエ ニハ 『4ケタ ノ ダイヤル』。<br>アンゴウ ガ ワカラナイ。",
        choices: [
            { text: "アンゴウ ヲ ニュウリョク", action: "itemCheck", item: "memo", targetTrue: "mansion_inside_desk", targetFalse: "mansion_inside_locked" },
            { text: "ショクドウ ヲ シラベル", action: "move", target: "mansion_dining" },
            { text: "オク ノ ヘヤ ヲ ミル", action: "move", target: "bad_end_encounter" }
        ]
    },
    "mansion_inside_locked": {
        name: "ヤカタ ノ ナカ",
        icon: "🔒",
        story: "ダメダ...。テキトウ ニ マワシテモ アカナイ。<br>ドコカ ニ ヒント ガ アル ハズダ。",
        choices: [
            { text: "ショクドウ ヲ シラベル", action: "move", target: "mansion_dining" }
        ]
    },
    "mansion_dining": {
        name: "ショクドウ",
        icon: "🍽️",
        story: "テーブル ノ ウエ ニ メモ ガ オイテアル。<br>『ショサイ ノ バンゴウ : 1192』<br>イイクニ ツクロウ... コレダ！",
        choices: [
            { text: "メモ ヲ トル", action: "searchTreasure", treasure: "memo", target: "mansion_inside_retry" }
        ]
    },
    "mansion_inside_retry": {
        name: "ヤカタ ノ ナカ",
        icon: "🏠",
        story: "アンゴウ ハ ワカッタ。<br>コレデ ツクエ ヲ アケラレル。",
        choices: [
            { text: "アンゴウ ヲ ニュウリョク", action: "move", target: "mansion_inside_desk" }
        ]
    },
    "mansion_inside_desk": {
        name: "ショサイ",
        icon: "📂",
        story: "カチャリ。<br>ヒキダシ ノ ナカ ニ ハンニン ノ テガミ ガ アッタ！",
        choices: [
            { text: "テガミ ヲ ヨム", action: "searchTreasure", treasure: "secretLetter", target: "mansion_inside_done" }
        ]
    },
    "mansion_inside_done": {
        name: "ヤカタ ノ ナカ",
        icon: "✉️",
        story: "テガミ「コンヤ ミナト ノ ソウコ デ ブツ ヲ ワタス」<br>ハンニン ハ ミナト ニ イル！",
        choices: [
            { text: "エキマエ ヘ イソグ", action: "move", target: "station" }
        ]
    },
    "bad_end_encounter": {
        name: "ロウカ",
        icon: "😱",
        story: "「ダレダ！ ソコニ イルノハ！」<br>ソウサチュウ ノ ケイジ ニ ミツカッテ シマッタ。",
        choices: [
            { text: "タイトル ヘ モドル", action: "restart" }
        ]
    },

    // -------------------------------------------------
    // シーン5: 駅前（美人のお姉さんイベント追加）
    // -------------------------------------------------
    "station": {
        name: "エキ マエ",
        icon: "🚉",
        story: "エキ マエ ハ ヒト デ イッパイ ダ。<br>ベンチ ニ キレイ ナ オネエサン ガ スワッテ イル。<br>ナニカ コマッテ イル ヨウダ。",
        choices: [
            { text: "ハナシ カケル", action: "move", target: "station_lady" },
            { text: "ロジアウラ ヲ トオル", action: "move", target: "alley" }
        ]
    },
    "station_lady": {
        name: "ナゾ ノ ビジョ",
        icon: "👩",
        story: "オネエサン「アラ、カワイイ タンテイ サン ね」<br>トテモ イイ ニオイ ガ スル...。<br>カノジョ ハ ハンカチ ヲ オトシタ。",
        choices: [
            { text: "カッコツケテ ヒロウ", action: "charmCheck", target: "station_lady_charm" }, // お色気判定
            { text: "フツウ ニ ヒロウ", action: "searchTreasure", treasure: "handkerchief", target: "station_lady_normal" }
        ]
    },
    "station_lady_charm": {
        name: "ナゾ ノ ビジョ",
        icon: "💖",
        story: "アナタ ハ キザ ニ ハンカチ ヲ ヒロイ アゲタ。<br>オネエサン「フフッ、ステキ」<br>カノジョ ハ ホホエンデ サッテ イッタ。<br>IQ ガ アガッタ キガスル！",
        choices: [
            // お姉さんからハンカチを貰ったことになる
            { text: "ロジアウラ ヘ", action: "searchTreasure", treasure: "handkerchief", target: "alley" } 
        ]
    },
    "station_lady_normal": {
        name: "エキ マエ",
        icon: "🚉",
        story: "オネエサン「アリガトウ。コレハ アゲルワ」<br>ハンカチ ヲ モラッタ。<br>イニシャル 『R』... ダレダロウ？",
        choices: [
            { text: "ロジアウラ ヘ", action: "move", target: "alley" }
        ]
    },

    // -------------------------------------------------
    // シーン6: 路地裏
    // -------------------------------------------------
    "alley": {
        name: "ロジアウラ",
        icon: "🗑️",
        story: "ゴミバコ ガ タオサレテ イル。<br>ナニカ ステテ イッタ カモ シレナイ。",
        choices: [
            { text: "ゴミバコ ヲ シラベル", action: "searchTreasure", treasure: "strangeGem", target: "alley_checked" },
            { text: "ゴミバコ ヲ ケトバス", action: "move", target: "bad_end_ambush" },
            { text: "サキ ニ ススム", action: "move", target: "warehouse" }
        ]
    },
    "bad_end_ambush": {
        name: "ロジアウラ",
        icon: "💥",
        story: "ドカッ！！<br>オト ニ オドロイタ ノライヌ ノ ムレ ニ オソワレタ！<br>...ビョウイン オクリ ニ ナッタ。",
        choices: [
            { text: "タイトル ヘ モドル", action: "restart" }
        ]
    },
    "alley_checked": {
        name: "ロジアウラ",
        icon: "💎",
        story: "コレハ... ウワサ ノ 『アオイ ホウセキ』 ノ カケラ ダ！<br>コレデ ショウコ ハ ソロッタ。",
        choices: [
            { text: "ミナト ヘ ムカウ", action: "move", target: "warehouse" }
        ]
    },

    // -------------------------------------------------
    // シーン7: クライマックス
    // -------------------------------------------------
    "warehouse": {
        name: "ミナト ノ ソウコ",
        icon: "⚓",
        story: "アヤシイ オトコ ガ イタ。<br>オトコ「トリヒキ アイテ カ？ レイ ノ ブツ ハ モッテ キタノカ？」<br>カンチガイ シテイル ヨウダ。",
        choices: [
            { text: "ショウコ ヲ ツキツケル", action: "move", target: "final_confrontation" }
        ]
    },
    "final_confrontation": {
        name: "ケッチャク",
        icon: "🕵️",
        story: "オトコ「サッサト ソレ ヲ ヨコセ！」<br>コイツ ガ ハンニン ダ。<br>ケッテイテキ ナ ショウコ ヲ ミセツケテ ヤレ！",
        choices: [
            { 
                text: "『アオイ カケラ』ヲ ミセル", 
                action: "judge", 
                targetTrue: "ending_true", 
                targetFalse: "ending_bad_lie" 
            },
            {
                text: "『ラッキーコイン』ヲ ミセル", 
                action: "move", 
                target: "ending_peace" // 新エンディング
            },
            {
                text: "『ハンカチ』ヲ ミセル", 
                action: "move", 
                target: "ending_bad_angry"
            }
        ]
    },

    // -------------------------------------------------
    // エンディング
    // -------------------------------------------------
    "ending_bad_angry": {
        name: "ソウサ シッパイ",
        icon: "💢",
        story: "オトコ「フザケルナ！ ソンナ モノ イラン！」<br>ハンニン ハ ギャクギレ シテ オソイカカッテ キタ！<br>ショウコ フジュウブン デ カエリウチ ニ アッタ...。",
        choices: [
            { text: "タイトル ヘ モドル", action: "restart" }
        ]
    },
    "ending_bad_lie": {
        name: "ソウサ シッパイ",
        icon: "😓",
        story: "ポケット ヲ サガシタガ カケラ ヲ モッテイナイ！<br>オトコ「ナンダ ヒヤカシ カ！」<br>ハンニン ニ ニゲラレテ シマッタ...。",
        choices: [
            { text: "タイトル ヘ モドル", action: "restart" }
        ]
    },
    "ending_peace": {
        name: "ジケン？ カイケツ",
        icon: "🕊️",
        story: "オトコ「ソ、ソレハ... ムカシ カッテイタ ネコ ノ コイン...」<br>オトコ ハ ヤサシイ カオ ニ ナッタ。<br>「モウ ヌスミ ハ ヤメルヨ...」<br>ナゼカ カイケツ シタ！<br><br>■ PEACEFUL END ■",
        choices: [
            { text: "タイトル ヘ モドル", action: "restart" }
        ]
    },
    "ending_true": {
        name: "ジケン カイケツ",
        icon: "🎉",
        story: "「ソ、ソレハ... オレ ガ オトシタ ホウセキ ノ カケラ...」<br>オトコ ハ ソノバ ニ クズレオチタ。<br>「カンネン スル... オレ ガ ヤッタ」<br><br>■ CONGRATULATIONS! ■",
        choices: [
            { text: "タイトル ヘ モドル", action: "restart" }
        ]
    }
};

/* =========================================
   Game Logic
   ========================================= */

async function startWalk() {
    // iOSはユーザー操作起点でないと音が鳴らないためここでResume
    await AudioController.resumeContext();
    AudioController.playSe('start');

    document.getElementById('game-container').classList.remove('game-over-mode');
    gameState.currentSceneId = "start";
    gameState.heartPoints = 100; // 初期値を設定
    gameState.diaryEntries = [];
    gameState.treasures = {};
    gameState.totalTreasures = 0;

    document.getElementById('heart-points').textContent = gameState.heartPoints;
    updateStats();
    
    const screen = document.querySelector('.main-display');
    screen.style.opacity = 0;
    setTimeout(() => {
        screen.style.opacity = 1;
        showScene(gameState.currentSceneId);
    }, 500);
}

function showScene(sceneId) {
    const scene = scenes[sceneId];
    if (!scene) {
        console.error("Scene not found:", sceneId);
        return;
    }
    
    gameState.currentSceneId = sceneId;

    const isGameOver = sceneId.includes("bad_end") || sceneId.includes("ending_bad");
    const isHappyEnd = sceneId === "ending_true" || sceneId === "ending_peace";

    // 画面更新
    document.getElementById('location-icon').textContent = scene.icon;
    document.getElementById('location-name').textContent = scene.name;

    if (isGameOver) {
        AudioController.playSe('gameover');
        document.getElementById('game-container').classList.add('game-over-mode');
        document.getElementById('story-text').innerHTML = 
            `<div class="game-over-text">GAME OVER</div>` + 
            scene.story;
    } else {
        if(isHappyEnd) AudioController.playSe('charm'); // ハッピーエンド音
        document.getElementById('game-container').classList.remove('game-over-mode');
        document.getElementById('story-text').innerHTML = scene.story;
    }
    
    // プログレスバー更新
    const progress = document.getElementById('progress-fill');
    // 簡易的な進捗表示
    if(sceneId === 'start') progress.style.width = '5%';
    else if(sceneId === 'mansion_front') progress.style.width = '20%';
    else if(sceneId === 'mansion_inside_hall') progress.style.width = '40%';
    else if(sceneId === 'station') progress.style.width = '60%';
    else if(sceneId === 'alley') progress.style.width = '80%';
    else if(sceneId === 'final_confrontation') progress.style.width = '95%';
    else if(isHappyEnd) progress.style.width = '100%';

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    scene.choices.forEach(choice => {
        // すでに取得済みのアイテム探索は表示しない
        if (choice.action === 'searchTreasure' && gameState.treasures[choice.treasure]) {
            return;
        }

        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        
        // タッチイベントの遅延解消のためonclickを使用
        btn.onclick = () => {
            handleChoice(choice);
        };
        choicesDiv.appendChild(btn);
    });
}

function handleChoice(choice) {
    if (choice.action === 'move') {
        AudioController.playSe('move');
        showScene(choice.target);
    } 
    else if (choice.action === 'searchTreasure') {
        AudioController.playSe('item'); // 共通アイテム音
        findTreasure(choice.treasure, choice.target);
    } 
    else if (choice.action === 'itemCheck') {
        AudioController.playSe('select');
        if (gameState.treasures[choice.item]) {
            showScene(choice.targetTrue);
        } else {
            showScene(choice.targetFalse);
        }
    }
    else if (choice.action === 'charmCheck') {
        // お色気成功演出
        AudioController.playSe('charm');
        // 少し遅らせてシーン遷移
        setTimeout(() => {
             showScene(choice.target);
        }, 800);
    }
    else if (choice.action === 'judge') {
        AudioController.playSe('select');
        if (gameState.treasures['strangeGem']) {
            showScene(choice.targetTrue); 
        } else {
            showScene(choice.targetFalse); 
        }
    }
    else if (choice.action === 'damage') {
        gameState.heartPoints -= choice.amount;
        AudioController.playSe('gameover'); // ダメージ音代用
        updateStats();
        showScene(choice.target);
    }
    else if (choice.action === 'restart') {
        restartGame();
    }
}

function findTreasure(treasureId, nextSceneId) {
    const treasure = treasureData[treasureId];
    
    if (!gameState.treasures[treasureId]) {
        gameState.treasures[treasureId] = treasure;
        gameState.totalTreasures++;
        gameState.heartPoints += 20;
        
        // 猫の鳴き声分岐
        if (treasureId === 'cat_snack' || treasureId === 'lucky_coin') {
            AudioController.playSe('meow');
        }

        showTreasurePopup(treasure);
        updateStats();

        setTimeout(() => {
            if (nextSceneId) showScene(nextSceneId);
        }, 2000);
    }
}

function showTreasurePopup(treasure) {
    const popup = document.getElementById('treasure-popup');
    document.getElementById('treasure-icon').textContent = treasure.icon;
    document.getElementById('treasure-text').textContent = `GET! ${treasure.name}`;

    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

function updateStats() {
    document.getElementById('heart-points').textContent = gameState.heartPoints;
    document.getElementById('treasure-count').textContent = gameState.totalTreasures;
}

function restartGame() {
    location.reload();
}

window.startWalk = startWalk;
window.restartGame = restartGame;

window.addEventListener('load', () => {
    AudioController.init();
    // スマホでの誤タップ防止のため、タッチイベントリスナーを追加
    document.body.addEventListener('touchstart', function() {}, {passive: true});
    
    document.getElementById('story-text').innerHTML = "GAME START ボタン ヲ<br>オシテ ソウサ カイシ";
});
