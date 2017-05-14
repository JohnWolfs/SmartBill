<template>
  <div id="chartpage">
    <mu-appbar class="titlebar">
      <div class="title" @click="changeDataType">{{ dataTypeName }}</div>
    </mu-appbar>
    <div class="daterange-selector">
      <div class="week item" :class="{'active': dateUnit === 'week'}" @click="changeDateUnit('week')">周</div>
      <div class="month item" :class="{'active': dateUnit === 'month'}" @click="changeDateUnit('month')">月</div>
      <div class="year item" :class="{'active': dateUnit === 'year'}" @click="changeDateUnit('year')">年</div>
    </div>
    <div class="topbar">
      <div class="item" v-for="item in dateRanges" :class="{'active': dateRange.id === item.id}" @click="changeDateRange(item)">
        {{item.name}}
      </div>
    </div>
    <div class="common-scroll-content">
      <chartview :data="records" :dataTypeName="dataTypeName" :datesInRange="datesInRange" :dataType="dataType" :dateUnit="dateUnit" ref="chart"></chartview>
      <rankview :data="records" :dataTypeName="dataTypeName"></rankview>
    </div>
  </div>
</template>

<script>
import utils from '@/modules/utils'
import datastore from '@/modules/datastore'
import rankview from '@/views/sv-rank'
import chartview from '@/views/sv-chart'
const DateRange = {
  'week': [{ id: 0, name: '本周' }, { id: -1, name: '上周' }],
  'month': [{ id: 0, name: '本月' }, { id: -1, name: '上月' }],
  'year': [{ id: 0, name: '今年' }, { id: -1, name: '上年' }]
}
export default {
  name: 'chartpage',
  components: {
    'rankview': rankview,
    'chartview': chartview
  },
  data() {
    return {
      dataType: 'payment', // 收支类型
      dateUnit: 'week', // 日期范围单位
      dateRange: DateRange['week'][0] // 当前的日期范围
    }
  },
  computed: {
    dataTypeName: function () {
      return this.dataType === 'payment' ? '支出' : '收入'
    },
    dateRanges: function () {
      return DateRange[this.dateUnit]
    },
    records: function () { // 日期范围内的所有记录
      return this.getRecordsByDateRange(this.dateUnit)
    },
    datesInRange: function () { // 日期范围数据 作为图表的x轴依赖数据
      var now = new Date()
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      if (this.dateUnit === 'week') {
        return utils.getDatesByWeek(this.dateRange.id)
      } else if (this.dateUnit === 'month') {
        return utils.getDatesByMonth(year, month + this.dateRange.id)
      } else if (this.dateUnit === 'year') {
        return utils.getMonthsByYear(year + this.dateRange.id)
      } else return []
    }
  },
  methods: {
    changeDataType() {
      this.dataType = this.dataType === 'payment' ? 'income' : 'payment'
    },
    changeDateUnit(tab) {
      if (this.dateUnit === tab) return
      this.dateUnit = tab
      this.dateRange = DateRange[this.dateUnit][0]
    },
    changeDateRange(tab) {
      if (this.dateRange === tab) return
      this.dateRange = tab
    },
    refreshChart() {
      this.$refs.chart.$emit('refresh')
    },
    getRelatedDataForWeek() {
      var min = { year: this.datesInRange[0].getFullYear(), month: this.datesInRange[0].getMonth() + 1 }
      var max = { year: this.datesInRange[this.datesInRange.length - 1].getFullYear(), month: this.datesInRange[this.datesInRange.length - 1].getMonth() + 1 }
      var data = []

      // 一周有可能跨年、跨月，取所有可能的数据组合（以月为单位）
      if (min.year !== max.year) {
        data = data.concat(datastore.getRecordsByYearMonth(min.year, 12, this.dataType)).concat(datastore.getRecordsByYearMonth(max.year, 1, this.dataType))
      } else if (min.month !== max.month) {
        data = data.concat(datastore.getRecordsByYearMonth(min.year, min.month, this.dataType)).concat(datastore.getRecordsByYearMonth(max.year, max.month, this.dataType))
      } else {
        data = data.concat(datastore.getRecordsByYearMonth(min.year, min.month, this.dataType))
      }

      return data
    },
    getRecordsByDateRange(dateUnit) {
      if (dateUnit === 'week') return this.getRecordsByWeek()
      else if (dateUnit === 'month') return this.getRecordsByMonth()
      else if (dateUnit === 'year') return this.getRecordsByYear()
    },
    getRecordsByWeek() {
      return this.getRelatedDataForWeek()
    },
    getRecordsByMonth() {
      return datastore.getRecordsByYearMonth(this.datesInRange[0].getFullYear(), this.datesInRange[0].getMonth() + 1, this.dataType)
    },
    getRecordsByYear() {
      var result = []
      for (var i in this.datesInRange) {
        result = result.concat(datastore.getRecordsByYearMonth(this.datesInRange[i].year, this.datesInRange[i].month, this.dataType))
      }
      return result
    }
  },
  created: function () {
    this.$bus.on('refresh', this.refreshChart)
  },
  activated: function (to, from, next) {
    this.refreshChart()
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/theme.scss";
$barHeight: .7rem;
.mu-appbar.titlebar {
  background: $primaryColor;
  height: $barHeight;
  box-shadow: none;
  .title {
    position: absolute;
    width: 1rem;
    height: $barHeight;
    line-height: $barHeight;
    text-align: center;
    left: 0;
    right: 0;
    top: 0;
    margin: 0 auto;
    &:after {
      content: '';
      width: 0;
      height: 0;
      position: absolute;
      right: -.16rem;
      top: .24rem;
      border-top: .22rem solid #fff;
      border-left: .13rem solid transparent;
      border-right: .13rem solid transparent;
      border-bottom: 0 solid transparent;
    }
  }
}

.daterange-selector {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #63c6ca;
  .item {
    position: relative;
    width: 33.3%;
    color: #fff;
    height: .5rem;
    line-height: .5rem;
    &:first-child {
      border-right: 1px solid #fff;
    }
    &:last-child {
      border-left: 1px solid #fff;
    }
  }
  .item.active {
    background: $primaryColor;
  }
}

.topbar {
  display: flex;
  .item {
    width: 1.4rem;
    height: .5rem;
    line-height: .5rem;
    margin: 0 .2rem;
    color: $lighterFontColor;
    &.active {
      border-bottom: 2px solid #333;
      color: $fontColor;
    }
  }
}

.common-scroll-content {
  top: 1.7rem;
}
</style>
