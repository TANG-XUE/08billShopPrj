import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Welcome from '@/components/welcome/Welcome'
import Users from '@/components/users/Users'

Vue.use(VueRouter)

const routes = [
  {path: '*',redirect:'/Login'},
  {path:'/login',component:Login},
  {
    path:'/home',
    component:Home,
    redirect:'/Welcome',
    children:[
      {path:'/Welcome',component:Welcome},
      {path: '/users', component: Users}
    ]
  },

]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  /*
  * to:将要访问的路径
  * from:代表从哪个路径跳转而来
  * next() 是一个函数，表示放行，netx('/login) 跳转
  * */
  //访问的是登录，直接放行
  if(to.path ==='/login') return next();
  //如果不是登录页，判断token是否存在
  const tokenStr = window.sessionStorage.getItem('token')
  //没有token，则跳转至登录页
  if(!tokenStr) return next('/login')
  //有token，则放行
  next();
})

export default router
