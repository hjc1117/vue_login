<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
          >
            <el-button slot="append" icon="el-icon-search"> </el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="odlist" stripe border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price"> </el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status == 1">
              已付款</el-tag
            >
            <el-tag type="danger" else> 未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="showBox"
            >
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-location"
              type="success"
              @click="showPBox"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 修改地址 -->
      <el-dialog
        title="修改地址"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addclose"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              :options="provinceAndCityData"
              v-model="addressForm.address1"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 物流进度 -->
      <el-dialog title="物流进度" :visible.sync="wuliushow" width="50%">
        <!-- 时间流 -->
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in wuliuInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode,
} from "element-china-area-data";
export default {
  props: {},
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      odlist: [],
      dialogVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [{ required: true, trigger: "blur" }],
        address2: [{ required: true, trigger: "blur" }],
      },
      wuliushow: false,
      provinceAndCityData,
      wuliuInfo: [],
    };
  },
  created() {
    this.getOdlist();
  },
  methods: {
    async getOdlist() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      this.$message.success("获取订单列表成功");
      this.total = res.data.total;
      this.odlist = res.data.goods;
    },
    handleSizeChange(ns) {
      this.queryInfo.pagesize = ns;
      this.getOdlist();
    },
    handleCurrentChange(nn) {
      this.queryInfo.pagenum = nn;
      this.getOdlist();
    },
    showBox() {
      this.dialogVisible = true;
    },
    async showPBox() {
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流信息失败");
      }
      this.$message.success("获取物流信息成功");
      //   console.log(res.data);
      this.wuliuInfo = res.data;
      this.wuliushow = true;
    },
    addclose() {
      this.$refs.addressFormRef.resetFields();
    },
    wuliuclose() {},
  },
  components: {},
};
</script>

<style scoped lang="less"></style>
