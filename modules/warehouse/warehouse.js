/**
 * Warehouse Management Logic
 * Refactored to use IIFE to prevent global scope pollution
 */
(function () {
    'use strict';

    // Mock Data
    let warehouses = [
        { id: 1, code: 'CSC', type: 'Kho Tower', name: 'CÔNG TY THÉP', floors: 2, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 2, code: 'INDUSTRIES', type: 'Kho stacker crane', name: 'CÔNG TY TNHH TẬP ĐOÀN CÔNG NGHIỆP TRƯỜNG HẢI', floors: 3, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 3, code: 'VAM', type: 'Kho Flat', name: 'CÔNG TY TNHH SẢN XUẤT MÁY LẠNH Ô TÔ VINA', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang bảo trì' },
        { id: 4, code: 'TACB', type: 'Kho Tower', name: 'CÔNG TY LINH KIỆN KHUNG THÂN VỎ Ô TÔ', floors: 2, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 5, code: 'LAPRO', type: 'Kho stacker crane', name: 'CÔNG TY BẢO HỘ LAO ĐỘNG', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Ngưng sử dụng' },
        { id: 6, code: 'TOMCDD', type: 'Kho Flat', name: 'CÔNG TY THIẾT BỊ CƠ KHÍ DÂN DỤNG', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Mới tạo' },
        { id: 7, code: 'TUC', type: 'Kho Tower', name: 'CÔNG TY THACO INDUSTRIES TẠI MỸ', floors: 2, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 8, code: 'DA', type: 'Kho stacker crane', name: 'DỰ ÁN MỚI', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Mới tạo' },
        { id: 9, code: 'CTMC', type: 'Kho Flat', name: 'CÔNG TY CƠ KHÍ CHÍNH XÁC & KHUÔN MẪU', floors: 3, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 10, code: 'CASF', type: 'Kho Tower', name: 'CÔNG TY KEO & DUNG DỊCH CHUYÊN DỤNG', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 11, code: 'TIP', type: 'Kho stacker crane', name: 'CÔNG TY NHỰA CÔNG NGHIỆP', floors: 2, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 12, code: 'M&E', type: 'Kho Flat', name: 'CÔNG TY CƠ ĐIỆN', floors: 2, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang bảo trì' },
        { id: 13, code: 'VPĐH', type: 'Kho Tower', name: 'VPĐH THACO INDUSTRIES', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 14, code: 'TOMC', type: 'Kho stacker crane', name: 'CÔNG TY TNHH TỔ HỢP CƠ KHÍ THACO (TOMC)', floors: 4, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 15, code: 'TCMC', type: 'Kho Flat', name: 'CÔNG TY TNHH TỔ HỢP CƠ KHÍ THACO CHU LAI (TCMC)', floors: 4, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 16, code: 'TSEC', type: 'Kho Tower', name: 'CÔNG TY THIẾT BỊ CHUYÊN DỤNG', floors: 2, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Ngưng sử dụng' },
        { id: 17, code: 'CPM', type: 'Kho stacker crane', name: 'CÔNG TY BAO BÌ', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 18, code: 'TAI', type: 'Kho Flat', name: 'CÔNG TY NỘI THẤT Ô TÔ TẢI, BUS', floors: 2, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 19, code: 'CASC', type: 'Kho Tower', name: 'CÔNG TY NHÍP Ô TÔ', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 20, code: 'TPC', type: 'Kho stacker crane', name: 'CÔNG TY LINH KIỆN NHỰA', floors: 2, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 21, code: 'TACC', type: 'Kho Flat', name: 'CÔNG TY MÁY LẠNH Ô TÔ TẢI, BUS', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 22, code: 'AEE', type: 'Kho Tower', name: 'CÔNG TY TNHH SẢN XUẤT THIẾT BỊ ĐIỆN Ô TÔ', floors: 2, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 23, code: 'AUTOCOM', type: 'Kho stacker crane', name: 'CÔNG TY GHẾ Ô TÔ DU LỊCH', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Đang sử dụng' },
        { id: 24, code: 'R&D', type: 'Kho Flat', name: 'TRUNG TÂM R&D - INDUSTRIES', floors: 1, totalLocations: Math.floor(Math.random() * 401) + 100, status: 'Mới tạo' }
    ];

    // Initialize from LocalStorage if available
    const storedWarehouses = localStorage.getItem('wms_warehouses_v6');
    if (storedWarehouses) {
        try {
            const parsed = JSON.parse(storedWarehouses);
            if (Array.isArray(parsed) && parsed.length > 0) {
                warehouses = parsed;
            } else {
                localStorage.setItem('wms_warehouses_v6', JSON.stringify(warehouses));
            }
        } catch (e) {
            localStorage.setItem('wms_warehouses_v6', JSON.stringify(warehouses));
        }
    } else {
        localStorage.setItem('wms_warehouses_v6', JSON.stringify(warehouses));
    }

    let pendingToggleId = null;
    let currentPage = 1;
    const itemsPerPage = 20;

    // DOM Elements (Refreshable)
    let warehouseBody, searchInput, warehouseModal, confirmModal, warehouseForm, modalTitle;

    function refreshElements() {
        warehouseBody = document.getElementById('warehouseBody');
        searchInput = document.getElementById('searchInput');
        warehouseModal = document.getElementById('warehouseModal');
        confirmModal = document.getElementById('confirmModal');
        warehouseForm = document.getElementById('warehouseForm');
        modalTitle = document.getElementById('modalTitle');
    }

    // Initial Render & Setup
    function initWarehouse() {
        refreshElements();
        if (warehouseBody) renderWarehouses(warehouses);

        if (searchInput) {
            searchInput.oninput = filterData;
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.onchange = filterData;
        }

        const typeFilter = document.getElementById('typeFilter');
        if (typeFilter) {
            typeFilter.onchange = filterData;
        }

        function filterData() {
            const keyword = searchInput ? searchInput.value.toLowerCase() : '';
            const statusValue = statusFilter ? statusFilter.value : '';
            const typeValue = typeFilter ? typeFilter.value : '';

            const filtered = warehouses.filter(w => {
                const matchesKeyword = w.name.toLowerCase().includes(keyword);

                let matchesStatus = true;
                if (statusValue !== '') {
                    matchesStatus = w.status === statusValue;
                }

                let matchesType = true;
                if (typeValue !== '') {
                    matchesType = w.type === typeValue;
                }

                return matchesKeyword && matchesStatus && matchesType;
            });

            currentPage = 1;
            renderWarehouses(filtered);
        }

        const checkAll = document.getElementById('checkAll');
        if (checkAll) {
            checkAll.onchange = function () {
                const isChecked = this.checked;
                document.querySelectorAll('.row-checkbox').forEach(cb => {
                    cb.checked = isChecked;
                });
                toggleBulkDeleteBtn();
            };
        }
    }

    function toggleBulkDeleteBtn() {
        // const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;
    }

    // Render Function
    function renderWarehouses(data) {
        if (!warehouseBody) return;
        warehouseBody.innerHTML = '';

        if (data.length === 0) {
            warehouseBody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding: 20px;">Không tìm thấy dữ liệu</td></tr>';
            renderPagination(0);
            return;
        }

        // Pagination logic
        const totalItems = data.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const paginatedData = data.slice(startIndex, endIndex);

        paginatedData.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" value="${item.id}" onchange="window.toggleBulkDeleteBtn()"></td>
                <td style="text-align: center;">${startIndex + index + 1}</td>
                <td style="text-align: center; font-weight: 600; color: #1e40af;">${item.code || '-'}</td>
                <td style="color: #2563eb; cursor: pointer; font-weight: 500;">
                    <span class="warehouse-name-cell ${item.status === 'Mới tạo' ? '' : 'disabled'}" 
                          title="${item.status === 'Mới tạo' ? item.name : 'Chỉ có thể cấu hình kho mới tạo'}" 
                          onclick="${item.status === 'Mới tạo' ? `window.configureWarehouse(${item.id})` : ''}">
                        ${item.name}
                    </span>
                </td>
                <td style="text-align: center;">
                    <span class="badge ${getTypeBadgeClass(item.type)}">${item.type}</span>
                </td>
                <td style="text-align: center;">${item.floors}</td>
                <td style="text-align: center;">${item.totalLocations.toLocaleString()}</td>
                <td style="text-align: center;">
                    <span class="badge badge-status ${getStatusBadgeClass(item.status)}">${item.status}</span>
                </td>
                <td style="text-align: center;">
                    <div style="display: flex; gap: 4px; justify-content: center;">
                        <div class="action-icon ${item.status === 'Mới tạo' ? '' : 'disabled'}" 
                             onclick="${item.status === 'Mới tạo' ? `window.configureWarehouse(${item.id})` : ''}" 
                             title="${item.status === 'Mới tạo' ? 'Cấu hình layout kho' : 'Chỉ có thể cấu hình kho mới tạo'}">
                             <i class="fas fa-cog"></i>
                        </div>
                        <div class="action-icon" onclick="window.editWarehouse(${item.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></div>
                        <div class="action-icon delete" onclick="window.deleteWarehouse(${item.id})" title="Xóa"><i class="fas fa-trash"></i></div>
                    </div>
                </td>
            `;
            warehouseBody.appendChild(tr);
        });

        renderPagination(totalItems);
    }

    function renderPagination(totalItems) {
        const paginationWrapper = document.querySelector('.pagination-wrapper');
        if (!paginationWrapper) return;

        // Update page info
        const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);

        // Ensure elements exist or are cleared
        let pageInfo = paginationWrapper.querySelector('.page-info');
        if (!pageInfo) {
            pageInfo = document.createElement('div');
            pageInfo.className = 'page-info';
            paginationWrapper.insertBefore(pageInfo, paginationWrapper.firstChild);
        }
        pageInfo.textContent = `Hiển thị ${start} - ${end} trong ${totalItems}`;

        // Update buttons
        let paginationContainer = paginationWrapper.querySelector('.pagination');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'pagination';
            paginationWrapper.appendChild(paginationContainer);
        }
        paginationContainer.innerHTML = '';

        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderWarehouses(warehouses); } };
        paginationContainer.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            // Show limited pages if too many, but for now simple loop
            if (totalPages > 10 && i !== 1 && i !== totalPages && Math.abs(i - currentPage) > 2) {
                // skip logic could go here
                continue;
            }

            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => { currentPage = i; renderWarehouses(warehouses); };
            paginationContainer.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = `page-btn ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderWarehouses(warehouses); } };
        paginationContainer.appendChild(nextBtn);
    }

    // --- CUSTOM DROPDOWN LOGIC ---
    window.toggleFilterDropdown = function () {
        const menu = document.getElementById('status-filter-menu');
        if (menu) {
            menu.classList.toggle('show');
        }
    };

    window.selectFilterOption = function (value, text) {
        // Update display
        const display = document.getElementById('status-filter-display');
        if (display) display.textContent = text;

        // Update hidden input
        const input = document.getElementById('statusFilter');
        if (input) {
            input.value = value;
            // Trigger change event for filterData listener
            input.dispatchEvent(new Event('change'));
        }

        // Update selected class
        const items = document.querySelectorAll('.custom-dropdown-item');
        items.forEach(item => {
            if (item.textContent === text) item.classList.add('selected');
            else item.classList.remove('selected');
        });

        // Close dropdown
        const menu = document.getElementById('status-filter-menu');
        if (menu) menu.classList.remove('show');
    };

    // Close dropdown when clicking outside
    window.addEventListener('click', function (e) {
        // Type Filter Dropdown
        const typeDropdown = document.getElementById('type-filter-dropdown');
        if (typeDropdown && !typeDropdown.contains(e.target)) {
            const menu = document.getElementById('type-filter-menu');
            if (menu) menu.classList.remove('show');
        }

        // Modal Type Dropdown
        const modalTypeDropdown = document.getElementById('modal-type-dropdown');
        if (modalTypeDropdown && !modalTypeDropdown.contains(e.target)) {
            const menu = document.getElementById('modal-type-menu');
            if (menu) menu.classList.remove('show');
        }

        // Filter Dropdown
        const filterDropdown = document.getElementById('status-filter-dropdown');
        if (filterDropdown && !filterDropdown.contains(e.target)) {
            const menu = document.getElementById('status-filter-menu');
            if (menu) menu.classList.remove('show');
        }

        // Modal Status Dropdown
        const modalDropdown = document.getElementById('modal-status-dropdown');
        if (modalDropdown && !modalDropdown.contains(e.target)) {
            const menu = document.getElementById('modal-status-menu');
            if (menu) menu.classList.remove('show');
        }
    });

    // --- MODAL CUSTOM DROPDOWN ---
    window.toggleModalStatusDropdown = function () {
        const menu = document.getElementById('modal-status-menu');
        if (menu) menu.classList.toggle('show');
    };

    window.selectModalStatusOption = function (value) {
        document.getElementById('warehouseStatus').value = value;
        document.getElementById('modal-status-display').textContent = value;
        document.getElementById('modal-status-menu').classList.remove('show');
    };

    // --- TYPE FILTER LOGIC ---
    window.toggleTypeFilterDropdown = function () {
        const menu = document.getElementById('type-filter-menu');
        if (menu) {
            menu.classList.toggle('show');
        }
    };

    window.selectTypeFilterOption = function (value, text) {
        const display = document.getElementById('type-filter-display');
        if (display) display.textContent = text;

        const input = document.getElementById('typeFilter');
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('change'));
        }

        const items = document.querySelectorAll('#type-filter-menu .custom-dropdown-item');
        items.forEach(item => {
            if (item.textContent === text) item.classList.add('selected');
            else item.classList.remove('selected');
        });

        const menu = document.getElementById('type-filter-menu');
        if (menu) menu.classList.remove('show');
    };

    // --- MODAL TYPE DROPDOWN ---
    window.toggleModalTypeDropdown = function () {
        const menu = document.getElementById('modal-type-menu');
        if (menu) menu.classList.toggle('show');
    };

    window.selectModalTypeOption = function (value) {
        document.getElementById('warehouseType').value = value;
        document.getElementById('modal-type-display').textContent = value;
        document.getElementById('modal-type-menu').classList.remove('show');
    };

    // --- GLOBAL FUNCTIONS EXPOSED TO WINDOW ---

    window.openModal = function () {
        if (!warehouseModal) refreshElements();
        warehouseForm.reset();
        document.getElementById('warehouseId').value = '';
        
        // Reset new fields
        document.getElementById('warehouseType').value = '';
        document.getElementById('modal-type-display').textContent = 'Chọn loại kho';
        document.getElementById('warehouseLength').value = '';
        document.getElementById('warehouseWidth').value = '';
        
        // Hide status field when creating (auto-set to 'Mới tạo')
        document.getElementById('statusFormGroup').style.display = 'none';
        document.getElementById('warehouseStatus').value = 'Mới tạo';
        document.getElementById('modal-status-display').textContent = 'Mới tạo';
        
        modalTitle.textContent = 'Thêm mới Kho';
        warehouseModal.classList.add('show');
    };

    window.closeModal = function () {
        if (warehouseModal) warehouseModal.classList.remove('show');
    };

    window.editWarehouse = function (id) {
        if (!warehouseModal) refreshElements();
        const item = warehouses.find(w => w.id === id);
        if (!item) return;

        document.getElementById('warehouseId').value = item.id;
        document.getElementById('warehouseType').value = item.type || '';
        document.getElementById('modal-type-display').textContent = item.type || 'Chọn loại kho';
        document.getElementById('warehouseName').value = item.name;
        document.getElementById('floors').value = item.floors;
        document.getElementById('warehouseLength').value = item.warehouseLength || '';
        document.getElementById('warehouseWidth').value = item.warehouseWidth || '';
        
        // Show status field when editing
        document.getElementById('statusFormGroup').style.display = '';
        document.getElementById('warehouseStatus').value = item.status;
        document.getElementById('modal-status-display').textContent = item.status;

        modalTitle.textContent = 'Cập nhật Kho';
        warehouseModal.classList.add('show');
    };

    let pendingDeleteId = null;

    window.deleteWarehouse = function (id) {
        pendingDeleteId = id;
        const item = warehouses.find(w => w.id === id);
        const msgEl = document.getElementById('confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa kho <strong>${item?.name}</strong> không?<br />Hành động này không thể hoàn tác.`;
        }
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.add('show');
    };

    window.closeDeleteModal = function () {
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.remove('show');
        pendingDeleteId = null;
    };

    window.confirmDeleteWarehouse = function () {
        if (pendingDeleteId) {
            warehouses = warehouses.filter(w => w.id !== pendingDeleteId);
            saveWarehouses();
            renderWarehouses(warehouses);
            window.closeDeleteModal();
        }
    };

    window.saveWarehouse = function () {
        const id = document.getElementById('warehouseId').value;
        const type = document.getElementById('warehouseType').value;
        const name = document.getElementById('warehouseName').value;
        const floors = parseInt(document.getElementById('floors').value) || 0;
        const warehouseLength = parseInt(document.getElementById('warehouseLength').value) || 0;
        const warehouseWidth = parseInt(document.getElementById('warehouseWidth').value) || 0;
        // const totalLocations = parseInt(document.getElementById('totalLocations').value) || 0;
        const status = document.getElementById('warehouseStatus').value;

        if (!type || !name) {
            alert('Vui lòng chọn Loại kho và Tên kho');
            return;
        }

        if (floors < 1 || !Number.isInteger(floors)) {
            alert('Số tầng phải là số nguyên dương');
            return;
        }

        if (warehouseLength < 1 || !Number.isInteger(warehouseLength)) {
            alert('Chiều dài kho phải là số nguyên dương');
            return;
        }

        if (warehouseWidth < 1 || !Number.isInteger(warehouseWidth)) {
            alert('Chiều rộng kho phải là số nguyên dương');
            return;
        }

        if (id) {
            // Update
            const index = warehouses.findIndex(w => w.id == id);
            if (index !== -1) {
                // Keep existing totalLocations
                const existingTotal = warehouses[index].totalLocations;
                warehouses[index] = { ...warehouses[index], type, name, floors, warehouseLength, warehouseWidth, totalLocations: existingTotal, status };
            }
        } else {
            // Create
            const newId = warehouses.length > 0 ? Math.max(...warehouses.map(w => w.id)) + 1 : 1;
            warehouses.push({ id: newId, type, name, floors, warehouseLength, warehouseWidth, totalLocations: 0, status: 'Mới tạo' });
        }

        saveWarehouses();
        window.closeModal();
        renderWarehouses(warehouses);
    };

    window.configureWarehouse = function (id) {
        localStorage.setItem('config_warehouse_id', id);
        if (window.loadPage) window.loadPage('Cấu hình Kho');
    };

    function getTypeBadgeClass(type) {
        switch(type) {
            case 'Kho Tower': return 'badge-tower';
            case 'Kho stacker crane': return 'badge-stacker';
            case 'Kho Flat': return 'badge-flat';
            default: return 'badge-inactive';
        }
    }

    function getStatusBadgeClass(status) {
        switch(status) {
            case 'Mới tạo': return 'badge-new';
            case 'Đang sử dụng': return 'badge-active';
            case 'Đang bảo trì': return 'badge-maintenance';
            case 'Ngưng sử dụng': return 'badge-inactive';
            default: return 'badge-inactive';
        }
    }

    window.toggleBulkDeleteBtn = toggleBulkDeleteBtn;

    function saveWarehouses() {
        localStorage.setItem('wms_warehouses_v6', JSON.stringify(warehouses));
    }

    function updateStatus(id, newStatus) {
        const index = warehouses.findIndex(w => w.id === id);
        if (index !== -1) {
            warehouses[index].active = newStatus;
            saveWarehouses();
        }
    }

    // Close modals when clicking outside
    window.onclick = function (event) {
        if (event.target == warehouseModal) {
            window.closeModal();
        }
        if (event.target == confirmModal) {
            window.closeConfirmModal();
        }
    };

    // START
    initWarehouse();

})();
