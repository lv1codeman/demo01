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
        v-model="convert_type"
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
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useNuxtApp } from "#app";

definePageMeta({
  layout: "layout1",
});

// --- 狀態變數 ---
const classlist = ref([]);
const deplist = ref([]);
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

// 使用 useNuxtApp() 來取得我們在外掛中提供的 curridataAPI 實例
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
    // 使用 $curridataAPI 來發送請求
    const [classData, depData] = await Promise.all([
      $curridataAPI.get("/classdeptshort"),
      $curridataAPI.get("/deptlist"),
    ]);
    classlist.value = classData.data;
    deplist.value = depData.data;
    console.log("資料已成功載入");
  } catch (error) {
    console.error("載入資料失敗:", error);
  }

  // 綁定 DOM 元素 (以下程式碼保持不變)
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

// --- 查詢邏輯 ---
const classMap = computed(() => {
  const map = new Map();
  if (classlist.value) {
    classlist.value.forEach((item) => {
      map.set(item.CLASS, item.DEPTSHORT);
    });
  }
  return map;
});

const deplistMap = computed(() => {
  const map = new Map();
  if (deplist.value) {
    deplist.value.forEach((item) => {
      map.set(item.DEPTSHORT, item);
    });
  }
  return map;
});

const convertedText = computed(() => {
  if (!inputText.value || !classMap.value.size || !deplistMap.value.size) {
    return "";
  }
  const lines = inputText.value.split("\n");
  const results = lines.map((line) => {
    const trimmedLine = line.trim();
    const deptShort = classMap.value.get(trimmedLine);
    if (!deptShort) return "查無班級";
    const deptData = deplistMap.value.get(deptShort);
    if (!deptData) return "查無系所資料";

    switch (convert_type.value) {
      case "系所簡稱":
        return deptData.DEPTSHORT;
      case "系所全名":
        return deptData.DEPT;
      case "學院簡稱":
        return deptData.COLLEGESHORT;
      case "學院全名":
        return deptData.COLLEGE;
      case "系辦助理":
        return deptData.AGENT;
      case "系辦助理分機":
        return deptData.AGENTEXT;
      case "系辦助理Email":
        return deptData.AGENTEMAIL;
      case "課務承辦人":
        return deptData.CAGENT;
      case "課務承辦人分機":
        return deptData.CAGENTEXT;
      case "課務承辦人Email":
        return deptData.CAGENTEMAIL;
      default:
        return "無效選項";
    }
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
  width: 400px;
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
</style>
