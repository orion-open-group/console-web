<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import {login} from "@/api/data"
import routers from "@/router/routers";
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
    ]),
    handleSubmit ({ userName, password }) {
      login({ userName, password }).then(res => {
        if(res.data.code="200") {
          localStorage.setItem("token",res.data.data.token);
          this.$router.push({name:"schedule"});
        }
      })
    }
  }
}
</script>

<style>

</style>
