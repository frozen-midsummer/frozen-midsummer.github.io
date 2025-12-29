# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个使用 VuePress 2.0 和 GitHub Pages 搭建的个人笔记网站，用于在不同地点在线编辑和查阅技术笔记。网站内容涵盖 AI、前端、后端、数据库、Python、开发工具等多个技术领域。

## 开发命令

### 本地开发
```bash
pnpm docs:dev
```
启动 VuePress 开发服务器，支持热重载。

### 构建生产版本
```bash
pnpm docs:build
```
构建静态网站到 `docs/.vuepress/dist` 目录。

## 项目架构

### 目录结构
- `docs/` - 所有文档内容的根目录
  - `.vuepress/` - VuePress 配置和主题定制
    - `config.js` - 主配置文件，包含站点元数据、导航栏、侧边栏和插件配置
    - `public/` - 静态资源（如图片、favicon）
    - `styles/` - 自定义样式文件
  - 各技术领域子目录：`ai/`, `serverside/`, `database/`, `javascript/`, `python/` 等
  - `README.md` - 首页内容

### 配置文件关键点
- **config.js** (`docs/.vuepress/config.js`)：
  - 使用 Vite 作为打包工具
  - 主题：`@vuepress/theme-default`
  - 搜索插件：`@vuepress/plugin-slimsearch`，配置了中文分词（使用 `nodejs-jieba`）
  - 侧边栏配置采用对象形式，首页路由下包含所有主要技术分类的链接

### 内容组织
每个技术领域目录包含：
- `README.md` - 该领域的索引页
- 子目录或 Markdown 文件 - 具体的笔记内容

### 中文搜索
项目配置了 `nodejs-jieba` 进行中文分词，确保搜索功能在中文内容上的准确性。搜索插件的 `indexContent: true` 启用了全文搜索。

## 部署流程

项目通过 GitHub Actions 自动部署到 GitHub Pages：
1. 推送到 `main` 分支触发 workflow
2. 使用 pnpm 安装依赖
3. 运行 `pnpm docs:build`
4. 将 `docs/.vuepress/dist` 部署到 `gh-pages` 分支

## 添加新内容

1. 在相应的技术领域目录下创建或编辑 Markdown 文件
2. 如果添加新的顶层分类，需要在 `docs/.vuepress/config.js` 的 `sidebar` 配置中添加相应条目
3. 确保新目录包含 `README.md` 作为索引页
