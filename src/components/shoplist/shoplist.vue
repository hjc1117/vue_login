<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索添加 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            @clear="getShopList"
            clearable
            v-model="queryInfo.query"
          >
            <el-button slot="append" icon="el-icon-search" @click="getShopList">
            </el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addgoods">
            添加商品
          </el-button>
        </el-col>
      </el-row>

      <!-- 数据表格展示区 -->
      <!-- :data 数据源 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column label="商品价格-元" prop="goods_price" width="125px">
        </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px">
        </el-table-column>
        <el-table-column label="商品创建时间" prop="add_time" width="150px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
          <template v-slot="scope">
            <div>
              <el-button type="primary" size="mini" icon="el-icon-edit">
                编辑
              </el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removelist(scope.row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //查询对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      //商品列表数据
      goodslist: [],
      //总数据条数
      total: 0,
    };
  },
  methods: {
    async getShopList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.$message.success("获取商品列表成功");
      //   console.log(res.data);
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getShopList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getShopList();
    },
    async removelist(r) {
      const confirm_ = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirm_ !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(`goods/${r.goods_id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getShopList();
    },
    addgoods() {
      //添加router路径  push方法其实和<router-link :to="...">是等同的。push方法的跳转会向 history 栈添加一个新的记录，当我们点击浏览器的返回按钮时可以看到之前的页面。
      this.$router.push("goods/addlist");
    },
  },
  created() {
    this.getShopList();
  },
};
</script>

<style scoped lang="less"></style>
