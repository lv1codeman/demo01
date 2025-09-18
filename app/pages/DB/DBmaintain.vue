<template>
  <div>
    <h2>系所表維護</h2>

    <div v-if="errorMessage" class="text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <v-card v-else class="mt-4">
      <v-card-title>
        <div class="d-flex ga-4 justify-space-between align-center">
          <span>系所表</span>
          <div class="d-flex ga-4 align-center">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus-circle"
              @click="openDialog('add')"
              height="40"
              >新增系所</v-btn
            >
            <v-text-field
              v-model="search"
              label="輸入關鍵字查詢"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
              class="search-field"
            ></v-text-field>
          </div>
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        class="elevation-10"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="openDialog('edit', item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{ formTitle }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.COLLEGE"
                    label="學院全名"
                    :rules="[requiredRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.COLLEGESHORT"
                    label="學院簡稱"
                    :rules="[requiredRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.DEPTSHORT"
                    label="系所簡稱"
                    :rules="[requiredRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.DEPT"
                    label="系所全名"
                    :rules="[requiredRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.STYPE"
                    label="學制"
                    :rules="[requiredRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.AGENT"
                    label="承辦人"
                    :rules="[requiredRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.AGENTEXT"
                    label="承辦人分機"
                    :rules="[requiredRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.AGENTEMAIL"
                    label="承辦人Email"
                    :rules="[requiredRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="cagentObject"
                    :items="cagentData"
                    item-title="NAME"
                    label="課務承辦人"
                    :rules="[requiredRule]"
                    @update:model-value="updateCagentData"
                    return-object
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.CAGENTEXT"
                    label="課務承辦人分機"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.CAGENTEMAIL"
                    label="課務承辦人Email"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog"
            >取消</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="saveItem"
            >儲存</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useNuxtApp } from "#app";

definePageMeta({
  layout: "layout1",
});

// -----------------
// 狀態變數
// -----------------
const items = ref([]);
const search = ref("");
const errorMessage = ref(null);
const dialog = ref(false);
const editedItem = ref({});
const dialogType = ref("");
const form = ref(null);
const cagentData = ref([]);
const cagentObject = ref(null); // 新增一個變數來儲存選中的完整承辦人物件

// -----------------
// 表格標頭設定
// -----------------
const headers = [
  {
    value: "ID",
    title: "ID",
    sortable: false,
    width: "0px",
    class: "d-none",
    cellClass: "d-none",
  },
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
  { value: "actions", title: "操作", sortable: false },
];

const { $curridataAPI } = useNuxtApp();

const formTitle = computed(() => {
  return dialogType.value === "add" ? "新增系所" : "編輯系所";
});

const filteredItems = computed(() => {
  if (!search.value) {
    return items.value;
  }
  const searchText = search.value.toLowerCase();
  return items.value.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchText)
    )
  );
});

const requiredRule = (value) => !!value || "此欄位為必填。";

// -----------------
// 函式
// -----------------

// 從後端獲取課務承辦人資料
const fetchCagentData = async () => {
  try {
    const response = await $curridataAPI.get("/get_cagent");
    cagentData.value = response.data;
  } catch (error) {
    console.error("無法從 API 取得課務承辦人資料。", error);
  }
};

// 根據選中的承辦人物件，更新相關欄位
const updateCagentData = (selectedCagent) => {
  if (selectedCagent) {
    editedItem.value.CAGENT = selectedCagent.NAME;
    editedItem.value.CAGENTEXT = selectedCagent.EXT;
    editedItem.value.CAGENTEMAIL = selectedCagent.EMAIL;
  } else {
    // 如果選項被清空，也清除相關欄位
    editedItem.value.CAGENT = null;
    editedItem.value.CAGENTEXT = null;
    editedItem.value.CAGENTEMAIL = null;
  }
};

const fetchData = async () => {
  try {
    const response = await $curridataAPI.get("/get_deptlist");
    items.value = response.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = "無法從 API 取得資料。";
  }
};

const openDialog = (type, item = {}) => {
  dialogType.value = type;
  editedItem.value = { ...item };
  // 在編輯模式下，根據 editedItem.CAGENT 找到完整的物件來初始化 cagentObject
  if (type === "edit" && editedItem.value.CAGENT) {
    // 這裡進行修正：使用 trim() 處理字串，確保比對精確
    const cagentNameToFind = editedItem.value.CAGENT.trim();
    cagentObject.value = cagentData.value.find(
      (c) => c.NAME && c.NAME.trim() === cagentNameToFind
    );
  } else {
    cagentObject.value = null; // 新增模式下清空
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editedItem.value = {};
  cagentObject.value = null; // 清空選中的承辦人物件
  if (form.value) {
    form.value.resetValidation();
  }
};

const saveItem = async () => {
  const { valid } = await form.value.validate();
  if (!valid) {
    return;
  }

  try {
    if (dialogType.value === "add") {
      await $curridataAPI.post("/add_dept", editedItem.value);
    } else {
      await $curridataAPI.put("/update_dept", editedItem.value);
    }
    closeDialog();
    await fetchData();
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response?.data?.detail || "儲存資料失敗。";
  }
};

const deleteItem = async (item) => {
  if (confirm(`確定要刪除系所 ${item.DEPT} 嗎？`)) {
    try {
      await $curridataAPI.delete(`/delete_dept/${item.ID}`);
      await fetchData();
    } catch (error) {
      console.error(error);
      errorMessage.value = error.response?.data?.detail || "刪除資料失敗。";
    }
  }
};

onMounted(() => {
  fetchData();
  fetchCagentData();
});
</script>
<style scoped>
.search-field {
  min-width: 100px;
}

/* 在中型螢幕（md）或更大時，最小寬度設為 300px */
@media (min-width: 600px) {
  .search-field {
    min-width: 300px;
  }
}
</style>
