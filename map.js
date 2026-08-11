const bootSequence = [
    { label:"LOADING FACTIONS",  dots:18, result:"OK" },
    { label:"LOADING GAME MODE", dots:18, result:"OK" },
    { label:"LOADING RULES",     dots:18, result:"OK" },
    { label:"LOADING MAP",       dots:13, result:null }
];

const bootLog = document.getElementById("bootLog");


async function typeChar(el, char){
    return new Promise(resolve => {
        el.textContent += char;
        setTimeout(resolve, 25);
    });
}


async function runBootLine(step, isLast){

    const line = document.createElement("span");
    line.className = "boot-line";
    bootLog.appendChild(line);

    // napiš label
    for(const char of step.label){
        await typeChar(line, char);
    }

    // napiš tečky
    const dotsSpan = document.createElement("span");
    line.appendChild(dotsSpan);

    for(let i = 0; i < step.dots; i++){
        await typeChar(dotsSpan, ".");
    }

    if(isLast){

        // poslední řádek — blikající kurzor navždy, žádný výsledek
        const cursor = document.createElement("span");
        cursor.className = "boot-cursor";
        cursor.textContent = ".";
        line.appendChild(cursor);

    }else{

        await new Promise(r => setTimeout(r, 200));

        const okSpan = document.createElement("span");
        okSpan.className = "boot-ok";
        okSpan.textContent = " " + step.result;
        line.appendChild(okSpan);

        await new Promise(r => setTimeout(r, 350));

    }

}


async function runBoot(){

    for(let i = 0; i < bootSequence.length; i++){

        const isLast = i === bootSequence.length - 1;

        await runBootLine(bootSequence[i], isLast);

    }

}


document.addEventListener("DOMContentLoaded", runBoot);
