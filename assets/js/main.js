const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "WEDOS_PLAYER";

const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const shuffleBtn = $(".btn-shuffle");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    onDraft: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: "Boombayah",
            singer: "BLACKPINK",
            path: "https://github.com/wedoscao/music-player/blob/main/assets/music/Boombayah-BLACKPINK-6291993.mp3?raw=true",
            image: "https://github.com/wedoscao/music-player/blob/main/assets/img/boombayah.jpg?raw=true",
        },
        {
            name: "DDU-DU DDU-DU",
            singer: "BLACKPINK",
            path: "https://github.com/wedoscao/music-player/blob/main/assets/music/DduduDdudu-BLACKPINK-6291998.mp3?raw=true",
            image: "https://github.com/wedoscao/music-player/blob/main/assets/img/Ddu-Du_Ddu-Du.png?raw=true",
        },
        {
            name: "Ice Cream",
            singer: "BLACKPINK (with Selena Gomez)",
            path: "https://github.com/wedoscao/music-player/blob/main/assets/music/IceCreamWithSelenaGomez-BLACKPINK-6720101.mp3?raw=true",
            image: "https://github.com/wedoscao/music-player/blob/main/assets/img/Ice_Cream.png?raw=true",
        },
        {
            name: "Kill This Love",
            singer: "BLACKPINK",
            path: "https://github.com/wedoscao/music-player/blob/main/assets/music/KillThisLove-BLACKPINK-6291967.mp3?raw=true",
            image: "https://github.com/wedoscao/music-player/blob/main/assets/img/KillThisLove.jpeg?raw=true",
        },
        {
            name: "Lalisa",
            singer: "Lisa",
            path: "https://github.com/wedoscao/music-player/blob/main/assets/music/Lalisa%20-%20LISA.mp3?raw=true",
            image: "https://github.com/wedoscao/music-player/blob/main/assets/img/lalisa.jpg?raw=true",
        },
        {
            name: "Lovesick Girls",
            singer: "BLACKPINK",
            path: "https://github.com/wedoscao/music-player/blob/main/assets/music/LovesickGirls-BLACKPINK-6720104.mp3?raw=true",
            image: "https://raw.githubusercontent.com/wedoscao/music-player/main/assets/img/lovesickgirls.jpeg",
        },
        {
            name: "On The Ground",
            singer: "Rosé",
            path: "https://github.com/wedoscao/music-player/blob/main/assets/music/On%20The%20Ground%20-%20Rose.mp3?raw=true",
            image: "https://github.com/wedoscao/music-player/blob/main/assets/img/Ros%C3%A9%E2%80%93On_the_Ground.jpg?raw=true",
        },
        {
            name: "Pretty Savage",
            singer: "BLACKPINK",
            path: "https://github.com/wedoscao/music-player/blob/main/assets/music/PrettySavage-BLACKPINK-6720102.mp3?raw=true",
            image: "https://raw.githubusercontent.com/wedoscao/music-player/main/assets/img/prettysavage.png",
        },
        {
            name: "SOLO",
            singer: "Jennie",
            path: "https://github.com/wedoscao/music-player/blob/main/assets/music/Solo-JennieBlackPink-5738971.mp3?raw=true",
            image: "https://raw.githubusercontent.com/wedoscao/music-player/main/assets/img/solo.png",
        },
    ],
    render() {
        const html = this.songs
            .map((song, index) => {
                return `<div class="song ${
                    index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}');">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`;
            })
            .join("");
        playlist.innerHTML = html;
    },
    defineProperties() {
        Object.defineProperty(this, "currentSong", {
            get() {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvent() {
        const _this = this;
        // *hotkey
        window.onkeydown = (e) => {
            switch (e.key) {
                case "ArrowRight":
                    nextBtn.click();
                    break;
                case "ArrowLeft":
                    prevBtn.click();
                    break;
                case " ":
                    e.preventDefault();
                    if (_this.isPlaying) {
                        audio.pause();
                    } else {
                        audio.play();
                    }
                    break;
                default:
                    break;
            }
        };

        // *shrink cd on scroll
        const cdWidth = cd.offsetWidth;
        document.onscroll = () => {
            const scrollTop =
                document.documentElement.scrollTop || window.scrollY;
            const newCDWidth = cdWidth - scrollTop;
            cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : 0;
            cd.style.opacity = newCDWidth / cdWidth;
        };

        // *play on click
        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // *when song is playing
        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumb.style.animationPlayState = "running";
        };

        // *when song is pause
        audio.onpause = () => {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumb.style.animationPlayState = "paused";
        };

        // *play progress on time update
        audio.ontimeupdate = () => {
            if (audio.duration && !_this.onDraft) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

        // *when seeking
        progress.onchange = (e) => {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        };

        // *when next song
        nextBtn.onclick = () => {
            if (_this.isShuffle) {
                _this.shuffleSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // *when prev song
        prevBtn.onclick = () => {
            if (_this.isShuffle) {
                _this.shuffleSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // *when shuffle
        shuffleBtn.onclick = () => {
            if (_this.isRepeat) {
                repeatBtn.click();
            }
            _this.isShuffle = !_this.isShuffle;
            _this.setConfig("isShuffle", _this.isShuffle);
            _this.setConfig("isRepeat", _this.isRepeat);
            shuffleBtn.classList.toggle("active", _this.isShuffle);
        };

        repeatBtn.onclick = () => {
            if (_this.isShuffle) {
                shuffleBtn.click();
            }
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            _this.setConfig("isShuffle", _this.isShuffle);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // *when end song
        audio.onended = () => {
            if (_this.isRepeat) {
                _this.repeatSong();
                audio.play();
            } else nextBtn.click();
        };

        // * click on playlist
        playlist.onclick = (e) => {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                // *song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // *option
                if (e.target.closest(".option")) {
                }
            }
        };

        // *prevent progress bar run when draft
        progress.onmousedown = () => {
            _this.onDraft = true;
        };
        progress.onmouseup = (e) => {
            _this.onDraft = false;
        };
    },
    scrollToActiveSong() {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 250);
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig() {
        this.isShuffle = this.config.isShuffle;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    shuffleSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    repeatSong() {
        this.currentIndex = this.currentIndex;
        this.loadCurrentSong;
    },
    start() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();

        // *default
        shuffleBtn.classList.toggle("active", this.isShuffle);
        repeatBtn.classList.toggle("active", this.isRepeat);
    },
};

app.start();
