<template>
  <div id="detailpage" class="common-page">
    <div class="common-titlebar">
      Smart账本
    </div>
    <div class="data-selector">
      <div class="date">
        <p class="year">{{currentYear}}年</p>
        <p class="month" @click="showDataPicker">{{currentMonth}}月</p>
      </div>
      <div class="payment">
        <p class="title">支出（元）</p>
        <p class="value">{{sumPayment}}</p>
      </div>
      <div class="income">
        <p class="title">收入（元）</p>
        <p class="value">{{sumIncome}}</p>
      </div>
    </div>
    <div class="common-scroll-content data-list">
      <div v-if="!dataListForShow.length" class="no-data" @click="showARPage">
        <img src="../assets/nodata.png">
        <p>--记录点数据吧--</p>
      </div>
      <div class="date-item" v-for="item in dataListForShow">
        <div class="title">
          <div class="date">{{item.date}} {{item.day}}</div>
          <div class="sum">
            <div v-if="item.payment">支出：{{item.payment}}</div>
            <div v-if="item.income">收入：{{item.income}}</div>
          </div>
        </div>
        <div class="item-list">
          <swipedelete class="record-item" v-for="ritem in item.list" :key="ritem.id" @delete="deleteRecord(ritem)">
            <div class="icon">
              <img :src="require('../assets/icon/' + ritem.tag + '.png')">
            </div>
            <div class="tag-name">{{ritem.remark || ritem.name}}</div>
            <div class="money">{{ritem.type==='payment'? '-':'+'}}{{ritem.money}}</div>
          </swipedelete>
        </div>
      </div>
    </div>
    <datapicker :option="pickerOption" :show="isDataPickerShow" :defaultdata="[currentYear + '年', currentMonth + '月']" @select="selectDate" @close="closeDataPicker">
    </datapicker>
  </div>
</template>

<script>
import datapicker from '@/components/datapicker'
import swipedelete from '@/components/swipe-delete'
import datastore from '@/modules/datastore'
const Days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
var years = []
var months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
var initYears = function () {
  var curYear = new Date().getFullYear()
  for (var i = curYear - 10; i <= curYear + 10; i++) {
    years.push(i + '年')
  }
}
initYears()
export default {
  name: 'detailpage',
  components: {
    'datapicker': datapicker,
    'swipedelete': swipedelete
  },
  data() {
    return {
      currentYear: 1990,
      currentMonth: 1,
      dataList: [],
      pickerOption: {
        centerText: '选择日期',
        datas: [
          {
            width: '100%',
            textAlign: 'center',
            values: years
          },
          {
            width: '100%',
            textAlign: 'center',
            values: months
          }
        ]
      },
      isDataPickerShow: false
    }
  },
  computed: {
    sumPayment: function () {
      return this.getSumOfData(this.dataList).payment
    },
    sumIncome: function () {
      return this.getSumOfData(this.dataList).income
    },
    dataListForShow: function () {
      var curdate, payment, income
      var list = []
      var predate = ''
      for (var item of this.dataList) {
        if (item.date !== predate) {
          if (curdate) {
            curdate.payment = payment
            curdate.income = income
          }
          payment = 0
          income = 0
          curdate = { list: [] }
          curdate.day = Days[new Date(item.date).getDay()]
          curdate.date = item.date
          curdate.list.push(item)
          if (item.type === 'payment') payment += item.money
          if (item.type === 'income') income += item.money
          list.unshift(curdate)
          predate = item.date
        } else {
          curdate.list.push(item)
          if (item.type === 'payment') payment += item.money
          if (item.type === 'income') income += item.money
        }
      }
      if (curdate) {
        curdate.payment = payment
        curdate.income = income
      }
      return list
    }
  },
  methods: {
    getDatasByYearMonth: function (year, month) {
      return datastore.getRecordsByYearMonth(year, month) || []
    },
    getSumOfData: function (data) {
      var payment = 0
      var income = 0
      for (var item of data) {
        if (item.type === 'payment') payment += item.money
        if (item.type === 'income') income += item.money
      }
      return { payment: payment, income: income }
    },
    showDataPicker: function () {
      this.isDataPickerShow = true
    },
    closeDataPicker: function () {
      this.isDataPickerShow = false
    },
    selectDate: function (date) {
      var year = parseInt(date[0])
      var month = parseInt(date[1])
      this.currentYear = year
      this.currentMonth = month
      this.dataList = this.getDatasByYearMonth(year, month) || []
      this.$store.commit('setDatePicker', year + '-' + (month < 10 ? '0' : '') + month + '-01')
    },
    refreshData: function () {
      this.dataList = this.getDatasByYearMonth(this.currentYear, this.currentMonth)
    },
    deleteRecord: function (item) {
      var year = parseInt(item.date.split('-')[0])
      var month = parseInt(item.date.split('-')[1])
      datastore.removeRecordById(year, month, item.id)
      this.dataList = this.getDatasByYearMonth(this.currentYear, this.currentMonth)
    },
    showARPage: function () {
      this.$bus.emit('showARPage')
    }
  },
  created: function () {
    var date = new Date()
    this.currentYear = date.getFullYear()
    this.currentMonth = date.getMonth() + 1
    this.dataList = this.getDatasByYearMonth(this.currentYear, this.currentMonth)
    this.$bus.on('refresh', this.refreshData)
  },
  activated: function() {
    this.refreshData()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/theme.scss';
@import '../assets/common.scss';
$itemHeight: .6rem;
#detailpage {
  .data-selector {
    display: flex;
    border-bottom: 1px solid $borderColor;
    background: #fff;
    height: 1rem;
    p {
      margin: 0;
    }
    .date {
      width: 20%;
      .year {
        padding: 0 .06rem 0 .06rem;
        height: .4rem;
        line-height: .46rem;
        color: $lighterFontColor;
      }
      .month {
        height: .6rem;
        line-height: .6rem;
        font-size: 18px;
        border-right: 1px solid $borderColor;
        @include fontsizeMedia(26px);
        &:after {
          content: '';
          width: 0;
          border-top: .16rem solid #000;
          border-left: .08rem solid transparent;
          border-right: .08rem solid transparent;
          display: inline-block;
          margin-left: .03rem;
        }
      }
    }
    .payment {
      width: 40%;
      text-align: left;
      .title {
        padding: 0 0 0 .6rem;
        height: .4rem;
        line-height: .46rem;
        color: $lighterFontColor;
      }
      .value {
        height: .6rem;
        line-height: .6rem;
        padding: 0 .6rem;
        font-size: 18px;
        @include fontsizeMedia(26px);
      }
    }
    .income {
      width: 40%;
      text-align: left;
      .title {
        padding: 0 0 0 .6rem;
        height: .4rem;
        line-height: .46rem;
        color: $lighterFontColor;
      }
      .value {
        height: .6rem;
        line-height: .6rem;
        padding: 0 .6rem;
        font-size: 18px;
        @include fontsizeMedia(26px);
      }
    }
  }
  .data-list {
    top: 1.7rem;
    .date-item {
      background: #fff;
      .title {
        display: flex;
        justify-content: space-between;
        background: $darkerAssistantColor;
        color: #666;
        padding: .1rem .2rem;
        .sum {
          display: flex;
          div {
            margin-left: .1rem;
          }
        }
      }
      .item-list {
        margin: 0;
        padding: 0;
        overflow: hidden;
        .record-item {
          .icon {
            width: $itemHeight;
            height: $itemHeight;
            background: $darkerAssistantColor;
            border-radius: $itemHeight/2;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: .3rem;
            }
          }
          .tag-name {
            line-height: $itemHeight;
            flex: 1;
            text-align: left;
            padding-left: .2rem;
          }
          .money {
            line-height: $itemHeight;
          }
          &:last-child {
            .tag-name {
              border: 0;
            }
            .money {
              border: 0;
            }
          }
        }
      }
    }
  }
  .no-data {
    height: 3rem;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    margin: 0 auto;
    margin-top: -1.8rem;
    img {
      height: 3rem;
    }
    p {
      font-size: 16px;
      margin: 0;
      @include fontsizeMedia(26px);
    }
  }
}
</style>
