import jsonp from './jsonp.js'
export default function getSliders () {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  let params = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  }
  let options = {
    param: 'jsonpCallback'
  }
  return jsonp(url, params, options)
}
