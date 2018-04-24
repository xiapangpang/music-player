<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="(item, index) in searches" :key="index"
      @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <span class="icon-delete"></span>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    deleteOne(item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../common/stylus/variable"
  @import "../common/stylus/mixin"

  .search-list
    .search-item
      display flex
      height 40px
      align-items center
      overflow hidden
      &.list-enter-active, &.list-leave-active
        transition all .1s
      &.list-enter, &.list-leave-to
        height 0
      .text
        flex 1
        color $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size $font-size-small
          color $color-text-d
</style>