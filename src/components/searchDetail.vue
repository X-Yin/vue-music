<template>
    <div class="search-detail">
      <scroll :data="list" :probeType="3" @scrollToEnd="scrollToEnd">
        <div>
          <div class="zhida" v-show="zhida.length !== 0">
            <ul>
              <li v-for="(item, index) in zhida" :key="index" class="zhida-item" @click="selectZhida(item)">
                <div class="avatar" ref="avatar"></div>
                <div class="name">{{item.name}}</div>
              </li>
            </ul>
          </div>
          <div class="song-list">
            <ul>
              <li v-for="(item, index) in songList" :key="index" class="song-item" @click="selectSong(item)">
                <div class="music-icon"></div>
                <div class="song-name">{{item.songname}}-{{item.singername}}</div>
              </li>
            </ul>
          </div>
          <loading v-show="!(page === totalPage)"></loading>
        </div>
      </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
import scroll from '../base/scroll.vue'
import loading from '../base/loading.vue'
export default {
  data () {
    return {
      list: []
    }
  },
  props: {
    songList: {
      type: Array,
      default: () => {
        return []
      }
    },
    zhida: {
      type: Array,
      default: () => {
        return []
      }
    },
    totalPage: {
      type: Number,
      default: 1
    },
    page: {
      type: Number,
      default: 1
    }
  },
  watch: {
    songList () {
      if (this.songList.length !== 0) {
        this.list = this.zhida.concat(this.songList)
        setTimeout(() => {
          if (this.zhida.length !== 0) {
            let avatar = document.getElementsByClassName('avatar')[0]
            let image = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.zhida[0].id}.jpg?max_age=2592000`
            avatar.style.backgroundImage = `url(${image})`
          }
        }, 20)
      }
    }
  },
  methods: {
    scrollToEnd () {
      this.$emit('scrollToEnd')
    },
    selectZhida (item) {
      this.$emit('selectZhida', item)
    },
    selectSong (item) {
      this.$emit('selectSong', item)
    }
  },
  components: {
    scroll: scroll,
    loading: loading
  }
}
</script>

<style scoped>
  .search-detail {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #222;
  }
  .zhida {
    width: 100%;
  }
  .zhida-item {
    width: 100%;
    height: 60px;
    padding: 10px 10%;
    box-sizing: border-box;
    display: flex;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #333;
    background-size: 40px;
    background-position: center;
    background-repeat: no-repeat;
    flex: 0 40px;
  }
  .name {
    flex: 1;
    margin-left: 30px;
    font-size: 15px;
    color: #ccc;
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
  }
  .song-list {
    width: 100%;
  }
  .song-item {
    width: 100%;
    height: 60px;
    padding: 10px 10%;
    box-sizing: border-box;
    display: flex;
    margin-bottom: 10px;
  }
  .song-item:last-child {
    margin-bottom: 0
  }
  .music-icon {
    width: 40px;
    height: 40px;
    flex: 0 40px;
    background-image: url('/static/image/music.png');
    background-size: 30px;
    background-position: center;
    background-repeat: no-repeat;
  }
  .song-name {
    flex: 1;
    height: 40px;
    line-height: 40px;
    color: white;
    font-size: 15px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-left: 30px;
  }
</style>
