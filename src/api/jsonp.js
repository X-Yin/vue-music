import originJsonp from 'jsonp'
/* eslint-disable */
export default function jsonp (url, params, options) {
  let Url = getUrl(url, params)
  return new Promise((resolve) => {
    originJsonp(Url, options, (err, data) => {
      resolve(data)
    })
  })
}
function getUrl (url, params) {
  let originUrl = url.indexOf('?') > 0 ? url : url + '?'
  let keys = Object.keys(params)
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      originUrl += keys[i] + '=' + params[keys[i]]
    } else {
      originUrl += keys[i] + '=' + params[keys[i]] + '&'
    }
  }
  return originUrl
}
