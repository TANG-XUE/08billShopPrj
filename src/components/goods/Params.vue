<template>
    <div class="Params">
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片式图-->
        <el-card>
            <!--警告区域-->
            <el-alert
                title="注意：只允许为第三级分类设置相关参数"
                type="warning"
                :closable="false"
                show-icon
            >
            </el-alert>

            <!--选择分类-->
            <el-row class="cat-opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!--选择分类级联选择框-->
                    <el-cascader
                            v-model="selectedCateKeys"
                            expand-trigger="hover"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChanged"
                    >
                    </el-cascader>
                </el-col>
            </el-row>

            <!--tabs 页签区域-->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!--添加动态参数的面板-->
                <el-tab-pane label="动态参数" name="many">
                    <!--添加动态参数的按钮-->
                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
                    <!--动态参数的表格-->
                    <el-table :data="manyTableData" border stripe>
                        <!--展开行-->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                    v-for="(item,index) in scope.row.attr_vals"
                                    :key="index" closable @close="handleClose(index,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!--输入文板框-->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!--添加-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!--索引列-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!--添加静态属性的面板-->
                <el-tab-pane label="静态属性" name="only">
                    <!--添加静态属性的按钮-->
                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>

                    <!--静态参数的表格-->
                    <el-table :data="onlyTableData" border stripe>
                        <!--展开行-->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                        v-for="(item,index) in scope.row.attr_vals"
                                        :key="index" closable @close="handleClose(index,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!--输入文板框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!--添加-->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!--索引列-->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!--添加参数的对话框-->
        <el-dialog
                :title="`添加${titleText}`"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
            >
            <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
              </span>
        </el-dialog>

        <!--修改参数的对话框-->
        <el-dialog
            :title="`修改${titleText}`"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed"
        >
            <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        name: "Params",
        data() {
            return {
                cateList:[],//商品分类列表
                //指定级联选择的配置对象
                cateProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                selectedCateKeys:[],//级联选择框双向绑定
                activeName:'many',//被激活页签的名称
                manyTableData:[],//动态参数的数据
                onlyTableData:[],//静态参数的数据
                addDialogVisible:false,//控制添加对话框显示与隐藏
                editDialogVisible:false,//控制修改对话框显示与隐藏
                //添加参数的表单数据
                addForm:{
                    attr_name:''
                },
                //表单验证
                addFormRules:{
                    attr_name: [
                        { required: true, message: '请输入参数', trigger: 'blur' },
                    ],
                },
                //修改参数的表单数据
                editForm:{
                    attr_name:''
                },
                //修改表单的验证
                editFormRules:{
                    attr_name: [
                        { required: true, message: '请输入参数', trigger: 'blur' },
                    ],
                },
            }
        },
        mounted() {
            this.getCateList()
        },
        methods:{
            async getCateList(){
                let res = await api.getCategoriesList()
                if (res.meta.status !==200) return this.$message.error('获取分类失败')
                this.cateList = res.data;
            },
            //级联选择框发生改变
            handleChanged(){
                this.getParamsData()
            },
            //tab页签点击事件的处理函数
            handleTabClick(){
                // console.log(this.activeName)
                this.getParamsData()
            },
            //获取参数列表的数据
            getParamsData(){
                //如果选择的不是三级分类
                if(this.selectedCateKeys.length!=3){
                    this.selectedCateKeys = []
                    this.manyTableData = []
                    this.onlyTableData = []
                    return ;
                }
                this.getCateAttr();
            },
            //根据所选的分了id ，和当前所处的面板，获取对应的参数 发起请求
            async getCateAttr(){
                let params = {
                    sel:this.activeName
                }
                let res = await api.getCateAttributesList(this.cateId,params)
                if (res.meta.status !==200) return this.$message.error('获取参数失败')
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[]
                    //添加布尔值控制文本框显示与隐藏
                    item.inputVisible = false
                    //添加文本框中输入的值
                    item.inputValue = ''
                })
                console.log(res.data)
                if (this.activeName ==='many'){
                    this.manyTableData = res.data
                }else {
                    this.onlyTableData = res.data
                }
            },
            //监听对话框的关闭事件
            addDialogClosed(){
                this.$refs.addFormRef.resetFields();
            },
            //点击对话框的确定按钮
            addParams(){
                //验证表单
                this.$refs.addFormRef.validate(valid=>{
                    if(!valid) return;
                });
                this.getAddCateAttFn();//调用发送获取添加参数的请求
            },
            //发送获取添加参数的请求
            async getAddCateAttFn(){
                let addCateAttrParams ={
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                }
                let res = await api.AddCateAttributesFn(this.cateId,addCateAttrParams)
                if (res.meta.status !==201) return this.$message.error('添加参数失败')
                this.$message.success('添加参数成功')
                this.addDialogVisible = false;
                this.getParamsData()
            },
            //点击按钮 展示修改的对话框
            async showEditDialog(attr_id){
                let params = {
                    attr_sel:this.activeName
                }
                let res = await api.getCateAttrSigle(this.cateId,attr_id,params)
                if (res.meta.status !==200) return this.$message.error('获取参数失败')
                console.log(res)
                this.editForm = res.data
                this.editDialogVisible = true
            },
            //修改对话框的关闭事件
            editDialogClosed(){
                this.$refs.editFormRef.resetFields();
            },
            //点击按钮，修改参数信息
            editParams(){
                //验证表单
                this.$refs.editFormRef.validate(valid=>{
                    if(!valid) return;
                });
                this.getEditCateAttFn();//调用发送获取修改参数的请求
            },
            //发送获取修改参数的请求
            async getEditCateAttFn(){
                let editCateAttrParams ={
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName
                }
                let res = await api.EditCateAttrFn(this.cateId,this.editForm.attr_id,editCateAttrParams)
                if (res.meta.status !==200) return this.$message.error('修改参数失败')
                this.$message.success('修改参数成功')
                this.getParamsData();
                this.editDialogVisible = false;
            },
            //根据id删除对应的参数
            async removeParams(attr_id){
                const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err =>err);
                //用户取消了删除的操作
                if(confirmResult!=='confirm') return this.$message.error('已取消删除参数')

                //删除的业务逻辑 发送删除参数的请求
                let res = await api.DeleteCateAttrFn(this.cateId,attr_id)
                if (res.meta.status !==200) return this.$message.error('删除参数失败')
                this.$message.success('删除参数成功')
                this.getParamsData();
                console.log(res)
            },
            //文本框失去焦点 或按下了enter都会触发
            async handleInputConfirm(row){
                if(row.inputValue.trim().length === 0){
                    row.inputValue = ''
                    row.inputVisible = false
                    return;
                }
                //用户输入了内容
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                this.saveAttrValue(row)
            },
            //将对 attr_vals的操作保存到数据库
            async saveAttrValue(row){
                //发起请求 提交数据库
                let editCateAttrParams ={
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(' ')
                }
                let res = await api.EditCateAttrFn(this.cateId,row.attr_id,editCateAttrParams)
                if (res.meta.status !==200) return this.$message.error('修改参数项失败')
                this.$message.success('修改参数项成功')
            },
            //点击按钮，展示文本输入框
            showInput(row){
                row.inputVisible = true
                //让文本框自动获得焦点
                //$nextTick 方法页面的作用 当页面上的元素被重新渲染之后，才会指定回调函数中的代码
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //删除对应的参数可选项
            handleClose(i,row){
                row.attr_vals.splice(i,1)
                this.saveAttrValue(row)
            }

        },
        computed:{
            //如果按钮需要被禁用，则返回true，否则返回false
           isBtnDisabled(){
               if(this.selectedCateKeys.length !== 3){
                    return true;
               }
               return false;
           },
            //当前选中的三级分类的id
            cateId(){
                if(this.selectedCateKeys.length === 3){
                    return this.selectedCateKeys[2];
                }
                return null;
            },
            //弹出对话框的title 动态计算
            titleText(){
               if (this.activeName === "many"){
                   return '动态参数'
               }
               return '静态属性'
            }
        },
        components: {}
    }

</script>

<style lang="scss" scoped>
    ::v-deep{
        .input-new-tag{
            width: 150px;
        }
    }
.cat-opt{
    margin: 15px 0;
}
.el-tag{
    margin: 5px;
}

</style>