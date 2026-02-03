import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const formRules = reactive<FormRules>({
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入菜单编码", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由路径", trigger: "blur" }]
});
