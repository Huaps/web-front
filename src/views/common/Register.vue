<template>
<v-app class="gradient-background">
<v-main class="d-flex flex-column">
  <!-- main content -->
  <v-container fluid class="fill-height d-flex flex-row justify-center">
    <!-- input -->
    <div style="width: 420px;" class="align-self-center">
      <p class="text-h4 font-weight-black mb-6">成为好乡镇的贡献者</p>

      <!-- username -->
      <p>用户名</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required]"
        v-model="Input.usr"
        prepend-inner-icon="mdi-account-outline"
      />

      <!-- real name -->
      <p>真实姓名</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required]"
        v-model="Input.realName"
        prepend-inner-icon="mdi-account-circle-outline"
      />

      <!-- document type -->
      <p>证件类型</p>
      <v-select variant="outlined" density="compact"
        :items="docTypes"
        :rules="[rules.required]"
        v-model="Input.docType"
        prepend-inner-icon="mdi-card-text-outline"
      />

      <!-- document number -->
      <p>证件号码</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required]"
        v-model="Input.docNumber"
        prepend-inner-icon="mdi-card-account-details-outline"
        type="text"
      />

      <!-- phone number -->
      <p>联系方式</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required, rules.lim]"
        v-model="Input.phone"
        prepend-inner-icon="mdi-cellphone-link"
        type="number"
        hide-spin-buttons
      />

      <!-- password -->
      <p>密码</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.min, rules.number, rules.alpha]"
        v-model="Input.pwd"
        :append-inner-icon="Input.vis1 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :type="Input.vis1 ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="Input.vis1 = !Input.vis1"
      />

      <!-- confirm password -->
      <p>确认密码</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required, rules.match]"
        v-model="Input.pwd2"
        :append-inner-icon="Input.vis2 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :type="Input.vis2 ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-alert-outline"
        @click:append-inner="Input.vis2 = !Input.vis2"
      />

      <!-- user bio -->
      <p>用户简介</p>
      <v-textarea variant="outlined" density="compact"
        :rules="[rules.required]"
        v-model="Input.bio"
        prepend-inner-icon="mdi-text"
        rows="3"
      />

      <!-- register -->
      <v-btn color="green-darken-1" variant="elevated" class="mt-4" width="420px"
        :disabled="!assert"
        @click="register"
        >
        <p class="font-weight-bold">注册</p>
      </v-btn>

      <!-- register -->
      <v-spacer class="my-4"></v-spacer>
      <v-btn color="grey-darken-3" variant="outlined" class="" width="420px" @click="targetLogin">
        <v-icon size="large" icon="mdi-account"/>
        <p class="font-weight-bold ml-1">立即登录</p>
      </v-btn>
    </div>

  </v-container>

</v-main>
</v-app>
</template>

<script setup>
import {ref, reactive, computed} from 'vue';
import {useRouter} from 'vue-router';
import Logo from '@/components/util/Logo.vue';
import * as QUERY from '@/plugins/query'
import * as Events from '@/plugins/event'

const Router = useRouter();

const Input = reactive({
  usr: '',
  realName: '',
  docType: '',
  docNumber: '',
  phone: '',
  pwd: '',
  pwd2: '',
  bio: '',
  vis1: false,
  vis2: false,
})

const docTypes = [
  '身份证',
  '护照',
  '驾驶证'
];

function targetLogin() {
  Object.keys(Input).forEach(key => Input[key] = (typeof Input[key] === 'boolean' ? false : ''));
  Router.push('/login');
}

const rules = {
  required: (value) => !!value || '不能为空',
  min: (v) => v.length >= 6 || '长度至少为6位数',
  lim: (v) => v.length == 11 || '长度为11位数',
  number: (v) => (/[0-9].*[0-9]/.test(v)) || '至少需要两个数字',
  alpha: (v) => (/[a-z]/.test(v) && /[A-Z]/.test(v)) || '不能均为小写或大写',
  match: () => Input.pwd === Input.pwd2 || '两次密码不一致'
};

const assert = computed(() => {
  return rules.required(Input.usr) === true &&
    rules.required(Input.realName) === true &&
    rules.required(Input.docType) === true &&
    rules.required(Input.docNumber) === true &&
    rules.required(Input.phone) === true &&
    rules.required(Input.pwd) === true &&
    rules.required(Input.pwd2) === true &&
    rules.required(Input.bio) === true &&
    rules.min(Input.pwd) === true &&
    rules.number(Input.pwd) === true &&
    rules.alpha(Input.pwd) === true &&
    rules.lim(Input.phone) === true &&
    rules.match() === true;
})

const doc_types_code = {
  "身份证":0,
  "护照":1,
  "驾驶证":2
}

function register() {
  if (!assert.value) {
    Events.warn('注册信息不正确，请检查输入');
    return;
  }

  QUERY.post('api/user/register', {
    username: Input.usr,
    real_name: Input.realName,
    id_type: doc_types_code[Input.docType],
    id_num: Input.docNumber,
    telephone: Input.phone,
    password: Input.pwd,
    description: Input.bio
  })
    .then(() => {
      Events.info('注册成功');
      Router.push('/login');
    })
    .catch(err => {
      Events.err(`注册失败: ${err}`);
    });
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
