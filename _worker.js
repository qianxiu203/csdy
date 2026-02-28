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
// 🎨 面板 UI 代码 (极致质感优化版)
// =============================================================================
const COMMON_STYLE = `
    :root {
        /* 白天模式 (极简质感) */
        --bg-body: #f8fafc;
        --bg-card: #ffffff;
        --bg-input: #f1f5f9;
        --bg-input-focus: #ffffff;
        --primary: #4f46e5;      /* 高级靛青 */
        --primary-hover: #4338ca;
        --primary-light: #e0e7ff;
        --text-main: #0f172a;
        --text-muted: #64748b;
        --border-color: #e2e8f0;
        --border-focus: #818cf8;
        --success: #10b981;
        --success-bg: #ecfdf5;
        --danger: #ef4444;
        --danger-bg: #fef2f2;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
        --shadow-lg: 0 12px 24px -4px rgba(0, 0, 0, 0.05), 0 4px 10px -4px rgba(0, 0, 0, 0.03);
        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 16px;
    }
    [data-theme="dark"] {
        /* 黑夜模式 (深邃质感) */
        --bg-body: #0b0f19;
        --bg-card: #151e2e;
        --bg-input: #0f172a;
        --bg-input-focus: #151e2e;
        --primary: #6366f1;
        --primary-hover: #818cf8;
        --primary-light: rgba(99, 102, 241, 0.15);
        --text-main: #f8fafc;
        --text-muted: #94a3b8;
        --border-color: #1e293b;
        --border-focus: #6366f1;
        --success: #10b981;
        --success-bg: rgba(16, 185, 129, 0.1);
        --danger: #ef4444;
        --danger-bg: rgba(239, 68, 68, 0.1);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        --shadow-lg: 0 15px 30px -5px rgba(0, 0, 0, 0.4);
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
        background-color: var(--bg-body);
        color: var(--text-main);
        line-height: 1.6;
        transition: background-color 0.3s ease, color 0.3s ease;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* 微妙的科技感网格背景 */
        background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
        background-size: 24px 24px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .wrapper { width: 100%; max-width: 860px; padding: 2.5rem 1.5rem; margin: auto; }
    
    .card {
        background: var(--bg-card);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border-color);
        padding: 1.8rem;
        margin-bottom: 1.5rem;
        transition: box-shadow 0.3s ease;
    }
    .card:hover { box-shadow: var(--shadow-lg); }
    
    /* 按钮质感 */
    .btn {
        background: var(--primary); 
        color: #ffffff;
        border: 1px solid rgba(0,0,0,0.1); 
        border-radius: var(--radius-sm); 
        padding: 10px 20px;
        font-size: 0.9rem; 
        font-weight: 500; 
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-flex; 
        align-items: center; 
        justify-content: center;
        gap: 6px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.1);
        text-shadow: 0 1px 1px rgba(0,0,0,0.1);
    }
    .btn:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25), inset 0 1px 0 rgba(255,255,255,0.2); }
    .btn:active { transform: translateY(0); box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
    
    .btn-ghost { background: transparent; color: var(--text-main); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); text-shadow: none; }
    .btn-ghost:hover { background: var(--bg-input); border-color: var(--text-muted); box-shadow: var(--shadow-md); color: var(--text-main); }
    
    .btn-danger { background: var(--danger-bg); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); box-shadow: none; text-shadow: none;}
    .btn-danger:hover { background: var(--danger); color: #ffffff; border-color: var(--danger); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25); }
    
    .btn-icon { padding: 8px; border-radius: var(--radius-sm); background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-main); cursor: pointer; transition: 0.2s; box-shadow: var(--shadow-sm); }
    .btn-icon:hover { background: var(--bg-input); transform: translateY(-1px); }
    
    /* 输入框质感 */
    input {
        width: 100%; 
        padding: 12px 16px; 
        background: var(--bg-input);
        border: 1px solid transparent; 
        border-radius: var(--radius-sm);
        color: var(--text-main); 
        font-family: monospace; 
        font-size: 0.95rem;
        transition: all 0.2s ease; 
        outline: none;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
    }
    input:hover { border-color: var(--border-color); }
    input:focus { 
        background: var(--bg-input-focus);
        border-color: var(--border-focus); 
        box-shadow: 0 0 0 4px var(--primary-light), inset 0 1px 2px rgba(0,0,0,0.01); 
    }
    input::placeholder { color: var(--text-muted); font-family: -apple-system, sans-serif; }
    
    .text-muted { color: var(--text-muted); font-size: 0.85rem; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px; position: relative; }
    .dot-active { background-color: var(--success); box-shadow: 0 0 8px var(--success); }
    .dot-active::after { content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; border-radius: 50%; border: 1px solid var(--success); opacity: 0.4; animation: pulse 2s infinite; }
    .dot-error { background-color: var(--danger); box-shadow: 0 0 8px var(--danger); }
    .dot-idle { background-color: var(--text-muted); }
    
    @keyframes pulse { 0% { transform: scale(1); opacity: 0.6; } 70% { transform: scale(2); opacity: 0; } 100% { transform: scale(1); opacity: 0; } }
    
    /* 布局容器 */
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; margin-bottom: 1.5rem; }
    .flex-row { display: flex; gap: 12px; align-items: center; }
    .section-title { font-size: 1.05rem; font-weight: 600; margin-bottom: 1.2rem; display: flex; align-items: center; color: var(--text-main); }
    .section-title svg { margin-right: 8px; color: var(--primary); }
    
    /* 列表项质感 */
    .list-item {
        display: flex; justify-content: space-between; align-items: center; 
        padding: 12px 16px; border-radius: var(--radius-sm);
        border: 1px solid transparent; transition: all 0.2s;
        margin-bottom: 6px;
    }
    .list-item:hover { background: var(--bg-input); border-color: var(--border-color); }
    .list-item.active { background: var(--primary-light); border: 1px solid rgba(79, 70, 229, 0.2); }
    
    #toast {
        position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(100px);
        background: #1e293b; color: #ffffff;
        padding: 12px 24px; border-radius: 30px; font-size: 0.9rem; font-weight: 500;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
        opacity: 0; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 999;
        display: flex; align-items: center; gap: 8px;
    }
    #toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    
    /* 主题图标切换 */
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
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>安全验证 - 控制台</title><style>${COMMON_STYLE}</style>${THEME_SCRIPT}</head><body>
    <div class="wrapper" style="display:flex; justify-content:center; align-items:center; min-height:100vh;">
        <div class="card" style="width:100%; max-width:420px; padding:3rem 2.5rem; text-align:center;">
            <div style="margin-bottom:2.5rem;">
                <div style="width:54px; height:54px; background:linear-gradient(135deg, var(--primary), var(--primary-hover)); border-radius:16px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:1.2rem; box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);">
                    <svg width="26" height="26" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h2 style="font-size:1.6rem; font-weight:700; color:var(--text-main); margin-bottom:6px; letter-spacing:-0.5px;">控制台安全验证</h2>
                <div class="text-muted" style="font-size:0.95rem;">请输入管理员密钥以建立安全连接</div>
            </div>
            <div style="margin-bottom:1.8rem; text-align:left;">
                <input type="password" id="pwd" placeholder="管理员密钥" onkeypress="if(event.keyCode===13)verify()" style="padding:14px 16px; font-size:1rem; font-family:inherit;">
            </div>
            <button class="btn" style="width:100%; justify-content:center; padding:14px; font-size:1rem;" onclick="verify()">
                进入系统
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
        </div>
    </div>
    <script>function verify(){const p=document.getElementById("pwd").value;if(!p)return;document.cookie="auth="+p+"; path=/; Max-Age=31536000";location.reload()}</script>
    </body></html>`;
}

function dashPage(host, uuid, proxyip, subpass, poolDomains = [], activeIndex = 0, nodeCount = 0) {
    const defaultSubLink = `https://${host}/${subpass}`;
    const domainsJson = JSON.stringify(poolDomains);
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>边缘节点调度 - 控制面板</title><style>${COMMON_STYLE}</style>${THEME_SCRIPT}</head><body>
    <div class="wrapper">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2.5rem;">
            <div style="display:flex; align-items:center; gap:16px;">
                <div style="width:40px; height:40px; background:var(--primary); border-radius:10px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(79,70,229,0.3);">
                    <svg width="20" height="20" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2-9 5 18 3-10h4"></path></svg>
                </div>
                <div>
                    <h1 style="font-size:1.4rem; font-weight:700; color:var(--text-main); letter-spacing:-0.5px; line-height:1.2;">边缘节点调度</h1>
                    <div class="text-muted" style="font-family:monospace; font-size:0.85rem;">${host}</div>
                </div>
            </div>
            <div style="display:flex; gap:12px;">
                <button class="btn-icon" onclick="toggleTheme()" title="切换主题外观">
                    <svg class="icon-sun" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    <svg class="icon-moon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </button>
                <button class="btn btn-ghost" onclick="logout()">退出系统</button>
            </div>
        </div>

        <div class="grid-3">
            <div class="card" style="margin-bottom:0; padding:1.5rem;">
                <div class="text-muted" style="margin-bottom:10px; font-weight:500;">配置域名总数</div>
                <div style="font-size:2.2rem; font-weight:700; color:var(--text-main); line-height:1;">${poolDomains.length}</div>
            </div>
            <div class="card" style="margin-bottom:0; padding:1.5rem; border-bottom: 4px solid var(--primary);">
                <div class="text-muted" style="margin-bottom:10px; font-weight:500;">当前活跃索引</div>
                <div style="font-size:2.2rem; font-weight:700; color:var(--primary); line-height:1;">${activeIndex}</div>
            </div>
            <div class="card" style="margin-bottom:0; padding:1.5rem;">
                <div class="text-muted" style="margin-bottom:10px; font-weight:500;">可用 IP 条目</div>
                <div style="font-size:2.2rem; font-weight:700; color:var(--text-main); line-height:1; display:flex; align-items:flex-end; gap:8px;">
                    ${nodeCount} 
                    <span style="font-size:0.85rem; color:var(--success); font-weight:600; background:var(--success-bg); padding:2px 8px; border-radius:12px; margin-bottom:4px;">
                        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; vertical-align:middle; margin-top:-2px;"><path d="M12 19V5M5 12l7-7 7 7"/></svg> 稳定
                    </span>
                </div>
            </div>
        </div>

        <div class="card">
            <h3 class="section-title">
                <span class="status-dot dot-active"></span> 订阅分发配置
            </h3>
            <div class="flex-row" style="margin-bottom:1rem;">
                <input type="text" id="subLink" value="${defaultSubLink}" readonly>
                <button class="btn" onclick="copyVal('subLink')" style="flex-shrink:0;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    复制链接
                </button>
            </div>
            <div class="flex-row">
                <input type="text" id="customIP" value="${proxyip}" placeholder="自定义 ProxyIP (留空则使用全局配置)">
                <button class="btn btn-ghost" onclick="updateLink()" style="flex-shrink:0;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                    更新参数
                </button>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:1.5rem;">
            <div class="card">
                <h3 class="section-title">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    域名池调度状态
                </h3>
                <div id="domainList" style="margin-bottom:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color); padding:6px; background:var(--bg-body);"></div>
                
                <div class="text-muted" style="margin-bottom:10px; font-weight:500;">手动干预轮换：</div>
                <div class="flex-row">
                    <input type="number" id="switchIndex" placeholder="输入目标索引 (0 ~ ${poolDomains.length - 1})" min="0" max="${poolDomains.length - 1}">
                    <button class="btn btn-ghost" onclick="switchDomain()" style="flex-shrink:0;">强制切换</button>
                    <button class="btn btn-danger" onclick="resetDomain()" style="flex-shrink:0;">状态重置</button>
                </div>
            </div>

            <div class="card">
                <h3 class="section-title">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    系统环境参数
                </h3>
                <div style="background:var(--bg-body); border-radius:var(--radius-md); border:1px solid var(--border-color); padding:1rem;">
                    <div style="margin-bottom:1.2rem;">
                        <div class="text-muted" style="margin-bottom:6px; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px;">通讯 UUID</div>
                        <div style="font-family:monospace; font-size:0.95rem; font-weight:500;">${uuid.substring(0,8)}<span style="color:var(--text-muted)">-****-****-****-***********</span></div>
                    </div>
                    <div style="height:1px; background:var(--border-color); margin-bottom:1.2rem;"></div>
                    <div>
                        <div class="text-muted" style="margin-bottom:6px; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px;">当前活动端点</div>
                        <div style="font-family:monospace; font-size:0.95rem; font-weight:600; color:var(--primary); word-break:break-all;">${poolDomains[activeIndex] || host}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div id="toast">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span id="toastMsg"></span>
    </div>
    
    <script>
    const domains = ${domainsJson};
    const activeIdx = ${activeIndex};
    
    function renderDomains(){
        const el = document.getElementById('domainList');
        el.innerHTML = domains.map((d,i) => \`
            <div class="list-item \${i === activeIdx ? 'active' : ''}">
                <div style="font-family:monospace; font-size:0.95rem; color:\${i===activeIdx ? 'var(--primary)' : 'var(--text-main)'}; font-weight:\${i===activeIdx ? '600' : 'normal'};">
                    <span style="color:var(--text-muted); margin-right:8px;">[\${i}]</span> \${d}
                </div>
                <div style="display:flex; align-items:center;">
                    \${i===activeIdx 
                        ? '<span class="status-dot dot-active"></span><span style="font-size:0.85rem;color:var(--success);font-weight:500;">解析中</span>' 
                        : '<span class="status-dot dot-idle"></span><span class="text-muted">待命中</span>'}
                </div>
            </div>
        \`).join('');
    }
    
    function showToast(m){
        const t = document.getElementById('toast');
        document.getElementById('toastMsg').innerText = m;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }
    
    function copyVal(id){
        const el = document.getElementById(id);
        el.select();
        navigator.clipboard.writeText(el.value).then(() => showToast('已成功复制到剪贴板'));
    }
    
    function updateLink(){
        const ip = document.getElementById('customIP').value.trim();
        const u = "https://" + window.location.hostname + "/${subpass}";
        document.getElementById('subLink').value = ip ? u + "?proxyip=" + ip : u;
        showToast('配置参数已更新，请重新复制');
    }
    
    function switchDomain(){
        const v = parseInt(document.getElementById('switchIndex').value);
        if(isNaN(v) || v < 0 || v >= domains.length) {
            document.getElementById('toast').querySelector('svg').outerHTML = '<svg width="18" height="18" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
            showToast('错误：索引值超出可用范围');
            return;
        }
        fetch('/admin/switch?index='+v).then(r=>r.json()).then(d=>{
            if(d.ok){
                showToast('下发调度指令成功');
                setTimeout(()=>location.reload(), 800);
            }
        });
    }
    
    function resetDomain(){
        fetch('/admin/switch?index=0').then(r=>r.json()).then(d=>{
            if(d.ok){
                showToast('已安全重置至初始端点');
                setTimeout(()=>location.reload(), 800);
            }
        });
    }
    
    function logout(){
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        location.reload();
    }
    
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

      // 4. 手动切换域名接口
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
