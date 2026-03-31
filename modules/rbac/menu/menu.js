// Menu (Function) Management Logic

(function () {
    console.log("Menu Module Loaded - v1.1 (Simplified Parent & Refined Resource)");
    // Shared Modules Data (In a real app, this would come from an API)
    // We use this for the "Parent" selection and for grouping.
    // Shared Modules Data (In a real app, this would come from an API)
    // We use this for the "Parent" selection and for grouping.
    // Updated to match module.js order and paths
    // Initial Data
    const defaultModules = [
        { id: 1, code: 'DASHBOARD', name: 'Theo dõi & Giám sát', icon: 'fas fa-chart-line', path: 'modules/dashboard', order: 1 },
        { id: 2, code: 'WAREHOUSE', name: 'Quản lý Kho', icon: 'fas fa-map', path: 'modules/warehouse', order: 2 },
        { id: 3, code: 'WCS', name: 'Quản lý điều phối WCS', icon: 'fas fa-microchip', path: 'modules/wcs', order: 3 },
        { id: 4, code: 'INBOUND', name: 'Nhập kho', icon: 'fas fa-file-import', path: 'modules/inbound', order: 4 },
        { id: 5, code: 'OUTBOUND', name: 'Xuất kho', icon: 'fas fa-file-export', path: 'modules/outbound', order: 5 },
        { id: 6, code: 'WORKFLOW', name: 'Quản lý quy trình', icon: 'fas fa-project-diagram', path: 'modules/workflow', order: 6 },
        { id: 7, code: 'MASTER_DATA', name: 'Danh mục chung', icon: 'fas fa-database', path: 'modules/master-data', order: 7 },
        { id: 8, code: 'STATISTIC', name: 'Báo cáo thống kê', icon: 'fas fa-chart-bar', path: 'modules/statistic', order: 8 },
        { id: 9, code: 'SYSTEM', name: 'Hệ thống', icon: 'fas fa-cogs', path: 'modules/rbac', order: 9 }
    ];

    const defaultFunctions = [
        // DASHBOARD (id: 1)
        { id: 101, moduleId: 1, code: 'DASHBOARD_OVERVIEW', name: 'Dashboard tổng quan', icon: 'fas fa-chart-pie', path: 'modules/dashboard/general-dashboard/general', resource: 'DASHBOARDTONGQUAN', order: 1 },
        { id: 102, moduleId: 1, code: 'DASHBOARD_DETAIL', name: 'Dashboard chi tiết', icon: 'fas fa-chart-area', path: 'modules/dashboard/detail-dashboard/detail', resource: 'DASHBOARDCHITIET', order: 2 },
        { id: 103, moduleId: 1, code: 'DASHBOARD_MONITOR', name: 'Giám sát hoạt động', icon: 'fa-solid fa-chalkboard-user', path: 'modules/dashboard/monitor', resource: 'GIAMSATHOATDONG', order: 3 },

        // WAREHOUSE (id: 2)
        { id: 201, moduleId: 2, code: 'WAREHOUSE_LIST', name: 'Danh sách Kho', icon: 'fas fa-warehouse', path: 'modules/warehouse/warehouse', resource: 'QUANLYKHO', order: 1 },
        { id: 202, moduleId: 2, code: 'PRODUCT_METHOD', name: 'Quy cách sản phẩm', icon: 'fa-regular fa-box-isometric-tape', path: 'modules/product-method/product-method', resource: 'QUYCACHSANPHAM', order: 2 },
        { id: 203, moduleId: 2, code: 'CONTAINER_MGMT', name: 'Quản lý vật chứa', icon: 'fa-regular fa-pallet-box', path: 'modules/pallet/pallet', resource: 'QUANLYVATCHUA', order: 3 },
        { id: 204, moduleId: 2, code: 'MAINTENANCE', name: 'Quản lý bảo trì', icon: 'fa-solid fa-toolbox', path: 'modules/maintenance/maintenance', resource: 'QUANLYBAOTRI', order: 4 },

        // WCS (id: 3)
        { id: 301, moduleId: 3, code: 'WCS_KANBAN', name: 'Kanban WCS', icon: 'fa-regular fa-chart-kanban', path: 'modules/kanbanWCS/kanban', resource: 'KANBANWCS', order: 1 },

        // INBOUND (id: 4)
        { id: 401, moduleId: 4, code: 'INBOUND_ORDER', name: 'Lệnh nhập kho', icon: 'fas fa-file-import', path: 'modules/inbound/inbound', resource: 'LENHNHAPKHO', order: 1 },

        // OUTBOUND (id: 5)
        { id: 501, moduleId: 5, code: 'OUTBOUND_ORDER', name: 'Lệnh xuất kho', icon: 'fas fa-file-export', path: 'modules/outbound/outbound', resource: 'LENHXUATKHO', order: 1 },

        // WORKFLOW (id: 6)
        { id: 601, moduleId: 6, code: 'WORKFLOW_PROCESS', name: 'Quản lý quy trình', icon: 'fa-light fa-arrow-progress', path: 'modules/workflow/workflow', resource: 'QUANLYQUYTRINH', order: 1 },

        // MASTER_DATA (id: 7)
        { id: 701, moduleId: 7, code: 'DEVICE_TYPE', name: 'Nhóm thiết bị', icon: 'fas fa-layer-group', path: 'modules/master-data/device-type/device-type', resource: 'NHOMTHIETBI', order: 1 },
        { id: 702, moduleId: 7, code: 'DEVICE_LIST', name: 'Thiết bị', icon: 'fas fa-robot', path: 'modules/master-data/device-list/device-list', resource: 'THIETBI', order: 2 },
        { id: 703, moduleId: 7, code: 'PRODUCT_GROUP', name: 'Nhóm sản phẩm', icon: 'fas fa-cubes', path: 'modules/master-data/category/category', resource: 'NHOMSANPHAM', order: 3 },
        { id: 704, moduleId: 7, code: 'PRODUCT_LIST', name: 'Sản phẩm', icon: 'fas fa-box', path: 'modules/master-data/product/product', resource: 'SANPHAM', order: 4 },
        { id: 705, moduleId: 7, code: 'METHOD', name: 'Quy cách', icon: 'fa-solid fa-route', path: 'modules/master-data/method/method', resource: 'QUYCACH', order: 5 },
        { id: 706, moduleId: 7, code: 'PALLET_LIST', name: 'Vật chứa', icon: 'fa-light fa-pallet-box', path: 'modules/master-data/pallet-list/container', resource: 'VATCHUA', order: 6 },
        { id: 707, moduleId: 7, code: 'UNIT_OF_MEASURE', name: 'Đơn vị tính', icon: 'fas fa-ruler', path: 'modules/master-data/unit-of-measure/unit', resource: 'DONVITINH', order: 7 },
        { id: 708, moduleId: 7, code: 'LOCATION_TYPE', name: 'Loại khu vực', icon: 'fas fa-map-marker-alt', path: 'modules/master-data/node-type/node-type', resource: 'LOAIKHUVUC', order: 8 },

        // STATISTIC (id: 8)
        { id: 801, moduleId: 8, code: 'STATISTIC_REPORT', name: 'Báo cáo Nhập/Xuất', icon: 'fa-solid fa-arrow-up-right-dots', path: 'modules/statistic/statistic', resource: 'BAOCAONHAPXUAT', order: 1 },

        // SYSTEM (id: 9)
        { id: 901, moduleId: 9, code: 'ACCOUNT', name: 'Tài khoản', icon: 'fas fa-user', path: 'modules/rbac/account/account', resource: 'TAIKHOAN', order: 1 },
        { id: 902, moduleId: 9, code: 'ROLE', name: 'Vai trò', icon: 'fas fa-user-tag', path: 'modules/rbac/role/role', resource: 'VAITRO', order: 2 },
        { id: 903, moduleId: 9, code: 'MENU', name: 'Chức năng', icon: 'fas fa-list', path: 'modules/rbac/menu/menu', resource: 'CHUCNANG', order: 3 },
        { id: 904, moduleId: 9, code: 'RESOURCE', name: 'Tài nguyên', icon: 'fas fa-folder-open', path: 'modules/rbac/resource/resource', resource: 'TAINGUYEN', order: 4 },
    ];

    let modules = [];
    let functions = [];

    let isEditing = false;
    let currentId = null;
    let deleteId = null;
    let selectedId = null; // Track selected row
    let isBatchEditing = false;
    let expandedModules = new Set(); // Default collapse all

    // Initialize
    function init() {
        loadFromStorage();
        renderTable();
        setupEventListeners();
        populateModuleSelect();
        populateResourceSelect();
    }

    const MENU_DATA_VERSION = '1.3'; // Increment to force reset

    function loadFromStorage() {
        try {
            const storedVersion = localStorage.getItem('menu_data_version');
            const storedModules = localStorage.getItem('menu_modules_data');
            const storedFunctions = localStorage.getItem('menu_functions_data');
            
            if (storedVersion === MENU_DATA_VERSION && storedModules && storedFunctions) {
                modules = JSON.parse(storedModules);
                functions = JSON.parse(storedFunctions);
            } else {
                // Version mismatch or no data - Load defaults
                console.log("Loading default menu data (Version " + MENU_DATA_VERSION + ")");
                modules = [...defaultModules];
                functions = [...defaultFunctions];
                localStorage.setItem('menu_data_version', MENU_DATA_VERSION);
                saveDataToStorage(); // Initial save
            }
        } catch (e) {
            console.error("Failed to load menu data from storage", e);
            modules = [...defaultModules];
            functions = [...defaultFunctions];
        }
    }

    function saveDataToStorage() {
        try {
            localStorage.setItem('menu_modules_data', JSON.stringify(modules));
            localStorage.setItem('menu_functions_data', JSON.stringify(functions));
            
            // Sync Sidebar
            if (window.parent && window.parent.refreshSidebarOrder) {
                window.parent.refreshSidebarOrder(modules.map(m => m.code));
            }
        } catch (e) {
            console.error("Failed to save menu data to storage", e);
        }
    }

    // --- Custom Dropdown Logic ---
    function populateModuleSelect() {
        const wrapper = document.getElementById('menu-parent-wrapper');
        const trigger = document.getElementById('menu-parent-trigger');
        const optionsContainer = document.getElementById('menu-parent-options');
        const hiddenInput = document.getElementById('menu-parent');

        if (!optionsContainer) return;

        // Clear previous options and listeners (simplistic approach)
        optionsContainer.innerHTML = '';
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        const currentTrigger = document.getElementById('menu-parent-trigger');

        // Toggle Dropdown
        currentTrigger.addEventListener('click', (e) => {
            wrapper.classList.toggle('open');
            e.stopPropagation();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove('open');
            }
        });

        // Populate Options
        optionsContainer.innerHTML = '';

        // Add Root Option
        const rootDiv = document.createElement('div');
        rootDiv.className = 'custom-option';
        rootDiv.dataset.value = '0';
        rootDiv.innerHTML = '<span class="text" style="font-weight: bold; color: #000;">-- Gốc (Root) --</span>';
        rootDiv.onclick = (e) => {
            e.stopPropagation();
            selectOption(0, '-- Gốc (Root) --', currentTrigger, hiddenInput, wrapper);
        };
        optionsContainer.appendChild(rootDiv);

        const sortedModules = [...modules].sort((a, b) => a.order - b.order);

        sortedModules.forEach(m => {
            const parentDiv = document.createElement('div');
            parentDiv.className = 'custom-option';
            parentDiv.dataset.value = m.id;
            parentDiv.innerHTML = `<span class="text">${m.name}</span>`;
            parentDiv.onclick = (e) => {
                e.stopPropagation();
                selectOption(m.id, m.name, currentTrigger, hiddenInput, wrapper);
            };
            optionsContainer.appendChild(parentDiv);
        });
    }

    function selectOption(value, text, trigger, input, wrapper) {
        input.value = value;
        
        if (trigger.tagName === 'INPUT') {
            trigger.value = text;
        } else {
            const span = trigger.querySelector('span');
            if (span) span.textContent = text;
        }

        wrapper.classList.remove('open');

        // Visual selection state
        const containerId = wrapper.id;
        document.querySelectorAll(`#${containerId} .custom-option, #${containerId} .custom-option-child`).forEach(el => el.classList.remove('selected'));
        const selectedEl = wrapper.querySelector(`[data-value="${value}"]`);
        if (selectedEl) selectedEl.classList.add('selected');

        // Disabling logic for resource field
        if (input.id === 'menu-parent') {
            toggleResourceField(value == 0);
        }
    }

    function toggleResourceField(isDisabled) {
        const resourceWrapper = document.getElementById('menu-resource-wrapper');
        const resourceSearch = document.getElementById('menu-resource-search');
        const resourceInput = document.getElementById('menu-resource');
        if (!resourceWrapper || !resourceSearch) return;

        if (isDisabled) {
            resourceWrapper.classList.add('disabled');
            resourceWrapper.classList.remove('open'); // Ensure it's closed
            resourceSearch.value = '';
            resourceInput.value = '';
            resourceSearch.placeholder = 'Chỉ áp dụng cho chức năng con';
        } else {
            resourceWrapper.classList.remove('disabled');
            resourceSearch.placeholder = 'Chọn tài nguyên...';
        }
    }

    // --- Searchable Resource Dropdown Logic ---
    const allResources = [
        { id: 1, code: 'DASHBOARD_TONGQUAN', description: 'Dashboard Tổng quan' },
        { id: 2, code: 'DASHBOARD_CHITIET', description: 'Dashboard Chi tiết' },
        { id: 3, code: 'QUANLY_KHO', description: 'Quản lý Kho' },
        { id: 4, code: 'QUANLY_VATCHUA', description: 'Quản lý vật chứa' },
        { id: 5, code: 'QUANLY_THIETBI', description: 'Quản lý thiết bị' },
        { id: 6, code: 'LICH_BAOTRI_THIETBI', description: 'Lịch bảo trì thiết bị' },
        { id: 7, code: 'KANBAN_WCS', description: 'Kanban WCS' },
        { id: 8, code: 'QUANLY_LENH', description: 'Quản lý Lệnh' },
        { id: 9, code: 'GIAMSAT_THIETBI', description: 'Giám sát Thiết bị' },
        { id: 10, code: 'LENH_NHAPKHO', description: 'Lệnh nhập kho' },
        { id: 11, code: 'LENH_XUATKHO', description: 'Lệnh xuất kho' },
        { id: 12, code: 'QUANLY_QUYTRINH', description: 'Quản lý quy trình' },
        { id: 13, code: 'NHOM_THIETBI', description: 'Nhóm thiết bị' },
        { id: 14, code: 'THIETBI', description: 'Thiết bị' },
        { id: 15, code: 'NHOM_SANPHAM', description: 'Nhóm sản phẩm' },
        { id: 16, code: 'SANPHAM', description: 'Sản phẩm' },
        { id: 17, code: 'VATCHUA', description: 'Vật chứa' },
        { id: 18, code: 'DON_VI_TINH', description: 'Đơn vị tính' },
        { id: 19, code: 'LOAI_VI_TRI', description: 'Loại vị trí' },
        { id: 20, code: 'TAI_KHOAN', description: 'Tài khoản' },
        { id: 21, code: 'VAI_TRO', description: 'Vai trò' },
        { id: 22, code: 'CHUC_NANG', description: 'Chức năng' },
        { id: 23, code: 'TAI_NGUYEN', description: 'Tài nguyên' }
    ];

    function populateResourceSelect(searchTerm = '', isInline = false, inlineTarget = null) {
        const wrapper = isInline ? null : document.getElementById('menu-resource-wrapper');
        const triggerInput = isInline ? null : document.getElementById('menu-resource-search');
        const hiddenInput = isInline ? null : document.getElementById('menu-resource');
        const listContainer = isInline ? inlineTarget.querySelector('.options-list') : document.getElementById('resource-options-list');

        if (!listContainer) return;

        // Modal Search Logic (One-time setup for trigger)
        if (!isInline && !triggerInput.dataset.initialized) {
            const toggleDropdown = (e) => {
                if (!wrapper.classList.contains('disabled')) {
                    // Close all other dropdowns first
                    document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                        if (w !== wrapper) w.classList.remove('open');
                    });
                    
                    wrapper.classList.add('open');
                    populateResourceSelect(triggerInput.value);
                }
                e.stopPropagation();
            };

            triggerInput.onfocus = toggleDropdown;
            triggerInput.onclick = toggleDropdown;
            
            triggerInput.oninput = (e) => {
                if (!wrapper.classList.contains('open')) {
                    wrapper.classList.add('open');
                }
                populateResourceSelect(e.target.value);
            };

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (wrapper && !wrapper.contains(e.target)) {
                    wrapper.classList.remove('open');
                }
            });

            triggerInput.dataset.initialized = "true";
        }

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
            div.dataset.value = r.code;
            div.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-weight: 600; color: #076eb8;">${r.code}</span>
                    <span style="font-size: 12px; color: #64748b;">${r.description}</span>
                </div>
            `;
            div.onclick = (e) => {
                e.stopPropagation();
                if (isInline) {
                    updateField(inlineTarget.dataset.funcId, 'resource', r.code);
                    closeInlineDropdown();
                } else {
                    selectOption(r.code, r.code, triggerInput, hiddenInput, wrapper);
                }
            };
            listContainer.appendChild(div);
        });
    }

    // --- Inline Resource Selection Logic (same style as modal) ---
    let currentInlineDropdown = null;
    let currentInlineWrapper = null;

    function openInlineResourceDropdown(searchInput, funcId) {
        closeInlineDropdown();

        const wrapper = searchInput.closest('.inline-resource-wrapper');
        const hiddenInput = wrapper.querySelector('.inline-resource-value');
        const rect = searchInput.getBoundingClientRect();

        const dropdown = document.createElement('div');
        dropdown.className = 'resource-options-dropdown inline-mode';
        dropdown.innerHTML = '<div class="options-list" style="overflow-y: auto; flex: 1;"></div>';
        document.body.appendChild(dropdown);

        // Position directly below the input
        dropdown.style.left = `${rect.left}px`;
        dropdown.style.top = `${rect.bottom}px`;
        dropdown.style.width = `${Math.max(rect.width, 220)}px`;

        currentInlineDropdown = dropdown;
        currentInlineWrapper = wrapper;
        wrapper.classList.add('open');

        // Populate options
        populateInlineOptions(dropdown, searchInput.value, funcId, searchInput, hiddenInput);

        // Close on outside click
        const outsideClick = (e) => {
            if (!dropdown.contains(e.target) && !wrapper.contains(e.target)) {
                closeInlineDropdown();
                document.removeEventListener('click', outsideClick);
            }
        };
        setTimeout(() => document.addEventListener('click', outsideClick), 10);
    }

    function populateInlineOptions(dropdown, searchTerm, funcId, searchInput, hiddenInput) {
        const listContainer = dropdown.querySelector('.options-list');
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
                closeInlineDropdown();
                updateField(funcId, 'resource', r.code);
            };
            listContainer.appendChild(div);
        });
    }

    function closeInlineDropdown() {
        if (currentInlineDropdown) {
            currentInlineDropdown.remove();
            currentInlineDropdown = null;
        }
        if (currentInlineWrapper) {
            currentInlineWrapper.classList.remove('open');
            currentInlineWrapper = null;
        }
    }

    function initInlineResourceDropdowns() {
        document.querySelectorAll('.inline-resource-search').forEach(input => {
            const wrapper = input.closest('.inline-resource-wrapper');
            const funcId = parseInt(wrapper.dataset.funcId);

            input.onfocus = (e) => {
                openInlineResourceDropdown(input, funcId);
                e.stopPropagation();
            };

            input.onclick = (e) => {
                if (!currentInlineDropdown) {
                    openInlineResourceDropdown(input, funcId);
                }
                e.stopPropagation();
            };

            input.oninput = (e) => {
                const w = input.closest('.inline-resource-wrapper');
                const hiddenInput = w.querySelector('.inline-resource-value');
                if (currentInlineDropdown) {
                    populateInlineOptions(currentInlineDropdown, e.target.value, funcId, input, hiddenInput);
                } else {
                    openInlineResourceDropdown(input, funcId);
                }
                e.stopPropagation();
            };
        });
    }

    // Helper to set value programmatically (for Edit mode)
    window.setCustomDropdownValue = function (value, type = 'parent') {
        let inputId = type === 'parent' ? 'menu-parent' : 'menu-resource';
        let triggerId = type === 'parent' ? 'menu-parent-trigger' : 'menu-resource-search';
        let wrapperId = type === 'parent' ? 'menu-parent-wrapper' : 'menu-resource-wrapper';

        const input = document.getElementById(inputId);
        const trigger = document.getElementById(triggerId);
        const wrapper = document.getElementById(wrapperId);
        if (!input || !trigger || !wrapper) return;

        input.value = value;

        // Find display value
        let displayValue = '';
        if (type === 'parent') {
            if (value == 0) displayValue = '-- Gốc (Root) --';
            else {
                const mod = modules.find(m => m.id == value);
                if (mod) displayValue = mod.name;
                else {
                    const func = functions.find(f => f.id == value);
                    if (func) displayValue = func.name;
                }
            }
            const span = trigger.querySelector('span');
            if (span) span.textContent = displayValue;
        } else {
            const res = allResources.find(r => r.code === value);
            displayValue = res ? res.code : '';
            trigger.value = displayValue;
        }

        // Update selection class
        wrapper.querySelectorAll('.custom-option, .custom-option-child').forEach(el => el.classList.remove('selected'));
        const selectedEl = wrapper.querySelector(`[data-value="${value}"]`);
        if (selectedEl) selectedEl.classList.add('selected');

        // Toggle field disable if parent
        if (type === 'parent') {
            toggleResourceField(value == 0);
        }
    }

    // Render Table
    function renderTable(searchTerm = '') {
        const tbody = document.getElementById('menu-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        const term = searchTerm.toLowerCase();

        // Sort modules by order
        const sortedModules = [...modules].sort((a, b) => a.order - b.order);

        sortedModules.forEach((module, mIndex) => {
            // Filter children for this module
            let moduleFunctions = functions.filter(f => f.moduleId === module.id);
            if (term) {
                moduleFunctions = moduleFunctions.filter(f =>
                    f.code.toLowerCase().includes(term) ||
                    f.name.toLowerCase().includes(term)
                );
            }

            // If searching and no children match, AND module doesn't match, skip module
            const moduleMatches = module.code.toLowerCase().includes(term) || module.name.toLowerCase().includes(term);

            if (term && moduleFunctions.length === 0 && !moduleMatches) {
                return;
            }

            // Render Module Row (Parent)
            const isExpanded = expandedModules.has(module.id) || term.length > 0;
            const trParent = document.createElement('tr');
            trParent.className = `parent-row ${isExpanded ? 'expanded' : ''}`;
            trParent.dataset.id = module.id;
            trParent.dataset.type = 'module';

            trParent.setAttribute('draggable', 'true');
            trParent.classList.add('editable-row');
            trParent.ondragstart = handleDragStart;
            trParent.ondragover = handleDragOver;
            trParent.ondrop = handleDrop;
            trParent.ondragenter = handleDragEnter;
            trParent.ondragleave = handleDragLeave;

            // Allow selecting parent row
            trParent.onclick = (e) => {
                // Prevent toggle if clicking on delete button
                if (e.target.closest('.delete-btn')) {
                    return;
                }

                // If editing, don't toggle on click of fields
                if (isBatchEditing && e.target.classList.contains('editable-field')) {
                    return;
                }

                toggleModule(module.id);
            };

            const contentEditable = isBatchEditing ? 'contenteditable="true"' : '';
            const editClass = isBatchEditing ? 'editable-field' : '';

            trParent.innerHTML = `
                <td class="col-expand">
                    <i class="fas fa-grip-vertical drag-handle parent-drag" title="Kéo để thay đổi thứ tự phân hệ"></i>
                </td>
                <td class="col-stt">${mIndex + 1}</td>
                <td class="col-name">
                    <div class="parent-name-wrapper">
                        <i class="fas fa-chevron-right toggle-icon" style="font-size: 11px; width: 12px;"></i>
                        <span ${contentEditable} class="${editClass}" onblur="updateField(${module.id}, 'name', this.innerText, 'module')" onkeydown="checkEnter(event, this)" onclick="event.stopPropagation();">${module.name}</span>
                    </div>
                </td>
                <td class="col-icon">
                    <div class="module-icon-display">
                         ${isBatchEditing ? `<span ${contentEditable} class="${editClass}" onblur="updateField(${module.id}, 'icon', this.innerText, 'module')" onkeydown="checkEnter(event, this)" style="display:none" onclick="event.stopPropagation();">${module.icon}</span>` : ''}
                         <i class="${module.icon}" ${isBatchEditing ? `onclick="event.stopPropagation(); this.previousElementSibling.style.display='inline-block'; this.previousElementSibling.focus(); this.style.display='none';"` : ''}></i>
                    </div>
                </td>
                <td class="col-path">
                    <span ${contentEditable} class="${editClass}" style="font-size: 13px; color: #64748b;" onblur="updateField(${module.id}, 'path', this.innerText, 'module')" onkeydown="checkEnter(event, this)" onclick="event.stopPropagation();">${module.path || ''}</span>
                </td>
                <td class="col-resource"></td>
                <td class="col-order" style="text-align: center;">${module.order}</td>
                <td class="col-usage">
                    <label class="switch" onclick="event.stopPropagation();" ${module.code === 'SYSTEM' ? 'style="cursor: not-allowed;" title="Không thể ngưng sử dụng phân hệ này"' : ''}>
                        <input type="checkbox" id="toggle-mod-${module.id}" ${getMenuStatus(module.code) !== false ? 'checked' : ''} onchange="toggleMenuStatus(${module.id}, 0, this.checked); event.stopPropagation();" ${module.code === 'SYSTEM' ? 'disabled' : ''}>
                        <span class="slider" ${module.code === 'SYSTEM' ? 'style="pointer-events: none;"' : ''}></span>
                    </label>
                </td>
                 <td class="col-action">
                    <button class="action-btn delete-btn" onclick="requestDeleteModule(${module.id}); event.stopPropagation();">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(trParent);

            // Render Children
            moduleFunctions.sort((a, b) => a.order - b.order).forEach((func, fIndex) => {
                const trChild = document.createElement('tr');
                const isSelected = selectedId === func.id;
                trChild.className = `child-row module-${module.id} ${isExpanded ? 'show' : ''} ${isSelected ? 'selected' : ''}`;

                trChild.setAttribute('draggable', 'true');
                trChild.classList.add('editable-row');

                trChild.dataset.id = func.id;
                trChild.dataset.moduleId = module.id;

                // Drag Events
                trChild.ondragstart = handleDragStart;
                trChild.ondragover = handleDragOver;
                trChild.ondrop = handleDrop;
                trChild.ondragenter = handleDragEnter;
                trChild.ondragleave = handleDragLeave;

                // Edit helpers
                // const contentEditable = isBatchEditing ? 'contenteditable="true"' : ''; // Defined above
                // const editClass = isBatchEditing ? 'editable-field' : ''; // Defined above

                // Click event to focus if row is clicked but not directly on span
                const rowClickHandler = isBatchEditing ? `onclick="const span = this.querySelector('.editable-field'); if(span) span.focus();"` : `onclick="selectRow(${func.id})"`;

                trChild.innerHTML = `
                    <td class="col-expand" style="vertical-align: middle; text-align: center;">
                        <i class="fas fa-grip-vertical drag-handle" title="Kéo để thay đổi thứ tự chức năng"></i>
                    </td>
                    <td class="col-stt"></td>
                    <td class="col-name">
                        <div class="child-indent">
                             <!-- L-shape handled by CSS ::before/::after -->
                             <span style="color: #cbd5e1; margin-right: 4px;">└─</span>
                             <span ${contentEditable} class="${editClass}" onblur="updateField(${func.id}, 'name', this.innerText)" onkeydown="checkEnter(event, this)" onclick="event.stopPropagation();">${func.name}</span>
                        </div>
                    </td>
                    <td class="col-icon">
                        <div class="menu-icon-display">
                            ${isBatchEditing ? `<span ${contentEditable} class="${editClass}" onblur="updateField(${func.id}, 'icon', this.innerText)" onkeydown="checkEnter(event, this)" style="display:none" onclick="event.stopPropagation();">${func.icon}</span>` : ''}
                            <i class="${func.icon}" ${isBatchEditing ? `onclick="event.stopPropagation(); this.previousElementSibling.style.display='inline-block'; this.previousElementSibling.focus(); this.style.display='none';"` : ''}></i>
                        </div>
                    </td>
                    <td class="col-path">
                        <span ${contentEditable} class="${editClass}" style="font-size: 13px; color: #64748b;" onblur="updateField(${func.id}, 'path', this.innerText)" onkeydown="checkEnter(event, this)" onclick="event.stopPropagation();">${func.path}</span>
                    </td>
                    <td class="col-resource">
                        ${isBatchEditing ? `
                            <div class="custom-select-wrapper searchable-resource-wrapper inline-resource-wrapper" data-func-id="${func.id}">
                                <div class="resource-search-container">
                                    <input type="text" class="inline-resource-search" value="${func.resource || ''}" placeholder="Chọn tài nguyên..." autocomplete="off" onclick="event.stopPropagation();" />
                                    <input type="hidden" class="inline-resource-value" value="${func.resource || ''}" />
                                    <i class="fas fa-chevron-down dropdown-arrow"></i>
                                </div>
                            </div>
                        ` : `
                            <span style="color: #076eb8; font-weight: 600;">${func.resource || ''}</span>
                        `}
                    </td>
                    <td class="col-order" style="text-align: center;">${func.order}</td>
                    <td class="col-usage">
                        <label class="switch" onclick="event.stopPropagation();" ${func.code === 'MENU' ? 'style="cursor: not-allowed;" title="Không thể ngưng sử dụng phân hệ này"' : ''}>
                            <input type="checkbox" id="toggle-func-${func.id}" ${getMenuStatus(func.code) !== false ? 'checked' : ''} onchange="toggleMenuStatus(${func.id}, 1, this.checked); event.stopPropagation();" ${func.code === 'MENU' ? 'disabled' : ''}>
                            <span class="slider" ${func.code === 'MENU' ? 'style="pointer-events: none;"' : ''}></span>
                        </label>
                    </td>
                    <td class="col-action">
                        <button class="action-btn delete-btn" onclick="requestDeleteMenu(${func.id}); event.stopPropagation();">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;

                // Manually set onclick for row to avoid innerHTML string mess with functions
                if (!isBatchEditing) {
                    trChild.onclick = () => selectRow(func.id);
                } else {
                    trChild.onclick = (e) => {
                        const span = e.currentTarget.querySelector('.editable-field');
                        if (span) span.focus();
                    };
                }

                tbody.appendChild(trChild);
            });
        });

        if (tbody.children.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 24px; color: #64748b;">
                        Không tìm thấy dữ liệu
                    </td>
                </tr>
            `;
        }

        // Initialize inline resource dropdowns for batch edit mode
        if (isBatchEditing) {
            initInlineResourceDropdowns();
        }
    }

    function getMenuStatus(code) {
        try {
            const status = JSON.parse(localStorage.getItem('wms_module_status') || '{}');
            return status[code];
        } catch (e) { return true; }
    }

    window.toggleMenuStatus = function (id, level, checked) {
        let item = null;
        let parentModule = null;

        if (level === 0) {
            item = modules.find(m => m.id === id);
        } else {
            functions.forEach(f => {
                if (f.id === id) {
                    item = f;
                    parentModule = modules.find(m => m.id === f.moduleId);
                }
            });
        }

        if (!item) return;

        try {
            const status = JSON.parse(localStorage.getItem('wms_module_status') || '{}');
            status[item.code] = checked;

            // Constraint: Parent OFF -> Children OFF
            if (level === 0 && !checked) {
                functions.filter(f => f.moduleId === id).forEach(child => {
                    status[child.code] = false;
                });
            }

            // Constraint: Child ON -> Parent ON
            if (level === 1 && checked && parentModule) {
                status[parentModule.code] = true;
            }

            localStorage.setItem('wms_module_status', JSON.stringify(status));
            
            // Show toast notification
            const message = checked 
                ? "Chức năng đã được kích hoạt thành công" 
                : "Chức năng đã được ngưng sử dụng thành công";
            
            if (window.parent && window.parent.showToast) {
                window.parent.showToast(message, 'success');
            } else if (window.showToast) {
                window.showToast(message, 'success');
            }

            // Re-render table to update toggles visually
            renderTable(document.getElementById('menu-search').value);
            
            // Trigger sidebar refresh
            if (window.parent && window.parent.updateSidebarVisibility) {
                window.parent.updateSidebarVisibility();
            } else if (window.updateSidebarVisibility) {
                window.updateSidebarVisibility();
            }
        } catch (e) {
            console.error('Failed to update menu status', e);
        }
    };

    // --- Inline Editing Logic ---
    window.checkEnter = function (e, element) {
        if (e.key === 'Enter') {
            e.preventDefault();
            element.blur();
        }
    }

    window.updateField = function (id, field, value, type = 'child') {
        const list = type === 'module' ? modules : functions;
        const item = list.find(f => f.id === id);
        if (item) {
            item[field] = value.trim();
            if (field === 'icon' || field === 'resource') {
                renderTable(document.getElementById('menu-search').value);
            }
            saveDataToStorage();
        }
    }

    // --- Drag and Drop Logic ---
    let dragSrcEl = null;

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        this.classList.add('dragging');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (dragSrcEl !== this) {
            // Get IDs
            const srcId = parseInt(dragSrcEl.dataset.id);
            const targetId = parseInt(this.dataset.id);
            const srcModuleId = parseInt(dragSrcEl.dataset.moduleId);
            const targetModuleId = parseInt(this.dataset.moduleId);

            // Only allow reordering within same module for simplicity now, or handle move
            // Request implies reordering: "dashboard overview 1, detail 2" -> swap

            // Reorder
            if (dragSrcEl.dataset.type === 'module' && this.dataset.type === 'module') {
                const srcIndex = modules.findIndex(m => m.id === srcId);
                const targetIndex = modules.findIndex(m => m.id === targetId);

                if (srcIndex !== -1 && targetIndex !== -1) {
                    const [movedItem] = modules.splice(srcIndex, 1);
                    modules.splice(targetIndex, 0, movedItem);

                    // Update orders
                    modules.forEach((m, index) => m.order = index + 1);

                    // Sync Sidebar
                    if (window.refreshSidebarOrder) {
                        window.refreshSidebarOrder(modules.map(m => m.code));
                    }
                    
                    // Show success toast for reordering
                    if (window.showToast) {
                        window.showToast('Cập nhật danh sách chức năng thành công', 'success');
                    }
                }
            } else if (srcModuleId === targetModuleId) {
                const moduleFunctions = functions.filter(f => f.moduleId === srcModuleId).sort((a, b) => a.order - b.order);
                const srcIndex = moduleFunctions.findIndex(f => f.id === srcId);
                const targetIndex = moduleFunctions.findIndex(f => f.id === targetId);

                if (srcIndex !== -1 && targetIndex !== -1) {
                    const [movedItem] = moduleFunctions.splice(srcIndex, 1);
                    moduleFunctions.splice(targetIndex, 0, movedItem);

                    moduleFunctions.forEach((f, index) => {
                        f.order = index + 1;
                        const mainIndex = functions.findIndex(func => func.id === f.id);
                        if (mainIndex !== -1) functions[mainIndex].order = f.order;
                    });
                }
            } else {
                if (window.showToast) {
                    window.showToast('Chỉ có thể sắp xếp thứ tự trong cùng một phân hệ.', 'warning');
                } else {
                    alert("Chỉ có thể sắp xếp thứ tự trong cùng một phân hệ.");
                }
                return false;
            }

            saveDataToStorage();
            renderTable(document.getElementById('menu-search').value);
        }

        return false;
    }

    // Toggle Module Expansion
    window.toggleModule = function (moduleId) {
        if (expandedModules.has(moduleId)) {
            expandedModules.delete(moduleId);
        } else {
            expandedModules.add(moduleId);
        }
        renderTable(document.getElementById('menu-search').value);
    };

    // Row Selection
    window.selectRow = function (id) {
        if (selectedId === id) {
            selectedId = null; // Deselect if clicking same
        } else {
            selectedId = id;
        }
        renderTable(document.getElementById('menu-search').value);
    }

    // Event Listeners
    function setupEventListeners() {
        const searchInput = document.getElementById('menu-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                renderTable(e.target.value);
            });
        }
    }

    // --- Modal Functions ---

    // Trigger Edit/Batch Mode from Toolbar
    window.triggerEditMenu = function () {
        isBatchEditing = !isBatchEditing;

        const btn = document.getElementById('btn-edit-mode');
        const toolbarRight = document.querySelector('.toolbar-right');

        // Always try to find existing cancel button
        let btnCancel = document.getElementById('btn-edit-cancel');

        if (btn) {
            if (isBatchEditing) {
                // Enter Edit Mode
                btn.innerHTML = '<i class="fas fa-check"></i> Hoàn tất';
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');

                // Show Cancel Button (Create if missing)
                if (!btnCancel) {
                    btnCancel = document.createElement('button');
                    btnCancel.id = 'btn-edit-cancel';
                    btnCancel.className = 'btn btn-secondary';
                    btnCancel.style.marginRight = '8px';
                    btnCancel.innerHTML = '<i class="fas fa-times"></i> Hủy';
                    btnCancel.onclick = cancelEditMode;
                    toolbarRight.insertBefore(btnCancel, btn);
                }
            } else {
                // Save & Exit Edit Mode
                btn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');

                // Remove Cancel Button
                if (btnCancel) {
                    btnCancel.remove();
                }

                // Show Toast because we saved
                showToast('Chỉnh sửa thông tin chức năng thành công');
            }
        }

        renderTable(document.getElementById('menu-search').value);
    }

    window.cancelEditMode = function () {
        isBatchEditing = false;
        const btn = document.getElementById('btn-edit-mode');
        const btnCancel = document.getElementById('btn-edit-cancel');

        if (btn) {
            btn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
        }

        if (btnCancel) {
            btnCancel.remove();
        }

        // In a real app we might revert data here, for now just re-render to exit mode
        renderTable(document.getElementById('menu-search').value);
    }

    // Simple Toast Function - Delegate to global showToast
    function showToast(message, type = 'success') {
        if (window.showToast && typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            console.log('[Toast]', message);
        }
    }



    window.openMenuModal = function () {
        isEditing = false;
        currentId = null;
        document.getElementById('menu-modal-title').textContent = 'Thêm chức năng mới';

        // Reset form
        // Default to Root
        setCustomDropdownValue(0, 'parent');
        setCustomDropdownValue('', 'resource');
        document.getElementById('menu-resource-search').value = '';
        // Removed populateResourceSelect() here - only on focus

        document.getElementById('menu-code').value = '';
        document.getElementById('menu-name').value = '';
        document.getElementById('menu-icon').value = '';
        document.getElementById('menu-path').value = '';
        document.getElementById('menu-resource').value = '';
        document.getElementById('menu-order').value = 1;

        document.getElementById('menu-modal').classList.add('show');
    };

    window.closeMenuModal = function () {
        document.getElementById('menu-modal').classList.remove('show');
    };

    window.editMenu = function (id) {
        const func = functions.find(f => f.id === id);
        if (!func) return;

        isEditing = true;
        currentId = id;
        document.getElementById('menu-modal-title').textContent = 'Cập nhật chức năng';

        // Populate Form
        document.getElementById('menu-code').value = func.code;
        document.getElementById('menu-name').value = func.name;
        // document.getElementById('menu-parent').value = func.moduleId; // Old select
        setCustomDropdownValue(func.moduleId, 'parent'); // New custom dropdown
        document.getElementById('menu-icon').value = func.icon;
        document.getElementById('menu-path').value = func.path;
        
        setCustomDropdownValue(func.resource || '', 'resource');
        document.getElementById('menu-resource-search').value = '';
        // Removed populateResourceSelect() here - only on focus

        document.getElementById('menu-order').value = func.order;

        document.getElementById('menu-modal').classList.add('show');
    };

    window.saveMenu = function () {
        const moduleId = parseInt(document.getElementById('menu-parent').value);
        const code = document.getElementById('menu-code').value.trim();
        const name = document.getElementById('menu-name').value.trim();
        const icon = document.getElementById('menu-icon').value.trim();
        const path = document.getElementById('menu-path').value.trim();
        const resource = document.getElementById('menu-resource').value;
        const order = parseInt(document.getElementById('menu-order').value) || 0;

        if (!code || !name) {
            alert('Vui lòng nhập Mã và Tên chức năng!');
            return;
        }

        if (isEditing) {
            const index = functions.findIndex(f => f.id === currentId);
            if (index !== -1) {
                functions[index] = { ...functions[index], moduleId, code, name, icon, path, resource, order };
            }
        } else {
            // New Item
            if (moduleId === 0) {
                // Create New Module (Parent)
                const newId = modules.length > 0 ? Math.max(...modules.map(m => m.id)) + 1 : 1;
                modules.push({ id: newId, code, name, icon, path, order });
                expandedModules.add(newId);
            } else {
                // Create New Function (Child)
                const newId = functions.length > 0 ? Math.max(...functions.map(f => f.id)) + 1 : 101;
                functions.push({ id: newId, moduleId, code, name, icon, path, order });
                expandedModules.add(moduleId);
            }
        }

        renderTable(document.getElementById('menu-search').value);
        saveDataToStorage();
        closeMenuModal();
    };

    // --- Delete Confirmation ---

    let deleteType = 'function'; // 'function' or 'module'

    window.requestDeleteMenu = function (id) {
        deleteId = id;
        deleteType = 'function';
        const func = functions.find(f => f.id === id);
        const msgEl = document.getElementById('confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa chức năng <strong>${func?.name}</strong> này không?<br />Hành động này không thể hoàn tác.`;
        }
        document.getElementById('delete-confirm-modal').classList.add('show');
    };

    window.requestDeleteModule = function (id) {
        deleteId = id;
        deleteType = 'module';
        const mod = modules.find(m => m.id === id);
        const children = functions.filter(f => f.moduleId === id);
        const msgEl = document.getElementById('confirm-delete-message');
        if (msgEl) {
            let msg = `Bạn có chắc chắn muốn xóa phân hệ <strong>${mod?.name}</strong>`;
            if (children.length > 0) {
                msg += ` và <strong>${children.length}</strong> chức năng con`;
            }
            msg += ` không?<br />Hành động này không thể hoàn tác.`;
            msgEl.innerHTML = msg;
        }
        document.getElementById('delete-confirm-modal').classList.add('show');
    };

    window.closeDeleteConfirm = function () {
        deleteId = null;
        document.getElementById('delete-confirm-modal').classList.remove('show');
    };

    window.confirmDelete = function () {
        if (deleteId) {
            if (deleteType === 'module') {
                // Delete module and its children
                const index = modules.findIndex(m => m.id === deleteId);
                if (index !== -1) {
                    modules.splice(index, 1);
                    // Remove children
                    functions = functions.filter(f => f.moduleId !== deleteId);
                }
            } else {
                functions = functions.filter(f => f.id !== deleteId);
            }

            renderTable(document.getElementById('menu-search').value);
            saveDataToStorage();
            closeDeleteConfirm();
        }
    };

    // Run Init
    init();
})();