// =============================================================================
// 🟢 用户配置区域 (主账号: 订阅管理)
// =============================================================================
const UUID = "";             // 你的固定 UUID (若不使用动态模式)
const WEB_PASSWORD = "";      // 管理面板密码
const SUB_PASSWORD = "";      // 订阅路径密码
const DEFAULT_PROXY_IP = "";  // 默认 Proxy IP
const NODE_DEFAULT_PATH = "/api/v1"; 
const ROOT_REDIRECT_URL = "https://cn.bing.com"; 

const PT_TYPE = 'v' + 'l' + 'e' + 's' + 's';

// =============================================================================
// 🛠️ 核心逻辑工具
// =============================================================================
function getEnv(env, key, fallback) { return env[key] || fallback; }

async function getDynamicUUID(key, refresh = 86400) {
    const time = Math.floor(Date.now() / 1000 / refresh);
    const msg = new TextEncoder().encode(`${key}-${time}`);
    const hash = await crypto.subtle.digest('SHA-256', msg);
    const b = new Uint8Array(hash);
    return [...b.slice(0, 16)].map(n => n.toString(16).padStart(2, '0')).join('').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}

// =============================================================================
// 🎨 UI 组件与样式 (极致质感优化)
// =============================================================================
const COMMON_STYLE = `
    :root {
        --primary: #6366f1;
        --primary-hover: #4f46e5;
        --bg-body: #f8fafc;
        --bg-card: rgba(255, 255, 255, 0.8);
        --text-main: #1e293b;
        --text-muted: #64748b;
        --border-color: #e2e8f0;
        --success: #10b981;
        --danger: #ef4444;
        --shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        --radius: 12px;
    }
    [data-theme="dark"] {
        --bg-body: #0f172a;
        --bg-card: rgba(30, 41, 59, 0.7);
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-color: #334155;
        --shadow: 0 20px 25px -5px rgba(0,0,0,0.3);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.2s ease; }
    body {
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        background: var(--bg-body);
        color: var(--text-main);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-image: radial-gradient(circle at 2px 2px, var(--border-color) 1px, transparent 0);
        background-size: 32px 32px;
    }
    .blur-card {
        background: var(--bg-card);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--border-color);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    .btn {
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); }
    .btn-outline:hover { background: var(--border-color); }
    
    input {
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        background: var(--bg-body);
        color: var(--text-main);
        outline: none;
        width: 100%;
    }
    input:focus { border-color: var(--primary); ring: 2px var(--primary); }
    
    .status-badge {
        padding: 2px 8px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
    }
    .badge-active { background: #dcfce7; color: #166534; }
    .badge-idle { background: #f1f5f9; color: #475569; }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    .error-shake { animation: shake 0.2s ease-in-out 0s 2; }
`;

const THEME_SCRIPT = `
    <script>
        const getTheme = () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const setTheme = (t) => {
            document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem('theme', t);
        };
        setTheme(getTheme());
    </script>
`;

function loginPage() {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Secure Access</title><style>${COMMON_STYLE}</style>${THEME_SCRIPT}</head><body>
    <div style="margin-top: 15vh; width: 100%; max-width: 400px; padding: 20px;">
        <div class="blur-card" id="loginCard" style="padding: 40px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 20px;">🛡️</div>
            <h2 style="margin-bottom: 8px;">身份验证</h2>
            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 30px;">请输入管理员密钥以访问控制面板</p>
            <input type="password" id="pw" placeholder="Security Token" style="text-align: center; margin-bottom: 20px;" onkeypress="if(event.key==='Enter')login()">
            <button class="btn btn-primary" onclick="login()" style="width: 100%; justify-content: center;">立即进入</button>
        </div>
    </div>
    <script>
        function login() {
            const pw = document.getElementById('pw').value;
            if(!pw) {
                document.getElementById('loginCard').classList.add('error-shake');
                setTimeout(() => document.getElementById('loginCard').classList.remove('error-shake'), 400);
                return;
            }
            document.cookie = "auth=" + pw + "; path=/; Max-Age=31536000";
            location.reload();
        }
    </script>
    </body></html>`;
}

function dashPage(host, uuid, proxyip, subpass, poolDomains = [], activeIndex = 0, nodeCount = 0) {
    const domainsJson = JSON.stringify(poolDomains);
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Edge Dashboard</title><style>${COMMON_STYLE}</style>${THEME_SCRIPT}</head><body>
    <div style="width: 100%; max-width: 900px; padding: 40px 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
            <div>
                <h1 style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">边缘调度控制台</h1>
                <p style="color: var(--text-muted); font-size: 14px;">Node Management & Domain Steering</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" onclick="setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')">🌓</button>
                <button class="btn btn-outline" onclick="logout()">退出</button>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="blur-card" style="padding: 20px;">
                <p style="color: var(--text-muted); font-size: 12px; font-weight: 600;">域名池规模</p>
                <h2 style="font-size: 28px;">${poolDomains.length}</h2>
            </div>
            <div class="blur-card" style="padding: 20px; border-left: 4px solid var(--primary);">
                <p style="color: var(--text-muted); font-size: 12px; font-weight: 600;">当前活跃索引</p>
                <h2 style="font-size: 28px; color: var(--primary);">#${activeIndex}</h2>
            </div>
            <div class="blur-card" style="padding: 20px;">
                <p style="color: var(--text-muted); font-size: 12px; font-weight: 600;">后端节点总数</p>
                <h2 style="font-size: 28px;">${nodeCount}</h2>
            </div>
        </div>

        <div class="blur-card" style="padding: 30px; margin-bottom: 30px;">
            <h3 style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">🔗 订阅分发配置</h3>
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <div>
                    <label style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px; display: block;">动态分发地址 (自动轮换域名)</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="subLink" value="https://${host}/${subpass}" readonly style="background: var(--border-color); cursor: pointer;" onclick="copyVal('subLink')">
                        <button class="btn btn-primary" onclick="copyVal('subLink')">复制</button>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <label style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px; display: block;">自定义 ProxyIP (覆盖全局)</label>
                        <input type="text" id="customIP" value="${proxyip}" placeholder="例如: cf.proxy.com" oninput="updatePreview()">
                    </div>
                    <div>
                        <label style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px; display: block;">预览与测试</label>
                        <button class="btn btn-outline" style="width: 100%;" onclick="window.open(document.getElementById('subLink').value)">🚀 打开订阅链接</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="blur-card" style="padding: 30px;">
            <h3 style="margin-bottom: 20px;">🗺️ 域名轮换池状态</h3>
            <div id="domainContainer" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;"></div>
            
            <div style="background: var(--bg-body); padding: 20px; border-radius: 8px; display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 14px; color: var(--text-muted);">手动强制切换:</span>
                <input type="number" id="targetIdx" placeholder="索引号" style="width: 80px;" min="0" max="${poolDomains.length - 1}">
                <button class="btn btn-primary" onclick="switchDomain()">立即执行切换</button>
            </div>
        </div>
    </div>

    <div id="toast" style="position: fixed; bottom: 30px; transform: translateY(100px); background: var(--text-main); color: var(--bg-body); padding: 12px 24px; border-radius: 30px; font-weight: 600; font-size: 14px; box-shadow: var(--shadow);"></div>

    <script>
        const domains = ${domainsJson};
        const activeIdx = ${activeIndex};
        const subPass = "${subpass}";

        function renderDomains() {
            const container = document.getElementById('domainContainer');
            container.innerHTML = domains.map((d, i) => \`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-radius: 8px; background: \${i === activeIdx ? 'var(--primary)' : 'transparent'}; border: 1px solid \${i === activeIdx ? 'var(--primary)' : 'var(--border-color)'}; color: \${i === activeIdx ? 'white' : 'var(--text-main)'}">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="opacity: 0.6; font-family: monospace;">[\${i}]</span>
                        <span style="font-weight: 600;">\${d}</span>
                    </div>
                    <span class="status-badge \${i === activeIdx ? 'badge-active' : 'badge-idle'}">\${i === activeIdx ? 'Active' : 'Standby'}</span>
                </div>
            \`).join('');
        }

        function updatePreview() {
            const ip = document.getElementById('customIP').value.trim();
            const base = "https://" + window.location.hostname + "/" + subPass;
            document.getElementById('subLink').value = ip ? base + "?proxyip=" + ip : base;
        }

        function showToast(msg) {
            const t = document.getElementById('toast');
            t.innerText = msg;
            t.style.transform = "translateY(0)";
            setTimeout(() => t.style.transform = "translateY(100px)", 3000);
        }

        function copyVal(id) {
            const el = document.getElementById(id);
            navigator.clipboard.writeText(el.value);
            showToast("✅ 已复制到剪贴板");
        }

        async function switchDomain() {
            const idx = document.getElementById('targetIdx').value;
            if(idx === "") return;
            const res = await fetch('/admin/switch?index=' + idx);
            if(res.ok) {
                showToast("⚡ 指令已下发，正在重载...");
                setTimeout(() => location.reload(), 1000);
            }
        }

        function logout() {
            document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            location.reload();
        }

        renderDomains();
    </script>
    </body></html>`;
}

// =============================================================================
// 🟢 订阅与节点生成逻辑
// =============================================================================
async function getCustomIPs(env) {
    let ips = getEnv(env, 'ADD', "");
    const addApi = getEnv(env, 'ADDAPI', "");
    const addCsv = getEnv(env, 'ADDCSV', "");
    
    const fetchText = async (url) => {
        try {
            const res = await fetch(url.trim(), { headers: { 'User-Agent': 'Mozilla/5.0' }, method: 'GET' });
            return res.ok ? await res.text() : "";
        } catch (e) { return ""; }
    };

    if (addApi) {
        for (const url of addApi.split('\n').filter(u => u.trim())) {
            ips += "\n" + await fetchText(url);
        }
    }
    
    if (addCsv) {
        for (const url of addCsv.split('\n').filter(u => u.trim())) {
            const text = await fetchText(url);
            text.split('\n').forEach(line => {
                const parts = line.split(',');
                if (parts.length >= 2) ips += `\n${parts[0].trim()}:443#${parts[1].trim()}`;
            });
        }
    }
    return ips;
}

function genNodes(hostsArray, u, p, ipsText, ps = "", defaultIP = "") {
    const lines = ipsText.split('\n').filter(l => l.trim());
    const safeP = p ? p.trim() : "";
    const finalPath = (safeP && safeP !== defaultIP) ? `${NODE_DEFAULT_PATH}?proxyip=${safeP}` : NODE_DEFAULT_PATH;
    const encodedPath = encodeURIComponent(finalPath);
    
    return lines.map(L => {
        const [addr, name] = L.split('#');
        if (!addr) return null;
        
        let ip = addr.trim(), port = "443";
        if (ip.includes(']:')) [ip, port] = ip.split(']:').map((v, i) => i === 0 ? v + ']' : v);
        else if (ip.includes(':') && !ip.includes('[')) [ip, port] = ip.split(':');

        return hostsArray.map((h, hostIdx) => {
            const nodeName = `${name || 'Edge'}${hostsArray.length > 1 ? '-N' + (hostIdx + 1) : ''} ${ps}`.trim();
            return `${PT_TYPE}://${u}@${ip}:${port}?encryption=none&security=tls&sni=${h}&alpn=h3&fp=random&allowInsecure=1&type=ws&host=${h}&path=${encodedPath}#${encodeURIComponent(nodeName)}`;
        }).join('\n');
    }).filter(Boolean).join('\n');
}

// =============================================================================
// 🚀 Fetch Handler
// =============================================================================
export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const host = url.hostname;

            // 变量解析
            const _UUID = env.KEY ? await getDynamicUUID(env.KEY) : getEnv(env, 'UUID', UUID);
            const _WEB_PW = getEnv(env, 'WEB_PASSWORD', WEB_PASSWORD);
            const _SUB_PW = getEnv(env, 'SUB_PASSWORD', SUB_PASSWORD);
            const _PROXY_IP_RAW = env.PROXYIP || env.DEFAULT_PROXY_IP || DEFAULT_PROXY_IP;
            const _PROXY_IP = _PROXY_IP_RAW ? _PROXY_IP_RAW.split(/[,\n]/)[0].trim() : "";
            const _PS = getEnv(env, 'PS', "");
            const _POOL_DOMAINS = getEnv(env, 'POOL_DOMAINS', host).split(',').map(d => d.trim()).filter(Boolean);

            // 1. 订阅下发逻辑
            if ((_SUB_PW && url.pathname === `/${_SUB_PW}`) || (url.pathname === '/sub' && url.searchParams.get('uuid') === _UUID)) {
                let currentIndex = 0;
                if (env.POOL_STATE) {
                    const stored = await env.POOL_STATE.get('domain_index');
                    if (stored !== null) currentIndex = parseInt(stored, 10) || 0;
                    // 自动轮换：每次请求后索引 +1
                    await env.POOL_STATE.put('domain_index', String((currentIndex + 1) % _POOL_DOMAINS.length));
                }
                const activeDomain = _POOL_DOMAINS[currentIndex % _POOL_DOMAINS.length];
                const requestProxyIp = url.searchParams.get('proxyip') || _PROXY_IP;
                const allIPs = await getCustomIPs(env);
                const listText = genNodes([activeDomain], _UUID, requestProxyIp, allIPs, _PS, _PROXY_IP);
                
                return new Response(btoa(unescape(encodeURIComponent(listText))), {
                    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
                });
            }

            // 2. 管理面板
            if (url.pathname.startsWith('/admin')) {
                // 鉴权
                if (_WEB_PW) {
                    const cookie = request.headers.get('Cookie') || "";
                    if (!cookie.includes(`auth=${_WEB_PW}`)) return new Response(loginPage(), { headers: { 'Content-Type': 'text/html' } });
                }

                // 强制切换接口
                if (url.pathname === '/admin/switch') {
                    const idx = parseInt(url.searchParams.get('index'), 10);
                    if (!isNaN(idx) && env.POOL_STATE) {
                        await env.POOL_STATE.put('domain_index', String(idx));
                        return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
                    }
                    return new Response('KV NOT FOUND', { status: 500 });
                }

                // 面板主页
                let currentIndex = 0;
                if (env.POOL_STATE) {
                    const stored = await env.POOL_STATE.get('domain_index');
                    currentIndex = parseInt(stored, 10) || 0;
                }
                const allIPs = await getCustomIPs(env);
                const nodeCount = allIPs.split('\n').filter(l => l.trim()).length;
                return new Response(dashPage(host, _UUID, _PROXY_IP, _SUB_PW, _POOL_DOMAINS, currentIndex % _POOL_DOMAINS.length, nodeCount), {
                    headers: { 'Content-Type': 'text/html' }
                });
            }

            // 3. 探针与重定向
            if (url.pathname === NODE_DEFAULT_PATH) return new Response(JSON.stringify({ status: "ready" }), { headers: { 'Content-Type': 'application/json' } });
            if (url.pathname === '/') return Response.redirect(getEnv(env, 'ROOT_REDIRECT_URL', ROOT_REDIRECT_URL), 302);

            return new Response('Not Found', { status: 404 });

        } catch (err) {
            return new Response(err.stack, { status: 500 });
        }
    }
};
