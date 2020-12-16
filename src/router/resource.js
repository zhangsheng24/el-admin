const Login = () => import('@/views/login.vue')
const Layout = () => import('@/layout/index.vue')
const Home = () => import('@/views/home.vue')

export const constantRouterMap=[
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
                name:'home',
                meta:{
                    title:'首页'
                }
            }
        ]
    }
]
