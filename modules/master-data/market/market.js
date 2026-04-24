var markets = [
    { id: 1, code: 'CN', name: 'Trung Quốc' },
    { id: 2, code: 'JP', name: 'Nhật Bản' }
];

var filteredMarkets = [...markets];
var currentPage = 1;
const ITEMS_PER_PAGE = 20;
var pendingDeleteIds = [];

function initMarketModule() {
    renderMarkets();
}

function renderMarkets() {
    const tbody = document.getElementById('market-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = filteredMarkets.slice(start, end);

    updatePagination();

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: #64748b;">Không tìm thấy dữ liệu</td></tr>';
        return;
    }

    pageData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="market-check" value="${item.id}" onchange="checkSelection()"></td>
            <td>${start + idx + 1}</td>
            <td style="font-weight: 500; color: #1e40af;">${item.code}</td>
            <td style="font-weight: 500">${item.name}</td>
            <td>
                <div style="display: flex; gap: 4px; justify-content: center;">
                    <div class="action-icon" title="Sửa" onclick="openMarketModal(${item.id})"><i class="fas fa-edit"></i></div>
                    <div class="action-icon delete" title="Xóa" onclick="deleteMarket(${item.id})"><i class="fas fa-trash"></i></div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updatePagination() {
    const totalItems = filteredMarkets.length;
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
            btn.onclick = () => { currentPage = i; renderMarkets(); };
            pageNumbersDiv.appendChild(btn);
        }
    }

    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages || totalPages === 0;
}

function prevPage() {
    if (currentPage > 1) { currentPage--; renderMarkets(); }
}

function nextPage() {
    const totalItems = filteredMarkets.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (currentPage < totalPages) { currentPage++; renderMarkets(); }
}

function filterMarkets() {
    const search = document.getElementById('market-search').value.toLowerCase();
    filteredMarkets = markets.filter(m => 
        m.code.toLowerCase().includes(search) || m.name.toLowerCase().includes(search)
    );
    currentPage = 1;
    renderMarkets();
}

function openMarketModal(id = null) {
    const modal = document.getElementById('market-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('market-form');
    form.reset();
    document.getElementById('market-id').value = '';

    if (id) {
        const item = markets.find(m => m.id === id);
        if (item) {
            title.innerText = 'Cập nhật thị trường';
            document.getElementById('market-id').value = item.id;
            document.getElementById('market-code').value = item.code;
            document.getElementById('market-name').value = item.name;
        }
    } else {
        title.innerText = 'Thêm mới thị trường';
    }
    modal.classList.add('show');
}

function closeMarketModal() {
    document.getElementById('market-modal').classList.remove('show');
}

function saveMarket() {
    const idStr = document.getElementById('market-id').value;
    const code = document.getElementById('market-code').value;
    const name = document.getElementById('market-name').value;

    if (!code || !name) {
        showToast('Vui lòng nhập đầy đủ mã và tên thị trường', 'error');
        return;
    }

    if (idStr) {
        const id = parseInt(idStr);
        const idx = markets.findIndex(m => m.id === id);
        if (idx !== -1) markets[idx] = { id, code, name };
    } else {
        const newId = markets.length > 0 ? Math.max(...markets.map(m => m.id)) + 1 : 1;
        markets.unshift({ id: newId, code, name });
    }

    closeMarketModal();
    filterMarkets();
    showToast('Lưu thành công!');
}

function deleteMarket(id) {
    pendingDeleteIds = [id];
    const item = markets.find(m => m.id === id);
    document.getElementById('confirm-delete-message').innerHTML = `Bạn có chắc chắn muốn xóa thị trường <strong>${item?.name}</strong>?`;
    document.getElementById('delete-confirm-modal').classList.add('show');
}

function closeDeleteConfirm() {
    document.getElementById('delete-confirm-modal').classList.remove('show');
    pendingDeleteIds = [];
}

function confirmDeleteMarket() {
    markets = markets.filter(m => !pendingDeleteIds.includes(m.id));
    filterMarkets();
    showToast('Đã xóa thị trường!');
    closeDeleteConfirm();
    document.getElementById('check-all').checked = false;
    checkSelection();
}

function toggleAll(source) {
    document.querySelectorAll('.market-check').forEach(chk => chk.checked = source.checked);
    checkSelection();
}

function checkSelection() {
    const selected = document.querySelectorAll('.market-check:checked');
    const btn = document.getElementById('delete-selected-btn');
    btn.disabled = selected.length === 0;
    btn.innerHTML = `<i class="fas fa-trash"></i> (${selected.length})`;
}

function deleteSelected() {
    const selected = Array.from(document.querySelectorAll('.customer-check:checked')).map(chk => parseInt(chk.value));
    pendingDeleteIds = selected;
    document.getElementById('confirm-delete-message').innerHTML = `Bạn có chắc chắn muốn xóa <strong>${selected.length}</strong> thị trường đã chọn?`;
    document.getElementById('delete-confirm-modal').classList.add('show');
}

function showToast(msg, type = 'success') {
    if (window.parent && window.parent.showToast) {
        window.parent.showToast(msg, type);
    } else {
        console.log(`[Toast ${type}] ${msg}`);
    }
}

initMarketModule();
