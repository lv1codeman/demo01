<template>
  <div>
    <h1>這是 DB Maintain 頁面</h1>
    <p>管理系辦列表</p>
  </div>
  <div>
    <h2>API 資料</h2>
    <div v-if="errorMessage">
      <p style="color: red">{{ errorMessage }}</p>
    </div>
    <div v-else-if="apiData">
      <pre>{{ JSON.stringify(apiData, null, 2) }}</pre>
    </div>
    <div v-else>
      <p>正在載入資料...</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "layout1",
});

import { ref, onMounted } from "vue";

const apiData = ref(null);
const errorMessage = ref(null);

const fetchData = async () => {
  try {
    // 直接呼叫函式，不需要 import
    const data = await getData();
    apiData.value = data;
    errorMessage.value = null;
  } catch (error) {
    errorMessage.value = "無法從 API 取得資料，請檢查伺服器是否運行。";
  }
};

// 在元件掛載時自動執行
onMounted(() => {
  fetchData();
});
</script>
