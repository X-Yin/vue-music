<template>
    <div class="playlist" ref="playlist" @click="hide($event)">
      <transition name="popup">
        <div class="content" v-show="show">
          <div class="header">
            <div :class="{'icon-sequence': mode === 'sequence', 'icon-loop': mode === 'loop', 'icon-random': mode === 'random'}" @click.stop="changeMode"></div>
            <div class="mode-text">{{modeTexts[mode]}}</div>
            <div class="clear-icon" @click.stop="clearSongs"></div>
          </div>
          <div class="list">
            <scroll :data="sequenceList" :probeType="3" class="wrapper" ref="scroll">
              <div>
                <li v-for="(item, index) in sequenceList" :key="index" class="list-item" ref="item">
                  <div class="icon"><div class="play-icon" v-show="playIndex === index"></div></div>
                  <div class="song-name" @click.stop="selectItem(item, index)">{{item.songname}}</div>
                  <div class="iconF" :class="{'favorite-icon': isFavorites[index], 'not-favorite-icon': !isFavorites[index]}" @click.stop="changeFavorite(index)"></div>
                  <div class="delete-icon" @click.stop="deleteOneSong(item)"></div>
                </li>
              </div>
            </scroll>
          </div>
          <div class="add-song">
            <div class="btn" @click.stop="showPage">
              <span class="icon-add"></span>
              <span class="add-text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="close" @click.stop="hide($event)" ref="close">
            关闭
          </div>
          <transition name="slide">
            <add-page ref="addPage" v-show="pageShow" @back="back"></add-page>
          </transition>
        </div>
      </transition>
    </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations, mapActions} from 'vuex'
import scroll from '../base/scroll.vue'
import {setFavoriteSongs, deleteFavoriteSongs, getFavoriteSongs} from '../api/cache'
import addPage from './add-page.vue'
export default {
  data () {
    return {
      modeTexts: {
        sequence: '顺序播放',
        loop: '单曲循环',
        random: '随机播放'
      },
      playIndex: 0,
      isFavorites: [],
      pageShow: false
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show () {
      if (this.show) {
        // 滚动到正在播放的歌曲的位置
        let index = this.sequenceList.findIndex((item) => {
          return this.currentSong.url === item.url
        })
        this.playIndex = index
        this.$nextTick(() => {
          if (index <= 3) {
            this.$refs.scroll.scrollToElement(this.$refs.item[0])
          } else {
            this.$refs.scroll.scrollToElement(this.$refs.item[index - 3])
          }
        })
        // 检查favoriteSongs
        this.isFavorites = []
        this.sequenceList.forEach((item, index) => {
          this.isFavorites.push(false)
        })
        for (let i = 0; i < this.sequenceList.length; i++) {
          let index = this.favoriteSongs.findIndex((item) => {
            return item.songmid === this.sequenceList[i].songmid
          })
          this.isFavorites[i] = index >= 0
        }
      }
    },
    sequenceList () {
      // 滚动到正在播放的歌曲的位置
      let index = this.sequenceList.findIndex((item) => {
        return this.currentSong.url === item.url
      })
      this.playIndex = index
      this.$nextTick(() => {
        if (index <= 3) {
          this.$refs.scroll.scrollToElement(this.$refs.item[0])
        } else {
          this.$refs.scroll.scrollToElement(this.$refs.item[index - 3])
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'mode',
      'sequenceList',
      'playList',
      'currentIndex',
      'currentSong',
      'favoriteSongs'
    ])
  },
  methods: {
    back () {
      this.pageShow = false
    },
    showPage () {
      this.pageShow = true
      this.$refs.addPage.refresh()
    },
    selectItem (item, index1) {
      if (this.mode === 'loop') {
        let list = []
        list.push(item)
        this.setPlayList(list)
        this.setCurrentIndex(0)
      } else {
        let index2 = this.playList.findIndex((song) => {
          return song.songmid === item.songmid
        })
        this.setCurrentIndex(index2)
      }
      // 滚动到正在播放的歌曲的位置
      let index = this.sequenceList.findIndex((item) => {
        return this.currentSong.url === item.url
      })
      this.playIndex = index
      this.$nextTick(() => {
        if (index <= 3) {
          this.$refs.scroll.scrollToElement(this.$refs.item[0])
        } else {
          this.$refs.scroll.scrollToElement(this.$refs.item[index - 3])
        }
      })
    },
    changeFavorite (index) {
      this.isFavorites[index] = !this.isFavorites[index]
      let song = this.sequenceList[index]
      let item = document.getElementsByClassName('list-item')[index].getElementsByClassName('iconF')[0]
      if (this.isFavorites[index]) {
        item.className = 'favorite-icon iconF'
        setFavoriteSongs(song)
        this.setFavoriteSongs(getFavoriteSongs())
      } else {
        item.className = 'not-favorite-icon iconF'
        deleteFavoriteSongs(song)
        this.setFavoriteSongs(getFavoriteSongs())
      }
    },
    refresh () {
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    },
    hide (e) {
      if (e.target === this.$refs.playlist || e.target === this.) {
        this.$emit('hide')
      }
    },
    ...mapMutations([
      'setFavoriteSongs',
      'setPlayList',
      'setCurrentIndex'
    ]),
    ...mapActions([
      'deleteOneSong',
      'changeMode',
      'clearSongs'
    ])
  },
  components: {
    scroll: scroll,
    addPage: addPage
  }
}
</script>

<style scoped>
  .playlist {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 3;
    background-color: rgba(255,255,255,0.3);
  }
  .content {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 20px;
    box-sizing: border-box;
    background-color: #333;
  }
  .header {
    width: 100%;
    height: 50px;
    position: relative;
   }
  .icon-sequence, .icon-loop, .icon-random {
    width: 30px;
    height: 30px;
    background-size: 30px;
    background-repeat: no-repeat;
    position: absolute;
    left: 0;
    top: 10px;
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
  .mode-text {
    color: #ccc;
    position: absolute;
    top: 12px;
    left: 40px;
  }
  .clear-icon {
    width: 20px;
    height: 20px;
    background-image: url('/static/image/clearSearch.png');
    background-size: 20px;
    background-repeat: no-repeat;
    position: absolute;
    right: 0;
    top: 12px;
  }
  .wrapper {
    width: 100%;
    max-height: 250px;
    overflow: hidden;
  }
  .list-item {
    display: flex;
    width: 100%;
    height: 30px;
    margin-bottom: 15px;
  }
  .list-item:last-child {
    margin-bottom: 0;
  }
  .icon {
    flex: 0 15px;
    margin-top: 7.5px;
    width: 15px;
    height: 15px;
  }
  .play-icon, .favorite-icon, .not-favorite-icon, .delete-icon{
    width: 15px;
    height: 15px;
    background-size: 15px;
    background-repeat: no-repeat;
  }
  .play-icon {
    background-image: url('/static/image/pause.png');
  }
  .song-name {
    flex: 1;
    color: #ccc;
    margin-left: 10px;
    font-size: 14px;
    margin-top: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .favorite-icon {
    flex: 0 15px;
    margin-top: 7.5px;
    background-image: url('/static/image/favorite.png');
  }
  .not-favorite-icon {
    flex: 0 15px;
    margin-top: 7.5px;
    background-image: url('/static/image/not-favorite.png');
  }
  .delete-icon {
    flex: 0 15px;
    margin-top: 7.5px;
    margin-left: 20px;
    background-image: url('/static/image/deleteSong.png');
  }
  .popup-enter-active, .popup-leave-active {
    transition: all linear 0.5s;
  }
  .popup-enter, .popup-leave-to {
    transform: translateY(100%);
  }
  .add-song {
    width: 100%;
    height: 100px;
    overflow: hidden;
    margin-bottom: 60px;
  }
  .btn {
    width: 150px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid #ccc;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 50px;
    padding: 5px 10px;
    box-sizing: border-box;
  }
  .icon-add {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: center;
    background-image: url('/static/image/add-song.png');
    background-size: 15px;
    background-position: center;
    background-repeat: no-repeat;
    margin-right: 10px;
  }
  .add-text {
    display: inline-block;
    font-size: 13px;
    color: #ccc;
    position: relative;
    top: -6px;
  }
  .close {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: white;
    background-color: #111;
  }
  .slide-enter-active, .slide-leave-active {
    transition: all linear 0.5s;
  }
  .slide-enter, .slide-leave-to {
    transform: translateX(100%);
  }
</style>
