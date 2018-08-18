const mutations = {
  setSinger (state, singer) {
    state.singer = singer
  },
  setShowFlag (state, showFlag) {
    state.showFlag = showFlag
  },
  setCurrentIndex (state, currentIndex) {
    state.currentIndex = currentIndex
  },
  setSequenceList (state, sequenceList) {
    state.sequenceList = sequenceList
  },
  setPlayList (state, playList) {
    state.playList = playList
  },
  setPlayingState (state, playingState) {
    state.playingState = playingState
  },
  setMode (state, mode) {
    state.mode = mode
  },
  setTopList (state, topList) {
    state.topList = topList
  },
  setSearchHistory (state, searchHistory) {
    state.searchHistory = searchHistory
  },
  setFavoriteSongs (state, favoriteSongs) {
    state.favoriteSongs = favoriteSongs
  },
  setListenSongs (state, listenSongs) {
    state.listenSongs = listenSongs
  },
  setDisc (state, disc) {
    state.disc = disc
  }
}
export default mutations
