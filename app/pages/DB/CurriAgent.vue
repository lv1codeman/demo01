<template>
  <div>
    <h2>課務承辦人維護</h2>

    <div v-if="errorMessage" class="text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <v-card v-else class="mt-4">
      <v-card-title>
        <div class="d-flex ga-4 justify-space-between align-center">
          <span>課務承辦人</span>
          <div class="d-flex ga-4 align-center">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus-circle"
              @click="openDialog('add')"
              height="40"
              >新增承辦人</v-btn
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
                    v-model="editedItem.NAME"
                    label="姓名"
                    :rules="[requiredRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.EXT"
                    label="分機"
                    :rules="[requiredRule]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.EMAIL"
                    label="Email"
                    :rules="[requiredRule]"
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

// -----------------
// 表格標頭設定
// -----------------
const headers = [
  {
    value: "ID",
    key: "ID",
    title: "ID",
    sortable: false,
    width: "0px",
    class: "d-none",
    cellClass: "d-none",
  },
  { value: "NAME", title: "姓名" },
  { value: "EXT", title: "分機" },
  { value: "EMAIL", title: "Email" },
  { value: "actions", title: "操作", sortable: false },
];

const { $curridataAPI } = useNuxtApp();

const formTitle = computed(() => {
  return dialogType.value === "add" ? "新增承辦人" : "編輯承辦人";
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
const fetchData = async () => {
  try {
    const response = await $curridataAPI.get("/get_cagent");
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
      await $curridataAPI.post("/add_cagent", editedItem.value);
    } else {
      console.log(editedItem.value);
      await $curridataAPI.put(
        `/update_cagent/${editedItem.value.ID}`,
        editedItem.value
      );
    }
    closeDialog();
    await fetchData();
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response?.data?.detail || "儲存資料失敗。";
  }
};

const deleteItem = async (item) => {
  if (!item || !item.ID) {
    errorMessage.value = "刪除失敗：無效的承辦人 ID。";
    console.error("嘗試刪除一個沒有 ID 的項目。");
    return;
  }
  if (confirm(`確定要刪除承辦人 ${item.NAME} 嗎？`)) {
    try {
      await $curridataAPI.delete(`/delete_cagent/${item.ID}`);
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
