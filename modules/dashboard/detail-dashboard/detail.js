/* ── DATA ─────────────────────────────────────────── */
const DATA = {
  kanban: {
    urgent: [
      { id:'#MSN-0841', name:'Xuất pallet — A12-03', device:'AMR-08', sla:'SLA: 12ph', slaClass:'crit', actions:true },
      { id:'#MSN-0839', name:'Nhập hàng — Cửa 2',   device:'SC_B',   sla:'SLA: 5ph',  slaClass:'crit', actions:false },
    ],
    prog: [
      { id:'#MSN-0840', name:'Nhập pallet — C03-07',  device:'AMR-12',   sla:'SLA: OK', slaClass:'ok' },
      { id:'#MSN-0838', name:'Xuất đơn hàng #4421',   device:'SC_C + AMR-04', sla:'SLA: OK', slaClass:'ok' },
      { id:'#MSN-0835', name:'Kiểm kê khu B2',        device:'AMR-09',   sla:'SLA: OK', slaClass:'ok' },
    ],
    done: [
      { id:'#MSN-0833', name:'Xuất pallet — D05-12', device:'AMR-06', time:'3.8ph ✓', timeClass:'done' },
      { id:'#MSN-0832', name:'Nhập — Cửa 1 → B03',  device:'SC_A',   time:'4.2ph ✓', timeClass:'done' },
      { id:'#MSN-0831', name:'Chuyển vị trí E-11',   device:'AMR-14', time:'2.1ph ✓', timeClass:'done' },
    ],
  },
  errors: [
    { rank:'#1', rankCls:'r1', name:'Lỗi cảm biến vật cản (AMR)', count:142, pct:100, color:'#dc2626' },
    { rank:'#2', rankCls:'r2', name:'Mất kết nối WCS ↔ PLC',      count:97,  pct:68,  color:'#d97706' },
    { rank:'#3', rankCls:'r3', name:'Lỗi đọc barcode pallet',     count:61,  pct:43,  color:'#7c3aed' },
    { rank:'#4', rankCls:'r4', name:'Lỗi pin AMR dưới 10%',       count:39,  pct:27,  color:'#0891b2' },
    { rank:'#5', rankCls:'r5', name:'Timeout lệnh Stacker Crane', count:24,  pct:17,  color:'#9aa5b4' },
  ],
  errTip: '💡 Lỗi #1 chiếm 40% tổng lỗi — Đề xuất: <strong>Hiệu chỉnh cảm biến AMR định kỳ 2 tuần/lần.</strong>',

  floorGrid: [
    // 8×8 simplified layout: rack=R, amr-run=A, amr-idle=I, amr-chg=C, io=O, empty=_
    ['R','R','A','R','R','A','R','R'],
    ['R','A','R','R','I','R','R','A'],
    ['A','R','R','A','R','R','A','R'],
    ['R','R','A','R','R','R','R','A'],
    ['O','A','R','R','A','R','I','R'],
    ['R','R','R','A','R','A','R','R'],
    ['R','A','R','R','R','R','A','R'],
    ['R','R','C','R','A','R','R','O'],
  ],

  oeeDevices: [
    {
      name:'AMR (24 con)', pct:87, color:'#2563eb',
      subs:[{pct:75,color:'#4ade80',label:'Run'},{pct:17,color:'#fbbf24',label:'Idle'},{pct:8,color:'#a78bfa',label:'Sạc'}]
    },
    {
      name:'Stacker Crane (12)', pct:91, color:'#16a34a',
      subs:[{pct:85,color:'#4ade80',label:'Run'},{pct:6,color:'#fbbf24',label:'Wait'},{pct:9,color:'#f87171',label:'Err'}]
    },
    {
      name:'Conveyor (8 tuyến)', pct:96, color:'#0891b2',
      subs:[{pct:96,color:'#22d3ee',label:'Run'}]
    },
  ],

  cycleTimes: [
    { aisle:'SC_Aisle_A', val:4.1, max:6, cls:'green' },
    { aisle:'SC_Aisle_B', val:4.4, max:6, cls:'amber' },
    { aisle:'SC_Aisle_C', val:3.5, max:6, cls:'green' },
    { aisle:'SC_Aisle_D', val:4.8, max:6, cls:'red',  alert:'⚠ SC_Aisle_D chậm hơn 15% — Kiểm tra vị trí hàng hoặc bảo dưỡng ray.' },
    { aisle:'SC_Aisle_E', val:3.8, max:6, cls:'green' },
  ],

  predictive: [
    {
      iconCls:'amr', icon:'fa-robot',
      name:'AMR-07',
      meta:'Giờ chạy: 4,820h / 5,000h',
      pct:96, fillCls:'red', badgeCls:'crit', badgeLabel:'KHẨN CẤP'
    },
    {
      iconCls:'sc', icon:'fa-gears',
      name:'Stacker Crane #4',
      meta:'Giờ chạy: 7,200h / 8,000h',
      pct:90, fillCls:'amber', badgeCls:'warn', badgeLabel:'KIỂM TRA'
    },
    {
      iconCls:'plc', icon:'fa-microchip',
      name:'PLC-03 Controller',
      meta:'Vận hành: 12,400h / 15,000h',
      pct:83, fillCls:'amber', badgeCls:'warn', badgeLabel:'KIỂM TRA'
    },
  ],
};

/* ── CLOCK ─────────────────────────────────────────── */
(function startClock() {
  const days = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  function tick() {
    const n = new Date();
    const t = [n.getHours(),n.getMinutes(),n.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');
    const d = `${days[n.getDay()]}, ${n.getDate()} tháng ${n.getMonth()+1}, ${n.getFullYear()}`;
    const te=document.getElementById('rt-time'), de=document.getElementById('rt-date');
    if(te) te.textContent=t; if(de) de.textContent=d;
  }
  tick(); setInterval(tick,1000);
})();

/* ── SYNC ──────────────────────────────────────────── */
function doSync() {
  const btn=document.getElementById('btn-sync'); if(!btn) return;
  btn.classList.add('spinning');
  setTimeout(()=>{ btn.classList.remove('spinning'); initAll(); },800);
}

/* ── KANBAN ────────────────────────────────────────── */
function renderKanban() {
  const { urgent, prog, done } = DATA.kanban;

  document.getElementById('k-urgent-count').textContent = urgent.length;
  document.getElementById('k-prog-count').textContent   = prog.length;
  document.getElementById('k-done-count').textContent   = done.length;

  document.getElementById('k-urgent').innerHTML = urgent.map(c=>`
    <div class="k-card urgent">
      <div class="k-id">${c.id}</div>
      <div class="k-name">${c.name}</div>
      <div class="k-foot">
        <span class="k-device">${c.device}</span>
        <span class="sla-badge ${c.slaClass}">${c.sla}</span>
      </div>
      ${c.actions ? `<div class="k-actions"><button class="btn-retry">RETRY</button><button class="btn-cancel">CANCEL</button></div>` : ''}
    </div>`).join('');

  document.getElementById('k-prog').innerHTML = prog.map(c=>`
    <div class="k-card">
      <div class="k-id">${c.id}</div>
      <div class="k-name">${c.name}</div>
      <div class="k-foot">
        <span class="k-device">${c.device}</span>
        <span class="sla-badge ${c.slaClass}">${c.sla}</span>
      </div>
    </div>`).join('');

  document.getElementById('k-done').innerHTML = done.map(c=>`
    <div class="k-card">
      <div class="k-id">${c.id}</div>
      <div class="k-name">${c.name}</div>
      <div class="k-foot">
        <span class="k-device">${c.device}</span>
        <span class="k-time ${c.timeClass}">${c.time}</span>
      </div>
    </div>`).join('');
}

/* ── ERROR ANALYSIS ────────────────────────────────── */
function renderErrors() {
  const el=document.getElementById('err-list'); if(!el) return;
  el.innerHTML = DATA.errors.map(e=>`
    <div class="err-item">
      <span class="err-rank ${e.rankCls}">${e.rank}</span>
      <div class="err-bar-wrap">
        <div class="err-name">${e.name}</div>
        <div class="err-bar-bg">
          <div class="err-bar-fill" style="width:0%;background:${e.color}" data-w="${e.pct}%"></div>
        </div>
      </div>
      <span class="err-count">${e.count}</span>
    </div>`).join('');
  const tip=document.getElementById('err-tip');
  if(tip) tip.innerHTML=DATA.errTip;
  setTimeout(()=>{
    el.querySelectorAll('.err-bar-fill').forEach(b=>b.style.width=b.dataset.w);
  },80);
}

/* ── FLOOR GRID ────────────────────────────────────── */
function renderFloor() {
  const el=document.getElementById('floor-grid'); if(!el) return;
  const typeMap = { R:'rack', A:'amr-run', I:'amr-idle', C:'amr-chg', O:'io', '_':'empty' };
  const labelMap= { R:'', A:'▶', I:'—', C:'⚡', O:'I/O', '_':'' };
  el.innerHTML = DATA.floorGrid.flat().map(t=>`
    <div class="floor-cell ${typeMap[t]||'empty'}">${labelMap[t]||''}</div>`).join('');
}

/* ── OEE DEVICES ───────────────────────────────────── */
function renderOEE() {
  const el=document.getElementById('oee-devices'); if(!el) return;
  el.innerHTML = DATA.oeeDevices.map(d=>`
    <div class="oee-dev">
      <div class="oee-dev-name">
        <span>${d.name}</span>
        <span class="oee-dev-pct" style="color:${d.color}">${d.pct}%</span>
      </div>
      <div class="oee-track"><div class="oee-fill" style="width:0%;background:${d.color}" data-w="${d.pct}%"></div></div>
      <div class="oee-sub-bars">
        ${d.subs.map(s=>`<div class="oee-sub-bar" style="flex:${s.pct};background:${s.color}"></div>`).join('')}
      </div>
      <div class="oee-sub-label">
        ${d.subs.map(s=>`<div class="oee-sub-l"><span class="oee-sub-dot" style="background:${s.color}"></span>${s.pct}% ${s.label}</div>`).join('')}
      </div>
    </div>`).join('');
  setTimeout(()=>{
    el.querySelectorAll('.oee-fill').forEach(b=>b.style.width=b.dataset.w);
  },80);
}

/* ── CYCLE TIME ────────────────────────────────────── */
function renderCycleTime() {
  const el=document.getElementById('ct-body'); if(!el) return;
  const maxVal = Math.max(...DATA.cycleTimes.map(c=>c.max));
  const alert = DATA.cycleTimes.find(c=>c.alert);
  el.innerHTML = DATA.cycleTimes.map(c=>`
    <div class="ct-row">
      <span class="ct-aisle">${c.aisle}</span>
      <div class="ct-bar-wrap">
        <div class="ct-bar-bg">
          <div class="ct-bar-fill ${c.cls}" style="width:0%" data-w="${(c.val/maxVal*100).toFixed(1)}%"></div>
        </div>
      </div>
      <span class="ct-val ${c.cls==='red'?'red':''}">${c.val} ph${c.alert?' ⚠':''}</span>
    </div>`).join('') + (alert ? `<div class="ct-alert">${alert.alert}</div>` : '');
  setTimeout(()=>{
    el.querySelectorAll('.ct-bar-fill').forEach(b=>b.style.width=b.dataset.w);
  },80);
}

/* ── PREDICTIVE MAINTENANCE ────────────────────────── */
function renderPredictive() {
  const el=document.getElementById('pred-list'); if(!el) return;
  el.innerHTML = DATA.predictive.map(p=>`
    <div class="pred-item">
      <div class="pred-icon ${p.iconCls}"><i class="fas ${p.icon}"></i></div>
      <div class="pred-body">
        <div class="pred-name">${p.name}</div>
        <div class="pred-meta">${p.meta}</div>
        <div class="pred-bar-row">
          <div class="pred-track"><div class="pred-fill ${p.fillCls}" style="width:0%" data-w="${p.pct}%"></div></div>
          <span class="pred-pct ${p.fillCls}">${p.pct}%</span>
        </div>
      </div>
      <div class="pred-badge"><span class="badge ${p.badgeCls}">${p.badgeLabel}</span></div>
    </div>`).join('');
  setTimeout(()=>{
    el.querySelectorAll('.pred-fill').forEach(b=>b.style.width=b.dataset.w);
  },80);
}

/* ── INIT ──────────────────────────────────────────── */
function initAll() {
  renderKanban();
  renderErrors();
  renderCycleTime();
  renderPredictive();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAll);
else initAll();