# 100分后台管理系统

[![license](https://img.shields.io/github/license/pure-admin/vue-pure-admin.svg)](LICENSE)

**中文** | [English](./README.en-US.md)

## 简介

本项目是基于 [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) 提炼出的精简版框架。它保留了核心功能，去除了冗余代码，旨在提供一个轻量级、高性能的后台管理系统基础架子，非常适合作为实际项目的起步模板。

在全局引入 [element-plus](https://element-plus.org) 的情况下，打包体积依然保持在 `2.3MB` 以下。若开启 `brotli` 压缩并配合 `cdn` 策略，打包体积可进一步压缩至 `350kb` 以下。

## 核心特性

- **最新技术栈**: 基于 Vue 3, Vite, TypeScript, Pinia, Element Plus, Tailwind CSS 等前沿技术构建。
- **轻量高效**: 剔除冗余组件和逻辑，保留最核心的后台管理功能，保证项目的轻量化和高性能。
- **响应式布局**: 完美适配电脑、平板、手机等多种终端设备。
- **权限管理**: 内置完善的 RBAC (Role-Based Access Control) 权限控制机制，支持页面级别和按钮级别的权限控制。
- **动态路由**: 支持基于后端返回的菜单数据动态生成路由。
- **组件丰富**: 提炼了常用的业务组件，如二次封装的表格、表单、弹窗等，提高开发效率。
- **代码规范**: 集成 ESLint, Prettier, Stylelint, Commitlint 等规范工具，保证代码质量。

## 目录结构

```text
src
├── api             # 接口请求
├── assets          # 静态资源
├── components      # 公共组件
├── config          # 全局配置
├── directives      # 自定义指令
├── layout          # 布局组件
├── plugins         # 插件配置
├── router          # 路由配置
├── store           # 状态管理
├── style           # 全局样式
├── utils           # 工具函数
└── views           # 页面文件
    ├── error       # 错误页面
    ├── login       # 登录页面
    ├── system      # 系统管理 (用户、角色、菜单、权限)
    └── welcome     # 欢迎页面
```

## 安装使用

### 环境准备

- Node.js >= 16.0.0
- pnpm >= 7.0.0

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

### 生产环境打包

```bash
pnpm build
```

### 预览生产环境构建

```bash
pnpm preview
```

## 配套资源

- **完整版文档**: [vue-pure-admin 文档](https://pure-admin.cn/)
- **工具库文档**: [@pureadmin/utils 文档](https://pure-admin-utils.netlify.app)
- **UI 设计视频**: [Bilibili 视频](https://www.bilibili.com/video/BV17g411T7rq)
- **快速开发教程**: [Bilibili 视频](https://www.bilibili.com/video/BV1kg411v7QT)

## 许可证

[MIT © 2020-present, pure-admin](./LICENSE)
