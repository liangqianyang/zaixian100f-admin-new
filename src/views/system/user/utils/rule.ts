import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const formRules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  realname: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
  password: [{ required: false, message: "请输入密码", trigger: "blur" }], // 编辑时不填则不改
  role_ids: [{ required: true, message: "请选择角色", trigger: "change" }]
});
