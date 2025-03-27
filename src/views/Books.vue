<script setup>
import { onMounted, ref, watchEffect } from "vue";
import BooksOverview from "./BooksOverview.vue";
import booksService from "@/services/books.service";
import AuthorService from "@/services/publisher.service"; // Giả sử đây là PublisherService
import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { message } from "antd";

const products = ref([]);
const selectedBook = ref(null);
const isModalOpen = ref(false);
const newBook = ref({
  TENSACH: "",
  HINHANH: "",
  NAMXUATBAN: "",
  SOQUYEN: 0,
  DONGIA: 0,
  TACGIA: "", // Trường mới cho tác giả
  MANXB: "", // Trường cho nhà xuất bản (sẽ lưu _id)
  MOTA: "",
});
const isAddBookModalOpen = ref(false);
const isEditModalOpen = ref(false);
const confirmDeleteModal = ref(false);
const allPublishers = ref([]); // Đổi tên biến cho rõ ràng
const isLoading = ref(true);

// Lấy danh sách sách
watchEffect(async () => {
  try {
    const allProducts = await booksService.getAll();
    products.value = allProducts.data.map((product) => ({
      id: product._id,
      TENSACH: product.TENSACH,
      HINHANH: product.HINHANH,
      NAMXUATBAN: product.NAMXUATBAN,
      SOQUYEN: product.SOQUYEN,
      DONGIA: Number(product.DONGIA),
      TACGIA: product.TACGIA,
      MANXB: product.MANXB, // Thêm MANXB
      MOTA: product.MOTA,
    }));
  } catch (error) {
    console.error("Failed to fetch books:", error);
    products.value = [];
    message.error("Failed to load books");
  }
});

function openModal(book) {
  selectedBook.value = { ...book };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

onMounted(async () => {
  try {
    const response = await AuthorService.getAll();
    allPublishers.value = response.data;
    isLoading.value = false;
  } catch (error) {
    console.error("Failed to fetch publishers:", error);
    allPublishers.value = [];
    message.error("Failed to load publishers");
  }
});

function openEditModal(book) {
  selectedBook.value = { ...book };
  isEditModalOpen.value = true;
}

function closeEditModal() {
  isEditModalOpen.value = false;
}

function openConfirmDeleteModal(book) {
  selectedBook.value = { ...book };
  confirmDeleteModal.value = true;
}

function closeConfirmDeleteModal() {
  confirmDeleteModal.value = false;
}

const saveProduct = async () => {
  try {
    selectedBook.value.DONGIA = Number(selectedBook.value.DONGIA);
    selectedBook.value.SOQUYEN = Number(selectedBook.value.SOQUYEN);
    selectedBook.value.MANXB =
      selectedBook.value.MANXB._id || selectedBook.value.MANXB; // Gửi _id của NXB
    const res = await booksService.update(
      selectedBook.value.id,
      selectedBook.value
    );
    if (res.isSuccess) {
      const allProducts = await booksService.getAll();
      products.value = allProducts.data.map((product) => ({
        id: product._id,
        TENSACH: product.TENSACH,
        HINHANH: product.HINHANH,
        NAMXUATBAN: product.NAMXUATBAN,
        SOQUYEN: product.SOQUYEN,
        DONGIA: Number(product.DONGIA),
        TACGIA: product.TACGIA,
        MANXB: product.MANXB,
        MOTA: product.MOTA,
      }));
      message.success(res.message);
      closeEditModal();
    } else {
      message.error(res.message);
    }
  } catch (error) {
    console.error("Error updating book:", error);
    message.error("Failed to update book");
  }
};

const deleteProduct = async () => {
  try {
    const res = await booksService.delete(selectedBook.value.id);
    if (res.isSuccess) {
      const allProducts = await booksService.getAll();
      products.value = allProducts.data.map((product) => ({
        id: product._id,
        TENSACH: product.TENSACH,
        HINHANH: product.HINHANH,
        NAMXUATBAN: product.NAMXUATBAN,
        SOQUYEN: product.SOQUYEN,
        DONGIA: Number(product.DONGIA),
        TACGIA: product.TACGIA,
        MANXB: product.MANXB,
        MOTA: product.MOTA,
      }));
      message.success(res.message);
      closeConfirmDeleteModal();
    } else {
      message.error(res.message);
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    message.error("Failed to delete book");
  }
};

function openAddBookModal() {
  newBook.value = {
    TENSACH: "",
    HINHANH: "",
    NAMXUATBAN: "",
    SOQUYEN: 0,
    DONGIA: 0,
    TACGIA: "", // Trường mới cho tác giả
    MANXB: "", // Trường cho nhà xuất bản
    MOTA: "",
  };
  isAddBookModalOpen.value = true;
}

function closeAddBookModal() {
  isAddBookModalOpen.value = false;
}

const addBook = async () => {
  try {
    newBook.value.DONGIA = Number(newBook.value.DONGIA);
    newBook.value.SOQUYEN = Number(newBook.value.SOQUYEN);
    newBook.value.MANXB = newBook.value.MANXB._id || newBook.value.MANXB; // Gửi _id của NXB
    const res = await booksService.create(newBook.value);
    if (res.isSuccess) {
      const allProducts = await booksService.getAll();
      products.value = allProducts.data.map((product) => ({
        id: product._id,
        TENSACH: product.TENSACH,
        HINHANH: product.HINHANH,
        NAMXUATBAN: product.NAMXUATBAN,
        SOQUYEN: product.SOQUYEN,
        DONGIA: Number(product.DONGIA),
        TACGIA: product.TACGIA,
        MANXB: product.MANXB,
        MOTA: product.MOTA,
      }));
      message.success(res.message);
      closeAddBookModal();
    } else {
      message.error(res.message);
    }
  } catch (error) {
    console.error("Error adding book:", error);
    message.error("Failed to add book");
  }
};
</script>

<template>
  <div class="bg-white">
    <div
      class="mx-auto max-w-10xl px-4 py-16 sm:px-6 sm:py-6 lg:max-w-10xl lg:px-8"
    >
      <div
        class="mt-6 grid grid-cols-1 pl-auto gap-x-6 gap-y-[140px] sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-0"
      >
        <div
          v-for="product in products"
          :key="product.id"
          @click="openModal(product)"
          class="group relative h-5/6 w-5/6 mx-auto"
        >
          <div
            class="aspect-h-1 aspect-w-1 w-full h-5/6 overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-full"
          >
            <img
              :src="product.HINHANH"
              class="h-full w-full object-cover object-center lg:h-full lg:w-full"
            />
          </div>
          <div class="mt-4 flex justify-between">
            <div>
              <h3 class="text-sm text-gray-500">
                <a :href="product.href">
                  <span
                    aria-hidden="true"
                    class="absolute inset-0 truncate"
                  ></span>
                  {{ product.TENSACH }}
                </a>
              </h3>
              <p class="mt-1 text-sm text-gray-700">{{ product.TACGIA }}</p>
            </div>
          </div>
          <div
            class="flex justify-around mt-4 border-b-2 border-black border-x-2 rounded-full p-2"
          >
            <button
              class="p-2 border-2 border-gray-400 rounded-full"
              @click.stop="openEditModal(product)"
            >
              <i class="fa-solid fa-pen-to-square text-xl w-6"></i>
            </button>
            <button
              class="p-2 border-2 border-gray-400 rounded-full"
              @click.stop="openConfirmDeleteModal(product)"
            >
              <i class="fa-solid fa-trash text-xl w-6"></i>
            </button>
          </div>
        </div>
        <button
          class="group relative w-5/6 mx-auto bg-transparent p-10 rounded-lg m-auto border-2 border-gray-300 h-full hover:border-4 hover:border-gray-500 ease-in-out duration-100"
          @click="openAddBookModal"
        >
          <i class="fa-solid fa-plus text-6xl text-gray-400"></i>
        </button>
      </div>
    </div>
    <BooksOverview
      v-if="isModalOpen"
      :book="selectedBook"
      @close="isModalOpen = false"
    />
  </div>

  <!-- Edit Modal -->
  <TransitionRoot as="template" :show="isEditModalOpen" v-if="!isLoading">
    <Dialog
      as="div"
      class="fixed z-20 inset-0 overflow-y-auto"
      @close="closeEditModal"
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
                  for="TENSACH"
                  class="block text-sm font-medium text-gray-700"
                  >Book Name</label
                >
                <input
                  id="TENSACH"
                  type="text"
                  v-model="selectedBook.TENSACH"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="TACGIA"
                  class="block text-sm font-medium text-gray-700"
                  >Tác giả</label
                >
                <input
                  id="TACGIA"
                  type="text"
                  v-model="selectedBook.TACGIA"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="MANXB"
                  class="block text-sm font-medium text-gray-700"
                  >Nhà xuất bản</label
                >
                <select
                  id="MANXB"
                  v-model="selectedBook.MANXB"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option
                    v-for="publisher in allPublishers"
                    :key="publisher._id"
                    :value="publisher._id"
                  >
                    {{ publisher.TENNXB }}
                    <!-- Giả sử tên NXB là TENNXB -->
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="SOQUYEN"
                  class="block text-sm font-medium text-gray-700"
                  >Số lượng</label
                >
                <input
                  id="SOQUYEN"
                  type="number"
                  v-model="selectedBook.SOQUYEN"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="DONGIA"
                  class="block text-sm font-medium text-gray-700"
                  >Giá</label
                >
                <input
                  id="DONGIA"
                  type="number"
                  v-model="selectedBook.DONGIA"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="MOTA"
                  class="block text-sm font-medium text-gray-700"
                  >Mô tả</label
                >
                <input
                  id="MOTA"
                  type="text"
                  v-model="selectedBook.MOTA"
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
                  @click="closeEditModal"
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

  <!-- Delete Modal -->
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
              <p>Are you sure you want to delete this book?</p>
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

  <!-- Add Book Modal -->
  <TransitionRoot as="template" :show="isAddBookModalOpen">
    <Dialog
      as="div"
      class="fixed z-20 inset-0 overflow-y-auto"
      @close="closeAddBookModal"
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
            <form class="space-y-6" @submit.prevent="addBook">
              <div>
                <label
                  for="TENSACH"
                  class="block text-sm font-medium text-gray-700"
                  >Tên sách</label
                >
                <input
                  id="TENSACH"
                  type="text"
                  v-model="newBook.TENSACH"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="HINHANH"
                  class="block text-sm font-medium text-gray-700"
                  >Bìa sách</label
                >
                <input
                  id="HINHANH"
                  type="text"
                  v-model="newBook.HINHANH"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="NAMXUATBAN"
                  class="block text-sm font-medium text-gray-700"
                  >Năm xuất bản</label
                >
                <input
                  id="NAMXUATBAN"
                  type="text"
                  v-model="newBook.NAMXUATBAN"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="TACGIA"
                  class="block text-sm font-medium text-gray-700"
                  >Tác giả</label
                >
                <input
                  id="TACGIA"
                  type="text"
                  v-model="newBook.TACGIA"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="MANXB"
                  class="block text-sm font-medium text-gray-700"
                  >Nhà xuất bản</label
                >
                <select
                  id="MANXB"
                  v-model="newBook.MANXB"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option
                    v-for="publisher in allPublishers"
                    :key="publisher._id"
                    :value="publisher._id"
                  >
                    {{ publisher.TENNXB }}
                    <!-- Giả sử tên NXB là TENNXB -->
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="SOQUYEN"
                  class="block text-sm font-medium text-gray-700"
                  >Số lượng</label
                >
                <input
                  id="SOQUYEN"
                  type="number"
                  v-model="newBook.SOQUYEN"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="DONGIA"
                  class="block text-sm font-medium text-gray-700"
                  >Đơn giá</label
                >
                <input
                  id="DONGIA"
                  type="number"
                  v-model="newBook.DONGIA"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label
                  for="MOTA"
                  class="block text-sm font-medium text-gray-700"
                  >Mô tả</label
                >
                <textarea
                  id="MOTA"
                  v-model="newBook.MOTA"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>
              <div class="flex justify-end space-x-2">
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Thêm sách
                </button>
                <button
                  type="button"
                  class="px-4 py-2 bg-gray-200 rounded-md"
                  @click="closeAddBookModal"
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
</template>
