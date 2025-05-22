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

## 1 Github

### 建立电脑和 github 之间的 ssh 连接

见[网站建设 > Github Pages](/websiteconstruction/githubpages/README.md#_2-github-push-不上去的问题)

### ssh: connect to host github.com port 22: Connection refused

这个问题是因为使用 ssh 连接 github 时，由于 github.com 的域名被污染（因为科学上网等原因），解决方案如下：

1. 修改 C:\Windows\System32\drivers\etc\hosts 文件，添加一行：`140.82.113.4 github.com`
2. 刷新 DNS 缓存：命令提示符输入以下命令`ipconfig /flushdns`，按回车键

## 2 开发分支和主分支之间的合并

### 早间操作：同步主分支到本地开发分支

1. ​ 切换到主分支并拉取最新代码

```bash
git checkout dev-trunk
git pull origin dev-trunk     # 拉取远端最新 dev-trunk
```

2. 切回开发分支并合并主分支

```bash
git checkout feature-wangjx
git merge dev-trunk          # 将 dev-trunk 合并到当前分支
```

3. ​​ 处理可能的冲突

- 若存在冲突，用 git status 查看冲突文件
- 手动编辑文件解决冲突后标记为已解决：

```bash
git add <冲突文件路径>
git commit -m "解决与 dev-trunk 的合并冲突"  # 提交冲突解决
```

### 晚间操作：推送开发分支并合并到主分支

目标 ​​：将本地 feature-wangjx 的修改推送到远端，并触发向 dev-trunk 的合并

1. ​​ 提交本地开发分支的修改

```bash
git add .                    # 添加所有修改到暂存区
git commit -m "功能开发完成"  # 提交本地修改
```

2. ​​ 推送本地分支到远端

```bash
git push origin feature-wangjx  # 推送本地分支到远端同名分支
```

3. ​​ 发起合并请求（推荐方式）

- 通过 Git 平台（GitHub/GitLab）创建 Pull Request，将 feature-wangjx 合并到 dev-trunk
- 或通过命令行（需权限）：

```bash
git checkout dev-trunk
git pull origin dev-trunk      # 再次确保主分支最新
git merge feature-wangjx       # 合并开发分支
git push origin dev-trunk      # 推送合并后的主分支
```
