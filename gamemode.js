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

            setTimeout(callback,500);

        }

    },35);

}



function changeMode(mode){

    transition.classList.add("active");


    let image = "";
    let text = "";
    let loading = "";


    if(mode === "nightfall"){

        image = "nightfall.png";

        text =
`NIGHT OPERATION // DARKNESS ENGAGED


Když padne tma...
4 týmy vstupují do zóny, kde každé rozhodnutí může znamenat rozdíl mezi přežitím a koncem operace.


HLAVNÍ ÚKOL:
Obsadit budovy na konci noci.


ODMĚNA:
Za každou obsazenou budovu získává tým 10 náramků.
Tyto náramky lze využít v následujících herních módech.


POVOLENO:
Vše, co ti tvá frakce a svědomí dovolí.`;


        loading = "LOADING NIGHTFALL PROTOCOL...";

    }



    if(mode === "sunrise"){

        image = "sunrise.png";

        text =
        "FIRST LIGHT // SURVIVAL PHASE";

        loading = "LOADING SUNRISE PROTOCOL...";

    }



    if(mode === "dawn"){

        image = "dawn.png";

        text =
        "FINAL HOURS // LAST STAND";

        loading = "LOADING DAWN PROTOCOL...";

    }



    typeText(loading,()=>{

        wallpaper.style.backgroundImage =
            `url('${image}')`;


        description.textContent = text;


        setTimeout(()=>{

            transition.classList.remove("active");

        },500);

    });

}
