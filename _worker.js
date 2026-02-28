// =============================================================================
// 🟢 用户配置区域 (主账号: 订阅管理)
// =============================================================================
const UUID = ""; // 你的 UUID
const WEB_PASSWORD = ""; // 管理面板密码
const SUB_PASSWORD = ""; // 订阅路径密码
const DEFAULT_PROXY_IP = "";
const NODE_DEFAULT_PATH = "/api/v1";
const ROOT_REDIRECT_URL = "https://cn.bing.com";
const PT_TYPE = 'v'+'l'+'e'+'s'+'s';

function getEnv(env, key, fallback) {
    return env[key] || fallback;
}

async function getDynamicUUID(key, refresh = 86400) {
    const time = Math.floor(Date.now() / 1000 / refresh);
    const msg = new TextEncoder().encode(`${key}-${time}`);
    const hash = await crypto.subtle.digest('SHA-256', msg);
    const b = new Uint8Array(hash);
    return [...b.slice(0, 16)].map(n => n.toString(16).padStart(2, '0')).join('').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}

// =============================================================================
// 🎨 面板 UI 代码 (优化版)
// =============================================================================
const COMMON_STYLE = `
:root {
    --bg-body: #f8fafc;
    --bg-card: #ffffff;
    --bg-input: #f1f5f9;
    --bg-input-focus: #ffffff;
    --primary: #4f46e5;
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
    --warning: #f59e0b;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
    --shadow-lg: 0 12px 24px -4px rgba(0, 0, 0, 0.05), 0 4px 10px -4px rgba(0, 0, 0, 0.03);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
}

[data-theme="dark"] {
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
    --danger: #f87171;
    --danger-bg: rgba(239, 68, 68, 0.1);
    --warning: #fbbf24;
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
    background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
    background-size: 24px 24px;
    -webkit-font-smoothing: antialiased;
}

.wrapper {
    width: 100%;
    max-width: 860px;
    padding: 2.5rem 1.5rem;
    margin: auto;
}

.card {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
    padding: 1.8rem;
    margin-bottom: 1.5rem;
    transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.card:hover { box-shadow: var(--shadow-lg); }

/* 按钮系统 */
.btn {
    background: var(--primary);
    color: #ffffff;
    border: none;
    border-radius: var(--radius-sm);
    padding: 11px 22px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1);
}

.btn:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn:active:not(:disabled) { transform: translateY(0); }

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-ghost {
    background: transparent;
    color: var(--text-main);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
}

.btn-ghost:hover:not(:disabled) {
    background: var(--bg-input);
    border-color: var(--text-muted);
}

.btn-danger {
    background: var(--danger-bg);
    color: var(--danger);
    border: 1px solid rgba(239, 68, 68, 0.2);
    box-shadow: none;
}

.btn-danger:hover:not(:disabled) {
    background: var(--danger);
    color: #ffffff;
    border-color: var(--danger);
}

.btn-icon {
    padding: 10px;
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    cursor: pointer;
    transition: all 0.2s;
}

.btn-icon:hover {
    background: var(--bg-input);
    border-color: var(--text-muted);
}

/* 输入框 */
input {
    width: 100%;
    padding: 12px 16px;
    background: var(--bg-input);
    border: 1.5px solid transparent;
    border-radius: var(--radius-sm);
    color: var(--text-main);
    font-family: monospace;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    outline: none;
}

input:hover { border-color: var(--border-color); }

input:focus {
    background: var(--bg-input-focus);
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
}

input::placeholder { color: var(--text-muted); font-family: inherit; }

.text-muted { color: var(--text-muted); font-size: 0.85rem; }

/* 状态指示器 */
.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
    position: relative;
    flex-shrink: 0;
}

.dot-active {
    background-color: var(--success);
    box-shadow: 0 0 8px var(--success);
}

.dot-active::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 1px solid var(--success);
    animation: pulse 2s infinite;
}

.dot-error { background-color: var(--danger); box-shadow: 0 0 8px var(--danger); }
.dot-idle { background-color: var(--text-muted); }

@keyframes pulse {
    0% { transform: scale(1); opacity: 0.6; }
    70% { transform: scale(2); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
}

/* 布局 */
.grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    margin-bottom: 1.5rem;
}

@media (max-width: 640px) {
    .grid-3 { grid-template-columns: 1fr; }
}

.flex-row {
    display: flex;
    gap: 12px;
    align-items: center;
}

.flex-row input { flex: 1; min-width: 0; }

.section-title {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    color: var(--text-main);
}

.section-title svg { margin-right: 8px; color: var(--primary); }

/* 列表项 */
.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    transition: all 0.2s;
    margin-bottom: 6px;
    gap: 12px;
}

.list-item:hover {
    background: var(--bg-input);
    border-color: var(--border-color);
}

.list-item.active {
    background: var(--primary-light);
    border: 1px solid rgba(79, 70, 229, 0.25);
}

.list-item-content {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.list-item-status {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

/* Toast 通知 */
#toast {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: #1e293b;
    color: #ffffff;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 999;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 90vw;
}

#toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
}

#toast.toast-success { border-left: 4px solid var(--success); }
#toast.toast-error { border-left: 4px solid var(--danger); background: #7f1d1d; }
#toast.toast-warning { border-left: 4px solid var(--warning); }

/* 主题切换图标 */
.icon-moon { display: none; }
.icon-sun { display: block; }
[data-theme="dark"] .icon-moon { display: block; }
[data-theme="dark"] .icon-sun { display: none; }

/* 加载动画 */
.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* 错误提示动画 */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
}

.shake { animation: shake 0.4s ease-in-out; }

/* 双栏布局响应式 */
.two-col {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .two-col { grid-template-columns: 1fr; }
}`;

// 主题初始化脚本 - 放在 head 最前面防止闪烁
const THEME_SCRIPT = `
<script>
(function() {
    try {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    } catch(e) {}
})();
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    try { localStorage.setItem('theme', isDark ? 'light' : 'dark'); } catch(e) {}
}
</script>`;

function loginPage() {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>安全验证 - 控制台</title>
    <style>${COMMON_STYLE}</style>
    ${THEME_SCRIPT}
</head>
<body>
    <div class="wrapper" style="display:flex; justify-content:center; align-items:center; min-height:100vh; padding:1rem;">
        <div class="card" style="width:100%; max-width:420px; padding:2.5rem; text-align:center;">
            <div style="margin-bottom:2rem;">
                <div style="width:56px; height:56px; background:linear-gradient(135deg, var(--primary), var(--primary-hover)); border-radius:14px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:1.2rem; box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.45);">
                    <svg width="28" height="28" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <path d="M9 12l2 2 4-4"></path>
                    </svg>
                </div>
                <h2 style="font-size:1.5rem; font-weight:700; color:var(--text-main); margin-bottom:8px; letter-spacing:-0.3px;">控制台安全验证</h2>
                <p class="text-muted" style="font-size:0.95rem; line-height:1.5;">请输入管理员密钥以建立安全连接</p>
            </div>
            
            <div style="margin-bottom:1.5rem;">
                <input type="password" id="pwd" placeholder="输入管理员密钥" onkeypress="if(event.key==='Enter')verify()" autofocus style="padding:14px 18px; font-size:1rem; font-family:inherit; text-align:center;">
                <p id="errorMsg" style="color:var(--danger); font-size:0.85rem; margin-top:10px; min-height:20px; opacity:0; transition:opacity 0.2s;">密钥验证失败，请重试</p>
            </div>
            
            <button id="loginBtn" class="btn" style="width:100%; justify-content:center; padding:14px; font-size:1rem; font-weight:600;" onclick="verify()">
                <span id="btnText">进入系统</span>
                <svg id="btnArrow" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
                <div id="btnSpinner" class="spinner" style="display:none;"></div>
            </button>
            
            <div style="margin-top:2rem; display:flex; justify-content:center;">
                <button class="btn-icon" onclick="toggleTheme()" title="切换主题">
                    <svg class="icon-sun" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <svg class="icon-moon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <script>
    function verify() {
        const pwdInput = document.getElementById('pwd');
        const btn = document.getElementById('loginBtn');
        const btnText = document.getElementById('btnText');
        const btnArrow = document.getElementById('btnArrow');
        const btnSpinner = document.getElementById('btnSpinner');
        const errorMsg = document.getElementById('errorMsg');
        
        const p = pwdInput.value.trim();
        if (!p) {
            pwdInput.focus();
            pwdInput.classList.add('shake');
            setTimeout(() => pwdInput.classList.remove('shake'), 400);
            return;
        }
        
        // 显示加载状态
        btn.disabled = true;
        btnText.textContent = '验证中';
        btnArrow.style.display = 'none';
        btnSpinner.style.display = 'block';
        errorMsg.style.opacity = '0';
        
        // 模拟验证延迟，让用户看到加载状态
        setTimeout(() => {
            document.cookie = "auth=" + encodeURIComponent(p) + "; path=/; Max-Age=31536000; SameSite=Strict";
            location.reload();
        }, 300);
    }
    </script>
</body>
</html>`;
}

function dashPage(host, uuid, proxyip, subpass, poolDomains = [], activeIndex = 0, nodeCount = 0) {
    const defaultSubLink = `https://${host}/${subpass}`;
    const domainsJson = JSON.stringify(poolDomains);
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>边缘节点调度 - 控制面板</title>
    <style>${COMMON_STYLE}</style>
    ${THEME_SCRIPT}
</head>
<body>
    <div class="wrapper">
        <!-- 头部 -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2.5rem; flex-wrap:wrap; gap:1rem;">
            <div style="display:flex; align-items:center; gap:14px;">
                <div style="width:42px; height:42px; background:linear-gradient(135deg, var(--primary), var(--primary-hover)); border-radius:10px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(79,70,229,0.35);">
                    <svg width="22" height="22" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 12h4l2-9 5 18 3-10h4"></path>
                    </svg>
                </div>
                <div>
                    <h1 style="font-size:1.35rem; font-weight:700; color:var(--text-main); letter-spacing:-0.3px; line-height:1.2;">边缘节点调度</h1>
                    <div class="text-muted" style="font-family:monospace; font-size:0.82rem; margin-top:2px;">${host}</div>
                </div>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn-icon" onclick="toggleTheme()" title="切换主题">
                    <svg class="icon-sun" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <svg class="icon-moon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
                <button class="btn btn-ghost" onclick="logout()">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    退出
                </button>
            </div>
        </div>
        
        <!-- 统计卡片 -->
        <div class="grid-3">
            <div class="card" style="margin-bottom:0; padding:1.5rem;">
                <div class="text-muted" style="margin-bottom:8px; font-weight:500; font-size:0.85rem;">配置域名总数</div>
                <div style="font-size:2.2rem; font-weight:700; color:var(--text-main); line-height:1;">${poolDomains.length}</div>
            </div>
            <div class="card" style="margin-bottom:0; padding:1.5rem; border-bottom: 3px solid var(--primary);">
                <div class="text-muted" style="margin-bottom:8px; font-weight:500; font-size:0.85rem;">当前活跃索引</div>
                <div style="font-size:2.2rem; font-weight:700; color:var(--primary); line-height:1;">${activeIndex}</div>
            </div>
            <div class="card" style="margin-bottom:0; padding:1.5rem;">
                <div class="text-muted" style="margin-bottom:8px; font-weight:500; font-size:0.85rem;">可用 IP 条目</div>
                <div style="font-size:2.2rem; font-weight:700; color:var(--text-main); line-height:1;">${nodeCount}</div>
            </div>
        </div>
        
        <!-- 订阅配置 -->
        <div class="card">
            <h3 class="section-title">
                <span class="status-dot dot-active"></span>
                订阅分发配置
            </h3>
            <div class="flex-row" style="margin-bottom:1rem;">
                <input type="text" id="subLink" value="${defaultSubLink}" readonly>
                <button class="btn" onclick="copyVal('subLink')" style="flex-shrink:0;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    复制
                </button>
            </div>
            <div class="flex-row">
                <input type="text" id="customIP" value="${proxyip}" placeholder="自定义 ProxyIP (可选)">
                <button class="btn btn-ghost" onclick="updateLink()" style="flex-shrink:0;">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 2v6h-6"></path>
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                    </svg>
                    更新
                </button>
            </div>
        </div>
        
        <!-- 双栏布局 -->
        <div class="two-col">
            <div class="card">
                <h3 class="section-title">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    域名池调度状态
                </h3>
                <div id="domainList" style="margin-bottom:1.5rem; border-radius:var(--radius-md); border:1px solid var(--border-color); padding:8px; background:var(--bg-body); max-height:280px; overflow-y:auto;"></div>
                <div class="text-muted" style="margin-bottom:10px; font-weight:500; font-size:0.85rem;">手动干预轮换：</div>
                <div class="flex-row" style="flex-wrap:wrap;">
                    <input type="number" id="switchIndex" placeholder="目标索引 (0 ~ ${poolDomains.length - 1})" min="0" max="${poolDomains.length - 1}" style="flex:1; min-width:120px;">
                    <button class="btn btn-ghost" onclick="switchDomain()" style="flex-shrink:0;">强制切换</button>
                    <button class="btn btn-danger" onclick="resetDomain()" style="flex-shrink:0;">重置</button>
                </div>
            </div>
            
            <div class="card">
                <h3 class="section-title">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19
