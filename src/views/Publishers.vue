<script setup>
import { ref, watchEffect } from "vue";
import AuthorService from "@/services/publisher.service";
import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { message } from "antd";

const products = ref([]);
const showModal = ref(false);
const confirmDeleteModal = ref(false);
const isEditing = ref(false);
const selectedProduct = ref(null);

watchEffect(async () => {
  try {
    const allProducts = await AuthorService.getAll();
    products.value = allProducts.data.map((product) => ({
      id: product._id,
      name: product.TENNXB,
      address: product.DIACHI,
    }));
  } catch (error) {
    console.error("Failed to fetch publishers:", error);
    products.value = [];
    message.error("Failed to load publishers");
  }
});

const openModal = (product) => {
  selectedProduct.value = { ...product };
  isEditing.value = true;
  showModal.value = true;
};

const openAddModal = () => {
  selectedProduct.value = { name: "", address: "" };
  isEditing.value = false;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const openConfirmDeleteModal = (product) => {
  selectedProduct.value = { ...product };
  confirmDeleteModal.value = true;
};

const closeConfirmDeleteModal = () => {
  confirmDeleteModal.value = false;
};

const saveProduct = async () => {
  const payload = {
    TENNXB: selectedProduct.value.name,
    DIACHI: selectedProduct.value.address,
  };
  try {
    if (isEditing.value) {
      const res = await AuthorService.update(selectedProduct.value.id, payload);
      console.log(res);
      if (res.message) {
        const allProducts = await AuthorService.getAll();
        products.value = allProducts.data.map((product) => ({
          id: product._id,
          name: product.TENNXB,
          address: product.DIACHI,
        }));
        message.success(res.message);
        closeModal();
      } else {
        message.error("Failed to update publisher");
      }
    } else {
      const res = await AuthorService.create(payload);
      console.log(res);
      if (res.data) {
        const allProducts = await AuthorService.getAll();
        products.value = allProducts.data.map((product) => ({
          id: product._id,
          name: product.TENNXB,
          address: product.DIACHI,
        }));
        message.success(res.message);
        closeModal();
      } else {
        message.error("Failed to create publisher");
      }
    }
  } catch (error) {
    console.error("Error saving publisher:", error);
    message.error("An error occurred while saving the publisher");
  }
};

const deleteProduct = async () => {
  try {
    const res = await AuthorService.delete(selectedProduct.value.id);
    const allProducts = await AuthorService.getAll();
    products.value = allProducts.data.map((product) => ({
      id: product._id,
      name: product.TENNXB,
      address: product.DIACHI,
    }));
    message.success(res.message || "Publisher deleted successfully");
    closeConfirmDeleteModal();
  } catch (error) {
    console.error("Error deleting publisher:", error);
    message.error("Failed to delete publisher");
  }
};
</script>

<template>
  <div class="bg-white">
    <div
      class="mx-auto max-w-10xl px-4 py-16 sm:px-6 sm:py-6 lg:max-w-10xl lg:px-8"
    >
      <div
        class="mt-6 grid grid-cols-1 pl-auto gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-0"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="group relative w-11/12 mx-auto bg-gray-200 p-6 rounded-lg border-2 border-gray-500"
        >
          <div class="mt-4 text-left">
            <div>
              <h3 class="text-sm text-gray-500 border-b-2 border-gray-400">
                <span class="mt-1 text-lg font-semibold text-gray-900 italic">{{
                  product.name
                }}</span>
              </h3>
              <p
                class="mt-4 text-l font-semibold text-gray-600 italic border-b-2 border-gray-300"
              >
                Country: {{ product.address }}
              </p>
            </div>
            <div class="flex justify-around mt-4">
              <button
                class="p-2 border-2 border-gray-400 rounded-full"
                @click="openModal(product)"
              >
                <i class="fa-solid fa-pen-to-square text-xl w-6"></i>
              </button>
              <button
                class="p-2 border-2 border-gray-400 rounded-full"
                @click="openConfirmDeleteModal(product)"
              >
                <i class="fa-solid fa-trash text-xl w-6"></i>
              </button>
            </div>
          </div>
        </div>
        <button
          class="group relative w-5/6 mx-auto bg-transparent p-10 rounded-lg m-auto border-2 border-gray-300 h-full hover:border-4 hover:border-gray-500 ease-in-out duration-100"
          @click="openAddModal"
        >
          <i class="fa-solid fa-plus text-6xl text-gray-400"></i>
        </button>
      </div>
    </div>
  </div>

  <TransitionRoot as="template" :show="showModal">
    <Dialog
      as="div"
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="closeModal"
    >
      <div class="flex items-center justify-center min-h-screen">
        <DialogOverlay class="fixed inset-0 bg-black opacity-30" />
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="bg-white rounded-lg p-6 max-w-md mx-auto z-10 w-96"
          >
            <form class="space-y-6">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                  >Publisher name</label
                >
                <input
                  id="name"
                  type="text"
                  v-model="selectedProduct.name"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="address"
                  class="block text-sm font-medium text-gray-700"
                  >Country</label
                >
                <input
                  id="address"
                  type="text"
                  v-model="selectedProduct.address"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div class="flex justify-end space-x-2">
                <button
                  type="button"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md"
                  @click="saveProduct"
                >
                  Save
                </button>
                <button
                  type="button"
                  class="px-4 py-2 bg-gray-200 rounded-md"
                  @click="closeModal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <TransitionRoot as="template" :show="confirmDeleteModal">
    <Dialog
      as="div"
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="closeConfirmDeleteModal"
    >
      <div class="flex items-center justify-center min-h-screen">
        <DialogOverlay class="fixed inset-0 bg-black opacity-30" />
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="bg-white rounded-lg p-6 max-w-md mx-auto z-10">
            <div class="space-y-4">
              <h2 class="text-xl font-bold text-gray-900">Confirm Delete</h2>
              <p>Are you sure to delete this publisher?</p>
              <div class="flex justify-end space-x-2">
                <button
                  type="button"
                  class="px-4 py-2 bg-red-600 text-white rounded-md"
                  @click="deleteProduct"
                >
                  Delete
                </button>
                <button
                  type="button"
                  class="px-4 py-2 bg-gray-200 rounded-md"
                  @click="closeConfirmDeleteModal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
