/* =========================================
   1. Audio Engine (Stabilized)
   ========================================= */
   const AudioEngine = {
    ctx: null,
    bgmElement: null,
    isMuted: false,
    isPlayingBgm: false,
    useProceduralBgm: false,
    bgmInterval: null,

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        this.bgmElement = document.getElementById('bgm-audio');
        
        if(this.bgmElement) {
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
        // モバイル向けダミー再生
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
            btn.textContent = "SOUND: OFF";
            btn.classList.remove('active');
        } else {
            btn.textContent = "SOUND: ON ♪";
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
                p.catch(e => {
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
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        const now = this.ctx.currentTime;
        
        osc.start(now); // start first to avoid error

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
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.stop(now + 0.1);
                break;
            case 'item':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1000, now);
                osc.frequency.linearRampToValueAtTime(2000, now + 0.4);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.4);
                osc.stop(now + 0.4);
                break;
            case 'damage':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.linearRampToValueAtTime(20, now + 0.3);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.stop(now + 0.3);
                break;
            case 'charm': // お色気音
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.6);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.6);
                osc.stop(now + 0.6);
                break;
        }
    }
};

/* =========================================
   2. Game Data (Items & Scenes)
   ========================================= */
const GameState = {
    scene: "title",
    hp: 0,
    items: {}, // 持っているアイテムID: true
    itemCount: 0,
    isTyping: false,
    textTimer: null
};

// アイテム定義
const Items = {
    "cat_snack": { 
        name: "マタタビ スナック", icon: "🐟", 
        desc: "ネコ ガ ダイスキ ナ オヤツ。イイコト ガ アルカモ？" 
    },
    "wire": { 
        name: "サビタ ハリガネ", icon: "➰", 
        desc: "ナニカ ノ カギ ヲ アケル ノニ ツカエソウ ダ。" 
    },
    "memo": { 
        name: "アンゴウ メモ", icon: "📝", 
        desc: "『1192』 ト カイテアル。ツクエ ノ バンゴウ カ？" 
    },
    "secretLetter": { 
        name: "ハンニン ノ テガミ", icon: "✉️", 
        desc: "『コンヤ ミナト デ ト リ ヒ キ ダ』 ト カイテアル。" 
    },
    "lucky_coin": {
        name: "ラッキー コイン", icon: "🪙",
        desc: "ネコ ガ クレタ ピカピカ ノ コイン。キセキ ヲ ヨブ。"
    },
    "strangeGem": { 
        name: "アオイ カケラ", icon: "💎", 
        desc: "トテモ キレイナ アオイ イシ ノ カケラ。" 
    },
    "handkerchief": { 
        name: "アカイ ハンカチ", icon: "🟥", 
        desc: "イニシャル 『R』 ガ シシュウ サレテイル。" 
    }
};

// シナリオ定義 (拡張版)
const Scenes = {
    "title": { name: "タイトル", icon: "🕵️", text: "", choices: [] },
    
    // --- Prologue & Park ---
    "start": {
        name: "ヘイワ ナ コウエン", icon: "🌳",
        text: "イツモ ドオリ ノ サンポ ミチ。\n「ニャ～ン...」\nドコカ カラ ナキゴエ ガ キコエル。",
        choices: [
            { text: "コウエン ノ オク ヲ ミル", act: "move", to: "park_bush" },
            { text: "サキ ニ ススム", act: "move", to: "mansion_front" }
        ]
    },
    "park_bush": {
        name: "シゲミ ノ ナカ", icon: "🐈",
        text: "シゲミ ノ ナカ ニ マヨイ ネコ ガ イタ。\nオナカ ヲ スカセテ イル ヨウダ。\nナニカ タベモノ ガ アレバ...",
        choices: [
            { text: "スナック ヲ アゲル", act: "check", item: "cat_snack", trueTo: "cat_happy", falseTo: "cat_ignore" },
            { text: "ナデテ ミル", act: "move", to: "cat_angry" },
            { text: "モト ノ ミチ ヘ", act: "move", to: "start" }
        ]
    },
    "cat_ignore": {
        name: "シゲミ ノ ナカ", icon: "🐈",
        text: "ネコ ハ アナタ ヲ ジッと ミテイル。\nタベモノ ヲ モッテナイ ト ワカル ト、\nプイッ ト ムコウ ヲ ムイテ シマッタ。",
        choices: [
            { text: "コンビニ ヘ イク", act: "move", to: "convenience_store" },
            { text: "サキ ニ ススム", act: "move", to: "mansion_front" }
        ]
    },
    "cat_angry": {
        name: "シゲミ ノ ナカ", icon: "💢",
        text: "「シャーッ！！」\nイキナリ テ ヲ ダシタラ ヒッカカレタ！\nIQ（ライフ）ガ ヘッテ シマッタ...",
        choices: [{ text: "イタイ...", act: "damage", val: 10, to: "start" }]
    },
    "convenience_store": {
        name: "コンビニ", icon: "🏪",
        text: "コンビニ ニ ヨッタ。\nネコ ガ スキソウ ナ 『マタタビ スナック』 ガ ウッテイル！",
        choices: [{ text: "スナック ヲ カウ", act: "get", item: "cat_snack", to: "park_bush" }]
    },
    "cat_happy": {
        name: "シゲミ ノ ナカ", icon: "😻",
        text: "ネコ「ニャウ〜ン♪」\nネコ ハ オイシソウ ニ オヤツ ヲ タベタ。\nオレイ ニ 『キラキラ ヒカル モノ』 ヲ クレタ！",
        choices: [{ text: "ヒロウ", act: "get", item: "lucky_coin", to: "park_done" }]
    },
    "park_done": {
        name: "コウエン", icon: "🌳",
        text: "ネコ ハ マンゾク シテ サッテ イッタ。\nサア、サンポ ヲ ツヅケヨウ。",
        choices: [{ text: "サキ ニ ススム", act: "move", to: "mansion_front" }]
    },

    // --- Mansion Front ---
    "mansion_front": {
        name: "ゴウテイ ノ マエ", icon: "🏰",
        text: "パトカー ガ トマッテイル。\n「キセイセン カラ ハイラナイデ！」\nイカツ イ ケイカン ガ ミハッテ イル。",
        choices: [
            { text: "ジジョウ ヲ キク", act: "move", to: "police_talk" },
            { text: "ウラグチ ニ マワル", act: "move", to: "mansion_back" }
        ]
    },
    "police_talk": {
        name: "ケイカン", icon: "👮",
        text: "ケイカン「ココハ タチイリ キンシ ダ！」\nトテモ キビシ ソウダ。\nナン トカ シテ ジョウホウ ヲ キキダセ ナイカ...",
        choices: [
            { text: "マジメ ニ キク", act: "move", to: "mansion_crowd" },
            { text: "イロジカケ スル", act: "move", to: "police_charm_fail" }
        ]
    },
    "police_charm_fail": {
        name: "ケイカン", icon: "💦",
        text: "アナタ ハ チョット セクシー ニ ウインク シテミタ。\nケイカン「...ナニ ヲ シテイルンダ キミ ハ」\nドンビキ サレテ シマッタ！！ ハズカシイ！",
        choices: [{ text: "ニゲダス", act: "move", to: "mansion_back" }]
    },
    "mansion_crowd": {
        name: "ヤジウマ", icon: "🗣️",
        text: "ヤジウマ「ゴウトウ ダッテヨ！\nコノ ヤカタ ノ 『カホウ』 ガ ヌスマレタ ラシイ ゼ」\nハンニン ハ マダ チカク ニ イル カモ...。",
        choices: [{ text: "ウラグチ ニ マワル", act: "move", to: "mansion_back" }]
    },

    // --- Mansion Back & Inside ---
    "mansion_back": {
        name: "ウラニワ", icon: "🌿",
        text: "ウラニワ ニ ハ イヌゴヤ ガ アル。\nバンケン ハ... ネル ヲ シテイル ヨウダ。\nマド ニハ カギ ガ カカッテ イル。",
        choices: [
            { text: "ハリガネ ヲ ツカウ", act: "check", item: "wire", trueTo: "mansion_inside_entry", falseTo: "mansion_back_locked" },
            { text: "モノオキ ヲ ミル", act: "move", to: "garden_shed" },
            { text: "バンケン ヲ オコス", act: "move", to: "bad_end_dog" }
        ]
    },
    "bad_end_dog": {
        name: "ウラニワ", icon: "🐕",
        text: "ワンワン！！\nオドロイタ イヌ ニ オイカケマワ サレタ！\nサンポ ドコロ デハ ナイ。",
        choices: [{ text: "タイトル ヘ モドル", act: "reset" }]
    },
    "mansion_back_locked": {
        name: "ウラニワ", icon: "🔒",
        text: "カギ ガ カカッテ イテ アカナイ。\nホソナガイ カネノボウ デモ アレバ...。\nモノオキ デモ サガシテ ミルカ。",
        choices: [{ text: "モノオキ ヲ ミル", act: "move", to: "garden_shed" }]
    },
    "garden_shed": {
        name: "モノオキ", icon: "🏚️",
        text: "ホコリ マミレ ノ モノオキ ダ。\nガラクタ ノ ナカ ニ ナニカ ツカエソウ ナ モノ ハ...。",
        choices: [{ text: "ガラクタ ヲ アサル", act: "get", item: "wire", to: "mansion_back_retry" }]
    },
    "mansion_back_retry": {
        name: "ウラニワ", icon: "🌿",
        text: "ハリガネ ヲ テ ニ イレタ。\nコレ デ マド ノ カギ ヲ アケラレル カモ シレナイ。",
        choices: [{ text: "ハリガネ ヲ ツカウ", act: "move", to: "mansion_inside_entry" }]
    },
    "mansion_inside_entry": {
        name: "ウラニワ", icon: "🔓",
        text: "カチャリ...。\nカギ ガ アイタ！\nコッソリ ナカ ニ ハイロウ。",
        choices: [{ text: "ナカ ニ ハイル", act: "move", to: "mansion_inside_hall" }]
    },
    "mansion_inside_hall": {
        name: "ヤカタ ノ ナカ", icon: "🏠",
        text: "シツナイ ハ クライ...。\nショサイ ノ ツクエ ニハ 『4ケタ ノ ダイヤル』。\nアンゴウ ガ ワカラナイ。",
        choices: [
            { text: "アンゴウ ヲ ニュウリョク", act: "check", item: "memo", trueTo: "mansion_inside_desk", falseTo: "mansion_inside_locked" },
            { text: "ショクドウ ヲ シラベル", act: "move", to: "mansion_dining" },
            { text: "オク ノ ヘヤ ヲ ミル", act: "move", to: "bad_end_encounter" }
        ]
    },
    "mansion_inside_locked": {
        name: "ヤカタ ノ ナカ", icon: "🔒",
        text: "ダメダ...。テキトウ ニ マワシテモ アカナイ。\nドコカ ニ ヒント ガ アル ハズダ。",
        choices: [{ text: "ショクドウ ヲ シラベル", act: "move", to: "mansion_dining" }]
    },
    "mansion_dining": {
        name: "ショクドウ", icon: "🍽️",
        text: "テーブル ノ ウエ ニ メモ ガ オイテアル。\n『ショサイ ノ バンゴウ : 1192』\nイイクニ ツクロウ... コレダ！",
        choices: [{ text: "メモ ヲ トル", act: "get", item: "memo", to: "mansion_inside_retry" }]
    },
    "mansion_inside_retry": {
        name: "ヤカタ ノ ナカ", icon: "🏠",
        text: "アンゴウ ハ ワカッタ。\nコレデ ツクエ ヲ アケラレル。",
        choices: [{ text: "アンゴウ ヲ ニュウリョク", act: "move", to: "mansion_inside_desk" }]
    },
    "mansion_inside_desk": {
        name: "ショサイ", icon: "📂",
        text: "カチャリ。\nヒキダシ ノ ナカ ニ ハンニン ノ テガミ ガ アッタ！",
        choices: [{ text: "テガミ ヲ ヨム", act: "get", item: "secretLetter", to: "mansion_inside_done" }]
    },
    "mansion_inside_done": {
        name: "ヤカタ ノ ナカ", icon: "✉️",
        text: "テガミ「コンヤ ミナト ノ ソウコ デ ブツ ヲ ワタス」\nハンニン ハ ミナト ニ イル！\nショウテンガイ ヲ ヌケテ、エキ ヘ イソゴウ。",
        choices: [{ text: "ヤカタ ヲ デル", act: "move", to: "town_crossroad" }]
    },
    "bad_end_encounter": {
        name: "ロウカ", icon: "😱",
        text: "「ダレダ！ ソコニ イルノハ！」\nソウサチュウ ノ ケイジ ニ ミツカッテ シマッタ。",
        choices: [{ text: "タイトル ヘ モドル", act: "reset" }]
    },

    // --- Downtown (Bar & Fortune) ---
    "town_crossroad": {
        name: "ヨル ノ マチ", icon: "🌃",
        text: "ハンカガイ ニ デタ。\nミナト ヘ イク マエ ニ、スコシ ジョウホウ シュウシュウ ヲ シテオコウ。",
        choices: [
            { text: "Bar『クロネコ』ヘ", act: "move", to: "bar_entry" },
            { text: "ロジウラ ノ ウラナイ", act: "move", to: "fortune_teller" },
            { text: "エキ ヘ イソグ", act: "move", to: "station" }
        ]
    },
    "bar_entry": {
        name: "Bar クロネコ", icon: "🍸",
        text: "カランコロン...。\nオトナ ノ フンイキ ノ Bar ダ。\nマスター ガ グラス ヲ ミガ いている。",
        choices: [
            { text: "マスター ニ キク", act: "move", to: "bar_master" },
            { text: "トナリ ノ キャク ニ...", act: "move", to: "bar_flirt" }
        ]
    },
    "bar_master": {
        name: "Bar クロネコ", icon: "🤵",
        text: "「アオイ カケラ...？\nソウイエバ ミナト ノ ホウ デ、\nキミョウ ナ アオイ ヒカリ ヲ ミタ トイウ ウワサ ガ アルネ」",
        choices: [{ text: "レイ ヲ イウ", act: "move", to: "town_crossroad" }]
    },
    "bar_flirt": {
        name: "Bar クロネコ", icon: "💋",
        text: "トナリ ノ ビジョ ニ カッコツケテ ハナシカケタ。\n「ボク ト アマイ カクテル ヲ...」\n「ボウヤ、ミルク デモ ノンデナ！」\n...コトワラレテ シマッタ。",
        choices: [{ text: "スゴスゴ ト シリゾク", act: "move", to: "town_crossroad" }]
    },
    "fortune_teller": {
        name: "ウラナイ", icon: "🔮",
        text: "アヤシゲ ナ ウラナイシ ガ イル。\n「オヤ... アンタ、ネコ ニ スカレル ソウ ヲ シテルネ。\nコノ コイン ヲ アゲヨウ」",
        choices: [{ text: "ラッキーコイン？", act: "check", item: "lucky_coin", trueTo: "fortune_normal", falseTo: "fortune_rare" }]
    },
    "fortune_normal": {
        name: "ウラナイ", icon: "🔮",
        text: "「ウン？ モウ モッテイル ノカイ？\nナラバ アドバイス ダ。\n『サイゴ ハ カネ デハナク、ココロ デ エラベ』...ダヨ」",
        choices: [{ text: "エキ ヘ イク", act: "move", to: "station" }]
    },
    "fortune_rare": {
        name: "ウラナイ", icon: "🪙",
        text: "「ホラ、モッテオキナ。\nコノ コイン ハ キット キセキ ヲ ヨブヨ」\nラッキーコイン ヲ モラッタ！",
        choices: [{ text: "アリガトウ", act: "get", item: "lucky_coin", to: "town_crossroad" }]
    },

    // --- Station ---
    "station": {
        name: "エキ マエ", icon: "🚉",
        text: "エキ マエ ハ ヒト デ イッパイ ダ。\nベンチ ニ キレイ ナ オネエサン ガ スワッテ イル。\nナニカ コマッテ イル ヨウダ。",
        choices: [
            { text: "ハナシ カケル", act: "move", to: "station_lady" },
            { text: "ロジアウラ ヲ トオル", act: "move", to: "alley" }
        ]
    },
    "station_lady": {
        name: "ナゾ ノ ビジョ", icon: "👩",
        text: "オネエサン「アラ、カワイイ タンテイ サン ね」\nトテモ イイ ニオイ ガ スル...。\nカノジョ ハ ハンカチ ヲ オトシタ。",
        choices: [
            { text: "カッコツケテ ヒロウ", act: "charmCheck", to: "station_lady_charm" },
            { text: "フツウ ニ ヒロウ", act: "get", item: "handkerchief", to: "station_lady_normal" }
        ]
    },
    "station_lady_charm": {
        name: "ナゾ ノ ビジョ", icon: "💖",
        text: "アナタ ハ キザ ニ ハンカチ ヲ ヒロイ アゲタ。\nオネエサン「フフッ、ステキ。\nデモ、ソレ ハ アナタ ガ モッテイテ」\nハンカチ ヲ アズカッタ！IQ ガ アガッタ！",
        choices: [{ text: "ミナト ヘ", act: "get", item: "handkerchief", to: "harbor_park" }]
    },
    "station_lady_normal": {
        name: "エキ マエ", icon: "🚉",
        text: "オネエサン「アリガトウ。オレイ ニ コレハ アゲルワ」\nハンカチ ヲ モラッタ。\nイニシャル 『R』... ダレダロウ？",
        choices: [{ text: "ミナト ヘ", act: "move", to: "harbor_park" }]
    },

    // --- Harbor ---
    "harbor_park": {
        name: "ミナト ノ コウエン", icon: "⚓",
        text: "ウミ ノ ニオイ ガ スル...。\nソウコ ハ スグ ソコ ダ。\nベンチ デ ツリビト ガ タメ イキ ヲ ツイテイル。",
        choices: [
            { text: "ツリビト ニ ハナス", act: "move", to: "fisherman" },
            { text: "ネコ ニ オヤツ", act: "check", item: "cat_snack", trueTo: "harbor_cat", falseTo: "alley" }
        ]
    },
    "fisherman": {
        name: "ツリビト", icon: "🎣",
        text: "「サッキ、アヤシイ オトコ ガ ロジアウラ ニ ハイッテ イッタヨ。\nゴミ ヲ ステテ イッタ ミタイダ」",
        choices: [{ text: "ロジアウラ ヘ", act: "move", to: "alley" }]
    },
    "harbor_cat": {
        name: "ミナト ノ ネコ", icon: "🐈",
        text: "ココ ニモ オナカ ヲ スカセタ ネコ ガ イタ。\nオヤツ ヲ アゲルト、\nウレシソウ ニ アシモト ニ スリヨッテ キタ。\nココロ ガ オチツク...。",
        choices: [{ text: "ロジアウラ ヘ", act: "move", to: "alley" }]
    },

    // --- Alley ---
    "alley": {
        name: "ロジアウラ", icon: "🗑️",
        text: "ゴミバコ ガ タオサレテ イル。\nナニカ ステテ イッタ カモ シレナイ。",
        choices: [
            { text: "ゴミバコ ヲ シラベル", act: "get", item: "strangeGem", to: "alley_checked" },
            { text: "ゴミバコ ヲ ケトバス", act: "move", to: "bad_end_ambush" },
            { text: "サキ ニ ススム", act: "move", to: "warehouse" }
        ]
    },
    "bad_end_ambush": {
        name: "ロジアウラ", icon: "💥",
        text: "ドカッ！！\nオト ニ オドロイタ ノライヌ ノ ムレ ニ オソワレタ！\n...ビョウイン オクリ ニ ナッタ。",
        choices: [{ text: "タイトル ヘ モドル", act: "reset" }]
    },
    "alley_checked": {
        name: "ロジアウラ", icon: "💎",
        text: "コレハ... ウワサ ノ 『アオイ ホウセキ』 ノ カケラ ダ！\nコレデ ショウコ ハ ソロッタ。",
        choices: [{ text: "ソウコ ニ トツニュウ", act: "move", to: "warehouse" }]
    },

    // --- Climax ---
    "warehouse": {
        name: "ミナト ノ ソウコ", icon: "🚢",
        text: "アヤシイ オトコ ガ イタ。\nオトコ「トリヒキ アイテ カ？ レイ ノ ブツ ハ モッテ キタノカ？」\nカンチガイ シテイル ヨウダ。",
        choices: [{ text: "ショウコ ヲ ツキツケル", act: "move", to: "final_confrontation" }]
    },
    "final_confrontation": {
        name: "ケッチャク", icon: "🕵️",
        text: "オトコ「サッサト ソレ ヲ ヨコセ！」\nコイツ ガ ハンニン ダ。\nケッテイテキ ナ ショウコ ヲ ミセツケテ ヤレ！",
        choices: [
            { text: "『アオイ カケラ』", act: "judge", trueTo: "ending_true", falseTo: "ending_bad_lie" },
            { text: "『ラッキーコイン』", act: "move", to: "ending_peace" },
            { text: "『ハンカチ』", act: "move", to: "ending_bad_angry" }
        ]
    },

    // --- Endings ---
    "ending_bad_angry": {
        name: "ソウサ シッパイ", icon: "💢",
        text: "オトコ「フザケルナ！ ソンナ モノ イラン！」\nハンニン ハ ギャクギレ シテ オソイカカッテ キタ！\nショウコ フジュウブン デ カエリウチ ニ アッタ...。",
        choices: [{ text: "タイトル ヘ モドル", act: "reset" }]
    },
    "ending_bad_lie": {
        name: "ソウサ シッパイ", icon: "😓",
        text: "ポケット ヲ サガシタガ カケラ ヲ モッテイナイ！\nオトコ「ナンダ ヒヤカシ カ！」\nハンニン ニ ニゲラレテ シマッタ...。",
        choices: [{ text: "タイトル ヘ モドル", act: "reset" }]
    },
    "ending_peace": {
        name: "ジケン？ カイケツ", icon: "🕊️",
        text: "オトコ「ソ、ソレハ... ムカシ カッテイタ ネコ ノ コイン...」\nオトコ ハ ヤサシイ カオ ニ ナッタ。\n「モウ ヌスミ ハ ヤメルヨ...」\nナゼカ カイケツ シタ！\n\n■ PEACEFUL END ■",
        choices: [{ text: "タイトル ヘ モドル", act: "reset" }]
    },
    "ending_true": {
        name: "ジケン カイケツ", icon: "🎉",
        text: "「ソ、ソレハ... オレ ガ オトシタ ホウセキ ノ カケラ...」\nオトコ ハ ソノバ ニ クズレオチタ。\n「カンネン スル... オレ ガ ヤッタ」\n\n■ CONGRATULATIONS! ■",
        choices: [{ text: "タイトル ヘ モドル", act: "reset" }]
    }
};

/* =========================================
   3. Game Logic (Engine)
   ========================================= */

// Init
window.addEventListener('load', () => {
    AudioEngine.init();

    // Start Button
    const startBtn = document.getElementById('start-btn');
    if(startBtn) {
        startBtn.addEventListener('click', startWalk);
        startBtn.addEventListener('touchstart', () => AudioEngine.unlock(), {passive: true});
    }

    // Audio Toggle
    document.getElementById('bgm-toggle').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        AudioEngine.toggleMute();
    });

    // --- インベントリ機能 (ITEMボックスをクリック) ---
    // 既存のHTML構造上、2番目のstat-boxがItem数
    const itemBox = document.querySelectorAll('.stat-box')[1];
    if(itemBox) {
        itemBox.style.cursor = "pointer";
        itemBox.addEventListener('click', openInventory);
    }
});

function startWalk() {
    AudioEngine.unlock();
    AudioEngine.playSe('decide');

    GameState.hp = 100;
    GameState.items = {};
    GameState.itemCount = 0;
    
    updateUI();
    showScene("start");
}

function resetGame() {
    AudioEngine.playSe('select');
    AudioEngine.stopBgm();
    
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '<button class="choice-btn" id="start-btn-reset">GAME START</button>';
    document.getElementById('start-btn-reset').addEventListener('click', startWalk);
    
    document.getElementById('story-text').innerHTML = "GAME START ボタン ヲ<br>オシテ ソウサ カイシ";
    document.getElementById('location-name').textContent = "タイトル";
    document.getElementById('location-icon').textContent = "🕵️";
    document.getElementById('progress-fill').style.width = "0%";
    GameState.scene = "title";
}

function showScene(sceneId) {
    GameState.scene = sceneId;
    const scene = Scenes[sceneId];
    if (!scene) return;

    document.getElementById('location-name').textContent = scene.name;
    document.getElementById('location-icon').textContent = scene.icon;

    const textElem = document.getElementById('story-text');
    textElem.textContent = "";
    document.getElementById('choices').innerHTML = ""; 
    
    let i = 0;
    GameState.isTyping = true;
    
    // Skip typing on click
    textElem.onclick = () => {
        if(GameState.isTyping) {
            clearTimeout(GameState.textTimer);
            textElem.textContent = scene.text;
            finishTyping(scene);
        }
    };

    function type() {
        if (i < scene.text.length) {
            textElem.textContent += scene.text.charAt(i);
            i++;
            GameState.textTimer = setTimeout(type, 30);
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
    choicesDiv.innerHTML = ""; 

    scene.choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = c.text;
        btn.onclick = (e) => {
            e.stopPropagation();
            handleAction(c);
        };
        choicesDiv.appendChild(btn);
    });
}

function handleAction(choice) {
    // Check item possession
    if (choice.act === "check" || choice.act === "judge") {
        let hasItem = false;
        if (choice.item === "strangeGem") hasItem = GameState.items["strangeGem"];
        else hasItem = GameState.items[choice.item];
        
        // 判定ロジック：アイテムを持っていればtrueToへ
        // judgeの場合は判定が特殊
        if (choice.act === "judge") {
            // ケッチャクシーン用
            if (choice.text.includes("アオイ")) hasItem = GameState.items["strangeGem"];
            else if (choice.text.includes("コイン")) hasItem = GameState.items["lucky_coin"];
            else if (choice.text.includes("ハンカチ")) hasItem = GameState.items["handkerchief"];
        }

        AudioEngine.playSe('decide');
        let nextScene = hasItem ? choice.trueTo : choice.falseTo;
        if (!nextScene) nextScene = "ending_bad_lie"; 
        showScene(nextScene);
        return;
    }

    // Move scene
    if (choice.act === "move") {
        AudioEngine.playSe('select');
        showScene(choice.to);
        return;
    }

    // Get Item
    if (choice.act === "get") {
        const item = Items[choice.item];
        if (!GameState.items[choice.item]) {
            GameState.items[choice.item] = true;
            GameState.itemCount++;
            GameState.hp += 10;
            
            AudioEngine.playSe('item');
            showPopup(`GET! ${item.name}`, item.icon);
            flashScreen('white');
        }
        updateUI();
        setTimeout(() => showScene(choice.to), 1200);
        return;
    }

    // Damage
    if (choice.act === "damage") {
        GameState.hp -= choice.val;
        AudioEngine.playSe('damage');
        flashScreen('red');
        const container = document.getElementById('game-container');
        container.classList.add('shake-anim');
        setTimeout(() => container.classList.remove('shake-anim'), 400);
        
        updateUI();
        if (GameState.hp <= 0) {
             setTimeout(() => showScene("ending_bad_lie"), 1000);
        } else {
             setTimeout(() => showScene(choice.to), 1000);
        }
        return;
    }

    // Charm (Special)
    if (choice.act === "charmCheck") {
        AudioEngine.playSe('charm');
        flashScreen('white');
        showPopup("IQ UP!", "💖");
        GameState.hp += 20;
        updateUI();
        setTimeout(() => showScene(choice.to), 1200);
        return;
    }

    // Reset
    if (choice.act === "reset") {
        resetGame();
        return;
    }
}

// --- インベントリ機能 (ポップアップ流用) ---
function openInventory() {
    if(GameState.scene === 'title') return;

    // 現在の選択肢エリアを一時的にアイテムリストにする
    const choicesDiv = document.getElementById('choices');
    const textDiv = document.getElementById('story-text');
    
    // 戻るための情報を保存するのは複雑になるため、
    // 「閉じる」ボタンで現在のシーンを再描画する方式をとる
    
    textDiv.textContent = "ショジヒン リスト";
    choicesDiv.innerHTML = "";

    // 閉じるボタン
    const closeBtn = document.createElement('button');
    closeBtn.className = 'choice-btn';
    closeBtn.textContent = "× トジル";
    closeBtn.style.background = "#333";
    closeBtn.onclick = () => showScene(GameState.scene);
    choicesDiv.appendChild(closeBtn);

    // アイテム一覧
    const keys = Object.keys(GameState.items);
    if(keys.length === 0) {
        textDiv.textContent = "ナニモ モッテイナイ...";
    } else {
        keys.forEach(key => {
            const item = Items[key];
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = `${item.icon} ${item.name}`;
            btn.onclick = () => {
                textDiv.textContent = `${item.name}\n\n${item.desc}`;
                AudioEngine.playSe('select');
            };
            choicesDiv.appendChild(btn);
        });
    }
}

// UI Helpers
function showPopup(text, icon) {
    const popup = document.getElementById('treasure-popup');
    document.getElementById('treasure-text').textContent = text;
    document.getElementById('treasure-icon').textContent = icon;
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
    if(sceneId === 'start') per = 5;
    else if(sceneId.includes('mansion')) per = 40;
    else if(sceneId.includes('town')) per = 60;
    else if(sceneId.includes('harbor')) per = 80;
    else if(sceneId.includes('ending')) per = 100;
    document.getElementById('progress-fill').style.width = per + "%";
}
