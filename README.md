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
