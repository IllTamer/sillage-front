<template>
  <div class="layout">
    <el-tabs type="border-card">
      <el-tab-pane label="登录">
        <el-form
          label-position="right"
          label-width="60px"
          style="max-width: 460px"
          class="loginForm"
        >
          <el-form-item label="账号：">
            <el-input v-model="username" />
          </el-form-item>
          <el-form-item label="密码：">
            <el-input type="password" v-model="password" />
          </el-form-item>
          <el-row>
            <el-checkbox class="checkBox" v-model="echo" label="同意用户使用准则" name="type"/>
          </el-row>
          <el-button v-if="echo" type="primary" class="loginBtn" @click="login">
            登录
          </el-button>
        </el-form>
      </el-tab-pane>

      <!-- <el-tab-pane label="注册"> -->
        <!-- <el-form
          label-position="right"
          label-width="100px"
          style="max-width: 460px"
          class="loginForm"
        >
          <el-form-item label="邮箱：">
            <el-input v-model="rEmail" />
          </el-form-item>
          <el-form-item label="密码：">
            <el-input type="password" v-model="rPassword" />
          </el-form-item>
          <el-form-item label="确认密码：">
            <el-input
              type="password"
              v-model="confirmPassword"
              @blur="confirmFunc"
            />
          </el-form-item>
          <el-form-item label="验证码：">
            <el-row>
              <el-input
                type="password"
                v-model="identifyCode"
                class="inpWidth"
              />
              <el-button type="primary" @click="getIdentifyCode" plain>
                获取验证码
              </el-button>
            </el-row>
          </el-form-item>

          <el-row>
            <el-checkbox
              class="checkBox"
              v-model="rAgree"
              label="同意用户使用准则"
              name="type"
            />
          </el-row>
          <el-button
            v-if="rAgree"
            type="primary"
            class="loginBtn"
            @click="register"
          >
            注册
          </el-button>
        </el-form>-->
      <!-- </el-tab-pane>  -->
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref, onBeforeMount, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage } from "element-plus"; 
	import { Axios, headers } from '../../ts/axios';
  import { APIHref, resetSetItem } from '../../ts/export';

  const router = useRouter();
  const username: Ref<string> = ref('');
  const password: Ref<string> = ref('');
  const echo: Ref<boolean> = ref(false);
  
  function login() {
    Axios
      .post(`/${APIHref.USER}/login`, {
        'username': username.value,
        'password': password.value
      }).then((response) => {
        const resp: Resp = response.data;
        if (resp.status == 0) {
          headers['token'] = resp.data.token;
          localStorage.setItem('token', resp.data.token)
          ElMessage.success({ 
            duration: 2000,
            message: '登陆成功，两秒后跳转' 
          });
          setTimeout(() => {
            resetSetItem('admin', true);
            router.push({ name: 'blogAdmin' });
          }, 2000);
        } else {
          ElMessage.error(`登录失败，状态码: ${resp.status}`);
          console.error(resp);
        }
      });
  }
  // 注册
  // function register() {
  //   console.log("注册", registerForm);
  // }
  // 获取验证码
  // function getIdentifyCode() {
  //   console.log("获取验证码");
  // }
  // 确认密码
  // function confirmFunc() {
  //   if (registerForm.confirmPassword !== registerForm.rPassword)
  //     alert("密码与确认密码不一致");
  // }
  // const confirmFunc = () => {
  //   if (registerForm.confirmPassword !== registerForm.rPassword)
  //     ElMessage.error("密码与确认密码不一致.");
  // };
</script>

<style scoped lang="less">
.layout {
  // position: absolute;
  margin: 200px 0;
  margin-left: calc(50% - 200px);
  top: 20%;
  width: 400px;
}
.loginBtn {
  width: 100px;
}
.loginForm {
  text-align: center;
}
.checkBox {
  margin-left: 7px;
}
.inpWidth {
  width: 165px;
}
</style>