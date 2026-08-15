# 部署指南(阶段 6)

将博客部署到自己的云服务器,公网 HTTPS 访问。

## 架构

```
公网用户 → Caddy(443, 自动 HTTPS 证书)
              ├─ web    Next.js 博客应用(:3000, 仅内网)
              ├─ db     PostgreSQL 18(:5432, 仅内网)
              └─ search Meilisearch(:7700, 仅内网)
```

所有服务由 `docker compose` 编排,一条命令启动;Caddy 自动申请/续期 Let's Encrypt 证书。

## 0. 前置条件

- 一台云服务器(见下),系统 **Ubuntu 22.04 LTS**(或 24.04)
- 一个已注册的域名,并解析 A 记录到服务器 IP
- 本机已安装 git

### 服务器选择建议

| 方案 | 优点 | 注意 |
|---|---|---|
| **香港节点**(腾讯云轻量等) | 免 ICP 备案,开箱即用 | 国内访问稍慢 |
| 国内节点(阿里云/腾讯云) | 访问最快 | 域名需 ICP 备案(1~2 周) |

规格建议:2 核 / 2~4 GB 内存 / 40~80 GB SSD,预算约 200~400 元/年。

## 1. 服务器初始化

```bash
# 用 root 登录后:
# 1) 创建普通用户并加入 sudo
adduser blog
usermod -aG sudo blog

# 2) 本机生成 SSH 密钥并把公钥放上去(Windows 下用 ssh-keygen 生成后 ssh-copy-id 或手动粘贴)
#    ssh-copy-id blog@<服务器IP>

# 3) 防火墙只开 80/443(和 SSH 22)
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 2. 安装 Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker blog   # 让 blog 用户免 sudo 用 docker
# 重新登录使生效,然后验证:
docker --version
docker compose version
```

## 3. 拉取代码并配置

```bash
cd /opt
sudo git clone https://github.com/JJBSGW/personal-blog.git blog
sudo chown -R blog:blog blog
cd blog/deploy
cp .env.example .env
nano .env   # 填写域名、数据库密码、搜索密钥(见下)
```

`.env` 必填项:

```
BLOG_DOMAIN=你的域名
POSTGRES_PASSWORD=强密码
MEILISEARCH_KEY=至少16位随机密钥
```

## 4. 域名解析

在域名服务商处把 A 记录指向服务器 IP(例如 `blog.example.com → 1.2.3.4`),等待生效(`ping` 或 `nslookup` 验证)。

## 5. 启动

```bash
cd /opt/blog/deploy
docker compose up -d --build
```

- 首次构建约 3~8 分钟;启动时容器会自动执行 `prisma migrate deploy` 建表
- Caddy 会自动申请 HTTPS 证书,几分钟内 `https://你的域名` 即可访问

### 初始化管理员账号

```bash
# 进入 web 容器创建管理员(邮箱 + 至少8位密码)
docker compose exec web npx tsx scripts/create-admin.mts 你的邮箱 你的密码
```

> 注意:容器镜像里不包含 tsx(它是 devDependency)。因此请改为在**服务器本机**(不装依赖会缺库)执行——最稳妥的方式是部署后通过 web 容器直接操作数据库,或本地执行脚本后推送数据库。简化方案:
> 启动后用以下命令在容器里创建管理员(镜像含 prisma CLI 与 dotenv,但 tsx 没有;推荐用 node 直连方式):
> ```bash
> docker compose exec web node -e "const{PrismaClient}=require('@prisma/client');..."
> ```
> 更省事的替代:**在本地开发环境**运行 `npx tsx scripts/create-admin.mts 你的邮箱 你的密码`(本地库与生产库分离,此操作针对生产库请在服务器执行,或直接用 prisma studio 添加)。

### 同步搜索索引(首次部署后)

```bash
docker compose exec web npx prisma generate   # 已由构建完成,可跳过
# 索引由文章发布/编辑时自动同步;如需全量重建,见下方"更新"
```

## 6. 日常使用

| 操作 | 命令 |
|---|---|
| 查看状态 | `docker compose ps` |
| 查看日志 | `docker compose logs -f web` |
| 重启应用 | `docker compose restart web` |
| 更新代码 | `cd /opt/blog && git pull && cd deploy && docker compose up -d --build` |
| 全量重建搜索索引 | `docker compose exec web sh -c "cd /app && npx tsx scripts/sync-search.mts"`(镜像无 tsx 时改用 Node 脚本) |

## 7. 备份与恢复

```bash
# 手动备份(生成 backups/blog_时间戳.sql.gz,保留最近14份)
cd /opt/blog/deploy && ./backup.sh

# 定时备份(每天凌晨3点)
crontab -e
# 添加一行:
0 3 * * * /opt/blog/deploy/backup.sh >> /var/log/blog-backup.log 2>&1

# 恢复
gunzip -c backups/blog_xxx.sql.gz | docker compose exec -T db psql -U blog -d blog
```

## 8. 安全清单

- [x] 防火墙仅开放 22/80/443
- [x] SSH 使用密钥登录(建议禁用密码登录:`PasswordAuthentication no`)
- [x] 数据库/搜索端口不暴露公网(compose 未映射,仅内网)
- [x] 后台有登录保护;机器人被 robots.txt 禁止访问 /admin 与 /api
- [x] 定期数据库备份
- [ ] 建议:定时更新系统与镜像(`sudo apt update && sudo apt upgrade`)

## 9. 故障排查

| 现象 | 排查 |
|---|---|
| 502 Bad Gateway | `docker compose logs -f web` 看应用是否启动;`docker compose ps` 看容器状态 |
| 证书未生效 | 确认域名解析已指向本机;Caddy 日志 `docker compose logs caddy` |
| 数据库连接失败 | `docker compose logs db`;确认 `.env` 密码与 compose 一致 |
| 搜索无结果 | `docker compose logs search`;确认 MEILISEARCH_KEY 与 web 环境一致 |

## 10. 升级示例(从本地推送)

```bash
# 本地:开发、提交
git add -A && git commit -m "..." && git push

# 服务器:
cd /opt/blog && git pull && cd deploy && docker compose up -d --build
```
