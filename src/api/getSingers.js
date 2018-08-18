import jsonp from './jsonp'
export function getSingers () {
  let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  let params = {
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp',
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    loginUin: 0
  }
  let options = {
    param: 'jsonpCallback'
  }
  return jsonp(url, params, options)
}
