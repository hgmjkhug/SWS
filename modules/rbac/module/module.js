// Module Management Logic

(function () {
    // Mock Data structured in Parent-Child hierarchy
    let modules = [
        {
            id: 9, code: 'DASHBOARD', name: 'Theo dõi & Giám sát', icon: 'fas fa-chart-line', path: 'modules/dashboard', order: 1,
            children: [
                { id: 91, code: 'DB_OVERVIEW', name: 'Dashboard Tổng quan', icon: 'fas fa-chart-pie', path: 'modules/dashboard/overview', resource: 'DASHBOARDTONGQUAN', order: 1 },
                { id: 92, code: 'DB_DETAIL', name: 'Dashboard Chi tiết', icon: 'fas fa-chart-bar', path: 'modules/dashboard/detail', resource: 'DASHBOARDCHITIET', order: 2 }
            ]
        },
        {
            id: 10, code: 'WAREHOUSE', name: 'Quản lý kho', icon: 'fas fa-map', path: 'modules/warehouse', order: 2,
            children: [
                { id: 101, code: 'WH_LIST', name: 'Danh sách Kho', icon: 'fas fa-list', path: 'modules/warehouse/list', resource: 'DANHSACHKHO', order: 1 },
                { id: 102, code: 'EQ_GROUP', name: 'Nhóm thiết bị', icon: 'fas fa-tags', path: 'modules/warehouse/groups', resource: 'NHOMTHIETBI', order: 2 },
                { id: 103, code: 'EQ_LIST', name: 'Thiết bị', icon: 'fas fa-tools', path: 'modules/warehouse/equipment', resource: 'THIETBI', order: 3 }
            ]
        },
        {
            id: 8, code: 'WCS', name: 'Quản lý điều phối WCS', icon: 'fas fa-microchip', path: 'modules/wcs', order: 3,
            children: [
                { id: 81, code: 'KANBAN', name: 'Kanban WCS', icon: 'fas fa-th-large', path: 'modules/wcs/kanban', resource: 'KANBANWCS', order: 1 },
                { id: 82, code: 'ORDER_MGT', name: 'Quản lý Lệnh', icon: 'fas fa-tasks', path: 'modules/wcs/orders', resource: 'QUANLYLENH', order: 2 }
            ]
        },
        {
            id: 7, code: 'INBOUND', name: 'Nhập kho', icon: 'fas fa-file-import', path: 'modules/inbound', order: 4,
            children: [
                { id: 71, code: 'IB_ORDER', name: 'Lệnh nhập kho', icon: 'fas fa-arrow-down', path: 'modules/inbound/orders', resource: 'LENHNHAPKHO', order: 1 }
            ]
        },
        {
            id: 6, code: 'OUTBOUND', name: 'Xuất kho', icon: 'fas fa-file-export', path: 'modules/outbound', order: 5,
            children: [
                { id: 61, code: 'OB_ORDER', name: 'Lệnh xuất kho', icon: 'fas fa-arrow-up', path: 'modules/outbound/orders', resource: 'LENHXUATKHO', order: 1 }
            ]
        },
        {
            id: 5, code: 'INVENTORY', name: 'Theo dõi tồn kho', icon: 'fas fa-boxes', path: 'modules/inventory/', order: 6,
            children: [
                { id: 51, code: 'INV_TRACK', name: 'Theo dõi tồn kho', icon: 'fas fa-warehouse', path: 'modules/inventory/track', resource: 'THEODOITONKHO', order: 1 }
            ]
        },
        {
            id: 4, code: 'WORKFLOW', name: 'Quản lý luồng và quy trình', icon: 'fas fa-project-diagram', path: 'modules/workflow', order: 7,
            children: [
                { id: 41, code: 'WF_STEP', name: 'Quản lý bước', icon: 'fas fa-shoe-prints', path: 'modules/workflow/steps', resource: 'QUANLYBUOC', order: 1 },
                { id: 42, code: 'WF_PROC', name: 'Quản lý Quy trình', icon: 'fas fa-sync', path: 'modules/workflow/processes', resource: 'QUANLYQUYTRINH', order: 2 }
            ]
        },
        {
            id: 3, code: 'MASTER_DATA', name: 'Master data', icon: 'fas fa-database', path: 'modules/master-data', order: 8,
            children: [
                { id: 31, code: 'MD_MAT_GROUP', name: 'Nhóm Vật tư', icon: 'fas fa-object-group', path: 'modules/master-data/mat-group', resource: 'NHOMVATTU', order: 1 },
                { id: 32, code: 'MD_MAT_LIST', name: 'Danh mục Vật tư', icon: 'fas fa-list-alt', path: 'modules/master-data/mat-list', resource: 'DANHMUCVATTU', order: 2 }
            ]
        },
        {
            id: 2, code: 'REPORT', name: 'Báo cáo thống kê', icon: 'fas fa-chart-bar', path: 'modules/report/report', order: 9,
            children: [
                { id: 21, code: 'RP_INOUT', name: 'Báo cáo Nhập/Xuất', icon: 'fas fa-file-invoice', path: 'modules/report/in-out', resource: 'BAOCAONHAPXUAT', order: 1 }
            ]
        },
        {
            id: 1, code: 'SYSTEM', name: 'Hệ thống', icon: 'fas fa-cogs', path: 'modules/rbac', order: 10,
            children: [
                { id: 11, code: 'SYS_ACC', name: 'Tài khoản', icon: 'fas fa-user-circle', path: 'modules/rbac/account', resource: 'TAIKHOAN', order: 1 },
                { id: 12, code: 'SYS_ROLE', name: 'Vai trò', icon: 'fas fa-user-shield', path: 'modules/rbac/role', resource: 'VAITRO', order: 2 },
                { id: 14, code: 'SYS_RES', name: 'Tài nguyên', icon: 'fas fa-folder-open', path: 'modules/rbac/resource', resource: 'TAINGUYEN', order: 4 }
            ]
        },
    ];

    let expandedNodes = new Set();
    let isEditing = false;
    let currentId = null;
    let deleteId = null;

    // Resource list for searchable dropdown
    const allResources = [
        { id: 1, code: 'DASHBOARDTONGQUAN', description: 'Dashboard Tổng quan' },
        { id: 2, code: 'DASHBOARDCHITIET', description: 'Dashboard Chi tiết' },
        { id: 3, code: 'DANHSACHKHO', description: 'Danh sách Kho' },
        { id: 4, code: 'NHOMTHIETBI', description: 'Nhóm thiết bị' },
        { id: 5, code: 'THIETBI', description: 'Thiết bị' },
        { id: 6, code: 'KANBANWCS', description: 'Kanban WCS' },
        { id: 7, code: 'QUANLYLENH', description: 'Quản lý Lệnh' },
        { id: 8, code: 'QUANLYTHIETBI', description: 'Quản lý Thiết bị' },
        { id: 9, code: 'LICHBAOTRITHIETBI', description: 'Lịch bảo trì thiết bị' },
        { id: 10, code: 'GIAMSATTHIETBI', description: 'Giám sát Thiết bị' },
        { id: 11, code: 'TRUYVETNHAPXUAT', description: 'Truy vết nhập xuất' },
        { id: 12, code: 'LENHNHAPKHO', description: 'Lệnh nhập kho' },
        { id: 13, code: 'LENHXUATKHO', description: 'Lệnh xuất kho' },
        { id: 14, code: 'THEODOITONKHO', description: 'Theo dõi tồn kho' },
        { id: 15, code: 'QUANLYBUOC', description: 'Quản lý bước' },
        { id: 16, code: 'QUANLYQUYTRINH', description: 'Quản lý Quy trình' },
        { id: 17, code: 'NHOMVATTU', description: 'Nhóm Vật tư' },
        { id: 18, code: 'DANHMUCVATTU', description: 'Danh mục Vật tư' },
        { id: 19, code: 'DONVITINH', description: 'Đơn vị tính' },
        { id: 20, code: 'DANHMUCPALLET', description: 'Danh mục Pallet' },
        { id: 21, code: 'BAOCAONHAPXUAT', description: 'Báo cáo Nhập/Xuất' },
        { id: 22, code: 'TAIKHOAN', description: 'Tài khoản' },
        { id: 23, code: 'VAITRO', description: 'Vai trò' },
        { id: 24, code: 'CHUCNANG', description: 'Chức năng' },
        { id: 25, code: 'TAINGUYEN', description: 'Tài nguyên' }
    ];

    function init() {
        renderTable();
        setupEventListeners();
        initResourceDropdown();
    }

    // --- Searchable Resource Dropdown Logic ---
    function initResourceDropdown() {
        const wrapper = document.getElementById('module-resource-wrapper');
        const searchInput = document.getElementById('module-resource-search');
        if (!wrapper || !searchInput) return;

        const toggleDropdown = (e) => {
            wrapper.classList.add('open');
            populateResourceOptions(searchInput.value);
            e.stopPropagation();
        };

        searchInput.onfocus = toggleDropdown;
        searchInput.onclick = toggleDropdown;

        searchInput.oninput = (e) => {
            if (!wrapper.classList.contains('open')) {
                wrapper.classList.add('open');
            }
            populateResourceOptions(e.target.value);
        };

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (wrapper && !wrapper.contains(e.target)) {
                wrapper.classList.remove('open');
            }
        });
    }

    function populateResourceOptions(searchTerm = '') {
        const wrapper = document.getElementById('module-resource-wrapper');
        const searchInput = document.getElementById('module-resource-search');
        const hiddenInput = document.getElementById('module-resource');
        const listContainer = document.getElementById('module-resource-options-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        const filtered = allResources.filter(r =>
            r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length === 0) {
            listContainer.innerHTML = '<div style="padding: 12px; color: #94a3b8; font-style: italic; font-size: 13px;">Không tìm thấy kết quả</div>';
            return;
        }

        filtered.forEach(r => {
            const div = document.createElement('div');
            div.className = 'custom-option';
            if (hiddenInput.value === r.code) {
                div.classList.add('selected');
            }
            div.dataset.value = r.code;
            div.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-weight: 600; color: #076eb8;">${r.code}</span>
                    <span style="font-size: 12px; color: #64748b;">${r.description}</span>
                </div>
            `;
            div.onclick = (e) => {
                e.stopPropagation();
                hiddenInput.value = r.code;
                searchInput.value = r.code;
                wrapper.classList.remove('open');
                // Update selection visual
                listContainer.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
            };
            listContainer.appendChild(div);
        });
    }

    function renderTable(searchTerm = '') {
        const tbody = document.getElementById('module-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        const term = searchTerm.toLowerCase();

        const sortedModules = [...modules].sort((a, b) => a.order - b.order);

        let stt = 1;
        sortedModules.forEach(m => {
            if (m.code.toLowerCase().includes(term) || m.name.toLowerCase().includes(term)) {
                appendRow(tbody, m, stt++, 0);
                if (m.children && m.children.length > 0) {
                    const sortedChildren = [...m.children].sort((a, b) => a.order - b.order);
                    sortedChildren.forEach((child, childIdx) => {
                        appendRow(tbody, child, `${stt - 1}.${childIdx + 1}`, 1);
                    });
                }
            }
        });
    }

    function appendRow(parent, item, displaySTT, level) {
        const tr = document.createElement('tr');
        const isParent = level === 0;
        tr.className = isParent ? 'parent-row' : 'sub-module-row';
        
        tr.innerHTML = `
            <td class="col-stt">${displaySTT}</td>
            <td class="col-code" style="font-weight: 500; color: #1e293b;">${item.code}</td>
            <td class="col-name">
                ${isParent && item.children ? '<i class="fas fa-chevron-right toggle-icon"></i>' : ''}
                ${item.name}
            </td>
            <td class="col-icon">
                <div class="module-icon-display">
                    <i class="${item.icon}"></i>
                </div>
            </td>
            <td class="col-path" style="color: #64748b; font-family: roboto; font-size: 13px;">${item.path}</td>
            <td class="col-resource">${item.resource || ''}</td>
            <td class="col-order">${item.order}</td>
            <td class="col-action">
                <button class="action-btn edit-btn" onclick="editModule(${item.id}, ${level})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="requestDeleteModule(${item.id}, ${level})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        parent.appendChild(tr);
    }

    function setupEventListeners() {
        const searchInput = document.getElementById('module-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                renderTable(e.target.value);
            });
        }
    }

    window.openModuleModal = function () {
        isEditing = false;
        currentId = null;
        document.getElementById('module-modal-title').textContent = 'Thêm phân hệ mới';
        resetForm();
        document.getElementById('module-modal').classList.add('show');
    };

    function resetForm() {
        document.getElementById('module-code').value = '';
        document.getElementById('module-name').value = '';
        document.getElementById('module-icon').value = '';
        document.getElementById('module-path').value = '';
        document.getElementById('module-resource').value = '';
        document.getElementById('module-resource-search').value = '';
        document.getElementById('module-order').value = '1';
    }

    window.closeModuleModal = function () {
        document.getElementById('module-modal').classList.remove('show');
    };

    window.editModule = function (id, level) {
        let item = null;
        if (level === 0) {
            item = modules.find(m => m.id === id);
        } else {
            modules.forEach(m => {
                if (m.children) {
                    const found = m.children.find(c => c.id === id);
                    if (found) item = found;
                }
            });
        }

        if (!item) return;

        isEditing = true;
        currentId = id;
        document.getElementById('module-modal-title').textContent = level === 0 ? 'Cập nhật phân hệ' : 'Cập nhật chức năng';

        document.getElementById('module-code').value = item.code;
        document.getElementById('module-name').value = item.name;
        document.getElementById('module-icon').value = item.icon;
        document.getElementById('module-path').value = item.path;
        document.getElementById('module-resource').value = item.resource || '';
        document.getElementById('module-resource-search').value = item.resource || '';
        document.getElementById('module-order').value = item.order;

        document.getElementById('module-modal').classList.add('show');
    };

    window.saveModule = function () {
        const code = document.getElementById('module-code').value.trim();
        const name = document.getElementById('module-name').value.trim();
        const icon = document.getElementById('module-icon').value.trim();
        const path = document.getElementById('module-path').value.trim();
        const resource = document.getElementById('module-resource').value;
        const order = parseInt(document.getElementById('module-order').value) || 0;

        if (!code || !name) {
            alert('Vui lòng nhập Mã và Tên!');
            return;
        }

        if (isEditing) {
            // Logic to update parent or child
            let updated = false;
            modules.forEach((m, idx) => {
                if (m.id === currentId) {
                    modules[idx] = { ...m, code, name, icon, path, order };
                    updated = true;
                } else if (m.children) {
                    const cIdx = m.children.findIndex(c => c.id === currentId);
                    if (cIdx !== -1) {
                        m.children[cIdx] = { ...m.children[cIdx], code, name, icon, path, resource, order };
                        updated = true;
                    }
                }
            });
        } else {
            // Simplified: Add as new parent
            const newId = Date.now();
            modules.push({ id: newId, code, name, icon, path, order });
        }

        renderTable(document.getElementById('module-search').value);
        closeModuleModal();
    };

    window.requestDeleteModule = function (id, level) {
        deleteId = id;
        document.getElementById('delete-confirm-modal').classList.add('show');
    };

    window.closeDeleteConfirm = function () {
        deleteId = null;
        document.getElementById('delete-confirm-modal').classList.remove('show');
    };

    window.confirmDelete = function () {
        if (deleteId) {
            // Logic to delete parent or child
            modules = modules.filter(m => m.id !== deleteId);
            modules.forEach(m => {
                if (m.children) m.children = m.children.filter(c => c.id !== deleteId);
            });
            renderTable(document.getElementById('module-search').value);
            closeDeleteConfirm();
        }
    };

    init();
})();

