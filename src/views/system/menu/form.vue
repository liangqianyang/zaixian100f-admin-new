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
    right_icon: "",
    enter_transition: "",
    leave_transition: "",
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
        <el-form-item label="路由名称" prop="route_name">
          <el-input
            v-model="formInline.route_name"
            clearable
            placeholder="请输入路由名称"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="路由路径" prop="path">
          <el-input
            v-model="formInline.path"
            clearable
            placeholder="请输入路由路径"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="组件路径">
          <el-input
            v-model="formInline.component"
            clearable
            placeholder="请输入组件路径"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="菜单排序">
          <el-input-number
            v-model="formInline.sort"
            class="w-full!"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="路由重定向">
          <el-input
            v-model="formInline.redirect"
            clearable
            placeholder="请输入默认跳转地址"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="菜单图标">
          <IconSelect v-model="formInline.icon" class="w-full" />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="右侧图标">
          <el-input
            v-model="formInline.right_icon"
            clearable
            placeholder="请输入右侧图标"
          >
            <template #append>
              <IconSelect v-model="formInline.right_icon" />
            </template>
          </el-input>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="进场动画">
          <el-select
            v-model="formInline.enter_transition"
            clearable
            placeholder="请选择页面进场加载动画"
          >
            <el-option
              label="animate__fadeInRight"
              value="animate__fadeInRight"
            />
            <el-option
              label="animate__fadeInLeft"
              value="animate__fadeInLeft"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="离场动画">
          <el-select
            v-model="formInline.leave_transition"
            clearable
            placeholder="请选择页面离场加载动画"
          >
            <el-option
              label="animate__fadeOutRight"
              value="animate__fadeOutRight"
            />
            <el-option
              label="animate__fadeOutLeft"
              value="animate__fadeOutLeft"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="菜单激活">
          <el-input
            v-model="formInline.active_menu"
            clearable
            placeholder="请输入需要激活的菜单"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="菜单">
          <el-radio-group v-model="formInline.is_show">
            <el-radio :label="true" border>显示</el-radio>
            <el-radio :label="false" border>隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="父级菜单">
          <el-radio-group v-model="formInline.show_parent">
            <el-radio :label="true" border>显示</el-radio>
            <el-radio :label="false" border>隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="缓存页面">
          <el-radio-group v-model="formInline.is_cache">
            <el-radio :label="true" border>缓存</el-radio>
            <el-radio :label="false" border>不缓存</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="标签页">
          <el-radio-group v-model="formInline.is_tab">
            <el-radio :label="true" border>允许</el-radio>
            <el-radio :label="false" border>禁止</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="固定标签页">
          <el-radio-group v-model="formInline.is_affix">
            <el-radio :label="true" border>固定</el-radio>
            <el-radio :label="false" border>不固定</el-radio>
          </el-radio-group>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
