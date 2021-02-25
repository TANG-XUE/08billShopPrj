const api = 'http://127.0.0.1:8888/api/private/v1/'


module.exports = {
    Login: api + 'login', // 手机号登陆
    Menus: api + 'menus', //左侧菜单
    Users: api + 'users', //用户数据列表

    // 更改用户状态
    UserType(uId, type) {
        return `${api}users/${uId}/state/${type}`
    },

    /*添加用户
    * - 请求路径：users
    * - 请求方法：post
    *- 请求参数
    * */
    AddUsers: api + 'users', //添加用户

    /*根据id查询用户信息
    * users/:id
    * */
    SearchUsers(id){
        return `${api}users/${id}`
    },
    /*编辑用户提交
    * users/:id
    * params:{
    *   id,email,moblie
    * }
    * */
    editUser(id){
        return `${api}users/${id}`
    },
    /*删除用户
    *   - 请求路径：users/:id
        - 请求方法：delete
        - 请求参数 id用户 id不能为空`参数是url参数:id`
    * */
    deleteUser(id){
        return `${api}users/${id}`
    },

    /*
    * 获取权限列表
    * rights/:type
    * type类型值 list 或 tree ,
    * list 列表显示权限,
    * tree 树状显示权限,`参数是url参数:type`
    * */
    PowerList: api + 'rights/list',

    /*角色列表*/
    RolesList :api +'roles'



}