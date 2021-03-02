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
<!--                <el-tabs v-model="activeIndex" :tab-position="'left'" style="height: 200px;">-->
<!--                    <el-tab-pane label="基本信息" name="0">-->
<!--                        <el-form-item label="商品名称" prop="goods_name">-->
<!--                            <el-input v-model="addForm.goods_name"></el-input>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="商品价格" prop="goods_price">-->
<!--                            <el-input v-model="addForm.goods_price"></el-input>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="商品重量" prop="goods_weight">-->
<!--                            <el-input v-model="addForm.goods_weight"></el-input>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="商品数量" prop="goods_number">-->
<!--                            <el-input v-model="addForm.goods_number"></el-input>-->
<!--                        </el-form-item>-->
<!--&lt;!&ndash;                        <el-form-item label="商品分类" prop="name">&ndash;&gt;-->
<!--&lt;!&ndash;                            <el-input v-model="addForm.name"></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;                        </el-form-item>&ndash;&gt;-->
<!--                        <el-form-item label="商品图片" prop="pics">-->
<!--                            <el-input v-model="addForm.pics"></el-input>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="商品内容" prop="goods_introduce">-->
<!--                            <el-input v-model="addForm.goods_introduce"></el-input>-->
<!--                        </el-form-item>-->
<!--                    </el-tab-pane>-->
<!--                    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>-->
<!--                    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>-->
<!--                    <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>-->
<!--                    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>-->
<!--                </el-tabs>-->
            </el-form>

        </el-card>

    </div>
</template>

<script>
    export default {
        name: "Add",
        data() {
            return {
                activeIndex:'0',//被激活 步骤条的index
                //添加商品的表单数据对象
                addForm:{
                    goods_name:'',
                    goods_price:0,
                },
                //添加商品的表单验证
                addFormRules:{
                    goods_name:[
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                    ],
                    goods_price:[
                        { required: true, message: '请输入商品价格', trigger: 'blur' },
                    ]
                }
            }
        },
        components: {}
    }

</script>

<style scoped>

</style>