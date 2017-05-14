<template>
  <div class="calculator">
    <div class="header">
      <div class="remark">
        <div class="remark-title">备注:</div>
        <input type="text" v-model="remark">
      </div>
      <div class="result">
        ￥{{ resultText }}
      </div>
    </div>
    <div class="body">
      <table>
        <tr>
          <td @click="addExpression">7</td>
          <td @click="addExpression">8</td>
          <td @click="addExpression">9</td>
          <td class="ch date">
            <div class="today" v-if="date === today">今天</div>
            <mu-date-picker :fullWidth="true" :underlineShow="false" class="datepicker" v-model="date" @change="onDateChange" :style="{opacity: date === today? 0 : 1}"/>
          </td>
        </tr>
        <tr>
          <td @click="addExpression">4</td>
          <td @click="addExpression">5</td>
          <td @click="addExpression">6</td>
          <td @click="addExpression">+</td>
        </tr>
        <tr>
          <td @click="addExpression">1</td>
          <td @click="addExpression">2</td>
          <td @click="addExpression">3</td>
          <td @click="addExpression">-</td>
        </tr>
        <tr>
          <td @click="addExpression">.</td>
          <td @click="addExpression">0</td>
          <td @click="reduceExpression" class="ch">X</td>
          <td class="ch complete" @click="complete">{{ completeText }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
const expressionLimitLength = 20
export default {
  name: 'calculator',
  data: function () {
    return {
      remark: '',
      resultText: '0',
      date: ''
    }
  },
  computed: {
    result: function () {
      return Math.abs(parseFloat(this.resultText))
    },
    hasOperator: function () {
      return this.resultText.indexOf('+', 1) !== -1 || this.resultText.indexOf('-', 1) !== -1
    },
    completeText: function () {
      return this.hasOperator ? '=' : '完成'
    },
    today: function() {
      var date = new Date()
      return date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate()
    }
  },
  methods: {
    complete: function () {
      if (this.hasOperator) this.calculate()
      else this.$emit('complete', this.result, this.remark, this.getDate())
    },
    addExpression: function (e) {
      var expression = e.target.innerText
      var lastchar = this.resultText[this.resultText.length - 1]
      var ifAdd = true
      if (this.resultText.length >= expressionLimitLength) return
      if (this.resultText === '0' && expression !== '.' && expression !== '+' && expression !== '-') this.resultText = ''
      if ((expression === '+' || expression === '-')) {
        if (lastchar === '+' || lastchar === '-') this.reduceExpression()
        if (this.hasOperator) {
          this.calculate()
        }
      }
      if (expression === '.') {
        if (lastchar === '.') this.reduceExpression()
        if (this.ifContainDots()) ifAdd = false
      }
      if (ifAdd) this.resultText += expression
    },
    reduceExpression: function (e) {
      var res = this.resultText.substr(0, this.resultText.length - 1)
      this.resultText = res === '' ? '0' : res
    },
    calculate: function () {
      var i = this.resultText.indexOf('-') === 0 ? 1 : 0
      var operator = this.resultText.match(/[+-]/g)[i]
      var oIndex = this.resultText.indexOf(operator, 1)
      var expression1 = parseFloat(this.resultText.substr(0, oIndex)) || 0
      var expression2 = parseFloat(this.resultText.substr(oIndex + 1, this.resultText.length)) || 0

      if (this.resultText.split(operator).length < 2) return
      if (operator === '+') this.resultText = (expression1 + expression2).toString()
      if (operator === '-') this.resultText = (expression1 - expression2).toString()
    },
    ifContainDots: function () {
      var expression = ''
      if (this.hasOperator) {
        this.resultText.replace(/[+-]/g, function (m, k, i) {
          if (i > 0) expression = this.resultText.substr(i + 1, this.resultText.length)
        })
        return expression.indexOf('.') !== -1
      } else {
        return this.resultText.indexOf('.') !== -1
      }
    },
    getDate: function () {
      var now = new Date()
      var month = now.getMonth() + 1
      var date = now.getDate()
      month = month < 10 ? ('0' + month) : month
      date = date < 10 ? ('0' + date) : date
      var today = now.getFullYear() + '-' + month + '-' + date
      return this.date || today
    },
    onDateChange: function (date) {
      this.$store.commit('setDatePicker', date)
    }
  },
  mounted: function () {
    this.date = this.$store.state.datePicker || this.today
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/theme.scss';
@import '../assets/common.scss';
$headerHeight: .6rem;
$buttonHeight: .86rem;
.calculator {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $darkerAssistantColor;
  .header {
    display: flex;
    justify-content: space-between;
    height: $headerHeight;
    border-top: 1px solid $borderColor;
    padding: 0 .2rem;
    box-sizing: border-box;
    .remark {
      display: flex;
      flex: 1;
      .remark-title {
        font-size: 16px;
        color: #333;
        line-height: $headerHeight;
        @include fontsizeMedia(22px);
      }
      input {
        border: 0;
        box-shadow: none;
        background: inherit;
        outline: 0;
        flex: 1;
        width: .6rem;
        color: $lighterFontColor;
        font-size: 16px;
        @include fontsizeMedia(22px);
      }
    }
    .result {
      line-height: $headerHeight;
      font-size: 18px;
      @include fontsizeMedia(28px);
    }
  }
  .body {
    table {
      width: 100%;
      border-collapse: collapse;
      height: $buttonHeight * 4;
      tr {
        border-top: 1px solid $borderColor;
      }
      td {
        width: 25%;
        text-align: center;
        border-right: 1px solid $borderColor;
        height: $buttonHeight;
        font-size: 26px;
        @include fontsizeMedia(38px);
        &:nth-child(4n) {
          border-right: 0;
        }
        .today {
          position: absolute;
          width: 100%;
          height: .6rem;
          line-height: .6rem;
          top: 50%;
          margin-top: -.3rem;
        }
      }
      td.ch {
        font-size: 18px;
        @include fontsizeMedia(32px);
      }
      td.complete {
        background: $lighterPrimaryColor;
      }
      td.date {
        position: relative;
      }
    }
  }
}
</style>
