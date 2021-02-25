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
                                <el-tag 
                                    closable 
                                    @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二和三级权限-->
                            <el-col :span="19">
                                <el-row :class="[index2===0?'':'bdtop']" v-for="(item2,index2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable 
                                            @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" closable 
                                            @close="removeRightById(scope.row,item3.id)"
                                             v-for="(item3,index3) in item2.children" 
                                             :key="item3.id">
                                             {{item3.authName}}
                                        </el-tag>
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
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!--分配权限的对话框-->
        <el-dialog
            title="分配权限"
            @close="cloeseRightDialog"
            :visible.sync="setRightDialogVisible"
            width="50%">
            <el-tree 
                :data="rightsList" 
                :props="treeProps" 
                show-checkbox 
                node-key="id" 
                default-expand-all 
                :default-checked-keys="defkeys"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cloeseRightDialog">取 消</el-button>
                <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        name: "Roles",
        data() {
            return {
                rolesList:[],//角色列表
                setRightDialogVisible:false,//控制分配权限的显示隐藏
                //所有权限的数据
                rightsList:[],
                //树形控件属性的绑定对象
                treeProps:{  
                    label: 'authName',
                    children: 'children'
                },
                defkeys:[],//默认的选中的节点d值数组
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
            },
            //根据id删除对应的权限
            async removeRightById(role,rightsId){
                const confirmResult = await
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)

                if(confirmResult!='confirm'){
                    return this.$message.info("删除已取消")
                }

                let res = await api.deleteRolesRightsFn(role.id,rightsId)
                if(res.meta.status!=200) return this.$message.error("删除权限失败")
                this.$message.success("删除权限成功")
                role.children = res.data;
            },
            //展示分配权限的对话框
            async showSetRightDialog(role){
                let res = await api.getRulesPowerList()
                if(res.meta.status!=200) return this.$message.error("获取权限失败！")
                this.rightsList = res.data;
                //获取三级节点的id
                this.getLeafKeys(role,this.defkeys);
                console.log(res)
                this.setRightDialogVisible = true;
            },
            //点击取消 关闭分配权限的弹窗
            cloeseRightDialog(){
                this.setRightDialogVisible = false;
                this.defkeys = []
            },
            //通过递归的形式，获取角色下所有三级权限的id，并保存到 defkeys 数组中
            getLeafKeys(node,arr){
                //如果当前node节点 不包含children属性，则是三级节点
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item=>{
                    this.getLeafKeys(item,arr)
                })
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