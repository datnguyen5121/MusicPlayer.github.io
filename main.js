/**
 * 
 *  1. Render songs x
 *  2. Scroll top x
 *  3. Play / pause / seek x
 *  4. CD rotate x
 *  5. Next / prev x
 *  6. Random x
 *  7. Next / Repeat when ended x
 *  8. Active song x
 *  9. Scroll active song into view x
 *  10. Play song when click x
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const cd = $('.cd')
const player = $('.player')
const playlist = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-play-pause')
const progress = $('.progress')
const btnNext = $('.btn-forward')
const btnBack = $('.btn-backward')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const songMusic = $('.song')

const app ={
    currentIndex: 0,
    isPlaying:false,
    isRandom: false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'An Thần',
            singer: 'LowG' ,
            path: './assets/music/AnThan.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Anh Nhớ Ra',
            singer: 'Vũ' ,
            path: './assets/music/AnhNhoRa.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Cold Water',
            singer: 'Justin Bieber' ,
            path: './assets/music/ColdWater.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Cao Ốc 20',
            singer: 'Bray' ,
            path: './assets/music/CaoOc20.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Chán Gái 707',
            singer: 'LowG' ,
            path: './assets/music/ChanGai707.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Chìm Sâu',
            singer: 'MCK' ,
            path: './assets/music/ChimSau.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Chuyện Đôi Ta',
            singer: 'Emcee L' ,
            path: './assets/music/ChuyenDoiTa.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Flexin Trên CircleK',
            singer: 'MCK' ,
            path: './assets/music/FlexinTrenCircleK.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Simple Love',
            singer: 'Obito' ,
            path: './assets/music/SimpleLove.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Tay To',
            singer: 'MCK' ,
            path: './assets/music/TayTo.mp3',
            image: './assets/img/song10.jpg'
        },
        {
            name: 'Từ Chối Nhẹ Nhàng Thôi',
            singer: 'Bích Phương, Phúc Du' ,
            path: './assets/music/TuChoiNheNhangThoi.mp3',
            image: './assets/img/song11.jpg'
        },
        {
            name: 'Từ Đó',
            singer: 'Phan Mạnh Quỳnh' ,
            path: './assets/music/TuDoMatBiec.mp3',
            image: './assets/img/song12.jpg'
        },
        {
            name: 'Thích Thích',
            singer: 'Phương Ly' ,
            path: './assets/music/Thichthich.mp3',
            image: './assets/img/song13.jpg'
        },
        {
            name: 'Yêu 5',
            singer: 'Rhymastic' ,
            path: './assets/music/Yeu5.mp3',
            image: './assets/img/song14.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                
                        <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                            <div class="song-thumb" style="background-image: url('${song.image}');"></div>
                        <div class="body-song">
                            <h3 class="song-name">${song.name}</h3>    
                            <p class="artist-name">${song.singer}</p>
                        </div>
                        <div class="option-song">
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                        </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
            Object.defineProperty(this,'currentSong',{
                get: function() {
                    return this.songs[this.currentIndex]
                }
            })
    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        }) 
        cdThumbAnimate.pause()


        // xử lý phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const width2 = cdWidth - scrollTop/4
            cd.style.width =width2 >=0 ? width2 + 'px' : 0
            cd.style.opacity =width2 / cdWidth
        }

        //Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying= true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //khi song được pause
        audio.onpause = function() {
            _this.isPlaying= false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //Khi tiến độ bài hát được thay đổi
        audio.ontimeupdate = function(){
            // audio.currentTime;
            // audio.duration
            const songProgress = Math.floor(audio.currentTime *100 / audio.duration)
            progress.value = songProgress
        }
        //Xử lý khi tua bài hát
        progress.onchange = function(e){
           const changeTime = audio.duration / 100 * e.target.value;
           audio.currentTime = changeTime
        }
        // Khi click nút next
        btnNext.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            }
            else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
         // Khi click nút back
         btnBack.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } 
            else {
                _this.backSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        // Khi click nút random
         btnRandom.onclick = function(e) {
            _this.isRandom =!_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            btnRandom.classList.toggle('active',_this.isRandom)
         }
         // Khi click nút repeat
         btnRepeat.onclick = function(e) {
            _this.isRepeat =!_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            btnRepeat.classList.toggle('active',_this.isRepeat)
         }
        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                btnNext.click()
            }
          
            // if (_this.isRandom) {
            //     _this.randomSong()
            // } else {
            //     _this.nextSong()
            // }
            // audio.play()
        
        }   
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option-song')) {
                
            // Xử lý khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            // Xử lý khi click vào option

            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        },300)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat    

    },
     //Khi next song
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    //Khi back song
    backSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    // Khi random Song
    randomSong: function() {
        let newIndex
        do { 
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        
        this.loadCurrentSong()
    },
    // khi active song 

    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        //Định nghĩa các thuộc tính cho object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render playlist
        this.render()

        //Hiển thị trạng thái ban đầu của button repeat & random
        btnRandom.classList.toggle('active',this.isRandom)
        btnRepeat.classList.toggle('active',this.isRepeat)
    }
} 
app.start()