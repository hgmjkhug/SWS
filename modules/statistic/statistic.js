/* ── MOCK DATA ────────────────────────────────────────── */
const STAT_DATA = {
    summary: {
        totalInv: 12450,
        inbound: 450,
        outbound: 320,
        alerts: 12
    },
    trend: {
        labels: ['01/03', '02/03', '03/03', '04/03', '05/03', '06/03', '07/03'],
        in: [120, 250, 180, 420, 310, 560, 450],
        out: [80, 150, 220, 300, 280, 410, 320]
    },
    categories: [
        { name: 'Linh kiện xe du lịch', value: 5400, color: '#3b82f6' },
        { name: 'Linh kiện xe tải', value: 3200, color: '#10b981' },
        { name: 'Linh kiện xe bus', value: 2100, color: '#f59e0b' },
        { name: 'Vật tư tiêu hao', value: 1750, color: '#ef4444' }
    ],
    details: [
        { time: '2026-03-07 14:30', code: 'VT001', name: 'Trục khuỷu THACO', type: 'in', qty: 50, unit: 'Bộ', wh: 'TOMC', status: 'Duyệt' },
        { time: '2026-03-07 13:15', code: 'VT009', name: 'Lốp xe du lịch K13', type: 'out', qty: 120, unit: 'Cái', wh: 'TOMC', status: 'Duyệt' },
        { time: '2026-03-07 11:45', code: 'VT024', name: 'Thanh giằng ngang', type: 'in', qty: 30, unit: 'Thanh', wh: 'CSC', status: 'Duyệt' },
        { time: '2026-03-07 09:20', code: 'VT102', name: 'Ốc vít M8x20', type: 'out', qty: 1000, unit: 'Con', wh: 'CSC', status: 'Duyệt' },
        { time: '2026-03-06 16:10', code: 'VT056', name: 'Kính chắn gió front', type: 'in', qty: 45, unit: 'Tấm', wh: 'TOMC', status: 'Duyệt' },
        { time: '2026-03-06 15:00', code: 'VT001', name: 'Trục khuỷu THACO', type: 'out', qty: 20, unit: 'Bộ', wh: 'TOMC', status: 'Duyệt' },
        { time: '2026-03-06 10:30', code: 'VT012', name: 'Má phanh trước', type: 'in', qty: 100, unit: 'Cái', wh: 'TACB', status: 'Duyệt' },
        { time: '2026-03-05 14:20', code: 'VT088', name: 'Dây đai cam', type: 'out', qty: 15, unit: 'Bộ', wh: 'TOMC', status: 'Duyệt' },
        { time: '2026-03-05 09:10', code: 'VT201', name: 'Lọc dầu nhớt', type: 'in', qty: 200, unit: 'Cái', wh: 'TOMC', status: 'Duyệt' },
    ]
};

/* ── DOM PREPARATION ──────────────────────────────────── */
/* ── DATE PICKER STATE ──────────────────────────────────── */
let selectedRange = { start: new Date(), end: new Date() };
let tempRange = { start: new Date(), end: new Date() };
let currentLeftDate = new Date();
let currentRightDate = new Date();
currentRightDate.setMonth(currentRightDate.getMonth() + 1);

/* ── DOM PREPARATION ──────────────────────────────────── */
function initAll() {
    initStatDatePicker();
    renderSummary();
    drawTrendChart();
    drawDonutChart();
    renderTable();
    initAnimations();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

function initStatDatePicker() {
    // Set initial display
    const triggerDisplay = document.getElementById("dateRangeDisplay");
    if (triggerDisplay) {
        const s = selectedRange.start;
        const e = selectedRange.end;
        triggerDisplay.textContent = `${s.getDate()}/${s.getMonth() + 1}/${s.getFullYear()} - ${e.getDate()}/${e.getMonth() + 1}/${e.getFullYear()}`;
    }

    initPickerDropdowns();
    setupPickerListeners();
    renderCalendars();
}

function initPickerDropdowns() {
    const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const setupDropdown = (id, list, selectedId, listId, onSelect) => {
        const listEl = document.getElementById(listId);
        const selectedEl = document.getElementById(selectedId);
        if (!listEl || !selectedEl) return;

        listEl.innerHTML = list.map(item => `<div class="dropdown-item" data-value="${item}">${item}</div>`).join('');
        
        listEl.querySelectorAll('.dropdown-item').forEach(item => {
            item.onclick = (e) => {
                e.stopPropagation();
                const val = item.getAttribute('data-value');
                selectedEl.textContent = val;
                onSelect(val);
                document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('active'));
            };
        });
    };

    // Left calendars
    setupDropdown('leftMonthDropdown', months, 'leftMonthSelected', 'leftMonthList', (m) => {
        currentLeftDate.setMonth(months.indexOf(m));
        renderCalendars();
    });
    setupDropdown('leftYearDropdown', years, 'leftYearSelected', 'leftYearList', (y) => {
        currentLeftDate.setFullYear(parseInt(y));
        renderCalendars();
    });

    // Right calendars
    setupDropdown('rightMonthDropdown', months, 'rightMonthSelected', 'rightMonthList', (m) => {
        currentRightDate.setMonth(months.indexOf(m));
        renderCalendars();
    });
    setupDropdown('rightYearDropdown', years, 'rightYearSelected', 'rightYearList', (y) => {
        currentRightDate.setFullYear(parseInt(y));
        renderCalendars();
    });
}

function setupPickerListeners() {
    // Toggle Picker
    window.toggleDateRangePicker = (e) => {
        e.stopPropagation();
        const picker = document.getElementById("analyticsPicker");
        picker.classList.toggle("active");
        if (picker.classList.contains("active")) {
            tempRange = { ...selectedRange };
            renderCalendars();
        }
    };

    // Close on outside click
    document.addEventListener("click", (e) => {
        const picker = document.getElementById("analyticsPicker");
        if (picker && !picker.contains(e.target) && !e.target.closest("#dateRangeTrigger")) {
            picker.classList.remove("active");
        }
        document.querySelectorAll(".custom-dropdown").forEach(d => d.classList.remove("active"));
    });

    // Custom Dropdown triggers
    document.querySelectorAll(".custom-dropdown").forEach((dd) => {
        const sel = dd.querySelector(".dropdown-selected");
        if (sel) {
            sel.onclick = (e) => {
                e.stopPropagation();
                const isActive = dd.classList.contains("active");
                document.querySelectorAll(".custom-dropdown").forEach(d => d.classList.remove("active"));
                if (!isActive) dd.classList.add("active");
            };
        }
    });

    // Sidebar Presets
    document.querySelectorAll(".sidebar-item").forEach((item) => {
        item.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll(".sidebar-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            const range = item.getAttribute("data-range");
            const today = new Date();
            
            if (range === "all") {
                tempRange.start = null;
                tempRange.end = null;
            } else if (range === "today") {
                tempRange.start = today;
                tempRange.end = today;
            } else if (range === "last7") {
                const s = new Date(); s.setDate(today.getDate() - 7);
                tempRange.start = s; tempRange.end = today;
            } else if (range === "last30") {
                const s = new Date(); s.setDate(today.getDate() - 30);
                tempRange.start = s; tempRange.end = today;
            } else {
                // Simplified for other presets
                tempRange.start = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
                tempRange.end = today;
            }

            if (tempRange.start && tempRange.end) {
                currentLeftDate = new Date(tempRange.start);
                currentRightDate = new Date(tempRange.end);
                if (currentLeftDate.getMonth() === currentRightDate.getMonth() && currentLeftDate.getFullYear() === currentRightDate.getFullYear()) {
                    currentRightDate.setMonth(currentRightDate.getMonth() + 1);
                }
            }
            renderCalendars();
        };
    });

    // Actions
    document.getElementById("applyPicker").onclick = () => {
        selectedRange = { ...tempRange };
        const triggerDisplay = document.getElementById("dateRangeDisplay");
        if (selectedRange.start && selectedRange.end) {
            const s = selectedRange.start, e = selectedRange.end;
            triggerDisplay.textContent = `${s.getDate()}/${s.getMonth() + 1}/${s.getFullYear()} - ${e.getDate()}/${e.getMonth() + 1}/${e.getFullYear()}`;
        } else if (!selectedRange.start && !selectedRange.end) {
            triggerDisplay.textContent = 'Tất cả thời gian';
        }
        document.getElementById("analyticsPicker").classList.remove("active");
        refreshData();
    };

    document.getElementById("cancelPicker").onclick = () => {
        document.getElementById("analyticsPicker").classList.remove("active");
    };

    document.getElementById("clearPicker").onclick = () => {
        const today = new Date();
        selectedRange = { start: today, end: today };
        tempRange = { start: today, end: today };
        renderCalendars();
        document.getElementById("applyPicker").click();
    };
}

function renderCalendars() {
    renderCalendar("left", currentLeftDate);
    renderCalendar("right", currentRightDate);
    
    // Update temp display
    const display = document.getElementById("tempRangeDisplay");
    if (tempRange.start && tempRange.end) {
        display.textContent = `${formatDate(tempRange.start)} — ${formatDate(tempRange.end)}`;
    } else if (tempRange.start) {
        display.textContent = `${formatDate(tempRange.start)} — ...`;
    }
}

function renderCalendar(side, date) {
    const container = document.querySelector(`#${side}Calendar .days-container`);
    if (!container) return;
    container.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Update dropdown labels
    const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    document.getElementById(`${side}MonthSelected`).textContent = months[month];
    document.getElementById(`${side}YearSelected`).textContent = year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let startOffset = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startOffset; i++) {
        const empty = document.createElement("div");
        empty.className = "day empty";
        container.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dayDate = new Date(year, month, d);
        const el = document.createElement("div");
        el.className = "day";
        el.textContent = d;

        if (tempRange.start && isSameDay(dayDate, tempRange.start)) el.classList.add("selected", "range-start");
        if (tempRange.end && isSameDay(dayDate, tempRange.end)) el.classList.add("selected", "range-end");
        if (tempRange.start && tempRange.end && dayDate > tempRange.start && dayDate < tempRange.end) el.classList.add("in-range");
        
        const today = new Date();
        if (isSameDay(dayDate, today)) el.classList.add("today");

        el.onclick = () => {
            if (!tempRange.start || (tempRange.start && tempRange.end)) {
                tempRange.start = dayDate;
                tempRange.end = null;
            } else {
                if (dayDate < tempRange.start) {
                    tempRange.end = tempRange.start;
                    tempRange.start = dayDate;
                } else {
                    tempRange.end = dayDate;
                }
            }
            renderCalendars();
        };
        container.appendChild(el);
    }
}

function isSameDay(d1, d2) {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
}

function formatDate(d) {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function renderSummary() {
    document.getElementById('stats-total-inv').textContent = STAT_DATA.summary.totalInv.toLocaleString();
    document.getElementById('stats-inbound').textContent = STAT_DATA.summary.inbound.toLocaleString();
    document.getElementById('stats-outbound').textContent = STAT_DATA.summary.outbound.toLocaleString();
    document.getElementById('stats-alerts').textContent = STAT_DATA.summary.alerts.toLocaleString();
}

/* ── CHARTS ───────────────────────────────────────────── */
function drawTrendChart() {
    const canvas = document.getElementById('io-trend-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const padding = { top: 30, bottom: 40, left: 50, right: 30 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    ctx.clearRect(0, 0, W, H);

    const labels = STAT_DATA.trend.labels;
    const dataIn = STAT_DATA.trend.in;
    const dataOut = STAT_DATA.trend.out;
    const n = labels.length;
    const maxVal = Math.max(...dataIn, ...dataOut) * 1.2;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Roboto';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 5; i++) {
        const y = padding.top + chartH - (i / 5) * chartH;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartW, y);
        ctx.stroke();
        ctx.fillText(Math.round((maxVal * i) / 5), padding.left - 10, y + 3);
    }

    ctx.textAlign = 'center';
    labels.forEach((lbl, i) => {
        const x = padding.left + (i / (n - 1)) * chartW;
        ctx.fillText(lbl, x, H - 20);
    });

    const drawLine = (data, color, gradientColor) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';

        data.forEach((v, i) => {
            const x = padding.left + (i / (n - 1)) * chartW;
            const y = padding.top + chartH - (v / maxVal) * chartH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        grad.addColorStop(0, gradientColor);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.lineTo(padding.left + chartW, padding.top + chartH);
        ctx.lineTo(padding.left, padding.top + chartH);
        ctx.closePath();
        ctx.fill();

        data.forEach((v, i) => {
            const x = padding.left + (i / (n - 1)) * chartW;
            const y = padding.top + chartH - (v / maxVal) * chartH;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.stroke();
        });
    };

    drawLine(dataIn, '#10b981', 'rgba(16,185,129,0.2)');
    drawLine(dataOut, '#f59e0b', 'rgba(245,158,11,0.2)');
}

function drawDonutChart() {
    const canvas = document.getElementById('inv-donut-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const outerR = W / 2 - 10, innerR = outerR * 0.6;

    ctx.clearRect(0, 0, W, H);

    const data = STAT_DATA.categories;
    const total = data.reduce((acc, cur) => acc + cur.value, 0);
    let startAngle = -Math.PI / 2;

    data.forEach(item => {
        const sliceAngle = (item.value / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
        ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.closePath();
        startAngle += sliceAngle;
    });

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px Roboto';
    ctx.fillText('100%', cx, cy);

    const legend = document.getElementById('inv-legend');
    if (legend) {
        legend.innerHTML = data.map(item => `
            <div class="leg-row">
                <span class="l-item">
                    <span class="dot" style="background:${item.color}"></span>
                    ${item.name}
                </span>
                <span style="font-weight:600">${((item.value/total)*100).toFixed(1)}%</span>
            </div>
        `).join('');
    }
}

function renderTable() {
    const tbody = document.getElementById('stat-table-body');
    if (!tbody) return;

    tbody.innerHTML = STAT_DATA.details.map(d => `
        <tr>
            <td>${d.time}</td>
            <td style="font-weight:600">${d.code}</td>
            <td>${d.name}</td>
            <td style="text-align:center;"><span class="badge ${d.type}">${d.type === 'in' ? 'Nhập' : 'Xuất'}</span></td>
            <td style="text-align:center; font-weight:700">${d.qty}</td>
            <td>${d.unit}</td>
        </tr>
    `).join('');
}

function filterTable() {
    const input = document.getElementById('table-search');
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll('#stat-table-body tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
}

function refreshData() {
    const btn = document.querySelector('.btn-refresh');
    if (btn) btn.classList.add('spinning');

    setTimeout(() => {
        if (btn) btn.classList.remove('spinning');
        // Randomize data to simulate result of date filtering
        STAT_DATA.summary.inbound = Math.floor(Math.random() * 500) + 100;
        STAT_DATA.summary.outbound = Math.floor(Math.random() * 400) + 50;
        
        renderSummary();
        drawTrendChart();
        drawDonutChart();
        renderTable();
        
        if (window.showToast) window.showToast('Dữ liệu đã được cập nhật!', 'success');
    }, 600);
}

async function exportReport() {
    if (typeof ExcelJS === 'undefined') {
        alert('Đang tải thư viện xuất Excel, vui lòng thử lại sau giây lát.');
        return;
    }

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Báo cáo thống kê');

        worksheet.columns = [
            { header: 'Thời gian', key: 'time', width: 20 },
            { header: 'Mã vật tư', key: 'code', width: 15 },
            { header: 'Tên sản phẩm', key: 'name', width: 30 },
            { header: 'Loại', key: 'type', width: 12 },
            { header: 'Số lượng', key: 'qty', width: 12 },
            { header: 'Đơn vị', key: 'unit', width: 10 },
        ];

        STAT_DATA.details.forEach(item => {
            worksheet.addRow({
                ...item,
                type: item.type === 'in' ? 'Nhập' : 'Xuất'
            });
        });

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE2E8F0' }
        };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Bao_cao_ton_kho_${new Date().toISOString().split('T')[0]}.xlsx`);

        if (window.showToast) window.showToast('Đã xuất báo cáo thành công!', 'success');
    } catch (err) {
        console.error('Export error:', err);
        alert('Lỗi khi xuất báo cáo: ' + err.message);
    }
}

function initAnimations() {
    const cards = document.querySelectorAll('.s-card');
    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 100);
    });
}
