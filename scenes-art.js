/* =========================================
   Portopia-style pixel scene backgrounds
   Logical canvas: 256×144 (NES-ish aspect)
   ========================================= */
const SceneArt = (() => {
    const W = 256;
    const H = 144;

    const C = {
        black: '#000000',
        white: '#fcfcfc',
        gray: '#787878',
        dgray: '#404040',
        sky: '#3cbcfc',
        dusk: '#0058f8',
        night: '#000088',
        nnight: '#000040',
        green: '#00a800',
        dgreen: '#005800',
        lime: '#b8f818',
        brown: '#a84800',
        dbrown: '#503000',
        sand: '#f8d878',
        red: '#e83800',
        dred: '#880000',
        blue: '#0058f8',
        cyan: '#00e8d8',
        yellow: '#f8b800',
        orange: '#f87858',
        pink: '#f878f8',
        purple: '#8870f8',
        skin: '#f8b878',
        water: '#3cbcfc',
        dwater: '#0058f8'
    };

    let canvas, ctx;

    function init(canvasEl) {
        canvas = canvasEl;
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
    }

    function fill(color, x, y, w, h) {
        ctx.fillStyle = color;
        ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
    }

    function rect(color, x, y, w, h) {
        fill(color, x, y, w, h);
    }

    function hline(color, x, y, w) {
        fill(color, x, y, w, 1);
    }

    function vline(color, x, y, h) {
        fill(color, x, y, 1, h);
    }

    function dither(c1, c2, x, y, w, h) {
        for (let py = 0; py < h; py++) {
            for (let px = 0; px < w; px++) {
                fill(((px + py) & 1) ? c1 : c2, x + px, y + py, 1, 1);
            }
        }
    }

    /* --- primitives --- */
    function tree(tx, ty, big) {
        const trunkW = big ? 6 : 4;
        const trunkH = big ? 28 : 18;
        const crown = big ? 22 : 14;
        fill(C.dbrown, tx, ty - trunkH, trunkW, trunkH);
        fill(C.dgreen, tx - crown / 2 + trunkW / 2, ty - trunkH - crown + 4, crown, crown);
        fill(C.green, tx - crown / 2 + trunkW / 2 + 2, ty - trunkH - crown + 6, crown - 4, crown - 6);
        fill(C.lime, tx - 2, ty - trunkH - crown + 8, 4, 3);
    }

    function bush(bx, by) {
        fill(C.dgreen, bx, by - 10, 18, 10);
        fill(C.green, bx + 2, by - 12, 14, 8);
        fill(C.lime, bx + 5, by - 10, 3, 2);
    }

    function windowPane(wx, wy, lit) {
        fill(C.dgray, wx, wy, 10, 10);
        fill(lit ? C.yellow : C.cyan, wx + 1, wy + 1, 8, 8);
        hline(C.black, wx, wy + 5, 10);
        vline(C.black, wx + 5, wy, 10);
    }

    function person(px, py, shirt, hat) {
        // 主人公（ネコより大きく見えるサイズ）
        // 頭
        fill(C.skin, px + 3, py - 30, 8, 8);
        fill(C.dgray, px + 3, py - 32, 8, 3); // 髪
        if (hat) fill(hat, px + 2, py - 34, 10, 4);
        // 胴
        fill(shirt || C.blue, px + 2, py - 22, 10, 12);
        fill(C.cyan, px + 4, py - 18, 6, 3);
        // 腕
        fill(C.skin, px - 1, py - 20, 3, 8);
        fill(C.skin, px + 12, py - 20, 3, 8);
        // 脚
        fill(C.blue, px + 2, py - 10, 4, 10);
        fill(C.blue, px + 8, py - 10, 4, 10);
        // 靴
        fill(C.black, px + 1, py, 5, 3);
        fill(C.black, px + 8, py, 5, 3);
    }

    function cat(cx, cy) {
        // 小さな座りネコ（短耳・人間より低く小さく）
        // 胴（横長）
        fill(C.orange, cx, cy - 8, 14, 8);
        fill(C.sand, cx + 3, cy - 5, 8, 4);
        // 頭（丸く小さめ）
        fill(C.orange, cx + 1, cy - 14, 10, 8);
        fill(C.sand, cx + 3, cy - 11, 6, 4);
        // 短耳（うさぎ耳にしない：高さ2〜3px）
        fill(C.orange, cx + 2, cy - 17, 3, 3);
        fill(C.orange, cx + 8, cy - 17, 3, 3);
        fill(C.pink, cx + 3, cy - 16, 1, 1);
        fill(C.pink, cx + 9, cy - 16, 1, 1);
        // 目・鼻
        fill(C.black, cx + 3, cy - 12, 2, 2);
        fill(C.black, cx + 8, cy - 12, 2, 2);
        fill(C.white, cx + 3, cy - 12, 1, 1);
        fill(C.white, cx + 8, cy - 12, 1, 1);
        fill(C.pink, cx + 5, cy - 9, 2, 1);
        // ひげ（短く）
        fill(C.white, cx - 2, cy - 10, 3, 1);
        fill(C.white, cx + 11, cy - 10, 3, 1);
        // 前足
        fill(C.sand, cx + 3, cy - 2, 3, 3);
        fill(C.sand, cx + 8, cy - 2, 3, 3);
        // しっぽ（横へ低くカーブ＝ネコ）
        fill(C.orange, cx + 13, cy - 6, 5, 2);
        fill(C.orange, cx + 16, cy - 9, 2, 4);
    }

    function leafCluster(x, y, w, h) {
        fill(C.dgreen, x, y, w, h);
        fill(C.green, x + 2, y + 2, w - 4, h - 5);
        fill(C.lime, x + 4, y + 3, 3, 2);
        fill(C.lime, x + w - 8, y + 6, 3, 2);
    }

    function drawBushClose(opts) {
        // 茂みの中：葉に囲まれた隙間からネコが覗く
        skyDay();
        // 遠景の緑の壁
        fill(C.dgreen, 0, 40, W, H - 40);
        fill(C.green, 0, 55, W, H - 55);

        // 奥の葉（ネコの後ろ）
        leafCluster(8, 50, 70, 55);
        leafCluster(178, 48, 70, 58);
        leafCluster(0, 85, 55, 50);
        leafCluster(200, 80, 56, 55);
        bush(20, 100);
        bush(210, 105);

        // 中央のすき間（土＋光）
        fill(C.dbrown, 70, 95, 116, 45);
        fill(C.brown, 78, 100, 100, 35);
        fill(C.sand, 90, 108, 76, 20);
        // すき間に差し込む光
        dither(C.lime, C.green, 85, 70, 90, 18);

        // ネコ（すき間の中央・小さめ）
        if (opts.angry) {
            cat(112, 124);
            fill(C.yellow, 108, 100, 4, 4);
            fill(C.yellow, 128, 100, 4, 4);
            fill(C.red, 114, 96, 12, 3);
        } else if (opts.happy) {
            cat(112, 124);
            fill(C.pink, 102, 100, 5, 5);
            fill(C.pink, 132, 100, 5, 5);
        } else {
            cat(112, 124);
        }

        // 手前の葉（ネコの下半身を少し隠す＝茂みの中感）
        leafCluster(40, 110, 50, 40);
        leafCluster(165, 108, 55, 42);
        bush(55, 138);
        bush(170, 140);
        fill(C.dgreen, 0, 125, 45, 20);
        fill(C.dgreen, 210, 125, 46, 20);
        fill(C.green, 85, 128, 30, 16);
        fill(C.green, 145, 128, 28, 16);
        // 枝
        fill(C.dbrown, 95, 75, 18, 3);
        fill(C.dbrown, 145, 78, 22, 3);
        fill(C.dbrown, 60, 100, 3, 25);
        fill(C.dbrown, 190, 95, 3, 28);
    }

    function car(cx, cy, body) {
        fill(body, cx, cy - 10, 36, 10);
        fill(body, cx + 6, cy - 18, 22, 8);
        fill(C.cyan, cx + 10, cy - 16, 6, 5);
        fill(C.cyan, cx + 18, cy - 16, 6, 5);
        fill(C.black, cx + 4, cy - 2, 8, 4);
        fill(C.black, cx + 24, cy - 2, 8, 4);
        fill(C.red, cx + 34, cy - 8, 3, 3);
    }

    /** パトカー（サイレンは屋根中央に左右対称） */
    function policeCar(cx, cy) {
        // 車体
        fill(C.white, cx, cy - 10, 40, 10);
        fill(C.dgray, cx + 2, cy - 6, 36, 3); // 黒帯
        fill(C.white, cx + 4, cy - 5, 8, 1);
        fill(C.white, cx + 28, cy - 5, 8, 1);
        // キャビン（中央寄せ）
        fill(C.white, cx + 8, cy - 18, 24, 8);
        fill(C.cyan, cx + 10, cy - 16, 8, 5);
        fill(C.cyan, cx + 20, cy - 16, 8, 5);
        fill(C.dgray, cx + 18, cy - 16, 2, 5); // 柱
        // サイレンバー（屋根ど真ん中・赤｜青）
        fill(C.black, cx + 14, cy - 22, 12, 4);
        fill(C.red, cx + 15, cy - 21, 5, 2);
        fill(C.blue, cx + 20, cy - 21, 5, 2);
        // タイヤ
        fill(C.black, cx + 4, cy - 2, 8, 4);
        fill(C.black, cx + 28, cy - 2, 8, 4);
        fill(C.gray, cx + 6, cy - 1, 4, 2);
        fill(C.gray, cx + 30, cy - 1, 4, 2);
        // ライト
        fill(C.yellow, cx, cy - 8, 3, 3);
        fill(C.red, cx + 37, cy - 8, 3, 3);
    }

    function skyDay() {
        fill(C.sky, 0, 0, W, 90);
        fill(C.white, 30, 12, 28, 10);
        fill(C.white, 40, 8, 18, 8);
        fill(C.white, 160, 18, 36, 12);
        fill(C.white, 172, 14, 20, 8);
        fill(C.yellow, 220, 10, 14, 14);
        fill(C.sand, 222, 12, 10, 10);
    }

    function skyDusk() {
        fill(C.dusk, 0, 0, W, 50);
        fill(C.orange, 0, 50, W, 25);
        fill(C.red, 0, 75, W, 15);
        fill(C.yellow, 200, 20, 18, 14);
        fill(C.orange, 204, 24, 10, 8);
        dither(C.orange, C.dusk, 0, 48, W, 8);
    }

    function skyNight() {
        fill(C.nnight, 0, 0, W, 90);
        fill(C.night, 0, 70, W, 20);
        const stars = [[20, 10], [40, 25], [70, 8], [100, 30], [130, 12], [160, 22], [190, 6], [220, 28], [240, 14]];
        stars.forEach(([x, y]) => fill(C.white, x, y, 2, 2));
        fill(C.sand, 210, 12, 12, 12);
        fill(C.yellow, 212, 14, 8, 8);
    }

    function groundGrass(y) {
        fill(C.dgreen, 0, y, W, H - y);
        fill(C.green, 0, y, W, 4);
        for (let x = 0; x < W; x += 8) {
            fill(C.lime, x + (x % 16 ? 2 : 0), y + 2, 2, 3);
        }
    }

    function groundStreet(y) {
        fill(C.dgray, 0, y, W, H - y);
        fill(C.gray, 0, y, W, 3);
        for (let x = 8; x < W; x += 24) {
            fill(C.yellow, x, y + 18, 10, 2);
        }
    }

    function groundFloor(y) {
        fill(C.dbrown, 0, y, W, H - y);
        for (let x = 0; x < W; x += 16) {
            hline(C.brown, x, y + 12, 14);
            hline(C.brown, x + 8, y + 28, 14);
        }
    }

    /* --- scenes --- */
    function drawTitle() {
        skyDusk();
        groundGrass(95);
        tree(30, 120, true);
        tree(210, 118, false);
        bush(90, 118);
        bush(150, 120);
        // walking path
        fill(C.sand, 110, 100, 36, 44);
        fill(C.brown, 112, 100, 32, 44);
        person(116, 126, C.blue, C.dgray);
        // title plate
        fill(C.black, 48, 28, 160, 28);
        fill(C.white, 50, 30, 156, 24);
        fill(C.black, 54, 34, 148, 16);
    }

    function drawPark(opts) {
        skyDay();
        groundGrass(95);
        tree(16, 118, true);
        tree(200, 116, true);
        tree(120, 110, false);
        bush(70, 118);
        bush(160, 120);
        fill(C.sand, 100, 100, 50, 44);
        fill(C.brown, 104, 102, 42, 42);
        // bench
        fill(C.brown, 40, 108, 28, 4);
        fill(C.dbrown, 42, 112, 4, 8);
        fill(C.dbrown, 62, 112, 4, 8);
        if (opts.cat) cat(148, 126);
        if (opts.partner) cat(142, 126);
        person(114, 126, C.blue, null);
    }

    function drawConvenience() {
        skyDay();
        groundStreet(110);
        // store building
        fill(C.white, 40, 40, 176, 70);
        fill(C.red, 40, 30, 176, 14);
        fill(C.yellow, 50, 34, 40, 6);
        fill(C.cyan, 55, 55, 50, 40);
        fill(C.cyan, 120, 55, 50, 40);
        fill(C.black, 55, 75, 50, 2);
        fill(C.black, 120, 75, 50, 2);
        // door
        fill(C.blue, 185, 60, 22, 50);
        fill(C.cyan, 190, 70, 6, 10);
        // sign
        fill(C.red, 70, 18, 110, 16);
        fill(C.white, 78, 22, 94, 8);
        person(100, 125, C.orange, null);
        // snack shelf hint
        fill(C.yellow, 60, 95, 8, 8);
    }

    function drawMansionFront() {
        skyDay();
        groundStreet(115);
        // mansion
        fill(C.gray, 50, 35, 156, 80);
        fill(C.dgray, 40, 28, 176, 12);
        fill(C.white, 110, 8, 36, 28);
        fill(C.red, 118, 4, 20, 8);
        windowPane(70, 50, false);
        windowPane(100, 50, true);
        windowPane(145, 50, false);
        windowPane(175, 50, true);
        windowPane(70, 75, false);
        windowPane(175, 75, false);
        // door
        fill(C.dbrown, 118, 78, 24, 37);
        fill(C.yellow, 134, 96, 3, 3);
        // police tape
        fill(C.yellow, 30, 108, 196, 4);
        fill(C.black, 40, 108, 8, 4);
        fill(C.black, 70, 108, 8, 4);
        fill(C.black, 100, 108, 8, 4);
        policeCar(20, 130);
        person(200, 128, C.blue, C.dgray);
    }

    function drawPolice() {
        skyDay();
        groundStreet(115);
        fill(C.gray, 0, 40, W, 75);
        windowPane(40, 55, false);
        windowPane(80, 55, true);
        policeCar(140, 130);
        person(60, 128, C.blue, C.dgray);
        person(100, 128, C.orange, null);
    }

    function drawMansionBack(opts) {
        skyDay();
        groundGrass(100);
        // back wall
        fill(C.gray, 0, 30, W, 70);
        fill(C.dgray, 0, 28, W, 4);
        windowPane(30, 50, false);
        windowPane(70, 50, opts.unlocked);
        windowPane(200, 50, false);
        // doghouse
        fill(C.brown, 150, 85, 40, 28);
        fill(C.red, 145, 75, 50, 12);
        fill(C.black, 160, 95, 16, 18);
        if (opts.dogAwake) {
            fill(C.sand, 168, 108, 14, 10);
            fill(C.black, 172, 110, 2, 2);
            fill(C.black, 178, 110, 2, 2);
        } else {
            fill(C.dgray, 166, 108, 12, 6);
        }
        // shed hint
        fill(C.dbrown, 210, 80, 40, 40);
        fill(C.brown, 215, 70, 30, 12);
        person(100, 125, C.blue, null);
        if (opts.locked) {
            fill(C.yellow, 74, 55, 4, 4);
            fill(C.black, 75, 56, 2, 2);
        }
    }

    function drawShed() {
        fill(C.dbrown, 0, 0, W, H);
        // shelves
        fill(C.brown, 20, 30, 80, 8);
        fill(C.brown, 20, 60, 80, 8);
        fill(C.brown, 20, 90, 80, 8);
        fill(C.gray, 30, 38, 12, 18);
        fill(C.gray, 55, 68, 16, 14);
        fill(C.yellow, 160, 70, 20, 4);
        fill(C.gray, 158, 74, 24, 30);
        // wire highlight
        fill(C.cyan, 170, 100, 30, 2);
        fill(C.cyan, 175, 102, 2, 12);
        // light shaft
        dither(C.yellow, C.dbrown, 100, 0, 40, 60);
        person(120, 130, C.blue, null);
    }

    function drawHall(opts) {
        fill(C.nnight, 0, 0, W, 90);
        groundFloor(90);
        // walls
        fill(C.dgray, 0, 20, W, 70);
        fill(C.gray, 20, 30, 60, 60);
        fill(C.gray, 176, 30, 60, 60);
        // corridor perspective
        fill(C.black, 100, 35, 56, 55);
        fill(C.dgray, 110, 42, 36, 40);
        // desk
        fill(C.brown, 30, 70, 50, 20);
        fill(C.dbrown, 32, 68, 46, 4);
        if (opts.locked) {
            fill(C.gray, 48, 72, 14, 10);
            fill(C.yellow, 52, 75, 6, 4);
        } else {
            fill(C.sand, 48, 72, 14, 10);
            fill(C.yellow, 50, 74, 4, 3);
        }
        // painting
        fill(C.dred, 190, 40, 28, 24);
        fill(C.orange, 194, 44, 20, 16);
        person(130, 125, C.blue, null);
    }

    function drawDining() {
        fill(C.nnight, 0, 0, W, 40);
        fill(C.dgray, 0, 40, W, 50);
        groundFloor(90);
        // table
        fill(C.brown, 60, 85, 136, 10);
        fill(C.dbrown, 70, 95, 8, 30);
        fill(C.dbrown, 178, 95, 8, 30);
        // chairs
        fill(C.dbrown, 50, 88, 14, 20);
        fill(C.dbrown, 192, 88, 14, 20);
        // chandelier
        fill(C.yellow, 118, 20, 20, 8);
        fill(C.sand, 124, 28, 8, 16);
        // memo on table
        fill(C.white, 120, 80, 16, 10);
        fill(C.red, 122, 82, 12, 2);
        person(40, 125, C.blue, null);
    }

    function drawStudy() {
        fill(C.nnight, 0, 0, W, H);
        groundFloor(100);
        fill(C.dbrown, 20, 30, 100, 70);
        // bookshelf
        for (let row = 0; row < 4; row++) {
            fill(C.brown, 30, 40 + row * 14, 80, 3);
            fill(C.red, 35, 42 + row * 14, 8, 10);
            fill(C.blue, 48, 42 + row * 14, 8, 10);
            fill(C.green, 61, 42 + row * 14, 8, 10);
            fill(C.yellow, 74, 42 + row * 14, 8, 10);
        }
        // desk open
        fill(C.brown, 140, 70, 70, 30);
        fill(C.sand, 150, 78, 40, 16);
        fill(C.white, 158, 82, 20, 10);
        fill(C.dred, 160, 84, 16, 2);
        person(200, 125, C.blue, null);
    }

    function drawTown() {
        skyNight();
        groundStreet(100);
        // buildings
        fill(C.dgray, 0, 40, 70, 60);
        fill(C.gray, 80, 25, 60, 75);
        fill(C.dgray, 160, 45, 96, 55);
        windowPane(15, 55, true);
        windowPane(40, 55, false);
        windowPane(95, 40, true);
        windowPane(120, 40, true);
        windowPane(95, 65, false);
        windowPane(180, 55, true);
        windowPane(210, 55, true);
        // neon bar sign
        fill(C.pink, 85, 18, 50, 10);
        fill(C.black, 90, 20, 40, 6);
        person(130, 125, C.blue, null);
        // street lamp
        fill(C.gray, 50, 70, 4, 30);
        fill(C.yellow, 44, 66, 16, 8);
        dither(C.yellow, C.nnight, 30, 75, 40, 25);
    }

    function drawBar() {
        fill(C.nnight, 0, 0, W, H);
        fill(C.dbrown, 0, 90, W, 54);
        // bar counter
        fill(C.brown, 20, 80, 180, 14);
        fill(C.dgray, 20, 50, 180, 30);
        // bottles
        fill(C.cyan, 40, 55, 6, 18);
        fill(C.red, 55, 58, 6, 15);
        fill(C.green, 70, 52, 6, 21);
        fill(C.yellow, 85, 56, 6, 17);
        fill(C.pink, 100, 54, 6, 19);
        // stools
        fill(C.gray, 50, 94, 12, 4);
        fill(C.gray, 90, 94, 12, 4);
        fill(C.gray, 130, 94, 12, 4);
        person(70, 110, C.dgray, null);
        person(150, 125, C.blue, null);
        // neon
        fill(C.pink, 200, 20, 40, 50);
        fill(C.black, 208, 30, 24, 30);
    }

    function drawFortune() {
        fill(C.nnight, 0, 0, W, H);
        fill(C.purple, 40, 30, 176, 90);
        fill(C.dgray, 50, 40, 156, 70);
        // crystal ball
        fill(C.cyan, 110, 70, 36, 36);
        fill(C.white, 118, 78, 10, 10);
        fill(C.purple, 130, 90, 8, 8);
        // curtains
        fill(C.dred, 40, 30, 16, 90);
        fill(C.red, 200, 30, 16, 90);
        person(70, 120, C.purple, C.yellow);
        person(170, 125, C.blue, null);
    }

    function drawStation(opts) {
        skyDay();
        groundStreet(105);
        // station building
        fill(C.gray, 20, 35, 216, 70);
        fill(C.dgray, 10, 28, 236, 12);
        fill(C.white, 30, 45, 50, 50);
        fill(C.white, 100, 45, 50, 50);
        fill(C.white, 170, 45, 50, 50);
        fill(C.blue, 40, 55, 30, 30);
        fill(C.blue, 110, 55, 30, 30);
        fill(C.blue, 180, 55, 30, 30);
        // clock
        fill(C.white, 118, 10, 20, 20);
        fill(C.black, 127, 14, 2, 8);
        fill(C.black, 127, 18, 6, 2);
        // bench
        fill(C.brown, 70, 112, 50, 5);
        fill(C.dbrown, 74, 117, 4, 10);
        fill(C.dbrown, 110, 117, 4, 10);
        if (opts.lady) person(90, 112, C.pink, C.red);
        person(40, 128, C.blue, null);
        // crowd silhouettes
        fill(C.dgray, 200, 115, 8, 16);
        fill(C.dgray, 212, 112, 8, 19);
        fill(C.dgray, 224, 116, 8, 15);
    }

    function drawHarbor() {
        skyDusk();
        // sea
        fill(C.dwater, 0, 85, W, 59);
        dither(C.water, C.dwater, 0, 85, W, 20);
        for (let x = 0; x < W; x += 16) {
            hline(C.cyan, x, 95 + (x % 32 ? 2 : 0), 8);
        }
        // pier
        fill(C.dbrown, 0, 100, W, 12);
        for (let x = 10; x < W; x += 20) {
            fill(C.brown, x, 112, 6, 32);
        }
        // warehouse far
        fill(C.dgray, 160, 50, 80, 50);
        fill(C.gray, 170, 60, 20, 30);
        fill(C.gray, 200, 60, 20, 30);
        // boat
        fill(C.white, 40, 88, 50, 12);
        fill(C.red, 40, 84, 40, 6);
        fill(C.dgray, 70, 70, 4, 18);
        person(100, 100, C.blue, null);
        cat(120, 102);
        // fisherman
        person(200, 100, C.orange, C.yellow);
    }

    /** コウエン→ゴウテイの散歩道 */
    function drawParkPath() {
        skyDay();
        groundGrass(100);
        tree(20, 120, true);
        tree(210, 118, false);
        bush(50, 118);
        bush(180, 120);
        // path
        fill(C.sand, 90, 100, 76, 44);
        fill(C.brown, 100, 102, 56, 42);
        // distant mansion roof tip
        fill(C.gray, 150, 40, 50, 28);
        fill(C.red, 160, 34, 30, 10);
        fill(C.white, 168, 20, 14, 18);
        person(110, 126, C.blue, null);
        cat(130, 128);
    }

    /** マチカド：パトカーの灯り */
    function drawStreetCorner() {
        skyDay();
        groundStreet(110);
        fill(C.dgray, 0, 35, 70, 75);
        fill(C.gray, 80, 40, 90, 70);
        windowPane(20, 50, false);
        windowPane(95, 55, true);
        windowPane(130, 55, false);
        // road to mansion
        fill(C.dgray, 180, 50, 76, 60);
        fill(C.yellow, 40, 108, 140, 3);
        policeCar(150, 128);
        person(70, 126, C.blue, null);
        // street lamp
        fill(C.gray, 50, 70, 4, 40);
        fill(C.yellow, 44, 66, 16, 8);
    }

    /** 夜の裏道：屋敷を後に */
    function drawNightAlleyExit() {
        skyNight();
        groundStreet(108);
        fill(C.dgray, 0, 20, 50, 90);
        fill(C.gray, 60, 30, 70, 80);
        fill(C.dgray, 150, 25, 50, 85);
        windowPane(75, 45, true);
        windowPane(100, 45, false);
        windowPane(165, 40, true);
        // street lamp glow
        fill(C.gray, 210, 55, 4, 55);
        fill(C.yellow, 204, 50, 16, 10);
        dither(C.yellow, C.nnight, 190, 70, 50, 40);
        person(120, 125, C.blue, null);
        // letter hint glow in pocket area (small cyan)
        fill(C.cyan, 128, 118, 4, 4);
    }

    /** 港への道路 */
    function drawDockRoad() {
        skyDusk();
        groundStreet(100);
        fill(C.dwater, 180, 70, 76, 74);
        dither(C.water, C.dwater, 180, 80, 76, 30);
        // warehouses ahead
        fill(C.dgray, 40, 40, 60, 60);
        fill(C.gray, 110, 35, 70, 65);
        fill(C.dgray, 50, 50, 16, 20);
        fill(C.dgray, 130, 50, 16, 20);
        // footprints
        fill(C.dbrown, 80, 115, 6, 3);
        fill(C.dbrown, 95, 118, 6, 3);
        fill(C.dbrown, 110, 116, 6, 3);
        person(90, 125, C.blue, null);
        // sea wind lines
        hline(C.cyan, 200, 90, 20);
        hline(C.cyan, 210, 100, 16);
    }

    /** 倉庫前 */
    function drawWarehouseApproach() {
        skyNight();
        groundStreet(110);
        // big warehouse door
        fill(C.dgray, 40, 20, 176, 90);
        fill(C.gray, 50, 30, 156, 70);
        fill(C.dbrown, 100, 45, 56, 70);
        fill(C.yellow, 148, 75, 4, 4);
        // light leak
        dither(C.yellow, C.dgray, 110, 50, 36, 50);
        fill(C.yellow, 120, 10, 16, 12);
        person(70, 125, C.blue, null);
        // crates outside
        fill(C.brown, 20, 100, 24, 20);
        fill(C.dbrown, 200, 105, 30, 18);
    }

    function drawAlley(opts) {
        fill(C.nnight, 0, 0, W, H);
        fill(C.dgray, 0, 0, 60, H);
        fill(C.dgray, 196, 0, 60, H);
        groundStreet(110);
        // trash
        fill(C.gray, 70, 95, 30, 25);
        fill(C.dgray, 110, 100, 28, 22);
        fill(C.green, 75, 90, 12, 8);
        if (opts.gem) {
            fill(C.cyan, 120, 108, 10, 8);
            fill(C.white, 122, 110, 3, 3);
        }
        // graffiti
        fill(C.red, 20, 40, 20, 8);
        fill(C.yellow, 210, 50, 24, 6);
        person(150, 125, C.blue, null);
        if (opts.danger) {
            fill(C.sand, 80, 120, 16, 10);
            fill(C.sand, 100, 118, 14, 12);
            fill(C.black, 84, 122, 2, 2);
            fill(C.black, 104, 120, 2, 2);
        }
    }

    function drawWarehouse(opts) {
        fill(C.nnight, 0, 0, W, 40);
        fill(C.dgray, 0, 40, W, 70);
        groundFloor(110);
        // crates
        fill(C.brown, 20, 90, 40, 30);
        fill(C.dbrown, 30, 80, 40, 30);
        fill(C.brown, 180, 85, 50, 35);
        // hanging lamp
        fill(C.gray, 124, 20, 8, 20);
        fill(C.yellow, 110, 40, 36, 12);
        dither(C.yellow, C.dgray, 80, 52, 96, 40);
        person(90, 125, C.blue, null);
        person(150, 125, C.dred, C.black);
        if (opts.family) {
            person(180, 125, C.pink, C.red);
        }
        if (opts.cat) cat(120, 130);
        if (opts.police) {
            policeCar(10, 140);
        }
    }

    function drawEndingWalk() {
        skyDay();
        groundGrass(95);
        tree(20, 120, true);
        tree(220, 118, true);
        bush(80, 118);
        fill(C.sand, 110, 100, 40, 44);
        fill(C.brown, 114, 102, 32, 42);
        person(120, 120, C.blue, null);
        cat(145, 122);
    }

    function drawEndingTown() {
        skyDusk();
        groundStreet(100);
        fill(C.dgray, 0, 40, 80, 60);
        fill(C.gray, 100, 30, 70, 70);
        fill(C.dgray, 190, 50, 66, 50);
        windowPane(20, 55, true);
        windowPane(50, 55, true);
        windowPane(120, 45, true);
        windowPane(145, 45, false);
        person(120, 125, C.blue, null);
        fill(C.gray, 60, 70, 4, 30);
        fill(C.yellow, 54, 66, 16, 8);
    }

    function drawBad() {
        fill(C.black, 0, 0, W, H);
        fill(C.dred, 0, 60, W, 40);
        fill(C.red, 100, 40, 56, 56);
        fill(C.black, 112, 55, 12, 12);
        fill(C.black, 132, 55, 12, 12);
        fill(C.black, 112, 78, 32, 8);
        person(40, 130, C.blue, null);
    }

    const DRAWS = {
        title: drawTitle,
        park: () => drawPark({}),
        park_cat: () => drawPark({ cat: true }),
        park_partner: () => drawPark({ partner: true }),
        bush: () => drawBushClose({}),
        bush_angry: () => drawBushClose({ angry: true }),
        bush_happy: () => drawBushClose({ happy: true }),
        convenience: drawConvenience,
        mansion_front: drawMansionFront,
        police: drawPolice,
        mansion_back: () => drawMansionBack({}),
        mansion_back_locked: () => drawMansionBack({ locked: true }),
        mansion_back_open: () => drawMansionBack({ unlocked: true }),
        dog: () => drawMansionBack({ dogAwake: true }),
        shed: drawShed,
        hall: () => drawHall({}),
        hall_locked: () => drawHall({ locked: true }),
        dining: drawDining,
        study: drawStudy,
        town: drawTown,
        bar: drawBar,
        fortune: drawFortune,
        station: () => drawStation({}),
        station_lady: () => drawStation({ lady: true }),
        harbor: drawHarbor,
        park_path: drawParkPath,
        street_corner: drawStreetCorner,
        night_alley_exit: drawNightAlleyExit,
        dock_road: drawDockRoad,
        warehouse_approach: drawWarehouseApproach,
        alley: () => drawAlley({}),
        alley_gem: () => drawAlley({ gem: true }),
        alley_danger: () => drawAlley({ danger: true }),
        warehouse: () => drawWarehouse({}),
        warehouse_family: () => drawWarehouse({ family: true }),
        warehouse_cat: () => drawWarehouse({ cat: true }),
        warehouse_police: () => drawWarehouse({ police: true }),
        ending_walk: drawEndingWalk,
        ending_town: drawEndingTown,
        bad: drawBad
    };

    /** sceneId → art key */
    const MAP = {
        title: 'title',
        title_hint: 'title',
        title_credits: 'title',
        start: 'park_cat',
        park_bench: 'park',
        park_bench_rest: 'park',
        park_bush: 'bush',
        cat_ignore: 'bush',
        cat_call: 'bush',
        cat_angry: 'bush_angry',
        convenience_store: 'convenience',
        convenience_magazine: 'convenience',
        cat_happy: 'bush_happy',
        cat_name: 'bush_happy',
        cat_happy_pet: 'bush_happy',
        park_done: 'park_partner',
        park_done_revisit: 'park',
        park_path: 'park_path',
        street_corner: 'street_corner',
        night_alley_exit: 'night_alley_exit',
        dock_road: 'dock_road',
        warehouse_approach: 'warehouse_approach',
        mansion_front: 'mansion_front',
        bad_end_tape: 'police',
        police_talk: 'police',
        police_detail: 'police',
        police_charm_fail: 'police',
        mansion_back: 'mansion_back_locked',
        bad_end_dog: 'dog',
        mansion_back_locked: 'mansion_back_locked',
        maid_talk: 'mansion_back',
        maid_more: 'mansion_back',
        maid_close: 'mansion_back',
        garden_shed: 'shed',
        shed_photo: 'shed',
        mansion_back_retry: 'mansion_back',
        dog_check: 'dog',
        mansion_inside_entry: 'mansion_back_open',
        mansion_inside_ready: 'mansion_back_open',
        mansion_inside_hall: 'hall_locked',
        mansion_inside_locked: 'hall_locked',
        mansion_dining: 'dining',
        dining_wine: 'dining',
        mansion_inside_retry: 'hall',
        mansion_inside_desk: 'study',
        desk_extra: 'study',
        mansion_inside_done: 'hall',
        letter_reread: 'hall',
        bad_end_encounter: 'bad',
        town_crossroad: 'town',
        bar_entry: 'bar',
        bar_more: 'bar',
        bar_drink: 'bar',
        fortune_teller: 'fortune',
        fortune_fate: 'fortune',
        fortune_normal: 'fortune',
        fortune_rare: 'fortune',
        fortune_done: 'town',
        station: 'station_lady',
        station_rain: 'station',
        station_rain_coat: 'station_lady',
        station_lady: 'station_lady',
        station_pass: 'station',
        station_lady_charm: 'station_lady',
        station_lady_normal: 'station',
        station_done: 'station',
        harbor_park: 'harbor',
        harbor_sea: 'harbor',
        fisherman: 'harbor',
        fisherman_more: 'harbor',
        alley: 'alley',
        bad_end_ambush: 'alley_danger',
        alley_checked: 'alley_gem',
        gem_gaze: 'alley_gem',
        warehouse: 'warehouse',
        warehouse_flee: 'warehouse',
        final_confrontation: 'warehouse',
        ending_bad_angry: 'bad',
        ending_bad_lie: 'bad',
        ending_true: 'warehouse_police',
        ending_family: 'warehouse_family',
        ending_peace: 'warehouse_cat',
        epilogue_walk: 'ending_walk',
        epilogue_hardboiled: 'ending_town',
        epilogue_police: 'police',
        epilogue_reiko: 'station_lady',
        epilogue_cat: 'ending_walk'
    };

    function draw(sceneId) {
        if (!ctx) return;
        const key = MAP[sceneId] || 'title';
        const fn = DRAWS[key] || drawTitle;
        ctx.clearRect(0, 0, W, H);
        fn();
        // CRT-ish frame
        hline(C.black, 0, 0, W);
        hline(C.black, 0, H - 1, W);
        vline(C.black, 0, 0, H);
        vline(C.black, W - 1, 0, H);
    }

    return { init, draw, W, H };
})();
