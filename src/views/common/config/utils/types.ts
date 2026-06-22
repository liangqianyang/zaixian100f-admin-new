interface FormItemProps {
  id?: number;
  env: number;
  group: string;
  key: string;
  value: string;
  is_secret: boolean;
  type: number;
  description: string;
}

interface FormProps {
  formInline: FormItemProps;
  isEdit: boolean; // 编辑时 env/group/key 只读
  groups: string[]; // 已有分组，辅助输入
}

export type { FormItemProps, FormProps };
