---
lang: zh-CN
description: dotnet
sidebar: heading
---

## 0 序

对于 dotnet 的认知大都来自于“信创适配”。项目 A 使用.netframework 4.8 进行编写，无法在国产操作系统（UOS、kylinOS...，大多基于 debian>>deepin）。为了使其能够在信创设备上运行，在国产操作系统上安装了 wine(wine is not an emulator)🍷。结果项目 A 并不能直接在 wine 中运行，于是对项目 A 的 C#源码进行了一些修改（主要是替换掉项目名对于 ADODB 的依赖）。替换后，项目得以成功运行。

## wine
