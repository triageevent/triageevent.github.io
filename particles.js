const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
if (!ctx) {
    console.error("Canvas 2D context se nepodařilo vytvořit.");
    }

function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resize();

window.addEventListener("resize", resize);

const particles = [];

const amount = window.innerWidth < 700 ? 70 : 150;

for(let i=0;i<amount;i++){

    particles.push({

        x:Math.random()*canvas.width,

        y:Math.random()*canvas.height,

        size:Math.random()*2+0.5,

        speed:Math.random()*0.4+0.1,

        drift:(Math.random()-0.5)*0.25,

        alpha:Math.random()*0.5+0.15

    });

}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p=>{

        ctx.beginPath();

        ctx.fillStyle=`rgba(255,255,255,${p.alpha})`;

        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);

        ctx.fill();

        p.y+=p.speed;

        p.x+=p.drift;

        if(p.y>canvas.height+10){

            p.y=-10;

            p.x=Math.random()*canvas.width;

        }

        if(p.x<-10) p.x=canvas.width+10;
        if(p.x>canvas.width+10) p.x=-10;

    });

    requestAnimationFrame(draw);

}

draw();
