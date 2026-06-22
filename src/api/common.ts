import { http } from "@/utils/http";
import type { ResponseData } from "./user";

/** 配置项（敏感项 value 为掩码） */
export type Config = {
  id: number;
  env: number; // 0common 1dev 2test 3prod
  env_label: string;
  group: string;
  key: string;
  value: string; // 敏感项后端掩码输出
  is_secret: boolean;
  type: number; // 1string 2int 3bool 4json
  type_label: string;
  description: string;
  created_at?: string;
  updated_at?: string;
};

/** 环境选项 */
export const ENV_OPTIONS = [
  { value: 0, label: "通用" },
  { value: 1, label: "开发" },
  { value: 2, label: "测试" },
  { value: 3, label: "生产" }
];

/** 值类型选项 */
export const TYPE_OPTIONS = [
  { value: 1, label: "字符串" },
  { value: 2, label: "整数" },
  { value: 3, label: "布尔" },
  { value: 4, label: "JSON" }
];

/** 配置列表 */
export const getConfigList = (params?: object) => {
  return http.request<ResponseData<{ list: Config[]; total: number }>>(
    "get",
    "/admin/common/configs",
    { params }
  );
};

/** 所有分组 */
export const getConfigGroups = () => {
  return http.request<ResponseData<string[]>>(
    "get",
    "/admin/common/configs/groups"
  );
};

/** 配置详情 */
export const getConfigDetail = (id: number) => {
  return http.request<ResponseData<Config>>(
    "get",
    `/admin/common/configs/${id}`
  );
};

/** 创建配置 */
export const createConfig = (data: object) => {
  return http.request<ResponseData<Config>>("post", "/admin/common/configs", {
    data
  });
};

/** 更新配置（敏感项 value 留空表示不修改） */
export const updateConfig = (id: number, data: object) => {
  return http.request<ResponseData<Config>>(
    "put",
    `/admin/common/configs/${id}`,
    { data }
  );
};

/** 删除配置 */
export const deleteConfig = (id: number) => {
  return http.request<ResponseData<any>>(
    "delete",
    `/admin/common/configs/${id}`
  );
};
