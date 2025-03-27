<script setup>
import { ref, onMounted, watchEffect, defineEmits, watch, nextTick } from "vue";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import {
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/vue/20/solid";
import { useStore } from "vuex";

const store = useStore();
const loading = ref(true);

watchEffect(async () => {
  await store.dispatch("fetchUser");
  console.log("User data:", store.state.user);
  loading.value = false;
});

const signOut = () => {
  store.dispatch("signOut");
  router.push("/");
};

const showInfo = ref("books");
const mobileFiltersOpen = ref(false);
</script>

<template>
  <TransitionRoot as="template" :show="mobileFiltersOpen">
    <Dialog
      as="div"
      class="relative z-40 lg:hidden"
      @close="mobileFiltersOpen = false"
    >
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 z-40 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="translate-x-full"
        >
          <DialogPanel
            class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl"
          >
            <div class="flex items-center justify-between px-4">
              <h2 class="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                @click="mobileFiltersOpen = false"
              >
                <span class="sr-only">Close menu</span>
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <!-- Filters -->
            <form class="mt-4 border-t border-gray-200">
              <Disclosure
                as="div"
                v-for="section in filters"
                :key="section.id"
                class="border-t border-gray-200 px-4 py-6"
                v-slot="{ open }"
              >
                <h3 class="-mx-2 -my-3 flow-root">
                  <DisclosureButton
                    class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                  >
                    <span class="font-medium text-gray-900">{{
                      section.name
                    }}</span>
                    <span class="ml-6 flex items-center">
                      <PlusIcon
                        v-if="!open"
                        class="h-5 w-5"
                        aria-hidden="true"
                      />
                      <MinusIcon v-else class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel class="pt-6">
                  <div class="space-y-4">
                    <div
                      v-for="(option, optionIdx) in section.options"
                      :key="option.value"
                      class="flex items-center"
                    >
                      <input
                        :id="`filter-${section.id}-${optionIdx}`"
                        :name="`${section.id}[]`"
                        :value="option.value"
                        type="checkbox"
                        :checked="option.checked"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        :for="`filter-${section.id}-${optionIdx}`"
                        class="ml-3 text-sm text-gray-600"
                        >{{ option.label }}</label
                      >
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </form>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
  <main class="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
    <section aria-labelledby="products-heading" class="pb-24 pt-6">
      <div
        class="flex items-baseline justify-between border-b-2 border-gray-200 py-6"
      >
        <div class="border-2 border-gray-500 p-4 rounded-xl mx-auto">
          <h3
            v-if="store.state.user != null"
            class="text-lg font-semibold tracking-tight text-gray-900"
          >
            Tên nhân viên: {{ store.state.user.HoTenNV }}
          </h3>
          <h3
            v-if="store.state.user != null"
            class="text-lg font-semibold tracking-tight text-gray-900"
          >
            Chức vụ: {{ store.state.user.ChucVu }}
          </h3>
          <div class="text-center">
            <button
              class="p-3 mt-2 border-2 border-gray-400 rounded-full hover:border-gray-400 ease-in-out duration-200 active:p-2"
              @click="signOut"
            >
              Sign Out
            </button>
          </div>
        </div>
        <div class="flex items-center">
          <button
            type="button"
            class="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
            @click="mobileFiltersOpen = true"
          >
            <span class="sr-only">Filters</span>
            <FunnelIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
        <form class="hidden lg:block py-16 sm:py-6 mt-6">
          <ul
            role="list"
            class="space-y-4 border-b border-gray-200 py-6 text-sm font-medium text-gray-900"
          >
            <li
              :class="{
                'bg-gray-900': showInfo == 'books',
                'bg-gray-400': showInfo != 'books',
              }"
              class="p-3 rounded-md ring-1 ring-gray-400"
              @click.prevent="showInfo = 'books'"
            >
              <button class="text-white">Quản lý sách</button>
            </li>
            <li
              :class="{
                'bg-gray-900': showInfo == 'readers',
                'bg-gray-400': showInfo != 'readers',
              }"
              class="p-3 rounded-md ring-1 ring-gray-400"
              @click.prevent="showInfo = 'readers'"
            >
              <button class="text-white">Quản lý độc giả</button>
            </li>
            <li
              :class="{
                'bg-gray-900': showInfo == 'staffs',
                'bg-gray-400': showInfo != 'staffs',
              }"
              class="p-3 rounded-md ring-1 ring-gray-400"
              @click.prevent="showInfo = 'staffs'"
            >
              <button class="text-white">Quản lý nhân viên</button>
            </li>
            <li
              :class="{
                'bg-gray-900': showInfo == 'publishers',
                'bg-gray-400': showInfo != 'publishers',
              }"
              class="p-3 rounded-md ring-1 ring-gray-400"
              @click.prevent="showInfo = 'publishers'"
            >
              <button class="text-white">Quản lý nhà xuất bản</button>
            </li>
            <li
              :class="{
                'bg-gray-900': showInfo == 'tracks',
                'bg-gray-400': showInfo != 'tracks',
              }"
              class="p-3 rounded-md ring-1 ring-gray-400"
              @click.prevent="showInfo = 'tracks'"
            >
              <button class="text-white">Quản lý mượn sách</button>
            </li>
          </ul>
        </form>
        <div class="lg:col-span-4">
          <Books v-if="showInfo === 'books'" />
          <Staffs v-if="showInfo === 'staffs'" />
          <Readers v-if="showInfo === 'readers'" />
          <Publishers v-if="showInfo === 'publishers'" />
          <Tracks v-if="showInfo === 'tracks'" />
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import Books from "@/views/Books.vue";
import Staffs from "@/views/Staffs.vue";
import Readers from "@/views/Readers.vue";
import Publishers from "@/views/Publishers.vue";
import Tracks from "@/views/Tracks.vue";
import router from "@/router";
</script>
