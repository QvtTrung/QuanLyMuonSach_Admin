<script setup>
import TracksService from "@/services/tracks.service";
import { message } from "antd";
import { ref, watchEffect } from "vue";

const products = ref([]);
const now = ref(new Date());
const showModal = ref(false);
const selectedTrack = ref(null);
const modalType = ref("return"); // Thêm biến để phân biệt loại modal: "return" hoặc "delete"

watchEffect(async () => {
  const allProducts = await TracksService.getAll();
  if (!Array.isArray(allProducts.data)) {
    console.error("API response is not an array:", allProducts.data);
    products.value = [];
    return;
  }
  console.log("API response:", allProducts.data);
  products.value = allProducts.data.map((product) => {
    const borrowedDate = new Date(product.NGAYMUON);
    const formattedBorrowedDate = isNaN(borrowedDate.getTime())
      ? "Invalid Date"
      : borrowedDate.getFullYear() +
        "-" +
        (borrowedDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        borrowedDate.getDate().toString().padStart(2, "0");
    const returnedDate = product.NGAYTRA
      ? new Date(product.NGAYTRA).toISOString().split("T")[0]
      : null; // Định dạng NGAYTRA nếu tồn tại
    return {
      id: product._id,
      reader: product.reader,
      book: product.book,
      borroweddate: formattedBorrowedDate,
      returnedDate: returnedDate, // Thêm trường returnedDate
    };
  });
});

const totalPay = (track) => {
  const borrowedDate = new Date(track.borroweddate);
  if (isNaN(borrowedDate.getTime())) {
    console.error(
      `Invalid borrowed date for track ${track.id}: ${track.borroweddate}`
    );
    return 0;
  }
  const endDate = track.returnedDate ? new Date(track.returnedDate) : now.value;
  const diffTime = Math.abs(endDate.getTime() - borrowedDate.getTime()); // Sửa để dùng endDate
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays * (track.book.DONGIA || 0); // Dùng DONGIA từ book
};

const openModal = (track, type) => {
  selectedTrack.value = track;
  modalType.value = type; // "return" hoặc "delete"
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const confirmAction = async () => {
  if (modalType.value === "return") {
    await markAsReturned(selectedTrack.value);
  } else if (modalType.value === "delete") {
    await deleteTrack(selectedTrack.value);
  }
  closeModal();
};

const markAsReturned = async (track) => {
  try {
    const res = await TracksService.returnBook(track.id); // Gọi endpoint returnBook
    if (res.isSuccess === true) {
      const allProducts = await TracksService.getAll();
      products.value = allProducts.data.map((product) => {
        const borrowedDate = new Date(product.NGAYMUON);
        const formattedBorrowedDate = isNaN(borrowedDate.getTime())
          ? "Invalid Date"
          : borrowedDate.getFullYear() +
            "-" +
            (borrowedDate.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            borrowedDate.getDate().toString().padStart(2, "0");
        const returnedDate = product.NGAYTRA
          ? new Date(product.NGAYTRA).toISOString().split("T")[0]
          : null;
        return {
          id: product._id,
          reader: product.reader,
          book: product.book,
          borroweddate: formattedBorrowedDate,
          returnedDate: returnedDate,
        };
      });
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  } catch (error) {
    console.error("Failed to mark book as returned:", error);
    message.error("Failed to mark book as returned");
  }
};

const deleteTrack = async (track) => {
  try {
    const res = await TracksService.delete(track.id); // Gọi endpoint delete
    if (res.isSuccess === true) {
      const allProducts = await TracksService.getAll();
      products.value = allProducts.data.map((product) => {
        const borrowedDate = new Date(product.NGAYMUON);
        const formattedBorrowedDate = isNaN(borrowedDate.getTime())
          ? "Invalid Date"
          : borrowedDate.getFullYear() +
            "-" +
            (borrowedDate.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            borrowedDate.getDate().toString().padStart(2, "0");
        const returnedDate = product.NGAYTRA
          ? new Date(product.NGAYTRA).toISOString().split("T")[0]
          : null;
        return {
          id: product._id,
          reader: product.reader,
          book: product.book,
          borroweddate: formattedBorrowedDate,
          returnedDate: returnedDate,
        };
      });
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  } catch (error) {
    console.error("Failed to delete the track:", error);
    message.error("Failed to delete the track");
  }
};
</script>

<template>
  <div class="mt-12">
    <div class="px-4 sm:px-0">
      <h3 class="text-base font-semibold leading-7 text-gray-900">
        Chi tiết mượn sách
      </h3>
      <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
        Thông tin chi tiết
      </p>
    </div>
    <div class="mt-6 border-t border-gray-300">
      <ul role="list" class="divide-y divide-gray-300">
        <li
          v-for="product in products"
          :key="product.id"
          class="flex justify-between gap-x-6 py-5"
        >
          <div class="flex min-w-0 gap-x-4">
            <img
              class="h-full w-full max-w-[150px] object-fill flex-none bg-gray-50"
              :src="product.book.HINHANH"
              alt=""
            />
            <div class="min-w-0 flex-auto">
              <p
                class="text-base font-semibold leading-6 text-gray-700 border-b-2 border-gray-200 mt-2"
              >
                Tên sách: {{ product.book.TENSACH }}
              </p>
              <p
                class="text-base font-semibold leading-6 text-gray-700 border-b-2 border-gray-200 mt-2"
              >
                Độc giả: {{ product.reader.HOLOT }} {{ product.reader.TEN }}
              </p>
              <p
                class="text-base font-semibold leading-6 text-gray-700 border-b-2 border-gray-200 mt-2"
              >
                Phone number: {{ product.reader.DIENTHOAI }}
              </p>
              <p
                class="text-base font-semibold leading-6 text-gray-700 border-b-2 border-gray-200 mt-2"
              >
                Address: {{ product.reader.DIACHI }}
              </p>
            </div>
          </div>
          <div class="shrink-0 sm:flex sm:flex-col sm:items-end">
            <p class="text-base font-semibold leading-6 text-gray-900">
              {{ product.book.DONGIA }} VND/Ngày
            </p>
            <p
              v-if="product.borroweddate"
              class="mt-1 text-sm leading-5 text-gray-500"
            >
              Rent at:
              <time :datetime="product.borroweddate">{{
                product.borroweddate
              }}</time>
            </p>
            <p
              v-if="product.returnedDate"
              class="mt-1 text-sm leading-5 text-gray-500"
            >
              Returned at:
              <time :datetime="product.returnedDate">{{
                product.returnedDate
              }}</time>
            </p>
            <p
              v-if="
                product.borroweddate && product.borroweddate !== 'Invalid Date'
              "
              class="mt-1 text-md leading-5 font-semibold text-black italic"
            >
              Total: {{ totalPay(product) }} VND
            </p>
            <div class="flex mt-4">
              <button
                v-if="!product.returnedDate"
                class="p-1 border-2 border-gray-400 rounded-full mx-2"
                @click.stop="openModal(product, 'return')"
              >
                <i class="fa-solid fa-check text-xs w-6"></i>
              </button>
              <button
                v-if="product.returnedDate"
                class="p-1 border-2 border-gray-400 rounded-full mx-2"
                @click.stop="openModal(product, 'delete')"
              >
                <i class="fa-solid fa-trash text-xs w-6"></i>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                v-if="modalType === 'return'"
                class="text-lg leading-6 font-medium text-gray-900"
              >
                Mark Book as Returned
              </h3>
              <h3
                v-if="modalType === 'delete'"
                class="text-lg leading-6 font-medium text-gray-900"
              >
                Delete Track
              </h3>
              <div class="mt-2">
                <p v-if="modalType === 'return'" class="text-sm text-gray-500">
                  Are you sure you want to mark the book "{{
                    selectedTrack.book.TENSACH
                  }}" as returned? The total payment is
                  {{ totalPay(selectedTrack) }} VND.
                </p>
                <p v-if="modalType === 'delete'" class="text-sm text-gray-500">
                  Are you sure you want to delete the track for the book "{{
                    selectedTrack.book.TENSACH
                  }}"?
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="confirmAction"
          >
            Confirm
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
