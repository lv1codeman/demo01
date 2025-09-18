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
                    v-model="editedItem.CAGENT"
                    :items="cagentOptions"
                    label="課務承辦人"
                    :rules="[requiredRule]"
                    @update:model-value="updateCagentData"
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
import { ref, onMounted, computed } from "vue";
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

const cagentData = [
  { name: "黃思嘉", ext: "5622", email: "loria@cc.ncue.edu.tw" },
  { name: "邱靜雯", ext: "5623", email: "eenergy177@cc.ncue.edu.tw" },
  { name: "胡怡婷", ext: "5624", email: "yth1149@cc.ncue.edu.tw" },
  { name: "鍾博凱", ext: "5626", email: "s26153@cc.ncue.edu.tw" },
];
const cagentOptions = cagentData.map((item) => item.name);

// -----------------
// 表格標頭設定
// -----------------
const headers = [
  { value: "ID", title: "ID" },
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

const updateCagentData = (selectedName) => {
  const selectedCagent = cagentData.find((item) => item.name === selectedName);
  if (selectedCagent) {
    editedItem.value.CAGENTEXT = selectedCagent.ext;
    editedItem.value.CAGENTEMAIL = selectedCagent.email;
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
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editedItem.value = {};
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
      // 傳入整個 editedItem 物件，其中包含了 ID
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
      // 傳入 ID
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
