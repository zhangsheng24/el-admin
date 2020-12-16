<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container" />
    <router-view />
  </div>
</template>
<script>
import { Sidebar } from "./components";
export default {
  data() {
    return {};
  },
  components: {
    Sidebar,
  },
  methods: {
    a() {
      console.log(12);
    },
  },
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