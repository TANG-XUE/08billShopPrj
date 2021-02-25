<template>
    <div class="User">
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--搜索与添加区域-->
            <el-row :gutter="20">
                <el-col :span="14">
                    <el-input v-model="userParams.query" 
                        clearable
                        @clear="getUserList"
                        placeholder="请输入内容" 
                        class="input-with-select">
                        <el-button slot="append" @click="getUserList" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col> 
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!--列表-->
            <el-table :data="userList" border stripe>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- 设置slot-scope="scope" 拿到scope.row 拿到数据-->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- slot-scope="scope" 拿到数据-->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <el-tooltip effect="dark" content="分配角色" :enterable="false" placement="top">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="userParams.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="userParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!--添加用户的对话框-->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
            >
            <!--内容主题区-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改用户的对话框-->
        <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogClosed"
        >
            <!--内容主题区-->
            <el-form :model="searchUserForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input disabled v-model="searchUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="searchUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="searchUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        name: "User",
        data() {
            //验证手机号的校验规则
            var checkEmail = (rule, value, callback) => {
                //验证邮箱的正则
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if(regEmail.test(value)){
                    //合法的邮箱
                    return callback()
                }
                callback(new Error('请输入合法的邮箱'))
            };
            var checkMobile = (rule, value, callback) => {
                //验证手机号的正则
                const regPhone = /^1[3|4|5|7|8][0-9]{9}$/
                if(regPhone.test(value)){
                    //合法的邮箱
                    return callback()
                }
                callback(new Error('请输入合法的手机号'))

            };
            return {
                userParams:{
                    query:'',
                    pagenum: 1,//当前的页数
                    pagesize: 2  //当前每页显示多少条
                },
                userList:[],
                total:0,
                addDialogVisible:false,//控制添加用户对话框的显示与隐藏
                editDialogVisible:false,//控制修改用户对话框的显示与隐藏
                //添加用户的表单数据
                addForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                //添加用户表单和编辑用户表单的验证规则
                addFormRules:{
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    email:[
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                        {validator:checkEmail, trigger: 'blur'}  
                    ],
                    mobile:[
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        {validator:checkMobile, trigger: 'blur'}  
                    ],
                },
                //根据查询到的用户信息对象
                searchUserForm:{},
            }
        },
        mounted(){
            this.getUserList()
        },
        methods:{
            async getUserList(){
                let res = await api.getUsers(this.userParams)
                if(res.meta.status!=200) return this.$message.error('获取用户列表失败')
                this.userList = res.data.users;
                this.total = res.data.total;
            },
            //检测pagesize改变的事件 每页显示多少条数据
            handleSizeChange(newSize){
                this.userParams.pagesize = newSize;
                this.getUserList()
            },
            //检测 页码值 改变的事件 跳到第几页的数据
            handleCurrentChange(newPage){
                this.userParams.pagenum = newPage;
                this.getUserList()
            },
            //更改状态
            async userStateChanged(userInfo){
                console.log(userInfo)
                let res = await api.changeUserState(userInfo.id,userInfo.mg_state)
                if(res.meta.status!=200){
                    userInfo.mg_state = !userInfo.mg_state
                    return this.$message.error("更新状态失败")
                }
                this.$message.success("更新状态成功")
            },
            //弹窗关闭事件 关闭弹窗清空添加用户表单
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            //点击按钮 新增新用户
            addUser(){
                //判断表单是否验证成功
                this.$refs.addFormRef.validate(valid =>{
                    if (!valid) return;
                    //如果成功则可调用发送添加用户请求
                    this.getAddUserFn(this.addForm)
                })
            },
            //发送添加用户的请求
            async getAddUserFn(params){
                let res = await api.AddUsersFn(params)
                if (res.meta.status !== 201){
                    this.$message.error('添加用户失败！')
                }
                this.$message.success('添加用户成功！')
                this.addDialogVisible = false;//隐藏添加用户对话框
                this.getUserList();//刷新列表
                console.log(res)
            },
            //展示编辑的对话框
            async showEditDialog(id){
                console.log(id)
                this.editDialogVisible = true;
                let res = await api.getSearchUsers(id);
                if(res.meta.status !== 200) return this.$message.error('查询用户失败！')
                this.searchUserForm = res.data;
                console.log(res.data)
            },
            //修改用户对话框的关闭事件
            editDialogClosed(){
                this.$refs.editFormRef.resetFields()
            },
            //点击修改用户的确定按钮 修改用户
            editUser(){
                //判断表单是否验证成功
                this.$refs.editFormRef.validate(valid =>{
                    if (!valid) return;
                    //如果成功则可调用发送添加用户请求
                    this.getEditUser(this.addForm)
                })
            },
            //发起修改用户的请求
            async getEditUser(){
                let res = await api.editUserFn(this.searchUserForm)
                if (res.meta.status !== 200){
                    this.$message.error('修改用户失败！')
                }
                this.$message.success('修改用户成功！')
                this.editDialogVisible= false;//隐藏修改用户对话框
                this.getUserList();//刷新列表
            },
            //点击删除按钮
            async removeUserById(id){
                console.log(id)
                //是否删除数据
                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                //如果用户确认删除，则 confirmResult 返回值为 confirm
                //如果用户取消了删除，则 confirmResult 返回值为 cancel
                if(confirmResult !== 'confirm') return this.$message.error('删除已取消！')
                this.getDeleteUser(id)
            },
            //发送删除用户的请求
            async getDeleteUser(id){
                let res = await api.deleteUserFn(id)
                if (res.meta.status!==200) return this.$message.error('删除失败！')
                this.$message.success('删除成功！')
                this.getUserList();//刷新列表
            }
        },
        components: {}
    }

</script>

<style lang="scss" scoped>
::v-deep{
.el-pagination{
    margin-top: 20px;
}
}
.el-table{
    margin-top: 20px;
}
</style>