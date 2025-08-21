console.log('java');
let currentsong = new Audio()
let songs;
let currFolder;

function convertToMinutesAndSeconds(inputSeconds) {
    const totalSeconds = Math.floor(inputSeconds); // remove milliseconds
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}


async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`https://fatehsehajsingh.github.io/spotifyclone/${folder}/`)

    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
     songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

     
    let songul = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""; 
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li data-filename="${song}">
                            <img  class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div> fateh </div>
                            </div>
                            <div class="playnow">
                                Play Now
                                <div><img class="invert image-position" src="play.svg" alt=""></div>
                            </div>
                        </li>`;
    }

    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach((e, idx) => {
        e.addEventListener("click", ev => {
            const filename = e.getAttribute("data-filename");
             playmusic(filename);
            play.src = "pause.svg";
            currentSongIndex = idx;
        });
    });

}

const playmusic = (track, pause = false) => {
    currentsong.src = `/spotifyclone/${ currFolder}/` + track
    if (!pause) {
        currentsong.play()
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)

    


}

async function displayAlbums(){

      let a = await fetch(`https://fatehsehajsingh.github.io/spotifyclone/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;

    let anchors =div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
   let array= Array.from(anchors) 

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if (e.href.includes("/songs")) {
            let folder =e.href.split("/").slice(-2)[0];
            let a = await fetch(`https://fatehsehajsingh.github.io/spotifyclone/songs/${folder}/info.json`)
    let response = await a.json();
 
    cardContainer.innerHTML = cardContainer.innerHTML +   ` 
                    <div data-folder="${folder}"  class="card">
                        <div class="play"> <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"
                                viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="32" fill=" #3be477" />
                                <polygon points="26,20 26,44 46,32" fill="black" />
                            </svg>
                        </div>
                        <img src="songs/${folder}/cover.jpg" alt="">
                        <h2> ${response.title}</h2>
                        <p> ${response.description}</p>
                    </div>`
        }
    };
      Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async (ev) => {
             songs = await getsongs(`songs/${ev.currentTarget.dataset.folder}`); 
        });
    });
}

async function main() {
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    prevBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playmusic(songs[currentSongIndex]);
        play.src = "pause.svg";
    });

    nextBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playmusic(songs[currentSongIndex]);
        play.src = "pause.svg";
    });
    let currentSongIndex = 0;


      await getsongs("songs/ncs")
     playmusic(songs[0], true)


displayAlbums();


    currentsong.addEventListener("ended", () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playmusic(songs[currentSongIndex]);
        play.src = "pause.svg";
    });

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })


    currentsong.addEventListener("timeupdate", () => {
        if (!isNaN(currentsong.duration) && currentsong.duration > 0) {
            document.querySelector(".songtime").innerHTML = `${convertToMinutesAndSeconds(currentsong.currentTime)
                } / ${convertToMinutesAndSeconds(currentsong.duration)}`;
            document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        }
    });

    currentsong.addEventListener("loadedmetadata", () => {
        document.querySelector(".songtime").innerHTML = `00:00 / ${convertToMinutesAndSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = "0%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
 
            document.querySelector(".left").style.left = "0%"
        
    })
    document.querySelector(".cancel").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-100%"
    })


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
         currentsong.volume =parseInt(e.target.value)/ 100;
    });



    document.querySelector(".volume >img").addEventListener("click", (e) => {
    
 if(e.target.src.includes("volume.svg")) {
        e.target.src = e.target.src.replace("volume.svg","mute.svg");
    currentsong.muted = true;
 }
 else{
    e.target.src = e.target.src.replace("mute.svg","volume.svg");
    currentsong.muted = false;
 }

});
}

main()
