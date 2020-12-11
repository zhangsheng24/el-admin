<template>
  <div class="login" :style="'background-image:url(' + Background + ')'">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">EL-ADMIN 后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" placeholder="账号">
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="密码"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          style="width: 63%"
          type="password"
          placeholder="验证码"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 0">
        记住我
      </el-checkbox>
      <el-form-item>
        <el-button
          style="width: 100%"
          size="medium"
          type="primary"
          @click.native.prevent="handleLogin"
        >
          <span>登 录</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Background from "@/assets/images/background.jpg";
import api from "@/api";
import { encrypt } from "@/utils/rsaEncrypt.js";
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
        code: "",
        uuid: "",
        rememberMe: false,
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        code: [
          { required: true, trigger: "change", message: "验证码不能为空" },
        ],
      },
      codeUrl: "",
      Background: Background,
    };
  },
  created() {
    //获取验证码
    this.getCode();
  },
  methods: {
    getCode() {
      api("login.getCode").then((res) => {
        this.codeUrl = res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        const user = {
          username: this.loginForm.username,
          password: encrypt(this.loginForm.password),
          rememberMe: this.loginForm.rememberMe,
          code: this.loginForm.code,
          uuid: this.loginForm.uuid,
        };
        if (valid) {
          this.$store.dispatch("Login", user)
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
  .login-form {
    width: 385px;
    background: #fff;
    padding: 25px 25px 5px;
    border-radius: 6px;
    .title {
      color: #707070;
      text-align: center;
      margin: 0 auto 30px;
    }
    .login-code {
      width: 33%;
      height: 38px;
      float: right;
      img {
        vertical-align: middle;
      }
    }
  }
}
</style>