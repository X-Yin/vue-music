import axios from 'axios'
export function searchKeyPage (query, p) {
  const url = '/api/search'
  const params = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    p: p,
    remoteplace: 'txt.mqq.all'
  }
  return axios.get(url, {
    params: params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
