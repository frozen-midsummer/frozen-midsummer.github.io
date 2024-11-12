---
lang: zh-CN
title: Mapstruct
description: mapstruct使用经验
sidebar: heading
---

## 0 Intro

在 DDD 架构中，mapstruct 是一款实用工具，将 source 类映射为 target 类，本文以 UT2 与 SP11 之间的报文映射为例总结 mapstruct 的使用心得

## 1 基础语法

### 1.1 java 表达式

### 1.2 不同变量类型的映射

### 1.3 枚举映射

### 1.4 多对一映射

### 1.5 before&after Mapping

## 2 项目应用

### 2.1 UT2 与 SP11 之间枚举值的映射

由于 SP11 与 UT2 采取不同的数据字典，SP11 更倾向于 IMIX 报文风格，而 UT2 采用宽表的设计，数据字典更大、更通用。本节采用 mapstruct 编写 convertor 类统一完成两个系统之间的枚举映射，并进行相应的空值保护。

SP11 与 UT2 之间的枚举映射可分为四类：一对一、一对多、多对一、多对多：

#### 2.1.1 一对一

```java
@RequiredArgsConstructor
@Getter
class enum Sp11Enunm implements UtEnumeration{
    SP11_A("Sp11A","sp11a"),
    SP11_B("Sp11B","sp11b");
    private final String code;
    private final String desc;
}

@RequiredArgsConstructor
@Getter
class enum Ut2Enunm implements UtEnumeration{
    UT2_A("Ut2A","ut2a"),
    UT2_B("Ut2B","ut2b");
    private final String code;
    private final String desc;
}

public interface UtEnumeration{
    static <E extends UtEnumeration<T>,T> T getCodeOrDefault(E value){
        return Optional.ofNullable(value)
        .map(UtEnumeration::code)
        .orElse(null);
    }
}
```
