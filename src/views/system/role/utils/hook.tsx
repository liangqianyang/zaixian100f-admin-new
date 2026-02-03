import { reactive, ref, onMounted, h } from "vue";
import { message } from "@/utils/message";
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  getMenuTree,
  getAllPermissions
} from "@/api/system";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";

export function useRole() {
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const treeData = ref([]);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "角色名称",
      prop: "name"
    },
    {
      label: "描述",
      prop: "description"
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
    const { data } = await getRoleList({
      page: pagination.currentPage,
      per_page: pagination.pageSize
    });
    dataList.value = data.data;
    pagination.total = data.total;
    loading.value = false;
  }

  // 组装菜单权限树
  async function getPermissionTree() {
    const [menuRes, permRes] = await Promise.all([
      getMenuTree(),
      getAllPermissions()
    ]);
    const menus = menuRes.data;
    const perms = permRes.data;

    // 递归将权限挂载到菜单下
    // 为了区分菜单节点和权限节点，权限节点的ID可能需要特殊处理，但这里 Role.permission_ids 只存权限ID。
    // 如果菜单树只是为了展示和勾选，勾选了菜单意味着什么？
    // 通常：如果只勾选了菜单，没勾选下级权限，后端如何处理？
    // 方案：将菜单节点作为“目录”，不可选或者 ID 设为非数字（如果 el-tree node-key 必须唯一）。
    // 或者：权限列表本身已经包含了层级信息？不，权限列表是扁平的。
    // 简便方案：只展示菜单树？不，那样无法控制按钮权限。
    // 推荐方案：构造一个混合树。
    // 菜单节点：{ id: 'm_'+id, name: name, children: [...] }
    // 权限节点：{ id: id, name: name, isPerm: true }
    // 提交时：只筛选 isPerm=true 的节点 ID。

    const buildTree = menuList => {
      return menuList.map(menu => {
        const menuPerms = perms
          .filter(p => p.menu_id === menu.id)
          .map(p => ({
            id: p.id,
            name: p.name + " [权限]",
            isPerm: true,
            children: []
          }));

        let children = [];
        if (menu.children && menu.children.length > 0) {
          children = buildTree(menu.children);
        }

        return {
          id: "menu_" + menu.id, // 避免 ID 冲突
          name: menu.name,
          children: [...children, ...menuPerms],
          disabled: true // 菜单节点不可选，强迫用户选择具体的权限？或者可选但提交时过滤
        };
      });
    };

    treeData.value = buildTree(menus);
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    // 确保 treeData 已加载
    if (treeData.value.length === 0) {
      getPermissionTree().then(() => showDialog(title, row));
    } else {
      showDialog(title, row);
    }
  }

  function showDialog(title, row) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          name: row?.name ?? "",
          description: row?.description ?? "",
          sort: row?.sort ?? 0,
          status: row?.status ?? 1,
          permission_ids: row?.permission_ids ?? []
        },
        treeData: treeData.value
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, { ref: formRef, formInline: null, treeData: [] }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const TreeRef = formRef.value.getTreeRef();
        const curData = options.props.formInline as FormItemProps;

        // 获取选中的权限ID
        const checkedKeys = TreeRef.getCheckedKeys(); // 全选
        // const halfCheckedKeys = TreeRef.getHalfCheckedKeys(); // 半选
        // 过滤掉 'menu_' 开头的 ID
        const realPermissionIds = checkedKeys.filter(
          k =>
            typeof k === "number" ||
            (typeof k === "string" && !k.startsWith("menu_"))
        );

        curData.permission_ids = realPermissionIds;

        FormRef.validate(valid => {
          if (valid) {
            if (row?.id) {
              updateRole(row.id, curData).then(res => {
                if (res.code === 0) {
                  message("修改成功", { type: "success" });
                  done();
                  onSearch();
                } else {
                  message(res.message, { type: "error" });
                }
              });
            } else {
              createRole(curData).then(res => {
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
    deleteRole(row.id).then(res => {
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
