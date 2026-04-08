(function () {
    // Mock Data
    let nodeTypes = [];
    for (let i = 1; i <= 45; i++) {
        nodeTypes.push({
            id: i,
            code: `LKV${i.toString().padStart(3, '0')}`,
            name: `Loại khu vực ${i}`,
            image: i % 2 === 0 ? 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlMmU4ZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTBweCIgZmlsbD0iIzk0YTNiOCI+VjwvdGV4dD48L3N2Zz4=' : ''
        });
    }

    let selectedIds = [];
    let currentPage = 1;
    const itemsPerPage = 20;
    let filteredData = [];
    let pendingDeleteNodeTypeIds = [];
    let isInitialized = false;

    // Initialize
    function initNodeTypeModule() {
        if (isInitialized) return;
        const tbody = document.getElementById('node-type-table-body');
        if (!tbody) return;

        isInitialized = true;
        renderTable();

        // Search listener
        const searchInput = document.getElementById('node-type-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentPage = 1;
                renderTable(e.target.value);
            });
        }
    }

    const observer = new MutationObserver((mutations) => {
        if (document.getElementById('node-type-table-body')) {
            initNodeTypeModule();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Register cleanup function
    window.destroyModule = function() {
        console.log('Cleaning up Node Type module...');
        if (observer) {
            observer.disconnect();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNodeTypeModule);
    } else {
        initNodeTypeModule();
    }

    // Render Table
    function renderTable(keyword = '') {
        const tbody = document.getElementById('node-type-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        selectedIds = [];
        updateBulkDeleteBtn();
        const selectAll = document.getElementById('node-type-select-all');
        if (selectAll) selectAll.checked = false;

        const term = keyword.toLowerCase().trim();
        filteredData = nodeTypes.filter(item => 
            item.name.toLowerCase().includes(term) || 
            (item.code && item.code.toLowerCase().includes(term))
        );

        // Calculate Pagination
        const totalItems = filteredData.length;
        let totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startItem = (currentPage - 1) * itemsPerPage;
        const endItem = Math.min(startItem + itemsPerPage, totalItems);
        const pageData = filteredData.slice(startItem, endItem);

        // Render Pagination Info
        const infoEl = document.getElementById('node-type-pagination-info');
        if (infoEl) {
            if (totalItems === 0) {
                infoEl.innerText = 'Không có dữ liệu';
            } else {
                infoEl.innerText = `Hiển thị ${startItem + 1} - ${endItem} trong ${totalItems}`;
            }
        }

        renderPaginationControls(totalPages);

        if (totalItems === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">Không tìm thấy loại khu vực nào</td></tr>';
            return;
        }

        pageData.forEach((item, index) => {
            const stt = startItem + index + 1;
            const tr = document.createElement('tr');
            
            const imageHtml = item.image 
                ? `<img src="${item.image}" alt="${item.name}" class="node-type-thumbnail" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlMmU4ZjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTBweCIgZmlsbD0iIzk0YTNiOCI+RXJyPC90ZXh0Pjwvc3ZnPg==';"/>`
                : `<div class="node-type-thumbnail" style="display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size: 12px; text-align:center; line-height: 1.2;">No img</div>`;

            tr.innerHTML = `
                <td style="text-align:center">
                    <input type="checkbox" class="node-type-row-checkbox" value="${item.id}" onclick="toggleNodeTypeRow(${item.id})">
                </td>
                <td style="text-align:center">${stt}</td>
                <td style="font-weight:500;">${item.code}</td>
                <td style="font-weight:500;">${item.name}</td>
                <td>${imageHtml}</td>
                <td style="text-align:center">
                    <div class="action-buttons" style="justify-content:center">
                        <div class="action-icon" onclick="openNodeTypeEditModal(${item.id})" title="Chỉnh sửa"><i class="fas fa-edit"></i></div>
                        <div class="action-icon delete" onclick="deleteNodeTypeItem(${item.id})" title="Xóa"><i class="fas fa-trash"></i></div>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderPaginationControls(totalPages) {
        const prevBtn = document.getElementById('node-type-prev-btn');
        const nextBtn = document.getElementById('node-type-next-btn');
        const pageNumbers = document.getElementById('node-type-page-numbers');

        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;

        if (pageNumbers) {
            let html = '';
            // Display up to 5 page numbers
            let startP = Math.max(1, currentPage - 2);
            let endP = Math.min(totalPages, startP + 4);
            if (endP - startP < 4) {
                startP = Math.max(1, endP - 4);
            }
            
            for (let i = startP; i <= endP; i++) {
                html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToNodeTypePage(${i})">${i}</button>`;
            }
            pageNumbers.innerHTML = html;
        }
    }

    // Window global functions for pagination
    window.prevNodeTypePage = function () {
        if (currentPage > 1) {
            currentPage--;
            renderTable(document.getElementById('node-type-search-input')?.value || '');
        }
    };

    window.nextNodeTypePage = function () {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable(document.getElementById('node-type-search-input')?.value || '');
        }
    };

    window.goToNodeTypePage = function (page) {
        if (typeof page === 'string') {
            page = parseInt(page);
        }
        
        const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
        if (isNaN(page) || page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        
        currentPage = page;
        renderTable(document.getElementById('node-type-search-input')?.value || '');
        
        const pageInput = document.getElementById('node-type-page-input');
        if (pageInput) pageInput.value = '';
    };

    // Modals
    window.openNodeTypeAddModal = function () {
        document.getElementById('node-type-modal-title').innerText = 'Thêm mới loại khu vực';
        document.getElementById('node-type-id').value = '';
        document.getElementById('node-type-name').value = '';
        document.getElementById('node-type-image').value = '';
        
        // Reset image preview
        const preview = document.getElementById('node-type-image-preview');
        if (preview) {
            preview.src = '';
            preview.style.display = 'none';
        }
        
        document.getElementById('node-type-modal').classList.add('show');
    };

    window.openNodeTypeEditModal = function (id) {
        const item = nodeTypes.find(d => d.id === id);
        if (!item) return;

        document.getElementById('node-type-modal-title').innerText = 'Cập nhật Loại khu vực';
        document.getElementById('node-type-id').value = item.id;
        document.getElementById('node-type-code').value = item.code;
        document.getElementById('node-type-name').value = item.name;
        document.getElementById('node-type-image').value = ''; // Reset file input
        
        // Show current image in preview box
        const preview = document.getElementById('node-type-image-preview');
        if (preview) {
            if (item.image) {
                preview.src = item.image;
                preview.style.display = 'block';
            } else {
                preview.src = '';
                preview.style.display = 'none';
            }
        }
        
        document.getElementById('node-type-modal').classList.add('show');
    };

    window.closeNodeTypeModal = function () {
        document.getElementById('node-type-modal').classList.remove('show');
    };

    window.saveNodeType = function () {
        const id = document.getElementById('node-type-id').value;
        const code = document.getElementById('node-type-code').value.trim();
        const name = document.getElementById('node-type-name').value.trim();
        const imageInput = document.getElementById('node-type-image');
        
        // Handle file image preview for mock
        let image = '';
        if (imageInput.files && imageInput.files[0]) {
            image = URL.createObjectURL(imageInput.files[0]);
        }

        if (!code) {
            if (typeof showToast === 'function') showToast('Vui lòng nhập Mã loại khu vực', 'error');
            else alert('Vui lòng nhập Mã loại khu vực');
            return;
        }

        if (!name) {
            if (typeof showToast === 'function') showToast('Vui lòng nhập Tên loại khu vực', 'error');
            else alert('Vui lòng nhập Tên loại khu vực');
            return;
        }

        if (id) {
            // Update
            const index = nodeTypes.findIndex(d => d.id == id);
            if (index !== -1) {
                // Only update image if a new one is uploaded, otherwise keep old
                const newImg = image ? image : nodeTypes[index].image;
                nodeTypes[index] = { ...nodeTypes[index], code, name, image: newImg };
                if (typeof showToast === 'function') showToast('Cập nhật thành công');
            }
        } else {
            // Create
            const newId = nodeTypes.length > 0 ? Math.max(...nodeTypes.map(d => d.id)) + 1 : 1;
            nodeTypes.unshift({ id: newId, code, name, image }); // Thêm lên đầu danh sách
            if (typeof showToast === 'function') showToast('Thêm mới thành công');
            currentPage = 1;
        }

        closeNodeTypeModal();
        renderTable(document.getElementById('node-type-search-input')?.value || '');
    };
    
    // Image Preview logic
    window.previewNodeTypeImage = function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const preview = document.getElementById('node-type-image-preview');
                if (preview) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    };

    // Checkboxes
    window.toggleSelectAllNodeTypes = function () {
        const isChecked = document.getElementById('node-type-select-all').checked;
        const checkboxes = document.querySelectorAll('.node-type-row-checkbox');
        selectedIds = [];

        checkboxes.forEach(cb => {
            cb.checked = isChecked;
            if (isChecked) selectedIds.push(parseInt(cb.value));
        });
        updateBulkDeleteBtn();
    };

    window.toggleNodeTypeRow = function (id) {
        const checkbox = document.querySelector(`.node-type-row-checkbox[value="${id}"]`);
        if (checkbox && checkbox.checked) {
            selectedIds.push(id);
        } else {
            selectedIds = selectedIds.filter(idx => idx !== id);
        }
        
        // Update select all checkbox state
        const selectAll = document.getElementById('node-type-select-all');
        const checkboxes = document.querySelectorAll('.node-type-row-checkbox');
        if (selectAll && checkboxes.length > 0) {
            selectAll.checked = selectedIds.length === checkboxes.length;
        }

        updateBulkDeleteBtn();
    };

    function updateBulkDeleteBtn() {
        const btn = document.getElementById('node-type-bulk-delete-btn');
        const countSpan = document.getElementById('node-type-selected-count');
        if (countSpan) countSpan.innerText = selectedIds.length;
        if (btn) btn.disabled = selectedIds.length === 0;
    }

    // Delete Modals
    window.deleteNodeTypeItem = function (id) {
        pendingDeleteNodeTypeIds = [id];
        const item = nodeTypes.find(d => d.id === id);
        const msgEl = document.getElementById('node-type-confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa loại khu vực <strong>${item?.name}</strong> không?<br />Hành động này không thể hoàn tác.`;
        }
        const modal = document.getElementById('node-type-delete-confirm-modal');
        if (modal) modal.classList.add('show');
    };

    window.closeNodeTypeDeleteConfirm = function () {
        const modal = document.getElementById('node-type-delete-confirm-modal');
        if (modal) modal.classList.remove('show');
        pendingDeleteNodeTypeIds = [];
    };

    window.confirmDeleteNodeType = function () {
        if (pendingDeleteNodeTypeIds.length > 0) {
            nodeTypes = nodeTypes.filter(d => !pendingDeleteNodeTypeIds.includes(d.id));
            
            // Re-render check if active page gets empty
            const term = document.getElementById('node-type-search-input')?.value.toLowerCase().trim() || '';
            const testFiltered = nodeTypes.filter(item => item.name.toLowerCase().includes(term));
            const newTotalPages = Math.ceil(testFiltered.length / itemsPerPage) || 1;
            if (currentPage > newTotalPages) {
                currentPage = newTotalPages;
            }

            renderTable(document.getElementById('node-type-search-input')?.value || '');
            if (typeof showToast === 'function') {
                showToast(`Đã xóa thành công ${pendingDeleteNodeTypeIds.length} loại khu vực`);
            }
            closeNodeTypeDeleteConfirm();
            
            // Clear selection if they were deleted
            selectedIds = selectedIds.filter(id => !pendingDeleteNodeTypeIds.includes(id));
            updateBulkDeleteBtn();
        }
    };

    window.deleteSelectedNodeTypes = function () {
        if (selectedIds.length === 0) return;

        pendingDeleteNodeTypeIds = selectedIds;
        const msgEl = document.getElementById('node-type-confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa <strong>${selectedIds.length}</strong> loại khu vực đã chọn không?<br />Hành động này không thể hoàn tác.`;
        }
        const modal = document.getElementById('node-type-delete-confirm-modal');
        if (modal) modal.classList.add('show');
    };

})();
