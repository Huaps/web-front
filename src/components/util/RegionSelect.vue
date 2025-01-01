<template>
<div>
  <v-row>
    <v-col>
      <v-text-field
      v-model="Input.loc0"
      variant="outlined"
      dense
      class="mb-2"
      placeholder="乡镇名称"
    />
      <v-select
        v-model="Input.loc1"
        :items="provinces"
        density="compact" variant="outlined"
        placeholder="省"
        @update:model-value="updateCities"
      ></v-select>
    </v-col>
    <v-col>
      <v-select
        v-model="Input.loc2"
        :items="cities" :disabled="Input.loc1.length == 0"
        density="compact" variant="outlined"
        placeholder="市"
      ></v-select>
    </v-col>
  </v-row>
</div>

</template>

<script setup>
import { reactive, ref, toRaw } from 'vue';
import CITIES from '@/plugins/cities'

const provinces = Object.keys(CITIES);
let cities = ref([])

const Input = reactive({
  loc0 : '',
  loc1 : '',
  loc2 : ''
})

function updateCities() {
  Input.loc2 = ''
  cities.value = CITIES[toRaw(Input).loc1]
}

defineExpose({
  getCountrySide:() => Input.loc0,
  getProvince: () => Input.loc1,
  getCity: () => Input.loc2,
  getString: () => `${Input.loc0},${Input.loc1},${Input.loc2}`,
  isComplete: () => Input.loc1.length > 0 && Input.loc2.length > 0 && Input.loc0.length > 0,
  clear: () => {
    Input.loc0 = ''
    Input.loc1 = ''
    Input.loc2 = ''
  }
})

</script>
