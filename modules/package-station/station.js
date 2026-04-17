(function () {
    const ITEMS_PER_PAGE = 20;
    let stations = [];
    let filteredData = [];
    window.currentPage = 1;

    // Mock Data
    const mockDataNames = [
        "Xưởng đóng gói số 1",
        "Xưởng đóng gói số 2",
        "Xưởng đóng gói miền Bắc",
        "Xưởng đóng gói miền Nam",
        "Trạm đóng gói Bus",
        "Trạm đóng gói Truck",
        "Xưởng hoàn thiện 1",
        "Xưởng hoàn thiện 2",
    ];

    // Initialize Data
    function initData() {
        stations = mockDataNames.map((name, index) => ({
            id: Date.now() + index,
            code: `ST${(index + 1).toString().padStart(3, '0')}`,
            name: name,
            description: `Mô tả cho ${name}`,
            is_deleted: false
        }));
        // Generat more data for pagination demo
        for (let i = 9; i <= 45; i++) {
            stations.push({
                id: Date.now() + i,
                code: `ST${i.toString().padStart(3, '0')}`,
                name: `Xưởng đóng gói số ${i}`,
                description: `Mô tả tự động cho xưởng ${i}`,
                is_deleted: false
            });
        }
        filteredData = [...stations];
    }

    let pendingDeleteId = null;
    let isBulkDelete = false;
    let stationMutationObserver = null;

    // Initialization
    function init() {
        initData();
        renderTable();
    }

    // Render Table
    window.renderTable = function() {
        const tbody = document.getElementById('station-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        const start = (window.currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageData = filteredData.slice(start, end);

        if (pageData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">Không tìm thấy kết quả phù hợp</td></tr>`;
        } else {
            pageData.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td width="40px"><input type="checkbox" class="row-checkbox" value="${item.id}" onchange="updateSelection()"></td>
                    <td width="60px" style="text-align: center;">${start + index + 1}</td>
                    <td width="250px" style="font-weight: 500; color: #1e293b;">${item.code}</td>
                    <td style="font-weight: 500; color: #076EB8;">${item.name}</td>
                    <td style="color: #64748b;">${item.description || '-'}</td>
                    <td width="120px" style="text-align: center;">
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
        
        const start = totalItems === 0 ? 0 : (window.currentPage - 1) * ITEMS_PER_PAGE + 1;
        const end = Math.min(window.currentPage * ITEMS_PER_PAGE, totalItems);
        
        const info = document.getElementById('pagination-info');
        if (info) info.innerText = `Hiển thị ${start} - ${end} trên tổng ${totalItems}`;

        const pageNums = document.getElementById('page-numbers');
        if (pageNums) {
            pageNums.innerHTML = '';
            
            // Simplified pagination: show current, prev, next and ellipsis
            let startPage = Math.max(1, window.currentPage - 2);
            let endPage = Math.min(totalPages, startPage + 4);
            if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

            for (let i = startPage; i <= endPage; i++) {
                const btn = document.createElement('button');
                btn.className = `page-btn ${i === window.currentPage ? 'active' : 'btn-secondary'}`;
                btn.innerText = i;
                btn.onclick = () => changePage(i);
                pageNums.appendChild(btn);
            }
        }

        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        if (prevBtn) prevBtn.disabled = window.currentPage === 1;
        if (nextBtn) nextBtn.disabled = window.currentPage === totalPages || totalPages === 0;
    }

    window.changePage = function(page) {
        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        if (page < 1 || page > totalPages) return;
        window.currentPage = page;
        renderTable();
    }

    window.handleGotoPage = function(value) {
        const page = parseInt(value);
        if (page) changePage(page);
    }

    // Search
    window.handleSearch = function() {
        const query = document.getElementById('station-search').value.toLowerCase().trim();
        filteredData = stations.filter(s => 
            !s.is_deleted && 
            (s.code.toLowerCase().includes(query) || s.name.toLowerCase().includes(query))
        );
        window.currentPage = 1;
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
        const modal = document.getElementById('station-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('station-form');
        
        form.reset();
        document.getElementById('station-id').value = '';
        
        if (id) {
            const item = stations.find(s => s.id === id);
            if (item) {
                title.innerText = 'Cập nhật xưởng đóng gói';
                document.getElementById('station-id').value = item.id;
                document.getElementById('node-code').value = item.code;
                document.getElementById('node-name').value = item.name;
                document.getElementById('node-description').value = item.description;
            }
        } else {
            title.innerText = 'Thêm mới xưởng đóng gói';
        }
        
        modal.classList.add('show');
    }

    window.closeModal = function() {
        document.getElementById('station-modal').classList.remove('show');
    }

    window.handleSave = function() {
        const id = document.getElementById('station-id').value;
        const code = document.getElementById('node-code').value.trim();
        const name = document.getElementById('node-name').value.trim();
        const description = document.getElementById('node-description').value.trim();

        if (!code || !name) {
            if (window.parent && window.parent.showToast) window.parent.showToast('Vui lòng nhập đầy đủ thông tin bắt buộc', 'warning');
            else if (typeof showToast === 'function') showToast('Vui lòng nhập đầy đủ thông tin bắt buộc', 'warning');
            else alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
            return;
        }

        if (id) {
            const index = stations.findIndex(s => s.id == id);
            if (index !== -1) {
                stations[index] = { ...stations[index], code, name, description };
                if (window.parent && window.parent.showToast) window.parent.showToast('Cập nhật thành công', 'success');
            }
        } else {
            const newItem = {
                id: Date.now(),
                code,
                name,
                description,
                is_deleted: false
            };
            stations.unshift(newItem);
            if (window.parent && window.parent.showToast) window.parent.showToast('Thêm mới thành công', 'success');
        }

        closeModal();
        handleSearch();
    }

    // Delete
    window.confirmDelete = function(id) {
        pendingDeleteId = id;
        isBulkDelete = false;
        document.getElementById('confirm-msg').innerText = 'Bạn có chắc chắn muốn xóa xưởng đóng gói này?';
        document.getElementById('delete-confirm-modal').classList.add('show');
    }

    window.handleBulkDelete = function() {
        isBulkDelete = true;
        const selected = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.value);
        document.getElementById('confirm-msg').innerText = `Bạn có chắc chắn muốn xóa ${selected.length} xưởng đóng gói đã chọn?`;
        document.getElementById('delete-confirm-modal').classList.add('show');
    }

    window.closeConfirmModal = function() {
        document.getElementById('delete-confirm-modal').classList.remove('show');
    }

    window.executeDelete = function() {
        if (isBulkDelete) {
            const selectedIds = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => parseInt(cb.value));
            stations = stations.filter(s => !selectedIds.includes(s.id));
            if (window.parent && window.parent.showToast) window.parent.showToast(`Đã xóa ${selectedIds.length} xưởng đóng gói`, 'success');
        } else if (pendingDeleteId) {
            stations = stations.filter(s => s.id !== pendingDeleteId);
            if (window.parent && window.parent.showToast) window.parent.showToast('Đã xóa xưởng đóng gói', 'success');
        }
        
        closeConfirmModal();
        handleSearch();
    }

    // Register cleanup function
    window.destroyModule = function() {
        // Module cleanup if needed
    };

    // Initial load
    init();

})();
