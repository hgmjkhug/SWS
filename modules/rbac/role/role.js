// role.js
(function () {
    // Default Mock Data
    const defaultRoles = [
        { id: 1, name: 'Admin', description: 'Quản trị viên hệ thống', permissions: 0 },
        { id: 2, name: 'Manager', description: 'Quản lý kho', permissions: 0 },
        { id: 3, name: 'Operator', description: 'Nhân viên vận hành kho', permissions: 0 },
        { id: 4, name: 'User', description: 'Người dùng cơ bản', permissions: 0 }
    ];

    // Load roles from localStorage or use defaults
    let roles = JSON.parse(localStorage.getItem('roles_data')) || [...defaultRoles];

    // Sync permission counts from individual role permission storage
    function syncPermissionCounts() {
        roles.forEach(role => {
            const storageKey = `role_permissions_${role.id}`;
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                const { count } = JSON.parse(savedData);
                role.permissions = count || 0;
            }
        });
        // Save synced data back
        localStorage.setItem('roles_data', JSON.stringify(roles));
    }

    let roleCurrentPage = 1;
    const roleRowsPerPage = 10;
    let pendingDeleteRoleId = null;

    function initRoleModule() {
        console.log('initRoleModule running...');
        // Sync permission counts first
        syncPermissionCounts();

        // Expose functions globally FIRST
        window.filterRoles = filterRoles;
        window.openRoleModal = openRoleModal;
        window.closeRoleModal = closeRoleModal;
        window.editRole = editRole;
        window.saveRole = saveRole;
        window.deleteRole = deleteRole;
        window.confirmDeleteRole = confirmDeleteRole;
        window.closeDeleteConfirm = closeDeleteConfirm;
        window.showPermissionDetails = showPermissionDetails;
        window.closePermissionDetailModal = closePermissionDetailModal;
        window.navigateToAssignPermission = navigateToAssignPermission;

        // Then render initial data
        renderRoles();
    }

    function renderRoles() {
        const tbody = document.getElementById('role-table-body');
        const searchInput = document.getElementById('role-search');
        if (!tbody) return;

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        // Filter first
        const filteredRoles = roles.filter(role =>
            role.name.toLowerCase().includes(searchTerm) ||
            (role.description && role.description.toLowerCase().includes(searchTerm))
        );

        // Calculate pages
        const totalItems = filteredRoles.length;
        const totalPages = Math.ceil(totalItems / roleRowsPerPage) || 1;

        if (roleCurrentPage > totalPages) roleCurrentPage = 1;

        // Slice data
        const start = (roleCurrentPage - 1) * roleRowsPerPage;
        const end = start + roleRowsPerPage;
        const pagedRoles = filteredRoles.slice(start, end);

        tbody.innerHTML = '';

        if (totalItems === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color: #94a3b8;">Không tìm thấy dữ liệu</td></tr>';
            updatePagination(0, 0, 0);
            return;
        }

        pagedRoles.forEach((role, index) => {
            const displayIndex = start + index + 1;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: center;">${displayIndex}</td>
                <td style="font-weight: 500;">${role.name}</td>
                <td style="text-align: center;">
                    <a href="#" class="permission-count" onclick="showPermissionDetails(${role.id}, '${role.name}')">
                        ${role.permissions}
                    </a>
                </td>
                <td>${role.description || '-'}</td>
                <td style="text-align: center;">
                    <button class="action-btn" title="Phân quyền" onclick="navigateToAssignPermission(${role.id})">
                        <i class="fas fa-user-cog"></i>
                    </button>
                    <button class="action-btn" title="Chỉnh sửa" onclick="editRole(${role.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Xóa" onclick="deleteRole(${role.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        updatePagination(totalItems, start + 1, Math.min(end, totalItems));
    }

    function updatePagination(total, start, end) {
        const info = document.getElementById('role-page-info');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const pageContainer = document.getElementById('role-pages');

        if (info) info.innerText = total > 0 ? `Hiển thị ${start} - ${end} trong ${total}` : 'Không có dữ liệu';

        if (btnPrev) btnPrev.disabled = roleCurrentPage === 1;
        const totalPages = Math.ceil(total / roleRowsPerPage) || 1;
        if (btnNext) btnNext.disabled = roleCurrentPage === totalPages;

        if (pageContainer) {
            pageContainer.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `btn-page ${i === roleCurrentPage ? 'active' : ''}`;
                btn.innerText = i;
                btn.onclick = () => { roleCurrentPage = i; renderRoles(); };
                pageContainer.appendChild(btn);
            }
        }
    }

    function filterRoles() {
        renderRoles();
    }

    // Modal Functions
    function openRoleModal() {
        try {
            const modal = document.getElementById('role-modal');
            if (!modal) {
                console.error('Role modal element not found');
                return;
            }

            const idInput = document.getElementById('role-id');
            const nameInput = document.getElementById('role-name');
            const descInput = document.getElementById('role-desc');
            const errorSpan = document.getElementById('role-name-error');

            if (idInput) idInput.value = '';
            if (nameInput) nameInput.value = '';
            if (descInput) descInput.value = '';
            if (errorSpan) errorSpan.innerText = '';

            document.getElementById('role-modal-title').innerText = 'Thêm mới vai trò';
            modal.classList.add('show');
        } catch (e) {
            console.error('Error opening modal:', e);
            alert('Có lỗi xảy ra khi mở modal: ' + e.message);
        }
    }

    function closeRoleModal() {
        const modal = document.getElementById('role-modal');
        if (modal) modal.classList.remove('show');
    }

    function editRole(id) {
        const role = roles.find(r => r.id === id);
        if (role) {
            document.getElementById('role-id').value = role.id;
            document.getElementById('role-name').value = role.name;
            document.getElementById('role-desc').value = role.description || '';
            document.getElementById('role-name-error').innerText = '';

            document.getElementById('role-modal-title').innerText = 'Chỉnh sửa vai trò';
            document.getElementById('role-modal').classList.add('show');
        }
    }

    function saveRole() {
        const id = document.getElementById('role-id').value;
        const name = document.getElementById('role-name').value.trim();
        const desc = document.getElementById('role-desc').value.trim();
        const errorSpan = document.getElementById('role-name-error');

        if (!name) {
            errorSpan.innerText = 'Tên vai trò không được để trống';
            return;
        }

        if (id) {
            // Update
            const index = roles.findIndex(r => r.id == id);
            if (index !== -1) {
                roles[index] = { ...roles[index], name, description: desc };
            }
        } else {
            // Create
            const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
            roles.push({ id: newId, name, description: desc, permissions: 0 });
        }

        closeRoleModal();
        renderRoles();
        showToast('Lưu dữ liệu thành công!', 'success');
    }

    function deleteRole(id) {
        pendingDeleteRoleId = id;
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.add('show');
    }

    function closeDeleteConfirm() {
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.remove('show');
        pendingDeleteRoleId = null;
    }

    function confirmDeleteRole() {
        if (pendingDeleteRoleId) {
            roles = roles.filter(r => r.id !== pendingDeleteRoleId);
            renderRoles();
            showToast('Xóa vai trò thành công!', 'success');
            closeDeleteConfirm();
        }
    }


    // Run init
    initRoleModule();

    // Pagination globals
    window.prevPage = function () {
        if (roleCurrentPage > 1) {
            roleCurrentPage--;
            renderRoles();
        }
    };

    window.nextPage = function () {
        const totalPages = Math.ceil(roles.length / roleRowsPerPage);
        if (roleCurrentPage < totalPages) {
            roleCurrentPage++;
            renderRoles();
        }
    };

    // Resource Groups Data - Synced with Chức năng module
    const resourceGroups = [
        {
            group: 'Theo dõi & Giám sát',
            resources: ['Dashboard chi tiết', 'Giám sát hoạt động', 'Giao diện kho mới']
        },
        {
            group: 'Quản lý đơn hàng',
            resources: ['Đơn hàng nhập', 'Đơn hàng xuất']
        },
        {
            group: 'Quản lý Kho',
            resources: ['Danh sách Kho', 'Quản lý lô hàng', 'Quản lý tồn kho', 'Quy cách sản phẩm', 'Quản lý vật chứa', 'Quản lý bảo trì', 'Biên bản bàn giao']
        },
        {
            group: 'Quản lý điều phối WCS',
            resources: ['Kanban WCS']
        },
        {
            group: 'Nhập kho',
            resources: ['Lệnh nhập kho']
        },
        {
            group: 'Xuất kho',
            resources: ['Lệnh xuất kho']
        },
        {
            group: 'Quản lý quy trình',
            resources: ['Quản lý quy trình']
        },
        {
            group: 'Danh mục chung',
            resources: ['Nhóm thiết bị', 'Thiết bị', 'Dòng sản phẩm', 'Nhóm sản phẩm', 'Sản phẩm', 'Quy cách', 'Loại xe', 'Nhóm vật chứa', 'Vật chứa', 'ĐƠn vị tính', 'Thị trường', 'Khách hàng', 'Loại khu vực']
        },
        {
            group: 'Báo cáo thống kê',
            resources: ['Báo cáo Nhập/Xuất']
        },
        {
            group: 'Hệ thống',
            resources: ['Tài khoản', 'Vai trò', 'Chức năng', 'Tài nguyên']
        },
        {
            group: 'Tài liệu',
            resources: ['Tài liệu hướng dẫn', 'Quy trình vận hành']
        }
    ];

    // Permission Details
    window.toggleAccordion = function (header) {
        header.classList.toggle('active');
        // Toggle all rows that belong to this group
        const groupIndex = header.dataset.group;
        const rows = document.querySelectorAll(`.group-content-${groupIndex}`);
        rows.forEach(row => {
            if (row.style.display === "table-row") {
                row.style.display = "none";
            } else {
                row.style.display = "table-row";
            }
        });
    }

    function showPermissionDetails(id, name) {
        const modal = document.getElementById('permission-detail-modal');
        const role = roles.find(r => r.id === id);
        const count = role?.permissions || 0;
        const desc = role?.description || '';

        // Update Header Info
        document.getElementById('perm-header-role').innerText = name.toUpperCase();

        // Update Info Box
        document.getElementById('perm-info-name').innerText = name.toUpperCase();

        const descEl = document.getElementById('perm-info-desc');
        if (count === 0) {
            descEl.innerHTML = `${desc} 
                <span class="custom-tooltip">
                    <i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>
                    <span class="tooltip-text">Vai trò này chưa được phân quyền</span>
                </span>`;
        } else {
            descEl.innerText = desc;
        }
        document.getElementById('perm-info-count-text').innerText = `${count} quyền được cấp`;

        // Load saved permission state from localStorage
        const storageKey = `role_permissions_${id}`;
        const savedData = localStorage.getItem(storageKey);
        let permissionState = {};
        if (savedData) {
            permissionState = JSON.parse(savedData).state || {};
        }

        const tbody = document.getElementById('permission-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        resourceGroups.forEach((group, gIndex) => {
            // 1. Render Group Header (Accordion)
            const headerRow = document.createElement('tr');
            headerRow.className = 'group-header';
            headerRow.dataset.group = gIndex;
            headerRow.onclick = function () { window.toggleAccordion(this); };
            headerRow.innerHTML = `
                <td colspan="6">
                    <i class="fas fa-chevron-right arrow-icon"></i>
                    ${group.group}
                </td>
            `;
            tbody.appendChild(headerRow);

            // 2. Render Resources
            group.resources.forEach(res => {
                const tr = document.createElement('tr');
                tr.className = `group-content-${gIndex} permission-row`;
                tr.style.display = 'none'; // Default collapsed

                // Read permission state from localStorage
                const resPerm = permissionState[res] || { view: false, add: false, edit: false, delete: false };

                const readOnlyAttr = 'onclick="return false;" style="cursor: not-allowed;"';
                const chkAll = resPerm.view && resPerm.add && resPerm.edit && resPerm.delete ? 'checked' : '';
                const chkView = resPerm.view ? 'checked' : '';
                const chkAdd = resPerm.add ? 'checked' : '';
                const chkEdit = resPerm.edit ? 'checked' : '';
                const chkDelete = resPerm.delete ? 'checked' : '';

                tr.innerHTML = `
                     <td style="width: 35%; padding-left: 40px; font-weight: 500;">${res}</td>
                     <td style="width: 10%;" class="text-center"><input type="checkbox" ${chkAll} ${readOnlyAttr}></td>
                     <td style="width: 13.75%;" class="text-center"><input type="checkbox" ${chkView} ${readOnlyAttr}></td>
                     <td style="width: 13.75%;" class="text-center"><input type="checkbox" ${chkAdd} ${readOnlyAttr}></td>
                     <td style="width: 13.75%;" class="text-center"><input type="checkbox" ${chkEdit} ${readOnlyAttr}></td>
                     <td style="width: 13.75%;" class="text-center"><input type="checkbox" ${chkDelete} ${readOnlyAttr}></td>
                `;
                tbody.appendChild(tr);
            });
        });

        modal.classList.add('show');
    }

    function closePermissionDetailModal() {
        const modal = document.getElementById('permission-detail-modal');
        if (modal) modal.classList.remove('show');
    }

    // --- PERMISSION ASSIGNMENT LOGIC (MOVED FROM permission.js) ---

    const assignmentData = [
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
            id: 5,
            name: 'Quản lý lệnh',
            children: [
                { id: 501, name: 'Quản lý lô hàng' },
                { id: 502, name: 'Lệnh nhập kho' },
                { id: 503, name: 'Lệnh xuất kho' },
                { id: 504, name: 'Kanban lệnh' }
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

    let currentEditingRoleId = null;

    function navigateToAssignPermission(id) {
        currentEditingRoleId = id;
        const role = roles.find(r => r.id === id);
        if (!role) return;

        document.getElementById('assign-header-role').innerText = role.name;
        renderAssignTable();
        loadRolePermissions(id);
        
        document.getElementById('assign-permission-modal').classList.add('show');
    }

    window.closeAssignPermissionModal = function() {
        document.getElementById('assign-permission-modal').classList.remove('show');
        currentEditingRoleId = null;
    }

    function renderAssignTable() {
        const tbody = document.getElementById('assign-permission-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        assignmentData.forEach((group, index) => {
            const hasChildren = group.children && group.children.length > 0;
            const stt = index + 1;

            // Group Row
            const trGroup = document.createElement('tr');
            trGroup.className = 'group-header expanded active';
            trGroup.innerHTML = `
                <td style="text-align: center;">${stt}</td>
                <td style="font-weight: 700;">
                    <i class="fas fa-chevron-right arrow-icon" style="transform: rotate(90deg)"></i>
                    ${group.name}
                </td>
                <td class="text-center"><input type="checkbox" onchange="toggleGroupCheckboxes(${group.id}, this.checked)"></td>
                <td></td><td></td><td></td><td></td>
            `;
            tbody.appendChild(trGroup);

            // Child Rows
            if (hasChildren) {
                group.children.forEach((child, cIndex) => {
                    const trChild = document.createElement('tr');
                    trChild.className = `assign-child-row group-${group.id}`;
                    const childStt = `${stt}.${cIndex + 1}`;

                    trChild.innerHTML = `
                        <td style="text-align: center; color: #64748b; font-size: 13px;">${childStt}</td>
                        <td style="padding-left: 40px !important;">${child.name}</td>
                        <td class="text-center"><input type="checkbox" class="cb-all" onchange="toggleRowCheckboxes(this)"></td>
                        <td class="text-center"><input type="checkbox" class="cb-perm"></td>
                        <td class="text-center"><input type="checkbox" class="cb-perm"></td>
                        <td class="text-center"><input type="checkbox" class="cb-perm"></td>
                        <td class="text-center"><input type="checkbox" class="cb-perm"></td>
                    `;
                    tbody.appendChild(trChild);
                });
            }
        });
    }

    window.toggleGroupCheckboxes = function(groupId, checked) {
        const rows = document.querySelectorAll(`.group-${groupId}`);
        rows.forEach(row => {
            row.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = checked);
        });
    }

    window.toggleRowCheckboxes = function(allCb) {
        const row = allCb.closest('tr');
        row.querySelectorAll('.cb-perm').forEach(cb => cb.checked = allCb.checked);
    }

    window.selectAllPermissions = function() {
        document.querySelectorAll('#assign-permission-table-body input[type="checkbox"]').forEach(cb => cb.checked = true);
    }

    window.deselectAllPermissions = function() {
        document.querySelectorAll('#assign-permission-table-body input[type="checkbox"]').forEach(cb => cb.checked = false);
    }

    function loadRolePermissions(roleId) {
        const storageKey = `role_permissions_${roleId}`;
        const savedData = localStorage.getItem(storageKey);
        if (!savedData) return;

        const { state } = JSON.parse(savedData);
        if (!state) return;

        const rows = document.querySelectorAll('.assign-child-row');
        rows.forEach(row => {
            const name = row.cells[1].textContent.trim();
            if (state[name]) {
                const s = state[name];
                row.querySelector('.cb-all').checked = s.all || false;
                const perms = row.querySelectorAll('.cb-perm');
                if (perms[0]) perms[0].checked = s.view || false;
                if (perms[1]) perms[1].checked = s.add || false;
                if (perms[2]) perms[2].checked = s.edit || false;
                if (perms[3]) perms[3].checked = s.delete || false;
            }
        });
    }

    window.saveAssignPermissions = function() {
        if (!currentEditingRoleId) return;

        const rows = document.querySelectorAll('.assign-child-row');
        let totalCount = 0;
        const state = {};

        rows.forEach(row => {
            const name = row.cells[1].textContent.trim();
            const allChecked = row.querySelector('.cb-all').checked;
            const perms = row.querySelectorAll('.cb-perm');
            
            const rowState = {
                all: allChecked,
                view: perms[0]?.checked || false,
                add: perms[1]?.checked || false,
                edit: perms[2]?.checked || false,
                delete: perms[3]?.checked || false
            };

            const checkedInRow = Object.values(rowState).filter(v => v === true).length;
            // Only count view, add, edit, delete (exclude 'all' if you want pure permission count)
            // But the original logic seemed to count all checked boxes including 'all'
            // Actually permission.js line 137 used `cb-perm` count.
            const permCheckboxes = row.querySelectorAll('.cb-perm');
            const checkedPerms = Array.from(permCheckboxes).filter(cb => cb.checked).length;
            totalCount += checkedPerms;

            state[name] = rowState;
        });

        const storageKey = `role_permissions_${currentEditingRoleId}`;
        localStorage.setItem(storageKey, JSON.stringify({
            count: totalCount,
            state: state
        }));

        // Update local roles array & localStorage
        const roleIndex = roles.findIndex(r => r.id == currentEditingRoleId);
        if (roleIndex !== -1) {
            roles[roleIndex].permissions = totalCount;
            localStorage.setItem('roles_data', JSON.stringify(roles));
        }

        renderRoles();
        showToast(`Đã cập nhật ${totalCount} quyền cho vai trò`, 'success');
        closeAssignPermissionModal();
    }
})();
