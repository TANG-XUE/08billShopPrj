<template>
    <div class="List">
        <!--面包屑导航区域-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片式图-->
        <el-card>
            <!--搜索按钮-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="goodsParams.query" clearable @clear="getGoodsList" placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <!--表格-->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="110px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="180px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="goodsParams.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="goodsParams.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import api from '@/api/index.js'
    export default {
        name: "List",
        data() {
            return {
                goodsParams:{
                    query:'', //查询参数可以为空
                    pagenum:1, //当前页码不能为空
                    pagesize:10, //每页显示条数不能为空
                },
                goodsList:[],//商品列表
                total:0,//总数据条数
            }
        },
        mounted() {
            this.getGoodsList()
        },
        methods:{
            async getGoodsList(){
                let res = await api.getGoodsList(this.goodsParams)
                if (res.meta.status !==200) return this.$message.error('获取商品数据失败')
                this.goodsList = res.data.goods;
                this.total = res.data.total;
                console.log(res)
            },
            //监控分页
            handleSizeChange(newSize){
                this.goodsParams.pagesize = newSize
                this.getGoodsList()
            },
            //监控页码发生改变
            handleCurrentChange(newPage){
                this.goodsParams.pagenum = newPage
                this.getGoodsList()
            },
            //删除商品
            async removeById(id){
                //DeleteGoodsFn
                const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err =>err);
                //用户取消了删除的操作
                if(confirmResult!=='confirm') return this.$message.error('已取消删除商品')

                //发送删除商品请求
                let res = await api.DeleteGoodsFn(id)
                if (res.meta.status !==200) return this.$message.error('删除商品失败！')
                this.$message.success('删除商品成功！')
                this.getGoodsList()



            },
            //跳转到添加页面
            goAddpage(){
              this.$router.push('/goods/add')
            }
        },
        components: {}
    }

</script>

<style scoped>

</style>