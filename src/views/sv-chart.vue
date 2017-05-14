<template>
  <div>
    <div class="chart-title">
      <div>总{{dataTypeName}}: {{total}}元</div>
      <div>平均值: {{average}}元/天</div>
    </div>
    <div class="chart-view">
      <div class="chart-wrapper">
        <div id="chart" class="chart">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import datastore from '@/modules/datastore'
export default {
  data() {
    return {}
  },
  props: ['data', 'dataTypeName', 'datesInRange', 'dataType', 'dateUnit'],
  computed: {
    total: function () {
      var total = 0
      for (var i in this.data) {
        total += this.data[i].money
      }
      return total
    },
    average: function () {
      return Math.round(this.total / this.data.length * 100) / 100 || 0
    },
    chartX: function () {
      var arr = []
      for (var i in this.datesInRange) {
        if (this.dateUnit === 'week') arr.push((this.datesInRange[i].getMonth() + 1) + '-' + this.datesInRange[i].getDate())
        else if (this.dateUnit === 'month') arr.push(this.datesInRange[i].getDate())
        else if (this.dateUnit === 'year') arr.push(this.datesInRange[i].month + '月')
      }
      return arr
    }
  },
  watch: {
    data: function () {
      this.refresh()
    }
  },
  methods: {
    refresh() {
      var chartY = this.getDataValuesByDateRange(this.dateUnit)
      var chart = echarts.init(this.$el.querySelector('#chart'))
      chart.setOption({
        grid: [
          {
            left: '14%',
            right: '5%',
            top: '12%',
            bottom: '15%'
          }
        ],
        xAxis: {
          data: this.chartX,
          boundaryGap: false
        },
        yAxis: {
          name: '金额/元'
        },
        series: [{
          name: '金额',
          type: 'line',
          smooth: true,
          data: chartY
        }]
      })
    },
    getDataValuesByDateRange(dateUnit) {
      if (dateUnit === 'week' || dateUnit === 'month') return this.getDataValuesByWeekOrMonth()
      else if (dateUnit === 'year') return this.getDataValuesByYear()
    },
    getDataValuesByWeekOrMonth() {
      var temp, result
      result = new Array(this.datesInRange.length)
      result.fill(0)
      for (var i in this.data) {
        for (var j in this.datesInRange) {
          var month = (this.datesInRange[j].getMonth() + 1) < 10 ? '0' + (this.datesInRange[j].getMonth() + 1) : (this.datesInRange[j].getMonth() + 1)
          var date = this.datesInRange[j].getDate() < 10 ? '0' + this.datesInRange[j].getDate() : this.datesInRange[j].getDate()
          temp = this.datesInRange[j].getFullYear() + '-' + month + '-' + date
          if (this.data[i].date === temp) {
            result[j] += this.data[i].money
          }
        }
      }
      return result
    },
    getDataValuesByYear() {
      var result, temp
      result = new Array(this.datesInRange.length)
      result.fill(0)
      for (var i in this.datesInRange) {
        temp = datastore.getRecordsByYearMonth(this.datesInRange[i].year, this.datesInRange[i].month, this.dataType)
        for (var j in temp) {
          result[i] += temp[j].money
        }
      }
      return result
    }
  },
  created: function () {
    this.$on('refresh', this.refresh)
  },
  mounted: function () {
    this.refresh()
  }
}
</script>

<style lang="scss" scoped>
.chart-title {
  background: #fff;
  padding: .2rem;
  display: flex;
  div {
    margin: 0;
    padding: .02rem .1rem;
    text-align: left;
  }
}

.chart-view {
  .chart-wrapper {
    background: #fff;
    .chart {
      min-height: 1.2rem;
      width: 100%;
      height: 5rem;
    }
  }
}
</style>
