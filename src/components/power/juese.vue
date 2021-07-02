<template>
  <div>
    <!-- 头部导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色权限详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!--  添加角色按钮-->
      <el-row>
        <el-col>
          <el-button type="success" @click="addjuese = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表表格 -->
      <el-table :data="alljuese" border stripe>
        <!-- 展开 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdb', index1 == 0 ? 'bdt' : '', 'vc']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removelevel(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级/三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 == 0 ? '' : 'bdt', 'vc']"
                >
                  <!-- 左列二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removelevel(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 右列三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removelevel(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 展示 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <div>
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
                  content="分配权限"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="success"
                    icon="el-icon-setting"
                    @click="showSetRight(scope.row)"
                    >分配权限</el-button
                  >
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色弹框模板 -->
      <el-dialog
        title="添加用户"
        :model="addjueseForm"
        :visible.sync="addjuese"
        width="50%"
        :rules="addjueseFormRules"
        ref="addjueseFormRef"
      >
        <el-form :model="addjueseForm" ref="addjueseFormRef" label-width="70px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addjueseForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addjueseForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addjuese = false">取 消</el-button>
        <el-button type="primary" @click="addjuese_">确 定</el-button>
      </el-dialog>

      <!-- 修改角色弹框模板 -->
      <el-dialog title="修改信息" :visible.sync="changejuesestate" width="50%">
        <el-form
          :model="changejueseForm"
          :rules="changejueseFormRules"
          ref="changejueseFormRef"
          label-width="70px"
        >
          <el-form-item label="角色名称">
            <el-input v-model="changejueseForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="email">
            <el-input v-model="changejueseForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="changejuesestate = false">取 消</el-button>
        <el-button type="primary" @click="changejuese_">确 定</el-button>
      </el-dialog>

      <!-- 分配权限弹框模板 -->
      <el-dialog
        title="提示"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setrightclose_"
      >
        <!-- 展示数据控件 -->
        <el-tree
          :data="rightslist"
          show-checkbox
          default-expand-all
          :props="treeProps"
          node-key="id"
          :default-checked-keys="defkey"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alljuese: [],
      //权限列表
      rightslist: [],
      //树形控件绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认勾选的节点的id的数组
      defkey: [],
      addjuese: false,
      setRightDialogVisible: false,
      //双向绑定的添加数据
      addjueseForm: {
        roleName: "",
        roleDesc: "",
      },
      //   添加角色校验
      addjueseFormRules: {
        roleName: {
          required: true,
          message: "输入角色名",
          trigger: "blur",
        },
        roleDesc: {
          required: true,
          message: "输入职位",
          trigger: "blur",
        },
      },
      //修改角色校验
      changejueseFormRules: {
        roleName: {
          required: true,
          message: "输入角色名",
          trigger: "blur",
        },
        roleDesc: {
          required: true,
          message: "输入职位",
          trigger: "blur",
        },
      },
      changejueseForm: {},
      changejuesestate: false,
      //即将分配权限的角色id
      roleId: "",
    };
  },
  created() {
    this.getalljuese();
  },
  methods: {
    //   获取角色列表
    async getalljuese() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.alljuese = res.data;
    },
    // 向服务器发送添加数据并将得到的返回值添加到网页中
    addjuese_() {
      this.$refs.addjueseFormRef.validate(async (v) => {
        if (!v) {
          return;
        } else {
          const { data: res } = await this.$http.post(
            "roles",
            this.addjueseForm
          );
          console.log(res);
          if (res.meta.status !== 201) {
            return this.$message.error("添加角色失败");
          } else {
            this.getalljuese();
            this.$message.success("添加成功");
            this.addjuese = false;
            this.addjueseForm.roleName = "";
            this.addjueseForm.roleDesc = "";
          }
        }
      });
    },
    async showbianji(v) {
      //   console.log(v);
      const { data: res } = await this.$http.get("roles/" + v);
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.changejueseForm = res.data;
      this.changejuesestate = true;
    },
    changejuese_() {
      this.$refs.changejueseFormRef.validate(async (v) => {
        if (!v) {
          return;
        } else {
          const { data: res } = await this.$http.put(
            "roles/" + this.changejueseForm.roleId,
            {
              roleName: this.changejueseForm.roleName,
              roleDesc: this.changejueseForm.roleDesc,
            }
          );
          //   console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("添加失败");
          }

          this.changejuesestate = false;
          this.getalljuese();
          this.$message.success("添加成功");
        }
      });
    },
    async remove(v) {
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
      const { data: res } = await this.$http.delete("roles/" + v);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getalljuese();
    },
    //删除一/二/三级权限
    async removelevel(role, rightid) {
      const confirmres = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmres !== "confirm") {
        return this.$message.info("取消删除");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色权限失败");
      }
      role.children = res.data; //响应数据说明:返回的data, 是当前角色下最新的权限数据  直接赋值即可刷新
    },
    //展示分配权限对话框
    async showSetRight(role) {
      this.roleId = role.id;
      //获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色权限失败");
      }
      //获取到数据后 赋值给定义好的数组
      this.rightslist = res.data;
      this.getkeys(role, this.defkey);
      this.setRightDialogVisible = true;
    },
    //通过递归得到id并保存到defkey数组中
    getkeys(node, arr) {
      //如果该节点没有children属性 则证明该节点为三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getkeys(item, arr);
      });
    },
    //权限对话框关闭时触发
    setrightclose_() {
      this.defkey = [];
    },
    //点击确定为角色分配权限
    async allotRights() {
      //以 `,` 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes(),
      ];
      console.log(this.$refs.treeRef.getCheckedKeys());
      const idstr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idstr,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改角色权限失败");
      }
      this.$message.success("修改权限成功");
      this.getalljuese();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scope>
.el-tag {
  margin: 10px;
}
.bdb {
  border-bottom: 1px solid #eee;
}
.bdt {
  border-top: 1px solid #eee;
}
.vc {
  display: flex;
  align-items: center;
}
</style>
