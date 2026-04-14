// Encapsulate in IIFE to avoid global scope pollution and re-declaration errors
(function () {

    // Mock Data
    // Mock Data - Kho Cơ Khí (Expanded to 30 items)



    // Mock Data - Kho Cơ Khí (Expanded to 30 items) with updated Warehouse codes
    // Mock Data - Kho Cơ Khí (Expanded to 45 items)
    var categories = [
        // Chuối Trung Quốc/ Chinese bananas
        { id: 1, code: 'A456', name: 'Chuối Trung Quốc - A456', productLine: 'Chuối Trung Quốc/ Chinese bananas', description: 'Phân cấp A456 cho Chuối Trung Quốc' },
        { id: 2, code: 'A789', name: 'Chuối Trung Quốc - A789', productLine: 'Chuối Trung Quốc/ Chinese bananas', description: 'Phân cấp A789 cho Chuối Trung Quốc' },
        { id: 3, code: 'B456', name: 'Chuối Trung Quốc - B456', productLine: 'Chuối Trung Quốc/ Chinese bananas', description: 'Phân cấp B456 cho Chuối Trung Quốc' },
        { id: 4, code: 'B789', name: 'Chuối Trung Quốc - B789', productLine: 'Chuối Trung Quốc/ Chinese bananas', description: 'Phân cấp B789 cho Chuối Trung Quốc' },
        { id: 5, code: 'CL', name: 'Chuối Trung Quốc - CL', productLine: 'Chuối Trung Quốc/ Chinese bananas', description: 'Phân cấp CL cho Chuối Trung Quốc' },
        { id: 6, code: '16CP', name: 'Chuối Trung Quốc - 16CP', productLine: 'Chuối Trung Quốc/ Chinese bananas', description: 'Phân cấp 16CP cho Chuối Trung Quốc' },
        { id: 7, code: 'CP', name: 'Chuối Trung Quốc - CP', productLine: 'Chuối Trung Quốc/ Chinese bananas', description: 'Phân cấp CP cho Chuối Trung Quốc' },

        // Chuối Nhật Bản/ Japanese bananas
        { id: 8, code: '14CP', name: 'Chuối Nhật Bản - 14CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 14CP cho Chuối Nhật Bản' },
        { id: 9, code: '16CP', name: 'Chuối Nhật Bản - 16CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 16CP cho Chuối Nhật Bản' },
        { id: 10, code: '26CP', name: 'Chuối Nhật Bản - 26CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 26CP cho Chuối Nhật Bản' },
        { id: 11, code: '35CLD', name: 'Chuối Nhật Bản - 35CLD', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 35CLD cho Chuối Nhật Bản' },
        { id: 12, code: '18CP', name: 'Chuối Nhật Bản - 18CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 18CP cho Chuối Nhật Bản' },
        { id: 13, code: '28CP', name: 'Chuối Nhật Bản - 28CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 28CP cho Chuối Nhật Bản' },
        { id: 14, code: '30CP', name: 'Chuối Nhật Bản - 30CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 30CP cho Chuối Nhật Bản' },
        { id: 15, code: '36CP', name: 'Chuối Nhật Bản - 36CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 36CP cho Chuối Nhật Bản' },
        { id: 16, code: '38CP', name: 'Chuối Nhật Bản - 38CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 38CP cho Chuối Nhật Bản' },
        { id: 17, code: '40CP', name: 'Chuối Nhật Bản - 40CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 40CP cho Chuối Nhật Bản' },
        { id: 18, code: '43CP', name: 'Chuối Nhật Bản - 43CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 43CP cho Chuối Nhật Bản' },
        { id: 19, code: 'B5', name: 'Chuối Nhật Bản - B5', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp B5 cho Chuối Nhật Bản' },
        { id: 20, code: 'B6', name: 'Chuối Nhật Bản - B6', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp B6 cho Chuối Nhật Bản' },
        { id: 21, code: '33CP', name: 'Chuối Nhật Bản - 33CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 33CP cho Chuối Nhật Bản' },
        { id: 22, code: '28LY', name: 'Chuối Nhật Bản - 28LY', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 28LY cho Chuối Nhật Bản' },
        { id: 23, code: '35CP', name: 'Chuối Nhật Bản - 35CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 35CP cho Chuối Nhật Bản' },
        { id: 24, code: 'RCL', name: 'Chuối Nhật Bản - RCL', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp RCL cho Chuối Nhật Bản' },
        { id: 25, code: '6 NẢI', name: 'Chuối Nhật Bản - 6 NẢI', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 6 NẢI cho Chuối Nhật Bản' },
        { id: 26, code: '7 NẢI', name: 'Chuối Nhật Bản - 7 NẢI', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 7 NẢI cho Chuối Nhật Bản' },
        { id: 27, code: '8 NẢI', name: 'Chuối Nhật Bản - 8 NẢI', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 8 NẢI cho Chuối Nhật Bản' },
        { id: 28, code: '10CP', name: 'Chuối Nhật Bản - 10CP', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 10CP cho Chuối Nhật Bản' },
        { id: 29, code: '28H', name: 'Chuối Nhật Bản - 28H', productLine: 'Chuối Nhật Bản/ Japanese bananas', description: 'Phân cấp 28H cho Chuối Nhật Bản' }
    ];


    var filteredData = [...categories];
    var currentPage = 1;
    const ITEMS_PER_PAGE = 20;
    var pendingDeleteCategoryIds = [];

    // Init
    function initCategoryModule() {
        renderCategories();
    }


    // Global Exports
    window.initCategoryModule = initCategoryModule;
    window.checkSelection = checkSelection;
    window.openCategoryModal = openCategoryModal;
    window.deleteCategory = deleteCategory;
    window.toggleAll = toggleAll;
    window.deleteSelected = deleteSelected;
    window.prevPage = prevPage;
    window.nextPage = nextPage;
    window.gotoPage = gotoPage;
    window.filterCategories = filterCategories;
    window.closeCategoryModal = closeCategoryModal;
    window.saveCategory = saveCategory;

    window.closeDeleteConfirm = closeDeleteConfirm;
    window.confirmDeleteCategory = confirmDeleteCategory;

    window.exportExcel = exportExcel;
    window.importExcel = importExcel;
    window.syncData = syncData;

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

    // ... (renderCategories) ...
    function renderCategories() {
        const tbody = document.getElementById('category-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageData = filteredData.slice(start, end);

        updatePagination();

        if (pageData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px; color: #64748b;">Không tìm thấy dữ liệu</td></tr>';
            return;
        }

        pageData.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td><input type="checkbox" class="cat-check" value="${item.id}" onchange="checkSelection()"></td>
            <td>${start + idx + 1}</td>
            <td style="font-weight: 500; color: #0f172a;">${item.code}</td>
            <td><div class="text-truncate" style="font-weight: 500; color: #0f172a;" title="${item.name}">${item.name}</div></td>
            <td style="color: #64748b;">${item.productLine || ''}</td>
            <td><div class="text-truncate" style="color: #64748b;" title="${item.description}">${item.description}</div></td>
            <td>
                <div style="display: flex; gap: 4px; justify-content: center;">
                    <div class="action-icon" title="Sửa" onclick="openCategoryModal(${item.id})"><i class="fas fa-edit"></i></div>
                    <div class="action-icon delete" title="Xóa" onclick="deleteCategory(${item.id})"><i class="fas fa-trash"></i></div>
                </div>
            </td>
        `;
            tbody.appendChild(tr);
        });
    }

    function updatePagination() {
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

        const infoEl = document.getElementById('pagination-info');
        if (infoEl) infoEl.innerText = `Hiển thị ${start} - ${end} trong ${totalItems}`;

        const pageNumbersDiv = document.getElementById('page-numbers');
        if (pageNumbersDiv) {
            pageNumbersDiv.innerHTML = '';
            const maxVisible = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let endPage = Math.min(totalPages, startPage + maxVisible - 1);
            if (endPage - startPage < maxVisible - 1) {
                startPage = Math.max(1, endPage - maxVisible + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                const btn = document.createElement('button');
                btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
                btn.innerText = i;
                btn.onclick = () => { currentPage = i; renderCategories(); };
                pageNumbersDiv.appendChild(btn);
            }
        }

        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        if (prevBtn) prevBtn.disabled = currentPage <= 1;
        if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

        const gotoInput = document.getElementById('goto-page');
        if (gotoInput) {
            gotoInput.max = totalPages;
            gotoInput.value = '';
        }
    }

    function prevPage() {
        if (currentPage > 1) { currentPage--; renderCategories(); }
    }

    function nextPage() {
        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) { currentPage++; renderCategories(); }
    }

    function gotoPage(page) {
        const p = parseInt(page);
        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        if (p >= 1 && p <= totalPages) {
            currentPage = p;
            renderCategories();
        }
    }

    // Filter
    function filterCategories() {
        const searchInput = document.getElementById('category-search');
        const productLineFilter = document.getElementById('filter-product-line');
        if (!searchInput || !productLineFilter) return;
        
        const search = searchInput.value.toLowerCase();
        const productLine = productLineFilter.value;

        filteredData = categories.filter(c => {
            const matchSearch = c.name.toLowerCase().includes(search) || c.code.toLowerCase().includes(search);
            const matchProductLine = !productLine || c.productLine === productLine;
            return matchSearch && matchProductLine;
        });

        currentPage = 1;
        renderCategories();
    }




    function closeCategoryModal() {
        const modal = document.getElementById('category-modal');
        if (modal) modal.classList.remove('show');
    }



    // ... (openCategoryModal) ...
    function openCategoryModal(id = null) {
        const modal = document.getElementById('category-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('category-form');
        form.reset();
        document.getElementById('cat-id').value = '';

        if (id) {
            const item = categories.find(c => c.id === id);
            if (item) {
                title.innerText = 'Cập nhật nhóm sản phẩm';
                document.getElementById('cat-id').value = item.id;
                document.getElementById('cat-code').value = item.code;
                document.getElementById('cat-name').value = item.name;
                document.getElementById('cat-product-line').value = item.productLine || '';
                document.getElementById('cat-desc').value = item.description;
            }
        } else {
            title.innerText = 'Thêm mới nhóm sản phẩm';
        }
        modal.classList.add('show');
    }

    // ... (saveCategory) ...
    function saveCategory() {
        const idStr = document.getElementById('cat-id').value;
        const code = document.getElementById('cat-code').value.trim();
        const name = document.getElementById('cat-name').value.trim();
        const productLine = document.getElementById('cat-product-line').value;
        let desc = document.getElementById('cat-desc').value.trim();

        if (!name || !code || !productLine) {
            alert('Vui lòng nhập đầy đủ thông tin bắt buộc (*)');
            return;
        }

        if (!desc) {
            desc = `Mô tả nhóm sản phẩm ${name}`;
        }

        if (idStr) {
            const id = parseInt(idStr);
            const idx = categories.findIndex(c => c.id === id);
            if (idx !== -1) {
                categories[idx] = { ...categories[idx], code, name, productLine, description: desc };
            }
        } else {
            const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
            categories.unshift({
                id: newId,
                code,
                name,
                productLine,
                description: desc
            });
        }

        closeCategoryModal();
        filterCategories();
        showToast('Lưu thành công!');
    }

    function exportExcel() {
        showToast('Đang trích xuất dữ liệu ra file Excel...', 'info');
        setTimeout(() => {
            showToast('Xuất file Excel thành công!');
        }, 1000);
    }

    function importExcel() {
        showToast('Tính năng nhập Excel đang được khởi tạo...', 'info');
    }

    function syncData() {
        showToast('Đang kết nối hệ thống...', 'info');
        setTimeout(() => {
            showToast('Đồng bộ thông tin mới nhất thành công', 'success');
        }, 1000);
    }


    function deleteCategory(id) {
        pendingDeleteCategoryIds = [id];
        const cat = categories.find(c => c.id === id);
        const msgEl = document.getElementById('confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa nhóm sản phẩm <strong>${cat?.name}</strong> không?<br />Hành động này không thể hoàn tác.`;
        }
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.add('show');
    }

    function closeDeleteConfirm() {
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.remove('show');
        pendingDeleteCategoryIds = [];
    }

    function confirmDeleteCategory() {
        if (pendingDeleteCategoryIds.length > 0) {
            categories = categories.filter(c => !pendingDeleteCategoryIds.includes(c.id));
            document.getElementById('check-all').checked = false;
            filterCategories();
            showToast(`Đã xóa ${pendingDeleteCategoryIds.length} nhóm sản phẩm!`);
            closeDeleteConfirm();
        }
    }

    // Bulk Actions
    function toggleAll(source) {
        document.querySelectorAll('.cat-check').forEach(chk => chk.checked = source.checked);
        checkSelection();
    }

    function checkSelection() {
        const selected = document.querySelectorAll('.cat-check:checked');
        const btn = document.getElementById('delete-selected-btn');
        if (btn) {
            btn.disabled = selected.length === 0;
            btn.innerHTML = `<i class="fas fa-trash"></i> Xóa (${selected.length})`;
        }
    }


    function deleteSelected() {
        const selected = Array.from(document.querySelectorAll('.cat-check:checked')).map(chk => parseInt(chk.value));
        if (selected.length === 0) return;

        pendingDeleteCategoryIds = selected;
        const msgEl = document.getElementById('confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa <strong>${selected.length}</strong> nhóm sản phẩm đã chọn không?<br />Hành động này không thể hoàn tác.`;
        }
        const modal = document.getElementById('delete-confirm-modal');
        if (modal) modal.classList.add('show');
    }

    function showToast(msg) {
        if (window.showToast && typeof window.showToast === 'function') {
            window.showToast(msg, 'success');
        } else {
            console.log('[Toast]', msg);
        }
    }



    // Initialization Logic matching product.js pattern
    // Try immediate init
    // initCategoryModule(); // Handled by inline check or direct call inside IIFE?
    // Standardize to call it directly
    initCategoryModule();

})();
