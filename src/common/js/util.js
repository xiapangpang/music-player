//定义一个洗牌函数
function getRandomInt(min, max) { //返回min到max的随机整数，包含min和max
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// export function shuffle(arr) {
//   for(let i = 0; i < arr.length; i++) {
//     //从0-i中取一个索引，其对应的索引值和arr[i]做交换，即可打乱数组
//     let j = getRandomInt(0, i)
//     let temp
//     temp = arr[i]
//     arr[i] = arr[j]
//     arr[j] = temp
//   }
//   return arr
// }

//上面的写法会改变arr，会对传入的list有影响，要slice一个修改
export function shuffle(arr) {
  let _arr = arr.slice()
  for(let i = 0; i < _arr.length; i++) {
    //从0-i中取一个索引，其对应的索引值和arr[i]做交换，即可打乱数组
    let j = getRandomInt(0, i)
    let temp
    temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }
  return _arr
}

//对某一个函数做节流，返回一个新函数，新函数延迟执行要节流的函数
export function debounce(func, delay) {
  let timer
  return function (...args) { //返回一个函数，函数柯里化(调用一个函数会返回另一个函数)
    if(timer) { //有timer 说明已被执行
      clearTimeout(timer)
    }
    timer = setTimeout(() => { //延迟执行func
      func.apply(this, args)
    }, delay)
  }
}