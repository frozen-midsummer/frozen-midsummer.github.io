---
lang: zh-CN
title: 设计模式
description: design models
---

## 工厂方法模式

UtEnumeration接口改造为Factory模式(不就是codeOf方法吗)：

```java
class UtEnumerationFactory implements EnumerationFactory{
  @Overide
  public <E extends Enum<E> & UtEnumeration<T>,T> E createUtEnumeration(T t,Class<E> clazz){

  }
}
```
