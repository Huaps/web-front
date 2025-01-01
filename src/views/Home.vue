<template>
<v-app class="gradient-background">
  <!-- header bar -->
  <v-app-bar class="pt-2 pb-4 " elevation="0" style="background: none;">

    <!-- navigation -->
    <template v-slot:append>
      <v-hover v-for="(item, key) in Targets" :key="key">
        <template v-slot:default="{ isHovering, props }">
          <v-btn v-bind="props"
            variant="text" rounded="lg"
            :color="isHovering ? 'blue-accent-2' : 'grey-darken-3'"
            @click="targetTo(key)"
          >
            <p class="text-subtitle-1 font-weight-black">
              {{ Targets[key].name }}
            </p>
          </v-btn>
        </template>
      </v-hover>

      <v-btn icon="mdi-logout-variant" color="grey-darken-3" @click="logout"></v-btn>
    </template>
  </v-app-bar>

  <!-- main router page -->
  <v-main class="ma-10">
    <router-view/>
  </v-main>

</v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/util/Logo.vue';
import {assert, clear} from '@/plugins/query'

const Router = useRouter();

const Targets = {
  about: {
    name: '我的主页',
    link: '',
    icon: 'mdi-book'
  },
  seeking: {
    name: '我宣传',
    link: '/promote',
    icon: 'mdi-map-search'
  },
  welcome: {
    name: '我助力',
    link: '/power',
    icon: 'mdi-map-marker-star'
  }
}

const Selected = ref('about');
function targetTo(key) {
  Selected.value = key;
  Router.push('/home' + Targets[key].link);
}

function logout() {
  if(confirm('确认登出?')) {
    clear();
    Router.push('/login');
  }
}

onMounted(() => {
  if(!assert()) {
    Router.push('/login');
    return;
  }
})

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
