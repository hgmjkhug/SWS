// Product Module - Based on DB Schema
// Fields: id, code, name, qr_code, description, weight, status, is_deleted, created_at, updated_at

(function () {
    const ITEMS_PER_PAGE = 20;

    // Generate mock data
    // let products = []; // Removed duplicate declaration

    // Mock Data categories (sync with category.js)
    // Mock Data categories (sync with the fruit theme)
    var categoryData = [
        { code: 'NS01', name: 'Chuối tươi nội địa' },
        { code: 'NS02', name: 'Chuối xuất khẩu' },
        { code: 'NS03', name: 'Chuối sấy & Chế biến' },
        { code: 'NS04', name: 'Chuối giống & Kiểng' },
        { code: 'NS05', name: 'Phụ phẩm từ chuối' }
    ];


    // Mock Data - Mechanical Products
    // Products mapping to categories: KC01 (Kim khí), KC02 (Cắt gọt), KC03 (Cầm tay), KC04 (Hàn), etc.
    // Mock Data - Agricultural Products (Exact List)
    const productNames = [
        "TROPICAL", "TROPICAL", "TROPICAL", "TROPICAL", "TROPICAL",
        "TROPICAL 18KG", "TROPICAL LẺ", "TROPICAL LẺ",
        "SOFIA", "SOFIA", "SOFIA", "SOFIA", "SOFIA",
        "FRUIT WHARF", "FRUIT WHARF", "FRUIT WHARF", "FRUIT WHARF", "FRUIT WHARF",
        "DASANG LẺ", "DASANG LẺ", "DASANG", "DASANG", "DASANG", "DASANG", "DASANG",
        "SUN BANANA", "SUN BANANA", "SUN BANANA", "SUN BANANA", "SUN BANANA",
        "SISTER", "SISTER", "SISTER", "SISTER", "SISTER",
        "JIHAO", "JIHAO", "JIHAO", "JIHAO", "JIHAO",
        "GAIER", "GAIER", "GAIER", "GAIER", "GAIER",
        "XINFADIN 14CP", "XINFADIN 16CP", "XINFADIN 26CP", "XINFADIN 35CLD",
        "SEIKA 16CP", "SEIKA 18CP", "SEIKA 26CP", "SEIKA 28CP", "SEIKA 30CP",
        "SEIKA 36CP", "SEIKA 38CP", "SEIKA 40CP", "SEIKA 43CP",
        "SEIKA 13KG (5 NẢI)", "SEIKA 13KG (6 NẢI)", "SEIKA 13KG (28 CP)", "SEIKA 13KG (33 CP)",
        "DEL MONTE 28LY", "DEL MONTE 28CP", "DEL MONTE 30CP", "DEL MONTE 33CP",
        "DEL MONTE 35CP", "DEL MONTE 38CP", "DEL MONTE RCL",
        "DELMONTE 13KG (6 NẢI)", "DELMONTE 13KG (7 NẢI)", "DELMONTE 13KG (8 NẢI)",
        "DEL MONTE 10CP", "DEL MONTE 28H",
        "NHẬT TRƠN 40CP", "TAITO 40CP", "SHIMIZU 38CP", "MAINICHI 43CP",
        "XINFADIN 14CP", "XINFADIN 16CP", "XINFADIN 26CP", "XINFADIN 35CLD",
        "SEIKA 16CP", "SEIKA 18CP", "SEIKA 26CP", "SEIKA 28CP", "SEIKA 30CP",
        "SEIKA 36CP", "SEIKA 38CP", "SEIKA 40CP", "SEIKA 43CP",
        "SEIKA 13KG (5 NẢI)", "SEIKA 13KG (6 NẢI)", "SEIKA 13KG (28 CP)", "SEIKA 13KG (33 CP)",
        "DEL MONTE 28LY", "DEL MONTE 28CP", "DEL MONTE 30CP", "DEL MONTE 33CP",
        "DEL MONTE 35CP", "DEL MONTE 38CP", "DEL MONTE RCL",
        "DELMONTE 13KG (6 NẢI)", "DELMONTE 13KG (7 NẢI)", "DELMONTE 13KG (8 NẢI)",
        "DEL MONTE 10CP", "DEL MONTE 28H",
        "NHẬT TRƠN 40CP", "TAITO 40CP", "SHIMIZU 38CP", "MAINICHI 43CP"
    ];

    let products = productNames.map((name, idx) => {
        const id = (idx + 1).toString().padStart(3, '0');
        const groups = ['NS01', 'NS02', 'NS03', 'NS04', 'NS05'];
        const group = groups[idx % groups.length];
        const units = ['Thùng', 'Kg', 'Nải', 'Cái'];
        const unit = units[idx % units.length];
        
        return {
            id: `uuid-prod-${id}`,
            code: `VT${id}`,
            name: name,
            group: group,
            unit: unit,
            weight: (Math.random() * 0.5 + 0.1),
            exportMethod: 'FIFO',
            description: `Sản phẩm ${name} chất lượng cao`,
            status: 1,
            qr_code: `QR${id}`,
            is_deleted: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    });

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

    let currentPage = 1;
    let filteredData = [...products];
    let pendingImportData = [];
    let pendingDeleteIds = [];
    let pendingToggleId = null;
    let confirmModal = null;

    // Initialization
    function initProductModule() {
        const tbody = document.getElementById('product-table-body');
        if (!tbody) return;

        // Hiển thị tên kho đang chọn
        // Banner removed

        filteredData = products.filter(p => !p.is_deleted);
        renderCategoryFilter();
        renderProducts();
    }

    function renderCategoryFilter() {
        // 1. Render Group Filter Dropdown (Custom UI)
        const filterMenu = document.getElementById('group-filter-menu');
        if (filterMenu) {
            let items = `<div class="custom-dropdown-item selected" onclick="selectFilterOption('group', '', 'Tất cả nhóm')">Tất cả nhóm</div>`;
            categoryData.forEach(cat => {
                items += `<div class="custom-dropdown-item" onclick="selectFilterOption('group', '${cat.code}', '${cat.name}')">${cat.name}</div>`;
            });
            filterMenu.innerHTML = items;
        }

        // 2. Render Modal Dropdown Items (Existing)
        const modalMenu = document.getElementById('group-dropdown-menu');
        if (modalMenu) {
            modalMenu.innerHTML = '';
            categoryData.forEach(cat => {
                const item = document.createElement('div');
                item.className = 'custom-dropdown-item';
                item.innerText = cat.name;
                item.onclick = () => selectGroup(cat.code, cat.name);
                modalMenu.appendChild(item);
            });
        }
    }

    // Custom Filter Dropdown Logic
    // Custom Filter Dropdown Logic
    window.toggleFilterDropdown = function (type) {
        let menu;
        if (type === 'group') menu = document.getElementById('group-filter-menu');
        else if (type === 'status') menu = document.getElementById('status-filter-menu');

        if (!menu) return;

        const isVisible = menu.classList.contains('show');
        document.querySelectorAll('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
        if (!isVisible) menu.classList.add('show');
    };

    window.selectFilterOption = function (type, value, label) {
        if (type === 'group') {
            document.getElementById('group-filter').value = value;
            document.getElementById('group-filter-display').innerText = label;
            currentGroupFilter = value;
        } else if (type === 'status') {
            document.getElementById('status-filter').value = value;
            document.getElementById('status-filter-display').innerText = label;
            currentStatusFilter = value;
        }

        const menu = document.getElementById(`${type}-filter-menu`);
        if (menu) {
            const items = menu.querySelectorAll('.custom-dropdown-item');
            items.forEach(item => {
                if (item.innerText === label) item.classList.add('selected');
                else item.classList.remove('selected');
            });
            menu.classList.remove('show');
        }

        // Trigger Filter Logic (Existing Function)
        filterProducts();
    };

    // Close filter dropdowns when clicking outside
    window.addEventListener('click', function (e) {
        if (!e.target.closest('.custom-dropdown')) {
            const menus = document.querySelectorAll('.custom-dropdown-menu');
            menus.forEach(m => m.classList.remove('show'));
        }
    });

    // Try immediate init
    initProductModule();

    // MutationObserver for module loading
    const productObserver = new MutationObserver((mutations, obs) => {
        if (document.getElementById('product-table-body')) {
            initProductModule();
            obs.disconnect();
        }
    });

    if (!document.getElementById('product-table-body')) {
        productObserver.observe(document.body, { childList: true, subtree: true });
        setTimeout(initProductModule, 100);
        setTimeout(initProductModule, 300);
    }

    // Register cleanup function
    window.destroyModule = function() {
        console.log('Cleaning up Product module...');
        if (productObserver) {
            productObserver.disconnect();
        }
    };

    function renderProducts() {
        const tbody = document.getElementById('product-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        const activeData = filteredData.filter(p => !p.is_deleted);
        const totalItems = activeData.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageData = activeData.slice(start, end);

        if (pageData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 20px; color: #64748b;">Không tìm thấy dữ liệu</td></tr>';
        } else {
            pageData.forEach((item, idx) => {
                const groupName = categoryData.find(c => c.code === item.group)?.name || item.group || 'N/A';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td><input type="checkbox" class="prod-check" value="${item.id}" onchange="updateBulkDeleteBtn()"></td>
                <td>${start + idx + 1}</td>
                <td style="font-weight: 500">${item.code}</td>
                <td style="font-weight: 500">${item.name}</td>
                <td>${groupName}</td>
                <td>${item.unit || ''}</td>
                <td>${item.weight ? item.weight.toFixed(2) : '-'}</td>
                <td title="${item.description || ''}">${item.description || '-'}</td>
                <td><label class="switch"><input type="checkbox" ${item.status === 1 ? 'checked' : ''} onchange="handleToggleRequest(this, '${item.id}')"><span class="slider round"></span></label></td>
                <td>
                    <div style="display: flex; gap: 4px; justify-content: center;">
                        <div class="action-icon" title="Xem/Sửa" onclick="openProductModal('${item.id}')"><i class="fas fa-edit"></i></div>
                        <div class="action-icon print" title="In mã QR/Mã SP" onclick="printQR('${item.id}')"><i class="fas fa-print"></i></div>
                        <div class="action-icon delete" title="Xóa" onclick="openDeleteModal('${item.id}')"><i class="fas fa-trash"></i></div>
                    </div>
                </td>
            `;
                tbody.appendChild(tr);
            });
        }

        updatePagination(totalItems, totalPages);
        document.getElementById('check-all').checked = false;
    }

    function updatePagination(totalItems, totalPages) {
        const infoEl = document.getElementById('pagination-info');
        const pageNumsEl = document.getElementById('page-numbers');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const gotoInput = document.getElementById('goto-page');

        if (!infoEl) return;

        const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

        infoEl.textContent = totalItems > 0
            ? `Hiển thị ${start} - ${end} trong ${totalItems}`
            : 'Không có dữ liệu';

        pageNumsEl.innerHTML = '';
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
            btn.textContent = i;
            btn.onclick = () => { currentPage = i; renderProducts(); };
            pageNumsEl.appendChild(btn);
        }

        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
        if (gotoInput) {
            gotoInput.max = totalPages;
            gotoInput.value = '';
        }
    }

    window.prevPage = function () {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    };

    window.nextPage = function () {
        const totalPages = Math.ceil(filteredData.filter(p => !p.is_deleted).length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
        }
    };

    window.gotoPage = function (page) {
        const p = parseInt(page);
        const totalPages = Math.ceil(filteredData.filter(p => !p.is_deleted).length / ITEMS_PER_PAGE);
        if (p >= 1 && p <= totalPages) {
            currentPage = p;
            renderProducts();
        }
    };

    // Filter
    // State for filters
    let currentGroupFilter = '';
    let currentStatusFilter = '';

    // Filter
    window.filterProducts = function () {
        const query = document.getElementById('product-search').value.toLowerCase();

        // Use variables
        const groupFilter = currentGroupFilter;
        const statusFilter = currentStatusFilter;

        filteredData = products.filter(prod => {
            if (prod.is_deleted) return false;

            const matchesQuery = prod.name.toLowerCase().includes(query) ||
                prod.code.toLowerCase().includes(query);

            // Status filter logic
            const matchesStatus = statusFilter === '' || prod.status.toString() === statusFilter;
            const matchesGroup = groupFilter === '' || prod.group === groupFilter;

            return matchesQuery && matchesStatus && matchesGroup;
        });
        currentPage = 1;
        renderProducts();
    };

    window.toggleAll = function (source) {
        document.querySelectorAll('.prod-check').forEach(chk => chk.checked = source.checked);
        updateBulkDeleteBtn();
    };

    window.updateBulkDeleteBtn = function () {
        const checked = document.querySelectorAll('.prod-check:checked');
        const btn = document.getElementById('bulk-delete-btn');
        const countSpan = document.getElementById('selected-count');
        
        if (btn) btn.disabled = checked.length === 0;
        if (countSpan) countSpan.textContent = checked.length;
    };
    
    window.printQR = function (id) {
        // Function to handle printing if needed
    };

    // Helper for Vietnamese search
    const normalizeString = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };

    const unitOptions = ['Cái', 'Hộp', 'Thùng', 'Cuộn', 'Kg', 'Mét', 'Lít', 'Bộ', 'Viên', 'Phuy', 'Chai', 'Lon', 'Bao', 'Tấm', 'Đôi', 'Gói'];

    window.renderGroupItems = function (filter = '') {
        const list = document.getElementById('group-items-list');
        if (!list) return;

        const searchTerm = normalizeString(filter);
        const filtered = categoryData.filter(c => 
            normalizeString(c.name).includes(searchTerm)
        );
        
        if (filtered.length === 0) {
            list.innerHTML = '<div class="no-results">Không tìm thấy nhóm</div>';
            return;
        }

        list.innerHTML = filtered.map(c => `
            <div class="custom-dropdown-item" onclick="selectGroup('${c.code}', '${c.name}')">
                ${c.name}
            </div>
        `).join('');
    };

    window.renderUnitItems = function (filter = '') {
        const list = document.getElementById('unit-items-list');
        if (!list) return;

        const searchTerm = normalizeString(filter);
        const filtered = unitOptions.filter(u => 
            normalizeString(u).includes(searchTerm)
        );

        if (filtered.length === 0) {
            list.innerHTML = '<div class="no-results">Không tìm thấy ĐVT</div>';
            return;
        }

        list.innerHTML = filtered.map(u => `
            <div class="custom-dropdown-item" onclick="selectUnit('${u}')">
                ${u}
            </div>
        `).join('');
    };

    window.filterGroupItems = function (query) {
        if (!query) document.getElementById('prod-group').value = '';
        window.renderGroupItems(query);
    };

    window.filterUnitItems = function (query) {
        if (!query) document.getElementById('prod-unit').value = '';
        window.renderUnitItems(query);
    };

    // Product Modal
    window.openProductModal = function (id = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('product-form');
        form.reset();
        document.getElementById('prod-id').value = '';

        // Reset search inputs
        const gSearchInput = document.getElementById('group-search-input');
        if (gSearchInput) gSearchInput.value = '';
        const uSearchInput = document.getElementById('unit-search-input');
        if (uSearchInput) uSearchInput.value = '';
        
        renderGroupItems();
        renderUnitItems();

        if (id) {
            const prod = products.find(p => p.id === id);
            if (prod) {
                title.innerText = 'Cập nhật sản phẩm';
                document.getElementById('prod-id').value = prod.id;
                document.getElementById('prod-code').value = prod.code;
                document.getElementById('prod-name').value = prod.name;
                document.getElementById('prod-description').value = prod.description || '';
                
                // Set Group Search Input
                const gVal = prod.group || '';
                const gName = categoryData.find(c => c.code === gVal)?.name || '';
                document.getElementById('prod-group').value = gVal;
                if (gSearchInput) gSearchInput.value = gName;

                // Set Unit Search Input
                const uVal = prod.unit || '';
                document.getElementById('prod-unit').value = uVal;
                if (uSearchInput) uSearchInput.value = uVal;

                document.getElementById('prod-weight').value = prod.weight || '';
                document.getElementById('prod-status').checked = prod.status === 1;
            }
        } else {
            title.innerText = 'Thêm mới sản phẩm';
            document.getElementById('prod-code').value = '';
            
            // Reset fields
            document.getElementById('prod-unit').value = '';
            document.getElementById('prod-group').value = '';
            document.getElementById('prod-status').checked = true;
        }
        modal.classList.add('show');
    };

    // Integrated Search Dropdown Logic
    window.toggleUnitDropdown = function (forceOpen = null) {
        const dropdown = document.getElementById('unit-dropdown');
        const menu = document.getElementById('unit-dropdown-menu');
        const isCurrentlyOpen = menu.classList.contains('show');
        const targetState = forceOpen !== null ? forceOpen : !isCurrentlyOpen;

        // Close all other dropdowns
        document.querySelectorAll('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));

        if (targetState) {
            menu.classList.add('show');
            dropdown.classList.add('open');
            window.renderUnitItems(document.getElementById('unit-search-input').value);
        } else {
            menu.classList.remove('show');
            dropdown.classList.remove('open');
        }
    };

    window.selectUnit = function (val) {
        document.getElementById('prod-unit').value = val;
        document.getElementById('unit-search-input').value = val;
        toggleUnitDropdown(false);
    };

    window.toggleGroupDropdown = function (forceOpen = null) {
        const dropdown = document.getElementById('group-dropdown');
        const menu = document.getElementById('group-dropdown-menu');
        const isCurrentlyOpen = menu.classList.contains('show');
        const targetState = forceOpen !== null ? forceOpen : !isCurrentlyOpen;

        // Close all other dropdowns
        document.querySelectorAll('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));

        if (targetState) {
            menu.classList.add('show');
            dropdown.classList.add('open');
            window.renderGroupItems(document.getElementById('group-search-input').value);
        } else {
            menu.classList.remove('show');
            dropdown.classList.remove('open');
        }
    };

    window.selectGroup = function (val, label) {
        document.getElementById('prod-group').value = val;
        document.getElementById('group-search-input').value = label;
        toggleGroupDropdown(false);
    };

    // Close dropdown when clicking outside
    window.addEventListener('click', function (e) {
        // Unit
        const uDropdown = document.getElementById('unit-dropdown');
        if (uDropdown && !uDropdown.contains(e.target)) {
            uDropdown.classList.remove('open');
            document.getElementById('unit-dropdown-menu').classList.remove('show');
        }
        // Group
        const gDropdown = document.getElementById('group-dropdown');
        if (gDropdown && !gDropdown.contains(e.target)) {
            gDropdown.classList.remove('open');
            document.getElementById('group-dropdown-menu').classList.remove('show');
        }
    });

    window.closeProductModal = function () {
        document.getElementById('product-modal').classList.remove('show');
    };

    window.saveProduct = function () {
        const idStr = document.getElementById('prod-id').value;
        const codeEl = document.getElementById('prod-code');
        const name = document.getElementById('prod-name').value.trim();
        const description = document.getElementById('prod-description').value.trim();
        const group = document.getElementById('prod-group').value;
        const unit = document.getElementById('prod-unit').value;
        const weight = parseFloat(document.getElementById('prod-weight').value) || 0;
        const status = document.getElementById('prod-status').checked ? 1 : 0;

        let code = codeEl ? codeEl.value.trim() : ``;

        if (!code) {
            alert('Vui lòng nhập mã sản phẩm');
            return;
        }

        if (!name) {
            alert('Vui lòng nhập tên sản phẩm');
            return;
        }

        const now = new Date().toISOString();

        if (idStr) {
            const idx = products.findIndex(p => p.id === idStr);
            if (idx !== -1) {
                products[idx] = {
                    ...products[idx],
                    code, name, description, group, unit, weight, status,
                    updated_at: now
                };
                showToast('Cập nhật sản phẩm thành công');
            }
        } else {
            const newId = crypto.randomUUID ? crypto.randomUUID() : `uuid-${Date.now()}`;
            products.unshift({
                id: newId,
                code, name, description, group, unit, weight, status,
                is_deleted: false,
                created_at: now,
                updated_at: now
            });
            showToast('Thêm mới sản phẩm thành công');
        }

        closeProductModal();
        filterProducts(); 
    };

    window.toggleProductStatus = function (id, isChecked) {
        const idx = products.findIndex(p => p.id === id);
        if (idx !== -1) {
            products[idx].status = isChecked ? 1 : 0;
            products[idx].updated_at = new Date().toISOString();
            showToast(`Đã ${isChecked ? 'bật' : 'tắt'} trạng thái hoạt động`);

            // Update filteredData as well if it's currently showing that product
            const fIdx = filteredData.findIndex(p => p.id === id);
            if (fIdx !== -1) {
                filteredData[fIdx].status = isChecked ? 1 : 0;
            }
        }
    };

    // Toggle with Confirmation Popover
    window.handleToggleRequest = function (checkbox, id) {
        const isNowChecked = checkbox.checked;

        // If turning OFF, ask for confirmation
        if (!isNowChecked) {
            // Revert immediately, wait for confirmation
            checkbox.checked = true;
            pendingToggleId = id;

            confirmModal = document.getElementById('confirmModal');
            const prod = products.find(p => p.id === id);
            if (document.getElementById('confirmProductName')) {
                document.getElementById('confirmProductName').textContent = prod ? prod.name : '';
            }

            confirmModal.classList.add('show');

            // Position Popover dynamically
        const switchContainer = checkbox.closest('.switch');
        const rect = switchContainer.getBoundingClientRect();
        const content = confirmModal.querySelector('.confirm-content');

        if (content) {
            // Wait a tiny bit for display:block to calculate offsetHeight if needed
            setTimeout(() => {
                const contentHeight = content.offsetHeight || 180;
                const contentWidth = content.offsetWidth || 320;
                
                // Position to the left of the toggle
                content.style.left = (rect.left - contentWidth - 15) + 'px'; 
                // Center vertically relative to the switch
                content.style.top = (window.scrollY + rect.top + (rect.height / 2) - (contentHeight / 2)) + 'px';
            }, 0);
        }
    } else {
        // If turning ON, allow it immediately
        toggleProductStatus(id, true);
    }
};

    window.closeConfirmModal = function () {
        confirmModal = document.getElementById('confirmModal');
        if (confirmModal) confirmModal.classList.remove('show');
        pendingToggleId = null;
    };

    window.confirmDisable = function () {
        if (pendingToggleId) {
            toggleProductStatus(pendingToggleId, false);
            renderProducts(); // Refresh to update switch state
            closeConfirmModal();
        }
    };

    // Close confirm modal on outside click
    window.addEventListener('click', function (e) {
        const cMdl = document.getElementById('confirmModal');
        if (cMdl && cMdl.classList.contains('show') && e.target === cMdl) {
            closeConfirmModal();
        }
    });

    // Delete Modal
    window.openDeleteModal = function (id) {
        if (id) {
            pendingDeleteIds = [id];
            const prod = products.find(p => p.id === id);
            // Updating standard modal message
            const msgEl = document.getElementById('confirm-delete-message');
            if (msgEl) {
                msgEl.innerHTML = `Bạn có chắc chắn muốn xóa vật tư <strong>${prod?.name}</strong> không?<br />Hành động này không thể hoàn tác.`;
            }
        }
        document.getElementById('delete-confirm-modal').classList.add('show');
    };

    window.closeDeleteModal = function () {
        document.getElementById('delete-confirm-modal').classList.remove('show');
        pendingDeleteIds = [];
    };

    window.confirmDelete = function () {
        pendingDeleteIds.forEach(id => {
            const idx = products.findIndex(p => p.id === id);
            if (idx !== -1) {
                products[idx].is_deleted = true;
                products[idx].updated_at = new Date().toISOString();
            }
        });

        showToast(`Đã xóa ${pendingDeleteIds.length} vật tư`);
        closeDeleteModal();
        filterProducts();
    };

    window.bulkDelete = function () {
        const checked = document.querySelectorAll('.prod-check:checked');
        if (checked.length === 0) return;

        pendingDeleteIds = Array.from(checked).map(c => c.value);
        const msgEl = document.getElementById('confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa <strong>${pendingDeleteIds.length}</strong> vật tư đã chọn không?<br />Hành động này không thể hoàn tác.`;
        }
        document.getElementById('delete-confirm-modal').classList.add('show');
    };

    // ========== IMPORT EXCEL ==========
    window.openImportModal = function () {
        pendingImportData = [];
        document.getElementById('import-file').value = '';
        document.getElementById('selected-file-name').textContent = '';
        document.getElementById('import-preview').style.display = 'none';
        document.getElementById('import-error').style.display = 'none';
        document.getElementById('confirm-import-btn').disabled = true;
        document.getElementById('import-modal').classList.add('show');
    };

    window.closeImportModal = function () {
        document.getElementById('import-modal').classList.remove('show');
    };

    window.downloadSampleFile = function () {
        const sampleData = [
            ['Mã vật tư', 'Tên vật tư', 'Mô tả', 'Khối lượng (kg)', 'Mã QR', 'Trạng thái (1=HĐ, 0=Ngừng)'],
            ['SP0100', 'Bulong M10x30', 'Bulong thép mạ kẽm', 0.05, 'QR-SP0100', 1],
            ['SP0101', 'Đai ốc M10', 'Đai ốc thép không gỉ', 0.02, 'QR-SP0101', 1]
        ];

        const ws = XLSX.utils.aoa_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Products');
        ws['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];
        XLSX.writeFile(wb, 'mau_import_sanpham.xlsx');
        showToast('Đã tải file mẫu!', 'success');
    };

    window.handleFileSelect = function (input) {
        const file = input.files[0];
        if (!file) return;

        document.getElementById('selected-file-name').textContent = `📄 ${file.name}`;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                parseImportData(jsonData);
            } catch (err) {
                showImportError('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    function parseImportData(jsonData) {
        const errorEl = document.getElementById('import-error');
        const previewEl = document.getElementById('import-preview');
        const summaryEl = document.getElementById('import-summary');
        const confirmBtn = document.getElementById('confirm-import-btn');

        if (jsonData.length < 2) {
            showImportError('File không có dữ liệu hoặc chỉ có header.');
            return;
        }

        const rows = jsonData.slice(1);
        const parsed = [];
        const errors = [];

        rows.forEach((row, idx) => {
            const rowNum = idx + 2;
            if (!row || row.length < 2) {
                errors.push(`Dòng ${rowNum}: Thiếu dữ liệu`);
                return;
            }

            const [code, name, description, weight, qr_code, status] = row;

            if (!code || !name) {
                errors.push(`Dòng ${rowNum}: Thiếu mã hoặc tên vật tư`);
                return;
            }

            parsed.push({
                code: String(code).trim(),
                name: String(name).trim(),
                description: description ? String(description).trim() : '',
                weight: parseFloat(weight) || 0,
                qr_code: qr_code ? String(qr_code).trim() : '',
                status: parseInt(status) === 0 ? 0 : 1
            });
        });

        errorEl.style.display = 'none';
        previewEl.style.display = 'block';

        if (errors.length > 0) {
            errorEl.innerHTML = `<strong>Lỗi (${errors.length}):</strong><br>` + errors.slice(0, 5).join('<br>') +
                (errors.length > 5 ? `<br>... và ${errors.length - 5} lỗi khác` : '');
            errorEl.style.display = 'block';
        }

        if (parsed.length > 0) {
            pendingImportData = parsed;
            renderPreviewTable(parsed);
            summaryEl.innerHTML = `✅ <strong>${parsed.length}</strong> vật tư hợp lệ sẵn sàng import`;
            confirmBtn.disabled = false;
        } else {
            summaryEl.innerHTML = '❌ Không có dữ liệu hợp lệ để import';
            confirmBtn.disabled = true;
        }
    }

    function renderPreviewTable(data) {
        const thead = document.getElementById('preview-thead');
        const tbody = document.getElementById('preview-tbody');

        thead.innerHTML = '<tr><th>Mã SP</th><th>Tên</th><th>Mô tả</th><th>Khối lượng</th><th>Trạng thái</th></tr>';
        tbody.innerHTML = data.slice(0, 10).map(row => `
        <tr>
            <td><span class="product-code">${row.code}</span></td>
            <td>${row.name}</td>
            <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;">${row.description || '-'}</td>
            <td>${row.weight.toFixed(2)}</td>
            <td><span class="status-badge ${row.status === 1 ? 'status-active' : 'status-inactive'}">${row.status === 1 ? 'HĐ' : 'Ngừng'}</span></td>
        </tr>
    `).join('') + (data.length > 10 ? `<tr><td colspan="5" style="text-align:center;color:#64748b;">... và ${data.length - 10} vật tư khác</td></tr>` : '');
    }

    function showImportError(msg) {
        const errorEl = document.getElementById('import-error');
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
        document.getElementById('import-preview').style.display = 'none';
        document.getElementById('confirm-import-btn').disabled = true;
    }

    window.confirmImport = function () {
        if (pendingImportData.length === 0) return;

        const now = new Date().toISOString();

        pendingImportData.forEach(row => {
            const newId = crypto.randomUUID ? crypto.randomUUID() : `uuid-${Date.now()}-${Math.random()}`;
            products.push({
                id: newId,
                code: row.code,
                name: row.name,
                description: row.description,
                weight: row.weight,
                qr_code: row.qr_code || `QR-${row.code}`,
                status: row.status,
                is_deleted: false,
                created_at: now,
                updated_at: now
            });
        });

        showToast(`Đã import thành công ${pendingImportData.length} vật tư!`);
        closeImportModal();
        filterProducts();
    };

    // ========== EXPORT / SYNC ==========
    window.exportExcel = function() {
        showToast('Đang trích xuất dữ liệu ra file Excel...', 'info');
        setTimeout(() => {
            showToast('Xuất file Excel thành công!');
        }, 1000);
    };

    window.importExcel = function() {
        if (window.openImportModal) {
            window.openImportModal();
        } else {
            showToast('Tính năng nhập Excel đang được khởi tạo...', 'info');
        }
    };

    window.syncData = function() {
        showToast('Đang kết nối hệ thống...', 'info');
        setTimeout(() => {
            showToast('Đồng bộ thông tin mới nhất thành công', 'success');
        }, 1000);
    };

    // Print QR Code
    window.printQR = function (id) {
        const prod = products.find(p => p.id === id);
        if (!prod) return;

        const qrData = `${prod.code}`;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>QR - ${prod.code}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 20px;
                    background: #fff;
                }
                .qr-label {
                    display: inline-block;
                    border: 1px solid #000;
                    padding: 15px;
                }
                .qr-code {
                    display: block;
                    margin-bottom: 10px;
                }
                .qr-code img {
                    width: 150px;
                    height: 150px;
                }
                .info {
                    text-align: center;
                }
                .code {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                .name {
                    font-size: 16px;
                }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="qr-label">
                <div class="qr-code">
                    <img src="${qrApiUrl}" alt="QR Code" onload="window.print()">
                </div>
                <div class="info">
                    <div class="code">${prod.code}</div>
                    <div class="name">${prod.name}</div>
                </div>
            </div>
        </body>
        </html>
    `);
        printWindow.document.close();
    };

})();
