import { reactive, ref, onMounted, h } from "vue";
import { message } from "@/utils/message";
import {
  getConfigList,
  getConfigGroups,
  createConfig,
  updateConfig,
  deleteConfig
} from "@/api/common";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";

export function useConfig() {
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const groups = ref<string[]>([]);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    { label: "ID", prop: "id", width: 70 },
    { label: "环境", prop: "env_label", width: 80 },
    { label: "分组", prop: "group", width: 120 },
    { label: "配置键", prop: "key", width: 180 },
    {
      label: "值",
      prop: "value",
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => (
        <span>
          {row.is_secret
            ? row.value || "（已加密，点击修改可重置）"
            : row.value || "-"}
        </span>
      )
    },
    {
      label: "敏感",
      prop: "is_secret",
      width: 80,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.is_secret ? "danger" : "info"}
          effect="plain"
        >
          {row.is_secret ? "加密" : "明文"}
        </el-tag>
      )
    },
    { label: "类型", prop: "type_label", width: 90 },
    { label: "说明", prop: "description", showOverflowTooltip: true },
    { label: "创建时间", prop: "created_at", width: 170 },
    { label: "操作", fixed: "right", width: 160, slot: "operation" }
  ];

  const form = reactive({
    group: "",
    env: "",
    key: ""
  });

  async function loadGroups() {
    const { data } = await getConfigGroups();
    groups.value = data || [];
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getConfigList({
      page: pagination.currentPage,
      per_page: pagination.pageSize,
      group: form.group,
      env: form.env,
      key: form.key
    });
    dataList.value = data.list;
    pagination.total = data.total;
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    const isEdit = !!row;

    addDialog({
      title: `${title}配置`,
      props: {
        formInline: {
          env: row?.env ?? 0,
          group: row?.group ?? "",
          key: row?.key ?? "",
          value: isEdit && !row.is_secret ? row.value : "", // 非敏感回显明文；敏感留空（掩码不可回填）
          is_secret: row?.is_secret ?? false,
          type: row?.type ?? 1,
          description: row?.description ?? ""
        },
        isEdit,
        groups: groups.value
      },
      width: "45%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, {
          ref: formRef,
          formInline: null,
          isEdit: false,
          groups: []
        }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        FormRef.validate(valid => {
          if (!valid) return;

          if (isEdit && row?.id) {
            // 编辑：value 留空表示不修改
            const payload: Record<string, any> = {
              is_secret: curData.is_secret,
              type: curData.type,
              description: curData.description
            };
            if (curData.value !== "") {
              payload.value = curData.value;
            }

            updateConfig(row.id, payload).then(res => {
              if (res.code === 0) {
                message("修改成功", { type: "success" });
                done();
                onSearch();
              } else {
                message(res.message, { type: "error" });
              }
            });
          } else {
            createConfig({
              env: curData.env,
              group: curData.group,
              key: curData.key,
              value: curData.value,
              is_secret: curData.is_secret,
              type: curData.type,
              description: curData.description
            }).then(res => {
              if (res.code === 0) {
                message("新增成功", { type: "success" });
                loadGroups();
                done();
                onSearch();
              } else {
                message(res.message, { type: "error" });
              }
            });
          }
        });
      }
    });
  }

  function handleDelete(row) {
    deleteConfig(row.id).then(res => {
      if (res.code === 0) {
        message("删除成功", { type: "success" });
        loadGroups();
        onSearch();
      } else {
        message(res.message, { type: "error" });
      }
    });
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  onMounted(() => {
    loadGroups();
    onSearch();
  });

  return {
    form,
    formRef,
    loading,
    columns,
    dataList,
    pagination,
    groups,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleSizeChange,
    handleCurrentChange
  };
}
