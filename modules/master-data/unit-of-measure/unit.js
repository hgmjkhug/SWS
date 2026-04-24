// Mock Data - Units of Measure
var units = [
    { id: 1, code: 'KG', name: 'Kilogram', note: 'Đơn vị đo khối lượng theo chuẩn quốc tế', status: true },
    { id: 2, code: 'M', name: 'Mét', note: 'Đơn vị đo chiều dài', status: true },
    { id: 3, code: 'PCS', name: 'Cái', note: 'Đơn vị đếm số lượng', status: true },
    { id: 4, code: 'BOX', name: 'Hộp', note: 'Đóng gói theo hộp', status: true },
    { id: 5, code: 'SET', name: 'Bộ', note: 'Tập hợp nhiều chi tiết', status: true },
    { id: 6, code: 'L', name: 'Lít', note: 'Đơn vị đo thể tích', status: true },
    { id: 7, code: 'ROLL', name: 'Cuộn', note: 'Dùng cho màng quấn, băng keo', status: true },
    { id: 8, code: 'BAG', name: 'Bao', note: 'Đóng gói bao tải', status: true },
    { id: 9, code: 'CAN', name: 'Thùng', note: 'Đóng gói thùng carton', status: true },
    { id: 10, code: 'SHEET', name: 'Tấm', note: 'Dùng cho kim loại tấm', status: true },
    { id: 11, code: 'PAIR', name: 'Đôi', note: 'Dùng cho găng tay, giày', status: true },
    { id: 12, code: 'PACK', name: 'Gói', note: 'Đóng gói nhỏ', status: false }
];

var filteredData = [...units];
var currentPage = 1;
var currentPage = 1;
const ITEMS_PER_PAGE = 20;
var pendingDeleteUnitIds = [];

function getCurrentWarehouse() {
    try {
        if (window.parent && window.parent.document) {
            const companyEl = window.parent.document.querySelector('.user-company');
            if (companyEl) return companyEl.innerText.trim();
            const headerTitles = window.parent.document.querySelectorAll('.header-title, .company-name');
            for (let el of headerTitles) {
                if (el.innerText && el.innerText.includes('CÔNG TY')) return el.innerText.trim();
            }
        }
    } catch (e) { }
    return localStorage.getItem('current_warehouse_name') || "CÔNG TY TNHH TỔ HỢP CƠ KHÍ THACO (TOMC)";
}

// Init
function initUnitModule() {
    renderUnits();
}

// Render Table
function renderUnits() {
    const tbody = document.getElementById('unit-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = filteredData.slice(start, end);

    updatePagination();

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px; color: #64748b;">Không tìm thấy dữ liệu</td></tr>';
        return;
    }

    pageData.forEach((item, idx) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td><input type="checkbox" class="unit-check" value="${item.id}" onchange="checkSelection()"></td>
            <td>${start + idx + 1}</td>
            <td><div style="font-weight: 500; color: #0f172a;">${item.name}</div></td>
            <td><div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.note || ''}">${item.note || '-'}</div></td>
            <td>
                <div style="display: flex; gap: 4px; justify-content: center;">
                    <div class="action-icon" title="Sửa" onclick="openUnitModal(${item.id})"><i class="fas fa-edit"></i></div>
                    <div class="action-icon delete" title="Xóa" onclick="deleteUnit(${item.id})"><i class="fas fa-trash"></i></div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Pagination Logic
function updatePagination() {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    const infoEl = document.getElementById('pagination-info');
    if (infoEl) infoEl.innerText = `Hiển thị ${start} - ${end} trong ${totalItems}`;

    const pageNumbersDiv = document.getElementById('page-numbers');
    if (pageNumbersDiv) {
        pageNumbersDiv.innerHTML = '';
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
            btn.innerText = i;
            btn.onclick = () => { currentPage = i; renderUnits(); };
            pageNumbersDiv.appendChild(btn);
        }
    }

    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    const gotoInput = document.getElementById('goto-page');
    if (gotoInput) {
        gotoInput.max = totalPages;
        gotoInput.value = '';
    }
}

function prevPage() {
    if (currentPage > 1) { currentPage--; renderUnits(); }
}

function nextPage() {
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) { currentPage++; renderUnits(); }
}

function gotoPage(page) {
    const p = parseInt(page);
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    if (p >= 1 && p <= totalPages) {
        currentPage = p;
        renderUnits();
    }
}

// Filter
function filterUnits() {
    const search = document.getElementById('unit-search').value.toLowerCase();

    filteredData = units.filter(u => {
        return u.code.toLowerCase().includes(search) || u.name.toLowerCase().includes(search);
    });

    currentPage = 1;
    renderUnits();
}

// Modal Functions
function openUnitModal(id = null) {
    const modal = document.getElementById('unit-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('unit-form');
    form.reset();
    document.getElementById('unit-id').value = '';

    if (id) {
        const item = units.find(u => u.id === id);
        if (item) {
            title.innerText = 'Cập nhật đơn vị tính';
            document.getElementById('unit-id').value = item.id;
            document.getElementById('unit-name').value = item.name;
            document.getElementById('unit-note').value = item.note || '';
        }
    } else {
        title.innerText = 'Thêm mới đơn vị tính';
    }
    modal.classList.add('show');
}

function closeUnitModal() {
    const modal = document.getElementById('unit-modal');
    if (modal) modal.classList.remove('show');
}

function saveUnit() {
    const idStr = document.getElementById('unit-id').value;
    const name = document.getElementById('unit-name').value;
    const note = document.getElementById('unit-note').value;

    if (!name) {
        showToast('Vui lòng nhập Tên đơn vị tính', 'error');
        return;
    }

    let code = `DV${Math.floor(Math.random() * 1000)}`;

    if (idStr) {
        const id = parseInt(idStr);
        const idx = units.findIndex(u => u.id === id);
        if (idx !== -1) {
            units[idx] = { ...units[idx], name, note, status: true };
        }
    } else {
        const newId = units.length > 0 ? Math.max(...units.map(u => u.id)) + 1 : 1;
        units.unshift({
            id: newId,
            code,
            name,
            note,
            status: true
        });
    }

    closeUnitModal();
    filterUnits();
    showToast('Lưu thành công!');
}

function deleteUnit(id) {
    pendingDeleteUnitIds = [id];
    const unit = units.find(u => u.id === id);
    const msgEl = document.getElementById('confirm-delete-message');
    if (msgEl) {
        msgEl.innerHTML = `Bạn có chắc chắn muốn xóa đơn vị tính <strong>${unit?.name}</strong> không?<br />Hành động này không thể hoàn tác.`;
    }
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.add('show');
}

function closeDeleteConfirm() {
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.remove('show');
    pendingDeleteUnitIds = [];
}

function confirmDeleteUnit() {
    if (pendingDeleteUnitIds.length > 0) {
        units = units.filter(u => !pendingDeleteUnitIds.includes(u.id));
        document.getElementById('check-all').checked = false;
        filterUnits();
        showToast(`Đã xóa ${pendingDeleteUnitIds.length} đơn vị tính!`);
        closeDeleteConfirm();
    }
}

// Global Exports for HTML access
window.deleteUnit = deleteUnit;
window.closeDeleteConfirm = closeDeleteConfirm;
window.confirmDeleteUnit = confirmDeleteUnit;

// Bulk Actions
function toggleAll(source) {
    document.querySelectorAll('.unit-check').forEach(chk => chk.checked = source.checked);
    checkSelection();
}

function checkSelection() {
    const selected = document.querySelectorAll('.unit-check:checked');
    const btn = document.getElementById('delete-selected-btn');
    if (btn) {
        btn.disabled = selected.length === 0;
        btn.innerHTML = `<i class="fas fa-trash"></i> (${selected.length})`;
    }
}

function deleteSelected() {
    const selected = Array.from(document.querySelectorAll('.unit-check:checked')).map(chk => parseInt(chk.value));
    if (selected.length === 0) return;

    pendingDeleteUnitIds = selected;
    const msgEl = document.getElementById('confirm-delete-message');
    if (msgEl) {
        msgEl.innerHTML = `Bạn có chắc chắn muốn xóa <strong>${selected.length}</strong> đơn vị tính đã chọn không?<br />Hành động này không thể hoàn tác.`;
    }
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.add('show');
}

// ========== EXPORT / SYNC ==========
window.exportExcel = function() {
    showToast('Đang trích xuất dữ liệu ra file Excel...', 'info');
    setTimeout(() => {
        showToast('Xuất file Excel thành công!');
    }, 1000);
};

window.importExcel = function() {
    showToast('Tính năng nhập Excel đang được khởi tạo...', 'info');
};

window.syncData = function() {
    showToast('Đang kết nối hệ thống...', 'info');
    setTimeout(() => {
        showToast('Đồng bộ thông tin mới nhất thành công', 'success');
    }, 1000);
};

function showToast(msg, type = 'success') {
    if (window.showToast) {
        window.showToast(msg, type);
    } else if (window.parent && window.parent.showToast) {
        window.parent.showToast(msg, type);
    } else {
        console.log(`[Toast ${type}] ${msg}`);
    }
}



// Run Init
initUnitModule();
