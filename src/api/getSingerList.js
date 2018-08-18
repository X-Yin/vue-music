import jsonp from './jsonp'
export default function getSingerList (singermid) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  let params = {
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: singermid,
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1
  }
  let options = {
    param: 'jsonpCallback',
    name: 'MusicJsonCallbacksinger_track'
  }
  return jsonp(url, params, options)
}
