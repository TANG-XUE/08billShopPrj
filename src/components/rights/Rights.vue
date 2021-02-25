<template>
    <div class="Rights">
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card>
            <!--列表-->
            <el-table :data="rightsList" border stripe>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level ==='0'">一级权限</el-tag>
                        <el-tag v-else-if="scope.row.level ==='1'" type="success">二级权限</el-tag>
                        <el-tag v-else type="warning">三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->

        </el-card>

    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        name: "Rights",
        data() {
            return {
                //权限列表
                rightsList:[]
            }
        },
        mounted() {
            this.getPowerList();
        },
        methods:{
            //获取权限列表
            async getPowerList(){
                let res = await api.getPowerList()
                if(res.meta.status!=200) return this.$message.error("获取权限列表失败！")
                this.rightsList = res.data;
                console.log(res)
            },
            handleSizeChange(){

            },
            handleCurrentChange(){

            }
        },
        components: {}
    }

</script>

<style scoped>

</style>