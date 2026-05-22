<script setup lang="ts">
import { useOperationLog } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Search from "~icons/ep/search";
import Refresh from "~icons/ep/refresh";
import View from "~icons/ep/view";

defineOptions({
  name: "SystemOperationLog"
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
} = useOperationLog();

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
          placeholder="操作描述/请求ID"
          clearable
          class="w-40!"
        />
      </el-form-item>
      <el-form-item label="业务域：" prop="business_domain">
        <el-input
          v-model="form.business_domain"
          placeholder="如 system"
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

    <PureTableBar title="操作日志" :columns="columns" @refresh="onSearch">
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
      title="操作日志详情"
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
            <el-descriptions-item label="业务域">
              {{
                detailData.business_domain_label || detailData.business_domain
              }}
            </el-descriptions-item>
            <el-descriptions-item label="业务类型">
              {{
                detailData.business_type_label ||
                detailData.business_type ||
                "—"
              }}
            </el-descriptions-item>
            <el-descriptions-item label="业务ID">
              {{ detailData.business_id || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="操作类型">
              {{ detailData.action_label || detailData.action }}
            </el-descriptions-item>
            <el-descriptions-item label="操作描述" :span="2">
              {{ detailData.description }}
            </el-descriptions-item>
            <el-descriptions-item label="操作人">
              {{ detailData.operator_name || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="操作人ID">
              {{ detailData.operator_id || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="目标类型">
              {{
                detailData.target_type_label || detailData.target_type || "—"
              }}
            </el-descriptions-item>
            <el-descriptions-item label="目标ID">
              {{ detailData.target_id || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="IP">
              {{ detailData.ip || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="操作时间">
              {{ detailData.created_at || "—" }}
            </el-descriptions-item>
            <el-descriptions-item label="User Agent" :span="2">
              <span class="break-all text-xs">
                {{ detailData.user_agent || "—" }}
              </span>
            </el-descriptions-item>
          </el-descriptions>

          <template
            v-if="
              detailData.before_values ||
              detailData.after_values ||
              detailData.changed_values
            "
          >
            <el-divider />
            <el-tabs>
              <el-tab-pane v-if="detailData.changed_values" label="变更字段">
                <pre class="json-pre">{{
                  formatJson(detailData.changed_values)
                }}</pre>
              </el-tab-pane>
              <el-tab-pane v-if="detailData.before_values" label="操作前数据">
                <pre class="json-pre">{{
                  formatJson(detailData.before_values)
                }}</pre>
              </el-tab-pane>
              <el-tab-pane v-if="detailData.after_values" label="操作后数据">
                <pre class="json-pre">{{
                  formatJson(detailData.after_values)
                }}</pre>
              </el-tab-pane>
            </el-tabs>
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
