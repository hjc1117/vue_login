<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="400"
        :active="stup_ - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab -->
      <el-form
        :model="addForm_"
        :rules="addForm_Rules"
        ref="addForm_Ref"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="stup_"
          :before-leave="beforeTabLeave"
          @tab-click="tabchange"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name" required>
              <el-input v-model="addForm_.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" required>
              <el-input v-model="addForm_.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" required>
              <el-input v-model="addForm_.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" required>
              <el-input v-model="addForm_.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="选择商品分类:" prop="goods_cat" required>
              <el-cascader
                v-model="addForm_.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="selectedchange_"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
            >
              <!-- 选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到后台的api地址 -->
            <el-upload
              :action="upURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerobj"
              :on-success="successed"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm_.goods_introduce"> </quill-editor>
            <!-- 添加按钮 -->
            <el-button type="primary" style="margin-top:15px" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览模板 -->
    <el-dialog title="图片预览" :visible.sync="picshow" width="50%">
      <img :src="previewURL" class="img" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      stup_: 0,
      addForm_: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        //图片数组
        pics: [],
        //商品描述
        goods_introduce: "",
        attrs: [],
      },
      //商品参数数据
      addForm_Rules: {
        goods_name: [
          {
            required: true,
            trigger: "blur",
            message: "必填",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "必填",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "必填",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "必填",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "必填",
            trigger: "blur",
          },
        ],
      },
      //商品列表
      cateList: [],
      selectcateList: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      manyTabData: [],
      onlyTabData: [],
      upURL: "http://42.192.40.14:8889/api/private/v1/upload",
      headerobj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewURL: "",
      picshow: false,
    };
  },
  mounted() {
    this.getshoplist_();
  },
  methods: {
    addForm() {},
    async getshoplist_() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }

      this.$message.success("获取商品列表成功");
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    async selectedchange_() {
      // console.log(this.addForm_.goods_cat);
      if (this.addForm_.goods_cat.length !== 3) {
        this.addForm_.goods_cat = [];
        return;
      }
    },
    //切换tab前触发
    beforeTabLeave(newtab, oldtab) {
      // console.log(newtab, oldtab);
      if (oldtab == 0 && this.addForm_.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    //tab切换时触发
    async tabchange() {
      //v-model	stup_  绑定值，选中选项卡的 name
      // console.log(this.stup_);
      if (this.stup_ == 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes/`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败");
        }
        // console.log(res.data);
        //在赋值之前做一次循环让数据变成数组
        res.data.forEach((i) => {
          i.attr_vals = i.attr_vals.length == 0 ? [] : i.attr_vals.split(",");
        });
        //在赋值之前做一次循环让数据变成数组
        this.manyTabData = res.data;
      } else if (this.stup_ == 2) {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes/`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败");
        }
        this.onlyTabData = res.data;
        console.log(this.onlyTabData);
      }
    },
    //点击图片时触发预览效果函数
    handlePreview(v) {
      // console.log(v);
      this.previewURL = v.response.data.url;
      this.picshow = true;
    },
    //点x删除图片时触发
    handleRemove(v) {
      //图片的临时路径
      const fp = v.response.data.tmp_path;
      //从图片的临时路径中findIndex()找到对应的索引值
      const i = this.addForm_.pics.findIndex((x) => {
        x.pic == v;
      });
      //用splice删除
      this.addForm_.pics.splice(i, 1);
    },
    add() {
      this.$refs.addForm_Ref.validate(async (v) => {
        if (!v) {
          return this.$message.error("填写必要的字段");
        } else {
          //文档要求goods_cat需要是以,连接的字符串
          //lodash依赖  cloneDeep(obj)
          const addlist = _.cloneDeep(this.addForm_);
          addlist.goods_cat = addlist.goods_cat.join(",");
          //处理动态参数
          this.manyTabData.forEach((i) => {
            const newInfo = {
              attr_id: i.attr_id,
              attr_value: i.attr_vals.join(","),
            };
            this.addForm_.attrs.push(newInfo);
          });
          //处理静态属性
          this.onlyTabData.forEach((i) => {
            const newInfo = {
              attr_id: i.attr_id,
              attr_value: i.attr_vals,
            };
            this.addForm_.attrs.push(newInfo);
          });
          addlist.attrs = this.addForm_.attrs;

          //发起请求
          const { data: res } = await this.$http.post(`goods`, addlist);
          if (res.meta.status !== 201) {
            return this.$message.error("提交失败");
          }

          this.$message.success("提交成功");
          //成功后跳转页面
          this.$router.push("/goods");
        }
      });
    },
    successed(res) {
      console.log(res);
      const picInfo = {
        pic: res.data.tmp_path,
      };
      this.addForm_.pics.push(picInfo);
      console.log(this.addForm_);
    },
  },
  computed: {
    cateId() {
      if (this.addForm_.goods_cat.length == 3)
        return this.addForm_.goods_cat[2];
    },
  },
};
</script>

<style scoped lang="less">
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-style: 12px;
}
.el-checkbox {
  margin: 0 10px !important;
}
.img {
  width: 100%;
}
</style>
