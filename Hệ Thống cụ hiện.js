(function () {
    'use strict';

    const TH = window.TavernHelper;
    if (!TH || typeof TH.getVariables !== 'function') {
        console.warn('[Hệ Thống] Không phát hiện JS-Slash-Runner / TavernHelper, dừng script.');
        return;
    }

    const NS = 'nailong_system_panel';
    const LS_KEY = 'nlsp_api_config';
    const LS_FULL_KEY = 'nlsp_full_state';
    const OVERLAY_ID = 'nlsp-overlay';
    const STYLE_ID = 'nlsp-style';

    const DRAW_COST_ONE = 100;
    const DRAW_COST_TEN = 900;

    /* Giao diện preset chính thức (đều kết thúc bằng đường dẫn tương thích OpenAI) */
    const API_PRESETS = [
        { id: 'openai',   name: 'OpenAI',   url: 'https://api.openai.com/v1',                              hint: 'OpenAI Chính Thức' },
        { id: 'gemini',   name: 'Gemini',   url: 'https://generativelanguage.googleapis.com/v1beta/openai', hint: 'Google Gemini (Tương thích OpenAI)' },
        { id: 'deepseek', name: 'DeepSeek', url: 'https://api.deepseek.com/v1',                            hint: 'DeepSeek' },
        { id: 'claude',   name: 'Claude',   url: 'https://api.anthropic.com/v1',                           hint: 'Anthropic Claude' }
    ];
    function presetByUrl(url) {
        const u = String(url || '').trim().replace(/\/+$/, '');
        return API_PRESETS.find((p) => p.url === u);
    }

    const cyber = { cyan: '#38e0ff', blue: '#2b6bff', deep: '#06121f', deep2: '#0a2438', accent: '#5cd6ff' };

    /* huashu-design - 10 giao diện toàn ký */
    const THEMES = {"hl-light":{"name":"Xanh Sáng","icon":"☀","desc":"Nền xanh nhạt·Khoa học viễn tưởng","var":{"bg":"#d8e6f6","bg2":"#c8ddf0","topBg":"rgba(195,215,240,.92)","text":"#0c1c30","title":"#051028","muted":"rgba(35,60,105,.88)","accent":"#0e58b8","accent2":"#064098","neon":"rgba(45,135,225,.92)","neon2":"rgba(18,65,150,.82)","success":"#186840","warn":"#9c6020","pur":"#5248b0","err":"#c02838","cardBg":"rgba(218,235,250,.94)","cardBorder":"rgba(38,105,185,.28)","inputBg":"rgba(232,240,252,.96)","inputBorder":"rgba(32,95,170,.28)","btnBg":"rgba(12,60,138,.8)","btnBg2":"rgba(16,85,172,.58)","btnBorder":"rgba(42,125,210,.42)","btnText":"#e6f2ff","btnBgH":"rgba(16,78,165,.88)","btnBg2H":"rgba(22,105,208,.7)","shellBorder":"rgba(42,105,178,.24)","msgUser":"rgba(155,198,235,.84)","msgAi":"rgba(212,234,250,.92)","warnColor":"#9c6020","overlay":"rgba(165,202,236,.84)","vignette":"rgba(145,185,220,.5)","w":"rgba(0,0,0,.04)","ballBg":"rgba(185,208,238,.88)","ballBgH":"rgba(165,190,228,.94)"}},"hl-dark":{"name":"Tối Hologram","icon":"🌙","desc":"Nền đen than·Neon cyan xanh","var":{"bg":"#060e1a","bg2":"#0a1628","topBg":"rgba(14,22,45,.65)","text":"#c8ddf8","title":"#e4eeff","muted":"rgba(130,180,220,.58)","accent":"#60b0f8","accent2":"#2880d0","neon":"rgba(100,190,255,.92)","neon2":"rgba(40,120,210,.82)","success":"#38a068","warn":"#c8a050","pur":"#8878e0","err":"#f05878","cardBg":"rgba(10,20,45,.65)","cardBorder":"rgba(35,95,195,.22)","inputBg":"rgba(6,14,30,.85)","inputBorder":"rgba(35,95,195,.28)","btnBg":"rgba(18,55,125,.72)","btnBg2":"rgba(28,85,175,.52)","btnBorder":"rgba(55,145,240,.38)","btnText":"#c0def8","btnBgH":"rgba(28,75,155,.82)","btnBg2H":"rgba(38,105,215,.62)","shellBorder":"rgba(55,85,128,.2)","msgUser":"rgba(28,75,155,.48)","msgAi":"rgba(10,20,45,.65)","warnColor":"#c8a050","overlay":"rgba(3,6,14,.84)","vignette":"transparent","w":"rgba(255,255,255,.03)","ballBg":"rgba(12,22,45,.72)","ballBgH":"rgba(28,55,125,.82)"}},"hl-blood":{"name":"Huyết Tộc","icon":"🩸","desc":"Vực thẳm đỏ·Phù hiệu Huyết tộc","var":{"bg":"#0c0606","bg2":"#140a0a","topBg":"rgba(30,10,10,.7)","text":"#e8d0d0","title":"#ffd0d0","muted":"rgba(190,140,140,.6)","accent":"#c83038","accent2":"#981820","neon":"rgba(255,70,70,.9)","neon2":"rgba(200,30,30,.8)","success":"#58a040","warn":"#c89830","pur":"#9050b0","err":"#ff4040","cardBg":"rgba(22,8,8,.72)","cardBorder":"rgba(170,35,40,.28)","inputBg":"rgba(14,6,6,.9)","inputBorder":"rgba(170,35,40,.32)","btnBg":"rgba(140,20,30,.72)","btnBg2":"rgba(180,40,50,.52)","btnBorder":"rgba(220,50,60,.42)","btnText":"#ffe0e0","btnBgH":"rgba(160,28,38,.84)","btnBg2H":"rgba(200,48,58,.64)","shellBorder":"rgba(140,25,35,.24)","msgUser":"rgba(180,40,50,.48)","msgAi":"rgba(22,8,8,.72)","warnColor":"#c89830","overlay":"rgba(6,3,3,.86)","vignette":"transparent","w":"rgba(255,255,255,.03)","ballBg":"rgba(22,8,8,.78)","ballBgH":"rgba(140,20,30,.72)"}},"hl-green":{"name":"Xanh Lá","icon":"🌿","desc":"Sương sớm lá mới·Tự nhiên trong lành","var":{"bg":"#e6f4e6","bg2":"#d6ecd6","topBg":"rgba(200,230,200,.92)","text":"#122812","title":"#081c08","muted":"rgba(40,100,40,.88)","accent":"#289040","accent2":"#187030","neon":"rgba(50,190,70,.92)","neon2":"rgba(25,140,45,.82)","success":"#2a8048","warn":"#b08030","pur":"#7050b8","err":"#d84040","cardBg":"rgba(222,244,224,.94)","cardBorder":"rgba(35,145,55,.28)","inputBg":"rgba(234,248,235,.96)","inputBorder":"rgba(28,125,45,.28)","btnBg":"rgba(18,115,38,.8)","btnBg2":"rgba(25,145,50,.58)","btnBorder":"rgba(45,175,65,.42)","btnText":"#e6ffe8","btnBgH":"rgba(22,135,45,.88)","btnBg2H":"rgba(30,165,58,.7)","shellBorder":"rgba(38,125,55,.24)","msgUser":"rgba(168,222,178,.84)","msgAi":"rgba(218,242,222,.92)","warnColor":"#b08030","overlay":"rgba(172,222,182,.84)","vignette":"rgba(145,205,160,.5)","w":"rgba(0,0,0,.04)","ballBg":"rgba(192,222,198,.88)","ballBgH":"rgba(172,208,182,.94)"}},"hl-gold":{"name":"Hoàng Kim","icon":"👑","desc":"Vàng hoàng đế·Uy nghi đế vương","var":{"bg":"#181208","bg2":"#221808","topBg":"rgba(35,20,8,.72)","text":"#f0e8d0","title":"#ffe8a0","muted":"rgba(195,175,120,.62)","accent":"#d4a030","accent2":"#b08020","neon":"rgba(240,200,60,.92)","neon2":"rgba(200,150,30,.82)","success":"#58a840","warn":"#e0b040","pur":"#9070c8","err":"#e85050","cardBg":"rgba(28,18,6,.72)","cardBorder":"rgba(175,135,30,.28)","inputBg":"rgba(18,12,5,.9)","inputBorder":"rgba(175,135,30,.32)","btnBg":"rgba(150,110,20,.72)","btnBg2":"rgba(190,140,30,.52)","btnBorder":"rgba(220,165,45,.42)","btnText":"#fff8e0","btnBgH":"rgba(170,130,28,.84)","btnBg2H":"rgba(210,158,38,.64)","shellBorder":"rgba(145,105,25,.24)","msgUser":"rgba(180,135,35,.48)","msgAi":"rgba(28,18,6,.72)","warnColor":"#e0b040","overlay":"rgba(8,6,2,.86)","vignette":"transparent","w":"rgba(255,255,255,.04)","ballBg":"rgba(28,18,6,.78)","ballBgH":"rgba(150,110,20,.72)"}},"hl-purple":{"name":"Thủy Tinh Tím","icon":"🔮","desc":"Vực tím tối·Ảo cảnh pha lê","var":{"bg":"#0e0a1a","bg2":"#140e26","topBg":"rgba(20,14,38,.72)","text":"#d8c8f0","title":"#ece0ff","muted":"rgba(160,130,200,.62)","accent":"#a860e8","accent2":"#8040c8","neon":"rgba(180,120,255,.92)","neon2":"rgba(130,70,210,.82)","success":"#50b070","warn":"#d0a050","pur":"#c070e0","err":"#e85090","cardBg":"rgba(18,10,32,.72)","cardBorder":"rgba(120,60,180,.28)","inputBg":"rgba(10,6,20,.9)","inputBorder":"rgba(120,60,180,.32)","btnBg":"rgba(80,30,140,.72)","btnBg2":"rgba(120,50,180,.52)","btnBorder":"rgba(160,80,220,.42)","btnText":"#f0e0ff","btnBgH":"rgba(100,40,160,.84)","btnBg2H":"rgba(140,60,200,.64)","shellBorder":"rgba(80,40,120,.24)","msgUser":"rgba(120,50,180,.48)","msgAi":"rgba(18,10,32,.72)","warnColor":"#d0a050","overlay":"rgba(6,3,12,.86)","vignette":"transparent","w":"rgba(255,255,255,.03)","ballBg":"rgba(18,10,32,.78)","ballBgH":"rgba(80,30,140,.72)"}},"hl-cyber":{"name":"Cyberpunk","icon":"🌃","desc":"Neon hồng cyan·Đô thị tương lai","var":{"bg":"#0a0a12","bg2":"#0e0e1c","topBg":"rgba(14,14,28,.75)","text":"#d0e8f0","title":"#00ffe8","muted":"rgba(100,180,200,.6)","accent":"#ff2a8a","accent2":"#cc1066","neon":"rgba(0,255,224,.92)","neon2":"rgba(0,200,180,.82)","success":"#00ff80","warn":"#ffcc00","pur":"#c040ff","err":"#ff3060","cardBg":"rgba(12,12,24,.72)","cardBorder":"rgba(0,200,180,.25)","inputBg":"rgba(8,8,16,.9)","inputBorder":"rgba(255,42,138,.3)","btnBg":"rgba(180,20,80,.72)","btnBg2":"rgba(0,150,140,.52)","btnBorder":"rgba(0,255,224,.4)","btnText":"#e0fff8","btnBgH":"rgba(220,30,100,.84)","btnBg2H":"rgba(0,200,180,.64)","shellBorder":"rgba(0,150,140,.22)","msgUser":"rgba(180,20,80,.45)","msgAi":"rgba(12,12,24,.72)","warnColor":"#ffcc00","overlay":"rgba(4,4,8,.88)","vignette":"transparent","w":"rgba(0,255,224,.02)","ballBg":"rgba(12,12,24,.78)","ballBgH":"rgba(0,150,140,.72)"}},"hl-ocean":{"name":"Biển Sâu","icon":"🌊","desc":"Đại dương sâu·Thủy triều cuộn","var":{"bg":"#04161e","bg2":"#061e28","topBg":"rgba(6,30,40,.72)","text":"#b8e0e8","title":"#e0f8ff","muted":"rgba(100,160,180,.6)","accent":"#20c8d0","accent2":"#1090a0","neon":"rgba(40,200,220,.92)","neon2":"rgba(20,140,170,.82)","success":"#30b888","warn":"#d0a040","pur":"#6080d0","err":"#e85060","cardBg":"rgba(6,22,30,.72)","cardBorder":"rgba(30,160,180,.26)","inputBg":"rgba(4,16,22,.9)","inputBorder":"rgba(30,160,180,.3)","btnBg":"rgba(16,80,100,.72)","btnBg2":"rgba(20,120,140,.52)","btnBorder":"rgba(40,200,220,.4)","btnText":"#e0f8ff","btnBgH":"rgba(20,100,120,.84)","btnBg2H":"rgba(30,160,180,.64)","shellBorder":"rgba(20,100,120,.22)","msgUser":"rgba(20,120,140,.45)","msgAi":"rgba(6,22,30,.72)","warnColor":"#d0a040","overlay":"rgba(2,10,14,.86)","vignette":"transparent","w":"rgba(40,200,220,.025)","ballBg":"rgba(6,22,30,.78)","ballBgH":"rgba(16,80,100,.72)"}},"hl-sakura":{"name":"Hoa Anh Đào","icon":"🌸","desc":"Nắng ấm hoa anh đào·Giấc mơ dịu dàng","var":{"bg":"#fce8ee","bg2":"#f8dce6","topBg":"rgba(245,215,228,.92)","text":"#2a0e1a","title":"#1a0612","muted":"rgba(120,60,90,.88)","accent":"#e85090","accent2":"#c83070","neon":"rgba(232,80,144,.92)","neon2":"rgba(200,48,112,.82)","success":"#40a068","warn":"#c08030","pur":"#9060c0","err":"#d83048","cardBg":"rgba(252,232,238,.94)","cardBorder":"rgba(200,80,130,.28)","inputBg":"rgba(255,240,245,.96)","inputBorder":"rgba(200,80,130,.28)","btnBg":"rgba(200,48,112,.8)","btnBg2":"rgba(232,80,144,.58)","btnBorder":"rgba(240,100,160,.42)","btnText":"#fff0f5","btnBgH":"rgba(220,58,122,.88)","btnBg2H":"rgba(245,100,165,.7)","shellBorder":"rgba(200,80,130,.24)","msgUser":"rgba(232,168,195,.84)","msgAi":"rgba(252,232,238,.92)","warnColor":"#c08030","overlay":"rgba(232,188,210,.84)","vignette":"rgba(220,170,195,.5)","w":"rgba(0,0,0,.03)","ballBg":"rgba(245,210,225,.88)","ballBgH":"rgba(232,180,200,.94)"}},"hl-ink":{"name":"Thủy Mặc","icon":"🖌","desc":"Mực trên giấy·Phong cách cổ điển","var":{"bg":"#f5f2ee","bg2":"#ede8e0","topBg":"rgba(230,222,210,.92)","text":"#2a2a2a","title":"#0a0a0a","muted":"rgba(80,75,70,.88)","accent":"#8a6a3a","accent2":"#6a5028","neon":"rgba(138,106,58,.82)","neon2":"rgba(106,80,40,.72)","success":"#4a8050","warn":"#a07820","pur":"#604878","err":"#a83838","cardBg":"rgba(245,240,232,.94)","cardBorder":"rgba(120,100,70,.25)","inputBg":"rgba(250,248,242,.96)","inputBorder":"rgba(120,100,70,.25)","btnBg":"rgba(70,55,35,.82)","btnBg2":"rgba(100,80,50,.6)","btnBorder":"rgba(138,106,58,.4)","btnText":"#f5f0e8","btnBgH":"rgba(90,70,45,.9)","btnBg2H":"rgba(120,95,60,.72)","shellBorder":"rgba(100,85,60,.22)","msgUser":"rgba(180,165,140,.7)","msgAi":"rgba(245,240,232,.92)","warnColor":"#a07820","overlay":"rgba(200,190,175,.82)","vignette":"rgba(180,170,155,.4)","w":"rgba(0,0,0,.04)","ballBg":"rgba(225,215,200,.88)","ballBgH":"rgba(205,195,178,.94)"}}};

    const DEFAULT_PERSONA = {
        name: 'Chị Gái Dịu Dàng',
        role: 'Trợ Lý Hệ Thống',
        tone: 'Dịu dàng, quan tâm, khích lệ, như người chị lớn quan tâm bạn',
        rules: 'Khi trả lời dùng đại từ ngôi thứ hai, dùng nhiều lời khích lệ, tránh giáo huấn; trả lời ngắn gọn nhưng giữ sự thân thiện.'
    };

    function getDefaultState() {
        return {
            schema: 3,
            enabled: false,
            connected: false,
            initialized: false,
            points: 0,
            api: { url: '', key: '', model: '', models: [], maxTokens: 30000 },
            system: { name: '', purpose: '', summary: '', greeting: '' },
            worldbook: { name: '', summary: '', entries: [] },
            persona: { ...DEFAULT_PERSONA },
            tasks: [],
            shop: [],
            inventory: [],
            draws: [],
            chat: [],
            theme: 'hl-dark',
            exclusiveFunctions: [],
            exclusivePreferences: [],
            exclusiveFunctionCount: 1,
            exclComplexity: 'simple',
            autoRefresh: false,
            contextFloors: 10,
            refreshInterval: 1,
            panelW: 0,
            panelH: 0,
            scaleLocked: true
        };
    }

    let state = loadState();

    function loadState() {
        let s = getDefaultState();
        /* 优先从 localStorage 还原完整设置 */
        try {
            const ls = window.parent && window.parent.localStorage ? window.parent.localStorage : window.localStorage;
            const fullRaw = ls.getItem(LS_FULL_KEY);
            if (fullRaw) {
                const fullState = JSON.parse(fullRaw);
                if (fullState && typeof fullState === 'object' && fullState.schema === getDefaultState().schema) {
                    const def = getDefaultState();
                    s = Object.assign(def, fullState);
                    s.api = Object.assign(def.api, (fullState && fullState.api) || {});
                    s.system = Object.assign(def.system, (fullState && fullState.system) || {});
                    s.worldbook = Object.assign(def.worldbook, (fullState && fullState.worldbook) || {});
                    s.persona = Object.assign(def.persona, (fullState && fullState.persona) || {});
                    if (!Array.isArray(s.tasks)) s.tasks = [];
                    if (!Array.isArray(s.shop)) s.shop = [];
                    if (!Array.isArray(s.inventory)) s.inventory = [];
                    if (!Array.isArray(s.draws)) s.draws = [];
                    if (!Array.isArray(s.chat)) s.chat = [];
                    if (!Array.isArray(s.exclusiveFunctions)) s.exclusiveFunctions = [];
                    if (!Array.isArray(s.exclusivePreferences)) s.exclusivePreferences = [];
                    if (typeof s.exclusiveFunctionCount !== 'number' || s.exclusiveFunctionCount < 1) s.exclusiveFunctionCount = 1;
                    if (s.exclComplexity !== 'simple' && s.exclComplexity !== 'complex') s.exclComplexity = 'simple';
                    if (typeof s.exclCostPoints !== 'boolean') s.exclCostPoints = false;
                    if (typeof s.autoRefresh !== 'boolean') s.autoRefresh = false;
                    if (typeof s.contextFloors !== 'number' || s.contextFloors < 1) s.contextFloors = 10;
                    if (typeof s.refreshInterval !== 'number' || s.refreshInterval < 1) s.refreshInterval = 1;
                    if (typeof s.panelW !== 'number' || s.panelW < 0) s.panelW = 0;
                    if (typeof s.panelH !== 'number' || s.panelH < 0) s.panelH = 0;
                    if (typeof s.scaleLocked !== 'boolean') s.scaleLocked = true;
                    if (!s.theme || !THEMES[s.theme]) s.theme = 'hl-dark';
                    return s;
                }
            }
        } catch (e) {
            console.warn('[Hệ Thống] Lỗi đọc toàn bộ localStorage: ', e);
        }
        try {
            const vars = TH.getVariables({ type: 'script' });
            const data = vars && vars[NS];
            if (data && typeof data === 'object') {
                const def = getDefaultState();
                s = Object.assign(def, data);
                s.api = Object.assign(def.api, (data && data.api) || {});
                s.system = Object.assign(def.system, (data && data.system) || {});
                s.worldbook = Object.assign(def.worldbook, (data && data.worldbook) || {});
                s.persona = Object.assign(def.persona, (data && data.persona) || {});
                if (!Array.isArray(s.tasks)) s.tasks = [];
                if (!Array.isArray(s.shop)) s.shop = [];
                if (!Array.isArray(s.inventory)) s.inventory = [];
                if (!Array.isArray(s.draws)) s.draws = [];
                if (!Array.isArray(s.chat)) s.chat = [];
                if (!Array.isArray(s.exclusiveFunctions)) s.exclusiveFunctions = [];
                if (!Array.isArray(s.exclusivePreferences)) s.exclusivePreferences = [];
                if (typeof s.exclusiveFunctionCount !== 'number' || s.exclusiveFunctionCount < 1) s.exclusiveFunctionCount = 1;
                if (s.exclComplexity !== 'simple' && s.exclComplexity !== 'complex') s.exclComplexity = 'simple';
                if (typeof s.exclCostPoints !== 'boolean') s.exclCostPoints = false;
                if (typeof s.autoRefresh !== 'boolean') s.autoRefresh = false;
                if (typeof s.contextFloors !== 'number' || s.contextFloors < 1) s.contextFloors = 10;
                if (typeof s.refreshInterval !== 'number' || s.refreshInterval < 1) s.refreshInterval = 1;
                if (typeof s.panelW !== 'number' || s.panelW < 0) s.panelW = 0;
                if (typeof s.panelH !== 'number' || s.panelH < 0) s.panelH = 0;
                if (typeof s.scaleLocked !== 'boolean') s.scaleLocked = true;
                if (!s.theme || !THEMES[s.theme]) s.theme = 'hl-dark';
            }
        } catch (e) {
            console.warn('[Hệ Thống] Lỗi đọc trạng thái: ', e);
        }
        /* 从 localStorage 还原 API 配置（跨会话持久） */
        try {
            const ls = window.parent && window.parent.localStorage ? window.parent.localStorage : window.localStorage;
            const raw = ls.getItem(LS_KEY);
            if (raw) {
                const cfg = JSON.parse(raw);
                if (cfg) {
                    if (typeof cfg.url === 'string') s.api.url = cfg.url;
                    if (typeof cfg.key === 'string') s.api.key = cfg.key;
                    if (typeof cfg.model === 'string') s.api.model = cfg.model;
                    if (Array.isArray(cfg.models)) s.api.models = cfg.models;
                    if (cfg.connected) s.connected = true;
                }
            }
        } catch (e) {
            console.warn('[Hệ Thống] Lỗi đọc localStorage: ', e);
        }
        return s;
    }

    function saveState() {
        try {
            TH.insertOrAssignVariables({ [NS]: state }, { type: 'script' });
        } catch (e) {
            console.warn('[Hệ Thống] Lỗi lưu trạng thái: ', e);
        }
        try {
            const ls = window.parent && window.parent.localStorage ? window.parent.localStorage : window.localStorage;
            ls.setItem(LS_FULL_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('[Hệ Thống] Lỗi lưu toàn bộ localStorage: ', e);
        }
    }

    function saveApiToLS() {
        try {
            const ls = window.parent && window.parent.localStorage ? window.parent.localStorage : window.localStorage;
            ls.setItem(LS_KEY, JSON.stringify({
                url: state.api.url,
                key: state.api.key,
                model: state.api.model,
                models: state.api.models,
                connected: !!state.connected
            }));
        } catch (e) {
            console.warn('[Hệ Thống] Lỗi ghi localStorage: ', e);
        }
    }
    function clearSettings() {
        const keepApi = JSON.parse(JSON.stringify(state.api));
        const keepConnected = !!state.connected;
        const def = getDefaultState();
        const keys = Object.keys(def);
        for (let i = 0; i < keys.length; i++) {
            state[keys[i]] = def[keys[i]];
        }
        state.api = keepApi;
        state.connected = keepConnected;
        state.initialized = false;
        try {
            const ls = window.parent && window.parent.localStorage ? window.parent.localStorage : window.localStorage;
            ls.removeItem(LS_FULL_KEY);
        } catch (e) {}
        saveApiToLS();
        saveState();
        closePanel();
        setTimeout(() => openPanel(), 120);
    }

    function toast(message, type) {
        try {
            if (window.toastr && typeof window.toastr[type || 'info'] === 'function') {
                window.toastr[type || 'info'](message, 'Bảng Hệ Thống');
            } else {
                console.log('[Hệ Thống]', message);
            }
        } catch (e) {
            console.log('[Hệ Thống]', message);
        }
    }

    function applyTheme(key){var th=THEMES[key]||THEMES["hl-dark"];var v=th.var;var r=getDoc().documentElement.style;var ks=["bg","text","title","muted","accent","accent2","neon","neon2","success","warn","pur","err","cardBg","cardBorder","inputBg","inputBorder","btnBg","btnBg2","btnBorder","btnText","btnBgH","btnBg2H","shellBorder","msgUser","msgAi","warnColor","overlay","vignette","w","topBg","bg2","ballBg","ballBgH"];for(var i=0;i<ks.length;i++){var k=ks[i];if(v[k]!==undefined)r.setProperty("--t-"+k,v[k]);}}
function injectFont() {
        const doc = getDoc();
        const style = doc.createElement('style');
        style.id = 'nlsp-font';
        style.textContent = '@font-face{font-family:Tourney;src:url(https://cdn.jsdelivr.net/gh/Etcetera-Type-Co/Tourney@master/fonts/webfonts/Tourney-Regular.woff2) format("woff2");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Tourney;src:url(https://cdn.jsdelivr.net/gh/Etcetera-Type-Co/Tourney@master/fonts/webfonts/Tourney-SemiBold.woff2) format("woff2");font-weight:600;font-style:normal;font-display:swap}@font-face{font-family:Tourney;src:url(https://cdn.jsdelivr.net/gh/Etcetera-Type-Co/Tourney@master/fonts/webfonts/Tourney-Bold.woff2) format("woff2");font-weight:700;font-style:normal;font-display:swap}@font-face{font-family:Tourney;src:url(https://cdn.jsdelivr.net/gh/Etcetera-Type-Co/Tourney@master/fonts/webfonts/Tourney-ExtraBold.woff2) format("woff2");font-weight:900;font-style:normal;font-display:swap}';
        doc.head.appendChild(style);
    }

    function ensureStyle() {
        const doc = getDoc();
        if (doc.getElementById(STYLE_ID)) return;
        applyTheme(state.theme || 'hl-dark');
        const css = `*{box-sizing:border-box;margin:0;padding:0}
a{text-decoration:none;color:inherit}
#${OVERLAY_ID}{position:fixed;inset:0;z-index:999999;font-family:"Tourney","Microsoft YaHei",sans-serif;pointer-events:none;display:flex;align-items:center;justify-content:center}
#${OVERLAY_ID} .nlsp-shell{pointer-events:auto}
#OVL .nlsp-topbar{cursor:move}
#OVL .nlsp-topbar .tr,#OVL .nlsp-topbar .tr *{cursor:default}
#OVL .nlsp-pane,#OVL .nlsp-pane *{cursor:default}
#OVL .nlsp-body,#OVL .nlsp-body *{cursor:default}
#OVL .nlsp-btn,#OVL .nlsp-app,#OVL .nlsp-close,#OVL .nlsp-icon,#OVL .nlsp-back,#OVL button{cursor:pointer}
#OVL input,#OVL textarea,#OVL select{cursor:text}
/** preview 原封不动照搬开始 **/
.scene,.nlsp-shell{position:relative;width:min(820px,94vw);height:min(580px,88vh);animation:hl-shift 6s ease-in-out infinite}@media(max-width:768px){.scene,.nlsp-shell{width:96vw;height:min(520px,80vh);border-radius:0}.nlsp-topbar{padding:12px 14px 10px}.nlsp-topbar .tname{font-size:11px;letter-spacing:1px}.nlsp-topbar .tsub{font-size:10px}.nlsp-body{padding:12px 14px}.nlsp-app-grid{grid-template-columns:repeat(3,1fr);gap:10px}.nlsp-app .nlsp-app-ic{width:46px;height:46px;font-size:20px}.nlsp-app .nlsp-app-name{font-size:10px}.nlsp-btn{font-size:10px;padding:6px 12px}.nlsp-card{padding:10px 12px}.nlsp-input,.nlsp-select,.nlsp-textarea{padding:8px 10px;font-size:12px}.nlsp-page-title{font-size:11px}.nlsp-pt-pill{font-size:10px;padding:3px 10px}.nlsp-chat{font-size:11px}.nlsp-msg{font-size:11px;padding:8px 10px}}
@keyframes hl-shift{0%,100%{transform:translate(0,0)}25%{transform:translate(.3px,-.2px)}50%{transform:translate(-.2px,.3px)}75%{transform:translate(.1px,-.1px)}}
.frame,.nlsp-frame{position:absolute;inset:-4px;z-index:0;pointer-events:none;border-radius:2px;background:transparent}
.frame::before,.nlsp-frame::before{content:"";position:absolute;inset:-2px;background:conic-gradient(from 0deg at 0% 0%,transparent 60%,rgba(100,210,255,.15) 60%,rgba(100,210,255,.15) 70%,transparent 70%) no-repeat 0 0/16px 16px,conic-gradient(from 90deg at 100% 0%,transparent 60%,rgba(100,210,255,.15) 60%,rgba(100,210,255,.15) 70%,transparent 70%) no-repeat 100% 0/16px 16px,conic-gradient(from 180deg at 100% 100%,transparent 60%,rgba(100,210,255,.15) 60%,rgba(100,210,255,.15) 70%,transparent 70%) no-repeat 100% 100%/16px 16px,conic-gradient(from 270deg at 0% 100%,transparent 60%,rgba(100,210,255,.15) 60%,rgba(100,210,255,.15) 70%,transparent 70%) no-repeat 0 100%/16px 16px}
.frame::after,.nlsp-frame::after{content:"";position:absolute;inset:0;border:3px solid transparent;border-image:linear-gradient(90deg,transparent 0%,rgba(80,180,255,.75) 8%,rgba(20,60,140,.9) 12%,transparent 16%,transparent 24%,rgba(60,160,240,.7) 28%,rgba(30,80,160,.85) 32%,transparent 36%,transparent 44%,rgba(80,190,255,.8) 48%,rgba(40,90,150,.95) 52%,transparent 56%,transparent 64%,rgba(50,150,230,.65) 68%,rgba(25,70,140,.8) 75%,transparent 82%,transparent 88%,rgba(70,170,245,.8) 92%,rgba(35,85,155,.9) 96%,transparent 100%) 3;animation:hl-frame-glow 3s ease-in-out infinite}
@keyframes hl-frame-glow{0%,100%{opacity:.85;filter:drop-shadow(0 0 12px rgba(80,180,255,.4)) drop-shadow(0 0 30px rgba(40,120,220,.2))}50%{opacity:1;filter:drop-shadow(0 0 18px rgba(80,180,255,.55)) drop-shadow(0 0 40px rgba(40,120,220,.3))}}
.corners,.nlsp-corners{position:absolute;inset:0;z-index:1;pointer-events:none}
.corner,.nlsp-corner{position:absolute;width:32px;height:32px;border-radius:2px;box-shadow:0 0 20px rgba(80,200,255,.35),0 0 60px rgba(40,120,220,.15),inset 0 0 10px rgba(100,210,255,.1)}
.corner::before,.corner::after,.nlsp-corner::before,.nlsp-corner::after{content:"";position:absolute;background:linear-gradient(180deg,rgba(120,220,255,.9),rgba(30,80,180,.6))}
.corner::before,.nlsp-corner::before{width:3px;height:16px}
.corner::after,.nlsp-corner::after{width:16px;height:3px}
.corner.tl,.nlsp-corner.tl{top:0;left:0}.corner.tl::before,.nlsp-corner.tl::before{top:0;left:0}.corner.tl::after,.nlsp-corner.tl::after{top:0;left:0}
.corner.tr,.nlsp-corner.tr{top:0;right:0}.corner.tr::before,.nlsp-corner.tr::before{top:0;right:0}.corner.tr::after,.nlsp-corner.tr::after{top:0;right:0}
.corner.br,.nlsp-corner.br{bottom:0;right:0}.corner.br::before,.nlsp-corner.br::before{bottom:0;right:0}.corner.br::after,.nlsp-corner.br::after{bottom:0;right:0}
.corner.bl,.nlsp-corner.bl{bottom:0;left:0}.corner.bl::before,.nlsp-corner.bl::before{bottom:0;left:0}.corner.bl::after,.nlsp-corner.bl::after{bottom:0;left:0}
.panel,.nlsp-panel{position:relative;z-index:2;width:100%;height:100%;background:radial-gradient(ellipse at 30% 20%,rgba(30,60,120,.12) 0%,transparent 55%),radial-gradient(ellipse at 70% 80%,rgba(20,50,110,.08) 0%,transparent 55%),var(--t-bg);border:1px solid var(--t-shellBorder);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 0 0 1px var(--t-w) inset,0 0 30px rgba(40,100,200,.08) inset}
.panel::before,.nlsp-panel::before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:repeating-linear-gradient(25deg,transparent 0,transparent 98px,rgba(120,200,255,.03) 98px,rgba(120,200,255,.03) 100px),repeating-linear-gradient(-20deg,transparent 0,transparent 140px,rgba(80,160,240,.02) 140px,rgba(80,160,240,.02) 142px),radial-gradient(circle at 15% 30%,rgba(100,200,255,.06) 0,transparent 30%),radial-gradient(circle at 85% 70%,rgba(60,150,220,.04) 0,transparent 25%);opacity:.7}
.panel::after,.nlsp-panel::after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(0deg,rgba(40,100,180,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(40,100,180,.03) 1px,transparent 1px);background-size:40px 40px;opacity:.4}
.header,.nlsp-topbar{position:relative;z-index:2;flex:0 0 auto;padding:16px 24px 14px;border-bottom:1px solid var(--t-inputBorder);display:flex;align-items:center;justify-content:space-between}
.header .title,.nlsp-topbar .tname{font-family:"Tourney",monospace;font-size:13px;font-weight:700;letter-spacing:3px;color:var(--t-title);text-shadow:0 0 12px rgba(100,180,255,.4),0 0 24px rgba(60,120,220,.2);animation:hl-text-scan 4s ease-in-out infinite}
@keyframes hl-text-scan{0%,20%,100%{text-shadow:0 0 12px rgba(100,180,255,.4),0 0 24px rgba(60,120,220,.2)}21%,30%{text-shadow:0 0 20px rgba(130,210,255,.6),0 0 36px rgba(80,150,230,.35)}}
.header .sub,.nlsp-topbar .tsub{font-size:12px;color:var(--t-muted);letter-spacing:1px}
.nlsp-topbar .tr{display:flex;align-items:center;gap:14px}
.body,.nlsp-body{position:relative;z-index:2;flex:1 1 auto;overflow:auto;padding:20px 24px}
.nlsp-pane{position:relative;z-index:2;flex:1 1 auto;overflow:auto}
.body::-webkit-scrollbar,.nlsp-body::-webkit-scrollbar,.nlsp-pane::-webkit-scrollbar{width:4px}
.body::-webkit-scrollbar-track,.nlsp-body::-webkit-scrollbar-track,.nlsp-pane::-webkit-scrollbar-track{background:transparent}
.body::-webkit-scrollbar-thumb,.nlsp-body::-webkit-scrollbar-thumb,.nlsp-pane::-webkit-scrollbar-thumb{background:rgba(40,100,180,.3);border-radius:3px}
.hl-text,.nlsp-page-sub{color:var(--t-text);font-size:13px;line-height:1.7;letter-spacing:.5px;text-shadow:0 0 6px rgba(60,140,220,.3)}
.hl-text.accent,.nlsp-task-card .tgoal,.nlsp-card .icate,.nlsp-icon,.nlsp-back,.nlsp-pt-pill,.nlsp-section-title,.nlsp-label{color:var(--t-accent);text-shadow:0 0 10px rgba(80,180,240,.5)}
.hl-text.mute,.nlsp-muted,.nlsp-card .idesc,.nlsp-task-card .tdesc,.nlsp-wb-box .wb-sum,.nlsp-close,.nlsp-app .nlsp-app-name,.nlsp-page-sub.mute{color:var(--t-muted);text-shadow:0 0 6px rgba(60,140,220,.2)}
.hl-card,.nlsp-card{background:var(--t-cardBg);border:1px solid var(--t-cardBorder);border-radius:4px;padding:14px 16px;margin:8px 0;position:relative;box-shadow:0 2px 10px rgba(0,0,0,.3),inset 0 1px 0 rgba(60,140,220,.08);transition:box-shadow .3s ease}
.hl-card:hover,.nlsp-card:hover{box-shadow:0 2px 16px rgba(40,100,200,.15),inset 0 1px 0 rgba(60,140,220,.15)}
.hl-card .seq,.nlsp-task-card .tmeta .seq{position:absolute;top:10px;right:12px;font-size:10px;color:rgba(100,180,240,.5);letter-spacing:1px}
.hl-btn,.nlsp-btn{font-family:"Tourney","Microsoft YaHei",sans-serif;display:inline-block;padding:7px 16px;margin:4px 6px 4px 0;background:linear-gradient(135deg,var(--t-btnBg),var(--t-btnBg2));border:1px solid var(--t-btnBorder);border-radius:2px;color:var(--t-btnText);font-size:12px;font-weight:600;cursor:pointer;letter-spacing:1px;text-shadow:0 0 6px rgba(80,180,240,.4);transition:all .2s ease}
.hl-btn:hover,.nlsp-btn:hover{background:linear-gradient(135deg,var(--t-btnBgH),var(--t-btnBg2H));border-color:rgba(80,180,240,.6);box-shadow:0 0 14px rgba(60,150,240,.3)}
.hl-btn.ghost,.nlsp-btn.ghost{background:transparent;border:1px solid var(--t-inputBorder);color:var(--t-muted)}
.nlsp-btn:disabled{opacity:.4;cursor:not-allowed}
.nlsp-btn:active{transform:scale(.97)}
.particles,.nlsp-particles{position:absolute;inset:-20px;z-index:0;pointer-events:none}
.particle,.nlsp-particle{position:absolute;width:2px;height:2px;background:#6ac0ff;border-radius:50%;box-shadow:0 0 4px rgba(100,200,255,.6);animation:hl-particle 8s linear infinite}
.nlsp-particle:nth-child(1),.particle:nth-child(1){top:10%;left:5%;animation-delay:0s;animation-duration:7s}
.nlsp-particle:nth-child(2),.particle:nth-child(2){top:25%;left:95%;animation-delay:2s;animation-duration:9s}
.nlsp-particle:nth-child(3),.particle:nth-child(3){top:60%;left:3%;animation-delay:4s;animation-duration:6s}
.nlsp-particle:nth-child(4),.particle:nth-child(4){top:80%;left:90%;animation-delay:1s;animation-duration:8s}
.nlsp-particle:nth-child(5),.particle:nth-child(5){top:45%;left:50%;animation-delay:3s;animation-duration:10s}
.nlsp-particle:nth-child(6),.particle:nth-child(6){top:15%;left:40%;animation-delay:5s;animation-duration:7.5s}
.nlsp-particle:nth-child(7),.particle:nth-child(7){top:70%;left:20%;animation-delay:6s;animation-duration:8.5s}
.nlsp-particle:nth-child(8),.particle:nth-child(8){top:35%;left:75%;animation-delay:2.5s;animation-duration:9.5s}
@keyframes hl-particle{0%{transform:translate(0,0);opacity:0}20%{opacity:.8}80%{opacity:.3}100%{transform:translate(-10px,-40px);opacity:0}}
.vignette,.nlsp-vignette{position:absolute;inset:0;z-index:5;pointer-events:none;background:radial-gradient(ellipse at center,transparent 50%,var(--t-vignette) 100%)}
.chromatic{position:absolute;inset:0;z-index:0;pointer-events:none;background:transparent;box-shadow:1px 0 0 rgba(255,60,60,.015),-1px 0 0 rgba(60,180,255,.015),2px 0 0 rgba(255,60,60,.008),-2px 0 0 rgba(60,180,255,.008)}
.tag,.nlsp-card .icate{display:inline-block;font-size:10px;padding:2px 8px;margin:0 4px;background:rgba(20,60,130,.35);border:1px solid rgba(60,150,240,.2);color:rgba(140,200,240,.8);letter-spacing:1px}
/** preview 照搬结束 **/
.nlsp-row{margin:10px 0}
.nlsp-label{font-family:"Tourney",monospace;display:block;font-size:11px;font-weight:600;letter-spacing:1.5px;margin:0 0 6px;text-transform:uppercase;text-shadow:0 0 6px rgba(80,180,240,.4)}
.nlsp-input,.nlsp-select,.nlsp-textarea{width:100%;box-sizing:border-box;padding:10px 14px;background:var(--t-inputBg);border:1px solid var(--t-inputBorder);border-radius:2px;color:var(--t-text);font-size:13px;outline:none;font-family:inherit;letter-spacing:.5px;transition:all .2s ease}
.nlsp-textarea{resize:vertical;min-height:56px;line-height:1.6}
.nlsp-input:focus,.nlsp-select:focus,.nlsp-textarea:focus{border-color:var(--t-accent);box-shadow:0 0 0 3px rgba(80,180,240,.12);background:var(--t-cardBg)}
.nlsp-input::placeholder,.nlsp-textarea::placeholder{color:var(--t-muted)}
.nlsp-card .iname{font-size:14px;font-weight:700;color:var(--t-title);letter-spacing:.5px;text-shadow:0 0 8px rgba(100,180,255,.3)}
.nlsp-card .idesc{font-size:12px;line-height:1.55;text-shadow:none}
.nlsp-card .ibot{display:flex;justify-content:space-between;align-items:center;margin-top:4px;gap:8px}
.nlsp-card .icate{background:rgba(20,60,130,.35);border:1px solid rgba(60,150,240,.2);padding:2px 8px;border-radius:1px;font-size:10px;width:fit-content}
.nlsp-pt{color:var(--t-warn);font-weight:700;text-shadow:0 0 6px rgba(200,160,80,.4)}
.nlsp-pt-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:2px;font-size:12px;font-weight:600;letter-spacing:1px;background:rgba(20,60,130,.35);border:1px solid rgba(60,150,240,.2)}
.nlsp-icon{cursor:pointer;font-size:18px;line-height:1;user-select:none;transition:color .2s ease}
.nlsp-icon:hover{color:var(--t-title)}
.nlsp-close{cursor:pointer;font-size:20px;line-height:1;transition:color .2s ease}
.nlsp-close:hover{color:var(--t-title)}
.nlsp-grid3{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.nlsp-page-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}
.nlsp-page-title{font-family:"Tourney",monospace;font-size:12px;font-weight:700;letter-spacing:1.5px;color:var(--t-title);text-shadow:0 0 8px rgba(100,180,255,.25)}
.nlsp-section-title{font-family:"Tourney",monospace;display:block;font-size:11px;font-weight:600;letter-spacing:2px;margin:8px 2px 6px;text-transform:uppercase}
.nlsp-task-card{padding:14px 16px}
.nlsp-task-card .tmeta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.nlsp-task-card .tmeta .seq{position:static;padding:2px 8px;background:rgba(20,60,130,.35);border:1px solid rgba(60,150,240,.2);border-radius:1px}
.nlsp-task-card .tmeta .status-doing{color:var(--t-warn);font-size:10px;font-weight:600;letter-spacing:1px}
.nlsp-task-card .tmeta .status-done{color:var(--t-success);font-size:10px;font-weight:600;letter-spacing:1px}
.nlsp-task-card .tgoal{display:block;margin-top:6px}
.nlsp-task-card .treward{display:block;margin-top:4px;color:var(--t-warn);font-size:12px;font-weight:600}
.nlsp-task-card .tactions{display:flex;gap:8px;margin-top:8px}
.nlsp-rarity{font-size:10px;padding:2px 8px;border-radius:1px;border:1px solid;font-weight:600;letter-spacing:1px}
.nlsp-r-Thường{color:var(--t-muted);border-color:var(--t-muted)}.nlsp-r-Hiếm{color:var(--t-accent);border-color:var(--t-accent)}.nlsp-r-SửThi{color:var(--t-pur);border-color:var(--t-pur)}.nlsp-r-HuyềnThoại{color:var(--t-warn);border-color:var(--t-warn)}.nlsp-r-ThầnThoại{color:var(--t-err);border-color:var(--t-err)}
.nlsp-muted{font-size:12px;text-align:center;padding:24px 0;letter-spacing:.5px}
.nlsp-loading{color:var(--t-accent);font-size:12px;text-align:center;padding:24px 0;letter-spacing:1px;text-shadow:0 0 6px rgba(80,180,240,.3)}
.nlsp-center{text-align:center;padding:20px 10px}
.nlsp-tags{display:flex;gap:6px;flex-wrap:wrap}
.nlsp-result{background:var(--t-cardBg);border:1px solid var(--t-cardBorder);border-radius:4px;padding:12px 14px;margin:8px 0}
.nlsp-banner{margin:4px 0 14px;padding:12px 14px;border-radius:4px;background:linear-gradient(135deg,rgba(30,60,130,.08),transparent);border:1px solid rgba(40,100,200,.15);color:var(--t-text);font-size:12px;line-height:1.65;letter-spacing:.3px}
.nlsp-banner .greet{color:var(--t-title);margin-top:6px;text-shadow:0 0 6px rgba(100,180,255,.2)}
.nlsp-wb-box{margin-top:4px;padding:10px 12px;border-radius:2px;background:rgba(8,18,35,.6);border:1px solid var(--t-cardBorder);color:var(--t-text);font-size:12px}
.nlsp-wb-box .wb-name{color:var(--t-title);font-weight:600}
.nlsp-wb-box .wb-sum{margin-top:4px;line-height:1.55;white-space:pre-wrap;max-height:140px;overflow:auto;font-size:11px}
.nlsp-back{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:500;letter-spacing:.5px;cursor:pointer;transition:opacity .2s ease}
.nlsp-back:hover{opacity:.7}
.nlsp-chat{flex:1 1 auto;display:flex;flex-direction:column;overflow:auto;padding:8px 4px;gap:8px}
.nlsp-chat::-webkit-scrollbar{width:4px}.nlsp-chat::-webkit-scrollbar-track{background:transparent}.nlsp-chat::-webkit-scrollbar-thumb{background:rgba(40,100,180,.2);border-radius:2px}
.nlsp-msg{max-width:80%;padding:10px 14px;border-radius:4px;font-size:12px;line-height:1.55;white-space:pre-wrap;word-break:break-word;letter-spacing:.3px}
.nlsp-msg.user{align-self:flex-end;background:var(--t-msgUser);border:1px solid var(--t-btnBorder);color:var(--t-title);text-shadow:0 0 3px rgba(80,180,240,.1)}
.nlsp-msg.ai{align-self:flex-start;background:var(--t-msgAi);border:1px solid var(--t-cardBorder);color:var(--t-text)}
.nlsp-msg .meta{font-size:10px;color:var(--t-muted);margin-bottom:3px;font-weight:600;letter-spacing:1px}
.nlsp-input-bar{flex:0 0 auto;display:flex;gap:6px;padding:8px 4px 4px;border-top:1px solid rgba(40,100,180,.25)}.nlsp-input-bar input{flex:1}
.nlsp-p-empty{align-self:center;margin:auto;font-size:12px;letter-spacing:.5px}
.nlsp-app-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:2px 0}
.nlsp-app{cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;text-decoration:none;transition:transform .2s ease}
.nlsp-app:hover{transform:translateY(-2px)}
.nlsp-app .nlsp-app-ic{width:58px;height:58px;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:24px;color:var(--t-title);background:linear-gradient(150deg,rgba(30,80,160,.4),rgba(40,110,220,.24));border:1px solid var(--t-cardBorder);box-shadow:0 2px 8px rgba(0,0,0,.2),inset 0 1px 0 rgba(60,140,220,.08);transition:box-shadow .2s ease,border-color .2s ease}
.nlsp-app:hover .nlsp-app-ic{box-shadow:0 0 14px rgba(80,180,255,.25),inset 0 1px 0 rgba(60,140,220,.15);border-color:rgba(60,150,240,.44)}
.nlsp-mine-cell{background:var(--t-cardBg);border:1px solid var(--t-cardBorder);font-family:"Tourney","Microsoft YaHei",sans-serif;color:var(--t-text);user-select:none}
.nlsp-mine-open{background:rgba(8,18,35,.7)}.nlsp-mine-closed:hover{background:rgba(20,60,130,.3)}.nlsp-mine-boom{background:rgba(240,60,80,.2)}
.nlsp-flow{position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden}
.nlsp-flow::after{content:"";position:absolute;top:-150%;left:-150%;width:300%;height:300%;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.04) 45%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 55%,transparent 60%);animation:nlsp-flow-sweep 5s ease-in-out infinite}
@keyframes nlsp-flow-sweep{0%{transform:translate(-30%,-30%) rotate(15deg)}50%{transform:translate(30%,30%) rotate(15deg)}100%{transform:translate(-30%,-30%) rotate(15deg)}}
`;
        const style = doc.createElement('style');
        style.id = STYLE_ID;
        style.textContent = css;        style.textContent = css;        doc.head.appendChild(style);
    }

    function getDoc() {
        try {
            if (window.parent && window.parent.document && window.parent.document.body) return window.parent.document;
        } catch (e) {}
        return document;
    }


    var frameHTML = '<div class="nlsp-frame"></div><div class="nlsp-corners"><div class="nlsp-corner tl"></div><div class="nlsp-corner tr"></div><div class="nlsp-corner br"></div><div class="nlsp-corner bl"></div></div><div class="nlsp-particles"><span class="nlsp-particle"></span><span class="nlsp-particle"></span><span class="nlsp-particle"></span><span class="nlsp-particle"></span><span class="nlsp-particle"></span><span class="nlsp-particle"></span><span class="nlsp-particle"></span><span class="nlsp-particle"></span></div><div class="nlsp-panel"><div class="nlsp-flow"></div>';

    function openPanel() {
        const doc = getDoc();
        let overlay = doc.getElementById(OVERLAY_ID);
        if (overlay) { overlay.remove(); return; }
        ensureStyle();
        overlay = doc.createElement('div');
        
        overlay.id = OVERLAY_ID;
        overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
        doc.body.appendChild(overlay);
        render();
    }

    function closePanel() {
        const o = getDoc().getElementById(OVERLAY_ID);
        if (o) o.remove();
    }

    function overlay() { return getDoc().getElementById(OVERLAY_ID); }

    function setShell(inner) {
        const o = overlay();
        if (!o) return null;
        o.innerHTML = `<div class="nlsp-shell">${frameHTML}${inner}</div><div class="nlsp-vignette"></div></div>`;
        const shell = o.querySelector('.nlsp-shell');
        if (shell) {
            applyPanelResize(shell);
            makeWindowDraggable(shell, o);
        }
        return shell;
    }

    function applyPanelResize(shell) {
        if (!shell) shell = getDoc().querySelector('.nlsp-shell');
        if (!shell) return;
        if (state.panelW > 200) shell.style.width = state.panelW + 'px';
        if (state.panelH > 150) shell.style.height = state.panelH + 'px';
        if (!state.scaleLocked) {
            shell.style.resize = 'both';
            shell.style.overflow = 'hidden';
            shell.style.minWidth = '320px';
            shell.style.minHeight = '240px';
        }
        if (!shell._nlspResizeBound) {
                shell._nlspResizeBound = true;
                var saveTimer = null;
                var ro = new ResizeObserver(function(){
                    var r = shell.getBoundingClientRect();
                    state.panelW = Math.round(r.width);
                    state.panelH = Math.round(r.height);
                    if (saveTimer) clearTimeout(saveTimer);
                    saveTimer = setTimeout(function(){ saveState(); }, 500);
                });
                ro.observe(shell);
                shell.addEventListener('mouseup', function(){ saveState(); });
                shell.addEventListener('touchend', function(){ saveState(); });
        }
    }

    function makeWindowDraggable(shell, win) {
        const doc = getDoc();
        const topbar = shell.querySelector('.nlsp-topbar');
        if (!topbar) return;
        let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
        topbar.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.tr') || e.target.closest('.nlsp-close') || e.target.closest('.nlsp-icon') || e.target.tagName === 'BUTTON') return;
            dragging = true;
            sx = e.clientX; sy = e.clientY;
            const r = win.getBoundingClientRect();
            ox = r.left; oy = r.top;
            win.style.left = ox + 'px'; win.style.top = oy + 'px';
            win.style.right = 'auto'; win.style.bottom = 'auto';
            topbar.setPointerCapture(e.pointerId);
            e.preventDefault();
        });
        topbar.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - sx, dy = e.clientY - sy;
            const W = doc.documentElement.clientWidth, H = doc.documentElement.clientHeight;
            let x = ox + dx, y = oy + dy;
            x = Math.max(4, Math.min(x, W - shell.offsetWidth - 4));
            y = Math.max(4, Math.min(y, H - shell.offsetHeight - 4));
            win.style.left = x + 'px'; win.style.top = y + 'px';
        });
        function end(e) {
            if (!dragging) return;
            dragging = false;
            try { topbar.releasePointerCapture(e.pointerId); } catch (err) {}
        }
        topbar.addEventListener('pointerup', end);
        topbar.addEventListener('pointercancel', end);
    }

    function shellTopBar(title, sub, right) {
        return `<div class="nlsp-topbar">
            <div class="tl"><span class="badge"></span><div><div class="tname">${escapeText(title || 'Bảng Hệ Thống')}</div><div class="tsub">${escapeText(sub || '')}</div></div></div>
            <div class="tr">${right || ''}</div>
        </div>`;
    }

    function render() {
        if (!state.enabled) return renderEnable();
        if (!state.connected) return renderApi();
        if (!state.initialized) return renderInit();
        return renderMain();
    }

    /* ---------- Bước 1: Có muốn bật hệ thống không ---------- */
    function renderEnable() {
        setShell(`
            ${shellTopBar('Bảng Hệ Thống', 'Bước 1 · Có muốn bật hệ thống không?', '<span class=”nlsp-close” id=”nlsp-enable-close”>×</span>')}
            <div class=”nlsp-body”>
                <div class=”nlsp-pane nlsp-center”>
                    <p class=”nlsp-page-sub”>Sau khi bật sẽ hướng dẫn bạn kết nối giao diện tương thích OpenAI và khởi tạo một “hệ thống” có thể tương tác.</p>
                    <div style=”margin-top:16px; display:flex; gap:10px; justify-content:center;”>
                        <button class=”nlsp-btn ghost” id=”nlsp-enable-no”>Không</button>
                        <button class=”nlsp-btn” id=”nlsp-enable-yes”>Có</button>
                    </div>
                </div>
            </div>
        `);
        on('nlsp-enable-close', 'click', closePanel);
        on('nlsp-enable-no', 'click', closePanel);
        on('nlsp-enable-yes', 'click', () => { state.enabled = true; saveState(); render(); });
    }

    /* ---------- Bước 2: Kết nối API ---------- */
    function renderApi() {
        const presetSel = presetByUrl(state.api.url);
        setShell(`
            ${shellTopBar('Kết Nối API', 'Bước 2 · Giao diện tương thích OpenAI', '<span class="nlsp-close" data-act="close">×</span>')}
            <div class="nlsp-body">
                <div class="nlsp-pane">
                    <div class="nlsp-row">
                        <label class="nlsp-label">Nguồn giao diện (Preset chính thức hoặc tùy chỉnh)</label>
                        <select id="nlsp-api-preset" class="nlsp-select">
                            <option value="">Tùy chỉnh</option>
                            ${API_PRESETS.map((p) => `<option value="${escapeAttr(p.id)}" ${presetSel && presetSel.id === p.id ? 'selected' : ''}>${escapeText(p.name)} · ${escapeText(p.url)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="nlsp-row">
                        <label class="nlsp-label">Base URL (bao gồm /v1, có thể sửa thủ công)</label>
                        <input id="nlsp-api-url" class="nlsp-input" placeholder="https://your.api/v1" value="${escapeAttr(state.api.url)}" />
                        <div id="nlsp-api-preset-hint" class="nlsp-page-sub" style="margin-top:4px;">${presetSel ? 'Đã chọn preset chính thức: ' + escapeText(presetSel.hint) : ''}</div>
                    </div>
                    <div class="nlsp-row">
                        <label class="nlsp-label">API Key</label>
                        <input id="nlsp-api-key" class="nlsp-input" type="password" placeholder="sk-..." value="${escapeAttr(state.api.key)}" />
                    </div>
                    <div class="nlsp-row">
                        <label class="nlsp-label">Mô hình</label>
                        <select id="nlsp-api-model" class="nlsp-select">
                            ${state.api.models.map((m) => `<option value="${escapeAttr(m)}" ${m === state.api.model ? 'selected' : ''}>${escapeText(m)}</option>`).join('') || '<option value="">Vui lòng tải danh sách mô hình trước</option>'}
                        </select>
                    </div>
                    <div class="nlsp-row">
                        <label class="nlsp-label">Số ký tự đầu ra tối đa (max_tokens)</label>
                        <input id="nlsp-api-maxtokens" class="nlsp-input" type="number" min="100" max="128000" value="${state.api.maxTokens||30000}" placeholder="30000" />
                        <div class="nlsp-page-sub" style="margin-top:4px;">Giới hạn số ký tự tối đa mỗi lần AI trả lời, ảnh hưởng toàn bộ việc tạo nội dung (nhiệm vụ/cửa hàng/quay thưởng/đối thoại)</div>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:8px;">
                        <button class="nlsp-btn ghost" id="nlsp-pull-btn">Tải Mô Hình</button>
                        ${state.api.models.length ? '<button class="nlsp-btn" id="nlsp-next-btn">Tiếp Theo</button>' : ''}
                    </div>
                    <div id="nlsp-api-status" class="nlsp-page-sub" style="margin-top:10px;"></div>
                </div>
            </div>
        `);
        bind('close', closePanel);
        const setStatus = (msg, type) => {
            const el = getDoc().getElementById('nlsp-api-status');
            if (!el) return;
            el.textContent = msg;
            el.style.color = type === 'error' ? '#ff8a8a' : (type === 'ok' ? '#9dffb0' : '');
        };
        on('nlsp-api-preset', 'change', () => {
            const sel = getDoc().getElementById('nlsp-api-preset');
            const id = sel ? sel.value : '';
            const input = getDoc().getElementById('nlsp-api-url');
            const hint = getDoc().getElementById('nlsp-api-preset-hint');
            if (id) {
                const p = API_PRESETS.find((x) => x.id === id);
                if (p && input) input.value = p.url;
                if (hint) hint.textContent = p ? 'Đã chọn preset chính thức: ' + p.hint : '';
            } else {
                if (hint) hint.textContent = 'Tùy chỉnh: Có thể nhập Base URL thủ công bên dưới';
            }
        });
        on('nlsp-pull-btn', 'click', async () => {
            const url = val(getDoc().getElementById('nlsp-api-url'));
            const key = val(getDoc().getElementById('nlsp-api-key'));
            if (!url) return setStatus('Vui lòng điền Base URL', 'error');
            setStatus('Đang tải mô hình…');
            try {
                state.api.url = url.trim();
                state.api.key = key;
                const models = await apiListModels(state);
                if (!models.length) return setStatus('Không lấy được mô hình nào', 'error');
                state.api.models = models;
                if (!state.api.model || !models.includes(state.api.model)) state.api.model = models[0];
                saveApiToLS(); saveState();
                setStatus(`Đã lấy ${models.length} mô hình, chuyển bước tiếp theo…`, 'ok');
                state.connected = true;
                saveApiToLS(); saveState();
                render();
            } catch (e) {
                setStatus('Tải thất bại: ' + (e && e.message || e), 'error');
            }
        });
        on('nlsp-next-btn', 'click', () => {
            state.api.url = val(getDoc().getElementById('nlsp-api-url')).trim();
            state.api.key = val(getDoc().getElementById('nlsp-api-key'));
            state.api.model = val(getDoc().getElementById('nlsp-api-model'));
            const mtEl = getDoc().getElementById('nlsp-api-maxtokens');
            state.api.maxTokens = Math.max(100, Number(mtEl ? mtEl.value : 30000) || 30000);
            state.connected = true;
            saveApiToLS(); saveState();
            render();
        });
    }

    /* ---------- Bước 3: Đặt tên, đọc Sách Thế Giới và khởi tạo ---------- */
    let wbList = [];
    function refreshWbList() { try { wbList = TH.getWorldbookNames() || []; } catch (e) { wbList = []; } }

    function renderInit() {
        refreshWbList();
        refreshScriptList();
        const wb = state.worldbook || {};
        const sc = state.scripts || [];
        const editing = !!state._editingSetup;
        const rightHTML = (editing ? '<span class="nlsp-back" data-act="back-home">‹ Quay lại Hệ Thống</span>' : '')
            + '<span class="nlsp-close" data-act="close">×</span>';
        setShell(`
            ${shellTopBar(editing ? 'Cài Đặt Hệ Thống' : 'Khởi Tạo Hệ Thống', editing ? 'Chỉnh sửa tên/đọc sách thế giới/đọc script thẻ nhân vật và khởi tạo lại' : 'Bước 3 · Đặt tên, đọc Sách Thế Giới và khởi tạo', rightHTML)}
            <div class="nlsp-body">
                <div class="nlsp-pane">
                    <div class="nlsp-row">
                        <label class="nlsp-label">Tên hệ thống</label>
                        <input id="nlsp-sys-name" class="nlsp-input" placeholder="Ví dụ: Di Tích Biển Sao" value="${escapeAttr(state.system.name)}" />
                    </div>
                    <div class="nlsp-row">
                        <label class="nlsp-label">Vai trò cốt lõi (một câu)</label>
                        <input id="nlsp-sys-purpose" class="nlsp-input" placeholder="Ví dụ: Quản lý hầm trú ẩn trong vùng đất hậu tận thế" value="${escapeAttr(state.system.purpose)}" />
                    </div>
                    <div class="nlsp-section-title">Tùy chọn · Đọc Sách Thế Giới</div>
                    <div class="nlsp-row" style="display:flex; gap:8px;">
                        <select id="nlsp-wb-select" class="nlsp-select" style="flex:1;">
                            <option value="">-- Chọn Sách Thế Giới --</option>
                            ${wbList.map((n) => `<option value="${escapeAttr(n)}" ${n === wb.name ? 'selected' : ''}>${escapeText(n)}</option>`).join('')}
                        </select>
                        <button class="nlsp-btn ghost" id="nlsp-wb-load">Đọc</button>
                    </div>
                    <div id="nlsp-wb-info" style="margin-top:6px;">${renderWbInfoHTML(wb)}</div>
                    <div class="nlsp-section-title">Tùy chọn · Đọc Script Thẻ Nhân Vật (bao gồm đăng ký zod)</div>
                    <div class="nlsp-page-sub" style="margin-bottom:6px;">Đọc script SillyTavern gắn với thẻ nhân vật hiện tại (bao gồm đăng ký zod), dùng tóm tắt nội dung script làm ngữ cảnh tạo hệ thống.</div>
                    <div class="nlsp-row">
                        <select id="nlsp-sc-select" class="nlsp-select">
                            <option value="">-- Chọn Script --</option>
                            ${sc.map((s, i) => `<option value="${i}" ${state._selectedScript === i ? 'selected' : ''}>${escapeText(s.name || 'Chưa đặt tên')}（${s.size} ký tự）</option>`).join('')}
                        </select>
                    </div>
                    <div class="nlsp-row" style="display:flex; gap:8px;">
                        <button class="nlsp-btn ghost" id="nlsp-sc-load">Đọc Script Chọn</button>
                        <button class="nlsp-btn ghost" id="nlsp-sc-loadall">Đọc Tất Cả</button>
                        <button class="nlsp-btn ghost" id="nlsp-sc-clear">Xóa Đã Đọc</button>
                    </div>
                    <div id="nlsp-sc-info" style="margin-top:6px;">${renderScriptInfoHTML(state)}</div>
                    <div class="nlsp-section-title">Chức Năng Riêng · Số lượng và Thiên hướng</div>
                    <div class="nlsp-row" style="display:flex;gap:10px;align-items:center">
                        <label class="nlsp-label" style="margin:0;white-space:nowrap">Số lượng tạo</label>
                        <select id="nlsp-excl-count" class="nlsp-select" style="width:80px">
                            ${[1,2,3,4,5,6].map((n) => `<option value="${n}" ${(state.exclusiveFunctionCount||1)===n?'selected':''}>${n}</option>`).join('')}
                        </select>
                        <label class="nlsp-label" style="margin:0 0 0 16px;white-space:nowrap">Độ phức tạp</label>
                        <select id="nlsp-excl-complexity" class="nlsp-select" style="width:90px">
                            <option value="simple" ${state.exclComplexity!=='complex'?'selected':''}>Đơn giản</option>
                            <option value="complex" ${state.exclComplexity==='complex'?'selected':''}>Phức tạp</option>
                        </select>
                    </div>
                    <div class="nlsp-row" style="display:flex;gap:10px;align-items:center;margin-top:6px">
                        <label class="nlsp-label" style="margin:0;white-space:nowrap">Tiêu điểm</label>
                        <select id="nlsp-excl-cost" class="nlsp-select" style="width:80px">
                            <option value="false" ${!state.exclCostPoints?'selected':''}>Không</option>
                            <option value="true" ${state.exclCostPoints?'selected':''}>Có</option>
                        </select>
                        <span class="nlsp-page-sub" style="margin:0">Bật thì trừ điểm khi sử dụng</span>
                    </div>
                    <div id="nlsp-excl-prefs">${renderExclPrefs(state)}</div>
                    <div class="nlsp-section-title">Giao Diện</div>
                    <div class="nlsp-row">
                        <select id="nlsp-theme-select" class="nlsp-select">
                            ${Object.keys(THEMES).map((k) => { const t = THEMES[k]; return `<option value="${escapeAttr(k)}" ${state.theme === k ? 'selected' : ''}>${t.icon} ${escapeText(t.name)} · ${escapeText(t.desc)}</option>`; }).join('')}
                        </select>
                    </div>
                    <div class="nlsp-section-title">Điều chỉnh cỡ bảng</div>
                    <div class="nlsp-row" style="display:flex;gap:10px;align-items:center">
                        <button class="nlsp-btn ${state.scaleLocked?'ghost':''}" id="nlsp-scale-lock" style="${state.scaleLocked?'':'background:rgba(40,160,80,.6);border-color:rgba(60,200,100,.5)'}">${state.scaleLocked?'🔒 Khóa':'🔓 Mở Khóa'}</button>
                        <span class="nlsp-page-sub" style="margin:0">Sau khi mở khóa có thể kéo góc phải dưới bảng để điều chỉnh kích thước</span>
                    </div>
                    <div class="nlsp-section-title">Tự Động Làm Mới (theo diễn biến chat)</div>
                    <div class="nlsp-row" style="display:flex;gap:10px;align-items:center">
                        <label class="nlsp-label" style="margin:0;white-space:nowrap">Bật tự động làm mới</label>
                        <select id="nlsp-auto-refresh" class="nlsp-select" style="width:80px">
                            <option value="false" ${!state.autoRefresh?'selected':''}>Tắt</option>
                            <option value="true" ${state.autoRefresh?'selected':''}>Bật</option>
                        </select>
                    </div>
                    <div class="nlsp-row" style="display:flex;gap:10px;align-items:center">
                        <label class="nlsp-label" style="margin:0;white-space:nowrap">Số tầng ngữ cảnh đọc</label>
                        <input id="nlsp-context-floors" class="nlsp-input" type="number" min="1" max="50" value="${state.contextFloors||10}" style="width:80px" />
                    </div>
                    <div class="nlsp-row" style="display:flex;gap:10px;align-items:center">
                        <label class="nlsp-label" style="margin:0;white-space:nowrap">Khoảng thời gian làm mới (mỗi N lượt AI trả lời)</label>
                        <input id="nlsp-refresh-interval" class="nlsp-input" type="number" min="1" max="20" value="${state.refreshInterval||1}" style="width:80px" />
                    </div>
                    ${hasOpenChat() ? '' : '<div class="nlsp-page-sub" style="color:#ff8a8a;margin:8px 0 0;">⚠ Chưa mở thẻ nhân vật hoặc chưa vào chat, không thể khởi tạo hệ thống. Hãy mở thẻ nhân vật và vào chat trước.</div>'}
                    <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
                        ${editing ? '' : '<button class="nlsp-btn ghost" id="nlsp-back-api">Quay Lại</button>'}
                        ${editing ? '<button class="nlsp-btn ghost" id="nlsp-back-to-api">Quay Lại Cài Đặt API</button>' : ''}
                        ${editing ? '<button class="nlsp-btn" style="background:rgba(200,40,50,.65);border-color:rgba(220,60,70,.5)" id="nlsp-clear-btn">Xóa Tất Cả Cài Đặt</button>' : ''}
                        <button class="nlsp-btn" id="nlsp-init-btn">${editing ? 'Khởi Tạo Lại Hệ Thống' : 'Bắt Đầu Khởi Tạo Hệ Thống'}</button>
                    </div>
                    <div id="nlsp-init-status" class="nlsp-page-sub" style="margin-top:10px;"></div>
                    <div id="nlsp-init-result"></div>
                </div>
            </div>
        `);
        bind('close', closePanel);
        if (editing) bind('back-home', () => { state._editingSetup = false; saveState(); if (!state.initialized) state.initialized = true; render(); });
        if (editing) on('nlsp-back-to-api', 'click', () => { state.connected = false; saveState(); renderApi(); });
        if (editing) on('nlsp-clear-btn', 'click', () => { clearSettings(); });
        if (!editing) on('nlsp-back-api', 'click', () => { state.connected = false; saveState(); renderApi(); });
        on('nlsp-wb-load', 'click', async () => {
            const name = val(getDoc().getElementById('nlsp-wb-select'));
            const box = getDoc().getElementById('nlsp-wb-info');
            if (!name) { if (box) box.innerHTML = '<div class="nlsp-page-sub" style="padding:4px 2px;color:#ff8a8a">Vui lòng chọn một Sách Thế Giới trước.</div>' + renderWbInfoHTML(state.worldbook || {}); return; }
            if (box) box.innerHTML = '<div class="nlsp-loading">Đang đọc các mục Sách Thế Giới…</div>';
            try {
                const entries = await TH.getWorldbook(name);
                const summary = summarizeWorldbook(name, entries);
                state.worldbook = { name, summary, entries };
                saveState();
                refreshWbInfo(box);
            } catch (e) {
                if (box) box.innerHTML = '<div class="nlsp-page-sub" style="color:#ff8a8a;padding:4px 2px;">Đọc thất bại: ' + escapeText(e && e.message || e) + '</div>';
            }
        });
        on('nlsp-sc-load', 'click', () => {
            const sel = getDoc().getElementById('nlsp-sc-select');
            const i = Number(sel ? sel.value : -1);
            if (isNaN(i) || i < 0 || !state.scripts || !state.scripts[i]) return toast('Vui lòng chọn một script trước', 'error');
            state._selectedScript = i;
            state.scripts[i].loaded = !state.scripts[i].loaded;
            saveState();
            const info = getDoc().getElementById('nlsp-sc-info');
            if (info) info.innerHTML = renderScriptInfoHTML(state);
        });
        on('nlsp-sc-loadall', 'click', () => {
            if (!state.scripts.length) return toast('Thẻ nhân vật hiện tại không có script JS-Slash-Runner', 'error');
            const allLoaded = state.scripts.every((s) => s.loaded);
            state.scripts.forEach((s) => { s.loaded = !allLoaded; });
            state._selectedScript = -1;
            saveState();
            const info = getDoc().getElementById('nlsp-sc-info');
            if (info) info.innerHTML = renderScriptInfoHTML(state);
            toast(allLoaded ? 'Đã bỏ chọn tất cả script' : 'Đã chọn tất cả script', 'success');
        });
        on('nlsp-sc-clear', 'click', () => {
            state.scripts.forEach((s) => { s.loaded = false; });
            state._selectedScript = -1;
            saveState();
            const info = getDoc().getElementById('nlsp-sc-info');
            if (info) info.innerHTML = renderScriptInfoHTML(state);
        });
        on('nlsp-theme-select', 'change', () => {
            const sel = getDoc().getElementById('nlsp-theme-select');
            state.theme = sel ? sel.value : 'hl-dark';
            saveState();
            applyTheme(state.theme);
        });
        on('nlsp-scale-lock', 'click', () => {
            state.scaleLocked = !state.scaleLocked;
            saveState();
            renderInit();
            applyPanelResize();
        });
        on('nlsp-auto-refresh', 'change', () => {
            const sel = getDoc().getElementById('nlsp-auto-refresh');
            state.autoRefresh = sel ? sel.value === 'true' : false;
            saveState();
            setupAutoRefresh();
            toast(state.autoRefresh ? 'Đã bật tự động làm mới, sẽ kiểm tra và làm mới nhiệm vụ/cửa hàng sau mỗi lượt AI trả lời' : 'Đã tắt tự động làm mới', 'success');
        });
        on('nlsp-context-floors', 'change', () => {
            const inp = getDoc().getElementById('nlsp-context-floors');
            state.contextFloors = Math.max(1, Math.min(50, Number(inp ? inp.value : 10) || 10));
            if (inp) inp.value = state.contextFloors;
            saveState();
        });
        on('nlsp-refresh-interval', 'change', () => {
            const inp = getDoc().getElementById('nlsp-refresh-interval');
            state.refreshInterval = Math.max(1, Math.min(20, Number(inp ? inp.value : 1) || 1));
            if (inp) inp.value = state.refreshInterval;
            refreshCounter = 0;
            saveState();
        });
        on('nlsp-excl-count', 'change', () => {
            const sel = getDoc().getElementById('nlsp-excl-count');
            state.exclusiveFunctionCount = sel ? Math.max(1,Math.min(6,Number(sel.value)||1)) : 1;
            saveState();
            var box = getDoc().getElementById('nlsp-excl-prefs');
            if (box) box.innerHTML = renderExclPrefs(state);
        });
        on('nlsp-excl-complexity', 'change', () => {
            const sel = getDoc().getElementById('nlsp-excl-complexity');
            state.exclComplexity = sel && sel.value === 'complex' ? 'complex' : 'simple';
            saveState();
        });
        on('nlsp-excl-cost', 'change', () => {
            const sel = getDoc().getElementById('nlsp-excl-cost');
            state.exclCostPoints = sel ? sel.value === 'true' : false;
            saveState();
        });
        on('nlsp-init-btn', 'click', () => doInit());
    }

    let scriptList = [];
    function refreshScriptList() {
        scriptList = [];
        if (typeof TH.getScriptTrees !== 'function') { state.scripts = []; return; }
        try {
            const trees = TH.getScriptTrees({ type: 'character' }) || [];
            const flat = [];
            for (const node of trees) flattenScripts(node, flat);
            scriptList = flat;
            const loaded = (state.scripts || []).filter((s) => s.loaded).map((s) => s.name);
            state.scripts = flat.map((s) => ({
                name: s.name, id: s.id, size: s.size, content: s.content,
                loaded: loaded.includes(s.name)
            }));
        } catch (e) {
            console.warn('[Hệ Thống] Lỗi đọc script thẻ nhân vật: ', e);
            state.scripts = [];
        }
    }
    function flattenScripts(node, out) {
        if (!node) return;
        if (node.type === 'folder' && Array.isArray(node.scripts)) {
            for (const s of node.scripts) flattenScripts(s, out);
            return;
        }
        if (node.type === 'script' && node.enabled !== false) {
            const content = String(node.content || '');
            out.push({ name: String(node.name || 'Chưa đặt tên'), id: node.id, size: content.length, content });
        }
    }

    function renderWbInfoHTML(wb) {
        if (!wb || !wb.name) return '<div class="nlsp-page-sub" style="padding:4px 2px;">Sau khi đọc, hệ thống sẽ được tạo dựa trên tóm tắt các mục Sách Thế Giới.</div>';
        return renderWbBox(wb);
    }

    function renderScriptInfoHTML(st) {
        const sc = st.scripts || [];
        if (!sc.length) return '<div class="nlsp-page-sub" style="padding:4px 2px;">Không tìm thấy script JS-Slash-Runner trong thẻ nhân vật hiện tại.</div>';
        const loaded = sc.filter((s) => s.loaded);
        return '<div class="nlsp-wb-box"><div class="wb-name">Script đã chọn: ' + loaded.length + ' / ' + sc.length + '</div><div class="wb-sum">'
            + (loaded.length ? loaded.map((s, i) => '· ' + escapeText(s.name) + '（' + s.size + ' ký tự）').join('\n') : '（Chưa chọn script nào, sẽ không ghi vào ngữ cảnh）')
            + '</div></div>';
    }

    function refreshWbInfo(box) {
        const wb = state.worldbook;
        if (!wb || !wb.name) {
            box.innerHTML = '<div class="nlsp-page-sub" style="padding:4px 2px;">Sau khi đọc, hệ thống sẽ được tạo dựa trên tóm tắt các mục Sách Thế Giới.</div>';
            return;
        }
        box.innerHTML = renderWbBox(wb);
        const clear = getDoc().getElementById('nlsp-wb-clear');
        if (clear) clear.addEventListener('click', () => {
            state.worldbook = { name: '', summary: '', entries: [] };
            saveState();
            refreshWbInfo(box);
            const sel = getDoc().getElementById('nlsp-wb-select');
            if (sel) sel.value = '';
        });
    }

    function renderWbBox(wb) {
        return `
            <div class="nlsp-wb-box">
                <div class="wb-name">Đã đọc: ${escapeText(wb.name)}（${(wb.entries || []).length} mục）</div>
                <div class="wb-sum">${escapeText(wb.summary || '（Không có tóm tắt）')}</div>
                <div style="margin-top:8px;"><button class="nlsp-btn ghost" id="nlsp-wb-clear">Xóa</button></div>
            </div>`;
    }

    function renderExclPrefs(st){
        var n=st.exclusiveFunctionCount||1;
        var prefs=st.exclusivePreferences||[];
        var h='';
        for(var i=0;i<n;i++){
            h+='<div class="nlsp-row"><label class="nlsp-label">Thiên hướng '+(i+1)+' (tùy chọn)</label><textarea class="nlsp-textarea nlsp-excl-pref-item" data-pref-idx="'+i+'" placeholder="Để trống để hoàn toàn ngẫu nhiên" style="min-height:40px">'+escapeText(prefs[i]||'')+'</textarea></div>';
        }
        return h;
    }

    async function doInit() {
        if (!requireOpenChat('Khởi tạo hệ thống')) return;
        const name = val(getDoc().getElementById('nlsp-sys-name')).trim();
        const purpose = val(getDoc().getElementById('nlsp-sys-purpose')).trim();
        const setStatus = (m, t) => {
            const el = getDoc().getElementById('nlsp-init-status');
            if (!el) return; el.textContent = m;
            el.style.color = t === 'error' ? '#ff8a8a' : (t === 'ok' ? '#9dffb0' : '');
        };
        if (!name || !purpose) return setStatus('Vui lòng điền tên và vai trò cốt lõi', 'error');
        state.system.name = name; state.system.purpose = purpose;
        var prefs=[];
        var prefEls=getDoc().querySelectorAll('.nlsp-excl-pref-item');
        for(var pi=0;pi<prefEls.length;pi++){prefs.push(String(prefEls[pi].value||'').trim());}
        state.exclusivePreferences=prefs;
        saveState();
        setStatus('Đang gọi mô hình để khởi tạo hệ thống…');
        const box = getDoc().getElementById('nlsp-init-result');
        if (box) box.innerHTML = '<div class="nlsp-loading">Đang tạo…Giới thiệu hệ thống, lời chào mở đầu, nhiệm vụ đầu tiên, cửa hàng, chức năng riêng.</div>';
        let sysData = {}, taskData = [], shopItems = [], exclList = [];
        async function safeCall(label, fn) {
            try { return await fn; } catch (e) {
                console.warn('[Hệ Thống] ' + label + ' thất bại: ', e);
                setStatus(label + ' thất bại: ' + (e && e.message || e) + '（tiếp tục các tác vụ khác…）', 'error');
                return null;
            }
        }
        sysData = await safeCall('Giới thiệu hệ thống', apiInitSystem(state));
        taskData = await safeCall('Nhiệm vụ', apiGenerateTask(state, { first: true }));
        shopItems = await safeCall('Cửa hàng', apiGenerateShop(state));
        for(var ei=0;ei<(state.exclusiveFunctionCount||1);ei++){
            var ep=await safeCall('Chức năng riêng '+(ei+1), apiGenerateExclusive(state, prefs[ei]||'', state.exclComplexity||'simple'));
            if(ep)exclList.push(ep);
        }
        if (!sysData || !taskData) {
            setStatus('Tạo chức năng cốt lõi (giới thiệu/nhiệm vụ) thất bại, hãy kiểm tra kết nối API hoặc rút ngắn mô tả hệ thống rồi thử lại.', 'error');
            if (box) box.innerHTML = '<div class="nlsp-muted">Khởi tạo bị gián đoạn, hãy quay lại kiểm tra cấu hình API.</div>';
            return;
        }
        state.system.summary = String(sysData.summary || '').trim();
        state.system.greeting = String(sysData.greeting || '').trim();
        state.points = Number(sysData.initialPoints ?? state.points) || state.points;
        state.tasks = Array.isArray(taskData) && taskData.length ? taskData : [];
        state.shop = shopItems || [];
        state.exclusiveFunctions = exclList;
        state.initialized = true;
        state._editingSetup = false;
        saveState();
        setStatus('Khởi tạo hoàn tất, xác nhận để vào hệ thống', 'ok');
        if (box) box.innerHTML = `
            <div class="nlsp-result">
                <div class="nlsp-section-title">Giới thiệu hệ thống</div>
                <div>${escapeText(state.system.summary || '（Không có）')}</div>
                ${state.system.greeting ? `<div class="nlsp-section-title" style="margin-top:8px;">Lời chào mở đầu</div><div>${escapeText(state.system.greeting)}</div>` : ''}
                ${state.tasks[0] ? `<div class="nlsp-section-title" style="margin-top:8px;">Nhiệm vụ đầu tiên</div><div style="color:#fff;font-weight:600;">${escapeText(state.tasks[0].name)}</div><div class="nlsp-page-sub">${escapeText(state.tasks[0].goal)}</div>` : ''}
                ${state.shop.length ? `<div class="nlsp-section-title" style="margin-top:8px;">Hàng hoá đầu tiên</div><div class="nlsp-page-sub">${state.shop.length} món</div>` : ''}
                ${exclList.length ? `<div class="nlsp-section-title" style="margin-top:8px;">Chức năng riêng ${exclList.length} cái</div><div class="nlsp-page-sub">${exclList.map(function(e){return escapeText(e.name)}).join(' · ')}</div>` : '<div class="nlsp-section-title" style="margin-top:8px;">Chức năng riêng</div><div class="nlsp-page-sub" style="color:#ff8a8a;">Tạo thất bại (có thể vào rồi làm mới thủ công)</div>'}
                <div class="nlsp-section-title" style="margin-top:8px;">Điểm khởi đầu: <span class="nlsp-pt">${state.points}</span></div>
            </div>
            <div style="display:flex; justify-content:center; margin-top:14px;">
                <button class="nlsp-btn" id="nlsp-confirm-btn">Xác nhận vào hệ thống</button>
            </div>`;
        on('nlsp-confirm-btn', 'click', () => render());
    }

    /* ---------- Giao diện chính ---------- */
    let activeView = 'home';
    function renderMain() {
        setShell(`
            ${shellTopBar(state.system.name || 'Bảng Hệ Thống', state.system.purpose || '',
                `<span class="nlsp-pt-pill">Điểm ${state.points}</span><span class="nlsp-icon" id="nlsp-cog" title="Cấu hình lại">⚙</span><span class="nlsp-close" id="nlsp-close-main" title="Đóng">×</span>`)}
            <div class="nlsp-body"><div class="nlsp-pane" id="nlsp-pane"></div></div>
        `);
        on('nlsp-close-main', 'click', closePanel);
        on('nlsp-cog', 'click', () => { state._editingSetup = true; saveState(); renderInit(); });
        renderPane();
    }

    function openView(name) { activeView = name; renderPane(); }
    function backHome() { activeView = 'home'; renderPane(); }

    function renderPane() {
        const pane = getDoc().getElementById('nlsp-pane');
        if (!pane) return;
        if (activeView === 'home') return renderHome(pane);
        if (activeView === 'task') return renderAppView(pane, 'task', 'Nhiệm Vụ Hệ Thống', 'Nhấn Bắt đầu/Hoàn thành để nhận nhiệm vụ và lãnh thưởng', renderTaskBody);
        if (activeView === 'shop') return renderAppView(pane, 'shop', 'Cửa Hàng Hệ Thống', 'Gọi mô hình để tạo và làm mới sản phẩm', renderShopBody);
        if (activeView === 'draw') return renderAppView(pane, 'draw', 'Quay Thưởng Hệ Thống', 'Quay 1 lần ' + DRAW_COST_ONE + ' / 10 lần ' + DRAW_COST_TEN, renderDrawBody);
        if (activeView === 'decompose') return renderAppView(pane, 'decompose', 'Phân Giải Vật Phẩm', 'Nhập tên vật phẩm để phân giải', renderDecomposeBody);
        if (activeView === 'chat') return renderChatView(pane);
        if (activeView.indexOf('excl')===0){var idx=parseInt(activeView.slice(4))||0;var excls=state.exclusiveFunctions||[];var ef=excls[idx]||{};return renderAppView(pane,'excl'+idx,ef.name||'Chức Năng Riêng',ef.desc||'',function(b){renderExclBody(b,idx)});}
    }

    function renderHome(pane){var ef=state.exclusiveFunctions||[];var exclIcons='';for(var ei=0;ei<ef.length;ei++){exclIcons+='<a class="nlsp-app" data-app="excl'+ei+'"><span class="nlsp-app-ic">'+escapeText(ef[ei].icon||'⭐')+'</span><span class="nlsp-app-name">'+escapeText(ef[ei].name||'Chức Năng')+'</span></a>';}
pane.innerHTML=`
${state.system.greeting?'<div class="nlsp-banner"><div>SYSTEM.GREETING</div><div class="greet">'+escapeText(state.system.greeting)+'</div></div>':''}
<div class="nlsp-section-title">// FUNCTIONS</div>
<div class="nlsp-app-grid">
<a class="nlsp-app" data-app="task"><span class="nlsp-app-ic">📋</span><span class="nlsp-app-name">Nhiệm Vụ</span></a>
<a class="nlsp-app" data-app="shop"><span class="nlsp-app-ic">🛒</span><span class="nlsp-app-name">Cửa Hàng</span></a>
<a class="nlsp-app" data-app="draw"><span class="nlsp-app-ic">🎁</span><span class="nlsp-app-name">Quay Thưởng</span></a>
<a class="nlsp-app" data-app="decompose"><span class="nlsp-app-ic">♻</span><span class="nlsp-app-name">Phân Giải</span></a>
<a class="nlsp-app" data-app="chat"><span class="nlsp-app-ic">💬</span><span class="nlsp-app-name">Đối Thoại</span></a>
${exclIcons}
</div>
<div class="nlsp-section-title" style="display:flex;justify-content:space-between;align-items:center;margin-top:18px">// TASKS<span class="nlsp-btn ghost" id="nlsp-task-refresh-home">REFRESH</span></div>
<div id="nlsp-task-list-home"></div>
`;
pane.querySelectorAll('.nlsp-app').forEach(function(a){a.addEventListener('click',function(){openView(a.getAttribute('data-app'))})});
paintHomeTasks();
var rf=document.getElementById('nlsp-task-refresh-home');if(rf)rf.addEventListener('click',async function(){rf.disabled=true;var list=document.getElementById('nlsp-task-list-home');if(list)list.innerHTML='<div class="nlsp-loading">generating...</div>';try{var tasks=await apiGenerateTask(state,{first:false});state.tasks=tasks||[];saveState();paintHomeTasks();toast('tasks refreshed','success')}catch(e){if(list)list.innerHTML='<div class="nlsp-muted">refresh failed</div>'}finally{rf.disabled=false}});
}

function paintHomeTasks(){var list=document.getElementById('nlsp-task-list-home');if(!list)return;if(!state.tasks.length){list.innerHTML='<div class="nlsp-muted">NO ACTIVE TASKS</div>';return}list.innerHTML=state.tasks.map(function(t,i){return'<div class="nlsp-card nlsp-task-card"><div class="tmeta"><span class="seq">#'+(i+1)+'</span><span class="iname">'+escapeText(t.name||'')+'</span>'+(t.status==='done'?'<span class="status-done">DONE</span>':(t.status==='doing'?'<span class="status-doing">ACTIVE</span>':'<span class="nlsp-page-sub">PENDING</span>'))+'</div><div class="tdesc">'+escapeText(t.desc||'')+'</div><div class="tgoal">OBJECTIVE: '+escapeText(t.goal||'')+'</div><div class="treward">REWARD: <span class="nlsp-pt">'+(t.reward||0)+' PTS</span>'+(t.itemReward?' · '+escapeText(t.itemReward):'')+'</div><div class="tactions">'+(t.status==='done'?'<span class="status-done">CLAIMED</span>':'<button class="nlsp-btn ghost" data-home-start="'+i+'" '+(t.status==='doing'?'disabled':'')+'>START</button><button class="nlsp-btn" data-home-done="'+i+'" '+(t.status!=='doing'?'disabled':'')+'>COMPLETE</button>')+'</div></div>'}).join('');list.querySelectorAll('[data-home-start]').forEach(function(b){b.addEventListener('click',function(){var i=Number(b.getAttribute('data-home-start'));var t=state.tasks[i];if(!t||t.status==='doing')return;t.status='doing';saveState();paintHomeTasks();toast('started: '+t.name,'success');insertIntoChat('📋 '+t.name,'OBJECTIVE: '+t.goal+'\n'+(t.desc||''),'task')})});list.querySelectorAll('[data-home-done]').forEach(function(b){b.addEventListener('click',function(){completeTask(Number(b.getAttribute('data-home-done')));paintHomeTasks()})})}

    function renderAppView(pane, key, title, sub, bodyFn) {
        pane.innerHTML = `
            <div class="nlsp-page-head">
                <span class="nlsp-back" data-back="1">‹ Quay Lại</span>
                <div style="text-align:right;"><div class="nlsp-page-title">${escapeText(title)}</div><div class="nlsp-page-sub">${escapeText(sub)}</div></div>
            </div>
            <div id="nlsp-${key}-body"></div>
        `;
        const back = pane.querySelector('[data-back="1"]');
        if (back) back.addEventListener('click', backHome);
        const body = getDoc().getElementById('nlsp-' + key + '-body');
        if (body) bodyFn(body);
    }

    /* ---------- 小游戏：扫雷 ---------- */

    /* ---------- 小游戏：扫雷 ---------- */
    var mineGame = { grid:[], rows:8, cols:8, mines:10, over:false, revealed:0, flags:0 };
    function initMineGame() {
        mineGame = { grid:[], rows:8, cols:8, mines:10, over:false, revealed:0, flags:0 };
        var r=mineGame.rows,c=mineGame.cols;
        for(var i=0;i<r;i++){ mineGame.grid[i]=[]; for(var j=0;j<c;j++) mineGame.grid[i][j]={mine:false,revealed:false,flagged:false,adj:0}; }
        var placed=0;
        while(placed<mineGame.mines){ var ri=Math.floor(Math.random()*r),ci=Math.floor(Math.random()*c); if(!mineGame.grid[ri][ci].mine){ mineGame.grid[ri][ci].mine=true;placed++;} }
        for(var i=0;i<r;i++)for(var j=0;j<c;j++)if(!mineGame.grid[i][j].mine){var cnt=0;for(var di=-1;di<=1;di++)for(var dj=-1;dj<=1;dj++){var ni=i+di,nj=j+dj;if(ni>=0&&ni<r&&nj>=0&&nj<c&&mineGame.grid[ni][nj].mine)cnt++;}mineGame.grid[i][j].adj=cnt;}
    }
    function revealCell(i,j){
        if(mineGame.over||i<0||i>=mineGame.rows||j<0||j>=mineGame.cols)return;
        var c=mineGame.grid[i][j];
        if(c.revealed||c.flagged)return;
        c.revealed=true;mineGame.revealed++;
        if(c.mine){mineGame.over=true;gameOver(false);return;}
        if(c.adj===0){for(var di=-1;di<=1;di++)for(var dj=-1;dj<=1;dj++)revealCell(i+di,j+dj);}
        paintMineBoard();
        if(mineGame.revealed+mineGame.mines>=mineGame.rows*mineGame.cols)mineGame.over=true,gameOver(true);
    }
    function gameOver(won){
        var area=document.getElementById('nlsp-mine-board');
        if(!area)return;
        if(won)toast('Chiến thắng Dò Mìn!', 'success');
        else{for(var i=0;i<mineGame.rows;i++)for(var j=0;j<mineGame.cols;j++)mineGame.grid[i][j].revealed=true;}
        paintMineBoard();
    }
    function paintMineBoard(){
        var area=document.getElementById('nlsp-mine-board');
        if(!area)return;
        var h='';
        for(var i=0;i<mineGame.rows;i++){
            h+='<div style="display:flex">';
            for(var j=0;j<mineGame.cols;j++){
                var c=mineGame.grid[i][j];
                var cls='nlsp-mine-cell';
                if(c.revealed){cls+=' nlsp-mine-open';if(c.mine)cls+=' nlsp-mine-boom';}
                if(!c.revealed&&!c.flagged)cls+=' nlsp-mine-closed';
                var txt='';
                if(c.revealed&&c.mine)txt='💣';
                else if(c.revealed&&c.adj>0)txt=c.adj;
                else if(c.flagged)txt='🚩';
                h+='<div class="'+cls+'" data-mi="'+i+'" data-mj="'+j+'" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;cursor:'+(mineGame.over?'default':'pointer')+'">'+txt+'</div>';
            }
            h+='</div>';
        }
        area.innerHTML=h;
        area.querySelectorAll('.nlsp-mine-cell').forEach(function(el){
            if(mineGame.over)return;
            el.addEventListener('click',function(){revealCell(parseInt(el.dataset.mi),parseInt(el.dataset.mj))});
            el.addEventListener('contextmenu',function(e){e.preventDefault();var ii=parseInt(el.dataset.mi),jj=parseInt(el.dataset.mj);var cc=mineGame.grid[ii][jj];if(cc.revealed)return;cc.flagged=!cc.flagged;paintMineBoard()});
        });
    }
    function renderGameView(pane){
        initMineGame();
        pane.innerHTML='<div class="nlsp-page-head"><span class="nlsp-back" data-back="1">‹ Quay Lại</span><div style="text-align:right"><div class="nlsp-page-title">Dò Mìn</div><div class="nlsp-page-sub">8×8 · '+mineGame.mines+' mìn</div></div></div><div style="display:flex;justify-content:center;margin:10px 0"><button class="nlsp-btn ghost" id="nlsp-mine-new">Trò Chơi Mới</button></div><div id="nlsp-mine-board" style="display:inline-block;margin:0 auto"></div>';
        var back=pane.querySelector('[data-back="1"]');
        if(back)back.addEventListener('click',backHome);
        paintMineBoard();
        var btn=document.getElementById('nlsp-mine-new');
        if(btn)btn.addEventListener('click',function(){initMineGame();paintMineBoard()});
    }

    function renderTaskBody(body) {
        body.innerHTML = `
            <div class="nlsp-page-head">
                <span class="nlsp-page-sub">Làm xong nhấn "Hoàn thành" để nhận thưởng</span>
                <button class="nlsp-btn ghost" id="nlsp-task-refresh">Làm Mới Nhiệm Vụ</button>
            </div>
            <div id="nlsp-task-list"></div>
        `;
        paintTasks();
        on('nlsp-task-refresh', 'click', async () => {
            const btn = getDoc().getElementById('nlsp-task-refresh');
            if (btn) btn.disabled = true;
            const list = getDoc().getElementById('nlsp-task-list');
            if (list) list.innerHTML = '<div class="nlsp-loading">Đang tạo nhiệm vụ mới…</div>';
            try {
                const tasks = await apiGenerateTask(state, { first: false });
                state.tasks = tasks || [];
                saveState();
                paintTasks();
                toast('Nhiệm vụ đã được làm mới', 'success');
            } catch (e) {
                if (list) list.innerHTML = `<div class="nlsp-muted">Làm mới thất bại: ${escapeText(e && e.message || e)}</div>`;
                toast('Làm mới thất bại', 'error');
            } finally {
                if (btn) btn.disabled = false;
            }
        });
    }

    function paintTasks() {
        const list = getDoc().getElementById('nlsp-task-list');
        if (!list) return;
        if (!state.tasks.length) {
            list.innerHTML = '<div class=”nlsp-muted”>Chưa có nhiệm vụ, nhấn “Làm Mới Nhiệm Vụ” ở góc trên bên phải để tạo.</div>';
            return;
        }
        list.innerHTML = '<div class=”nlsp-rows”>' + state.tasks.map((t, i) => `
            <div class=”nlsp-card nlsp-task-card” style=”margin-bottom:10px;”>
                <div class=”tmeta”>
                    <span class=”seq”>#${i + 1}</span>
                    <span class=”iname”>${escapeText(t.name || 'Nhiệm vụ chưa đặt tên')}</span>
                    ${t.status === 'done' ? '<span class=”status-done”>Đã hoàn thành</span>' : (t.status === 'doing' ? '<span class=”status-doing”>Đang tiến hành</span>' : '<span class=”nlsp-page-sub”>Chưa bắt đầu</span>')}
                </div>
                <div class=”tdesc” style=”margin-top:4px;”>${escapeText(t.desc || '')}</div>
                <div class=”tgoal” style=”margin-top:4px;”>Mục tiêu: ${escapeText(t.goal || '')}</div>
                <div class=”treward” style=”margin-top:2px;”>Phần thưởng: <span class=”nlsp-pt”>${Number(t.reward || 0)} điểm</span>${t.itemReward ? ' · ' + escapeText(t.itemReward) : ''}</div>
                <div class=”tactions”>
                    ${t.status === 'done' ? '<span class=”status-done” style=”padding:4px;”>Đã nhận thưởng</span>' :
                        `<button class=”nlsp-btn ghost” data-task-start=”${i}” ${t.status === 'doing' ? 'disabled' : ''}>${t.status === 'doing' ? 'Đang tiến hành' : 'Bắt Đầu'}</button>
                         <button class=”nlsp-btn” data-task-done=”${i}” ${t.status !== 'doing' ? 'disabled' : ''}>Hoàn Thành</button>`}
                </div>
            </div>`).join('') + '</div>';
        bindTask('data-task-start', (i) => {
            const t = state.tasks[i];
            if (!t) return;
            if (t.status !== 'doing') t.status = 'doing';
            saveState(); paintTasks();
            toast('Đã bắt đầu nhiệm vụ: ' + t.name, 'success');
            insertIntoChat('📋 Nhận nhiệm vụ: ' + (t.name || ''),
                'Giới thiệu: ' + (t.desc || '') + '\nMục tiêu: ' + (t.goal || '') + (t.reward ? '\nPhần thưởng: ' + t.reward + ' điểm' : '') + (t.itemReward ? ' · ' + t.itemReward : ''), 'task');
        });
        bindTask('data-task-done', (i) => completeTask(i));
    }

    function bindTask(attr, cb) {
        const pane = getDoc().getElementById('nlsp-pane');
        if (!pane) return;
        pane.querySelectorAll(`[${attr}]`).forEach((b) => {
            b.addEventListener('click', () => cb(Number(b.getAttribute(attr))));
        });
    }

    function completeTask(i) {
        const t = state.tasks[i];
        if (!t || t.status !== 'doing') return;
        const reward = Number(t.reward || 0);
        state.points += reward;
        if (t.itemReward) pushInventory([{ name: t.itemReward, category: 'Phần thưởng nhiệm vụ', desc: 'Nhận được khi hoàn thành nhiệm vụ「' + (t.name || '') + '」', rarity: 'Hiếm', from: 'Nhiệm vụ' }]);
        state.tasks.splice(i, 1);
        saveState();
        toast(`Hoàn thành nhiệm vụ, nhận được ${reward} điểm${t.itemReward ? ' · ' + t.itemReward : ''}`, 'success');
        paintTasks();
        renderMainTop();
    }

    function renderMainTop() {
        const pill = getDoc().querySelector('.nlsp-pt-pill');
        if (pill) pill.textContent = 'Điểm ' + state.points;
    }

    /* 首次获得物品时，在 ST 输入框自动填入一次静默变量指令（不重复填写） */
    function pushInventory(items) {
        const norm = [];
        if (Array.isArray(items)) for (const it of items) {
            if (!it || !it.name) continue;
            norm.push({
                name: String(it.name).slice(0, 60),
                category: String(it.category || '').slice(0, 30),
                desc: String(it.desc || it.function || '').slice(0, 200),
                rarity: String(it.rarity || 'Thường').slice(0, 12),
                from: String(it.from || 'Cửa Hàng').slice(0, 20),
                time: Date.now()
            });
        }
        if (!norm.length) return;
        state.inventory = state.inventory.concat(norm);
        if (state.inventory.length > 999) state.inventory = state.inventory.slice(-999);
        saveState();
    }

    /* ---------- Cửa hàng ---------- */
    function renderShopBody(body) {
        body.innerHTML = `
            <div class=”nlsp-page-head”>
                <span class=”nlsp-page-sub”>Điểm hiện tại <span class=”nlsp-pt”>${state.points}</span></span>
                <button class=”nlsp-btn ghost” id=”nlsp-shop-refresh”>Làm Mới Sản Phẩm</button>
            </div>
            <div id=”nlsp-shop-list”></div>
        `;
        paintShop();
        on('nlsp-shop-refresh', 'click', async () => {
            const btn = getDoc().getElementById('nlsp-shop-refresh');
            if (btn) btn.disabled = true;
            const list = getDoc().getElementById('nlsp-shop-list');
            if (list) list.innerHTML = '<div class=”nlsp-loading”>Đang tạo sản phẩm…</div>';
            try {
                const items = await apiGenerateShop(state);
                state.shop = items;
                saveState();
                paintShop();
                renderMainTop();
                toast('Cửa hàng đã được làm mới', 'success');
            } catch (e) {
                if (list) list.innerHTML = `<div class=”nlsp-muted”>Làm mới thất bại: ${escapeText(e && e.message || e)}</div>`;
                toast('Làm mới thất bại', 'error');
            } finally {
                if (btn) btn.disabled = false;
            }
        });
    }

    function paintShop() {
        const list = getDoc().getElementById('nlsp-shop-list');
        if (!list) return;
        if (!state.shop.length) { list.innerHTML = '<div class=”nlsp-muted”>Chưa có sản phẩm, nhấn “Làm Mới Sản Phẩm” để tạo.</div>'; return; }
        list.innerHTML = `<div class=”nlsp-grid3”>` + state.shop.map((it, i) => `
            <div class=”nlsp-card”>
                <div class=”iname”>${escapeText(it.name || 'Chưa đặt tên')}</div>
                <span class=”icate”>${escapeText(it.category || 'Chưa phân loại')}</span>
                <div class=”idesc”>${escapeText(it.desc || it.function || '')}</div>
                <div class=”ibot”>
                    <span class=”nlsp-pt”>${Number(it.cost || 0)} điểm</span>
                    <button class=”nlsp-btn” data-buy=”${i}” ${state.points < (it.cost || 0) ? 'disabled' : ''}>Mua</button>
                </div>
            </div>`).join('') + `</div>`;
        list.querySelectorAll('[data-buy]').forEach((b) => b.addEventListener('click', () => buyItem(Number(b.getAttribute('data-buy')))));
    }

    function buyItem(idx) {
        const item = state.shop[idx];
        if (!item) return;
        const cost = Number(item.cost || 0);
        if (state.points < cost) return toast('Không đủ điểm', 'error');
        state.points -= cost;
        pushInventory([{ name: item.name, category: item.category, desc: item.desc || item.function || '', rarity: item.rarity || 'Thường', from: 'Cửa Hàng' }]);
        saveState();
        toast(`Đã mua「${item.name}」`, 'success');
        insertIntoChat('✅ Đã mua「' + (item.name || '') + '」', 'Giới thiệu: ' + (item.desc || item.function || '') + (item.category ? '\nLoại: ' + item.category : '') + (item.rarity ? '\nĐộ hiếm: ' + item.rarity : ''));
        renderMainTop(); paintShop();
    }

    /* ---------- Quay thưởng ---------- */
    function renderDrawBody(body) {
        body.innerHTML = `
            <div class="nlsp-page-head">
                <span class="nlsp-page-sub">Điểm hiện tại <span class="nlsp-pt">${state.points}</span></span>
                <div style="display:flex; gap:8px;">
                    <button class="nlsp-btn ghost" id="nlsp-draw-1">Quay 1 lần (${DRAW_COST_ONE})</button>
                    <button class="nlsp-btn" id="nlsp-draw-10">Quay 10 lần (${DRAW_COST_TEN})</button>
                </div>
            </div>
            ${state.draws.length ? '<div class="nlsp-section-title" style="margin:14px 0 8px;">Kết quả quay thưởng gần đây</div>' : ''}
            <div id="nlsp-draw-area">${state.draws.length ? renderDrawResults(state.draws) : '<div class="nlsp-muted">Chưa quay thưởng.</div>'}</div>
        `;
        on('nlsp-draw-1', 'click', () => doDraw(1));
        on('nlsp-draw-10', 'click', () => doDraw(10));
    }

    function renderDrawResults(list) {
        return list.map((g) => `
            <div class="nlsp-result">
                <div class="nlsp-section-title" style="margin:0 0 4px;">${escapeText(g.title)} · <span class="nlsp-pt">-${g.cost}</span></div>
                ${g.items.map((it) => `
                    <div style="display:flex; gap:8px; align-items:center; padding:6px 0; border-top:1px solid ${cyber.cyan}1a;">
                        <span class="nlsp-rarity nlsp-r-${escapeAttr(it.rarity || 'Thường')}">${escapeText(it.rarity || 'Thường')}</span>
                        <span style="color:#fff; font-weight:600;">${escapeText(it.name || 'Không rõ')}</span>
                        <span class="nlsp-page-sub">[${escapeText(it.category || '')}] ${escapeText(it.desc || '')}</span>
                    </div>`).join('')}
            </div>`).join('');
    }

    async function doDraw(count) {
        const cost = count === 10 ? DRAW_COST_TEN : DRAW_COST_ONE;
        if (state.points < cost) return toast('Không đủ điểm, không thể quay thưởng', 'error');
        const area = getDoc().getElementById('nlsp-draw-area');
        const old = area ? area.innerHTML : '';
        if (area) area.innerHTML = '<div class="nlsp-loading">Đang tạo kết quả quay thưởng…</div>';
        try {
            const items = await apiGenerateDraw(state, count);
            state.points -= cost;
            const group = { title: count === 10 ? 'Kết quả 10 lần' : 'Kết quả 1 lần', cost, items, time: Date.now() };
            state.draws = [group, ...state.draws].slice(0, 12);
            pushInventory(items.map((it) => ({ name: it.name, category: it.category, desc: it.desc, rarity: it.rarity || 'Thường', from: 'Quay Thưởng' })));
            saveState();
            if (area) area.innerHTML = renderDrawResults(state.draws);
            renderMainTop();
            const gainLines = items.map((it) => '【' + (it.name || 'Không rõ') + '】' + (it.desc || '') + (it.rarity ? '（' + it.rarity + '）' : ''));
            insertIntoChat('🎁 Quay thưởng hoàn tất, vật phẩm nhận được lần này', gainLines.join('\n') || '（Không có）', 'draw');
            toast('Quay thưởng hoàn tất', 'success');
        } catch (e) {
            if (area) area.innerHTML = `<div class="nlsp-muted">Quay thưởng thất bại: ${escapeText(e && e.message || e)}</div>` + old;
            toast('Quay thưởng thất bại', 'error');
        }
    }

    /* ---------- Phân giải ---------- */
    function renderDecomposeBody(body) {
        body.innerHTML = `
            <div class="nlsp-page-head">
                <span class="nlsp-page-sub">Nhập tên vật phẩm để phân giải, vật phẩm càng cao cấp thì nhận được càng nhiều điểm</span>
            </div>
            <div class="nlsp-row">
                <label class="nlsp-label">Tên vật phẩm</label>
                <input id="nlsp-decomp-name" class="nlsp-input" placeholder="Nhập tên vật phẩm muốn phân giải…" />
            </div>
            <div style="margin-top:10px;">
                <button class="nlsp-btn" id="nlsp-decomp-go">Phân Giải</button>
            </div>
            <div id="nlsp-decomp-status" class="nlsp-page-sub" style="margin-top:10px;"></div>
        `;
        on('nlsp-decomp-go', 'click', async () => {
            var inp = getDoc().getElementById('nlsp-decomp-name');
            var name = inp ? String(inp.value||'').trim() : '';
            if (!name) return toast('Vui lòng nhập tên vật phẩm', 'error');
            var stEl = getDoc().getElementById('nlsp-decomp-status');
            if (stEl) stEl.textContent = 'Đang phân giải…';
            try {
                var sysName = state.system.name || 'Bảng Hệ Thống';
                var r = await apiChat(state, {
                    system: 'Bạn là chuyên gia phân giải vật phẩm. Dựa trên tên và thiết lập của vật phẩm để đánh giá mức độ hiếm và đưa ra điểm phân giải cùng mô tả ngắn. Chỉ được xuất một dòng JSON.',
                    user: 'Trong hệ thống「'+sysName+'」phân giải vật phẩm: '+name+'. Tên vật phẩm càng oai/càng hiếm/càng huyền thoại, điểm càng cao (đồ thường 50~200, đồ hiếm 300~800, sử thi 1000~3000, thần binh huyền thoại 5000~20000). Trả về JSON: {"points":số nguyên,"desc":"mô tả một câu về sản phẩm phân giải"}',
                    temperature: 0.8, maxTokens: 100
                });
                var d=extractJson(r);
                var points=Math.max(10,Math.floor(Number(d.points)||100));
                var desc=String(d.desc||'').trim()||'Phân giải hoàn tất, nhận được nguyên liệu cơ bản';
                if (stEl) { stEl.textContent = desc+'（+'+points+' điểm）'; stEl.style.color = '#9dffb0'; }
                state.points += points;
                saveState();
                renderMainTop();
                await insertIntoChat('Phân giải「' + name + '」', 'Nhận được '+points+' điểm\n'+desc, 'decompose');
                if (inp) inp.value = '';
                toast('Phân giải nhận được '+points+' điểm', 'success');
            } catch (e) {
                if (stEl) { stEl.textContent = 'Phân giải thất bại: ' + (e&&e.message||e); stEl.style.color = '#ff8a8a'; }
            }
        });
    }

    /* ---------- Đối thoại ---------- */
    function renderChatView(pane) {
        pane.style.display = 'flex';
        pane.style.flexDirection = 'column';
        pane.style.padding = '8px 6px 0 6px';
        pane.innerHTML = `
            <div class="nlsp-page-head" style="margin:0 6px 6px;">
                <span class="nlsp-back" data-back="1">‹ Quay Lại</span>
                <div style="display:flex;align-items:center;gap:10px;">
                    <span class="nlsp-page-sub">Đối thoại với「${escapeText(state.persona.name)}」</span>
                    <span class="nlsp-icon" id="nlsp-persona-open" title="Cài đặt nhân cách" style="font-size:18px;">👤</span>
                </div>
            </div>
            <div class="nlsp-chat" id="nlsp-chat-area">${renderChatMessages()}</div>
            <div class="nlsp-input-bar">
                <input id="nlsp-chat-input" class="nlsp-input" placeholder="Trò chuyện với hệ thống…" />
                <button class="nlsp-btn" id="nlsp-chat-send">Gửi</button>
            </div>
        `;
        const back = pane.querySelector('[data-back="1"]');
        if (back) back.addEventListener('click', backHome);
        scrollToBottom();
        const sendBtn = getDoc().getElementById('nlsp-chat-send');
        const inputEl = getDoc().getElementById('nlsp-chat-input');
        const send = () => {
            const text = (inputEl && inputEl.value || '').trim();
            if (!text) return;
            inputEl.value = '';
            appendChat('user', text);
            chatSend(text);
        };
        if (sendBtn) sendBtn.addEventListener('click', send);
        if (inputEl) inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
        on('nlsp-persona-open', 'click', () => renderPersonaPane());
    }

    /* ---------- Chức năng riêng ---------- */
    function renderExclBody(body, idx) {
        idx=idx||0;
        var excls=state.exclusiveFunctions||[];
        const ef = excls[idx] || {};
        const prefs=state.exclusivePreferences||[];
        var curPref=prefs[idx]||'';
        const streak = state._streak || 0;
        const reward = Math.floor(streak * 12 + 20 + Math.random() * 30);
        const html = (ef.html || '')
            .replace(/\{%\s*points\s*%\}/g, String(state.points))
            .replace(/\{%\s*streak\s*%\}/g, String(streak))
            .replace(/\{%\s*reward\s*%\}/g, String(reward));
        body.innerHTML = `
            <div class="nlsp-page-head">
                <span class="nlsp-page-sub">${escapeText(ef.desc || '')}</span>
                <button class="nlsp-btn ghost" id="nlsp-excl-refresh">Làm Mới</button>
                ${state.exclCostPoints ? '<button class="nlsp-btn ghost" id="nlsp-excl-refresh-cost">💰Chi Phí Làm Mới</button>' : ''}
            </div>
            <div id="nlsp-excl-content">${html || '<div class="nlsp-muted">Chức năng riêng đã được tạo, nhấn nút làm mới để tạo lại.</div>'}</div>
            <div id="nlsp-excl-status" class="nlsp-page-sub" style="margin-top:10px;"></div>
        `;
        bindExclActions();
        on('nlsp-excl-refresh-cost', 'click', async () => {
            var btn = getDoc().getElementById('nlsp-excl-refresh-cost');
            if (btn) btn.disabled = true;
            try {
                var excls = state.exclusiveFunctions || [];
                var cur = excls[idx] || {};
                cur.cost = await apiRefreshExclCost(state, cur);
                excls[idx] = cur;
                saveState();
                renderExclBody(body, idx);
                toast('Chi phí đã cập nhật thành ' + cur.cost + ' điểm', 'success');
            } catch(e) {
                toast('Làm mới thất bại: ' + (e && e.message || e), 'error');
            }
            if (btn) btn.disabled = false;
        });
        on('nlsp-excl-refresh', 'click', () => {
            const area = getDoc().getElementById('nlsp-excl-content');
            if (!area) return;
            area.innerHTML = '<div class="nlsp-card" id="nlsp-excl-dialog"><div class="nlsp-section-title">Prompt chức năng riêng</div><div class="nlsp-page-sub" style="margin-bottom:6px">Chỉnh sửa rồi nhấn tạo, để trống thì ngẫu nhiên hoàn toàn.</div><textarea id="nlsp-excl-dlg-pref" class="nlsp-textarea" style="min-height:70px">'+escapeText(curPref)+'</textarea><div style="margin-top:10px;display:flex;gap:8px;justify-content:flex-end"><button class="nlsp-btn ghost" id="nlsp-excl-dlg-cancel">Hủy</button><button class="nlsp-btn" id="nlsp-excl-dlg-go">Tạo với prompt này</button></div></div>';
            on('nlsp-excl-dlg-cancel', 'click', () => { if(area) renderExclBody(body, idx); });
            on('nlsp-excl-dlg-go', 'click', async () => {
                const ta = getDoc().getElementById('nlsp-excl-dlg-pref');
                var p = ta ? String(ta.value||'').trim() : curPref;
                if (!state.exclusivePreferences) state.exclusivePreferences=[];
                state.exclusivePreferences[idx]=p;
                saveState();
                if (area) area.innerHTML = '<div class="nlsp-loading">Đang tạo chức năng riêng…</div>';
                try {
                    const data = await apiGenerateExclusive(state, p);
                    if(data){if(!state.exclusiveFunctions)state.exclusiveFunctions=[];state.exclusiveFunctions[idx]=data;}
                    saveState();
                    renderExclBody(body, idx);
                    toast('Chức năng riêng đã được làm mới', 'success');
                } catch (e) {
                    if (area) { area.innerHTML = '<div class="nlsp-card"><div class="nlsp-muted">Làm mới thất bại: '+escapeText(e&&e.message||e)+'</div><button class="nlsp-btn ghost" id="nlsp-excl-retry">Thử Lại</button></div>'; on('nlsp-excl-retry','click',()=>{const b=getDoc().getElementById('nlsp-excl-refresh');if(b)b.click();}); }
                    toast('Làm mới thất bại', 'error');
                }
            });
        });
    }

    function bindExclActions() {
        var bodyId='nlsp-'+activeView+'-body';
        const body = getDoc().getElementById(bodyId);
        if (!body) return;
        body.querySelectorAll('[data-excl-act]').forEach((b) => {
            b.addEventListener('click', async () => {
                const act = b.getAttribute('data-excl-act');
                const msg = b.getAttribute('data-excl-msg') || ('Đã thực hiện「' + act + '」');
                b.disabled = true;
                try { await handleExclAction(act); } catch (e) { toast('Thao tác thất bại: ' + (e && e.message || e), 'error'); }
                b.disabled = false;
            });
        });
    }

    async function handleExclAction(act) {
        var excls=state.exclusiveFunctions||[];
        var ef=excls[0]||{};
        if(activeView.indexOf('excl')===0){var i=parseInt(activeView.slice(4))||0;ef=excls[i]||{};}
        if(state.exclCostPoints&&ef.cost>0){if(state.points<ef.cost){toast('Không đủ điểm, cần '+ef.cost+' điểm, hiện chỉ có '+state.points,'error');return}state.points-=ef.cost;saveState();var ptspan=getDoc().getElementById('nlsp-pt-span');if(ptspan)ptspan.textContent=state.points;toast('Đã trừ '+ef.cost+' điểm','info')}
        const stEl = getDoc().getElementById('nlsp-excl-status');
        if (stEl) { stEl.textContent = 'Đang xử lý…'; stEl.style.color = ''; }
        try {
            const result = await apiChat(state, {
                system: 'Bạn là bộ xử lý chức năng riêng của hệ thống, thực hiện thao tác theo yêu cầu người dùng dựa trên ngữ cảnh hệ thống. Chỉ trả về kết quả ngắn gọn bằng ngôn ngữ tự nhiên, không quá 80 từ.',
                user: 'Nhãn thao tác chức năng riêng của hệ thống「' + state.system.name + '」: ' + act + '. Hãy thực hiện thao tác này và trả về kết quả.',
                temperature: 0.7, maxTokens: 120
            });
            if (stEl) { stEl.textContent = String(result).trim(); stEl.style.color = '#9dffb0'; }
            const pts = extractPoints(result);
            if (pts) { state.points += pts; saveState(); renderMainTop(); toast('Nhận được ' + pts + ' điểm', 'success'); }
            await insertIntoChat('⭐ ' + (ef.name||'Chức Năng Riêng') + ' · ' + act,
                'Kết quả thao tác: ' + String(result).trim(),
                'excl');
        } catch (e) {
            if (stEl) { stEl.textContent = 'Thất bại: ' + (e && e.message || e); stEl.style.color = '#ff8a8a'; }
        }
    }

    function extractPoints(text) {
        const m = String(text || '').match(/[+-]?\d+/g);
        if (!m) return 0;
        let total = 0;
        for (const s of m) total += parseInt(s, 10) || 0;
        return Math.abs(total) < 100 ? total : 0;
    }

    function renderChatMessages() {
        if (!state.chat.length) return '<div class="nlsp-p-empty">Chưa có cuộc trò chuyện, hãy gửi tin nhắn để bắt đầu.</div>';
        return state.chat.map((m) => `
            <div class="nlsp-msg ${m.role === 'user' ? 'user' : 'ai'}">
                <div class="meta">${m.role === 'user' ? 'Tôi' : escapeText(state.persona.name)}</div>
                ${escapeText(m.content)}
            </div>`).join('');
    }

    function appendChat(role, content, opts) {
        state.chat.push({ role, content, time: Date.now() });
        if (state.chat.length > 80) state.chat = state.chat.slice(-80);
        saveState();
        const area = getDoc().getElementById('nlsp-chat-area');
        if (!area) return;
        area.innerHTML = renderChatMessages();
        scrollToBottom();
    }

    function scrollToBottom() {
        const area = getDoc().getElementById('nlsp-chat-area');
        if (area) area.scrollTop = area.scrollHeight;
    }

    async function chatSend(text) {
        appendChat('system', 'Đang suy nghĩ…');
        try {
            const reply = await apiChatReply(state, text);
            state.chat.pop();
            saveState();
            appendChat('assistant', reply);
        } catch (e) {
            state.chat.pop();
            saveState();
            appendChat('system', 'Gọi API thất bại: ' + (e && e.message || e));
        }
    }

    /* ---------- Cài đặt nhân cách ---------- */
    function renderPersonaPane() {
        setShell(`
            ${shellTopBar('Cài Đặt Nhân Cách', 'Thiết lập nhân cách hiện tại của hệ thống', '<span class="nlsp-back" id="nlsp-persona-back">‹ Quay Lại</span><span class="nlsp-close" id="nlsp-close-main">×</span>')}
            <div class="nlsp-body">
                <div class="nlsp-pane">
                    <div class="nlsp-row">
                        <label class="nlsp-label">Tên nhân cách</label>
                        <input id="nlsp-p-name" class="nlsp-input" value="${escapeAttr(state.persona.name)}" />
                    </div>
                    <div class="nlsp-row">
                        <label class="nlsp-label">Danh tính / Vai trò</label>
                        <input id="nlsp-p-role" class="nlsp-input" value="${escapeAttr(state.persona.role)}" />
                    </div>
                    <div class="nlsp-row">
                        <label class="nlsp-label">Phong cách ngôn từ</label>
                        <input id="nlsp-p-tone" class="nlsp-input" value="${escapeAttr(state.persona.tone)}" />
                    </div>
                    <div class="nlsp-row">
                        <label class="nlsp-label">Quy tắc hành vi</label>
                        <textarea id="nlsp-p-rules" class="nlsp-textarea">${escapeText(state.persona.rules)}</textarea>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <button class="nlsp-btn ghost" id="nlsp-p-reset">Khôi phục mặc định (Chị Gái Dịu Dàng)</button>
                        <button class="nlsp-btn" id="nlsp-p-save">Lưu và Quay Lại</button>
                    </div>
                    <div id="nlsp-p-tip" class="nlsp-page-sub" style="margin-top:10px;"></div>
                </div>
            </div>
        `);
        on('nlsp-close-main', 'click', closePanel);
        on('nlsp-persona-back', 'click', () => { activeView = 'chat'; render(); });
        on('nlsp-p-reset', 'click', () => {
            const setVal = (id, v) => { const el = getDoc().getElementById(id); if (el) el.value = v; };
            setVal('nlsp-p-name', DEFAULT_PERSONA.name); setVal('nlsp-p-role', DEFAULT_PERSONA.role);
            setVal('nlsp-p-tone', DEFAULT_PERSONA.tone); setVal('nlsp-p-rules', DEFAULT_PERSONA.rules);
            const tip = getDoc().getElementById('nlsp-p-tip');
            if (tip) tip.textContent = 'Đã khôi phục nhân cách Chị Gái Dịu Dàng mặc định, nhấn「Lưu và Quay Lại」để áp dụng.';
        });
        on('nlsp-p-save', 'click', () => {
            state.persona = {
                name: val(getDoc().getElementById('nlsp-p-name')).trim() || DEFAULT_PERSONA.name,
                role: val(getDoc().getElementById('nlsp-p-role')),
                tone: val(getDoc().getElementById('nlsp-p-tone')),
                rules: val(getDoc().getElementById('nlsp-p-rules'))
            };
            saveState();
            toast('Nhân cách đã được lưu', 'success');
            activeView = 'chat';
            render();
        });
    }

    /* ---------- 工具：DOM ---------- */
    function bind(act, fn) {
        const el = overlay() && overlay().querySelector(`[data-act="${act}"]`);
        if (el) el.addEventListener('click', fn);
    }
    function on(id, evt, fn) { const el = getDoc().getElementById(id); if (el) el.addEventListener(evt, fn); }
    function val(el) { return el && typeof el.value === 'string' ? el.value : ''; }
    function escapeText(s) {
        return String(s == null ? '' : s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
    }
    function escapeAttr(s) {
        return String(s == null ? '' : s).replace(/["'<>]/g, (c) => ({ '"': '&quot;', "'": '&#39;', '<': '&lt;', '>': '&gt;' })[c]);
    }

    /* ---------- 工具：聊天正文插入与角色卡判定 ---------- */
    function hasOpenChat() {
        try {
            if (typeof TH.getLastMessageId !== 'function') return false;
            const lastId = TH.getLastMessageId();
            if (typeof lastId !== 'number' || lastId < 0) return false;
            return true;
        } catch (e) { return false; }
    }

    function requireOpenChat(reason) {
        if (!hasOpenChat()) {
            toast('Chưa mở thẻ nhân vật/cuộc trò chuyện' + (reason ? ': ' + reason : '') + '. Vui lòng mở một thẻ nhân vật và vào cuộc trò chuyện trước.', 'error');
            return false;
        }
        return true;
    }

    async function insertIntoChat(title, detail, kind) {
        if (!hasOpenChat()) { toast('Chưa mở thẻ nhân vật, thao tác lần này chưa được ghi vào nội dung.', 'error'); return false; }
        try {
            const lastId = TH.getLastMessageId();
            if (typeof lastId !== 'number' || lastId < 0) {
                toast('Cuộc trò chuyện hiện tại chưa có tin nhắn, vui lòng gửi một tin nhắn trước.', 'error'); return false;
            }
            const msgs = TH.getChatMessages(lastId);
            const m = msgs && msgs[0];
            if (!m) { toast('Đọc tin nhắn gần nhất thất bại, nội dung chưa được ghi.', 'error'); return false; }
            const oldText = String(m.message || '');
            const block = '[SYS_PANEL]\n' + String(title || '') + '\n' + String(detail || '') + '\n[/SYS_PANEL]';
            const sep = oldText && !/\n$/.test(oldText) ? '\n\n' : '\n';
            const newText = oldText + sep + block + '\n';
            await TH.setChatMessages([{ message_id: lastId, message: newText }], { refresh: 'affected' });

            /* Điền lệnh im lặng: nếu ô nhập không có [SYS_PANEL] thì điền */
            const sysName = state.system.name || 'Bảng Hệ Thống';
            const isTask = kind === 'task';
            const isDraw = kind === 'draw';
            const isExcl = kind === 'excl';
            const isDecomp = kind === 'decompose';
            try {
                const ta = window.parent && window.parent.document && window.parent.document.querySelector('#send_textarea');
                if (ta && ta.value.indexOf('[SYS_PANEL]') < 0) {
                    if (isTask) ta.value = '（Nhiệm vụ trong thẻ [SYS_PANEL] cuối đoạn văn trên là nhiệm vụ tôi nhận được trong hệ thống ' + sysName + ', hãy khéo léo lồng ghép tình tiết này vào nội dung chính）';
                    else if (isDraw) ta.value = '（Vật phẩm trong thẻ [SYS_PANEL] cuối đoạn văn trên là vật phẩm tôi quay thưởng được trong hệ thống ' + sysName + ', hãy khéo léo lồng ghép tình tiết này vào nội dung chính và đưa các vật phẩm này vào biến số）';
                    else if (isExcl) ta.value = '（Kết quả trong thẻ [SYS_PANEL] cuối đoạn văn trên là kết quả thực thi chức năng riêng của hệ thống ' + sysName + ', hãy khéo léo lồng ghép tình tiết này vào nội dung chính）';
                    else if (isDecomp) ta.value = '（Nội dung trong thẻ [SYS_PANEL] cuối đoạn văn trên là kết quả phân giải vật phẩm trong hệ thống ' + sysName + ', hãy khéo léo lồng ghép tình tiết này vào nội dung chính）';
                    else ta.value = '（Vật phẩm trong thẻ [SYS_PANEL] cuối đoạn văn trên là vật phẩm tôi mua được trong hệ thống ' + sysName + ', hãy khéo léo lồng ghép tình tiết này vào nội dung chính và đưa các vật phẩm này vào biến số）';
                    ta.dispatchEvent(new Event('input', { bubbles: true }));
                }
            } catch (e) {}
            return true;
        } catch (e) {
            console.warn('[Hệ Thống] Ghi vào nội dung thất bại:', e);
            toast('Ghi vào nội dung thất bại: ' + (e && e.message || e), 'error');
            return false;
        }
    }

    /* ---------- 工具：世界书摘要 ---------- */
    function summarizeWorldbook(name, entries) {
        const list = Array.isArray(entries) ? entries : [];
        if (!list.length) return 'Sách thế giới「' + name + '」trống rỗng.';
        const parts = [];
        for (const e of list) {
            const title = (e && (e.name || e.comment)) || 'Không tên';
            const raw = (e && e.content) || '';
            const content = String(raw).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            const preview = content.slice(0, 120) + (content.length > 120 ? '…' : '');
            parts.push('【' + title + '】' + preview);
        }
        return 'Sách thế giới「' + name + '」có tổng cộng ' + list.length + ' mục:\n' + parts.slice(0, 12).join('\n');
    }

    /* ---------- 工具：HTTP ---------- */
    function normalizeBase(url) {
        return String(url || '').replace(/\/+$/, '').replace(/\/chat\/completions$/i, '').replace(/\/models$/i, '');
    }
    async function safeRead(res) { try { return await res.text(); } catch (e) { return ''; } }

    async function apiListModels(st) {
        const base = normalizeBase(st.api.url);
        if (!base) throw new Error('Chưa nhập địa chỉ API');
        const res = await fetch(base + '/models', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + st.api.key, 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + (await safeRead(res)).slice(0, 200));
        const data = await res.json().catch(() => ({}));
        const arr = Array.isArray(data.data) ? data.data : (Array.isArray(data.models) ? data.models : (Array.isArray(data) ? data : []));
        const names = arr.map((m) => typeof m === 'string' ? m : (m && (m.id || m.name)) || '').filter(Boolean);
        if (!names.length) throw new Error('API không trả về danh sách mô hình');
        return Array.from(new Set(names));
    }

    async function apiChat(st, opts) {
        const base = normalizeBase(st.api.url);
        if (!base) throw new Error('Chưa nhập địa chỉ API');
        if (!st.api.model) throw new Error('Chưa chọn mô hình');
        const messages = [];
        if (opts.system) messages.push({ role: 'system', content: opts.system });
        messages.push({ role: 'user', content: opts.user });
        const body = {
            model: st.api.model, messages,
            temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.85,
            max_tokens: Math.min(opts.maxTokens || 1400, (st.api && st.api.maxTokens) ? st.api.maxTokens : 128000)
        };
        if (opts.json) body.response_format = { type: 'json_object' };
        const res = await fetch(base + '/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + st.api.key, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + (await safeRead(res)).slice(0, 300));
        const data = await res.json().catch(() => ({}));
        const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (typeof text !== 'string') throw new Error('API không trả về văn bản hợp lệ');
        return text;
    }

    function extractJson(text) {
        const raw = String(text || '').trim();
        if (!raw) return {};
        let s = raw;
        const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
        if (fence) s = fence[1];
        const tryParse = (x) => { try { return JSON.parse(x); } catch (e) { return undefined; } };
        for (const open of ['{', '[']) {
            const close = open === '{' ? '}' : ']';
            const start = s.indexOf(open);
            if (start < 0) continue;
            let depth = 0, end = -1, inStr = false, esc = false;
            for (let i = start; i < s.length; i++) {
                const c = s[i];
                if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
                if (c === '"') { inStr = true; continue; }
                if (c === open) depth++;
                else if (c === close) { depth--; if (depth === 0) { end = i; break; } }
            }
            if (end > start) { const r = tryParse(s.slice(start, end + 1)); if (r !== undefined) return r; }
        }
        const r = tryParse(s.trim());
        if (r !== undefined) return r;
        return {};
    }

    /* ---------- 业务：模型上下文 ---------- */
    function getCharInfo() {
        try {
            var ctx = window.parent.SillyTavern.getContext();
            var charId = ctx.characterId;
            var chars = ctx.characters || {};
            var ch = chars[charId] || {};
            return {
                name: ch.name || ctx.name2 || '',
                description: String(ch.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
                personality: String(ch.personality || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
                scenario: String(ch.scenario || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
            };
        } catch (e) { return {}; }
    }
    function getChatHistory(maxCount) {
        maxCount = maxCount || 20;
        try {
            var ctx = window.parent.SillyTavern.getContext();
            var chat = ctx.chat || [];
            var result = [];
            var len = chat.length;
            var start = Math.max(0, len - maxCount);
            for (var i = start; i < len; i++) {
                var msg = chat[i];
                if (msg && msg.mes) {
                    var content = String(msg.mes || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                    if (content) {
                        result.push({
                            role: msg.is_user ? (ctx.name1 || 'Người dùng') : (msg.name || ctx.name2 || 'AI'),
                            content: content
                        });
                    }
                }
            }
            return result;
        } catch (e) { return []; }
    }
    function charContext() {
        var info = getCharInfo();
        var parts = [];
        if (info.name) parts.push('Tên nhân vật: ' + info.name);
        if (info.description) parts.push('Mô tả nhân vật: ' + info.description.slice(0, 500));
        if (info.personality) parts.push('Tính cách nhân vật: ' + info.personality.slice(0, 300));
        if (info.scenario) parts.push('Bối cảnh hiện tại: ' + info.scenario.slice(0, 300));
        return parts.length ? parts.join('\n') : '';
    }
    function chatHistoryContext(maxCount) {
        maxCount = maxCount || 15;
        var msgs = getChatHistory(maxCount);
        if (!msgs.length) return '';
        var lines = [];
        for (var i = 0; i < msgs.length; i++) {
            lines.push(msgs[i].role + '：' + msgs[i].content.slice(0, 250));
        }
        return 'Lịch sử trò chuyện gần đây (' + msgs.length + ' tin nhắn):\n' + lines.join('\n');
    }
    function worldbookContext(st) {
        const wb = st.worldbook || {};
        if (!wb.name) return '';
        return 'Sách thế giới đã đọc: ' + wb.name + '\nTóm tắt sách thế giới:\n' + (wb.summary || '');
    }
    function scriptsContext(st) {
        const sc = (st.scripts || []).filter((s) => s.loaded);
        if (!sc.length) return '';
        const parts = sc.map((s) => {
            const header = '【Script ' + s.name + '】' + s.size + ' ký tự';
            const body = String(s.content || '').replace(/```/g, "'''").replace(/\s+/g, ' ').trim().slice(0, 1500);
            return header + '\n' + (body || '（Trống）');
        });
        return 'Script thẻ nhân vật đã đọc (bao gồm đăng ký zod) tổng cộng ' + sc.length + ' cái:\n' + parts.join('\n----\n');
    }
    function systemContext(st) {
        return [
            'Tên hệ thống: ' + st.system.name,
            'Cốt lõi hệ thống: ' + st.system.purpose,
            'Giới thiệu hệ thống: ' + (st.system.summary || ''),
            worldbookContext(st),
            scriptsContext(st),
            (function(){var cc=charContext();return cc?'【Thông tin thẻ nhân vật hiện tại】\n'+cc:'';})(),
            (function(){var ch=chatHistoryContext(state.contextFloors || 10);return ch?'【'+ch:'';})()
        ].filter(Boolean).join('\n');
    }

    /* ---------- Nghiệp vụ: Khởi tạo hệ thống ---------- */
    async function apiInitSystem(st) {
        const sys = 'Bạn là trợ lý khởi tạo hệ thống, dựa trên thiết lập nhân vật và cốt truyện trò chuyện để tạo dữ liệu khởi tạo phù hợp với bối cảnh câu chuyện hiện tại cho “Bảng Hệ Thống” tương tác. Phải xuất JSON nghiêm ngặt.';
        const user = `Hãy tạo thông tin khởi tạo cho hệ thống sau, chỉ trả về JSON:
{
  “summary”: “1-3 câu giới thiệu hệ thống, thể hiện bầu không khí và cách chơi, phù hợp bối cảnh sách thế giới”,
  “greeting”: “Lời chào mở đầu của hệ thống, ngôi thứ nhất, 2-4 câu, không quá 120 ký tự”,
  “initialPoints”: 0
}
Tên hệ thống: ${st.system.name}
Chức năng cốt lõi: ${st.system.purpose}
${st.worldbook.name ? worldbookContext(st) : ''}
${(function(){try{var ci=getCharInfo();var p=[];if(ci.name)p.push('Nhân vật hiện tại: '+ci.name);if(ci.description)p.push('Mô tả nhân vật: '+ci.description.slice(0,300));return p.length?'Thông tin nhân vật: '+p.join(', '):'';}catch(e){return '';}})()}
Lưu ý: initialPoints là số nguyên, mặc định 0, phạm vi 0~3000. Giới thiệu và lời chào phải phù hợp thiết lập nhân vật và bầu không khí cốt truyện hiện tại. Chỉ trả về JSON.`;
        const text = await apiChat(st, { system: sys, user, json: false, temperature: 0.8, maxTokens: 1500 });
        const obj = extractJson(text);
        return {
            summary: String(obj.summary || '').trim(),
            greeting: String(obj.greeting || '').trim(),
            initialPoints: Math.max(0, Math.min(99999, Math.floor(Number(obj.initialPoints) || 0)))
        };
    }

    /* ---------- Nghiệp vụ: Nhiệm vụ ---------- */
    async function apiGenerateTask(st, opts) {
        const sys = 'Bạn là bộ tạo nhiệm vụ hệ thống, tạo danh sách nhiệm vụ dựa trên thiết lập hệ thống và thế giới quan. Phải xuất đối tượng JSON nghiêm ngặt, key là tasks, value là mảng.';
        const user = `${systemContext(st)}
${opts && opts.first ? 'Hãy tạo 2~4 nhiệm vụ ban đầu phù hợp với giai đoạn đầu của hệ thống.' : 'Hãy tạo 2~4 nhiệm vụ hệ thống, độ khó tăng dần.'}
Mỗi nhiệm vụ gồm các trường: name (tên nhiệm vụ), desc (giới thiệu nhiệm vụ), goal (mục tiêu nhiệm vụ), reward (điểm thưởng khi hoàn thành, số nguyên 50~600), itemReward (tùy chọn, tên đạo cụ thưởng khi hoàn thành, có thể để trống).
Nhiệm vụ đầu tiên nên là nhiệm vụ dẫn đường đơn giản. Độ khó và phần thưởng nên tham chiếu giai đoạn thực lực hiện tại của nhân vật trong lịch sử trò chuyện: nếu nhân vật còn yếu thì tạo nhiệm vụ dễ thưởng thấp, nếu đã mạnh thì tạo nhiệm vụ khó thưởng cao. Chỉ trả về JSON: {"tasks":[{"name":"","desc":"","goal":"","reward":0,"itemReward":""}]}`;
        const text = await apiChat(st, { system: sys, user, json: false, temperature: 0.85, maxTokens: 1100 });
        const obj = extractJson(text);
        const arr = obj.tasks || (Array.isArray(obj) ? obj : []);
        return arr.filter(Boolean).map((t) => ({
            name: String(t.name || 'Nhiệm vụ không tên').slice(0, 40),
            desc: String(t.desc || '').slice(0, 200),
            goal: String(t.goal || '').slice(0, 120),
            reward: Math.max(1, Math.min(9999, Math.floor(Number(t.reward || 100)))),
            itemReward: String(t.itemReward || '').slice(0, 40),
            status: 'todo'
        }));
    }

    /* ---------- Nghiệp vụ: Cửa hàng ---------- */
    async function apiGenerateShop(st) {
        const sys = 'Bạn là bộ tạo cửa hàng hệ thống, tạo danh sách sản phẩm phù hợp với thế giới quan. Phải xuất đối tượng JSON nghiêm ngặt, key là products, value là mảng.';
        var pts = st.points || 0;
        var afford = Math.max(50, Math.floor(pts * 1.2));
        var user = `${systemContext(st)}
Điểm hiện tại: ${pts}
Hãy tạo 6 sản phẩm, mỗi sản phẩm gồm các trường: name (tên), category (loại, như "tiêu hao/trang bị/nguyên liệu/sách kỹ năng/vật kỳ lạ"), desc (mô tả tác dụng một câu), cost (điểm mua, số nguyên), rarity (độ hiếm, giá trị: Thường/Hiếm/SửThi/HuyềnThoại).
Nguyên tắc định giá: dựa trên lịch sử trò chuyện để đánh giá giai đoạn thực lực hiện tại của nhân vật — nếu còn yếu/giai đoạn đầu, phần lớn sản phẩm nên phù hợp với thực lực hiện tại (giá vài chục đến vài trăm điểm, chủ yếu Thường/Hiếm); nếu đã mạnh/có thần khí thì có thể tạo đồ mạnh giá cao độ hiếm cao (hàng ngàn đến hàng vạn điểm). Tuyệt đối không thoát khỏi cốt truyện mà cho nhân vật yếu đồ thần. Sản phẩm phải phù hợp cốt truyện và thực lực nhân vật. Chỉ trả về JSON: {"products":[{"name":"","category":"","desc":"","cost":0,"rarity":""}]}`;
        const text = await apiChat(st, { system: sys, user, json: false, temperature: 0.95, maxTokens: 1100 });
        const obj = extractJson(text);
        const items = obj.products || obj.shop || obj.items || (Array.isArray(obj) ? obj : []);
        return items.filter(Boolean).map((it) => ({
            name: String(it.name || 'Sản phẩm không tên').slice(0, 40),
            category: String(it.category || 'Chưa phân loại').slice(0, 20),
            desc: String(it.desc || it.function || '').slice(0, 120),
            cost: Math.max(1, Math.floor(Number(it.cost || it.price || 100))),
            rarity: ['Thường', 'Hiếm', 'SửThi', 'HuyềnThoại'].includes(it.rarity) ? it.rarity : 'Thường'
        }));
    }

    /* ---------- Nghiệp vụ: Quay thưởng ---------- */
    async function apiGenerateDraw(st, count) {
        const n = count === 10 ? 10 : 1;
        const sys = 'Bạn là hệ thống quay thưởng, tạo vật phẩm phần thưởng dựa trên thế giới quan. Phải xuất đối tượng JSON nghiêm ngặt, key là items, value là mảng.';
        const user = `${systemContext(st)}
Hãy tạo ${n} vật phẩm quay thưởng, mỗi vật phẩm gồm: name (tên), category (loại), desc (mô tả một câu), rarity (độ hiếm: Thường/Hiếm/SửThi/HuyềnThoại/ThầnThoại).
Xác suất độ hiếm: đa số là Thường/Hiếm, SửThi khoảng 10%, HuyềnThoại khoảng 3%, ThầnThoại chỉ khoảng 1% cực kỳ thấp (${n > 1 ? 'quay 10 lần đảm bảo ít nhất 1 Hiếm' : 'không đảm bảo'}). Vật phẩm Thường nên là đồ dùng hàng ngày/tiêu hao, không phải cái nào cũng đặt tên hoa mỹ. Chỉ trả về JSON: {"items":[{"name":"","category":"","desc":"","rarity":""}]}`;
        const text = await apiChat(st, { system: sys, user, json: false, temperature: 1.0, maxTokens: n === 10 ? 1400 : 300 });
        const obj = extractJson(text);
        const arr = obj.items || obj.results || (Array.isArray(obj) ? obj : []);
        const valid = ['Thường', 'Hiếm', 'SửThi', 'HuyềnThoại', 'ThầnThoại'];
        return arr.filter(Boolean).slice(0, n).map((it) => ({
            name: String(it.name || 'Vật phẩm không rõ').slice(0, 40),
            category: String(it.category || '').slice(0, 20),
            desc: String(it.desc || '').slice(0, 120),
            rarity: valid.includes(it.rarity) ? it.rarity : 'Thường'
        }));
    }

    /* ---------- Nghiệp vụ: Chức năng riêng (thuần AI · thử lại · không hard-code) ---------- */
    async function apiRefreshExclCost(st, ef) {
        var ch = getChatHistory(st.contextFloors || 10);
        var chatCtx = '';
        if (ch.length) {
            var lines = [];
            for (var i = 0; i < Math.min(ch.length, 10); i++) {
                lines.push(ch[i].role + ': ' + ch[i].content.slice(0, 180));
            }
            chatCtx = '\nCốt truyện gần đây:\n' + lines.join('\n');
        }
        var pts = st.points || 0;
        var text = await apiChat(st, {
            system: 'Bạn là nhà thiết kế hệ thống, dựa trên cốt truyện nhân vật và số điểm hiện có để xác định chi phí điểm hợp lý cho chức năng riêng. Chỉ trả về một số nguyên, không có văn bản thêm. Nhân vật càng mạnh, điểm càng nhiều thì chi phí càng cao; nhân vật càng yếu, điểm càng ít thì chi phí càng thấp.',
            user: 'Điểm hiện tại: ' + pts + '. Tên hệ thống: ' + (st.system.name || '') + '. Tên chức năng: ' + (ef.name || '') + chatCtx + '\nHãy xuất một số nguyên chi phí điểm hợp lý:',
            temperature: 0.5, maxTokens: 10
        });
        var num = parseInt(String(text).match(/\d+/));
        return isNaN(num) ? Math.floor(pts * 0.15) || 80 : Math.max(1, num);
    }

async function apiGenerateExclusive(st, pref, complexity){
    complexity = complexity || 'simple';
    var isComplex = complexity === 'complex';
    var sn=st.system.name||'Hệ Thống';var sp=st.system.purpose||'';
    var prefText=(typeof pref==='string'?pref:'').trim();
    var wb=st.worldbook||{};
    var wbCtx=wb.name&&wb.summary?('Thiết lập sách thế giới《'+wb.name+'》: '+(wb.summary||'').slice(0,400)+'。'):'';
    var bias=prefText?('\nHãy thiết kế chức năng này theo đúng prompt sau: '+prefText.slice(0,300)):(wbCtx?('\nHãy tham khảo thiết lập thế giới quan sau để thiết kế chức năng: '+wbCtx):'');
    var name='',icon='',desc='',html='',actions=[];
    for(var attempt=0;attempt<3;attempt++){
        try{
            var r=await apiChat(st,{system:'Bạn là nhà thiết kế UI hệ thống. Chỉ xuất một dòng JSON, không có markdown. Trường html là đoạn HTML hợp lệ (không có script), actions là 2~4 tên nút thao tác. Bạn phải tuân thủ nghiêm ngặt prompt người dùng hoặc thế giới quan sách thế giới để tạo chức năng, nghiêm cấm tự ý thay đổi hướng chức năng, nghiêm cấm tạo nội dung khiêu dâm/người lớn/gợi cảm trừ khi prompt người dùng yêu cầu rõ ràng. Nghiêm cấm các mẫu điểm danh/quay thẻ/triệu hồi/cửa hàng.',
            user:'Tạo JSON chức năng tương tác riêng cho hệ thống "'+sn+'"（'+sp.slice(0,90)+'）: {"name":"tên chức năng ≤6 ký tự","icon":"1 emoji","desc":"mô tả ≤12 ký tự","cost":0,"actions":["Thao tác A","Thao tác B","Thao tác C"],"html":"<div>HTML hiển thị thông tin + nút thao tác</div>"}\nYêu cầu cost: '+(state.exclCostPoints?'trường cost là điểm chi phí mỗi lần sử dụng (số nguyên), mỗi nút cần đánh dấu trừ điểm bằng data-excl-cost=\"N\" trong html':'trường cost cố định là 0')+'\nYêu cầu html: '+(isComplex?'800~3000 ký tự, phải bao gồm thẻ <style> để thực hiện CSS phức tạp (hoạt ảnh/gradient/bố cục thẻ/hiệu ứng hover/responsive...), có thể tùy chỉnh tên class, dùng CSS thuần để tạo giao diện tương tác ấn tượng':'150~400 ký tự, class tự do chọn từ ')+'nlsp-card nlsp-page-sub nlsp-pt nlsp-section-title nlsp-btn nlsp-grid3 nlsp-tags nlsp-result nlsp-banner nlsp-row nlsp-center, màu dùng var(--t-accent) var(--t-text) var(--t-title) var(--t-cardBg) var(--t-warn) var(--t-success) var(--t-err) var(--t-pur), {% points %} là placeholder điểm. Mỗi nút thao tác phải có thuộc tính data-excl-act.'+bias,
            temperature:1.0,maxTokens:isComplex?30000:2000});
            var d=extractJson(r);
            if(d.name&&d.icon&&Array.isArray(d.actions)&&d.actions.length&&d.actions[0]&&d.html&&d.html.length>30){
                name=d.name;icon=d.icon;desc=d.desc;actions=d.actions;html=d.html;var cost=Number(d.cost)||0;break;
            }
        }catch(e){}
    }
    name=String(name||'').slice(0,20)||sn.slice(0,6);
    icon=String(icon||'').slice(0,4)||'✨';
    desc=String(desc||'').slice(0,40)||sp.slice(0,12);
    if(!actions.length)actions=[];for(var i=0;i<actions.length;i++)actions[i]=String(actions[i]||'').slice(0,10);
    if(!html||html.length<30){
        var btnHtml='';for(var j=0;j<actions.length;j++){btnHtml+='<button class="nlsp-btn" data-excl-act="'+actions[j]+'" style="margin:6px">'+actions[j]+'</button>';}
        html='<div class="nlsp-result"><div class="nlsp-section-title">'+name+'</div><div class="nlsp-page-sub">'+desc+'</div><div style="font-size:22px;color:var(--t-accent);font-weight:700;margin:8px 0">{% points %}</div>'+btnHtml+'</div>';
    }
    html=String(html).replace(/<script[^>]*>[\s\S]*?<\/script>/gi,'').replace(/\son\w+\s*=/gi,' data-blocked=');
    return{name:name,icon:icon,desc:desc,html:html+'<div id="nlsp-excl-status" class="nlsp-page-sub" style="margin-top:10px;min-height:16px"></div>'};
}

        /* ---------- Nghiệp vụ: Trò chuyện (dùng cài đặt nhân cách) ---------- */
    async function apiChatReply(st, userText) {
        const p = st.persona || DEFAULT_PERSONA;
        const sys = [
            'Bạn là nhân cách đối thoại của hệ thống, hãy duy trì nhân cách và lập trường đã thiết lập để trả lời.',
            'Tên nhân cách: ' + p.name,
            'Danh tính/Vai trò: ' + p.role,
            'Phong cách ngôn từ: ' + p.tone,
            'Quy tắc hành vi: ' + p.rules,
            'Hệ thống: ' + st.system.name + '（Cốt lõi: ' + st.system.purpose + '）',
            st.worldbook.name ? worldbookContext(st) : '',
            'Quy tắc: trả lời ở ngôi thứ nhất, ngắn gọn tự nhiên, mỗi lần trả lời 60~200 ký tự, tuân thủ thiết lập nhân cách trên.'
        ].filter(Boolean).join('\n');
        const msgs = [];
        const history = (st.chat || []).filter((m) => m.role !== 'system' || m.content === 'Đang suy nghĩ…').slice(-10);
        for (const m of history) {
            if (m.role === 'user') msgs.push({ role: 'user', content: m.content });
            else if (m.role === 'assistant') msgs.push({ role: 'assistant', content: m.content });
        }
        msgs.push({ role: 'user', content: userText });
        return apiChatMessages(st, sys, msgs, { temperature: 0.85, maxTokens: 600 });
    }

    async function apiChatMessages(st, system, messages, opts) {
        const base = normalizeBase(st.api.url);
        if (!base) throw new Error('Chưa nhập địa chỉ API');
        if (!st.api.model) throw new Error('Chưa chọn mô hình');
        const body = {
            model: st.api.model,
            messages: [system ? { role: 'system', content: system } : null, ...messages].filter(Boolean),
            temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.85,
            max_tokens: opts.maxTokens || 1400
        };
        const res = await fetch(base + '/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + st.api.key, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + (await safeRead(res)).slice(0, 300));
        const data = await res.json().catch(() => ({}));
        const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (typeof text !== 'string') throw new Error('API không trả về văn bản hợp lệ');
        return text;
    }

    /* ---------- 全局暴露 ---------- */
    window.NailongSystemPanel = {
        toggle() { const doc = getDoc(); if (doc.getElementById(OVERLAY_ID)) { closePanel(); } else { openPanel(); } },
        open() { openPanel(); },
        close() { closePanel(); }
    };

    /* ---------- 自动刷新引擎 ---------- */
    var autoRefreshTimer = null;
    var refreshCounter = 0;
    var lastGenCount = -1;
    function setupAutoRefresh() {
        if (state.autoRefresh) {
            try {
                var te = window.parent && window.parent.SillyTavern && window.parent.SillyTavern.eventSource;
                if (!te) { console.warn('[Hệ Thống] Không tìm thấy eventSource, không thể bật tự động làm mới'); return; }
                if (autoRefreshTimer) return;
                autoRefreshTimer = setInterval(function() {
                    try {
                        var ctx = window.parent.SillyTavern.getContext();
                        var chat = ctx.chat || [];
                        var count = chat.length;
                        if (count === lastGenCount) return;
                        var lastMsg = chat[chat.length - 1];
                        if (!lastMsg || lastMsg.is_user) { lastGenCount = count; return; }
                        if (window.parent.is_generating) return;
                        lastGenCount = count;
                        refreshCounter++;
                        var interval = state.refreshInterval || 1;
                        if (refreshCounter < interval) {
                            console.log('[Hệ Thống] Đếm ngược tự động làm mới: ' + refreshCounter + '/' + interval);
                            return;
                        }
                        refreshCounter = 0;
                        doAutoRefresh();
                    } catch (e) {}
                }, 3000);
                console.log('[Hệ Thống] Tự động làm mới đã bật (kiểm tra mỗi 3 giây)');
            } catch (e) { console.warn('[Hệ Thống] Khởi động tự động làm mới thất bại:', e); }
        } else {
            if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; console.log('[Hệ Thống] Tự động làm mới đã tắt'); }
        }
    }
    var autoRefreshRunning = false;
    async function doAutoRefresh() {
        if (!state.initialized || !state.connected) return;
        if (autoRefreshRunning) return;
        autoRefreshRunning = true;
        try {
            console.log('[Hệ Thống] Bắt đầu tự động làm mới nhiệm vụ/cửa hàng…');
            var tasks = await apiGenerateTask(state, { first: false });
            if (tasks && tasks.length) { state.tasks = tasks; }
            var shop = await apiGenerateShop(state);
            if (shop && shop.length) { state.shop = shop; }
            saveState();
            console.log('[Hệ Thống] Tự động làm mới hoàn tất: ' + (state.tasks?state.tasks.length:0) + ' nhiệm vụ, ' + (state.shop?state.shop.length:0) + ' sản phẩm');
        } catch (e) {
            console.warn('[Hệ Thống] Tự động làm mới thất bại:', e);
        } finally {
            autoRefreshRunning = false;
        }
    }

    /* Lắng nghe nút script JS-Slash-Runner */
    try {
        var btnEvt = getButtonEvent('Bảng Hệ Thống');
        console.log('[Hệ Thống] getButtonEvent trả về:', btnEvt, 'kiểu:', typeof btnEvt);
        if (btnEvt) {
            eventOn(btnEvt, function () {
                console.log('[Hệ Thống] Nút đã được nhấn');
                try {
                    var doc = getDoc();
                    console.log('[Hệ Thống] getDoc hoàn tất');
                    if (doc.getElementById(OVERLAY_ID)) {
                        console.log('[Hệ Thống] Bảng đang mở, đóng lại');
                        closePanel();
                    } else {
                        console.log('[Hệ Thống] Bảng chưa mở, đang mở');
                        openPanel();
                        console.log('[Hệ Thống] openPanel hoàn tất');
                    }
                } catch(e) { console.error('[Hệ Thống] Lỗi khi nhấn nút:', e); }
            });
            console.log('[Hệ Thống] Đăng ký sự kiện nút thành công');
        } else {
            console.warn('[Hệ Thống] Sự kiện nút trống, đăng ký thất bại');
        }
    } catch (e) { console.warn('[Hệ Thống] Đăng ký nút script thất bại:', e); }

    /* ---------- Khởi động ---------- */
    try {
        ensureStyle();
        injectFont();
        setupAutoRefresh();
    } catch (e) { console.error('[Hệ Thống] Khởi động thất bại:', e); }
})();