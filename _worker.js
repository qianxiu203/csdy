// =============================================================================
// 🟢 用户配置区域 (主账号: 订阅管理)
// =============================================================================
const UUID = "";             // 默认 UUID
const WEB_PASSWORD = "";      // 管理面板密码
const SUB_PASSWORD = "";      // 订阅路径密码
const DEFAULT_PROXY_IP = "";  // 默认 Proxy IP
const NODE_DEFAULT_PATH = "/api/v1"; 
const ROOT_REDIRECT_URL = "https://cn.bing.com"; 

const PT_TYPE = 'v' + 'l' + 'e' + 's' + 's';

// =============================================================================
// 🎨 UI 样式系统 (现代工业风)
// =============================================================================
const COMMON_STYLE = `
:root {
    --primary: #4f46e5;
    --primary-focus: #4338ca;
    --bg-page: #f8fafc;
    --bg-card: #ffffff;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --success: #10b981;
    --danger: #ef4444;
    --radius: 12px;
}
[data-theme="dark"] {
    --bg-page: #0f172a;
    --bg-card: #1e293b;
    --text-main: #f1f5f9;
    --text-muted: #94a3b8;
    --border: #334155;
}
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; }
body { background: var(--bg-page); color: var(--text-main); line-height: 1.5; transition: background 0.3s; }

/* 布局容器 */
.container { max-width: 1000px; margin: 0 auto; padding: 2rem 1.5rem; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }

/* 卡片设计 */
.card { 
    background: var(--bg-card); 
    border: 1px solid var(--border); 
    border-radius: var(--radius); 
    padding: 1.5rem; 
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; font-weight: 700; font-size: 1.1rem; }

/* 输入与按钮 */
.input-group { margin-bottom: 1rem; }
.input-label { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 500; }
input { 
    width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg-page); color: var(--text-main); font-size: 0.95rem; outline: none; transition: border 0.2s;
}
input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
.btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.75rem 1.25rem; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-focus); transform: translateY(-1px); }
.btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--text-main); }
.btn-ghost:hover { background: var(--border); }

/* 状态标签 */
.badge { padding: 0.25rem 0.6rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; }
.badge-success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.badge-muted { background: var(--border); color: var(--text-muted); }

/* 列表条目 */
.list-item { 
    display: flex; justify-content: space-between; align-items: center; 
    padding: 0.75rem; border-radius: 8px; border: 1px solid transparent;
}
.list-item.active { background: rgba(79, 70, 229, 0.05); border-color: var(--primary); }

#toast {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px);
    background: #1e293b; color: white; padding: 0.75rem 1.5rem; border-radius: 99px;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
#toast.show { transform: translateX(-50%) translateY(0); }
`;

const THEME_SCRIPT = `<script>
    const setTheme = (t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
    };
    setTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
</script>`;

// =============================================================================
// 🔓 登录页面
// =============================================================================
function loginPage() {
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>安全验证</title><style>${COMMON_STYLE}</style>${THEME_SCRIPT}</head><body>
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1.5rem;">
        <div class="card" style="width: 100%; max-width: 400px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🛰️</div>
            <h2 style="margin-bottom: 0.5rem;">控制台验证</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem;">请输入管理员密钥以继续</p>
            <input type="password" id="pw" placeholder="Enter Password..." style="text-align: center; margin-bottom: 1.5rem;" onkeypress="if(event.key==='Enter')login()">
            <button class="btn btn-primary" onclick="login()" style="width: 100%;">确认进入</button>
        </div>
    </div>
    <script>
        function login() {
            const pw = document.getElementById('pw').value;
            if(!pw) return;
            document.cookie = "auth=" + pw + "; path=/; Max-Age=31536000";
            location.reload();
        }
    </script></body></html>`;
}

// =============================================================================
// 📊 后台主页
// =============================================================================
function dashPage(host, uuid, proxyip, subpass, poolDomains = [], activeIndex = 0, nodeCount = 0) {
    const domainsJson = JSON.stringify(poolDomains);
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Edge Dashboard</title><style>${COMMON_STYLE}</style>${THEME_SCRIPT}</head><body>
    <div class="container">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem;">
            <div>
                <h1 style="font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em;">调度中心</h1>
                <p style="font-size: 0.85rem; color: var(--text-muted); font-family: monospace;">${host}</p>
            </div>
            <div style="display: flex; gap: 0.75rem;">
                <button class="btn btn-ghost" onclick="setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')" title="切换主题">🌓</button>
                <button class="btn btn-ghost" onclick="logout()">退出</button>
            </div>
        </header>

        <section class="grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 2rem;">
            <div class="card" style="padding: 1.25rem;">
                <div style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">域名池状态</div>
                <div style="font-size: 1.75rem; font-weight: 800;">${poolDomains.length} <span style="font-size: 0.9rem; font-weight: 400; color: var(--text-muted);">Nodes</span></div>
            </div>
            <div class="card" style="padding: 1.25rem; border-bottom: 3px solid var(--primary);">
                <div style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">活跃索引</div>
                <div style="font-size: 1.75rem; font-weight: 800; color: var(--primary);"># ${activeIndex}</div>
            </div>
            <div class="card" style="padding: 1.25rem;">
                <div style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">可用 IP 数</div>
                <div style="font-size: 1.75rem; font-weight: 800;">${nodeCount}</div>
            </div>
        </section>

        <main class="grid">
            <div class="card">
                <div class="card-header">📡 订阅分发</div>
                <div class="input-group">
                    <label class="input-label">主订阅链接</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="subLink" value="https://${host}/${subpass}" readonly style="font-family: monospace; font-size: 0.85rem;">
                        <button class="btn btn-primary" onclick="copyVal('subLink')">复制</button>
                    </div>
                </div>
                <div class="input-group">
                    <label class="input-label">参数注入: ProxyIP (可选)</label>
                    <input type="text" id="customIP" value="${proxyip}" placeholder="例如: cf.proxy.com" oninput="updateLink()">
                </div>
                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--border);">
                    <label class="input-label">系统环境信息</label>
                    <div style="font-size: 0.8rem; background: var(--bg-page); padding: 0.75rem; border-radius: 8px; font-family: monospace; word-break: break-all;">
                        UUID: ${uuid}<br>
                        PATH: ${NODE_DEFAULT_PATH}
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">🗺️ 域名轮换池</div>
                <div id="domainList" style="margin-bottom: 1.5rem; max-height: 250px; overflow-y: auto;"></div>
                
                <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
                    <div style="flex: 1;">
                        <label class="input-label">手动强制切换索引</label>
                        <input type="number" id="targetIdx" placeholder="0 - ${poolDomains.length - 1}" min="0">
                    </div>
                    <button class="btn btn-primary" onclick="switchDomain()">立即执行</button>
                </div>
            </div>
        </main>
    </div>

    <div id="toast"></div>

    <script>
    const domains = ${domainsJson};
    const activeIdx = ${activeIndex};
    const subPass = "${subpass}";

    function renderDomains() {
        const list = document.getElementById('domainList');
        list.innerHTML = domains.map((d, i) => \`
            <div class="list-item \${i === activeIdx ? 'active' : ''}">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 0.9rem; font-weight: 600;">\${d}</span>
                    <span style="font-size: 0.7rem; color: var(--text-muted); font-family: monospace;">Index: \${i}</span>
                </div>
                <span class="badge \${i === activeIdx ? 'badge-success' : 'badge-muted'}">
                    \${i === activeIdx ? 'ACTIVE' : 'STANDBY'}
                </span>
            </div>
        \`).join('');
    }

    function updateLink() {
        const ip = document.getElementById('customIP').value.trim();
        const base = "https://" + window.location.hostname + "/" + subPass;
        document.getElementById('subLink').value = ip ? base + "?proxyip=" + ip : base;
    }

    function showToast(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }

    function copyVal(id) {
        const el = document.getElementById(id);
        el.select();
        document.execCommand('copy');
        showToast("✅ 已成功复制到剪贴板");
    }

    async function switchDomain() {
        const idx = document.getElementById('targetIdx').value;
        if(idx === "") return;
        const res = await fetch('/admin/switch?index=' + idx);
        if(res.ok) {
            showToast("🚀 正在应用调度策略...");
            setTimeout(() => location.reload(), 800);
        }
    }

    function logout() {
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        location.reload();
    }

    renderDomains();
    </script></body></html>`;
}

// =============================================================================
// ⚙️ 核心逻辑逻辑 (保留并微调)
// =============================================================================
function getEnv(env, key, fallback) { return env[key] || fallback; }

async function getCustomIPs(env) {
    let ips = getEnv(env, 'ADD', "");
    const addApi = getEnv(env, 'ADDAPI', "");
    const addCsv = getEnv(env, 'ADDCSV', "");
    
    if (addApi) {
        for (const url of addApi.split('\n').filter(u => u.trim())) {
            try { const r = await fetch(url.trim()); if (r.ok) ips += "\\n" + await r.text(); } catch(e){}
        }
    }
    if (addCsv) {
        for (const url of addCsv.split('\n').filter(u => u.trim())) {
            try { 
                const r = await fetch(url.trim()); 
                if (r.ok) {
                    const text = await r.text();
                    text.split('\\n').forEach(line => {
                        const p = line.split(',');
                        if (p.length >= 2) ips += \`\\n\${p[0].trim()}:443#\${p[1].trim()}\`;
                    });
                }
            } catch(e){}
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
        let [ip, port] = addr.trim().split(':');
        if (!port) port = "443";
        
        return hosts.map((h, i) => {
            const nName = \`\${name || 'Edge'}\${hosts.length > 1 ? '-N'+(i+1) : ''} \${ps}\`.trim();
            return \`\${PT_TYPE}://\${u}@\${ip}:\${port}?encryption=none&security=tls&sni=\${h}&alpn=h3&fp=random&allowInsecure=1&type=ws&host=\${h}&path=\${encodeURIComponent(finalPath)}#\${encodeURIComponent(nName)}\`;
        }).join('\\n');
    }).filter(Boolean).join('\\n');
}

export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const host = url.hostname;
            const _UUID = getEnv(env, 'UUID', UUID);
            const _WEB_PW = getEnv(env, 'WEB_PASSWORD', WEB_PASSWORD);
            const _SUB_PW = getEnv(env, 'SUB_PASSWORD', SUB_PASSWORD);
            const _PROXY_IP_RAW = env.PROXYIP || env.DEFAULT_PROXY_IP || DEFAULT_PROXY_IP;
            const _PROXY_IP = _PROXY_IP_RAW ? _PROXY_IP_RAW.split(/[\\n,]/)[0].trim() : "";
            const _PS = getEnv(env, 'PS', "");
            const _POOL_DOMAINS = getEnv(env, 'POOL_DOMAINS', host).split(',').map(d => d.trim()).filter(Boolean);

            // 1. 订阅分发 (KV 轮换)
            if ((_SUB_PW && url.pathname === \`/\${_SUB_PW}\`) || (url.pathname === '/sub' && url.searchParams.get('uuid') === _UUID)) {
                let idx = 0;
                if (env.POOL_STATE) {
                    const stored = await env.POOL_STATE.get('domain_index');
                    if (stored) idx = parseInt(stored, 10) || 0;
                    await env.POOL_STATE.put('domain_index', String((idx + 1) % _POOL_DOMAINS.length));
                }
                const activeDomain = _POOL_DOMAINS[idx % _POOL_DOMAINS.length];
                const allIPs = await getCustomIPs(env);
                const nodes = genNodes([activeDomain], _UUID, url.searchParams.get('proxyip') || _PROXY_IP, allIPs, _PS, _PROXY_IP);
                return new Response(btoa(unescape(encodeURIComponent(nodes))), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
            }

            // 2. 后台控制
            if (url.pathname.startsWith('/admin')) {
                if (_WEB_PW) {
                    const cookie = request.headers.get('Cookie') || "";
                    if (!cookie.includes(\`auth=\${_WEB_PW}\`)) return new Response(loginPage(), { headers: { 'Content-Type': 'text/html' } });
                }
                
                if (url.pathname === '/admin/switch') {
                    const idx = url.searchParams.get('index');
                    if (env.POOL_STATE && idx !== null) {
                        await env.POOL_STATE.put('domain_index', idx);
                        return new Response(JSON.stringify({ok: true}), { headers: { 'Content-Type': 'application/json' } });
                    }
                }

                let idx = 0;
                if (env.POOL_STATE) {
                    const stored = await env.POOL_STATE.get('domain_index');
                    idx = parseInt(stored, 10) || 0;
                }
                const allIPs = await getCustomIPs(env);
                const count = allIPs.split('\\n').filter(l => l.trim()).length;
                return new Response(dashPage(host, _UUID, _PROXY_IP, _SUB_PW, _POOL_DOMAINS, idx % _POOL_DOMAINS.length, count), { headers: { 'Content-Type': 'text/html' } });
            }

            if (url.pathname === '/') return Response.redirect(getEnv(env, 'ROOT_REDIRECT_URL', ROOT_REDIRECT_URL), 302);
            return new Response('Not Found', { status: 404 });
        } catch (e) { return new Response(e.stack, { status: 500 }); }
    }
};
