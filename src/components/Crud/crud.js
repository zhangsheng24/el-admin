/**
 * Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。
 * 如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性。
 */

//这个crud指针对当前路由对应的这个组件，如果跳转了在下一个页面使用将会初始化，跟vuex刷新浏览器之后是一样的
import Vue from 'vue'
import api from '@/api'
function CRUD(options) {
    const defaultOptions = {
        tag: 'default',
        // 标题
        title: '',
        // 请求数据的url
        url: '',
        // 表格数据
        data: [],
        // 待查询的对象
        query: {},
        // 在主页准备
        queryOnPresenterCreated: true,

    }
    options = mergeOptions(defaultOptions, options)
    const data = {
        ...options,
        page: {
            // 页码
            page: 0,
            // 每页数据条数
            size: 10,
            // 总数据条数
            total: 0
        },
    }
    const methods = {
        // 搜索
        toQuery() {
            // crud.page.page = 1
            crud.refresh()
        },
        // 刷新
        refresh() {
            if (!callVmHook(crud, CRUD.HOOK.beforeRefresh)) {
                return
            }
            return new Promise((resolve, reject) => {
                //请求数据
                api(crud.url, crud.getQueryParams()).then(res => {
                    crud.page.total = res.totalElements
                    crud.data = res.content
                    // resolve(res)
                })
            })
        },
        //获取查询参数
        getQueryParams() {
            return {
                page: 0,
                size: 10,
                sort: 'id,desc'
            }
        },
        getTable() {
            return crud.findVM('presenter').$refs.table
        },
        findVM(type) {
            return crud.vms.find(vm => vm && vm.type === type).vm
        },

    }
    const crud = Object.assign({}, data)
    //Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，
    //所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的
    //Vue.observable(crud)
    //让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象。
    //返回的对象可以直接用于渲染函数和计算属性内，并且会在发生变更时触发相应的更新。也可以作为最小化的跨组件状态存储器，用于简单的场景：
    //也就是说其实observable相当于一个小的vuex，Vue.observable(crud)使得data中的数据是响应式的
    Vue.observable(crud)
    // 附加方法：methods里面的不是响应式数据
    Object.assign(crud, methods)
    // 记录初始默认的查询参数，后续重置查询时使用
    Object.assign(crud, {
        defaultQuery: JSON.parse(JSON.stringify(data.query)),
        vms: Array(4),
        /**
        * 注册组件实例
        * @param {String} type 类型
        * @param {*} vm 组件实例
        * @param {Number} index 该参数内部使用
        */
        registerVM(type, vm, index = -1) {
            const vmObj = {
                type,
                vm: vm
            }
            if (index < 0) {
                this.vms.push(vmObj)
                return
            }
            if (index < 4) {
                this.vms[index] = vmObj
                return
            }
            this.vms.length = Math.max(this.vms.length, index)
            this.vms.splice(index, 1, vmObj)

        },
        unregisterVM(type, vm) {
            console.log(vm)
            for (let i = this.vms.length - 1; i >= 0; i--) {
                if (this.vms[i] === undefined) {
                    continue
                }
                if (this.vms[i].type === type && this.vms[i].vm === vm) {
                    if (i < 4) {
                        this.vms[i] = undefined
                    } else {
                        this.vms.splice(i, 1)
                    }
                    break
                }
            }
            console.log(this)
        }
    })
    return crud

}


function callVmHook(crud, hook) {
    console.log(crud, hook)
    let ret = true
    return ret
}

function mergeOptions(src, opts) {
    const optsRet = {
        ...src
    }
    for (const key in src) {
        // eslint-disable-next-line no-prototype-builtins
        if (opts.hasOwnProperty(key)) {
            optsRet[key] = opts[key]
        }
    }
    return optsRet
}

/**
 * crud主页
 */
function presenter(crud) {
    return {
        data() {
            return {
                crud: this.crud
            }
        },
        beforeCreate() {
            this.$crud = this.$crud || {}
            //#options用于当前 Vue 实例的初始化选项。需要在选项中包含自定义 property 时会有用处,在这个对象中可以拿到我们自定义的某个属性
            let cruds = this.$options.cruds instanceof Function ? this.$options.cruds() : crud
            // console.log(cruds)是CRUD函数的返回值
            if (!(cruds instanceof Array)) {
                cruds = [cruds]
            }
            cruds.forEach(ele => {
                if (this.$crud[ele.tag]) {
                    console.error('[CRUD error]: ' + 'crud with tag [' + ele.tag + ' is already exist')
                }
                //给实例对象里面
                this.$crud[ele.tag] = ele
                ele.registerVM('presenter', this, 0)
            })
            // 这一步就是给vue实例添加一个crud
            this.crud = this.$crud['default'] || cruds[0]
        },
        created() {
            for (let k in this.$crud) {
                console.log(k)
                if (this.$crud[k].queryOnPresenterCreated) {
                    this.$crud[k].toQuery()
                }
            }
        },
        destroyed() {
            for (const k in this.$crud) {
                this.$crud[k].unregisterVM('presenter', this)
            }
            console.log(this, 'dest')
        },
    }
}
function crud(options = {}) {
    const defaultOptions = {
        type: undefined
    }
    options = mergeOptions(defaultOptions, options)
    return {
        data() {
            return {
                crud: this.crud
            }
        },
        beforeCreate() {
            this.crud.registerVM(options.type, this)
        },
    }
}
/**
 * CRUD钩子
 */
CRUD.HOOK = {
    /**刷新 - 之前 */
    beforeRefresh: 'beforeCrudRefresh'
}

export default CRUD

export {
    crud,
    presenter
}