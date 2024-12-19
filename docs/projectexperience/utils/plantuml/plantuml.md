---
lang: zh-CN
title: Plant UML
description: plant uml插件使用经验
sidebar: heading
---

## 1 安装部署

### 1.1 下载 PlantUML 和 Graphviz

PlantUML 的 IDEA 插件用于在 IDEA 上编写 PlantUML 脚本，Graphviz 用于 PlantUML 脚本的渲染和图像化输出。

[PlantUML IDEA 插件下载地址](https://plugins.jetbrains.com/plugin/7017-plantuml-integration)

[Graphviz 下载地址](https://graphviz.org/download/)

### 1.2 配置 PlantUML Integration

idea 插件的配置如下所示（主要是配置 Graphviz 的地址）：

![alt text](assets/image-1.png)

## 2 PlantUML 文档

PlantUML 是一个画图脚本语言，用它可以快速地画出：

类图：[http://plantuml.com/class-diagram](http://plantuml.com/class-diagram)

流程图：[http://plantuml.com/activity-diagram-beta](http://plantuml.com/activity-diagram-beta)

时序图：[http://plantuml.com/sequence-diagram](http://plantuml.com/sequence-diagram)

用例图：[http://plantuml.com/use-case-diagram](http://plantuml.com/use-case-diagram)

状态图：[http://plantuml.com/state-diagram](http://plantuml.com/state-diagram)

组件图：[http://plantuml.com/component-diagram](http://plantuml.com/component-diagram)

## 3 PlantUML 应用

### 3.1 为文件夹生成类图

这个很简单，安装并配置完 idea 插件后，右击文件夹，点这个：

![alt text](assets/image-3.png)

### 3.2 生成时序图

主要是写.puml 脚本。写完之后右键右侧的预览赋值图像到剪切板即可。

![alt text](assets/image.png)
