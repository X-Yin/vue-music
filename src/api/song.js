import axios from 'axios'
import {Base64} from 'js-base64'
export class Song {
  constructor ({songname, singername, albumname, songmid, duration, image, url}) {
    this.songname = songname
    this.singername = singername
    this.albumname = albumname
    this.songmid = songmid
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric () {
    return new Promise((resolve, reject) => {
      getLyric(this.songmid).then((res) => {
        this.lyric = Base64.decode(res.lyric)
        resolve(this.lyric)
      })
    })
  }
}
function getSongsUrl (songs) {
  const url = '/api/getPurlUrl'
  let mids = []
  let types = []
  songs.forEach((song, index) => {
    mids.push(song.songmid)
    types.push(0)
  })
  const urlMid = genUrlMid(mids, types)
  const data = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  }
  return new Promise((resolve, reject) => {
    axios.post(url, {
      comm: data,
      url_mid: urlMid
    }).then((response) => {
      let res = response.data
      let urlMid = res.url_mid
      if (urlMid && urlMid.code === 0) {
        const info = urlMid.data.midurlinfo[0]
        if (info && info.purl) {
          resolve(res)
        }
      }
    })
  })
}
function genUrlMid (mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
let _uid = ''
function getUid () {
  if (_uid) {
    return _uid
  }
  if (!_uid) {
    const t = (new Date()).getUTCMilliseconds()
    _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
  }
  return _uid
}
export function createSong (musicData) {
  return new Song({
    songname: musicData.songname,
    singername: filterSinger(musicData.singer),
    albumname: musicData.albumname,
    songmid: musicData.songmid,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: ''
  })
}
function filterSinger (singers) {
  let ret = []
  singers.forEach((item) => {
    ret.push(item.name)
  })
  return ret.join('/')
}
export function processSongUrl (songs) {
  return getSongsUrl(songs).then((res) => {
    let midUrlInfo = res.url_mid.data.midurlinfo
    midUrlInfo.forEach((info, index) => {
      let song = songs[index]
      song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
    })
    return songs
  })
}
function getLyric (mid) {
  const url = 'api/lyric'
  const data = {
    pcachetime: +new Date(),
    songmid: mid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
