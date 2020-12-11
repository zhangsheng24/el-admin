const Login = () => import('@/views/login.vue')

const routes=[
    {
        path:'/login',
        component:Login,
        meta:{
            title:'登录'
        }
    }
]

export default routes
