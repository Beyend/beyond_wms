<template>
        <div class="login">
        <img src="../assets/img/loginbg.png" alt="">
            <div class="loginInner">
                <div class="login-form">
                    <h3 style="font-size:20px;color:#636c72;" align="center">Backstage Management System</h3>
                    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px">
                                <el-form-item label="用户名" prop="username">
                                    <el-input type="text" v-model="form.username" clearable></el-input>
                                </el-form-item>
                          
                                <el-form-item label="密码" prop="password">
                                    <el-input type="password" v-model="form.password" clearable></el-input>
                                </el-form-item>

                                <el-form-item label="验证码" required>
                                    <el-input type="text" placeholder="请输入图片验证码" v-model="inputCode" style="width:330px;" clearable></el-input>
                                    <img :src="'data:image/png;base64,'+imgcode" alt="点击刷新" @click="getImgCode" style="width:70px;height:30px;margin-left:350px;"/>
                                </el-form-item>
                        <div class="btn-submit"><p><el-button type="primary" @click="submitForm('form')">提交</el-button></p></div>
                    </el-form>
                </div>
            </div>
        </div>
</template>

<script>

import { forward } from "./../mixin/forward.js";
import { Loading } from "element-ui";
export default {
  mixins: [forward],
  components: { Loading },
  data() {
    return {
      form: {
        username: null,
        password: null
      },
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      merchant: {
        username: null,
        password: null
      },
      inputCode: null,
      imgcode: null,
      returnCode:null
    };
  },
  created() {
    this.getImgCode();
  },
  methods: {
    submitForm(formName) {
      if(null == this.inputCode || "" == this.inputCode){
         this.$message({
                    message: '请输入验证码',
                    type: 'warning',
                    center: true
                });
                    return;
      }
      if(this.inputCode.toLowerCase() != this.returnCode.toLowerCase()){
        this.$message({
                    message: '请输入正确验证码',
                    type: 'warning',
                    center: true
                });
                    return;
      }
        this.$refs[formName].validate(valid => {
          if (valid) {
            let loadingInstance = Loading.service({ fullscreen: true });
            this.$post("userLogin", this.form)
              .then(res => {
                  localStorage.setItem("token", res.token);
                  localStorage.setItem("e", true);
                  this.forward();
                  localStorage.setItem("name", res.username);
                loadingInstance.close();
              })
              .catch(() => {
                loadingInstance.close();
              });
          } else {
            return false;
          }
        });
    },
    checkImgCode(){
        if(!this.imgCodeNum){
              return;
        }
    },
    getImgCode() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$get("validateCode").then(res => {
        this.imgcode = res.base64Str;
        this.returnCode = res.value;
        loadingInstance.close();
      }).catch(() => {
        loadingInstance.close();
      });
    },
  }
};
</script>

<style lang="less">
@import "../style/teaend.less";
.login {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
  .loginInner {
    .login-form {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 50%;
      width: 574px;
      height: 339px;
      background: rgba(255,255,255,.7);
      box-shadow: 0px 2px 20px 0px rgba(178, 191, 204, 1);
      border-radius: 8px;
      padding: 65px 0 0 50px;
      margin-top: -200px;
      .xt-name {
        text-align: center;
        font-weight: 400;
        font-size: 24px;
        line-height: 70px;
        margin: 0;
        border-bottom: 1px solid #d8dce5;
        margin-bottom: 25px;
      }
      input {
        width: 340px;
        margin: 0 auto;
      }
      .btn-submit {
        text-align: center;
        margin-bottom: 25px;
        .el-button {
          width: 100px;
        }
      }
    }
  }
}
</style>