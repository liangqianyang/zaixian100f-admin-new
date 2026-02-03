import { reactive, ref, onMounted, h } from "vue";
import { message } from "@/utils/message";
import {
  getPermissionList,
  getMenuTree,
  createPermission,
  updatePermission,
  deletePermission
} from "@/api/system";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";

export function usePermission() {
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const menuOptions = ref([]);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "权限名称",
      prop: "name"
    },
    {
      label: "权限标识",
      prop: "code"
    },
    {
      label: "类型",
      prop: "type",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.type === 1 ? "primary" : "warning"}
          effect="plain"
        >
          {row.type === 1 ? "API" : "按钮"}
        </el-tag>
      )
    },
    {
      label: "归属菜单ID",
      prop: "menu_id",
      width: 100
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 1 ? "success" : "info"}
          effect="plain"
        >
          {row.status === 1 ? "启用" : "禁用"}
        </el-tag>
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    const { data } = await getPermissionList({
      page: pagination.currentPage,
      per_page: pagination.pageSize
    });
    dataList.value = data.data;
    pagination.total = data.total;
    loading.value = false;
  }

  async function getMenus() {
    const { data } = await getMenuTree();
    menuOptions.value = data;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    if (menuOptions.value.length === 0) {
      getMenus().then(() => showDialog(title, row));
    } else {
      showDialog(title, row);
    }
  }

  function showDialog(title, row) {
    addDialog({
      title: `${title}权限`,
      props: {
        formInline: {
          name: row?.name ?? "",
          code: row?.code ?? "",
          menu_id: row?.menu_id ?? 0,
          description: row?.description ?? "",
          type: row?.type ?? 1,
          path: row?.path ?? "",
          method: row?.method ?? "GET",
          sort: row?.sort ?? 0,
          status: row?.status ?? 1
        },
        menuOptions: menuOptions.value
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, { ref: formRef, formInline: null, menuOptions: [] }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(valid => {
          if (valid) {
            if (row?.id) {
              updatePermission(row.id, curData).then(res => {
                if (res.code === 0) {
                  message("修改成功", { type: "success" });
                  done();
                  onSearch();
                } else {
                  message(res.message, { type: "error" });
                }
              });
            } else {
              createPermission(curData).then(res => {
                if (res.code === 0) {
                  message("新增成功", { type: "success" });
                  done();
                  onSearch();
                } else {
                  message(res.message, { type: "error" });
                }
              });
            }
          }
        });
      }
    });
  }

  function handleDelete(row) {
    deletePermission(row.id).then(res => {
      if (res.code === 0) {
        message("删除成功", { type: "success" });
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
    onSearch();
  });

  return {
    formRef,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    openDialog,
    handleDelete,
    handleSizeChange,
    handleCurrentChange
  };
}
