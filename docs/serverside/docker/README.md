## docker

### docker 部署 mysql

#### 部署过程

```bash
## 拉取 docker 镜像
docker pull mysql:latest
## 创建配置目录与优化配置文件
mkdir -p ~/mysql/config  # 配置文件目录
mkdir -p ~/mysql/data    # 数据目录（自动创建，无需手动操作）
mkdir -p ~/mysql/mysql-files
## 创建优化后的MySQL配置文件（适合2核2G服务器）
cat > ~/mysql/config/my.cnf << EOF
[mysqld]
# 基础设置
port = 3306
bind-address = 0.0.0.0  # 允许外部连接
default-storage-engine = InnoDB
# 字符集设置（新增！解决密码验证问题）
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
# 内存优化（关键参数！）
innodb_buffer_pool_size = 512M      # 缓冲池大小，占物理内存的30%
innodb_log_file_size = 64M          # 日志文件大小
innodb_log_buffer_size = 8M         # 日志缓冲区
key_buffer_size = 16M               # MyISAM索引缓存
sort_buffer_size = 2M               # 排序缓冲区
read_buffer_size = 1M               # 读取缓冲区
join_buffer_size = 2M               # 连接缓冲区
max_connections = 100               # 限制最大连接数
max_allowed_packet = 16M            # 最大允许数据包大小
# 性能优化
innodb_flush_log_at_trx_commit = 2  # 牺牲一点持久性换取性能
sync_binlog = 1                     # 改为1以确保数据安全（原为0）
innodb_thread_concurrency = 4       # 限制InnoDB线程数（2核服务器建议4）
# 日志设置（可选）
slow_query_log = 1
slow_query_log_file = /var/lib/mysql/slow.log
long_query_time = 2
EOF
## 使用 Docker 命令启动 MySQL
docker run -itd --name mysql-myblog -p 3306:3306 -e MYSQL_ROOT_PASSWORD=208941 --mount type=bind,source="$(pwd)"/mysql/config/my.cnf,target=/etc/mysql/my.cnf --mount type=bind,source="$(pwd)"/mysql/data,target=/var/lib/mysql --mount type=bind,source="$(pwd)"/mysql/mysql-files,target=/var/lib/mysql-files mysql
## 启动失败删除mysql容器
docker stop mysql-myblog && docker rm mysql-myblog
## 启动成功登录mysql
docker exec -it mysql-myblog mysql -u root -p
```

#### 常见问题

1. Access denied

```bash
[root@iZwz9b5a76d7cz6z7r9v4gZ ~]# docker exec -it mysql-myblog mysql -u root -p
Enter password:
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)
```

问题解决：一般是~/mysql/config/my.cnf 配置文件没指定字符集，和系统字符集不匹配
