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
      <el-aside :width="isshow ? '64px' : '200px'">
        <!-- 侧边栏展开合并 -->
        <div class="toggle" @click="toggle">
          <i
            :class="[isshow ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left']"
          ></i>
        </div>
        <el-menu
          text-color="#fff"
          active-text-color="rgb(54, 155, 255)"
          unique-opened
          :collapse="isshow"
          :collapse-transition="false"
          router
          :default-active="actpath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="'/' + item.path"
            v-for="item in menulist"
            :key="item.id"
            ><!--index只接收字符串，所以要将item.id转化成字符串-->
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icon_[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <!--router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
            <el-menu-item
              :index="'/' + sitem.path"
              v-for="sitem in item.children"
              :key="sitem.id"
              @click="savesession('/' + sitem.path)"
              ><template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ sitem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      icon_: {
        "125": "el-icon-s-custom",
        "103": "el-icon-key",
        "101": "el-icon-shopping-cart-2",
        "102": "el-icon-paperclip",
        "145": "el-icon-toilet-paper",
      },
      isshow: false,
      actpath: "",
    };
  },
  created() {
    //钩子函数  创造实例后调用
    this.getlist();
    this.actpath = window.sessionStorage.getItem("v");
  },
  methods: {
    tuichu() {
      window.sessionStorage.clear(); //清除token
      this.$router.push("/login"); //重定向到登录页面
    },
    async getlist() {
      //获取所有菜单
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      } else {
        this.menulist = res.data;
      }
      // console.log(res);
    },
    toggle() {
      this.isshow = !this.isshow;
    },
    savesession(v) {
      window.sessionStorage.setItem("v", v);
      this.actpath = v;
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
  color: rgb(224, 224, 224);
  left: 10px;
}
.el-container {
  height: 99.99%;
}
.el-header {
  background-color: rgb(38, 51, 56);
  height: 120px !important;
  .el-button {
    float: right;
    margin-top: 40px;
  }
}

.el-main {
  background-color: 255, 255, 255;
}
.el-aside,
.el-menu,
.el-menu li {
  background-color: rgb(9, 91, 124) !important;
}
.el-menu {
  width: 100%;
  border-right: none;
}
.el-menu--collapse {
  border-right: none !important;
}
.el-aside {
  overflow-x: hidden !important;
  transition: all 0.2s;
}
.toggle {
  background-color: rgb(36, 44, 47);
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-icon-d-arrow-left {
    color: rgb(0, 255, 34);
  }
  .el-icon-d-arrow-right {
    color: rgb(37, 235, 235);
  }
}
</style>
