<script setup>
import { ref, watchEffect } from "vue";
import StaffService from "@/services/staffs.service";
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
    const allProducts = await StaffService.getAll();
    products.value = allProducts.data.map((product) => ({
      id: product._id,
      username: product.MSNV,
      fullName: product.HoTenNV,
      position: product.ChucVu,
      address: product.DiaChi,
      password: product.Password,
      phone: product.SoDienThoai,
    }));
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    products.value = [];
  }
});

const openModal = (product) => {
  selectedProduct.value = { ...product };
  isEditing.value = true;
  showModal.value = true;
};

const openAddModal = () => {
  selectedProduct.value = {
    username: "",
    fullName: "",
    position: "",
    address: "",
    password: "",
    phone: "",
  };
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

const fetchProducts = async () => {
  const allProducts = await StaffService.getAll();
  products.value = allProducts.data.map((product) => ({
    id: product._id,
    username: product.MSNV,
    fullName: product.HoTenNV,
    position: product.ChucVu,
    address: product.DiaChi,
    password: product.Password,
    phone: product.SoDienThoai,
  }));
};

const saveProduct = async () => {
  const payload = {
    MSNV: selectedProduct.value.username,
    HoTenNV: selectedProduct.value.fullName,
    ChucVu: selectedProduct.value.position,
    DiaChi: selectedProduct.value.address,
    Password: selectedProduct.value.password,
    SoDienThoai: selectedProduct.value.phone,
  };
  try {
    if (isEditing.value) {
      const res = await StaffService.update(selectedProduct.value.id, payload);
      if (res.isSuccess) {
        await fetchProducts();
        message.success(res.message);
        closeModal();
      } else {
        message.error("Failed to update staff");
      }
    } else {
      const res = await StaffService.signUp(payload);
      if (res.newUser.isSuccess) {
        await fetchProducts();
        message.success(res.newUser.message);
        closeModal();
      } else {
        message.error(res.newUser.message || "Failed to create staff");
      }
    }
  } catch (error) {
    console.error("Failed to save staff:", error);
    message.error("An unexpected error occurred while saving staff");
  }
};

const deleteProduct = async () => {
  try {
    await StaffService.delete(selectedProduct.value.id);
    const allProducts = await StaffService.getAll();
    products.value = allProducts.data.map((product) => ({
      id: product._id,
      username: product.MSNV,
      fullName: product.HoTenNV,
      position: product.ChucVu,
      address: product.DiaChi,
      password: product.Password,
      phone: product.SoDienThoai,
    }));
    message.success("Delete successfully!");
    closeConfirmDeleteModal();
  } catch (error) {
    console.error("Failed to delete staff:", error);
    message.error("Failed to delete staff");
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
          class="group relative w-11/12 h-[340px] mx-auto bg-gray-200 p-6 rounded-lg border-2 border-gray-500"
        >
          <div class="mt-4 text-left">
            <div>
              <h3 class="text-sm text-gray-500 text-center">
                <span
                  class="mt-1 text-xl font-semibold border-b-2 border-black text-gray-900"
                  >User: {{ product.username }}</span
                >
              </h3>
              <p
                class="mt-3 text-base text-gray-700 border-b-2 border-gray-300"
              >
                Tên đầy đủ: {{ product.fullName }}
              </p>
              <p
                class="mt-1 text-l font-semibold text-gray-900 italic border-b-2 border-gray-300"
              >
                Chức vụ: {{ product.position }}
              </p>
              <p
                class="mt-1 text-base text-gray-700 border-b-2 border-gray-300"
              >
                Địa chỉ: {{ product.address }}
              </p>
              <p
                class="mt-1 text-base text-gray-700 border-b-2 border-gray-300"
              >
                Số điện thoại: {{ product.phone }}
              </p>
            </div>
            <div class="flex justify-around mt-4 absolute bottom-2 inset-x-0">
              <button
                class="p-2 border-2 border-gray-400 rounded-full mx-2"
                @click="openModal(product)"
              >
                <i class="fa-solid fa-pen-to-square text-xl w-6"></i>
              </button>
              <button
                class="p-2 border-2 border-gray-400 rounded-full mx-2"
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

  <!-- Add/Edit Modal -->
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
                  for="MSNV"
                  class="block text-sm font-medium text-gray-700"
                  >MSNV</label
                >
                <input
                  id="MSNV"
                  type="text"
                  v-model="selectedProduct.username"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="Password"
                  class="block text-sm font-medium text-gray-700"
                  >Mật khẩu</label
                >
                <input
                  id="Password"
                  type="text"
                  v-model="selectedProduct.password"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="HoTenNV"
                  class="block text-sm font-medium text-gray-700"
                  >Tên nhân viên</label
                >
                <input
                  id="HoTenNV"
                  type="text"
                  v-model="selectedProduct.fullName"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="ChucVu"
                  class="block text-sm font-medium text-gray-700"
                  >Chức vụ</label
                >
                <input
                  id="ChucVu"
                  type="text"
                  v-model="selectedProduct.position"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="DiaChi"
                  class="block text-sm font-medium text-gray-700"
                  >Địa chỉ</label
                >
                <input
                  id="DiaChi"
                  type="text"
                  v-model="selectedProduct.address"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="SoDienThoai"
                  class="block text-sm font-medium text-gray-700"
                  >Số điện thoại</label
                >
                <input
                  id="SoDienThoai"
                  type="text"
                  v-model="selectedProduct.phone"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div class="flex justify-end space-x-2">
                <button
                  type="button"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md"
                  @click="saveProduct"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  class="px-4 py-2 bg-gray-200 rounded-md"
                  @click="closeModal"
                >
                  Huỷ bỏ
                </button>
              </div>
            </form>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Confirm Delete Modal -->
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
              <p>Are you sure to delete this staff?</p>
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
