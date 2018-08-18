<template>
    <div class="progress-bar">
      <div class="current-time">{{currentTime | formatTime}}</div>
      <div class="progress-bg" ref="bg" @click="changeTime($event)" @touchstart="touchstart($event)" @touchmove="touchmove($event)" @touchend="touchend($event)">
        <div class="progress-btn" ref="btn">
          <div class="progress-inner"></div>
        </div>
        <div class="progress" ref="progress"></div>
      </div>
      <div class="duration">{{currentSong.duration | formatTime}}</div>
    </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
export default {
  props: {
    currentTime: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      startX: 0,
      pageX: 0,
      moveFlag: false
    }
  },
  filters: {
    formatTime (time) {
      let minute = Math.floor(time / 60) + ''
      let second = Math.floor(time % 60) + ''
      let str = '00'
      let m = str.substr(minute.length) + minute
      let s = str.substr(second.length) + second
      return m + ':' + s
    }
  },
  methods: {
    seekPos () {
      let percent = this.currentTime / this.currentSong.duration
      let width = this.$refs.bg.offsetWidth
      this.$refs.btn.style.left = `${width * percent}px`
      this.$refs.progress.style.width = `${width * percent}px`
    },
    changeTime (e) {
      let left = this.$refs.bg.offsetLeft
      let width = this.$refs.bg.offsetWidth
      let x = e.pageX
      let percent = (x - left) / width
      let time = this.currentSong.duration * percent
      this.$emit('changeTime', time)
    },
    touchstart (e) {
      let inner = document.getElementsByClassName('progress-inner')[0]
      let btn = document.getElementsByClassName('progress-btn')[0]
      if (e.target === inner || e.target === btn) {
        this.startX = e.touches[0].pageX
        this.moveFlag = true
      }
    },
    touchmove (e) {
      if (this.moveFlag) {
        let left = this.$refs.bg.offsetLeft
        let right = left + this.$refs.bg.offsetWidth
        let x = e.touches[0].pageX
        if (x <= right && x >= left) {
          this.pageX = x
          this.$refs.btn.style.left = x - left + 'px'
          this.$refs.progress.style.width = x - left + 'px'
        }
      }
    },
    touchend (e) {
      if (this.moveFlag) {
        let left = this.$refs.bg.offsetLeft
        let width = this.$refs.bg.offsetWidth
        let percent = (this.pageX - left) / width
        let time = this.currentSong.duration * percent
        this.$emit('changeTime', time)
        this.moveFlag = false
      }
    }
  },
  watch: {
    currentTime (value) {
      let percent = value / this.currentSong.duration
      let width = this.$refs.bg.offsetWidth
      if (!this.moveFlag) {
        this.$refs.btn.style.left = `${width * percent}px`
        this.$refs.progress.style.width = `${width * percent}px`
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentSong'
    ])
  }
}
</script>

<style scoped>
  .progress-bar {
    width: 100%;
    height: 50px;
    display: flex;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .current-time, .duration {
    flex: 0 80px;
    color: white;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  .progress-bg {
    flex: 1;
    background-color: rgba(255,255,255,0.2);
    height: 4px;
    margin-top: 23px;
    position: relative;
  }
  .progress-btn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    overflow: hidden;
    margin-left: -10px;
    top: -8px;
    position: absolute;
    z-index: 2;
  }
  .progress-inner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #ffcd32;
    margin: 3px;
  }
  .progress {
    width: 0;
    height: 4px;
    background-color: #ffcd32;
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
