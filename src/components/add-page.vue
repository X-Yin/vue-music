<template>
    <div class="add-page">
      <popup ref="popup"></popup>
      <div class="header">
        <div class="title">添加歌曲到列表</div>
        <div class="back-icon" @click.stop="back"></div>
      </div>
      <div class="box-wrapper">
        <search-box ref="searchBox" :placeholder="placeholder" @query="changeQuery"></search-box>
      </div>
      <div class="search-detail-wrapper" v-show="query !== ''">
        <search-detail v-show="query !== ''" :songList="songList" :page="page" :totalPage="totalPage" @scrollToEnd="searchMore" @selectSong="selectSong"></search-detail>
      </div>
      <div class="select-wrapper">
        <select1 @select="select"></select1>
      </div>
      <div class="listen-songs" v-show="showIndex === 0">
        <scroll :data="listenSongs" ref="scroll1">
          <ul>
            <li v-for="(item, index) in listenSongs" :key="index" class="listenSong-item" @click.stop="selectItem(item)">
              <div class="song-name">{{item.songname}}</div>
              <div class="description">{{item.singername}} ·{{item.albumname}}</div>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="search-history" v-show="showIndex === 1">
        <scroll :data="searchHistory" ref="scroll2">
          <ul>
            <li v-for="(item, index) in searchHistory" :key="index" class="history-item">
              <div class="history-query" @click="setQuery(item)">{{item}}</div>
              <div class="delete-icon" @click="deleteSearchHistory(item)"></div>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import searchBox from '../base/search-box.vue'
import select1 from '../base/select.vue'
import popup from '../base/popup.vue'
import {mapGetters, mapActions, mapMutations} from 'vuex'
import scroll from '../base/scroll.vue'
import {searchKeyPage} from '../api/search'
import {createSong, processSongUrl, Song} from '../api/song'
import searchDetail from './searchDetail.vue'
import {setSearchHistory, getSearchHistory} from '../api/cache'
export default {
  data () {
    return {
      placeholder: '搜索歌曲',
      showIndex: 0,
      query: '',
      page: 1,
      totalPage: 1,
      songList: []
    }
  },
  computed: {
    ...mapGetters([
      'listenSongs',
      'searchHistory'
    ])
  },
  watch: {
    showIndex () {
      this.$nextTick(() => {
        this.$refs.scroll1.refresh()
        this.$refs.scroll2.refresh()
      })
    }
  },
  methods: {
    setQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    changeQuery (query) {
      this.query = query
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
      this.$refs.popup.show()
      this.addOneSong(song)
      setSearchHistory(this.query)
      let list = getSearchHistory()
      this.setSearchHistory(list)
    },
    refresh () {
      setTimeout(() => {
        this.$refs.scroll1.refresh()
        this.$refs.scroll2.refresh()
      }, 600)
    },
    back () {
      this.$emit('back')
    },
    select (index) {
      this.showIndex = index
    },
    selectItem (item) {
      let song = new Song(item)
      console.log(song)
      this.$refs.popup.show()
      this.addOneSong(song)
    },
    ...mapActions([
      'addOneSong',
      'deleteSearchHistory'
    ]),
    ...mapMutations([
      'setSearchHistory'
    ])
  },
  components: {
    searchBox: searchBox,
    select1: select1,
    popup: popup,
    scroll: scroll,
    searchDetail: searchDetail
  }
}
</script>

<style scoped>
  .add-page {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: #222;
  }
  .header {
    height: 60px;
    width: 100%;
    position: relative;
   }
  .title {
    color: #ccc;
    width: 100%;
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-size: 20px;
  }
  .back-icon {
    position: absolute;
    width: 24px;
    height: 24px;
    right: 20px;
    top: 18px;
    background-image: url('/static/image/deleteSong.png');
    background-size: 16px;
    background-position: center;
    background-repeat: no-repeat;
  }
  .box-wrapper {
    margin-top: 20px;
  }
  .select-wrapper {
    margin-top: 30px;
  }
  .listen-songs, .search-history {
    position: absolute;
    top: 220px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  .listenSong-item {
    width: 100%;
    height: 80px;
    padding: 20px;
    box-sizing: border-box;
  }
  .song-name {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: white;
    font-size: 15px;
  }
  .description {
    width: 100%;
    color: rgba(255,255,255,0.5);
    font-size: 13px;
    margin-top: 10px;
  }
  .search-detail-wrapper {
    position: absolute;
    top: 135px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
  }
  .history-query {
    position: absolute;
    left: 20px;
    height: 30px;
    line-height: 30px;
    top: 0;
  }
  .history-item {
    width: 100%;
    height: 30px;
    color: #ccc;
    position: relative;
    margin-top: 15px;
    padding: 20px;
    box-sizing: border-box;
  }
  .delete-icon {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 20px;
    top: 0;
    background-image: url('/static/image/clearSearchHistory.png');
    background-size: 15px;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
