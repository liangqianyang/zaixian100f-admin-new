<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "@/views/system/hooks";
import ReCol from "@/components/ReCol";
import Segmented from "@/components/ReSegmented";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    code: "",
    menu_id: 0,
    description: "",
    type: 1,
    path: "",
    method: "GET",
    sort: 0,
    status: 1
  }),
  menuOptions: () => []
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();

const typeOptions = [
  { label: "API权限", value: 1 },
  { label: "按钮权限", value: 2 }
];

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" }
];

const isApi = computed(() => props.formInline.type === 1);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
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
        <el-form-item label="权限类型">
          <Segmented v-model="formInline.type" :options="typeOptions" />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="归属菜单" prop="menu_id">
          <el-cascader
            v-model="formInline.menu_id"
            class="w-full"
            :options="menuOptions"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择归属菜单"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="权限名称" prop="name">
          <el-input
            v-model="formInline.name"
            clearable
            placeholder="请输入权限名称"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="权限标识" prop="code">
          <el-input
            v-model="formInline.code"
            clearable
            placeholder="请输入权限标识 (如 system:user:add)"
          />
        </el-form-item>
      </re-col>

      <re-col v-if="isApi" :value="12">
        <el-form-item label="接口路径">
          <el-input
            v-model="formInline.path"
            clearable
            placeholder="请输入接口路径"
          />
        </el-form-item>
      </re-col>

      <re-col v-if="isApi" :value="12">
        <el-form-item label="请求方法">
          <el-select
            v-model="formInline.method"
            placeholder="请选择请求方法"
            class="w-full"
          >
            <el-option
              v-for="item in methodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="状态">
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
        <el-form-item label="描述">
          <el-input
            v-model="formInline.description"
            type="textarea"
            clearable
            placeholder="请输入描述"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
