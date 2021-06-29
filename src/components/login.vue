<!-- 模板 -->
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="login_img">
        <img src="../assets/logo1.jpg" alt="" />
      </div>
      <!-- 表单区 -->
      <el-form
        ref="login_formater"
        label-width="0px"
        class="log_form"
        :model="login_form"
        :rules="yanzheng"
      >
        <!-- 用户 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="login_form.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            v-model="login_form.password"
            @change="login"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="success" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<!--行为-->
<script>
export default {
  data() {
    return {
      login_form: {
        username: "admin",
        password: "123456",
      },
      yanzheng: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLogin() {
      console.log(this); //ref 接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property.value   $refs
      // this.$refs.login_formater.resetFields();
      this.login_form.username = "";
      this.login_form.password = "";
    },
    login() {
      this.$refs.login_formater.validate(async (v) => {
        //v 首个参数为布尔值 第二个为object
        //validate对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
        // console.log(v);
        if (v == false) {
          return;
        } else {
          const result = await this.$http.post("login", this.login_form);
          // console.log(result.data);
          if (result.data.meta.status !== 200) {
            return this.$message.error("登陆失败");
          } else {
            this.$message.success("登陆成功");
            window.sessionStorage.setItem("token", result.data.data.token);
            this.$router.push("/home");
          }
        }
      });
    },
  },
};
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
    .btns {
      float: right;
    }
    .log_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
    }
    .login_img {
      width: 130px;
      height: 130px;
      border-radius: 50% 50%;
      overflow: hidden;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #eee;
      box-shadow: #eee;
      img {
        height: 100%;
        position: relative;
        left: 40px;
        transform: scale(2.5);
      }
    }
  }
}
</style>
