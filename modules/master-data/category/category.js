// Encapsulate in IIFE to avoid global scope pollution and re-declaration errors
(function () {

    // Mock Data
    // Mock Data - Kho Cơ Khí (Expanded to 30 items)



    // Mock Data - Kho Cơ Khí (Expanded to 30 items) with updated Warehouse codes
    var categories = [
        { id: 1, code: 'KC01', name: 'Kim khí & sản phẩm phụ', description: 'Bulong, ốc vít, long đen, đinh, tán rivets...' },
        { id: 2, code: 'KC02', name: 'Dụng cụ Cắt gọt', description: 'Mũi khoan, dao phay, đá mài, lưỡi cưa, taro...' },
        { id: 3, code: 'KC03', name: 'Dụng cụ Cầm tay', description: 'Kìm, búa, cờ lê, mỏ lết, tuốc nơ vít, kìm bấm...' },
        { id: 4, code: 'KC04', name: 'sản phẩm Hàn', description: 'Que hàn, dây hàn, thuốc hàn, bép hàn...' },
        { id: 5, code: 'KC05', name: 'Thiết bị Đo lường', description: 'Thước kẹp, panme, đồng hồ so, thước cuộn, thước lá...' },
        { id: 6, code: 'KC06', name: 'Vòng bi & Bạc đạn', description: 'Vòng bi cầu, vòng bi côn, gối đỡ, bạc đạn...' },
        { id: 7, code: 'KC07', name: 'Dầu mỡ & Hóa chất', description: 'Dầu bôi trơn, mỡ bò, dầu chống gỉ, dung dịch tẩy rửa...' },
        { id: 8, code: 'KC08', name: 'Thiết bị điện cầm tay', description: 'Máy khoan, máy mài, máy cắt, máy chà nhám...' },
        { id: 9, code: 'KC09', name: 'sản phẩm Bảo hộ', description: 'Găng tay, kính, giày, mũ, nút tai chống ồn...' },
        { id: 10, code: 'KC10', name: 'Phụ tùng máy công cụ', description: 'Chấu kẹp, mũi tâm, collet, dao tiện...' },
        { id: 11, code: 'KC11', name: 'Thép hình & Thép tấm', description: 'Thép V, U, I, thép tấm, thép tròn trơn...' },
        { id: 12, code: 'KC12', name: 'Nhôm định hình', description: 'Nhôm 3030, 4040, ke góc, nắp bịt...' },
        { id: 13, code: 'KC13', name: 'Ống & Phụ kiện ống', description: 'Ống thép, co, tê, van, bích, măng sông...' },
        { id: 14, code: 'KC14', name: 'Van công nghiệp', description: 'Van bi, van bướm, van một chiều, van cổng...' },
        { id: 15, code: 'KC15', name: 'Gioăng & Phớt làm kín', description: 'O-ring, phớt thủy lực, gioăng cao su, amiang...' },
        { id: 16, code: 'KC16', name: 'Dây Curoa & Băng tải', description: 'Dây curoa A, B, C, timing belt, băng tải PVC...' },
        { id: 17, code: 'KC17', name: 'Xích & Bánh nhông', description: 'Xích công nghiệp 40, 50, 60, nhông xích...' },
        { id: 18, code: 'KC18', name: 'Lò xo công nghiệp', description: 'Lò xo nén, lò xo kéo, lò xo xoắn...' },
        { id: 19, code: 'KC19', name: 'Bánh xe đẩy & Con lăn', description: 'Bánh xe PU, cao su, con lăn băng tải...' },
        { id: 20, code: 'KC20', name: 'Khuôn mẫu & Linh kiện', description: 'Chốt dẫn hướng, lò xo khuôn, ty lói...' },
        { id: 21, code: 'KC21', name: 'sản phẩm mài mòn', description: 'Giấy nhám, đá mài, đá cắt, nỉ đánh bóng...' },
        { id: 22, code: 'KC22', name: 'Keo & Băng keo', description: 'Keo 502, keo khóa ren, băng keo chịu nhiệt...' },
        { id: 23, code: 'KC23', name: 'Sơn & Dung môi', description: 'Sơn chống gỉ, sơn dầu, xăng thơm, dung môi...' },
        { id: 24, code: 'KC24', name: 'Dụng cụ khí nén', description: 'Súng xịt hơi, dây hơi, đầu nối nhanh...' },
        { id: 25, code: 'KC25', name: 'Dụng cụ thủy lực', description: 'Kích thủy lực, kìm ép cos, bơm tay...' },
        { id: 26, code: 'KC26', name: 'Thiết bị nâng hạ', description: 'Pa lăng, xích cẩu, ma ní, cáp vải...' },
        { id: 27, code: 'KC27', name: 'Đèn chiếu sáng', description: 'Đèn led nhà xưởng, bóng đèn huỳnh quang...' },
        { id: 28, code: 'KC28', name: 'Quạt & Thông gió', description: 'Quạt công nghiệp, quạt hút, ống gió...' },
        { id: 29, code: 'KC29', name: 'sản phẩm đóng gói', description: 'Màng PE, dây đai, xốp hơi...' },
        { id: 30, code: 'KC30', name: 'Văn phòng phẩm xưởng', description: 'Bút viết, sổ ghi chép, kẹp hồ sơ...' }
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
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px; color: #64748b;">Không tìm thấy dữ liệu</td></tr>';
            return;
        }

        pageData.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td><input type="checkbox" class="cat-check" value="${item.id}" onchange="checkSelection()"></td>
            <td>${start + idx + 1}</td>
            <td><div style="font-weight: 500; color: #0f172a;">${item.name}</div></td>
            <td>${item.description}</td>
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
        const search = document.getElementById('category-search').value.toLowerCase();

        filteredData = categories.filter(c => {
            const matchName = c.name.toLowerCase().includes(search);
            return matchName;
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
                document.getElementById('cat-name').value = item.name;
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
        const codeEl = document.getElementById('cat-code');
        const name = document.getElementById('cat-name').value;
        const desc = document.getElementById('cat-desc').value;

        if (!name) {
            alert('Vui lòng nhập tên nhóm sản phẩm');
            return;
        }

        let code = codeEl ? codeEl.value : `NV${Math.floor(Math.random() * 1000)}`;

        if (idStr) {
            const id = parseInt(idStr);
            const idx = categories.findIndex(c => c.id === id);
            if (idx !== -1) {
                categories[idx] = { ...categories[idx], code, name, description: desc };
            }
        } else {
            const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
            categories.unshift({
                id: newId,
                code,
                name,
                description: desc
            });
        }

        closeCategoryModal();
        filterCategories();
        showToast('Lưu thành công!');
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

    // Set banner
    const bannerEl = document.getElementById('banner-warehouse-name');
    if (bannerEl) bannerEl.textContent = getCurrentWarehouse();

    // Initialization Logic matching product.js pattern
    // Try immediate init
    // initCategoryModule(); // Handled by inline check or direct call inside IIFE?
    // Standardize to call it directly
    initCategoryModule();

})();
