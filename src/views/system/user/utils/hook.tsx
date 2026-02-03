import { reactive, ref, onMounted, h } from "vue";
import { message } from "@/utils/message";
import {
  getUserList,
  getAllRoles,
  createUser,
  updateUser,
  deleteUser
} from "@/api/system";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";

export function useUser() {
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const roleOptions = ref([]);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "用户名",
      prop: "username"
    },
    {
      label: "真实姓名",
      prop: "realname"
    },
    {
      label: "手机号",
      prop: "phone"
    },
    {
      label: "邮箱",
      prop: "email"
    },
    {
      label: "状态",
      prop: "status",
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
      label: "创建时间",
      prop: "created_at",
      width: 180
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
    const { data } = await getUserList({
      page: pagination.currentPage,
      per_page: pagination.pageSize
    });
    dataList.value = data.data;
    pagination.total = data.total;
    loading.value = false;
  }

  async function getRoleOptions() {
    const { data } = await getAllRoles();
    roleOptions.value = data;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    if (roleOptions.value.length === 0) {
      getRoleOptions().then(() => showDialog(title, row));
    } else {
      showDialog(title, row);
    }
  }

  function showDialog(title, row) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          username: row?.username ?? "",
          realname: row?.realname ?? "",
          password: "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          status: row?.status ?? 1,
          role_ids: row?.role_ids ?? []
        },
        roleOptions: roleOptions.value
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(valid => {
          if (valid) {
            if (row?.id) {
              updateUser(row.id, curData).then(res => {
                if (res.code === 0) {
                  message("修改成功", { type: "success" });
                  done();
                  onSearch();
                } else {
                  message(res.message, { type: "error" });
                }
              });
            } else {
              createUser(curData).then(res => {
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
    deleteUser(row.id).then(res => {
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
