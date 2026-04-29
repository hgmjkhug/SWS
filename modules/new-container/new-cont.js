(function () {
    // ============================================================
    //  MOCK DATA
    // ============================================================
    let containerTypes = [
        { code: 'PL-STANDARD', name: 'Pallet Tiêu chuẩn' },
        { code: 'PL-EURO',     name: 'Pallet Gỗ EURO (1200x800)' },
        { code: 'PL-PLASTIC',  name: 'Pallet Nhựa HDPE' },
        { code: 'PL-METAL',    name: 'Pallet Thép chịu lực' },
        { code: 'PL-MINI',     name: 'Pallet Mini (600x400)' },
        { code: 'BOX-DANPLA',  name: 'Thùng nhựa Danpla' },
        { code: 'BOX-WOOD',    name: 'Thùng Gỗ kiện hàng' },
        { code: 'BOX-CARTON',  name: 'Thùng Carton chuyên dụng' },
        { code: 'TRAY-COMP',   name: 'Khay linh kiện A4' },
    ];

    // ============================================================
    //  STATE
    // ============================================================
    let pallets = [];
    const STORAGE_KEY   = 'sws_new_pallets';
    const ITEMS_PER_PAGE = 20;
    let currentPage     = 1;
    let filteredPallets = [];

    let searchKeyword  = '';
    let filterStatus    = 'all';
    let filterTypeCode  = 'all';

    // Modal state
    let currentTab      = 'auto';
    let selectedTypeAuto = null;
    let selectedTypeManual = null;

    // Edit modal state
    let editingPalletId   = null;
    let selectedTypeEdit  = null;

    // Delete state
    let pendingDeleteId = null;

    // ============================================================
    //  INIT
    // ============================================================
    function initModule() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const temp = JSON.parse(stored);
            if (temp.some(p => p.code.startsWith('PAL-'))) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        loadPallets();
        initStatusOptions();
        renderTypeFilterOptions();
        initGlobalListeners();
        filterPallets();
        
        // Support system table scroll sync
        if (typeof window.initTableScrollSync === 'function') {
            window.initTableScrollSync();
        }
    }

    function loadPallets() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            pallets = JSON.parse(stored);
            pallets.forEach(p => { if (!p.typeCode) p.typeCode = 'PL-STANDARD'; });
        } else {
            pallets = [];
            for (let i = 1; i <= 80; i++) {
                const typeEntry = containerTypes[i % containerTypes.length];
                const typeSeq = pallets.filter(p => p.typeCode === typeEntry.code).length + 1;
                pallets.push({
                    id: i,
                    code: `${typeEntry.code}_${typeSeq}`,
                    typeCode: typeEntry.code,
                    status: i % 3 === 0 ? 'đã sử dụng' : 'mới tạo',
                    createdAt: new Date().toISOString()
                });
            }
            savePallets();
        }
    }

    function savePallets() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pallets));
    }

    function initGlobalListeners() {
        document.addEventListener('click', (e) => {
            // Dropdowns
            if (!e.target.closest('.status-filter')) {
                document.getElementById('status-options-list')?.classList.remove('show');
            }
            if (!e.target.closest('#type-filter-container')) {
                document.getElementById('type-filter-dropdown')?.classList.remove('show');
            }
            if (!e.target.closest('.dropdown-container')) {
                document.getElementById('excel-options')?.classList.remove('show');
            }
            // Searchable selects in modals
            if (!e.target.closest('.searchable-select') && !e.target.closest('#type-filter-container')) {
                document.querySelectorAll('.select-dropdown:not(#type-filter-dropdown)').forEach(d => d.classList.remove('show'));
            }
        });

        // Delegate checkbox logic
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('row-checkbox') || e.target.id === 'check-all') {
                updateBulkActionState();
            }
        });
    }

    function updateBulkActionState() {
        const checked = document.querySelectorAll('.row-checkbox:checked');
        const count = checked.length;
        const delBtn = document.getElementById('delete-selected-btn');
        if (delBtn) {
            delBtn.disabled = count === 0;
            delBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i> (${count})`;
        }
    }

    function initStatusOptions() {
        const list = document.getElementById('status-options-list');
        if (!list) return;
        list.addEventListener('click', (e) => {
            const opt = e.target.closest('.status-option');
            if (!opt) return;
            document.querySelectorAll('.status-option').forEach(el => el.classList.remove('active'));
            opt.classList.add('active');
            filterStatus = opt.dataset.value;
            document.getElementById('selected-status-text').textContent = opt.textContent;
            list.classList.remove('show');
            filterPallets();
        });
    }

    // ============================================================
    //  FILTER LOGIC
    // ============================================================
    function filterPallets() {
        const searchInput = document.getElementById('pallet-search');
        searchKeyword = (searchInput ? searchInput.value : '').toLowerCase().trim();

        filteredPallets = pallets.filter(p => {
            const matchSearch  = !searchKeyword || p.code.toLowerCase().includes(searchKeyword);
            const matchStatus  = filterStatus === 'all' || p.status === filterStatus;
            const matchType    = filterTypeCode === 'all' || p.typeCode === filterTypeCode;
            return matchSearch && matchStatus && matchType;
        });

        currentPage = 1;
        renderTable();
    }

    function showTypeFilterDropdown() {
        renderTypeFilterOptions(document.getElementById('type-filter-input').value);
        document.getElementById('type-filter-dropdown')?.classList.add('show');
    }

    function renderTypeFilterOptions(keyword = '') {
        const container = document.getElementById('type-filter-options-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        // "All" option
        const allOpt = document.createElement('div');
        allOpt.className = `select-option ${filterTypeCode === 'all' ? 'selected' : ''}`;
        allOpt.textContent = 'Tất cả nhóm vật chứa';
        allOpt.onclick = () => selectTypeFilter('all', 'Tất cả nhóm vật chứa');
        container.appendChild(allOpt);

        const filtered = containerTypes.filter(t => 
            t.code.toLowerCase().includes(keyword.toLowerCase()) || 
            t.name.toLowerCase().includes(keyword.toLowerCase())
        );

        if (filtered.length === 0 && keyword) {
            container.innerHTML = '<div class="select-option no-result">Không tìm thấy nhóm này</div>';
        } else {
            filtered.forEach(t => {
                const opt = document.createElement('div');
                opt.className = `select-option ${filterTypeCode === t.code ? 'selected' : ''}`;
                opt.textContent = `${t.code} - ${t.name}`;
                opt.onclick = () => selectTypeFilter(t.code, `${t.code} - ${t.name}`);
                container.appendChild(opt);
            });
        }
    }

    function filterTypeFilterOptions(input) {
        renderTypeFilterOptions(input.value.trim());
    }

    function selectTypeFilter(code, label) {
        filterTypeCode = code;
        const input = document.getElementById('type-filter-input');
        if (input) input.value = (code === 'all' ? '' : label);
        document.getElementById('type-filter-dropdown').classList.remove('show');
        filterPallets();
    }

    function toggleStatusDropdown() {
        document.getElementById('status-options-list')?.classList.toggle('show');
    }

    function toggleExcelDropdown() {
        document.getElementById('excel-options')?.classList.toggle('show');
    }

    // ============================================================
    //  TABLE RENDER
    // ============================================================
    function renderTable() {
        const tbody = document.getElementById('pallet-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end   = Math.min(start + ITEMS_PER_PAGE, filteredPallets.length);
        const items = filteredPallets.slice(start, end);

        if (items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-box-open"></i><p>Không có vật chứa nào phù hợp</p></div></td></tr>`;
        } else {
            items.forEach((p, idx) => {
                const type = containerTypes.find(t => t.code === p.typeCode);
                const isNew = p.status === 'mới tạo';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="text-align:center"><input type="checkbox" class="row-checkbox" value="${p.id}"></td>
                    <td style="text-align:center;color:var(--text-muted);">${start + idx + 1}</td>
                    <td style="font-weight:600;color:var(--primary);">${p.code}</td>
                    <td style="font-weight:500;">${type ? type.name : '—'}</td>
                    <td><span class="badge ${isNew ? 'badge-new' : 'badge-used'}">${isNew ? 'Mới tạo' : 'Đã sử dụng'}</span></td>
                    <td>
                        <div class="action-btns">
                            <button class="action-icon" onclick="openEditModal(${p.id})" title="Chỉnh sửa" ${!isNew ? 'disabled' : ''}>
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="action-icon print" onclick="printContainerBarcode(${p.id})" title="In mã Barcode">
                                <i class="fa-solid fa-print"></i>
                            </button>
                            <button class="action-icon delete" onclick="showDeleteSinglePopover(${p.id})" title="Xóa" ${!isNew ? 'disabled' : ''}>
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        const checkAll = document.getElementById('check-all');
        if (checkAll) checkAll.checked = false;
        updateBulkActionState();
        renderPagination();
    }

    // ============================================================
    //  PAGINATION
    // ============================================================
    function renderPagination() {
        const total      = filteredPallets.length;
        const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

        const infoEl = document.getElementById('pagination-info');
        if (infoEl) {
            infoEl.textContent = `Hiển thị ${total === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, total)} trên tổng ${total}`;
        }
        
        const gotoInput = document.getElementById('goto-page');
        if (gotoInput) {
            gotoInput.value = currentPage;
            gotoInput.max = totalPages || 1;
        }

        const container = document.getElementById('page-numbers');
        if (!container) return;
        container.innerHTML = '';

        const pages = buildPageArray(currentPage, totalPages);
        pages.forEach(p => {
            if (p === '...') {
                container.innerHTML += `<span class="page-ellipsis">…</span>`;
            } else {
                const btn = document.createElement('button');
                btn.className = `page-number-btn ${p === currentPage ? 'active' : ''}`;
                btn.textContent = p;
                btn.onclick = () => { currentPage = p; renderTable(); };
                container.appendChild(btn);
            }
        });

        document.getElementById('prev-page').disabled = currentPage <= 1;
        document.getElementById('next-page').disabled = currentPage >= totalPages || totalPages === 0;
    }

    function buildPageArray(current, total) {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const pages = new Set([1, total, current]);
        if (current > 1) pages.add(current - 1);
        if (current < total) pages.add(current + 1);
        const sorted = [...pages].sort((a, b) => a - b);
        const result = [];
        let prev = 0;
        sorted.forEach(p => { if (p - prev > 1) result.push('...'); result.push(p); prev = p; });
        return result;
    }

    function changePage(delta) {
        const totalPages = Math.ceil(filteredPallets.length / ITEMS_PER_PAGE);
        const next = currentPage + delta;
        if (next >= 1 && next <= totalPages) { currentPage = next; renderTable(); }
    }

    function gotoPage(val) {
        const page = parseInt(val);
        const totalPages = Math.ceil(filteredPallets.length / ITEMS_PER_PAGE);
        if (page >= 1 && page <= totalPages) { currentPage = page; renderTable(); }
        else { document.getElementById('goto-page').value = currentPage; }
    }

    function toggleAllPallets(source) {
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = source.checked);
        updateBulkActionState();
    }

    // ============================================================
    //  DELETE LOGIC
    // ============================================================
    function showBulkDeletePopover() {
        const checked = document.querySelectorAll('.row-checkbox:checked');
        if (checked.length === 0) return;
        const ids = Array.from(checked).map(cb => parseInt(cb.value));
        const invalid = pallets.filter(p => ids.includes(p.id) && p.status !== 'mới tạo');
        if (invalid.length > 0) {
            showToast(`${invalid.length} vật chứa "đã sử dụng" không thể xóa!`, 'error');
            return;
        }
        document.getElementById('bulk-delete-message').innerHTML = `Bạn có chắc chắn muốn xóa <b>${ids.length}</b> vật chứa đã chọn? <br>Hành động này không thể hoàn tác.`;
        document.getElementById('bulk-delete-confirm-modal').classList.add('show');
    }

    function hideBulkDeletePopover() {
        document.getElementById('bulk-delete-confirm-modal').classList.remove('show');
    }

    function confirmBulkDelete() {
        const checked = document.querySelectorAll('.row-checkbox:checked');
        const ids = Array.from(checked).map(cb => parseInt(cb.value));
        pallets = pallets.filter(p => !ids.includes(p.id));
        savePallets();
        filterPallets();
        hideBulkDeletePopover();
        showToast(`Đã xóa ${ids.length} vật chứa thành công.`, 'success');
    }

    function showDeleteSinglePopover(id) {
        pendingDeleteId = id;
        const p = pallets.find(x => x.id === id);
        if (!p) return;
        document.getElementById('delete-single-message').innerHTML = `Bạn có chắc chắn muốn xóa vật chứa <b>${p.code}</b> không? <br>Hành động này không thể hoàn tác.`;
        document.getElementById('delete-confirm-modal').classList.add('show');
    }

    function hideDeleteSinglePopover() {
        pendingDeleteId = null;
        document.getElementById('delete-confirm-modal').classList.remove('show');
    }

    function confirmDeleteSingle() {
        if (!pendingDeleteId) return;
        pallets = pallets.filter(x => x.id !== pendingDeleteId);
        savePallets();
        filterPallets();
        hideDeleteSinglePopover();
        showToast(`Xóa vật chứa thành công.`, 'success');
    }

    function closeAllPopovers() {
        hideDeleteSinglePopover();
        hideBulkDeletePopover();
    }

    // ============================================================
    //  ADD / EDIT MODALS
    // ============================================================
    function openAddModal() {
        document.getElementById('add-pallet-modal').classList.add('show');
        switchTab('auto');
        resetAutoForm();
        resetManualForm();
    }

    function closeAddModal() {
        document.getElementById('add-pallet-modal').classList.remove('show');
    }

    function switchTab(tab) {
        currentTab = tab;
        document.querySelectorAll('.modal-tab').forEach((t, i) => {
            t.classList.toggle('active', (tab === 'auto' && i === 0) || (tab === 'manual' && i === 1));
        });
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`tab-${tab}`)?.classList.add('active');
        document.querySelectorAll('.footer-btns').forEach(f => f.classList.remove('active'));
        document.getElementById(`footer-${tab}`)?.classList.add('active');
    }

    function adjustQty(delta) {
        const input = document.getElementById('auto-qty');
        input.value = Math.max(1, parseInt(input.value || 1) + delta);
    }



    // Type selections
    function showTypeDropdownAuto() { renderTypes('type-dropdown-auto', '', 'auto'); }
    function filterTypesAuto(input) { renderTypes('type-dropdown-auto', input.value.toLowerCase(), 'auto'); }
    function showTypeDropdownManual() { renderTypes('type-dropdown-manual', '', 'manual'); }
    function filterTypesManual(input) { renderTypes('type-dropdown-manual', input.value.toLowerCase(), 'manual'); }
    function showTypeDropdownEdit() { renderTypes('type-dropdown-edit', '', 'edit'); }
    function filterTypesEdit(input) { renderTypes('type-dropdown-edit', input.value.toLowerCase(), 'edit'); }

    function renderTypes(dropId, kw, mode) {
        const dropdown = document.getElementById(dropId);
        if (!dropdown) return;
        dropdown.innerHTML = '';
        const filtered = containerTypes.filter(t => t.code.toLowerCase().includes(kw) || t.name.toLowerCase().includes(kw));
        if (!filtered.length) {
            dropdown.innerHTML = '<div class="select-option no-result">Không tìm thấy kết quả</div>';
        } else {
            filtered.forEach(t => {
                const div = document.createElement('div');
                div.className = 'select-option';
                div.textContent = `${t.code} - ${t.name}`;
                div.onclick = () => {
                    const selector = mode === 'auto' ? '#type-select-auto' : mode === 'manual' ? '#type-select-manual' : '#type-select-edit';
                    if (mode === 'auto') selectedTypeAuto = t;
                    if (mode === 'manual') selectedTypeManual = t;
                    if (mode === 'edit') selectedTypeEdit = t;
                    document.querySelector(`${selector} input`).value = `${t.code} - ${t.name}`;
                    dropdown.classList.remove('show');
                };
                dropdown.appendChild(div);
            });
        }
        dropdown.classList.add('show');
    }

    function createPallets(mode, printAfter = false) {
        const isAuto = mode === 'auto';
        const type = isAuto ? selectedTypeAuto : selectedTypeManual;
        if (!type) { showToast('Vui lòng chọn nhóm vật chứa!', 'error'); return; }
        
        const qty = isAuto ? parseInt(document.getElementById('auto-qty').value || 0) : 1;
        if (qty <= 0) { showToast('Số lượng phải lớn hơn 0!', 'error'); return; }

        const now = new Date();
        const currentMaxId = pallets.length > 0 ? Math.max(...pallets.map(p => p.id)) : 0;

        if (!isAuto) {
            const manualInput = document.getElementById('manual-code').value.trim();
            const pCode = manualInput || `${type.code}_${getNextSequenceForType(type.code)}`;
            
            if (pallets.some(x => x.code === pCode)) { 
                showToast(`Mã ${pCode} đã tồn tại!`, 'error'); 
                return; 
            }
            pallets.unshift({ id: currentMaxId + 1, code: pCode, typeCode: type.code, status: 'mới tạo', createdAt: now.toISOString() });
        } else {
            let startSeq = getNextSequenceForType(type.code);
            for (let i = 0; i < qty; i++) {
                const pCode = `${type.code}_${startSeq + i}`;
                const nextId = currentMaxId + i + 1;
                pallets.unshift({ id: nextId, code: pCode, typeCode: type.code, status: 'mới tạo', createdAt: now.toISOString() });
            }
        }
        showToast(`Đã tạo ${qty} vật chứa thành công!`, 'success');
        savePallets(); closeAddModal(); filterPallets();
    }

    function getNextSequenceForType(typeCode) {
        let max = 0;
        pallets.forEach(p => {
            if (p.typeCode === typeCode) {
                // Try format TypeCode_Number
                const parts = p.code.split('_');
                if (parts.length === 2 && parts[0] === typeCode) {
                    const seq = parseInt(parts[1]);
                    if (!isNaN(seq) && seq > max) max = seq;
                } else {
                    // Try old format TypeCode-Timestamp-Number
                    const oldParts = p.code.split('-');
                    if (oldParts.length === 3 && oldParts[0] === typeCode) {
                        const seq = parseInt(oldParts[2]);
                        if (!isNaN(seq) && seq > max) max = seq;
                    }
                }
            }
        });
        return max + 1;
    }

    function openEditModal(id) {
        const p = pallets.find(x => x.id === id);
        if (!p || p.status !== 'mới tạo') return;
        editingPalletId = id;
        document.getElementById('edit-pallet-id').value = id;
        document.getElementById('edit-pallet-code').value = p.code;
        selectedTypeEdit = containerTypes.find(t => t.code === p.typeCode);
        document.querySelector('#type-select-edit input').value = selectedTypeEdit ? `${selectedTypeEdit.code} - ${selectedTypeEdit.name}` : '';
        document.getElementById('edit-pallet-modal').classList.add('show');
    }

    function closeEditModal() {
        document.getElementById('edit-pallet-modal').classList.remove('show');
    }

    function saveEditPallet() {
        if (!selectedTypeEdit) { showToast('Vui lòng chọn nhóm vật chứa!', 'error'); return; }
        const newCode = document.getElementById('edit-pallet-code').value.trim();
        if (!newCode) { showToast('Vui lòng nhập mã vật chứa!', 'error'); return; }

        const idx = pallets.findIndex(p => p.id === editingPalletId);
        if (idx !== -1) {
            // Check for duplicate code (exclude self)
            if (pallets.some((p, i) => i !== idx && p.code === newCode)) {
                showToast(`Mã ${newCode} đã tồn tại!`, 'error');
                return;
            }

            pallets[idx].code = newCode;
            pallets[idx].typeCode = selectedTypeEdit.code;
            savePallets();
            filterPallets();
            closeEditModal();
            showToast('Cập nhật thành công.', 'success');
        }
    }

    // Forms reset
    function resetAutoForm() { document.getElementById('auto-qty').value = 1; document.querySelector('#type-select-auto input').value = ''; selectedTypeAuto = null; }
    function resetManualForm() { document.getElementById('manual-code').value = ''; document.querySelector('#type-select-manual input').value = ''; selectedTypeManual = null; }

    // Utils
    function showToast(message, type = 'success') {
        if (window.parent && typeof window.parent.showToast === 'function') window.parent.showToast(message, type);
        else console.log(`${type}: ${message}`);
    }

    function importExcel() { showToast('Chức năng nhập Excel đang phát triển!', 'info'); }
    function exportExcel() { showToast('Đang xuất Excel...', 'success'); }

    function printContainerBarcode(id) {
        const p = pallets.find(x => x.id === id);
        if (!p) return;

        const barcodeData = `${p.code}`;
        const barcodeApiUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(barcodeData)}`;
        const typeName = containerTypes.find(t => t.code === p.typeCode)?.name || 'Vật chứa';

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Barcode - ${p.code}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 20px;
                    background: #fff;
                }
                .barcode-label {
                    display: inline-block;
                    border: 1px solid #000;
                    padding: 15px;
                    text-align: center;
                }
                .barcode-image {
                    display: block;
                    margin-bottom: 10px;
                }
                .barcode-image img {
                    max-width: 100%;
                    height: 80px;
                    object-fit: contain;
                }
                .info {
                    text-align: center;
                }
                .code {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                .type {
                    font-size: 16px;
                }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="barcode-label">
                <div class="barcode-image">
                    <img src="${barcodeApiUrl}" alt="Barcode" onload="window.print()">
                </div>
                <div class="info">
                    <div class="code">${p.code}</div>
                    <div class="type">${typeName}</div>
                </div>
            </div>
        </body>
        </html>
    `);
        printWindow.document.close();
    }

    // Exports
    window.filterPallets = filterPallets;
    window.toggleStatusDropdown = toggleStatusDropdown;
    window.toggleExcelDropdown = toggleExcelDropdown;
    window.changePage = changePage;
    window.gotoPage = gotoPage;
    window.toggleAllPallets = toggleAllPallets;
    window.showBulkDeletePopover = showBulkDeletePopover;
    window.hideBulkDeletePopover = hideBulkDeletePopover;
    window.confirmBulkDelete = confirmBulkDelete;
    window.showDeleteSinglePopover = showDeleteSinglePopover;
    window.hideDeleteSinglePopover = hideDeleteSinglePopover;
    window.confirmDeleteSingle = confirmDeleteSingle;
    window.closeAllPopovers = closeAllPopovers;
    window.openAddModal = openAddModal;
    window.closeAddModal = closeAddModal;
    window.switchTab = switchTab;
    window.adjustQty = adjustQty;
    window.showTypeDropdownAuto = showTypeDropdownAuto;
    window.filterTypesAuto = filterTypesAuto;
    window.showTypeDropdownManual = showTypeDropdownManual;
    window.filterTypesManual = filterTypesManual;
    window.createPallets = createPallets;
    window.openEditModal = openEditModal;
    window.closeEditModal = closeEditModal;
    window.saveEditPallet = saveEditPallet;
    window.showTypeDropdownEdit = showTypeDropdownEdit;
    window.filterTypesEdit = filterTypesEdit;
    window.showTypeFilterDropdown = showTypeFilterDropdown;
    window.filterTypeFilterOptions = filterTypeFilterOptions;
    window.selectTypeFilter = selectTypeFilter;
    window.importExcel = importExcel;
    window.exportExcel = exportExcel;
    window.printContainerBarcode = printContainerBarcode;

    initModule();
})();
