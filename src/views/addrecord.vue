<template>
  <mu-popup position="bottom" popupClass="addrecord-page" :open="isShow" @close="close">
    <mu-appbar class="titlebar">
      <div class="title" @click="changeRecordType">{{ recordTypeName }}</div>
      <mu-flat-button slot="right" label="取消" color="white" @click="close" />
    </mu-appbar>
    <div class="list-wrapper" :class="{shrink: isCalculatorShow}" ref="listWrapper">
      <ul id="tag-list" ref="list">
        <li v-for="item in typeList" @click="selectTag($event, item.id)" :class="{'selected': (item.id === selectedTag)}">
          <div class="icon">
            <img :src="require('../assets/icon/' + item.id + '.png')">
          </div>
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
    <calculator v-if="isCalculatorShow" @complete="addRecord"></calculator>
  </mu-popup>
</template>

<script>
import datastore from '@/modules/datastore'
import recordtype from '@/modules/recordtype'
const calculator = resolve => {
  require.ensure(['@/components/calculator'], () => {
    resolve(require('@/components/calculator'))
  })
}
export default {
  components: {
    'calculator': calculator
  },
  props: ['show'],
  data() {
    return {
      recordType: 'payment',
      isTypeSelectorShow: false,
      isCalculatorShow: false,
      selectedTag: ''
    }
  },
  methods: {
    close() {
      this.isShow = false
      this.isCalculatorShow = false
      this.$emit('close')
    },
    selectTag(e, id) {
      var ctarget = e.currentTarget
      this.showCalculator()
      setTimeout(() => {
        var posy = ctarget.offsetTop
        var height = this.$refs.list.offsetHeight
        var itemHeight = ctarget.offsetHeight
        var distance = posy - this.$refs.list.scrollTop
        var distance2 = height - itemHeight
        this.selectedTag = id
        if (distance + itemHeight > height) this.$refs.list.scrollTop = posy - distance2
        if (distance < 0) this.$refs.list.scrollTop = posy - 10
      }, 0)
    },
    showCalculator() {
      this.isCalculatorShow = true
    },
    hideCalculator() {
      this.isCalculatorShow = false
    },
    changeRecordType() {
      this.recordType = this.recordType === 'payment' ? 'income' : 'payment'
      this.hideCalculator()
    },
    addRecord(value, remark, date) {
      this.hideCalculator()
      if (value <= 0) return
      datastore.addRecord(this.recordType, this.selectedTag, this.getTagName(this.recordType, this.selectedTag), remark, value, date)
      this.close()
    },
    getTagName: function (type, id) {
      if (type === 'payment') return recordtype.payTypes[id].name
      else return recordtype.incomeTypes[id].name
    }
  },
  computed: {
    isShow: function () {
      return this.show
    },
    recordTypeName: function () {
      return this.recordType === 'payment' ? '支出' : '收入'
    },
    typeList: function () {
      var result = []
      var origin = this.recordType === 'payment' ? recordtype.payTypes : recordtype.incomeTypes
      for (var i in origin) {
        result.push(origin[i])
      }
      return result
    }
  }
}
</script>
<style lang="scss">
@import "../assets/theme.scss";
@import "../assets/common.scss";
.mu-popup.addrecord-page {
  width: 100%;
  top: 0;
  .mu-date-picker.datepicker {
    .mu-text-field {
      margin: 0;
      display: flex;
      align-items: center;
      min-height: auto;
      height: 100%;
      .mu-text-field-content {
        padding: 0;
        input {
          text-align: center;
          height: 100%;
          @include fontsizeMedia(22px);
        }
        .mu-text-field-hint {
          text-align: center;
          width: 100%;
          font-size: 18px;
          @include fontsizeMedia(22px);
        }
      }
    }
  }
}

.mu-calendar {
  .mu-date-display {
    background: $primaryColor;
  }
  .mu-day-button-bg {
    background: $primaryColor;
  }
  .mu-flat-button-primary {
    color: $primaryColor;
  }
  .mu-year-button.selected .mu-year-button-text {
    color: $primaryColor;
  }
  .mu-day-button.now {
    line-height: 26px;
  }
  .mu-day-button.now .mu-day-button-text {
    color: $primaryColor;
    font-size: 18px;
    @include fontsizeMedia(22px);
  }
  .mu-day-button.hover.now .mu-day-button-text,
  .mu-day-button.selected .mu-day-button-text {
    color: #fff;
  }
}
</style>
<style lang="scss" scoped>
@import "../assets/theme.scss";
@import "../assets/common.scss";
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

.list-wrapper {
  position: absolute;
  top: $barHeight;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 .3rem;
  #tag-list {
    list-style-type: none;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    overflow: auto;
    height: 100%;
    &::-webkit-scrollbar {
      display: none;
    }
    li {
      width: 25%;
      height: 1.45rem;
      text-align: center;
      margin: .2rem 0;
      .icon {
        width: .8rem;
        height: .8rem;
        background: #eee;
        border-radius: .4rem;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: .3rem;
        }
      }
      p {
        margin: .2rem;
        @include fontsizeMedia(22px);
      }
    }
    li.selected {
      .icon {
        background: $lighterPrimaryColor;
      }
    }
  }
}

.list-wrapper.shrink {
  bottom: 4.04rem;
}
</style>
