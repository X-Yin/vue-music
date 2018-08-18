<template>
    <div class="singer" ref="singer">
      <scroll :data="singerList" :probeType="3" @scroll="scroll" ref="scroll">
        <ul class="singerList">
          <li class="item" v-for="(item, index) in singerList" :key="index" ref="list">
            <div class="title">{{item.title}}</div>
            <ul>
              <li v-for="(singer, index) in item.list" :key="index" class="singer-item" @click="selectItem(singer)">
                <div class="avatar">
                  <img class="avatar-item" v-lazy="singer.avatar">
                </div>
                <div class="name">{{singer.name}}</div>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="side-nav">
          <li v-for="(item, index) in nameList" :key="index" class="name-item" :class="{'current': currentIndex === index}" @click="selectName(index)">
            <span class="text">{{item.title[0]}}</span>
          </li>
        </ul>
      </scroll>
      <router-view/>
    </div>
</template>

<script type="text/ecmascript-6">
import {getSingers} from '../api/getSingers'
import Singer from '../api/singer'
import scroll from '../base/scroll.vue'
import {mapMutations, mapGetters} from 'vuex'
import {playlistMixin} from '../api/mixins'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      singerList: [],
      nameList: [],
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  created () {
    getSingers().then((res) => {
      this.singerList = res.data.list
      this.singerList = this._normalizeSinger(this.singerList)
    })
  },
  methods: {
    handlePlayList () {
      let bottom = this.playList.length === 0 ? 0 : '60px'
      this.$refs.singer.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _normalizeSinger (list) {
      let hotList = []
      let listArray = []
      let other = {
        title: '#',
        list: []
      }
      let have = false
      for (let i = 0; i < list.length; i++) {
        if (i < 20) {
          hotList.push(list[i])
        }
      }
      let hot = {
        title: '热门',
        list: hotList
      }
      for (let i = 0; i < list.length; i++) {
        have = false
        if (list[i].Findex.charCodeAt(0) < 65 || list[i].Findex.charCodeAt(0) > 90) {
          other.list.push(list[i])
          continue
        }
        for (let j = 0; j < listArray.length; j++) {
          if (list[i].Findex === listArray[j].title) {
            have = true
            listArray[j].list.push(list[i])
          }
        }
        if (!have) {
          listArray.push({
            title: list[i].Findex,
            list: [list[i]]
          })
        }
      }
      listArray.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      listArray.push(other)
      listArray.unshift(hot)
      this.nameList = listArray.slice()
      for (let i = 0; i < listArray.length; i++) {
        for (let j = 0; j < listArray[i].list.length; j++) {
          listArray[i].list[j] = new Singer({id: listArray[i].list[j].Fsinger_mid, name: listArray[i].list[j].Fsinger_name
          })
        }
      }
      return listArray
    },
    _initHeights () {
      let heights = []
      for (let i = 0; i < this.$refs.list.length; i++) {
        let num = 0
        for (let j = 0; j < i; j++) {
          num += this.$refs.list[j].offsetHeight
        }
        heights.push(num)
      }
      return heights
    },
    scroll (y) {
      let heights = this._initHeights()
      y = Math.abs(y)
      for (let i = 0; i < heights.length; i++) {
        if (y >= heights[i] && y < heights[i + 1]) {
          this.currentIndex = i
        }
      }
    },
    selectName (index) {
      this.$refs.scroll.scrollToElement(this.$refs.list[index])
    },
    selectItem (item) {
      this.setSinger(item)
      this.$router.push(`/singer/${item.id}`)
    },
    ...mapMutations([
      'setSinger'
    ])
  },
  components: {
    scroll: scroll
  }
}
</script>

<style scoped>
  .singer {
    position: absolute;
    top: 120px;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
  }
  .title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
    box-sizing: border-box;
    background-color: #111;
    color: #ccc;
  }
  .singer-item {
    width: 100%;
    height: 100px;
    padding: 20px;
    box-sizing: border-box;
  }
  .avatar {
    display: inline-block;
    vertical-align: middle;
  }
  .avatar-item {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .name {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    color: #fff;
    margin-left: 20px;
  }
  .side-nav {
    position: absolute;
    right: 10px;
    top: 40px;
    width: 20px;
    border-radius: 10px;
    background-color: #111;
    overflow: hidden;
  }
  .name-item {
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    color: #ccc;
  }
  .name-item.current {
    font-size: 15px;
    color: #ffcd32;
    font-weight: 700;
  }
</style>
