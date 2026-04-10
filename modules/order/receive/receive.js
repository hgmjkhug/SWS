// Mock Data for ERP Orders
let erpOrders = [
    { code: 'ORD-001', name: 'Nhập kho linh kiện A', customer: 'Samsung Vina', note: 'Giao gấp trong sáng nay', createdAt: '08:15 - 08/04/2024', synced: true, status: 'Đã tiếp nhận', 
      products: [
          { code: 'PRD-001', name: 'Chip Set X1', qty: 500 },
          { code: 'PRD-002', name: 'Mainboard V2', qty: 200 }
      ]
    },
    { code: 'ORD-002', name: 'Nhập kho phụ tùng B', customer: 'Toyota Vietnam', note: 'Hàng dễ vỡ', createdAt: '09:45 - 08/04/2024', synced: true, status: 'Chưa tiếp nhận',
      products: [
          { code: 'PRD-003', name: 'Piston Ring', qty: 1000 },
          { code: 'PRD-004', name: 'Brake Pad', qty: 300 }
      ]
    },
    { code: 'ORD-003', name: 'Nhập máy móc thiết bị', customer: 'LG Display', note: 'Kiểm tra kỹ seal', synced: false, status: 'Chưa tiếp nhận',
      products: [
          { code: 'PRD-005', name: 'Sensor S5', qty: 50 }
      ]
    },
    { code: 'ORD-004', name: 'Nhập nguyên liệu sản xuất', customer: 'Panasonic', note: '', synced: false, status: 'Chưa tiếp nhận',
      products: [
          { code: 'PRD-006', name: 'Steel Sheet 2mm', qty: 2000 }
      ]
    },
    { code: 'ORD-005', name: 'Nhập bao bì đóng gói', customer: 'Tetra Pak', note: 'Kho số 3', synced: false, status: 'Chưa tiếp nhận',
      products: [
          { code: 'PRD-007', name: 'Carton Box XL', qty: 5000 }
      ]
    },
    { code: 'ORD-006', name: 'Nhập thiết bị điện', customer: 'ABB Vietnam', note: 'Có VAT', synced: false, status: 'Chưa tiếp nhận',
      products: [
          { code: 'PRD-008', name: 'Circuit Breaker', qty: 150 }
      ]
    },
    { code: 'ORD-007', name: 'Nhập hóa chất tẩy rửa', customer: 'Unilever', note: 'Hàng nguy hiểm', synced: false, status: 'Chưa tiếp nhận',
      products: [
          { code: 'PRD-009', name: 'Detergent Solution X', qty: 1000 }
      ]
    },
    { code: 'ORD-008', name: 'Nhập khuôn mẫu nhựa', customer: 'TOSHIBA', note: '', synced: false, status: 'Chưa tiếp nhận',
      products: [
          { code: 'PRD-010', name: 'Injection Mold KM1', qty: 10 }
      ]
    },
    { code: 'ORD-009', name: 'Nhập dây cáp mạng', customer: 'FPT Telecom', note: 'Dùng cho dự án mới', createdAt: '16:00 - 05/04/2024', synced: false, status: 'Chưa tiếp nhận',
      products: [
          { code: 'PRD-011', name: 'Cat 6 Cable 305m', qty: 100 }
      ]
    }
];

// Initialize more dummy data for pagination testing
for (let i = 10; i <= 50; i++) {
    erpOrders.push({
        code: `ORD-0${i}`,
        name: `Nhập hàng lô ${i}`,
        customer: i % 2 === 0 ? 'THACO Group' : 'THAGRICO',
        note: `Ghi chú đơn hàng ${i}`,
        createdAt: `08:30 - ${i < 10 ? '0' : ''}${10 + (i%20)}/04/2024`,
        synced: i <= 15,
        status: i % 3 === 0 ? 'Đã tiếp nhận' : 'Chưa tiếp nhận',
        products: [{ code: `PRD-0${i}`, name: `Sản phẩm ${i}`, qty: i * 10 }]
    });
}

// Variables for State
let currentPage = 1;
const itemsPerPage = 20;
const SYNC_STORAGE_KEY = 'sws_synced_orders';
let filteredMainOrders = [];
let filteredErpOrders = [];
let currentSyncTab = 'not-synced';
let currentMainTab = 'Chưa tiếp nhận';
let confirmCallback = null;

// --- LocalStorage Logic ---
function loadSyncedStatus() {
    const syncedData = JSON.parse(localStorage.getItem(SYNC_STORAGE_KEY) || '[]');
    // syncedData will now be an array of objects: { code, status }
    erpOrders.forEach(order => {
        const saved = syncedData.find(s => s.code === order.code);
        if (saved) {
            order.synced = true;
            order.status = saved.status || 'Chưa tiếp nhận';
        }
    });
}

function saveSyncedStatus() {
    const syncedData = erpOrders.filter(o => o.synced).map(o => ({
        code: o.code,
        status: o.status
    }));
    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(syncedData));
}

// Initialize
loadSyncedStatus();
filterOrders();

// --- Main Table Logic ---

function filterOrders() {
    const keyword = document.getElementById('receive-search').value.toLowerCase();

    filteredMainOrders = erpOrders.filter(o => 
        o.synced && 
        (o.code.toLowerCase().includes(keyword) || o.name.toLowerCase().includes(keyword)) &&
        o.status === currentMainTab
    );

    currentPage = 1;
    renderMainTable();
}

function renderMainTable() {
    const tableBody = document.getElementById('receive-table-body');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredMainOrders.slice(start, end);

    tableBody.innerHTML = '';

    if (pageItems.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">Không tìm thấy đơn hàng nào đã đồng bộ.</td></tr>';
    } else {
        pageItems.forEach((order, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${currentMainTab === 'Chưa tiếp nhận' ? `<input type="checkbox" class="main-checkbox" value="${order.code}" onchange="updateMainBulkBtn()">` : ''}</td>
                <td>${start + index + 1}</td>
                <td class="text-primary font-bold">${order.code}</td>
                <td>${order.name}</td>
                <td>${order.customer}</td>
                <td title="${order.note}">${order.note || '-'}</td>
                <td>${order.createdAt || '-'}</td>
                <td>
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <button class="btn-icon" onclick="openProductModal('${order.code}')" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${order.status === 'Chưa tiếp nhận' ? `
                            <button class="btn-icon text-success" onclick="receiveOrder('${order.code}')" title="Tiếp nhận đơn hàng">
                                <i class="fas fa-check-circle"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    renderPagination();
    updateMainBulkBtn(); // Ensure bulk button state is updated after render
}

function renderPagination() {
    const totalItems = filteredMainOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationInfo = document.getElementById('pagination-info');
    const pageNumbers = document.getElementById('page-numbers');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    paginationInfo.textContent = `Hiển thị ${start} - ${end} trong ${totalItems}`;

    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            currentPage = i;
            renderMainTable();
        };
        pageNumbers.appendChild(btn);
    }

    prevBtn.disabled = currentPage === 1 || totalPages === 0;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderMainTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredMainOrders.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderMainTable();
    }
}

function switchMainTab(status) {
    currentMainTab = status;
    
    // Update UI
    document.querySelectorAll('.main-tab').forEach(el => el.classList.remove('active'));
    if (status === 'Chưa tiếp nhận') {
        document.getElementById('tab-status-not-received').classList.add('active');
    } else {
        document.getElementById('tab-status-received').classList.add('active');
    }
    
    filterOrders();
}

function receiveOrder(code) {
    const checkedBoxes = document.querySelectorAll('.main-checkbox:checked');
    const selectedCodes = Array.from(checkedBoxes).map(cb => cb.value);
    
    // Nếu có đơn hàng được chọn qua checkbox, thực hiện tiếp nhận hàng loạt
    if (selectedCodes.length > 0) {
        // Đảm bảo mã đơn hàng hiện tại được bao gồm trong danh sách nếu chưa có
        if (!selectedCodes.includes(code)) {
            selectedCodes.push(code);
        }
        
        showConfirm(`Bạn có chắc chắn muốn tiếp nhận ${selectedCodes.length} đơn hàng đã chọn?`, () => {
            selectedCodes.forEach(c => {
                const order = erpOrders.find(o => o.code === c);
                if (order) {
                    order.status = 'Đã tiếp nhận';
                    order.synced = true;
                }
            });
            saveSyncedStatus();
            filterOrders();
            
            // Hiện Toast thành công
            if (typeof showToast === 'function') {
                showToast(`Đã tiếp nhận thành công ${selectedCodes.length} đơn hàng`, 'success');
            }
            
            // Reset checkbox tiêu đề
            const checkAll = document.getElementById('main-check-all');
            if (checkAll) checkAll.checked = false;
        });
    } else {
        // Tiếp nhận đơn lẻ như bình thường
        showConfirm('Bạn có chắc chắn muốn tiếp nhận đơn hàng này?', () => {
            const order = erpOrders.find(o => o.code === code);
            if (order) {
                order.status = 'Đã tiếp nhận';
                order.synced = true;
                saveSyncedStatus();
                filterOrders();
                
                // Hiện Toast thành công
                if (typeof showToast === 'function') {
                    showToast('Đã tiếp nhận thành công 1 đơn hàng', 'success');
                }
            }
        });
    }
}

function toggleAllMain(source) {
    const checkboxes = document.querySelectorAll('.main-checkbox');
    checkboxes.forEach(c => c.checked = source.checked);
    updateMainBulkBtn();
}

function updateMainBulkBtn() {
    // Không cần quản lý nút Tiếp nhận ở header nữa theo yêu cầu của bạn.
    // Chỉ giữ lại logic hiển thị checkbox 'Check All' nếu cần.
    const checkAll = document.getElementById('main-check-all');
    if (checkAll) {
        checkAll.parentElement.style.visibility = currentMainTab === 'Chưa tiếp nhận' ? 'visible' : 'hidden';
    }
}

function bulkReceive() {
    // Chức năng này hiện được tích hợp trực tiếp vào receiveOrder thông qua icon dòng.
    // Không cần hàm này chạy riêng biệt từ nút header nữa.
}

// --- Generic Confirmation Logic ---
function showConfirm(message, callback) {
    const modal = document.getElementById('confirm-modal');
    const msgEl = document.getElementById('confirm-message');
    msgEl.textContent = message;
    confirmCallback = callback;
    modal.classList.add('show');
}

function closeConfirmModal(result) {
    const modal = document.getElementById('confirm-modal');
    modal.classList.remove('show');
    if (result && confirmCallback) {
        confirmCallback();
    }
    confirmCallback = null;
}

// --- Sync Modal Logic ---

function openSyncModal() {
    document.getElementById('sync-modal').classList.add('show');
    filterErpOrders();
}

function closeSyncModal() {
    document.getElementById('sync-modal').classList.remove('show');
}

function filterErpOrders() {
    const keyword = document.getElementById('erp-search').value.toLowerCase();

    filteredErpOrders = erpOrders.filter(o => 
        (o.code.toLowerCase().includes(keyword) || o.name.toLowerCase().includes(keyword)) &&
        (currentSyncTab === 'synced' ? o.synced : !o.synced)
    );

    updateTabCounts();
    renderErpTable();
}

function updateTabCounts() {
    const notSyncedCount = erpOrders.filter(o => !o.synced).length;
    const syncedCount = erpOrders.filter(o => o.synced).length;

    const tabNotSynced = document.getElementById('tab-not-synced');
    const tabSynced = document.getElementById('tab-synced');

    if (tabNotSynced) {
        tabNotSynced.innerHTML = `Chưa đồng bộ: <span class="tab-count" id="count-not-synced">${notSyncedCount}</span>`;
    }
    if (tabSynced) {
        tabSynced.innerHTML = `Đã đồng bộ <span class="tab-count" id="count-synced"></span>`;
        // If you want count for synced too, uncomment below:
        // tabSynced.innerHTML = `Đã đồng bộ: <span class="tab-count" id="count-synced">${syncedCount}</span>`;
    }
}

function switchSyncTab(tab) {
    currentSyncTab = tab;
    
    // Update UI
    document.querySelectorAll('.modal-tab').forEach(el => el.classList.remove('active'));
    if (tab === 'not-synced') {
        document.getElementById('tab-not-synced').classList.add('active');
    } else {
        document.getElementById('tab-synced').classList.add('active');
    }
    
    filterErpOrders();
}

function renderErpTable() {
    const tableBody = document.getElementById('erp-table-body');
    tableBody.innerHTML = '';

    // Show/Hide bulk sync button and checkbox header column based on tab
    const bulkBtn = document.getElementById('bulk-sync-btn');
    const checkAllHeader = document.getElementById('erp-check-all');
    
    if (currentSyncTab === 'synced') {
        bulkBtn.style.display = 'none';
        if (checkAllHeader) checkAllHeader.parentElement.style.visibility = 'hidden';
    } else {
        bulkBtn.style.display = 'flex';
        if (checkAllHeader) checkAllHeader.parentElement.style.visibility = 'visible';
    }

    filteredErpOrders.forEach((order, index) => {
        const row = document.createElement('tr');
        if (order.synced) row.style.opacity = '0.7';

        row.innerHTML = `
            <td>${currentSyncTab === 'synced' ? '' : `<input type="checkbox" class="erp-checkbox" value="${order.code}" ${order.synced ? 'disabled' : ''} onchange="updateBulkBtn()">`}</td>
            <td>${index + 1}</td>
            <td class="font-bold">${order.code}</td>
            <td>${order.name}</td>
            <td>${order.customer}</td>
            <td>${order.note || '-'}</td>
            <td>${order.createdAt || '-'}</td>
            <td>
                <div style="display: flex; gap: 12px; align-items: center; justify-content: center;">
                    <i class="fa-solid fa-eye action-icon text-primary" title="Xem sản phẩm" onclick="openProductModal('${order.code}', true)"></i>
                    ${order.synced ? 
                        '<i class="fa-solid fa-check text-success" title="Đã đồng bộ"></i>' : 
                        `<i class="fa-solid fa-angles-right action-icon text-primary" title="Đồng bộ đơn hàng" onclick="syncOrder('${order.code}')"></i>`
                    }
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    if (checkAllHeader) checkAllHeader.checked = false;
    updateBulkBtn();
}

function toggleAllErp(source) {
    const checkboxes = document.querySelectorAll('.erp-checkbox:not(:disabled)');
    checkboxes.forEach(c => c.checked = source.checked);
    updateBulkBtn();
}

function updateBulkBtn() {
    const checkedCount = document.querySelectorAll('.erp-checkbox:checked').length;
    const btn = document.getElementById('bulk-sync-btn');
    btn.disabled = checkedCount === 0;
    btn.innerHTML = `<i class="fas fa-sync-alt"></i> Đồng bộ (${checkedCount})`;
}

function syncOrder(code) {
    showConfirm('Bạn có chắc chắn muốn đồng bộ đơn hàng này?', () => {
        const order = erpOrders.find(o => o.code === code);
        if (order && !order.synced) {
            order.synced = true;
            order.status = 'Chưa tiếp nhận'; // Set initial status as requested
            
            saveSyncedStatus(); // Persist to localStorage
            
            // Refresh tables
            filterErpOrders();
            filterOrders();
            
            // Show notification (Optional, if toast system exists)
            console.log(`Đã đồng bộ đơn hàng: ${code}`);
        }
    });
}

function bulkSync() {
    const checkedBoxes = document.querySelectorAll('.erp-checkbox:checked');
    const selectedCodes = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (selectedCodes.length === 0) return;

    showConfirm(`Bạn có chắc chắn muốn đồng bộ ${selectedCodes.length} đơn hàng này?`, () => {
        selectedCodes.forEach(code => {
            const order = erpOrders.find(o => o.code === code);
            if (order && !order.synced) {
                order.synced = true;
                order.status = 'Chưa tiếp nhận';
            }
        });
        
        saveSyncedStatus();
        filterErpOrders();
        filterOrders();
        
        // Reset "check all" and bulk button
        const checkAll = document.getElementById('erp-check-all');
        if (checkAll) checkAll.checked = false;
        updateBulkBtn();
    });
}

// --- Product Modal Logic ---

function openProductModal(orderCode, fromSync = false) {
    const order = erpOrders.find(o => o.code === orderCode);
    if (!order) return;

    const summary = document.getElementById('order-info-summary');
    summary.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;">
            <div><strong>Mã đơn hàng:</strong> ${order.code}</div>
            <div><strong>Khách hàng:</strong> ${order.customer}</div>
            <div style="grid-column: span 2;"><strong>Tên đơn:</strong> ${order.name}</div>
        </div>
    `;

    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = '';

    order.products.forEach((p, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td class="font-bold">${p.code}</td>
            <td>${p.name}</td>
            <td class="text-primary font-bold">${p.qty.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });

    const modal = document.getElementById('product-modal');
    modal.classList.add('show');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('show');
}
