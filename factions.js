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
                Math.random() * 1.2 + 0.4,

            length:
                Math.random() * 35 + 15,

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
                `rgba(180,180,180,${p.alpha * .45})`;

            particleCtx.lineWidth =
                p.size;

            particleCtx.moveTo(
                p.x,
                p.y
            );

            particleCtx.lineTo(
                p.x + p.length * 3,
                p.y - 2
            );

            particleCtx.stroke();


            p.x += p.speed * 2;

            p.y += p.drift * .2;


        }



        if(currentEffect === "water"){

    /*
       WATER DROPLETS
       pomalé kapky stékající
       po "objektivu"
    */

    particleCtx.beginPath();

    particleCtx.strokeStyle =
        `rgba(210,225,235,${p.alpha * .45})`;

    particleCtx.lineWidth =
        p.size * .8;

    particleCtx.moveTo(
        p.x,
        p.y
    );

    particleCtx.lineTo(
        p.x + p.drift,
        p.y + p.length
    );

    particleCtx.stroke();


    /*
       malá kapka na konci
    */

    particleCtx.beginPath();

    particleCtx.fillStyle =
        `rgba(225,235,240,${p.alpha * .55})`;

    particleCtx.arc(
        p.x + p.drift,
        p.y + p.length,
        p.size + 1,
        0,
        Math.PI * 2
    );

    particleCtx.fill();


    /*
       pomalé stékání
    */

    p.y += p.speed;

    p.x += p.drift * .15;


    /*
       občasná změna směru
    */

    p.drift +=
        (Math.random() - .5) * .03;


    p.drift =
        Math.max(
            -0.8,
            Math.min(0.8, p.drift)
        );

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

        drone.classList.add("active");

        return;

    }


    createParticles(effect);

    drawParticles();

}

const wallpaper =
    document.getElementById("wallpaper");

const description =
    document.getElementById("description");

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


        setTimeout(() => {

            transition.classList.remove("active");

        },500);

    });

}
/* =========================
   DEFAULT ATMOSPHERE
========================= */

document.addEventListener("DOMContentLoaded", () => {

    setAtmosphere("rain");

});
