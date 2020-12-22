/**
 * 混入mixins
 */
import { debounce } from '@/utils'
const mixins = {
    data() {
        return {
            $_sidebarElm: null,
            $_resizeHandler: null
        }
    },
    mounted() {
        this.$_resizeHandler = debounce(() => {
            if (this.chart) {
                this.chart.resize()
            }
        }, 100)
        this.$_initResizeEvent()
        this.$_initSidebarResizeEvent()
    },
    methods: {
        // 添加window的resize事件，在改变浏览器窗口尺寸的时候，会调用echarts实例对象的resize()方法实现图表的自适应效果
        $_initResizeEvent() {
            window.addEventListener('resize', this.$_resizeHandler)
        },
        $_destroyResizeEvent() {
            window.removeEventListener('resize', this.$_resizeHandler)
        },
        $_initSidebarResizeEvent() {
            this.$_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
            // transitionend 事件在 CSS 完成过渡后触发。
            this.$_sidebarElm && this.$_sidebarElm.addEventListener('transitionend', this.$_sidebarResizeHandler)
        },
        $_sidebarResizeHandler(e) {
            // 因为我们在实现侧边栏显示隐藏的时候，是通过添加和移除class，也就是改变元素的宽度，而通过transition去做了一个过渡
            // 由于element-ui在鼠标移入到菜单栏的item的时候会有一个激活状态，所以transitionend在我们移入到侧边栏会疯狂执行
            // 但是我们只需要在宽度改变的时候才执行
            // console.log(e)
            if (e.propertyName === 'width') {
                this.$_resizeHandler()
            }
        },
        // 
        $_destroySidebarResizeEvent() {
            this.$_sidebarElm && this.$_sidebarElm.removeEventListener('transitionend', this.$_sidebarResizeHandler)
        }
    },
    // 在离开当前组件之前将window的resize事件清除，将侧边栏transitionend移除移除
    beforeDestroy() {
        this.$_destroyResizeEvent()
        this.$_destroySidebarResizeEvent()
    },
}
export default mixins