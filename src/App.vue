<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
<!-- 确保切换回来的缓存 dom缓存在内存中 切换回来不会发送请求也不会闪动keep-alive -->
    <keep-alive>
      <router-view/>
    </keep-alive>
    <!-- 是应用相关的播放器，在任何路由下都可播放，切换路由并不影响播放，所以定义到App.vue -->
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header'
import Tab from 'components/tab'
import Player from 'components/player'

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="stylus" scoped>
</style>
