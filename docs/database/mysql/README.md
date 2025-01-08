---
lang: zh-CN
title: Mysql
description: Mysql
sidebar: heading
---

## 常见问题

- 在 spring boot 集成 mysql 和 mybatis plus 时，若使用 mysql 的自增索引为主键，在 mapper.selectXXX(QueryWrapper)时会遇到数据映射错位的问题，例如表中 created_time 字段无法映射到 DO 的 createdTime 字段。

解决方案：使用雪花 id 生成器代替 mysql 的自增索引作为主键
