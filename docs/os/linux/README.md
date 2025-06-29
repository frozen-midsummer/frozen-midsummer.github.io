---
lang: zh-CN
description: 操作系统
sidebar: heading
---

## 常用指令

购买了一台阿里云的 99 服务器实例，也是圆梦了 🌸
Alibaba Cloud Linux 基于 centos，安装包管理工具是 yum(2)或 dnf(3)

### 安装 cmake

```sh
dnf install cmake
## 报错
ssl.c:55:10: fatal error: openssl/ssl.h: No such file or directory
   55 | #include <openssl/ssl.h>
## 清除已安装文件
make distclean
## 安装ssl
dnf install openssl
```

### 建一个用户

### 装一个 redis

基本上参照 github 的教程去装https://github.com/redis/redis，里面有一些步骤比如设置python venv，不知道是干嘛的，好像不做这个操作也可以装上

```sh
## 获取源码
wget -O redis-8.0.2.tar.gz https://github.com/redis/redis/archive/refs/tags/8.0.2.tar.gz
## 解压
tar -xzvf redis-8.0.2.tar.gz
cd redis-8.0.2
make
```
