<template>
  <transition name="slide">
    <div class="rank-detail" ref="rankDetail">
      <music-list ref="musicList" :image="topList.image" :list="list" :name="topList.name" :showNumber="true"></music-list>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import musicList from '../base/musicList.vue'
import {playlistMixin} from '../api/mixins'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.list = this.topList.list
    let bottom = this.playList.length === 0 ? 0 : '60px'
    this.$refs.rankDetail.style.bottom = bottom
    this.$refs.musicList.refresh()
  },
  computed: {
    ...mapGetters([
      'topList',
      'playList'
    ])
  },
  methods: {
    handlePlayList () {
      let bottom = this.playList.length === 0 ? 0 : '60px'
      this.$refs.rankDetail.style.bottom = bottom
      this.$refs.musicList.refresh()
    }
  },
  components: {
    musicList: musicList
  }
}
</script>

<style scoped>
  .slide-enter-active, .slide-leave-active {
    transition: all linear 0.3s
  }
  .slide-enter, .slide-leave-to {
    transform: translateX(100%);
  }
  .rank-detail {
    position: fixed;
    background-color: #222;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
</style>
