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

let i = 0;

function typeLine() {
    if (i < lines.length) {
        bootText.innerHTML =
    bootText.textContent +
    lines[i] +
    "\n<span class='cursor'>█</span>";
        bootText.innerHTML = bootText.innerHTML.replace(
    "<span class='cursor'>█</span>",
    ""
);
        i++;

        setTimeout(typeLine, 500);
    } else {
        setTimeout(() => {
            document.getElementById("boot-screen").style.display = "none";
        }, 1000);
    }
}

window.onload = () => {
    typeLine();
};
