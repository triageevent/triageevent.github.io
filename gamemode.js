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


/* =========================
   MODE DATA (CZ / EN)
========================= */

const modeData = {

    nightfall:{

        image:"nightfall.png",

        loading:{
            cz:"NAČÍTÁNÍ NIGHTFALL PROTOKOLU...",
            en:"LOADING NIGHTFALL PROTOCOL..."
        },

        text:{

cz:
`NOČNÍ OPERACE // TEMNOTA AKTIVOVÁNA


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
a svědomí dovolí. Kromě dronů...`,

en:
`NIGHT OPERATION // DARKNESS ENGAGED


When darkness falls...

Four teams enter the zone.
Four bases.
One night.


MAIN OBJECTIVE:

Capture as many buildings as possible and hold them until the operation ends.


REWARD:

For every captured building, the team earns 10 bracelets.

These bracelets will hold value
in the following game modes.


BASES:

A base is a safe zone during the operation.
No shooting is allowed inside a base.


RESPAWN:

Every hour, the operation takes a breath.
Fallen players return to the game.


AND WHAT'S ALLOWED?

Anything your faction and your conscience
allow. Except drones...`

        }

    },

    sunrise:{

        image:"sunrise.png",

        loading:{
            cz:"NAČÍTÁNÍ SUNRISE PROTOKOLU...",
            en:"LOADING SUNRISE PROTOCOL..."
        },

        text:{

cz:
`PRVNÍ SVĚTLO // FÁZE PŘEŽITÍ


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

Vše.`,

en:
`FIRST LIGHT // SURVIVAL PHASE


The night is over.

Four teams remain in the zone.
Joined by those who only arrived with the first light.

The sun brings light.
Not safety.


COMMANDERS:

Each team gets a commander.

The commander fights alongside their team
and is the only one who can capture a building.

Capturing is done using a smoke grenade.


THREE KEY POINTS:


POLICE STATION

Capturing it gives the team 20 minutes
of support from Nemesis and A. Wesker.

They cannot be eliminated.
A hit to the bell only disables them for 20 seconds.


HOSPITAL

Capturing it gives the team 60 minutes
of two medics:
Plague Doctor and Condor One.

They fight alongside the team
while also trying to revive hit players.

They can be eliminated without confirmation.


COMMUNICATIONS TOWER

No time limit.

It stays under a team's control
until someone else captures it.

This is where the radio is located,
which will receive information
about the next loot drop's location.


RESPAWN:

Every 30 minutes.


BRACELETS:

When deployed into combat, a player wears a bracelet.
The bracelet means they're alive.

After being hit, they stay in place.

A teammate or an opponent can remove their bracelet.

Only once it's removed is the player sent to respawn.


LOOT DROP:

Supply packages will appear in the zone
containing items from the event's partners and sponsors.

Contents can be obtained by completing tasks
or by trading bracelets.

The number of bracelets required
depends on the value of the loot drop.


ALLOWED:

Everything.`

        }

    },

    dawn:{

        image:"dawn.png",

        loading:{
            cz:"NAČÍTÁNÍ DAWN PROTOKOLU...",
            en:"LOADING DAWN PROTOCOL..."
        },

        text:{

cz:
`POSLEDNÍ HODINY // POSLEDNÍ VZDOR


Siréna zazní.

A s ní končí válka frakcí.


KONEC FRAKCÍ:

Frakce přestávají existovat.
Velitelé přestávají být veliteli.

Od této chvíle neexistují spojenci ani nepřátelé.
Jen lidé, kteří chtějí přežít.

Hráči mohou vytvářet vlastní aliance,
spolupracovat nebo zradit.


ZÓNA:

Po zaznění sirény se herní zóna
začne postupně zmenšovat.

Čím méně prostoru zbývá,
tím méně možností zůstává.


LABORATORY ZONE:

Zasažený hráč odchází do Laboratory Zone.

Odtud vedou zpět do hry dvě cesty.


PRVNÍ CESTA:

Vybojovat si návrat v souboji 2 VS 2
na pistole.

Pistole budou k dispozici
i hráčům, kteří nemají vlastní.


DRUHÁ CESTA:

Zaplatit 2 pásky získané
v předchozích herních módech.

A vrátit se zpět do zóny.


RESPAWN:

Počet návratů do hry není omezen.

Ani počet pokusů v souboji 2 VS 2.


POSLEDNÍ HODINY:

Mezi návraty do hry bude možné využít
další aktivity připravené partnery
a hosty akce.


KONEC:

Jakmile se zóna zmenší na minimum,
návrat do hry už není možný.

Od tohoto okamžiku se počítají
poslední přeživší.


OCENĚNÍ:

1. POSLEDNÍ PŘEŽIVŠÍ
2. POSLEDNÍ PŘEŽIVŠÍ
3. POSLEDNÍ PŘEŽIVŠÍ


POVOLENO:

Vše.`,

en:
`FINAL HOURS // LAST STAND


The siren sounds.

And with it, the faction war ends.


END OF FACTIONS:

Factions cease to exist.
Commanders are no longer commanders.

From this moment, there are no allies or enemies.
Only people who want to survive.

Players can form their own alliances,
cooperate, or betray.


THE ZONE:

Once the siren sounds, the game zone
starts to gradually shrink.

The less space remains,
the fewer options are left.


LABORATORY ZONE:

A hit player goes to the Laboratory Zone.

There are two ways back into the game from here.


FIRST WAY:

Fight your way back in a 2 VS 2
pistol duel.

Pistols will be available
even to players who don't have their own.


SECOND WAY:

Pay 2 bracelets earned
in previous game modes.

And return to the zone.


RESPAWN:

The number of returns to the game is unlimited.

So is the number of attempts in the 2 VS 2 duel.


FINAL HOURS:

Between returns to the game, players will be able
to take part in additional activities
prepared by the event's partners and guests.


THE END:

Once the zone shrinks to its minimum,
returning to the game is no longer possible.

From this moment, the last
survivors are counted.


AWARDS:

1st LAST SURVIVOR
2nd LAST SURVIVOR
3rd LAST SURVIVOR


ALLOWED:

Everything.`

        }

    }

};


let currentMode = null;


function changeMode(mode){

    transition.classList.add("active");

    currentMode = mode;

    const data = modeData[mode];
    const lang = getLang();

    typeText(data.loading[lang], () => {

        wallpaper.style.backgroundImage = `url('${data.image}')`;

        description.textContent = data.text[lang];

        setTimeout(() => {

            transition.classList.remove("active");

        }, 500);

    });

}


/* =========================
   LANGUAGE SWITCH HOOK
========================= */

function onLangApplied(lang){

    if(!currentMode) return;

    description.textContent = modeData[currentMode].text[lang];

}
