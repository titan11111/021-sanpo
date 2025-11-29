/* =========================================
   8-Bit Detective Style (Updated for iOS/Mobile)
   ========================================= */
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* iOSでのタップハイライトを無効化 */
    -webkit-tap-highlight-color: transparent;
}

body {
    font-family: 'DotGothic16', sans-serif;
    background-color: #111;
    color: #fff;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    overflow-x: hidden;
    /* ダブルタップズーム防止 */
    touch-action: manipulation; 
}

/* 走査線 */
.scanline {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 9999;
}

/* ゲームコンテナ */
.game-container {
    width: 100%;
    max-width: 600px; /* スマホで見やすい幅 */
    background: #000;
    border: 4px solid #eee;
    padding: 15px; /* 余白を少し広げる */
    position: relative;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
    display: flex;
    flex-direction: column;
    min-height: 95vh; /* 画面いっぱい使う */
}

/* ★GAME OVER演出★ */
.game-container.game-over-mode {
    border-color: #ff0000;
    box-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

.game-over-text {
    color: #ff3333;
    font-size: 32px;
    font-weight: bold;
    text-shadow: 4px 4px #550000;
    margin-bottom: 20px;
    text-align: center;
    animation: blinkText 1s infinite;
}

@keyframes shake {
    10%, 90% { transform: translate3d(-2px, 0, 0); }
    20%, 80% { transform: translate3d(4px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
    40%, 60% { transform: translate3d(6px, 0, 0); }
}

@keyframes blinkText {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

/* ヘッダー */
.header {
    margin-bottom: 15px;
    text-align: center;
    border-bottom: 2px dashed #444;
    padding-bottom: 10px;
}

.header h1 {
    font-size: 22px; /* 少し大きく */
    color: #ff3333;
    text-shadow: 2px 2px #fff;
    margin-bottom: 10px;
    letter-spacing: 2px;
}

.stats-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 10px;
    font-size: 18px;
}

.stat-box {
    background: #0000bb;
    padding: 5px 15px;
    border: 2px solid #fff;
    box-shadow: 2px 2px 0 #000;
    border-radius: 4px;
}

/* ゲーム画面メイン */
.main-display {
    border: 4px double #fff;
    background: #111;
    margin-bottom: 15px;
    padding: 10px;
    flex-grow: 1; /* 画面の余白を埋める */
}

.scene-view {
    height: 140px; /* 絵を大きく */
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
    border-bottom: 2px solid #fff;
    margin-bottom: 10px;
}

.location-icon {
    font-size: 80px; /* アイコン巨大化 */
    image-rendering: pixelated; 
    filter: drop-shadow(4px 4px 0 #333);
}

/* メッセージウィンドウ */
.message-window {
    position: relative;
    padding: 5px;
}

.location-label {
    background: #fff;
    color: #000;
    display: inline-block;
    padding: 4px 12px;
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 14px;
}

.story-text {
    line-height: 1.8;
    font-size: 18px; /* 読みやすいサイズ */
    color: #eee;
    text-shadow: 1px 1px 0 #000;
    white-space: pre-wrap; /* 改行を反映 */
}

/* 選択肢ボタンエリア */
.choices-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 10px 0;
    margin-top: auto; /* 下部に寄せる */
}

.choice-btn {
    background: #000;
    color: #fff;
    border: 2px solid #fff;
    padding: 18px; /* 指で押しやすい広さ */
    font-family: 'DotGothic16', sans-serif;
    font-size: 18px;
    cursor: pointer;
    text-align: left;
    position: relative;
    transition: transform 0.1s, background 0.1s;
    box-shadow: 4px 4px 0 #333;
    border-radius: 8px; /* 角を少し丸く */
    line-height: 1.4;
}

.choice-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #333;
    background: #222;
}

/* PCのみホバー効果 */
@media (hover: hover) {
    .choice-btn:hover {
        background: #333;
    }
    .choice-btn:hover::before {
        content: '▶';
        position: absolute;
        left: 5px;
        color: #ff3333;
    }
}

/* プログレスバー */
.progress-bar {
    height: 10px;
    border: 2px solid #fff;
    padding: 1px;
    margin-top: 10px;
    border-radius: 5px;
}

.progress-fill {
    height: 100%;
    background: #ff3333;
    width: 0%;
    transition: width 0.5s;
}

/* ポップアップ */
.treasure-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    display: none;
    width: 80%;
    max-width: 300px;
}

.treasure-popup.show {
    display: block;
    animation: popupAnim 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popupAnim {
    from { transform: translate(-50%, -50%) scale(0); }
    to { transform: translate(-50%, -50%) scale(1); }
}

.popup-border {
    background: #000;
    border: 4px solid #fff;
    padding: 30px;
    text-align: center;
    box-shadow: 0 0 20px rgba(0,0,0,0.8);
    border-radius: 10px;
}

.treasure-text {
    color: #ffff00;
    margin-top: 15px;
    font-size: 22px;
    font-weight: bold;
}

/* オーディオボタン */
.audio-control button {
    background: rgba(0,0,0,0.5);
    border: 1px solid #666;
    color: #666;
    font-family: 'DotGothic16', sans-serif;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 4px;
}
.audio-control button.active {
    border: 1px solid #0f0;
    color: #0f0;
    background: rgba(0, 50, 0, 0.5);
}

/* ログ・コレクション画面 */
.diary-screen, .treasure-collection {
    background: #000;
    padding: 15px;
    border: 2px solid #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 50;
    overflow-y: auto;
}
