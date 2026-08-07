const bootScreen = document.getElementById("boot-screen");
const bootText = document.getElementById("boot-text");

const lines = [
    "TRIAGE TERMINAL v1.0",
    "",
    "Initializing system.............OK",
    "Loading map.....................OK",
    "Loading factions...............OK",
    "Connecting to network..........OK",
    "Verifying protocols............OK",
    "",
    "SYSTEM ONLINE"
];

let line = 0;
let character = 0;

function typeWriter() {

    if (line >= lines.length) {

        setTimeout(() => {
            bootScreen.style.opacity = "0";

            setTimeout(() => {
                bootScreen.style.display = "none";
            }, 800);

        }, 1000);

        return;
    }

    if (character < lines[line].length) {

        bootText.textContent += lines[line][character];
        character++;

        setTimeout(typeWriter, 35);

    } else {

        bootText.textContent += "\n";

        line++;
        character = 0;

        setTimeout(typeWriter, 250);

    }

}

window.onload = () => {

    bootText.textContent = "";

    typeWriter();

};
