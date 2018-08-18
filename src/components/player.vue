<template>
    <div class="player" v-if="showFlag">
      <transition name="fade">
        <div class="bg-player" v-show="bgShow">
          <div class="backImage">
            <img class="bgImage" :src="currentSong.image">
          </div>
          <div class="mask"></div>
          <transition name="shift">
            <div class="title" v-show="bgShow">
              <div class="icon-back" @click="bgHide()"></div>
              <div class="name">
                <div class="song-name">{{currentSong.songname}}</div>
                <div class="singer-name">{{currentSong.singername}}</div>
              </div>
            </div>
          </transition>
          <div class="middle" @touchstart="touchstart($event)" @touchmove="touchmove($event)" @touchend="touchend($event)" ref="middle">
            <div class="middle-l">
              <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @leave="leave">
                <div class="album-wrapper" v-show="bgShow" ref="albumWrapper">
                  <img class="album" :src="currentSong.image" ref="album">
                </div>
              </transition>
              <div class="lyric">
                <p class="text" ref="text"></p>
              </div>
            </div>
            <div class="middle-r">
              <scroll :data="lyricStr" ref="scroll">
                <ul class="lyric-wrapper">
                  <li v-for="(item, index) in lyricStr" :key="index" class="lyric-item" :class="{'current': lineNum === index}">
                    <p class="lyric-text">{{item.txt}}</p>
                  </li>
                </ul>
              </scroll>
            </div>
          </div>
          <div class="dots-wrapper">
            <ul class="dots">
              <li class="dot" :class="{'current': page === 1}"></li>
              <li class="dot" :class="{'current': page === 2}"></li>
            </ul>
          </div>
          <div class="progress-bar-wrapper">
            <progress-bar ref="progress" :currentTime="currentTime" @changeTime="changeTime"></progress-bar>
          </div>
          <transition name="pop">
            <div class="icon-control" v-show="bgShow">
              <div :class="{'icon-sequence': mode === 'sequence', 'icon-loop': mode === 'loop', 'icon-random': mode === 'random'}" @click="changeMode"></div>
              <div class="icon-prev" @click="prev"></div>
              <div :class="{'icon-play': playingState, 'icon-pause': !playingState}" @click="togglePlay()"></div>
              <div class="icon-next" @click="next"></div>
              <div :class="{'icon-not-favorite': !isFavorite, 'icon-favorite': isFavorite}" @click="changeFavorite"></div>
            </div>
          </transition>
        </div>
      </transition>
      <div class="mini-player" ref="mini" v-show="!bgShow">
        <div class="mini-album-wrapper" ref="miniCd">
          <img :src="currentSong.image" class="mini-album" @click="bgHide()" ref="minialbum">
        </div>
        <div class="mini-description">
          <div class="mini-song-name">{{currentSong.songname}}</div>
          <div class="mini-singer-name">{{currentSong.singername}}</div>
        </div>
        <div class="mini-btn">
          <svg class="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
            <circle class="bg-circle" cx="20" cy="20" r="15" stroke-dasharray="94.2"></circle>
            <circle class="move-circle" cx="20" cy="20" r="15" stroke-dasharray="94.2" stroke-dashoffset=94.2 ref="circle"></circle>
          </svg>
          <div :class="{'mini-play': playingState, 'mini-pause': !playingState}" @click="togglePlay()"></div>
        </div>
        <div class="list-btn" @click="toggleList"></div>
        <transition name="hide">
          <playlist ref="playlist" v-show="listShow" :show="listShow" @hide="hide()"></playlist>
        </transition>
      </div>
      <audio @canplay="canplay" autoplay @timeupdate="updateTime" ref="audio"></audio>
    </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations, mapActions} from 'vuex'
import progressBar from './progressBar.vue'
import Lyric from 'lyric-parser'
import scroll from '../base/scroll.vue'
import $ from 'jquery'
import playlist from './playlist.vue'
import {deleteFavoriteSongs, setFavoriteSongs, getFavoriteSongs, setListenSongs, getListenSongs} from '../api/cache'
export default {
  data () {
    return {
      bgShow: true,
      startX: 0,
      pageX: 0,
      threshold: 0.3,
      page: 1,
      offset: 0,
      currentTime: 0,
      lyric: {
        lines: -1
      },
      lyricStr: {},
      lineNum: 0,
      songReady: false,
      miniAlbumWidth: 0,
      miniAlbumLeft: 0,
      miniHeight: 0,
      left: 0,
      top: 0,
      scale: 0,
      middleTop: 0,
      albumHeight: 0,
      listShow: false,
      isFavorite: false
    }
  },
  methods: {
    changeFavorite () {
      this.isFavorite = !this.isFavorite
      if (this.isFavorite) {
        setFavoriteSongs(this.currentSong)
        this.setFavoriteSongs(getFavoriteSongs())
      } else {
        deleteFavoriteSongs(this.currentSong)
        this.setFavoriteSongs(getFavoriteSongs())
      }
    },
    hide () {
      this.listShow = !this.listShow
    },
    toggleList () {
      this.listShow = !this.listShow
      if (this.listShow) {
        this.$refs.playlist.refresh()
      }
    },
    prev () {
      if (this.mode === 'loop' || this.playList.length === 1) {
        this.$refs.audio.src = this.currentSong.url
        this.songReady = false
        return
      }
      if (this.currentIndex === 0) {
        this.setCurrentIndex(this.playList.length - 1)
      } else {
        this.setCurrentIndex(this.currentIndex - 1)
      }
    },
    next () {
      if (this.mode === 'loop' || this.playList.length === 1) {
        this.$refs.audio.src = this.currentSong.url
        this.songReady = false
        return
      }
      if (this.currentIndex === this.playList.length - 1) {
        this.setCurrentIndex(0)
      } else {
        this.setCurrentIndex(this.currentIndex + 1)
      }
    },
    bgHide () {
      this.bgShow = !this.bgShow
      this.$nextTick(() => {
        this.$refs.progress.seekPos()
      })
    },
    getLeft () {
      return parseInt(this.$refs.middle.style.transform.split('(')[1].split(')')[0])
    },
    setTransition () {
      this.$refs.middle.style.transition = 'all linear 0.3s'
    },
    cancelTransition () {
      this.$refs.middle.style.transition = ''
    },
    setTransform (offset) {
      this.$refs.middle.style.transform = `translateX(${offset}px)`
    },
    touchstart (e) {
      this.cancelTransition()
      this.startX = e.touches[0].pageX
    },
    touchmove (e) {
      this.pageX = e.touches[0].pageX
      let length = document.body.offsetWidth
      this.offset = this.pageX - this.startX
      if (this.offset > 0) {
        if (this.page !== 1) {
          this.setTransform(-length + this.offset)
        }
      } else if (this.offset < 0) {
        if (this.page !== 2) {
          this.setTransform(this.offset)
        }
      }
    },
    touchend (e) {
      let length = document.body.offsetWidth
      this.setTransition()
      if (Math.abs(this.offset) / length > this.threshold) {
        if (this.page === 1) {
          this.setTransform(-length)
          this.page = 2
        } else {
          this.setTransform(0)
          this.page = 1
        }
      } else {
        if (this.page === 1) {
          this.setTransform(0)
        } else {
          this.setTransform(-length)
        }
      }
    },
    canplay () {
      this.songReady = true
    },
    updateTime () {
      if (this.showFlag) {
        this.currentTime = this.$refs.audio.currentTime
        this.$refs.circle.style.strokeDashoffset = `${94.2 - 94.2 * (this.currentTime / this.currentSong.duration)}`
      }
    },
    togglePlay () {
      this.setPlayingState(!this.playingState)
    },
    changeTime (time) {
      this.$refs.audio.currentTime = Math.abs(time)
      this.lyric.seek(Math.abs(time) * 1000)
    },
    beforeEnter (el) {
      $('.album-wrapper').css({'transform': `translate3d(${this.left}px, ${this.top}px, 0) scale(${this.scale})`})
    },
    enter (el, done) {
      setTimeout(() => {
        $('.album-wrapper').css({'transition': 'all linear 0.3s', 'transform': `translate3d(0,0,0) scale(1.2)`})
        setTimeout(() => {
          $('.album-wrapper').css({'transition': 'all linear 0.1s', 'transform': `translate3d(0,0,0) scale(1)`})
        }, 300)
      }, 20)
    },
    afterEnter (el) {
      $('.album-wrapper').css('transition', '')
    },
    leave (el, done) {
      $('.album-wrapper').css({'transition': 'all linear 0.4s', 'transform': `translate3d(${this.left}px, ${this.top}px, 0) scale(${this.scale})`})
    },
    ...mapMutations([
      'setPlayingState',
      'setCurrentIndex',
      'setFavoriteSongs',
      'setShowFlag',
      'setListenSongs'
    ]),
    ...mapActions([
      'changeMode'
    ])
  },
  watch: {
    showFlag (value) {
      if (value) {
        this.$nextTick(() => {
          this.left = 30 + 22 / 2 - document.body.offsetWidth / 2
          this.top = window.screen.height - 22 / 2 - (90 + 320 / 2)
          this.scale = 22 / 320
        })
        let songs = this.favoriteSongs
        let index = songs.findIndex((song) => {
          return song.songmid === this.currentSong.songmid
        })
        this.isFavorite = index >= 0
      }
    },
    bgShow (value) {
      if (!value) {
        this.$nextTick(() => {
          this.miniAlbumLeft = this.$refs.miniCd.offsetLeft
          this.miniAlbumWidth = this.$refs.minialbum.offsetWidth
          this.miniHeight = this.$refs.mini.offsetHeight
        })
      }
      if (value) {
        let songs = this.favoriteSongs
        let index = songs.findIndex((song) => {
          return song.songmid === this.currentSong.songmid
        })
        this.isFavorite = index >= 0
      }
    },
    playingState () {
      if (this.playingState) {
        this.$nextTick(() => {
          this.$refs.audio.play()
          this.$refs.album.style.animationPlayState = 'running'
          this.$refs.minialbum.style.animationPlayState = 'running'
        })
      } else {
        this.$refs.audio.pause()
        this.$refs.album.style.animationPlayState = 'paused'
        this.$refs.minialbum.style.animationPlayState = 'paused'
      }
      if (this.lyric.lines !== -1) {
        this.lyric.togglePlay()
      }
    },
    currentSong (newValue, oldValue) {
      if (this.currentSong !== {} && this.currentSong !== undefined) {
        setTimeout(() => {
          if (oldValue !== undefined) {
            if (oldValue.songmid === newValue.songmid) {
              return
            }
          }
          this.$refs.audio.src = this.currentSong.url
          setListenSongs(this.currentSong)
          this.setListenSongs(getListenSongs())
          this.songReady = false
          let songs = this.favoriteSongs
          let index = songs.findIndex((song) => {
            return song.songmid === this.currentSong.songmid
          })
          this.isFavorite = index >= 0
        }, 20)
      }
      if (this.currentSong === undefined) {
        this.$refs.audio.url = ''
        this.lyric.stop()
        this.listShow = false
        this.setShowFlag(false)
      }
    },
    songReady () {
      if (this.songReady) {
        if (this.lyric.lines !== -1) {
          this.lyric.stop()
          this.lyric = {}
        }
        this.currentSong.getLyric().then((res) => {
          this.lyric = new Lyric(res, ({lineNum, txt}) => {
            let lyricItems = document.getElementsByClassName('lyric-item')
            this.$refs.text.innerHTML = txt
            this.lineNum = lineNum
            if (lineNum >= 5) {
              this.$refs.scroll.scrollToElement(lyricItems[lineNum - 5])
            } else {
              this.$refs.scroll.scrollToElement(lyricItems[0])
            }
          })
          this.lyricStr = this.lyric.lines
          this.lyric.play()
        })
      }
    },
    currentTime () {
      if (this.currentTime >= this.currentSong.duration) {
        setTimeout(() => {
          this.next()
        }, 100)
      }
    },
    mode () {
    }
  },
  computed: {
    ...mapGetters([
      'showFlag',
      'currentSong',
      'playingState',
      'currentIndex',
      'playList',
      'sequenceList',
      'mode',
      'favoriteSongs'
    ])
  },
  components: {
    progressBar: progressBar,
    scroll: scroll,
    playlist: playlist
  }
}
</script>

<style scoped>
  .player {
    width: auto;
    height: auto;
  }
  .bg-player {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  .backImage{
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
  }
  .bgImage {
    width: 100%;
    height: 100%;
    filter: blur(20px);
    opacity: 0.6;
  }
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-color: #222;
  }
  .title {
    width: 100%;
    height: 60px;
    position: relative;
  }
  .icon-back {
    position: absolute;
    width: 26px;
    height: 26px;
    background-image: url('/static/image/back.png');
    background-size: 26px;
    background-repeat: no-repeat;
    transform: rotateZ(-90deg);
    top: 17px;
    left: 20px;
  }
  .name {
    position: absolute;
    width: 200px;
    text-align: center;
    height: 60px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .song-name {
    width: 200px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    color: white;
    font-weight: 700;
    letter-spacing: 2px;
  }
  .singer-name {
    width: 200px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 20px;
    line-height: 20px;
    color: white;
    font-size: 13px;
  }
  .middle {
    width: 100%;
    white-space: nowrap;
    margin-top: 30px;
    font-size: 0;
  }
  .middle-l {
    display: inline-block;
    width: 100%;
    vertical-align: top;
    height: 350px;
  }
  .middle-r {
    display: inline-block;
    width: 100%;
    vertical-align: top;
    height: 350px;
    overflow: hidden;
  }
  .lyric-wrapper {
    width: 100%;
  }
  .lyric-item {
    color: rgba(255,255,255,0.5);
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    text-align: center;
    line-height: 40px;
    font-size: 15px;
  }
  .lyric-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .lyric-item.current {
    color: white;
  }
  .album-wrapper {
    width: 320px;
    height: 320px;
    margin: 0 auto;
    transform-origin: center;
    z-index: 3;
  }
  .album {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 10px solid rgba(255,255,255,0.1);
    animation: circle linear 20s infinite;
  }
  .lyric {
    width: 100%;
    height: 20px;
    margin-top: 15px;
  }
  .text {
    text-align: center;
    color: white;
    font-size: 15px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .dots-wrapper {
    margin-top: 30px;
    width: 100%;
  }
  .dots {
    width: 50px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 6px;
  }
  .dot.current {
    width: 20px;
  }
  .progress-bar-wrapper {
    position: absolute;
    bottom: 130px;
    width: 100%;
  }
  .icon-control {
    width: 100%;
    position: absolute;
    bottom: 0px;
    height: 100px;
    display: flex;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .icon-sequence, .icon-random, .icon-loop, .icon-prev, .icon-next, .icon-not-favorite, .icon-favorite {
    flex: 1;
    width: 35px;
    height: 35px;
    background-repeat: no-repeat;
    background-size: 35px;
    background-position: center;
  }
  .icon-sequence {
    background-image: url('/static/image/sequence.png');
  }
  .icon-random {
    background-image: url('/static/image/random.png');
  }
  .icon-loop {
    background-image: url('/static/image/loop.png');
  }
  .icon-prev {
    background-image: url('/static/image/prev.png');
  }
  .icon-next {
    background-image: url('/static/image/next.png');
  }
  .icon-not-favorite {
    background-image: url('/static/image/not-favorite.png');
  }
  .icon-favorite {
    background-image: url('/static/image/favorite.png');
  }
  .icon-play, .icon-pause {
    flex: 1.6;
    width: 45px;
    height: 45px;
    background-size: 45px;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    top: -5px;
  }
  .icon-play {
    background-image: url('/static/image/play.png');
  }
  .icon-pause {
    background-image: url('/static/image/pause.png');
  }
.mini-player {
  height: 60px;
  background-color: #333;
  position: fixed;
  z-index: 1000;
  bottom: 0;
  left: 0;
  right: 0;
}
.mini-album-wrapper {
  width: 44px;
  height: 44px;
  position: absolute;
  top: 8px;
  left: 30px;
}
.mini-album {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  animation: circle 20s linear infinite;
}
.mini-description {
  position: absolute;
  left: 94px;
  top: 8px;
  width: 150px;
}
.mini-song-name {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: white;
  font-size: 14px;
}
.mini-singer-name {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  color: #ccc;
  font-size: 12px;
  margin-top: 6px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.mini-btn {
  position: absolute;
  top: 10px;
  right: 65px;
  width: 40px;
  height: 40px;
}
.bg-circle {
  stroke: rgba(255,205, 49, 0.5);
  stroke-width: 2px;
  fill: #333;
}
.move-circle {
  transform-origin: center;
  transform: rotateZ(-90deg);
  stroke: #ffcd32;
  stroke-width: 2px;
  fill: #333;
}
.mini-play, .mini-pause {
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  background-size: 20px;
  background-repeat: no-repeat;
}
.mini-play {
  background-image: url('/static/image/mini-play.png');
}
.mini-pause {
  left: 13px;
  background-image: url('/static/image/mini-pause.png');
}
.list-btn {
  position: absolute;
  right: 20px;
  top: 15px;
  width: 30px;
  height: 30px;
  background-image: url('/static/image/playlist.png');
  background-size: 30px;
  background-repeat: no-repeat;
}
.fade-enter-active, .fade-leave-active {
  transition: all linear 0.4s;
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
.pop-enter-active, .pop-leave-active {
  transition: all linear 0.7s
}
.pop-enter, .pop-leave-to {
  transform: translateY(100%);
}
.shift-enter-active, .shift-leave-active {
  transition: all linear 0.7s
}
.shift-enter, .shift-leave-to {
  transform: translateY(-100%);
}
.hide-enter-active, .hide-leave-active {
  transition: all linear 0.5s;
}
.hide-enter, .hide-leave-to {
  opacity: 0;
}
  @keyframes circle {
    0 % {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
