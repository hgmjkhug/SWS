/* ── DATA ─────────────────────────────────────────── */
var DATA = {
  positions: { 
    total: 990, filled: 518, 
    byWarehouse: { 'Kho mát A': 300, 'Kho mát B': 218, 'Kho mát C': 0 }
  },
  areas: { 
    total: 3, active: 2, inactive: 1,
    details: {
      active: ['Kho mát A', 'Kho mát B'],
      inactive: ['Kho mát C']
    }
  },
  batches: {
    total: 259,
    labels: ['Mới tạo','Đang nhập','Đã lưu kho','Đang xuất','Đã xuất kho'],
    values: [12, 5, 84, 3, 155],
    colors: ['#94a3b8', '#60a5fa', '#34d399', '#f59e0b', '#dc2626']
  },
  commands: { total: 1875, wait: 24, prog: 12, done: 1842, err: 33 },
  devices: {
    statuses: [
      { key:'active', label:'Đang hoạt động', color:'#4ade80', byType:{ lifter:3, shuttle:12 } },
      { key:'idle',   label:'Đang rảnh',      color:'#94a3b8', byType:{ lifter:1, shuttle:3 } },
      { key:'error',  label:'Lỗi',            color:'#f87171', byType:{ lifter:0, shuttle:0 } },
      { key:'maint',  label:'Đang bảo trì',   color:'#fbbf24', byType:{ lifter:0, shuttle:0 } },
    ],
    typeLabels: { lifter:'Lifter', shuttle:'Shuttle' },
    typeIcons:  { lifter:'fa-elevator', shuttle:'fa-shuttle-space' }
  },
  kanban: {
    urgent: [
      {
        id:'#MSN-0841', name:'Xuất pallet — A12-03', device:'AMR-08',
        sla:12, slaElapsed:10, slaClass:'crit', actions:true,
        chain:{ wcs:'Received', plc:'Active', amr:'Executing' },
        chainStatus:{ wcs:'done', plc:'done', amr:'running' }
      }
    ],
    wait: [
      {
        id:'#MSN-0844', name:'Gom đơn hàng số D-912', device:'AMR-02',
        sla:20, slaElapsed:15, slaClass:'warn', actions:false,
        chain:{ wcs:'Created', plc:'Pending', amr:'Pending' },
        chainStatus:{ wcs:'done', plc:'pending', amr:'pending' }
      }
    ],
    prog: [
      { id:'#MSN-0840', name:'Nhập pallet — C03-07',  device:'AMR-12',   sla:15, slaElapsed:4, slaClass:'ok', actions:false,
        chain:{ wcs:'Received', plc:'Active', amr:'Executing' }, chainStatus:{ wcs:'done', plc:'done', amr:'running' } },
      { id:'#MSN-0838', name:'Xuất đơn hàng #4421',   device:'SC_C + AMR-04', sla:20, slaElapsed:8, slaClass:'ok', actions:false,
        chain:{ wcs:'Received', plc:'Active', amr:'Executing' }, chainStatus:{ wcs:'done', plc:'done', amr:'running' } },
      { id:'#MSN-0835', name:'Kiểm kê khu B2',        device:'AMR-09',   sla:30, slaElapsed:18, slaClass:'warn', actions:false,
        chain:{ wcs:'Received', plc:'Active', amr:'Executing' }, chainStatus:{ wcs:'done', plc:'done', amr:'running' } },
    ],
    done: [
      { id:'#MSN-0833', name:'Xuất pallet — D05-12', device:'AMR-06', time:'3.8ph ✓', timeClass:'done' },
      { id:'#MSN-0832', name:'Nhập — Cửa 1 → B03',  device:'SC_A',   time:'4.2ph ✓', timeClass:'done' },
      { id:'#MSN-0831', name:'Chuyển vị trí E-11',   device:'AMR-14', time:'2.1ph ✓', timeClass:'done' },
    ],
    err: [
      {
        id:'#MSN-0839', name:'Nhập hàng — Cửa 2', device:'SC_B',
        sla:5, slaElapsed:4.5, slaClass:'crit', actions:true,
        chain:{ wcs:'Received', plc:'Stuck', amr:'Waiting' },
        chainStatus:{ wcs:'done', plc:'error', amr:'pending' }
      }
    ]
  },
  completionTimes: [
    { label: 'Nhập mới',         time: 6.5, count: 124, color: 'var(--accent)' },
    { label: 'Nhập lại',         time: 4.2, count: 85,  color: 'var(--cyan)' },
    { label: 'Xuất hủy',         time: 5.8, count: 42,  color: 'var(--red)' },
    { label: 'Xuất bán hàng',     time: 7.4, count: 156, color: 'var(--amber)' }
  ],
  errors: [
    { rank:'#1', rankCls:'r1', name:'Lỗi cảm biến vật cản (AMR)', count:142, pct:100, color:'#dc2626', mttr:'18ph', devices:['AMR-07','AMR-12'], trend:'+12%', trendUp:true },
    { rank:'#2', rankCls:'r2', name:'Mất kết nối WCS ↔ PLC',      count:97,  pct:68,  color:'#d97706', mttr:'34ph', devices:['PLC-03'], trend:'-5%', trendUp:false },
    { rank:'#3', rankCls:'r3', name:'Lỗi đọc barcode pallet',     count:61,  pct:43,  color:'#7c3aed', mttr:'8ph',  devices:['AMR-08'], trend:'=', trendUp:null },
    { rank:'#4', rankCls:'r4', name:'Lỗi pin AMR dưới 10%',       count:39,  pct:27,  color:'#0891b2', mttr:'45ph', devices:['AMR-07','AMR-19'], trend:'+3%', trendUp:true },
    { rank:'#5', rankCls:'r5', name:'Timeout lệnh Stacker Crane', count:24,  pct:17,  color:'#9aa5b4', mttr:'22ph', devices:['SC #4'], trend:'-8%', trendUp:false },
  ],
  errTip: '💡 Lỗi #1 chiếm 40% tổng lỗi — MTTR TB: <strong>18ph</strong>. Đề xuất: <strong>Hiệu chỉnh cảm biến AMR định kỳ 2 tuần/lần.</strong>',


  predictive: [
    { iconCls:'sc', icon:'fa-shuttle-space', name:'Shuttle #04',
      meta:'Vận hành: 4,820h / 5,000h', runHours:4820, maxHours:5000, errorFreq:8,
      pct:96, fillCls:'red', badgeCls:'crit', badgeLabel:'KHẨN CẤP',
      linkedError:'Lỗi cảm biến lùi' },
    { iconCls:'sc', icon:'fa-shuttle-space', name:'Shuttle #07',
      meta:'Vận hành: 7,200h / 8,000h', runHours:7200, maxHours:8000, errorFreq:3,
      pct:90, fillCls:'amber', badgeCls:'warn', badgeLabel:'KIỂM TRA',
      linkedError:'Timeout lệnh di chuyển' },
    { iconCls:'sc', icon:'fa-elevator', name:'Lifter #02',
      meta:'Vận hành: 12,400h / 15,000h', runHours:12400, maxHours:15000, errorFreq:5,
      pct:83, fillCls:'amber', badgeCls:'warn', badgeLabel:'KIỂM TRA',
      linkedError:'Mất kết nối PLC' },
  ],
  inventory: {
    total: 35420,
    groups: [
      { name: 'Chuối Nhật Bản', val: 21200, color: '#2563eb', 
        products: [ 
          { name: '14CP - XINFADIN', v: 1200 }, { name: '14CP - SEIKA', v: 1500 }, { name: '14CP - DASANG', v: 800 },
          { name: '16CP - XINFADIN', v: 2200 }, { name: '16CP - SEIKA', v: 3100 }, { name: '16CP - DEL MONTE', v: 1800 },
          { name: '26CP - XINFADIN', v: 900 }, { name: '26CP - SEIKA', v: 1400 }, { name: '26CP - DEL MONTE', v: 1200 }, { name: '26CP - SHIMIZU', v: 1100 }, { name: '26CP - TAITO', v: 700 },
          { name: '30CP - SEIKA', v: 500 }, { name: '30CP - MAINICHI', v: 600 }, { name: '30CP - TAITO', v: 400 }, { name: '30CP - MAINICHI 13KG', v: 3100 }
        ] 
      },
      { name: 'Chuối Trung Quốc', val: 14220, color: '#7c3aed', 
        products: [ 
          { name: 'A456 - TROPICAL', v: 2800 }, { name: 'A456 - SOFIA', v: 1420 }, { name: 'A456 - FRUIT WHARF', v: 1100 }, { name: 'A456 - DASANG', v: 900 },
          { name: 'A789 - TROPICAL', v: 1500 }, { name: 'A789 - SOFIA', v: 1200 },
          { name: 'CL - DASANG', v: 1300 }, { name: 'CL - XINFADIN', v: 1100 }, { name: 'CL - SEIKA', v: 1600 }, { name: 'CL - TROPICAL', v: 1300 }
        ] 
      }
    ]
  },
  productStats: {
    lines: 2,
    groups: 12,
    products: 156
  }
};

/* ── CLOCK ─────────────────────────────────────────── */
var detailClockInterval;
(function startClock() {
  const days = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  function tick() {
    const n = new Date();
    const t = [n.getHours(),n.getMinutes(),n.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');
    const d = `${days[n.getDay()]}, ${n.getDate()} tháng ${n.getMonth()+1}, ${n.getFullYear()}`;
    const te=document.getElementById('rt-time'), de=document.getElementById('rt-date');
    if(te) te.textContent=t; if(de) de.textContent=d;
  }
  tick(); 
  detailClockInterval = setInterval(tick,1000);
})();

/* ── SYNC ──────────────────────────────────────────── */
function doSync() {
  const btn=document.getElementById('btn-sync'); if(!btn) return;
  btn.classList.add('spinning');
  setTimeout(()=>{ btn.classList.remove('spinning'); initAll(); },800);
}

/* ── DONUT CHART ──────────────────────────────────── */
function drawDonut(id, values, colors) {
  const c = document.getElementById(id); if(!c) return;
  const ctx = c.getContext('2d');
  const W = c.clientWidth || c.width, H = c.clientHeight || c.height; 
  c.width = W; c.height = H;
  const cx = W/2, cy = H/2;
  const ro = Math.min(W,H)/2-4, ri = ro*0.62;
  ctx.clearRect(0,0,W,H);
  const total = values.reduce((a,b)=>a+b,0);
  if(!total) {
    ctx.beginPath(); ctx.arc(cx,cy,ro,0,Math.PI*2); ctx.arc(cx,cy,ri,0,Math.PI*2,true);
    ctx.fillStyle='#e2e8f0'; ctx.fill(); return;
  }
  let angle = -Math.PI/2;
  const GAP = 0.04;
  values.forEach((v,i) => {
    if(!v) return;
    const sweep = (v/total)*(Math.PI*2)-GAP;
    ctx.beginPath();
    ctx.arc(cx,cy,ro, angle+GAP/2, angle+sweep+GAP/2);
    ctx.arc(cx,cy,ri, angle+sweep+GAP/2, angle+GAP/2, true);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    angle += sweep+GAP;
  });
}

/* ── KPI PIES ─────────────────────────────────────── */
function renderKPIPies() {
  // ── Vị trí kho ──
  const pos = DATA.positions;
  const empty = pos.total - pos.filled;
  const pct = Math.round((pos.filled / pos.total) * 100);
  const pctEl = document.getElementById('pos-pct');
  if(pctEl) pctEl.textContent = pct + '%';

  const posLegend = document.getElementById('pos-legend');
  if(posLegend) {
    const subItems = Object.entries(pos.byWarehouse).map(([name, val]) => `
      <div class="tree-sub-item">
        <i class="fas fa-warehouse tree-icon"></i>
        <span class="tree-name">${name}</span>
        <span class="tree-val">${val}</span>
      </div>
    `).join('');
    posLegend.innerHTML = `
      <div class="kpi-leg-row">
        <span class="kpi-leg-dot" style="background:#4ade80"></span>
        <span class="kpi-leg-label">Đã lấp đầy</span>
        <span class="kpi-leg-val">${pos.filled}</span>
      </div>
      <div class="tree-sub-list">${subItems}</div>
      <div class="kpi-leg-row" style="margin-top:5px;">
        <span class="kpi-leg-dot" style="background:#e2e8f0"></span>
        <span class="kpi-leg-label">Còn trống</span>
        <span class="kpi-leg-val">${empty}</span>
      </div>
    `;
  }
  drawDonut('c-pos', [pos.filled, empty], ['#4ade80','#e2e8f0']);

  // ── Số khu vực ──
  const areas = DATA.areas;
  const areaTotalEl = document.getElementById('area-total');
  if(areaTotalEl) areaTotalEl.textContent = areas.total;

  const areaLegend = document.getElementById('area-legend');
  if(areaLegend) {
    const activeSubs = areas.details.active.map(name => `
      <div class="tree-sub-item">
        <i class="fas fa-circle-check tree-icon" style="color:#2563eb"></i>
        <span class="tree-name">${name}</span>
      </div>
    `).join('');
    const inactiveSubs = areas.details.inactive.map(name => `
      <div class="tree-sub-item">
        <i class="fas fa-circle-xmark tree-icon" style="color:var(--text-3)"></i>
        <span class="tree-name">${name}</span>
      </div>
    `).join('');

    areaLegend.innerHTML = `
      <div class="kpi-leg-row">
        <span class="kpi-leg-dot" style="background:#2563eb"></span>
        <span class="kpi-leg-label">Đang sử dụng</span>
        <span class="kpi-leg-val">${areas.active}</span>
      </div>
      <div class="tree-sub-list">${activeSubs}</div>
      <div class="kpi-leg-row" style="margin-top:5px;">
        <span class="kpi-leg-dot" style="background:#cbd5e1"></span>
        <span class="kpi-leg-label">Ngưng sử dụng</span>
        <span class="kpi-leg-val">${areas.inactive}</span>
      </div>
      <div class="tree-sub-list">${inactiveSubs}</div>
    `;
  }
  drawDonut('c-area', [areas.active, areas.inactive], ['#2563eb', '#cbd5e1']);

  // ── Số lô hàng ──
  const bch = DATA.batches;
  const batchTotalEl = document.getElementById('batch-total');
  if(batchTotalEl) batchTotalEl.textContent = bch.total;
  const batchLegend = document.getElementById('batch-legend');
  if(batchLegend) {
    batchLegend.innerHTML = bch.labels.map((L, i) => `
      <div class="kpi-leg-row">
        <span class="kpi-leg-dot" style="background:${bch.colors[i]}"></span>
        <span class="kpi-leg-label" style="font-size:12px;">${L}</span>
        <span class="kpi-leg-val" style="font-size:12px;">${bch.values[i]}</span>
      </div>
    `).join('');
  }
  drawDonut('c-batch', bch.values, bch.colors);

  // ── Tổng lệnh ──
  const cmd = DATA.commands;
  const cmdTotalEl = document.getElementById('cmd-total');
  if(cmdTotalEl) cmdTotalEl.textContent = cmd.total.toLocaleString();
  ['wait','prog','done','err'].forEach(k => {
    const el = document.getElementById('cmd-'+k);
    if(el) el.textContent = cmd[k].toLocaleString();
  });
  drawDonut('c-cmd', [cmd.wait, cmd.prog, cmd.done, cmd.err], ['#94a3b8','#60a5fa','#34d399','#f87171']);

  // Số thiết bị
  renderDevicePie();

  // ── Tổng tồn kho ──
  renderInventory();
}

/* ── INVENTORY PROGRESS BARS ─────────────────────────── */
function renderInventory() {
  const inv = DATA.inventory;
  const totalEl = document.getElementById('inv-total');
  if(totalEl) totalEl.textContent = inv.total.toLocaleString();

  const wrap = document.getElementById('inv-progress-wrap');
  if(!wrap || !inv.groups) return;

  // Find global max for relative bar width
  const allVals = inv.groups.flatMap(g => g.products.map(p => p.v));
  const globalMax = Math.max(...allVals);

  wrap.innerHTML = inv.groups.map(g => {
    const groupTotal = g.products.reduce((s, p) => s + p.v, 0);
    const rows = g.products.map(p => {
      const pct = (p.v / globalMax * 100).toFixed(1);
      const pctOfGroup = (p.v / groupTotal * 100).toFixed(0);
      return `
        <div class="inv-row">
          <span class="inv-row-name" title="${p.name}">${p.name}</span>
          <div class="inv-bar-outer">
            <div class="inv-bar-inner" style="width:0%; background:${g.color}; opacity:0.85;" data-w="${pct}%"></div>
          </div>
          <span class="inv-pct">${pctOfGroup}%</span>
          <span class="inv-row-val">${p.v.toLocaleString()}</span>
        </div>`;
    }).join('');

    return `
      <div class="inv-group-section">
        <div class="inv-group-header">
          <div class="inv-group-dot" style="background:${g.color}"></div>
          <span class="inv-group-name">${g.name}</span>
          <span class="inv-group-total">${groupTotal.toLocaleString()}</span>
        </div>
        ${rows}
      </div>`;
  }).join('');

  setTimeout(() => {
    wrap.querySelectorAll('.inv-bar-inner').forEach(b => b.style.width = b.dataset.w);
  }, 80);
}

/* ── PRODUCT STATS ─────────────────────────────────── */
function renderProductStats() {
  const s = DATA.productStats;
  const el = document.getElementById('prod-stats-content');
  if(!el) return;
  el.innerHTML = `
    <div class="kpi-leg-row">
      <i class="fas fa-layer-group" style="color:var(--accent); width:16px;"></i>
      <span class="kpi-leg-label">Dòng sản phẩm</span>
      <span class="kpi-leg-val">${s.lines}</span>
    </div>
    <div class="kpi-leg-row" style="margin-top:5px;">
      <i class="fas fa-tags" style="color:var(--purple); width:16px;"></i>
      <span class="kpi-leg-label">Nhóm sản phẩm</span>
      <span class="kpi-leg-val">${s.groups}</span>
    </div>
    <div class="kpi-leg-row" style="margin-top:5px;">
      <i class="fas fa-barcode" style="color:var(--cyan); width:16px;"></i>
      <span class="kpi-leg-label">Sản phẩm</span>
      <span class="kpi-leg-val">${s.products}</span>
    </div>
  `;
}

/* ── DEVICE PIE ───────────────────────────────────── */
function renderDevicePie() {
  const dev = DATA.devices;
  const statuses = dev.statuses;
  const values = statuses.map(s => Object.values(s.byType).reduce((a,b)=>a+b,0));
  const total = values.reduce((a,b)=>a+b,0);

  const totalEl = document.getElementById('dev-total');
  if(totalEl) totalEl.textContent = total;
  drawDonut('c-dev', values, statuses.map(s=>s.color));

  const legendEl = document.getElementById('dev-legend');
  if(!legendEl) return;

  legendEl.innerHTML = statuses.map((s, idx) => {
    const count = values[idx];
    const subItems = Object.entries(s.byType).map(([type, val]) => `
      <div class="dev-sub-item">
        <i class="fas ${dev.typeIcons[type]} dev-sub-icon"></i>
        <span class="dev-sub-name">${dev.typeLabels[type]}</span>
        <span class="dev-sub-val">${val}</span>
      </div>
    `).join('');
    return `
      <div class="kpi-leg-row expandable" data-dev-idx="${idx}">
        <span class="kpi-leg-dot" style="background:${s.color}"></span>
        <span class="kpi-leg-label">${s.label}</span>
        <span class="kpi-leg-val">${count}</span>
      </div>
      <div class="dev-sub-list" data-dev-sub="${idx}">${subItems}</div>
    `;
  }).join('');

  // Toggle sub-detail on click
  legendEl.querySelectorAll('.kpi-leg-row[data-dev-idx]').forEach(row => {
    row.addEventListener('click', () => {
      const idx = row.dataset.devIdx;
      const sub = legendEl.querySelector(`.dev-sub-list[data-dev-sub="${idx}"]`);
      const wasOpen = row.classList.contains('expanded');
      // Close all
      legendEl.querySelectorAll('.kpi-leg-row').forEach(r => r.classList.remove('expanded'));
      legendEl.querySelectorAll('.dev-sub-list').forEach(s => s.classList.remove('show'));
      // Toggle this
      if(!wasOpen) {
        row.classList.add('expanded');
        if(sub) sub.classList.add('show');
      }
    });
  });
}

/* ── SLA COUNTDOWN ──────────────────────────────────── */
var slaTimers = {};
function startSLACountdowns() {
  Object.values(slaTimers).forEach(clearInterval);
  slaTimers = {};
  document.querySelectorAll('.sla-countdown-bar[data-sla]').forEach(bar => {
    const slaMin = parseFloat(bar.dataset.sla);
    const elapsed = parseFloat(bar.dataset.elapsed);
    let remainSec = Math.max(0, (slaMin - elapsed) * 60);
    const totalSec = slaMin * 60;
    const barId = bar.dataset.barid;
    function update() {
      const pct = Math.max(0, (remainSec / totalSec) * 100);
      bar.style.width = pct + '%';
      if(pct < 20) bar.style.background = 'var(--red)';
      else if(pct < 40) bar.style.background = 'var(--amber)';
      else bar.style.background = 'var(--green)';
      const label = document.querySelector(`.sla-time-label[data-labelid="${barId}"]`);
      if(label) {
        if(remainSec <= 0) {
          label.textContent = '⚠ SLA VI PHẠM';
          label.style.color = 'var(--red)';
        } else {
          const m = Math.floor(remainSec/60), s = Math.floor(remainSec%60);
          label.textContent = `${m}:${String(s).padStart(2,'0')} còn lại`;
          label.style.color = pct < 20 ? 'var(--red)' : pct < 40 ? 'var(--amber)' : 'var(--text-3)';
        }
      }
      if(remainSec > 0) remainSec--;
    }
    update();
    slaTimers[barId] = setInterval(update, 1000);
  });
}

/* ── CHAIN BADGE ────────────────────────────────────── */
function chainBadge(label, status) {
  const icons = { done:'✓', running:'⚡', error:'✗', pending:'…' };
  return `<span class="chain-step chain-${status}">${icons[status]||'?'} ${label}</span>`;
}

/* ── COMPLETION TIME BARS ───────────────────────────── */
function renderCompletionBars() {
  const wrap = document.getElementById('completion-bars');
  if(!wrap) return;
  const list = DATA.completionTimes;
  // max y is 10 minutes
  wrap.innerHTML = list.map(item => {
    const pct = Math.min(100, (item.time / 10) * 100);
    const colWidth = (100 / list.length).toFixed(1);
    return `
      <div style="display:flex; flex-direction:column; align-items:center; width:${colWidth}%; height:100%; position:relative;">
        <div style="flex:1; display:flex; align-items:flex-end; width:100%; justify-content:center; padding-bottom:10px;">
          <div style="width:32px; height:${pct}%; background:${item.color}; border-radius:4px 4px 0 0; transition:height 0.8s ease;"
               data-tip="${item.label}: ${item.count} lệnh&#10;TB thời gian hoàn thành: ${item.time} phút">
          </div>
        </div>
        <div style="font-size:10px; color:var(--text-3); text-align:center; position:absolute; bottom:-25px; width:120%; left:-10%; word-wrap:break-word; line-height:1.2;">
          ${item.label}
        </div>
      </div>
    `;
  }).join('');
}

/* ── KANBAN ────────────────────────────────────────── */
function renderKanban() {
  const { urgent, wait, prog, done, err } = DATA.kanban;
  let uid = 0;

  document.getElementById('k-urgent-count').textContent = urgent.length;
  document.getElementById('k-wait-count').textContent   = wait.length;
  document.getElementById('k-prog-count').textContent   = prog.length;
  document.getElementById('k-done-count').textContent   = done.length;
  document.getElementById('k-err-count').textContent    = err.length;

  function renderList(list, wrapId, baseCls) {
    document.getElementById(wrapId).innerHTML = list.map(c => {
      const bid = 'sla-'+(uid++);
      if(baseCls === 'done') {
        return `
        <div class="k-card done">
          <div class="k-id">${c.id}</div>
          <div class="k-name">${c.name}</div>
          <div class="k-device">${c.device}</div>
          <div class="k-foot">
            <span class="k-time done">${c.time}</span>
          </div>
        </div>`;
      }
      const remPct = Math.max(0,((c.sla-c.slaElapsed)/c.sla)*100).toFixed(1);
      return `
      <div class="k-card ${baseCls}">
        <div class="k-id">${c.id}</div>
        <div class="k-name">${c.name}</div>
        <div class="k-device">${c.device}</div>
        <div class="chain-row">
          ${chainBadge('WCS',c.chainStatus.wcs)}
          <span class="chain-arrow">→</span>
          ${chainBadge('PLC',c.chainStatus.plc)}
          <span class="chain-arrow">→</span>
          ${chainBadge('AMR',c.chainStatus.amr)}
        </div>
      </div>`;
    }).join('');
  }

  renderList(urgent, 'k-urgent', 'urgent');
  renderList(wait,   'k-wait',   'wait');
  renderList(prog,   'k-prog',   'prog');
  renderList(done,   'k-done',   'done');
  renderList(err,    'k-err',    'err');
}

/* ── ERROR ANALYSIS ────────────────────────────────── */
function highlightDeviceInPred(devices) {
  document.querySelectorAll('.pred-item').forEach(item => {
    const name = item.querySelector('.pred-name')?.textContent || '';
    const match = devices.some(d => name.toLowerCase().includes(d.toLowerCase().replace('sc ','stacker crane ')));
    item.classList.toggle('pred-highlighted', match);
  });
  setTimeout(()=>{
    document.querySelectorAll('.pred-item').forEach(i=>i.classList.remove('pred-highlighted'));
  }, 3000);
}

function renderErrors() {
  const el=document.getElementById('err-list'); if(!el) return;
  el.innerHTML = DATA.errors.map(e=>{
    const trendColor = e.trendUp === true ? 'var(--red)' : e.trendUp === false ? 'var(--green)' : 'var(--text-3)';
    const trendIcon  = e.trendUp === true ? '↑' : e.trendUp === false ? '↓' : '→';
    return `
    <div class="err-item" style="cursor:pointer" onclick="highlightDeviceInPred(${JSON.stringify(e.devices)})">
      <span class="err-rank ${e.rankCls}">${e.rank}</span>
      <div class="err-bar-wrap">
        <div class="err-name-row">
          <div class="err-name">${e.name}</div>
          <span style="font-size:10px;font-weight:700;color:${trendColor}">${trendIcon} ${e.trend}</span>
        </div>
        <div class="err-bar-bg">
          <div class="err-bar-fill" style="width:0%;background:${e.color}" data-w="${e.pct}%"></div>
        </div>
        <div class="err-meta-row">
          <span class="err-mttr"><i class="fas fa-clock"></i> MTTR: <strong>${e.mttr}</strong></span>
          <span class="err-devs">${e.devices.map(d=>`<span class="err-dev-tag">${d}</span>`).join('')}</span>
        </div>
      </div>
      <span class="err-count">${e.count}</span>
    </div>`;
  }).join('');
  const tip=document.getElementById('err-tip');
  if(tip) tip.innerHTML=DATA.errTip;
  setTimeout(()=>{
    el.querySelectorAll('.err-bar-fill').forEach(b=>b.style.width=b.dataset.w);
  },80);
}


/* ── PREDICTIVE MAINTENANCE ────────────────────────── */
function renderPredictive() {
  const el=document.getElementById('pred-list'); if(!el) return;
  el.innerHTML = DATA.predictive.map(p=>{
    const hoursScore = Math.round(100 - (p.runHours/p.maxHours)*100);
    const errScore   = Math.max(0, 100 - p.errorFreq*9);
    const health     = Math.round(hoursScore*0.6 + errScore*0.4);
    const hCls       = health < 20 ? 'red' : health < 50 ? 'amber' : 'green';
    return `
    <div class="pred-item">
      <div class="pred-icon ${p.iconCls}"><i class="fas ${p.icon}"></i></div>
      <div class="pred-body">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">
          <span class="pred-name">${p.name}</span>
          <span class="badge ${p.badgeCls}">${p.badgeLabel}</span>
        </div>
        <div class="pred-meta">${p.meta}</div>
        <div class="pred-linked"><i class="fas fa-link" style="font-size:9px;opacity:.6;margin-right:3px"></i><span style="color:var(--text-3);font-size:10.5px">${p.linkedError}</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px">
          <div>
            <div style="font-size:9.5px;color:var(--text-3);margin-bottom:3px;font-weight:600">GIỜ CHẠY</div>
            <div class="pred-bar-row">
              <div class="pred-track"><div class="pred-fill ${p.fillCls}" style="width:0%" data-w="${p.pct}%"></div></div>
              <span class="pred-pct ${p.fillCls}">${p.pct}%</span>
            </div>
          </div>
          <div>
            <div style="font-size:9.5px;color:var(--text-3);margin-bottom:3px;font-weight:600">HEALTH SCORE</div>
            <div class="pred-bar-row">
              <div class="pred-track"><div class="pred-fill ${hCls}" style="width:0%" data-w="${health}%"></div></div>
              <span class="pred-pct ${hCls}">${health}</span>
            </div>
          </div>
        </div>
        <div style="margin-top:5px;font-size:10.5px;color:var(--text-3)">
          <i class="fas fa-triangle-exclamation" style="color:var(--amber);margin-right:3px;font-size:9px"></i>Lỗi 7 ngày: <strong style="color:var(--text-2)">${p.errorFreq} lần</strong>
        </div>
      </div>
    </div>`;
  }).join('');
  setTimeout(()=>{
    el.querySelectorAll('.pred-fill').forEach(b=>b.style.width=b.dataset.w);
  },80);
}

/* ── INIT ──────────────────────────────────────────── */
function initAll() {
  renderKPIPies();
  renderCompletionBars();
  renderKanban();
  renderErrors();
  renderPredictive();
  renderInventory();
  renderProductStats();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAll);
else initAll();

// Register cleanup function
window.destroyModule = function() {
  console.log('Cleaning up Detail Dashboard module...');
  if (detailClockInterval) clearInterval(detailClockInterval);
  if (typeof slaTimers === 'object') {
    Object.values(slaTimers).forEach(clearInterval);
  }
};
