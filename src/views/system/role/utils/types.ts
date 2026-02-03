interface FormItemProps {
  id?: number;
  name: string;
  description: string;
  sort: number;
  status: number;
  permission_ids: number[];
}

interface FormProps {
  formInline: FormItemProps;
  treeData: any[]; // 权限树数据
}

export type { FormItemProps, FormProps };
