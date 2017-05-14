
<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <div id="app-tabs">
      <router-link to="/" class="tab" :class="{selected: selectedTab === 'detail'}">
        <div class="tab-wrapper">
          <img :src="selectedTab === 'detail' ? require('./assets/icon-detail-select.png') : require('./assets/icon-detail-unselect.png')">
          <p class="text">明细</p>
        </div>
      </router-link>
      <div class="tab btn-add">
        <img src="./assets/btn-add.png" @click="showARPage">
        <p class="text">记账</p>
      </div>
      <router-link to="/chart" class="tab" :class="{selected: selectedTab === 'chart'}">
        <div class="tab-wrapper">
          <img :src="selectedTab === 'chart' ? require('./assets/icon-chart-select.png') : require('./assets/icon-chart-unselect.png')">
          <p class="text">图表</p>
        </div>
      </router-link>
    </div>
    <addrecord-page :show="isARPageShow" @close="hideARPage"></addrecord-page>
  </div>
</template>

<script>
import AddRecordPage from '@/views/addrecord'
export default {
  name: 'app',
  components: {
    'addrecord-page': AddRecordPage
  },
  data() {
    return {
      isARPageShow: false,
      selectedTab: this.$route.name
    }
  },
  methods: {
    showARPage: function () {
      this.isARPageShow = true
    },
    hideARPage: function () {
      this.isARPageShow = false
      this.$bus.emit('refresh')
    },
    selectTab: function (tab) {
      this.selectedTab = tab
    }
  },
  watch: {
    $route: function (router) {
      this.selectTab(router.name)
    }
  },
  created: function () {
    this.$bus.on('showARPage', this.showARPage)
  }
}
</script>

<style lang="scss" scoped>
@import './assets/theme.scss';
@import './assets/common.scss';
#app {
  font-family: $fontFamily;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  user-select: none;
  @include fontsizeMedia(22px);
  #app-tabs {
    position: fixed;
    display: flex;
    justify-content: center;
    bottom: 0;
    width: 100%;
    height: .76rem;
    border-top: 1px solid #ddd;
    background: #fff;
    &:before {
      content: '';
      width: 1.1rem;
      height: 0.58rem;
      background: url(./assets/tabbar-wave.png);
      background-size: 100% 100%;
      position: absolute;
      top: -.528rem;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
    .tab {
      display: block;
      width: 2.2rem;
      color: $fontColor;
      .tab-wrapper {
        width: 100%;
        height: 100%;
      }
      .text {
        margin: 0;
        font-size: 12px;
        height: .42rem;
        @include fontsizeMedia(18px)
      }
      img {
        display: block;
        height: .34rem;
        margin: .05rem auto;
      }
    }
    .btn-add {
      position: relative;
      img {
        height: .76rem;
        margin-top: -.38rem;
      }
    }
  }
}
</style>
