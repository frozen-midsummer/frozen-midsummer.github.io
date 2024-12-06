---
lang: zh-CN
title: Python Learning
description: Python 学习笔记
sidebar: heading
---

## 1 环境搭建

### 1.1 conda指令

### 1.2 依赖库安装

#### 1.2.1 配置镜像源

全局配置镜像源时，因为清华镜像源地址有更新，导致一直下载不动，临时使用以下指令从镜像源下载依赖库

使用阿里云镜像源： pip install -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com xlrd==1.2.0

### 1.3 环境迁移

只需将配置好的conda环境(ananconda/env/XXX)整个目录复制即可