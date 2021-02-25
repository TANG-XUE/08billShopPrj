<template>
    <div class="Roles">
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <!--添加角色按钮-->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!--列表-->
            <el-table :data="rolesList" border stripe>
                <!--展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',index1===0?'bdtop':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二和三级权限-->
                            <el-col :span="19">
                                <el-row :class="[index2===0?'':'bdtop']" v-for="(item2,index2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <pre>

                        </pre>
                    </template>
                </el-table-column>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="230px">
                    <template slot-scope="scope">
                        <!-- slot-scope="scope" 拿到数据-->
                        <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        name: "Roles",
        data() {
            return {
                rolesList:[],//角色列表
            }
        },
        created() {
            this.getRolesList();
        },
        methods:{
            async getRolesList(){
                let res = await api.getRolesList();
                if(res.meta.status!=200) return this.$message.error("获取角色列表失败！")
                this.rolesList = res.data;
                console.log(res)
            }
        },
        components: {}
    }

</script>

<style lang="scss" scoped>
::v-deep {
    .el-tag{
        margin: 10px;
    }
}
.bdtop{
    border-top: 1px solid #ddd;
}
.bdbottom{
    border-bottom: 1px solid #ddd;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>