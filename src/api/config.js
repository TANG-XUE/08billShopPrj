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

    /*用户角色分配
    * users/:id/role
    * params:id
    *       rid
    * */
    AssignRoles(id){
        return `${api}users/${id}/role`
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
    RolesList :api +'roles',

    //角色权限列表 树状结构
    RolesPowerList: api + 'rights/tree',

    /*角色授权
    * roles/:roleId/rights
    *   params:
    *       :roleId角色 ID不能为空`携带在url中`rids
    *       rids权限 ID 列表（字符串）
    * */
    RolesInPower(roleId){
        return `${api}roles/${roleId}/rights`
    },


    /*
    * 商品分类数据列表
    * url:categories get
    * params
        | type     | [1,2,3]            | 值：1，2，3 分别表示显示一层二层三层分类列表<br />【可选参数】如果不传递，则默认获取所有级别的分类 |
        | pagenum  | 当前页码值         | 【可选参数】如果不传递，则默认获取所有分类                   |
        | pagesize | 每页显示多少条数据 | 【可选参数】如果不传递，则默认获取所有分类                   |
    * */
    CategoriesList :api +'categories',

    /*
    * 添加商品分类
    * url:categories post
    * params
        cat_pid分类父 ID不能为空，如果要添加1级分类，则父分类Id应该设置为  `0`cat_name分类名称不能为空cat_level分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_name分类名称不能为空cat_level分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
    * */
    AddCategories:api +'categories',

    /*
    * 根据 id 查询分类
    * url categories/:id get
    * params
        :id分类 ID不能为空`携带在url中`
    * */
    CategoriesSigle(id){
        return `${api}categories/${id}`
    },

    /*
   * 编辑提交分类
   * url categories/:id put
   * params
       :id分类 ID不能为空`携带在url中`
       cat_name分类名称不能为空【此参数，放到请求体中】
   * */
    UpdateCategories(id){
        return `${api}categories/${id}`
    },

    /*
   * 删除分类
   * url categories/:id delete
   * params
       :id分类 ID不能为空`携带在url中`
   * */
    DeleteCategories(id){
        return `${api}categories/${id}`
    },




}