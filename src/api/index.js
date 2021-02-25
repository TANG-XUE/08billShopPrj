import axios from 'axios'
import * as url from "./config"

//axios请求拦截
axios.interceptors.request.use(config => {
    //为请求对象，添加Token验证的`Authorization`字段
    /*为每一次请求都加上请求头 Authorization*/
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config;
})
//设置响应数据的返回格式
axios.interceptors.response.use(response => {
    return response.data; //直接返回数据中data选项中的data[想要的数据]
})


export default {
    //登录
    LoginFn(params) {
        return axios.post(url.Login, {
            ...params
        })
    },
    //获取左侧菜单
    getMenus() {
        return axios.get(url.Menus)
    },

    //用户数据列表
    getUsers(params) {
        return axios.get(url.Users, {
            params
        })
    },
    /* 更改用户状态
        uId用户 ID不能为空`携带在url中`
        type用户状态不能为空`携带在url中`，值为 true 或者 false
    */
    changeUserState(uId, type) {
        // uId, type
        return axios.put(url.UserType(uId, type))
    },
    /*添加用户
    * - 请求路径：users
    * - 请求方法：post
    *- 请求参数:
        | username | 用户名称 | 不能为空 |
        | password | 用户密码 | 不能为空 |
        | email    | 邮箱     | 可以为空 |
        | mobile   | 手机号   | 可以为空 |
    * */
    AddUsersFn(params){
        return axios.post(url.AddUsers,{
            ...params
        })
    },

    getSearchUsers(id){
        return axios.get(url.SearchUsers(id))
    },

    /*编辑用户提交
    * users/:id
    * params:{
    *   id,email,moblie
    * }
    * */
    editUserFn(params){
        return axios.put(url.SearchUsers(params.id),{
            ...params
        })
    },
    /*删除用户
    *   - 请求路径：users/:id
        - 请求方法：delete
        - 请求参数 id用户 id不能为空`参数是url参数:id`
    * */
    deleteUserFn(id){
        return axios.delete(url.deleteUser(id))
    },
    /*
    * 获取权限列表
    * rights/:type get
    * type类型值 list 或 tree ,
    * list 列表显示权限,
    * tree 树状显示权限,`参数是url参数:type`
    * */
    getPowerList(){
        return axios.get(url.PowerList)
    },

    /*角色列表*/
    getRolesList(){
        return axios.get(url.RolesList)
    }

}