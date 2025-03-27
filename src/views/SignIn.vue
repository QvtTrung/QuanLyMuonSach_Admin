<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center items-center py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-[200px] w-[200px]"
        src="../assets/logo.png"
        alt="Your Company"
      />
      <h2
        class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        Sign in with your account
      </h2>
    </div>

    <div
      class="my-10 lg:w-2/5 md:w-1/2 sm:w-full w-full px-5 py-10 rounded-md shadow-2xl"
    >
      <form class="space-y-6" @submit.prevent="signIn">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Username</label
          >
          <div class="mt-2">
            <input
              v-model="username"
              id="email"
              name="email"
              type="text"
              class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Password</label
            >
          </div>
          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div
          class="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 justify-between"
        >
          <div>
            <button
              type="submit"
              class="flex w-1/3 mx-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import StaffsService from "@/services/staffs.service";
import { message } from "antd";
import { useRouter } from "vue-router";
import { ref } from "vue";

const store = useStore();
const router = useRouter();
const username = ref("");
const password = ref("");

const signIn = async () => {
  try {
    if (!username.value || !password.value) {
      message.error("Please complete form.");
      return;
    }

    const response = await StaffsService.signIn({
      username: username.value,
      password: password.value,
    });

    // Kiểm tra nếu response là lỗi (ApiError từ backend)
    if (response instanceof Object && response.message && !response.isSuccess) {
      message.error(response.message);
      return;
    }

    // Lưu token trực tiếp từ response
    localStorage.setItem("token", response.token);

    if (response.isSuccess) {
      message.success(response.message);
      await store.dispatch("fetchUser");
      router.push("/home");
    } else {
      message.error(response.message || "Sign in failed");
    }
  } catch (error) {
    // Xử lý lỗi từ axios (nếu có)
    const errorMessage = error.response?.data?.message || "Sign in error";
    message.error(errorMessage);
  }
};
</script>
