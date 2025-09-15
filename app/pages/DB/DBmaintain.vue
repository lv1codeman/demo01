<template>
  <div>
    <h2>從 API 載入的學生資料</h2>

    <div v-if="errorMessage" class="text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <v-card v-else>
      <v-card-title> 學生資料表 </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-10"
      ></v-data-table>
    </v-card>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "layout1",
});

import { ref, onMounted } from "vue";
import { getData } from "@/utils/http.js";

// -----------------
// 狀態變數
// -----------------
const items = ref([]); // 用來存放從 API 抓取到的資料
const errorMessage = ref(null);

// -----------------
// 表格標頭設定
// -----------------
// value: 對應 JSON 資料中的鍵
// title: 顯示在表格上的欄位名稱
const headers = [
  { value: "CLASS", title: "班級" },
  { value: "DEPTSHORT", title: "系所簡稱" },
];

// 抓取資料的函式
const fetchData = async () => {
  try {
    const data = await getData();
    items.value = data; // 將抓到的資料賦予 items
    console.log("value getting test...");
    console.log(items.value);
    console.log(
      items.value
        .filter((item) => item.CLASS === "輔一甲")
        .map((item) => item.DEPTSHORT)
    );
  } catch (error) {
    errorMessage.value = "無法從 API 取得資料。";
  }
};

onMounted(() => {
  fetchData();
});
</script>
