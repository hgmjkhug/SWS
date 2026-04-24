var customers = [
    { id: 1, code: 'CUST001', name: 'Công ty TNHH Thép Việt', market: 'Trung Quốc', desc: 'Khách hàng chiến lược' },
    { id: 2, code: 'CUST002', name: 'Tập đoàn ABC', market: 'Nhật Bản', desc: 'Cung cấp linh kiện' },
    { id: 3, code: 'CUST003', name: 'Hợp tác xã X', market: 'Trung Quốc', desc: 'Đơn hàng nhỏ' },
    { id: 4, code: 'CUST004', name: 'Sojitz Corporation', market: 'Nhật Bản', desc: 'Đối tác Nhật Bản' }
];

var filteredCustomers = [...customers];
var currentPage = 1;
const ITEMS_PER_PAGE = 20; 
var pendingDeleteIds = [];

function initCustomerModule() {
    renderCustomers();
}

function renderCustomers() {
    const tbody = document.getElementById('customer-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = filteredCustomers.slice(start, end);

    updatePagination();

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px; color: #64748b;">Không tìm thấy dữ liệu</td></tr>';
        return;
    }

    pageData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="customer-check" value="${item.id}" onchange="checkSelection()"></td>
            <td>${start + idx + 1}</td>
            <td style="font-weight: 500; color: #1e40af;">${item.code}</td>
            <td style="font-weight: 500">${item.name}</td>
            <td>${item.market}</td>
            <td><div style="overflow: hidden; text-overflow: ellipsis;" title="${item.desc}">${item.desc || '-'}</div></td>
            <td>
                <div style="display: flex; gap: 4px; justify-content: center;">
                    <div class="action-icon" title="Sửa" onclick="openCustomerModal(${item.id})"><i class="fas fa-edit"></i></div>
                    <div class="action-icon delete" title="Xóa" onclick="deleteCustomer(${item.id})"><i class="fas fa-trash"></i></div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updatePagination() {
    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const infoEl = document.getElementById('pagination-info');
    if (infoEl) {
        const start = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
        infoEl.innerText = `Hiển thị ${start} - ${end} trong ${totalItems}`;
    }

    const pageNumbersDiv = document.getElementById('page-numbers');
    if (pageNumbersDiv) {
        pageNumbersDiv.innerHTML = '';
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

        for (let i = startPage; i <= endPage; i++) {
            if (i < 1) continue;
            const btn = document.createElement('button');
            btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
            btn.innerText = i;
            btn.onclick = () => { currentPage = i; renderCustomers(); };
            pageNumbersDiv.appendChild(btn);
        }
    }

    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages || totalPages === 0;
}

function prevPage() {
    if (currentPage > 1) { currentPage--; renderCustomers(); }
}

function nextPage() {
    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (currentPage < totalPages) { currentPage++; renderCustomers(); }
}

// Custom Dropdown Logic
window.toggleMarketDropdown = function() {
    const marketDropdown = document.getElementById('market-dropdown');
    const menu = document.getElementById('market-filter-menu');
    const isOpen = marketDropdown.classList.contains('open');
    
    // Close other dropdowns
    document.querySelectorAll('.custom-dropdown').forEach(d => {
        if (d !== marketDropdown) d.classList.remove('open');
    });
    document.querySelectorAll('.custom-dropdown-menu').forEach(m => {
        if (m !== menu) m.classList.remove('show');
    });
    
    if (!isOpen) {
        marketDropdown.classList.add('open');
        menu.classList.add('show');
    } else {
        marketDropdown.classList.remove('open');
        menu.classList.remove('show');
    }
};

window.selectMarket = function(value, label) {
    document.getElementById('market-filter').value = value;
    document.getElementById('market-filter-display').innerText = label;
    
    const menu = document.getElementById('market-filter-menu');
    menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
        if (item.innerText === label) item.classList.add('selected');
        else item.classList.remove('selected');
    });
    
    menu.classList.remove('show');
    document.getElementById('market-dropdown').classList.remove('open');
    filterCustomers();
};

window.toggleModalMarketDropdown = function() {
    const dropdown = document.getElementById('modal-market-dropdown');
    const menu = document.getElementById('modal-market-menu');
    const isOpen = dropdown.classList.contains('open');
    
    document.querySelectorAll('.custom-dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
    });
    document.querySelectorAll('.custom-dropdown-menu').forEach(m => {
        if (m !== menu) m.classList.remove('show');
    });

    if (!isOpen) {
        dropdown.classList.add('open');
        menu.classList.add('show');
    } else {
        dropdown.classList.remove('open');
        menu.classList.remove('show');
    }
};

window.selectModalMarket = function(value, label) {
    document.getElementById('customer-market').value = value;
    document.getElementById('modal-market-display').innerText = label;
    
    const menu = document.getElementById('modal-market-menu');
    menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
        if (item.innerText === label) item.classList.add('selected');
        else item.classList.remove('selected');
    });
    
    menu.classList.remove('show');
    document.getElementById('modal-market-dropdown').classList.remove('open');
};

window.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
    }
});

function filterCustomers() {
    const search = document.getElementById('customer-search').value.toLowerCase();
    const market = document.getElementById('market-filter').value;
    
    filteredCustomers = customers.filter(c => {
        const matchSearch = c.code.toLowerCase().includes(search) || c.name.toLowerCase().includes(search);
        const matchMarket = market === '' || c.market === market;
        return matchSearch && matchMarket;
    });
    
    currentPage = 1;
    renderCustomers();
}

function openCustomerModal(id = null) {
    const modal = document.getElementById('customer-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('customer-form');
    form.reset();
    document.getElementById('customer-id').value = '';

    if (id) {
        const item = customers.find(c => c.id === id);
        if (item) {
            title.innerText = 'Cập nhật khách hàng';
            document.getElementById('customer-id').value = item.id;
            document.getElementById('customer-code').value = item.code;
            document.getElementById('customer-name').value = item.name;
            // Set Modal Dropdown Value
            document.getElementById('customer-market').value = item.market;
            document.getElementById('modal-market-display').innerText = item.market;
            document.getElementById('customer-desc').value = item.desc || '';
        }
    } else {
        title.innerText = 'Thêm mới khách hàng';
        document.getElementById('modal-market-display').innerText = 'Chọn thị trường';
        document.getElementById('customer-market').value = '';
    }
    modal.classList.add('show');
}

function closeCustomerModal() {
    document.getElementById('customer-modal').classList.remove('show');
}

function saveCustomer() {
    const idStr = document.getElementById('customer-id').value;
    const code = document.getElementById('customer-code').value;
    const name = document.getElementById('customer-name').value;
    const market = document.getElementById('customer-market').value;
    const desc = document.getElementById('customer-desc').value;

    if (!code || !name || !market) {
        showToast('Vui lòng nhập đầy đủ các trường bắt buộc', 'error');
        return;
    }

    if (idStr) {
        const id = parseInt(idStr);
        const idx = customers.findIndex(c => c.id === id);
        if (idx !== -1) customers[idx] = { id, code, name, market, desc };
    } else {
        const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        customers.unshift({ id: newId, code, name, market, desc });
    }

    closeCustomerModal();
    filterCustomers();
    showToast('Lưu thành công!');
}

function deleteCustomer(id) {
    pendingDeleteIds = [id];
    const item = customers.find(c => c.id === id);
    document.getElementById('confirm-delete-message').innerHTML = `Bạn có chắc chắn muốn xóa khách hàng <strong>${item?.name}</strong>?`;
    document.getElementById('delete-confirm-modal').classList.add('show');
}

function closeDeleteConfirm() {
    document.getElementById('delete-confirm-modal').classList.remove('show');
    pendingDeleteIds = [];
}

function confirmDeleteCustomer() {
    customers = customers.filter(c => !pendingDeleteIds.includes(c.id));
    filterCustomers();
    showToast('Đã xóa khách hàng!');
    closeDeleteConfirm();
    document.getElementById('check-all').checked = false;
    checkSelection();
}

function toggleAll(source) {
    document.querySelectorAll('.customer-check').forEach(chk => chk.checked = source.checked);
    checkSelection();
}

function checkSelection() {
    const selected = document.querySelectorAll('.customer-check:checked');
    const btn = document.getElementById('delete-selected-btn');
    btn.disabled = selected.length === 0;
    btn.innerHTML = `<i class="fas fa-trash"></i> (${selected.length})`;
}

function deleteSelected() {
    const selected = Array.from(document.querySelectorAll('.customer-check:checked')).map(chk => parseInt(chk.value));
    pendingDeleteIds = selected;
    document.getElementById('confirm-delete-message').innerHTML = `Bạn có chắc chắn muốn xóa <strong>${selected.length}</strong> khách hàng đã chọn?`;
    document.getElementById('delete-confirm-modal').classList.add('show');
}

function showToast(msg, type = 'success') {
    if (window.parent && window.parent.showToast) {
        window.parent.showToast(msg, type);
    } else {
        console.log(`[Toast ${type}] ${msg}`);
    }
}

initCustomerModule();
