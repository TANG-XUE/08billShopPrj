<template>
    <div class="Home">
        <el-container class="home-container">
            <!--头部区域-->
            <el-header>
                <div class="logo">
                    <img src="../../assets/images/heima.png" alt="">
                    <span>电商后台管理系统</span>
                </div>
                <el-button type="info" @click="logout">退出</el-button>
            </el-header>
            <!--页面主体-->
            <el-container>
                <!--侧边栏-->
                <el-aside :width="isCollapse?'64px':'200px'">
                    <div class="toggle-buttom" @click="toggleCollpase">|||</div>
                    <!--侧边栏菜单-->
                    <el-menu
                            unique-opened
                            :collapse="isCollapse"
                            :collapse-transition="false"
                            router
                            :default-active="activePath"
                            background-color="#333744"
                            text-color="#fff"
                            active-text-color="#409eff">
                        <!--一级菜单-->
                        <el-submenu :index="String(item.id)" v-for="item in menulist" :key="item.id">
                            <!--一级菜单模板区域-->
                            <template slot="title">
                                <!--icon-->
                                <i :class="iconObj[item.id]"></i>
                                <!--文本-->
                                <span>{{item.authName}}</span>
                            </template>
                            <!--二级菜单-->
                            <el-menu-item :index="subItem.path" @click="savaNavState(subItem.path)" v-for="subItem in item.children" :key="subItem.id">
                                <template slot="title">
                                    <!--icon-->
                                    <i class="el-icon-menu"></i>
                                    <!--文本-->
                                    <span>{{subItem.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!--主内容-->
                <el-main>
                    <!--路由占位符-->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        name: "Home",
        data() {
            return {
                menulist:[],
                iconObj:{
                    "125":'iconfont icon-user',
                    "103":'iconfont icon-tijikongjian',
                    "101":'iconfont icon-shangpin',
                    "102":'iconfont icon-danju',
                    "145":'iconfont icon-baobiao'
                },
                isCollapse:false,
                //被激活的地址
                activePath:''
            }
        },
        mounted() {
            this.getMenusList()
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods:{
            logout(){
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            async getMenusList(){
                let res = await api.getMenus()
                if (res.meta.status !==200) return this.$message.error(res.meta.msg)
                this.menulist = res.data;
            },
            //切换菜单折叠和展开
            toggleCollpase(){
                this.isCollapse = !this.isCollapse;
            },
            //保存链接的激活状态
            savaNavState(activePath){
                window.sessionStorage.setItem('activePath',activePath)
                this.activePath = activePath;
            }
        },
        components: {}
    }

</script>

<style lang="scss" scoped>
.Home{
    background: #373d41;
    height: 100%;
    .home-container{
        height: 100%;
        .el-header{
            display: flex;
            justify-content: space-between;
            padding-left: 0;
            align-items: center;
            color: #fff;
            font-size: 20px;
            .logo{
                display: flex;
                align-items: center;
                span{
                    margin-left: 15px;
                }
            }
        }
        .el-aside{
            background: #333744;
            .el-menu{
                border: none;
            }
        }
        .el-main{
            background: #eaedf1;
        }
    }
}
.iconfont{
    margin-right: 10px;
}
.toggle-buttom{
    background: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>