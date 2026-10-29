### podman 安装mysql

```bash
podman run --name mysql-server \
 -e MYSQL_ROOT_PASSWORD=123456 \
 -p 3306:3306 \
 -v mysql_data:/var/lib/mysql:Z \
 -d mysql:8.0
```

### podman 国内加速安装mysql

```bash
podman run --name mysql-server \
 -e MYSQL_ROOT_PASSWORD=123456 \
 -p 3306:3306 \
 -v mysql_data:/var/lib/mysql:Z \
 -d docker.m.daocloud.io/library/mysql:8.0
```

### 进去mysql，输入密码123456

```bash
podman exec -it mysql-server mysql -u root -p
```
