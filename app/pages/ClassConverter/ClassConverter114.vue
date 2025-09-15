<template>
  <div>
    <h1>班級轉換(114以後)</h1>

    <v-expansion-panels class="mt-4 w-50">
      <v-expansion-panel title="使用教學">
        <v-expansion-panel-text>
          <ul>
            <li>
              在左輸入框貼上從Excel複製的班級簡稱，右邊輸入框會自動產出結果。
            </li>
            <li>貼上後想看不同結果可選擇下拉選項</li>
            <li>可將結果複製貼回Excel中使用。</li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="conditional-area d-flex align-center">
      <v-select
        class="function-selector mt-4"
        :items="convert_types"
        label="功能選擇"
        :style="{ maxWidth: `${selectWidth}px` }"
        density="comfortable"
      ></v-select>
    </div>

    <v-container id="mpage" class="px-0">
      <v-row no-gutters class="align-center">
        <v-col cols="auto">
          <v-textarea
            v-model="inputText"
            ref="inputRef"
            class="resizable-textarea text-right"
            label="輸入框"
          ></v-textarea>
        </v-col>
        <v-col cols="auto" class="px-2 pb-5">
          <div class="d-flex flex-column ga-5">
            <v-btn color="green-lighten-3 text-grey-darken-4">
              Copy
              <v-icon icon="mdi-content-copy" end></v-icon>
            </v-btn>
            <v-btn color="blue-lighten-3 text-grey-darken-4">
              Clear
              <v-icon icon="mdi-close-circle-outline" end></v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="auto">
          <v-textarea
            v-model="outputText"
            ref="outputRef"
            class="resizable-textarea"
            label="輸出框"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "layout1",
});

import { ref, computed, watch, onMounted } from "vue";
import { getData } from "@/utils/http.js";

const inputRef = ref(null);
const outputRef = ref(null);
let isScrolling = false; // 防止無限迴圈的旗標

const handleScroll = (scrollingElement, targetElement) => {
  if (!isScrolling) {
    isScrolling = true;
    targetElement.scrollTop = scrollingElement.scrollTop;
  }
  isScrolling = false;
};

// -------------------
// 狀態變數
// -------------------
const classlist = ref([]);
const inputText = ref("");
const outputText = ref("");
const convert_types = [
  "系所簡稱",
  "系所全名",
  "學院簡稱",
  "學院全名",
  "系辦助理",
  "系辦助理分機",
  "系辦助理Email",
  "課務承辦人",
  "課務承辦人分機",
  "課務承辦人Email",
];

const syncHeight = () => {
  if (inputRef.value && outputRef.value) {
    const inputTextArea = inputRef.value.$el.querySelector("textarea");
    const outputTextArea = outputRef.value.$el.querySelector("textarea");

    // 檢查哪個輸入框被使用者手動改變了大小
    if (inputTextArea.offsetHeight !== outputTextArea.offsetHeight) {
      // 假設是 inputTextArea 被改變了
      outputTextArea.style.height = `${inputTextArea.offsetHeight}px`;
      // 或者反過來
      inputTextArea.style.height = `${outputTextArea.offsetHeight}px`;
    }
  }
};

// -------------------
// 頁面載入時獲取資料
// -------------------
onMounted(async () => {
  if (inputRef.value && outputRef.value) {
    inputRef.value.$el
      .querySelector("textarea")
      .addEventListener("scroll", () => {
        handleScroll(
          inputRef.value.$el.querySelector("textarea"),
          outputRef.value.$el.querySelector("textarea")
        );
      });
    outputRef.value.$el
      .querySelector("textarea")
      .addEventListener("scroll", () => {
        handleScroll(
          outputRef.value.$el.querySelector("textarea"),
          inputRef.value.$el.querySelector("textarea")
        );
      });
  }

  // 獲取實際的 textarea DOM 元素
  const inputTextArea = inputRef.value.$el.querySelector("textarea");
  const outputTextArea = outputRef.value.$el.querySelector("textarea");

  // 監聽 inputTextArea 的 resize 事件
  inputTextArea.addEventListener("mouseup", syncHeight);
  inputTextArea.addEventListener("touchend", syncHeight);

  // 監聽 outputTextArea 的 resize 事件
  outputTextArea.addEventListener("mouseup", syncHeight);
  outputTextArea.addEventListener("touchend", syncHeight);

  try {
    const data = await getData();
    classlist.value = data;
    console.log("資料已成功載入到 classlist:", classlist.value);
  } catch (error) {
    console.error("載入資料失敗:", error);
  }
});

// -------------------
// 使用 Map 提升查詢效能
// -------------------
const deptMap = computed(() => {
  const map = new Map();
  if (classlist.value) {
    classlist.value.forEach((item) => {
      // 使用 CLASS 欄位作為 key
      map.set(item.CLASS, item.DEPTSHORT);
    });
  }
  return map;
});

// -------------------
// 即時轉換邏輯
// -------------------
const convertedText = computed(() => {
  if (!inputText.value || !classlist.value.length) return "";

  // 將輸入文字按行分割，並對每一行進行處理
  const lines = inputText.value.split("\n");
  const results = lines.map((line) => {
    const trimmedLine = line.trim();
    // 從 map 中查找對應的 DEPTSHORT
    return deptMap.value.get(trimmedLine) || "查無資料";
  });

  // 將處理後的結果重新組合成字串
  return results.join("\n");
});

// -------------------
// 監聽轉換結果並更新輸出框
// -------------------
watch(convertedText, (newValue) => {
  outputText.value = newValue;
});

// -------------------
// 動態計算寬度 (保持不變)
// -------------------
const selectWidth = computed(() => {
  const longestString = convert_types.reduce(
    (a, b) => (a.length > b.length ? a : b),
    ""
  );
  const characterWidth = 10;
  const padding = 80;
  return longestString.length * characterWidth + padding;
});
</script>

<style scoped>
li {
  margin-left: 20px;
}
.v-textarea.resizable-textarea :deep(.v-field) {
  flex: 0 1 auto;
}
.v-textarea.resizable-textarea :deep(textarea) {
  resize: both;
}
.v-textarea.resizable-textarea.text-right :deep(textarea) {
  text-align: right;
}
</style>
