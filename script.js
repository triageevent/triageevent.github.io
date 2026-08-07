const bootScreen = document.getElementById("boot-screen");
const bootText = document.getElementById("boot-text");

const lines = [
    "TRIAGE TERMINAL v1.0",
    "",
    "Initializing system...",
    "Loading tactical modules...",
    "Connecting secure network...",
    "Synchronizing mission data...",
    "Loading extraction protocol...",
    "Checking player database...",
    "",
    "SYSTEM ONLINE"
];

let lineIndex = 0;
let charIndex = 0;


function typeWriter(){

    if(lineIndex >= lines.length){

        setTimeout(() => {

            bootScreen.style.opacity = "0";

            setTimeout(() => {
                bootScreen.style.display = "none";
            },800);

        },1000);

        return;
    }


    if(charIndex < lines[lineIndex].length){

        bootText.textContent += lines[lineIndex][charIndex];

        charIndex++;

        setTimeout(typeWriter,35);

    }else{

        bootText.textContent += "\n";

        lineIndex++;
        charIndex=0;

        setTimeout(typeWriter,300);

    }

}


window.onload = () => {

    typeWriter();

};
#const enterButton = document.getElementById("enterButton");
const operationScreen = document.getElementById("operation-screen");


enterButton.addEventListener("click", () => {

    enterButton.style.display = "none";

    operationScreen.style.display = "block";

});
