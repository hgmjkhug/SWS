// Refactored Device Type Module
(function () {
    // Mock Data
    let deviceTypes = [
        { id: 1, code: 'AGV-LOAD', name: 'AGV Vận chuyển hàng', desc: 'Xe tự hành vận chuyển pallet', specs: { capacity: '1000kg', battery: '48V' } },
        { id: 2, code: 'CRANE-STACK', name: 'Cần trục Stacker Crane', desc: 'Cần trục xếp dỡ tự động', specs: { height: '12m', speed: '2m/s' } },
        { id: 3, code: 'CONVEYOR-BELT', name: 'Băng tải dây', desc: 'Băng tải vận chuyển thùng carton', specs: { length: '50m', width: '600mm' } },
        { id: 4, code: 'LIFTER-VERT', name: 'Thang máy nâng hàng', desc: 'Nâng chuyển tầng', specs: { load: '2000kg', floors: 4 } },
        { id: 5, code: 'SCANNER-Gate', name: 'Cổng Scan RFID', desc: 'Cổng đọc RFID tự động', specs: { range: '5m', freq: 'UHF' } },
        { id: 6, code: 'SHUTTLE', name: 'Shuttle', desc: 'Shuttle chạy theo ray', specs: { range: '5m', freq: 'UHF' } }

    ];

    let selectedIds = [];
    let currentPage = 1;
    const itemsPerPage = 20;
    let filteredData = [];
    let pendingDeleteDeviceTypeIds = [];
    let isInitialized = false;

    // Initialize
    function initDeviceTypeModule() {
        if (isInitialized) return;

        const tbody = document.getElementById('device-type-table-body');
        if (!tbody) return;

        isInitialized = true;
        renderTable();

        // Search listener
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            // Remove old listeners to be safe (though cloning is better, here we assume clean slate if possible)
            // But since we are in IIFE, we just add new one. 
            // Better to use oninput in HTML or check if listener attached.
            // Simplified:
            searchInput.onkeyup = (e) => {
                currentPage = 1;
                renderTable(e.target.value);
            };
        }
    }

    // MutationObserver to detect when the view is loaded
    const observer = new MutationObserver((mutations) => {
        if (document.getElementById('device-type-table-body')) {
            initDeviceTypeModule();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Register cleanup function
    window.destroyModule = function() {
        console.log('Cleaning up Device Type module...');
        if (observer) {
            observer.disconnect();
        }
    };

    // Initial check
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDeviceTypeModule);
    } else {
        initDeviceTypeModule();
    }

    // Render Table
    function renderTable(keyword = '') {
        const tbody = document.getElementById('device-type-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        selectedIds = [];
        updateBulkDeleteBtn();
        const selectAll = document.getElementById('select-all');
        if (selectAll) selectAll.checked = false;

        const term = keyword.toLowerCase();
        filteredData = deviceTypes.filter(item =>
            item.code.toLowerCase().includes(term) ||
            item.name.toLowerCase().includes(term)
        );

        // Calculate Pagination
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Adjust current page if out of bounds
        if (currentPage > totalPages) currentPage = totalPages || 1;
        if (currentPage < 1) currentPage = 1;

        const startItem = (currentPage - 1) * itemsPerPage;
        const endItem = Math.min(startItem + itemsPerPage, totalItems);
        const pageData = filteredData.slice(startItem, endItem);

        // Render Pagination Info
        const infoEl = document.getElementById('pagination-info');
        if (infoEl) {
            if (totalItems === 0) {
                infoEl.innerText = 'Không có dữ liệu';
            } else {
                infoEl.innerText = `Hiển thị ${startItem + 1} - ${endItem} trong ${totalItems}`;
            }
        }

        renderPaginationControls(totalPages);

        if (totalItems === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:20px;">Không tìm thấy dữ liệu</td></tr>';
            return;
        }

        pageData.forEach((item, index) => {
            // Calculate global STT
            const stt = startItem + index + 1;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align:center"><input type="checkbox" class="row-checkbox" value="${item.id}" onclick="toggleRow(${item.id})"></td>
                <td style="text-align:center">${stt}</td>
                <td style="font-weight:600; color:#2563eb">${item.code}</td>
                <td>${item.name}</td>
                <td>${item.desc || '-'}</td>

                <td style="text-align:center">
                    <div class="action-buttons" style="justify-content:center">
                        <div class="action-icon" onclick="openEditModal(${item.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></div>
                        <div class="action-icon delete" onclick="deleteItem(${item.id})" title="Xóa"><i class="fas fa-trash"></i></div>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderPaginationControls(totalPages) {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const pageNumbers = document.getElementById('page-numbers');

        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;

        if (pageNumbers) {
            pageNumbers.innerHTML = `<button class="page-btn active">${currentPage}</button>`;
        }
    }

    // Global Functions (Exposed to Window)
    window.prevPage = function () {
        if (currentPage > 1) {
            currentPage--;
            renderTable(document.getElementById('search-input')?.value || '');
        }
    };

    window.nextPage = function () {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable(document.getElementById('search-input')?.value || '');
        }
    };

    // Modal Functions
    window.openAddModal = function () {
        document.getElementById('modal-title').innerText = 'Thêm mới Nhóm thiết bị';
        document.getElementById('device-type-id').value = '';
        document.getElementById('device-type-code').value = '';
        document.getElementById('device-type-name').value = '';
        document.getElementById('device-type-desc').value = '';
        document.getElementById('device-type-specs').value = '';
        document.getElementById('device-type-modal').classList.add('show');
    };

    window.openEditModal = function (id) {
        const item = deviceTypes.find(d => d.id === id);
        if (!item) return;

        document.getElementById('modal-title').innerText = 'Cập nhật Nhóm thiết bị';
        document.getElementById('device-type-id').value = item.id;
        document.getElementById('device-type-code').value = item.code;
        document.getElementById('device-type-name').value = item.name;
        document.getElementById('device-type-desc').value = item.desc || '';
        document.getElementById('device-type-specs').value = JSON.stringify(item.specs, null, 2);
        document.getElementById('device-type-modal').classList.add('show');
    };

    window.closeModal = function () {
        document.getElementById('device-type-modal').classList.remove('show');
    };

    window.saveDeviceType = function () {
        const id = document.getElementById('device-type-id').value;
        const code = document.getElementById('device-type-code').value.trim();
        const name = document.getElementById('device-type-name').value.trim();
        const desc = document.getElementById('device-type-desc').value.trim();
        const specsStr = document.getElementById('device-type-specs').value.trim();

        if (!code || !name) {
            showToast('Vui lòng nhập Mã và Tên nhóm thiết bị', 'error');
            return;
        }

        let specs = {};
        try {
            if (specsStr) specs = JSON.parse(specsStr);
        } catch (e) {
            showToast('Định dạng JSON không hợp lệ ở trường Thông số', 'error');
            return;
        }

        if (id) {
            // Update
            const index = deviceTypes.findIndex(d => d.id == id);
            if (index !== -1) {
                deviceTypes[index] = { ...deviceTypes[index], code, name, desc, specs };
                showToast('Cập nhật thành công');
            }
        } else {
            // Create
            const newId = deviceTypes.length > 0 ? Math.max(...deviceTypes.map(d => d.id)) + 1 : 1;
            deviceTypes.push({ id: newId, code, name, desc, specs });
            showToast('Thêm mới thành công');
        }

        closeModal();
        renderTable();
    };

    // Bulk Actions & Checkbox
    window.toggleSelectAll = function () {
        const isChecked = document.getElementById('select-all').checked;
        const checkboxes = document.querySelectorAll('.row-checkbox');
        selectedIds = [];

        checkboxes.forEach(cb => {
            cb.checked = isChecked;
            if (isChecked) selectedIds.push(parseInt(cb.value));
        });
        updateBulkDeleteBtn();
    };

    window.toggleRow = function (id) {
        const checkbox = document.querySelector(`.row-checkbox[value="${id}"]`);
        if (checkbox.checked) {
            selectedIds.push(id);
        } else {
            selectedIds = selectedIds.filter(idx => idx !== id);
        }
        updateBulkDeleteBtn();
    };

    function updateBulkDeleteBtn() {
        const btn = document.getElementById('bulk-delete-btn');
        const countSpan = document.getElementById('selected-count');
        if (countSpan) countSpan.innerText = selectedIds.length;
        if (btn) btn.disabled = selectedIds.length === 0;
    }

    window.deleteItem = function (id) {
        pendingDeleteDeviceTypeIds = [id];
        const item = deviceTypes.find(d => d.id === id);
        const msgEl = document.getElementById('confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa nhóm thiết bị <strong>${item?.name}</strong> không?<br />Hành động này không thể hoàn tác.`;
        }
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.add('show');
    };

    window.closeDeleteConfirm = function () {
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.remove('show');
        pendingDeleteDeviceTypeIds = [];
    };

    window.confirmDeleteDeviceType = function () {
        if (pendingDeleteDeviceTypeIds.length > 0) {
            deviceTypes = deviceTypes.filter(d => !pendingDeleteDeviceTypeIds.includes(d.id));
            renderTable();
            if (typeof showToast === 'function') showToast(`Đã xóa ${pendingDeleteDeviceTypeIds.length} nhóm thiết bị thành công`);
            closeDeleteConfirm();
        }
    };

    window.deleteSelected = function () {
        if (selectedIds.length === 0) return;

        pendingDeleteDeviceTypeIds = selectedIds;
        const msgEl = document.getElementById('confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa <strong>${selectedIds.length}</strong> nhóm thiết bị đã chọn không?<br />Hành động này không thể hoàn tác.`;
        }
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.add('show');
    };

})();
