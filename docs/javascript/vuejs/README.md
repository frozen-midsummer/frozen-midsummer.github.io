---
lang: zh-CN
description: vue.js
sidebar: heading
---

## 0 序

介绍一下 vue，以 vue3，组合式 api 的主流方式。

官方文档已经写的很详细了，文档层面无需补充，在项目实践中感受这一渐进式框架吧！

## 元素的 ref 引用

定义了 ref 属性的元素`<element-a ref='elementARef'>`会在挂载时注入对应名称的 ref 响应式变量`const elementARef = ref(null)`。即使对应名称的 ref 响应式变量定义在 hooks 内部也不影响注入。

父组件可以通过子组件的 ref 访问子组件 defineExpose 暴露的函数/元素/变量

## hooks 风格封装

## script setup 风格代码组织顺序

```vue
<script setup>
// 1. 导入声明
import { ref, computed, watch, onMounted, provide } from "vue";
import MyComponent from "./MyComponent.vue"; // 假设这是另一个组件

// 2. 接收 props 和 emit
const props = defineProps({
  initialCount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:initialCount"]);

// 使用hooks
const hook1 = useHook1();

// 3. 定义响应式状态
const count = ref(props.initialCount);

// 4. 定义计算属性
const doubleCount = computed(() => count.value * 2);

// 5. 定义侦听器
watch(count, (newVal) => {
  console.log(`count changed to ${newVal}`);
});

// 6. 定义方法
function increment() {
  count.value++;
  emit("update:initialCount", count.value);
}

// 7. 定义生命周期钩子
onMounted(() => {
  console.log("Component is mounted!");
});

// 8. 提供/注入 (如果适用)
provide("count", count);

// 9. 使用插槽 (如果适用)

// 10. 使用 attrs (如果适用)
</script>

<template>
  <div>
    <p>Current count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <MyComponent />
  </div>
</template>
```
