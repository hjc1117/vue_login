<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 警告提示区 -->
      <el-alert
        title="只能为三级分类设置参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 商品分类区 -->
      <el-row>
        <el-col>
          <span
            >选择商品分类:
            <el-cascader
              v-model="selectcateList"
              :options="cateList"
              :props="cateProps"
              @change="selectedchange"
            >
            </el-cascader>
          </span>
        </el-col>
      </el-row>

      <!-- tab 页签 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <!-- 左 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isbtnDisbled"
            @click="addManydata"
          >
            添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manylist" border stripe>
            <!-- 展开小箭头 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="tagClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 结尾添加区 -->
                <!-- 输入的文本框 -->
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
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="changeParams(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="primary"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 右 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isbtnDisbled"
            @click="addManydata"
          >
            配置管理
          </el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlylist" border stripe>
            <!-- 展开小箭头 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="tagClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 结尾添加区 -->
                <!-- 输入的文本框 -->
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
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="changeParams(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="primary"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加 弹出框模板 -->
    <el-dialog
      :title="titleMessage"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="onclose"
    >
      <!-- 添加参数输入框 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="130px"
      >
        <el-form-item :label="titleMessage" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改弹出框模板 -->
    <el-dialog
      :title="'修改' + titleMessage"
      :visible.sync="changeDialogVisible"
      width="50%"
      @close="onclose_"
    >
      <!-- 修改参数输入框 -->
      <el-form
        :model="changeForm"
        :rules="changeFormrules"
        ref="changeFormref"
        label-width="150px"
      >
        <el-form-item :label="'修改' + titleMessage" prop="attr_name">
          <el-input v-model="changeForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeparamssure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //渲染得去的值
      cateList: [],
      //选择框v-model 存入id数组
      selectcateList: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //选中页签的名字name
      activeName: "only", //默认选择only
      manylist: [],
      onlylist: [],
      //弹框提示
      titleMessage: "",
      //弹框显示隐藏
      addDialogVisible: false,
      //添加参数双向绑定对象
      addForm: {
        attr_name: "",
      },
      //添加数据验证规则
      addFormrules: {
        attr_name: [
          { required: true, message: "输入添加参数名称", trigger: "blur" },
        ],
      },
      changeDialogVisible: false,
      changeForm: {
        attr_name: "",
      },
      changeFormrules: {
        attr_name: [
          { required: true, message: "输入添加参数名称", trigger: "blur" },
        ],
      },
      //输入框与button互切
      inputVisible: false,
      //input双向绑定
      inputValue: "",
    };
  },
  created() {
    this.getshoplist();
  },
  methods: {
    async getshoplist() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }

      this.cateList = res.data;
      //   console.log(this.cateList);
    },
    //选择变化时
    async selectedchange() {
      //ui中：@change	当选中节点变化时触发	选中节点的值(id)
      if (this.selectcateList.length != 3) {
        this.selectcateList = [];
        this.manylist = [];
        this.onlylist;
        return;
      } else {
        const { data: res } = await this.$http.get(
          `categories/${this.selectcateList[2]}/attributes`,
          {
            params: { sel: this.activeName },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数列表失败");
        }
        // console.log(res.data);
        res.data.forEach((i) => {
          i.attr_vals = i.attr_vals ? i.attr_vals.split(",") : [];
          //让遍历出来的每一行数据都有自己的布尔值和数据
          i.inputVisible = false;
          i.inputValue = "";
        });
        // console.log(res.data);
        if (this.activeName == "many") {
          this.manylist = res.data;
          this.titleMessage = "添加动态参数";
        } else {
          this.onlylist = res.data;
          this.titleMessage = "添加静态属性";
        }
        // console.log(this.manylist);
        // console.log(this.onlylist);
      }
    },
    //点击页签时触发
    tabClick() {
      this.selectedchange();
    },
    addManydata() {
      this.addDialogVisible = true;
    },
    onclose() {
      this.$refs.addFormref.resetFields();
    },
    //确定添加时
    addparams() {
      this.$refs.addFormref.validate(async (v) => {
        if (!v) {
          return;
        }
        const { data: res } = await this.$http.post(
          `categories/${this.selectcateList[2]}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        this.getshoplist();
        this.selectedchange();
      });
    },
    //点击编辑时
    async changeParams(atid) {
      const { data: res } = await this.$http.get(
        `categories/
        ${this.selectcateList[2]}
        /attributes/${atid}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      this.changeForm = res.data;
      this.changeDialogVisible = true;
    },
    //关闭修改时
    onclose_() {
      this.$refs.changeFormref.resetFields();
    },
    //确定修改时
    changeparamssure() {
      this.$refs.changeFormref.validate(async (v) => {
        if (!v) return;
        else {
          const { data: res } = await this.$http.put(
            `categories/${this.changeForm.cat_id}/attributes/${this.selectcateList[2]}`,
            {
              attr_name: this.changeForm.attr_name,
              attr_sel: this.activeName,
            }
          );
          // console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("修改参数列表失败");
          }
          this.$message.success("修改参数成功");
          this.getshoplist();
          this.selectedchange();
          this.changeDialogVisible = false;
        }
      });
    },
    removeParams(id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.$http.delete(
            `categories/${this.selectcateList[2]}/attributes/${id}`
          );
          this.getshoplist();
          this.selectedchange();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //input数去焦点或按下enter触发
    async handleInputConfirm(r) {
      //消除空格后文本长度依然为0 则走下列代码
      if (r.inputValue.trim().length == 0) {
        r.inputValue = "";
        r.inputVisible = false;
        return;
      }
      //否则 输入合法 走下面代码
      r.attr_vals.push(r.inputValue);
      r.inputValue = "";
      r.inputVisible = false;
      this.putdata(r);
    },
    //tag参数提交函数提交与删除时都会调用该函数
    async putdata(r) {
      const { data: res } = await this.$http.put(
        `categories/${
          this.selectcateList[this.selectcateList.length - 1]
        }/attributes/${r.attr_id}`,
        {
          attr_name: r.attr_name,
          attr_sel: r.attr_sel,
          attr_vals: r.attr_vals.join(","),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("编辑提交参数失败");
      }
      this.$message.success("编辑成功");
    },
    showInput(r) {
      r.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除tag
    tagClose(i, r) {
      r.attr_vals.splice(i, 1);
      this.putdata(r);
    },
  },
  computed: {
    isbtnDisbled() {
      if (this.selectcateList.length != 3) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped lang="less">
.input-new-tag {
  width: 130px;
}
</style>
