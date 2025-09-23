<template>
  <div>
    <!-- 使用 DataTableCRUD 組件並傳遞所需的屬性 -->
    <DataTableCRUD
      :title="'班級-系所簡稱對照表維護'"
      :tableTitle="'班級-系所簡稱對照表'"
      :headers="headers"
      :apiUrl="''"
      :apiEndpoints="classDeptshortApiEndpoints"
      :formFields="cagentFormFields"
      :itemSingular="'對照規則'"
    />
  </div>
</template>

<script setup>
import DataTableCRUD from "@/components/DataTableCRUD.vue";
import { ref } from "vue";

definePageMeta({
  layout: "layout1",
});

// 這裡定義 CagentMaintenance 組件特有的配置
const headers = [
  {
    value: "ID",
    title: "ID",
    sortable: false,
    width: "0px",
    class: "d-none",
    cellClass: "d-none",
  },
  { value: "CLASS", title: "班級" },
  { value: "DEPTSHORT", title: "系所簡稱" },
  { value: "actions", title: "操作", sortable: false },
];

const classDeptshortApiEndpoints = {
  get: "/get_class_deptshort",
  add: "/add_class_deptshort",
  update: "/update_class_deptshort/{id}",
  delete: "/delete_class_deptshort/{id}",
};

const requiredRule = (value) => !!value || "此欄位為必填。";

// 定義表單欄位
const cagentFormFields = [
  { key: "CLASS", label: "班級", type: "text", rules: [requiredRule] },
  { key: "DEPTSHORT", label: "系所簡稱", type: "text", rules: [requiredRule] },
];
</script>
