const trackArt = document.querySelector(".track-art");
const seekSlider = document.getElementById("seekSlider");
const currTrack = document.createElement("audio");

let trackIndex = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;
let isRepeat = false;

let musicList;

function fetchMusics() {
  fetch("./musiques.json")
    .then((response) => response.json())
    .then((data) => {
      musicList = data;
      loadTrack(trackIndex, musicList);
    })
    .catch((error) => console.error(error));
}
fetchMusics();

function loadTrack(trackIndex) {
  clearInterval(updateTimer);
  reset();

  currTrack.src = musicList[trackIndex].music;
  currTrack.load();

  trackArt.style.backgroundImage = `url(${musicList[trackIndex].img})`;
  document.querySelector(".track-name").textContent =
    musicList[trackIndex].name;
  document.querySelector(".track-artist").textContent =
    musicList[trackIndex].artist;
  document.querySelector(".now-playing").textContent =
    "Playing music " + (trackIndex + 1) + " of " + musicList.length;

  updateTimer = setInterval(setUpdate, 1000);
}

function whichTrack() {
  currTrack.addEventListener("ended", () => {
    if (isRepeat == true) {
      seekSlider.value = 0;
      playTrack();
    } else {
      nextTrack();
    }
  });
}

fetchMusics();
whichTrack();
randomBgColor();

function randomBgColor() {
  let hex = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
  ];

  let a;
  function populate(a) {
    for (let i = 0; i < 6; i++) {
      let x = Math.round(Math.random() * 14);
      let y = hex[x];
      a += y;
    }
    return a;
  }
  let Color1 = populate("#");
  let Color2 = populate("#");
  var angle = "to right";

  let gradient = "linear-gradient(" + angle + "," + Color1 + "," + Color2 + ")";
  document.body.style.background = gradient;
}
function reset() {
  currTime.textContent = "00:00";
  totalDuration.textContent = "00:00";
  seekSlider.value = 0;
}
const randomTrack = () => {
  isRandom = !isRandom;
  document.querySelector(".fa-random").classList.toggle("active", isRandom);
};
const repeatTrack = () => {
  isRepeat = !isRepeat;
  document.querySelector(".fa-repeat").classList.toggle("active");
};
const playPauseTrack = () => {
  if (isPlaying) {
    currTrack.pause();
    isPlaying = false;
    trackArt.classList.remove("rotate");
    wave.classList.remove("loader");
    playPauseBtn.innerHTML = "<i class='fa fa-play-circle fa-5x'></i>";
  } else {
    playTrack();
  }
};
const playTrack = () => {
  currTrack.play();
  isPlaying = true;
  trackArt.classList.add("rotate");
  wave.classList.add("loader");
  playPauseBtn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
};

const nextTrack = () => {
  if (trackIndex < musicList.length - 1 && isRandom === false) {
    trackIndex += 1;
  } else if (trackIndex < musicList.length - 1 && isRandom === true) {
    let randomIndex = Number.parseInt(Math.random() * musicList.length);
    trackIndex = randomIndex;
  } else {
    trackIndex = 0;
  }
  loadTrack(trackIndex);
  playTrack();
};
const prevTrack = () => {
  if (trackIndex > 0) {
    trackIndex -= 1;
  } else {
    trackIndex = musicList.length - 1;
  }
  loadTrack(trackIndex);
  playTrack();
};
const seekTo = () => {
  let seekto = currTrack.duration * (seekSlider.value / 100);
  currTrack.currentTime = seekto;
};
const setVolume = () => {
  currTrack.volume = volumeSlider.value / 100;
};

function setUpdate() {
  let seekPosition = 0;
  if (!isNaN(currTrack.duration)) {
    seekPosition = currTrack.currentTime * (100 / currTrack.duration);
    seekSlider.value = seekPosition;

    let currMinutes = Math.floor(currTrack.currentTime / 60);
    let currSeconds = Math.floor(currTrack.currentTime - currMinutes * 60);
    let durationMinutes = Math.floor(currTrack.duration / 60);
    let durationSeconds = Math.floor(currTrack.duration - durationMinutes * 60);

    if (currSeconds < 10) {
      currSeconds = "0" + currSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currMinutes < 10) {
      currMinutes = "0" + currMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    currTime.textContent = currMinutes + ":" + currSeconds;
    totalDuration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

seekSlider.addEventListener("change", seekTo);
volumeSlider.addEventListener("change", setVolume);
randomBtn.addEventListener("click", randomTrack);
prevBtn.addEventListener("click", prevTrack);
playPauseBtn.addEventListener("click", playPauseTrack);
nextBtn.addEventListener("click", nextTrack);
repeatBtn.addEventListener("click", repeatTrack);
document.addEventListener("keydown", function (event) {
  const key = event.key;
  if (key === "space") {
    playPauseTrack();
  } else if (key === "ArrowRight") {
    nextTrack();
  } else if (key === "ArrowLeft") {
    prevTrack();
  } else if (key === "r") {
    repeatTrack();
  } else if (key === "a") {
    randomTrack();
  }
});
