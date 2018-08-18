<template>
    <div class="disc-list">
      <div class="main-title">热门歌单推荐</div>
      <ul class="list">
        <li class="list-item" v-for="(item, index) in songList" :key="index" @click="selectItem(item)">
          <div class="image">
            <img style="width: 100%" v-lazy="item.imgurl">
          </div>
          <div class="description">
            <div class="title">{{item.creator.name}}</div>
            <div class="text">{{item.dissname}}</div>
          </div>
        </li>
      </ul>
    </div>
</template>

<script type="text/ecmascript-6">
import getSongList from '../api/getSongList'
import {mapMutations} from 'vuex'
export default {
  data () {
    return {
      songList: []
    }
  },
  created () {
    getSongList().then((res) => {
      this.songList = res.data.list
      this.$emit('list', this.songList)
    })
  },
  methods: {
    selectItem (item) {
      this.setDisc(item)
      this.$router.push(`/recommend/${item.dissid}`)
    },
    ...mapMutations([
      'setDisc'
    ])
  }
}
</script>

<style scoped>
  .main-title {
    text-align: center;
    margin: 25px 0 15px 0;
    color: #ffcd32;
    font-weight: 700;
  }
  .list-item {
    width: 100%;
    box-sizing: border-box;
    height: 100px;
    padding: 20px 20px 20px 30px;
  }
  .image {
    width: 60px;
    height: 60px;
    display: inline-block;
    vertical-align: top;
  }
  .description {
    display: inline-block;
    vertical-align: top;
    margin-left: 30px;
    line-height: 30px;
  }
  .title {
    color: white;
  }
  .text {
    color: #ccc;
    font-size: 12px;
  }
</style>
