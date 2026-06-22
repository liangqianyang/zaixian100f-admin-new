<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "@/views/system/hooks";
import { ENV_OPTIONS, TYPE_OPTIONS } from "@/api/common";
import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    env: 0,
    group: "",
    key: "",
    value: "",
    is_secret: false,
    type: 1,
    description: ""
  }),
  isEdit: false,
  groups: () => []
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();

function getRef() {
  return ruleFormRef.value;
}

/** 分组联想：从已有分组过滤，输入任意值均可（支持新建） */
function queryGroups(queryString: string, callback: (items: any[]) => void) {
  const list = props.groups;
  const results = queryString
    ? list.filter(g => g.toLowerCase().includes(queryString.toLowerCase()))
    : list;
  callback(results.map(g => ({ value: g })));
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="formInline"
    :rules="formRules"
    label-width="90px"
  >
    <el-row :gutter="30">
      <re-col :value="12">
        <el-form-item label="环境" prop="env">
          <el-select
            v-model="formInline.env"
            :disabled="isEdit"
            placeholder="请选择环境"
            class="w-full"
          >
            <el-option
              v-for="item in ENV_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12">
        <el-form-item label="值类型" prop="type">
          <el-select
            v-model="formInline.type"
            placeholder="请选择值类型"
            class="w-full"
          >
            <el-option
              v-for="item in TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="分组" prop="group">
          <el-autocomplete
            v-model="formInline.group"
            :disabled="isEdit"
            :fetch-suggestions="queryGroups"
            placeholder="输入分组，如 oss / sms / wechat（可新建）"
            class="w-full"
            clearable
          />
        </el-form-item>
      </re-col>
      <re-col :value="12">
        <el-form-item label="配置键" prop="key">
          <el-input
            v-model="formInline.key"
            :disabled="isEdit"
            clearable
            placeholder="如 access_key_id"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12">
        <el-form-item label="是否敏感">
          <el-switch
            v-model="formInline.is_secret"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="加密"
            inactive-text="明文"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24">
        <el-form-item label="配置值" prop="value">
          <el-input
            v-model="formInline.value"
            type="textarea"
            :rows="2"
            clearable
            :placeholder="
              isEdit && formInline.is_secret
                ? '留空表示不修改（不回显明文）'
                : '请输入配置值'
            "
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="说明">
          <el-input
            v-model="formInline.description"
            type="textarea"
            :rows="2"
            clearable
            placeholder="选填，配置用途说明"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
