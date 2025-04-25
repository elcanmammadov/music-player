import { musicList } from "./data.js";

const musiclistElem = document.querySelector(".music-list");
const audioElem = document.querySelector("audio");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const nextBtn = document.getElementById("next");
const coverGramafon = document.querySelector(".cover");
const musicImage = document.querySelector(".music-image");
const scrollbar = document.querySelector("#scrollbar");
const currentTimeElem = document.querySelector(".currentTime");
const marquee = document.querySelector("marquee");

let index = 0;
let interval;

const formatTime = (time) =>
  `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
    Math.floor(time % 60)
  ).padStart(2, "0")}`;

const updateMusicList = () => {
  musiclistElem.innerHTML = musicList
    .map(
      (music) => `
    <div class="music">
      <img src="./files/image/${music.imagePath}" alt="${music.musicName}">
      <div class="info">
        <p title="${music.artistName}">${music.artistName.slice(0, 10)}${
        music.artistName.length > 10 ? "..." : ""
      }</p>
        <p>${music.musicName}</p>
        <p class="time">${formatTime(music.duration)}</p>
      </div>
    </div>
  `
    )
    .join("");
};

const playMusic = () => {
  const currentMusic = musicList[index];
  audioElem.src = `./files/audio/${currentMusic.musicPath}`;
  musicImage.src = `./files/image/${currentMusic.imagePath}`;
  marquee.textContent = `${currentMusic.musicName} - ${currentMusic.artistName}`;
  marquee.start();
  coverGramafon.classList.remove("animation-pause");
  audioElem.play();
  clearInterval(interval);
  interval = setInterval(() => {
    currentTimeElem.textContent = formatTime(audioElem.currentTime);
    scrollbar.value = audioElem.currentTime;
  }, 1000);
};

const pauseMusic = () => {
  audioElem.pause();
  marquee.stop();
  coverGramafon.classList.add("animation-pause");
  clearInterval(interval);
};

const changeTrack = (direction) => {
  index = (index + direction + musicList.length) % musicList.length;
  playMusic();
};

playBtn.addEventListener("click", playMusic);
pauseBtn.addEventListener("click", pauseMusic);
nextBtn.addEventListener("click", () => changeTrack(1));
prevBtn.addEventListener("click", () => changeTrack(-1));

scrollbar.addEventListener("input", () => {
  audioElem.currentTime = scrollbar.value;
  currentTimeElem.textContent = formatTime(scrollbar.value);
});

audioElem.addEventListener("ended", () => changeTrack(1));

musiclistElem.addEventListener("click", (e) => {
  const item = e.target.closest(".music");
  if (!item) return;
  index = Array.from(musiclistElem.children).indexOf(item);
  playMusic();
  document
    .querySelectorAll(".music")
    .forEach((elem) => elem.classList.remove("music-active"));
  item.classList.add("music-active");
});

updateMusicList();
marquee.textContent = `${musicList[index].musicName} - ${musicList[index].artistName}`;
marquee.stop();
