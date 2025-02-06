// Selecting Elements
const audio = document.getElementById("audio-player");
const lyricsContainer = document.getElementById("lyrics-container");
const albumGrid = document.getElementById("album-container");
const albumTitle = document.getElementById("album-title");
const songList = document.getElementById("songs-list"); // Fixed ID reference
const songListContainer = document.getElementById("songs-container"); // Fixed reference
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");

// Album Data
const albums = {
    "lover": ["Afterglow", "Cornelia Street", "Cruel Summer", "Death by a Thousand Cuts", "False God", "I Forgot That You Existed", "I Think He Knows", "London Boy", "Lover", "Me!", "Miss Americana and the Heartbreak Prince", "Paper Rings", "Soon You'll Get Better", "The Archer", "The Man", "You Need to Calm Down"],
    "1989": ["Welcome to New York", "Blank Space", "Style", "Out of the Woods", "Shake It Off"],
    "ttpd": ["Track 1", "Track 2", "Track 3", "Track 4", "Track 5"],
    "fearless": ["Fearless", "Fifteen", "Love Story", "Hey Stephen", "White Horse"]
};

// Attach event listeners to all albums
document.querySelectorAll(".album").forEach(album => {
    album.addEventListener("click", function () {
        showAlbum(this.dataset.album);
    });
});

// Show Album Songs
function showAlbum(album) {
    console.log("Album clicked:", album);

    if (!albums[album]) {
        console.error("Album not found:", album);
        return;
    }

    albumGrid.style.display = "none"; // Hide album grid
    songListContainer.classList.remove("hidden"); // Show song list
    audio.classList.add("hidden"); // Hide audio player initially
    lyricsContainer.classList.add("hidden"); // Hide lyrics initially
    albumTitle.textContent = album.toUpperCase(); // Capitalize all letters
    songList.innerHTML = ""; // Clear previous songs

    // Add Songs
    albums[album].forEach((song, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${song}`;
        li.onclick = () => playSong(song);
        songList.appendChild(li);
    });

    console.log("Songs displayed successfully.");
}

// Play Song
function playSong(songName) {
    console.log("Playing:", songName);

    let fileName = songName.toLowerCase().replace(/\s+/g, '_');
    audio.src = `audio/${fileName}.mp3`;
    audio.classList.remove("hidden");
    audio.play();
    loadLyrics(`lyrics/${fileName}.lrc`);
}

// Show Albums Again
function showAllAlbums() {
    albumGrid.style.display = "grid";
    songListContainer.classList.add("hidden");
    audio.classList.add("hidden");
    lyricsContainer.classList.add("hidden");
}

// Load Lyrics
function loadLyrics(lyricsFile) {
    fetch(lyricsFile)
        .then(response => {
            if (!response.ok) {
                throw new Error("Lyrics file not found!");
            }
            return response.text();
        })
        .then(text => {
            const lyricsArray = parseLRC(text);
            syncLyrics(lyricsArray);
        })
        .catch(error => console.error("Error loading lyrics:", error));
}

// Parse LRC File
function parseLRC(lrcText) {
    const lines = lrcText.split("\n");
    return lines.map(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseFloat(match[2]);
            const time = minutes * 60 + seconds;
            return { time, text: match[3].trim() };
        }
    }).filter(Boolean);
}

// Sync Lyrics
function syncLyrics(lyricsArray) {
    lyricsContainer.innerHTML = "";
    lyricsContainer.classList.remove("hidden");
    let index = 0;

    audio.ontimeupdate = () => {
        if (index < lyricsArray.length && audio.currentTime >= lyricsArray[index].time) {
            lyricsContainer.innerHTML = lyricsArray[index].text;
            index++;
        }
    };
}

// Play/Pause Functionality
playButton.addEventListener("click", () => {
    audio.play();
});

pauseButton.addEventListener("click", () => {
    audio.pause();
});
