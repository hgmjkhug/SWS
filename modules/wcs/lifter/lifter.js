const FLOOR_COUNT = 10;
const tower = document.getElementById('tower');
const lifter = document.getElementById('lifter');

// 1. Khởi tạo tầng kho
function initTower() {
    for (let i = 1; i <= FLOOR_COUNT; i++) {
        const floor = document.createElement('div');
        floor.className = 'floor';
        floor.innerHTML = `
            <div class="bin-slot" id="L-F${i}"></div>
            <span style="font-size: 10px; color: #475569">LVL ${i}</span>
            <div class="bin-slot" id="R-F${i}"></div>
        `;
        tower.appendChild(floor);
    }
}

// 2. Xử lý Tab chuyển đổi
document.getElementById('tab-op').addEventListener('click', () => switchTab('op'));
document.getElementById('tab-api').addEventListener('click', () => switchTab('api'));

function switchTab(type) {
    document.getElementById('op-log-content').style.display = type === 'op' ? 'block' : 'none';
    document.getElementById('api-log-content').style.display = type === 'api' ? 'block' : 'none';
    document.getElementById('tab-op').classList.toggle('active', type === 'op');
    document.getElementById('tab-api').classList.toggle('active', type === 'api');
}

// 3. Lấy thời gian thực và đồng bộ lên UI
function getSyncTime() {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;
    const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false });
    
    document.getElementById('date-display').innerText = dateStr;
    return `${dateStr} ${timeStr}`;
}

// 4. Hàm ghi Log đồng bộ
function addLogs(opMessage, apiList = []) {
    const timestamp = getSyncTime();
    
    // Ghi log vận hành
    const opLog = document.getElementById('op-log');
    opLog.innerHTML = `<div>[${timestamp}] > ${opMessage}</div>` + opLog.innerHTML;

    // Ghi chuỗi API
    const apiLog = document.getElementById('api-log');
    apiList.forEach(api => {
        apiLog.innerHTML = `
            <div class="api-entry">
                <div style="color: #5c6370; margin-bottom: 4px;">${timestamp}</div>
                <b style="color:#c678dd">${api.method}</b> 
                <span style="color:#98c379">${api.url}</span> 
                <span style="color:#25be39">→ 200 OK</span>
            </div>
        ` + apiLog.innerHTML;
    });
}

// 5. Logic Mô phỏng (Simulation)
async function startSimulation() {
    let pCount = 1;
    while(true) {
        const palletID = `PLT-00${pCount}`;
        const targetFloor = Math.floor(Math.random() * FLOOR_COUNT) + 1;

        // BƯỚC 1: Hàng vào băng chuyền
        document.getElementById('status-text').innerText = "TIẾP NHẬN (INBOUND)";
        addLogs(`Phát hiện kiện hàng ${palletID} tại cổng Inbound`, [
            { method: 'GET', url: '/api/v1/inbound/queue' }
        ]);

        const pEl = document.createElement('div');
        pEl.className = 'pallet'; pEl.innerText = palletID;
        pEl.style.bottom = "105px"; pEl.style.left = "-100px";
        document.body.appendChild(pEl);
        
        // Di chuyển vào giữa (mô phỏng băng chuyền chạy)
        setTimeout(() => pEl.style.left = "190px", 100);
        await new Promise(r => setTimeout(r, 1500));

        // BƯỚC 2: Lifter đón hàng
        document.getElementById('status-text').innerText = "GẮP HÀNG (PICKING)";
        lifter.style.bottom = "0";
        addLogs(`Lifter di chuyển xuống tầng 1 để nhận ${palletID}`, [
            { method: 'POST', url: '/api/v1/lifter/move/floor-1' },
            { method: 'PUT', url: `/api/v1/lifter/claim/${palletID}` }
        ]);
        await new Promise(r => setTimeout(r, 1200));
        
        lifter.appendChild(pEl);
        pEl.style.position = "relative"; pEl.style.left = "0"; pEl.style.bottom = "0";

        // BƯỚC 3: Lưu kho lên tầng
        document.getElementById('status-text').innerText = `LƯU KHO (STORING) - TẦNG ${targetFloor}`;
        addLogs(`Nâng kiện hàng lên Tầng ${targetFloor}`, [
            { method: 'PATCH', url: `/api/v1/inventory/assign/F${targetFloor}` }
        ]);
        lifter.style.bottom = `${(targetFloor - 1) * 48}px`;
        await new Promise(r => setTimeout(r, 1800));

        // BƯỚC 4: Hoàn tất
        const side = Math.random() > 0.5 ? 'L' : 'R';
        document.getElementById(`${side}-F${targetFloor}`).classList.add('occupied');
        pEl.remove();
        
        document.getElementById('status-text').innerText = "HOÀN TẤT (SUCCESS)";
        addLogs(`Kiện hàng ${palletID} đã nằm yên tại vị trí ${side}-F${targetFloor}`, [
            { method: 'POST', url: '/api/v1/jobs/complete' }
        ]);

        await new Promise(r => setTimeout(r, 1000));
        document.getElementById('status-text').innerText = "ĐANG CHỜ (WAITING)";
        pCount++;
        await new Promise(r => setTimeout(r, 3000)); // Nghỉ 3s trước khi có hàng mới
    }
}

// Khởi chạy hệ thống
initTower();
getSyncTime();
startSimulation();