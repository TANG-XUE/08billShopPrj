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
//解决发送两次请求
// axios.setHeader("Access-Control-Allow-Origin", "*");


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
    /*用户角色分配
    * users/:id/role
    * params:id
    *       rid
    * */
    AssignRolesFn(id,rid){
        return axios.put(url.AssignRoles(id),{
            rid
        })
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

    /*角色权限列表*/
    getRulesPowerList(){
        return axios.get(url.RolesPowerList)
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

    ///角色列表
    getRolesList(){
        return axios.get(url.RolesList)
    },


    /*角色授权
    * roles/:roleId/rights
    *   params:
    *       :roleId角色 ID不能为空`携带在url中`rids
    *       rids权限 ID 列表（字符串）
    * */
    RolesInPowerFn(roleId,params){
        return axios.post(url.RolesInPower(roleId),{
            ...params
        })
    },

    /*
   * 商品分类数据列表
   * url:categories get
   * params
       | type     | [1,2,3]            | 值：1，2，3 分别表示显示一层二层三层分类列表<br />【可选参数】如果不传递，则默认获取所有级别的分类 |
       | pagenum  | 当前页码值         | 【可选参数】如果不传递，则默认获取所有分类                   |
       | pagesize | 每页显示多少条数据 | 【可选参数】如果不传递，则默认获取所有分类                   |
   * */
    getCategoriesList(params){
        return axios.get(url.CategoriesList,{
            params
        })
    },
    /*
    * 添加商品分类
    * url:categories post
    * params
        cat_pid分类父 ID不能为空，如果要添加1级分类，则父分类Id应该设置为  `0`cat_name分类名称不能为空cat_level分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_name分类名称不能为空cat_level分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
    * */
    AddCategoriesFn(params){
        return axios.post(url.AddCategories,{
            ...params
        })
    },
    /*
   * 根据 id 查询分类
   * urlcategories/:id get
   * params
       :id分类 ID不能为空`携带在url中`
   * */
    getCategoriesSigle(id){
        return axios.get(url.CategoriesSigle(id))
    },
    /*
  * 编辑提交分类
  * url categories/:id put
  * params
      :id分类 ID不能为空`携带在url中`
      cat_name分类名称不能为空【此参数，放到请求体中】
  * */
    UpdateCategoriesFn(id,cat_name){
        return axios.put(url.UpdateCategories(id),{
            cat_name
        })
    },

    /*
       * 删除分类
       * url categories/:id delete
       * params
       :id分类 ID不能为空`携带在url中`
   * */
    DeleteCategoriesFn(id,cat_name){
        return axios.put(url.DeleteCategories(id))
    },

}