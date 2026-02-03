<script setup lang="ts">
import { ref, computed } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "@/views/system/hooks";
import ReCol from "@/components/ReCol";
import Segmented from "@/components/ReSegmented";
import IconSelect from "@/components/ReIcon/src/Select.vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    type: 1,
    parent_id: 0,
    name: "",
    code: "",
    path: "",
    route_name: "",
    component: "",
    redirect: "",
    icon: "",
    active_menu: "",
    is_show: true,
    show_parent: true,
    is_cache: false,
    is_tab: true,
    is_affix: false,
    iframe_url: "",
    iframe_loading: true,
    sort: 99,
    status: 1
  }),
  higherMenuOptions: () => []
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();

const menuTypeOptions = [
  { label: "菜单", value: 1 },
  { label: "iframe", value: 2 },
  { label: "按钮", value: 3 }
];

const showType = computed(() => {
  return props.formInline.type === 1 || props.formInline.type === 2;
});

const isIframe = computed(() => props.formInline.type === 2);
const isButton = computed(() => props.formInline.type === 3);

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
      <re-col>
        <el-form-item label="菜单类型">
          <Segmented v-model="formInline.type" :options="menuTypeOptions" />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="上级菜单">
          <el-cascader
            v-model="formInline.parent_id"
            class="w-full"
            :options="higherMenuOptions"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级菜单"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="菜单名称" prop="name">
          <el-input
            v-model="formInline.name"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </re-col>

      <re-col v-if="!isButton" :value="12">
        <el-form-item label="路由名称" prop="route_name">
          <el-input
            v-model="formInline.route_name"
            clearable
            placeholder="请输入路由名称"
          />
        </el-form-item>
      </re-col>

      <re-col v-if="!isButton" :value="12">
        <el-form-item label="路由路径" prop="path">
          <el-input
            v-model="formInline.path"
            clearable
            placeholder="请输入路由路径"
          />
        </el-form-item>
      </re-col>

      <re-col v-if="showType && !isIframe" :value="12">
        <el-form-item label="组件路径">
          <el-input
            v-model="formInline.component"
            clearable
            placeholder="请输入组件路径"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="菜单编码" prop="code">
          <el-input
            v-model="formInline.code"
            clearable
            placeholder="请输入菜单编码"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="排序">
          <el-input-number
            v-model="formInline.sort"
            class="w-full!"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>

      <re-col v-if="showType" :value="12">
        <el-form-item label="菜单图标">
          <IconSelect v-model="formInline.icon" class="w-full" />
        </el-form-item>
      </re-col>

      <re-col v-if="showType" :value="12">
        <el-form-item label="菜单状态">
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

      <!-- iframe 专属 -->
      <re-col v-if="isIframe">
        <el-form-item label="iframe链接">
          <el-input
            v-model="formInline.iframe_url"
            clearable
            placeholder="请输入iframe链接地址"
          />
        </el-form-item>
      </re-col>

      <re-col v-if="showType">
        <el-form-item label="显示">
          <el-radio-group v-model="formInline.is_show">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col v-if="showType">
        <el-form-item label="缓存">
          <el-radio-group v-model="formInline.is_cache">
            <el-radio :label="true">缓存</el-radio>
            <el-radio :label="false">不缓存</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col v-if="showType">
        <el-form-item label="标签页">
          <el-radio-group v-model="formInline.is_tab">
            <el-radio :label="true">允许</el-radio>
            <el-radio :label="false">禁止</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
