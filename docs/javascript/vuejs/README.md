---
lang: zh-CN
description: vue.js
sidebar: heading
---

## 1 基础

### 元素的 ref 引用

定义了 ref 属性的元素`<element-a ref='elementARef'>`会在挂载时注入对应名称的 ref 响应式变量`const elementARef = ref(null)`。即使对应名称的 ref 响应式变量定义在 hooks 内部也不影响注入。

父组件可以通过子组件的 ref 访问子组件 defineExpose 暴露的函数/元素/变量

### 计算属性

- 直接修改 computed(()=>return )的值是无效的，因为即使修改了也会马上被计算覆盖
- computed 计算出的值是一个 ref 对象，访问其值需要.value，但是貌似也有例外

### 监听

- watch 监听对象的属性的时候，需要()=>a.b.c 这样，直接 watch(a.b.c)监听不到
- watch 想监听对象内部的变化，需要加上{ deep: true }，否则监听不到内部变化
- Vue 会确保在 watch 触发监听器回调函数时，所有的 props 都已经更新到了最新的状态。
- watch(,,{immediate:true})可以使监听器在监听的变量初始化时立即执行一次，适合于监听懒加载的 drawer、modal 等组件的 open 事件

## 2 深入组件

### 依赖注入

注意：像以下这样在 async 函数内提供变量是无效的：

```js
import {onMonted} from 'vue'
const init = async()=>{ await getInitEnums() provide('enumsData',enumsData)}
onMonted(()=>{init()})
```

正确的注入就直接在变量定义之后 provide 就好了，inject 之后默认就是响应式的

## 3 风格指南

### hooks 风格封装

将有复用价值的 script setup 内容（可以包含一些变量和函数）封装成一个 js，放在 hooks 目录中

### script setup 风格代码组织顺序

```js
<script setup>
// 1. 导入声明
// 2. 接收 props 和 emit
// 使用hooks
// 3. 定义响应式状态
// 4. 定义计算属性
// 5. 定义侦听器
// 6. 定义方法
// 7. 定义生命周期钩子
// 8. 提供/注入 (如果适用)
// 9. 使用插槽 (如果适用)
// 10. 使用 attrs (如果适用)
<script>
```

### 组织项目的注意事项

- 注意从 vue 文件抽象出可以复用的 hooks 的时机
- 子组件中需要与其他组件共享的数据最好用 computed 计算属性与父组件双向绑定，不然代码很多props和defineExpose会很乱

## 4 常见问题

### import { watch } from 'less'

- 问题描述：见标题
- 问题分析：引用错了
