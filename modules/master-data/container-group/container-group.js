// container-group.js
(function () {
    // Default Mock Data
    const defaultData = [
        { id: 1, name: 'Pallet Gỗ Thông Thường', code: 'PL-WOOD-01', length: 1200, width: 1000, height: 150, maxWeight: 1000, description: 'Pallet gỗ kích thước chuẩn dùng cho kho thông thường, tải trọng nhẹ.' },
        { id: 2, name: 'Pallet Nhựa Chịu Tải', code: 'PL-PLASTIC-02', length: 1100, width: 1100, height: 160, maxWeight: 2000, description: 'Pallet nhựa chuyên dụng dùng cho khu vực kho lạnh, độ bền cao.' },
        { id: 3, name: 'Thùng Nhựa Lớn', code: 'BOX-PLASTIC-03', length: 800, width: 600, height: 400, maxWeight: 50, description: 'Thùng nhựa dung tích lớn để chứa các cụm chi tiết lắp ráp.' },
        { id: 4, name: 'Thùng Nhựa Tiêu Chuẩn', code: 'BOX-STD-04', length: 600, width: 400, height: 300, maxWeight: 30, description: 'Thùng nhựa vừa dùng cho linh kiện rời, dễ dàng xếp chồng.' },
        { id: 5, name: 'Lồng Sắt Lưới Lớn', code: 'CAGE-IRON-05', length: 1200, width: 1000, height: 1000, maxWeight: 1500, description: 'Lồng sắt kích thước lớn chuyên chở các hàng hóa cồng kềnh gọn gàng.' },
        { id: 6, name: 'Lồng Sắt Lưới Bé', code: 'CAGE-IRON-06', length: 800, width: 600, height: 600, maxWeight: 800, description: 'Lồng sắt nhỏ gọn chuyên dụng cho khu vực sản xuất linh kiện, phụ tùng.' },
        { id: 7, name: 'Hộp Carton Đóng Gói (Nhỏ)', code: 'CARTON-SM-07', length: 300, width: 200, height: 150, maxWeight: 10, description: 'Hộp carton nhỏ để xếp ốc vít, linh kiện điện tử bé.' },
        { id: 8, name: 'Hộp Carton Đóng Gói (Trực tiếp)', code: 'CARTON-DIR-08', length: 400, width: 300, height: 200, maxWeight: 20, description: 'Hộp carton dùng cho thành phẩm trước khi đưa ra băng chuyền.' },
        { id: 9, name: 'Kệ Sắt Di Động', code: 'RACK-MOVE-09', length: 1500, width: 800, height: 1800, maxWeight: 500, description: 'Kệ sắt có bánh xe, tiện lợi cho việc di chuyển trong các khu vực.' },
        { id: 10, name: 'Túi PP Chuyên Dụng', code: 'BAG-PP-10', length: 500, width: 500, height: 10, maxWeight: 5, description: 'Túi nhựa PP bảo bọc các chi tiết nhỏ để tránh trầy xước.' }
    ];

    let containerGroups = JSON.parse(localStorage.getItem('container_groups_data')) || [...defaultData];
    
    let cgCurrentPage = 1;
    let cgRowsPerPage = 20;
    let pendingDeleteCgId = null;
    let isBulkDelete = false;
    let selectedCgIds = new Set();

    function initContainerGroupModule() {
        console.log('initContainerGroupModule v1.0.2 (2026-04-11 12:38) running...');

        // Expose functions globally
        window.filterContainerGroups = filterContainerGroups;
        window.openContainerGroupModal = openContainerGroupModal;
        window.closeContainerGroupModal = closeContainerGroupModal;
        window.editContainerGroup = editContainerGroup;
        window.saveContainerGroup = saveContainerGroup;
        window.deleteContainerGroup = deleteContainerGroup;
        window.confirmDeleteCg = confirmDeleteCg;
        window.closeDeleteCgConfirm = closeDeleteCgConfirm;
        window.toggleAllContainerGroups = toggleAllContainerGroups;
        window.toggleCgCheckbox = toggleCgCheckbox;
        window.bulkDeleteContainerGroups = bulkDeleteContainerGroups;
        window.prevCgPage = prevCgPage;
        window.nextCgPage = nextCgPage;

        renderContainerGroups();

        // Sync horizontal scroll
        const scrollBody = document.getElementById('container-group-scroll-body');
        const scrollHead = document.querySelector('.table-scroll-head');
        if (scrollBody && scrollHead) {
            scrollBody.onscroll = () => {
                scrollHead.scrollLeft = scrollBody.scrollLeft;
            };
        }
    }

    function renderContainerGroups() {
        const tbody = document.getElementById('container-group-table-body');
        const searchInput = document.getElementById('container-group-search');
        if (!tbody) return;

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        // Filter
        const filteredData = containerGroups.filter(item =>
            (item.name && item.name.toLowerCase().includes(searchTerm)) ||
            (item.code && item.code.toLowerCase().includes(searchTerm)) ||
            (item.description && item.description.toLowerCase().includes(searchTerm))
        );

        // Pagination
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / cgRowsPerPage) || 1;

        if (cgCurrentPage > totalPages) cgCurrentPage = 1;

        const start = (cgCurrentPage - 1) * cgRowsPerPage;
        const end = start + cgRowsPerPage;
        const pagedData = filteredData.slice(start, end);

        tbody.innerHTML = '';

        if (totalItems === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 20px; color: #94a3b8;">Không tìm thấy dữ liệu</td></tr>';
            updateCgPagination(0, 0, 0);
            updateBulkDeleteButton();
            return;
        }

        pagedData.forEach((item, index) => {
            const displayIndex = start + index + 1;
            const isChecked = selectedCgIds.has(item.id);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: center;">
                    <input type="checkbox" class="cg-row-checkbox" value="${item.id}" ${isChecked ? 'checked' : ''} onchange="toggleCgCheckbox(this)" />
                </td>
                <td style="text-align: center;">${displayIndex}</td>
                <td style="text-align: center; font-weight: 600; color: #1e293b;">${item.code || '-'}</td>
                <td style="font-weight: 500;">${item.name}</td>
                <td style="text-align: center;">${item.length || '-'}</td>
                <td style="text-align: center;">${item.width || '-'}</td>
                <td style="text-align: center;">${item.height || '-'}</td>
                <td style="text-align: center; font-weight: 600; color: #0891b2;">${item.maxWeight || '-'}</td>
                <td>${item.description || '-'}</td>
                <td style="text-align: center;">
                    <button class="action-btn" title="Chỉnh sửa" onclick="editContainerGroup(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Xóa" onclick="deleteContainerGroup(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Update select all checkbox state
        const selectAllCb = document.getElementById('cg-select-all');
        if (selectAllCb) {
            const allCurrentPageChecked = pagedData.length > 0 && pagedData.every(item => selectedCgIds.has(item.id));
            selectAllCb.checked = allCurrentPageChecked;
        }

        updateCgPagination(totalItems, start + 1, Math.min(end, totalItems));
        updateBulkDeleteButton();
    }

    function updateCgPagination(total, start, end) {
        const info = document.getElementById('container-group-page-info');
        const btnPrev = document.getElementById('btn-cg-prev');
        const btnNext = document.getElementById('btn-cg-next');
        const pageContainer = document.getElementById('container-group-pages');

        if (info) info.innerText = total > 0 ? `Hiển thị ${start} - ${end} trên tổng ${total}` : 'Không có dữ liệu';

        if (btnPrev) btnPrev.disabled = cgCurrentPage === 1;
        const totalPages = Math.ceil(total / cgRowsPerPage) || 1;
        if (btnNext) btnNext.disabled = cgCurrentPage === totalPages;

        if (pageContainer) {
            pageContainer.innerHTML = '';
            // For simplicity, showing all pages if few, else a limited range will be better but we follow role module's style which shows them all
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `btn-page ${i === cgCurrentPage ? 'active' : ''}`;
                btn.innerText = i;
                btn.onclick = () => { cgCurrentPage = i; renderContainerGroups(); };
                pageContainer.appendChild(btn);
            }
        }
    }

    function filterContainerGroups() {
        cgCurrentPage = 1;
        renderContainerGroups();
    }

    // Modal Functions
    function openContainerGroupModal() {
        const modal = document.getElementById('container-group-modal');
        if (!modal) return;

        document.getElementById('container-group-id').value = '';
        document.getElementById('container-group-code').value = '';
        document.getElementById('container-group-name').value = '';
        document.getElementById('container-group-length').value = '';
        document.getElementById('container-group-width').value = '';
        document.getElementById('container-group-height').value = '';
        document.getElementById('container-group-max-weight').value = '';
        document.getElementById('container-group-desc').value = '';
        
        document.getElementById('container-group-code-error').innerText = '';
        document.getElementById('container-group-name-error').innerText = '';

        document.getElementById('container-group-modal-title').innerText = 'Thêm mới loại vật chứa';
        modal.classList.add('show');
    }

    function closeContainerGroupModal() {
        const modal = document.getElementById('container-group-modal');
        if (modal) modal.classList.remove('show');
    }

    function editContainerGroup(id) {
        const item = containerGroups.find(r => r.id === id);
        if (item) {
            document.getElementById('container-group-id').value = item.id;
            document.getElementById('container-group-code').value = item.code || '';
            document.getElementById('container-group-name').value = item.name;
            document.getElementById('container-group-length').value = item.length || '';
            document.getElementById('container-group-width').value = item.width || '';
            document.getElementById('container-group-height').value = item.height || '';
            document.getElementById('container-group-max-weight').value = item.maxWeight || '';
            document.getElementById('container-group-desc').value = item.description || '';
            
            document.getElementById('container-group-code-error').innerText = '';
            document.getElementById('container-group-name-error').innerText = '';

            document.getElementById('container-group-modal-title').innerText = 'Chỉnh sửa loại vật chứa';
            document.getElementById('container-group-modal').classList.add('show');
        }
    }

    function saveContainerGroup() {
        const id = document.getElementById('container-group-id').value;
        const code = document.getElementById('container-group-code').value.trim();
        const name = document.getElementById('container-group-name').value.trim();
        const length = parseFloat(document.getElementById('container-group-length').value) || 0;
        const width = parseFloat(document.getElementById('container-group-width').value) || 0;
        const height = parseFloat(document.getElementById('container-group-height').value) || 0;
        const maxWeight = parseFloat(document.getElementById('container-group-max-weight').value) || 0;
        const desc = document.getElementById('container-group-desc').value.trim();
        
        const codeError = document.getElementById('container-group-code-error');
        const nameError = document.getElementById('container-group-name-error');

        let hasError = false;
        codeError.innerText = '';
        nameError.innerText = '';

        if (!code) {
            codeError.innerText = 'Mã loại không được để trống';
            hasError = true;
        }
        if (!name) {
            nameError.innerText = 'Tên không được để trống';
            hasError = true;
        }

        if (hasError) return;

        const groupData = { 
            name, 
            code,
            length,
            width,
            height,
            maxWeight,
            description: desc 
        };

        if (id) {
            // Update
            const index = containerGroups.findIndex(r => r.id == id);
            if (index !== -1) {
                containerGroups[index] = { ...containerGroups[index], ...groupData };
            }
        } else {
            // Create
            const newId = containerGroups.length > 0 ? Math.max(...containerGroups.map(r => r.id)) + 1 : 1;
            containerGroups.unshift({ id: newId, ...groupData });
            // jump to first page to see new item
            cgCurrentPage = 1;
        }

        localStorage.setItem('container_groups_data', JSON.stringify(containerGroups));
        closeContainerGroupModal();
        renderContainerGroups();
        if(window.showToast) window.showToast('Lưu dữ liệu thành công!', 'success');
    }

    function deleteContainerGroup(id) {
        pendingDeleteCgId = id;
        isBulkDelete = false;
        document.getElementById('delete-cg-title').innerText = 'Xác nhận xóa';
        document.getElementById('delete-cg-message').innerHTML = 'Bạn có chắc chắn muốn xóa loại vật chứa này không?<br />Hành động này không thể hoàn tác.';
        const modal = document.getElementById('delete-cg-confirm-modal');
        if (modal) {
            modal.style.display = 'flex';
            // slight animation sync
            setTimeout(() => modal.classList.add('show'), 10);
        }
    }

    function bulkDeleteContainerGroups() {
        if (selectedCgIds.size === 0) return;
        isBulkDelete = true;
        document.getElementById('delete-cg-title').innerText = 'Xác nhận xóa hàng loạt';
        document.getElementById('delete-cg-message').innerHTML = `Bạn có chắc chắn muốn xóa ${selectedCgIds.size} loại vật chứa đã chọn không?<br />Hành động này không thể hoàn tác.`;
        const modal = document.getElementById('delete-cg-confirm-modal');
        if (modal) {
           modal.style.display = 'flex';
           setTimeout(() => modal.classList.add('show'), 10);
        }
    }

    function closeDeleteCgConfirm() {
        const modal = document.getElementById('delete-cg-confirm-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        }
        pendingDeleteCgId = null;
        isBulkDelete = false;
    }

    function confirmDeleteCg() {
        if (isBulkDelete) {
            containerGroups = containerGroups.filter(r => !selectedCgIds.has(r.id));
            selectedCgIds.clear();
            if(window.showToast) window.showToast('Xóa hàng loạt thành công!', 'success');
        } else if (pendingDeleteCgId) {
            containerGroups = containerGroups.filter(r => r.id !== pendingDeleteCgId);
            selectedCgIds.delete(pendingDeleteCgId); 
            if(window.showToast) window.showToast('Xóa loại vật chứa thành công!', 'success');
        }
        
        localStorage.setItem('container_groups_data', JSON.stringify(containerGroups));
        // Check if page became empty
        const totalItems = containerGroups.length;
        const totalPages = Math.ceil(totalItems / cgRowsPerPage) || 1;
        if (cgCurrentPage > totalPages) cgCurrentPage = totalPages;

        renderContainerGroups();
        closeDeleteCgConfirm();
    }

    // Checkbox and Bulk actions
    function toggleAllContainerGroups(source) {
        const checkboxes = document.querySelectorAll('.cg-row-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = source.checked;
            const id = parseInt(cb.value);
            if (source.checked) {
                selectedCgIds.add(id);
            } else {
                selectedCgIds.delete(id);
            }
        });
        updateBulkDeleteButton();
    }

    function toggleCgCheckbox(source) {
        const id = parseInt(source.value);
        if (source.checked) {
            selectedCgIds.add(id);
        } else {
            selectedCgIds.delete(id);
            const selectAllCb = document.getElementById('cg-select-all');
            if (selectAllCb) selectAllCb.checked = false;
        }
        updateBulkDeleteButton();
    }

    function updateBulkDeleteButton() {
        const btnBulkDelete = document.getElementById('btn-cg-bulk-delete');
        const countSpan = document.getElementById('cg-selected-count');
        if (btnBulkDelete && countSpan) {
            if (selectedCgIds.size > 0) {
                btnBulkDelete.style.display = 'inline-flex';
                countSpan.innerText = selectedCgIds.size;
            } else {
                btnBulkDelete.style.display = 'none';
            }
        }
    }

    // Pagination globals
    function prevCgPage() {
        if (cgCurrentPage > 1) {
            cgCurrentPage--;
            renderContainerGroups();
        }
    }

    function nextCgPage() {
        const searchTerm = document.getElementById('container-group-search') ? document.getElementById('container-group-search').value.toLowerCase() : '';
        const filteredData = containerGroups.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm))
        );
        const totalPages = Math.ceil(filteredData.length / cgRowsPerPage);
        if (cgCurrentPage < totalPages) {
            cgCurrentPage++;
            renderContainerGroups();
        }
    }

    // Initialize
    initContainerGroupModule();
})();
