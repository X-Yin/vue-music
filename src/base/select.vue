<template>
    <div class="select">
      <div class="select-btn">
        <div class="select-left" :class="{'current': showIndex === 0}" @click.stop="selectLeft">{{leftText}}</div>
        <div class="select-right" :class="{'current': showIndex === 1}" @click.stop="selectRight">{{rightText}}</div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    leftText: {
      type: String,
      default: '最近播放'
    },
    rightText: {
      type: String,
      default: '搜索历史'
    }
  },
  data () {
    return {
      showIndex: 0
    }
  },
  methods: {
    selectLeft () {
      this.showIndex = 0
      this.$emit('select', 0)
    },
    selectRight () {
      this.showIndex = 1
      this.$emit('select', 1)
    }
  }
}
</script>

<style scoped>
  .select {
    width: 100%;
    height: 60px;
    padding: 10px;
    box-sizing: border-box;
  }
  .select-btn {
    width: 200px;
    height: 50px;
    border: 1px solid #333;
    margin-left: 50%;
    transform: translateX(-50%);
    display: flex;
  }
  .select-left, .select-right {
    flex: 1;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: rgba(255,255,255,0.3);
    font-size: 13px;
  }
  .select-left.current, .select-right.current {
    background-color: #333;
    color: white;
  }
</style>
