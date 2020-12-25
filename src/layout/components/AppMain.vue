<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!--
      不使用kee-alive，管理平台很多增删改查的操作，
      目前缓存的方案对于某些业务是不适合的，比如文章详情页这种 /article/1 /article/2，
      他们的路由不同但对应的组件却是一样的，所以他们的组件 name 就是一样的，
      就如前面提到的，keep-alive的 include 只能根据组件名来进行缓存，所以这样就出问题了。目前有两种解决方案：
        不使用 keep-alive 的 include 功能 ，直接是用 keep-alive 缓存所有组件，
        这样子是支持前面所说的业务情况的。 前往@/layout/components/AppMain.vue文件下，移除include相关代码即可。当然直接使用 keep-alive 也是有弊端的，
        他并不能动态的删除缓存，你最多只能帮它设置一个最大缓存实例的个数 limit。相关 issue
        使用 localStorage 等浏览器缓存方案，自己进行缓存处理
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
      -->
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

// .hasTagsView {
//   .app-main {
//     /* 84 = navbar + tags-view = 50 + 34 */
//     min-height: calc(100vh - 84px);
//   }

//   .fixed-header+.app-main {
//     padding-top: 84px;
//   }
// }
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
