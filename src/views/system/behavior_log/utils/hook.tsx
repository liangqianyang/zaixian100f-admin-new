import { reactive, ref, onMounted } from "vue";
import { getBehaviorLogList, getBehaviorLogDetail } from "@/api/system";
import type { BehaviorLog } from "@/api/system";
import type { PaginationProps } from "@pureadmin/table";

export function useBehaviorLog() {
  const formRef = ref();
  const dataList = ref<BehaviorLog[]>([]);
  const loading = ref(true);
  const detailVisible = ref(false);
  const detailData = ref<BehaviorLog | null>(null);
  const detailLoading = ref(false);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 15,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      width: 70
    },
    {
      label: "行为类型",
      prop: "action_name_label",
      width: 130
    },
    {
      label: "用户",
      prop: "user_name",
      width: 100
    },
    {
      label: "请求路径",
      prop: "path",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "方法",
      prop: "method",
      width: 80
    },
    {
      label: "状态码",
      prop: "status_code",
      width: 80
    },
    {
      label: "IP",
      prop: "ip",
      width: 130
    },
    {
      label: "时间",
      prop: "created_at",
      width: 160
    },
    {
      label: "操作",
      fixed: "right",
      width: 80,
      slot: "operation"
    }
  ];

  const form = reactive({
    keyword: "",
    action_name: "",
    start_time: "",
    end_time: ""
  });

  async function onSearch() {
    loading.value = true;
    const { data } = await getBehaviorLogList({
      page: pagination.currentPage,
      per_page: pagination.pageSize,
      keyword: form.keyword || undefined,
      action_name: form.action_name || undefined,
      start_time: form.start_time || undefined,
      end_time: form.end_time || undefined
    });
    dataList.value = data.list;
    pagination.total = data.total;
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    pagination.currentPage = 1;
    onSearch();
  };

  async function openDetail(row: BehaviorLog) {
    detailVisible.value = true;
    detailLoading.value = true;
    const { data } = await getBehaviorLogDetail(row.id);
    detailData.value = data;
    detailLoading.value = false;
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  onMounted(onSearch);

  return {
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
  };
}
