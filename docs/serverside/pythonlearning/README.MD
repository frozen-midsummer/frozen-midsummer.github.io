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

## 2 python 正则表达式

### 2.1 re.match 函数

re.match 尝试从字符串的起始位置匹配一个模式，如果起始位置匹配不成功，则返回 None，用的不多

函数语法：

```python
re.macth(pattern, string, flags=0)
```

函数参数说明：

| 参数    | 描述                                                                                                                                         |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| pattern | 匹配的正则表达式                                                                                                                             |
| string  | 要匹配的字符串                                                                                                                               |
| flag    | 标志位，用于控制正则表达式的匹配方式，如：是否区分大小写。多行匹配等等。参见：[正则表达式修饰符 - 可选标志](#_2-3-正则表达式修饰符-可选标志) |

匹配成功 re.match 方法返回一个匹配的对象，否则返回 None



### 2.2 re.search 函数

re.search扫描整个字符串并返回第一个成功的匹配

### 2.3 正则表达式修饰符 - 可选标志

注：多个标志位可通过按位 OR(|)指定。如 re.I|re.M。

部分 re module 中的函数使用以下标志位作为可选入参：

| short name | long name  | description                                                                                     |
| ---------- | ---------- | ----------------------------------------------------------------------------------------------- |
| A          | ASCII      | 使得\w, \W, \b, \B, \d, \D 等字符类别匹配对应的 ASCII 字符类别（而不是默认的整个 Unicode 类别） |
| I          | IGNORECASE | Perform case-insensitive matching. 忽略大小写（印刷术时期大小写字母分别放在上下抽屉）           |
| L          | LOCALE     | 使 \w, \W, \b, \B 基于当前的语言环境                                                            |
| M          | MULTILINE  | 多行匹配，使 ^ 和 $ 能作用于行首和行尾                                                          |
| S          | DOTALL     | 使 . 匹配包括换行在内的所有字符（还挺形象）                                                     |
| X          | VERBOSE    | 忽略空格和注释，使正则表达式更美观                                                              |
| U          | UNICODE    | 默认。使 \w, \W, \b, \B, \d, \D 等字符类别匹配整个 Unicode 字符类别                             |
