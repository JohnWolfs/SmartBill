const Util = {
  getDatesByWeek: function (week = 0) {
    var now = new Date()
    var nowTime = now.getTime()
    var day = now.getDay() === 0 ? 7 : now.getDay()
    var oneDayLong = 24 * 60 * 60 * 1000
    var arr = []
    var date
    for (var i = 0; i < 7; i++) {
      date = new Date(nowTime - (day - 1 - i - week * 7) * oneDayLong)
      arr.push(date)
    }
    return arr
  },
  getDatesByMonth: function (year, month) {
    var lastDay = new Date(year, month, 0).getDate()
    var arr = []
    for (var i = 1; i <= lastDay; i++) {
      arr.push(new Date(year, month - 1, i))
    }
    return arr
  },
  getMonthsByYear: function (year) {
    var arr = []
    for (var i = 1; i <= 12; i++) {
      arr.push({
        year: year,
        month: i
      })
    }
    return arr
  },
  shellsort: function (arr) {
    var gap = Math.floor(arr.length / 2)
    while (gap !== 0) {
      for (var i = gap; i < arr.length; i++) {
        var temp = arr[i]
        var j
        for (j = i - gap; j >= 0 && parseInt(arr[j].id) > parseInt(temp.id); j -= gap) {
          arr[j + gap] = arr[j]
        }
        arr[j + gap] = temp
      }
      gap = Math.floor(gap / 2)
    }
    return arr
  }
}

export default Util
