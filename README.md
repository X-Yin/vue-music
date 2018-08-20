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
- 页面初始加载完成后无法进行滚动：

由于移动端的滚动这里使用的是better-scroll插件，而歌曲资源是异步获取的，页面初始化完成后，歌曲资源还没有获取，所以这里better-scroll并不能正确的计算元素的高度。解决的办法是，抽象出一个scroll组件，并且传入一个参数data，给data加上一个监听器，当资源异步获取完成后，调用refresh方法，重新计算元素的高度

- 歌曲的播放进度与歌词滚动不同步

这里歌词的滚动进度使用的是插件lyric-parser，它在初始化歌词对象以后会立即添加一个计时器，但是这个时候歌曲的播放地址可能还没有获取到，导致出现歌词已经开始滚动，但是歌曲还没有开始播放的问题。解决的办法是，audio标签在当浏览器能够开始播放指定的音频/视频时，发生 canplay 事件，可以为这个事件添加一个方法，当触发canplay事件的时候再获取歌词，这样在歌曲的播放地址获取到以后，才会获取歌词的数据。

- 在播放模式改变的时候，歌曲的播放进度会从头开始

在播放模式改变的时候，相应的播放列表playlist也会发生改变，这个时候currentSong也会发生变化，会重新给audio标签赋一次src值，导致歌曲从头开始播放。解决的办法是，为currentSong添加一个监听器，如果newValue的id值和oldValue的id值相同就return。

- 在播放器缩小到mini播放器的时候，歌单的最后一个li标签会被mini播放器挡住

解决的办法是，为playlist添加一个监听器，如果playlist.length !== 0,那么为歌单添加一个bottom值为60px，否则的话bottom值为0。由于这里有多个页面都具有相同的问题，所以采用复用性较高的mixins，在mixins.js中监听playlist， 并触发一个方法handlePlayList，来设置不同页面的bottom值。

- 在个人中心里面点击播放喜爱的歌曲的时候，获取不到歌词

favoriteSongs的数据是缓存在localStorage里面的，获取歌词的接口的方法(getLyric)是在Song类中定义的，而从localStorage里面取出的是普通的对象并不是Song类，所以并没有getLyric这个方法。解决的办法是在点击每一首歌的时候，重新用new Song(item)初始化Song类,为item添加获取歌词的方法。
