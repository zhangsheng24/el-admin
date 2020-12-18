<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
     <div class="main-container">
        <div>
          <navbar />
        </div>
        <app-main />
      </div>
  </div>
</template>
<script>
import { Sidebar, Navbar, AppMain } from "./components";
import {mapState} from 'vuex'
export default {
  data() {
    return {};
  },
  computed:{
    ...mapState({
      sidebar: state => state.app.sidebar,
    }),
    classObj(){
      return {
        hideSidebar:!this.sidebar.opened
      }
    }
  },
  components: {
    Sidebar,
    Navbar,
    AppMain
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>