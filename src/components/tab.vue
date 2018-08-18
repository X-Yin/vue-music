<template>
    <div class="tab">
      <div class="tab-pane"><router-link to="/recommend">推荐</router-link></div>
      <div class="tab-pane"><router-link to="/singer">歌手</router-link></div>
      <div class="tab-pane"><router-link to="/rank">排行</router-link></div>
      <div class="tab-pane"><router-link to="/search">搜索</router-link></div>
    </div>
</template>

<script type="text/ecmascript-6"></script>

<style scoped>
  .tab {
    width: 100%;
    display: flex;
  }
  .tab-pane {
    flex: 1;
    text-align: center;
  }
  a {
    color: #ccc;
    font-weight: 700;
    padding-bottom: 5px;
  }
  a.router-link-active {
    color: #ffcd32;
    border-bottom: 1px solid #ffcd32;
  }
</style>
