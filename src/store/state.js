import {getSearchHistory, getFavoriteSongs, getListenSongs} from '../api/cache'

const state = {
  singer: {},
  showFlag: false,
  currentIndex: 0,
  sequenceList: [],
  playList: [],
  playingState: false,
  mode: 'sequence',
  topList: {},
  searchHistory: getSearchHistory(),
  favoriteSongs: getFavoriteSongs(),
  listenSongs: getListenSongs(),
  disc: {}
}
export default state
