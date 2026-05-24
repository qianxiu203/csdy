# 主控系统部署指南（Controller Node）

## 1. 系统定位

`csdy-main` 是主控端，只负责配置分发与后台管理，不承载实际代理流量。

- 生成订阅内容与节点 URI
- 提供 `/admin` 管理面板
- 维护域名池轮换状态
- 下发 ECH 相关参数
- 根路径按配置跳转伪装

实际流量由节点端域名池承载，主控端本身不做代理转发。

---

## 2. 部署要求

| 项目 | 说明 |
|------|------|
| 平台 | Cloudflare Pages 或 Workers |
| 入口文件 | `_worker.js` |
| 协议 | VLESS over WebSocket + TLS |
| 配套组件 | 需搭配节点端 `csfu-main` 使用 |

---

## 3. 环境变量

> 所有变量需要在 Cloudflare Dashboard 中配置，并重新部署后生效。

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `ADD` | 是 | 节点地址列表，换行分隔，支持 `ip`、`ip:port`、`ip:port#备注` |
| `UUID` | 是 | 订阅节点使用的 UUID，需与节点端保持一致 |
| `WEB_PASSWORD` | 是 | `/admin` 管理面板密码 |
| `SUB_PASSWORD` | 是 | 订阅路径密码，订阅地址为 `https://<主控域名>/<SUB_PASSWORD>` |
| `POOL_DOMAINS` | 是 | 节点域名池，英文逗号分隔，如 `a.pages.dev,b.pages.dev` |
| `PROXYIP` | 否 | 默认 ProxyIP，支持 `ip` 或 `ip:port` |
| `ROOT_REDIRECT_URL` | 否 | 根路径跳转地址，默认 `https://cn.bing.com` |
| `POOL_STATE` | 否 | 绑定 KV 后可保存当前域名索引和 ECH 配置 |
| `ECH` | 否 | 默认 ECH 开关，支持 `yes/no` |
| `ECH_DOH` | 否 | ECH 使用的 DoH 地址 |
| `ECH_QUERY_SERVER_NAME` | 否 | ECH 域名，默认 `cloudflare-ech.com` |
| `PS` | 否 | 节点备注后缀 |
| `ADDAPI` | 否 | 远程地址源，换行分隔 URL |
| `ADDCSV` | 否 | 远程 CSV 地址源，换行分隔 URL |

### 变量名注意事项

- Cloudflare 后台可读取的变量名是：`ECH`、`ECH_DOH`、`ECH_QUERY_SERVER_NAME`
- 不要把代码常量名当作后台变量名，例如：`DEFAULT_ECH_DOH`、`DEFAULT_ECH_QUERY_SERVER_NAME`
- `DEFAULT_ECH_DOH` 只是代码内部兜底常量，不会从 Cloudflare Dashboard 自动读取

---

## 4. 访问路径

| 路径 | 说明 |
|------|------|
| `/` | 跳转到 `ROOT_REDIRECT_URL` |
| `/<SUB_PASSWORD>` | 订阅地址 |
| `/sub?uuid=<UUID>` | 备用订阅地址 |
| `/admin` | 管理面板 |
| `/admin/config` | ECH 配置读取 / 保存接口 |
| `/admin/switch?index=N` | 切换当前域名池索引 |

---

## 5. 域名池调度

- 订阅请求命中后，会从 `POOL_DOMAINS` 中选择当前激活域名生成节点
- 如果绑定了 `POOL_STATE`，系统会记录 `domain_index` 并轮换下一个域名
- 后台也可以手动切换索引
- 节点的 `sni` 与 `host` 均使用当前选中的池域名

---

## 6. ECH 支持

### 工作方式

- ECH 参数由主控端 `csdy-main` 写入订阅节点 URI
- 节点端 `csfu-main` 不负责 ECH 握手本身
- 开启 ECH 后，生成的节点 URI 会附带：
  - `fp=chrome`
  - `alpn=h3,h2,http/1.1`
  - `ech=<ECH_QUERY_SERVER_NAME>+<ECH_DOH>`

### 默认行为

- `ECH_QUERY_SERVER_NAME` 代码默认值为 `cloudflare-ech.com`
- `ECH_DOH` 当前代码默认值为空字符串
- 也就是说：如果你没有设置 `ECH_DOH`，又没有在后台保存 DoH，当前使用值就不会来自固定默认 DoH

### 当前优先级

当前 ECH 配置优先级如下：

1. Cloudflare 环境变量
2. `POOL_STATE` 中保存的 ECH 配置
3. 代码默认值

### 自动清理旧值

当以下环境变量存在时，系统会在读取配置时自动删除对应的 KV 旧值：

- `ECH` → 删除 `ech_enabled`
- `ECH_DOH` → 删除 `ech_doh`
- `ECH_QUERY_SERVER_NAME` → 删除 `ech_query_server_name`

这意味着：

- 当前页面显示的是实际生效值
- 如果环境变量已经接管，旧 KV 值不会长期残留

### 后台功能页

访问 `/admin` 后可以直接管理 ECH：

- 启用 / 关闭 ECH
- 设置 DoH 地址
- 设置 ECH 域名
- 保存到 `POOL_STATE`

ECH 功能页当前只显示“当前实际生效”的配置，不再展示旧默认值调试字段。

### `/admin/config` 返回示例

```json
{
  "enabled": true,
  "doh": "https://example.com/dns-query",
  "queryServerName": "cloudflare-ech.com",
  "source": "environment",
  "kvBound": true
}
```

`source` 含义：

- `environment`：当前值来自 Cloudflare 环境变量
- `kv`：当前值来自 `POOL_STATE`
- `default`：当前值来自代码默认值

### 清除旧 ECH 值的方法

如果你想只保留环境变量值，有两种方式：

1. 直接在 Cloudflare 后台设置 `ECH` / `ECH_DOH` / `ECH_QUERY_SERVER_NAME`
   - 系统在下次读取配置时会自动删除对应 KV 旧值
2. 进入 `/admin`
   - 将 DoH 或 ECH 域名输入框清空后保存
   - 系统会删除对应 KV 键

---

## 7. KV 键说明

如果绑定了 `POOL_STATE`，系统会使用这些键：

- `domain_index`
- `ech_enabled`
- `ech_doh`
- `ech_query_server_name`

---

## 8. 节点输出示例

ECH 开启后，生成的 VLESS URI 类似：

```text
vless://UUID@1.2.3.4:443?security=tls&sni=node.example.com&fp=chrome&alpn=h3,h2,http/1.1&type=ws&host=node.example.com&path=%2Fapi%2Fv1&ech=cloudflare-ech.com%2Bhttps%3A%2F%2Fexample.com%2Fdns-query#Edge
```

---

## 9. 使用建议

- `POOL_DOMAINS` 建议填写已部署节点端代码的真实可用域名
- 如果使用自定义 `pages.dev` 域名，节点的 `sni` / `host` 应保持和池域名一致
- 修改环境变量后要重新部署
- 如果你发现页面显示值和预期不符，优先访问 `/admin/config` 查看当前实际生效配置
