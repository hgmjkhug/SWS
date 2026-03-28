function initRacks() {
    ['block-top', 'block-bottom'].forEach(id => {
        const el = document.getElementById(id);
        for(let i=0; i<16; i++) el.innerHTML += `<div class="slot" id="${id}-s${i}">${i+1}</div>`;
    });
}
initRacks();

function switchTab(tabId, btn) {
    document.querySelectorAll('.log-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

function getSyncDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN');
    const timeStr = now.toLocaleTimeString('vi-VN');
    document.getElementById('display-today').innerText = dateStr;
    return { full: `${dateStr} ${timeStr}` };
}

function addSyncLogs(opMsg, apiList = []) {
    const sync = getSyncDateTime();
    const opBox = document.getElementById('op-log');
    opBox.innerHTML = `> [${sync.full}] ${opMsg}<br>` + opBox.innerHTML;

    const apiContainer = document.getElementById('api-log-list');
    apiList.forEach(api => {
        const entry = document.createElement('div');
        entry.className = 'api-entry';
        entry.innerHTML = `
            <span style="color:#94a3b8">${sync.full}</span><br>
            <b class="m-${api.method.toLowerCase()}">${api.method}</b> 
            <span style="color:#abb2bf">${api.url}</span>
            <span style="color:#22c55e"> → 200</span>
        `;
        apiContainer.insertBefore(entry, apiContainer.firstChild);
    });
}

async function startSimulation() {
    let pIdx = 1;
    const crane = document.getElementById('crane');
    
    while(true) {
        const pCode = `PLT-${200 + pIdx}`;
        const targetSlot = Math.floor(Math.random() * 16);
        const isTop = Math.random() > 0.5;

        // 1. Nhận lệnh
        document.getElementById('crane-status').innerText = "CHECKING JOB";
        addSyncLogs(`Hệ thống WMS điều phối lệnh mới cho ${pCode}`, [
            { method: 'GET', url: '/api/v1/jobs/next' }
        ]);
        
        // Tạo Pallet tại vị trí chờ (đầu hành lang)
        const pallet = document.createElement('div');
        pallet.className = 'pallet'; pallet.innerText = pIdx;
        pallet.style.left = "0px";
        document.querySelector('.aisle-horizontal').appendChild(pallet);
        await new Promise(r => setTimeout(r, 1000));

        // 2. Di chuyển Crane tới pallet
        crane.style.left = "0px";
        document.getElementById('crane-status').innerText = "PICKING UP";
        await new Promise(r => setTimeout(r, 1500));
        
        // Gắp pallet
        document.querySelector('.crane-arm').appendChild(pallet);
        pallet.style.left = "5px"; pallet.style.top = "5px";
        addSyncLogs(`Xác nhận Pickup ${pCode} tại trạm I/O`, [
            { method: 'POST', url: '/api/v1/device/pickup' }
        ]);

        // 3. Chạy tới vị trí kệ theo chiều ngang
        const targetX = targetSlot * 40; // Tính toán vị trí dựa trên slot
        document.getElementById('crane-status').innerText = `MOVING TO SLOT ${targetSlot + 1}`;
        crane.style.left = `${targetX}px`;
        await new Promise(r => setTimeout(r, 2000));

        // 4. Lưu kho
        document.getElementById('crane-status').innerText = "STORING...";
        addSyncLogs(`Cập nhật vị trí lưu kho: ${isTop ? 'Dãy Trên' : 'Dãy Dưới'} - Ô ${targetSlot+1}`, [
            { method: 'PUT', url: `/api/v1/inventory/${pCode}/location` }
        ]);
        
        // Hiệu ứng đưa hàng vào kệ
        pallet.remove();
        const slotEl = document.getElementById(`${isTop ? 'block-top' : 'block-bottom'}-s${targetSlot}`);
        slotEl.style.background = "#d97706";
        slotEl.style.color = "white";

        // 5. Kết thúc
        document.getElementById('crane-status').innerText = "COMPLETED";
        addSyncLogs(`Hoàn tất chu kỳ nhập kho cho ${pCode}`, [
            { method: 'POST', url: '/api/v1/jobs/complete' }
        ]);
        
        await new Promise(r => setTimeout(r, 2000));
        pIdx++;
    }
}

// Chạy
setInterval(getSyncDateTime, 1000);
startSimulation();