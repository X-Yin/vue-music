<template>
  <transition name="slide">
    <div class="singer-detail" ref="singerDetail">
      <music-list ref="musicList" :image="image" :list="list" :name="name"></music-list>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import musicList from '../base/musicList.vue'
import {mapGetters} from 'vuex'
import getSingerList from '../api/getSingerList'
import {playlistMixin} from '../api/mixins'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      image: '',
      list: [],
      name: ''
    }
  },
  computed: {
    ...mapGetters([
      'singer',
      'playList'
    ])
  },
  mounted () {
    let bottom = this.playList.length === 0 ? 0 : '60px'
    this.$refs.singerDetail.style.bottom = bottom
    this.$refs.musicList.refresh()
  },
  methods: {
    handlePlayList () {
      let bottom = this.playList.length === 0 ? 0 : '60px'
      this.$refs.singerDetail.style.bottom = bottom
      this.$refs.musicList.refresh()
    }
  },
  created () {
    this.image = this.singer.avatar
    this.name = this.singer.name
    getSingerList(this.singer.id).then((res) => {
      this.list = res.data.list
    })
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
  .singer-detail {
    position: fixed;
    background-color: #222;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 4;
  }
</style>
