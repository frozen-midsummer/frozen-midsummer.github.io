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
