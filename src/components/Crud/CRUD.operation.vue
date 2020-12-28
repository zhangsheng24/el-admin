<template>
  <div class="crud-opts">
    <span class="crud-opts-left">
      <!--左侧插槽-->
      <slot name="left" />
      <el-button
        v-permission="['user:add']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
      >
        新增
      </el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-edit"
      >
        修改
      </el-button>
      <el-button
        slot="reference"
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        size="mini"
      >
        删除
      </el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="warning"
        icon="el-icon-download"
        >导出</el-button
      >
      <!--右侧-->
      <slot name="right" />
    </span>
  </div>
</template>
<script>
export default {};
</script>

<style>
.crud-opts {
  padding: 4px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
.crud-opts .crud-opts-right {
  margin-left: auto;
}
</style>
