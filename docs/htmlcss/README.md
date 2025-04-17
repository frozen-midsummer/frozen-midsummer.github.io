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

### BEM 命名规范

#### 概念与用法

- block（块）：可以独立使用的 HTML 元素（比如：<nav>），可以不包含 element。
- element（元素）：依附于 block 的 HTML 元素，无法独立存在（比如：<li>），前面要加上双下划线`__`。
- modifier（修饰符）：表示 block 或者 element 的状态和外观，前面要加上双连字符`--`。
- 用单连字符 - 连接单词，比如：search-form。
- element 只属于 block，而不是另一个 element。错误写法：`block__element1__element2`，正确写法：`block__element2`。
- 使用 modifier 时，同时保留不含 modifier 的类名，比如：<a class="menu__link menu__link--active" href="/zh-cn/">主页</a>。
