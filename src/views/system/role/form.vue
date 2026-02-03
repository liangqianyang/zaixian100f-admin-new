<script setup lang="ts">
import { ref, watch } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "@/views/system/hooks";
import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    description: "",
    sort: 0,
    status: 1,
    permission_ids: []
  }),
  treeData: () => []
});

const ruleFormRef = ref();
const treeRef = ref();
const { switchStyle } = usePublicHooks();

function getRef() {
  return ruleFormRef.value;
}

function getTreeRef() {
  return treeRef.value;
}

defineExpose({ getRef, getTreeRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="formInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="formInline.name"
            clearable
            placeholder="请输入角色名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12">
        <el-form-item label="角色状态">
          <el-switch
            v-model="formInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="角色描述">
          <el-input
            v-model="formInline.description"
            type="textarea"
            clearable
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="菜单权限">
          <el-tree
            ref="treeRef"
            class="w-full"
            :data="treeData"
            show-checkbox
            node-key="id"
            highlight-current
            :props="{ children: 'children', label: 'name' }"
            :default-checked-keys="formInline.permission_ids"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
