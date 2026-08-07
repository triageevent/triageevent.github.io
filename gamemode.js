const wallpaper = document.getElementById("wallpaper");
const description = document.getElementById("description");
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



function changeMode(mode){

    transition.classList.add("active");


    let image = "";
    let text = "";
    let loading = "";


    /* =========================
       NIGHTFALL
    ========================= */

    if(mode === "nightfall"){

        image = "nightfall.png";

        text =
`NIGHT OPERATION // DARKNESS ENGAGED


Když padne tma...

Čtyři týmy vstupují do zóny.
Čtyři základny.
Jedna noc.


HLAVNÍ ÚKOL:

Obsadit co nejvíce budov a udržet je až do konce operace.


ODMĚNA:

Za každou obsazenou budovu získává tým 10 náramků.

Tyto náramky budou mít svou cenu
v následujících herních módech.


ZÁKLADNY:

Základna je během operace bezpečným územím.
Uvnitř základny se nestřílí.


RESPAWN:

Každou hodinu se operace znovu nadechne.
Padlí hráči se vracejí zpět do hry.


A CO JE POVOLENO?

Vše, co ti tvá frakce
a svědomí dovolí. Kromě dronů...`;

        loading = "LOADING NIGHTFALL PROTOCOL...";

    }


    /* =========================
       SUNRISE
    ========================= */

    if(mode === "sunrise"){

        image = "sunrise.png";

        text =
`FIRST LIGHT // SURVIVAL PHASE


Noc skončila.

Čtyři týmy zůstávají v zóně.
K nim se přidávají ti, kteří dorazili až s prvními paprsky.

Slunce přináší světlo.
Ne bezpečí.


VELITELÉ:

Každý tým dostane svého velitele.

Velitel bojuje po boku svého týmu
a jako jediný může obsadit budovu.

Obsazení probíhá pomocí dýmovnice.


TŘI KLÍČOVÉ BODY:


POLICEJNÍ STANICE

Obsazením získává tým na 20 minut
podporu Nemesise a A. Weskera.

Nelze je vyřadit.
Zásah do zvonečku je pouze na 20 sekund odstaví.


NEMOCNICE

Obsazením získává tým na 60 minut
dva mediky:
Plague Doctor a Condor One.

Bojují po boku týmu
a zároveň se pokoušejí oživovat zasažené hráče.

Lze je vyřadit bez potvrzení.


KOMUNIKAČNÍ VĚŽ

Bez časového omezení.

Dokud ji neobsadí někdo jiný,
zůstává pod kontrolou týmu.

Právě zde se nachází vysílačka,
na kterou budou přicházet informace
o lokaci dalšího loot dropu.


RESPAWN:

Každých 30 minut.


NÁRAMKY:

Při nasazení do boje má hráč náramek.
Náramek znamená, že je živý.

Po zásahu zůstává na místě.

Spoluhráč i protihráč mu může náramek odebrat.

Teprve jeho odebráním je hráč poslán na respawn.


LOOT DROP:

V zóně se budou objevovat zásobovací balíčky
obsahující věci od partnerů a sponzorů akce.

Obsah lze získat plněním úkolů
nebo výměnou za pásky.

Počet potřebných pásků
se odvíjí od hodnoty loot dropu.


POVOLENO:

Vše.`;

        loading = "LOADING SUNRISE PROTOCOL...";

    }


    /* =========================
       DAWN
    ========================= */

    if(mode === "dawn"){

        image = "dawn.png";

        text =
`FINAL HOURS // LAST STAND`;

        loading = "LOADING DAWN PROTOCOL...";

    }


    /* =========================
       LOADING + CHANGE
    ========================= */

    typeText(loading, () => {

        wallpaper.style.backgroundImage =
            `url('${image}')`;

        description.textContent = text;


        setTimeout(() => {

            transition.classList.remove("active");

        }, 500);

    });

}
