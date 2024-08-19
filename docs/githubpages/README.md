---
lang: zh-CN
title: GitHub Pages 部署
description: GitHub Pages 部署问题
---
## 设置正确的 base 选项
如果你准备发布到 ``https://<USERNAME>.github.io/`` ，你可以省略这一步，因为 base 默认就是 "/" 。

如果你准备发布到 ``https://<USERNAME>.github.io/<REPO>/`` ，也就是说你的仓库地址是 ``https://github.com/<USERNAME>/<REPO>`` ，则将 base 设置为 ``"/<REPO>/"``。

## 选择你想要使用的 CI 工具

这里我们以 [GitHub Actions](https://github.com/features/actions) 为例。创建 ``.github/workflows/docs.yml`` 文件来配置工作流。

## F&Q

### github push 不上去的问题

有时执行 git push 的时候会报错 443 超时，可以检查一下是否开启了全局代理(Global)，可以开启全局代理，用 git bash push 代码。
