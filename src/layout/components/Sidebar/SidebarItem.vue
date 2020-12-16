<template>
  <div v-if="!item.hidden" class="menu-wrapper">
  <!--
    走这说明，当前item符合以下情况
    1.没有给菜单添加子菜单，那么这个菜单后端就没有添加alwaysShow，变量onlyOneChild就是当前这个菜单对象的children[0]对应的对象，没有子菜单的菜单
    的children只有一个元素，并且里面不再有children
    2.如果走的是else的时候，下面有使用了递归组件，又再一次使用自己，此时的item就是递归的时候循环children中的item，
    然后又去做条件判断，如果只有2级菜单，正常情况下，这个子item没有alwaysShow，没有children，所以就走了
  -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
    </template>
    <el-submenu v-else :index="resolvePath(item.path)">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!--递归组件-->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-submenu>
  </div>
</template>
<script>
import Item from './Item'
import path from 'path'
import { isExternal } from '@/utils/validate'
export default {
    name:'SidebarItem',
    components: { Item },
  props: {
    item: {
      type: Object,
      required: true,
    },
     basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null;
    return {};
  },
  created() {
    console.log(path.resolve('/system','/system'))
  },
  methods: {
      /**
       * 在这里说明一下
       * 侧边栏是否显示子菜单要分前端处理和后端处理
       * 如果在进行角色分配权限的时候没有对这个用户进行某个菜单分配，给前端的数据是不含这个菜单的
       * 如果分配了，但是属性是不可见，那么前端这边就要起判断，然后做隐藏处理
       */
      // 判断当前这个父级菜单的子菜单是否可见
      //后端返的数据表明，即使只有一个菜单，并没有给他添加子菜单，我们拿到的也是有children的数据，默认会去test2文件夹里面去找index
      /**
       * children: [{component: "Layout", meta: {icon: "app", noCache: true, title: "测试2"}, name: "测试2", path: "index"}]
                0: {component: "Layout", meta: {icon: "app", noCache: true, title: "测试2"}, name: "测试2", path: "index"}
        component: "Layout"
        hidden: false
        path: "/test2"
       */
    hasOneShowingChild(children = [], parent) {
        // 父级菜单里面的子菜单可能有些是设置了不可见的
      const showingChildren = children.filter((item) => {//一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。
        if (item.hidden) {//如果子菜单的hidden为真，就不显示这个子菜单
          return false;
        } else {
          this.onlyOneChild = item;
          return true;
        }
      });
      // 当只有一个子路由，这种子路由分2种情况，1.添加菜单的时候压根就没有给他添加子菜单，只是后端处理给我们返回一个children，还有是我们本地加的 2.只存在一个可见的子菜单
      if (showingChildren.length === 1) {
        return true;
      }
      //长度等于0，children里面的hidden都为true
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      /**
       *     console.log(path.resolve('/system','/system')) -> /system
       * console.log(path.resolve('/system','user')) -> /system/user
       */
      return path.resolve(this.basePath, routePath)
    }
  },
  
};
</script>
