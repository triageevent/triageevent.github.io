function changeMode(mode){


const body=document.body;

const title=document.getElementById("mode-name");

const text=document.getElementById("mode-text");



if(mode==="night"){


body.className="menu-page night";


title.innerHTML="NIGHTFALL";

text.innerHTML="Night operation phase";


}



if(mode==="sunrise"){


body.className="menu-page sunrise";


title.innerHTML="SUNRISE";

text.innerHTML="Day operation phase";


}



if(mode==="dawn"){


body.className="menu-page dawn";


title.innerHTML="DAWN";

text.innerHTML="Final operation phase";


}



}
