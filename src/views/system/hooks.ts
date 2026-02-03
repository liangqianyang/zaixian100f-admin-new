import { computed } from "vue";

export function usePublicHooks() {
  const switchStyle = computed(() => {
    return {
      "--el-switch-on-color": "#6bd739",
      "--el-switch-off-color": "#e2e2e2"
    };
  });

  return {
    switchStyle
  };
}
