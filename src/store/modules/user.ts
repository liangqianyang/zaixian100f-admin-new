import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  type LoginResult,
  type RefreshTokenResult,
  getLogin,
  logoutApi,
  refreshTokenApi,
  getUserInfo
} from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<LoginResult>((resolve, reject) => {
        getLogin(data)
          .then(res => {
            if (res.code === 0) {
              // 登录成功后，获取用户信息
              const token = res.data.token;

              // 先存储 token，以便 getUserInfo 能带上 Authorization 头
              const now = new Date().getTime();
              const expires = now + 7 * 24 * 60 * 60 * 1000;
              setToken({
                accessToken: token,
                refreshToken: token,
                expires: expires
              } as any);

              // 调用 getUserInfo 获取完整信息
              getUserInfo()
                .then(infoRes => {
                  if (infoRes.code === 0) {
                    const { user, menus, permissions } = infoRes.data;

                    // 更新存储的用户信息
                    setToken({
                      accessToken: token,
                      refreshToken: token,
                      expires: expires,
                      username: user.username,
                      nickname: user.realname,
                      avatar: user.avatar,
                      roles: user.roles ?? [],
                      permissions: permissions ?? []
                    } as any);

                    storageLocal().setItem("async-routes", menus);

                    // 将合并后的数据返回给调用方，保持接口一致性
                    resolve({ ...res.data, ...infoRes.data });
                  } else {
                    reject(new Error(infoRes.message));
                  }
                })
                .catch(err => {
                  reject(err);
                });
            } else {
              reject(new Error(res.message));
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（调用接口） */
    logOut() {
      logoutApi().finally(() => {
        this.username = "";
        this.roles = [];
        this.permissions = [];
        removeToken();
        storageLocal().removeItem("async-routes"); // 清除菜单缓存
        useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
        resetRouter();
        router.push("/login");
      });
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(res => {
            if (res.code === 0) {
              const { token } = res.data;
              const now = new Date().getTime();
              const expires = now + 7 * 24 * 60 * 60 * 1000;
              setToken({
                accessToken: token,
                refreshToken: token,
                expires: expires
              } as any);
              resolve(res.data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
