/* =========================
   BACKGROUND MUSIC
   (shared across all pages)
========================= */

const bgMusic = new Audio("theme.mp3");
bgMusic.loop = true;

const MUSIC_KEY_TIME = "triage_music_time";
const MUSIC_KEY_MUTED = "triage_music_muted";
const MUSIC_KEY_STARTED = "triage_music_started";

// obnov uloženou pozici v písničce
const savedTime = parseFloat(localStorage.getItem(MUSIC_KEY_TIME));
if(!isNaN(savedTime)){
    bgMusic.currentTime = savedTime;
}

// obnov nastavení ztlumení
const isMuted = localStorage.getItem(MUSIC_KEY_MUTED) === "true";
bgMusic.muted = isMuted;


function tryPlayMusic(){

    const promise = bgMusic.play();

    if(promise !== undefined){
        promise
            .then(() => {
                localStorage.setItem(MUSIC_KEY_STARTED, "true");
                updateMusicButton();
            })
            .catch(() => {
                // autoplay zablokován, čeká se na interakci
                updateMusicButton();
            });
    }

}


// pokud uživatel už dřív hudbu spustil (klikl), zkus pokračovat automaticky
if(localStorage.getItem(MUSIC_KEY_STARTED) === "true"){
    tryPlayMusic();
}


// ulož pozici pravidelně, ať navazuje mezi stránkami
setInterval(() => {
    if(!bgMusic.paused){
        localStorage.setItem(MUSIC_KEY_TIME, bgMusic.currentTime);
    }
}, 500);

window.addEventListener("beforeunload", () => {
    localStorage.setItem(MUSIC_KEY_TIME, bgMusic.currentTime);
});


// první klik kamkoliv na stránce spustí hudbu (pro případ, že autoplay neprojde)
document.addEventListener("click", function firstInteraction(){

    if(bgMusic.paused && localStorage.getItem(MUSIC_KEY_MUTED) !== "true"){
        tryPlayMusic();
    }

}, { once:false });


function toggleMusic(){

    const nowMuted = !bgMusic.muted;

    bgMusic.muted = nowMuted;

    localStorage.setItem(MUSIC_KEY_MUTED, nowMuted);

    if(!nowMuted && bgMusic.paused){
        tryPlayMusic();
    }

    updateMusicButton();

}


function updateMusicButton(){

    const btn = document.getElementById("musicToggle");

    if(!btn) return;

    btn.textContent = bgMusic.muted ? "🔇" : "🔊";

}


document.addEventListener("DOMContentLoaded", updateMusicButton);
