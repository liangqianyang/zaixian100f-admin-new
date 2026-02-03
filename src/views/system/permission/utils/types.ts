interface FormItemProps {
  id?: number;
  name: string;
  code: string;
  menu_id: number;
  description: string;
  type: number; // 1按钮权限 2API权限
  path: string;
  method: string;
  sort: number;
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
  menuOptions: any[];
}

export type { FormItemProps, FormProps };
