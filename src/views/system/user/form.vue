<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "@/views/system/hooks";
import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    username: "",
    realname: "",
    password: "",
    phone: "",
    email: "",
    status: 1,
    role_ids: []
  }),
  roleOptions: () => []
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();

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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formInline.username"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="真实姓名" prop="realname">
          <el-input
            v-model="formInline.realname"
            clearable
            placeholder="请输入真实姓名"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formInline.password"
            clearable
            placeholder="请输入密码（留空则不修改）"
            type="password"
            show-password
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="formInline.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formInline.email"
            clearable
            placeholder="请输入邮箱"
          />
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
        <el-form-item label="分配角色" prop="role_ids">
          <el-select
            v-model="formInline.role_ids"
            multiple
            placeholder="请选择角色"
            class="w-full"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
