const particleCanvas =
    document.getElementById("factionParticles");

const particleCtx =
    particleCanvas.getContext("2d");

const drone =
    document.getElementById("drone");

let currentEffect = "rain";

let particles = [];

let effectAnimation;

let currentFaction = null;
let factionIntroText = "";

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

    cancelAnimationFrame(effectAnimation);

    if(effect !== "drone"){
        stopDroneWander();
    }

    if(effect === "drone"){

        particles = [];

        particleCtx.clearRect(
            0, 0,
            particleCanvas.width,
            particleCanvas.height
        );

        startDroneWander();

        return;

    }

    createParticles(effect);
    drawParticles();

}


/* =========================
   DRONE MANEUVERS
========================= */

let droneWanderToken = 0;

const screenScan = document.getElementById("screenScan");


function showDrone(x, y){
    drone.style.left = x + "px";
    drone.style.top = y + "px";
    drone.style.opacity = 1;
    drone.classList.add("glow");
}

function hideDrone(){
    drone.style.opacity = 0;
    drone.classList.remove("glow");
}

function wait(ms, token){
    return new Promise(resolve => {
        setTimeout(() => resolve(token === droneWanderToken), ms);
    });
}

function easeInOutQuad(t){
    return t < .5 ? 2*t*t : -1 + (4 - 2*t) * t;
}

function moveDrone(x0, y0, x1, y1, duration, token){
    return new Promise(resolve => {

        const start = performance.now();

        function frame(now){

            if(token !== droneWanderToken){
                resolve(false);
                return;
            }

            const t = Math.min(1, (now - start) / duration);
            const e = easeInOutQuad(t);

            const x = x0 + (x1 - x0) * e;
            const y = y0 + (y1 - y0) * e;

            drone.style.left = x + "px";
            drone.style.top  = y + "px";


            if(t < 1){
                requestAnimationFrame(frame);
            }else{
                resolve(true);
            }

        }

        requestAnimationFrame(frame);

    });
}

function randomEdgePoint(){

    const margin = 250;
    const side = ["left","right","top"][Math.floor(Math.random()*3)];

    if(side === "left")  return { x:-margin, y:Math.random()*window.innerHeight*.55 };
    if(side === "right") return { x:window.innerWidth + margin, y:Math.random()*window.innerHeight*.55 };

    return { x:Math.random()*window.innerWidth, y:-margin };

}

function randomInnerPoint(){

    const padX = 150;
    const padY = 100;

    return {
        x: padX + Math.random() * (window.innerWidth - padX*2),
        y: padY + Math.random() * (window.innerHeight*.5 - padY)
    };

}


async function scanManeuver(token){

    const entry = randomEdgePoint();
    const target = randomInnerPoint();
    const exit = randomEdgePoint();

    showDrone(entry.x, entry.y);

    if(!await moveDrone(entry.x, entry.y, target.x, target.y, 1800, token)) return;

    screenScan.classList.add("active");

    if(!await wait(3000, token)) return;

    screenScan.classList.remove("active");

    if(!await moveDrone(target.x, target.y, exit.x, exit.y, 1800, token)) return;

    hideDrone();

    await wait(400, token);

}

async function flybyManeuver(token){

    const entry = randomEdgePoint();
    const exit = randomEdgePoint();

    showDrone(entry.x, entry.y);

    if(!await moveDrone(entry.x, entry.y, exit.x, exit.y, 3200, token)) return;

    hideDrone();

    await wait(400, token);

}

async function hoverLeaveManeuver(token){

    const entry = randomEdgePoint();
    const hoverPoint = randomInnerPoint();
    const exit = randomEdgePoint();

    showDrone(entry.x, entry.y);

    if(!await moveDrone(entry.x, entry.y, hoverPoint.x, hoverPoint.y, 1800, token)) return;

    if(!await wait(1500, token)) return;

    if(!await moveDrone(hoverPoint.x, hoverPoint.y, exit.x, exit.y, 4500, token)) return;

    hideDrone();

    await wait(400, token);

}


async function startDroneWander(){

    const myToken = ++droneWanderToken;

    const maneuvers = [scanManeuver, flybyManeuver, hoverLeaveManeuver];

    let lastIndex = -1;

    while(myToken === droneWanderToken){

        let idx;

        do{
            idx = Math.floor(Math.random() * maneuvers.length);
        }while(idx === lastIndex && maneuvers.length > 1);

        lastIndex = idx;

        await maneuvers[idx](myToken);

        if(myToken !== droneWanderToken) return;

        await wait(500 + Math.random() * 900, myToken);

    }

}

function stopDroneWander(){

    droneWanderToken++;

    hideDrone();

    screenScan.classList.remove("active");

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

    let introData = null;

    let loading = "";



    if(faction === "stars"){

        image = "stars.png";

        introData = {
        title: "STARS",
        subtitle: "SPECIAL TACTICS AND RESCUE SERVICE",
        paragraphs: [
            "Raccoon City hoří a nikdo jiný sem nepřijde.\nNe UBCS se svými žoldáky. Ne USS se svým mlčením.\nJen my.",
            "Byli jsme tu jako první, když se měšťané začali měnit\nv něco, co už nechodilo, ale ani nezůstávalo ležet.\nZtratili jsme lidi. Ztratili jsme velitelství.\nAle neztratili jsme důvod, proč tu jsme.",
            "Umbrella tenhle chaos vytvořila a teď sem posílá\nvlastní jednotky, aby si uklidila po sobě nepořádek\ndřív, než z něj někdo udělá důkaz. My jim v tom\nnezabráníme silou zbraně — zabráníme jim tím,\nže přežijeme a promluvíme.",
            "Ostatní frakce bojují o kontrolu.\nMy bojujeme o to, aby bylo koho zachránit.",
            "Pokud věříš, že z tohohle města má někdo vyjít\nse svědomím čistým jako uniforma, na které\nještě nezaschla krev — patříš k nám."
        ]
    };
        loading =
            "LOADING STARS PROTOCOL...";

        setAtmosphere("rain");

    }



    if(faction === "uss"){

    image = "uss.png";

    introData = {
        title: "USS",
        subtitle: "UMBRELLA SECURITY SERVICE",
        paragraphs: [
            "Nikdo z nás tu není proto, aby zachraňoval.\nJsme tu, protože Umbrella potřebuje vědět,\nco přesně jejich vlastní výzkum dokáže —\na tahle data se nedají získat z bezpečné\nvzdálenosti.",
            "STARS nás nazývají katany bez svědomí.\nMají pravdu jen z poloviny — svědomí máme,\njen jsme se ho už dávno naučili nepoužívat\nve chvílích, kdy jde o výsledky.",
            "UBCS válčí za výplatní pásku. My válčíme\nza informace, které přežijí i tehdy,\nkdyž tohle město nepřežije nikdo jiný.\nSPEC OPS honí pravdu, kterou stejně nikdo\nnebude poslouchat.",
            "Zatímco ostatní bojují o to, kdo odsud\nvyjde jako hrdina, my sbíráme to jediné,\nco bude mít cenu, až se dým rozplyne:\ndůkaz, co se tu doopravdy stalo —\na moc rozhodnout, kdo se to dozví.",
            "Pokud dokážeš dělat správné rozhodnutí\ni tehdy, když vypadá jako to špatné —\ntvoje místo je v USS."
        ]
    };

    loading = "LOADING USS PROTOCOL...";
    setAtmosphere("water");

}



    if(faction === "ubcs"){

    image = "ubcs.png";

    introData = {
        title: "UBCS",
        subtitle: "UMBRELLA BIOHAZARD COUNTERMEASURE SERVICE",
        paragraphs: [
            "Umbrella zaplatila za tenhle byznys smlouvu,\nne omluvu. Jsme žoldáci — a ano, víme přesně,\nkdo nás sem poslal a proč. Rozdíl mezi námi\na ostatními je ten, že my si aspoň nelžeme\ndo kapsy o tom, čí je tohle válka.",
            "STARS chtějí zachraňovat civilisty, kterých\nuž většina není k záchraně. USS chtějí sbírat\nvzorky pro laboratoř, která tohle celé stvořila.\nSPEC OPS nemají ani vlastní vlajku, natož důvod,\nproč by měli vyhrát.",
            "My máme granátomety, těžkou výzbroj\na smlouvu, která nekončí, dokud neskončí\nposlední cíl na seznamu. Nejsme tu, abychom\nzachraňovali město. Jsme tu, abychom\nz něj dostali ven to, za co nám zaplatili —\ni kdyby to znamenalo srovnat ho se zemí.",
            "Pokud věříš, že v tomhle pekle vyhrává\nten, kdo má lepší výzbroj a míň iluzí —\npatříš do UBCS."
        ]
    };

    loading = "LOADING UBCS PROTOCOL...";
    setAtmosphere("wind");

}



    if(faction === "specops"){

    image = "specops.png";

    introData = {
        title: "SPEC OPS",
        subtitle: "FIELD UNIT",
        paragraphs: [
            "Nikdo nám nezavolal. Nikdo nás nezaregistroval\nv žádném systému, který přežil tenhle týden.\nPřišli jsme, protože tohle je přesně ten druh\nkatastrofy, na kterou nás cvičili — a protože\nněkdo musí dělat práci, kterou STARS má pořád\nještě příliš čisté svědomí udělat.",
            "Neseme termovize a noční vidění ne proto,\nže bychom se báli tmy. Nosíme je, protože\nve tmě je vidět nejlíp, kdo tady lže.\nA lže tu skoro každý s emblémem na rukávu.",
            "UBCS jsou žoldáci placení firmou, která tohle\nzpůsobila. USS jsou stíny, co ani nepředstírají,\nže jim jde o něco jiného než o data.\nSTARS chtějí zachránit svět s pravidly,\nkterá tenhle svět už nemá.",
            "My nemáme rozkazy. Máme jen misi:\ndostat se z Raccoon City s pravdou,\nkterou nikdo jiný neunese.",
            "Pokud ti nevadí pracovat bez podpory,\nbez uznání a beze jména na uniformě —\nnajdeš nás tam, kde je nejtemněji."
        ]
    };

    loading = "LOADING SPEC OPS PROTOCOL...";
    setAtmosphere("drone");

}


   typeText(loading, () => {

    wallpaper.style.backgroundImage =
        `url('${image}')`;

    currentFaction = faction;
factionIntroText = introData;
       const armoryColors = {
        stars:   "rgba(24,22,69,.85)",
        uss:     "rgba(65,5,10,.85)",
        ubcs:    "rgba(99,107,47,.85)",
        specops: "rgba(109,91,41,.85)"
    };

    document.documentElement.style.setProperty(
        "--faction-armory-bg",
        armoryColors[faction] || "rgba(24,22,69,.85)"
    );
       document.getElementById("factionContent").innerHTML = "";


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
/* =========================
   ARMORY DATA
========================= */

const armoryData = {

    stars:[
        { icon:"icons/pistol.png",  note:null, joule:"1,3J", zone:"CQB/OS", mode:"semi" },
        { icon:"icons/rifle.png",   note:"20RPS max", joule:"1,8J", zone:"OS", mode:"semi / full auto" },
        { icon:"icons/grenade.png", note:"Pyrosoft\nTaggin\npružinové\nplynové", joule:null, zone:"OS", mode:null },
        { icon:"icons/lmg.png",     note:"20RPS max", joule:"1,5J", zone:"OS", mode:"full auto" },
        { icon:"icons/shotgun.png", note:null, joule:"1,3J", zone:"CQB/OS", mode:null },
        { icon:"icons/shield.png",  note:"Pouze se záložní pistolí", joule:null, zone:"CQB/OS", mode:"semi" }
    ],

    uss:[
        { icon:"icons/pistol.png",  note:null, joule:"1,3J", zone:"CQB/OS", mode:"semi" },
        { icon:"icons/rifle.png",   note:"20RPS max", joule:"1,8J", zone:"OS", mode:"semi / full auto" },
        { icon:"icons/grenade.png", note:"Pyrosoft\nTaggin", joule:null, zone:"OS", mode:null },
        { icon:"icons/lmg.png",     note:"20RPS max", joule:"1,5J", zone:"OS", mode:"full auto" },
        { icon:"icons/smg.png",     note:"25RPS max\nReálná předloha", joule:"1,3J", zone:"CQB/OS", mode:"semi / full auto" },
        { icon:"icons/grenade.png", note:"pružinové\nplynové", joule:null, zone:"CQB/OS", mode:null }
    ],

    ubcs:[
        { icon:"icons/pistol.png",   note:null, joule:"1,3J", zone:"CQB/OS", mode:"semi" },
        { icon:"icons/rifle.png",    note:"20RPS max", joule:"1,8J", zone:"OS", mode:"semi / full auto" },
        { icon:"icons/grenade.png",  note:"Pyrosoft\nTaggin\npružinové\nplynové", joule:null, zone:"OS", mode:null },
        { icon:"icons/lmg.png",      note:"20RPS max", joule:"1,5J", zone:"OS", mode:"full auto" },
        { icon:"icons/launcher.png", note:"Granátomet", joule:null, zone:"CQB/OS", mode:"Greengas" },
        { icon:"icons/dmr.png",      note:"pouze nad 20m\nReálná předloha\nPouze se záložní pistolí", joule:"2,5J", zone:"OS", mode:"semi" }
    ],

    specops:[
        { icon:"icons/pistol.png",  note:null, joule:"1,3J", zone:"CQB/OS", mode:"semi" },
        { icon:"icons/rifle.png",   note:"20RPS max", joule:"1,8J", zone:"OS", mode:"semi / full auto" },
        { icon:"icons/grenade.png", note:"Pyrosoft\nTaggin\npružinové\nplynové", joule:null, zone:"OS", mode:null },
        { icon:"icons/lmg.png",     note:"20RPS max", joule:"1,5J", zone:"OS", mode:"full auto" },
        { icon:"icons/nvg.png", note:"Zákaz shazovat předměty", joule:null, zone:"CQB/OS", mode:"NVG / THERMOVIZE" },
        { icon:"icons/sniper.png",  note:"pouze nad 30m\nPouze se záložní pistolí", joule:"3,5J", zone:"OS", mode:"semi" }
    ]

};

function renderArmory(faction){

    const table = document.getElementById("factionContent");

    const data = armoryData[faction];

    if(!data){
        table.innerHTML =
            `<p class="faction-text">ARMORY BRIEFING COMING SOON...</p>`;
        return;
    }

   table.innerHTML = `
    <div class="armory-legend">
        CQB = budovy<br>
        OS = venkovní prostor
    </div>
    <div class="armory-table">` +

        data.map(row => `
            <div class="armory-row">
                <img src="${row.icon}" class="armory-icon" alt="">
                ${row.note ? `<div class="armory-note">${row.note.replace(/\n/g,"<br>")}</div>` : "<div></div>"}
                <div class="armory-right">
                    ${row.joule ? `<div class="armory-joule">${row.joule}</div>` : ""}
                    ${row.zone ? `<div class="armory-zone">${row.zone}</div>` : ""}
                    ${row.mode ? `<div class="armory-mode">${row.mode}</div>` : ""}
                </div>
            </div>
        `).join("") +

        `</div>
        <div class="armory-footer">
            Co není uvedeno mezi povoleným vybavením frakce, není pro danou frakci povoleno.
        </div>`;
}
let introTypingInterval = null;

function renderIntro(data){

    const content = document.getElementById("factionContent");

    clearInterval(introTypingInterval);

    if(!data){
        content.innerHTML =
            `<p class="faction-text">BRIEFING COMING SOON...</p>`;
        return;
    }

    content.innerHTML = `
        <div class="intro-wrap">
            <div class="intro-title">${data.title}</div>
            <div class="intro-subtitle">${data.subtitle}</div>
            <div class="intro-body" id="introBody"></div>
        </div>
    `;

    const bodyEl = document.getElementById("introBody");

    typeIntro(data.paragraphs, bodyEl);

}

function typeIntro(paragraphs, bodyEl){

    let paraIndex = 0;
    let charIndex = 0;

    let currentP = document.createElement("p");
    currentP.innerHTML = `<span class="typing-cursor"></span>`;
    bodyEl.appendChild(currentP);

    introTypingInterval = setInterval(() => {

        if(paraIndex >= paragraphs.length){
            clearInterval(introTypingInterval);
            const cursor = bodyEl.querySelector(".typing-cursor");
            if(cursor) cursor.remove();
            return;
        }

        const text = paragraphs[paraIndex];

        if(charIndex < text.length){

    const typed = text.slice(0, charIndex + 1)
        .replace(/\n/g,"<br>");

    currentP.innerHTML =
        typed + `<span class="typing-cursor"></span>`;

    charIndex++;

    const scrollContainer = document.getElementById("factionContent");
scrollContainer.scrollTop = scrollContainer.scrollHeight;

        }else{

    // odstranit kurzor z právě dokončeného odstavce
    currentP.innerHTML = text.replace(/\n/g,"<br>");

    paraIndex++;
    charIndex = 0;

    if(paraIndex < paragraphs.length){
        currentP = document.createElement("p");
        currentP.innerHTML = `<span class="typing-cursor"></span>`;
        bodyEl.appendChild(currentP);
    }

        }

    },18);

}
function showFactionSection(section, btn){

    if(!currentFaction) return;

    document.querySelectorAll("#factionTabs button")
        .forEach(b => b.classList.remove("active-tab"));

    if(btn) btn.classList.add("active-tab");

    const content = document.getElementById("factionContent");

    if(section === "intro"){
    renderIntro(factionIntroText);
}

    if(section === "armory"){
        renderArmory(currentFaction);
    }
}
