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

    /*
    * 参数列表
        - 请求路径：categories/:id/attributes
        - 请求方法：get
        - 请求参数
        *   :id分类 ID不能为空`携带在url中`
        *   sel[only,many]不能为空,通过 only 或 many 来获取分类静态参数还是动态参数
    * */
    CateAttributesList(id){
        return `${api}categories/${id}/attributes`
    },

    /*
    *
    * 添加动态参数或者静态属性
    - 请求路径：categories/:id/attributes
    - 请求方法：post
    - 请求参数
    *   :id分类 ID不能为空`携带在url中`
    *   attr_name参数名称不能为空
    *   attr_sel[only,many]不能为空
    *   attr_vals如果是 many 就需要填写值的选项，以逗号分隔【可选参数】
    * */
    AddCateAttributes(id){
        return `${api}categories/${id}/attributes`
    },

    /*
    *
    * 根据 ID 查询参数
    - 请求路径：categories/:id/attributes/:attrId
    - 请求方法：get
    - 请求参数
    - 请求参数
    *   :id分类 ID不能为空`携带在url中`
    *   attrId 属性 ID 不能为空`携带在url中`
    *   attr_sel[only,many]不能为空
    *   attr_vals如果是 many 就需要填写值的选项，以逗号分隔【可选参数】
    * */
    CateAttrSigle(id,attrId){
        return `${api}categories/${id}/attributes/${attrId}`
    },

    /*
    *   编辑提交参数
        - 请求路径：categories/:id/attributes/:attrId
        - 请求方法：put
        - 请求参数
        * :id分类 ID不能为空`携带在url中`
        * :attrId属性 ID不能为空`携带在url中`
        * attr_name新属性的名字不能为空，携带在`请求体`中
        * attr_sel属性的类型[many或only]不能为空，携带在`请求体`中
        * attr_vals参数的属性值可选参数，携带在`请求体`中
    * */

    EditCateAttr(id,attrId){
        return `${api}categories/${id}/attributes/${attrId}`
    },

    /*
    * 删除参数
        - 请求路径： categories/:id/attributes/:attrid
        - 请求方法：delete
        - 请求参数
        * :id 分类 ID不能为空`携带在url中`
        * :attrid 参数 ID不能为空`携带在url中`
    *
    * */
    DeleteCateAttr(id,attrId){
        return `${api}categories/${id}/attributes/${attrId}`
    },

    /*
     * 商品列表数据
     * url:goods
     * params
         * query查询参数可以为空
         * pagenum当前页码不能为空
         * pagesize每页显示条数不能为空
      * */
    GoodsList :api +'goods',

    /*
        * 删除商品
        * url goods/:id delete
        * params
            :id 商品 ID不能为空`携带在url中`
    * */
    DeleteGoods(id){
        return `${api}goods/${id}`
    },

    /*
    * 添加商品
    * 请求方法：post
    * 请求参数
    *   goods_name商品名称不能为空
    *   goods_cat以为','分割的分类列表不能为空
    *   goods_price价格不能为空
    *   goods_number数量不能为空
    *   goods_weight重量不能为空
    *   goods_introduce介绍可以为空
    *   pics上传的图片临时路径（对象）可以为空
    *   attrs商品的参数（数组），包含 `动态参数` 和 `静态属性`可以为空
    * */
    AddGoods :api +'goods',




}