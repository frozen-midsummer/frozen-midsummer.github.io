---
lang: zh-CN
description: javascript
sidebar:
  /:
    - text: 项目搭建
      link: /javascript/projectconstruct/
    - text: vue.js
      link: /javascript/vuejs/
---

## 0 序

一个项目中遇到的问题：
在 vue3 组合式 api 中，采用以下方法使用 watch 侦听器，genAssetList 有时候有值，有时候没值

```js
watch(
  () => enumsData.value.assetList,
  () => {
    genAssetList.value = enumsData.value.assetList;
  }
);
```

问题分析：
vue 在侦听到 enumsData.value.assetList 的值发生变化时，立即更新 genAssetList 的值，但此时 enumsData.value.assetList 还没更新完毕，因此，在 vue 中使用侦听器应该用 newVal 的形式使用新值，like:

```js
watch(
  () => enumsData.value.assetList,
  (newVal) => {
    genAssetList.value = newVal;
  }
);
```

这样就能确保侦听到变量变化后用新值进行响应式更新了
