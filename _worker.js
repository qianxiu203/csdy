// =============================================================================
// 🟢 用户配置区域 (主账号: 订阅管理)
// =============================================================================
const UUID = ""; // 你的 UUID
const WEB_PASSWORD = "";  // 管理面板密码
const SUB_PASSWORD = "";  // 订阅路径密码
const DEFAULT_PROXY_IP = ""; 
const NODE_DEFAULT_PATH = "/api/v1"; 
const ROOT_REDIRECT_URL = "https://cn.bing.com"; 

const PT_TYPE = 'v'+'l'+'e'+'s'+'s';

function getEnv(env, key, fallback) { return env[key] || fallback; }

async function getDynamicUUID(key, refresh = 86400) {
    const time = Math.floor(Date.now() / 1000 / refresh);
    const msg = new TextEncoder().encode(`${key}-${time}`);
    const hash = await crypto.subtle.digest('SHA-256', msg);
    const b = new Uint8Array(hash);
    return [...b.slice(0, 16)].map(n => n.toString(16).padStart(2, '0')).join('').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}

// =============================================================================
// 🎨 面板 UI 代码
// =============================================================================
const COMMON_STYLE = `
    :root {
        /* 白天模式 (默认) */
        --bg-body: #f0f4f8;
        --bg-card: #ffffff;
        --primary: #1349ec;
        --primary-hover: #0f3bc0;
        --text-main: #334155;
        --text-muted: #64748b;
        --border-color: #e2e8f0;
        --success: #10b981;
        --danger: #ef4444;
        --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        --radius: 12px;
    }
    [data-theme="dark"] {
        /* 黑夜模式 */
        --bg-body: #0f172a;
        --bg-card: #1e293b;
        --primary: #3b82f6; /* 暗黑模式下使用更亮的蓝以保证对比度 */
        --primary-hover: #2563eb;
        --text-main: #f8fafc;
        --text-muted: #94a3b8;
        --border-color: #334155;
        --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        font-family: system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
        background-color: var(--bg-body);
        color: var(--text-main);
        line-height: 1.5;
        transition: background-color 0.3s ease, color 0.3s ease;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .wrapper { width: 100%; max-width: 800px; padding: 2rem 1.5rem; margin: auto; }
    .card {
        background: var(--bg-card);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        border: 1px solid var(--border-color);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
    }
    .btn {
        background: var(--primary); color: #ffffff;
        border: none; border-radius: 8px; padding: 10px 18px;
        font-size: 0.9rem; font-weight: 500; cursor: pointer;
        transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
    }
    .btn:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-ghost { background: transparent; color: var(--text-main); border: 1px solid var(--border-color); }
    .btn-ghost:hover { background: var(--border-color); }
    .btn-danger { background: transparent; color: var(--danger); border: 1px solid var(--danger); }
    .btn-danger:hover { background: var(--danger); color: #ffffff; }
    .btn-icon { padding: 8px; border-radius: 8px; background: transparent; border: 1px solid var(--border-color); color: var(--text-main); cursor: pointer; transition: 0.2s; }
    .btn-icon:hover { background: var(--border-color); }
    input {
        width: 100%; padding: 12px 14px; background: var(--bg-body);
        border: 1px solid var(--border-color); border-radius: 8px;
        color: var(--text-main); font-family: inherit; font-size: 0.95rem;
        transition: all 0.2s; outline: none;
    }
    input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(19, 73, 236, 0.15); }
    input::placeholder { color: var(--text-muted); }
    .text-muted { color: var(--text-muted); font-size: 0.85rem; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px; }
    .dot-active { background-color: var(--success); box-shadow: 0 0 8px var(--success); }
    .dot-error { background-color: var(--danger); box-shadow: 0 0 8px var(--danger); }
    .dot-idle { background-color: var(--text-muted); }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    #toast {
        position: fixed; bottom: 30px; right: 30px;
        background: var(--text-main); color: var(--bg-body);
        padding: 12px 24px; border-radius: 8px; font-size: 0.9rem; font-weight: 500;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        transform: translateY(100px); opacity: 0; transition: all 0.3s; z-index: 999;
    }
    #toast.show { transform: translateY(0); opacity: 1; }
    /* 主题图标切换逻辑 */
    .icon-moon { display: none; }
    .icon-sun { display: block; }
    [data-theme="dark"] .icon-moon { display: block; }
    [data-theme="dark"] .icon-sun { display: none; }
`;

// 提取防止闪烁的初始化脚本
const THEME_SCRIPT = `
    <script>
        (function() {
            const saved = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (saved === 'dark' || (!saved && prefersDark)) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        })();
        function toggleTheme() {
            const html = document.documentElement;
            const isDark = html.getAttribute('data-theme') === 'dark';
            html.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        }
    </script>
`;

function loginPage() {
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>系统登录</title><style>${COMMON_STYLE}</style>${THEME_SCRIPT}</head><body>
    <div class="wrapper" style="display:flex; justify-content:center; align-items:center; min-height:100vh;">
        <div class="card" style="width:100%; max-width:400px; padding:2.5rem 2rem; text-align:center;">
            <div style="margin-bottom:2rem;">
                <div style="width:48px; height:48px; background:var(--primary); border-radius:12px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:1rem;">
                    <svg width="24" height="24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h2 style="font-size:1.4rem; font-weight:600; color:var(--text-main); margin-bottom:4px;">控制台访问</h2>
                <div class="text-muted">请输入管理员凭证以继续</div>
            </div>
            <div style="margin-bottom:1.5rem; text-align:left;">
                <input type="password" id="pwd" placeholder="输入访问密码..." onkeypress="if(event.keyCode===13)verify()">
            </div>
            <button class="btn" style="width:100%; justify-content:center; padding:12px;" onclick="verify()">立即登录</button>
        </div>
    </div>
    <script>function verify(){const p=document.getElementById("pwd").value;if(!p)return;document.cookie="auth="+p+"; path=/; Max-Age=31536000";location.reload()}</script>
    </body></html>`;
}
function dashPage(host, uuid, proxyip, subpass, poolDomains = [], activeIndex = 0, nodeCount = 0) {
    const defaultSubLink = `https://${host}/${subpass}`;
    const domainsJson = JSON.stringify(poolDomains);
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>管理面板</title><style>${COMMON_STYLE}</style>${THEME_SCRIPT}</head><body>
    <div class="wrapper">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
            <div>
                <h1 style="font-size:1.5rem; font-weight:600; color:var(--text-main);">边缘节点调度</h1>
                <div class="text-muted" style="font-family:monospace; margin-top:2px;">${host}</div>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn-icon" onclick="toggleTheme()" title="切换主题">
                    <svg class="icon-sun" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    <svg class="icon-moon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </button>
                <button class="btn btn-ghost" onclick="logout()" style="padding:8px 14px;">退出</button>
            </div>
        </div>

        <div class="grid-3">
            <div class="card" style="margin-bottom:0; padding:1.2rem;">
                <div class="text-muted" style="margin-bottom:8px;">配置域名总数</div>
                <div style="font-size:1.8rem; font-weight:600; color:var(--text-main);">${poolDomains.length}</div>
            </div>
            <div class="card" style="margin-bottom:0; padding:1.2rem; border-top: 3px solid var(--primary);">
                <div class="text-muted" style="margin-bottom:8px;">当前活跃索引</div>
                <div style="font-size:1.8rem; font-weight:600; color:var(--primary);">${activeIndex}</div>
            </div>
            <div class="card" style="margin-bottom:0; padding:1.2rem;">
                <div class="text-muted" style="margin-bottom:8px;">可用 IP 条目</div>
                <div style="font-size:1.8rem; font-weight:600; color:var(--text-main); display:flex; align-items:center; gap:8px;">
                    ${nodeCount} <span style="font-size:0.8rem; color:var(--success); font-weight:normal;">↑ 稳定</span>
                </div>
            </div>
        </div>

        <div class="card">
            <h3 style="font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center;"><span class="status-dot dot-active"></span> 订阅分发配置</h3>
            <div style="display:flex; gap:12px; margin-bottom:1rem;">
                <input type="text" id="subLink" value="${defaultSubLink}" readonly>
                <button class="btn" onclick="copyVal('subLink')" style="white-space:nowrap;">一键复制</button>
            </div>
            <div style="display:flex; gap:12px; align-items:center;">
                <input type="text" id="customIP" value="${proxyip}" placeholder="临时 ProxyIP 覆盖 (例: 1.1.1.1，留空使用默认设置)">
                <button class="btn btn-ghost" onclick="updateLink()" style="white-space:nowrap;">更新链接</button>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 3fr 2fr; gap:1.5rem;">
            <div class="card">
                <h3 style="font-size:1.1rem; margin-bottom:1rem;">域名池调度</h3>
                <div id="domainList" style="margin-bottom:1.5rem; background:var(--bg-body); border-radius:8px; padding:10px; border:1px solid var(--border-color);"></div>
                <div class="text-muted" style="margin-bottom:8px;">手动干预轮换状态：</div>
                <div style="display:flex; gap:10px;">
                    <input type="number" id="switchIndex" placeholder="目标索引 (0~${poolDomains.length - 1})" min="0" max="${poolDomains.length - 1}">
                    <button class="btn" onclick="switchDomain()" style="white-space:nowrap;">强制切换</button>
                    <button class="btn btn-danger" onclick="resetDomain()" style="white-space:nowrap;">重置设置</button>
                </div>
            </div>

            <div class="card">
                <h3 style="font-size:1.1rem; margin-bottom:1rem;">系统参数</h3>
                <div style="margin-bottom:1.2rem;">
                    <div class="text-muted" style="margin-bottom:4px;">通讯 UUID</div>
                    <div style="font-family:monospace; background:var(--bg-body); padding:8px; border-radius:6px; border:1px solid var(--border-color); font-size:0.9rem;">${uuid.substring(0,8)}········</div>
                </div>
                <div>
                    <div class="text-muted" style="margin-bottom:4px;">当前活动端点</div>
                    <div style="font-family:monospace; background:var(--bg-body); padding:8px; border-radius:6px; border:1px solid var(--border-color); font-size:0.9rem; color:var(--primary); word-break:break-all;">${poolDomains[activeIndex] || host}</div>
                </div>
            </div>
        </div>
    </div>
    <div id="toast"></div>
    <script>
    const domains = ${domainsJson};
    const activeIdx = ${activeIndex};
    function renderDomains(){
        const el = document.getElementById('domainList');
        el.innerHTML = domains.map((d,i) => \`
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-bottom:1px solid var(--border-color); \${i === domains.length-1 ? 'border:none;' : ''}">
                <div style="font-family:monospace; font-size:0.9rem; color:\${i===activeIdx ? 'var(--primary)' : 'var(--text-main)'}; font-weight:\${i===activeIdx ? '600' : 'normal'};">[\${i}] \${d}</div>
                <div>
                    \${i===activeIdx ? '<span class="status-dot dot-active"></span><span style="font-size:0.8rem;color:var(--success);">服务中</span>' : '<span class="status-dot dot-idle"></span><span class="text-muted">挂起</span>'}
                </div>
            </div>
        \`).join('');
    }
    function showToast(m){const t=document.getElementById('toast');t.innerText=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}
    function copyVal(id){const el=document.getElementById(id);el.select();navigator.clipboard.writeText(el.value).then(()=>showToast('已复制到剪贴板'))}
    function updateLink(){
        const ip=document.getElementById('customIP').value.trim();
        const u="https://"+window.location.hostname+"/${subpass}";
        document.getElementById('subLink').value = ip ? u+"?proxyip="+ip : u;
        showToast('链接参数已更新');
    }
    function switchDomain(){
        const v = parseInt(document.getElementById('switchIndex').value);
        if(isNaN(v)||v<0||v>=domains.length){showToast('请输入有效的索引区间');return;}
        fetch('/admin/switch?index='+v).then(r=>r.json()).then(d=>{if(d.ok){showToast('切换指令已下发');setTimeout(()=>location.reload(),800)}});
    }
    function resetDomain(){
        fetch('/admin/switch?index=0').then(r=>r.json()).then(d=>{if(d.ok){showToast('已重置为初始配置');setTimeout(()=>location.reload(),800)}});
    }
    function logout(){document.cookie="auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";location.reload()}
    renderDomains();
    </script></body></html>`;
}

// =============================================================================
// 🟢 订阅处理逻辑
// =============================================================================
function isSubPath(pw, url) { return pw && url.pathname === `/${pw}`; }
function isNormalSub(uuid, url) { return url.pathname === '/sub' && url.searchParams.get('uuid') === uuid; }

async function getCustomIPs(env) {
    let ips = getEnv(env, 'ADD', "");
    const addApi = getEnv(env, 'ADDAPI', "");
    const addCsv = getEnv(env, 'ADDCSV', "");
    
    if (addApi) {
        const urls = addApi.split('\n').filter(u => u.trim() !== "");
        for (const url of urls) {
            try { const res = await fetch(url.trim(), { headers: { 'User-Agent': 'Mozilla/5.0' } }); if (res.ok) { const text = await res.text(); ips += "\n" + text; } } catch (e) {}
        }
    }
    
    if (addCsv) {
        const urls = addCsv.split('\n').filter(u => u.trim() !== "");
        for (const url of urls) {
            try { const res = await fetch(url.trim(), { headers: { 'User-Agent': 'Mozilla/5.0' } }); if (res.ok) { const text = await res.text(); const lines = text.split('\n'); for (let line of lines) { const parts = line.split(','); if (parts.length >= 2) ips += `\n${parts[0].trim()}:443#${parts[1].trim()}`; } } } catch (e) {}
        }
    }
    return ips;
}

function genNodes(hostsArray, u, p, ipsText, ps = "", defaultIP = "") {
    let l = ipsText.split('\n').filter(line => line.trim() !== "");
    let safeP = p ? p.trim() : "";
    let safeDef = defaultIP ? defaultIP.trim() : "";
    
    let finalPath = NODE_DEFAULT_PATH;
    if (safeP && safeP !== "" && safeP !== safeDef) {
        finalPath += `?proxyip=${safeP}`;
    }
    
    const encodedPath = encodeURIComponent(finalPath);
    let nodes = [];

    l.forEach((L) => {
        const [a, n] = L.split('#'); 
        if (!a) return;
        const I = a.trim(); 
        
        let i = I, pt = "443"; 
        if (I.includes(']:')) { 
            const s = I.split(']:'); i = s[0] + ']'; pt = s[1];
        } else if (I.includes(':') && !I.includes('[')) { 
            const s = I.split(':'); i = s[0]; pt = s[1];
        }

        hostsArray.forEach((h, hostIndex) => {
            let baseName = n ? n.trim() : 'Edge-Instance';
            let N = hostsArray.length > 1 ? `${baseName}-Node${hostIndex + 1}` : baseName;
            if (ps) N = `${N} ${ps}`;
            
            nodes.push(`${PT_TYPE}://${u}@${i}:${pt}?encryption=none&security=tls&sni=${h}&alpn=h3&fp=random&allowInsecure=1&type=ws&host=${h}&path=${encodedPath}#${encodeURIComponent(N)}`);
        });
    });

    return nodes.join('\n');
}

export default {
  async fetch(r, env, ctx) {
    try {
      const url = new URL(r.url);
      const host = url.hostname; 

      const _UUID = env.KEY ? await getDynamicUUID(env.KEY) : getEnv(env, 'UUID', UUID);
      const _WEB_PW = getEnv(env, 'WEB_PASSWORD', WEB_PASSWORD);
      const _SUB_PW = getEnv(env, 'SUB_PASSWORD', SUB_PASSWORD);
      const _PROXY_IP_RAW = env.PROXYIP || env.DEFAULT_PROXY_IP || DEFAULT_PROXY_IP;
      const _PS = getEnv(env, 'PS', ""); 
      const _PROXY_IP = _PROXY_IP_RAW ? _PROXY_IP_RAW.split(/[,\n]/)[0].trim() : "";
      
      const rawDomains = getEnv(env, 'POOL_DOMAINS', host);
      const _POOL_DOMAINS = rawDomains.split(',').map(d => d.trim()).filter(Boolean);

      let _ROOT_REDIRECT = getEnv(env, 'ROOT_REDIRECT_URL', ROOT_REDIRECT_URL);
      if (!_ROOT_REDIRECT.includes('://')) _ROOT_REDIRECT = 'https://' + _ROOT_REDIRECT;

      // 1. 订阅下发 (KV 域名轮换逻辑)
      if (isSubPath(_SUB_PW, url) || isNormalSub(_UUID, url)) {
          const requestProxyIp = url.searchParams.get('proxyip') || _PROXY_IP;
          const allIPs = await getCustomIPs(env);

          // 读取当前域名索引
          let currentIndex = 0;
          if (env.POOL_STATE) {
              const stored = await env.POOL_STATE.get('domain_index');
              if (stored !== null) currentIndex = parseInt(stored, 10) || 0;
          }
          currentIndex = currentIndex % _POOL_DOMAINS.length;

          // 取单个域名生成节点
          const activeDomain = _POOL_DOMAINS[currentIndex];

          // 索引 +1 写回 KV
          if (env.POOL_STATE) {
              const nextIndex = (currentIndex + 1) % _POOL_DOMAINS.length;
              await env.POOL_STATE.put('domain_index', String(nextIndex));
          }

          const listText = genNodes([activeDomain], _UUID, requestProxyIp, allIPs, _PS, _PROXY_IP);
          return new Response(btoa(unescape(encodeURIComponent(listText))), { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }

      // 2. 根目录重定向
      if (url.pathname === '/') return Response.redirect(_ROOT_REDIRECT, 302);
      
      // 3. 后台管理面板
      if (url.pathname === '/admin' || url.pathname === '/admin/') {
          if (_WEB_PW) {
              const cookie = r.headers.get('Cookie') || "";
              if (!cookie.includes(`auth=${_WEB_PW}`)) return new Response(loginPage(), { status: 200, headers: {'Content-Type': 'text/html'} });
          }
          // 读取当前索引和节点数用于面板展示
          let currentIndex = 0;
          if (env.POOL_STATE) {
              const stored = await env.POOL_STATE.get('domain_index');
              if (stored !== null) currentIndex = parseInt(stored, 10) || 0;
          }
          currentIndex = currentIndex % _POOL_DOMAINS.length;
          const allIPs = await getCustomIPs(env);
          const nodeCount = allIPs.split('\n').filter(l => l.trim() !== "").length;
          return new Response(dashPage(host, _UUID, _PROXY_IP, _SUB_PW, _POOL_DOMAINS, currentIndex, nodeCount), { status: 200, headers: {'Content-Type': 'text/html'} });
      }

      // 4. 手动切换域名接口 (Dashboard 新增)
      if (url.pathname === '/admin/switch') {
          if (_WEB_PW) {
              const cookie = r.headers.get('Cookie') || "";
              if (!cookie.includes(`auth=${_WEB_PW}`)) return new Response(JSON.stringify({ok: false}), { status: 403 });
          }
          const idx = parseInt(url.searchParams.get('index'), 10);
          if (!isNaN(idx) && idx >= 0 && idx < _POOL_DOMAINS.length && env.POOL_STATE) {
              await env.POOL_STATE.put('domain_index', String(idx));
              return new Response(JSON.stringify({ok: true}), { status: 200, headers: {'Content-Type': 'application/json'} });
          }
          return new Response(JSON.stringify({ok: false}), { status: 400 });
      }

      // 5. 伪装 API 探针响应
      if (url.pathname === NODE_DEFAULT_PATH) {
          return new Response(JSON.stringify({ status: "ok", version: "1.0.0" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 6. 兜底处理
      return new Response('Not Found', { status: 404 });

    } catch (err) {
      return new Response(err.toString(), { status: 500 });
    }
  }
};
