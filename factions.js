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
let factionIntroData = null;

function resizeParticles(){
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

resizeParticles();
window.addEventListener("resize", resizeParticles);


function createParticles(effect){

    particles = [];
    let amount;

    if(effect === "water"){
        amount = window.innerWidth < 700 ? 18 : 35;
    }else{
        amount = window.innerWidth < 700 ? 90 : 180;
    }

    for(let i = 0; i < amount; i++){
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            speed: Math.random() * 4 + 3,
            length: Math.random() * 12 + 6,
            size: Math.random() * 1.5 + .5,
            alpha: Math.random() * .4 + .15,
            drift: Math.random() * 1.5 - .75
        });
    }

}

function drawParticles(){

    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach(p => {

        if(currentEffect === "rain"){
            particleCtx.beginPath();
            particleCtx.strokeStyle = `rgba(180,200,210,${p.alpha})`;
            particleCtx.lineWidth = p.size;
            particleCtx.moveTo(p.x, p.y);
            particleCtx.lineTo(p.x + 2, p.y + p.length);
            particleCtx.stroke();
            p.y += p.speed;
            p.x += .7;
        }

        if(currentEffect === "wind"){
            particleCtx.beginPath();
            particleCtx.strokeStyle = `rgba(190,190,190,${p.alpha * .25})`;
            particleCtx.lineWidth = .5;
            particleCtx.moveTo(p.x, p.y);
            particleCtx.quadraticCurveTo(p.x + 25, p.y - 4, p.x + 55, p.y - 1);
            particleCtx.stroke();
            p.x += Math.random() * 5 + 4;
            p.y += Math.sin(p.x * .01) * .25;
            if(p.x > particleCanvas.width + 70){
                p.x = -70;
                p.y = Math.random() * particleCanvas.height;
            }
        }

        if(currentEffect === "water"){
            particleCtx.beginPath();
            particleCtx.fillStyle = `rgba(210,225,235,${p.alpha * .45})`;
            particleCtx.ellipse(p.x, p.y, p.size + 1, p.size * 1.8, 0, 0, Math.PI * 2);
            particleCtx.fill();
            particleCtx.beginPath();
            particleCtx.fillStyle = `rgba(255,255,255,${p.alpha * .25})`;
            particleCtx.arc(p.x - .5, p.y - .8, .6, 0, Math.PI * 2);
            particleCtx.fill();
            p.y += Math.random() * .7 + .25;
            p.x += Math.sin(p.y * .015) * .15;
        }

        if(p.y > particleCanvas.height + 30){
            p.y = -30;
            p.x = Math.random() * particleCanvas.width;
        }

        if(p.x > particleCanvas.width + 30){
            p.x = -30;
        }

    });

    effectAnimation = requestAnimationFrame(drawParticles);

}

function setAtmosphere(effect){

    currentEffect = effect;

    cancelAnimationFrame(effectAnimation);

    if(effect !== "drone"){
        stopDroneWander();
    }

    if(effect === "drone"){
        particles = [];
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        droneSpeedLevel = 0;
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
let droneShotDown = false;
let operatorScore = 0;
let droneSpeedLevel = 0;

function getDroneSpeedFactor(){
    return Math.max(0.35, 1 - droneSpeedLevel * 0.08);
}


function updateDroneScore(){

    document.getElementById("operatorScoreValue").textContent =
        operatorScore;

}
function updateDroneScoreVisibility(faction){

    const score = document.getElementById("droneScore");

    if(!score) return;

    if(faction === "specops"){
        score.classList.add("visible");
    }else{
        score.classList.remove("visible");
    }

}
const screenScan = document.getElementById("screenScan");

const droneScanFlash =
    document.getElementById("droneScanFlash");


/* =========================
   SHOW DRONE
========================= */

function showDrone(x, y){

    drone.style.left = x + "px";
    drone.style.top = y + "px";
    drone.style.opacity = "1";

    drone.classList.remove(
        "exploding",
        "falling"
    );

    drone.classList.add("glow");
}


/* =========================
   HIDE DRONE
========================= */

function hideDrone(){

    drone.style.opacity = "0";

    drone.classList.remove(
        "glow",
        "exploding",
        "falling"
    );
}


/* =========================
   CLICK DRONE
========================= */

drone.addEventListener("click", () => {

    if(droneShotDown) return;

    if(drone.style.opacity === "0") return;

    shootDownDrone();

});


/* =========================
   SHOOT DOWN DRONE
========================= */

function shootDownDrone(){

    if(droneShotDown) return;

    droneShotDown = true;

   operatorScore += 100;
    droneSpeedLevel++;
    updateDroneScore();

    /* okamžitě přeruší aktuální let */
    droneWanderToken++;

    drone.classList.remove("glow");

    screenScan.classList.remove("active");


    /* aktuální pozice dronu */

    const rect = drone.getBoundingClientRect();

    const centerX =
        rect.left + rect.width / 2;

    const centerY =
        rect.top + rect.height / 2;


    /* 50 % exploze / 50 % pád */

    const isExplosion =
        Math.random() < 0.5;


    /* =========================
       EXPLOZE
    ========================= */

    if(isExplosion){

        const flash =
            document.createElement("div");

        flash.className =
            "explosion-flash active";

        flash.style.left =
            centerX + "px";

        flash.style.top =
            centerY + "px";

        document.body.appendChild(flash);


        drone.classList.add("exploding");


        setTimeout(() => {

            flash.remove();

            finishShootdown();

        }, 550);

    }


    /* =========================
       PÁD
    ========================= */

    else{

        drone.classList.add("falling");


        setTimeout(() => {

            finishShootdown();

        }, 1450);

    }

}


/* =========================
   FINISH SHOOTDOWN
========================= */

function finishShootdown(){

    drone.classList.remove(
        "exploding",
        "falling"
    );

    drone.classList.remove("glow");

    drone.style.opacity = "0";

    drone.style.transform = "";

    document
        .getElementById("sendDroneBtn")
        .classList.add("visible");

}


/* =========================
   SEND ANOTHER DRONE
========================= */

function sendAnotherDrone(){

    document
        .getElementById("sendDroneBtn")
        .classList.remove("visible");

    droneShotDown = false;

    if(currentEffect === "drone"){

        startDroneWander();

    }

}


/* =========================
   WAIT
========================= */

function wait(ms, token){

    return new Promise(resolve => {

        setTimeout(() => {

            resolve(
                token === droneWanderToken
            );

        }, ms);

    });

}


/* =========================
   EASING
========================= */

function easeInOutQuad(t){

    return t < .5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;

}


/* =========================
   MOVE DRONE
========================= */

function moveDrone(
    x0,
    y0,
    x1,
    y1,
    duration,
    token
){

    return new Promise(resolve => {

        const start =
            performance.now();


        function frame(now){

            if(token !== droneWanderToken){

                resolve(false);

                return;

            }


            const t =
                Math.min(
                    1,
                    (now - start) / duration
                );


            const e =
                easeInOutQuad(t);


            const x =
                x0 +
                (x1 - x0) * e;

            const y =
                y0 +
                (y1 - y0) * e;


            drone.style.left =
                x + "px";

            drone.style.top =
                y + "px";


            if(t < 1){

                requestAnimationFrame(frame);

            }else{

                resolve(true);

            }

        }


        requestAnimationFrame(frame);

    });

}


/* =========================
   RANDOM EDGE POINT
========================= */

function randomEdgePoint(){

    const margin = 250;

    const side =
        ["left","right","top"]
        [Math.floor(Math.random() * 3)];


    if(side === "left"){

        return {
            x:-margin,
            y:
                Math.random() *
                window.innerHeight *
                .55
        };

    }


    if(side === "right"){

        return {
            x:
                window.innerWidth +
                margin,

            y:
                Math.random() *
                window.innerHeight *
                .55
        };

    }


    return {
        x:
            Math.random() *
            window.innerWidth,

        y:-margin
    };

}


/* =========================
   RANDOM INNER POINT
========================= */

function randomInnerPoint(){

    const padX = 150;
    const padY = 100;

    return {

        x:
            padX +
            Math.random() *
            (
                window.innerWidth -
                padX * 2
            ),

        y:
            padY +
            Math.random() *
            (
                window.innerHeight * .5 -
                padY
            )

    };

}


/* =========================
   SCAN MANEUVER
========================= */

async function scanManeuver(token){

    const entry =
        randomEdgePoint();

    const target =
        randomInnerPoint();

    const exit =
        randomEdgePoint();


    showDrone(
        entry.x,
        entry.y
    );


    if(
        !await moveDrone(
            entry.x,
            entry.y,
            target.x,
            target.y,
            1800 * getDroneSpeedFactor(),
            token
        )
    ){

        return;

    }


/* =========================
   DRONE SCAN FLASH
========================= */

const rect =
    drone.getBoundingClientRect();

const flashX =
    rect.left +
    rect.width / 2;

const flashY =
    rect.top +
    rect.height / 2;


droneScanFlash.style.left =
    flashX + "px";

droneScanFlash.style.top =
    flashY + "px";


droneScanFlash.classList.remove("active");

/* restart CSS animace */
void droneScanFlash.offsetWidth;

droneScanFlash.classList.add("active");


/*
    Krátká prodleva,
    aby byl vidět záblesk
    ještě před scanem.
*/

if(
    !await wait(
        250,
        token
    )
){

    return;

}


/* =========================
   SCREEN SCAN
========================= */

screenScan.classList.remove("active");

/* restart animace */
void screenScan.offsetWidth;

screenScan.classList.add("active");


if(
    !await wait(
        3000 * getDroneSpeedFactor(),
        token
    )
){

    return;

}


screenScan.classList.remove("active");
   

    if(
        !await moveDrone(
            entry.x,
            entry.y,
            target.x,
            target.y,
            1800 * getDroneSpeedFactor(),
            token
        )
    ){

        return;

    }


    hideDrone();


    await wait(
        400,
        token
    );

}


/* =========================
   FLYBY
========================= */

async function flybyManeuver(token){

    const entry =
        randomEdgePoint();

    const exit =
        randomEdgePoint();


    showDrone(
        entry.x,
        entry.y
    );


    if(
        !await moveDrone(
            entry.x,
            entry.y,
            exit.x,
            exit.y,
            3200 * getDroneSpeedFactor(),
            token
        )
    ){

        return;

    }


    hideDrone();


    await wait(
        400,
        token
    );

}


/* =========================
   HOVER / LEAVE
========================= */

async function hoverLeaveManeuver(token){

    const entry =
        randomEdgePoint();

    const hoverPoint =
        randomInnerPoint();

    const exit =
        randomEdgePoint();


    showDrone(
        entry.x,
        entry.y
    );


    if(
        !await moveDrone(
            target.x,
            target.y,
            exit.x,
            exit.y,
            1800 * getDroneSpeedFactor(),
            token
        )
    ){

        return;

    }


    if(
        !await wait(
            1500,
            token
        )
    ){

        return;

    }


    if(
        !await moveDrone(
            hoverPoint.x,
            hoverPoint.y,
            exit.x,
            exit.y,
            4500 * getDroneSpeedFactor(),
            token
        )
    ){

        return;

    }


    hideDrone();


    await wait(
        400,
        token
    );

}


/* =========================
   START DRONE WANDER
========================= */

async function startDroneWander(){

    const myToken =
        ++droneWanderToken;

    droneShotDown = false;


    const maneuvers = [
        scanManeuver,
        flybyManeuver,
        hoverLeaveManeuver
    ];


    let lastIndex = -1;


    while(
        myToken === droneWanderToken &&
        !droneShotDown
    ){

        let idx;


        do{

            idx =
                Math.floor(
                    Math.random() *
                    maneuvers.length
                );

        }while(
            idx === lastIndex &&
            maneuvers.length > 1
        );


        lastIndex = idx;


        await maneuvers[idx](
            myToken
        );


        if(
            myToken !== droneWanderToken ||
            droneShotDown
        ){

            return;

        }


        await wait(
            500 +
            Math.random() * 900,
            myToken
        );

    }

}


/* =========================
   STOP DRONE
========================= */

function stopDroneWander(){

    droneWanderToken++;

    hideDrone();

    screenScan.classList.remove("active");

    droneShotDown = false;

    drone.classList.remove(
        "exploding",
        "falling"
    );

    document
        .getElementById("sendDroneBtn")
        .classList.remove("visible");

}


const wallpaper = document.getElementById("wallpaper");
const transition = document.getElementById("transition");


function typeText(text, callback){

    transition.textContent = "";
    let i = 0;

    const typing = setInterval(() => {

        transition.textContent += text.charAt(i);
        i++;

        if(i >= text.length){
            clearInterval(typing);
            setTimeout(callback, 500);
        }

    }, 35);

}


/* =========================
   FACTION INTRO DATA (CZ / EN)
========================= */

const introDataByFaction = {

    stars:{
        image:"stars.png",
        atmosphere:"rain",
        loading:{ cz:"NAČÍTÁNÍ STARS PROTOKOLU...", en:"LOADING STARS PROTOCOL..." },
        title:{ cz:"STARS", en:"STARS" },
        subtitle:{ cz:"SPECIAL TACTICS AND RESCUE SERVICE", en:"SPECIAL TACTICS AND RESCUE SERVICE" },
        paragraphs:{
            cz:[
                "Raccoon City hoří a nikdo jiný sem nepřijde.\nNe UBCS se svými žoldáky. Ne USS se svým mlčením.\nJen my.",
                "Byli jsme tu jako první, když se měšťané začali měnit\nv něco, co už nechodilo, ale ani nezůstávalo ležet.\nZtratili jsme lidi. Ztratili jsme velitelství.\nAle neztratili jsme důvod, proč tu jsme.",
                "Umbrella tenhle chaos vytvořila a teď sem posílá\nvlastní jednotky, aby si uklidila po sobě nepořádek\ndřív, než z něj někdo udělá důkaz. My jim v tom\nnezabráníme silou zbraně — zabráníme jim tím,\nže přežijeme a promluvíme.",
                "Ostatní frakce bojují o kontrolu.\nMy bojujeme o to, aby bylo koho zachránit.",
                "Pokud věříš, že z tohohle města má někdo vyjít\nse svědomím čistým jako uniforma, na které\nještě nezaschla krev — patříš k nám."
            ],
            en:[
                "Raccoon City is burning and no one else is coming.\nNot UBCS with their mercenaries. Not USS with their silence.\nJust us.",
                "We were here first, when the townspeople started\nturning into something that no longer walked right,\nbut wouldn't stay down either. We lost people.\nWe lost command. But we never lost the reason we're here.",
                "Umbrella created this chaos, and now they're sending\ntheir own units to clean up after themselves\nbefore anyone can turn it into evidence. We won't\nstop them with firepower — we'll stop them by\nsurviving long enough to talk.",
                "Other factions fight for control.\nWe fight so there's someone left to save.",
                "If you believe someone should walk out of this city\nwith a conscience as clean as a uniform that\nhasn't dried blood on it yet — you belong with us."
            ]
        }
    },

    uss:{
        image:"uss.png",
        atmosphere:"water",
        loading:{ cz:"NAČÍTÁNÍ USS PROTOKOLU...", en:"LOADING USS PROTOCOL..." },
        title:{ cz:"USS", en:"USS" },
        subtitle:{ cz:"UMBRELLA SECURITY SERVICE", en:"UMBRELLA SECURITY SERVICE" },
        paragraphs:{
            cz:[
                "Nikdo z nás tu není proto, aby zachraňoval.\nJsme tu, protože Umbrella potřebuje vědět,\nco přesně jejich vlastní výzkum dokáže —\na tahle data se nedají získat z bezpečné\nvzdálenosti.",
                "STARS nás nazývají katany bez svědomí.\nMají pravdu jen z poloviny — svědomí máme,\njen jsme se ho už dávno naučili nepoužívat\nve chvílích, kdy jde o výsledky.",
                "UBCS válčí za výplatní pásku. My válčíme\nza informace, které přežijí i tehdy,\nkdyž tohle město nepřežije nikdo jiný.\nSPEC OPS honí pravdu, kterou stejně nikdo\nnebude poslouchat.",
                "Zatímco ostatní bojují o to, kdo odsud\nvyjde jako hrdina, my sbíráme to jediné,\nco bude mít cenu, až se dým rozplyne:\ndůkaz, co se tu doopravdy stalo —\na moc rozhodnout, kdo se to dozví.",
                "Pokud dokážeš dělat správné rozhodnutí\ni tehdy, když vypadá jako to špatné —\ntvoje místo je v USS."
            ],
            en:[
                "None of us are here to save anyone.\nWe're here because Umbrella needs to know exactly\nwhat their own research is capable of — and that data\ncan't be collected from a safe distance.",
                "STARS call us blades without a conscience.\nThey're only half right — we have one, we just\nlearned a long time ago not to use it when\nresults are on the line.",
                "UBCS fight for a paycheck. We fight for\ninformation that will survive even if this\ncity doesn't. SPEC OPS chase a truth\nno one's going to listen to anyway.",
                "While the others fight over who walks out\nas a hero, we're collecting the one thing\nthat will actually matter once the smoke clears:\nproof of what really happened here —\nand the power to decide who finds out.",
                "If you can make the right call even when\nit looks like the wrong one —\nyour place is in USS."
            ]
        }
    },

    ubcs:{
        image:"ubcs.png",
        atmosphere:"wind",
        loading:{ cz:"NAČÍTÁNÍ UBCS PROTOKOLU...", en:"LOADING UBCS PROTOCOL..." },
        title:{ cz:"UBCS", en:"UBCS" },
        subtitle:{ cz:"UMBRELLA BIOHAZARD COUNTERMEASURE SERVICE", en:"UMBRELLA BIOHAZARD COUNTERMEASURE SERVICE" },
        paragraphs:{
            cz:[
                "Umbrella zaplatila za tenhle byznys smlouvu,\nne omluvu. Jsme žoldáci — a ano, víme přesně,\nkdo nás sem poslal a proč. Rozdíl mezi námi\na ostatními je ten, že my si aspoň nelžeme\ndo kapsy o tom, čí je tohle válka.",
                "STARS chtějí zachraňovat civilisty, kterých\nuž většina není k záchraně. USS chtějí sbírat\nvzorky pro laboratoř, která tohle celé stvořila.\nSPEC OPS nemají ani vlastní vlajku, natož důvod,\nproč by měli vyhrát.",
                "My máme granátomety, těžkou výzbroj\na smlouvu, která nekončí, dokud neskončí\nposlední cíl na seznamu. Nejsme tu, abychom\nzachraňovali město. Jsme tu, abychom\nz něj dostali ven to, za co nám zaplatili —\ni kdyby to znamenalo srovnat ho se zemí.",
                "Pokud věříš, že v tomhle pekle vyhrává\nten, kdo má lepší výzbroj a míň iluzí —\npatříš do UBCS."
            ],
            en:[
                "Umbrella paid for a contract in this business,\nnot an apology. We're mercenaries — and yes,\nwe know exactly who sent us here and why.\nThe difference between us and the others is\nwe're not lying to ourselves about whose war this is.",
                "STARS want to save civilians most of whom\naren't worth saving anymore. USS want to collect\nsamples for the lab that caused all of this.\nSPEC OPS don't even have a flag of their own,\nlet alone a reason to win.",
                "We have grenade launchers, heavy gear, and a\ncontract that doesn't end until the last name on\nthe list is crossed off. We're not here to save\nthe city. We're here to get out with what we\nwere paid for — even if that means leveling it.",
                "If you believe that in this hell, the winner\nis whoever has better gear and fewer illusions —\nyou belong in UBCS."
            ]
        }
    },

    specops:{
        image:"specops.png",
        atmosphere:"drone",
        loading:{ cz:"NAČÍTÁNÍ SPEC OPS PROTOKOLU...", en:"LOADING SPEC OPS PROTOCOL..." },
        title:{ cz:"SPEC OPS", en:"SPEC OPS" },
        subtitle:{ cz:"FIELD UNIT", en:"FIELD UNIT" },
        paragraphs:{
            cz:[
                "Nikdo nám nezavolal. Nikdo nás nezaregistroval\nv žádném systému, který přežil tenhle týden.\nPřišli jsme, protože tohle je přesně ten druh\nkatastrofy, na kterou nás cvičili — a protože\nněkdo musí dělat práci, kterou STARS má pořád\nještě příliš čisté svědomí udělat.",
                "Neseme termovize a noční vidění ne proto,\nže bychom se báli tmy. Nosíme je, protože\nve tmě je vidět nejlíp, kdo tady lže.\nA lže tu skoro každý s emblémem na rukávu.",
                "UBCS jsou žoldáci placení firmou, která tohle\nzpůsobila. USS jsou stíny, co ani nepředstírají,\nže jim jde o něco jiného než o data.\nSTARS chtějí zachránit svět s pravidly,\nkterá tenhle svět už nemá.",
                "My nemáme rozkazy. Máme jen misi:\ndostat se z Raccoon City s pravdou,\nkterou nikdo jiný neunese.",
                "Pokud ti nevadí pracovat bez podpory,\nbez uznání a beze jména na uniformě —\nnajdeš nás tam, kde je nejtemněji."
            ],
            en:[
                "Nobody called us. Nobody registered us in\nany system that survived this week. We came\nbecause this is exactly the kind of disaster\nwe were trained for — and because someone has\nto do the job STARS' conscience is still too\nclean to do.",
                "We carry thermal and night vision not because\nwe're afraid of the dark. We wear it because\nin the dark is where you see best who's lying.\nAnd almost everyone with a patch on their sleeve\nis lying.",
                "UBCS are mercenaries paid by the company that\ncaused this. USS are shadows who don't even\npretend to care about anything but data. STARS\nwant to save a world with rules this world\ndoesn't have anymore.",
                "We don't have orders. We have one mission:\nget out of Raccoon City with a truth\nno one else can carry.",
                "If you don't mind working without backup,\nwithout recognition, and without a name on\nyour uniform — you'll find us where it's darkest."
            ]
        }
    }

};


const uiText = {
    comingSoon:{ cz:"BRIEFING BRZY K DISPOZICI...", en:"BRIEFING COMING SOON..." },
    armoryComingSoon:{ cz:"ARMORY BRZY K DISPOZICI...", en:"ARMORY BRIEFING COMING SOON..." },
    legend:{ cz:"CQB = budovy<br>OS = venkovní prostor", en:"CQB = buildings<br>OS = outdoor area" },
    footer:{ cz:"Co není uvedeno mezi povoleným vybavením frakce, není pro danou frakci povoleno.", en:"Anything not listed among the faction's approved equipment is not permitted for that faction." },
    realReplica:{ cz:"reálná předloha ↗", en:"real-world reference ↗" }
};


function changeFaction(faction){

    updateDroneScoreVisibility(faction);
    updateHordeVisibility(faction);

    if(faction === "stars"){
        startZombieHorde();
    }else{
        stopZombieHorde(true);
    }
    updateGrenadeVisibility(faction);

if(faction === "ubcs"){
    startGrenadeDrop();
}else{
    stopGrenadeDrop(true);
}
    updateSampleVisibility(faction);

if(faction === "uss"){
    startSampleCollection();
}else{
    stopSampleCollection(true, false);
}
    const chooseText = document.getElementById("chooseText");
    const factionTabs = document.getElementById("factionTabs");

    chooseText.style.display = "none";
    factionTabs.classList.add("active");

    transition.style.display = "flex";
    transition.classList.add("active");

    const data = introDataByFaction[faction];
    const lang = getLang();

    setAtmosphere(data.atmosphere);

    typeText(data.loading[lang], () => {

        wallpaper.style.backgroundImage = `url('${data.image}')`;

        currentFaction = faction;
        factionIntroData = data;

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
   ARMORY DATA (CZ / EN)
========================= */

const armoryData = {

    stars:[
        { icon:"icons/pistol.png",  label:{cz:"PISTOLE",en:"PISTOL"}, note:{cz:null,en:null}, joule:"1,3J", zone:"CQB/OS", mode:{cz:"semi",en:"semi"} },
        { icon:"icons/rifle.png",   label:{cz:"ÚTOČNÁ PUŠKA",en:"ASSAULT RIFLE"}, note:{cz:"20RPS max",en:"20RPS max"}, joule:"1,8J", zone:"OS", mode:{cz:"semi / full auto",en:"semi / full auto"} },
        { icon:"icons/grenade.png", label:{cz:"GRANÁT",en:"GRENADE"}, note:{cz:"Pyrosoft\nTaggin\npružinové\nplynové",en:"Pyrosoft\nTaggin\nspring\ngas"}, joule:null, zone:"OS", mode:{cz:null,en:null} },
        { icon:"icons/lmg.png",     label:{cz:"KULOMET",en:"LMG"}, note:{cz:"20RPS max",en:"20RPS max"}, joule:"1,5J", zone:"OS", mode:{cz:"full auto",en:"full auto"} },
        { icon:"icons/shotgun.png", label:{cz:"BROKOVNICE",en:"SHOTGUN"}, note:{cz:null,en:null}, joule:"1,3J", zone:"CQB/OS", mode:{cz:null,en:null} },
        { icon:"icons/shield.png",  label:{cz:"ŠTÍT (S HLEDÍM)",en:"SHIELD (WITH VISOR)"}, note:{cz:"Pouze se záložní pistolí",en:"Only with a secondary pistol"}, joule:null, zone:"CQB/OS", mode:{cz:"semi",en:"semi"} }
    ],

    uss:[
        { icon:"icons/pistol.png",  label:{cz:"PISTOLE",en:"PISTOL"}, note:{cz:null,en:null}, joule:"1,3J", zone:"CQB/OS", mode:{cz:"semi",en:"semi"} },
        { icon:"icons/rifle.png",   label:{cz:"ÚTOČNÁ PUŠKA",en:"ASSAULT RIFLE"}, note:{cz:"20RPS max",en:"20RPS max"}, joule:"1,8J", zone:"OS", mode:{cz:"semi / full auto",en:"semi / full auto"} },
        { icon:"icons/grenade.png", label:{cz:"GRANÁT",en:"GRENADE"}, note:{cz:"Pyrosoft\nTaggin",en:"Pyrosoft\nTaggin"}, joule:null, zone:"OS", mode:{cz:null,en:null} },
        { icon:"icons/lmg.png",     label:{cz:"KULOMET",en:"LMG"}, note:{cz:"20RPS max",en:"20RPS max"}, joule:"1,5J", zone:"OS", mode:{cz:"full auto",en:"full auto"} },
        { icon:"icons/smg.png",     label:{cz:"SAMOPAL",en:"SMG"}, tooltipDesc:{cz:"Reálná předloha",en:"Real-world replica"}, tooltipLink:"https://www.imfdb.org/wiki/Category:Submachine_Gun", note:{cz:"25RPS max\nReálná předloha",en:"25RPS max\nReal-world replica"}, joule:"1,3J", zone:"CQB/OS", mode:{cz:"semi / full auto",en:"semi / full auto"} },
        { icon:"icons/grenade.png", label:{cz:"GRANÁT",en:"GRENADE"}, note:{cz:"pružinové\nplynové",en:"spring\ngas"}, joule:null, zone:"CQB/OS", mode:{cz:null,en:null} }
    ],

    ubcs:[
        { icon:"icons/pistol.png",   label:{cz:"PISTOLE",en:"PISTOL"}, note:{cz:null,en:null}, joule:"1,3J", zone:"CQB/OS", mode:{cz:"semi",en:"semi"} },
        { icon:"icons/rifle.png",    label:{cz:"ÚTOČNÁ PUŠKA",en:"ASSAULT RIFLE"}, note:{cz:"20RPS max",en:"20RPS max"}, joule:"1,8J", zone:"OS", mode:{cz:"semi / full auto",en:"semi / full auto"} },
        { icon:"icons/grenade.png",  label:{cz:"GRANÁT",en:"GRENADE"}, note:{cz:"Pyrosoft\nTaggin\npružinové\nplynové",en:"Pyrosoft\nTaggin\nspring\ngas"}, joule:null, zone:"OS", mode:{cz:null,en:null} },
        { icon:"icons/lmg.png",      label:{cz:"KULOMET",en:"LMG"}, note:{cz:"20RPS max",en:"20RPS max"}, joule:"1,5J", zone:"OS", mode:{cz:"full auto",en:"full auto"} },
        { icon:"icons/launcher.png", label:{cz:"GRANÁTOMET",en:"GRENADE LAUNCHER"}, note:{cz:"Granátomet",en:"Grenade launcher"}, joule:null, zone:"CQB/OS", mode:{cz:"Greengas",en:"Greengas"} },
        { icon:"icons/dmr.png",      label:{cz:"DMR",en:"DMR"}, tooltipDesc:{cz:"Designated Marksman Rifle — reálná předloha, optika, dvojnožka, lowcap zásobník",en:"Designated Marksman Rifle — real-world replica, optics, bipod, low-cap magazine"}, tooltipLink:"https://en.wikipedia.org/wiki/Category:Designated_marksman_rifles", note:{cz:"pouze nad 20m\nReálná předloha\nPouze se záložní pistolí",en:"20m+ only\nReal-world replica\nOnly with secondary pistol"}, joule:"2,5J", zone:"OS", mode:{cz:"semi",en:"semi"} }
    ],

    specops:[
        { icon:"icons/pistol.png",  label:{cz:"PISTOLE",en:"PISTOL"}, note:{cz:null,en:null}, joule:"1,3J", zone:"CQB/OS", mode:{cz:"semi",en:"semi"} },
        { icon:"icons/rifle.png",   label:{cz:"ÚTOČNÁ PUŠKA",en:"ASSAULT RIFLE"}, note:{cz:"20RPS max",en:"20RPS max"}, joule:"1,8J", zone:"OS", mode:{cz:"semi / full auto",en:"semi / full auto"} },
        { icon:"icons/grenade.png", label:{cz:"GRANÁT",en:"GRENADE"}, note:{cz:"Pyrosoft\nTaggin\npružinové\nplynové",en:"Pyrosoft\nTaggin\nspring\ngas"}, joule:null, zone:"OS", mode:{cz:null,en:null} },
        { icon:"icons/lmg.png",     label:{cz:"KULOMET",en:"LMG"}, note:{cz:"20RPS max",en:"20RPS max"}, joule:"1,5J", zone:"OS", mode:{cz:"full auto",en:"full auto"} },
        { icon:"icons/nvg.png",     tooltipLines:{cz:["DRONY","NOČNÍ VIDĚNÍ","THERMOVIZE"],en:["DRONES","NIGHT VISION","THERMAL"]}, note:{cz:"Zákaz shazovat předměty",en:"Dropping objects is forbidden"}, joule:null, zone:"CQB/OS", mode:{cz:"NVG / THERMOVIZE",en:"NVG / THERMAL"} },
        { icon:"icons/sniper.png",  label:{cz:"SNIPER",en:"SNIPER"}, tooltipDesc:{cz:"Manuálně nabíjecí puška s optikou (greengas/CO2/HPA/manuál)",en:"Manually-loaded rifle with optics (greengas/CO2/HPA/manual)"}, note:{cz:"pouze nad 30m\nPouze se záložní pistolí",en:"30m+ only\nOnly with secondary pistol"}, joule:"3,5J", zone:"OS", mode:{cz:"semi",en:"semi"} }
    ]

};


function renderArmory(faction){

    const table = document.getElementById("factionContent");
    const data = armoryData[faction];
    const lang = getLang();

    if(!data){
        table.innerHTML = `<p class="faction-text">${uiText.armoryComingSoon[lang]}</p>`;
        return;
    }

    table.innerHTML = `
    <div class="armory-legend">${uiText.legend[lang]}</div>
    <div class="armory-table">` +

        data.map(row => {

            const label = row.label ? row.label[lang] : "";
            const note = row.note ? row.note[lang] : null;
            const mode = row.mode ? row.mode[lang] : null;
            const tooltipDesc = row.tooltipDesc ? row.tooltipDesc[lang] : null;
            const tooltipLines = row.tooltipLines ? row.tooltipLines[lang] : null;

            return `
            <div class="armory-row">
               <div class="armory-icon-wrap" onclick="toggleArmoryTooltip(this, event)">
    <img src="${row.icon}" class="armory-icon" alt="">
    <div class="armory-tooltip">
    ${tooltipLines
        ? tooltipLines.map(line => `<span class="tooltip-line">${line}</span>`).join("")
        : `<span class="tooltip-label">${label}</span>`}
    ${tooltipDesc ? `<span class="tooltip-desc">${tooltipDesc}</span>` : ""}
    ${row.tooltipLink ? `<a href="${row.tooltipLink}" target="_blank" rel="noopener">${uiText.realReplica[lang]}</a>` : ""}
</div>
</div>
                ${note ? `<div class="armory-note">${note.replace(/\n/g,"<br>")}</div>` : "<div></div>"}
                <div class="armory-right">
                    ${row.joule ? `<div class="armory-joule">${row.joule}</div>` : ""}
                    ${row.zone ? `<div class="armory-zone">${row.zone}</div>` : ""}
                    ${mode ? `<div class="armory-mode">${mode}</div>` : ""}
                </div>
            </div>
        `;

        }).join("") +

        `</div>
        <div class="armory-footer">${uiText.footer[lang]}</div>`;

}


let introTypingInterval = null;

function renderIntro(data, instant){

    const content = document.getElementById("factionContent");

    clearInterval(introTypingInterval);

    const lang = getLang();

    if(!data){
        content.innerHTML = `<p class="faction-text">${uiText.comingSoon[lang]}</p>`;
        return;
    }

    content.innerHTML = `
        <div class="intro-wrap">
            <div class="intro-title">${data.title[lang]}</div>
            <div class="intro-subtitle">${data.subtitle[lang]}</div>
            <div class="intro-body" id="introBody"></div>
        </div>
    `;

    const bodyEl = document.getElementById("introBody");
    const paragraphs = data.paragraphs[lang];

    if(instant){

        bodyEl.innerHTML = paragraphs
            .map(p => `<p>${p.replace(/\n/g,"<br>")}</p>`)
            .join("");

    }else{

        typeIntro(paragraphs, bodyEl);

    }

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

            const typed = text.slice(0, charIndex + 1).replace(/\n/g,"<br>");
            currentP.innerHTML = typed + `<span class="typing-cursor"></span>`;
            charIndex++;

            const scrollContainer = document.getElementById("factionContent");
            scrollContainer.scrollTop = scrollContainer.scrollHeight;

        }else{

            currentP.innerHTML = text.replace(/\n/g,"<br>");
            paraIndex++;
            charIndex = 0;

            if(paraIndex < paragraphs.length){
                currentP = document.createElement("p");
                currentP.innerHTML = `<span class="typing-cursor"></span>`;
                bodyEl.appendChild(currentP);
            }

        }

    }, 18);

}


function showFactionSection(section, btn){

    if(!currentFaction) return;

    document.querySelectorAll("#factionTabs button")
        .forEach(b => b.classList.remove("active-tab"));

    if(btn) btn.classList.add("active-tab");

    if(section === "intro"){
        renderIntro(factionIntroData, false);
    }

    if(section === "armory"){
        renderArmory(currentFaction);
    }

}


function toggleArmoryTooltip(wrap, event){

    if(event.target.tagName === "A") return;

    const wasActive = wrap.classList.contains("tooltip-active");

    document.querySelectorAll(".armory-icon-wrap.tooltip-active")
        .forEach(el => {
            el.classList.remove("tooltip-active");
            const tip = el.querySelector(".armory-tooltip");
            if(tip) tip.style.transform = "";
        });

    if(!wasActive){

        wrap.classList.add("tooltip-active");

        const tooltip = wrap.querySelector(".armory-tooltip");
        const rect = tooltip.getBoundingClientRect();
        const margin = 12;

        let shift = 0;

        if(rect.left < margin){
            shift = margin - rect.left;
        }else if(rect.right > window.innerWidth - margin){
            shift = (window.innerWidth - margin) - rect.right;
        }

        if(shift !== 0){
            tooltip.style.transform = `translateX(calc(-50% + ${shift}px)) translateY(0)`;
        }

    }

}

document.addEventListener("click", (e) => {
    if(!e.target.closest(".armory-icon-wrap")){
        document.querySelectorAll(".armory-icon-wrap.tooltip-active")
            .forEach(el => el.classList.remove("tooltip-active"));
    }
});


/* =========================
   LANGUAGE SWITCH HOOK
========================= */

function onLangApplied(lang){

    if(!currentFaction) return;

    const activeBtn = document.querySelector("#factionTabs button.active-tab");

    if(!activeBtn) return;

    const section = activeBtn.dataset.section;

    if(section === "intro"){
        renderIntro(factionIntroData, true);
    }

    if(section === "armory"){
        renderArmory(currentFaction);
    }

    updateHordeButtonText();
    updateGrenadeButtonText();
    updateSampleButtonText();

}
/* =========================
   STARS ZOMBIE HORDE
========================= */

const hordeLayer = document.getElementById("hordeLayer");
const hordeScoreValue = document.getElementById("hordeScoreValue");

let hordeActive = false;
let hordeStopped = false;
let hordeSpawnTimeout = null;
let hordeStartTime = 0;
let hordeScore = 0;
let hordeMisses = 0;
const MAX_HORDE_MISSES = 10;

const zombieSprites = ["zombie1.png","zombie2.png","zombie3.png"];


function updateHordeVisibility(faction){

    const score = document.getElementById("hordeScore");
    const btn = document.getElementById("stopHordeBtn");

    if(!score || !btn) return;

    if(faction === "stars"){
        score.classList.add("visible");
        btn.classList.add("visible");
    }else{
        score.classList.remove("visible");
        btn.classList.remove("visible");
    }

}

function updateHordeScore(){
    if(hordeScoreValue) hordeScoreValue.textContent = hordeScore;
    const missEl = document.getElementById("hordeMissValue");
    if(missEl) missEl.textContent = hordeMisses;
}

function updateHordeButtonText(){

    const btn = document.getElementById("stopHordeBtn");
    if(!btn) return;

    const lang = getLang();

    if(hordeStopped){
        btn.textContent = lang === "en" ? "HORDE TERMINATED" : "HORDA ZLIKVIDOVÁNA";
    }else{
        btn.textContent = lang === "en" ? "STOP HORDE" : "ZASTAVIT HORDU";
    }

}


function spawnZombie(isBoss){

    const el = document.createElement("img");
    el.className = "zombie-sprite" + (isBoss ? " boss" : "");
    el.alt = "";

    let points = 100;

    if(isBoss){
        el.src = Math.random() < 0.5 ? "nemesis.png" : "wesker.png";
        points = 1000;
    }else{
        el.src = zombieSprites[Math.floor(Math.random() * zombieSprites.length)];
    }

    const startX = Math.random() * (window.innerWidth - 130);
    el.style.left = startX + "px";
    el.style.bottom = "-160px";

    hordeLayer.appendChild(el);

    const elapsed = performance.now() - hordeStartTime;
    const baseDuration = isBoss ? 9000 : 7000;
    const minDuration = isBoss ? 5000 : 2800;
    const duration = Math.max(minDuration, baseDuration - elapsed / 25);

    el.style.transition = `transform ${duration}ms linear, opacity .25s ease`;

    requestAnimationFrame(() => {
        el.style.transform = `translateY(-${window.innerHeight + 250}px)`;
    });

    let decided = false;

    el.addEventListener("transitionend", (e) => {

        if(e.propertyName !== "transform") return;
        if(decided) return;

        decided = true;
        el.remove();

        hordeMisses++;
        updateHordeScore();

        if(hordeMisses >= MAX_HORDE_MISSES){
            toggleHorde();
        }

    });

    el.addEventListener("click", () => {

        if(decided || hordeStopped) return;
        decided = true;

        hordeScore += points;
        updateHordeScore();

        el.classList.add("hit");
        setTimeout(() => el.remove(), 220);

    });

}


function hordeSpawnLoop(){

    if(!hordeActive || hordeStopped) return;

    const elapsed = performance.now() - hordeStartTime;

    const isWave = Math.random() < 0.08 && elapsed > 8000;
    const isBoss = !isWave && Math.random() < 0.06;

    if(isWave){

        const waveSize = 4 + Math.floor(Math.random() * 4);

        for(let i = 0; i < waveSize; i++){
            setTimeout(() => spawnZombie(false), i * 120);
        }

    }else{

        spawnZombie(isBoss);

    }

    const baseInterval = 1100;
    const minInterval = 400;
    const interval = Math.max(minInterval, baseInterval - elapsed / 40);

    hordeSpawnTimeout = setTimeout(hordeSpawnLoop, interval);

}


function startZombieHorde(){

    hordeActive = true;
    hordeStopped = false;
    hordeScore = 0;
    hordeMisses = 0;
    hordeStartTime = performance.now();

    updateHordeScore();
    updateHordeButtonText();

    const btn = document.getElementById("stopHordeBtn");
    if(btn) btn.classList.remove("terminated");

    clearTimeout(hordeSpawnTimeout);
    hordeSpawnLoop();

}


function stopZombieHorde(clearBoard){

    hordeActive = false;
    clearTimeout(hordeSpawnTimeout);

    hordeLayer.querySelectorAll(".zombie-sprite").forEach(el => el.remove());

    if(clearBoard){
        const score = document.getElementById("hordeScore");
        const btn = document.getElementById("stopHordeBtn");
        if(score) score.classList.remove("visible");
        if(btn) btn.classList.remove("visible");
    }

}


function toggleHorde(){

    if(hordeStopped) return;

    hordeStopped = true;
    hordeActive = false;

    clearTimeout(hordeSpawnTimeout);

    hordeLayer.querySelectorAll(".zombie-sprite").forEach(el => {
        el.classList.add("hit");
        setTimeout(() => el.remove(), 250);
    });

    const btn = document.getElementById("stopHordeBtn");
    if(btn) btn.classList.add("terminated");

    updateHordeButtonText();

}
/* =========================
   UBCS GRENADE CATCH
========================= */

const grenadeLayer = document.getElementById("grenadeLayer");
const ubcsBasket = document.getElementById("ubcsBasket");
const grenadeScoreValue = document.getElementById("grenadeScoreValue");

let grenadeActive = false;
let grenadeItems = [];
let grenadeStartTime = 0;
let grenadeScore = 0;
let grenadeSpawnTimeout = null;
let grenadeAnimFrame = null;


function updateBasketPosition(clientX){

    const basketWidth = ubcsBasket.offsetWidth || 160;
    let left = clientX - basketWidth / 2;

    left = Math.max(0, Math.min(window.innerWidth - basketWidth, left));

    ubcsBasket.style.left = left + "px";

}

document.addEventListener("mousemove", (e) => {
    updateBasketPosition(e.clientX);
});

document.addEventListener("touchmove", (e) => {
    if(e.touches.length > 0){
        updateBasketPosition(e.touches[0].clientX);
    }
}, { passive:true });


function updateGrenadeVisibility(faction){

    const score = document.getElementById("grenadeScore");
    const btn = document.getElementById("stopGrenadeBtn");

    if(!score || !ubcsBasket || !btn) return;

    if(faction === "ubcs"){
        score.classList.add("visible");
        ubcsBasket.classList.add("active");
        btn.classList.add("visible");
    }else{
        score.classList.remove("visible");
        ubcsBasket.classList.remove("active");
        btn.classList.remove("visible");
    }

}

function updateGrenadeScore(){
    if(grenadeScoreValue) grenadeScoreValue.textContent = grenadeScore;
    const missEl = document.getElementById("grenadeMissValue");
    if(missEl) missEl.textContent = grenadeMisses;
}


function spawnGrenade(){

    const el = document.createElement("img");
    el.className = "grenade-drop";
    el.alt = "";

    const r = Math.random();
    let type = "grenade";
    let src = "grenade.png";

    if(r < 0.15){
        type = "flash";
        src = "flash.png";
    }else if(r < 0.30){
        type = "biohazard";
        src = "biohazard.png";
    }

    el.src = src;

    const width = 70;
    const startX = Math.random() * (window.innerWidth - width);

    el.style.left = startX + "px";
    el.style.top = "-90px";

    grenadeLayer.appendChild(el);

    const baseSpeed = 2.4 + Math.random() * 1.2;

    grenadeItems.push({ el, y:-90, baseSpeed, type });

}


function catchGrenade(item, index){

    let points = 100;

    if(item.type === "flash") points = 500;
    if(item.type === "biohazard") points = -500;

    grenadeScore += points;
    updateGrenadeScore();

    item.el.classList.add("caught");
    setTimeout(() => item.el.remove(), 200);

    grenadeItems.splice(index, 1);

}


function grenadeLoop(now){

    if(!grenadeActive) return;

    const elapsed = now - grenadeStartTime;
    const speedFactor = Math.min(2.2, 1 + elapsed / 40000);
    const basketRect = ubcsBasket.getBoundingClientRect();

    for(let i = grenadeItems.length - 1; i >= 0; i--){

        const item = grenadeItems[i];

        item.y += item.baseSpeed * speedFactor;
        item.el.style.top = item.y + "px";

        const itemRect = item.el.getBoundingClientRect();

        const verticalOverlap =
            itemRect.bottom >= basketRect.top &&
            itemRect.top <= basketRect.bottom;

        const horizontalOverlap =
            itemRect.right >= basketRect.left &&
            itemRect.left <= basketRect.right;

        if(verticalOverlap && horizontalOverlap){
            catchGrenade(item, i);
            continue;
        }

        if(item.y > window.innerHeight + 60){

            item.el.remove();
            grenadeItems.splice(i, 1);

            if(item.type !== "biohazard"){

                grenadeMisses++;
                updateGrenadeScore();

                if(grenadeMisses >= MAX_GRENADE_MISSES){
                    toggleGrenadeDrop();
                }

            }

        }

    }

    grenadeAnimFrame = requestAnimationFrame(grenadeLoop);

}


function grenadeSpawnLoop(){

    if(!grenadeActive) return;

    const elapsed = performance.now() - grenadeStartTime;

    const multi = elapsed > 10000 && Math.random() < 0.25;
    const count = multi ? 2 + Math.floor(Math.random() * 2) : 1;

    for(let i = 0; i < count; i++){
        setTimeout(() => spawnGrenade(), i * 150);
    }

    const baseInterval = 900;
    const minInterval = 350;
    const interval = Math.max(minInterval, baseInterval - elapsed / 45);

    grenadeSpawnTimeout = setTimeout(grenadeSpawnLoop, interval);

}


let grenadeStopped = false;
let grenadeMisses = 0;
const MAX_GRENADE_MISSES = 10;

function startGrenadeDrop(){

    grenadeActive = true;
    grenadeStopped = false;
    grenadeScore = 0;
    grenadeMisses = 0;
    grenadeStartTime = performance.now();

    updateGrenadeScore();
    updateGrenadeButtonText();

    const btn = document.getElementById("stopGrenadeBtn");
    if(btn) btn.classList.remove("terminated");

    clearTimeout(grenadeSpawnTimeout);
    cancelAnimationFrame(grenadeAnimFrame);

    grenadeSpawnLoop();
    grenadeAnimFrame = requestAnimationFrame(grenadeLoop);

}


function stopGrenadeDrop(clearBoard){

    grenadeActive = false;

    clearTimeout(grenadeSpawnTimeout);
    cancelAnimationFrame(grenadeAnimFrame);

    grenadeItems.forEach(item => item.el.remove());
    grenadeItems = [];

    if(clearBoard){
        const score = document.getElementById("grenadeScore");
        if(score) score.classList.remove("visible");
        if(ubcsBasket) ubcsBasket.classList.remove("active");
    }

}
function updateGrenadeButtonText(){

    const btn = document.getElementById("stopGrenadeBtn");
    if(!btn) return;

    const lang = getLang();

    if(grenadeStopped){
        btn.textContent = lang === "en" ? "GRENADE RAIN STOPPED" : "DÉŠŤ GRANÁTŮ ZASTAVEN";
    }else{
        btn.textContent = lang === "en" ? "STOP GRENADE RAIN" : "ZASTAVIT DÉŠŤ GRANÁTŮ";
    }

}


function toggleGrenadeDrop(){

    if(grenadeStopped) return;

    grenadeStopped = true;
    grenadeActive = false;

    clearTimeout(grenadeSpawnTimeout);
    cancelAnimationFrame(grenadeAnimFrame);

    grenadeItems.forEach(item => item.el.remove());
    grenadeItems = [];

    const btn = document.getElementById("stopGrenadeBtn");
    if(btn) btn.classList.add("terminated");

    updateGrenadeButtonText();

}
/* =========================
   USS SAMPLE COLLECTION
========================= */

const sampleLayer = document.getElementById("sampleLayer");
const sampleScoreValue = document.getElementById("sampleScoreValue");
const sampleMissValue = document.getElementById("sampleMissValue");

let sampleActive = false;
let sampleStopped = false;
let sampleSpawnTimeout = null;
let sampleStartTime = 0;
let sampleScore = 0;
let sampleMisses = 0;

const MAX_SAMPLE_MISSES = 10;


function updateSampleVisibility(faction){

    const score = document.getElementById("sampleScore");
    const btn = document.getElementById("stopSampleBtn");

    if(!score || !btn) return;

    if(faction === "uss"){
        score.classList.add("visible");
        btn.classList.add("visible");
    }else{
        score.classList.remove("visible");
        btn.classList.remove("visible");
    }

}

function updateSampleScore(){
    if(sampleScoreValue) sampleScoreValue.textContent = sampleScore;
    if(sampleMissValue) sampleMissValue.textContent = sampleMisses;
}

function updateSampleButtonText(){

    const btn = document.getElementById("stopSampleBtn");
    if(!btn) return;

    const lang = getLang();

    if(sampleStopped){
        btn.textContent = lang === "en" ? "COLLECTION STOPPED" : "SBĚR ZASTAVEN";
    }else{
        btn.textContent = lang === "en" ? "STOP SAMPLE COLLECTION" : "ZASTAVIT SBĚR VZORKŮ";
    }

}


function spawnSample(){

    const el = document.createElement("img");
    el.className = "sample-item";
    el.alt = "";

    const isVaccine = Math.random() < 0.5;
    el.src = isVaccine ? "vaccine.png" : "tvirus.png";

    const points = isVaccine ? 50 : 100;

    const width = 120;
    const padding = 40;

    const maxX = window.innerWidth - width - padding;
    const maxY = window.innerHeight * 0.7 - padding;

    const x = padding + Math.random() * Math.max(0, maxX - padding);
    const y = padding + Math.random() * Math.max(0, maxY - padding);

    el.style.left = x + "px";
    el.style.top = y + "px";

    sampleLayer.appendChild(el);

    requestAnimationFrame(() => {
        el.classList.add("visible");
    });

    const elapsed = performance.now() - sampleStartTime;
    const baseDuration = 2200;
    const minDuration = 900;
    const visibleDuration = Math.max(minDuration, baseDuration - elapsed / 30);

    let resolved = false;

    const missTimeout = setTimeout(() => {

        if(resolved) return;
        resolved = true;

        el.classList.remove("visible");

        setTimeout(() => el.remove(), 400);

        sampleMisses++;
        updateSampleScore();

        if(sampleMisses >= MAX_SAMPLE_MISSES){
            stopSampleCollection(false, true);
        }

    }, visibleDuration);

    el.addEventListener("click", () => {

        if(resolved) return;
        resolved = true;

        clearTimeout(missTimeout);

        sampleScore += points;
        updateSampleScore();

        el.classList.add("caught");
        setTimeout(() => el.remove(), 220);

    });

}


function sampleSpawnLoop(){

    if(!sampleActive || sampleStopped) return;

    spawnSample();

    const elapsed = performance.now() - sampleStartTime;
    const baseInterval = 1300;
    const minInterval = 500;
    const interval = Math.max(minInterval, baseInterval - elapsed / 35);

    sampleSpawnTimeout = setTimeout(sampleSpawnLoop, interval);

}


function startSampleCollection(){

    sampleActive = true;
    sampleStopped = false;
    sampleScore = 0;
    sampleMisses = 0;
    sampleStartTime = performance.now();

    updateSampleScore();
    updateSampleButtonText();

    const btn = document.getElementById("stopSampleBtn");
    if(btn) btn.classList.remove("terminated");

    clearTimeout(sampleSpawnTimeout);
    sampleSpawnLoop();

}


function stopSampleCollection(clearBoard, autoStopped){

    sampleActive = false;
    sampleStopped = true;

    clearTimeout(sampleSpawnTimeout);

    sampleLayer.querySelectorAll(".sample-item").forEach(el => el.remove());

    const btn = document.getElementById("stopSampleBtn");
    if(btn) btn.classList.add("terminated");

    updateSampleButtonText();

    if(clearBoard){
        const score = document.getElementById("sampleScore");
        if(score) score.classList.remove("visible");
        if(btn) btn.classList.remove("visible");
    }

}


function toggleSampleCollection(){

    if(sampleStopped) return;

    stopSampleCollection(false, false);

}
