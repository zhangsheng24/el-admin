const Login = () => import('@/views/login')
const Layout = () => import('@/layout/index')
const Home =() => import('@/views/home')


const constantRouterMap=[
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
                name:'Home',
                meta:{
                    title:'首页'
                }
            }
        ]
    }
]

export default constantRouterMap
