
const urlSpanishful = "https://spanishful.com/free-class/checkout";
const attemptsCampaign = 1;

function loadImg() {
    let host = window.location.host;
    imgs = [
        '<img src="./assets/img/uno.jpg" alt="" class="img-card">',
        '<img src="./assets/img/dos.jpg" alt="" class="img-card">',
        '<img src="./assets/img/tres.jpg" alt="" class="img-card" >',
        '<img src="./assets/img/cuatro.jpg" alt="" class="img-card">',
        '<img src="./assets/img/cinco.jpg" alt="" class="img-card">',
        '<img src="./assets/img/seis.jpg" alt="" class="img-card">',
        '<img src="./assets/img/siete.jpg" alt="" class="img-card">',
        '<img src="./assets/img/ocho.jpg" alt="" class="img-card">',
        '<img src="./assets/img/nueve.jpg" alt="" class="img-card">',
        '<img src="./assets/img/diez.jpg" alt="" class="img-card">',
    ];
}

function loadAudio() {
    audios = [
        '<audio src="./assets/audio/uno.mp3"></audio>',
        '<audio src="./assets/audio/dos.mp3"></audio>',
        '<audio src="./assets/audio/tres.mp3" ></audio>',
        '<audio src="./assets/audio/cuatro.mp3"></audio>',
        '<audio src="./assets/audio/cinco.mp3"></audio>',
        '<audio src="./assets/audio/seis.mp3"></audio>',
        '<audio src="./assets/audio/siete.mp3"></audio>',
        '<audio src="./assets/audio/ocho.mp3"></audio>',
        '<audio src="./assets/audio/nueve.mp3"></audio>',
        '<audio src="./assets/audio/diez.mp3"></audio>',
    ];
}

let imgs = [],
    selections = [],
    attempts = 0,
    countAttempts = 0,
    hits = 0,
    totalHits = 0,
    countGameOver =0,
    campaign = false,
    countClik =0;

function start() {
    loadBoard();
    document.getElementById("btnStart").style.display = "none";
}

function loadBoard() {

    let url = (window.location != window.parent.location)
        ? document.referrer
        : document.location.href;

    document.addEventListener("click", handler, true);

    loadImg();
    loadAudio();

    //version recortada (cambiar la url para )
    if(url.includes("free-demo")){
        imgs = imgs.slice(0,5);
        audios = audios.slice(0,5);
        campaign = true;
    }

    selections = [];
    totalHits = imgs.length;

    let board = document.getElementById("board");
    let cards = [];
    let maxLength =  imgs.length * 2;
    attempts = campaign ? imgs.length : maxLength; // se pone el numero de cartas que se muetran como intentos

    document.getElementById("header").style.display = "block";
    document.getElementById("countAttempt").innerHTML = "Intentos: " + countAttempts + "/" + attempts;
    document.getElementById("hits").innerHTML = "Aciertos: " + hits;

    for (let i = 0; i < maxLength; i++) {
        //se agrega cada tarjeta al tablero
        cards.push(`
            <div class="card-area" onclick="(selectCard(${i}))">
                <div class="card" id="card${i}">
                    <div class="face back-face-card" id="backFace${i}">
                        ${imgs[0]}
                        ${audios[0]}
                    </div>
                    <div class="face front-face-card">
                        <img src="./assets/reverso_.svg" alt="" class="img-card">
                    </div>
                </div>
            </div>
        `);
        if (i % 2 == 1) {
            imgs.splice(0, 1);
            audios.splice(0, 1);
        }
    }

    cards.sort(() => Math.random() - 0.5);
    board.innerHTML = cards.join(" ");

    setTimeout(() => {
        document.removeEventListener("click", handler, true);
    }, 3000);
}

function handler(e) {
    e.stopPropagation();
    e.preventDefault();
}

function selectCard(i) {
    let card = document.getElementById("card" + i);

    if (countClik == 2)return;

    if (card.style.transform != "rotateY(180deg)") {
        let audio = card.querySelector("audio");
        song(audio.src);

        card.style.transform = "rotateY(180deg)";
        selections.push(i);
        countClik++;
    }

    if (selections.length == 2) {
        deselections(selections);
        selections = [];
    }
}

function deselections(selections) {
    setTimeout(() => {
        let back1 = document.getElementById("backFace" + selections[0]);
        let back2 = document.getElementById("backFace" + selections[1]);

        //si las tarjetas son diferentes se deseleccionan y se suma un intento
        if (back1.innerHTML != back2.innerHTML) {
            let card1 = document.getElementById("card" + selections[0]);
            let card2 = document.getElementById("card" + selections[1]);
            card1.style.transform = "rotateY(0deg)";
            card2.style.transform = "rotateY(0deg)";
            sumAtttempt();
        }
        else {
            //si acierta se colorean de color verde y se voltean, se suma un acirto
            countHits();
            back1.style.background = "#a6d136";
            back2.style.background = "#a6d136";
        }
        countClik=0;
    }, 1000);
}

//reproduce auidio
function song(src) {
    var sound = new Howl({
        src: [src]
    });
    sound.play();
}

function sumAtttempt() {
    countAttempts++;
    document.getElementById("countAttempt").innerHTML = "Intentos: " + countAttempts + "/" + attempts;
    countAttempts == attempts && gameOver();
}

function countHits() {
    hits++;
    document.getElementById("hits").innerHTML = "Aciertos: " + hits;
    hits == totalHits && gameOver();
}

function tryAgain() {
    var modal = document.getElementById("gameOver");
    modal.style.display = "none";
    countAttempts = 0;
    hits = 0;
    loadBoard();
}

function gameOver() {
    var modal = document.getElementById("gameOver"),
    score = document.getElementById("score");
    textScore = "Score " + hits + "/" + totalHits;
    if(campaign===true){
        countGameOver++;

        if(countGameOver == attemptsCampaign) {
            document.getElementById("div-contect").style.height  = "320px";
            btnTry = document.getElementById("tryagain");
            divCoin = document.getElementById("divCoin");
            divCoin.innerHTML = '<img src="./assets/gameOverCoin.png" class="img-coin" alt="" id="imgCoin">';

            btnTry.innerHTML = "GET YOUR FREE LESSON HERE";
            btnTry.removeAttribute("onclick");
            btnTry.setAttribute("onclick","openFeedBack()");
            score.style.display = "none";
        };
    }

    modal.style.display = "flex";
    score.innerHTML = textScore;
}

function openFeedBack(){
    window.parent.location.href = urlSpanishful;
}
