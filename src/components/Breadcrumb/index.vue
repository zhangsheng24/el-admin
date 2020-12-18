<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
      <!--当设置 noredirect 的时候该路由在面包屑导航中不可被点击,如果只有一个，那就是首页，因为尽管
        后台添加的菜单没添加子菜单，后台会默认添加一个index的子菜单-->
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <!--当当前路由不是首页的时候，面包屑的第一个也就是首页可以点击-->
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      //一个数组，包含当前路由的所有嵌套路径片段的路由记录 。
      //路由记录就是 routes 配置数组中的对象副本 (还有在 children 数组)。
      //也就是说
      /**
     * 当前路由为/system/user,
     * matched:[{},{}]，第一个就是父路由对象，第二个是子路由对象，如果有第三个就是孙路由/system/user/sonuser,
     * 当前路由是/home，则就只有一个路由对象
     */
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]
    
    //判断一下第一个路由对象是不是首页home，如果是matched[0]就是这个首页路由对象，isDashboard(first)返回true
    //如果返回false，说明我们的第一个对象不是home路由对象，或者是根路径，没有name
      if (!this.isDashboard(first)) {
        matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
      }
     //只要给breadcrumb设置成false，这个面包屑就不会出现
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      //如果第一个路由对象的name不是home，那么就不给matched添加{ path: '/home', meta: { title: '首页' }}
      return name.trim().toLocaleLowerCase() === 'home'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      //其实这儿目前根本不会走这，因为不存在redirect
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
