interface FormItemProps {
  id?: number;
  username: string;
  realname: string;
  password?: string;
  phone: string;
  email: string;
  status: number;
  role_ids: number[];
}

interface FormProps {
  formInline: FormItemProps;
  roleOptions: any[];
}

export type { FormItemProps, FormProps };
