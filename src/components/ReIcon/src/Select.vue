<script setup lang="ts">
import { ref, computed, toRef, watch } from "vue";
import { IconifyIconOnline } from "../index";
import { epIcons, riIcons, faIcons, mdiIcons } from "./iconList";

const Search = "ep:search";
const Close = "ep:close";

defineOptions({
  name: "IconSelect"
});

const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:modelValue"]);

const visible = ref(false);
const inputValue = ref(props.modelValue);
const activeTab = ref("ep");
const currentPage = ref(1);
const pageSize = ref(35); // 7x5 grid roughly
const searchText = ref("");

watch(
  () => props.modelValue,
  val => {
    inputValue.value = val;
  }
);

watch(activeTab, () => {
  currentPage.value = 1;
  searchText.value = "";
});

const currentList = computed(() => {
  let list: string[] = [];
  switch (activeTab.value) {
    case "ep":
      list = epIcons;
      break;
    case "ri":
      list = riIcons;
      break;
    case "fa":
      list = faIcons;
      break;
    case "mdi":
      list = mdiIcons;
      break;
    default:
      list = epIcons;
  }
  if (!searchText.value) return list;
  return list.filter(item =>
    item.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const pageList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return currentList.value.slice(start, end);
});

function onIconClick(icon: string) {
  inputValue.value = icon;
  emit("update:modelValue", icon);
  visible.value = false;
}

function onClear() {
  inputValue.value = "";
  emit("update:modelValue", "");
}
</script>

<template>
  <el-popover
    :visible="visible"
    placement="bottom-start"
    width="350"
    trigger="click"
    @update:visible="val => (visible = val)"
  >
    <template #reference>
      <el-input v-model="inputValue" placeholder="点击选择图标" readonly>
        <template #prepend>
          <div class="flex items-center justify-center w-[20px] h-[20px]">
            <IconifyIconOnline
              v-if="inputValue"
              :icon="inputValue"
              class="text-[18px]"
            />
          </div>
        </template>
        <template v-if="inputValue" #append>
          <el-icon class="cursor-pointer" @click.stop="onClear">
            <IconifyIconOnline :icon="Close" />
          </el-icon>
        </template>
      </el-input>
    </template>

    <div class="w-full">
      <el-input
        v-model="searchText"
        placeholder="搜索图标"
        class="mb-2"
        clearable
      >
        <template #prefix>
          <IconifyIconOnline :icon="Search" />
        </template>
      </el-input>

      <el-tabs v-model="activeTab" class="demo-tabs">
        <el-tab-pane label="Element Plus" name="ep">
          <div
            class="grid grid-cols-7 gap-2 h-[210px] overflow-y-auto content-start"
          >
            <div
              v-for="item in pageList"
              :key="item"
              class="flex items-center justify-center w-[32px] h-[32px] cursor-pointer border border-[#e5e7eb] hover:bg-[#f3f4f6] rounded transition-colors"
              :class="{ 'bg-blue-50 border-blue-200': item === inputValue }"
              :title="item"
              @click="onIconClick(item)"
            >
              <IconifyIconOnline :icon="item" class="text-[20px]" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Remix Icon" name="ri">
          <div
            class="grid grid-cols-7 gap-2 h-[210px] overflow-y-auto content-start"
          >
            <div
              v-for="item in pageList"
              :key="item"
              class="flex items-center justify-center w-[32px] h-[32px] cursor-pointer border border-[#e5e7eb] hover:bg-[#f3f4f6] rounded transition-colors"
              :class="{ 'bg-blue-50 border-blue-200': item === inputValue }"
              :title="item"
              @click="onIconClick(item)"
            >
              <IconifyIconOnline :icon="item" class="text-[20px]" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="flex justify-end mt-2">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="currentList.length"
          layout="prev, pager, next"
          small
          :background="true"
        />
      </div>
    </div>
  </el-popover>
</template>

<style scoped>
:deep(.el-input-group__prepend) {
  padding: 0 10px;
  background-color: #fff;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

:deep(.el-tabs__header) {
  margin-bottom: 10px;
}
</style>
