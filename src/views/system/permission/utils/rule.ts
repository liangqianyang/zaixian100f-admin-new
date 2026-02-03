import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const formRules = reactive<FormRules>({
  name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入权限标识", trigger: "blur" }],
  menu_id: [{ required: true, message: "请选择归属菜单", trigger: "change" }],
  type: [{ required: true, message: "请选择权限类型", trigger: "change" }]
});
