---
lang: zh-CN
title: 设计模式
description: design models
sidebar: "heading"
---

### 工厂模式

UtEnumeration 接口改造为 Factory 模式(不就是 codeOf 方法吗)：

```java
class UtEnumerationFactory implements EnumerationFactory{
  @Overide
  public <E extends Enum<E> & UtEnumeration<T>,T> E createUtEnumeration(T t,Class<E> clazz){

  }
}

```

### [领域驱动设计](/serverside/designmodel/dddlearning/领域驱动设计)
