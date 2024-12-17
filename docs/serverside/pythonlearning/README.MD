---
lang: zh-CN
title: Python Learning
description: Python 学习笔记
sidebar: heading
---

## 1 环境搭建

### 1.1 conda 指令

```bash
# 激活
conda activate your-envname
# 失效
conda deactivate your-envname
```

### 1.2 依赖库安装

#### 1.2.1 临时指定镜像源下载依赖库

全局配置镜像源时，因为清华镜像源地址有更新，导致一直下载不动，临时使用以下指令从镜像源下载依赖库：
使用阿里云镜像源： pip install -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com xlrd==1.2.0

#### 1.2.2 配置全局镜像源

### 1.3 环境迁移

只需将配置好的 conda 环境(ananconda/env/XXX)整个目录复制即可
