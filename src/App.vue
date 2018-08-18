<template>
  <div id="app">
    <v-header></v-header>
    <tab></tab>
    <player></player>
    <keep-alive><router-view/></keep-alive>
  </div>
</template>

<script>
import header from './components/header.vue'
import tab from './components/tab.vue'
import player from './components/player.vue'
export default {
  name: 'App',
  components: {
    vHeader: header,
    tab: tab,
    player: player
  }
}
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  body {
    background-color: #222;
  }
  a {
    text-decoration: none;
  }
  li {
    list-style: none;
  }
</style>
