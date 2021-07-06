<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 2,为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 800px;height:400px;"></div
    ></el-card>
  </div>
</template>

<script>
//1,导入echarts
import * as echarts from "echarts";
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      //需要合并的对象
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
  components: {},
  async mounted() {
    //3, 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    //4, 指定图表的配置项和数据
    const { data: res } = await this.$http.get(`reports/type/1`);
    if (res.meta.status !== 200) {
      return this.$message.error("获取图表失败");
    }

    const resoult = _.merge(res.data, this.options);
    //5, 使用刚指定的配置项和数据显示图表。
    myChart.setOption(resoult);
  },
};
</script>

<style scoped lang="less"></style>
