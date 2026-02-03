import { http } from "@/utils/http";
import type { ResponseData } from "./user";

/** 菜单实体 */
export type Menu = {
  id: number;
  code: string;
  name: string;
  parent_id: number;
  type: number; // 1菜单 2iframe 3按钮
  route_name: string;
  path: string;
  component: string;
  redirect: string;
  icon: string;
  right_icon: string;
  enter_transition: string;
  leave_transition: string;
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
  children?: Menu[];
};

/** 角色实体 */
export type Role = {
  id: number;
  name: string;
  description: string;
  sort: number;
  status: number;
  permission_ids: number[];
  created_at?: string;
  updated_at?: string;
};

/** 权限实体 */
export type Permission = {
  id: number;
  name: string;
  code: string;
  menu_id: number;
  description: string;
  type: number; // 1API权限 2按钮权限
  path: string;
  method: string;
  sort: number;
  status: number;
};

/** 后台用户实体 */
export type AdminUser = {
  id: number;
  username: string;
  realname: string;
  email: string;
  phone: string;
  avatar: string;
  status: number;
  role_ids: number[];
  created_at?: string;
  updated_at?: string;
};

// ================= 菜单管理 =================

/** 获取菜单列表 */
export const getMenuList = (params?: object) => {
  return http.request<ResponseData<{ list: Menu[]; total: number }>>(
    "get",
    "/admin/menus",
    { params }
  );
};

/** 获取菜单树 */
export const getMenuTree = () => {
  return http.request<ResponseData<Menu[]>>("get", "/admin/menus/tree");
};

/** 创建菜单 */
export const createMenu = (data: object) => {
  return http.request<ResponseData<any>>("post", "/admin/menus", { data });
};

/** 更新菜单 */
export const updateMenu = (id: number, data: object) => {
  return http.request<ResponseData<any>>("put", `/admin/menus/${id}`, { data });
};

/** 删除菜单 */
export const deleteMenu = (id: number) => {
  return http.request<ResponseData<any>>("delete", `/admin/menus/${id}`);
};

// ================= 角色管理 =================

/** 获取角色列表 */
export const getRoleList = (params?: object) => {
  return http.request<ResponseData<{ list: Role[]; total: number }>>(
    "get",
    "/admin/roles",
    { params }
  );
};

/** 获取所有角色（不分页） */
export const getAllRoles = () => {
  return http.request<ResponseData<Role[]>>("get", "/admin/roles/all");
};

/** 创建角色 */
export const createRole = (data: object) => {
  return http.request<ResponseData<any>>("post", "/admin/roles", { data });
};

/** 更新角色 */
export const updateRole = (id: number, data: object) => {
  return http.request<ResponseData<any>>("put", `/admin/roles/${id}`, { data });
};

/** 删除角色 */
export const deleteRole = (id: number) => {
  return http.request<ResponseData<any>>("delete", `/admin/roles/${id}`);
};

// ================= 用户管理 =================

/** 获取用户列表 */
export const getUserList = (params?: object) => {
  return http.request<ResponseData<{ list: AdminUser[]; total: number }>>(
    "get",
    "/admin/admin-users",
    { params }
  );
};

/** 创建用户 */
export const createUser = (data: object) => {
  return http.request<ResponseData<any>>("post", "/admin/admin-users", {
    data
  });
};

// 注意：API文档未明确列出更新和删除用户的接口，但根据RESTful规范推断
/** 更新用户 */
export const updateUser = (id: number, data: object) => {
  return http.request<ResponseData<any>>("put", `/admin/admin-users/${id}`, {
    data
  });
};

/** 删除用户 */
export const deleteUser = (id: number) => {
  return http.request<ResponseData<any>>("delete", `/admin/admin-users/${id}`);
};

// ================= 权限管理 =================

/** 获取权限列表 */
export const getPermissionList = (params?: object) => {
  return http.request<ResponseData<{ list: Permission[]; total: number }>>(
    "get",
    "/admin/permissions",
    { params }
  );
};

/** 获取所有权限（不分页） */
export const getAllPermissions = () => {
  return http.request<ResponseData<Permission[]>>(
    "get",
    "/admin/permissions/all"
  );
};

/** 创建权限 */
export const createPermission = (data: object) => {
  return http.request<ResponseData<any>>("post", "/admin/permissions", {
    data
  });
};

/** 更新权限 */
export const updatePermission = (id: number, data: object) => {
  return http.request<ResponseData<any>>("put", `/admin/permissions/${id}`, {
    data
  });
};

/** 删除权限 */
export const deletePermission = (id: number) => {
  return http.request<ResponseData<any>>("delete", `/admin/permissions/${id}`);
};
