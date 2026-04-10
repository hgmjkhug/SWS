// ============================================================
//  MOCK DATA
// ============================================================
let orders = [
    { code: 'ORD-001', name: 'Đơn hàng Samsung Q1' },
    { code: 'ORD-002', name: 'Đơn hàng Toyota April' },
    { code: 'ORD-003', name: 'Đơn hàng Vinfast V8' },
    { code: 'ORD-004', name: 'Đơn hàng LG Electronics' },
];

let batches = [
    { code: 'LOT-A1', name: 'Lô linh kiện màn hình', orderCode: 'ORD-001' },
    { code: 'LOT-A2', name: 'Lô cảm biến tiệm cận', orderCode: 'ORD-001' },
    { code: 'LOT-A3', name: 'Lô board mạch chính', orderCode: 'ORD-001' },
    { code: 'LOT-B1', name: 'Lô phụ tùng động cơ', orderCode: 'ORD-002' },
    { code: 'LOT-B2', name: 'Lô hộp số tự động', orderCode: 'ORD-002' },
    { code: 'LOT-C1', name: 'Lô pin lithium', orderCode: 'ORD-003' },
    { code: 'LOT-C2', name: 'Lô khung xe điện', orderCode: 'ORD-003' },
    { code: 'LOT-D1', name: 'Lô bảng mạch TV', orderCode: 'ORD-004' },
];

let containerTypes = [
    { code: 'PL-STANDARD', name: 'Pallet Tiêu chuẩn' },
    { code: 'PL-LARGE',    name: 'Pallet Khổ lớn' },
    { code: 'PL-PLASTIC',  name: 'Pallet Nhựa' },
    { code: 'PL-MINI',     name: 'Pallet Mini' },
    { code: 'BOX-STD',     name: 'Thùng Tiêu chuẩn' },
];

// ============================================================
//  STATE
// ============================================================
let pallets = [];
const STORAGE_KEY   = 'sws_new_pallets';
const ITEMS_PER_PAGE = 20;
let currentPage     = 1;
let filteredPallets = [];

let searchKeyword  = '';
let filterOrderCode = null;
let filterBatchCode = null;
let filterStatus    = 'all';

// Modal state
let currentTab      = 'auto';
let selectedAutoOrder = null;
let selectedAutoBatch = null;
let selectedTypeManual = null;

// Edit modal state
let editingPalletId   = null;
let selectedEditOrder = null;
let selectedEditBatch = null;

// Delete state
let pendingDeleteId = null;

// ============================================================
//  INIT
// ============================================================
(function initModule() {
    loadPallets();
    renderBatchFilterDropdown();
    initStatusOptions();
    initGlobalListeners();
    filterPallets();
    
    // Support system table scroll sync
    if (typeof initTableScrollSync === 'function') {
        initTableScrollSync();
    }
})();

function loadPallets() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        pallets = JSON.parse(stored);
    } else {
        pallets = [
            { id: 1, code: 'PAL-0001', length: 1200, width: 1000, height: 150, orderCode: 'ORD-001', batchCode: 'LOT-A1', status: 'mới tạo', createdAt: new Date().toISOString() },
            { id: 2, code: 'PAL-0002', length: 1200, width: 1000, height: 150, orderCode: 'ORD-001', batchCode: 'LOT-A1', status: 'đã sử dụng', createdAt: new Date().toISOString() },
            { id: 3, code: 'PAL-0003', length: 1100, width: 1100, height: 140, orderCode: 'ORD-002', batchCode: 'LOT-B1', status: 'mới tạo', createdAt: new Date().toISOString() },
            { id: 4, code: 'PAL-0004', length: 800,  width: 600,  height: 120, orderCode: 'ORD-003', batchCode: 'LOT-C1', status: 'đã sử dụng', createdAt: new Date().toISOString() },
            { id: 5, code: 'PAL-0005', length: 1200, width: 1000, height: 150, orderCode: 'ORD-004', batchCode: 'LOT-D1', status: 'mới tạo', createdAt: new Date().toISOString() },
        ];
        for (let i = 6; i <= 38; i++) {
            const orderIdx = (i % 4);
            const orderCode = orders[orderIdx].code;
            const orderBatches = batches.filter(b => b.orderCode === orderCode);
            const batch = orderBatches[i % orderBatches.length];
            pallets.push({
                id: i,
                code: `PAL-${String(i).padStart(4, '0')}`,
                length: [1200, 1100, 800, 1000][i % 4],
                width:  [1000, 1100, 600, 800][i % 4],
                height: [150, 140, 120, 130][i % 4],
                orderCode,
                batchCode: batch.code,
                status: i % 5 === 0 ? 'đã sử dụng' : 'mới tạo',
                createdAt: new Date().toISOString()
            });
        }
        savePallets();
    }
}

function savePallets() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pallets));
}

function initGlobalListeners() {
    document.addEventListener('click', (e) => {
        // Batch filter combobox
        if (!e.target.closest('#batch-combobox')) {
            closeBatchFilterDropdown();
        }
        // Status filter
        if (!e.target.closest('.status-filter')) {
            document.getElementById('status-options-list').classList.remove('show');
        }
        // Searchable selects in modals
        if (!e.target.closest('.searchable-select')) {
            document.querySelectorAll('.select-dropdown').forEach(d => d.classList.remove('show'));
        }
        // Excel dropdown
        if (!e.target.closest('.excel-dropdown-wrapper')) {
            document.getElementById('excel-options').classList.remove('show');
        }
    });
}

function initStatusOptions() {
    document.getElementById('status-options-list').addEventListener('click', (e) => {
        const opt = e.target.closest('.status-option');
        if (!opt) return;
        document.querySelectorAll('.status-option').forEach(el => el.classList.remove('active'));
        opt.classList.add('active');
        filterStatus = opt.dataset.value;
        document.getElementById('selected-status-text').textContent = opt.textContent;
        document.getElementById('status-options-list').classList.remove('show');
        filterPallets();
    });
}

// ============================================================
//  FILTER LOGIC
// ============================================================
function filterPallets() {
    searchKeyword = (document.getElementById('pallet-search').value || '').toLowerCase().trim();

    filteredPallets = pallets.filter(p => {
        const matchSearch  = !searchKeyword || p.code.toLowerCase().includes(searchKeyword);
        const matchOrder   = !filterOrderCode || p.orderCode === filterOrderCode;
        const matchBatch   = !filterBatchCode || p.batchCode === filterBatchCode;
        const matchStatus  = filterStatus === 'all' || p.status === filterStatus;
        return matchSearch && matchOrder && matchBatch && matchStatus;
    });

    currentPage = 1;
    renderTable();
}

// ============================================================
//  BATCH FILTER COMBOBOX (accordion)
// ============================================================
function toggleBatchDropdown() {
    const dropdown = document.getElementById('batch-dropdown');
    const selected = document.querySelector('#batch-combobox .combobox-selected');
    const isOpen = dropdown.classList.contains('show');
    if (isOpen) {
        closeBatchFilterDropdown();
    } else {
        dropdown.classList.add('show');
        selected.classList.add('open');
        document.getElementById('batch-search-input').focus();
    }
}

function closeBatchFilterDropdown() {
    document.getElementById('batch-dropdown').classList.remove('show');
    document.querySelector('#batch-combobox .combobox-selected').classList.remove('open');
}

function filterBatchDropdown() {
    const kw = document.getElementById('batch-search-input').value.toLowerCase();
    renderBatchFilterDropdown(kw);
}

function renderBatchFilterDropdown(keyword = '') {
    const list = document.getElementById('batch-dropdown-list');
    list.innerHTML = '';

    // All option
    const allDiv = document.createElement('div');
    allDiv.className = 'all-option' + (!filterOrderCode && !filterBatchCode ? ' active' : '');
    allDiv.textContent = 'Tất cả Đơn hàng & Lô';
    allDiv.onclick = () => selectFilterAll();
    list.appendChild(allDiv);

    orders.forEach(order => {
        const orderBatches = batches.filter(b => b.orderCode === order.code);
        const orderLabel = `${order.code} - ${order.name}`;
        const orderMatches = orderLabel.toLowerCase().includes(keyword);
        const matchingBatches = orderBatches.filter(b =>
            `${b.code} - ${b.name}`.toLowerCase().includes(keyword)
        );
        const show = !keyword || orderMatches || matchingBatches.length > 0;
        if (!show) return;

        const accItem = document.createElement('div');
        accItem.className = 'accordion-item';

        const header = document.createElement('div');
        const isOrderSelected = filterOrderCode === order.code && !filterBatchCode;
        header.className = 'accordion-header' + (isOrderSelected ? ' order-selected' : '');

        header.innerHTML = `
            <span class="acc-label">${orderLabel}</span>
            <div class="acc-icons">
                <button class="acc-select-btn" title="Chọn theo đơn hàng">Chọn đơn</button>
                <i class="fa-solid fa-chevron-right acc-chevron"></i>
            </div>
        `;

        const content = document.createElement('div');
        content.className = 'accordion-content' + (keyword || isOrderSelected ? ' show' : '');
        if (content.classList.contains('show')) header.classList.add('open');

        // Toggle expand
        header.querySelector('.acc-chevron').parentElement.addEventListener('click', (e) => {
            e.stopPropagation();
            header.classList.toggle('open');
            content.classList.toggle('show');
        });
        header.querySelector('.acc-label').addEventListener('click', (e) => {
            e.stopPropagation();
            header.classList.toggle('open');
            content.classList.toggle('show');
        });

        // Select order button
        header.querySelector('.acc-select-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            selectFilterOrder(order.code, orderLabel);
        });

        // Batch items
        const displayBatches = keyword ? matchingBatches : orderBatches;
        displayBatches.forEach(batch => {
            const bDiv = document.createElement('div');
            bDiv.className = 'batch-item' + (filterBatchCode === batch.code ? ' selected' : '');
            bDiv.textContent = `${batch.code} - ${batch.name}`;
            bDiv.onclick = (e) => {
                e.stopPropagation();
                selectFilterBatch(order.code, batch.code, `${batch.code} - ${batch.name}`);
            };
            content.appendChild(bDiv);
        });

        accItem.appendChild(header);
        accItem.appendChild(content);
        list.appendChild(accItem);
    });
}

function selectFilterAll() {
    filterOrderCode = null;
    filterBatchCode = null;
    document.getElementById('selected-batch-text').textContent = 'Tất cả Đơn hàng & Lô';
    closeBatchFilterDropdown();
    filterPallets();
}

function selectFilterOrder(orderCode, label) {
    filterOrderCode = orderCode;
    filterBatchCode = null;
    document.getElementById('selected-batch-text').textContent = label;
    closeBatchFilterDropdown();
    filterPallets();
}

function selectFilterBatch(orderCode, batchCode, label) {
    filterOrderCode = orderCode;
    filterBatchCode = batchCode;
    document.getElementById('selected-batch-text').textContent = label;
    closeBatchFilterDropdown();
    filterPallets();
}

// ============================================================
//  STATUS / EXCEL TOGGLES
// ============================================================
function toggleStatusDropdown() {
    document.getElementById('status-options-list').classList.toggle('show');
}

function toggleExcelDropdown() {
    document.getElementById('excel-options').classList.toggle('show');
}

// ============================================================
//  TABLE RENDER
// ============================================================
function renderTable() {
    const tbody = document.getElementById('pallet-table-body');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end   = Math.min(start + ITEMS_PER_PAGE, filteredPallets.length);
    const items = filteredPallets.slice(start, end);

    if (items.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="8">
            <div class="empty-state">
                <i class="fa-solid fa-box-open"></i>
                <p>Không có vật chứa nào phù hợp</p>
            </div>
        </td>`;
        tbody.appendChild(tr);
    } else {
        items.forEach((p, idx) => {
            const order = orders.find(o => o.code === p.orderCode);
            const batch = batches.find(b => b.code === p.batchCode);
            const isNew = p.status === 'mới tạo';

            const dims = [p.length, p.width, p.height].every(v => !v || v === 0)
                ? '—'
                : `${p.length||0}×${p.width||0}×${p.height||0}`;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" value="${p.id}"></td>
                <td style="color:var(--text-muted);">${start + idx + 1}</td>
                <td style="font-weight:600;color:var(--primary);">${p.code}</td>
                <td style="font-family:monospace;font-size:12px;">${dims}</td>
                <td title="${order ? order.name : ''}">${order ? `<span style="font-weight:600">${order.code}</span> - ${order.name}` : '<span style="color:var(--text-muted)">—</span>'}</td>
                <td title="${batch ? batch.name : ''}">${batch ? `<span style="font-weight:600">${batch.code}</span> - ${batch.name}` : '<span style="color:var(--text-muted)">—</span>'}</td>
                <td><span class="badge ${isNew ? 'badge-new' : 'badge-used'}">${isNew ? 'Mới tạo' : 'Đã sử dụng'}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon edit" onclick="openEditModal(${p.id})" title="Chỉnh sửa" ${!isNew ? 'disabled' : ''}>
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon delete" onclick="showDeleteSinglePopover(${p.id})" title="Xóa" ${!isNew ? 'disabled' : ''}>
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Sync check-all
    document.getElementById('check-all').checked = false;
    renderPagination();
}

// ============================================================
//  PAGINATION
// ============================================================
function renderPagination() {
    const total      = filteredPallets.length;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    document.getElementById('total-items').textContent  = total;
    document.getElementById('range-start').textContent  = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    document.getElementById('range-end').textContent    = Math.min(currentPage * ITEMS_PER_PAGE, total);

    const container = document.getElementById('page-numbers');
    container.innerHTML = '';

    // Smart pagination: always show first, last, current ±1, with ellipsis
    const pages = buildPageArray(currentPage, totalPages);
    pages.forEach(p => {
        if (p === '...') {
            const span = document.createElement('span');
            span.className = 'page-ellipsis';
            span.textContent = '…';
            container.appendChild(span);
        } else {
            const btn = document.createElement('button');
            btn.className = `page-number-btn ${p === currentPage ? 'active' : ''}`;
            btn.textContent = p;
            btn.onclick = () => { currentPage = p; renderTable(); };
            container.appendChild(btn);
        }
    });

    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages || totalPages === 0;
}

function buildPageArray(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, current]);
    if (current > 1) pages.add(current - 1);
    if (current < total) pages.add(current + 1);

    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    let prev = 0;
    sorted.forEach(p => {
        if (p - prev > 1) result.push('...');
        result.push(p);
        prev = p;
    });
    return result;
}

function changePage(delta) {
    const totalPages = Math.ceil(filteredPallets.length / ITEMS_PER_PAGE);
    const next = currentPage + delta;
    if (next >= 1 && next <= totalPages) {
        currentPage = next;
        renderTable();
    }
}

function toggleAllPallets(source) {
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = source.checked);
}

// ============================================================
//  BULK ACTIONS
// ============================================================
function bulkPrint() {
    const checked = document.querySelectorAll('.row-checkbox:checked');
    if (checked.length === 0) {
        showToast('Vui lòng chọn ít nhất một pallet để in!', 'warning');
        return;
    }
    showToast(`Đang in ${checked.length} nhãn pallet...`, 'info');
}

function showBulkDeletePopover() {
    const checked = document.querySelectorAll('.row-checkbox:checked');
    if (checked.length === 0) {
        showToast('Vui lòng chọn ít nhất một pallet để xóa!', 'warning');
        return;
    }
    const ids = Array.from(checked).map(cb => parseInt(cb.value));
    const invalid = pallets.filter(p => ids.includes(p.id) && p.status !== 'mới tạo');
    if (invalid.length > 0) {
        showToast(`${invalid.length} pallet đã chọn ở trạng thái "đã sử dụng", không thể xóa!`, 'error');
        return;
    }
    document.getElementById('bulk-delete-message').textContent =
        `Bạn có chắc chắn muốn xóa ${ids.length} pallet đã chọn? Hành động này không thể hoàn tác.`;
    document.getElementById('bulk-delete-popover').classList.add('show');
    document.getElementById('popover-backdrop').classList.add('show');
}

function hideBulkDeletePopover() {
    document.getElementById('bulk-delete-popover').classList.remove('show');
    document.getElementById('popover-backdrop').classList.remove('show');
}

function confirmBulkDelete() {
    const checked = document.querySelectorAll('.row-checkbox:checked');
    const ids = Array.from(checked).map(cb => parseInt(cb.value));
    pallets = pallets.filter(p => !ids.includes(p.id));
    savePallets();
    filterPallets();
    hideBulkDeletePopover();
    document.getElementById('check-all').checked = false;
    showToast(`Đã xóa thành công ${ids.length} pallet.`, 'success');
}

// ============================================================
//  DELETE SINGLE
// ============================================================
function showDeleteSinglePopover(id) {
    pendingDeleteId = id;
    const p = pallets.find(x => x.id === id);
    if (!p) return;
    document.getElementById('delete-single-message').textContent =
        `Bạn có chắc chắn muốn xóa pallet ${p.code}? Hành động này không thể hoàn tác.`;
    document.getElementById('delete-single-popover').classList.add('show');
    document.getElementById('popover-backdrop').classList.add('show');
}

function hideDeleteSinglePopover() {
    pendingDeleteId = null;
    document.getElementById('delete-single-popover').classList.remove('show');
    document.getElementById('popover-backdrop').classList.remove('show');
}

function confirmDeleteSingle() {
    if (!pendingDeleteId) return;
    const p = pallets.find(x => x.id === pendingDeleteId);
    pallets = pallets.filter(x => x.id !== pendingDeleteId);
    savePallets();
    filterPallets();
    hideDeleteSinglePopover();
    showToast(`Đã xóa pallet ${p ? p.code : ''} thành công.`, 'success');
}

function closeAllPopovers() {
    hideDeleteSinglePopover();
    hideBulkDeletePopover();
}

// ============================================================
//  ADD MODAL
// ============================================================
function openAddModal() {
    const modal = document.getElementById('add-pallet-modal');
    modal.classList.add('show');
    switchTab('auto');
    resetAutoForm();
    resetManualForm();
    generatePalletDivs();
}

function closeAddModal() {
    document.getElementById('add-pallet-modal').classList.remove('show');
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.modal-tab').forEach((t, i) => {
        t.classList.toggle('active', (tab === 'auto' && i === 0) || (tab === 'manual' && i === 1));
    });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    document.querySelectorAll('.footer-btns').forEach(f => f.classList.remove('active'));
    document.getElementById(`footer-${tab}`).classList.add('active');
}

function adjustQty(delta) {
    const input = document.getElementById('auto-qty');
    const newVal = Math.max(1, parseInt(input.value || 1) + delta);
    input.value = newVal;
    generatePalletDivs();
}

function adjustManualQty(delta) {
    const input = document.getElementById('manual-qty');
    const newVal = Math.max(1, parseInt(input.value || 1) + delta);
    input.value = newVal;
}

function generatePalletDivs() {
    const qty = parseInt(document.getElementById('auto-qty').value || 0);
    const container = document.getElementById('pallet-visual-container');
    container.innerHTML = '';

    if (!qty || qty <= 0) {
        container.innerHTML = '<div class="visual-placeholder"><i class="fa-solid fa-pallet"></i><span>Nhập số lượng để xem trước</span></div>';
        return;
    }

    const MAX_SHOW = 30;
    const show = Math.min(qty, MAX_SHOW);

    for (let i = 1; i <= show; i++) {
        const box = document.createElement('div');
        box.className = 'pallet-box';
        box.innerHTML = `<i class="fa-solid fa-pallet"></i><span>${i}</span>`;
        box.title = `Pallet #${i}`;
        box.style.animationDelay = `${(i - 1) * 20}ms`;
        container.appendChild(box);
    }

    if (qty > MAX_SHOW) {
        const more = document.createElement('div');
        more.className = 'pallet-count-label';
        more.textContent = `+${qty - MAX_SHOW} pallet nữa`;
        container.appendChild(more);
    }
}

// ---- Order dropdown in auto tab ----
function showOrderDropdownAuto() {
    renderOrderOptionsAuto('');
    document.getElementById('order-dropdown-auto').classList.add('show');
}

function filterOrdersAuto(input) {
    renderOrderOptionsAuto(input.value.toLowerCase());
}

function renderOrderOptionsAuto(kw) {
    const dropdown = document.getElementById('order-dropdown-auto');
    dropdown.innerHTML = '';

    const filtered = orders.filter(o =>
        o.code.toLowerCase().includes(kw) || o.name.toLowerCase().includes(kw)
    );

    if (filtered.length === 0) {
        const d = document.createElement('div');
        d.className = 'select-option no-result';
        d.textContent = 'Không tìm thấy kết quả';
        dropdown.appendChild(d);
        return;
    }

    filtered.forEach(o => {
        const div = document.createElement('div');
        div.className = 'select-option' + (selectedAutoOrder?.code === o.code ? ' selected' : '');
        div.textContent = `${o.code} - ${o.name}`;
        div.onclick = () => selectOrderAuto(o);
        dropdown.appendChild(div);
    });
}

function selectOrderAuto(order) {
    selectedAutoOrder = order;
    const input = document.querySelector('#order-select-auto input');
    input.value = `${order.code} - ${order.name}`;
    document.getElementById('order-dropdown-auto').classList.remove('show');
    document.getElementById('clear-order-auto').style.display = 'flex';

    // Clear batch if it doesn't belong to this order
    if (selectedAutoBatch && selectedAutoBatch.orderCode !== order.code) {
        clearBatchAuto();
    }
}

function clearOrderAuto() {
    selectedAutoOrder = null;
    document.querySelector('#order-select-auto input').value = '';
    document.getElementById('clear-order-auto').style.display = 'none';
}

// ---- Batch dropdown in auto tab ----
function showBatchDropdownAuto() {
    renderBatchOptionsAuto('');
    document.getElementById('batch-dropdown-auto').classList.add('show');
}

function filterBatchesAuto(input) {
    renderBatchOptionsAuto(input.value.toLowerCase());
}

function renderBatchOptionsAuto(kw) {
    const dropdown = document.getElementById('batch-dropdown-auto');
    dropdown.innerHTML = '';

    // If order selected → only show its batches; else show all
    let available = selectedAutoOrder
        ? batches.filter(b => b.orderCode === selectedAutoOrder.code)
        : batches;

    const filtered = available.filter(b =>
        b.code.toLowerCase().includes(kw) || b.name.toLowerCase().includes(kw)
    );

    if (filtered.length === 0) {
        const d = document.createElement('div');
        d.className = 'select-option no-result';
        d.textContent = selectedAutoOrder ? 'Không có lô nào trong đơn hàng này' : 'Không tìm thấy kết quả';
        dropdown.appendChild(d);
        return;
    }

    filtered.forEach(b => {
        const div = document.createElement('div');
        div.className = 'select-option' + (selectedAutoBatch?.code === b.code ? ' selected' : '');
        div.textContent = `${b.code} - ${b.name}`;
        div.onclick = () => selectBatchAuto(b);
        dropdown.appendChild(div);
    });
}

function selectBatchAuto(batch) {
    selectedAutoBatch = batch;
    document.querySelector('#batch-select-auto input').value = `${batch.code} - ${batch.name}`;
    document.getElementById('batch-dropdown-auto').classList.remove('show');
    document.getElementById('clear-batch-auto').style.display = 'flex';

    // If no order selected yet, auto-set the order
    if (!selectedAutoOrder) {
        const order = orders.find(o => o.code === batch.orderCode);
        if (order) selectOrderAuto(order);
    }
}

function clearBatchAuto() {
    selectedAutoBatch = null;
    document.querySelector('#batch-select-auto input').value = '';
    document.getElementById('clear-batch-auto').style.display = 'none';
}

// ---- Type dropdown in manual tab ----
function showTypeDropdownManual() {
    renderTypeOptionsManual('');
    document.getElementById('type-dropdown-manual').classList.add('show');
}

function filterTypesManual(input) {
    renderTypeOptionsManual(input.value.toLowerCase());
}

function renderTypeOptionsManual(kw) {
    const dropdown = document.getElementById('type-dropdown-manual');
    dropdown.innerHTML = '';
    const filtered = containerTypes.filter(t =>
        t.code.toLowerCase().includes(kw) || t.name.toLowerCase().includes(kw)
    );
    if (filtered.length === 0) {
        const d = document.createElement('div');
        d.className = 'select-option no-result';
        d.textContent = 'Không tìm thấy kết quả';
        dropdown.appendChild(d);
        return;
    }
    filtered.forEach(t => {
        const div = document.createElement('div');
        div.className = 'select-option' + (selectedTypeManual?.code === t.code ? ' selected' : '');
        div.textContent = `${t.code} - ${t.name}`;
        div.onclick = () => {
            selectedTypeManual = t;
            document.querySelector('#type-select-manual input').value = `${t.code} - ${t.name}`;
            dropdown.classList.remove('show');
        };
        dropdown.appendChild(div);
    });
}

// ============================================================
//  RESET FORMS
// ============================================================
function resetAutoForm() {
    document.getElementById('auto-qty').value = 1;
    document.getElementById('auto-length').value = '';
    document.getElementById('auto-width').value  = '';
    document.getElementById('auto-height').value = '';
    document.querySelector('#order-select-auto input').value = '';
    document.querySelector('#batch-select-auto input').value = '';
    document.getElementById('clear-order-auto').style.display = 'none';
    document.getElementById('clear-batch-auto').style.display = 'none';
    selectedAutoOrder = null;
    selectedAutoBatch = null;
    generatePalletDivs();
}

function resetManualForm() {
    document.getElementById('manual-code').value = '';
    document.getElementById('manual-qty').value  = 1;
    document.getElementById('manual-length').value = '';
    document.getElementById('manual-width').value  = '';
    document.getElementById('manual-height').value = '';
    document.querySelector('#type-select-manual input').value = '';
    selectedTypeManual = null;
}

// ============================================================
//  CREATE PALLETS
// ============================================================
function createPallets(mode, printAfter = false) {
    if (mode === 'auto') {
        if (!selectedAutoBatch) {
            showToast('Vui lòng chọn lô hàng!', 'error'); return;
        }
        const qty = parseInt(document.getElementById('auto-qty').value || 0);
        if (qty <= 0) {
            showToast('Số lượng phải lớn hơn 0!', 'error'); return;
        }

        const l = parseInt(document.getElementById('auto-length').value) || 0;
        const w = parseInt(document.getElementById('auto-width').value)  || 0;
        const h = parseInt(document.getElementById('auto-height').value) || 0;

        for (let i = 0; i < qty; i++) {
            const nextId = pallets.length > 0 ? Math.max(...pallets.map(p => p.id)) + 1 : 1;
            pallets.unshift({
                id: nextId,
                code: `PAL-${String(nextId).padStart(4, '0')}`,
                length: l, width: w, height: h,
                orderCode: selectedAutoOrder ? selectedAutoOrder.code : (selectedAutoBatch.orderCode || ''),
                batchCode: selectedAutoBatch.code,
                status: 'mới tạo',
                createdAt: new Date().toISOString()
            });
        }

        showToast(`Đã tạo thành công ${qty} pallet mới!`, 'success');
        if (printAfter) showToast('Đang tiến hành in danh sách pallet...', 'info');

    } else {
        const code = (document.getElementById('manual-code').value || '').trim();
        if (!code) { showToast('Vui lòng nhập mã vật chứa!', 'error'); return; }
        if (!selectedTypeManual) { showToast('Vui lòng chọn loại vật chứa!', 'error'); return; }

        const qty = parseInt(document.getElementById('manual-qty').value || 1);
        if (qty <= 0) { showToast('Số lượng phải lớn hơn 0!', 'error'); return; }

        const l = parseInt(document.getElementById('manual-length').value) || 0;
        const w = parseInt(document.getElementById('manual-width').value)  || 0;
        const h = parseInt(document.getElementById('manual-height').value) || 0;

        for (let i = 0; i < qty; i++) {
            const palletCode = qty > 1 ? `${code}-${i + 1}` : code;
            if (pallets.some(p => p.code === palletCode)) {
                showToast(`Mã ${palletCode} đã tồn tại!`, 'error'); return;
            }
            const nextId = pallets.length > 0 ? Math.max(...pallets.map(p => p.id)) + 1 : 1;
            pallets.unshift({
                id: nextId,
                code: palletCode,
                length: l, width: w, height: h,
                orderCode: '', batchCode: '',
                status: 'mới tạo',
                createdAt: new Date().toISOString()
            });
        }
        showToast(`Đã tạo thành công ${qty} vật chứa!`, 'success');
    }

    savePallets();
    closeAddModal();
    filterPallets();
}

// ============================================================
//  EDIT MODAL
// ============================================================
function openEditModal(id) {
    const p = pallets.find(x => x.id === id);
    if (!p || p.status !== 'mới tạo') return;

    editingPalletId = id;
    document.getElementById('edit-pallet-id').value   = id;
    document.getElementById('edit-pallet-code').value = p.code;
    document.getElementById('edit-length').value = p.length || '';
    document.getElementById('edit-width').value  = p.width  || '';
    document.getElementById('edit-height').value = p.height || '';

    // Init order
    const order = orders.find(o => o.code === p.orderCode);
    selectedEditOrder = order || null;
    const orderInput = document.querySelector('#order-select-edit input');
    orderInput.value = order ? `${order.code} - ${order.name}` : '';
    document.getElementById('clear-order-edit').style.display = order ? 'flex' : 'none';

    // Init batch
    const batch = batches.find(b => b.code === p.batchCode);
    selectedEditBatch = batch || null;
    const batchInput = document.querySelector('#batch-select-edit input');
    batchInput.value = batch ? `${batch.code} - ${batch.name}` : '';
    document.getElementById('clear-batch-edit').style.display = batch ? 'flex' : 'none';

    document.getElementById('edit-pallet-modal').classList.add('show');
}

function closeEditModal() {
    editingPalletId   = null;
    selectedEditOrder = null;
    selectedEditBatch = null;
    document.getElementById('edit-pallet-modal').classList.remove('show');
}

function saveEditPallet() {
    if (!editingPalletId) return;
    if (!selectedEditBatch) {
        showToast('Vui lòng chọn lô hàng!', 'error'); return;
    }

    const idx = pallets.findIndex(p => p.id === editingPalletId);
    if (idx === -1) return;

    pallets[idx].length     = parseInt(document.getElementById('edit-length').value) || 0;
    pallets[idx].width      = parseInt(document.getElementById('edit-width').value)  || 0;
    pallets[idx].height     = parseInt(document.getElementById('edit-height').value) || 0;
    pallets[idx].orderCode  = selectedEditOrder ? selectedEditOrder.code : (selectedEditBatch.orderCode || '');
    pallets[idx].batchCode  = selectedEditBatch.code;

    savePallets();
    filterPallets();
    closeEditModal();
    showToast(`Đã cập nhật pallet ${pallets[idx]?.code || ''} thành công!`, 'success');
}

// Edit modal – order dropdown
function showOrderDropdownEdit() {
    renderOrderOptionsEdit('');
    document.getElementById('order-dropdown-edit').classList.add('show');
}

function filterOrdersEdit(input) {
    renderOrderOptionsEdit(input.value.toLowerCase());
}

function renderOrderOptionsEdit(kw) {
    const dropdown = document.getElementById('order-dropdown-edit');
    dropdown.innerHTML = '';
    const filtered = orders.filter(o =>
        o.code.toLowerCase().includes(kw) || o.name.toLowerCase().includes(kw)
    );
    if (!filtered.length) {
        const d = document.createElement('div');
        d.className = 'select-option no-result';
        d.textContent = 'Không tìm thấy kết quả';
        dropdown.appendChild(d);
        return;
    }
    filtered.forEach(o => {
        const div = document.createElement('div');
        div.className = 'select-option' + (selectedEditOrder?.code === o.code ? ' selected' : '');
        div.textContent = `${o.code} - ${o.name}`;
        div.onclick = () => selectOrderEdit(o);
        dropdown.appendChild(div);
    });
}

function selectOrderEdit(order) {
    selectedEditOrder = order;
    document.querySelector('#order-select-edit input').value = `${order.code} - ${order.name}`;
    document.getElementById('order-dropdown-edit').classList.remove('show');
    document.getElementById('clear-order-edit').style.display = 'flex';
    if (selectedEditBatch && selectedEditBatch.orderCode !== order.code) clearBatchEdit();
}

function clearOrderEdit() {
    selectedEditOrder = null;
    document.querySelector('#order-select-edit input').value = '';
    document.getElementById('clear-order-edit').style.display = 'none';
}

// Edit modal – batch dropdown
function showBatchDropdownEdit() {
    renderBatchOptionsEdit('');
    document.getElementById('batch-dropdown-edit').classList.add('show');
}

function filterBatchesEdit(input) {
    renderBatchOptionsEdit(input.value.toLowerCase());
}

function renderBatchOptionsEdit(kw) {
    const dropdown = document.getElementById('batch-dropdown-edit');
    dropdown.innerHTML = '';
    let available = selectedEditOrder
        ? batches.filter(b => b.orderCode === selectedEditOrder.code)
        : batches;
    const filtered = available.filter(b =>
        b.code.toLowerCase().includes(kw) || b.name.toLowerCase().includes(kw)
    );
    if (!filtered.length) {
        const d = document.createElement('div');
        d.className = 'select-option no-result';
        d.textContent = 'Không tìm thấy kết quả';
        dropdown.appendChild(d);
        return;
    }
    filtered.forEach(b => {
        const div = document.createElement('div');
        div.className = 'select-option' + (selectedEditBatch?.code === b.code ? ' selected' : '');
        div.textContent = `${b.code} - ${b.name}`;
        div.onclick = () => {
            selectedEditBatch = b;
            document.querySelector('#batch-select-edit input').value = `${b.code} - ${b.name}`;
            dropdown.classList.remove('show');
            document.getElementById('clear-batch-edit').style.display = 'flex';
            if (!selectedEditOrder) {
                const o = orders.find(x => x.code === b.orderCode);
                if (o) selectOrderEdit(o);
            }
        };
        dropdown.appendChild(div);
    });
}

function clearBatchEdit() {
    selectedEditBatch = null;
    document.querySelector('#batch-select-edit input').value = '';
    document.getElementById('clear-batch-edit').style.display = 'none';
}

// ============================================================
//  UTILS
// ============================================================
function showToast(message, type = 'success') {
    if (window.parent && typeof window.parent.showToast === 'function') {
        window.parent.showToast(message, type);
    } else if (typeof window.showToast === 'function' && window.showToast !== arguments.callee) {
        window.showToast(message, type);
    } else {
        // Fallback inline toast
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
            document.body.appendChild(container);
        }
        const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#0ea5e9' };
        const icons  = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
        const toast = document.createElement('div');
        toast.style.cssText = `
            background:white;border:1px solid #e2e8f0;border-left:4px solid ${colors[type] || colors.info};
            border-radius:8px;padding:12px 16px;box-shadow:0 4px 12px rgba(0,0,0,0.15);
            display:flex;align-items:center;gap:10px;font-size:13px;max-width:320px;
            animation:slideInRight 0.3s ease-out;
        `;
        toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}" style="color:${colors[type]};font-size:16px;flex-shrink:0;"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
    }
}

function importExcel() { showToast('Tính năng Nhập Excel sẽ sớm ra mắt!', 'info'); }
function exportExcel() { showToast('Đang xuất dữ liệu ra file Excel...', 'success'); }