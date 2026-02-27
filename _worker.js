// =============================================================================
// 🟢 用户配置区域 (主控端: 极速缓存版)
// =============================================================================
const UUID = ""; 
const WEB_PASSWORD = "";  
const SUB_PASSWORD = "";  
const DEFAULT_PROXY_IP = ""; 
const NODE_DEFAULT_PATH = "/api/v1"; 
const ROOT_REDIRECT_URL = "https://cn.bing.com"; 

const PT_TYPE = 'v'+'l'+'e'+'s'+'s';

// 🚀 全局缓存池 (利用 Cloudflare Isolate 机制降低外部 API 延迟)
let globalCache = {
    ips: null,
    ipsTime: 0,
    uuid: null,
    uuidTime: 0
};
const CACHE_TTL = 600 * 1000; // IP 列表缓存 10 分钟 (单位: 毫秒)

function getEnv(env, key, fallback) { return env[key] || fallback; }

// 优化: 缓存动态 UUID 计算结果
async function getDynamicUUID(key, refresh = 86400) {
    const time = Math.floor(Date.now() / 1000 / refresh);
    if (globalCache.uuid && globalCache.uuidTime === time) return globalCache.uuid;

    const msg = new TextEncoder().encode(`${key}-${time}`);
    const hash = await crypto.subtle.digest('SHA-256', msg);
    const b = new Uint8Array(hash);
    const newUuid = [...b.slice(0, 16)].map(n => n.toString(16).padStart(2, '0')).join('').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
    
    globalCache.uuid = newUuid;
    globalCache.uuidTime = time;
    return newUuid;
}

// =============================================================================
// 🎨 面板 UI 代码 (保持不变)
// =============================================================================
const COMMON_STYLE = `
    :root { --bg-color: #f0f0f0; --card-bg: #ffffff; --primary-color: #ff4757; --secondary-color: #3742fa; --accent-color: #ffa502; --text-main: #2f3542; --border-color: #000000; --shadow-offset: 4px; }
    body { font-family: 'Courier New', 'Verdana', sans-serif; background-color: var(--bg-color); background-image: radial-gradient(var(--text-main) 1px, transparent 1px); background-size: 20px 20px; color: var(--text-main); margin: 0; min-height: 100vh; display: flex; justify-content: center; align-items: center; }
    .pop-card { background: var(--card-bg); border: 3px solid var(--border-color); box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--border-color); border-radius: 0px; padding: 2rem; max-width: 400px; width: 90%; position: relative; }
    .pop-title { font-weight: 900; text-transform: uppercase; font-size: 1.8rem; margin-bottom: 1.5rem; color: var(--border-color); text-shadow: 2px 2px 0px var(--accent-color); letter-spacing: -1px; }
    .btn { background: var(--primary-color); color: white; border: 3px solid var(--border-color); padding: 10px 20px; font-weight: 700; text-transform: uppercase; cursor: pointer; box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--border-color); transition: all 0.1s; display: inline-block; text-decoration: none; }
    .btn:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--border-color); }
    .btn:active { transform: translate(var(--shadow-offset), var(--shadow-offset)); box-shadow: 0px 0px 0px var(--border-color); }
    .btn-blue { background: var(--secondary-color); }
    input { width: 100%; padding: 10px; border: 3px solid var(--border-color); background: #fff; font-family: inherit; font-weight: 600; outline: none; box-sizing: border-box; margin-bottom: 1rem; }
    input:focus { background: #ffeaa7; }
    .animate-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
`;

function loginPage() {
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>ACCESS DENIED</title><style>${COMMON_STYLE}</style></head><body>
    <div class="pop-card animate-in">
        <div class="pop-title" style="text-align:center;">SYSTEM LOGIN</div>
        <div style="margin-bottom:20px; font-weight:bold; background:var(--accent-color); color:black; padding:5px; border:2px solid black;">⚠ RESTRICTED AREA</div>
        <input type="password" id="pwd" placeholder="INSERT PASSWORD..." onkeypress="if(event.keyCode===13)verify()">
        <button class="btn" style="width:100%" onclick="verify()">ENTER >></button>
    </div>
    <script>function verify(){const p=document.getElementById("pwd").value;if(!p)return;document.cookie="auth="+p+"; path=/; Max-Age=31536000";location.reload()}</script>
    </body></html>`;
}

function dashPage(host, uuid, proxyip, subpass) {
    const defaultSubLink = `https://${host}/${subpass}`;
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>DASHBOARD</title><link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet"><style>${COMMON_STYLE}
    .info-box { border: 2px solid black; padding: 10px; margin-bottom: 15px; background: white; }
    .label { font-size: 0.8rem; font-weight: 800; color: var(--secondary-color); text-transform: uppercase; }
    .val { font-family: monospace; font-size: 1rem; word-break: break-all; font-weight: bold; }
    #toast { position: fixed; bottom: 20px; right: 20px; background: var(--border-color); color: white; padding: 10px 20px; border: 3px solid white; font-weight: bold; transform: translateY(100px); transition: transform 0.3s; }
    #toast.show { transform: translateY(0); }
    </style></head><body>
    <div class="pop-card animate-in" style="max-width:600px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="pop-title" style="margin:0; font-size:1.5rem;">DASHBOARD</div>
            <button class="btn btn-blue" style="padding:5px 10px;" onclick="logout()"><i class="ri-logout-box-r-line"></i></button>
        </div>
        <div style="height:3px; background:black; margin: 15px 0;"></div>
        <div class="info-box" style="background:#ffeaa7;">
            <div class="label"><i class="ri-links-line"></i> SUBSCRIPTION LINK</div>
            <div style="display:flex; gap:10px; margin-top:5px;">
                <input type="text" id="subLink" value="${defaultSubLink}" readonly style="margin:0;">
                <button class="btn" onclick="copyId('subLink')">COPY</button>
            </div>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
            <div class="info-box">
                <div class="label">UUID</div>
                <div class="val">${uuid.substring(0,8)}...</div>
            </div>
            <div class="info-box">
                <div class="label">HOST</div>
                <div class="val">${host}</div>
            </div>
        </div>
        <div class="info-box">
            <div class="label">ADDRESS OVERRIDE (PROXYIP)</div>
            <div style="margin-top:5px; font-size:0.8rem; color:#666;">Leave empty to use default path (${NODE_DEFAULT_PATH})</div>
            <div style="display:flex; gap:10px; margin-top:5px;">
                <input type="text" id="customIP" value="${proxyip}" placeholder="e.g. 1.2.3.4" style="margin:0;">
                <button class="btn btn-blue" onclick="updateLink()">UPDATE</button>
            </div>
        </div>
    </div>
    <div id="toast">COPIED TO CLIPBOARD!</div>
    <script>
    function showToast(m){const t=document.getElementById('toast');t.innerText=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000)}
    function copyId(id){const el=document.getElementById(id);el.select();navigator.clipboard.writeText(el.value).then(()=>showToast('COPIED!'))}
    function updateLink(){
        const ip=document.getElementById('customIP').value.trim();
        const u="https://"+window.location.hostname+"/${subpass}";
        document.getElementById('subLink').value = ip ? u+"?proxyip="+ip : u;
        showToast('LINK UPDATED!');
    }
    function logout(){document.cookie="auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";location.reload()}
    </script></body></html>`;
}

// =============================================================================
// 🟢 核心节点生成与处理逻辑
// =============================================================================
function isSubPath(pw, url) { return pw && url.pathname === `/${pw}`; }
function isNormalSub(uuid, url) { return url.pathname === '/sub' && url.searchParams.get('uuid') === uuid; }

// 优化: IP 列表拉取增加内存缓存机制
async function getCustomIPs(env) {
    const now = Date.now();
    if (globalCache.ips && (now - globalCache.ipsTime < CACHE_TTL)) {
        return globalCache.ips;
    }

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
    
    globalCache.ips = ips;
    globalCache.ipsTime = now;
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

      // 1. 订阅分发 (添加严格防缓存控制)
      if (isSubPath(_SUB_PW, url) || isNormalSub(_UUID, url)) {
          const requestProxyIp = url.searchParams.get('proxyip') || _PROXY_IP;
          const allIPs = await getCustomIPs(env);
          const listText = genNodes(_POOL_DOMAINS, _UUID, requestProxyIp, allIPs, _PS, _PROXY_IP);
          
          return new Response(btoa(unescape(encodeURIComponent(listText))), { 
              status: 200, 
              headers: { 
                  'Content-Type': 'text/plain; charset=utf-8',
                  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0'
              } 
          });
      }

      // 2. 根目录防探测跳转
      if (url.pathname === '/') return Response.redirect(_ROOT_REDIRECT, 302);
      
      // 3. 管理面板
      if (url.pathname === '/admin' || url.pathname === '/admin/') {
          if (_WEB_PW) {
              const cookie = r.headers.get('Cookie') || "";
              if (!cookie.includes(`auth=${_WEB_PW}`)) return new Response(loginPage(), { status: 200, headers: {'Content-Type': 'text/html'} });
          }
          return new Response(dashPage(host, _UUID, _PROXY_IP, _SUB_PW), { status: 200, headers: {'Content-Type': 'text/html'} });
      }

      // 4. API 探针伪装
      if (url.pathname === NODE_DEFAULT_PATH) {
          return new Response(JSON.stringify({ status: "ok", version: "1.0.0" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // 5. 非法路径兜底
      return new Response('Not Found', { status: 404 });

    } catch (err) {
      return new Response(err.toString(), { status: 500 });
    }
  }
};
