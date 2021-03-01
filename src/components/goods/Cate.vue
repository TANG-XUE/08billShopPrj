<template>
    <div class="Cate">
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片式图-->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!--表格-->
            <tree-table
                class="tree-table"
                :data="cateList"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                index-text="#"
                border
            >
                <!--是否有效-->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <!--排序-->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini"  v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!--操作-->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>



            <!--分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="cateParams.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="cateParams.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--添加分类的对话框-->
        <el-dialog
                title="添加分类"
                :visible.sync="addCateDialogVisible"
                width="50%"
                @close="addDialogClosed"
        >
            <!--内容主题区-->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="80px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!--options 指定数据源-->
                    <!--props 指定配置对象-->
                    <el-cascader
                            class="el-cascader"
                            v-model="selectedKeys"
                            expand-trigger="hover"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentCateChanged">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!--底部区域-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--                <el-button @click="addDialogVisible = false">取 消</el-button>-->
<!--                <el-button type="primary" @click="addUser">确 定</el-button>-->
<!--            </span>-->
        </el-dialog>

    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        name: "Cate",
        data() {
            return {
                cateList:[],//商品分类的列表
                //请求商品分类的参数
                cateParams:{
                    type:3,
                    pagenum:1,
                    pagesize:5
                },
                total:0,//总数据条数
                //为table指定列的定义
                columns:[
                    {
                        label:'分类名称',
                        prop:'cat_name'
                    },
                    {
                        label: '是否有效',
                        type:'template', //表示当前列定义为模板列
                        template:'isok',//表示当前这一列使用模板名称
                    },
                    {
                        label: '排序',
                        type:'template', //表示当前列定义为模板列
                        template:'order',//表示当前这一列使用模板名称
                    },
                    {
                        label: '操作',
                        type:'template', //表示当前列定义为模板列
                        template:'opt',//表示当前这一列使用模板名称
                    }
                ],
                addCateDialogVisible:false,//控制添加对话框的显示与隐藏
                //添加用户的表单数据
                addCateForm:{
                    cat_name:'',
                    cat_level:0,//分类的等级默认是1级分类
                    cate_pid:0
                },
                //添加表单和编辑表单的验证规则
                addCateFormRules:{
                    cat_name:[
                        { required: true, message: '请输入分类名称', trigger: 'blur' },
                    ],
                },
                parentCateList:[],//父级分类的列表
                //指定级联选择的配置对象
                cascaderProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                selectedKeys:[],//选中父级分类的id数组
            }
        },
        mounted(){
            this.getCateList()
        },
        methods:{
            async getCateList(){
                let res = await api.getCategoriesList(this.cateParams)
                if (res.meta.status !==200) return this.$message.error(res.meta.msg)
                this.cateList = res.data.result;
                this.total = res.data.total;

                console.log(res)
            },
            //监听pagesize 改变
            handleSizeChange(newSize){
                this.cateParams.pagesize = newSize;
                this.getCateList();
            },
            //监听pagenum改变
            handleCurrentChange(newPage){
                this.cateParams.pagenum = newPage;
                this.getCateList();
            },
            //点击按钮 展示 添加对话框
            showAddCateDialog(){
                //先获取父级分类的数据列表
                this.getParentCateList();
                //展示对话框
                this.addCateDialogVisible = true;
            },
            //获取父级分类的数据列表
            async getParentCateList(){
                let params = {
                    type:2
                }
                let res = await api.getCategoriesList(this.params)
                if (res.meta.status !==200) return this.$message.error('获取数据分类失败')
                this.parentCateList = res.data;
                console.log(res)
                // this.cateList = res.data.result;
                // this.total = res.data.total;

            },
            //选择项发生变化触发这个函数
            parentCateChanged(){
              console.log(this.selectedKeys)
            },
            //监控 添加分类的对话框的关闭
            addDialogClosed(){

            }
        },
        components: {}
    }

</script>

<style lang="scss" scoped>
::v-deep{
    .el-icon-success{
        color: green;
    }
    .el-icon-error{
        color: red;
    }
    .el-popper{
        height: 300px;
    }
}
.tree-table{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
.el-cascader-box{
    max-height: 300px;
}
</style>