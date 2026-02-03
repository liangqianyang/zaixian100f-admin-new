import { ref, onMounted, h } from "vue";
import { message } from "@/utils/message";
import { getMenuTree, createMenu, updateMenu, deleteMenu } from "@/api/system";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

export function useMenu() {
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "name",
      align: "left",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{row.name}</span>
        </>
      )
    },
    {
      label: "菜单类型",
      prop: "type",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={
            row.type === 1 ? "primary" : row.type === 2 ? "warning" : "danger"
          }
          effect="plain"
        >
          {row.type === 1 ? "菜单" : row.type === 2 ? "iframe" : "按钮"}
        </el-tag>
      )
    },
    {
      label: "路由路径",
      prop: "path"
    },
    {
      label: "组件路径",
      prop: "component",
      formatter: ({ path, component }) =>
        isAllEmpty(component) ? path : component
    },
    {
      label: "排序",
      prop: "sort",
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
      width: 210,
      slot: "operation"
    }
  ];

  function handleAdd(row?: FormItemProps) {
    openDialog("新增", {
      parent_id: row?.id ?? 0,
      type: 1,
      name: "",
      code: "",
      path: "",
      route_name: "",
      component: "",
      redirect: "",
      icon: "",
      active_menu: "",
      is_show: true,
      show_parent: true,
      is_cache: false,
      is_tab: true,
      is_affix: false,
      iframe_url: "",
      iframe_loading: true,
      sort: 99,
      status: 1
    });
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getMenuTree();
    // 后端返回的已经是树形结构，无需 handleTree
    // 如果后端返回的是扁平数组，则需要 handleTree(data, "id", "parent_id")
    dataList.value = data;
    loading.value = false;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          ...row
        },
        higherMenuOptions: [
          { id: 0, name: "顶级", children: [] },
          ...cloneDeep(dataList.value)
        ]
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
            // 根据是否有id判断是新增还是修改
            if (curData.id) {
              updateMenu(curData.id, curData).then(res => {
                if (res.code === 0) {
                  message("修改成功", { type: "success" });
                  done();
                  onSearch();
                } else {
                  message(res.message, { type: "error" });
                }
              });
            } else {
              createMenu(curData).then(res => {
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
    deleteMenu(row.id).then(res => {
      if (res.code === 0) {
        message("删除成功", { type: "success" });
        onSearch();
      } else {
        message(res.message, { type: "error" });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    formRef,
    loading,
    columns,
    dataList,
    onSearch,
    openDialog,
    handleDelete,
    handleAdd
  };
}
