---
name: "frontend-code-fixer"
description: "Automatically fixes common frontend code standards issues including Tailwind/UnoCSS class optimization, Vue attribute ordering, and Linter errors. Invoke when user asks to fix lint issues, clean up code, or standardize styles."
---

# Frontend Code Standard Fixer

This skill helps automate the cleanup and standardization of frontend code, specifically targeting Vue.js, Tailwind CSS / UnoCSS, and common Linter issues.

## Capabilities

When invoked, this skill will scan the specified files (or the current active file) and perform the following fixes:

### 1. Tailwind / UnoCSS Class Optimization

- **Important Modifier Syntax**:
  - Converts pre-fixed `!` (e.g., `!w-full`) to post-fixed `!` (e.g., `w-full!`) as per UnoCSS/WindiCSS best practices.
- **Color Hex to Semantic Class**:
  - Converts hardcoded white colors like `bg-[#fff]`, `bg-[#ffffff]` to `bg-white`.
  - Converts `text-[#fff]` to `text-white`.
- **Border Shorthand**:
  - Removes redundant `[1px]` from border classes.
  - `border-b-[1px]` -> `border-b`
  - `border-t-[1px]` -> `border-t`
  - `border-[1px]` -> `border`
- **CSS Variable Syntax**:
  - Optimizes arbitrary property syntax for CSS variables.
  - `border-[var(--pure-border-color)]` -> `border-(--pure-border-color)`

### 2. Vue.js Best Practices

- **Attribute Ordering**:
  - Enforces `v-if`, `v-else-if`, `v-else`, `v-for`, `id`, `ref` to appear _before_ other attributes like `:value`, `v-model`, `class`.
  - Specifically fixes the warning: `Attribute "v-if" should go before ":value"`.
- **Component Props**:
  - Ensures correct formatting for props like `Segmented` options.

### 3. General Linting & formatting

- **Type Safety**:
  - Checks for common type mismatches (e.g., accessing properties on `unknown` types or mismatched interface definitions).
- **Cleanup**:
  - Removes unused variables.
  - Removes double blank lines or unnecessary whitespace.
  - Fixes missing or extra commas.

## Usage Instructions for the Agent

1. **Analyze**: First, read the file content to identify which of the above patterns exist.
2. **Plan**: Determine the necessary search-and-replace operations.
3. **Execute**: Use `SearchReplace` to apply the fixes. Apply multiple fixes in a single pass if possible, or sequentially if they overlap.
4. **Verify**: Ensure no syntax errors were introduced.

## Example Fixes

**Input:**

```text
<div class="w-full! bg-write border-b">
  <span :value="val" v-if="show">Text</span>
</div>
```

**Output:**

```vue
<div class="w-full! bg-white border-b">
  <span v-if="show" :value="val">Text</span>
</div>
```
