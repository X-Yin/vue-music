<template>
    <div class="music-list" ref="musicList">
      <div class="title">
        <div class="icon" @click="back()">
          <i class="icon-back"></i>
        </div>
        <div class="name">{{name}}</div>
      </div>
      <div class="image" ref="image">
        <img :src="image" class="avatar" ref="avatar">
      </div>
      <ul class="singer-list" ref="singerList">
        <scroll :data="singerMusic" :probeType="3" @scroll="scroll" ref="scroll">
          <div>
            <li class="singer-item" v-for="(item, index) in singerMusic" :key="index" @click="selectItem(item, index)">
              <div class="number" v-show="showNumber">
                <div class="img" v-show="index <= 2" :class="{'first': index === 0, 'second': index === 1, 'third': index === 2}"></div>
                <div class="num" v-show="index > 2">{{index + 1}}</div>
              </div>
              <div class="text-wrapper">
                <div class="song-name">{{item.songname}}</div>
                <div class="description">
                  {{item.singername}}  -  {{item.songname}}
                </div>
              </div>
            </li>
          </div>
        </scroll>
      </ul>
      <div class="mask" ref="mask"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import {createSong, processSongUrl} from '../api/song'
import scroll from '../base/scroll.vue'
import {mapMutations, mapGetters} from 'vuex'
export default {
  props: {
    image: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    name: {
      type: String,
      default: ''
    },
    showNumber: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      singerMusic: []
    }
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    list () {
      if (this.list.length !== 0) {
        let list = this.list.slice()
        let songs = []
        let singerMusic = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].musicData.pay.payalbumprice === 0) {
            singerMusic.push(list[i].musicData)
          }
        }
        for (let i = 0; i < singerMusic.length; i++) {
          let song = createSong(singerMusic[i])
          songs.push(song)
        }
        processSongUrl(songs).then((res) => {
          this.singerMusic = res
        })
      }
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    scroll (y) {
      this.$refs.mask.style.top = 300 + y + 'px'
      if (y > 0) {
        this.$refs.singerList.style.top = 300 + y + 'px'
        this.$refs.image.style.height = 300 + y + 'px'
        this.$refs.avatar.style.transform = `scale(${(300 + y) / 300})`
      }
    },
    selectItem (item, index) {
      this.setSequenceList(this.singerMusic)
      this.setPlayList(this.singerMusic)
      this.setCurrentIndex(index)
      this.setShowFlag(true)
      this.setPlayingState(true)
    },
    refresh () {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 20)
    },
    ...mapMutations([
      'setShowFlag',
      'setSequenceList',
      'setPlayList',
      'setCurrentIndex',
      'setPlayingState'
    ])
  },
  components: {
    scroll: scroll
  }
}
</script>

<style scoped>
  .music-list {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .title {
    position: absolute;
    top: 0;
    width: 100%;
    height: 40px;
    z-index: 1
  }
  .icon {
    position: absolute;
    left: 20px;
    top: 10px;
  }
  .icon-back {
    width: 26px;
    height: 26px;
    background-image: url('/static/image/back.png');
    background-size: 26px;
    background-repeat: no-repeat;
    display: inline-block;
  }
  .name {
    color: white;
    font-size: 20px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    top: 10px;
  }
  .image {
    width: 100%;
    height: 300px;
    overflow: hidden;
  }
  .avatar {
    width: 100%;
  }
  .singer-list {
    position: absolute;
    top: 300px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
  }
  .singer-item {
    width: 100%;
    height: 80px;
    padding: 20px 20px 20px 40px;
    box-sizing: border-box;
    display: flex;
  }
  .number {
    flex: 0 50px;
    height: 50px;
    margin-right: 20px;
  }
  .text-wrapper {
    flex: 1;
    position: relative;
  }
  .song-name {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    color: white;
    font-size: 16px;
    padding-bottom: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .singer-name {
    color: #ccc;
    font-size: 12px;
    margin-right: 10px;
  }
  .description {
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #ccc;
    font-size: 12px;
  }
  .album-name {
    color: #ccc;
    font-size: 12px;
  }
  .mask {
    position: absolute;
    top: 300px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #222;
    z-index: 2
  }
  .num {
    width: 50px;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    text-align: center;
    color: #ffcd32;
  }
  .first, .second, .third {
    width: 100%;
    height: 100%;
    background-size: 30px;
    background-position: center;
    background-repeat: no-repeat;
  }
  .first {
    background-image: url('/static/image/first.png');
  }
  .second {
    background-image: url('/static/image/second.png');
  }
  .third {
    background-image: url('/static/image/third.png');
  }
</style>
