import { reactive, ref, onMounted } from "vue";
import { getOperationLogList, getOperationLogDetail } from "@/api/system";
import type { OperationLog } from "@/api/system";
import type { PaginationProps } from "@pureadmin/table";

export function useOperationLog() {
  const formRef = ref();
  const dataList = ref<OperationLog[]>([]);
  const loading = ref(true);
  const detailVisible = ref(false);
  const detailData = ref<OperationLog | null>(null);
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
      label: "业务域",
      prop: "business_domain_label",
      width: 100
    },
    {
      label: "业务类型",
      prop: "business_type_label",
      width: 120
    },
    {
      label: "操作描述",
      prop: "description",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "操作人",
      prop: "operator_name",
      width: 100
    },
    {
      label: "IP",
      prop: "ip",
      width: 130
    },
    {
      label: "操作时间",
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
    business_domain: "",
    start_time: "",
    end_time: ""
  });

  async function onSearch() {
    loading.value = true;
    const { data } = await getOperationLogList({
      page: pagination.currentPage,
      per_page: pagination.pageSize,
      keyword: form.keyword || undefined,
      business_domain: form.business_domain || undefined,
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

  async function openDetail(row: OperationLog) {
    detailVisible.value = true;
    detailLoading.value = true;
    const { data } = await getOperationLogDetail(row.id);
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
