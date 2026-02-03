interface FormItemProps {
  id?: number;
  type: number; // 1菜单 2iframe 3按钮
  parent_id: number;
  name: string;
  code: string;
  path: string;
  route_name: string;
  component: string;
  redirect: string;
  icon: string;
  active_menu: string;
  is_show: boolean;
  show_parent: boolean;
  is_cache: boolean;
  is_tab: boolean;
  is_affix: boolean;
  iframe_url: string;
  iframe_loading: boolean;
  sort: number;
  status: number;
}

interface FormProps {
  formInline: FormItemProps;
  higherMenuOptions: Record<string, any>[];
}

export type { FormItemProps, FormProps };
