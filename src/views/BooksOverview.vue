<template>
  <TransitionRoot as="template" :show="true">
    <Dialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enter-to="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 md:scale-100"
            leave-to="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <DialogPanel
              class="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl"
            >
              <div
                class="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-lg"
              >
                <button
                  type="button"
                  class="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8 outline-none"
                  @click="closeModal"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>

                <div
                  class="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8"
                >
                  <!-- Hình ảnh sách -->
                  <div
                    class="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5"
                  >
                    <img
                      :src="book.HINHANH"
                      alt="Book cover"
                      class="object-cover object-center w-full h-full"
                    />
                  </div>

                  <!-- Thông tin sách -->
                  <div class="sm:col-span-8 lg:col-span-7">
                    <h2 class="text-2xl font-bold text-gray-900 sm:pr-12">
                      {{ book.TENSACH }}
                    </h2>

                    <!-- Phần thông tin sách -->
                    <section aria-labelledby="information-heading" class="mt-2">
                      <h3 id="information-heading" class="sr-only">
                        Product information
                      </h3>
                      <div class="flex justify-between">
                        <p class="text-xl text-gray-900">{{ book.TACGIA }}</p>
                        <p class="text-xl text-gray-900">
                          {{ book.DONGIA }} VNĐ/ngày
                        </p>
                      </div>
                    </section>

                    <!-- Phần mô tả sách -->
                    <section aria-labelledby="options-heading" class="mt-5">
                      <h3 id="options-heading" class="sr-only">Mô tả sách</h3>
                      <p class="mb-6 text-xl text-gray-900 border-b-2">Mô tả</p>
                      <p
                        class="text-lg text-gray-500 overflow-hidden hover:text-clip max-h-50"
                      >
                        {{ book.MOTA }}
                      </p>
                    </section>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  book: Object,
});
const emits = defineEmits(["close"]);

function closeModal() {
  emits("close");
}
</script>
