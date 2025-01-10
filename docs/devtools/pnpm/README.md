---
lang: zh-CN
title: pnpm
description: pnpm
sidebar: "heading"
---

### 0 intro

[pnpm 官方文档](https://pnpm.io/zh/motivation)

官方文档的 CLI 比较有用

### 1 package.json

[node.js 官方 package.json 指南](https://dev.nodejs.cn/learn/the-package-json-guide/)

使用 pnpm 将 vuepress 的版本锁定在`2.0.0rc.17`

其余依赖插件版本：

```json
"devDependencies": {
  "@vuepress/bundler-vite": "2.0.0-rc.18",
  "@vuepress/plugin-slimsearch": "2.0.0-rc.61",
  "@vuepress/theme-default": "2.0.0-rc.61",
  "nodejs-jieba": "^0.2.1",
  "sass-embedded": "1.81.0",
  "vue": "^3.5.13",
  "vue-router": "^4.5.0",
  "vuepress": "2.0.0-rc.18"
}
```

每次更新 package.json 中的版本号后运行`pnpm update`执行更新，更多 CLI 见页首的官方文档

#### 1.1 软件包版本

在上面的描述中，已经看到类似以下的版本号：`〜3.0.0` 或 `^0.13.0`。 它们是什么意思，还可以使用哪些其他的版本说明符？

该符号指定了软件包能从该依赖接受的更新。

鉴于使用了 semver（语义版本控制），所有的版本都有 3 个数字，第一个是主版本，第二个是次版本，第三个是补丁版本，详见[规则](https://nodejs.cn/learn/semantic-versioning-using-npm/)。

还可以在范围内组合以上大部分内容，例如：1.0.0 || >=1.1.0 <1.2.0，即使用 1.0.0 或从 1.1.0 开始但低于 1.2.0 的版本。

### 2 镜像源地址配置
