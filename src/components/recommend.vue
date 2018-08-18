<template>
    <div class="recommend" ref="recommend">
      <scroll :data="data" ref="scroll">
        <div>
          <slider :images="images">
            <li v-for="(item,index) in sliderImages" :key="index" class="item">
              <a :href="item.linkUrl"><img style="width: 100%" :src="item.picUrl"></a>
            </li>
          </slider>
          <disc-list @list="list"></disc-list>
        </div>
      </scroll>
      <router-view/>
    </div>
</template>

<script type="text/ecmascript-6">
import getSliders from '../api/getSliders'
import slider from '../base/slider.vue'
import discList from './discList.vue'
import scroll from '../base/scroll.vue'
import {playlistMixin} from '../api/mixins'
import {mapGetters} from 'vuex'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      sliderImages: [],
      images: [],
      discList: [],
      data: []
    }
  },
  created () {
    getSliders().then((data) => {
      let images = data.data.slider.slice()
      let firstImage = images[0]
      let lastImage = images[images.length - 1]
      images.push(firstImage)
      images.unshift(lastImage)
      this.sliderImages = images
      this.images = data.data.slider
    })
  },
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  methods: {
    handlePlayList () {
      let bottom = this.playList.length === 0 ? 0 : '60px'
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    list (list) {
      this.discList = list
    }
  },
  watch: {
    discList () {
      if (this.discList.length !== 0 && this.sliderImages.length !== 0) {
        this.data = this.discList.concat(this.sliderImages)
      }
    }
  },
  components: {
    slider: slider,
    discList: discList,
    scroll: scroll
  }
}
</script>

<style scoped>
  .recommend {
    position: absolute;
    top: 120px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .item {
    width: 100%;
    display: inline-block;
  }
</style>
