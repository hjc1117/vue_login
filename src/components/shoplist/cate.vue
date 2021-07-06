<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="success" @click="showAddCurrent">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <t-t
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="tb"
      >
        <!-- 有效模板 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted == false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 等级模板 -->
        <template v-slot:level="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag type="danger" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作模板列 -->
        <template v-slot:caozuo="scope">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-edit"
            @click="caozuoshop(scope.row)"
            >操作</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteShop(scope.row)"
            >删除</el-button
          >
        </template>
      </t-t>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="reqinfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="reqinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCurrentdialogVisible"
      width="50%"
      @close="onClose"
    >
      <!-- 添加分类form表单 -->
      <el-form
        :model="addform"
        :rules="addformRules"
        ref="addformref"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="slelctedkeys"
            :options="parentCurrentList"
            :props="caseprops"
            @change="parentCurrentChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCurrentdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 操作分类弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="changeCurrentdialogVisible"
      width="50%"
      @close="changeOnClose"
    >
      <!-- 添加分类form表单 -->
      <el-form
        :model="changeform"
        :rules="changeformRules"
        ref="changeformref"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="change_name">
          <el-input v-model="changeform.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="changeCurrentdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //商品分类的数据列表 默认为空
      cateList: [],
      //查询条件 请求参数
      reqinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //加上模板属性
          type: "template",
          //模板名
          template: "isok",
        },
        {
          label: "排序",
          //加上模板属性
          type: "template",
          //模板名
          template: "level",
        },
        {
          label: "操作",
          //加上模板属性
          type: "template",
          //模板名
          template: "caozuo",
        },
      ],
      //添加分类是否弹出
      addCurrentdialogVisible: false,
      //添加分类表单数据对象
      addform: {
        //来自开发文档:分类父 ID不能为空，如果要添加1级分类，则父分类Id应该设置为  `0`
        cat_pid: 0,
        //来自开发文档:分类名称不能为空
        cat_name: "",
        //来自开发文档:分类层级不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0,
      },
      //添加分类表单验证规则
      addformRules: {
        //即将添加的分类的名称 prop='cat_name'
        cat_name: [
          { required: true, message: "输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类列表存放数组
      parentCurrentList: [],
      //指定选择器的配置对象
      caseprops: {
        //指定选项的值为选项对象的某个属性值
        value: "cat_id",
        //指定选项标签为选项对象的某个属性值
        label: "cat_name",
        //指定选项的子选项为选项对象的某个属性值
        children: "children",
        expandTrigger: "hover",
      },
      //选中的父级分类的id数组
      slelctedkeys: [],
      checkStrictly: true,
      // 获取修改列表
      changeform: {},
      changeformRules: {
        change_name: [{ trigger: "blur" }],
      },
      changeCurrentdialogVisible: false,
    };
  },
  created() {
    this.getcatelist();
  },
  methods: {
    //获取 商品分类 数据
    async getcatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: this.reqinfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }

      this.cateList = res.data.result;
      this.total = res.data.total;
      //   console.log(res.data.result);
    },
    //pagesize改变时触发
    handleSizeChange(newsize) {
      this.reqinfo.pagesize = newsize;
      this.getcatelist();
    },
    //页码pagenum改变时触发
    handleCurrentChange(newCurrent) {
      this.reqinfo.pagenum = newCurrent;
      this.getcatelist();
    },
    showAddCurrent() {
      //对话框展示前先获取父级分类列表
      this.getParentCurrentList();
      this.addCurrentdialogVisible = true;
    },
    //获取父级分类列表
    async getParentCurrentList() {
      const { data: res } = await this.$http.get("categories", {
        //params:参数
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败");
      }
      this.parentCurrentList = res.data;
    },
    //选择项变化触发 即hover到每个列表时
    parentCurrentChange() {
      //   console.log(this.slelctedkeys);
      //如果slelctedkeys.length>0证明选中了父级分类  反之证明没有选择分类
      if (this.slelctedkeys.length > 0) {
        //为选中的id赋值
        this.addform.cat_pid = this.slelctedkeys[this.slelctedkeys.length - 1];
        //为选中的等级赋值
        this.addform.cat_level = this.slelctedkeys[this.slelctedkeys.length];
        return;
      } else {
        this.addform.cat_pid = 0;
        this.addform.cat_level = 0;
      }
    },
    //点击确定添加数据
    addCate() {
      this.$refs.addformref.validate(async (v) => {
        if (!v) {
          return;
        }
        const { data: res } = await this.$http.post("categories", this.addform);
        if (res.meta.status !== 201) {
          return this.$message.error("添加父级分类失败");
        }

        this.$message.success("添加父级分类成功");
        this.getcatelist();
        this.addCurrentdialogVisible = false;
      });
    },
    //弹框关闭时触发
    onClose() {
      this.$refs.addformref.resetFields();
      this.slelctedkeys = [];
      this.addform.cat_level = 0;
      this.addform.cat_pid = 0;
    },
    //获取操作数据
    async caozuoshop(scope) {
      const { data: res } = await this.$http.get(`categories/${scope.cat_id}`);

      // console.log(scope.cat_id);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败");
      }
      this.changeform = res.data;
      this.changeCurrentdialogVisible = true;
    },
    async deleteShop(scope_) {
      const confirm_ = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //   console.log(confirm_);
      //点确认返回confirm 点取消返回cancle
      if (confirm_ !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(
        `categories/${scope_.cat_id}`
      );
      // console.log(scope_.cat_id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getcatelist();
    },
    changeOnClose() {
      this.$refs.changeformref.resetFields();
      this.slelctedkeys = [];
      this.changeform.cat_level = 0;
      this.changeform.cat_pid = 0;
    },
    changeCate() {
      this.$refs.changeformref.validate(async (v) => {
        if (!v) {
          return;
        } else {
          const { data: res } = await this.$http.put(
            `categories/${this.changeform.cat_id}`,
            {
              cat_name: this.changeform.cat_name,
            }
          );
          console.log(res);
          this.changeCurrentdialogVisible = false;
          this.getcatelist();
          this.$message.success("修改成功");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.tb {
  margin: 10px 0;
}
.el-cascader {
  width: 100%;
}
</style>
