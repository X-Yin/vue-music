const getters = {
  singer (state) {
    return state.singer
  },
  showFlag (state) {
    return state.showFlag
  },
  currentIndex (state) {
    return state.currentIndex
  },
  sequenceList (state) {
    return state.sequenceList
  },
  playList (state) {
    return state.playList
  },
  currentSong (state) {
    return state.playList[state.currentIndex]
  },
  playingState (state) {
    return state.playingState
  },
  mode (state) {
    return state.mode
  },
  topList (state) {
    return state.topList
  },
  searchHistory (state) {
    return state.searchHistory
  },
  favoriteSongs (state) {
    return state.favoriteSongs
  },
  listenSongs (state) {
    return state.listenSongs
  },
  disc (state) {
    return state.disc
  }
}
export default getters
