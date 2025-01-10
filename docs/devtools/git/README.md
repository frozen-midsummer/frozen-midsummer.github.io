---
lang: zh-CN
title: Git
description: git 教程
sidebar: heading
---

## 0 intro

对于这一工作中最常用的版本管理工具，总是一边学一边用。现在觉得还是要懂一些复杂指令

git 的四个工作区域：工作目录（Working Directory）、暂存区(Stage/Index)、资源库(Repository 或 Git Directory)、git 仓库(Remote Directory)，文件在这四个区域之间的转换关系如下：
![alt text](assets/image.png)

## Github

### 建立电脑和 github 之间的 ssh 连接

见[网站建设 > Github Pages](/websiteconstruction/githubpages/README.md#_2-github-push-不上去的问题)

### ssh: connect to host github.com port 22: Connection refused

这个问题是因为使用 ssh 连接 github 时，由于 github.com 的域名被污染（因为科学上网等原因），解决方案如下：

1. 修改 C:\Windows\System32\drivers\etc\hosts 文件，添加一行：`140.82.113.4 github.com`
2. 刷新 DNS 缓存：命令提示符输入以下命令`ipconfig /flushdns`，按回车键
