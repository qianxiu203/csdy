// =============================================================================
// 用户配置区域（主账号 / 订阅管理）
// =============================================================================
const UUID = "";             // 默认 UUID
const WEB_PASSWORD = "";      // 管理面板密码
const SUB_PASSWORD = "";      // 订阅路径密码
const DEFAULT_PROXY_IP = "";  // 默认 Proxy IP
const NODE_DEFAULT_PATH = "/api/v1"; 
const ROOT_REDIRECT_URL = "https://cn.bing.com"; 

const PT_TYPE = 'v' + 'l' + 'e' + 's' + 's';
const DEFAULT_ECH_ENABLED = 'no';
const DEFAULT_ECH_DOH = 'https://dns.joeyblog.eu.org/joeyblog';
const DEFAULT_ECH_QUERY_SERVER_NAME = 'cloudflare-ech.com';

// =============================================================================
// UI 样式系统（现代工业风）
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

/* 列表项目 */
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
// 登录页面
// =============================================================================
function loginPage() {
    return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>管理后台登录</title>${THEME_SCRIPT}<style>
    :root{
      --text:#111827; --muted:#6b7280; --border:#e5e7eb; --link:#2563eb;
      --panel1:#9ca3af; --panel2:#6b7280; --panel3:#4b5563;
      --card-bg:#ffffff; --focus:#94a3b8;
    }
    [data-theme="dark"]{
      --text:#f8fafc; --muted:#94a3b8; --border:#334155; --link:#93c5fd;
      --card-bg:#0f172a; --focus:#64748b;
      --panel1:#475569; --panel2:#334155; --panel3:#0f172a;
    }
    *{ box-sizing:border-box; }
    html,body{ margin:0; min-height:100%; }
    body{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:var(--text); background:var(--card-bg); }
    a{ color:inherit; text-decoration:none; }
    .page{ min-height:100vh; display:grid; grid-template-columns:1fr; background:var(--card-bg); }
    @media (min-width:1024px){ .page{ grid-template-columns:1fr 1fr; } }
    .left{
      display:none; position:relative; overflow:hidden; padding:48px; color:#fff;
      background:
        radial-gradient(1200px 800px at 20% 60%, rgba(255,255,255,.12), transparent 50%),
        linear-gradient(135deg, var(--panel1), var(--panel2), var(--panel3));
    }
    @media (min-width:1024px){ .left{ display:flex; align-items:center; justify-content:center; } }
    .gridOverlay{
      position:absolute; inset:0; opacity:.12; z-index:0;
      background-image:
        linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px);
      background-size:20px 20px;
    }
    .blob{ position:absolute; border-radius:999px; filter:blur(60px); opacity:.35; z-index:1; }
    .blob.b1{ width:280px; height:280px; right:14%; top:22%; background:#94a3b8; }
    .blob.b2{ width:420px; height:420px; left:10%; bottom:10%; background:#cbd5e1; }
    .brand{ position:relative; z-index:2; display:flex; align-items:center; gap:10px; font-weight:800; letter-spacing:.2px; }
    .logo{
      width:34px; height:34px; border-radius:10px; background:rgba(255,255,255,.18);
      display:grid; place-items:center; backdrop-filter: blur(6px);
      border:1px solid rgba(255,255,255,.22); font-size:18px;
    }
    .leftTop{ position:absolute; top:48px; left:48px; z-index:2; }
    .stageWrap{ position:relative; z-index:2; min-height:520px; display:flex; align-items:center; justify-content:center; }
    .stage{ position:relative; width:550px; height:400px; transform:translateY(12px); }
    .char{ position:absolute; bottom:0; transform-origin:bottom center; transition: all 700ms ease-in-out; }
    .purple{ left:70px; width:180px; height:400px; background:#6C3FF5; border-radius:10px 10px 0 0; z-index:1; }
    .black{ left:240px; width:120px; height:310px; background:#2D2D2D; border-radius:8px 8px 0 0; z-index:2; }
    .orange{ left:0; width:240px; height:200px; background:#FF9B6B; border-radius:120px 120px 0 0; z-index:3; }
    .yellow{ left:310px; width:140px; height:230px; background:#E8D754; border-radius:70px 70px 0 0; z-index:4; }
    .eyesRow{ position:absolute; display:flex; transition: all 700ms ease-in-out; }
    .purpleEyes{ gap:32px; left:45px; top:40px; }
    .blackEyes{ gap:24px; left:26px; top:32px; }
    .orangeEyes{ gap:32px; left:82px; top:90px; transition: all 200ms ease-out; }
    .yellowEyes{ gap:24px; left:52px; top:40px; transition: all 200ms ease-out; }
    .eyeball{ border-radius:999px; background:#fff; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:all 150ms; position:relative; }
    .pupil, .pupilOnly{ border-radius:999px; background:#2D2D2D; transition:transform 100ms ease-out; }
    .pupilOnly{ width:12px; height:12px; }
    .yellowMouth{ position:absolute; width:80px; height:4px; background:#2D2D2D; border-radius:999px; left:40px; top:88px; transition:all 200ms ease-out; }
    .right{ display:flex; align-items:center; justify-content:center; padding:32px; background:var(--card-bg); }
    .card{ width:100%; max-width:460px; min-height:520px; display:flex; flex-direction:column; justify-content:center; }
    .mobileBrand{ display:flex; align-items:center; justify-content:center; gap:10px; font-weight:800; margin-bottom:48px; }
    @media (min-width:1024px){ .mobileBrand{ display:none; } }
    h1{ margin:0 0 8px; text-align:center; font-size:32px; }
    .sub{ margin:0 0 28px; text-align:center; font-size:14px; color:var(--muted); line-height:1.7; }
    label{ display:block; margin:0 0 8px; font-size:14px; font-weight:650; }
    .field{ margin:14px 0; }
    input[type="password"], input[type="text"]{
      width:100%; height:46px; border:1px solid var(--border); border-radius:999px; padding:0 16px;
      font-size:15px; outline:none; background:transparent; color:var(--text);
    }
    input:focus{ border-color:var(--focus); box-shadow:0 0 0 4px rgba(148,163,184,.25); }
    .pwWrap{ position:relative; }
    .eyeBtn{
      position:absolute; right:10px; top:50%; transform:translateY(-50%); width:36px; height:36px;
      border-radius:999px; border:1px solid var(--border); background:transparent; color:var(--text);
      cursor:pointer; display:grid; place-items:center; font-size:14px;
    }
    .eyeBtn:hover, .themeBtn:hover{ background:rgba(148,163,184,.08); }
    .btn{
      width:100%; height:46px; border-radius:999px; border:1px solid var(--border); background:transparent;
      color:var(--text); cursor:pointer; font-size:16px; font-weight:700;
    }
    .btn:hover{ background:rgba(148,163,184,.08); }
    .btn.primary{ border-color:#dbeafe; background:#111827; color:#fff; }
    .btn.primary:hover{ background:#0f172a; }
    [data-theme="dark"] .btn.primary{ background:#e2e8f0; color:#0f172a; }
    .err{
      margin-top:12px; color:#b91c1c; background:#fee2e2; border:1px solid #fecaca; border-radius:12px;
      padding:10px; font-size:14px; display:none; white-space:pre-wrap;
    }
    .footer{ margin-top:18px; text-align:center; font-size:14px; color:var(--muted); }
    .themeWrap{ display:flex; justify-content:center; margin-top:20px; }
    .themeBtn{
      height:40px; padding:0 16px; border-radius:999px; border:1px solid var(--border); background:transparent;
      color:var(--text); cursor:pointer; font-size:14px;
    }
    </style></head><body>
  <div class="page">
    <section class="left">
      <div class="gridOverlay"></div>
      <div class="blob b1"></div>
      <div class="blob b2"></div>
      <div class="leftTop">
        <div class="brand"><div class="logo">🧭</div><div>边缘节点池</div></div>
      </div>
      <div class="stageWrap">
        <div class="stage" id="stage">
          <div class="char purple" id="c_purple"><div class="eyesRow purpleEyes" id="purple_eyes"><div class="eyeball" data-owner="purple" data-max="5" style="width:18px;height:18px;"><div class="pupil" style="width:7px;height:7px;"></div></div><div class="eyeball" data-owner="purple" data-max="5" style="width:18px;height:18px;"><div class="pupil" style="width:7px;height:7px;"></div></div></div></div>
          <div class="char black" id="c_black"><div class="eyesRow blackEyes" id="black_eyes"><div class="eyeball" data-owner="black" data-max="4" style="width:16px;height:16px;"><div class="pupil" style="width:6px;height:6px;"></div></div><div class="eyeball" data-owner="black" data-max="4" style="width:16px;height:16px;"><div class="pupil" style="width:6px;height:6px;"></div></div></div></div>
          <div class="char orange" id="c_orange"><div class="eyesRow orangeEyes" id="orange_eyes"><div class="pupilOnly" data-owner="orange" data-max="5"></div><div class="pupilOnly" data-owner="orange" data-max="5"></div></div></div>
          <div class="char yellow" id="c_yellow"><div class="eyesRow yellowEyes" id="yellow_eyes"><div class="pupilOnly" data-owner="yellow" data-max="5"></div><div class="pupilOnly" data-owner="yellow" data-max="5"></div></div><div class="yellowMouth" id="yellow_mouth"></div></div>
        </div>
      </div>
      
    </section>
    <section class="right">
      <div class="card">
        <div class="mobileBrand"><div class="logo">🧭</div><div>边缘节点池</div></div>
        <h1>管理后台登录</h1>
        <p class="sub">请输入管理密码以继续访问控制台。</p>
        <form id="loginForm">
          <div class="field">
            <label for="password">管理密码</label>
            <div class="pwWrap">
              <input id="password" type="password" placeholder="请输入管理密码" autocomplete="current-password" />
              <button id="togglePw" class="eyeBtn" type="button" aria-label="切换密码显示">👁</button>
            </div>
          </div>
          <button id="loginBtn" class="btn primary" type="submit">进入后台</button>
          <div id="errorBox" class="err"></div>
        </form>
        <div class="themeWrap"><button id="themeBtn" class="themeBtn" type="button">切换明暗主题</button></div>
        <div class="footer">当前仅提供管理密码登录，不接入邮箱账户或第三方认证。</div>
      </div>
    </section>
  </div>
  <script>
    const state = {
      isTyping: false,
      isPasswordFocused: false,
      showPassword: false,
      passwordLength: 0,
      hasError: false,
      isPurpleBlinking: false,
      isBlackBlinking: false,
      isLookingAtEachOther: false,
      isPurplePeeking: false,
      mouseX: 0,
      mouseY: 0,
    };
    const purple = document.getElementById('c_purple');
    const black = document.getElementById('c_black');
    const orange = document.getElementById('c_orange');
    const yellow = document.getElementById('c_yellow');
    const purpleEyes = document.getElementById('purple_eyes');
    const blackEyes = document.getElementById('black_eyes');
    const orangeEyes = document.getElementById('orange_eyes');
    const yellowEyes = document.getElementById('yellow_eyes');
    const yellowMouth = document.getElementById('yellow_mouth');
    const eyeballs = Array.from(document.querySelectorAll('.eyeball'));
    const pupilOnly = Array.from(document.querySelectorAll('.pupilOnly'));
    const passwordEl = document.getElementById('password');
    const togglePw = document.getElementById('togglePw');
    const loginBtn = document.getElementById('loginBtn');
    const errBox = document.getElementById('errorBox');
    const themeBtn = document.getElementById('themeBtn');
    window.addEventListener('mousemove', function (e) { state.mouseX = e.clientX; state.mouseY = e.clientY; });
    function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
    function calcFace(refEl) {
      const r = refEl.getBoundingClientRect();
      const centerX = r.left + r.width / 2;
      const centerY = r.top + r.height / 3;
      const dx = state.mouseX - centerX;
      const dy = state.mouseY - centerY;
      return { faceX: clamp(dx / 20, -15, 15), faceY: clamp(dy / 30, -10, 10), bodySkew: clamp(-dx / 120, -6, 6) };
    }
    function scheduleBlink(which) {
      const wait = Math.random() * 4000 + 3000;
      setTimeout(function () {
        if (which === 'purple') state.isPurpleBlinking = true;
        if (which === 'black') state.isBlackBlinking = true;
        setTimeout(function () {
          if (which === 'purple') state.isPurpleBlinking = false;
          if (which === 'black') state.isBlackBlinking = false;
          scheduleBlink(which);
        }, 150);
      }, wait);
    }
    scheduleBlink('purple');
    scheduleBlink('black');
    let lookTimer = null;
    function setIsTyping(v) {
      state.isTyping = v;
      if (v) {
        state.isLookingAtEachOther = true;
        clearTimeout(lookTimer);
        lookTimer = setTimeout(function () { state.isLookingAtEachOther = false; }, 800);
      } else {
        state.isLookingAtEachOther = false;
        clearTimeout(lookTimer);
      }
    }
    let peekTimer = null;
    function schedulePeek() {
      clearTimeout(peekTimer);
      if (!(state.passwordLength > 0 && state.showPassword)) { state.isPurplePeeking = false; return; }
      const wait = Math.random() * 3000 + 2000;
      peekTimer = setTimeout(function () {
        state.isPurplePeeking = true;
        setTimeout(function () { state.isPurplePeeking = false; }, 800);
        schedulePeek();
      }, wait);
    }
    function setShowPassword(v) { state.showPassword = v; schedulePeek(); }
    function setPasswordLength(n) { state.passwordLength = n; schedulePeek(); }
    function setTransform(el, x, y) { el.style.transform = 'translate(' + x + 'px, ' + y + 'px)'; }
    function setPupilTransform(el, refEl, maxDistance, force) {
      if (force) { setTransform(el, force.x, force.y); return; }
      const r = refEl.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = state.mouseX - cx;
      const dy = state.mouseY - cy;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
      const ang = Math.atan2(dy, dx);
      setTransform(el, Math.cos(ang) * dist, Math.sin(ang) * dist);
    }
    function render() {
      const purplePos = calcFace(purple);
      const blackPos = calcFace(black);
      const orangePos = calcFace(orange);
      const yellowPos = calcFace(yellow);
      const isProtectedPassword = state.isPasswordFocused && !state.showPassword;
      const isErrorState = state.hasError;

      purple.style.height = ((state.isTyping || isErrorState) ? 428 : 400) + 'px';
      if (isErrorState) purple.style.transform = 'skewX(-8deg) translateX(18px)';
      else if (state.passwordLength > 0 && state.showPassword) purple.style.transform = 'skewX(0deg)';
      else if (isProtectedPassword) purple.style.transform = 'skewX(-2deg) translateX(6px) translateY(2px)';
      else if (state.isTyping) purple.style.transform = 'skewX(' + ((purplePos.bodySkew || 0) - 12) + 'deg) translateX(40px)';
      else purple.style.transform = 'skewX(' + (purplePos.bodySkew || 0) + 'deg)';
      purpleEyes.style.left = (isErrorState ? 52 : (state.passwordLength > 0 && state.showPassword) ? 20 : isProtectedPassword ? 34 : state.isLookingAtEachOther ? 55 : (45 + purplePos.faceX)) + 'px';
      purpleEyes.style.top = (isErrorState ? 54 : (state.passwordLength > 0 && state.showPassword) ? 35 : isProtectedPassword ? 30 : state.isLookingAtEachOther ? 65 : (40 + purplePos.faceY)) + 'px';

      if (isErrorState) black.style.transform = 'skewX(6deg) translateX(10px)';
      else if (state.passwordLength > 0 && state.showPassword) black.style.transform = 'skewX(0deg)';
      else if (isProtectedPassword) black.style.transform = 'skewX(2deg) translateX(-4px)';
      else if (state.isLookingAtEachOther) black.style.transform = 'skewX(' + (((blackPos.bodySkew || 0) * 1.5) + 10) + 'deg) translateX(20px)';
      else if (state.isTyping) black.style.transform = 'skewX(' + ((blackPos.bodySkew || 0) * 1.5) + 'deg)';
      else black.style.transform = 'skewX(' + (blackPos.bodySkew || 0) + 'deg)';
      blackEyes.style.left = (isErrorState ? 18 : (state.passwordLength > 0 && state.showPassword) ? 10 : isProtectedPassword ? 18 : state.isLookingAtEachOther ? 32 : (26 + blackPos.faceX)) + 'px';
      blackEyes.style.top = (isErrorState ? 18 : (state.passwordLength > 0 && state.showPassword) ? 28 : isProtectedPassword ? 24 : state.isLookingAtEachOther ? 12 : (32 + blackPos.faceY)) + 'px';

      orange.style.transform = isErrorState ? 'skewX(-3deg) translateY(6px)' : (state.passwordLength > 0 && state.showPassword) ? 'skewX(0deg)' : isProtectedPassword ? 'skewX(2deg) translateY(4px)' : 'skewX(' + (orangePos.bodySkew || 0) + 'deg)';
      yellow.style.transform = isErrorState ? 'skewX(3deg) translateY(5px)' : (state.passwordLength > 0 && state.showPassword) ? 'skewX(0deg)' : isProtectedPassword ? 'skewX(-2deg) translateY(2px)' : 'skewX(' + (yellowPos.bodySkew || 0) + 'deg)';
      orangeEyes.style.left = (isErrorState ? 72 : (state.passwordLength > 0 && state.showPassword) ? 50 : isProtectedPassword ? 86 : (82 + orangePos.faceX)) + 'px';
      orangeEyes.style.top = (isErrorState ? 104 : (state.passwordLength > 0 && state.showPassword) ? 85 : isProtectedPassword ? 100 : (90 + orangePos.faceY)) + 'px';
      yellowEyes.style.left = (isErrorState ? 46 : (state.passwordLength > 0 && state.showPassword) ? 20 : isProtectedPassword ? 56 : (52 + yellowPos.faceX)) + 'px';
      yellowEyes.style.top = (isErrorState ? 50 : (state.passwordLength > 0 && state.showPassword) ? 35 : isProtectedPassword ? 48 : (40 + yellowPos.faceY)) + 'px';
      yellowMouth.style.left = (isErrorState ? 42 : (state.passwordLength > 0 && state.showPassword) ? 10 : isProtectedPassword ? 46 : (40 + yellowPos.faceX)) + 'px';
      yellowMouth.style.top = (isErrorState ? 98 : (state.passwordLength > 0 && state.showPassword) ? 88 : isProtectedPassword ? 96 : (88 + yellowPos.faceY)) + 'px';
      eyeballs.forEach(function (eb) {
        const owner = eb.dataset.owner;
        const blink = owner === 'purple' ? state.isPurpleBlinking : state.isBlackBlinking;
        const w = parseFloat(getComputedStyle(eb).width);
        eb.style.height = blink ? '2px' : (w + 'px');
        eb.querySelectorAll('.pupil').forEach(function (p) { p.style.opacity = blink ? '0' : '1'; });
      });
      const purpleForce = isErrorState ? { x: 5, y: 2 } : (state.passwordLength > 0 && state.showPassword) ? { x: state.isPurplePeeking ? 6 : -6, y: state.isPurplePeeking ? 7 : -5 } : isProtectedPassword ? { x: -5, y: -4 } : state.isLookingAtEachOther ? { x: 3, y: 4 } : null;
      const blackForce = isErrorState ? { x: -5, y: 0 } : (state.passwordLength > 0 && state.showPassword) ? { x: -5, y: -5 } : isProtectedPassword ? { x: -4, y: -3 } : state.isLookingAtEachOther ? { x: 0, y: -4 } : null;
      eyeballs.forEach(function (eb) {
        const owner = eb.dataset.owner;
        const max = parseFloat(eb.dataset.max || '5');
        const p = eb.querySelector('.pupil');
        if (!p) return;
        const force = owner === 'purple' ? purpleForce : blackForce;
        setPupilTransform(p, eb, max, force || undefined);
      });
      const oyForce = isErrorState ? { x: -3, y: 1 } : (state.passwordLength > 0 && state.showPassword) ? { x: -6, y: -4 } : isProtectedPassword ? { x: 2, y: 0 } : null;
      pupilOnly.forEach(function (po) {
        const max = parseFloat(po.dataset.max || '5');
        setPupilTransform(po, po, max, oyForce || undefined);
      });
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    function setError(msg) {
      if (!msg) {
        state.hasError = false;
        errBox.style.display = 'none';
        errBox.textContent = '';
        return;
      }
      state.hasError = true;
      errBox.style.display = 'block';
      errBox.textContent = msg;
      setTimeout(function () { state.hasError = false; }, 900);
    }
    passwordEl.addEventListener('focus', function () {
      state.isPasswordFocused = true;
      setIsTyping(false);
    });
    passwordEl.addEventListener('blur', function () {
      state.isPasswordFocused = false;
      setIsTyping(false);
    });
    passwordEl.addEventListener('input', function () { setPasswordLength(passwordEl.value.length); setError(''); });
    togglePw.addEventListener('click', function () {
      const next = passwordEl.type !== 'text';
      passwordEl.type = next ? 'text' : 'password';
      togglePw.textContent = next ? '🙈' : '👁';
      setShowPassword(next);
      if (!next) state.isPurplePeeking = false;
    });
    themeBtn.addEventListener('click', function () {
      setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    document.getElementById('loginForm').addEventListener('submit', function (e) {
      e.preventDefault();
      setError('');
      const pw = passwordEl.value.trim();
      if (!pw) {
        setError('请输入管理密码后再继续。');
        passwordEl.focus();
        return;
      }
      loginBtn.disabled = true;
      const oldText = loginBtn.textContent;
      loginBtn.textContent = '正在进入后台...';
      document.cookie = 'auth=' + encodeURIComponent(pw) + '; path=/; Max-Age=31536000; SameSite=Lax';
      window.location.href = '/admin';
      setTimeout(function () {
        loginBtn.disabled = false;
        loginBtn.textContent = oldText;
      }, 1200);
    });
  </script></body></html>`;
}

// =============================================================================
// 后台主页
// =============================================================================
function dashPage(host, uuid, proxyip, subpass, poolDomains = [], activeIndex = 0, nodeCount = 0, echConfig = {}, hasPoolState = false) {
    const domainsJson = JSON.stringify(poolDomains);
    const echConfigJson = JSON.stringify(echConfig);
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
                <div style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">当前索引</div>
                <div style="font-size: 1.75rem; font-weight: 800; color: var(--primary);"># ${activeIndex}</div>
            </div>
            <div class="card" style="padding: 1.25rem;">
                <div style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem;">可用 IP 数</div>
                <div style="font-size: 1.75rem; font-weight: 800;">${nodeCount}</div>
            </div>
        </section>

        <main class="grid">
            <div class="card">
                <div class="card-header">🔗 订阅分发</div>
                <div class="input-group">
                    <label class="input-label">主订阅链接</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="subLink" value="https://${host}/${subpass}" readonly style="font-family: monospace; font-size: 0.85rem;">
                        <button class="btn btn-primary" onclick="copyVal('subLink')">复制</button>
                    </div>
                </div>
                <div class="input-group">
                    <label class="input-label">参数注入：ProxyIP（可选）</label>
                    <input type="text" id="customIP" value="${proxyip}" placeholder="例如：cf.proxy.com" oninput="updateLink()">
                </div>
                <div style="margin-top: 1rem; padding: 0.85rem 1rem; border-radius: 8px; background: var(--bg-page); border: 1px solid var(--border);">
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">ECH 当前状态</div>
                    <div id="subEchStatus" style="font-size: 0.95rem; font-weight: 700;">读取中...</div>
                    <div id="subEchDesc" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem; line-height: 1.6;"></div>
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
                <div class="card-header">🔁 域名切换池</div>
                <div id="domainList" style="margin-bottom: 1.5rem; max-height: 250px; overflow-y: auto;"></div>
                <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
                    <div style="flex: 1;">
                        <label class="input-label">手动强制切换索引</label>
                        <input type="number" id="targetIdx" placeholder="0 - ${poolDomains.length - 1}" min="0">
                    </div>
                    <button class="btn btn-primary" onclick="switchDomain()">立即执行</button>
                </div>
            </div>

            <div class="card" style="grid-column: 1 / -1;">
                <div class="card-header">🔐 ECH 配置</div>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <button id="echEnableBtn" class="btn btn-primary" type="button" onclick="setEchEnabled(true)">启用 ECH</button>
                    <button id="echDisableBtn" class="btn btn-ghost" type="button" onclick="setEchEnabled(false)">关闭 ECH</button>
                    <span id="echBadge" class="badge badge-muted" style="align-self: center;">未加载</span>
                </div>
                <div class="grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="input-group">
                        <label class="input-label">DoH 地址</label>
                        <input type="text" id="echDoh" placeholder="https://dns.example.com/dns-query">
                    </div>
                    <div class="input-group">
                        <label class="input-label">ECH 域名</label>
                        <input type="text" id="echQueryServerName" placeholder="cloudflare-ech.com">
                    </div>
                </div>
                <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; margin-top: 0.75rem;">
                    <button class="btn btn-primary" type="button" onclick="saveEchConfig()">保存 ECH 配置</button>
                    <span id="echSaveHint" style="font-size: 0.82rem; color: var(--text-muted);">${hasPoolState ? '保存到 POOL_STATE KV 后立即对新订阅生效。' : '未绑定 POOL_STATE，当前仅展示默认/环境变量配置。'}</span>
                </div>
                <div style="margin-top: 1rem; padding: 1rem; border-radius: 8px; background: var(--bg-page); border: 1px solid var(--border); font-family: monospace; font-size: 0.82rem; line-height: 1.7; word-break: break-all;">
                    <div>状态：<span id="echStatusText">读取中...</span></div>
                    <div>DoH：<span id="echStatusDoh">-</span></div>
                    <div>ECH 域名：<span id="echStatusQueryName">-</span></div>
                    <div>配置来源：<span id="echStatusSource">-</span></div>
                </div>
            </div>
        </main>
    </div>

    <div id="toast"></div>

    <script>
    const domains = ${domainsJson};
    const activeIdx = ${activeIndex};
    const subPass = "${subpass}";
    const initialEchConfig = ${echConfigJson};
    let echState = Object.assign({}, initialEchConfig);

    function renderDomains() {
        const list = document.getElementById('domainList');
        list.innerHTML = domains.map((d, i) => {
            const activeClass = i === activeIdx ? 'active' : '';
            const badgeClass = i === activeIdx ? 'badge-success' : 'badge-muted';
            const badgeText = i === activeIdx ? 'ACTIVE' : 'STANDBY';
            return '<div class="list-item ' + activeClass + '">' +
                '<div style="display: flex; flex-direction: column;">' +
                    '<span style="font-size: 0.9rem; font-weight: 600;">' + d + '</span>' +
                    '<span style="font-size: 0.7rem; color: var(--text-muted); font-family: monospace;">Index: ' + i + '</span>' +
                '</div>' +
                '<span class="badge ' + badgeClass + '">' + badgeText + '</span>' +
            '</div>';
        }).join('');
    }

    function updateLink() {
        const ip = document.getElementById('customIP').value.trim();
        const base = "https://" + window.location.hostname + "/" + subPass;
        document.getElementById('subLink').value = ip ? base + "?proxyip=" + ip : base;
    }

    function renderEchCard() {
        const enabled = echState && echState.enabled;
        const badge = document.getElementById('echBadge');
        const enableBtn = document.getElementById('echEnableBtn');
        const disableBtn = document.getElementById('echDisableBtn');
        const statusText = enabled ? '已启用' : '未启用';
        const statusColor = enabled ? 'var(--success)' : 'var(--text-muted)';
        badge.textContent = statusText;
        badge.className = 'badge ' + (enabled ? 'badge-success' : 'badge-muted');
        enableBtn.className = 'btn ' + (enabled ? 'btn-primary' : 'btn-ghost');
        disableBtn.className = 'btn ' + (!enabled ? 'btn-primary' : 'btn-ghost');
        document.getElementById('echDoh').value = echState.doh || '';
        document.getElementById('echQueryServerName').value = echState.queryServerName || '';
        document.getElementById('echStatusText').textContent = statusText;
        document.getElementById('echStatusText').style.color = statusColor;
        document.getElementById('echStatusDoh').textContent = echState.doh || '-';
        document.getElementById('echStatusQueryName').textContent = echState.queryServerName || '-';
        document.getElementById('echStatusSource').textContent = echState.source || '-';
        document.getElementById('subEchStatus').textContent = enabled ? 'ECH 已启用' : 'ECH 未启用';
        document.getElementById('subEchStatus').style.color = statusColor;
        document.getElementById('subEchDesc').textContent = enabled
            ? '生成的节点 URI 会附带 ech、alpn 和 fp=chrome，由客户端通过 DoH 动态获取 ECHConfig。'
            : '当前订阅保持普通 TLS 输出，不追加 ech 参数。';
    }

    function setEchEnabled(enabled) {
        echState.enabled = !!enabled;
        renderEchCard();
    }

    async function loadEchConfig() {
        try {
            const res = await fetch('/admin/config', { headers: { 'Accept': 'application/json' } });
            if (!res.ok) throw new Error('读取配置失败');
            echState = await res.json();
        } catch (e) {
            showToast('ECH 配置读取失败，已展示当前默认值');
        }
        renderEchCard();
    }

    async function saveEchConfig() {
        echState.doh = document.getElementById('echDoh').value.trim();
        echState.queryServerName = document.getElementById('echQueryServerName').value.trim();
        try {
            const res = await fetch('/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ech_enabled: echState.enabled ? 'yes' : 'no',
                    ech_doh: echState.doh,
                    ech_query_server_name: echState.queryServerName
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || '保存失败');
            echState = data;
            renderEchCard();
            showToast('ECH 配置已保存并生效');
        } catch (e) {
            showToast(e.message || 'ECH 配置保存失败');
        }
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
        showToast("已成功复制到剪贴板");
    }

    async function switchDomain() {
        const idx = document.getElementById('targetIdx').value;
        if(idx === "") return;
        const res = await fetch('/admin/switch?index=' + idx);
        if(res.ok) {
            showToast("正在应用调度策略...");
            setTimeout(() => location.reload(), 800);
        }
    }

    function logout() {
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        location.reload();
    }

    renderDomains();
    updateLink();
    renderEchCard();
    loadEchConfig();
    </script></body></html>`;
}

// =============================================================================
// 核心业务逻辑（保留并微调）
// =============================================================================
function getEnv(env, key, fallback) { return env[key] || fallback; }

function normalizeYesNo(value, fallback = 'no') {
    if (typeof value === 'boolean') return value ? 'yes' : 'no';
    if (value === undefined || value === null) return fallback;
    const normalized = String(value).trim().toLowerCase();
    if (['yes', 'true', '1', 'on'].includes(normalized)) return 'yes';
    if (['no', 'false', '0', 'off'].includes(normalized)) return 'no';
    return fallback;
}

async function readEchConfig(env) {
    const envEnabled = normalizeYesNo(getEnv(env, 'ECH', DEFAULT_ECH_ENABLED), DEFAULT_ECH_ENABLED);
    const envDoh = String(getEnv(env, 'ECH_DOH', DEFAULT_ECH_DOH) || DEFAULT_ECH_DOH).trim() || DEFAULT_ECH_DOH;
    const envQueryServerName = String(getEnv(env, 'ECH_QUERY_SERVER_NAME', DEFAULT_ECH_QUERY_SERVER_NAME) || DEFAULT_ECH_QUERY_SERVER_NAME).trim() || DEFAULT_ECH_QUERY_SERVER_NAME;

    let enabled = envEnabled;
    let doh = envDoh;
    let queryServerName = envQueryServerName;
    let source = 'environment';

    if (env.POOL_STATE) {
        const [kvEnabled, kvDoh, kvQueryServerName] = await Promise.all([
            env.POOL_STATE.get('ech_enabled'),
            env.POOL_STATE.get('ech_doh'),
            env.POOL_STATE.get('ech_query_server_name')
        ]);

        if (kvEnabled !== null || kvDoh !== null || kvQueryServerName !== null) {
            enabled = normalizeYesNo(kvEnabled, envEnabled);
            doh = String(kvDoh || envDoh || DEFAULT_ECH_DOH).trim() || DEFAULT_ECH_DOH;
            queryServerName = String(kvQueryServerName || envQueryServerName || DEFAULT_ECH_QUERY_SERVER_NAME).trim() || DEFAULT_ECH_QUERY_SERVER_NAME;
            source = 'kv';
        }
    }

    return {
        enabled: enabled === 'yes',
        doh,
        queryServerName,
        source,
        kvBound: !!env.POOL_STATE
    };
}

async function saveEchConfig(env, payload = {}) {
    if (!env.POOL_STATE) {
        throw new Error('POOL_STATE 未绑定，无法保存 ECH 配置');
    }

    const currentConfig = await readEchConfig(env);
    const enabled = normalizeYesNo(payload.ech_enabled, currentConfig.enabled ? 'yes' : 'no');
    const doh = String(payload.ech_doh || '').trim() || DEFAULT_ECH_DOH;
    const queryServerName = String(payload.ech_query_server_name || '').trim() || DEFAULT_ECH_QUERY_SERVER_NAME;

    await Promise.all([
        env.POOL_STATE.put('ech_enabled', enabled),
        env.POOL_STATE.put('ech_doh', doh),
        env.POOL_STATE.put('ech_query_server_name', queryServerName)
    ]);

    return readEchConfig(env);
}

async function getCustomIPs(env) {
    let ips = getEnv(env, 'ADD', "");
    const addApi = getEnv(env, 'ADDAPI', "");
    const addCsv = getEnv(env, 'ADDCSV', "");
    
    if (addApi) {
        for (const url of addApi.split('\n').filter(u => u.trim())) {
            try { const r = await fetch(url.trim()); if (r.ok) ips += "\n" + await r.text(); } catch(e){}
        }
    }
    if (addCsv) {
        for (const url of addCsv.split('\n').filter(u => u.trim())) {
            try { 
                const r = await fetch(url.trim()); 
                if (r.ok) {
                    const text = await r.text();
                    text.split('\n').forEach(line => {
                        const p = line.split(',');
                        if (p.length >= 2) ips += `\n${p[0].trim()}:443#${p[1].trim()}`;
                    });
                }
            } catch(e){}
        }
    }
    return ips;
}

function genNodes(hosts, u, p, ipsText, ps = "", defaultIP = "", echConfig = { enabled: false, doh: DEFAULT_ECH_DOH, queryServerName: DEFAULT_ECH_QUERY_SERVER_NAME }) {
    const lines = ipsText.split('\n').filter(l => l.trim());
    const finalPath = (p && p.trim() !== defaultIP) ? `${NODE_DEFAULT_PATH}?proxyip=${p.trim()}` : NODE_DEFAULT_PATH;
    
    return lines.map(line => {
        const [addr, name] = line.split('#');
        if (!addr) return null;
        let [ip, port] = addr.trim().split(':');
        if (!port) port = "443";
        
        return hosts.map((h, i) => {
            const nName = `${name || 'Edge'}${hosts.length > 1 ? '-N'+(i+1) : ''} ${ps}`.trim();
            const params = new URLSearchParams({
                encryption: 'none',
                security: 'tls',
                sni: h,
                fp: echConfig.enabled ? 'chrome' : 'random',
                allowInsecure: '1',
                type: 'ws',
                host: h,
                path: finalPath
            });
            if (echConfig.enabled) {
                params.set('alpn', 'h3,h2,http/1.1');
                params.set('ech', `${echConfig.queryServerName}+${echConfig.doh}`);
            } else {
                params.set('alpn', 'h3');
            }
            return `${PT_TYPE}://${u}@${ip}:${port}?${params.toString()}#${encodeURIComponent(nName)}`;
        }).join('\n');
    }).filter(Boolean).join('\n');
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
            const _PROXY_IP = _PROXY_IP_RAW ? _PROXY_IP_RAW.split(/[\n,]/)[0].trim() : "";
            const _PS = getEnv(env, 'PS', "");
            const _POOL_DOMAINS = getEnv(env, 'POOL_DOMAINS', host).split(',').map(d => d.trim()).filter(Boolean);
            const echConfig = await readEchConfig(env);

            // 1. 订阅分发（KV 轮换）
            if ((_SUB_PW && url.pathname === `/${_SUB_PW}`) || (url.pathname === '/sub' && url.searchParams.get('uuid') === _UUID)) {
                let idx = 0;
                if (env.POOL_STATE) {
                    const stored = await env.POOL_STATE.get('domain_index');
                    if (stored) idx = parseInt(stored, 10) || 0;
                    await env.POOL_STATE.put('domain_index', String((idx + 1) % _POOL_DOMAINS.length));
                }
                const activeDomain = _POOL_DOMAINS[idx % _POOL_DOMAINS.length];
                const allIPs = await getCustomIPs(env);
                const nodes = genNodes([activeDomain], _UUID, url.searchParams.get('proxyip') || _PROXY_IP, allIPs, _PS, _PROXY_IP, echConfig);
                return new Response(btoa(unescape(encodeURIComponent(nodes))), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
            }

            // 2. 后台控制
            if (url.pathname.startsWith('/admin')) {
                if (_WEB_PW) {
                    const cookie = request.headers.get('Cookie') || "";
                    if (!cookie.includes(`auth=${_WEB_PW}`)) return new Response(loginPage(), { headers: { 'Content-Type': 'text/html' } });
                }
                
                if (url.pathname === '/admin/switch') {
                    const idx = url.searchParams.get('index');
                    if (env.POOL_STATE && idx !== null) {
                        await env.POOL_STATE.put('domain_index', idx);
                        return new Response(JSON.stringify({ok: true}), { headers: { 'Content-Type': 'application/json' } });
                    }
                }

                if (url.pathname === '/admin/config' && request.method === 'GET') {
                    return new Response(JSON.stringify(echConfig), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
                }

                if (url.pathname === '/admin/config' && request.method === 'POST') {
                    try {
                        const payload = await request.json();
                        const savedConfig = await saveEchConfig(env, payload);
                        return new Response(JSON.stringify(savedConfig), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
                    } catch (error) {
                        return new Response(JSON.stringify({ error: error.message || '保存失败' }), {
                            status: 400,
                            headers: { 'Content-Type': 'application/json; charset=utf-8' }
                        });
                    }
                }

                let idx = 0;
                if (env.POOL_STATE) {
                    const stored = await env.POOL_STATE.get('domain_index');
                    idx = parseInt(stored, 10) || 0;
                }
                const allIPs = await getCustomIPs(env);
                const count = allIPs.split('\n').filter(l => l.trim()).length;
                return new Response(dashPage(host, _UUID, _PROXY_IP, _SUB_PW, _POOL_DOMAINS, idx % _POOL_DOMAINS.length, count, echConfig, !!env.POOL_STATE), { headers: { 'Content-Type': 'text/html' } });
            }

            if (url.pathname === '/') return Response.redirect(getEnv(env, 'ROOT_REDIRECT_URL', ROOT_REDIRECT_URL), 302);
            return new Response('Not Found', { status: 404 });
        } catch (e) { return new Response(e.stack, { status: 500 }); }
    }
};
