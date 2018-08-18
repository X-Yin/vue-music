<template>
    <div class="search-box">
      <div class="box-wrapper">
        <div class="search-icon"></div>
        <div class="input-wrapper">
          <input class="input" type="text" v-model="query" :placeholder="placeholder" ref="input">
        </div>
        <div class="clear-icon" @click="clear()"></div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌手、歌曲'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    }
  },
  watch: {
    query () {
      this.$emit('query', this.query)
    }
  }
}
</script>

<style scoped>
  .box-wrapper {
    width: 80%;
    margin: 0 auto;
    background-color: #333;
    height: 35px;
    border-radius: 5px;
    display: flex;
    padding: 2.5px 0;
    box-sizing: border-box;
  }
  .search-icon {
    flex: 0 30px;
    height: 30px;
    background-image: url('/static/image/search.png');
    background-repeat: no-repeat;
    background-size: 30px;
    margin-right: 20px;
    margin-left: 10px;
  }
  .input-wrapper {
    flex: 1;
    height: 30px;
  }
  .input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background-color: #333;
    color: #ccc;
    font-size: 13px;
  }
  .clear-icon {
    flex: 0 30px;
    height: 30px;
    background-image: url('/static/image/clear.png');
    background-repeat: no-repeat;
    background-size: 20px;
    background-position: center;
    margin-left: 20px;
  }
</style>
