const getMp3FileNames = window.requires.getMp3FileNames;
const getFile = window.requires.getFile;

const controllButton = document.getElementById("controllButton");
const musicList = document.getElementById("musicList");
const musicData = document.getElementById("musicData");

const musicURLs = getMp3FileNames();
console.log(musicURLs)
/*for(const musicTitle of musicURLs){
    const li = document.createElement("li");
    const text = document.createTextNode(musicTitle);
    li.appendChild(text);
    musicList.appendChild(li);
}*/

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

let currentMusic = null;
const setAudio = (url) => {
    console.log(`set: ${url}`);
    const {title, artist} = getFile(url)
    musicData.textContent = `${title}(${artist})`;
    currentMusic = new Audio(url);
    currentMusic.onended = () => {
        const tmp = musicURLs.shift();
        shuffle(musicURLs);
        setAudio(musicURLs[0]);
        musicURLs.push(tmp);
        currentMusic.play();
    }
}
let isPlay = false;
controllButton.addEventListener("click", () => {
    if(!currentMusic){
        if(musicURLs.length < 2){
            alert("2曲以上必要です。");
            return;
        }
        shuffle(musicURLs);
        setAudio(musicURLs[0]);
    }
    isPlay = !isPlay;
    controllButton.innerHTML = isPlay ? "&#x23f8;" : "&#x25b6;";
    isPlay ? currentMusic.play() : currentMusic.pause();
})