/* ── DATA ─────────────────────────────────────────── */
var DATA = {
  wh:  { total:10, new:2, active:5, inactive:1, maint:2 },
  cmd: { total:156, wait:24, prog:12, done:115, err:5 },
  occ: [
    { name:'CÔNG TY TNHH TỔ HỢP CƠ KHÍ THACO — TOMC', pct:96, cls:'hi',  cranes:'12/12', amr:'24/24', tag:'tag-hi',  note:'⚠ Gần giới hạn' },
    { name:'CÔNG TY THÉP — CSC',    pct:71, cls:'mid', cranes:'8/10',  amr:'18/20', tag:'tag-mid', note:'2 thiết bị bảo trì' },
    { name:'CÔNG TY LINH KIỆN KHUNG THÂN VỎ Ô TÔ — TACB',   pct:62, cls:'lo',  cranes:'10/10', amr:'22/22', tag:'tag-ok',  note:'✓ Ổn định' },
    { name:'CÔNG TY LINH KIỆN NHỰA — TPC',     pct:55, cls:'lo',  cranes:'6/6',   amr:'14/16', tag:'tag-ok',  note:'✓ Còn dư công suất' },
  ],
  oee: [
    { id:'TOMC', uptime:99.1, loi:'0.3/ngày', st:'ot', label:'QUÁ TẢI' },
    { id:'CSC', uptime:96.8, loi:'1.2/ngày', st:'mt', label:'BẢO TRÌ' },
    { id:'TACB', uptime:99.7, loi:'0.1/ngày', st:'ok', label:'TỐT' },
    { id:'TPC', uptime:99.5, loi:'0.2/ngày', st:'ok', label:'TỐT' },
  ],
  alerts: [
    { lvl:'crit', title:'TOMC — CÔNG TY TOMC đạt 96% công suất', desc:'Cần điều phối sang CSC. Nguy cơ từ chối nhập hàng.', time:'08:42' },
    { lvl:'crit', title:'CSC — PLC_07 mất kết nối', desc:'Stacker Crane #7 dừng hoạt động. Kỹ thuật đang xử lý.', time:'09:15' },
    { lvl:'warn', title:'CSC — 2 AMR đang bảo trì định kỳ', desc:'AMR-14, AMR-19. Dự kiến hoàn thành 14:00.', time:'07:00' },
  ],
  trend: {
    hours:  ['06h','07h','08h','09h','10h','11h','12h','13h','14h','15h','16h','17h','18h'],
    nhap:   [12,15,28,42,68,88,95,102,98,90,85,72,60],
    xuat:   [8,10,18,30,50,70,80,88,85,78,70,60,50],
  },
};

/* ── CLOCK ────────────────────────────────────────── */
(function startClock() {
  const days = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  function tick() {
    const n = new Date();
    const t = [n.getHours(),n.getMinutes(),n.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');
    const d = `${days[n.getDay()]}, ${n.getDate()} tháng ${n.getMonth()+1}, ${n.getFullYear()}`;
    const te = document.getElementById('rt-time'), de = document.getElementById('rt-date');
    if(te) te.textContent = t;
    if(de) de.textContent = d;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── SYNC ─────────────────────────────────────────── */
/* ── SYNC ─────────────────────────────────────────── */
function doSync() {
  const btn = document.getElementById('btn-sync');
  if (!btn) return;
  btn.classList.add('spinning');
  
  // Show loading state
  document.querySelectorAll('.card').forEach(c => c.classList.add('is-loading'));

  setTimeout(() => { 
    btn.classList.remove('spinning'); 
    renderData();
    document.querySelectorAll('.card').forEach(c => c.classList.remove('is-loading'));
  }, 1000);
}

/* ── DONUT CHART ──────────────────────────────────── */
function drawDonut(id, values, colors) {
  const c = document.getElementById(id); if(!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height, cx = W/2, cy = H/2;
  const ro = W/2-5, ri = ro*0.6;
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

/* ── GAUGE ────────────────────────────────────────── */
function drawGauge(pct) {
  const c = document.getElementById('c-gauge'); if(!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height, cx = W/2, cy = H-8;
  const r = Math.min(W,H*2)/2-12;
  ctx.clearRect(0,0,W,H);
  // track
  ctx.beginPath(); ctx.arc(cx,cy,r,Math.PI,0);
  ctx.strokeStyle='#e8ecf4'; ctx.lineWidth=14; ctx.lineCap='round'; ctx.stroke();
  // fill
  const end = Math.PI+(pct/100)*Math.PI;
  const g = ctx.createLinearGradient(cx-r,cy,cx+r,cy);
  g.addColorStop(0,'#38bdf8'); g.addColorStop(.65,'#2563eb'); g.addColorStop(1, pct>90?'#ef4444':'#4f46e5');
  ctx.beginPath(); ctx.arc(cx,cy,r,Math.PI,end);
  ctx.strokeStyle=g; ctx.lineWidth=14; ctx.lineCap='round'; ctx.stroke();
  // needle tip
  const tx = cx+r*Math.cos(end), ty = cy+r*Math.sin(end);
  ctx.beginPath(); ctx.arc(tx,ty,5,0,Math.PI*2);
  ctx.fillStyle=pct>90?'#ef4444':'#2563eb'; ctx.fill();
}

/* ── OCCUPANCY ────────────────────────────────────── */
function renderOcc() {
  const el = document.getElementById('occ-list'); if(!el) return;
  el.innerHTML = DATA.occ.map(d=>`
    <div class="occ-row">
      <div class="occ-top">
        <span class="occ-name">${d.name}</span>
        <span class="occ-pct ${d.cls}">${d.pct}%</span>
      </div>
      <div class="occ-track"><div class="occ-fill ${d.cls}" style="width:0%" data-w="${d.pct}%"></div></div>
      <div class="occ-meta">
        <span>Stacker: ${d.cranes}</span>
        <span>AMR: ${d.amr}</span>
        <span class="${d.tag}">${d.note}</span>
      </div>
    </div>`).join('');
  // animate bars
  setTimeout(()=>{
    el.querySelectorAll('.occ-fill').forEach(b=>b.style.width=b.dataset.w);
  },80);
}

/* ── OEE TABLE ────────────────────────────────────── */
function renderOEE() {
  const tb = document.getElementById('oee-body'); if(!tb) return;
  tb.innerHTML = DATA.oee.map(d=>`
    <tr>
      <td class="kho-id">${d.id}</td>
      <td><div class="upt">
        <span class="upt-pct">${d.uptime}%</span>
        <div class="upt-bar"><div class="upt-fill" style="width:${d.uptime}%"></div></div>
      </div></td>
      <td>${d.loi}</td>
      <td><span class="badge ${d.st}">${d.label}</span></td>
    </tr>`).join('');
}

/* ── ALERTS ───────────────────────────────────────── */
function renderAlerts() {
  const el = document.getElementById('alert-list'); if(!el) return;
  el.innerHTML = DATA.alerts.map(a=>`
    <div class="alert-item ${a.lvl}">
      <span class="adot ${a.lvl}"></span>
      <div class="abody">
        <div class="a-title">${a.title}</div>
        <div class="a-desc">${a.desc}</div>
      </div>
      <span class="a-time">${a.time}</span>
    </div>`).join('');
}

/* ── TREND BAR CHART ──────────────────────────────── */
function drawTrend() {
  const c = document.getElementById('c-trend'); if(!c) return;
  const wrap = c.parentElement;
  const W = (wrap.offsetWidth||600)-40; const H = 150;
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,W,H);

  const hrs = DATA.trend.hours, nhap = DATA.trend.nhap, xuat = DATA.trend.xuat;
  const n = hrs.length;
  const maxV = Math.max(...nhap,...xuat)*1.15;
  const colW = W/n, barW = colW*0.28, gap = colW*0.06;

  // gridlines
  for(let i=0;i<=4;i++){
    const y=H-(i/4)*H;
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y);
    ctx.strokeStyle='#e8ecf4'; ctx.lineWidth=1; ctx.stroke();
    const v=Math.round((maxV*i/4));
    ctx.fillStyle='#9aa5b4'; ctx.font='9px DM Mono,monospace';
    ctx.fillText(v,2,y-3);
  }

  hrs.forEach((_,i)=>{
    const cx = i*colW+colW/2;
    const x1 = cx-barW-gap/2, x2 = cx+gap/2;

    // nhap
    const h1=(nhap[i]/maxV)*H;
    const g1=ctx.createLinearGradient(0,H-h1,0,H);
    g1.addColorStop(0,'#38bdf8'); g1.addColorStop(1,'rgba(56,189,248,.3)');
    ctx.fillStyle=g1;
    ctx.beginPath(); ctx.roundRect(x1,H-h1,barW,h1,[3,3,0,0]); ctx.fill();

    // xuat
    const h2=(xuat[i]/maxV)*H;
    const g2=ctx.createLinearGradient(0,H-h2,0,H);
    g2.addColorStop(0,'#4ade80'); g2.addColorStop(1,'rgba(74,222,128,.3)');
    ctx.fillStyle=g2;
    ctx.beginPath(); ctx.roundRect(x2,H-h2,barW,h2,[3,3,0,0]); ctx.fill();
  });

  // x-labels
  const lbl = document.getElementById('t-xlabels'); if(lbl) lbl.innerHTML=hrs.map(h=>`<span>${h}</span>`).join('');
}

/* ── INIT ─────────────────────────────────────────── */
/* ── INIT ─────────────────────────────────────────── */
function renderData() {
  // Donut Kho
  const wh = DATA.wh;
  ['total','new','active','inactive','maint'].forEach(k=>{
    const el=document.getElementById('wh-'+k); if(el) el.textContent=wh[k];
  });
  const whCenter = document.getElementById('wh-center');
  if(whCenter) whCenter.textContent=wh.total;
  drawDonut('c-wh',[wh.new,wh.active,wh.inactive,wh.maint],['#38bdf8','#4ade80','#f87171','#fbbf24']);

  // Donut Lệnh
  const cmd = DATA.cmd;
  ['total','wait','prog','done','err'].forEach(k=>{
    const el=document.getElementById('cmd-'+k); if(el) el.textContent=cmd[k];
  });
  const cmdCenter = document.getElementById('cmd-center');
  if(cmdCenter) cmdCenter.textContent=cmd.total;
  drawDonut('c-cmd',[cmd.wait,cmd.prog,cmd.done,cmd.err],['#94a3b8','#60a5fa','#34d399','#f87171']);

  drawGauge(94);
  renderOcc();
  renderOEE();
  renderAlerts();
  setTimeout(drawTrend, 80);
  renderTraffic();
}

function initAll() {
  // Initial delay of exactly 1s
  setTimeout(() => {
    renderData();
    document.querySelectorAll('.card').forEach(c => c.classList.remove('is-loading'));
  }, 1000);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAll);
else initAll();

window.addEventListener('resize',()=>{ if(typeof drawTrend==='function') drawTrend(); });

/* ── TRAFFIC WIDGET (AMR Congestion + PLC Heartbeat + Buffer) ── */
var TRAFFIC = {
  amrCongestion: [
    { zone:'Hành lang A', amrCount:6, maxAMR:4, pct:95, cls:'crit' },
    { zone:'Hành lang B', amrCount:3, maxAMR:4, pct:60, cls:'warn' },
    { zone:'Hành lang C', amrCount:2, maxAMR:4, pct:40, cls:'ok' },
    { zone:'Hành lang D', amrCount:1, maxAMR:4, pct:20, cls:'ok' },
  ],
  plcHeartbeat: [
    { name:'PLC-01', latency:12, status:'ok' },
    { name:'PLC-02', latency:18, status:'ok' },
    { name:'PLC-03', latency:980, status:'error' },
    { name:'PLC-04', latency:45, status:'warn' },
    { name:'PLC-05', latency:9, status:'ok' },
    { name:'PLC-06', latency:22, status:'ok' },
  ],
  buffers: [
    { name:'Buffer Nhập — Cửa 1', pct:78, cap:'78/100', cls:'warn' },
    { name:'Buffer Xuất — Cửa 3', pct:92, cap:'46/50', cls:'crit' },
    { name:'Buffer ASRS → AMR', pct:34, cap:'17/50', cls:'ok' },
    { name:'Buffer Conveyor B', pct:55, cap:'55/100', cls:'ok' },
  ],
};

function renderTraffic() {
  const el = document.getElementById('traffic-widget'); if(!el) return;

  const congestionHTML = TRAFFIC.amrCongestion.map(z => {
    const barCls = z.cls === 'crit' ? 'hi' : z.cls === 'warn' ? 'mid' : 'lo';
    return `
    <div style="padding:9px 0;border-bottom:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px">
        <span style="font-size:11.5px;font-weight:600;color:var(--text-1)">${z.zone}</span>
        <span style="font-size:11px;font-family:monospace;font-weight:700;color:var(--${z.cls==='crit'?'red':z.cls==='warn'?'amber':'green'})">${z.amrCount}/${z.maxAMR} AMR</span>
      </div>
      <div style="height:5px;background:var(--bg);border-radius:99px;overflow:hidden;border:1px solid var(--border)">
        <div class="occ-fill ${barCls}" style="width:0%" data-w="${z.pct}%"></div>
      </div>
    </div>`;
  }).join('');

  const heartbeatHTML = TRAFFIC.plcHeartbeat.map(p => {
    const col = p.status === 'ok' ? 'var(--green)' : p.status === 'error' ? 'var(--red)' : 'var(--amber)';
    const latLabel = p.status === 'error' ? 'OFFLINE' : p.latency+'ms';
    return `
    <div class="plc-hb-item">
      <span class="plc-hb-dot" style="background:${col};${p.status==='ok'?'':p.status==='error'?'animation:blink 1s infinite':''}"></span>
      <span class="plc-hb-name">${p.name}</span>
      <span class="plc-hb-lat" style="color:${col}">${latLabel}</span>
    </div>`;
  }).join('');

  const bufferHTML = TRAFFIC.buffers.map(b => {
    const barCls = b.cls === 'crit' ? 'hi' : b.cls === 'warn' ? 'mid' : 'lo';
    return `
    <div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:11px;color:var(--text-2)">${b.name}</span>
        <span style="font-size:11px;font-family:monospace;font-weight:700;color:var(--${b.cls==='crit'?'red':b.cls==='warn'?'amber':'text-3'})">${b.cap}</span>
      </div>
      <div style="height:4px;background:var(--bg);border-radius:99px;overflow:hidden;border:1px solid var(--border)">
        <div class="occ-fill ${barCls}" style="width:0%" data-w="${b.pct}%"></div>
      </div>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="traffic-col">
      <div class="traffic-col-title"><i class="fas fa-route" style="color:var(--accent);margin-right:6px"></i>AMR Grid Congestion</div>
      ${congestionHTML}
    </div>
    <div class="traffic-col">
      <div class="traffic-col-title"><i class="fas fa-heartbeat" style="color:var(--red);margin-right:6px"></i>PLC Heartbeat</div>
      <div class="plc-hb-list">${heartbeatHTML}</div>
    </div>
    <div class="traffic-col">
      <div class="traffic-col-title"><i class="fas fa-database" style="color:var(--cyan);margin-right:6px"></i>Buffer Occupancy</div>
      ${bufferHTML}
    </div>`;

  setTimeout(()=>{
    el.querySelectorAll('.occ-fill').forEach(b=>b.style.width=b.dataset.w);
  },80);
}