/* =========================
   LANGUAGE SYSTEM (CZ / EN)
========================= */

function getLang(){
    return localStorage.getItem("triage_lang") || "cz";
}

function setLang(lang){
    localStorage.setItem("triage_lang", lang);
    applyLang();
}

function toggleLang(){
    setLang(getLang() === "en" ? "cz" : "en");
}

function applyLang(){

    const lang = getLang();

    document.querySelectorAll("[data-cz]").forEach(el => {
        const text = el.getAttribute(lang === "en" ? "data-en" : "data-cz");
        if(text !== null) el.textContent = text;
    });

    const btn = document.getElementById("langToggle");
    if(btn) btn.textContent = lang === "en" ? "CZ" : "EN";

    document.documentElement.lang = lang;

    if(typeof onLangApplied === "function"){
        onLangApplied(lang);
    }

}

document.addEventListener("DOMContentLoaded", applyLang);
