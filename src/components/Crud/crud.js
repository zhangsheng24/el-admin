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
        // id字段名
        idField: 'id',
        // 标题
        title: '',
        // 请求数据的url
        url: '',
        // 表格数据
        data: [],
        // 待查询的对象
        query: {},
        // 等待时间
        time: 50,
        // 在主页准备
        queryOnPresenterCreated: true,

    }
    options = mergeOptions(defaultOptions, options)
    console.log(options)
    const data = {
        // 这儿的目的是为了将传给CRUD的数据覆盖掉defaultOptions默认里面的数据，因为我们有可能改变某些属性值
        ...options,
        page: {
            // 页码
            page: 0,
            // 每页数据条数
            size: 10,
            // 总数据条数
            total: 0,
        },
        // 整体loading
        loading: false,
    }
    const methods = {
        // 搜索
        toQuery() {
            crud.page.page = 1
            crud.refresh()
        },
        // 刷新
        refresh() {
            // if (!callVmHook(crud, CRUD.HOOK.beforeRefresh)) {
            //     return
            // }
            return new Promise((resolve, reject) => {
                crud.loading = true
                //请求数据
                console.log(crud.getQueryParams())
                api(crud.url, crud.getQueryParams()).then(res => {
                    const table = crud.getTable()
                    console.log(table, 'table')
                    crud.page.total = res.totalElements
                    // 表格数组数据，如果后端返回的字段不是content，请自行修改
                    crud.data = res.content
                    // 重置数据状态
                    // crud.resetDataStatus()
                    // time毫秒后显示表格
                    setTimeout(() => {
                        crud.loading = false
                        callVmHook(crud, CRUD.HOOK.afterRefresh)
                    }, crud.time)
                    // resolve(res)
                })
            })
        },
        //获取查询参数
        getQueryParams() {
            // 清除query参数无值的情况
            Object.keys(crud.query).length !== 0 && Object.keys(crud.query).forEach(item => {
                if (crud.query[item] === null || crud.query[item] === '') crud.query[item] = undefined
            })
            console.log(crud.query)

            return {
                page: crud.page.page - 1,
                size: crud.page.size,
                sort: crud.sort,
                ...crud.query
            }
        },
        getTable() {
            return this.findVM('presenter').$refs.table
        },
        findVM(type) {
            return crud.vms.find(vm => vm && vm.type === type).vm
        },
        /**
         * 重置查询参数
         * @param {Boolean} toQuery 重置后进行查询操作
         */
        resetQuery(toQuery=true){
            //defaultQuery拿到的是一个空对象
            const defaultQuery = JSON.parse(JSON.stringify(crud.defaultQuery)) 
            //获取当前的query
            const query=crud.query
            console.log(query)
            //让query里面的每一个查询参数的值都是空对象中对应key的值也就是undefined
            Object.keys(query).forEach(key=>{
                query[key]=defaultQuery[key]
            })
            // // 重置参数
            // this.query={}
            if(toQuery){
                crud.toQuery()
            }
        },



        /**
        * 重置数据状态
        */
        resetDataStatus() {
            const dataStatus = {}
            function resetStatus(datas) {
                console.log(datas)
            }
            resetStatus(crud.data)
            crud.dataStatus = dataStatus
        }


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
            // 返回两个指定的数中带有较大的值的那个数
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

// 记录crud每个操作的事件钩子状态
function callVmHook(crud, hook) {
    console.log(crud, hook)
    const tagHook = crud.tag ? hook + '$' + crud.tag : null
    console.log(tagHook)
    let ret = true
    const nargs = [crud]
    // for (let i = 2; i < arguments.length; ++i) {
    //     console.log(i)
    //     nargs.push(arguments[i])
    // }
    // console.log(nargs)
    const vmSet = new Set()
    crud.vms.forEach(vm => vm && vmSet.add(vm.vm))
    console.log(crud.vms)
    console.log(vmSet)
    vmSet.forEach(vm => {
        if (vm[hook]) {
            console.log(vm[hook])
            ret = vm[hook].apply(vm, nargs) !== false && ret
        }
        if (tagHook && vm[tagHook]) {
            console.log(vm[tagHook])
            ret = vm[tagHook].apply(vm, nargs) !== false && ret
        }
    })
    console.log(ret)
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
            // 在data中返回crud，是为了将crud与当前实例关联，组件观测crud相关变化。因为采用的混入mixin
            return {
                crud: this.crud
            }
        },
        beforeCreate() {
            this.$crud = this.$crud || {}
            //$options用于当前 Vue 实例的初始化选项。需要在选项中包含自定义 property 时会有用处,在这个对象中可以拿到我们自定义的某个属性
            let cruds = this.$options.cruds instanceof Function ? this.$options.cruds() : crud
            // console.log(cruds)是CRUD函数的返回值,返回值里面包含了很多的属性和方法供我们使用
            if (!(cruds instanceof Array)) {
                cruds = [cruds]
            }
            cruds.forEach(ele => {
                if (this.$crud[ele.tag]) {
                    console.error('[CRUD error]: ' + 'crud with tag [' + ele.tag + ' is already exist')
                }
                //给实例对象里面，目的是被子组件找到这个crud对象
                this.$crud[ele.tag] = ele
                ele.registerVM('presenter', this, 0)
            })
            // 这一步就是给vue实例添加一个crud
            this.crud = this.$crud['default'] || cruds[0]
        },
        created() {
            for (let k in this.$crud) {
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
/**
 * 头部
 */
function header() {
    return {
        data() {
            return {
                crud: this.crud,
                query: this.crud.query
            }
        },
        beforeCreate() {
            this.crud = lookupCrud(this)
            this.crud.registerVM('header', this, 1)
        },
        destroyed() {
            this.crud.unregisterVM('header', this)
        }
    }
}


/**
 * 查找crud
 * @param {*} vm
 * @param {string} tag
 */
function lookupCrud(vm, tag) {
    tag = tag || vm.$attrs['crud-tag'] || 'default'
    // function lookupCrud(vm, tag) {
    if (vm.$crud) {
        const ret = vm.$crud[tag]
        if (ret) {
            return ret
        }
    }
    return vm.$parent ? lookupCrud(vm.$parent, tag) : undefined
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
            this.crud = lookupCrud(this)
            this.crud.registerVM(options.type, this)
        },
    }
}
/**
 * CRUD钩子
 */
CRUD.HOOK = {
    /**刷新 - 之前 */
    beforeRefresh: 'beforeCrudRefresh',
    afterRefresh: 'afterCrudRefresh'
}

export default CRUD

export {
    crud,
    presenter,
    header
}