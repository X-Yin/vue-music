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
1. 首页的顶部为一个标题，右上角有个人中心的入口。标题下面是一个导航栏，分别有推荐、歌手、排行、搜索等模块，点击相应的模块可以切换到对应的页面。
2. 推荐页面由轮播图和歌单列表组成，点击对应的歌单可以切换到相应的歌单详情页。
3. 歌手页面由歌手列表组成，点击右边的字母索引可以滚动到对应的歌手区域。
4. 排行页面由榜单列表组成，点击对应的榜单可以切换到对应的榜单详情页。
5. 搜索页面由搜索框，热门搜索，搜索历史等模块组成。在搜索框输入要搜索的内容，搜索结果会在搜索框下部显示。
6. 播放器内核由背景模糊的图片做背景，分别有专辑图片，进度条，歌词，播放器控制按钮等模块。
#### 项目中出现的问题及解决方法
- 页面初始加载完成后无法进行滚动:
由于移动端的滚动这里使用的是better-scroll插件，而歌曲资源是异步获取的，页面初始化完成后，歌曲资源还没有获取，所以这里better-scroll并不能正确的计算元素的高度。解决的办法是：抽象出一个scroll组件，并且传入一个参数data，给data加上一个监听器，当资源异步获取完成后，调用refresh方法，重新计算元素的高度。
