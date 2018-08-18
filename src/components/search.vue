<template>
    <div class="search" ref="search">
      <scroll :data="datas" ref="scroll">
        <div>
          <div class="box-wrapper">
            <search-box @query="changeQuery" ref="searchBox"></search-box>
          </div>
          <div class="hot-key">
            <div class="title">热门搜索</div>
            <ul>
              <li v-for="(item, index) in hotKeys" :key="index" class="key-item" @click="selectKey(item)">
                <span class="text">{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length !== 0">
            <div class="header">
              <div class="search-title">搜索历史</div>
              <div class="delete-icon" @click="clearSearchHistory()"></div>
            </div>
            <ul class="historys">
              <li v-for="(item, index) in searchHistory" :key="index" class="history-item" @click="updateQuery(item)">
                <div class="history-query">{{item}}</div>
                <div class="clear-icon" @click.stop="deleteSearchHistory(item)"></div>
              </li>
            </ul>
          </div>
        </div>
      </scroll>
      <div class="search-detail-wrapper" v-show="query !== ''">
        <search-detail
          v-show="query !== ''"
          :songList="songList"
          :zhida="zhida"
          :totalPage="totalPage"
          :page="page"
          @scrollToEnd="searchMore"
          @selectZhida="selectZhida"
          @selectSong="selectSong"
        ></search-detail>
      </div>
      <router-view/>
    </div>
</template>

<script type="text/ecmascript-6">
import searchBox from '../base/search-box.vue'
import searchDetail from './searchDetail.vue'
import {searchKeyPage} from '../api/search'
import {createSong, processSongUrl} from '../api/song'
import Singer from '../api/singer'
import getHotKeys from '../api/getHotKeys'
import {mapMutations, mapGetters, mapActions} from 'vuex'
import {setSearchHistory, getSearchHistory} from '../api/cache'
import scroll from '../base/scroll.vue'
import {playlistMixin} from '../api/mixins'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      query: '',
      list: [],
      page: 1,
      totalPage: 0,
      zhida: [],
      songList: [],
      hotKeys: [],
      datas: []
    }
  },
  created () {
    getHotKeys().then((res) => {
      this.hotKeys = res.data.hotkey.slice(0, 9)
    })
  },
  computed: {
    ...mapGetters([
      'sequenceList',
      'playList',
      'searchHistory'
    ])
  },
  methods: {
    handlePlayList () {
      let bottom = this.playList.length === 0 ? 0 : '60px'
      this.$refs.search.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    changeQuery (query) {
      this.query = query
      this.zhida = []
      this.songList = []
      searchKeyPage(this.query, this.page).then((res) => {
        this.totalPage = res.data.song.curnum
        let songList = []
        let songs = res.data.song.list
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].pay.payalbumprice === 0) {
            let song = createSong(songs[i])
            songList.push(song)
          }
        }
        processSongUrl(songList).then((res) => {
          this.songList = res
        })
        if (res.data.zhida.singermid) {
          let singer = new Singer({id: res.data.zhida.singermid, name: res.data.zhida.singername})
          this.zhida = []
          this.zhida.push(singer)
        }
      })
    },
    searchMore () {
      searchKeyPage(this.query, ++this.page).then((res) => {
        let songList = []
        let songs = res.data.song.list
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].pay.payalbumprice === 0) {
            let song = createSong(songs[i])
            songList.push(song)
          }
        }
        processSongUrl(songList).then((res) => {
          this.songList = this.songList.concat(res)
        })
      })
    },
    selectSong (song) {
      this.addOneSong(song)
      this.setShowFlag(true)
      this.setPlayingState(true)
      setSearchHistory(this.query)
      let list = getSearchHistory()
      this.setSearchHistory(list)
    },
    selectZhida (singer) {
      this.setSinger(singer)
      this.$router.push(`/search/${singer.id}`)
      setSearchHistory(this.query)
      let list = getSearchHistory()
      this.setSearchHistory(list)
    },
    selectKey (item) {
      this.$refs.searchBox.setQuery(item.k)
    },
    updateQuery (item) {
      this.$refs.searchBox.setQuery(item)
    },
    ...mapMutations([
      'setSinger',
      'setPlayingState',
      'setShowFlag',
      'setSearchHistory'
    ]),
    ...mapActions([
      'addOneSong',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  watch: {
    searchHistory () {
      this.datas = this.hotKeys.concat(this.searchHistory)
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  },
  components: {
    searchBox: searchBox,
    searchDetail: searchDetail,
    scroll: scroll
  }
}
</script>

<style scoped>
  .search {
    position: absolute;
    top: 120px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .box-wrapper {
    margin-top: 20px;
  }
  .title {
    font-size: 15px;
    color: #ccc;
    margin-bottom: 20px;
  }
  .hot-key, .search-history {
    width: 100%;
    padding: 0 10%;
    margin-top: 20px;
    box-sizing: border-box;
  }
  .search-history {
    margin-top: 50px;
  }
  .key-item {
    display: inline-block;
    margin-right: 20px;
    margin-top: 15px;
  }
  .text {
    width: auto;
    height: 20px;
    line-height: 20px;
    padding: 5px 10px;
    font-size: 14px;
    background-color: #333;
    color: rgba(255,255,255,0.3);
    border-radius: 3px;
  }
  .header {
    width: 100%;
    height: 30px;
    position: relative;
  }
  .search-title {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    color: #ccc;
    position: absolute;
    left: 0;
  }
  .delete-icon {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0;
    top: 0;
    background-image: url('/static/image/clearSearch.png');
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
  }
  .historys {
    width: 100%;
    margin-top: 20px;
  }
  .history-item {
    width: 100%;
    height: 30px;
    color: #ccc;
    position: relative;
    margin-top: 15px;
  }
  .history-query {
    position: absolute;
    left: 0;
    height: 30px;
    line-height: 30px;
    top: 0;
  }
  .clear-icon {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0;
    top: 0;
    background-image: url('/static/image/clearSearchHistory.png');
    background-size: 15px;
    background-position: center;
    background-repeat: no-repeat;
  }
  .search-detail-wrapper {
    position: absolute;
    top: 70px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
</style>
