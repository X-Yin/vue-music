export default function shuffle (list) {
  let _arr = list.slice()
  for (let i = 1; i < list.length; i++) {
    let t = getRandomInt(0, i)
    let _arr1 = _arr[i]
    _arr[i] = _arr[t]
    _arr[t] = _arr1
  }
  return _arr
}
function getRandomInt (a, b) {
  return Math.floor(a + Math.random() * (b - a))
}
