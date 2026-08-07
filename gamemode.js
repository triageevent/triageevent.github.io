const wallpaper = document.getElementById("wallpaper");
const description = document.getElementById("description");
const transition = document.getElementById("transition");

function changeMode(mode){

    transition.classList.add("active");

    let image = "";
    let text = "";
    let loading = "";

    if(mode === "nightfall"){

        image = "nightfall.png";
        text = "NIGHT OPERATION // DARKNESS ENGAGED";
        loading = "LOADING NIGHTFALL PROTOCOL...";

    }

    if(mode === "sunrise"){

        image = "sunrise.png";
        text = "FIRST LIGHT // SURVIVAL PHASE";
        loading = "LOADING SUNRISE PROTOCOL...";

    }

    if(mode === "dawn"){

        image = "dawn.png";
        text = "FINAL HOURS // LAST STAND";
        loading = "LOADING DAWN PROTOCOL...";

    }

    transition.textContent = loading;

    setTimeout(() => {

        wallpaper.style.backgroundImage = `url('${image}')`;
        description.textContent = text;

    }, 450);

    setTimeout(() => {

        transition.classList.remove("active");

    }, 900);

}
