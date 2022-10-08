// Select all the elements in the HTML page
// and assign them to a variable
const wrapper = document.querySelector(".wrapper");
musicArt = wrapper.querySelector(".art-cover img"),
musicTitle = wrapper.querySelector(".song-detail .title"),
musicArtist = wrapper.querySelector(".song-detail .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#show-more-music"),
closeMusicBtn = wrapper.querySelector("#close");


//loading random song when page is refreshed
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1); 

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //call load music function once window loads.
    playingSong();
})

//load music function
function loadMusic(indexNumb) {
    musicTitle.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicArt.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").className = "fa-solid fa-circle-pause";
    mainAudio.play();
}

//paused music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").className = "fa-regular fa-circle-play";
    mainAudio.pause();
}

//next music function
function nextMusic() {
    //increment the music index to move through the song list
    musicIndex++;
    //if musicIndex is greater than the music array the song starts from the beginning.
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

//previous music function
function prevMusic() {
    //decrement the music index to move through the song list backwards
    musicIndex--;
    /*if musicIndex is less than one, music index is equal to the total
    music length so the last song is played.*/
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

//play or pause button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingSong();
})

//next music button event
nextBtn.addEventListener("click", () => {
    nextMusic(); //calling the next music function
    playingSong();
})

//previous music button event
prevBtn.addEventListener("click", () => {
    prevMusic(); //calling the previous music function
    playingSong();
})


//updating progress bar width according to the current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //getting the song's current time
    const duration = e.target.duration; //getting the song's total duration
    let progressWidth = (currentTime/duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current");
    let musicDuration = wrapper.querySelector(".duration");
    mainAudio.addEventListener("loadeddata", () => {
        //update song's total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration/60);
        let totalSec = Math.floor(audioDuration%60);
        if(totalSec < 10) {
            //adding zero to the seconds when it's less than 10.
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //update song's current time
    let currentMin = Math.floor(currentTime/60);
    let currentSec = Math.floor(currentTime%60);
    if(currentSec < 10) {
        //adding zero to the seconds when it's less than 10.
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${ currentMin}:${currentSec}`;
})

//updating the song's current time  according to the progress bar width.
progressArea.addEventListener("click", (e)=>{
    let progressWidth = progressArea.clientWidth; //getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song's total duration
    
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic(); //calling playMusic function
    playingSong();
});


  //changing the repeat icon to single, repeat one and shuffle when clicked
const repeatBtn = wrapper.querySelector("#repeat");
repeatBtn.addEventListener("click", () => {
    //getting the icon through the innerText
    let getIcon = repeatBtn.innerText;
    //changing to the different icon through switch
    switch(getIcon) {
        case "repeat": //if icon is repeat
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
        case "repeat_one": //if icon is repeat_one
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playlist shuffled");
            break;
        case "shuffle": //if icon is shuffle
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "playlist looped");
            break;

    }
})

//just worked on changing the icon previously, working on what to do when changed after the song ends.
mainAudio.addEventListener("ended", () => {
    //what the song should do according to the icon being selected
    let getIcon = repeatBtn.innerText;
    //changing to the different icon through switch
    switch(getIcon) {
        case "repeat": //just play the next song when the icon is repeat
            nextMusic();
            break;
        case "repeat_one": //if icon is repeat_one, return the current song's current time to zero and play
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle": //if icon is shuffle, change the song to any random song on the music list
        //getting any random index on the music array
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }
            while(musicIndex == randomIndex);  //this loop run until the next random number won't be the same with the current musicIndex
            musicIndex = randomIndex; //passing randomIndex to musicIndex
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;    
    }
})

//show music playlist when the playlist icon is clicked
moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show"); //toogle to move between hide and show
});

closeMusicBtn.addEventListener("click", () => {
    moreMusicBtn.click()
});

const ulTag = wrapper.querySelector("ul");

//creating li according to the array length
for(i = 0; i < allMusic.length; i++) {

    //passing the song's detail from the array into li
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <span class="${allMusic[i].src} audio-duration">2:40</span>
                    <audio id="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`

    ulTag.insertAdjacentHTML("beforeend", liTag); //this inserts the music list into the ul tag

    let liAudioTag = ulTag.querySelector(`[id="${allMusic[i].src}"]`);
    let liAudioDuartionTag = ulTag.querySelector(`[class="${allMusic[i].src} audio-duration"]`);

    liAudioTag.addEventListener("loadeddata", () => {

         //update song's total duration
         let liAudioDuration = liAudioTag.duration;
         let totalMin = Math.floor(liAudioDuration/60);
         let totalSec = Math.floor(liAudioDuration%60);
         if(totalSec < 10) {
             //adding zero to the seconds when it's less than 10.
             totalSec = `0${totalSec}`
         }
         liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`;
         //adding duration attribute for use later
         liAudioDuartionTag.setAttribute("att-duration", `${totalMin}:${totalSec}`);

    })

}

//play particular song from the list onclick of li tag
function playingSong() {

    const allLiTag = ulTag.querySelectorAll("li");

    for(let j = 0; j < allLiTag.length; j++) {

        let audioTag = allLiTag[j].querySelector(".audio-duration"); //grabbing the audio duration

        //removing the playing class from the li except the one being played
        if(allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            //grabbing the value of the att-duration value and insert it into the innertext of audioTag
            let trueDuration = audioTag.getAttribute("att-duration");
            audioTag.innerText = trueDuration;
        }

        /* if the li-index of an li tag is equals the music index
        it means the song is currently playing. Style it. */
    
        if(allLiTag[j].getAttribute("li-index") == musicIndex) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing"; //changing the duration to playing when clicked
        }
    
        //adding the onclick attribute to all li
        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}


//particular li clicked function
function clicked(element) {
    //getting li-index of a particular clicked li
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex //passing li-index into musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}



