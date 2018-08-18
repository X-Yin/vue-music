<template>
  <transition name="popdown">
    <div class="popup" v-show="showF">
      <div class="wrapper">
        <div class="icon"></div>
        <div class="text">一首歌已经成功添加到歌单</div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      showF: false
    }
  },
  methods: {
    show () {
      this.showF = true
      setTimeout(() => {
        this.showF = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
  .popup {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 50px;
    background-color: #666;
    z-index: 5;
  }
  .wrapper {
    width: 100%;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url('/static/image/checkNumber.png');
    background-size: 20px;
    background-repeat: no-repeat;
    border-radius: 50%;
    vertical-align: middle;
  }
  .text {
    display: inline-block;
    color: white;
    margin-left: 5px;
    vertical-align: middle;
  }
  .popdown-enter-active, .popdown-leave-active {
    transition: all linear 0.3s;
  }
  .popdown-enter, .popdown-leave-to {
    transform: translateY(-100%);
  }
</style>
