<!-- 模板 -->
<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_img">
        <img src="" alt="" />
      </div>
    </div>
  </div>
</template>

<!--行为-->
<script>
export default {};
</script>

<!--样式-->
<style lang="less" scoped>
/* scoped  定义样式的作用域  有就是局部 
lang='less' 确定支持less*/
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
