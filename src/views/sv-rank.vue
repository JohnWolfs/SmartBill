<template>
  <div class="rank-view">
    <div class="topbar">{{ dataTypeName }}排行榜</div>
    <div class="rank">
      <div class="rank-item" v-for="ritem in rankData">
        <div class="icon">
          <img :src="require('../assets/icon/' + ritem.tag + '.png')">
        </div>
        <div class="rank-data">
          <div class="title">
            <div class="left">{{ritem.name + ' ' + ritem.percent + '%'}}</div>
            <div class="right">{{ritem.money}}</div>
          </div>
          <div class="progress" :style="{width: ritem.csspercent + '%'}"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: ['data', 'dataTypeName'],
  computed: {
    rankData: function () {
      var tags = {}
      var total = 0
      var res = []
      var most = 0
      var percent
      for (var i in this.data) {
        if (!tags[this.data[i].tag]) {
          tags[this.data[i].tag] = { tag: this.data[i].tag, money: 0, percent: 0 }
          tags[this.data[i].tag].name = this.data[i].name
        }
        tags[this.data[i].tag].money += this.data[i].money
        total += this.data[i].money
      }
      for (var j in tags) {
        percent = Math.round(tags[j].money / total * 10000) / 100
        tags[j].percent = percent
        res.push(tags[j])
        if (percent > most) most = percent
      }
      var rate = 100 / most
      for (var k in tags) {
        tags[k].csspercent = Math.round(tags[k].percent * rate)
      }
      res.sort(function (a, b) {
        if (a.money < b.money) return 1
        if (a.money > b.money) return -1
        return 0
      })
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/theme.scss";
$rankItemHeight: 1rem;
.rank-view {
  .topbar {
    border-top: 1px solid $lighterBorderColor;
    border-bottom: 1px solid $lighterBorderColor;
    text-align: left;
    padding: .1rem .2rem;
  }
  .rank {
    background: #fff;
    .rank-item {
      display: flex;
      height: $rankItemHeight;
      padding: 0 .2rem;
      align-items: center;
      .icon {
        width: .6rem;
        height: .6rem;
        background: $darkerAssistantColor;
        border-radius: .3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: .3rem;
        }
      }
      .rank-data {
        flex: 1;
        text-align: left;
        border-bottom: 1px solid $lighterBorderColor;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        padding-left: .2rem;
        .title {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .progress {
          width: 100%;
          height: .1rem;
          background: $primaryColor;
          border-radius: .05rem;
        }
      }
    }
  }
}
</style>
