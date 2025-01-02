---
lang: zh-CN
title: Java Learning
description: Java 学习笔记
sidebar: heading
---

## Spring Cloud

[jrescloud3.0 开发框架知识库](https://iknow.hs.net/portal/docView/home/12795)

## 编码规范

[hundsun java 代码规范](https://iknow.hs.net/portal/docView/home/21778)

## maven pom

## 常见问题

- Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasour

解决方案：

问题在于引入类路径中的配置文件时，忽略了 resource 路径下的配置文件

原 pom.xml 配置文件：

```xml
<build>
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
            <filtering>false</filtering>
        </resource>
    </resources>
</build>
```

修改后的 pom.xml 配置文件：

```xml
<build>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <includes>
                <include>**/*.yml</include>
                <include>**/*.properties</include>
                <include>**/*.xml</include>
            </includes>
            <filtering>false</filtering>
        </resource>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
            <filtering>false</filtering>
        </resource>
    </resources>
</build>
```
