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
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app"; // 匯入 Nuxt 應用程式實例

definePageMeta({
  layout: "layout1",
});

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

// 取得我們在外掛中提供的 axios 實例
const { $curridataAPI } = useNuxtApp();

// 抓取資料的函式
const fetchData = async () => {
  try {
    // 直接使用 $curridataAPI 來發送請求
    const response = await $curridataAPI.get("/classdeptshort");
    items.value = response.data; // 將抓到的資料賦予 items
    console.log("value getting test...");
    console.log(items.value);
    console.log(
      items.value
        .filter((item) => item.CLASS === "輔一甲")
        .map((item) => item.DEPTSHORT)
    );
  } catch (error) {
    console.error(error); // 打印出完整錯誤訊息以利除錯
    errorMessage.value = "無法從 API 取得資料。";
  }
};

onMounted(() => {
  fetchData();
});
</script>
