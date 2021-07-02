<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索添加区 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="userlis.query"
            @clear="getuserList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="getuserList">
            </el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addstate = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <template>
        <el-table :data="userlist_" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180">
          </el-table-column>
          <el-table-column prop="mobile" label="电话" width="180">
          </el-table-column>
          <el-table-column prop="role_name" label="角色" width="180">
          </el-table-column>
          <el-table-column prop="mg_state" label="状态" width="180">
            <template slot-scope="scope">
              <!-- solt定义插槽 
                scope 属性定义将表头单元与数据单元相关联的方法。
                scope 属性标识某个单元是否是列、行、列组或行组的表头。
                scope 属性不会在普通浏览器中产生任何视觉变化。
                通过属性值 row，表头行包括的所有表格都将和表头单元格联系起来。指定 col，会将当前列的所有单元格和表头单元格绑定起来。-->
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStateChanged(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <!-- 修改 -->
                <el-tooltip
                  effect="dark"
                  content="编辑角色"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="showbianji(scope.row.id)"
                  ></el-button>
                </el-tooltip>
                <!-- 删除 -->
                <el-tooltip
                  effect="dark"
                  content="删除角色"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="remove(scope.row.id)"
                  ></el-button>
                </el-tooltip>
                <!-- 分配 -->
                <el-tooltip
                  effect="dark"
                  content="分配角色"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="success"
                    icon="el-icon-setting"
                    @click="setRole(scope.row)"
                  ></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userlis.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="userlis.pagesize"
          :total="total_"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>

        <!-- 添加用户 -->
        <el-dialog title="添加用户" :visible.sync="addstate" width="50%">
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="70px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="addstate_">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </el-dialog>

        <!-- 修改用户 -->
        <el-dialog
          title="修改信息"
          :visible.sync="changestate"
          width="50%"
          @close="changeuser"
        >
          <el-form
            :model="editForm"
            :rules="editFormRules"
            ref="editFormRef"
            label-width="70px"
          >
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="chengestate_">取 消</el-button>
          <el-button type="primary" @click="changeuser_">确 定</el-button>
        </el-dialog>

        <!-- 分配角色模板 -->
        <el-dialog
          title="分配角色"
          :visible.sync="setRoleDialogVisible"
          width="50%"
        >
          <div>
            <p>当前用户:{{ userinfo.username }}</p>
            <p>当前角色:{{ userinfo.role_name }}</p>
            <p>
              分配角色:
              <el-select v-model="selectid" placeholder="请选择">
                <el-option
                  v-for="item in jueselist"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveroleinfo">确 定</el-button>
          </span>
        </el-dialog>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取用户参数列表对象
      userlis: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist_: [],
      total_: 0,
      addstate: false, //显示隐藏创建用户弹出框的判断值
      changestate: false, //显示隐藏修改用户弹出框的判断值
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {},
      // 添加用户校验
      addFormRules: {
        username: [
          {
            required: true,
            message: "输入用户名",
            trigger: "blur",
          },
          { min: 3, max: 10, message: "3-10位长度用户名", trigger: "blur" },
        ],
        password: [
          {
            required: true,
            message: "输入密码",
            trigger: "blur",
          },
          { min: 3, max: 10, message: "6-15位长度密码", trigger: "blur" },
        ],
        email: [
          {
            required: true,
            message: "输入邮箱",
            trigger: "blur",
            type: "email",
          },
        ],
        mobile: [
          {
            required: true,
            message: "输入手机号",
            trigger: "blur",
          },
        ],
      },
      // 修改用户校验
      editFormRules: {
        username: [
          {
            required: true,
            message: "输入用户名",
            trigger: "blur",
          },
          { min: 3, max: 10, message: "3-10位长度用户名", trigger: "blur" },
        ],
        email: [
          {
            required: true,
            message: "输入邮箱",
            trigger: "blur",
            type: "email",
          },
        ],
        mobile: [
          {
            required: true,
            message: "输入手机号",
            trigger: "blur",
          },
        ],
      },
      //分配角色对话框的显示与隐藏开关
      setRoleDialogVisible: false,
      //需要被分配角色的用户信息
      userinfo: {},
      //所有角色数据列表
      jueselist: [],
      //分配角色双向绑定的id值
      selectid: "",
    };
  },
  created() {
    this.getuserList();
  },
  methods: {
    async getuserList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.userlis,
      });
      //   console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.userlist_ = res.data.users;
      this.total_ = res.data.total;
    },
    handleSizeChange(newsize) {
      console.log(newsize);
      this.userlis.pagesize = newsize;
      this.getuserList();
    },
    handleCurrentChange(newpage) {
      //   console.log(newpage);
      this.userlis.pagenum = newpage;
      this.getuserList();
    },
    async userStateChanged(s) {
      //监听swish状态的改变
      //   console.log(s);
      const { data: res } = await this.$http.put(
        `users/${s.id}/state/${s.mg_state}`
      );
      if (res.meta.status !== 200) {
        s.mg_state = !s.mg_state;
        return this.$message.error("修改状态失败");
      }
      //   console.log(res);
    },
    addstate_() {
      this.addstate = false;
      this.addForm.username = "";
      this.addForm.password = "";
      this.addForm.email = "";
      this.addForm.mobile = "";
    },
    chengestate_() {
      this.changestate = false;
    },
    adduser() {
      this.$refs.addFormRef.validate(async (valid) => {
        //	对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
        // console.log(v); //布尔值
        // console.log(this.$http.post("users", this.addForm));
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.post("users", this.addForm);
          if (res.meta.status !== 201) {
            return this.$message.error("添加失败");
          } else {
            this.$message.success("添加成功");
            this.addstate = false;
            this.addForm.username = "";
            this.addForm.password = "";
            this.addForm.email = "";
            this.addForm.mobile = "";
          }
        }
      });
    },
    async showbianji(v) {
      //   console.log(v);
      const { data: res } = await this.$http.get("users/" + v);
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.editForm = res.data;
      this.changestate = true;
    },
    changeuser() {
      this.$refs.editFormRef.resetFields();
    },
    changeuser_() {
      this.$refs.editFormRef.validate(async (v) => {
        if (!v) {
          return;
        } else {
          const { data: res } = await this.$http.put(
            "users/" + this.editForm.id,
            { email: this.editForm.email, mobile: this.editForm.mobile }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("添加失败");
          }

          this.changestate = false;
          this.getuserList();
          this.$message.success("添加成功");
        }
      });
    },
    async remove(v) {
      const confirm_ = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirm_);
      //点确认返回confirm 点取消返回cancle
      if (confirm_ !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + v);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getuserList();
    },
    async setRole(userinfo) {
      this.userinfo = userinfo;
      //获取所有角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.jueselist = res.data;
      this.setRoleDialogVisible = true;
    },
    //点击确定发送分配角色数据
    async saveroleinfo() {
      if (!selectid) {
        return this.$message.error("选择要分配的角色");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userinfo.id}/role`,
        {
          rid: this.selectid,
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("更新角色信息失败");
      }
      this.$message.success("更新角色信息成功");
      this.getuserList();
      setRoleDialogVisible = false;
      this.userinfo = {};
      this.selectid = "";
    },
  },
};
</script>

<style lang="less" scope>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>
