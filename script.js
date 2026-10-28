const songs = [
    {
        title: "Song One",
        artist: "Artist One",
        src: "songs/song1.mp3"
    },
    {
        title: "Song Two",
        artist: "Artist Two",
        src: "songs/song2.mp3"
    },
    {
        title: "Song Three",
        artist: "Artist Three",
        src: "songs/song3.mp3"
    }
];

const audio = document.getElementById("audio");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");

const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const progressBar = document.getElementById("progress-bar");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const statusMessage = document.getElementById("status-message");

let currentSongIndex = 0;

audio.volume = Number(volume.value);

// Convert seconds into minutes and seconds
function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Display playlist
function displayPlaylist() {
    playlist.innerHTML = "";

    songs.forEach((song, index) => {
        const li = document.createElement("li");

        li.textContent = `${index + 1}. ${song.title} - ${song.artist}`;

        li.addEventListener("click", () => {
            currentSongIndex = index;
            loadSong();
            playSong();
        });

        playlist.appendChild(li);
    });
}

// Highlight current song
function updatePlaylist() {
    const items = playlist.querySelectorAll("li");

    items.forEach((item, index) => {
        item.classList.toggle(
            "active",
            index === currentSongIndex
        );
    });
}

// Load selected song
function loadSong() {
    const song = songs[currentSongIndex];

    audio.src = song.src;

    songTitle.textContent = song.title;
    artistName.textContent = song.artist;

    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    progressBar.value = 0;

    playBtn.textContent = "▶";
    playBtn.title = "Play";

    updatePlaylist();
}

// Play song
async function playSong() {
    try {
        await audio.play();

        playBtn.textContent = "⏸";
        playBtn.title = "Pause";

        statusMessage.textContent = "";
    } catch (error) {
        playBtn.textContent = "▶";
        playBtn.title = "Play";

        statusMessage.textContent =
            "Song could not play. Check the MP3 file path.";
    }
}

// Pause song
function pauseSong() {
    audio.pause();

    playBtn.textContent = "▶";
    playBtn.title = "Play";
}

// Play or pause
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

nextBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;

    loadSong();
    playSong();
});
prevBtn.addEventListener("click", () => {
    currentSongIndex =
        (currentSongIndex - 1 + songs.length) % songs.length;

    loadSong();
    playSong();
});
audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progressBar.value =
            (audio.currentTime / audio.duration) * 100;
    }

    currentTime.textContent = formatTime(audio.currentTime);
});


audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (Number(progressBar.value) / 100) * audio.duration;
    }
});


volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});

audio.addEventListener("ended", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;

    loadSong();
    playSong();
});

audio.addEventListener("error", () => {
    statusMessage.textContent =
        "Audio file not found. Check the songs folder and file names.";
});

displayPlaylist();
loadSong();