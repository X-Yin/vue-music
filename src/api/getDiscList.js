import axios from 'axios'
export default function getDiscList (dissid) {
  const url = '/api/getCdInfo'
  const data = {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: dissid,
    format: 'jsonp',
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
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
