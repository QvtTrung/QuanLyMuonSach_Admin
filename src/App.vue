<script setup>
import { ref, watchEffect } from "vue";
import Banner from "@/components/Banner.vue";
import { useStore } from "vuex";
import router from "./router";
const store = useStore();

watchEffect(async () => {
  await store.dispatch("fetchUser");
  console.log(store.state.user);
  if (localStorage.getItem("token") == null) {
    router.push("/");
  }
});
</script>

<template>
  <div>
    <Banner v-if="store.state.user" />
    <router-view />
  </div>
</template>
