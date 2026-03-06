/* ── DATA ─────────────────────────────────────────── */
const DATA = {
  kanban: {
    urgent: [
      {
        id:'#MSN-0841', name:'Xuất pallet — A12-03', device:'AMR-08',
        sla:12, slaElapsed:10, slaClass:'crit', actions:true,
        chain:{ wcs:'Received', plc:'Active', amr:'Executing' },
        chainStatus:{ wcs:'done', plc:'done', amr:'running' }
      },
      {
        id:'#MSN-0839', name:'Nhập hàng — Cửa 2', device:'SC_B',
        sla:5, slaElapsed:4.5, slaClass:'crit', actions:false,
        chain:{ wcs:'Received', plc:'Stuck', amr:'Waiting' },
        chainStatus:{ wcs:'done', plc:'error', amr:'pending' }
      },
    ],
    prog: [
      { id:'#MSN-0840', name:'Nhập pallet — C03-07',  device:'AMR-12',   sla:15, slaElapsed:4, slaClass:'ok',
        chain:{ wcs:'Received', plc:'Active', amr:'Executing' }, chainStatus:{ wcs:'done', plc:'done', amr:'running' } },
      { id:'#MSN-0838', name:'Xuất đơn hàng #4421',   device:'SC_C + AMR-04', sla:20, slaElapsed:8, slaClass:'ok',
        chain:{ wcs:'Received', plc:'Active', amr:'Executing' }, chainStatus:{ wcs:'done', plc:'done', amr:'running' } },
      { id:'#MSN-0835', name:'Kiểm kê khu B2',        device:'AMR-09',   sla:30, slaElapsed:18, slaClass:'warn',
        chain:{ wcs:'Received', plc:'Active', amr:'Executing' }, chainStatus:{ wcs:'done', plc:'done', amr:'running' } },
    ],
    done: [
      { id:'#MSN-0833', name:'Xuất pallet — D05-12', device:'AMR-06', time:'3.8ph ✓', timeClass:'done' },
      { id:'#MSN-0832', name:'Nhập — Cửa 1 → B03',  device:'SC_A',   time:'4.2ph ✓', timeClass:'done' },
      { id:'#MSN-0831', name:'Chuyển vị trí E-11',   device:'AMR-14', time:'2.1ph ✓', timeClass:'done' },
    ],
  },
  errors: [
    { rank:'#1', rankCls:'r1', name:'Lỗi cảm biến vật cản (AMR)', count:142, pct:100, color:'#dc2626', mttr:'18ph', devices:['AMR-07','AMR-12'], trend:'+12%', trendUp:true },
    { rank:'#2', rankCls:'r2', name:'Mất kết nối WCS ↔ PLC',      count:97,  pct:68,  color:'#d97706', mttr:'34ph', devices:['PLC-03'], trend:'-5%', trendUp:false },
    { rank:'#3', rankCls:'r3', name:'Lỗi đọc barcode pallet',     count:61,  pct:43,  color:'#7c3aed', mttr:'8ph',  devices:['AMR-08'], trend:'=', trendUp:null },
    { rank:'#4', rankCls:'r4', name:'Lỗi pin AMR dưới 10%',       count:39,  pct:27,  color:'#0891b2', mttr:'45ph', devices:['AMR-07','AMR-19'], trend:'+3%', trendUp:true },
    { rank:'#5', rankCls:'r5', name:'Timeout lệnh Stacker Crane', count:24,  pct:17,  color:'#9aa5b4', mttr:'22ph', devices:['SC #4'], trend:'-8%', trendUp:false },
  ],
  errTip: '💡 Lỗi #1 chiếm 40% tổng lỗi — MTTR TB: <strong>18ph</strong>. Đề xuất: <strong>Hiệu chỉnh cảm biến AMR định kỳ 2 tuần/lần.</strong>',

  cycleTimes: [
    { aisle:'SC_Aisle_A', val:4.1, max:6, cls:'green', breakdown:{ wait:0.4, travel:2.8, handling:0.9 } },
    { aisle:'SC_Aisle_B', val:4.4, max:6, cls:'amber', breakdown:{ wait:0.8, travel:2.7, handling:0.9 } },
    { aisle:'SC_Aisle_C', val:3.5, max:6, cls:'green', breakdown:{ wait:0.3, travel:2.4, handling:0.8 } },
    { aisle:'SC_Aisle_D', val:4.8, max:6, cls:'red',   breakdown:{ wait:1.4, travel:2.6, handling:0.8 },
      alert:'⚠ SC_Aisle_D chậm hơn 15% — Wait time cao bất thường (1.4ph). Nghi ngờ WCS điều phối chồng chéo hoặc ray bị cản.' },
    { aisle:'SC_Aisle_E', val:3.8, max:6, cls:'green', breakdown:{ wait:0.5, travel:2.5, handling:0.8 } },
  ],

  predictive: [
    { iconCls:'amr', icon:'fa-robot', name:'AMR-07',
      meta:'Giờ chạy: 4,820h / 5,000h', runHours:4820, maxHours:5000, errorFreq:8,
      pct:96, fillCls:'red', badgeCls:'crit', badgeLabel:'KHẨN CẤP',
      linkedError:'Lỗi cảm biến vật cản (AMR)' },
    { iconCls:'sc', icon:'fa-gears', name:'Stacker Crane #4',
      meta:'Giờ chạy: 7,200h / 8,000h', runHours:7200, maxHours:8000, errorFreq:3,
      pct:90, fillCls:'amber', badgeCls:'warn', badgeLabel:'KIỂM TRA',
      linkedError:'Timeout lệnh Stacker Crane' },
    { iconCls:'plc', icon:'fa-microchip', name:'PLC-03 Controller',
      meta:'Vận hành: 12,400h / 15,000h', runHours:12400, maxHours:15000, errorFreq:5,
      pct:83, fillCls:'amber', badgeCls:'warn', badgeLabel:'KIỂM TRA',
      linkedError:'Mất kết nối WCS ↔ PLC' },
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

/* ── SLA COUNTDOWN ──────────────────────────────────── */
let slaTimers = {};
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

/* ── KANBAN ────────────────────────────────────────── */
function renderKanban() {
  const { urgent, prog, done } = DATA.kanban;
  let uid = 0;

  document.getElementById('k-urgent-count').textContent = urgent.length;
  document.getElementById('k-prog-count').textContent   = prog.length;
  document.getElementById('k-done-count').textContent   = done.length;

  document.getElementById('k-urgent').innerHTML = urgent.map(c=>{
    const bid = 'sla-'+(uid++);
    const remPct = Math.max(0,((c.sla-c.slaElapsed)/c.sla)*100).toFixed(1);
    return `
    <div class="k-card urgent">
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
      <div class="sla-bar-wrap">
        <div class="sla-track"><div class="sla-countdown-bar" data-sla="${c.sla}" data-elapsed="${c.slaElapsed}" data-barid="${bid}" style="width:${remPct}%"></div></div>
        <span class="sla-time-label" data-labelid="${bid}">…</span>
      </div>
      <div class="k-actions">
        <button class="btn-retry">RETRY</button>
        <button class="btn-cancel">CANCEL</button>
        <button class="btn-force">FORCE FINISH</button>
      </div>
    </div>`;
  }).join('');

  document.getElementById('k-prog').innerHTML = prog.map(c=>{
    const bid = 'sla-'+(uid++);
    const remPct = Math.max(0,((c.sla-c.slaElapsed)/c.sla)*100).toFixed(1);
    return `
    <div class="k-card">
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
      <div class="sla-bar-wrap">
        <div class="sla-track"><div class="sla-countdown-bar" data-sla="${c.sla}" data-elapsed="${c.slaElapsed}" data-barid="${bid}" style="width:${remPct}%"></div></div>
        <span class="sla-time-label" data-labelid="${bid}">…</span>
      </div>
    </div>`;
  }).join('');

  document.getElementById('k-done').innerHTML = done.map(c=>`
    <div class="k-card">
      <div class="k-id">${c.id}</div>
      <div class="k-name">${c.name}</div>
      <div class="k-foot">
        <span class="k-device">${c.device}</span>
        <span class="k-time ${c.timeClass}">${c.time}</span>
      </div>
    </div>`).join('');

  setTimeout(startSLACountdowns, 100);
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

/* ── CYCLE TIME ────────────────────────────────────── */
function renderCycleTime() {
  const el=document.getElementById('ct-body'); if(!el) return;
  const maxVal = Math.max(...DATA.cycleTimes.map(c=>c.max));
  const alert = DATA.cycleTimes.find(c=>c.alert);

  const legendHTML = `
    <div class="ct-legend">
      <span class="ct-leg"><span class="ct-leg-dot" style="background:#94a3b8"></span>⏳ Chờ</span>
      <span class="ct-leg"><span class="ct-leg-dot" style="background:#60a5fa"></span>🚀 Di chuyển</span>
      <span class="ct-leg"><span class="ct-leg-dot" style="background:#4ade80"></span>📦 Bốc xếp</span>
    </div>`;

  const rowsHTML = DATA.cycleTimes.map(c=>{
    const totalW = (c.val/maxVal*100).toFixed(1);
    const bk = c.breakdown;
    const wP = (bk.wait/c.val*100).toFixed(1);
    const tP = (bk.travel/c.val*100).toFixed(1);
    const hP = (bk.handling/c.val*100).toFixed(1);
    return `
    <div class="ct-row">
      <span class="ct-aisle">${c.aisle}</span>
      <div class="ct-bar-wrap">
        <div class="ct-bar-bg">
          <div class="ct-seg-wrap" data-w="${totalW}%" style="width:0%;height:100%;display:flex;border-radius:99px;overflow:hidden;transition:width 1.2s cubic-bezier(.4,0,.2,1)">
            <div style="width:${wP}%;background:#94a3b8;height:100%" title="Wait: ${bk.wait}ph"></div>
            <div style="width:${tP}%;background:#60a5fa;height:100%" title="Travel: ${bk.travel}ph"></div>
            <div style="width:${hP}%;background:#4ade80;height:100%" title="Handling: ${bk.handling}ph"></div>
          </div>
        </div>
        <div class="ct-bk-tip">
          <span style="color:#94a3b8">⏳${bk.wait}ph</span>
          <span style="color:#60a5fa">🚀${bk.travel}ph</span>
          <span style="color:#4ade80">📦${bk.handling}ph</span>
        </div>
      </div>
      <span class="ct-val ${c.cls==='red'?'red':''}">${c.val}ph${c.alert?' ⚠':''}</span>
    </div>`;
  }).join('');

  el.innerHTML = legendHTML + rowsHTML + (alert ? `<div class="ct-alert">${alert.alert}</div>` : '');

  setTimeout(()=>{
    el.querySelectorAll('.ct-seg-wrap').forEach(b=>b.style.width=b.dataset.w);
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
  renderKanban();
  renderErrors();
  renderCycleTime();
  renderPredictive();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAll);
else initAll();