<template>
    <div class="rank" ref="rank">
      <scroll :data="topList" ref="scroll">
        <ul class="list-wrapper">
          <li v-for="(item, index) in topList" :key="index" class="list-item" @click="selectItem(item)">
            <div class="image"><img style="width: 100px; height: 100%" v-lazy="item.picUrl"></div>
            <ul class="songs">
              <li v-for="(song, index1) in item.songList" :key="index1" class="song">
                <p class="description">{{index1 + 1}}、{{song.songname}}-{{song.singername}}</p>
              </li>
            </ul>
          </li>
        </ul>
      </scroll>
      <router-view/>
    </div>
</template>

<script type="text/ecmascript-6">
import {getTopList, getListDetail} from '../api/getTopList'
import musicList from '../base/musicList.vue'
import scroll from '../base/scroll.vue'
import {mapMutations, mapGetters} from 'vuex'
import {playlistMixin} from '../api/mixins'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      topList: {},
      list: [],
      image: '',
      name: ''
    }
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  created () {
    getTopList().then((res) => {
      this.topList = res.data.topList
    })
  },
  methods: {
    handlePlayList () {
      let bottom = this.playList.length === 0 ? 0 : '60px'
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem (item) {
      getListDetail(item.id).then((res) => {
        for (let i = 0; i < res.songlist.length; i++) {
          res.songlist[i].musicData = res.songlist[i].data
        }
        this.list = res.songlist
        this.name = res.topinfo.ListName
        this.image = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${res.songlist[0].data.albummid}.jpg?max_age=2592000`
        let list1 = {
          list: this.list,
          name: this.name,
          image: this.image
        }
        this.setTopList(list1)
        this.$router.push(`/rank/${item.id}`)
      })
    },
    ...mapMutations([
      'setTopList'
    ])
  },
  components: {
    scroll: scroll,
    musicList: musicList
  }
}
</script>

<style scoped>
  .rank {
    position: absolute;
    top: 120px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .list-wrapper {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .list-item {
    width: 100%;
    margin-bottom: 20px;
    height: 100px;
    background-color: #333;
    position: relative;
  }
  .list-item:last-child {
    margin-bottom: 0;
  }
  .image {
    width: 100px;
    height: 100px;
    display: inline-block;
    vertical-align: top;
    margin-right: 20px;
  }
  .songs {
    position: absolute;
    left: 120px;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .song {
    width: 100%;
    height: 33px;
    line-height: 33px;
  }
  .description {
    color: #ccc;
    width: 100%;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
