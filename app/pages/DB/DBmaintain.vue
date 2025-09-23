<template>
  <div>
    <DataTableCRUD
      ref="dtCrudRef"
      :title="'系所表維護'"
      :tableTitle="'系所表'"
      :headers="headers"
      :apiUrl="''"
      :apiEndpoints="departmentApiEndpoints"
      :formFields="departmentFormFields"
      :itemSingular="'系所'"
      @on-edit="handleEdit"
      @field-updated="handleFieldUpdated"
    />
  </div>
</template>

<script setup>
import DataTableCRUD from "@/components/DataTableCRUD.vue";
import { ref, onMounted, computed, reactive } from "vue";
import { useNuxtApp } from "#app";

definePageMeta({
  layout: "layout1",
});

const { $curridataAPI } = useNuxtApp();

// -----------------
// 狀態變數
// -----------------
const dtCrudRef = ref(null);
const editedItem = reactive({});
const cagentData = ref([]);

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

const departmentApiEndpoints = {
  get: "/get_deptlist",
  add: "/add_dept",
  update: "/update_dept",
  delete: "/delete_dept/{id}",
};

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

const handleEdit = (item) => {
  // 檢查是否有課務承辦人資料，並轉換為物件
  if (item.CAGENT) {
    const cagent = cagentData.value.find((c) => c.NAME === item.CAGENT);
    if (cagent) {
      item.CAGENT = cagent;
      item.CAGENTEXT = cagent.EXT;
      item.CAGENTEMAIL = cagent.EMAIL;
    }
  }
};

const handleFieldUpdated = ({ key, value }) => {
  // 如果是下拉選單，處理連動欄位
  if (key === "CAGENT" && value) {
    const internalEditedItem = dtCrudRef.value.editedItem;
    internalEditedItem.CAGENT = value;
    internalEditedItem.CAGENTEXT = value.EXT;
    internalEditedItem.CAGENTEMAIL = value.EMAIL;
  }
};

// 定義表單欄位
const departmentFormFields = computed(() => {
  return [
    { key: "COLLEGE", label: "學院全名", type: "text", rules: [requiredRule] },
    {
      key: "COLLEGESHORT",
      label: "學院簡稱",
      type: "text",
      rules: [requiredRule],
    },
    {
      key: "DEPTSHORT",
      label: "系所簡稱",
      type: "text",
      rules: [requiredRule],
    },
    { key: "DEPT", label: "系所全名", type: "text", rules: [requiredRule] },
    { key: "STYPE", label: "學制", type: "text", rules: [requiredRule] },
    { key: "AGENT", label: "承辦人", type: "text", rules: [requiredRule] },
    {
      key: "AGENTEXT",
      label: "承辦人分機",
      type: "text",
      rules: [requiredRule],
    },
    {
      key: "AGENTEMAIL",
      label: "承辦人Email",
      type: "text",
      rules: [requiredRule],
    },
    {
      key: "CAGENT",
      label: "課務承辦人",
      type: "select",
      rules: [requiredRule],
      items: cagentData.value,
      "item-title": "NAME",
      "return-object": true,
    },
    { key: "CAGENTEXT", label: "課務承辦人分機", type: "text", readonly: true },
    {
      key: "CAGENTEMAIL",
      label: "課務承辦人Email",
      type: "text",
      readonly: true,
    },
  ];
});

onMounted(() => {
  fetchCagentData();
});
</script>
