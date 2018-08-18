<template>
    <div class="scroll" ref="scroll">
      <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
  props: {
    data: {},
    probeType: {
      type: Number,
      default: 1
    },
    timeout: {
      type: Number,
      default: 20
    }
  },
  methods: {
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollToElement (element) {
      this.scroll && this.scroll.scrollToElement(element, 500)
    }
  },
  mounted () {
    this.scroll = new BScroll(this.$refs.scroll, {
      click: true,
      probeType: this.probeType
    })
    if (this.probeType !== 1) {
      this.scroll.on('scroll', (pos) => {
        this.$emit('scroll', pos.y)
      })
      this.scroll.on('scrollEnd', () => {
        if (this.scroll.y <= this.scroll.maxScrollY) {
          this.$emit('scrollToEnd')
        }
      })
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.timeout)
    }
  }
}
</script>

<style scoped>
  .scroll {
    width: 100%;
    height: 100%;
  }
</style>
