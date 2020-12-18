<template>
  <div>
  <!--
  https://www.cnblogs.com/catherLee/p/9554802.html
  elementUI中的隐藏组件el-scrollbar
  -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :collapse='isCollapse'
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import variables from "@/assets/styles/variables.scss";
import SidebarItem from "./SidebarItem";
import { mapGetters } from "vuex";
import Logo from './Logo'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routers",'sidebar']),
    variables() {
      return variables;
    },
    // 根据路由地址去激活当前菜单的选中
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    isCollapse(){
      return !this.sidebar.opened
    },
    // 是否显示logo
    showLogo(){
      return this.$store.state.settings.sidebarLogo
    }
  },
};
</script>