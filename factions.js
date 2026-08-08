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

    }



    if(faction === "uss"){

        image = "uss.png";

        text =
`USS

UMBRELLA SECURITY SERVICE

FACTION BRIEFING COMING SOON...`;

        loading =
            "LOADING USS PROTOCOL...";

    }



    if(faction === "ubcs"){

        image = "ubcs.png";

        text =
`UBCS

UMBRELLA BIOHAZARD COUNTERMEASURE SERVICE

FACTION BRIEFING COMING SOON...`;

        loading =
            "LOADING UBCS PROTOCOL...";

    }



    if(faction === "specops"){

        image = "specops.png";

        text =
`SPEC OPS

SPECIAL OPERATIONS

FACTION BRIEFING COMING SOON...`;

        loading =
            "LOADING SPEC OPS PROTOCOL...";

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
