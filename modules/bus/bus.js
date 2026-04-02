// bus.js
(function () {
    let buses = [];
    let filteredBuses = [];
    let currentPage = 1;
    const itemsPerPage = 20;
    let pendingDeleteId = null;

    // Initialize the module
    function initBusModule() {
        loadBuses();
        
        // Expose functions globally for HTML event handlers
        window.filterBuses = filterBuses;
        window.openBusModal = openBusModal;
        window.closeBusModal = closeBusModal;
        window.saveBus = saveBus;
        window.deleteBus = deleteBus;
        window.confirmDelete = confirmDelete;
        window.closeDeleteConfirm = closeDeleteConfirm;
        window.prevPage = prevPage;
        window.nextPage = nextPage;
        window.toggleAllBuses = toggleAllBuses;
        window.updateBulkDeleteBtn = updateBulkDeleteBtn;
        window.openBulkDeleteConfirm = openBulkDeleteConfirm;
        window.confirmBulkDelete = confirmBulkDelete;

        renderBusTable();
        // Sync horizontal scrolling for the new table structure
        if (typeof window.initTableScrollSync === 'function') {
            window.initTableScrollSync();
        } else if (window.parent && typeof window.parent.initTableScrollSync === 'function') {
            window.parent.initTableScrollSync();
        }
    }

    // Load data from localStorage or use mock data
    function loadBuses() {
        const savedBuses = localStorage.getItem('wms_bus_types_v1');
        if (savedBuses) {
            buses = JSON.parse(savedBuses);
        } else {
            // Mock initial data
            const mockBuses = [
                { id: 1, code: 'BUS-45', name: 'Xe Bus 45 chỗ', desc: 'Xe khách Thaco Bluesky 120S' },
                { id: 2, code: 'BUS-29', name: 'Xe Bus 29 chỗ', desc: 'Xe khách Thaco Garden 79s' },
                { id: 3, code: 'BUS-16', name: 'Xe Bus 16 chỗ', desc: 'Xe khách Iveco Daily' },
                { id: 4, code: 'BUS-TB85', name: 'Xe Bus TB85S', desc: 'Xe khách Thaco Meadow TB85S' },
                { id: 5, code: 'BUS-G7', name: 'Xe Bus G7', desc: 'Xe khách Thaco Garden G7' },
            ];
            // Add more mock data to test pagination (20 items/page)
            for (let i = 6; i <= 45; i++) {
                mockBuses.push({
                    id: i,
                    code: `BUS-${100 + i}`,
                    name: `Loại xe Bus ${i}`,
                    desc: `Mô tả chi tiết cho loại xe bus mẫu số ${i}`
                });
            }
            buses = mockBuses;
            saveToStorage();
        }
        filteredBuses = [...buses];
    }

    function saveToStorage() {
        localStorage.setItem('wms_bus_types_v1', JSON.stringify(buses));
    }

    // Render Table
    function renderBusTable() {
        const tableBody = document.getElementById('bus-table-body');
        const searchInput = document.getElementById('bus-search');
        if (!tableBody) return;

        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        filteredBuses = buses.filter(bus => 
            bus.name.toLowerCase().includes(searchTerm) || 
            bus.code.toLowerCase().includes(searchTerm)
        );

        const totalItems = filteredBuses.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = filteredBuses.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        if (totalItems === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">Không tìm thấy dữ liệu</td></tr>`;
            updatePaginationUI(0, 0, 0);
            return;
        }

        paginatedItems.forEach((bus, index) => {
            const displayIndex = startIndex + index + 1;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-center">
                    <input type="checkbox" class="bus-checkbox" data-id="${bus.id}" onclick="updateBulkDeleteBtn()">
                </td>
                <td class="text-center">${displayIndex}</td>
                <td><strong style="color: #076EB8;">${bus.code}</strong></td>
                <td style="font-weight: 500;">${bus.name}</td>
                <td style="color: #64748b;">${bus.desc || '<i style="color: #cbd5e1">Chưa có mô tả</i>'}</td>
                <td class="text-center">
                    <button class="action-btn" onclick="openBusModal(${bus.id})" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteBus(${bus.id})" title="Xóa">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        updatePaginationUI(totalItems, startIndex + 1, Math.min(endIndex, totalItems));
        updateBulkDeleteBtn();
        const checkAll = document.getElementById('check-all');
        if (checkAll) checkAll.checked = false;
    }

    // Pagination UI
    function updatePaginationUI(total, start, end) {
        const pageInfo = document.getElementById('bus-page-info');
        const pagesContainer = document.getElementById('bus-pages');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');

        if (pageInfo) {
            pageInfo.innerText = total > 0 ? `Hiển thị ${start}-${end} trên tổng ${total}` : 'Hiển thị 0-0 trên tổng 0';
        }

        const totalPages = Math.ceil(total / itemsPerPage) || 1;
        
        if (btnPrev) btnPrev.disabled = currentPage === 1;
        if (btnNext) btnNext.disabled = currentPage === totalPages || total === 0;

        if (pagesContainer) {
            pagesContainer.innerHTML = '';
            // Display max 5 page buttons
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + 4);
            if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

            for (let i = startPage; i <= endPage; i++) {
                const btn = document.createElement('button');
                btn.className = `btn-page ${i === currentPage ? 'active' : ''}`;
                btn.innerText = i;
                btn.onclick = () => {
                    currentPage = i;
                    renderBusTable();
                };
                pagesContainer.appendChild(btn);
            }
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderBusTable();
        }
    }

    function nextPage() {
        const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderBusTable();
        }
    }

    // Filtering
    function filterBuses() {
        currentPage = 1;
        renderBusTable();
    }

    // Modal Handling
    function openBusModal(busId = null) {
        const modal = document.getElementById('bus-modal');
        const title = document.getElementById('bus-modal-title');
        const idInput = document.getElementById('bus-id');
        const codeInput = document.getElementById('bus-code');
        const nameInput = document.getElementById('bus-name');
        const descInput = document.getElementById('bus-desc');

        // Reset errors
        resetValidation();

        if (busId) {
            const bus = buses.find(b => b.id === busId);
            if (bus) {
                title.innerText = 'Chỉnh sửa loại xe';
                idInput.value = bus.id;
                codeInput.value = bus.code;
                nameInput.value = bus.name;
                descInput.value = bus.desc || '';
            }
        } else {
            title.innerText = 'Thêm mới loại xe';
            idInput.value = '';
            codeInput.value = '';
            nameInput.value = '';
            descInput.value = '';
        }

        modal.classList.add('show');
    }

    function closeBusModal() {
        const modal = document.getElementById('bus-modal');
        if (modal) modal.classList.remove('show');
    }

    function resetValidation() {
        ['bus-code', 'bus-name'].forEach(id => {
            const input = document.getElementById(id);
            const error = document.getElementById(`${id}-error`);
            if (input) input.style.borderColor = '#e2e8f0';
            if (error) error.style.display = 'none';
        });
    }

    function saveBus() {
        const id = document.getElementById('bus-id').value;
        const code = document.getElementById('bus-code').value.trim();
        const name = document.getElementById('bus-name').value.trim();
        const desc = document.getElementById('bus-desc').value.trim();

        // Validation
        let hasError = false;
        if (!code) {
            showError('bus-code', 'Mã loại xe không được để trống');
            hasError = true;
        }
        if (!name) {
            showError('bus-name', 'Tên loại xe không được để trống');
            hasError = true;
        }

        if (hasError) return;

        if (id) {
            // Update
            const index = buses.findIndex(b => b.id == id);
            if (index !== -1) {
                buses[index] = { ...buses[index], code, name, desc };
                showToast('Cập nhật loại xe thành công!', 'success');
            }
        } else {
            // Create
            const newBus = {
                id: Date.now(),
                code,
                name,
                desc
            };
            buses.unshift(newBus);
            showToast('Thêm mới loại xe thành công!', 'success');
        }

        saveToStorage();
        closeBusModal();
        renderBusTable();
    }

    function showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorMsg = document.getElementById(`${fieldId}-error`);
        if (input) input.style.borderColor = '#ef4444';
        if (errorMsg) {
            errorMsg.innerText = message;
            errorMsg.style.display = 'block';
        }
    }

    // Delete Logic
    function deleteBus(id) {
        pendingDeleteId = id;
        const bus = buses.find(b => b.id === id);
        const modal = document.getElementById('delete-confirm-modal');
        const msg = document.getElementById('confirm-message');
        
        if (msg) msg.innerHTML = `Bạn có chắc chắn muốn xóa loại xe <strong>${bus.name}</strong> không?<br>Hành động này không thể hoàn tác.`;
        if (modal) modal.style.display = 'flex';
        
        const confirmBtn = document.getElementById('btn-confirm-delete');
        if (confirmBtn) confirmBtn.onclick = confirmDelete;
    }

    function confirmDelete() {
        if (pendingDeleteId) {
            buses = buses.filter(b => b.id !== pendingDeleteId);
            saveToStorage();
            closeDeleteConfirm();
            renderBusTable();
            showToast('Đã xóa loại xe thành công!', 'success');
        }
    }

    function closeDeleteConfirm() {
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.style.display = 'none';
        pendingDeleteId = null;
    }

    // Bulk Delete
    function toggleAllBuses(checkbox) {
        const checkboxes = document.querySelectorAll('.bus-checkbox');
        checkboxes.forEach(cb => cb.checked = checkbox.checked);
        updateBulkDeleteBtn();
    }

    function updateBulkDeleteBtn() {
        const selectedCount = document.querySelectorAll('.bus-checkbox:checked').length;
        const bulkBtn = document.getElementById('btn-bulk-delete');
        const countSpan = document.getElementById('selected-count');

        if (bulkBtn && countSpan) {
            if (selectedCount > 0) {
                bulkBtn.style.display = 'flex';
                countSpan.innerText = selectedCount;
            } else {
                bulkBtn.style.display = 'none';
            }
        }
    }

    function openBulkDeleteConfirm() {
        const selectedCheckboxes = document.querySelectorAll('.bus-checkbox:checked');
        const count = selectedCheckboxes.length;
        const modal = document.getElementById('delete-confirm-modal');
        const msg = document.getElementById('confirm-message');
        
        if (msg) msg.innerHTML = `Bạn có chắc chắn muốn xóa <strong>${count}</strong> loại xe đã chọn không?<br>Hành động này không thể hoàn tác.`;
        if (modal) modal.style.display = 'flex';
        
        const confirmBtn = document.getElementById('btn-confirm-delete');
        if (confirmBtn) confirmBtn.onclick = confirmBulkDelete;
    }

    function confirmBulkDelete() {
        const selectedIds = Array.from(document.querySelectorAll('.bus-checkbox:checked')).map(cb => parseInt(cb.dataset.id));
        if (selectedIds.length > 0) {
            buses = buses.filter(b => !selectedIds.includes(b.id));
            saveToStorage();
            closeDeleteConfirm();
            renderBusTable();
            showToast(`Đã xóa ${selectedIds.length} loại xe thành công!`, 'success');
        }
    }

    // Simple Toast Helper
    function showToast(message, type = 'success') {
        if (window.parent && window.parent.showToast) {
            window.parent.showToast(message, type);
        } else if (window.showToast) {
            window.showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Start everything
    initBusModule();
})();
