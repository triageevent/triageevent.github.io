const wallpaper = document.getElementById("wallpaper");
const description = document.getElementById("description");


function changeMode(mode){


    if(mode === "nightfall"){


        wallpaper.style.backgroundImage =
        "url('nightfall.png')";


        description.innerHTML =
        "NIGHT OPERATION // DARKNESS ENGAGED";


    }



    if(mode === "sunrise"){


        wallpaper.style.backgroundImage =
        "url('sunrise.png')";


        description.innerHTML =
        "FIRST LIGHT // SURVIVAL PHASE";


    }



    if(mode === "dawn"){


        wallpaper.style.backgroundImage =
        "url('dawn.png')";


        description.innerHTML =
        "FINAL HOURS // LAST STAND";


    }


}
