const particleCanvas =
    document.getElementById("factionParticles");

const particleCtx =
    particleCanvas.getContext("2d");

const drone =
    document.getElementById("drone");

let currentEffect = "rain";

let particles = [];

let effectAnimation;

function resizeParticles(){

    particleCanvas.width =
        window.innerWidth;

    particleCanvas.height =
        window.innerHeight;

}

resizeParticles();

window.addEventListener(
    "resize",
    resizeParticles
);



function createParticles(effect){

    particles = [];

    let amount;

if(effect === "water"){

    amount =
        window.innerWidth < 700
        ? 18
        : 35;

}else{

    amount =
        window.innerWidth < 700
        ? 90
        : 180;

}


    for(let i = 0; i < amount; i++){

        particles.push({

            x:Math.random() *
                particleCanvas.width,

            y:Math.random() *
                particleCanvas.height,

            speed:
                Math.random() * 4 + 3,

            length:
                Math.random() * 12 + 6,

            size:
                Math.random() * 1.5 + .5,

            alpha:
                Math.random() * .4 + .15,

            drift:
                Math.random() * 1.5 - .75

        });

    }

}

function drawParticles(){

    particleCtx.clearRect(
        0,
        0,
        particleCanvas.width,
        particleCanvas.height
    );


    particles.forEach(p => {


        if(currentEffect === "rain"){

            particleCtx.beginPath();

            particleCtx.strokeStyle =
                `rgba(180,200,210,${p.alpha})`;

            particleCtx.lineWidth =
                p.size;

            particleCtx.moveTo(
                p.x,
                p.y
            );

            particleCtx.lineTo(
                p.x + 2,
                p.y + p.length
            );

            particleCtx.stroke();


            p.y += p.speed;

            p.x += .7;


        }



        if(currentEffect === "wind"){

    particleCtx.beginPath();

    particleCtx.strokeStyle =
        `rgba(190,190,190,${p.alpha * .25})`;

    particleCtx.lineWidth =
        .5;

    particleCtx.moveTo(
        p.x,
        p.y
    );

    particleCtx.quadraticCurveTo(

        p.x + 25,
        p.y - 4,

        p.x + 55,
        p.y - 1

    );

    particleCtx.stroke();


    /* RYCHLÝ POHYB */

    p.x +=
        Math.random() * 5 + 4;


    /* LEHKÉ VLNĚNÍ */

    p.y +=
        Math.sin(p.x * .01) * .25;


    /* RESET */

    if(
        p.x >
        particleCanvas.width + 70
    ){

        p.x = -70;

        p.y =
            Math.random() *
            particleCanvas.height;

    }

}



        if(currentEffect === "water"){

    /* KAPKA */

    particleCtx.beginPath();

    particleCtx.fillStyle =
        `rgba(210,225,235,${p.alpha * .45})`;

    particleCtx.ellipse(
        p.x,
        p.y,
        p.size + 1,
        p.size * 1.8,
        0,
        0,
        Math.PI * 2
    );

    particleCtx.fill();


    /* MALÝ ODLESK */

    particleCtx.beginPath();

    particleCtx.fillStyle =
        `rgba(255,255,255,${p.alpha * .25})`;

    particleCtx.arc(
        p.x - .5,
        p.y - .8,
        .6,
        0,
        Math.PI * 2
    );

    particleCtx.fill();


    /* POHYB KAPK Y */

    p.y +=
        Math.random() * .7 + .25;

    p.x +=
        Math.sin(p.y * .015) * .15;

}



        if(
            p.y >
            particleCanvas.height + 30
        ){

            p.y = -30;

            p.x =
                Math.random() *
                particleCanvas.width;

        }


        if(
            p.x >
            particleCanvas.width + 30
        ){

            p.x = -30;

        }

    });


    effectAnimation =
        requestAnimationFrame(
            drawParticles
        );

}
function setAtmosphere(effect){

    currentEffect = effect;

    cancelAnimationFrame(
        effectAnimation
    );

    drone.classList.remove("active");


    if(effect === "drone"){

    particles = [];

    particleCtx.clearRect(
        0,
        0,
        particleCanvas.width,
        particleCanvas.height
    );


    drone.classList.remove("active");


    /*
       malá pauza před průletem
    */

    setTimeout(() => {

        if(currentEffect === "drone"){

            drone.classList.add("active");

        }

    },100);

    return;

}


    createParticles(effect);

    drawParticles();

}

const wallpaper =
    document.getElementById("wallpaper");

const description =
    document.getElementById("factionContent");

const transition =
    document.getElementById("transition");



function typeText(text, callback){

    transition.textContent = "";

    let i = 0;


    const typing = setInterval(() => {

        transition.textContent +=
            text.charAt(i);

        i++;


        if(i >= text.length){

            clearInterval(typing);

            setTimeout(callback,500);

        }

    },35);

}



function changeFaction(faction){

    const chooseText =
        document.getElementById("chooseText");

    const factionTabs =
        document.getElementById("factionTabs");

    chooseText.style.display = "none";

    factionTabs.classList.add("active");

    transition.style.display = "flex";

    transition.classList.add("active");

    


    let image = "";

    let text = "";

    let loading = "";



    if(faction === "stars"){

        image = "stars.png";

        text =
`STARS

SPECIAL TACTICS AND RESCUE SERVICE

FACTION BRIEFING COMING SOON...`;

        loading =
            "LOADING STARS PROTOCOL...";

        setAtmosphere("rain");

    }



    if(faction === "uss"){

        image = "uss.png";

        text =
`USS

UMBRELLA SECURITY SERVICE

FACTION BRIEFING COMING SOON...`;

        loading =
            "LOADING USS PROTOCOL...";

        setAtmosphere("water");

    }



    if(faction === "ubcs"){

        image = "ubcs.png";

        text =
`UBCS

UMBRELLA BIOHAZARD COUNTERMEASURE SERVICE

FACTION BRIEFING COMING SOON...`;

        loading =
            "LOADING UBCS PROTOCOL...";

        setAtmosphere("wind");

    }



    if(faction === "specops"){

        image = "specops.png";

        text =
`SPEC OPS

SPECIAL OPERATIONS

FACTION BRIEFING COMING SOON...`;

        loading =
            "LOADING SPEC OPS PROTOCOL...";

         setAtmosphere("drone");

    }


    typeText(loading, () => {

    wallpaper.style.backgroundImage =
        `url('${image}')`;

    description.textContent =
        text;


    /* SKRYTÍ LOADING OBRAZOVKY */

    transition.classList.remove("active");

    transition.style.display = "none";

});

}
/* =========================
   DEFAULT ATMOSPHERE
========================= */

document.addEventListener("DOMContentLoaded", () => {

    setAtmosphere("rain");

});
