<template>
    <div class="login-container">
        <div class="login-box">
            <!--头像-->
            <div class="avatar-box">
                <img src="../../assets/logo.png" alt="">
            </div>
            <!--表单-->
            <el-form ref="loginFormRef" :model="form" :rules="loginFormRules" class="login-form">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input type="password" prop="password" v-model="form.password" placeholder="请输入密码" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!--按钮区域-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        name: "Login",
        data() {
            return {
                //登录表单的数据
                form: {
                    username: 'admin',
                    password: '123456'
                },
                loginFormRules: {
                    username: [
                        { required: true, message: '请输入登录名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'change' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            //重置表单  resetFields是elementui的form表单重置方法
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields()
            },
            //登录
             login(){
                //表间校验  validate是elementui的form表单验证方法
                 this.$refs.loginFormRef.validate(valid=>{
                    if(!valid) return;
                    this.getLogin();
                })
            },
            //登录api
            async getLogin(){
                let data = await api.LoginFn(this.form);
                if(data.meta.status!==200) return this.$message.error("登录失败!")
                this.$message.success("登录成功!")
                console.log(data)
                window.sessionStorage.setItem('token',data.data.token)
                this.$router.push('/home')
            }
        },
        components: {}
    }

</script>

<style lang="scss" scoped>
.login-container{
    height: 100%;
    background: #2b4b6b;
    .login-box{
        width: 450px;
        height: 300px;
        background: #fff;
        border-radius: 3px;
        position: absolute;
        left:50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .avatar-box{
            width: 130px;
            height: 130px;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 50%;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left:50%;
            transform: translate(-50%,-50%);
            background: #fff;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #eee;
            }
        }
    }
}
.login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
}
.btns{
    display: flex;
    justify-content: flex-end;
}

</style>