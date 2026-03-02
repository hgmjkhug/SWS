(function() {

// --- 1. MOCK DATA ---


// Mock Data (10 items)
const NAMES = [
    'Quy trình nhập kho Tower',
    'Quy trình nhập kho Stacker Crane',
    'Quy trình xuất kho Tower theo vật tư có method FIFO',
    'Quy trình xuất kho Tower theo vật tư có method LIFO',
    'Quy trình xuất kho Tower theo vật tư có method FEFO',
    'Quy trình xuất kho Stacker crane theo vật tư có method FIFO',
    'Quy trình xuất kho Stacker crane theo vật tư có method LIFO',
    'Quy trình xuất kho Stacker crane theo vật tư có method FEFO',
    'Quy trình xuất kho kho Tower theo pallet',
    'Quy trình xuất kho kho Stacker crane theo pallet'
];

const mockWorkflows = NAMES.map((name, i) => {
    return {
        id: i + 1,
        code: `WF-${1000 + i}`,
        name: name,
        type: i < 2 ? 'IMPORT' : 'EXPORT', // Mock type based on index
        steps: Math.floor(Math.random() * 5) + 3,
        description: `Mô tả chi tiết cho quy trình ${i + 1}...`,
        isActive: true
    };
});

let workflows = [...mockWorkflows]; // Keep original name for now, will be refactored later
let currentData = [...mockWorkflows]; // Data after filtering (if any)


// --- 2. STATE ---
let filteredData = [...workflows];
const itemsPerPage = 20; // UPDATED to 20
let currentPage = 1;
let selectedIds = new Set();

let currentFilterStatus = "all";
let currentFilterType = "ALL"; // New Type Filter
let currentSearch = "";
let isEditing = false;
let pendingToggleId = null;
let confirmModal = null;

// --- 3. DOM ELEMENTS ---
// --- 3. DOM ELEMENTS ---
function getDOM() {
    return {
        tableBody: document.getElementById('tableBody'),
        searchInput: document.getElementById('searchInput'),
        statusList: document.getElementById('statusList'),
        statusSelected: document.getElementById('statusSelected'),
        selectAll: document.getElementById('selectAll'),
        paginationInfo: document.querySelector('.pagination-info'), 
        paginationControls: document.getElementById('paginationControls'),
        pageInput: document.getElementById('pageInput'),
        modal: document.getElementById('workflowModal'),
        modalTitle: document.getElementById('modalTitle'),
        form: document.getElementById('workflowForm'),
        // Form Inputs
        wfId: document.getElementById('workflowId'),
        wfCode: document.getElementById('wfCode'),
        wfName: document.getElementById('wfName'),

        wfDescription: document.getElementById('wfDescription'),
        wfActive: document.getElementById('wfActive'),
        // toolbar Dropdowns

        statusDropdown: document.getElementById('statusDropdown'),
        
        // Type Dropdown (New)
        typeDropdown: document.getElementById('typeDropdown'),
        typeSelected: document.getElementById('typeSelected'),
        typeList: document.getElementById('typeList'),

        // Modal Type Dropdown (New)
        modalTypeDropdown: document.getElementById('modalTypeDropdown'),
        modalTypeSelected: document.getElementById('modalTypeSelected'),
        modalTypeList: document.getElementById('modalTypeList'),
        wfType: document.getElementById('wfType'),

        // Confirm Popover
        confirmModal: document.getElementById('confirmModal'),
        confirmWorkflowName: document.getElementById('confirmWorkflowName')
    };
}


// --- 4. RENDER FUNCTIONS ---
function renderTable(page) {
    const dom = getDOM();
    if (!dom.tableBody) {
        console.warn("Table Body not found in DOM");
        return;
    }

    dom.tableBody.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    console.log("DEBUG: renderTable page", page);
    console.log("DEBUG: filteredData length", filteredData.length);

    if (pageData.length === 0) {
        console.warn("DEBUG: No page data to render");
        dom.tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 40px; color: #64748b;">không có dữ liệu để hiển thị</td></tr>`;
        renderPagination(); // Still call to update info/hide controls
        return;
    }

    pageData.forEach((item, index) => {
        // Sync step count from LocalStorage
        const storageKey = `workflow_steps_${item.id}`;
        const storedSteps = localStorage.getItem(storageKey);
        if (storedSteps) {
            try {
                const steps = JSON.parse(storedSteps);
                if (Array.isArray(steps)) {
                    item.steps = steps.length;
                }
            } catch (e) {
                console.error("Error parsing steps for workflow", item.id, e);
            }
        }

        const isSelected = selectedIds.has(item.id);
        const row = document.createElement('tr');

        if (isSelected) row.classList.add('selected-row');

        row.innerHTML = `
            <td class="first-col" style="text-align: center;">
                <input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''}>
            </td>
            <td style="text-align: center;">${start + index + 1}</td>
             <td style="font-weight: 600;">${item.code}</td>
            <td>${item.name}</td>
            <td style="text-align: center; font-weight: 500; color: ${item.type === 'IMPORT' ? '#2563eb' : '#16a34a'}">
                ${item.type === 'IMPORT' ? 'Nhập kho' : 'Xuất kho'}
            </td>
            <td style="text-align: center;">${item.steps || 0}</td>
            <td class="cell-truncate" style="max-width: 200px;" title="${item.description}">${item.description}</td>
            <td style="text-align: center;">
                <label class="switch">
                    <input type="checkbox" class="status-toggle" data-id="${item.id}" ${item.isActive ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </td>
            <td style="text-align: center;">
                <button class="action-btn setting-btn" title="Thiết lập quy trình" onclick="configureWorkflow(${item.id})">
                    <i class="fas fa-cog"></i>
                </button>
                <button class="action-btn edit-btn" title="Chỉnh sửa" onclick="openModal('edit', ${item.id})">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="action-btn delete-btn" title="Xóa" onclick="deleteWorkflow(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        dom.tableBody.appendChild(row);
    });

    renderPagination();
    updateSelectAll();
}

function renderPagination() {
    const dom = getDOM();
    if (!dom.paginationControls) return;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const totalRows = filteredData.length;
    const rowsPerPage = itemsPerPage;

    // Get the container to hide/show
    const container = dom.paginationControls.closest('.pagination-container');

    if (totalRows === 0) {
        if (container) container.style.display = 'none';
        return;
    } else {
        if (container) container.style.display = 'flex';
    }

    dom.paginationControls.innerHTML = '';

    // Update Info
    const info = dom.paginationInfo;
    if(info) {
        const start = (currentPage - 1) * rowsPerPage + 1;
        const end = Math.min(start + rowsPerPage - 1, totalRows);
        
        const currentCountSpan = document.getElementById('currentCount');
        const totalCountSpan = document.getElementById('totalCount');
        
        if (currentCountSpan && totalCountSpan) {
            currentCountSpan.innerText = `${start} - ${end}`;
            totalCountSpan.innerText = totalRows;
        } else {
            info.innerText = `Hiển thị ${start} - ${end} trong ${totalRows}`;
        }
    }

    // Update Jump Input
    if(dom.pageInput) {
        dom.pageInput.value = currentPage;
        dom.pageInput.max = totalPages;
    }

    // Previous Btn
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    dom.paginationControls.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => changePage(i);
        dom.paginationControls.appendChild(btn);
    }

    // Next Btn
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    nextBtn.onclick = () => changePage(currentPage + 1);
    dom.paginationControls.appendChild(nextBtn);
}

// --- 5. LOGIC FUNCTIONS ---
window.changePage = function(page) {
    currentPage = page;
    renderTable(currentPage);
};

function filterData() {
    filteredData = workflows.filter(item => {
        const matchSearch = item.code.toLowerCase().includes(currentSearch.toLowerCase()) || 
                            item.name.toLowerCase().includes(currentSearch.toLowerCase());
        const matchStatus = currentFilterStatus === 'all' || 
                            (currentFilterStatus === 'active' && item.isActive) || 
                            (currentFilterStatus === 'inactive' && !item.isActive);
        
        const matchType = currentFilterType === 'ALL' || item.type === currentFilterType;

        return matchSearch && matchStatus && matchType;
    });
    currentPage = 1;
    renderTable(currentPage);
}


// --- 6. MODAL ACTIONS ---
window.openModal = function(mode, id = null) {
    const dom = getDOM();
    isEditing = mode === 'edit';
    dom.modalTitle.textContent = isEditing ? 'Chỉnh sửa quy trình' : 'Thêm mới quy trình';
    
    if (isEditing && id) {
        const item = workflows.find(w => w.id === id);
        if (item) {
            dom.wfId.value = item.id;
            dom.wfCode.value = item.code;
            dom.wfName.value = item.name;
            dom.wfDescription.value = item.description;
            dom.wfActive.checked = item.isActive;
            
            // Set Order Type
            if (item.type) {
                 dom.wfType.value = item.type;
                 const typeMap = { 'IMPORT': 'Nhập kho', 'EXPORT': 'Xuất kho' };
                 dom.modalTypeSelected.textContent = typeMap[item.type] || 'Chọn loại lệnh';
                 
                 // Highlight selected
                 dom.modalTypeList.querySelectorAll('.dropdown-item').forEach(i => {
                     if (i.dataset.value === item.type) i.classList.add('selected');
                     else i.classList.remove('selected');
                 });
            }
        }
    } else {
        dom.form.reset();
        dom.wfId.value = '';
        
        // Reset Type
        dom.modalTypeSelected.textContent = 'Chọn loại lệnh';
        dom.wfType.value = '';
        dom.modalTypeList.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
    }

    dom.modal.classList.add('show');
};

window.closeModal = function() {
    getDOM().modal.classList.remove('show');
};

window.saveWorkflow = function() {
    const dom = getDOM();
    const id = dom.wfId.value ? parseInt(dom.wfId.value) : null;
    const code = dom.wfCode.value.trim();
    const name = dom.wfName.value.trim();
    const type = dom.wfType.value; // Get type
    
    if (!code || !name) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        return;
    }

    if (isEditing && id) {
        const idx = workflows.findIndex(w => w.id === id);
        if (idx !== -1) {
            workflows[idx] = { 
                ...workflows[idx], 
                code, 
                name, 
                type, // Update type
                steps: workflows[idx].steps || 0, 
                description: dom.wfDescription.value, 
                isActive: dom.wfActive.checked 
            };
        }
    } else {
        const newId = workflows.length > 0 ? Math.max(...workflows.map(w => w.id)) + 1 : 1;
        workflows.unshift({
            id: newId,
            code,
            name,
            type: type || 'IMPORT', // Default?
            steps: 0, 
            description: dom.wfDescription.value,
            isActive: dom.wfActive.checked
        });
    }

    closeModal();
    filterData();
};

window.deleteWorkflow = function(id) {
    const dom = getDOM();
    // Check if there are ANY selected items
    const selectedCheckboxes = dom.tableBody.querySelectorAll('.row-checkbox:checked');
    
    if (selectedCheckboxes.length > 0) {
        // If selection exists, treat this as a BULK delete, even if clicked on a specific row
        const count = selectedCheckboxes.length;
        if(confirm(`Bạn có chắc chắn muốn xóa ${count} quy trình đã chọn không?`)) {
            const idsToDelete = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
            workflows = workflows.filter(item => !idsToDelete.includes(item.id));
            
            // Clear selectedIds and update UI
            selectedIds.clear();
            filterData(); // Re-render table and pagination
        }
    } else {
        // Normal single delete
        if (confirm('Bạn có chắc chắn muốn xóa quy trình này?')) {
            const idx = workflows.findIndex(w => w.id === id);
            if (idx !== -1) {
                workflows.splice(idx, 1);
                selectedIds.delete(id); // Ensure it's removed from selectedIds if it was there
                filterData(); // Re-render table and pagination
            }
        }
    }
};

// function bulkDelete() { ... } // Removed

window.configureWorkflow = function(id) {
    // Save state for reload
    localStorage.setItem('wms_active_view', 'workflow_config');
    localStorage.setItem('wms_active_workflow_id', id);

    // 1. Update Breadcrumb
    const breadcrumb = document.getElementById('page-title'); // Corrected ID
    
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <div style="display: flex; align-items: center; font-size: 13px; text-transform: uppercase;">
                <i class="fas fa-arrow-left" onclick="if(window.tryCloseWorkflowConfig) window.tryCloseWorkflowConfig(); else { clearWorkflowConfigState(); loadPage('Danh sách Quy trình'); }" style="cursor: pointer; margin-right: 12px; color: #1e3a8a; font-size: 16px;"></i>
                <span class="breadcrumb-item" style="color: #64748b;">QUẢN LÝ LUỒNG VÀ QUY TRÌNH</span>
                <span style="margin: 0 8px; color: #94a3b8;">/</span>
                <span class="breadcrumb-item" onclick="if(window.tryCloseWorkflowConfig) window.tryCloseWorkflowConfig(); else { clearWorkflowConfigState(); loadPage('Danh sách Quy trình'); }" style="cursor: pointer; color: #64748b;">DANH SÁCH QUY TRÌNH</span>
                <span style="margin: 0 8px; color: #94a3b8;">/</span>
                <span class="breadcrumb-item active" style="font-weight: 700; color: #0f172a;">THIẾT LẬP QUY TRÌNH</span>
            </div>

        `;
    }

    // 2. Load Content
    const mainContent = document.getElementById('main-view');
    if (!mainContent) {
        console.error("Main content container 'main-view' not found!");
        return;
    }

    fetch('modules/workflow/workflow-config.html')
        .then(response => response.text())
        .then(html => {
            mainContent.innerHTML = html;
            
            // Generate basic CSS link
            if (!document.getElementById('workflow-config-css')) {
                const link = document.createElement('link');
                link.id = 'workflow-config-css';
                link.rel = 'stylesheet';
                link.href = 'modules/workflow/workflow-config.css';
                document.head.appendChild(link);
            }

            // Load JS module dynamically
             // Remove old script if exists to force reload/re-init
             const oldScript = document.getElementById('workflow-config-js');
             if(oldScript) oldScript.remove();

            const script = document.createElement('script');
            script.id = 'workflow-config-js';
            script.src = 'modules/workflow/workflow-config.js';
            script.onload = () => {
                if(window.initWorkflowConfig) {
                    const item = workflows.find(w => w.id === id);
                    const name = item ? item.name : '';
                    window.initWorkflowConfig(id, name);
                }
            };
            document.body.appendChild(script);

        })
        .catch(err => console.error('Failed to load Workflow Builder:', err));
};

// Helper to clear state
window.clearWorkflowConfigState = function() {
    localStorage.removeItem('wms_active_view');
    localStorage.removeItem('wms_active_workflow_id');
};

// RESTORE STATE ON LOAD
(function() {
    const activeView = localStorage.getItem('wms_active_view');
    const workflowId = localStorage.getItem('wms_active_workflow_id');
    
    // Only restore if we are actually in the workflow module context (which we are, since this script ran)
    // and if the view is config
    if (activeView === 'workflow_config' && workflowId) {
        
        // Prevent FOUC (Flash of Unstyled Content) - Hide the default list view immediately
        const defaultView = document.getElementById('workflow-view');
        if (defaultView) defaultView.style.display = 'none';

        // Must delay slightly to ensure DOM is ready or to override default list view
        setTimeout(() => {
            // Need to convert ID to number if stored as string but logic expects number
            // configureWorkflow uses '===', so types matter.
            // IDs seem to be numbers in mock data (e.g. 1, 2).
            const numericId = parseInt(workflowId, 10);
            configureWorkflow(numericId);
        }, 100);
    }
})();

// Toggle with Confirmation Popover
window.handleToggleRequest = function(checkbox, id) {
    const isNowChecked = checkbox.checked;
    
    // If turning OFF (was active, now inactive), ask for confirmation
    if (!isNowChecked) {
        // Revert immediately, wait for confirmation
        checkbox.checked = true;
        pendingToggleId = id;
        
        const dom = getDOM();
        confirmModal = dom.confirmModal;
        const item = workflows.find(w => w.id === id);
        dom.confirmWorkflowName.textContent = item ? item.name : '';
        
        confirmModal.classList.add('show');
        
        // Position Popover dynamically
        const switchContainer = checkbox.closest('.switch');
        const rect = switchContainer.getBoundingClientRect();
        const content = confirmModal.querySelector('.confirm-content');
        
        if (content) {
            const contentHeight = content.offsetHeight || 180;
            // Offset to the left of the switch
            content.style.left = (rect.left - 290) + 'px'; // 280 width + gap
            // Center vertically
            content.style.top = (rect.top + (rect.height / 2) - (contentHeight / 2)) + 'px';
        }
    } else {
        // If turning ON, allow it immediately
        const item = workflows.find(w => w.id === id);
        if (item) {
            item.isActive = true;
            if(window.showToast) window.showToast(`Quy trình ${item.code} đã được kích hoạt`);
        }
    }
};

window.closeConfirmModal = function() {
    const dom = getDOM();
    if (dom.confirmModal) dom.confirmModal.classList.remove('show');
    pendingToggleId = null;
};

window.confirmDisable = function() {
    if (pendingToggleId) {
        const item = workflows.find(w => w.id === pendingToggleId);
        if (item) {
            item.isActive = false;
            if(window.showToast) window.showToast(`Quy trình ${item.code} đã được ngưng sử dụng`);
            filterData(); // Refresh to update switch state
        }
        closeConfirmModal();
    }
};

// --- 7. EVENT LISTENERS ---
function init() {
    const dom = getDOM();
    
    // Search
    dom.searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        filterData();
    });

    // Dropdown Logic
    // Dropdown Logic
    const setupDropdown = (trigger, list, selected, options, onSelect) => {
        if(!trigger || !list || !selected) return;

        // Build list from options if provided
        if (options && options.length > 0) {
             list.innerHTML = options.map(opt => 
                 `<div class="dropdown-item ${opt.selected ? 'selected' : ''}" data-value="${opt.value}">${opt.text}</div>`
             ).join('');
        }

        trigger.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-dropdown').forEach(d => {
                if(d !== trigger) d.classList.remove('active');
            });
            trigger.classList.toggle('active');
        };

        list.onclick = (e) => {
            e.stopPropagation();
            const item = e.target.closest('.dropdown-item');
            if (!item) return;

            const val = item.dataset.value;
            const text = item.textContent;

            selected.textContent = text;
            selected.dataset.value = val;
            list.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            trigger.classList.remove('active');
            if(onSelect) onSelect(val);
        };
    };

    // Status Filter Dropdown
    const statusOptions = [
        { value: 'all', text: 'Tất cả trạng thái', selected: true },
        { value: 'active', text: 'Đang hoạt động' },
        { value: 'inactive', text: 'Ngưng hoạt động' }
    ];
    setupDropdown(dom.statusDropdown, dom.statusList, dom.statusSelected, statusOptions, (val) => {
        currentFilterStatus = val;
        filterData();
    });

    // Type Filter Dropdown (Options already in HTML, pass empty array)
    setupDropdown(dom.typeDropdown, dom.typeList, dom.typeSelected, [], (val) => {
        currentFilterType = val;
        filterData();
    });

    // Modal Type Dropdown
    if (dom.modalTypeDropdown) {
        dom.modalTypeDropdown.onclick = (e) => {
            e.stopPropagation();
             dom.modalTypeDropdown.classList.toggle('active');
        };

        dom.modalTypeList.onclick = (e) => {
             e.stopPropagation();
             const item = e.target.closest('.dropdown-item');
             if (!item) return;
             
             const val = item.dataset.value;
             const text = item.textContent;
             
             dom.modalTypeSelected.textContent = text;
             dom.wfType.value = val;
             
             dom.modalTypeList.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
             item.classList.add('selected');
             dom.modalTypeDropdown.classList.remove('active');
        };
    }

    document.onclick = (e) => {
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('active'));
        
        // Close confirm modal on outside click
        const confirmMdl = document.getElementById('confirmModal');
        if (confirmMdl && confirmMdl.classList.contains('show') && e.target === confirmMdl) {
            closeConfirmModal();
        }
    };

    // Table Actions Delegation
    if(dom.tableBody) {
        dom.tableBody.addEventListener('change', (e) => {
            // Toggle Status
            if (e.target.classList.contains('status-toggle')) {
                const id = parseInt(e.target.dataset.id);
                handleToggleRequest(e.target, id);
            }
            // Row Checkbox
            if (e.target.classList.contains('row-checkbox')) {
                const id = parseInt(e.target.dataset.id);
                if (e.target.checked) selectedIds.add(id);
                else selectedIds.delete(id);
                updateSelectAll();
            }
        });
    }

    // Select All
    if(dom.selectAll) {
        dom.selectAll.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageItems = filteredData.slice(start, end);
            
            pageItems.forEach(item => {
                const cb = dom.tableBody.querySelector(`.row-checkbox[data-id="${item.id}"]`);
                if (isChecked) selectedIds.add(item.id);
                else selectedIds.delete(item.id);
                if(cb) cb.checked = isChecked;
            });
        });
    }

    // Page Jump
    if(dom.pageInput) {
        dom.pageInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                const p = parseInt(dom.pageInput.value);
                if(p >= 1) changePage(p);
            }
        });
    }

    // Initial Filter
    console.log("DEBUG: Calling init()"); 
    console.log("DEBUG: Workflows count:", workflows.length);
    
    // Force a small delay to ensure rendering happens after full load
    setTimeout(() => {
        console.log("DEBUG: Executing delayed filterData");
        filterData();
    }, 100);
}

// Ensure global access for debug
window.renderWorkflowTable = () => filterData();

// function updateBulkActions() { ... } // Removed

function updateSelectAll() {
    const dom = getDOM();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredData.slice(start, end);
    
    if (pageItems.length === 0) {
        dom.selectAll.checked = false;
        return;
    }

    const allSelected = pageItems.every(i => selectedIds.has(i.id));
    dom.selectAll.checked = allSelected;
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();
