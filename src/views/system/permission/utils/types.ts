interface FormItemProps {
  id?: number;
  name: string;
  code: string;
  menu_id: number;
  description: string;
  type: number; // 1API权限 2按钮权限
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
