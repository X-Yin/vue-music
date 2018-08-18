import storage from 'good-storage'
export function setSearchHistory (query) {
  let list = storage.get('searchHistory', [])
  let index = list.findIndex((item) => {
    return item === query
  })
  if (index >= 0) {
    for (let i = index; i < list.length; i++) {
      list[i] = list[i + 1]
    }
    list.pop()
    list.unshift(query)
  } else {
    list.unshift(query)
  }
  storage.set('searchHistory', list)
}
export function getSearchHistory () {
  return storage.get('searchHistory', [])
}
export function deleteSearchHistory (query) {
  let list = storage.get('searchHistory', [])
  let index = list.findIndex((item) => {
    return item === query
  })
  for (let i = index; i < list.length; i++) {
    list[i] = list[i + 1]
  }
  list.pop()
  storage.set('searchHistory', list)
}
export function clearSearchHistory () {
  storage.set('searchHistory', [])
}
export function setFavoriteSongs (song) {
  let list = storage.get('favoriteSongs', [])
  let index = list.findIndex((item) => {
    return item.songmid === song.songmid
  })
  if (index >= 0) {
    for (let i = index; i < list.length; i++) {
      list[i] = list[i + 1]
    }
    list.pop()
    list.unshift(song)
  } else {
    list.unshift(song)
  }
  storage.set('favoriteSongs', list)
}
export function getFavoriteSongs () {
  return storage.get('favoriteSongs', [])
}
export function deleteFavoriteSongs (song) {
  let list = storage.get('favoriteSongs', [])
  let index = list.findIndex((item) => {
    return item.songmid === song.songmid
  })
  for (let i = index; i < list.length; i++) {
    list[i] = list[i + 1]
  }
  list.pop()
  storage.set('favoriteSongs', list)
}
export function clearFavoriteSongs () {
  storage.set('favoriteSongs', [])
}
export function getListenSongs () {
  return storage.get('listenSongs', [])
}
export function setListenSongs (song) {
  let list = storage.get('listenSongs', [])
  let index = list.findIndex((item) => {
    return item.songmid === song.songmid
  })
  if (index < 0) {
    list.unshift(song)
  } else {
    for (let i = index; i < list.length; i++) {
      list[i] = list[i + 1]
    }
    list.pop()
    list.unshift(song)
  }
  storage.set('listenSongs', list)
}
