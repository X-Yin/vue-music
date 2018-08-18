<template>
  <transition name="slide">
    <div class="disc-detail" ref="discDetail">
      <music-list ref="musicList" :image="image" :list="list" :name="name"></music-list>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import musicList from '../base/musicList.vue'
import {mapGetters} from 'vuex'
import getDiscList from '../api/getDiscList'
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
      'disc',
      'playList'
    ])
  },
  created () {
    this.image = this.disc.imgurl
    this.name = this.disc.dissname
    let id = this.disc.dissid
    id = parseInt(id)
    getDiscList(id).then((res) => {
      console.log(res)
      let list = res.cdlist[0].songlist
      let list1 = []
      for (let i = 0; i < list.length; i++) {
        list[i]['musicData'] = list[i]
        list1.push(list[i])
      }
      this.list = list1
    })
  },
  mounted () {
    let bottom = this.playList.length === 0 ? 0 : '60px'
    this.$refs.discDetail.style.bottom = bottom
    this.$refs.musicList.refresh()
  },
  methods: {
    handlePlayList () {
      let bottom = this.playList.length === 0 ? 0 : '60px'
      this.$refs.discDetail.style.bottom = bottom
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
  .disc-detail {
    position: fixed;
    background-color: #222;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 4;
  }
</style>
