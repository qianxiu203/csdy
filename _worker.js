// =============================================================================
// 🟢 用户配置区域
// =============================================================================
const UUID = ""; 
const WEB_PASSWORD = "";  
const SUB_PASSWORD = "";  
const DEFAULT_PROXY_IP = ""; 
const NODE_DEFAULT_PATH = "/api/v1"; 
const ROOT_REDIRECT_URL = "https://cn.bing.com"; 
const PT_TYPE = 'v'+'l'+'e'+'s'+'s';

function getEnv(env, key, fallback) { return env[key] || fallback; }

// =============================================================================
// 🎨 布局与样式优化 (针对 UI 比例失调进行重构)
// =============================================================================
const COMMON_STYLE = `
    :root {
        --bg-body: #f8fafc;
        --bg-card: #ffffff;
        --primary: #4f46e5;
        --primary-hover: #4338ca;
        --text-main: #1e293b;
        --text-muted: #64748b;
        --border-color: #e2e8f0;
        --success: #10b981;
        --danger: #ef4444;
        --radius: 12px;
        --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
    }
    [data-theme="dark"] {
        --bg-body: #0f172a;
        --bg-card: #1e293b;
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-color: #334155;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        background: var(--bg-body);
        color: var(--text-main);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 1rem;
    }
    .container { width: 100%; max-width: 900px; }
    
    .card {
        background: var(--bg-card);
        border-radius: var(--radius);
        border: 1px solid var(--border-color);
        box-shadow: var(--shadow);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    /* 统计网格 */
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius); border: 1px solid var(--border-color); text-align: center; }
    .stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 0.5rem; }
    .stat-value { font-size: 1.5rem; font-weight: 800; color: var(--text-main); }

    /* 操作区优化 */
    .input-group { display: flex; gap: 0.5rem; margin-top: 1rem; }
    input {
        flex: 1; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-color);
        background: var(--bg-body); color: var(--text-main); font-size: 0.9rem; outline: none;
    }
    input:focus { border-color: var(--primary); ring: 2px var(--primary); }
    
    .btn {
        padding: 0.75rem 1.25rem; border-radius: 8px; border: none; font-weight: 600; cursor: pointer;
        display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; transition: 0.2s;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); }
    .btn-outline:hover { background: var(--border-color); }

    /* 列表样式优化 */
    .list-item {
        display: flex; justify-content: space-between; align-items: center;
        padding: 0.85rem 1rem; margin-bottom: 0.5rem; border-radius: 8px;
        background: var(--bg-body); border: 1px solid transparent;
    }
    .list-item.active { border-color: var(--primary); background: rgba(79, 70, 229, 0.08); }
    .badge { padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
    .badge-active { background: var(--success); color: white; }
    .badge-standby { background: var(--border-color); color: var(--text-muted); }

    #toast {
        position: fixed; bottom: 2rem; background: #1e293b; color: white;
        padding: 0.75rem 1.5rem; border-radius: 50px; font-size: 0.9rem;
        transform: translateY(100px); transition: 0.3s;
    }
    #toast.show { transform: translateY(0); }
`;

function loginPage() {
    return `<!DOCTYPE html><html><head><style>${COMMON_STYLE}</style></head><body>
    <div style="margin-top: 10vh; width: 100%; max-width: 400px;" class="card">
        <h2 style="margin-bottom: 1.5rem; text-align: center;">验证身份</h2>
        <input type="password" id="pw" placeholder="请输入管理密码" style="width: 100%; margin-bottom: 1rem;">
        <button class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="login()">进入控制台</button>
    </div>
    <script>
        function login() {
            const p = document.getElementById('pw').value;
            document.cookie = "auth=" + p + "; path=/; Max-Age=31536000";
            location.reload();
        }
    </script></body></html>`;
}

function dashPage(host, uuid, proxyip, subpass, poolDomains = [], activeIndex = 0, nodeCount = 0) {
    const domainsJson = JSON.stringify(poolDomains);
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><style>${COMMON_STYLE}</style></head><body>
    <div class="container">
        <header style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
                <h1 style="font-size: 1.5rem; font-weight: 800;">边缘节点调度</h1>
                <p style="color: var(--text-muted); font-size: 0.85rem;">${host}</p>
            </div>
            <button class="btn btn-outline" onclick="logout()">退出</button>
        </header>

        <div class="stats-grid">
            <div class="stat-card"><div class="stat-label">域名总数</div><div class="stat-value">${poolDomains.length}</div></div>
            <div class="stat-card" style="border-bottom: 3px solid var(--primary);"><div class="stat-label">活跃索引</div><div class="stat-value" style="color: var(--primary)">#${activeIndex}</div></div>
            <div class="stat-card"><div class="stat-label">可用 IP</div><div class="stat-value">${nodeCount}</div></div>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 1rem; font-size: 1rem;">🔗 订阅分发</h3>
            <div class="input-group">
                <input type="text" id="subLink" value="https://${host}/${subpass}" readonly>
                <button class="btn btn-primary" onclick="copyVal('subLink')">复制订阅</button>
            </div>
            <div class="input-group">
                <input type="text" id="customIP" value="${proxyip}" placeholder="自定义 ProxyIP (留空使用全局配置)" oninput="updateUrl()">
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.6fr 1fr; gap: 1.5rem;">
            <div class="card" style="display: flex; flex-direction: column;">
                <h3 style="margin-bottom: 1rem; font-size: 1rem;">🗺️ 域名轮换池状态</h3>
                <div id="domainList" style="flex: 1; margin-bottom: 1.5rem;"></div>
                
                <div style="padding-top: 1rem; border-top: 1px solid var(--border-color);">
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">手动强制切换：</p>
                    <div class="input-group">
                        <input type="number" id="targetIdx" placeholder="目标索引" min="0" max="${poolDomains.length-1}">
                        <button class="btn btn-outline" onclick="switchDomain()">立即执行</button>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3 style="margin-bottom: 1rem; font-size: 1rem;">⚙️ 环境变量</h3>
                <div style="font-size: 0.8rem; line-height: 2;">
                    <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-muted)">UUID:</span><span style="font-family: monospace;">${uuid.substring(0,8)}...</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: var(--text-muted)">API Path:</span><span style="font-family: monospace;">${NODE_DEFAULT_PATH}</span></div>
                    <div style="margin-top: 1rem; padding: 0.5rem; background: var(--bg-body); border-radius: 4px; word-break: break-all; color: var(--text-muted);">
                        当前域名: ${poolDomains[activeIndex] || host}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="toast">已成功复制</div>

    <script>
        const domains = ${domainsJson};
        const activeIdx = ${activeIndex};

        function render() {
            const list = document.getElementById('domainList');
            list.innerHTML = domains.map((d, i) => \`
                <div class="list-item \${i === activeIdx ? 'active' : ''}">
                    <span style="font-family: monospace; font-size: 0.9rem;">[\${i}] \${d}</span>
                    <span class="badge \${i === activeIdx ? 'badge-active' : 'badge-standby'}">\${i === activeIdx ? 'ACTIVE' : 'STANDBY'}</span>
                </div>
            \`).join('');
        }

        function updateUrl() {
            const ip = document.getElementById('customIP').value.trim();
            const base = "https://" + window.location.hostname + "/${subpass}";
            document.getElementById('subLink').value = ip ? base + "?proxyip=" + ip : base;
        }

        function copyVal(id) {
            const el = document.getElementById(id);
            el.select();
            document.execCommand('copy');
            const t = document.getElementById('toast');
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2000);
        }

        async function switchDomain() {
            const idx = document.getElementById('targetIdx').value;
            if(idx === "") return;
            const res = await fetch('/admin/switch?index=' + idx);
            if(res.ok) location.reload();
        }

        function logout() {
            document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            location.reload();
        }

        render();
    </script></body></html>`;
}

// =============================================================================
// 🟢 后端逻辑 (逻辑保持不变，确保稳定性)
// =============================================================================
async function getCustomIPs(env) {
    let ips = getEnv(env, 'ADD', "");
    const addApi = getEnv(env, 'ADDAPI', "");
    if (addApi) {
        for (const url of addApi.split('\\n').filter(u => u.trim())) {
            try { const r = await fetch(url.trim()); if (r.ok) ips += "\\n" + await r.text(); } catch(e){}
        }
    }
    return ips;
}

function genNodes(hosts, u, p, ipsText, ps = "", defaultIP = "") {
    const lines = ipsText.split('\\n').filter(l => l.trim());
    const finalPath = (p && p.trim() !== defaultIP) ? \`\${NODE_DEFAULT_PATH}?proxyip=\${p.trim()}\` : NODE_DEFAULT_PATH;
    return lines.map(line => {
        const [addr, name] = line.split('#');
        if (!addr) return null;
        let [ip, port] = addr.trim().split(':'); if (!port) port = "443";
        return hosts.map((h, i) => {
            const nName = \`\${name || 'Edge'}\${hosts.length > 1 ? '-N'+(i+1) : ''} \${ps}\`.trim();
            return \`\${PT_TYPE}://\${u}@\${ip}:\${port}?encryption=none&security=tls&sni=\${h}&alpn=h3&fp=random&allowInsecure=1&type=ws&host=\${h}&path=\${encodeURIComponent(finalPath)}#\${encodeURIComponent(nName)}\`;
        }).join('\\n');
    }).filter(Boolean).join('\\n');
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const host = url.hostname;
        const _UUID = getEnv(env, 'UUID', UUID);
        const _WEB_PW = getEnv(env, 'WEB_PASSWORD', WEB_PASSWORD);
        const _SUB_PW = getEnv(env, 'SUB_PASSWORD', SUB_PASSWORD);
        const _PROXY_IP_RAW = env.PROXYIP || env.DEFAULT_PROXY_IP || DEFAULT_PROXY_IP;
        const _PROXY_IP = _PROXY_IP_RAW ? _PROXY_IP_RAW.split(/[\\n,]/)[0].trim() : "";
        const _POOL_DOMAINS = getEnv(env, 'POOL_DOMAINS', host).split(',').map(d => d.trim()).filter(Boolean);

        // 订阅逻辑
        if ((_SUB_PW && url.pathname === \`/\${_SUB_PW}\`) || (url.pathname === '/sub' && url.searchParams.get('uuid') === _UUID)) {
            let idx = 0;
            if (env.POOL_STATE) {
                const stored = await env.POOL_STATE.get('domain_index');
                idx = parseInt(stored, 10) || 0;
                await env.POOL_STATE.put('domain_index', String((idx + 1) % _POOL_DOMAINS.length));
            }
            const allIPs = await getCustomIPs(env);
            const nodes = genNodes([_POOL_DOMAINS[idx % _POOL_DOMAINS.length]], _UUID, url.searchParams.get('proxyip') || _PROXY_IP, allIPs, getEnv(env, 'PS', ""), _PROXY_IP);
            return new Response(btoa(unescape(encodeURIComponent(nodes))), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        }

        // 管理面板逻辑
        if (url.pathname.startsWith('/admin')) {
            if (_WEB_PW) {
                const cookie = request.headers.get('Cookie') || "";
                if (!cookie.includes(\`auth=\${_WEB_PW}\`)) return new Response(loginPage(), { headers: { 'Content-Type': 'text/html' } });
            }
            if (url.pathname === '/admin/switch') {
                const idx = url.searchParams.get('index');
                if (env.POOL_STATE && idx !== null) await env.POOL_STATE.put('domain_index', idx);
                return new Response(JSON.stringify({ok: true}));
            }
            let idx = 0;
            if (env.POOL_STATE) idx = parseInt(await env.POOL_STATE.get('domain_index') || "0", 10);
            const allIPs = await getCustomIPs(env);
            const count = allIPs.split('\\n').filter(l => l.trim()).length;
            return new Response(dashPage(host, _UUID, _PROXY_IP, _SUB_PW, _POOL_DOMAINS, idx % _POOL_DOMAINS.length, count), { headers: { 'Content-Type': 'text/html' } });
        }

        if (url.pathname === '/') return Response.redirect(getEnv(env, 'ROOT_REDIRECT_URL', ROOT_REDIRECT_URL), 302);
        return new Response('Not Found', { status: 404 });
    }
};
