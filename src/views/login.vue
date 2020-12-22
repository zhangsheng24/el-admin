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
          type="text"
          placeholder="验证码"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" />
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
          :loading='loading'
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Background from "@/assets/images/background.jpg";
import api from "@/api";
import { encrypt, decrypt } from "@/utils/rsaEncrypt";
import { CgetItem, CsetItem, CreItem } from "@/utils/storage";
import config from "@/config";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
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
      loading:false,
      redirect:undefined
    };
  },
  watch:{
    $route:{
      handler:function(route){
        // 如果你要跳转到user这个页面，但是此时没有token,就跳转到登录页，并且给登录页添加redirect参数，重新登录就会跳转到user，而不是根路径
        /**
         * 只要to也就是要访问的地址不在白名单当中，我们就让他重新跳转到登录页，并且收集此时地址的path
            next({ path: `/login?redirect=${to.path}` })
         */
        this.redirect=route.query && route.query.redirect
      },
      immediate:true
    }
  },
  created() {
    // 获取验证码
    this.getCode();
    // 用户通过某个方式跳转到登录页面，先去cookie中获取用户名和密码等，是否能获取到取决于是否点击记住我
    this.getCookieInfo();
  },
  methods: {
    // 获取验证码
    getCode() {
      api("login.getCode").then((res) => {
        this.codeUrl = res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    // 点击登录
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
            this.loading = true
          // 记住我
          if (user.rememberMe) {
            CsetItem("username", user.username, {
              expires: config.passCookieExpires,
            });
            CsetItem("password", user.password, {
              expires: config.passCookieExpires,
            });
            CsetItem("rememberMe", user.rememberMe, {
              expires: config.passCookieExpires,
            });
          } else {
            CreItem("username");
            CreItem("password");
            CreItem("rememberMe");
          }
          this.$store
            .dispatch("Login", user)
            .then(() => {
                this.loading = false
                this.$router.push({path:this.redirect || '/'})
            })
            .catch((err) => {
                this.loading = false
                this.getCode()
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取cookie保存的用户登录信息
    getCookieInfo() {
      let username = CgetItem("username");
      let password = CgetItem("password"); // 保存cookie里面的加密后的密码
      let rememberMe = CgetItem("rememberMe");
      username = username === undefined ? this.loginForm.username : username;
      password = password === undefined ? this.loginForm.password : decrypt(password);//解密
      // console.log(rememberMe)cookie存的时候会自动吧true变成'true'，取的时候get拿到的也是'true'，需要转一下
      //如果存的是json字符串，就JSON.parse()
      rememberMe = rememberMe === undefined ? this.loginForm.rememberMe : Boolean(rememberMe);
      this.loginForm = {
        username,
        password,
        code: "",
        rememberMe
      };
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