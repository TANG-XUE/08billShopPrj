<template>
    <div class="Add">
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片式图-->
        <el-card>
            <!--警告区域-->
            <el-alert
                    title="添加商品信息"
                    type="info"
                    center
                    :closable="false"
                    show-icon
            >
            </el-alert>

            <!--步骤条区域-->
            <el-steps :space="200" :active="Number(activeIndex)" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!--tab栏区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!--props 指定配置对象-->
                            <el-cascader
                                    v-model="addForm.goods_cat"
                                    expand-trigger="hover"
                                    :options="cateList"
                                    :props="cateProps"
                                    @change="handleChanged"
                                    clearable
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="(item,index) in manyTableData" :key="item.attr_id" :label="item.attr_name">
                            <!--复选框组-->
                            <el-checkbox-group v-model="item.attr_vals" size="mini">
                                <el-checkbox border v-for="(cb,i) in item.attr_vals" :label="cb" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="(item,index) in onlyTableData" :key="item.attr_id" :label="item.attr_name">
                           <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!--action表示图片要上传到api地址-->
                        <el-upload
                                :action="upLoadUrl"
                                :headers="headerObj"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success="handleSuccess"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        商品内容
                        <!--富文本编辑器组件-->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="add-btn" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!--图片预览-->
        <el-dialog
                title="图片预览"
                :visible.sync="previewVisible"
                width="50%">
            <img :src="previewPath" alt="" class="preview">
        </el-dialog>

    </div>
</template>

<script>
    import api from '@/api/index.js'
    import _ from 'lodash'
    export default {
        name: "Add",
        data() {
            return {
                activeIndex:'0',//被激活 步骤条的index
                //添加商品的表单数据对象
                addForm:{
                    goods_name:'',
                    goods_price:0,
                    goods_weight:0,
                    goods_number:0,
                    goods_cat:[],//商品所属的分类数组
                    pics:[],
                    goods_introduce:'',//商品的详情描述
                    attrs:[],
                },
                //添加商品的表单验证
                addFormRules:{
                    goods_name:[
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                    ],
                    goods_price:[
                        { required: true, message: '请输入商品价格', trigger: 'blur' },
                    ],
                    goods_weight:[
                        { required: true, message: '请输入商品重量', trigger: 'blur' },
                    ],
                    goods_number:[
                        { required: true, message: '请输入商品数量', trigger: 'blur' },
                    ],
                    goods_cat:[
                        { required: true, message: '请选择商品分类', trigger: 'blur' },
                    ]
                },
                cateList:[],//商品分类列表
                //级联选择器的绑定
                cateProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                manyTableData:[],//动态参数列表数据
                onlyTableData:[],//静态参数列表数据
                upLoadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
                //图片上传组件的请求头
                headerObj:{
                    Authorization:window.sessionStorage.getItem('token')
                },
                previewPath:'',//上传成功的地址
                previewVisible:false,//图片预览对话框显示隐藏

            }
        },
        mounted() {
            this.getCateList()
        },
        methods:{
            async getCateList(){
                let res = await api.getCategoriesList()
                if (res.meta.status !==200) return this.$message.error(res.meta.msg)
                this.cateList = res.data;
            },
            //级联选择器变化触发
            handleChanged(){
                if(this.addForm.goods_cat.length!==3){
                    this.addForm.goods_cat = []
                }
            },
            //标签页切换
            beforeTabLeave(activeName,oldActiveName){
                if( oldActiveName === '0' && this.addForm.goods_cat.length!==3){
                    this.$message.error("请先选择商品分类")
                    return false
                }
            },
            //标签页点击的事件
            tabClicked(){
                //等于1访问的是动态参数面板
                if (this.activeIndex==='1'){
                    this.getCateAttrList('many')
                }else if(this.activeIndex === '2'){
                    this.getCateAttrList('only')
                }
            },
            //发起请求
            async getCateAttrList(sel){
                let params = {
                    sel:sel
                }
                let res = await api.getCateAttributesList(this.cateId,params)
                if (res.meta.status !==200) return this.$message.error(res.meta.msg)
                if (sel==='many'){
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                    })
                    this.manyTableData = res.data;
                }else {
                    this.onlyTableData = res.data;
                }
            },
            //处理图片预览效果
            handlePreview(file){
                console.log(file)
                this.previewPath = file.response.data.url;
                this.previewVisible = true;
            },
            //处理移除图片的操作
            handleRemove(file){
                // 1.获取将要删除的图片的临时路径
                const filePath = file.response.data.tmp_path
                // 2.从pics数组中，找到这个图片对应的索引
                const i = this.addForm.pics.findIndex(x=>{
                    x.pic === filePath
                })
                // 3.调用数组的 splice 方法，把图片信息对象，从pics数组中移除
                this.addForm.pics.splice(i,1);
            },
            //监听图片上传成功的事件
            handleSuccess(response){
                // 1.拼接得到一个图片信息对象
                const picInfo = {
                    pic:response.data.tmp_path
                }
                // 2.将图片信息对象，添加到pics数组里
                this.addForm.pics.push(picInfo)
            },
            //添加商品 调用发送请求url
            addGoods(){
                this.$refs.addFormRef.validate(valid=>{
                    if(!valid) return this.$message.error("请填写必要的表单项目");

                    //调用发送请求url
                    this.getAddGoods()
                });
            },
            async getAddGoods(){
                //克隆表单对象 方便处理数据 以免破坏原对象
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                //处理动态参数
                console.log(this.manyTableData)
                this.manyTableData.forEach(item => {
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                //处理静态属性
                this.onlyTableData.forEach(item => {
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs = this.addForm.attrs;

                console.log(form)
                //发起请求
                let res = await api.AddGoodsFn(form)
                if (res.meta.status !==201) return this.$message.error(res.meta.msg)
                this.$message.success("添加商品成功！")
                this.$router.push('/goods')
            }

        },
        computed:{
            cateId(){
                if (this.addForm.goods_cat.length===3){
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        },
        components: {}
    }

</script>

<style lang="scss" scoped>
::v-deep{
    .el-form-item{
        margin-bottom: 0;
    }
    .ql-editor{
        min-height: 300px;
    }
    .add-btn{
        margin-top: 10px;
    }
}
.preview{
    width: 100%;
}
</style>