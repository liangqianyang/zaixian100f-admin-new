<script setup lang="ts">
import { useBehaviorLog } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import View from "~icons/ep/view";

defineOptions({
  name: "SystemBehaviorLog"
});

const {
  form,
  formRef,
  loading,
  columns,
  dataList,
  pagination,
  detailVisible,
  detailData,
  detailLoading,
  onSearch,
  resetForm,
  openDetail,
  handleSizeChange,
  handleCurrentChange
} = useBehaviorLog();

function formatJson(val: any) {
  if (!val) return "—";
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return String(val);
  }
}
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-12 overflow-auto"
    >
      <el-form-item label="关键词：" prop="keyword">
        <el-input
          v-model="form.keyword"
          placeholder="用户名/请求路径"
          clearable
          class="w-40!"
        />
      </el-form-item>
      <el-form-item label="行为类型：" prop="action_name">
        <el-input
          v-model="form.action_name"
          placeholder="如 login"
          clearable
          class="w-[130px]"
        />
      </el-form-item>
      <el-form-item label="时间范围：" prop="start_time">
        <el-date-picker
          v-model="form.start_time"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="开始时间"
          class="w-[180px]"
        />
      </el-form-item>
      <el-form-item prop="end_time">
        <el-date-picker
          v-model="form.end_time"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="结束时间"
          class="w-[180px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="行为日志" :columns="columns" @refresh="onSearch">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          align-whole="center"
          showOverflowTooltip
          table-layout="fixed"
          :loading="loading"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(View)"
              @click="openDetail(row)"
            >
              详情
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      title="行为日志详情"
      size="600px"
      destroy-on-close
    >
      <div v-loading="detailLoading">
        <template v-if="detailData">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="ID">
              {{ detailData.id }}
            </el-descriptions-item>
            <el-descriptions-item label="请求ID">
              {{ detailData.request_id || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="行为类型">
              {{ detailData.action_name_label || detailData.action_name }}
            </el-descriptions-item>
            <el-descriptions-item label="用户">
              {{ detailData.user_name || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="用户ID">
              {{ detailData.user_id || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="状态码">
              {{ detailData.status_code }}
            </el-descriptions-item>
            <el-descriptions-item label="请求路径" :span="2">
              <span class="break-all">{{ detailData.path }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="请求方法">
              {{ detailData.method }}
            </el-descriptions-item>
            <el-descriptions-item label="IP">
              {{ detailData.ip || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="时间">
              {{ detailData.created_at || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="User Agent" :span="2">
              <span class="break-all text-xs">
                {{ detailData.user_agent || "—" }}
              </span>
            </el-descriptions-item>
          </el-descriptions>

          <template v-if="detailData.data">
            <el-divider />
            <div class="mb-2 font-medium">请求数据</div>
            <pre class="json-pre">{{ formatJson(detailData.data) }}</pre>
          </template>
        </template>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.json-pre {
  max-height: 400px;
  padding: 12px;
  margin: 0;
  overflow: auto;
  font-size: 12px;
  line-height: 1.6;
  word-break: break-all;
  white-space: pre-wrap;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}
</style>
