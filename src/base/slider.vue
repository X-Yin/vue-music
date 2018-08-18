<template>
    <div class="slider">
      <ul class="sliders" ref="slider" @touchstart="touchstart($event)" @touchmove="touchmove($event)" @touchend="touchend($event)">
        <slot></slot>
      </ul>
      <div class="dots-wrapper">
        <ul class="dots">
          <li v-for="(item, index) in images" :key="index" class="dot" :class="{'current': currentIndex === index}"></li>
        </ul>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    images: {}
  },
  data () {
    return {
      currentIndex: 0,
      timer: null,
      startX: 0,
      pageX: 0,
      left: 0,
      offset: 0,
      moveFlag: true
    }
  },
  mounted () {
    let length = document.body.offsetWidth
    this.setTransform(length)
  },
  methods: {
    getLeft () {
      return parseInt(this.$refs.slider.style.transform.split('(')[1].split(')')[0])
    },
    setTransition () {
      this.$refs.slider.style.transition = 'all linear 0.5s'
    },
    cancelTransition () {
      this.$refs.slider.style.transition = 'all linear 0s'
    },
    setTransform (offset) {
      this.$refs.slider.style.transform = `translateX(-${offset}px)`
    },
    move () {
      this.timer = setInterval(() => {
        let docWidth = document.body.offsetWidth
        let length = (this.images.length + 2) * docWidth
        let left = this.getLeft()
        this.setTransition()
        let offset = left - docWidth
        this.setTransform(-offset)
        this.currentIndex++
        if (this.currentIndex > this.images.length - 1) {
          this.currentIndex = 0
        }
        setTimeout(() => {
          if (-offset >= length - docWidth) {
            this.cancelTransition()
            this.setTransform(docWidth)
          } else if (offset === 0) {
            this.cancelTransition()
            this.setTransform(length - docWidth)
          }
        }, 500)
      }, 2500)
    },
    touchstart (e) {
      if (this.moveFlag) {
        this.startX = e.touches[0].pageX
        this.left = this.getLeft()
        clearInterval(this.timer)
        this.cancelTransition()
      }
    },
    touchmove (e) {
      if (this.moveFlag) {
        if (this.moveFlag) {}
        this.pageX = e.touches[0].pageX
        this.offset = this.pageX - this.startX
        this.setTransform(-this.left - this.offset)
      }
    },
    touchend (e) {
      if (this.moveFlag) {
        let docWidth = document.body.offsetWidth
        let length = (this.images.length + 2) * docWidth
        let offset = 0
        if (this.offset > 0) {
          offset = this.offset / docWidth < 0.3 ? this.left : this.left + docWidth
        } else if (this.offset <= 0) {
          offset = Math.abs(this.offset) / docWidth < 0.3 ? this.left : this.left - docWidth
        }
        this.setTransition()
        this.setTransform(-offset)
        this.moveFlag = false
        setTimeout(() => {
          if (-offset >= length - docWidth) {
            this.cancelTransition()
            this.setTransform(docWidth)
          } else if (-offset === docWidth) {
            this.cancelTransition()
            this.setTransform(length - docWidth)
          }
          if (this.offset > 0) {
            if (offset !== this.left) {
              if (this.currentIndex === 0) {
                this.currentIndex = this.images.length - 1
              } else {
                this.currentIndex--
              }
            }
          } else if (this.offset <= 0) {
            if (offset !== this.left) {
              if (this.currentIndex === this.images.length - 1) {
                this.currentIndex = 0
              } else {
                this.currentIndex++
              }
            }
          }
          this.moveFlag = true
          this.move()
        }, 500)
      }
    }
  },
  watch: {
    images () {
      if (this.images.length > 0) {
        this.move()
      }
    }
  }
}
</script>

<style scoped>
  .slider {
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .sliders {
    width: 100%;
    white-space: nowrap;
    font-size: 0;
  }
  .dots-wrapper {
    position: absolute;
    width: auto;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
  }
  .dots {
    width: auto;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: #fff;
    margin-left: 15px;
    display: inline-block;
  }
  .dot.current {
    width: 20px;
  }
</style>
