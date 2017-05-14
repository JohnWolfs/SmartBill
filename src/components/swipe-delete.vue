<template>
  <div class="swipe-delete-item" ref="item" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <slot></slot>
    <div class="delete" @click="onDelete">删除</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startX: 0,
      startY: 0,
      translateX: 0,
      direction: 0
    }
  },
  methods: {
    onTouchStart: function (e) {
      this.startX = e.targetTouches[0].pageX
      this.startY = e.targetTouches[0].pageY
      var t = this.$refs.item.style.transform
      this.translateX = t ? parseInt(t.split('(')[1].split(')')[0]) : 0
    },
    onTouchMove: function (e) {
      var curTouch = e.targetTouches[0]
      var xDis = curTouch.pageX - this.startX
      var yDis = Math.abs(curTouch.pageY - this.startY)
      var pos = this.translateX + xDis

      // direction：1 - 上下滑动 2 - 左右滑动 ，用户滑动的方向，如果上下滑动则不触发滑动效果
      if (!this.direction) this.direction = yDis > 2 ? 1 : -1
      if (this.direction === 1) return

      // 边界情况
      if (pos < -1 * this.deleteWidth) this.$refs.item.style.transform = 'translateX(' + -1 * this.deleteWidth + 'px)'
      else if (pos > 0) this.$refs.item.style.transform = 'translateX(0px)'
      else this.$refs.item.style.transform = 'translateX(' + (this.translateX + xDis) + 'px)'
    },
    onTouchEnd: function (e) {
      var curTouch = e.changedTouches[0]
      var pos = curTouch.pageX - this.startX + this.translateX

      // 上下滑动则不触发
      if (this.direction === 1) {
        this.direction = 0
        return
      }

      if (pos < -1 * this.deleteWidth / 2) this.$refs.item.style.transform = 'translateX(' + -1 * this.deleteWidth + 'px)'
      if (pos >= -1 * this.deleteWidth / 2) this.$refs.item.style.transform = 'translateX(0)'
      this.direction = 0
    },
    onDelete: function () {
      this.$emit('delete')
    }
  },
  computed: {
    deleteWidth: function () {
      return parseFloat(document.documentElement.style.fontSize) * 1.2
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/theme.scss';
@import '../assets/common.scss';
$deleteButtonWidth: 1.2rem;
$itemHeight: .8rem;
.swipe-delete-item {
  position: relative;
  display: flex;
  align-items: center;
  height: $itemHeight;
  justify-content: space-between;
  padding: 0 .2rem;
  border-bottom: 1px solid $lighterBorderColor;
  transform: translateX(0);
  transition: transform .08s;
  .delete {
    position: absolute;
    right: -1 * $deleteButtonWidth;
    width: $deleteButtonWidth;
    background: $accentColor;
    color: #fff;
    height: 100%;
    line-height: $itemHeight;
    font-size: 16px;
    text-align: center;
    @include fontsizeMedia(22px)
  }
}
</style>
