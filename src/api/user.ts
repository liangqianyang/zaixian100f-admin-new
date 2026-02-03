import { http } from "@/utils/http";

/** 统一响应结构 */
export type ResponseData<T> = {
  code: number;
  message: string;
  data: T;
};

/** 登录接口返回数据 */
export type LoginResult = {
  token: string;
  user: {
    id: number;
    username: string;
    realname: string;
    avatar: string;
    email: string;
    phone: string;
    status: number;
    roles: string[]; // 角色列表
  };
  menus: Array<any>; // 后端菜单结构，需要转换
  permissions: Array<string>; // 权限编码列表
};

/** 刷新Token返回数据 */
export type RefreshTokenResult = {
  token: string;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<ResponseData<LoginResult>>("post", "/admin/login", {
    data
  });
};

/** 退出登录 */
export const logoutApi = () => {
  return http.request<ResponseData<null>>("post", "/admin/logout");
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<ResponseData<RefreshTokenResult>>(
    "post",
    "/admin/refresh",
    {
      data
    }
  );
};

/** 获取用户信息 */
export const getUserInfo = () => {
  return http.request<ResponseData<LoginResult>>("get", "/admin/me");
};
