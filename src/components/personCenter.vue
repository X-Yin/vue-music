<template>
  <transition name="slide">
    <div class="person-center">
      <div class="back-icon" @click="back"></div>
      <div class="select-wrapper">
        <select1 @select="select" leftText="我喜欢的" rightText="最近听的"></select1>
      </div>
      <div class="random-play">
        <div class="btn" @click="randomPlay">
          <div class="random-icon"></div>
          <div class="random-text">随机播放全部</div>
        </div>
      </div>
      <div class="favorite-songs" v-show="showIndex === 0" ref="favoriteSongs">
        <scroll :data="favoriteSongs" ref="scroll1">
          <ul class="wrapper">
            <li v-for="(item, index) in favoriteSongs" :key="index" class="item" @click="selectItem(item)">
              <div class="song-name">{{item.songname}}</div>
              <div class="description">{{item.singername}}  -  {{item.albumname}}</div>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="listen-songs" v-show="showIndex === 1" ref="listenSongs">
        <scroll :data="listenSongs" ref="scroll2">
          <ul class="wrapper">
            <li v-for="(item, index) in listenSongs" :key="index" class="item" @click="selectItem(item)">
              <div class="song-name">{{item.songname}}</div>
              <div class="description">{{item.singername}}  -  {{item.albumname}}</div>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import select from '../base/select.vue'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import scroll from '../base/scroll.vue'
import shuffle from '../api/shuffle'
import {Song} from '../api/song'
import {playlistMixin} from '../api/mixins'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      showIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'listenSongs',
      'favoriteSongs',
      'playList'
    ])
  },
  mounted () {
    setTimeout(() => {
      this.$refs.scroll1.refresh()
      this.$refs.scroll2.refresh()
    }, 400)
  },
  watch: {
    showIndex () {
      setTimeout(() => {
        this.$refs.scroll1.refresh()
        this.$refs.scroll2.refresh()
      }, 20)
    }
  },
  methods: {
    handlePlayList () {
      let bottom = this.playList.length === 0 ? 0 : '60px'
      this.$refs.favoriteSongs.style.bottom = bottom
      this.$refs.scroll1.refresh()
      this.$refs.listenSongs.style.bottom = bottom
      this.$refs.scroll2.refresh()
    },
    selectItem (item) {
      let song = new Song(item)
      this.addOneSong(song)
      this.setShowFlag(true)
    },
    select (index) {
      this.showIndex = index
    },
    back () {
      this.$router.go(-1)
    },
    randomPlay () {
      this.setMode('random')
      this.setShowFlag(true)
      let songs = []
      let songs1 = []
      if (this.showIndex === 0) {
        songs = this.favoriteSongs.slice()
      } else {
        songs = this.listenSongs.slice()
      }
      for (let i = 0; i < songs.length; i++) {
        songs[i] = new Song(songs[i])
      }
      this.setSequenceList(songs)
      songs1 = shuffle(songs)
      this.setPlayList(songs1)
      this.setCurrentIndex(0)
    },
    ...mapMutations([
      'setSequenceList',
      'setPlayList',
      'setCurrentIndex',
      'setMode',
      'setShowFlag'
    ]),
    ...mapActions([
      'addOneSong'
    ])
  },
  components: {
    select1: select,
    scroll: scroll
  }
}
</script>

<style scoped>
  .slide-enter-active, .slide-leave-active {
    transition: all linear 0.3s;
  }
  .slide-enter, .slide-leave-to {
    transform: translateX(100%);
  }
  .person-center {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #222;
  }
  .back-icon {
    position: absolute;
    left: 20px;
    top: 20px;
    width: 20px;
    height: 20px;
    background-image: url('/static/image/back.png');
    background-size: 20px;
    background-repeat: no-repeat;
  }
  .random-play {
    width: 100%;
    height: 100px;
    margin-top: 40px;
  }
  .btn {
    width: 130px;
    height: 30px;
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 15px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .random-icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: top;
    background-image: url('/static/image/randomWhite.png');
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
  }
  .random-text {
    display: inline-block;
    vertical-align: top;
    color: #ccc;
    font-size: 13px;
  }
  .favorite-songs, .listen-songs {
    position: absolute;
    top: 160px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .wrapper {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  .item {
    width: 100%;
    height: 70px;
    position: relative;
  }
  .song-name {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: white;
    font-size: 15px;
  }
  .description {
    position: absolute;
    top: 25px;
    left: 0;
    right: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #ccc;
    font-size: 12px;
  }
</style>
