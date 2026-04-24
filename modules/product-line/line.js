(function () {
    const ITEMS_PER_PAGE = 20;
    let products = [];
    let filteredData = [];
    let currentPage = 1;

    // Mock Data
    const mockDataNames = [
        "Chuối Trung Quốc/ Chinese bananas",
        "Chuối Nhật Bản/Japanese bananas",
    ];

    // Initialize Data
    function initData() {
        products = mockDataNames.map((name, index) => ({
            id: Date.now() + index,
            code: `LINE${(index + 1).toString().padStart(3, '0')}`,
            name: name,
            description: `Mô tả cho ${name}`,
            status: index % 5 !== 0, // Mock some inactive ones
            is_deleted: false
        }));
        filteredData = [...products];
    }

    // DOM Elements
    const elements = {
        tableBody: document.getElementById('line-table-body'),
        searchInput: document.getElementById('line-search'),
        paginationInfo: document.getElementById('pagination-info'),
        pageNumbers: document.getElementById('page-numbers'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        bulkDeleteBtn: document.getElementById('bulk-delete-btn'),
        selectedCount: document.getElementById('selected-count'),
        checkAll: document.getElementById('check-all'),
        modal: document.getElementById('line-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalForm: document.getElementById('line-form'),
        confirmModal: document.getElementById('delete-confirm-modal')
    };

    let pendingDeleteId = null;
    let isBulkDelete = false;
    let lineMutationObserver = null;

    // Initialization
    function init() {
        initData();
        renderTable();
    }

    // Render Table
    window.renderTable = function() {
        const tbody = document.getElementById('line-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageData = filteredData.slice(start, end);

        if (pageData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">Không tìm thấy kết quả phù hợp</td></tr>`;
        } else {
            pageData.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input type="checkbox" class="row-checkbox" value="${item.id}" onchange="updateSelection()"></td>
                    <td style="text-align: center;">${start + index + 1}</td>
                    <td style="font-weight: 500; color: #1e293b;">${item.code}</td>
                    <td style="font-weight: 500; color: #076EB8;">${item.name}</td>
                    <td style="color: #64748b;">${item.description || '-'}</td>
                    <td style="text-align: center;">
                        <div style="display: flex; gap: 8px; justify-content: center;">
                            <button class="btn-icon edit" onclick="openModal(${item.id})" title="Chỉnh sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete" onclick="confirmDelete(${item.id})" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        updatePagination();
        updateSelection();
    }

    // Pagination
    function updatePagination() {
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        const start = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
        
        const info = document.getElementById('pagination-info');
        if (info) info.innerText = `Hiển thị ${start} - ${end} trên tổng ${totalItems}`;

        const pageNums = document.getElementById('page-numbers');
        if (pageNums) {
            pageNums.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `page-btn ${i === currentPage ? 'active' : 'btn-secondary'}`;
                btn.innerText = i;
                btn.onclick = () => changePage(i);
                pageNums.appendChild(btn);
            }
        }

        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    window.changePage = function(page) {
        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderTable();
    }

    window.handleGotoPage = function(value) {
        const page = parseInt(value);
        if (page) changePage(page);
    }

    // Search
    window.handleSearch = function() {
        const query = document.getElementById('line-search').value.toLowerCase().trim();
        filteredData = products.filter(p => 
            !p.is_deleted && 
            (p.code.toLowerCase().includes(query) || p.name.toLowerCase().includes(query))
        );
        currentPage = 1;
        renderTable();
    }

    // Selection
    window.toggleSelectAll = function(checkbox) {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = checkbox.checked);
        updateSelection();
    }

    window.updateSelection = function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        const selected = Array.from(checkboxes).filter(cb => cb.checked);
        
        const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
        const selectedCount = document.getElementById('selected-count');
        const checkAll = document.getElementById('check-all');

        if (bulkDeleteBtn) bulkDeleteBtn.disabled = selected.length === 0;
        if (selectedCount) selectedCount.innerText = selected.length;
        if (checkAll) checkAll.checked = selected.length === checkboxes.length && checkboxes.length > 0;
    }



    // Modal
    window.openModal = function(id = null) {
        const modal = document.getElementById('line-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('line-form');
        
        form.reset();
        document.getElementById('line-id').value = '';
        
        if (id) {
            const item = products.find(p => p.id === id);
            if (item) {
                title.innerText = 'Cập nhật dòng sản phẩm';
                document.getElementById('line-id').value = item.id;
                document.getElementById('node-code').value = item.code;
                document.getElementById('node-name').value = item.name;
                document.getElementById('node-description').value = item.description;
            }
        } else {
            title.innerText = 'Thêm mới dòng sản phẩm';
        }
        
        modal.classList.add('show');
    }

    window.closeModal = function() {
        document.getElementById('line-modal').classList.remove('show');
    }

    window.handleSave = function() {
        const id = document.getElementById('line-id').value;
        const code = document.getElementById('node-code').value.trim();
        const name = document.getElementById('node-name').value.trim();
        const description = document.getElementById('node-description').value.trim();

        if (!code || !name) {
            if (typeof showToast === 'function') showToast('Vui lòng nhập đầy đủ thông tin bắt buộc', 'warning');
            else alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
            return;
        }

        if (id) {
            const index = products.findIndex(p => p.id == id);
            if (index !== -1) {
                products[index] = { ...products[index], code, name, description };
                if (typeof showToast === 'function') showToast('Cập nhật thành công', 'success');
            }
        } else {
            const newItem = {
                id: Date.now(),
                code,
                name,
                description,
                is_deleted: false
            };
            products.unshift(newItem);
            if (typeof showToast === 'function') showToast('Thêm mới thành công', 'success');
        }

        closeModal();
        handleSearch();
    }

    // Delete
    window.confirmDelete = function(id) {
        pendingDeleteId = id;
        isBulkDelete = false;
        document.getElementById('confirm-msg').innerText = 'Bạn có chắc chắn muốn xóa dòng sản phẩm này?';
        document.getElementById('delete-confirm-modal').classList.add('show');
    }

    window.handleBulkDelete = function() {
        isBulkDelete = true;
        const selected = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.value);
        document.getElementById('confirm-msg').innerText = `Bạn có chắc chắn muốn xóa ${selected.length} dòng sản phẩm đã chọn?`;
        document.getElementById('delete-confirm-modal').classList.add('show');
    }

    window.closeConfirmModal = function() {
        document.getElementById('delete-confirm-modal').classList.remove('show');
    }

    window.executeDelete = function() {
        if (isBulkDelete) {
            const selectedIds = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => parseInt(cb.value));
            products = products.filter(p => !selectedIds.includes(p.id));
            if (typeof showToast === 'function') showToast(`Đã xóa ${selectedIds.length} dòng sản phẩm`, 'success');
        } else if (pendingDeleteId) {
            products = products.filter(p => p.id !== pendingDeleteId);
            if (typeof showToast === 'function') showToast('Đã xóa dòng sản phẩm', 'success');
        }
        
        closeConfirmModal();
        handleSearch();
    }

    // Register cleanup function
    window.destroyModule = function() {
        console.log('Cleaning up Product Line module...');
    };

    // Initial load
    init();

})();
