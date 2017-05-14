<template>
  <mu-popup position="bottom" popupClass="data-picker" :open="show" @close="close">
    <div class="actionbar">
      <div @click="close">{{option.closeText || '取消'}}</div>
      <div>{{option.centerText || '选择数据'}}</div>
      <div @click="okAction">{{option.okText || '确定'}}</div>
    </div>
    <mu-picker :slots="dataSlots" :visible-item-count="5" @change="dataChange" :values="defaultdata" />
  </mu-popup>
</template>

<script>
export default {
  data() {
    return {
      dataSlots: this.option.datas,
      dataSelected: this.defaultdata
    }
  },
  props: ['option', 'defaultdata', 'show', 'select'],
  methods: {
    dataChange(value, index) {
      this.dataSelected[index] = value
    },
    close: function () {
      this.$emit('close')
    },
    okAction: function () {
      this.$emit('select', this.dataSelected)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
@import '../assets/theme.scss';
@import '../assets/common.scss';
.data-picker {
  width: 100%;
  .actionbar {
    display: flex;
    justify-content: space-around;
    font-size: 18px;
    padding: .2rem 0;
    border-bottom: 1px solid $borderColor;
    @include fontsizeMedia(24px)
  }
}
</style>
