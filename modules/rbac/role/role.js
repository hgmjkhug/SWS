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
            resources: ['Dashboard Tổng quan', 'Dashboard Chi tiết']
        },
        {
            group: 'Quản lý Kho',
            resources: ['Danh sách Kho', 'Nhóm thiết bị', 'Thiết bị']
        },
        {
            group: 'Quản lý điều phối WCS',
            resources: ['Kanban WCS', 'Quản lý Lệnh', 'Quản lý Thiết bị', 'Lịch bảo trì thiết bị', 'Giám sát Thiết bị', 'Truy vết nhập xuất']
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
            group: 'Theo dõi tồn kho',
            resources: ['Theo dõi tồn kho']
        },
        {
            group: 'Quản lý luồng và quy trình',
            resources: ['Quản lý bước', 'Quản lý Quy trình']
        },
        {
            group: 'Master data',
            resources: ['Nhóm Vật tư', 'Danh mục Vật tư', 'Đơn vị tính', 'Danh mục Pallet']
        },
        {
            group: 'Báo cáo thống kê',
            resources: ['Báo cáo Nhập/Xuất']
        },
        {
            group: 'Hệ thống',
            resources: ['Tài khoản', 'Vai trò', 'Chức năng']
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

    // Navigate to Assign Permission Page
    function navigateToAssignPermission(id) {
        console.log('Navigating to Assign Permission for ID:', id);

        const role = roles.find(r => r.id === id);
        if (role) {
            // Save context for the Permission module to read
            localStorage.setItem('current_role_id', role.id);
            localStorage.setItem('current_role_name', role.name);

            // Use the global loadPage function (from script.js) to switch views
            if (window.loadPage) {
                window.loadPage('Phân quyền');
            } else {
                console.error('loadPage function not found!');
                alert('Lỗi: Không tìm thấy chức năng điều hướng.');
            }
        }
    }

    // Mock Save
    window.saveAssignPermission = function () {
        showToast('Cập nhật phân quyền thành công!', 'success');
    }
})();
