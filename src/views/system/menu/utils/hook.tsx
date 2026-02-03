import { ref, reactive, onMounted, h } from "vue";
import { message } from "@/utils/message";
import { getMenuList, createMenu, updateMenu, deleteMenu } from "@/api/system";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty, handleTree } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

export function useMenu() {
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const form = reactive({
    title: "",
    status: ""
  });

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
          {row.type === 1
            ? "菜单"
            : row.type === 2
              ? "iframe"
              : row.type === 3
                ? "按钮"
                : "外链"}
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
      extra_icon: "",
      enter_transition: "",
      leave_transition: "",
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
    // 如果有搜索条件，使用列表接口并自行构建树，或者让后端支持带参数的树接口
    // 这里假设 getMenuList 支持搜索，返回扁平列表，我们前端组装成树
    // 或者 getMenuTree 支持搜索
    // 通常菜单树的搜索比较特殊，如果后端 getMenuTree 不支持搜索，
    // 我们可以获取所有菜单后前端过滤，或者使用 getMenuList 获取扁平数据后前端转树

    // 方案1: 尝试传参给 getMenuTree (如果后端支持)
    // const { data } = await getMenuTree({ title: form.title, status: form.status });

    // 方案2: 使用 getMenuList 获取所有数据 (不分页)，然后前端处理
    // 假设 getMenuList 支持 title 和 status 过滤
    const { data } = await getMenuList({
      name: form.title, // 假设参数名是 name
      status: form.status,
      pagination: false // 假设支持不分页
    });
    // 如果返回的是分页结构 { list: [], total: 0 }
    let list = [];
    if (data.list) {
      list = data.list;
    } else if (Array.isArray(data)) {
      list = data;
    }

    // 前端转树
    dataList.value = handleTree(list, "id", "parent_id");
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

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
      contentRenderer: () =>
        h(editForm, { ref: formRef, formInline: null, higherMenuOptions: [] }),
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
    form,
    formRef,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    handleAdd
  };
}
