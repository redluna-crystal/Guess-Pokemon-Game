let gameData;
const main = document.querySelector("main");
const playBtn = document.querySelector("#play");
const choices = document.querySelector("#choices");
const pokemonImage = document.querySelector("#pokemon-image");
const textOverlay = document.querySelector("#text-overlay");

playBtn.addEventListener("click", fetchData);
loadVoice();
addAnswerHandler();

async function fetchData() {
  resetImage();
  gameData = await window.getPokeData();
  showSilhouette();
  displayChoices();
  ask();
}

function showSilhouette() {
  main.classList.remove("fetching");
  pokemonImage.src = gameData.correct.image;
}

function resetImage() {
  pokemonImage.src =
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D";
  main.classList.remove("revealed");
  main.classList.add("fetching");
}

function displayChoices() {
  let { pokemonChoices } = gameData;
  const choicesHTML = pokemonChoices
    .map(({ name }) => {
      return `<button data-name="${name}">${name}</button>`;
    })
    .join("");

  choices.innerHTML = choicesHTML;
}

function loadVoice() {
  window.speechSynthesis.onvoiceschanged = () => {
    window.malevoice = speechSynthesis.getVoices()[1];
    window.femalevoice = speechSynthesis.getVoices()[4];
  };
}

function ask() {
  const say = new SpeechSynthesisUtterance("Who's that pokemon");
  say.voice = window.malevoice;
  say.pitch = 0.2;
  say.rate = 0.75;
  speechSynthesis.speak(say);
}
function speakAnswer() {
  const say = new SpeechSynthesisUtterance(`It's ${gameData.correct.name}`);
  say.voice = window.femalevoice;
  say.pitch = 1.2;
  say.rate = 0.8;
  speechSynthesis.speak(say);
}

function addAnswerHandler() {
  choices.addEventListener("click", (e) => {
    const { name } = e.target.dataset;
    const resultClass =
      name === gameData.correct.name ? "correct" : "incorrect";

    e.target.classList.add(resultClass);
    revealPokemon();
    speakAnswer();
  });
}

function revealPokemon() {
  main.classList.add("revealed");
  textOverlay.textContent = `${gameData.correct.name}!`;
}
