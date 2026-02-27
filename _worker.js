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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
        --glass-bg: rgba(255,255,255,0.08);
        --glass-border: rgba(255,255,255,0.15);
        --glass-shadow: rgba(0,0,0,0.3);
        --accent: #10b981;
        --accent-hover: #059669;
        --danger: #ef4444;
        --text-primary: #f1f5f9;
        --text-secondary: #94a3b8;
        --card-radius: 16px;
    }
    body {
        font-family: 'Inter', sans-serif;
        min-height: 100vh;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        background-attachment: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        color: var(--text-primary);
    }
    body::before {
        content: '';
        position: fixed;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.08) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 50%);
        pointer-events: none;
        z-index: 0;
    }
    .glass-card {
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--card-radius);
        box-shadow: 0 25px 50px var(--glass-shadow);
        position: relative;
        z-index: 1;
    }
    .btn {
        background: var(--accent);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
        letter-spacing: 0.3px;
    }
    .btn:hover { background: var(--accent-hover); transform: translateY(-1px); }
    .btn:active { transform: translateY(0); }
    .btn-ghost {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
    }
    .btn-ghost:hover { background: rgba(255,255,255,0.15); }
    .btn-danger { background: var(--danger); }
    .btn-danger:hover { background: #dc2626; }
    input {
        width: 100%;
        padding: 10px 14px;
        background: rgba(255,255,255,0.06);
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        color: var(--text-primary);
        font-family: inherit;
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s;
    }
    input:focus { border-color: var(--accent); }
    input::placeholder { color: var(--text-secondary); }
    .label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.8px;
        margin-bottom: 6px;
    }
    #toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: rgba(15,23,42,0.9);
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
        padding: 12px 20px;
        border-radius: 10px;
        font-size: 0.85rem;
        font-weight: 500;
        transform: translateY(80px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        z-index: 999;
    }
    #toast.show { transform: translateY(0); opacity: 1; }
`;

function loginPage() {
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Login</title><style>${COMMON_STYLE}</style></head><body>
    <div class="glass-card" style="width:100%;max-width:380px;padding:2.5rem;">
        <div style="text-align:center;margin-bottom:2rem;">
            <div style="width:48px;height:48px;background:linear-gradient(135deg,#10b981,#059669);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem;">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div style="font-size:1.4rem;font-weight:700;margin-bottom:4px;">Control Panel</div>
            <div style="color:var(--text-secondary);font-size:0.85rem;">Enter your password to continue</div>
        </div>
        <div style="margin-bottom:1rem;">
            <div class="label">Password</div>
            <input type="password" id="pwd" placeholder="••••••••" onkeypress="if(event.keyCode===13)verify()">
        </div>
        <button class="btn" style="width:100%;padding:12px;" onclick="verify()">Sign In</button>
    </div>
    <script>function verify(){const p=document.getElementById("pwd").value;if(!p)return;document.cookie="auth="+p+"; path=/; Max-Age=31536000";location.reload()}</script>
    </body></html>`;
}

function dashPage(host, uuid, proxyip, subpass, poolDomains = [], activeIndex = 0, nodeCount = 0) {
    const defaultSubLink = `https://${host}/${subpass}`;
    const domainsJson = JSON.stringify(poolDomains);
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Dashboard</title><style>${COMMON_STYLE}
    .section { margin-bottom: 1.5rem; }
    .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 1.5rem; }
    .info-box { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 10px; padding: 14px; }
    .info-val { font-size: 0.95rem; font-weight: 600; margin-top: 4px; font-family: monospace; }
    .sub-box { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 10px; padding: 16px; margin-bottom: 1.5rem; }
    .domain-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; margin-bottom: 8px; background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border); font-size: 0.85rem; font-family: monospace; transition: background 0.2s; }
    .domain-item.active { background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.4); }
    .badge { font-size: 0.7rem; padding: 2px 8px; border-radius: 20px; font-weight: 600; font-family: sans-serif; }
    .badge-active { background: rgba(16,185,129,0.2); color: #10b981; }
    .badge-idle { background: rgba(148,163,184,0.15); color: var(--text-secondary); }
    .stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 1.5rem; }
    .stat-box { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 10px; padding: 14px; text-align: center; }
    .stat-val { font-size: 1.6rem; font-weight: 700; color: var(--accent); }
    .stat-label { font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
    .divider { height: 1px; background: var(--glass-border); margin: 1.5rem 0; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .section-title { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
    </style></head><body>
    <div class="glass-card" style="width:100%;max-width:620px;padding:2rem;">
        <div class="header">
            <div>
                <div style="font-size:1.4rem;font-weight:700;">Dashboard</div>
                <div style="color:var(--text-secondary);font-size:0.82rem;margin-top:2px;">${host}</div>
            </div>
            <button class="btn btn-ghost" onclick="logout()" style="padding:8px 14px;font-size:0.82rem;">Sign Out</button>
        </div>

        <div class="stat-grid">
            <div class="stat-box">
                <div class="stat-val">${poolDomains.length}</div>
                <div class="stat-label">Total Nodes</div>
            </div>
            <div class="stat-box">
                <div class="stat-val" style="color:#6366f1;">${activeIndex + 1}</div>
                <div class="stat-label">Active Index</div>
            </div>
            <div class="stat-box">
                <div class="stat-val" style="color:#f59e0b;">${nodeCount}</div>
                <div class="stat-label">IP Entries</div>
            </div>
        </div>

        <div class="sub-box">
            <div class="label" style="color:#10b981;margin-bottom:8px;">Subscription Link</div>
            <div style="display:flex;gap:8px;">
                <input type="text" id="subLink" value="${defaultSubLink}" readonly>
                <button class="btn" onclick="copyVal('subLink')" style="white-space:nowrap;">Copy</button>
            </div>
            <div style="margin-top:10px;display:flex;gap:8px;align-items:center;">
                <input type="text" id="customIP" value="${proxyip}" placeholder="ProxyIP override (optional)" style="flex:1;">
                <button class="btn btn-ghost" onclick="updateLink()" style="white-space:nowrap;">Update</button>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Domain Pool</div>
            <div id="domainList"></div>
        </div>

        <div class="section">
            <div class="section-title">Switch Active Domain</div>
            <div style="display:flex;gap:8px;align-items:center;">
                <input type="number" id="switchIndex" placeholder="Enter index (0 = first)" min="0" max="${poolDomains.length - 1}" style="flex:1;">
                <button class="btn" onclick="switchDomain()">Switch</button>
                <button class="btn btn-danger" onclick="resetDomain()">Reset</button>
            </div>
            <div style="color:var(--text-secondary);font-size:0.78rem;margin-top:6px;">Reset returns to index 0 (first domain)</div>
        </div>

        <div class="divider"></div>
        <div class="info-row">
            <div class="info-box">
                <div class="label">UUID</div>
                <div class="info-val">${uuid.substring(0,8)}···</div>
            </div>
            <div class="info-box">
                <div class="label">Active Domain</div>
                <div class="info-val" style="color:var(--accent);font-size:0.8rem;">${poolDomains[activeIndex] || host}</div>
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
            <div class="domain-item \${i===activeIdx?'active':''}">
                <span>\${i+1}. \${d}</span>
                <span class="badge \${i===activeIdx?'badge-active':'badge-idle'}">\${i===activeIdx?'ACTIVE':'IDLE'}</span>
            </div>
        \`).join('');
    }
    function showToast(m){const t=document.getElementById('toast');t.innerText=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
    function copyVal(id){const el=document.getElementById(id);el.select();navigator.clipboard.writeText(el.value).then(()=>showToast('Copied to clipboard'))}
    function updateLink(){
        const ip=document.getElementById('customIP').value.trim();
        const u="https://"+window.location.hostname+"/${subpass}";
        document.getElementById('subLink').value = ip ? u+"?proxyip="+ip : u;
        showToast('Link updated');
    }
    function switchDomain(){
        const v = parseInt(document.getElementById('switchIndex').value);
        if(isNaN(v)||v<0||v>=domains.length){showToast('Invalid index');return;}
        fetch('/admin/switch?index='+v).then(r=>r.json()).then(d=>{if(d.ok){showToast('Switched to index '+v);setTimeout(()=>location.reload(),800)}});
    }
    function resetDomain(){
        fetch('/admin/switch?index=0').then(r=>r.json()).then(d=>{if(d.ok){showToast('Reset to index 0');setTimeout(()=>location.reload(),800)}});
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
