---
lang: zh-CN
description: 网站建设笔记
sidebar:
  /websiteconstruction/:
    - text: Github Pages
      link: /websiteconstruction/githubpages/
    - text: VuePress
      link: /websiteconstruction/vuepresslearning/
    - text: pnpm
      link: /websiteconstruction/pnpm/
---

## F&Q

### 20250106 文件夹下的 README.md 无法在 github bot 上编译出 index.html

问题描述：

docs\serverside\pythonlearning\README.md 无法正常在 github 流水线上编译出 index.html，修改文件名为 README1.md 之后可以正常编译出 README1.html。本地不修改文件名也可正常编译出 index.html

问题原因：不详

解决方案：后续新建目录时为目录下的 index markdown 文件起一个包含语义的文件名（新学的英语，semantic）
