<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
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
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["permission_routers"]),
    variables() {
      return variables;
    },
    activeMenu() {
      const route = this.$route;
      console.log(route)
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
  },
};
</script>