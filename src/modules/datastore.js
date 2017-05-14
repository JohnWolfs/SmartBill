/**
 * 数据存储
 * 以月为key，一个key存储该月里所有的收支记录
 */
import utils from './utils'
class LocalDataStore {
  static instance
  static getInstance() {
    return LocalDataStore.instance || (LocalDataStore.instance = new LocalDataStore())
  }
  addRecord(type, tag, tagname, remark, money, date) {
    var record, year, month, d, datas
    record = {}
    year = parseInt(date.split('-')[0])
    month = parseInt(date.split('-')[1])
    d = parseInt(date.split('-')[2])
    datas = webstorage.retrieveL(year + '' + month) || []
    record.id = '' + year + month + d + new Date().getTime()
    record.type = type
    record.tag = tag
    record.name = tagname
    record.remark = remark
    record.money = money
    record.date = date
    datas.push(record)
    utils.shellsort(datas)
    webstorage.storeL(year + '' + month, datas)
  }
  removeRecordById(year, month, id) {
    var datas = datas = webstorage.retrieveL(year + '' + month) || []
    for (var item of datas) {
      if (item.id === id) datas.splice(datas.indexOf(item), 1)
    }
    webstorage.storeL(year + '' + month, datas)
  }
  getRecordsByYearMonth(year, month, type) {
    if (!year || !month) return
    var arr = webstorage.retrieveL('' + year + month) || []
    var res = []
    if (!type) return arr
    for (var i in arr) {
      if (arr[i].type === type) {
        res.push(arr[i])
      }
    }
    return res.slice(0, res.length)
  }
}

const webstorage = {
  storeL: function (dataName, data) {
    localStorage.setItem(dataName, typeof (data) === 'string' ? data : JSON.stringify(data))
  },
  removeL: function (dataName) {
    localStorage.removeItem(dataName)
  },
  retrieveL: function (dataName) {
    let result = localStorage.getItem(dataName)
    try {
      let parseData = JSON.parse(result)
      if (typeof (parseData) !== 'number') result = parseData
    } catch (e) {
      result = localStorage.getItem(dataName)
    }
    return result
  },
  storeS: function (dataName, data) {
    sessionStorage.setItem(dataName, typeof (data) === 'string' ? data : JSON.stringify(data))
  },
  removeS: function (dataName) {
    sessionStorage.removeItem(dataName)
  },
  retrieveS: function (dataName) {
    let result = sessionStorage.getItem(dataName)
    try {
      let parseData = JSON.parse(result)
      if (typeof (parseData) !== 'number') result = parseData
    } catch (e) {
      result = sessionStorage.getItem(dataName)
    }
    return result
  }
}

export default LocalDataStore.getInstance()
