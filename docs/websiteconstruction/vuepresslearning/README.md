---
lang: zh-CN
title: VuePress
description: VuePress
sidebar: heading
---

## 0 Intro.

个人快速建站离不开 VuePress 方便快捷的开发方式.

[VuePress 中文文档地址](https://vuepress.vuejs.org/zh/)

[VuePress 生态系统(包含页首 yaml 配置)](https://ecosystem.vuejs.press/zh/themes/default/config.html)

[VuePress config.js 配置文档地址](https://vuepress.vuejs.org/zh/reference/config.html)

[GitHub Pages 部署](/websiteconstruction/githubpages/README.md)

## 1 插件

推荐使用`import { slimsearchPlugin } from '@vuepress/plugin-slimsearch'`进行全局内容查询，使用`import { cut } from "nodejs-jieba"`进行分词。

## 2 样式

默认主题使用 SASS 作为 CSS 预处理器，[参考文档地址](https://ecosystem.vuejs.press/zh/themes/default/styles.html)

用户可以通过 Palette 文件来自定义样式变量，通过 style 文件来添加额外的样式。地址为`.vuepress/styles/palette.scss` 和 `.vuepress/styles/index.scss`
