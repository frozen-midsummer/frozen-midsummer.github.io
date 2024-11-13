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

其实没啥好写的，问 AI 就行

```java
@Mapper(componentModel=SPRING)
public interface testConvertor{
    @Mapping(target="name",expression="java(source1.getName()+source2.getName())")
    Target toTarget(Source1 source1, Source2 source2);
}
```

### 1.5 before&after Mapping

## 2 项目应用

### 2.1 UT2 与 SP11 之间枚举值的映射

由于 SP11 与 UT2 采取不同的数据字典，SP11 更倾向于 IMIX 报文风格；而 UT2 采用宽表的设计，数据字典更大、更通用。本节采用 mapstruct 编写 convertor 类统一完成两个系统之间的枚举映射，并进行相应的空值保护。

#### 2.1.1 枚举接口

所有枚举继承此枚举接口，为 code 转枚举和枚举转 code 做了空值保护

```java
public interface UtEnumeration<T>{

    T code();

    String describe();

    static <E extends Enum<E> & UtEnumeration<T>,T> E codeOf(T code, Class<E> clazz) {
        if(code==null){
            return null;
        }
        EnumSet<E> allEnums = EnumSet.allOf(clazz);
        return allEnums.stream()
            .filter(e -> e.code().equals(code))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException(String.format("枚举：[%s]不存在枚举项：[%s]",clazz.getName(),code)));
    }

    static <E extends UtEnumeration<T>,T> T getCodeOrDefault(E value){
        return Optional.ofNullable(value)
            .map(UtEnumeration::code)
            .orElse(null);
    }
}
```

#### 2.1.2 枚举类

```java
@RequiredArgsConstructor
@Getter
class enum Sp11Enunm implements UtEnumeration<String>{
    SP11_A("Sp11A","sp11a"),
    SP11_B("Sp11B","sp11b");
    private final String code;
    private final String desc;
    public static Sp11Enunm utCodeOf(String ut2){
        if(StringUtils.isEmpty(ut2)){
            return null;
        }
        Ut2Enum ut2Enum = UtEnumeration.codeOf(ut2,Ut2Enum.class);
        switch(ut2Enum){
            case UT2_A:
                return SP11_A;
            case UT2_B:
                return SP11_B;
            default:
                throw new IllegalArgumentException(String.format("枚举Ut2Enunm:[%s]无法映射到系统内枚举[%s]",ut2,"Sp11Enunm"));
        }
    }
}

@RequiredArgsConstructor
@Getter
class enum Ut2Enunm implements UtEnumeration<String>{
    UT2_A("Ut2A","ut2a"),
    UT2_B("Ut2B","ut2b");
    private final String code;
    private final String desc;
    public static String getCodeBySpEnum(Sp11Enunm sp11Enum){
        if(sp11Enum==null){
            return null;
        }
        switch(sp11Enum){
            case SP11_A:
                return UT2_A.code();
            case SP11_B:
                return UT2_B.code();
            default:
                throw new IllegalArgumentException(String.format("枚举Sp11Enunm:[%s]无法映射到报盘枚举[%s]",sp11Enum.code(),"Ut2Enunm"));
        }
    }
}


```
