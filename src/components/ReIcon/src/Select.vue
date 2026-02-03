<script setup lang="ts">
import { ref, watch } from "vue";
import { IconifyIconOnline } from "../index";

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

const commonIcons = [
  "ep:user",
  "ep:lock",
  "ep:setting",
  "ep:menu",
  "ep:house",
  "ep:refresh",
  "ep:search",
  "ep:edit",
  "ep:delete",
  "ep:plus",
  "ep:close",
  "ri:admin-line",
  "ri:settings-3-line",
  "ri:user-line",
  "ri:lock-line",
  "ri:menu-line",
  "ri:home-line",
  "ri:search-line",
  "ri:add-circle-line"
];

watch(
  () => props.modelValue,
  val => {
    inputValue.value = val;
  }
);

function onIconClick(icon: string) {
  inputValue.value = icon;
  emit("update:modelValue", icon);
  visible.value = false;
}

function onInputChange(val: string) {
  emit("update:modelValue", val);
}
</script>

<template>
  <el-popover
    :visible="visible"
    placement="bottom-start"
    width="300"
    trigger="click"
    @update:visible="val => (visible = val)"
  >
    <template #reference>
      <el-input
        v-model="inputValue"
        placeholder="点击选择图标"
        readonly
        @click="visible = !visible"
      >
        <template #prepend>
          <div class="flex items-center justify-center w-[20px] h-[20px]">
            <IconifyIconOnline
              v-if="inputValue"
              :icon="inputValue"
              class="text-[18px]"
            />
          </div>
        </template>
      </el-input>
    </template>

    <div class="w-full">
      <el-input
        v-model="inputValue"
        placeholder="输入图标名称 (如 ep:user)"
        class="mb-2"
        @input="onInputChange"
      />
      <div class="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1">
        <div
          v-for="item in commonIcons"
          :key="item"
          class="flex items-center justify-center w-[32px] h-[32px] cursor-pointer border border-[#e5e7eb] hover:bg-[#f3f4f6] rounded transition-colors"
          :class="{ 'bg-blue-50 border-blue-200': item === inputValue }"
          @click="onIconClick(item)"
        >
          <IconifyIconOnline :icon="item" class="text-[20px]" />
        </div>
      </div>
    </div>
  </el-popover>
</template>

<style scoped>
:deep(.el-input-group__prepend) {
  padding: 0 10px;
  background-color: #fff;
}
</style>
