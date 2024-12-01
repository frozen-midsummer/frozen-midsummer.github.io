---
lang: zh-CN
title: 工厂模式
description: 工厂模式
sidebar: heading
---

UtEnumeration 接口改造为 Factory 模式(不就是 codeOf 方法吗)：

```java
class UtEnumerationFactory implements EnumerationFactory{
  @Overide
  public <E extends Enum<E> & UtEnumeration<T>,T> E createUtEnumeration(T t,Class<E> clazz){

  }
}
```

