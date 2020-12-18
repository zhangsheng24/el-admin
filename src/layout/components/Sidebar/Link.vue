
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'
/**
 * 动态组件的使用，通过componnet 绑定属性就可以把他在页面的站位处渲染成我们指定的组件
 v-bind可以绑定一个执行函数，其实绑定的是函数的返回值，当前返回的是一个对象，
 我们可以通过给动态组件绑定一个is，指定渲染成什么组件，to代表这个组件里面的属性
 * 
 */
export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    // 处理添加跳转的链接，因为链接有可能是一个网址，也可能是路由跳转
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>

