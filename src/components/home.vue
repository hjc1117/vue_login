<template>
  <div>
    <el-button type="info" @click="tuichu">退出登录</el-button>
  </div>
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

<style lang="less" scope></style>
