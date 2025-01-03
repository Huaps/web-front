<template>
<!-- post title -->
<v-card height="60" color="blue-accent-3" rounded="0" elevation="0"
  class="d-flex justify-center align-center"
>
  <p class="text-h6 font-weight-bold">
    发布新请求
  </p>
</v-card>
<!-- stepper -->
<v-stepper rounded="0" v-model="Step">
  <template v-slot:default="{prev, next}">
    <!-- header -->
    <v-stepper-header>
      <template v-for="(item, index) in Steps" :key="index">
        <v-stepper-item
          :complete="Step > index + 1"
          :step="item"
          :title="item"
          :value="index + 1"
        ></v-stepper-item>
        <v-divider
          v-if="index !== Steps.length - 1"
          :key="index"
        ></v-divider>
      </template>
    </v-stepper-header>

    <v-stepper-window>
      <!-- step 1-->
      <v-stepper-window-item :value="1">
        <p class="text-subtitle-1 font-weight-bold mb-2 ml-1">
          简述想法
        </p>

        <v-text-field
          v-model="Input.brief"
          variant="outlined"
          dense
          class="mb-2"
        />

        <p class="text-subtitle-1 font-weight-bold mb-2 ml-1">
          乡镇名称及地点
        </p>
        <RegionSelect ref="RegionSelectRef"></RegionSelect>
      </v-stepper-window-item>

      <!-- step 2 -->
      <v-stepper-window-item :value="2">
        <p class="text-subtitle-1 font-weight-bold mb-2 ml-1">
          探索标签
        </p>
        <v-select
          v-model="Input.tag"
          :items="TagsPreset"
          label="选择标签"
          variant="outlined"
          :menu-props="{ maxHeight: '200px' }"
          dense
          outlined
          solo
          icon="mdi-tag-multiple-outline"
        />

        <p class="text-subtitle-1 font-weight-bold mb-2 ml-1">
          详细描述
        </p>
        <v-textarea
          v-model="Input.desc"
          variant="outlined"
          dense
          class="mb-2"
        />
      </v-stepper-window-item>

      <!-- step 3 -->
      <v-stepper-window-item :value="3">
        <v-file-input ref="ImageInputRef"
          style="position: absolute;display: none;" accept="image/*"
          @change="(event) => FILES.handleFileInput(event, Input.images, updateImage)"
          multiple
        />

        <v-btn color="blue-accent-3" @click="ImageInputRef.click()">
          添加图像
        </v-btn>

        <v-row class="mt-4">
          <v-col v-for="(item, index) in Input.images" cols="auto">
            <v-img :src="Input.image_data[index]" aspect-ratio="1" cover width="200">
              <div class="d-flex">
                <v-btn icon="" variant="text" color="red" size="small" class="ml-auto"
                  @click="FILES.handleFileRemove(index, Input.images, removeImage)"
                >
                  <v-icon size="large">mdi-close</v-icon>
                </v-btn>
              </div>
            </v-img>
          </v-col>
        </v-row>
      </v-stepper-window-item>

      <!-- step 4 -->
      <v-stepper-window-item :value="4">
        <v-file-input
          style="position: absolute;display: none;"
          ref="FileInputRef"
          @change="(event) => FILES.handleFileInput(event, Input.files)"
          multiple
        />

        <v-btn color="blue-accent-3" @click="FileInputRef.click()">
          添加其他文件
        </v-btn>

        <v-list>
          <v-list-item v-for="(file, index) in Input.files" :key="index"
            :title="file.name"
            :subtitle="FILES.formatFileSize(file.size)"
          >
            <template v-slot:prepend>
              <v-icon color="grey-darken-3">
                {{ FILES.iconFileType(file.type) }}
              </v-icon>
            </template>
            <template v-slot:append>
              <v-btn icon="" variant="text" color="red" size="small"
                @click="FILES.handleFileRemove(index, Input.files)"
              >
                <v-icon size="large">mdi-close</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-stepper-window-item>

    </v-stepper-window>

    <!-- actions -->
    <div class="d-flex mx-6 mb-6">
      <v-btn @click="prev" :disabled="Step == 1" variant="text" width="80">
        <p class="text-subtitle-1 font-weight-bold">上一步</p>
      </v-btn>
      <v-btn @click="props.onCancel" class="ml-auto mr-4" variant="text" color="red" width="80" :disabled="OnUploading">
        <p class="text-subtitle-1 font-weight-bold">取消</p>
      </v-btn>
      <template v-if="Step >= Steps.length">
        <v-btn @click="upload" variant="flat" width="80" color="blue-accent-3" :disabled="OnUploading">
          <p class="text-subtitle-1 font-weight-bold">
            {{ OnUploading ? '请稍后' : '发布' }}
          </p>
        </v-btn>
      </template>
      <template v-else>
        <v-btn @click="next" :disabled="!checkNext(Step)" variant="text" width="80">
          <p class="text-subtitle-1 font-weight-bold">下一步</p>
        </v-btn>
      </template>

    </div>

  </template>
</v-stepper>
</template>

<script setup>
import { ref, reactive } from 'vue';
import RegionSelect from '@/components/util/RegionSelect.vue';
import TagBar from '@/components/util/TagBar.vue';

import TagsPreset from '@/plugins/tags'
import * as FILES from '@/plugins/files'
import * as QUERY from '@/plugins/query'
import * as Events from '@/plugins/event'

const props = defineProps({
  onCancel: {
    type: Function,
    default: () => {},
  },
  onComplete: {
    type: Function,
    default: () => {},
  },
})

const Input = reactive({
  brief: 'Brief',
  tag:'Tag',
  desc: 'Description',
  images: [],
  image_data: [],
  files: [],
})

const RegionSelectRef = ref(null);
const ImageInputRef = ref(null);
const FileInputRef = ref(null);
const TagsInputRef = ref(null);
const OnUploading = ref(false);

const Step = ref(1);
const Steps = ['Step1', 'Step2', 'Step3', 'Step4'];

function updateImage(idx, file) {
  Input.image_data.push(null);
  FILES.sync_read(file ,(res) => {
    Input.image_data[Input.image_data.length - 1] = res;
  });
}

function removeImage(idx) {
  Input.image_data.splice(idx, 1);
}

function checkNext(index) {
  switch (index) {
    case 1:
      return checkStep1();
    case 2:
      return checkStep2();
    default:
      return true;
  }
}

function checkStep1(){
  if(!RegionSelectRef.value) return false;
  return Input.brief.length > 0 && RegionSelectRef.value.isComplete();
}

function checkStep2(){
  return Input.desc.length > 0;
}


async function upload() {
  if (!confirm('确认发布?')) return;
  if (!checkStep1() || !checkStep2()) {
    Events.warn('请填写完整信息');
    return;
  }

  var formData = new FormData();
  // poster_id
  formData.append('user_id', QUERY.get_user_id());
  // brief
  formData.append('title', Input.brief);
  // tags
  formData.append('promote_type', Input.tag);
  // desc
  formData.append('description', Input.desc);
  // region
  const city = RegionSelectRef.value.getString();
  formData.append('country_id', city);

  // 上传图片并获取URL
  async function uploadFiles(file) {
    const urls = [];
    const fileFormData = new FormData();
    fileFormData.append('file', file);
    try {
      const response = await QUERY.post('/api/upload', fileFormData, null, false);
      if (response.code === 1) {
        urls.push(response.data);
        console.log('得到图片'+response.data)
      } else {
        Events.warn('文件上传失败: ' + file.name);
      }
    } catch (err) {
      Events.warn('文件上传发生错误: ' + file.name);
      console.error(err);
    }

    return urls;
  }

  // 上传并添加图片URL到 formData
  for(let i = 0; i < Input.images.length; i++) {
    const imageUrl = await uploadFiles(Input.images[i]);
    formData.append('image_files', imageUrl[0]);
  }

  // 上传并添加文件URL到 formData
  for (let i = 0; i < Input.files.length; i++) {
    const rawUrl = await uploadFiles(Input.files[i]);
    formData.append('raw_files', rawUrl[0]);
  }

  console.log(formData.data);

  // 提交最终表单
  QUERY.post('/api/user/request/post', formData, null, false)
    .then(res => {
      console.log(res);
      if (res.code === 1) {
        Events.info('发布成功');
        props.onComplete();
      } else {
        Events.warn('发布失败');
      }
    })
    .catch(err => {
      Events.warn('发布发生错误');
      console.error(err);
    });
}


</script>
