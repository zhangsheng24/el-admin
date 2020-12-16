<<<<<<< HEAD
const Login = () => import('@/views/login.vue')
const Layout = () => import('@/layout/index.vue')
const Home = () => import('@/views/home.vue')

export const constantRouterMap=[
=======
const Login = () => import('@/views/login')
const Layout = () => import('@/layout/index')
const Home =() => import('@/views/home')


const constantRouterMap=[
>>>>>>> 15d072f09009c92cb6952034f1a5b784b5f7f54e
    {
        path:'/login',
        component:Login,
        meta:{
            title:'登录'
        }
    },
    {
        path:'/',
        component:Layout,
        redirect:'/home',
        children:[
            {
                path:'home',
                component:Home,
<<<<<<< HEAD
                name:'home',
=======
                name:'Home',
>>>>>>> 15d072f09009c92cb6952034f1a5b784b5f7f54e
                meta:{
                    title:'首页'
                }
            }
        ]
    }
]
<<<<<<< HEAD
=======

export default constantRouterMap
>>>>>>> 15d072f09009c92cb6952034f1a5b784b5f7f54e
