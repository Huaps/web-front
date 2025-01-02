<template>
  <div class="d-flex flex-row flex-wrap" style="height: 1000px">
    <!-- user info -->
    <div class="d-flex flex-column align-self-start mt-6 ml-3 mr-auto" style="width: 400px;">
        <v-spacer class="my-10"></v-spacer>

        <!-- username -->
        <p class="text-h4 font-weight-bold">
          {{ UserData.name }}，欢迎！
        </p>

        <!-- uid and location -->
        <p class="mt-2 text-overline font-weight-regular text-blue-accent-4">
          <strong class="font-weight-bold ml-1">ID:</strong>
          {{ UserData.id }}
        </p>
      <!--
        <p class="text-subtitle-1 font-weight-bold">
          {{ UserData.loc1 }}
          <strong class="mx-1">
            <v-avatar size="5" color="grey" />
          </strong>
          {{ UserData.loc2 }}
        </p>
      -->
        <v-spacer class="my-4" />
        <v-divider class="mb-6" />

        <!-- phone -->
        <div class="d-flex align-center">
          <template v-if="!Update">
            <v-icon size="22" color="grey-darken-1">mdi-cellphone-link</v-icon>
            <p class="ml-3">联系方式：</p>
            <p> {{ UserData.phone }} </p>
          </template>
          <template v-else>
            <v-text-field variant="outlined" density="compact"
              :rules="[rules.required, rules.lim]"
              v-model="Input.phone"
              prepend-inner-icon="mdi-cellphone-link"
              type="number"
              hide-spin-buttons
            />
          </template>
        </div>

        <v-spacer class="mt-2"></v-spacer>

        <!-- intro -->
        <div class="d-flex align-center">
          <template v-if="!Update">
            <v-icon size="22" color="grey-darken-1">mdi-card-account-details</v-icon>
            <p class="ml-2">我的简介：</p>
            <p style="word-break: break-all;"> {{ UserData.intro }} </p>
          </template>
          <template v-else>
            <v-textarea
              counter
              prepend-inner-icon="mdi-card-account-details"
              v-model="Input.intro"
              variant="outlined"
              auto-grow
              :rules="[rules.max]"
            />
          </template>
        </div>


        <v-spacer class="my-3" />
        <v-divider class="mb-6" />

        <!-- edit profile -->
        <template v-if="!Update">
          <v-btn color="blue-accent-3" class="align-self-start" elevation="0"
            @click="Update = true"
          >
            <p class="text-subtitle-1">更新信息</p>

          </v-btn>
          <v-spacer class="my-2"></v-spacer>
          <div class="text-black text-caption">
            <template v-if="!Change">
              <v-btn color="red" elevation="0"
                @click="Change = true"
              >
                <p class="text-subtitle-1">更改密码</p>
              </v-btn>
            </template>
            <template v-else>
              <p class="font-weight-bold">
                修改密码
              </p>
              <!-- password -->
              <p>新密码</p>
              <v-text-field variant="outlined" density="compact"
                :rules="[rules.min, rules.number, rules.alpha]"
                v-model="Input.pwd"
                :append-inner-icon="Input.vis1 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :type="Input.vis1 ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                @click:append-inner="Input.vis1 = !Input.vis1"
              />

              <!-- comfirm -->
              <p>确认密码</p>
              <v-text-field variant="outlined" density="compact"
                :rules="[rules.required, rules.match]"
                v-model="Input.pwd2"
                :append-inner-icon="Input.vis2 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :type="Input.vis2 ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-alert-outline"
                @click:append-inner="Input.vis2 = !Input.vis2"
              />

              <div class="d-flex">
                <v-btn color="red" size="small" elevation="0" @click="resetChange">
                  <p class="text-caption font-weight-bold">取消</p>
                </v-btn>
                <v-btn color="blue-accent-3" size="small" elevation="0" class="ml-2"
                  :disabled="!input_assert" @click="postChange"
                >
                  <p class="text-caption font-weight-bold">确认</p>
                </v-btn>
              </div>
            </template>



          </div>

        </template>
        <template v-else>
          <div class="d-flex">
            <v-btn color="red" variant="outlined" class="align-self-start" elevation="0"
              @click="resetUpdate"
            >
              <p class="text-subtitle-1">取消</p>
            </v-btn>
            <v-btn color="blue-accent-3" class="align-self-start ml-2" elevation="0"
              :disabled="!input_assert2" @click="postUpdate"
            >
              <p class="text-subtitle-1">确认</p>
            </v-btn>
          </div>
        </template>

        <v-spacer class="my-3" />



    </div>
    <div class="flex-grow-1 mx-3 pr-4 my-6" style="min-width: 520px;height: 80vh;">
      <d-carousel height="100%" width="100%" autoplay :autoplay-speed="3000">
        <d-carousel-item class="d-carousel-item" v-for="item in items" :key="item">
          <v-img :src="item" cover
            height="100%"
          />
        </d-carousel-item>
      </d-carousel>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Poster from '@/components/poster/ReplyPoster.vue'

import * as QUERY from '@/plugins/query'
import {assert} from '@/plugins/query'
import * as Events from '@/plugins/event'

const Router = useRouter();

const UserData = reactive({
  name: QUERY.get_user_name(),
  loc1: '',
  loc2: '',
  id: QUERY.get_user_id(),
  phone: '',
  intro: '',
})

const Input = reactive({
  pwd: '',
  pwd2: '',
  phone: '',
  intro: '',
  vis1 : false,
  vis2 : false
})


const Latest = reactive({
  flag: false,
  request_id: '',
  date: '',
  brief: '',
  city: '',
  img: 'https://spring-webwebweb.oss-cn-hangzhou.aliyuncs.com/9253d190-3972-41f1-a3e5-9b5476c4ae26.jpg'
})


const Update = ref(false);
const Change = ref(false);
const Reply = reactive([])
const TotalNum = ref(0);

const rules = {
  required: (value) => !!value || '不能为空',
  min: (v) => v.length >= 6 || '长度至少为6位数',
  lim: (v) => v.length == 11 || '长度为11位数',
  max: (v) => v.length <= 200 || '不能超过200个字符',
  number: (v) => (/\d.*\d/.test(v)) || '至少需要两个数字',
  alpha: (v) => (/[a-z]/.test(v) && /[A-Z]/.test(v)) || '不能均为小写或大写',
  match: () => Input.pwd === Input.pwd2 || '两次密码不一致'
};

const items = ['https://spring-webwebweb.oss-cn-hangzhou.aliyuncs.com/bde2eff0-bec5-4692-91c5-1e7a0520e740.jpg',
  'https://spring-webwebweb.oss-cn-hangzhou.aliyuncs.com/9cbd3704-6d2d-4a26-a0c1-836832463531.jpg',
  'https://spring-webwebweb.oss-cn-hangzhou.aliyuncs.com/091fba39-c625-4f1b-9f0f-304e92fed514.jpg']; // 新增的部分

function resetUpdate() {
  Input.phone = UserData.phone;
  Input.intro = UserData.intro;
  Update.value = false;
}

const input_assert2 = computed(() => {
  return rules.lim(Input.phone) === true &&
         rules.max(Input.intro) === true &&
         (Input.phone !== UserData.phone ||
         Input.intro !== UserData.intro);
})

function postUpdate() {
  if(!input_assert2.value) {
    Events.warn('请检查输入');
    return;
  }

  let data = {}
  if(Input.phone !== UserData.phone) data.telephone = Input.phone;
  if(Input.intro !== UserData.intro) data.description = Input.intro;

  if(data == {}) {
    Events.warn('没有修改任何信息');
    return;
  }

  if(!confirm('确认修改信息?')) return;

  QUERY.post('/api/user/modify_data', data, 'user_id')
  .then(data => {
    Events.info('修改成功')
    UserData.phone = Input.phone;
    UserData.intro = Input.intro;
    resetUpdate();
  })
}

function resetChange() {
  Input.pwd = '';
  Input.pwd2 = '';
  Input.vis1 = false;
  Input.vis2 = false;
  Change.value = false;
}

function postChange() {
  if(!input_assert.value) {
    Events.warn('请检查输入');
    return;
  }

  if(!confirm('确认修改密码?')) return;

  QUERY.post('/api/user/modify_data', {
    password: Input.pwd
  }, 'user_id')
  .then(data => {
    Events.info('修改成功')
    resetChange();
  })
}

const input_assert = computed(() => {
  return rules.required(Input.pwd) === true &&
         rules.required(Input.pwd2) === true &&
         rules.min(Input.pwd === true) &&
         rules.number(Input.pwd) === true &&
         rules.alpha(Input.pwd) === true &&
         rules.match() === true;
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomImage() {
  let result;
  result = {
    id:0,
    url:"https://spring-webwebweb.oss-cn-hangzhou.aliyuncs.com/9253d190-3972-41f1-a3e5-9b5476c4ae26.jpg"
  }
  return result
}

function fetchLatest() {
  QUERY.get('/api/user/request/query_lasted', {}, 'user_id')
  .then(data => {
    console.log(data)
    if(!data.data || data.data.length == 0) {
      Latest.flag = false;
      return;
    }
    Latest.flag = true;
    Latest.date = data.data.latest_response_time;
    Latest.city = data.data.city;
    Latest.request_id = data.data.id;
    console.log(data.data.image_files.length)
    if(data.data.image_files.length > 0) {
      Latest.img = randomImage()
    }
    Latest.brief = data.data.brief
  })
}

function checkLatest() {
  Router.push('/home/detail/' + Latest.request_id)
}


function fetchReply(){
  QUERY.get('/api/user/response/query_brief', {
    user_id : UserData.id,
    type : "user_id",
    page : 0
  })
  .then(data => {
    console.log(data)
    TotalNum.value = data.total_num;
    data.data.sort((a, b) => {
      return new Date(b.modify_time) - new Date(a.modify_time)
    }).forEach(element => {
      Reply.push(element);
    })
  })
}

onMounted(() => {
  if(!assert()) {
    Router.push('/login');
    return;
  }

  QUERY.get('/api/user/info', {}, 'user_id')
  .then(data => {
    console.log(data);
    UserData.phone = data.data.telephone
    UserData.intro = data.data.description ? data.data.description : ''
    resetUpdate();
    resetChange();
  })
  //fetchLatest();
  fetchReply();
})
</script>
<style>
.d-carousel-item {
  text-align: center;
  line-height: 800px;
  background: #f3f6f8
}
</style>
