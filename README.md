# vue-music

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
## 项目总结
#### 项目思路
首页的顶部是一个标题区，右上角是一个用户中心的入口。下部是一个导航栏，分别有推荐、歌手、排行、搜索四个模块，点击不同的导航栏的内容，下面的展示区会有不同的变化。推荐页面包含轮播图和歌单列表两部分内容，点击不同的歌单会切换到相应的歌单详情页。歌手页面由歌手列表组成，点击右边的字母导航，会滚动到相应的歌手区。排行页面由榜单列表组成，点击不同的榜单也会切换到相应的榜单详情页。搜索页面包含的内容较多，有搜索框，热门搜索和搜索历史三个模块组成，当搜索框的内容发生变化的时候，底部会出现相应的搜索结果。播放器内核由模糊的图片做背景，有专辑图片，歌词，进度条，控制播放的按钮等组成部分。

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
