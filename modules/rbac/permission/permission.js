// permission.js

// Mock Data Structure - Synced with Chức năng module
var permissionData = [
    {
        id: 1,
        name: 'Theo dõi & Giám sát',
        children: [
            { id: 101, name: 'Dashboard chi tiết' },
            { id: 102, name: 'Giám sát hoạt động' }
        ]
    },
    {
        id: 3,
        name: 'Quản lý kho',
        children: [
            { id: 301, name: 'Quản lý kho' },
            { id: 302, name: 'Loại khu vực' }
        ]
    },
    {
        id: 4,
        name: 'Quản lý điều phối WCS',
        children: [
            { id: 401, name: 'Kanban lệnh' }
        ]
    },
    {
        id: 5,
        name: 'Quản lý lệnh',
        children: [
            { id: 501, name: 'Quản lý lô hàng' },
            { id: 502, name: 'Lệnh nhập kho' },
            { id: 503, name: 'Lệnh xuất kho' }
        ]
    },
    {
        id: 6,
        name: 'Quản lý thiết bị',
        children: [
            { id: 601, name: 'Quản lý thiết bị' },
            { id: 602, name: 'Quản lý bảo trì' }
        ]
    },
    {
        id: 7,
        name: 'Quản lý quy trình',
        children: [
            { id: 701, name: 'Quản lý quy trình' }
        ]
    },
    {
        id: 8,
        name: 'Danh mục chung',
        children: [
            { id: 801, name: 'Nhóm thiết bị' },
            { id: 802, name: 'Dòng sản phẩm' },
            { id: 803, name: 'Nhóm sản phẩm' },
            { id: 804, name: 'Sản phẩm' },
            // { id: 805, name: 'Xưởng đóng gói' },
            { id: 806, name: 'Quy cách' },
            { id: 807, name: 'Nhóm vật chứa' },
            { id: 808, name: 'Vật chứa' },
            { id: 809, name: 'Đơn vị tính' },
            { id: 810, name: 'Thị trường' }
        ]
    },
    {
        id: 9,
        name: 'Báo cáo thống kê',
        children: [
            { id: 901, name: 'Theo dõi tồn kho' },
            { id: 902, name: 'Báo cáo Nhập/Xuất' }
        ]
    },
    {
        id: 10,
        name: 'Hệ thống',
        children: [
            { id: 1001, name: 'Tài khoản' },
            { id: 1002, name: 'Vai trò' },
            { id: 1003, name: 'Chức năng' },
            { id: 1004, name: 'Tài nguyên' }
        ]
    },
    {
        id: 11,
        name: 'Tài liệu',
        children: [
            { id: 1101, name: 'Quản lý tài liệu' }
        ]
    }
];

function setupGlobalButtons() {
    const btnSelectAll = document.getElementById('btn-select-all');
    const btnDeselectAll = document.getElementById('btn-deselect-all');
    const btnSave = document.querySelector('.btn-save');

    if (btnSelectAll) {
        btnSelectAll.addEventListener('click', () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        });
    }

    if (btnDeselectAll) {
        btnDeselectAll.addEventListener('click', () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        });
    }

    if (btnSave) {
        btnSave.addEventListener('click', savePermissions);
    }
}

// Save permissions to localStorage
function savePermissions() {
    const roleId = localStorage.getItem('current_role_id');
    if (!roleId) {
        showToast('Không tìm thấy vai trò để lưu quyền!', 'error');
        return;
    }

    // Collect all checked permissions from child rows
    const childRows = document.querySelectorAll('.child-row');
    let permissionCount = 0;
    const permissionState = {};

    childRows.forEach(row => {
        const rowName = row.querySelector('.col-name')?.textContent?.trim();
        if (!rowName) return;

        const permCheckboxes = row.querySelectorAll('.cb-perm');
        const checkedPerms = Array.from(permCheckboxes).filter(cb => cb.checked).length;
        permissionCount += checkedPerms;

        // Save state for each row
        permissionState[rowName] = {
            all: row.querySelector('.cb-all')?.checked || false,
            view: permCheckboxes[0]?.checked || false,
            add: permCheckboxes[1]?.checked || false,
            edit: permCheckboxes[2]?.checked || false,
            delete: permCheckboxes[3]?.checked || false
        };
    });

    // Save to localStorage
    const storageKey = `role_permissions_${roleId}`;
    localStorage.setItem(storageKey, JSON.stringify({
        count: permissionCount,
        state: permissionState
    }));

    // Update roles localStorage
    const rolesData = JSON.parse(localStorage.getItem('roles_data') || '[]');
    const roleIndex = rolesData.findIndex(r => r.id == roleId);
    if (roleIndex !== -1) {
        rolesData[roleIndex].permissions = permissionCount;
        localStorage.setItem('roles_data', JSON.stringify(rolesData));
    }

    showToast(`Lưu phân quyền thành công! (${permissionCount} quyền)`, 'success');
}


// Load saved permissions when page loads
function loadSavedPermissions() {
    const roleId = localStorage.getItem('current_role_id');
    if (!roleId) return;

    const storageKey = `role_permissions_${roleId}`;
    const savedData = localStorage.getItem(storageKey);
    if (!savedData) return;

    const { state } = JSON.parse(savedData);
    if (!state) return;

    // Apply saved state to checkboxes
    const childRows = document.querySelectorAll('.child-row');
    childRows.forEach(row => {
        const rowName = row.querySelector('.col-name')?.textContent?.trim();
        if (!rowName || !state[rowName]) return;

        const savedState = state[rowName];
        const allCb = row.querySelector('.cb-all');
        const permCheckboxes = row.querySelectorAll('.cb-perm');

        if (allCb) allCb.checked = savedState.all;
        if (permCheckboxes[0]) permCheckboxes[0].checked = savedState.view;
        if (permCheckboxes[1]) permCheckboxes[1].checked = savedState.add;
        if (permCheckboxes[2]) permCheckboxes[2].checked = savedState.edit;
        if (permCheckboxes[3]) permCheckboxes[3].checked = savedState.delete;
    });
}

function renderPermissionTable() {
    const tbody = document.getElementById('permission-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    permissionData.forEach((group, index) => {
        const hasChildren = group.children && group.children.length > 0;
        const stt = index + 1;

        // 1. Render Group Row
        const trGroup = document.createElement('tr');
        trGroup.className = 'group-row expanded';
        trGroup.dataset.groupId = group.id;
        trGroup.onclick = (e) => toggleGroup(group.id, e);

        // Group Handlers (Stop propagation)
        // Col 2 is "All"
        const chkAttr = 'onclick="event.stopPropagation()"';
        const groupAllHandler = `onchange="toggleGroupAll(${group.id}, this.checked)"`;

        trGroup.innerHTML = `
            <td class="col-stt" style="text-align: center;">${stt}</td>
            <td class="col-name">
                ${hasChildren ? '<i class="fas fa-chevron-right toggle-icon"></i>' : ''}
                ${group.name}
            </td>
            <td class="col-action"><input type="checkbox" ${chkAttr} ${groupAllHandler}></td>
            <td class="col-action"></td>
            <td class="col-action"></td>
            <td class="col-action"></td>
            <td class="col-action"></td>
        `;
        tbody.appendChild(trGroup);

        // 2. Render Children
        if (hasChildren) {
            group.children.forEach((child, cIndex) => {
                const trChild = document.createElement('tr');
                trChild.className = `child-row group-child-${group.id}`;
                trChild.style.display = 'table-row';

                const childStt = `${stt}.${cIndex + 1}`;

                // Child Row "All" Logic
                // If "All" (index 0 of checkboxes) is checked -> check others
                const childId = `${group.id}-${child.id}`;
                const rowAllHandler = `onchange="toggleRowAll(this)"`;

                trChild.innerHTML = `
                    <td class="col-stt" style="text-align: center;">${childStt}</td>
                    <td class="col-name" style="padding-left: 40px !important;">${child.name}</td>
                    <td class="col-action"><input type="checkbox" class="cb-all" ${rowAllHandler}></td>
                    <td class="col-action"><input type="checkbox" class="cb-perm"></td>
                    <td class="col-action"><input type="checkbox" class="cb-perm"></td>
                    <td class="col-action"><input type="checkbox" class="cb-perm"></td>
                    <td class="col-action"><input type="checkbox" class="cb-perm"></td>
                `;
                tbody.appendChild(trChild);
            });
        }
    });

    // Initialize toggle icons
    document.querySelectorAll('.group-row.expanded .toggle-icon').forEach(icon => {
        icon.style.transform = 'rotate(90deg)';
    });
}

function toggleGroupAll(groupId, isChecked) {
    const childRows = document.querySelectorAll(`.group-child-${groupId}`);
    childRows.forEach(row => {
        row.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = isChecked);
    });
}

function toggleRowAll(checkbox) {
    const row = checkbox.closest('tr');
    if (row) {
        row.querySelectorAll('.cb-perm').forEach(cb => cb.checked = checkbox.checked);
    }
}


function toggleGroup(groupId, event) {
    // If click originated from a checkbox, don't toggle.
    // (Handled by stopPropagation in HTML, but double check target safety)
    if (event.target.type === 'checkbox') return;

    const groupRow = document.querySelector(`.group-row[data-group-id="${groupId}"]`);
    const childRows = document.querySelectorAll(`.group-child-${groupId}`);
    const icon = groupRow.querySelector('.toggle-icon');

    const isExpanded = groupRow.classList.contains('expanded');

    if (isExpanded) {
        // Collapse
        groupRow.classList.remove('expanded');
        childRows.forEach(row => row.style.display = 'none');
        if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
        // Expand
        groupRow.classList.add('expanded');
        childRows.forEach(row => row.style.display = 'table-row');
        if (icon) icon.style.transform = 'rotate(90deg)';
    }
}

function init() {
    renderPermissionTable();
    setupGlobalButtons();
    loadSavedPermissions();
    
    // Display current role name in header-left with info-banner style
    const roleName = localStorage.getItem('current_role_name');
    const headerLeft = document.querySelector('.header-left');
    if (roleName && headerLeft) {
        headerLeft.innerHTML = `
            <div class="info-banner">
                <i class="fas fa-info-circle"></i>
                <span>Vai trò: <strong>${roleName}</strong></span>
            </div>
        `;
    }

    // NEW: Horizontal Scroll Sync
    const scrollBody = document.querySelector('.table-scroll-body');
    const scrollHead = document.querySelector('.table-scroll-head');
    
    if (scrollBody && scrollHead) {
        scrollBody.addEventListener('scroll', () => {
            scrollHead.scrollLeft = scrollBody.scrollLeft;
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}