let $ = document

// Music element and variables

const audioElem = $.querySelector("audio");
const audioCoverElem = $.querySelector(".music-box__cover");
const audioNameElem = $.querySelector(".music-box__name");
const audioArtistElem = $.querySelector(".music-box__artist");
const previousBtnElem = $.querySelector("#previous");
const playBtnElem = $.querySelector("#play");
const nextBtnElem = $.querySelector("#next");
const audioCurrentlyTimeElem = $.querySelector(".music-box__time-line-currently-time");
const audioFullTimeElem = $.querySelector(".music-box__time-line-full-time");
const audioProgressBarElem = $.querySelector(".music-box__time-line-progress-bar");
const audioProgressPercentElem = $.querySelector(".music-box__time-line-progress-percent");

const musicListElem = $.querySelector(".music-list");
const musicListOpenBtnElem = $.querySelector(".menu-btn");
const musicListCloseBtnElem = $.querySelector(".music-list__close-btn");
let isMenuHide = true;

let currentlyMusic = null;
let isPlaying = false;
let musicID = 1;
let rotateValue = 0;

const musics = [
    {
        id: 1,
        name: "I love you",
        artist: "Billie Eilish",
        audioSrc: "musics/i-love-you.mp3",
        coverSrc: "images/i-love-you.jpg",
    },
    {
        id: 2,
        name: "Another love",
        artist: "Tom odell",
        audioSrc: "musics/another-love.mp3",
        coverSrc: "images/another-love.jpg",
    },
    {
        id: 3,
        name: "blue",
        artist: "Billie Eilish",
        audioSrc: "musics/blue.mp3",
        coverSrc: "images/blue.jpg",
    },
];

// Modal elements

const modalElem = $.querySelector(".modal");
const modalContentElem = $.querySelector(".modal__content");
const modalButtonElem = $.querySelector(".modal__button");

// Music functions

setInterval(() => {
    if (isPlaying && audioElem.duration) {
        showTime();
    }
}, 1000);
setInterval(() => {
    if (isPlaying) {
        audioCoverElem.style.transform = `rotate(${++rotateValue}deg)`;
        progress();
    }
}, 50);

const showTime = () => {
    let currentTimeMinutes = String(Math.floor(audioElem.currentTime / 60));
    let currentTimeSeconds = String(Math.floor(audioElem.currentTime % 60));

    let fullTimeMinutes = String(Math.floor(audioElem.duration / 60));
    let fullTimeSeconds = String(Math.floor(audioElem.duration % 60));

    audioCurrentlyTimeElem.innerHTML = `${currentTimeMinutes.padStart(2, 0)}:${currentTimeSeconds.padStart(2, 0)}`;
    audioFullTimeElem.innerHTML = `${fullTimeMinutes.padStart(2, 0)}:${fullTimeSeconds.padStart(2, 0)}`;
}
const previousMusic = () => {
    musicID--;
    if (musicID === 0) {
        musicID = musics.length;
    }
    setMusic(musicID);
    playMusic()
}
const playMusic = () => {
    audioElem.play();
    playBtnElem.classList.replace("fa-play", "fa-pause");
    isPlaying = true;
}
const pauseMusic = () => {
    audioElem.pause();
    playBtnElem.classList.replace("fa-pause", "fa-play");
    isPlaying = false;
}
const nextMusic = () => {
    musicID++;
    if (musicID > musics.length) {
        musicID = 1;
    }
    setMusic(musicID);
    playMusic()
}
const setMusic = (musicID = 1) => {
    currentlyMusic = musics.find((music) => music.id === musicID);

    audioElem.src = currentlyMusic.audioSrc;
    audioCoverElem.src = currentlyMusic.coverSrc;
    audioNameElem.innerHTML = currentlyMusic.name;
    audioArtistElem.innerHTML = currentlyMusic.artist;
}
const loadMusicList = () => {
    musics.forEach(music => {
        musicListElem.insertAdjacentHTML(
            "beforeend",
            `<li class="music-list__item" onclick="setMusic(${music.id}); playMusic()">
                <img src="${music.coverSrc}" class="music-list__item-cover">
                <h4 class="music-list__item-name">${music.name}</h4>
            </li>`
        );
    });
}
const progress = () => {
    let musicDuration = audioElem.duration;
    let currentlyMusicTime = audioElem.currentTime;

    let progressPercent = (currentlyMusicTime / musicDuration) * 100;

    audioProgressPercentElem.style.width = `${progressPercent}%`;
}
const setCurrentTime = (event) => {
    let clickPosition = event.offsetX;
    let clientWidth = audioProgressBarElem.clientWidth;

    let progressPercent = (clickPosition / clientWidth) * 100;

    audioElem.currentTime = (progressPercent / 100) * audioElem.duration;

    audioElem.play();
    playBtnElem.classList.replace("fa-play", "fa-pause");
    isPlaying = true;
}
const closeMenu = () => {
    musicListElem.style.left = "-300px";
    isMenuHide = true;
}
const openMenu = () => {
    musicListElem.style.left = "0";
    isMenuHide = false;
}

// Modal function

const showModal = (modalContent) => {
    modalElem.classList.add("modal--active")
    modalContentElem.innerHTML = modalContent
}

setMusic()
window.addEventListener("load", () => {
    showTime();
    
    // show modal

    let messageIndex = 0

    let messages = [
        'Press <b class="text-highlight"><i class="fa fa-play"></i></b> button or <b class="text-highlight">Space</b> key on your keyboard to Play/Pause music.',
        'Press <b class="text-highlight"><i class="fa fa-backward"></i></b> button or <b class="text-highlight">Left Arrow</b> key on your keyboard to go to the Previous music.',
        'Press <b class="text-highlight"><i class="fa fa-forward"></i></b> button or <b class="text-highlight">Right Arrow</b> key on your keyboard to go to the next music.',
        'Press <b class="text-highlight"><i class="fa fa-bars"></i></b> button or <b class="text-highlight">Escape</b> key on your keyboard to open music list.',
        'Press <b class="text-highlight"><i class="fa fa-times"></i></b> button or <b class="text-highlight">Escape</b> key on your keyboard to close music list.',
    ];

    
    modalButtonElem.addEventListener("click", () => {
        if (messageIndex === messages.length - 1) {
            modalElem.classList.remove("modal--active");
            setTimeout(() => {
                modalElem.remove()
            }, 180);
        }
        else showModal(messages[++messageIndex]);
    });
    
    showModal(messages[messageIndex])
    loadMusicList()
    
})

// Music event listeners

window.addEventListener("keyup", event => {
    if (event.code === "Space") {
        if (isPlaying) {
            pauseMusic()
        } else {
            playMusic()
        }
    }
    if (event.code === "ArrowRight") nextMusic();
    if (event.code === "ArrowLeft") previousMusic();
    if (event.code === "Escape") {
        if (isMenuHide) {
            openMenu()
        } else {
            closeMenu()
        }
    }
});
document.body.addEventListener("click", event => {
    if (event.target.className !== "music-list" && !event.target.classList.contains("fa-bars"))
        closeMenu()
})

previousBtnElem.addEventListener("click", previousMusic);
playBtnElem.addEventListener("click", () => {
    if (isPlaying) pauseMusic()
    else playMusic()
});
nextBtnElem.addEventListener("click", nextMusic);
audioElem.addEventListener("ended", nextMusic);
audioProgressBarElem.addEventListener("click", event => setCurrentTime(event));

musicListOpenBtnElem.addEventListener("click", openMenu)
musicListCloseBtnElem.addEventListener("click", closeMenu)