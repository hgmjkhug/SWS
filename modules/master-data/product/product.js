// Product Module - Based on DB Schema
// Fields: id, code, name, qr_code, description, weight, status, is_deleted, created_at, updated_at

(function () {
    const ITEMS_PER_PAGE = 20;

    // Generate mock data
    // let products = []; // Removed duplicate declaration

    // Mock Data categories (sync with category.js)
    var categoryData = [
        { code: 'KC01', name: 'Kim khí & Vật tư phụ' },
        { code: 'KC02', name: 'Dụng cụ Cắt gọt' },
        { code: 'KC03', name: 'Dụng cụ Cầm tay' },
        { code: 'KC04', name: 'Vật tư Hàn' },
        { code: 'KC05', name: 'Thiết bị Đo lường' },
        { code: 'KC06', name: 'Vòng bi & Bạc đạn' },
        { code: 'KC07', name: 'Dầu mỡ & Hóa chất' },
        { code: 'KC08', name: 'Thiết bị điện cầm tay' },
        { code: 'KC09', name: 'Vật tư Bảo hộ' },
        { code: 'KC10', name: 'Phụ tùng máy công cụ' }
    ];


    // Mock Data - Mechanical Products
    // Products mapping to categories: KC01 (Kim khí), KC02 (Cắt gọt), KC03 (Cầm tay), KC04 (Hàn), etc.
    let products = [
        // KC01 - Kim khí
        { id: 'uuid-1', code: 'VT001', name: 'Bulong lục giác M8x50', group: 'KC01', unit: 'Cái', weight: 0.05, exportMethod: 'FIFO', description: 'Thép mạ kẽm, DIN 933', status: 1, qr_code: 'QR001' },
        { id: 'uuid-2', code: 'VT002', name: 'Đai ốc M10', group: 'KC01', unit: 'Cái', weight: 0.02, exportMethod: 'FIFO', description: 'Inox 304', status: 1, qr_code: 'QR002' },
        { id: 'uuid-3', code: 'VT003', name: 'Long đen phẳng M12', group: 'KC01', unit: 'Cái', weight: 0.01, exportMethod: 'FIFO', description: 'Thép đen', status: 1, qr_code: 'QR003' },
        { id: 'uuid-4', code: 'VT004', name: 'Vít gỗ đầu bằng 4x30', group: 'KC01', unit: 'Cái', weight: 0.01, exportMethod: 'FIFO', description: 'Mạ vàng', status: 1, qr_code: 'QR004' },

        // KC02 - Cắt gọt
        { id: 'uuid-5', code: 'VT005', name: 'Mũi khoan sắt 5.0mm', group: 'KC02', unit: 'Cái', weight: 0.10, exportMethod: 'FIFO', description: 'NACHI HSS', status: 1, qr_code: 'QR005' },
        { id: 'uuid-6', code: 'VT006', name: 'Mũi taro M6x1.0', group: 'KC02', unit: 'Cái', weight: 0.10, exportMethod: 'FIFO', description: 'YAMAWA', status: 1, qr_code: 'QR006' },
        { id: 'uuid-7', code: 'VT007', name: 'Đá mài 100x6x16', group: 'KC02', unit: 'Viên', weight: 0.20, exportMethod: 'FEFO', description: 'Resibon xanh', status: 1, qr_code: 'QR007' },
        { id: 'uuid-8', code: 'VT008', name: 'Đá cắt 355mm', group: 'KC02', unit: 'Viên', weight: 0.50, exportMethod: 'FEFO', description: 'Tailin', status: 1, qr_code: 'QR008' },
        { id: 'uuid-9', code: 'VT009', name: 'Dao phay ngón D10', group: 'KC02', unit: 'Cái', weight: 0.15, exportMethod: 'FIFO', description: 'Hợp kim 4 me', status: 1, qr_code: 'QR009' },

        // KC03 - Cầm tay
        { id: 'uuid-10', code: 'VT010', name: 'Kìm điện 8 inch', group: 'KC03', unit: 'Cái', weight: 0.30, exportMethod: 'FIFO', description: 'Fujiya', status: 1, qr_code: 'QR010' },
        { id: 'uuid-11', code: 'VT011', name: 'Cờ lê vòng miệng 13mm', group: 'KC03', unit: 'Cái', weight: 0.15, exportMethod: 'FIFO', description: 'Yeti', status: 1, qr_code: 'QR011' },
        { id: 'uuid-12', code: 'VT012', name: 'Bộ lục giác 9 cây', group: 'KC03', unit: 'Bộ', weight: 0.4, exportMethod: 'LIFO', description: '1.5-10mm', status: 1, qr_code: 'QR012' },
        { id: 'uuid-13', code: 'VT013', name: 'Tuốc nơ vít 4 cạnh PH2', group: 'KC03', unit: 'Cái', weight: 0.1, exportMethod: 'FIFO', description: 'Vessel', status: 1, qr_code: 'QR013' },

        // KC04 - Hàn
        { id: 'uuid-14', code: 'VT014', name: 'Que hàn KT-421 3.2mm', group: 'KC04', unit: 'Thùng', weight: 20, exportMethod: 'FEFO', description: 'Kim Tín (20kg/thùng)', status: 1, qr_code: 'QR014' },
        { id: 'uuid-15', code: 'VT015', name: 'Dây hàn CO2 0.8mm', group: 'KC04', unit: 'Cuộn', weight: 15, exportMethod: 'FEFO', description: 'GM-70S', status: 1, qr_code: 'QR015' },
        { id: 'uuid-16', code: 'VT016', name: 'Thuốc hàn dán', group: 'KC04', unit: 'Hộp', weight: 0.5, exportMethod: 'FEFO', description: '', status: 1, qr_code: 'QR016' },

        // KC05 - Đo lường
        { id: 'uuid-17', code: 'VT017', name: 'Thước kẹp 150mm', group: 'KC05', unit: 'Cái', weight: 0.2, exportMethod: 'FIFO', description: 'Mitutoyo 530-104', status: 1, qr_code: 'QR017' },
        { id: 'uuid-18', code: 'VT018', name: 'Panme đo ngoài 0-25mm', group: 'KC05', unit: 'Cái', weight: 0.3, exportMethod: 'FIFO', description: 'Cơ khí', status: 1, qr_code: 'QR018' },
        { id: 'uuid-19', code: 'VT019', name: 'Thước cuộn 5M', group: 'KC05', unit: 'Cái', weight: 0.2, exportMethod: 'FIFO', description: 'Stanley', status: 1, qr_code: 'QR019' },

        // KC06 - Vòng bi
        { id: 'uuid-20', code: 'VT020', name: 'Vòng bi 6204-ZZ', group: 'KC06', unit: 'Cái', weight: 0.1, exportMethod: 'FIFO', description: 'Koyo', status: 1, qr_code: 'QR020' },
        { id: 'uuid-21', code: 'VT021', name: 'Vòng bi 6305-2RS', group: 'KC06', unit: 'Cái', weight: 0.2, exportMethod: 'FIFO', description: 'NSK', status: 1, qr_code: 'QR021' },
        { id: 'uuid-22', code: 'VT022', name: 'Gối đỡ UCP 205', group: 'KC06', unit: 'Cái', weight: 0.5, exportMethod: 'LIFO', description: 'LK', status: 1, qr_code: 'QR022' },

        // KC07 - Dầu mỡ
        { id: 'uuid-23', code: 'VT023', name: 'Dầu thủy lực 68', group: 'KC07', unit: 'Phuy', weight: 200, exportMethod: 'FEFO', description: 'Castrol Hyspin AWS 68', status: 1, qr_code: 'QR023' },
        { id: 'uuid-24', code: 'VT024', name: 'Mỡ bôi trơn EP2', group: 'KC07', unit: 'Lon', weight: 1, exportMethod: 'FEFO', description: 'Shell Gadus', status: 1, qr_code: 'QR024' },
        { id: 'uuid-25', code: 'VT025', name: 'RP7 chai lớn', group: 'KC07', unit: 'Chai', weight: 0.35, exportMethod: 'FEFO', description: 'Selleys', status: 1, qr_code: 'QR025' },

        // KC08 - Thiết bị điện cầm tay
        { id: 'uuid-26', code: 'VT026', name: 'Máy mài góc 100mm', group: 'KC08', unit: 'Cái', weight: 1.8, exportMethod: 'FIFO', description: 'Makita 9553NB', status: 1, qr_code: 'QR026' },
        { id: 'uuid-27', code: 'VT027', name: 'Máy khoan động lực 13mm', group: 'KC08', unit: 'Cái', weight: 2.1, exportMethod: 'FIFO', description: 'Bosch GSB 13 RE', status: 1, qr_code: 'QR027' }
    ].map(p => ({
        ...p,
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }));

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
        const bannerNameEl = document.getElementById('banner-warehouse-name');
        if (bannerNameEl) {
            bannerNameEl.innerText = getCurrentWarehouse();
        }

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

    // Product Modal
    window.openProductModal = function (id = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('product-form');
        form.reset();
        document.getElementById('prod-id').value = '';

        if (id) {
            const prod = products.find(p => p.id === id);
            if (prod) {
                title.innerText = 'Cập nhật sản phẩm';
                document.getElementById('prod-id').value = prod.id;
                document.getElementById('prod-code').value = prod.code;
                document.getElementById('prod-name').value = prod.name;
                document.getElementById('prod-description').value = prod.description || '';
                // Set Group Dropdown
                const gVal = prod.group || '';
                const gName = categoryData.find(c => c.code === gVal)?.name || '-- Chọn nhóm --';
                document.getElementById('prod-group').value = gVal;
                document.getElementById('selected-group-span').innerText = gName;

                // Set custom dropdown value
                const uVal = prod.unit || '';
                document.getElementById('prod-unit').value = uVal;
                document.getElementById('selected-unit-span').innerText = uVal || '-- Chọn ĐVT --';

                document.getElementById('prod-weight').value = prod.weight || '';
                document.getElementById('prod-status').checked = prod.status === 1;
            }
        } else {
            title.innerText = 'Thêm mới sản phẩm';
            document.getElementById('prod-code').value = '';
            
            // Reset custom dropdowns
            document.getElementById('selected-unit-span').innerText = '-- Chọn ĐVT --';
            document.getElementById('prod-unit').value = '';

            document.getElementById('selected-group-span').innerText = '-- Chọn nhóm --';
            document.getElementById('prod-group').value = '';

            document.getElementById('prod-status').checked = true;
        }
        modal.classList.add('show');
    };

    // Custom Dropdown Logic
    window.toggleUnitDropdown = function () {
        const menu = document.getElementById('unit-dropdown-menu');
        menu.classList.toggle('show');
    };

    window.selectUnit = function (val) {
        document.getElementById('prod-unit').value = val;
        document.getElementById('selected-unit-span').innerText = val || '-- Chọn ĐVT --';
        document.getElementById('unit-dropdown-menu').classList.remove('show');
    };

    // Group Dropdown Logic
    window.toggleGroupDropdown = function () {
        const menu = document.getElementById('group-dropdown-menu');
        menu.classList.toggle('show');
    };

    window.selectGroup = function (val, label) {
        document.getElementById('prod-group').value = val;
        document.getElementById('selected-group-span').innerText = label;
        document.getElementById('group-dropdown-menu').classList.remove('show');
    };



    // Close dropdown when clicking outside
    window.addEventListener('click', function (e) {
        // Unit
        const uDropdown = document.getElementById('unit-dropdown');
        if (uDropdown && !uDropdown.contains(e.target)) {
            document.getElementById('unit-dropdown-menu').classList.remove('show');
        }
        // Group
        const gDropdown = document.getElementById('group-dropdown');
        if (gDropdown && !gDropdown.contains(e.target)) {
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
        showToast('Đã tải file mẫu!', 'info');
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

    // Toast - Using global showToast from main script.js

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
