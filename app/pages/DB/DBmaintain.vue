<template>
  <div>
    <h2>系所表維護</h2>

    <div v-if="errorMessage" class="text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <v-card v-else>
      <v-card-title> 系所表 </v-card-title>
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
  { value: "COLLEGE", title: "學院全名" },
  { value: "COLLEGESHORT", title: "學院簡稱" },
  { value: "DEPTSHORT", title: "系所簡稱" },
  { value: "DEPT", title: "系所全名" },
  { value: "STYPE", title: "學制" },
  { value: "AGENT", title: "承辦人" },
  { value: "AGENTEXT", title: "承辦人分機" },
  { value: "AGENTEMAIL", title: "承辦人Email" },
  { value: "CAGENT", title: "課務承辦人" },
  { value: "CAGENTEXT", title: "課務承辦人分機" },
  { value: "CAGENTEMAIL", title: "課務承辦人Email" },
];

// 取得我們在外掛中提供的 axios 實例
const { $curridataAPI } = useNuxtApp();

// 抓取資料的函式
const fetchData = async () => {
  try {
    // 直接使用 $curridataAPI 來發送請求
    const response = await $curridataAPI.get("/get_deptlist");
    items.value = response.data; // 將抓到的資料賦予 items
  } catch (error) {
    console.error(error); // 打印出完整錯誤訊息以利除錯
    errorMessage.value = "無法從 API 取得資料。";
  }
};

onMounted(() => {
  fetchData();
});
</script>
