import {mapGetters} from 'vuex'
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList () {
      this.handlePlayList()
    }
  },
  methods: {
    handlePlayList () {
      throw new Error('component must implement handlePlayList method')
    }
  }
}
