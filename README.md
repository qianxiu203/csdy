# 主控系统部署指南 (Controller Node)

## 1. 系统定位与架构

**角色定义**：系统的大脑与配置分发中心  
**核心原则**：纯控制面，零代理流量处理

- **零流量特征**：不处理任何代理数据流，仅生成配置与提供管理接口
- **抗封锁设计**：主控域名无异常流量特征，结合伪装策略极难被识别封锁
- **功能边界**：
 - ✅ 生成节点配置与订阅链接
 - ✅ 提供 Web 管理面板
 - ✅ 恶意探测伪装与重定向
 - ❌ 不代理实际流量（由 Pool Domains 承载）

---

## 2. 部署要求

| 项目 | 要求 |
|------|------|
| **平台** | Cloudflare Pages 或 Workers（建议单项目独立部署） |
| **入口文件** | `_worker.js`（必须严格匹配此文件名） |
| **节点协议** | VLESS（自动组装 WebSocket + TLS 配置） |
| **关联系统** | 需配合**节点端**（Pool Domains）协同工作 |

---

## 3. 环境变量配置

> ⚠️ **警告**：以下变量必须在 Cloudflare Dashboard → Settings → Variables 中配置，并**重新部署**生效。

| 变量名 | 必填 | 说明与格式规范 |
|--------|------|----------------|
| `ADD` |**是** | 直接填入 IP/域名列表，换行分隔 |
| `UUID` | **是** | 核心鉴权密钥。必须与所有节点端（Workers/Pages）保持绝对一致。格式：`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` |
| `WEB_PASSWORD` | **是** | 管理面板登录密码（明文存储，建议高强度随机字符串） |
| `SUB_PASSWORD` | **是** | 订阅链接的专属路径密钥。最终订阅地址为 `https://<主控域名>/<SUB_PASSWORD>` |
| `POOL_DOMAINS` | **是** | 流量承载池域名列表。**所有**部署了节点端代码的域名，英文逗号分隔，如：`node1.com,node2.com,node3.com` |
| `ROOT_REDIRECT_URL` | **否**  | 根目录防探测跳转地址，默认 `https://cn.bing.com`。必须是完整 URL（含 https://） |
| `PROXYIP` | **是**  | 默认 Cloudflare 优选 IP 或反代 IP（兜底使用）。支持 `ip:port` 或纯 IP（默认 443） |
| `POOL_STATE` | **否**  | 不绑定KV空间默认列表第一个域名节点 |
| `ECH` | **否** | 默认 ECH 开关，支持 `yes/no`，默认 `no` |
| `ECH_DOH` | **否** | 默认 DoH 地址，默认 `https://dns.joeyblog.eu.org/joeyblog` |
| `ECH_QUERY_SERVER_NAME` | **否** | 默认 ECH 域名，默认 `cloudflare-ech.com` |
## 4. 路由与访问控制
| `/admin` | 管理面板路径地址 

## 5. ECH 支持

### 工作方式

- ECH 由主控端 `csdy-main` 负责下发到订阅节点 URI 中
- 节点端 `csfu-main` 仅负责转发流量，不需要实现 ECH 握手逻辑
- 开启后，生成的 VLESS URI 会附带：
  - `fp=chrome`
  - `alpn=h3,h2,http/1.1`
  - `ech=<ECH_QUERY_SERVER_NAME>+<ECH_DOH>`

### 功能页配置

- 访问 `/admin` 后可直接管理 ECH
- 页面支持：
  - 启用 / 关闭 ECH
  - 自定义 DoH 地址
  - 自定义 ECH 域名
- 保存后立即写入 `POOL_STATE`，新的订阅请求立刻生效

### 变量名与优先级

- Cloudflare 后台环境变量名称必须使用：
  - `ECH`
  - `ECH_DOH`
  - `ECH_QUERY_SERVER_NAME`
- 不要把代码常量名 `DEFAULT_ECH_DOH`、`DEFAULT_ECH_QUERY_SERVER_NAME` 当作后台变量名；它们只是代码里的兜底默认值，不会直接从 Cloudflare Dashboard 读取同名变量
- 当前实际读取优先级为：
  - 显式设置的 Cloudflare 环境变量
  - `POOL_STATE` KV
  - 代码内置默认值
- 如果 `/admin/config` 返回的 `source` 是 `environment`，说明当前有显式环境变量覆盖了 KV 中旧值
- 如果 `/admin/config` 返回的 `source` 是 `kv`，说明当前没有显式环境变量覆盖，正在使用 KV 中保存的值
- 如果你希望重新跟随后台环境变量：
  - 在功能页将 DoH 或 ECH 域名输入框清空后保存
  - 系统会删除对应 KV 键，并自动回退到 Cloudflare 环境变量

示例：

- 正确的后台变量名：`ECH_DOH=https://your-doh.example/dns-query`
- 错误的后台变量名：`DEFAULT_ECH_DOH=https://your-doh.example/dns-query`

### KV 键

- `ech_enabled`
- `ech_doh`
- `ech_query_server_name`

### 管理接口

- `GET /admin/config`：返回当前 ECH 配置
- `POST /admin/config`：保存当前 ECH 配置
```
