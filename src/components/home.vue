<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="head_box">
        <img src="../assets/logo2.jpg" alt="" />
      </div>
      <span class="font_">전자상붐관리시스탬</span>

      <el-button type="info" @click="tuichu"> 退出登录</el-button>
    </el-header>
    <!-- 主题 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside width="200px">
        <el-menu text-color="#fff" active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>导航一</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1"
              ><template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>导航2</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    tuichu() {
      window.sessionStorage.clear(); //清除token
      this.$router.push("/login"); //重定向到登录页面
    },
  },
};
</script>

<style lang="less" scope>
.head_box {
  height: 100px;
  width: 100px;
  overflow: hidden;
  position: relative;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  img {
    position: absolute;
    top: -15px;
    left: 40%;
    transform: translate(-50%);
    width: 120px;
  }
}
.font_ {
  font-size: 26px;
  position: relative;
  color: rgb(114, 110, 110);
  left: 10px;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: skyblue;
  height: 120px !important;
  .el-button {
    float: right;
    margin-top: 40px;
  }
}

.el-main {
  background-color: rgb(156, 152, 152);
}
.el-aside,
.el-menu,
.el-menu li {
  background-color: rgb(9, 91, 124) !important;
}
</style>
