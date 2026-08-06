/* =========================================
   Story data — 全シーン choices は必ず3つ
   ========================================= */
const Items = {
    cat_snack: {
        name: 'マタタビ スナック', mark: '[エサ]',
        desc: 'ネコ ガ ダイスキ ナ オヤツ。ココロ ヲ ヒラク カギ。'
    },
    wire: {
        name: 'サビタ ハリガネ', mark: '[ハリ]',
        desc: 'ナニカ ノ カギ ヲ アケル ノニ ツカエソウ ダ。'
    },
    memo: {
        name: 'アンゴウ メモ', mark: '[メモ]',
        desc: '『1192』 ト カイテアル。ツクエ ノ バンゴウ カ？'
    },
    secretLetter: {
        name: 'ハンニン ノ テガミ', mark: '[テガミ]',
        desc: '『カホウ ハ トリ カエシタ。ミナト デ マツ』...リュウジ ヨリ。'
    },
    lucky_coin: {
        name: 'ラッキー コイン', mark: '[コイン]',
        desc: 'ネコ ガ クレタ コイン。ヨク ミルト 『タマ』 ト キザマレテ イル。'
    },
    strangeGem: {
        name: 'アオイ カケラ', mark: '[カケラ]',
        desc: 'トテモ キレイナ アオイ イシ。カナシイ イロ ヲ シテイル。'
    },
    handkerchief: {
        name: 'アカイ ハンカチ', mark: '[ハカチ]',
        desc: 'イニシャル 『R』... キット 『Ryuji』 ノ モノダ。'
    }
};

const Scenes = {
    title: {
        name: 'タイトル',
        text: 'ロード カンリョウ。\nサンポ ノ トチュウ、チイサナ ジケン ガ ハジマル。\nコマンド ヲ エラベ。',
        choices: [
            { text: 'GAME START', act: 'start' },
            { text: 'ソウサ ノ ヒント', act: 'move', to: 'title_hint' },
            { text: 'クレジット', act: 'move', to: 'title_credits' }
        ]
    },
    title_hint: {
        name: 'ヒント',
        text: '・アイテム ハ ITEM ヲ タップ\n・ネコ・レイコ・ミナト ガ カギ\n・キケン ナ センタク ニ チュウイ',
        choices: [
            { text: 'GAME START', act: 'start' },
            { text: 'タイトル ヘ', act: 'move', to: 'title' },
            { text: 'クレジット', act: 'move', to: 'title_credits' }
        ]
    },
    title_credits: {
        name: 'クレジット',
        text: 'サンポチュウ ノ ジケンボ\nポートピア フウ タンテイ ADV\nTitans Game Lab',
        choices: [
            { text: 'GAME START', act: 'start' },
            { text: 'ヒント ヲ ミル', act: 'move', to: 'title_hint' },
            { text: 'タイトル ヘ', act: 'move', to: 'title' }
        ]
    },

    /* --- Park --- */
    start: {
        name: 'ヘイワ ナ コウエン',
        text: 'イツモ ドオリ ノ サンポ ミチ。\n「ニャ～ン...」\nドコカ カラ ナキゴエ ガ キコエル。',
        choices: [
            { text: 'コウエン ノ オク ヲ ミル', act: 'check', item: 'lucky_coin', trueTo: 'park_done_revisit', falseTo: 'park_bush' },
            { text: 'サキ ニ ススム', act: 'move', to: 'park_path' },
            { text: 'マチカド ヘ', act: 'move', to: 'street_corner' }
        ]
    },
    park_bench: {
        name: 'ベンチ',
        text: 'カゼ ガ キモチイイ。\nスガタ ノ ナイ ナキゴエ ガ、マダ キコエル。\nヤスヌ カ、サガス カ...',
        choices: [
            { text: 'スコシ ヤスム', act: 'heal', val: 15, to: 'park_bench_rest' },
            { text: 'ナキゴエ ノ ホウ ヘ', act: 'check', item: 'lucky_coin', trueTo: 'park_done_revisit', falseTo: 'park_bush' },
            { text: 'ゴウテイ ホウ ヘ', act: 'move', to: 'park_path' }
        ]
    },
    park_bench_rest: {
        name: 'ベンチ',
        text: 'シンコキュウ ヲ スット...。\nIQ ガ カイフク シタ。\nマタ、ナキゴエ ガ スル。',
        choices: [
            { text: 'シゲミ ヲ サガス', act: 'check', item: 'lucky_coin', trueTo: 'park_done_revisit', falseTo: 'park_bush' },
            { text: 'ゴウテイ ヘ', act: 'move', to: 'park_path' },
            { text: 'マチカド ヘ', act: 'move', to: 'street_corner' }
        ]
    },
    park_bush: {
        name: 'シゲミ ノ ナカ',
        text: 'シゲミ ノ ナカ ニ マヨイ ネコ ガ イタ。\nオナカ ヲ スカセテ イル ヨウダ。\nナニカ タベモノ ガ アレバ...',
        choices: [
            { text: 'スナック ヲ アゲル', act: 'check', item: 'cat_snack', trueTo: 'cat_happy', falseTo: 'cat_ignore' },
            { text: 'ナデテ ミル', act: 'move', to: 'cat_angry' },
            { text: 'ゴウテイ ホウ ヘ', act: 'move', to: 'park_path' }
        ]
    },
    cat_ignore: {
        name: 'シゲミ ノ ナカ',
        text: 'ネコ ハ アナタ ヲ ジッと ミテイル。\nタベモノ ヲ モッテナイ ト ワカル ト、\nプイッ ト ムコウ ヲ ムイテ シマッタ。',
        choices: [
            { text: 'コンビニ ヘ イク', act: 'move', to: 'convenience_store' },
            { text: 'サキ ニ ススム', act: 'move', to: 'park_path' },
            { text: 'コエ ヲ カケル', act: 'move', to: 'cat_call' }
        ]
    },
    cat_call: {
        name: 'シゲミ ノ ナカ',
        text: '「...ニャ？」\nイチベツ シタ ダケ デ、マタ ムコウ ムキ。\nハラガヘッテイル トキ ノ ネコ ハ キツイ。',
        choices: [
            { text: 'コンビニ ヘ', act: 'move', to: 'convenience_store' },
            { text: 'ゴウテイ ヘ', act: 'move', to: 'park_path' },
            { text: 'マチカド ヘ', act: 'move', to: 'street_corner' }
        ]
    },
    cat_angry: {
        name: 'シゲミ ノ ナカ',
        text: '「シャーッ！！」\nイキナリ ナデタラ ヒッカカレタ！\nIQ ガ ヘッタ... ハラガヘッテイル トキ ハ キケンダ。',
        choices: [
            { text: 'コンビニ ヘ イソグ', act: 'damage', val: 10, to: 'convenience_store' },
            { text: 'コンビニ デ クスリ', act: 'damage', val: 5, to: 'convenience_store' },
            { text: 'エサ ヲ サガス', act: 'damage', val: 5, to: 'convenience_store' }
        ]
    },
    convenience_store: {
        name: 'コンビニ',
        text: 'コンビニ ニ ヨッタ。\nネコ ガ スキソウ ナ 『マタタビ スナック』 ガ ウッテイル。\nレジ ノ ソバ ニ マチ ノ ゴシップシ モ アル。',
        choices: [
            { text: 'スナック ヲ カウ', act: 'get', item: 'cat_snack', to: 'park_bush' },
            { text: 'ゴシップシ ヲ ヨル', act: 'move', to: 'convenience_magazine' },
            { text: 'ゴウテイ ホウ ヘ', act: 'move', to: 'park_path' }
        ]
    },
    convenience_magazine: {
        name: 'コンビニ',
        text: '『ゴウテイ ニ ヌスミ？ アオイ カホウ フメイ』\n...マチ デ モ ウワサ ニ ナッテイル ラシイ。\nミナト フキン ノ ソウコ モ キニナル、ト ノ コト。',
        choices: [
            { text: 'スナック ヲ カウ', act: 'get', item: 'cat_snack', to: 'park_bush' },
            { text: 'ゴウテイ ヘ', act: 'move', to: 'park_path' },
            { text: 'マチカド ヘ', act: 'move', to: 'street_corner' }
        ]
    },
    cat_happy: {
        name: 'シゲミ ノ ナカ',
        text: 'ネコ「ニャウ〜ン♪」\nオヤツ ヲ タベル ト、ネコ ハ アナタ ニ ナツイタ！\nクビワ ニ 『コイン』 ガ ハサマッテ イタ。',
        choices: [
            { text: 'コイン ヲ トル', act: 'get', item: 'lucky_coin', to: 'park_done' },
            { text: 'ナマエ ヲ ツケル', act: 'charmCheck', to: 'cat_name' },
            { text: 'オキニイリ ヲ ナデル', act: 'heal', val: 5, to: 'cat_happy_pet' }
        ]
    },
    cat_name: {
        name: 'シゲミ ノ ナカ',
        text: 'クビワ ノ ウラ ニ 『タマ』 ト アル。\nムカシ ノ ナマエ カ...。\nコイン モ、ヤハリ キニナル。',
        choices: [
            { text: 'コイン ヲ トル', act: 'get', item: 'lucky_coin', to: 'park_done' },
            { text: 'サキ ニ ススム', act: 'get', item: 'lucky_coin', to: 'park_path' },
            { text: 'マチカド ヘ', act: 'get', item: 'lucky_coin', to: 'street_corner' }
        ]
    },
    cat_happy_pet: {
        name: 'シゲミ ノ ナカ',
        text: 'ゴロゴロ...。\nココロ ガ アタタカイ。\nサテ、コイン ハ ドウスル？',
        choices: [
            { text: 'コイン ヲ トル', act: 'get', item: 'lucky_coin', to: 'park_done' },
            { text: 'ゴウテイ ヘ', act: 'get', item: 'lucky_coin', to: 'park_path' },
            { text: 'マチカド ヘ', act: 'get', item: 'lucky_coin', to: 'street_corner' }
        ]
    },
    park_done: {
        name: 'コウエン',
        text: 'ネコ ハ アナタ ノ アト ヲ ツイテ クル。\nドウヤラ 『アイボウ』 ニ ナッテ クレル ヨウダ。\nサア、サンポ ヲ ツヅケヨウ。',
        choices: [
            { text: 'ゴウテイ ヘ', act: 'move', to: 'park_path' },
            { text: 'ミチ ヲ イソグ', act: 'move', to: 'street_corner' },
            { text: 'ウラミチ カラ', act: 'move', to: 'mansion_back' }
        ]
    },
    park_done_revisit: {
        name: 'シゲミ ノ ナカ',
        text: 'シゲミ ヲ ノゾイタ ガ、ネコ ハ モウ イナイ。\nアイボウ ハ、キット サキ デ マッテ イル。',
        choices: [
            { text: 'ゴウテイ ヘ', act: 'move', to: 'park_path' },
            { text: 'マチカド ヘ', act: 'move', to: 'street_corner' },
            { text: 'ウラミチ カラ', act: 'move', to: 'mansion_back' }
        ]
    },


    /* --- 前進用ブリッジ --- */
    park_path: {
        name: 'サンポ ミチ',
        text: 'コウエン ヲ ヌケル。\nトオク ニ ゴウテイ ノ ヤネ ガ ミエル。\nナキゴエ ハ、モウ キコエナイ。',
        choices: [
            { text: 'ゴウテイ ヘ イソグ', act: 'move', to: 'street_corner' },
            { text: 'ミチ ヲ キヲツケテ', act: 'heal', val: 5, to: 'street_corner' },
            { text: 'カゲ ヲ サガシテ ススム', act: 'move', to: 'street_corner' }
        ]
    },
    street_corner: {
        name: 'マチカド',
        text: 'ロセン ニ デル。\nパトカー ノ アカリ ガ、ゴウテイ マエ デ ヒカッテイル。\nジケン ノ ニオイ ガ スル。',
        choices: [
            { text: 'ゴウテイ マエ ヘ', act: 'move', to: 'mansion_front' },
            { text: 'ウラミチ カラ', act: 'move', to: 'mansion_back' },
            { text: 'ヒトゴエ ニ チカヨル', act: 'move', to: 'mansion_front' }
        ]
    },
    night_alley_exit: {
        name: 'ヨル ノ ウラミチ',
        text: 'ヤカタ ヲ アトニ スル。\nテガミ ノ コトバ 『ミナト デ マツ』 ガ アタマ ニ アル。\nマチ ノ アカリ ガ ミエテ キタ。',
        choices: [
            { text: 'ハンカガイ ヘ', act: 'move', to: 'town_crossroad' },
            { text: 'エキ ホウメン ヘ', act: 'move', to: 'station' },
            { text: 'ミナト ヘ チョクコウ', act: 'move', to: 'dock_road' }
        ]
    },
    dock_road: {
        name: 'ミナト ドウロ',
        text: 'ウミカゼ ガ ツヨイ。\nトオク ニ ソウコ ノ シラエット。\nアシあと ガ、ホコリ ニ ノコッテイル。',
        choices: [
            { text: 'ミナト コウエン ヘ', act: 'move', to: 'harbor_park' },
            { text: 'ロジアウラ ヘ', act: 'move', to: 'alley' },
            { text: 'ソウコ ニ チカヨル', act: 'move', to: 'warehouse_approach' }
        ]
    },
    warehouse_approach: {
        name: 'ソウコ マエ',
        text: 'トビラ ノ スキマ カラ アカリ。\nナカ デ、ダレカ ガ ハアハア トイキ ヲ シテイル。\n...イマナラ、マダ マニアウ。',
        choices: [
            { text: 'トビラ ヲ アケル', act: 'move', to: 'warehouse' },
            { text: 'マワリ ヲ ミル', act: 'move', to: 'alley' },
            { text: 'ココロ ヲ トトノエル', act: 'heal', val: 10, to: 'final_confrontation' }
        ]
    },

    /* --- Mansion --- */
    mansion_front: {
        name: 'ゴウテイ ノ マエ',
        text: 'パトカー ガ トマッテイル。\n「キセイセン カラ ハイラナイデ！」\nイカツ イ ケイカン ガ ミハッテ イル。',
        choices: [
            { text: 'ジジョウ ヲ キク', act: 'move', to: 'police_talk' },
            { text: 'ウラグチ ニ マワル', act: 'move', to: 'mansion_back' },
            { text: 'キセイセン ヲ コエル', act: 'move', to: 'bad_end_tape' }
        ]
    },
    bad_end_tape: {
        name: 'ゴウテイ ノ マエ',
        text: 'ケイカン「オイ！ ダレダ！」\nソクソク ト ツカマッテ シマッタ。\nサンポ ノ ツモリ ガ、イチヤ ノ メ。',
        choices: [
            { text: 'タイトル ヘ', act: 'reset' },
            { text: 'サイショ カラ', act: 'start' },
            { text: 'ヒント ヲ ミル', act: 'move', to: 'title_hint' }
        ]
    },
    police_talk: {
        name: 'ケイカン',
        text: 'ケイカン「コノ ヤカタ ノ 『アオイ カホウ』 ガ ヌスマレタ」\nアルジ ハ ゴウヨク デ ユウメイ ナ キゾク ダ。',
        choices: [
            { text: 'ウラグチ ニ マワル', act: 'move', to: 'mansion_back' },
            { text: 'イロジカケ スル', act: 'move', to: 'police_charm_fail' },
            { text: 'ショウコ ヲ キク', act: 'move', to: 'police_detail' }
        ]
    },
    police_detail: {
        name: 'ケイカン',
        text: '「アシあと ハ ミナト ホウコウ。\nハンニン ハ 『リュウジ』 ト ウワサ サレテイル...」\nナマエ、ドコカ デ キイタ キガ...。',
        choices: [
            { text: 'ウラグチ ヘ', act: 'move', to: 'mansion_back' },
            { text: 'ウラミチ ヲ キク', act: 'move', to: 'mansion_back' },
            { text: 'イロジカケ...?', act: 'move', to: 'police_charm_fail' }
        ]
    },
    police_charm_fail: {
        name: 'ケイカン',
        text: 'アナタ ハ チョット セクシー ニ ウインク シテミタ。\nケイカン「...ナニ ヲ シテイルンダ キミ ハ」\nドンビキ サレテ シマッタ！！ ハズカシイ！',
        choices: [
            { text: 'ニゲダス', act: 'move', to: 'mansion_back' },
            { text: 'アヤマッテ ウラ ヘ', act: 'move', to: 'mansion_back' },
            { text: 'ニゲミチ ヲ サガス', act: 'move', to: 'mansion_back' }
        ]
    },

    mansion_back: {
        name: 'ウラニワ',
        text: 'ウラニワ ニ ハ イヌゴヤ ガ アル。\nバンケン ハ... ネル ヲ シテイル ヨウダ。\nマド ニハ カギ ガ カカッテ イル。',
        choices: [
            { text: 'ハリガネ ヲ ツカウ', act: 'check', item: 'wire', trueTo: 'mansion_inside_entry', falseTo: 'mansion_back_locked' },
            { text: 'モノオキ ヲ ミル', act: 'move', to: 'garden_shed' },
            { text: 'バンケン ヲ オコス', act: 'move', to: 'bad_end_dog' }
        ]
    },
    bad_end_dog: {
        name: 'ウラニワ',
        text: 'ワンワン！！\nオドロイタ イヌ ニ オイカケマワ サレタ！\nサンポ ドコロ デハ ナイ。',
        choices: [
            { text: 'タイトル ヘ', act: 'reset' },
            { text: 'サイショ カラ', act: 'start' },
            { text: 'ヒント ヲ ミル', act: 'move', to: 'title_hint' }
        ]
    },
    mansion_back_locked: {
        name: 'ウラニワ',
        text: 'カギ ガ カカッテ イテ アカナイ。\nホソナガイ カネノボウ デモ アレバ...。\nソト ニ ダレカ イル キガ スル。',
        choices: [
            { text: 'モノオキ ヲ ミル', act: 'move', to: 'garden_shed' },
            { text: 'カゲ ニ ハナス', act: 'move', to: 'maid_talk' },
            { text: 'マド ヲ ノゾク', act: 'move', to: 'garden_shed' }
        ]
    },
    maid_talk: {
        name: 'ジョチュウ',
        text: 'ジョチュウ「...ダレ？ ア、サンポシャ サン？」\nカノジョ ハ コエ ヲ ヒソメテ イウ。\n「アルジ ハ、ヒト ノ イエ ヲ ツブシテ カネ ヲ カセグ ヒト デス」',
        choices: [
            { text: 'モット キク', act: 'move', to: 'maid_more' },
            { text: 'チカヨル', act: 'move', to: 'maid_close' },
            { text: 'モノオキ ヘ', act: 'move', to: 'garden_shed' }
        ]
    },
    maid_more: {
        name: 'ジョチュウ',
        text: '「リュウジ サン ノ イエ モ...。\nアオイ カホウ ハ、モトモト アチラ ノ カタミ デス」\nカノジョ ノ メ ハ、カナシソウ ダ。',
        choices: [
            { text: 'レイ ヲ イウ', act: 'heal', val: 5, to: 'garden_shed' },
            { text: 'モノオキ ヘ', act: 'move', to: 'garden_shed' },
            { text: 'ハリガネ ヲ サガス', act: 'move', to: 'garden_shed' }
        ]
    },
    maid_close: {
        name: 'ジョチュウ',
        text: 'チカヨルト、カノジョ ハ アカクタテテ\n「バ、バカニ シナイデ クダサイ！」\n...イヌ ガ ムクッ ト シタ。キケン。',
        choices: [
            { text: 'モノオキ ヘ ニゲル', act: 'move', to: 'garden_shed' },
            { text: 'アヤマッテ サガス', act: 'damage', val: 5, to: 'garden_shed' },
            { text: 'ハリガネ ヲ サガス', act: 'move', to: 'garden_shed' }
        ]
    },
    garden_shed: {
        name: 'モノオキ',
        text: 'ホコリ マミレ ノ モノオキ ダ。\nガラクタ ノ ナカ ニ ナニカ ツカエソウ ナ モノ ハ...。',
        choices: [
            { text: 'ガラクタ ヲ アサル', act: 'get', item: 'wire', to: 'mansion_back_retry' },
            { text: 'ホコリ ヲ ハラウ', act: 'move', to: 'shed_photo' },
            { text: 'シャシン ヲ ミル', act: 'move', to: 'shed_photo' }
        ]
    },
    shed_photo: {
        name: 'モノオキ',
        text: 'ホコリ ノ シタ ニ フルイ シャシン。\nワラッテイル フタリ... オトコ ト オンナ、\nソシテ ネコ。ウラ ニ 『リュウジ・レイコ・タマ』。',
        choices: [
            { text: 'ガラクタ ヲ アサル', act: 'get', item: 'wire', to: 'mansion_back_retry' },
            { text: 'ハリガネ ヲ サガス', act: 'get', item: 'wire', to: 'mansion_back_retry' },
            { text: 'キオク ニ トメル', act: 'heal', val: 5, to: 'mansion_back_retry' }
        ]
    },
    mansion_back_retry: {
        name: 'ウラニワ',
        text: 'ハリガネ ヲ テ ニ イレタ。\nコレ デ マド ノ カギ ヲ アケラレル カモ シレナイ。',
        choices: [
            { text: 'ハリガネ ヲ ツカウ', act: 'move', to: 'mansion_inside_entry' },
            { text: 'イヌ ヲ カクニン', act: 'move', to: 'dog_check' },
            { text: 'イキ ヲ トトノエル', act: 'heal', val: 5, to: 'mansion_inside_entry' }
        ]
    },
    dog_check: {
        name: 'ウラニワ',
        text: 'イヌ ハ マダ ネテイル。\nイイノコ...。\nイマナラ マド ヲ アケラレル。',
        choices: [
            { text: 'マド ヲ アケル', act: 'move', to: 'mansion_inside_entry' },
            { text: 'シンチョウ ニ アケル', act: 'heal', val: 5, to: 'mansion_inside_entry' },
            { text: 'イキ ヲ コロシテ', act: 'move', to: 'mansion_inside_ready' }
        ]
    },
    mansion_inside_entry: {
        name: 'ウラニワ',
        text: 'カチャリ...。\nカギ ガ アイタ！\nコッソリ ナカ ニ ハイロウ。',
        choices: [
            { text: 'ナカ ニ ハイル', act: 'move', to: 'mansion_inside_hall' },
            { text: 'イキ ヲ トトノエル', act: 'heal', val: 10, to: 'mansion_inside_ready' },
            { text: 'カクゴ ヲ キメル', act: 'move', to: 'mansion_inside_hall' }
        ]
    },
    mansion_inside_ready: {
        name: 'ウラニワ',
        text: 'シンゾウ ノ オト ガ シズマル。\nヨシ... ハイロウ。',
        choices: [
            { text: 'ナカ ニ ハイル', act: 'move', to: 'mansion_inside_hall' },
            { text: 'ショサイ ヲ メザス', act: 'move', to: 'mansion_inside_hall' },
            { text: 'アシナミ ヲ シズメテ', act: 'heal', val: 5, to: 'mansion_inside_hall' }
        ]
    },
    mansion_inside_hall: {
        name: 'ヤカタ ノ ナカ',
        text: 'シツナイ ハ クライ...。\nショサイ ノ ツクエ ニハ 『4ケタ ノ ダイヤル』。\nアンゴウ ガ ワカラナイ。',
        choices: [
            { text: 'アンゴウ ヲ ニュウリョク', act: 'check', item: 'memo', trueTo: 'mansion_inside_desk', falseTo: 'mansion_inside_locked' },
            { text: 'ショクドウ ヲ シラベル', act: 'move', to: 'mansion_dining' },
            { text: 'オク ノ ヘヤ ヲ ミル', act: 'move', to: 'bad_end_encounter' }
        ]
    },
    mansion_inside_locked: {
        name: 'ヤカタ ノ ナカ',
        text: 'ダメダ...。テキトウ ニ マワシテモ アカナイ。\nドコカ ニ ヒント ガ アル ハズダ。',
        choices: [
            { text: 'ショクドウ ヲ シラベル', act: 'move', to: 'mansion_dining' },
            { text: 'オク ヲ ミル', act: 'move', to: 'bad_end_encounter' },
            { text: 'ショクドウ ヘ イソグ', act: 'move', to: 'mansion_dining' }
        ]
    },
    mansion_dining: {
        name: 'ショクドウ',
        text: 'テーブル ノ ウエ ニ メモ ガ オイテアル。\n『ショサイ ノ バンゴウ : 1192』\nイイクニ ツクロウ... コレダ！',
        choices: [
            { text: 'メモ ヲ トル', act: 'get', item: 'memo', to: 'mansion_inside_retry' },
            { text: 'ワイン ヲ ノゾク', act: 'move', to: 'dining_wine' },
            { text: 'メモ ヲ ヨミナオス', act: 'move', to: 'dining_wine' }
        ]
    },
    dining_wine: {
        name: 'ショクドウ',
        text: 'コウカ ナ ワイン ガ ナラブ。\nラベル ノ ウラ ニ チイサク 『R』。\n...ハンニン ノ イニシャル カ？',
        choices: [
            { text: 'メモ ヲ トル', act: 'get', item: 'memo', to: 'mansion_inside_retry' },
            { text: 'アンゴウ ヘ', act: 'get', item: 'memo', to: 'mansion_inside_retry' },
            { text: 'キオク シテ ススム', act: 'heal', val: 5, to: 'mansion_inside_retry' }
        ]
    },
    mansion_inside_retry: {
        name: 'ヤカタ ノ ナカ',
        text: 'アンゴウ ハ ワカッタ。\nコレデ ツクエ ヲ アケラレル。',
        choices: [
            { text: 'アンゴウ ヲ ニュウリョク', act: 'move', to: 'mansion_inside_desk' },
            { text: 'シンチョウ ニ アケル', act: 'move', to: 'mansion_inside_desk' },
            { text: 'オク ノ ヘヤ...?', act: 'move', to: 'bad_end_encounter' }
        ]
    },
    mansion_inside_desk: {
        name: 'ショサイ',
        text: 'カチャリ。\nヒキダシ ノ ナカ ニ ハンニン ノ テガミ ガ アッタ！',
        choices: [
            { text: 'テガミ ヲ ヨム', act: 'get', item: 'secretLetter', to: 'mansion_inside_done' },
            { text: 'ホカ ノ ヒキダシ', act: 'move', to: 'desk_extra' },
            { text: 'テガミ ヲ カクニンスル', act: 'get', item: 'secretLetter', to: 'mansion_inside_done' }
        ]
    },
    desk_extra: {
        name: 'ショサイ',
        text: 'フルイ ダイチョウ。\n『カホウ・ゲンバ ウリ』ノ キロク...。\nアルジ ノ オゴリ ガ、ミエテ クル。',
        choices: [
            { text: 'テガミ ヲ ヨム', act: 'get', item: 'secretLetter', to: 'mansion_inside_done' },
            { text: 'ヤカタ ヲ デル', act: 'get', item: 'secretLetter', to: 'night_alley_exit' },
            { text: 'ショウコ ヲ カカエル', act: 'get', item: 'secretLetter', to: 'night_alley_exit' }
        ]
    },
    mansion_inside_done: {
        name: 'ヤカタ ノ ナカ',
        text: 'テガミ「カホウ ハ トリ カエシタ。ミナト デ マツ」\nサシダシニン ハ 『リュウジ』...\nコノ ナマエ、ドコカ デ...',
        choices: [
            { text: 'ヤカタ ヲ デル', act: 'move', to: 'night_alley_exit' },
            { text: 'テガミ ヲ ヨミナオス', act: 'move', to: 'letter_reread' },
            { text: 'ウラミチ ヘ ニゲル', act: 'move', to: 'night_alley_exit' }
        ]
    },
    letter_reread: {
        name: 'ヤカタ ノ ナカ',
        text: '『ミナト デ マツ』...。\nエキ ト ミナト、フタツ ノ ミチ ガ アル。\nジョウホウ ヲ アツメテ カラ デモ オソクナイ。',
        choices: [
            { text: 'マチ ヘ デル', act: 'move', to: 'night_alley_exit' },
            { text: 'エキ ホウ ヘ', act: 'move', to: 'station' },
            { text: 'ミナト ヘ', act: 'move', to: 'dock_road' }
        ]
    },
    bad_end_encounter: {
        name: 'ロウカ',
        text: '「ダレダ！ ソコニ イルノハ！」\nソウサチュウ ノ ケイジ ニ ミツカッテ シマッタ。',
        choices: [
            { text: 'タイトル ヘ', act: 'reset' },
            { text: 'サイショ カラ', act: 'start' },
            { text: 'ヒント ヲ ミル', act: 'move', to: 'title_hint' }
        ]
    },

    /* --- Town --- */
    town_crossroad: {
        name: 'ヨル ノ マチ',
        text: 'ハンカガイ ニ デタ。\nミナト ヘ イク マエ ニ、スコシ ジョウホウ シュウシュウ ヲ シテオコウ。',
        choices: [
            { text: "Bar『クロネコ』ヘ", act: 'move', to: 'bar_entry' },
            { text: 'ロジウラ ノ ウラナイ', act: 'check', item: 'lucky_coin', trueTo: 'fortune_done', falseTo: 'fortune_teller' },
            { text: 'エキ ヘ イソグ', act: 'move', to: 'station' }
        ]
    },
    bar_entry: {
        name: 'Bar クロネコ',
        text: 'カランコロン...。\nマスター「リュウジ カ... カレ ノ イエ ハ、\nアノ ヤカタ ノ アルジ ニ ハメラレテ ボツラク シタンダ」',
        choices: [
            { text: 'エキ ヘ ムカウ', act: 'move', to: 'station' },
            { text: 'モット キク', act: 'move', to: 'bar_more' },
            { text: 'サケ ヲ ツケル', act: 'move', to: 'bar_drink' }
        ]
    },
    bar_more: {
        name: 'Bar クロネコ',
        text: '「イモウト ノ レイコ ハ、マダ アニ ヲ シンジテイル。\nエキマエ ノ ベンチ ニ、ヨルナヨルナ イル ヨ」\nマスター ハ グラス ヲ ミガキナガラ イツタ。',
        choices: [
            { text: 'エキ ヘ', act: 'move', to: 'station' },
            { text: 'ミナト ヘ', act: 'move', to: 'dock_road' },
            { text: 'ウラナイ ヘ', act: 'move', to: 'fortune_teller' }
        ]
    },
    bar_drink: {
        name: 'Bar クロネコ',
        text: 'イッパイ ダケ...。\nアタマ ガ アッタクナル。\nヨッパライ ソウサ ハ、シッパイ ノ モト ダ。',
        choices: [
            { text: 'エキ ヘ イソグ', act: 'damage', val: 5, to: 'station' },
            { text: 'ミズ ヲ ノンデ ススム', act: 'heal', val: 10, to: 'station' },
            { text: 'ミナト ヘ', act: 'damage', val: 5, to: 'dock_road' }
        ]
    },
    fortune_teller: {
        name: 'ウラナイ',
        text: 'アヤシゲ ナ ウラナイシ ガ イル。\n「アンタ、ネコ ニ スカレル ソウ ヲ シテルネ。\nコノ コイン ヲ アゲヨウ」',
        choices: [
            { text: 'コイン ヲ ウケル', act: 'check', item: 'lucky_coin', trueTo: 'fortune_normal', falseTo: 'fortune_rare' },
            { text: 'ウンメイ ヲ キク', act: 'move', to: 'fortune_fate' },
            { text: 'エキ ヘ ムカウ', act: 'move', to: 'station' }
        ]
    },
    fortune_fate: {
        name: 'ウラナイ',
        text: '「ミナト ニ カナシミ ガ アル。\nタダシ、ココロ デ エラベバ ミチ ハ ヒラク」\nスイトウ ガ ユレル。',
        choices: [
            { text: 'コイン ヲ ウケル', act: 'check', item: 'lucky_coin', trueTo: 'fortune_normal', falseTo: 'fortune_rare' },
            { text: 'エキ ヘ', act: 'move', to: 'station' },
            { text: 'ミナト ヘ', act: 'move', to: 'dock_road' }
        ]
    },
    fortune_normal: {
        name: 'ウラナイ',
        text: '「ココロ デ エラベ... ソレガ ウンメイ ヲ カエルヨ」\nスデニ コイン ハ モッテイル。\nカノジョ ハ ニヤリ ト ワラッタ。',
        choices: [
            { text: 'エキ ヘ イク', act: 'move', to: 'station' },
            { text: 'ミナト ヘ', act: 'move', to: 'dock_road' },
            { text: 'ロジアウラ ヘ', act: 'move', to: 'alley' }
        ]
    },
    fortune_rare: {
        name: 'ウラナイ',
        text: '「コノ コイン ハ キット キセキ ヲ ヨブヨ」\nラッキーコイン ヲ モラッタ！',
        choices: [
            { text: 'エキ ヘ', act: 'get', item: 'lucky_coin', to: 'station' },
            { text: 'ミナト ヘ', act: 'get', item: 'lucky_coin', to: 'dock_road' },
            { text: 'ソウコ ホウ ヘ', act: 'get', item: 'lucky_coin', to: 'warehouse_approach' }
        ]
    },
    fortune_done: {
        name: 'ウラナイ',
        text: 'ウラナイシ ハ モウ イナイ。\n「ココロ デ エラベ」... ソノ コトバ ガ ノコッタ。',
        choices: [
            { text: 'エキ ヘ', act: 'move', to: 'station' },
            { text: 'ミナト ヘ', act: 'move', to: 'dock_road' },
            { text: 'ロジアウラ ヘ', act: 'move', to: 'alley' }
        ]
    },

    /* --- Station / Reiko --- */
    station: {
        name: 'エキ マエ',
        text: 'エキ マエ ハ ヒト デ イッパイ ダ。\nベンチ ニ キレイ ナ オネエサン ガ スワッテ イル。\nナニカ コマッテ イル ヨウダ。',
        choices: [
            { text: 'ハナシ カケル', act: 'check', item: 'handkerchief', trueTo: 'station_done', falseTo: 'station_lady' },
            { text: 'ロジアウラ ヲ トオル', act: 'move', to: 'alley' },
            { text: 'アメヤドリ スル', act: 'move', to: 'station_rain' }
        ]
    },
    station_rain: {
        name: 'エキ マエ',
        text: 'キュウナ アマモヨイ。\nオンナ ハ カミ ガ ヌレテ、コマッタ ヨウニ ワラウ。\n「...カサ、モッテイナイ ノ」',
        choices: [
            { text: 'コート ヲ カス', act: 'charmCheck', to: 'station_rain_coat' },
            { text: 'ハナシ カケル', act: 'check', item: 'handkerchief', trueTo: 'station_done', falseTo: 'station_lady' },
            { text: 'ミナト ヘ ムカウ', act: 'move', to: 'dock_road' }
        ]
    },
    station_rain_coat: {
        name: 'ナゾ ノ ビジョ',
        text: '「...アリガトウ」。\nカノジョ（レイコ）ハ コート ノ ナカ デ、\nアニ ノ ハナシ ヲ シテ クレタ。',
        choices: [
            { text: 'ハンカチ ヲ ヒロウ', act: 'get', item: 'handkerchief', to: 'station_lady_normal' },
            { text: 'ミナト ヘ ツレテ', act: 'get', item: 'handkerchief', to: 'dock_road' },
            { text: 'ロジアウラ ヘ', act: 'get', item: 'handkerchief', to: 'alley' }
        ]
    },
    station_lady: {
        name: 'ナゾ ノ ビジョ',
        text: 'オネエサン「アニ ノ 『リュウジ』 ガ カエッテ コナイノ...」\nカノジョ ハ ハンカチ ヲ オトシタ。\nイニシャル 『R』 ハ リュウジ ノ R カ！',
        choices: [
            { text: 'カッコツケテ ヒロウ', act: 'charmCheck', to: 'station_lady_charm' },
            { text: 'フツウ ニ ヒロウ', act: 'get', item: 'handkerchief', to: 'station_lady_normal' },
            { text: 'ソトニ スル', act: 'move', to: 'station_pass' }
        ]
    },
    station_pass: {
        name: 'エキ マエ',
        text: 'カノジョ ノ コト ハ、キニ ナリツツ モ\nトオリ スギタ。\nアトデ コウカイ スル カモ シレナイ。',
        choices: [
            { text: 'ロジアウラ ヘ', act: 'move', to: 'alley' },
            { text: 'ミナト ヘ', act: 'move', to: 'dock_road' },
            { text: 'ソウコ ホウ ヘ', act: 'move', to: 'warehouse_approach' }
        ]
    },
    station_lady_charm: {
        name: 'ナゾ ノ ビジョ',
        text: '「アニ ヲ... トメテ クダサイ」\nカノジョ ハ ハンカチ ヲ アナタ ニ タクシタ。\nIQ ガ アガッタ！',
        choices: [
            { text: 'ミナト ヘ', act: 'get', item: 'handkerchief', to: 'dock_road' },
            { text: 'ミナト ヘ', act: 'get', item: 'handkerchief', to: 'dock_road' },
            { text: 'ロジアウラ ヘ', act: 'get', item: 'handkerchief', to: 'alley' }
        ]
    },
    station_lady_normal: {
        name: 'エキ マエ',
        text: '「アニ ヲ... トメテ クダサイ」\nハンカチ ヲ アズカッタ。\nコレハ カノジョ（レイコ）ノ ネガイ ダ。',
        choices: [
            { text: 'ミナト ヘ', act: 'move', to: 'dock_road' },
            { text: 'ロジアウラ ヘ', act: 'move', to: 'alley' },
            { text: 'ソウコ ホウ ヘ', act: 'move', to: 'warehouse_approach' }
        ]
    },
    station_done: {
        name: 'エキ マエ',
        text: 'レイコ ハ モウ イナイ。\nアニ ヲ シンジアッテ、ミナト ノ ホウ ヘ イッタ ハズダ。',
        choices: [
            { text: 'ミナト ヘ', act: 'move', to: 'dock_road' },
            { text: 'ロジアウラ ヘ', act: 'move', to: 'alley' },
            { text: 'ソウコ ホウ ヘ', act: 'move', to: 'warehouse_approach' }
        ]
    },

    /* --- Harbor --- */
    harbor_park: {
        name: 'ミナト ノ コウエン',
        text: 'ウミ ノ ニオイ ガ スル...。\nソウコ ノ マエ デ、ネコ ガ マッテ イタ。\nアナタ ト トモニ イク ツモリ ラシイ。',
        choices: [
            { text: 'ツリビト ニ ハナス', act: 'move', to: 'fisherman' },
            { text: 'アイボウ ト ススム', act: 'move', to: 'alley' },
            { text: 'ウミ ヲ ミル', act: 'move', to: 'harbor_sea' }
        ]
    },
    harbor_sea: {
        name: 'ミナト',
        text: 'ナミ ノ オト。\nトオク ニ ソウコ ノ アカリ。\nコレカラ ノ センタク ガ、ケッチャク ヲ カケル。',
        choices: [
            { text: 'ツリビト ヘ', act: 'heal', val: 5, to: 'fisherman' },
            { text: 'ロジアウラ ヘ', act: 'move', to: 'alley' },
            { text: 'ソウコ ホウ ヘ', act: 'move', to: 'warehouse_approach' }
        ]
    },
    fisherman: {
        name: 'ツリビト',
        text: '「ロジアウラ ニ ハイッタ オトコ ハ、\nカナシソウ ナ カオ ヲ シテ イタヨ...」',
        choices: [
            { text: 'ロジアウラ ヘ', act: 'move', to: 'alley' },
            { text: 'モット キク', act: 'move', to: 'fisherman_more' },
            { text: 'ソウコ ホウ ヘ', act: 'move', to: 'warehouse_approach' }
        ]
    },
    fisherman_more: {
        name: 'ツリビト',
        text: '「テ ニ アオイ モノ ヲ カカエテイタ。\nデモ ウッテ ニゲル カオ ジャ ナカッタナ」\nツリイト ガ ピン、ト ナッタ。',
        choices: [
            { text: 'ロジアウラ ヘ', act: 'move', to: 'alley' },
            { text: 'ソウコ ヘ チョクコウ', act: 'move', to: 'warehouse' },
            { text: 'ソウコ ホウ ヘ', act: 'move', to: 'warehouse_approach' }
        ]
    },
    alley: {
        name: 'ロジアウラ',
        text: 'ゴミバコ ガ タオサレテ イル。\nココ ヲ ヌケレバ ソウコ ダ。',
        choices: [
            { text: 'ゴミバコ ヲ シラベル', act: 'get', item: 'strangeGem', to: 'alley_checked' },
            { text: 'ゴミバコ ヲ ケトバス', act: 'move', to: 'bad_end_ambush' },
            { text: 'サキ ニ ススム', act: 'move', to: 'warehouse' }
        ]
    },
    bad_end_ambush: {
        name: 'ロジアウラ',
        text: 'ドカッ！！\nオト ニ オドロイタ ノライヌ ノ ムレ ニ オソワレタ！\n...ビョウイン オクリ ニ ナッタ。',
        choices: [
            { text: 'タイトル ヘ', act: 'reset' },
            { text: 'サイショ カラ', act: 'start' },
            { text: 'ヒント ヲ ミル', act: 'move', to: 'title_hint' }
        ]
    },
    alley_checked: {
        name: 'ロジアウラ',
        text: 'ゴミバコ ニ 『アオイ ホウセキ』 ガ ステテ アッタ。\nリュウジ ハ、コレ ヲ ウリサバク ツモリ ハ ナカッタ...？',
        choices: [
            { text: 'ソウコ ニ トツニュウ', act: 'move', to: 'warehouse' },
            { text: 'カケラ ヲ ミツメル', act: 'move', to: 'gem_gaze' },
            { text: 'ソウコ ホウ ヘ', act: 'move', to: 'warehouse_approach' }
        ]
    },
    gem_gaze: {
        name: 'ロジアウラ',
        text: 'アオイ カケラ ハ、ツメタクテ、カナシイ。\nコレ ヲ ミセレバ、カレ ノ ココロ ハ ウゴク ハズダ。',
        choices: [
            { text: 'ソウコ ヘ', act: 'move', to: 'warehouse_approach' },
            { text: 'カクゴ ヲ キメル', act: 'move', to: 'warehouse' },
            { text: 'サッサト ススム', act: 'move', to: 'final_confrontation' }
        ]
    },
    warehouse: {
        name: 'ミナト ノ ソウコ',
        text: '「ダレダ！」\nリュウジ ガ イタ。\n「コノ ホウセキ ハ、モトモト オレタチ カゾク ノ モノダ！\nヤツラ ニ カエス モノカ！」',
        choices: [
            { text: 'セットク スル', act: 'move', to: 'final_confrontation' },
            { text: 'ニゲミチ ヲ サガス', act: 'move', to: 'warehouse_flee' },
            { text: 'アイテム ヲ ミセル', act: 'move', to: 'final_confrontation' }
        ]
    },
    warehouse_flee: {
        name: 'ミナト ノ ソウコ',
        text: 'セナカ ヲ ミセタ シュンカン、\nリュウジ「ニガス カ！」\n...ニゲギワ ノ ワルサ ヲ、カンジタ。',
        choices: [
            { text: 'フタタビ ハナス', act: 'move', to: 'final_confrontation' },
            { text: 'アイテム ヲ ダス', act: 'damage', val: 5, to: 'final_confrontation' },
            { text: 'セットク スル', act: 'move', to: 'final_confrontation' }
        ]
    },

    final_confrontation: {
        name: 'ケッチャク',
        text: 'リュウジ「ジャマ ヲ スルナ！！」\nカレ ハ ドウヨウ シテイル。\nカレ ノ ココロ ヲ ウゴカス モノ ハ...',
        choices: [
            { text: '『アオイ カケラ』', act: 'judge', trueTo: 'ending_true', falseTo: 'ending_bad_lie' },
            { text: '『ラッキーコイン』', act: 'judge', trueTo: 'ending_peace', falseTo: 'ending_bad_lie' },
            { text: '『ハンカチ』', act: 'judge', trueTo: 'ending_family', falseTo: 'ending_bad_angry' }
        ]
    },

    ending_bad_angry: {
        name: 'ソウサ シッパイ',
        text: '「ソンナ モノ シラン！」\nリュウジ ハ ギャクギレ シテ オソイカカッテ キタ！\nショウコ フジュウブン デ カエリウチ ニ アッタ...。',
        choices: [
            { text: 'タイトル ヘ', act: 'reset' },
            { text: 'サイショ カラ', act: 'start' },
            { text: 'ヒント ヲ ミル', act: 'move', to: 'title_hint' }
        ]
    },
    ending_bad_lie: {
        name: 'ソウサ シッパイ',
        text: 'ポケット ヲ サガシタガ ナニモ ナイ！\n「ヒヤカシ カ！」\nリュウジ ニ ニゲラレテ シマッタ...。',
        choices: [
            { text: 'タイトル ヘ', act: 'reset' },
            { text: 'サイショ カラ', act: 'start' },
            { text: 'ヒント ヲ ミル', act: 'move', to: 'title_hint' }
        ]
    },

    ending_true: {
        name: 'ジケン カイケツ',
        text: 'リュウジ「ソレ ハ... オフクロ ノ カタミ...」\nカレ ハ ソノバ ニ クズレオチタ。\n\n「...ワカッタ。ツグナウ ヨ」\nトオク カラ パトカー ノ サイレン ガ キコエル。',
        choices: [
            { text: 'ソノバ ヲ タチサル', act: 'move', to: 'epilogue_hardboiled' },
            { text: 'ケイカン ニ ワタス', act: 'move', to: 'epilogue_police' },
            { text: 'レイコ ヲ サガス', act: 'move', to: 'epilogue_reiko' }
        ]
    },
    ending_family: {
        name: 'キョウダイ ノ キズナ',
        text: '「ソレ ハ... レイコ ノ...」\nソコ ヘ レイコ ガ カケツケタ。\n「オニイチャン、モウ ヤメテ！」\nリュウジ ハ レイコ ヲ ダキシメタ。',
        choices: [
            { text: 'ミマモル', act: 'move', to: 'epilogue_hardboiled' },
            { text: 'チイサク テ ヲ フル', act: 'move', to: 'epilogue_reiko' },
            { text: 'サンポ ニ モドル', act: 'move', to: 'epilogue_walk' }
        ]
    },
    ending_peace: {
        name: 'キセキ ノ サイカイ',
        text: '「ソ、ソレハ... ムカシ カッテイタ ネコ（タマ）ノ コイン...」\nアイボウ ノ ネコ ガ リュウジ ニ トビツイタ！\n「タマ！？ イキテ イタノカ...」\n「モウ ヌスミ ハ ヤメル...」',
        choices: [
            { text: 'サンポ ニ モドル', act: 'move', to: 'epilogue_walk' },
            { text: 'フタリスキ ヲ ミマモル', act: 'move', to: 'epilogue_cat' },
            { text: 'マチ ヘ アルク', act: 'move', to: 'epilogue_hardboiled' }
        ]
    },

    epilogue_walk: {
        name: 'サンポ ミチ',
        text: 'ジケン ハ オワッタ。\nココチヨイ カゼ ガ フイテイル。\nキョウ モ イイ サンポ だっタ。\nマタ アシタ モ、アルコウ。',
        choices: [
            { text: 'THE END', act: 'reset' },
            { text: 'モウ イチド', act: 'start' },
            { text: 'クレジット', act: 'move', to: 'title_credits' }
        ]
    },
    epilogue_hardboiled: {
        name: 'ユウグレ ノ マチ',
        text: 'マチ ニ ヒ ガ シズム...。\nレイ ヲ イワレル ノハ ニガテ ダ。\nオレ ハ タダ ノ、トオリスガリ ノ サンポシャ。\nクツヒモ ヲ ムスビ ナオシ、マタ アルキ ダス。',
        choices: [
            { text: '■ FIN ■', act: 'reset' },
            { text: 'モウ イチド', act: 'start' },
            { text: 'クレジット', act: 'move', to: 'title_credits' }
        ]
    },
    epilogue_police: {
        name: 'ケイサツ',
        text: 'ショウコ ト トモ ニ、ジケン ハ トジタ。\nケイカン ガ フシギソウ ニ キイテクル。\n「キミ ハ... ダレダイ？」\n「...サンポシャ デス」',
        choices: [
            { text: '■ FIN ■', act: 'reset' },
            { text: 'モウ イチド', act: 'start' },
            { text: 'クレジット', act: 'move', to: 'title_credits' }
        ]
    },
    epilogue_reiko: {
        name: 'エキ マエ',
        text: 'レイコ「...アリガトウ」\nカノジョ ノ エガオ ハ、アメアガリ ノ ソラ ノ ヨウダ。\nアニ ト イモウト ハ、ヤット フタリスキ ニ ナッタ。',
        choices: [
            { text: '■ FIN ■', act: 'reset' },
            { text: 'モウ イチド', act: 'start' },
            { text: 'クレジット', act: 'move', to: 'title_credits' }
        ]
    },
    epilogue_cat: {
        name: 'ミナト',
        text: 'タマ ハ リュウジ ノ アシモト デ ゴロゴロ ナル。\nヌスミ モ、ニゲミチ モ、モウ イラナイ。\nネコ ト ヒト ノ、アタラシイ ハジマリ ダ。',
        choices: [
            { text: 'THE END', act: 'reset' },
            { text: 'モウ イチド', act: 'start' },
            { text: 'クレジット', act: 'move', to: 'title_credits' }
        ]
    }
};
