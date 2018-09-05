import shuffle from '../api/shuffle'
import {deleteSearchHistory, clearSearchHistory} from '../api/cache'
import storage from 'good-storage'

function findIndex (item, lists) {
  return lists.findIndex((list) => {
    return item.url === list.url
  })
}
const actions = {
  changeMode ({commit, state}) {
    if (state.mode === 'sequence') {
      commit('setMode', 'loop')
      let playList = []
      playList.push(state.playList[state.currentIndex])
      commit('setPlayList', playList)
      commit('setCurrentIndex', 0)
    } else if (state.mode === 'loop') {
      commit('setMode', 'random')
      let list = shuffle(state.sequenceList)
      let song = state.playList[state.currentIndex]
      let index = findIndex(song, list)
      commit('setPlayList', list)
      commit('setCurrentIndex', index)
    } else if (state.mode === 'random') {
      commit('setMode', 'sequence')
      let list = state.sequenceList.slice()
      let song = state.playList[state.currentIndex]
      let index = findIndex(song, list)
      commit('setPlayList', list)
      commit('setCurrentIndex', index)
    }
  },
  addOneSong ({commit, state}, song) {
    let list = state.sequenceList.slice()
    list.unshift(song)
    let list1 = state.playList.slice()
    list1.unshift(song)
    commit('setSequenceList', list)
    commit('setPlayList', list1)
    commit('setCurrentIndex', 0)
    commit('setPlayingState', true)
  },
  deleteOneSong ({commit, state}, song) {
    let list1 = state.sequenceList.slice()
    let index = state.sequenceList.findIndex((item) => {
      return item.songmid === state.playList[state.currentIndex].songmid
    })
    let index1 = list1.findIndex((item) => {
      return item.songmid === song.songmid
    })
    for (let i = index1; i < list1.length; i++) {
      list1[i] = list1[i + 1]
    }
    list1.pop()
    let list2 = state.playList.slice()
    let index2 = list2.findIndex((item) => {
      return item.songmid === song.songmid
    })
    if (state.mode === 'loop') {
      if (index1 === index) {
        if (index1 === list1.length) {
          let song = state.sequenceList[0]
          let list = []
          list.push(song)
          commit('setPlayList', list)
        } else {
          if (state.sequenceList.length === 1) {
            commit('setPlayList', [])
          } else {
            let song = state.sequenceList[index1 + 1]
            let list = []
            list.push(song)
            commit('setPlayList', list)
          }
        }
      } else {
        commit('setPlayList', state.playList)
      }
      commit('setCurrentIndex', 0)
      commit('setSequenceList', list1)
    } else {
      for (let i = index2; i < list2.length; i++) {
        list2[i] = list2[i + 1]
      }
      list2.pop()
      commit('setSequenceList', list1)
      commit('setPlayList', list2)
      if (index2 < state.currentIndex) {
        commit('setCurrentIndex', state.currentIndex - 1)
      } else if (index2 > state.currentIndex) {
        commit('setCurrentIndex', state.currentIndex)
      } else if (index2 === state.currentIndex) {
        if (index2 === list2.length) {
          commit('setCurrentIndex', 0)
        } else {
          commit('setCurrentIndex', state.currentIndex)
        }
      }
    }
  },
  clearSongs ({commit, state}) {
    commit('setSequenceList', [])
    commit('setPlayList', [])
    commit('setCurrentIndex', 0)
  },
  deleteSearchHistory ({commit, state}, query) {
    deleteSearchHistory(query)
    let list = storage.get('searchHistory', [])
    commit('setSearchHistory', list)
  },
  clearSearchHistory ({commit, state}) {
    clearSearchHistory()
    commit('setSearchHistory', [])
  }
}
export default actions
