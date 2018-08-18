import jsonp from './jsonp'
export default function getHotKeys () {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  let params = {
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
  let options = {
    param: 'jsonpCallback',
    name: 'hotSearchKeysmod_top_search'
  }
  return jsonp(url, params, options)
}
