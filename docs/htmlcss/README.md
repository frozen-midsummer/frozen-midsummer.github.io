---
lang: zh-CN
description: python
sidebar: heading
---

## 1 HTML

## 2 CSS

### 2.1 less

less 的优点是支持嵌套，[官网的教程](https://less.bootcss.com/)很简短易读，这里就不多介绍了

### 2.2 scoped 和 :deep

就是在 vue 文件中，`<style>`标签加上 scoped 变成`<style scoped>`，就意味着标签内的样式只对当前组件生效，不会穿透到当前组件的后代组件上去。:deep 与其作用刚好相反，选择器 selector 外面包裹一层:deep(selector)，样式就会穿透到选择器的所有后代组件，有可能会发生局部的样式污染，但不会发生全局的样式污染。
