const Login = () => import('@/views/login')
const Layout = () => import('@/layout/index')
const Home =() => import('@/views/home')
const F_404 = () => import('@/views/features/404.vue')


export const constantRouterMap=[
    {
        path:'/login',
        component:Login,
        meta:{
            title:'登录'
        },
        hidden: true
    },
    {
        path:'/',
        component:Layout,
        redirect:'/home',
        children:[
            {
                path:'home',
                component:Home,
                name:'Home',
                meta:{
                    title:'首页'
                }
            }
        ]
    },
    {
        path:'/404',
        component:F_404,
        hidden: true
    }
]

