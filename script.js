const bootScreen = document.getElementById("boot-screen");
const bootText = document.getElementById("boot-text");


const linesCZ = [

"TRIAGE TERMINÁL v1.2",

"",

"Inicializace systému...........OK",

"Načítání taktických modulů.....OK",

"Připojování k zabezpečené síti.OK",

"Synchronizace dat mise.........OK",

"Načítání evakuačního protokolu.OK",

"Kontrola databáze hráčů........OK",

"",

"SYSTÉM PŘIPRAVEN"

];


const linesEN = [

"TRIAGE TERMINAL v1.2",

"",

"Initializing system............OK",

"Loading tactical modules.......OK",

"Connecting secure network......OK",

"Synchronizing mission data.....OK",

"Loading extraction protocol....OK",

"Checking player database........OK",

"",

"SYSTEM ONLINE"

];


let lineIndex = 0;
let charIndex = 0;
let bootFinished = false;


function typeWriter(lines){


    if(bootFinished) return;


    if(lineIndex >= lines.length){


        setTimeout(()=>{


            bootScreen.style.opacity="0";


            setTimeout(()=>{

                bootScreen.style.display="none";

            },800);


        },1000);


        return;

    }



    if(charIndex < lines[lineIndex].length){


        bootText.textContent += lines[lineIndex][charIndex];

        charIndex++;


        setTimeout(()=>typeWriter(lines),35);


    }

    else{


        bootText.textContent += "\n";

        lineIndex++;

        charIndex=0;


        setTimeout(()=>typeWriter(lines),300);

    }


}


function startBoot(){

    const lang = getLang();

    const lines = lang === "en" ? linesEN : linesCZ;

    bootText.textContent = "";
    lineIndex = 0;
    charIndex = 0;

    typeWriter(lines);

}


window.onload=()=>{

    startBoot();

};


function onLangApplied(lang){

    // pokud už boot skončil (obrazovka je schovaná), nerestartuj ho znovu
    if(bootScreen.style.display === "none") return;

    startBoot();

}


const enterButton = document.getElementById("enterButton");
const operationScreen = document.getElementById("operation-screen");
const introScreen = document.getElementById("intro-screen");


if(enterButton && introScreen && operationScreen){

    enterButton.addEventListener("click",()=>{

        introScreen.classList.add("hidden");


        setTimeout(()=>{

            introScreen.style.display="none";

            operationScreen.style.display="block";

        },700);


    });

}
