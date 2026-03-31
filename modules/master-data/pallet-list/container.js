// --- 1. MOCK DATA ---
(function () {
    const totalItems = 65;
    const containers = [];
    const warehouses = ["Kho Flat", "Kho Stacker Crane", "Kho Tower"];
    const containerTypes = ["Đơn vị chứa gỗ", "Đơn vị chứa nhựa", "Đơn vị chứa sắt"];
    let currentEditId = null;
    // Status logic: Trống (Gray), Đang sử dụng (Green), Đang xử lý (Orange)
    const materials = [
        { code: "VT-001", name: "Thép tấm 5mm", weight: 500, specs: "2000 x 1000 x 5 mm" },
        { code: "VT-002", name: "Bulong M10", weight: 200, specs: "Thùng 500 cái" },
        { code: "VT-003", name: "Sơn chống rỉ", weight: 50, specs: "Thùng 20L" },
        { code: "VT-004", name: "Que hàn 3.2", weight: 400, specs: "Hộp 5kg" },
        { code: "VT-005", name: "Đá cắt 355", weight: 300, specs: "Thùng 25 viên" }
    ];

    for (let i = 1; i <= totalItems; i++) {
        const invStatus = Math.random() > 0.2 ? "Có hàng" : "Trống";
        const statusOptions = ["Đang đứng yên", "Đang di chuyển", "Đang chờ lệnh", "Hoàn thành"];

        // Constraint 1: Empty containers must be stationary
        let status = invStatus === "Trống" ? "Đang đứng yên" : statusOptions[Math.floor(Math.random() * statusOptions.length)];

        const wh = warehouses[Math.floor(Math.random() * warehouses.length)];
        const code = `CT-${1000 + i}`;

        // Detailed Location Generation: T1-F8-P3-A1
        // T: Tower/Type, F: Floor, P: Position/Hộc, A: Label
        const t = Math.floor(Math.random() * 3) + 1; // 1-3
        const f = Math.floor(Math.random() * 10) + 1; // 1-10
        const p = Math.floor(Math.random() * 5) + 1; // 1-5
        const a = Math.random() > 0.5 ? 'A1' : 'A2';

        // Short code for display
        let locationCode = `T${t}-F${f}-P${p}-${a}`;
        // Detailed text for tooltip or print
        let locationDetail = `Tháp ${t} - Tầng ${f} - Hộc ${p} (${a})`;

        // Constraint 2: Moving pallets have no fixed location
        if (status === "Đang di chuyển") {
            locationCode = "-";
            locationDetail = "-";
        }

        // Inbound & Material data
        let inbound = null;
        let material = null;
        let quantity = "-";

        if (invStatus === "Có hàng") {
            quantity = Math.floor(Math.random() * 100) + 1;
            const mat = materials[Math.floor(Math.random() * materials.length)];
            material = { ...mat };

            const d = new Date(Math.random() > 0.8 ? 2026 : 2025, Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            const yy = String(d.getFullYear()).slice(-2);
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const dateCode = `${yy}${mm}${dd}`;

            inbound = {
                code: `${code}_${mat.code}_${quantity}_${dateCode}`,
                name: `Nhập hàng ${mat.name} T${Math.floor(Math.random() * 12) + 1}`,
                date: d.toLocaleDateString('vi-VN')
            };
        }

        // Generate random entry date in hh:mm dd/mm/yyyy format (Range: 2025 - Jan 2026)
        const is2026 = Math.random() > 0.8;
        const yr = is2026 ? 2026 : 2025;
        const mo = is2026 ? 0 : Math.floor(Math.random() * 12);
        const dy = Math.floor(Math.random() * 28) + 1;
        const randomDate = invStatus === "Có hàng" ? new Date(yr, mo, dy, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)) : null;
        const pad = (num) => String(num).padStart(2, '0');
        const entryDate = randomDate ? `${pad(randomDate.getHours())}:${pad(randomDate.getMinutes())} ${pad(randomDate.getDate())}/${pad(randomDate.getMonth() + 1)}/${randomDate.getFullYear()}` : "-";

        // Generate random container type
        const type = containerTypes[Math.floor(Math.random() * containerTypes.length)];

        containers.push({
            id: i,
            name: `Đơn vị chứa ${i}`,
            code: code,
            type: type, // New Property
            qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`,
            status: status,
            warehouse: wh,
            locationCode: locationCode,
            locationDetail: locationDetail,
            inbound: inbound,
            material: material,
            inventoryStatus: invStatus,
            entryTimestamp: randomDate, // Added for filtering
            quantity: quantity,
            length: type === "Đơn vị chứa gỗ" ? 1200 : (type === "Đơn vị chứa nhựa" ? 600 : 1200),
            width: type === "Đơn vị chứa gỗ" ? 800 : (type === "Đơn vị chứa nhựa" ? 400 : 1000),
            height: type === "Đơn vị chứa gỗ" ? 144 : (type === "Đơn vị chứa nhựa" ? 280 : 150),
            maxLoad: type === "Đơn vị chứa gỗ" ? 1000 : (type === "Đơn vị chứa nhựa" ? 50 : 2000),
            isActive: Math.random() > 0.2 // Randomize initial status
        });
    }

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

    // --- 2. CONFIGURATION & STATE ---
    const itemsPerPage = 20;
    let currentPage = 1;
    let currentSearch = "";
    let currentFilterUsage = "all"; // New filter state
    let filteredData = [...containers];
    let selectedIds = new Set();

    // --- 3. DOM ELEMENTS GETTER ---
    function getDOMElements() {
        return {
            tableBody: document.getElementById('tableBody'),
            paginationInfo: document.querySelector('.pagination-info'),
            paginationControls: document.getElementById('paginationControls'),
            pageInput: document.getElementById('pageInput'),
            searchInput: document.getElementById('searchInput'),
            usageStatusDropdown: document.getElementById('usageStatusDropdown'),
            usageStatusSelected: document.getElementById('usageStatusSelected'),
            usageStatusOptions: document.getElementById('usageStatusOptions'),

            // Confirmation Modal
            toggleConfirmModal: document.getElementById('toggleConfirmModal'),
            confirmContent: document.querySelector('.confirm-content'),
            confirmContainerCode: document.getElementById('confirmContainerCode'),
            confirmToggleBtn: document.getElementById('confirmToggleBtn'),
            cancelToggleBtn: document.getElementById('cancelToggleBtn'),
            confirmArrow: document.getElementById('confirmArrow'),

            // Bulk Actions
            selectAll: document.getElementById('selectAll'),
            bulkActions: document.getElementById('bulkActions'),
            bulkDeleteBtn: document.getElementById('bulkDeleteBtn'),
            bulkPrintBtn: document.getElementById('bulkPrintBtn'),
            // Scroll Synchronization
            scrollHead: document.querySelector('.table-scroll-head'),
            scrollBody: document.querySelector('.table-scroll-body')
        };
    }

    // --- 4. FILTER FUNCTION ---
    function filterData() {
        filteredData = containers.filter(item => {
            if (currentSearch) {
                const s = currentSearch.toLowerCase();
                const match = item.code.toLowerCase().includes(s);
                if (!match) return false;
            }
            if (currentFilterUsage !== "all") {
                if (currentFilterUsage === "active" && !item.isActive) return false;
                if (currentFilterUsage === "inactive" && item.isActive) return false;
            }
            return true;
        });

        currentPage = 1;
        renderTable(currentPage);
        renderPagination(currentPage);
    }

    // Copy Info Function
    window.copyToClipboard = function (text, element) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            showCopyPopover(element);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    function showCopyPopover(element) {
        const popover = document.createElement('div');
        popover.className = 'copy-popover';
        popover.textContent = 'Copied!';
        document.body.appendChild(popover);

        const rect = element.getBoundingClientRect();
        popover.style.left = (rect.left + rect.width / 2) + 'px';
        popover.style.top = (rect.top - 30) + 'px';

        setTimeout(() => { popover.remove(); }, 1500);
    }

    // --- 5. RENDER TABLE ---
    function renderTable(page) {
        const dom = getDOMElements();
        if (!dom.tableBody) {
            console.warn('tableBody not found');
            return;
        }

        dom.tableBody.innerHTML = '';

        // Handle empty state
        const paginationContainer = document.querySelector('.pagination-container');
        const tableContainer = document.querySelector('.table-scroll-body');

        if (filteredData.length === 0) {
            dom.tableBody.innerHTML = `
            <tr class="empty-state-row">
                <td colspan="13" style="text-align: center; padding: 60px 20px; color: #64748b;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                        <i class="fas fa-inbox" style="font-size: 48px; color: #cbd5e1;"></i>
                        <div style="font-size: 16px; font-weight: 500;">Không có dữ liệu</div>
                        <div style="font-size: 14px; color: #94a3b8;">Không tìm thấy kết quả phù hợp với bộ lọc của bạn</div>
                    </div>
                </td>
            </tr>
        `;
            if (paginationContainer) paginationContainer.style.display = 'none';
            if (tableContainer) tableContainer.style.minHeight = 'auto';
            return;
        }

        if (paginationContainer) paginationContainer.style.display = 'flex';
        if (tableContainer) tableContainer.style.minHeight = '300px';

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredData.slice(start, end);

        paginatedItems.forEach((container, index) => {
            const stt = start + index + 1;
            const isSelected = selectedIds.has(container.id);
            const disabledClass = "";
            const toggleTitle = container.isActive ? "Ngưng sử dụng" : "Kích hoạt sử dụng";

            const row = `
            <tr class="${isSelected ? 'selected-row' : ''}">
                <td class="sticky-col first-col" style="text-align: center;">
                    <input type="checkbox" class="row-checkbox" data-id="${container.id}" ${isSelected ? 'checked' : ''}>
                </td>
                <td>${stt}</td>
                <td>${container.code}</td>
                <td>
                    ${container.type}
                </td>
                <td style="text-align: center;">${container.length || '-'}</td>
                <td style="text-align: center;">${container.width || '-'}</td>
                <td style="text-align: center;">${container.height || '-'}</td>
                <td style="text-align: center;">${container.maxLoad || '-'}</td>
                <td style="text-align: center;">
                        <label class="switch ${disabledClass}" title="${toggleTitle}">
                            <input type="checkbox" class="usage-toggle" data-id="${container.id}" ${container.isActive ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                </td>
                <td>
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <button class="action-btn edit-btn" onclick="editContainer(${container.id})" title="Chỉnh sửa">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteContainer(event, ${container.id})" title="Xóa đơn vị chứa" 
                                style="color: #ef4444;">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>  
                </td>
            </tr>
        `;
            dom.tableBody.insertAdjacentHTML('beforeend', row);
        });

        // Update Counts Text: "Hiển thị start-end trên tổng total"
        if (dom.paginationInfo) {
            const total = filteredData.length;
            const startItem = total > 0 ? start + 1 : 0;
            const endItem = Math.min(start + itemsPerPage, total);
            dom.paginationInfo.innerHTML = `Hiển thị <span style="font-weight:regular">${startItem} - ${endItem}</span> trong <span style="font-weight:regular">${total}</span>`;
        }

        // Update Select All Checkbox
        if (dom.selectAll) {
            // Check if ALL filtered data is selected, not just the current page
            const allSelected = filteredData.length > 0 && filteredData.every(p => selectedIds.has(p.id));
            const someSelected = filteredData.some(p => selectedIds.has(p.id));

            dom.selectAll.checked = allSelected;
            dom.selectAll.indeterminate = !allSelected && someSelected;
        }

        // Toggle Bulk Actions
        // Toggle Bulk Actions (Print always visible, delete only if selected)
        if (dom.bulkActions) {
            // dom.bulkActions.classList.remove('hidden'); // Always show container
            // Actually, we removed the 'hidden' class from HTML, so just ensure bulkDelete is toggled
            if (dom.bulkDeleteBtn) {
                if (selectedIds.size > 0) {
                    dom.bulkDeleteBtn.style.display = 'inline-block';
                } else {
                    dom.bulkDeleteBtn.style.display = 'none';
                }
            }
        }
    }

    // --- 6. RENDER PAGINATION ---
    function renderPagination(page) {
        const dom = getDOMElements();
        if (!dom.paginationControls) {
            console.warn('paginationControls not found');
            return;
        }

        dom.paginationControls.innerHTML = '';
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);

        if (totalPages === 0) return;

        // Previous
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.className = 'page-btn';
        prevBtn.disabled = page === 1;
        prevBtn.onclick = () => changePage(page - 1);
        dom.paginationControls.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `page-btn ${i === page ? 'active' : ''}`;
            btn.onclick = () => changePage(i);
            dom.paginationControls.appendChild(btn);
        }

        // Next
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.className = 'page-btn';
        nextBtn.disabled = page === totalPages;
        nextBtn.onclick = () => changePage(page + 1);
        dom.paginationControls.appendChild(nextBtn);
    }

    // --- 7. CHANGE PAGE ---
    function changePage(newPage) {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (newPage < 1 || newPage > totalPages) return;

        currentPage = newPage;
        renderTable(currentPage);
        renderPagination(currentPage);
        const dom = getDOMElements();
        if (dom.pageInput) {
            dom.pageInput.value = "";
        }
    }


    window.editContainer = function (id) {
        const p = containers.find(x => x.id === id);
        if (!p) return;
        if (p.inventoryStatus !== "Trống") return; // Safety check
        alert(`Chức năng chỉnh sửa đơn vị chứa: ${p.code}`);
    };

    window.printContainer = function (id) {
        const p = containers.find(x => x.id === id);
        if (!p) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>In QR Code đơn vị chứa - ${p.code}</title>
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    padding: 20px; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .label-container {
                    width: 300px;
                    border: 2px solid #000;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                }
                .label-title {
                    font-size: 36px;
                    font-weight: bold;
                    text-transform: uppercase;
                    text-align: center;
                }
                .qr-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @media print {
                    @page { margin: 0; }
                    body { margin: 0; height: auto; display: block; padding: 20px;}
                    .label-container { 
                        margin: 0 auto; 
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="label-container">
                <div class="label-title">${p.code}</div>
                <div style="font-size: 18px; font-weight: 500; margin-bottom: 10px;">${p.type}</div>
                <div class="qr-section">
                    <img src="${p.qrUrl}" width="200" height="200" />
                </div>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                }
            </script>
        </body>
        </html>
    `);
        printWindow.document.close();
        printWindow.document.close();
    };

    // --- DELETE MODAL LOGIC ---
    let pendingDeleteId = null;
    let pendingDeleteIds = []; // Added Array support

    // --- DELETE POPOVER LOGIC REMOVED ---
    // let activeDeletePopover = null;

    window.deleteContainer = function (event, id) {
        event.stopPropagation();

        const p = containers.find(x => x.id === id);
        if (!p) return;

        const popover = document.getElementById('delete-popover');
        const msgEl = document.getElementById('confirm-delete-message');
        
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa đơn vị chứa <strong>${p.code}</strong>?`;
        }

        // Positioning logic
        const rect = event.currentTarget.getBoundingClientRect();
        popover.style.display = 'block';
        
        // Calculate position (to the left of the button)
        const popoverRect = popover.getBoundingClientRect();
        popover.style.top = `${rect.top + (rect.height / 2) - (popoverRect.height / 2)}px`;
        popover.style.left = `${rect.left - popoverRect.width - 12}px`;

        pendingDeleteId = id;
        pendingDeleteIds = [id];
    };

    window.closeDeletePopover = function () {
        const popover = document.getElementById('delete-popover');
        if (popover) {
            popover.style.display = 'none';
        }
        pendingDeleteIds = [];
        pendingDeleteId = null;
    };

    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
        const popover = document.getElementById('delete-popover');
        if (popover && popover.style.display === 'block') {
            if (!e.target.closest('.popover-confirm') && !e.target.closest('.delete-btn')) {
                window.closeDeletePopover();
            }
        }
    });

    window.closeDeleteConfirmModal = window.closeDeletePopover;


    window.confirmDeleteContainer = function () {
        const ids = pendingDeleteIds.length > 0 ? pendingDeleteIds : (pendingDeleteId ? [pendingDeleteId] : []);

        if (ids.length > 0) {
            let removedCount = 0;
            ids.forEach(id => {
                const idx = containers.findIndex(p => p.id === id);
                if (idx !== -1) {
                    containers.splice(idx, 1);
                    removedCount++;
                    if (selectedIds.has(id)) selectedIds.delete(id);
                }
            });

            filterData();
            showToast(`Đã xóa ${removedCount} đơn vị chứa!`);
        }
        window.closeDeletePopover();
    };

    window.bulkDelete = function () {
        if (selectedIds.size === 0) return;

        // Filter valid containers to delete (only 'Trống')
        const idsToDelete = [];
        let invalidCount = 0;

        selectedIds.forEach(id => {
            const p = containers.find(item => item.id === id);
            if (p) {
                if (p.inventoryStatus === 'Trống') {
                    idsToDelete.push(id);
                } else {
                    invalidCount++;
                }
            }
        });

        if (idsToDelete.length === 0) {
            alert('Không có đơn vị chứa nào đủ điều kiện để xóa (đơn vị chứa đang có hàng).');
            return;
        }

        // Replaced standard confirm logic with Modal
        const msgEl = document.getElementById('confirm-delete-message');
        let message = `Bạn có chắc chắn muốn xóa <strong>${idsToDelete.length}</strong> đơn vị chứa trống đã chọn không?`;
        if (invalidCount > 0) {
            message += `<br/><small>(${invalidCount} đơn vị chứa đang có hàng sẽ bị bỏ qua)</small>`;
        }
        message += `<br />Hành động này không thể hoàn tác.`;

        if (msgEl) msgEl.innerHTML = message;

        pendingDeleteIds = idsToDelete;
        document.getElementById('delete-confirm-modal').classList.add('show');
    };

    window.bulkPrint = function () {
        if (selectedIds.size === 0) return;

        const idsToPrint = Array.from(selectedIds);
        const containersToPrint = containers.filter(p => selectedIds.has(p.id));

        if (containersToPrint.length === 0) return;

        const printWindow = window.open('', '_blank');

        let content = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>In Hàng Loạt QR Code Vật Chứa</title>
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    margin: 0;
                    padding: 20px;
                }
                .print-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: center;
                }
                .label-container {
                    width: 300px;
                    border: 2px solid #000;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    page-break-inside: avoid;
                }
                .label-title {
                    font-size: 36px;
                    font-weight: bold;
                    text-transform: uppercase;
                    text-align: center;
                }
                .qr-section img {
                    display: block;
                }
                @media print {
                    @page { margin: 0.5cm; }
                    body { padding: 0; }
                    .print-container { display: block; }
                    .label-container { 
                        margin: 0 auto 20px auto; 
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
    `;

        containersToPrint.forEach(p => {
            content += `
            <div class="label-container">
                <div class="label-title">${p.code}</div>
                <div style="font-size: 18px; font-weight: 500; margin-bottom: 10px;">${p.type}</div>
                <div class="qr-section">
                    <img src="${p.qrUrl}" width="200" height="200" />
                </div>
            </div>
        `;
        });

        content += `
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    // setTimeout(function() { window.close(); }, 1000); // Optional: Close after print
                }
            </script>
        </body>
        </html>
    `;

        printWindow.document.write(content);
        printWindow.document.close();
    };



    // --- Custom Picker Functions ---
    // (Old toolbar dropdown logic removed here)



    // --- 9. SETUP EVENT LISTENERS ---
    function setupFilterDropdowns() {
        const dom = getDOMElements();
        if (!dom.usageStatusDropdown) return;

        dom.usageStatusSelected.addEventListener('click', (e) => {
            e.stopPropagation();
            dom.usageStatusDropdown.classList.toggle('open');
        });

        const options = dom.usageStatusOptions.querySelectorAll('.dropdown-option');
        options.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = opt.dataset.value;
                const label = opt.innerText;

                currentFilterUsage = value;
                dom.usageStatusSelected.innerText = label;

                options.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');

                dom.usageStatusDropdown.classList.remove('open');
                filterData();
            });
        });

        document.addEventListener('click', () => {
            if (dom.usageStatusDropdown) dom.usageStatusDropdown.classList.remove('open');
        });
    }

    function setupEventListeners() {
        const dom = getDOMElements();

        // Search
        if (dom.searchInput) {
            dom.searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value.trim();
                filterData();
            });
        }

        // Page Jump
        if (dom.pageInput) {
            dom.pageInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    const page = parseInt(this.value);
                    if (page) changePage(page);
                }
            });
        }

        // Toggle Event Delegation
        let pendingToggleId = null;

        if (dom.tableBody) {
             dom.tableBody.addEventListener('change', (e) => {
                if (e.target.classList.contains('usage-toggle')) {
                    const id = parseInt(e.target.dataset.id);
                    const item = containers.find(p => p.id === id);
                    if (!item) return;

                    // Handle Turn OFF
                    if (!e.target.checked) {
                        // Show Confirmation Modal
                        pendingToggleId = id;
                        e.target.checked = true; // Visually revert to ON until confirmed

                        if (dom.toggleConfirmModal) {
                            dom.toggleConfirmModal.classList.add('popover-mode'); // Enable popover mode
                            if (dom.confirmContainerCode) dom.confirmContainerCode.innerText = item.code;
                            dom.toggleConfirmModal.classList.add('show');

                            if (dom.confirmContent) {
                                const rect = e.target.closest('.switch').getBoundingClientRect();
                                const popoverRect = dom.confirmContent.getBoundingClientRect();
                                const gap = 18;
                                
                                // Position popover to the LEFT of the toggle
                                let top = rect.top + (rect.height / 2) - (popoverRect.height / 2);
                                let left = rect.left - popoverRect.width - gap;

                                // Safety check for screen edges
                                if (left < 10) {
                                    // If not enough space on left, show on RIGHT
                                    left = rect.left + rect.width + gap;
                                    if (dom.confirmArrow) {
                                        dom.confirmArrow.style.left = '-7px';
                                        dom.confirmArrow.style.right = 'auto';
                                        dom.confirmArrow.style.borderRight = 'none';
                                        dom.confirmArrow.style.borderLeft = '1px solid #e2e8f0';
                                        dom.confirmArrow.style.borderTop = 'none';
                                        dom.confirmArrow.style.borderBottom = '1px solid #e2e8f0';
                                    }
                                } else {
                                    // Normal LEFT position arrow
                                    if (dom.confirmArrow) {
                                        dom.confirmArrow.style.right = '-7px';
                                        dom.confirmArrow.style.left = 'auto';
                                        dom.confirmArrow.style.borderLeft = 'none';
                                        dom.confirmArrow.style.borderRight = '1px solid #e2e8f0';
                                        dom.confirmArrow.style.borderBottom = 'none';
                                        dom.confirmArrow.style.borderTop = '1px solid #e2e8f0';
                                    }
                                }

                                dom.confirmContent.style.top = `${top}px`;
                                dom.confirmContent.style.left = `${left}px`;
                                
                                // Position arrow
                                if (dom.confirmArrow) {
                                    dom.confirmArrow.style.top = `${(popoverRect.height / 2) - 7}px`;
                                }
                            }
                        }
                    } else {
                        // Turn ON
                        item.isActive = true;
                        renderTable(currentPage);
                    }
                }
            });
        }

         // Modal Actions
        if (dom.confirmToggleBtn) {
            dom.confirmToggleBtn.onclick = () => {
                if (pendingToggleId !== null) {
                    const item = containers.find(p => p.id === pendingToggleId);
                    if (item) {
                        item.isActive = false;
                        renderTable(currentPage);
                    }
                }
                if (dom.toggleConfirmModal) {
                    dom.toggleConfirmModal.classList.remove('show');
                    dom.toggleConfirmModal.classList.remove('popover-mode');
                    if (dom.confirmContent) {
                        dom.confirmContent.style.top = '';
                        dom.confirmContent.style.left = '';
                    }
                }
                pendingToggleId = null;
            };
        }

        if (dom.cancelToggleBtn) {
            dom.cancelToggleBtn.onclick = () => {
                if (dom.toggleConfirmModal) {
                    dom.toggleConfirmModal.classList.remove('show');
                    dom.toggleConfirmModal.classList.remove('popover-mode');
                    if (dom.confirmContent) {
                        dom.confirmContent.style.top = '';
                        dom.confirmContent.style.left = '';
                    }
                }
                pendingToggleId = null;
            };
        }

        if (dom.toggleConfirmModal) {
            dom.toggleConfirmModal.addEventListener('click', (e) => {
                if (e.target === dom.toggleConfirmModal) {
                    dom.toggleConfirmModal.classList.remove('show');
                    dom.toggleConfirmModal.classList.remove('popover-mode');
                    if (dom.confirmContent) {
                        dom.confirmContent.style.top = '';
                        dom.confirmContent.style.left = '';
                    }
                    pendingToggleId = null;
                }
            });
        }

        // Checkbox Event Listeners
        if (dom.selectAll) {
            dom.selectAll.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                filteredData.forEach(p => {
                    if (isChecked) selectedIds.add(p.id);
                    else selectedIds.delete(p.id);
                });
                renderTable(currentPage);
            });
        }

        if (dom.tableBody) {
            dom.tableBody.addEventListener('change', (e) => {
                if (e.target.classList.contains('row-checkbox')) {
                    const id = parseInt(e.target.dataset.id);
                    if (e.target.checked) selectedIds.add(id);
                    else selectedIds.delete(id);
                    renderTable(currentPage);
                }
            });
        }

        if (dom.bulkPrintBtn) dom.bulkPrintBtn.onclick = window.bulkPrint;

        // --- 11. SCROLL SYNCHRONIZATION ---
        if (dom.scrollBody && dom.scrollHead) {
            dom.scrollBody.addEventListener('scroll', () => {
                dom.scrollHead.scrollLeft = dom.scrollBody.scrollLeft;
            });
        }
    }

    // --- 10. INITIALIZE ---
    function init() {
        // Re-fetch DOM elements to ensure they exist
        const dom = getDOMElements();

        if (!dom.tableBody || !dom.paginationControls) {
            console.log('Waiting for DOM elements...');
            setTimeout(init, 100);
            return;
        }

        console.log('Initializing container list...');
        setupFilterDropdowns();
        setupEventListeners();
        setupExtraListeners(); 
        filterData();
    }

    // --- New Container Modal Functions ---
    window.openContainerModal = function (id = null) {
        const modal = document.getElementById('containerModal');
        const modalTitle = modal.querySelector('.modal-title');
        const codeInput = document.getElementById('newContainerCode');
        const typeInput = document.getElementById('newContainerType');

        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
            
            if (id) {
                const p = containers.find(x => x.id === id);
                if (p) {
                    currentEditId = id;
                    modalTitle.innerText = 'Cập nhật vật chứa';
                    if (codeInput) codeInput.value = p.code;
                    if (typeInput) typeInput.value = p.type;
                    const lengthInput = document.getElementById('newContainerLength');
                    const widthInput = document.getElementById('newContainerWidth');
                    const heightInput = document.getElementById('newContainerHeight');
                    const maxLoadInput = document.getElementById('newContainerMaxLoad');
                    if (lengthInput) lengthInput.value = p.length || '';
                    if (widthInput) widthInput.value = p.width || '';
                    if (heightInput) heightInput.value = p.height || '';
                    if (maxLoadInput) maxLoadInput.value = p.maxLoad || '';
                    const activeToggle = document.getElementById('newContainerActive');
                    if (activeToggle) activeToggle.checked = p.isActive;
                }
            } else {
                currentEditId = null;
                modalTitle.innerText = 'Thêm mới vật chứa';
                // Generate next code suggested
                const nextId = containers.length > 0 ? Math.max(...containers.map(p => p.id)) + 1 : 1;
                if (codeInput) codeInput.value = `CT-${1000 + nextId}`;
                if (typeInput) typeInput.value = '';
                const lengthInput = document.getElementById('newContainerLength');
                const widthInput = document.getElementById('newContainerWidth');
                const heightInput = document.getElementById('newContainerHeight');
                const maxLoadInput = document.getElementById('newContainerMaxLoad');
                if (lengthInput) lengthInput.value = '';
                if (widthInput) widthInput.value = '';
                if (heightInput) heightInput.value = '';
                if (maxLoadInput) maxLoadInput.value = '';
                const activeToggle = document.getElementById('newContainerActive');
                if (activeToggle) activeToggle.checked = true;
            }
            
            initSearchableCombobox();
        }
    };

    window.editContainer = function (id) {
        window.openContainerModal(id);
    };

    window.closeContainerModal = function () {
        const modal = document.getElementById('containerModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                currentEditId = null;
            }, 200);
        }
    };

    function initSearchableCombobox() {
        const input = document.getElementById('newContainerType');
        const optionsDiv = document.getElementById('containerTypeOptions');
        if (!input || !optionsDiv) return;

        function renderOptions(filter = '') {
            const filtered = containerTypes.filter(t => t.toLowerCase().includes(filter.toLowerCase()));
            optionsDiv.innerHTML = filtered.map(t => `<div class="combobox-item">${t}</div>`).join('');
            
            optionsDiv.style.display = filtered.length > 0 ? 'block' : 'none';

            optionsDiv.querySelectorAll('.combobox-item').forEach(item => {
                item.onclick = function() {
                    input.value = this.innerText;
                    optionsDiv.style.display = 'none';
                };
            });
        }

        input.onfocus = () => renderOptions(input.value);
        input.oninput = () => renderOptions(input.value);
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.searchable-combobox')) {
                optionsDiv.style.display = 'none';
            }
        });
    }

    window.saveContainer = function () {
        const typeInput = document.getElementById('newContainerType');
        const codeInput = document.getElementById('newContainerCode');
        const activeToggle = document.getElementById('newContainerActive');

        if (!typeInput || !codeInput || !activeToggle) return;

        const type = typeInput.value.trim();
        const code = codeInput.value.trim();
        const length = document.getElementById('newContainerLength').value.trim();
        const width = document.getElementById('newContainerWidth').value.trim();
        const height = document.getElementById('newContainerHeight').value.trim();
        const maxLoad = document.getElementById('newContainerMaxLoad').value.trim();
        const isActive = activeToggle.checked;

        if (!type || !code) {
            if (window.showToast) window.showToast("Vui lòng nhập đầy đủ thông tin", "error");
            else alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (currentEditId) {
            // Update existing
            const idx = containers.findIndex(p => p.id === currentEditId);
            if (idx !== -1) {
                containers[idx].code = code;
                containers[idx].type = type;
                containers[idx].length = length;
                containers[idx].width = width;
                containers[idx].height = height;
                containers[idx].maxLoad = maxLoad;
                containers[idx].isActive = isActive;
                // Optionally update QR URL if code changed
                containers[idx].qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`;
            }
        } else {
            // Create new
            const newId = containers.length > 0 ? Math.max(...containers.map(p => p.id)) + 1 : 1;
            containers.unshift({
                id: newId,
                name: `Đơn vị chứa ${newId}`,
                code: code,
                type: type,
                length: length,
                width: width,
                height: height,
                maxLoad: maxLoad,
                qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`,
                status: "Đang đứng yên",
                warehouse: "Kho Flat",
                locationCode: "-",
                locationDetail: "-",
                inbound: null,
                material: null,
                inventoryStatus: "Trống",
                entryDate: "-",
                entryTimestamp: null,
                quantity: "-",
                isActive: isActive
            });
        }

        closeContainerModal();
        filterData();
        if (window.showToast) window.showToast("Lưu thành công!");
    };

    window.saveNewContainer = window.saveContainer; // Alias for backward compatibility if needed



    // ========== EXPORT / SYNC ==========
    window.exportExcel = function() {
        if (window.showToast) window.showToast('Đang trích xuất dữ liệu ra file Excel...', 'info');
        setTimeout(() => {
            if (window.showToast) window.showToast('Xuất file Excel thành công!');
        }, 1000);
    };

    window.importExcel = function() {
        if (window.showToast) window.showToast('Tính năng nhập Excel đang được khởi tạo...', 'info');
    };

    window.syncData = function() {
        if (window.showToast) window.showToast('Đang kết nối hệ thống...', 'info');
        setTimeout(() => {
            if (window.showToast) window.showToast('Đồng bộ thông tin mới nhất thành công', 'success');
        }, 1000);
    };

    // Hook up extra listeners safely inside init or setupEventListeners
    function setupExtraListeners() {
        const addBtn = document.querySelector('.add-btn');
        if (addBtn) {
            addBtn.onclick = window.openContainerModal;
        }

        const printBtn = document.getElementById('bulkPrintBtn');
        if (printBtn) {
            printBtn.onclick = window.bulkPrint;
        }

        const delBtn = document.getElementById('bulkDeleteBtn');
        if (delBtn) {
            delBtn.onclick = window.bulkDelete;
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
