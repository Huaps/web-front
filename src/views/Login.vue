<template>
<v-app class="gradient-background">


<v-main class="align-self-center" max-width="1000px">
  <!-- main content -->
  <div class="fill-height d-flex flex-row flex-wrap">
    <!-- input -->
    <div style="width: 420px;" class="ml-16 align-self-center">
      <p class="text-h4 font-weight-black mb-10">欢迎使用好乡镇</p>
      <!-- username -->
      <p>用户名</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required]"
        v-model="Input.usr"
        prepend-inner-icon="mdi-account-outline"
      />
      <!-- password -->
      <p>密码</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required]"
        v-model="Input.pwd"
        :append-inner-icon="Input.vis ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :type="Input.vis ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="Input.vis = !Input.vis"
      />
      <!-- login -->
      <v-btn color="blue-accent-3" variant="elevated" class="mt-4" width="410px"
        :disabled="Input.pwd.length == 0"
        @click="login"
        >
        <p class="font-weight-bold">登录</p>
      </v-btn>
      <!-- register -->
      <v-spacer class="my-4"></v-spacer>
      <v-btn color="grey-darken-3" variant="outlined" class="" width="410px" @click="targetRegister">
        <v-icon size="large" icon="mdi-account-plus"/>
        <p class="font-weight-bold ml-1">注册</p>
      </v-btn>
    </div>


  </div>
</v-main>
</v-app>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/util/Logo.vue';

import * as QUERY from '@/plugins/query'
import * as Events from '@/plugins/event'

const Router = useRouter();

const Input = reactive({
  usr : '',
  pwd : '',
  vis : false
})

function targetRegister() {
  Input.usr = '';
  Input.pwd = '';
  Input.vis = false
  Router.push('/register');
}

const rules = {
  required: (value) => !!value || '不能为空'
}

const assert = computed(() => {
  return rules.required(Input.usr) === true && rules.required(Input.pwd) === true;
})

function login() {
  if (!assert.value) {
    Events.err('用户名或密码不能为空')
    return;
  }

  QUERY.post('/api/user/login',{
    username: Input.usr,
    password: Input.pwd
  })
  .then(res => {

      if(res.code == 1){
        QUERY.set_user_name(Input.usr);
        QUERY.set_user_id(res.data.user_id);

        console.log(res);
        console.log(res.data.user_id);
      if(res.data.user_id == "1"||Input.usr == "admin")
        Router.push('/admin');
      else {
        Events.info('登录成功,正在跳转')
        setTimeout(()=>{
          Router.push('/home');
        },1000);
      }
    }
      else{
        // 登录失败
        Events.err('密码错误')
      }

  })
}


</script>
<style scoped>
.gradient-background {
  background: linear-gradient(220.55deg, #FFF6EB 0%, #DFD1C5 100%);
  background-size: 400% 400%;
  animation: gradientAnimation 8s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
