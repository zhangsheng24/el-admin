<template>
  <div id="app">
      <!--父组件向子组件传值的时候，我傻逼了，一直在想不是要通过v-bind绑定属性吗？傻逼了，如果绑定的属性值是一个变量就用v-bind-->
      <!-- <div class="b">
        <svg-icon icon-class="user1" />
      </div> -->
      <el-button type="primary">主要按钮</el-button>
  </div>
</template>

<script>


export default {
  name: 'App'
}
</script>
<style>


</style>

