<template>
  <div>
    <h1>班級轉換(114以後)</h1>

    <!-- <v-expansion-panels class="mt-4 w-50">
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
    </v-expansion-panels> -->
    <h3>使用教學</h3>
    <ul>
      <li>在左輸入框貼上從Excel複製的班級簡稱，右邊輸入框會自動產出結果。</li>
      <li>貼上後想看不同結果可選擇下拉選項</li>
      <li>可將結果複製貼回Excel中使用。</li>
    </ul>
    <div class="conditional-area d-flex align-center">
      <v-select
        v-model="convert_type"
        class="function-selector mt-4 listitemheight"
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
            ref="inputRef"
            v-model="inputText"
            class="resizable-textarea text-right"
            label="輸入框"
            @paste="handlePaste"
          ></v-textarea>
        </v-col>
        <v-col cols="auto" class="px-2 pb-5">
          <div class="d-flex flex-column ga-5">
            <v-btn
              color="green-lighten-3 text-grey-darken-4"
              @click="copyToClipboard"
            >
              Copy
              <v-icon icon="mdi-content-copy" end></v-icon>
            </v-btn>
            <v-btn
              color="blue-lighten-3 text-grey-darken-4"
              @click="clearTextareas"
            >
              Clear
              <v-icon icon="mdi-close-circle-outline" end></v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="auto">
          <v-textarea
            ref="outputRef"
            v-model="outputText"
            class="resizable-textarea"
            label="輸出框"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      color="success"
      location="bottom right"
    >
      已複製到剪貼簿
    </v-snackbar>
  </div>

  <!-- <div class="v-list-item v-list-item--active v-list-item--link v-theme--light v-list-item--density-default v-list-item--one-line rounded-0 v-list-item--variant-text" tabindex="-2" aria-selected="true" role="option">
  <span class="v-list-item__overlay"></span>
  <span class="v-list-item__underlay"></span>
  <div class="v-list-item__prepend">
    <div class="v-list-item__spacer"></div>
  </div>
    <div class="v-list-item__content" data-no-activator="">
      <div class="v-list-item-title">系所簡稱</div>
    </div>
</div> -->
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useNuxtApp } from "#app";

definePageMeta({
  layout: "layout1",
});

// --- 狀態變數 ---
const classMap = ref(new Map());
const inputText = ref("");
const outputText = ref("");
const inputRef = ref(null);
const outputRef = ref(null);
const convert_type = ref("系所簡稱");
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
const snackbar = ref(false);

let resizeObserverInput = null;
let resizeObserverOutput = null;

const { $curridataAPI } = useNuxtApp();

// --- 處理貼上事件的函式 ---
const handlePaste = (event) => {
  event.preventDefault();
  const pasteData = event.clipboardData.getData("text");
  inputText.value = pasteData.trim();
};

// --- 清空函式 ---
const clearTextareas = () => {
  inputText.value = "";
  outputText.value = "";
};

// --- 複製到剪貼簿函式 ---
const copyToClipboard = async () => {
  try {
    if (!navigator.clipboard) {
      alert("你的瀏覽器不支援剪貼簿功能，請手動複製。");
      return;
    }
    await navigator.clipboard.writeText(outputText.value);
    snackbar.value = true;
  } catch (err) {
    console.error("複製失敗:", err);
    alert("複製失敗，請手動複製。");
  }
};

// --- 頁面載入時獲取資料 ---
onMounted(async () => {
  try {
    // 呼叫新的 API，只獲取一次所有資料
    const { data } = await $curridataAPI.get("/get_all_data");

    // 直接將 API 返回的資料轉換為 Map
    data.forEach((item) => {
      classMap.value.set(item.CLASS, item);
    });

    console.log("資料已成功載入");
  } catch (error) {
    console.error("載入資料失敗:", error);
  }

  // 綁定 DOM 元素 (這部分保持不變)
  const inputTextArea = inputRef.value?.$el.querySelector("textarea");
  const outputTextArea = outputRef.value?.$el.querySelector("textarea");

  if (inputTextArea && outputTextArea) {
    const syncScroll = (event) => {
      if (event.target === inputTextArea) {
        outputTextArea.scrollTop = inputTextArea.scrollTop;
      } else if (event.target === outputTextArea) {
        inputTextArea.scrollTop = outputTextArea.scrollTop;
      }
    };
    inputTextArea.addEventListener("scroll", syncScroll);
    outputTextArea.addEventListener("scroll", syncScroll);

    const syncInputToOutput = () => {
      outputTextArea.style.height = `${inputTextArea.offsetHeight}px`;
      outputTextArea.style.width = `${inputTextArea.offsetWidth}px`;
    };
    const syncOutputToInput = () => {
      inputTextArea.style.height = `${outputTextArea.offsetHeight}px`;
      inputTextArea.style.width = `${outputTextArea.offsetWidth}px`;
    };

    resizeObserverInput = new ResizeObserver(syncInputToOutput);
    resizeObserverOutput = new ResizeObserver(syncOutputToInput);

    resizeObserverInput.observe(inputTextArea);
    resizeObserverOutput.observe(outputTextArea);
  }
});

onBeforeUnmount(() => {
  if (resizeObserverInput) resizeObserverInput.disconnect();
  if (resizeObserverOutput) resizeObserverOutput.disconnect();
});

// --- 使用物件來管理轉換邏輯 ---
const conversionFunctions = {
  系所簡稱: (data) => data.DEPTSHORT,
  系所全名: (data) => data.DEPT,
  學院簡稱: (data) => data.COLLEGESHORT,
  學院全名: (data) => data.COLLEGE,
  系辦助理: (data) => data.AGENT,
  系辦助理分機: (data) => data.AGENTEXT,
  系辦助理Email: (data) => data.AGENTEMAIL,
  課務承辦人: (data) => data.CAGENT,
  課務承辦人分機: (data) => data.CAGENTEXT,
  課務承辦人Email: (data) => data.CAGENTEMAIL,
};

const convertedText = computed(() => {
  if (!inputText.value || !classMap.value.size) {
    return "";
  }
  const lines = inputText.value.split("\n");
  const convertFunc = conversionFunctions[convert_type.value];

  if (!convertFunc) return "無效選項";

  const results = lines.map((line) => {
    const trimmedLine = line.trim();
    const deptData = classMap.value.get(trimmedLine);

    if (!deptData) return "查無資料";
    return convertFunc(deptData);
  });
  return results.join("\n");
});

watch(convertedText, (newValue) => {
  outputText.value = newValue;
});

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
  width: 200px;
  height: 300px;
}
.v-textarea.resizable-textarea.text-right :deep(textarea) {
  text-align: right;
}

.v-snackbar :deep(.v-snackbar__wrapper) {
  bottom: 100px !important;
  right: 100px !important;
  top: auto !important;
  left: auto !important;
}
.listitemheight {
  min-height: 20px !important;
}
.v-overlay-container .v-overlay__content {
  max-height: 200px;
}
:deep(.v-list-item--density-default.v-list-item--one-line) {
  min-height: 20px;
}
</style>
<style>
.v-overlay-container .v-list-item--density-default.v-list-item--one-line {
  min-height: 20px !important;
}
</style>
