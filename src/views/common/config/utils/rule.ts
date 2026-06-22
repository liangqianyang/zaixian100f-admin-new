import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const formRules = reactive<FormRules>({
  env: [{ required: true, message: "请选择环境", trigger: "change" }],
  group: [
    { required: true, message: "请输入分组", trigger: "blur" },
    {
      pattern: /^[a-z0-9_]+$/,
      message: "仅小写字母、数字、下划线",
      trigger: "blur"
    }
  ],
  key: [
    { required: true, message: "请输入配置键", trigger: "blur" },
    {
      pattern: /^[a-z0-9_.]+$/,
      message: "仅小写字母、数字、下划线、点",
      trigger: "blur"
    }
  ]
});
