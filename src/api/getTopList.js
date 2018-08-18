import jsonp from './jsonp'
export function getTopList () {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  let params = {
    g_tk: 5381,
    uin: 0,
    format: 'jsonp',
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

export function getListDetail (id) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  let params = {
    g_tk: 5381,
    uin: 0,
    format: 'jsonp',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: id
  }
  let options = {
    param: 'jsonpCallback'
  }
  return jsonp(url, params, options)
}
