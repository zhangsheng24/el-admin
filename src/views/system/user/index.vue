<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <!--搜索-->
          <el-input
            v-model="deptName"
            size="small"
            class="filter-item"
            placeholder="输入部门名称搜索"
          />
        </div>
        <!--树-->
        <!--
                        :load="getDeptDatas"加载子树数据的方法，仅当 lazy 属性为true 时生效,页面组件加载的时候就会执行这个方法
                        :check-on-click-node='false'是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
                        当点击箭头展开某一个数的时候就会执行load的方法，所以一开始我们执行getDeptDatas方法，他默认有2个参数，一个是node，一个是resolve
                        树为第一级的时候,node.level为0,resolve的作用是将一个数组抛给树tree，就可以根据:props="defaultProps"这个我们定义的配置选项
                        根据label: 'name'去数组中找name的属性值放在tree上。当我们点击一级树的时候想要展开二级数，又会执行load的方法
                        此时node参数的level为1，node的.data就是点击的这个一级树的数据，拿到这个一级树的id去请求数据，拿到对应的2级树数据，再resolve到二级树上
                        注意：getDeptDatas这个方法在搜索部门的时候也需要，如果是搜索的时候执行，那么他的参数node和resolve就不再是tree属性
                        所表达的意思了，他的第一个参数就是你搜索的关键词，并且没有第二个参数，所以resolve是undefined
                    -->
        <el-tree
          :data="deptDatas"
          lazy
          :load="getDeptDatas"
          :props="defaultProps"
          :check-on-click-node="false"
        />
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div>
            <!-- 搜索 -->
            <el-input
              clearable
              v-model="query.blurry"
              size="small"
              placeholder="输入名称或者邮箱搜索"
              style="width: 200px"
              class="filter-item"
            />
            <date-range-picker v-model="query.createTime" />
            <rrOperation />
          </div>
          <crudOperation />
        </div>
        <el-table ref="table" v-loading='crud.loading' :data="crud.data" style="width: 100%">
          <el-table-column prop="username" label="用户名"> </el-table-column>
          <el-table-column prop="nickName" label="昵称"> </el-table-column>
          <el-table-column prop="gender" label="性别"> </el-table-column>
          <el-table-column prop="phone" label="电话"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="dept" label="部门">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import api from "@/api";
import DateRangePicker from "@/components/DateRangePicker";
import rrOperation from "@/components/Crud/RR.operation";
import crudOperation from "@/components/Crud/CRUD.operation";
import CRUD, { crud, presenter, header } from "@/components/Crud/crud";
export default {
  data() {
    return {
      deptName: "",
      deptDatas: [],
      defaultProps: { children: "children", label: "name", isLeaf: "leaf" }, //label:'name'代表要去data数据里面找name的字段
    };
  },
  cruds() {
    return CRUD({ title: "用户", url: "system.user.userList" });
  },
  components: {
    DateRangePicker,
    rrOperation,
    crudOperation,
  },
  mixins: [presenter(), crud(), header()],
  methods: {
    // 获取左侧部门数据
    getDeptDatas(node, resolve) {
      const sort = "id,desc";
      const params = { sort };
      if (typeof node !== "object") {
        if (node) {
          params["name"] = node;
        }
      } else if (node.level !== 0) {
        params["pid"] = node.data.id;
      }
      setTimeout(() => {
        api("system.dept.getDepts", params).then((res) => {
          if (resolve) {
            resolve(res.content);
          } else {
            this.deptDatas = res.content;
          }
        });
      }, 100);
    },
  },
  mounted() {
    console.log(this);
  },
};
</script>