## docker

### docker 部署 mysql

1. 拉取 docker 镜像
   docker pull mysql:latest
2. 创建配置目录与优化配置文件

```bash
mkdir -p ~/mysql/config  # 配置文件目录
mkdir -p ~/mysql/data    # 数据目录（自动创建，无需手动操作）
mkdir -p ~/mysql/mysql-files
# 创建优化后的MySQL配置文件（适合2核2G服务器）
cat > ~/mysql/config/my.cnf << EOF
[mysqld]
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
sync_binlog = 0                     # 禁用二进制日志同步（如果不需要主从复制）
innodb_thread_concurrency = 4       # 限制InnoDB线程数（2核服务器建议4）
EOF
```

3. 使用 Docker 命令启动 MySQL

```sh
docker run -itd \
  --name mysql-myblog \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=208941 \
  --mount type=bind,source="$(pwd)"/mysql/config/my.cnf,target=/etc/mysql/my.cnf \
  --mount type=bind,source="$(pwd)"/mysql/data,target=/var/lib/mysql \
  --mount type=bind,source="$(pwd)"/mysql/mysql-files,target=/var/lib/mysql-files \
  mysql
```
docker exec -it mysql-test mysql -u root -p

docker run -itd --name mysql-myblog -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql