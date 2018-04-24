<template>
  <div class="search-box">
    <span class="icon-search"></span>
    <input type="text" class="box" :placeholder="placeholder" v-model="query" ref="query">
    <span class="icon-dismiss" v-show="query" @click="clear"></span>
  </div>
</template>

<script>
import {debounce} from 'common/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = '' //点击右侧×按钮，置空输入框，内容变成默认的占位符
    },
    setQuery(query) {
      this.query = query
    },
    //移动端优化
    blur() {
      this.$refs.query.blur()
    }
  },
  //当query改变时，派发一个事件告诉外部组件我有变化了，外部组件是否监听就不是serch-box的事情了，只提供query事件
  created() { //watch query的变化，回调里把query当作事件的参数派发出去，派发一个query事件，把newQuery传出去
    this.$watch('query', debounce((newQuery) => { //但为什么不直接在watcher里写，要用回调的方式？watcher的回调函数需要被节流，防止每输入一个字符就请求一遍数据
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/variable"

  .search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    height 40px
    padding 0 6px
    background $color-highlight-background
    border-radius 6px
    .icon-search
      font-size 24px
      color $color-background
    .box
      flex 1
      margin 0 5px
      line-height 18px
      background $color-highlight-background
      color $color-text
      font-size $font-size-medium
      // outline 0
      &::placeholder
        color $color-text-d
    .icon-dismiss
      font-size 16px
      color $color-background
</style>