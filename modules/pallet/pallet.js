// --- 1. MOCK DATA ---
(function () {
    const totalItems = 65;
    const pallets = [];
    const warehouses = ["Kho Flat", "Kho Stacker Crane", "Kho Tower"];
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

        // Constraint 1: Empty pallets must be stationary
        let status = invStatus === "Trống" ? "Đang đứng yên" : statusOptions[Math.floor(Math.random() * statusOptions.length)];

        const wh = warehouses[Math.floor(Math.random() * warehouses.length)];
        const code = `PL-${1000 + i}`;

        // Detailed Location Generation: 1-A2 (tầng-cột hàng)
        const floor = Math.floor(Math.random() * 5) + 1; // 1-5
        const col = String.fromCharCode(65 + Math.floor(Math.random() * 5)); // A-E
        const rowVal = Math.floor(Math.random() * 5) + 1; // 1-5

        // Short code for display
        let locationCode = `${floor}-${col}${rowVal}`;
        // Detailed text for tooltip or print
        let locationDetail = `Tầng ${floor} - Cột ${col} - Hàng ${rowVal}`;

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
                name: `Nhập hàng ${mat.name} Lô ${Math.floor(Math.random() * 100) + 1}`,
                date: d.toLocaleDateString('vi-VN')
            };
        }

        // Generate random entry date in hh:mm dd/mm/yyyy format (Range: 2025 - Mar 2026)
        const isToday = i <= 15; // Increased to 15 items for today
        const is2026 = Math.random() > 0.6 || isToday;
        const todayDate = new Date(); // Use actual current date

        let randomDate;
        if (invStatus === "Có hàng") {
            if (isToday) {
                // Today: 2026-03-09 with random time
                randomDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 
                                      Math.floor(Math.random() * 8) + 8, // 08:xx to 15:xx
                                      Math.floor(Math.random() * 60));
            } else {
                const yr = is2026 ? 2026 : 2025;
                const mo = is2026 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 12); // Jan-Feb if 2026
                const dy = Math.floor(Math.random() * 28) + 1;
                randomDate = new Date(yr, mo, dy, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
            }
        } else {
            randomDate = null;
        }

        const pad = (num) => String(num).padStart(2, '0');
        const entryDate = randomDate ? `${pad(randomDate.getHours())}:${pad(randomDate.getMinutes())} ${pad(randomDate.getDate())}/${pad(randomDate.getMonth() + 1)}/${randomDate.getFullYear()}` : "-";

        // Generate random pallet type


        pallets.push({
            id: i,
            name: `Pallet ${i}`,
            code: code,
            // type removed
            qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`,
            status: status,
            warehouse: wh,
            locationCode: locationCode,
            locationDetail: locationDetail,
            inbound: inbound,
            material: material,
            inventoryStatus: invStatus,
            entryDate: entryDate,
            entryTimestamp: randomDate, // Added for filtering
            quantity: quantity,
            // isActive removed
        });
    }

    // --- 2. CONFIGURATION & STATE ---
    const itemsPerPage = 20;
    let currentPage = 1;
    let currentSearch = "";
    let filteredData = [...pallets];
    // let selectedIds = new Set(); // Removed

    // Bespoke Date Picker State
    let selectedStartDate = null;
    let selectedEndDate = null;
    let currentViewLeft = new Date();
    let currentViewRight = new Date();
    currentViewRight.setMonth(currentViewRight.getMonth() + 1);

    let activeStartDate = null;
    let activeEndDate = null;

    // --- 3. DOM ELEMENTS GETTER ---
    function getDOMElements() {
        return {
            tableBody: document.getElementById('tableBody'),
            // Pagination
            paginationBar: document.querySelector('.pagination-bar'),
            showingRange: document.getElementById('showing-range'),
            totalItems: document.getElementById('total-items'),
            paginationNumbers: document.getElementById('pagination-numbers'),
            btnPrev: document.getElementById('btn-prev'),
            btnNext: document.getElementById('btn-next'),
            pageInput: document.getElementById('pageInput'),
            searchInput: document.getElementById('searchInput'),
            statusFilter: document.getElementById('statusFilter'),
            warehouseFilter: document.getElementById('warehouseFilter'),
            inventoryStatusFilter: document.getElementById('inventoryStatusFilter'),

            // Toolbar Dropdowns


            // usageStatusDropdown removed

            // Confirmation Modal
            // toggleConfirmModal removed

            // Custom Picker Elements
            dateRangeTrigger: document.getElementById('dateRangeTrigger'),
            dateRangeDisplay: document.getElementById('dateRangeDisplay'),
            analyticsPicker: document.getElementById('analyticsPicker'),
            tempRangeDisplay: document.getElementById('tempRangeDisplay'),
            applyBtn: document.getElementById('applyPicker'),
            cancelBtn: document.getElementById('cancelPicker'),
            clearBtn: document.getElementById('clearPicker'),
            sidebarItems: document.querySelectorAll('.sidebar-item'),

            leftMonthDropdown: document.getElementById('leftMonthDropdown'),
            leftMonthSelected: document.getElementById('leftMonthSelected'),
            leftMonthList: document.getElementById('leftMonthList'),
            leftYearDropdown: document.getElementById('leftYearDropdown'),
            leftYearSelected: document.getElementById('leftYearSelected'),
            leftYearList: document.getElementById('leftYearList'),

            rightMonthDropdown: document.getElementById('rightMonthDropdown'),
            rightMonthSelected: document.getElementById('rightMonthSelected'),
            rightMonthList: document.getElementById('rightMonthList'),
            rightYearDropdown: document.getElementById('rightYearDropdown'),
            rightYearSelected: document.getElementById('rightYearSelected'),
            rightYearList: document.getElementById('rightYearList'),

            leftCalendar: document.querySelector('#leftCalendar .days-container'),
            rightCalendar: document.querySelector('#rightCalendar .days-container'),

            // Bulk Actions
            selectAll: document.getElementById('selectAll'),
            bulkActions: document.getElementById('bulkActions'),
            bulkDeleteBtn: document.getElementById('bulkDeleteBtn'),
            bulkPrintBtn: null // Removed
        };
    }

    // --- 4. FILTER FUNCTION ---
    function filterData() {
        filteredData = pallets.filter(item => {

            if (currentSearch) {
                const s = currentSearch.toLowerCase();
                const match = item.code.toLowerCase().includes(s) ||
                    item.material?.code.toLowerCase().includes(s) ||
                    item.material?.name.toLowerCase().includes(s) ||
                    item.inbound?.code.toLowerCase().includes(s);
                if (!match) return false;
            }

            // Active Date Range Filter
            if (activeStartDate && activeEndDate) {
                const s = new Date(activeStartDate).setHours(0, 0, 0, 0);
                const e = new Date(activeEndDate).setHours(23, 59, 59, 999);
                if (item.entryTimestamp) {
                    const t = item.entryTimestamp.getTime();
                    if (t < s || t > e) return false;
                } else {
                    return false; // Hide empty pallets if filter is on
                }
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
        const tableContainer = document.querySelector('.table-container');

        if (filteredData.length === 0) {
            dom.tableBody.innerHTML = `
            <tr class="empty-state-row">
                <td colspan="12" style="text-align: center; padding: 60px 20px; color: #64748b;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                        <i class="fas fa-inbox" style="font-size: 48px; color: #cbd5e1;"></i>
                        <div style="font-size: 16px; font-weight: 500;">Không có dữ liệu</div>
                        <div style="font-size: 14px; color: #94a3b8;">Không tìm thấy kết quả phù hợp với bộ lọc của bạn</div>
                    </div>
                </td>
            </tr>
        `;
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        if (paginationContainer) paginationContainer.style.display = 'flex';

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredData.slice(start, end);

        paginatedItems.forEach((pallet, index) => {
            const stt = start + index + 1;

            let statusClass = "";
            if (pallet.status === "Đang đứng yên") statusClass = "status-standing";
            else if (pallet.status === "Đang di chuyển") statusClass = "status-moving";
            else if (pallet.status === "Đang chờ lệnh") statusClass = "status-waiting";
            else statusClass = "status-completed";

            // const isSelected = selectedIds.has(pallet.id); // Removed



            const inboundInfo = pallet.inbound
                ? `<div style="display: flex; align-items: center; gap: 6px;">
                    <div class="cell-truncate" style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600;" title="${pallet.inbound.code}">${pallet.inbound.code}</div>
                    <i class="fas fa-copy btn-copy" onclick="copyToClipboard('${pallet.inbound.code}', this)" title="Sao chép" style="flex-shrink: 0; margin: 0;"></i>
                </div>`
                : '<span style="color: #999;">-</span>';

            const materialInfo = pallet.material
                ? `<div class="product-list">
                    <div class="product-item">
                        <div class="prod-code">${pallet.material.code}</div>
                        <div class="prod-name" title="${pallet.material.name}">${pallet.material.name}</div>
                        <div style="margin-top: 4px; font-size: 0.9em; color: #64748b;">Số lượng: <span style="font-weight: 600; color: #333;">${pallet.quantity}</span></div>
                    </div>
                </div>`
                : '<span style="color: #999;">-</span>';

            const row = `
            <tr class="">

                <td style="text-align: center;">${stt}</td>
                <td style="text-align: center;"><b>${pallet.code}</b></td>
                <td style="text-align: left; padding-left: 12px; font-size: 0.95em;">${inboundInfo}</td>
                <td style="text-align: left; padding-left: 16px; font-size: 0.95em;">${materialInfo}</td>
                <td style="text-align: center; color: #64748b;">${pallet.entryDate}</td>

                <td style="text-align: center;">
                    <div style="font-weight: bold; color: #333;" title="${pallet.locationDetail}">${pallet.locationCode}</div>
                </td>
            </tr>`;
            dom.tableBody.insertAdjacentHTML('beforeend', row);
        });

        // Update Counts Text: "Hiển thị start-end trên tổng total"
        if (dom.showingRange && dom.totalItems) {
            const total = filteredData.length;
            const startItem = total > 0 ? start + 1 : 0;
            const endItem = Math.min(start + itemsPerPage, total);
            dom.showingRange.textContent = `${startItem}-${endItem}`;
            dom.totalItems.textContent = total;
        }



        // Toggle Bulk Actions
        // Toggle Bulk Actions (Print always visible, delete only if selected)
        if (dom.bulkActions && dom.bulkDeleteBtn) {
             dom.bulkDeleteBtn.style.display = 'none'; // Ensure hidden as feature removed
        }
    }

    // --- 6. RENDER PAGINATION ---
    function renderPagination(page) {
        const dom = getDOMElements();
        if (!dom.paginationNumbers) return;

        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        dom.paginationNumbers.innerHTML = '';

        if (totalPages === 0) {
            if (dom.paginationBar) dom.paginationBar.style.display = 'none';
            return;
        }
        
        if (dom.paginationBar) dom.paginationBar.style.display = 'flex';

        // Render Page Numbers
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `btn-page ${i === page ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => changePage(i);
            dom.paginationNumbers.appendChild(btn);
        }

        if (dom.btnPrev) dom.btnPrev.disabled = page === 1;
        if (dom.btnNext) dom.btnNext.disabled = page === totalPages || totalPages === 0;
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

    // --- 8. ACTION FUNCTIONS ---
    // Copy Function
    window.copyToClipboard = function (text, element) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            showCopyPopover(element);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    function showCopyPopover(element) {
        // Create popover if doesn't exist
        const popover = document.createElement('div');
        popover.className = 'copy-popover';
        popover.textContent = 'Copied!';
        document.body.appendChild(popover);

        const rect = element.getBoundingClientRect();
        popover.style.left = (rect.left + rect.width / 2) + 'px';
        popover.style.top = (rect.top - 10) + 'px'; // Show above (closer)

        // Remove after animation (1.5s matches CSS)
        setTimeout(() => {
            popover.remove();
        }, 1500);
    }

    // --- 8. ACTION FUNCTIONS ---
    // Action Functions Removed (edit, print, delete, bulk)

    // --- INIT COMBOBOXES ---
    function initComboboxes() {





    }

    // --- Custom Picker Functions ---
    // (Old toolbar dropdown logic removed here)

    function initPickerDropdowns() {
        // Keep date picker dropdowns as they are specific
        const dom = getDOMElements();
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 1; i++) years.push(i);

        const populate = (listEl, selectedEl, opts, isMonth, isLeft) => {
            listEl.innerHTML = opts.map((opt, i) => {
                const val = isMonth ? i : opt;
                return `<div class="dropdown-item" data-value="${val}">${opt}</div>`;
            }).join('');

            // Item click logic
            listEl.querySelectorAll('.dropdown-item').forEach(item => {
                item.onclick = (e) => {
                    e.stopPropagation();
                    const val = item.dataset.value;
                    if (isMonth) {
                        if (isLeft) currentViewLeft.setMonth(parseInt(val));
                        else currentViewRight.setMonth(parseInt(val));
                    } else {
                        if (isLeft) currentViewLeft.setFullYear(parseInt(val));
                        else currentViewRight.setFullYear(parseInt(val));
                    }

                    // Update selected text
                    selectedEl.textContent = item.textContent;

                    // Close dropdown
                    listEl.parentElement.classList.remove('active');

                    // Highlight selected item
                    listEl.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');

                    renderCalendars();
                };
            });
        };

        populate(dom.leftMonthList, dom.leftMonthSelected, months, true, true);
        populate(dom.rightMonthList, dom.rightMonthSelected, months, true, false);
        populate(dom.leftYearList, dom.leftYearSelected, years, false, true);
        populate(dom.rightYearList, dom.rightYearSelected, years, false, false);

        const syncUI = () => {
            const leftMonthIdx = currentViewLeft.getMonth();
            const leftYearVal = currentViewLeft.getFullYear();
            const rightMonthIdx = currentViewRight.getMonth();
            const rightYearVal = currentViewRight.getFullYear();

            dom.leftMonthSelected.textContent = months[leftMonthIdx];
            dom.leftYearSelected.textContent = leftYearVal;
            dom.rightMonthSelected.textContent = months[rightMonthIdx];
            dom.rightYearSelected.textContent = rightYearVal;

            // Highlight in lists
            const updateHighlight = (listEl, val) => {
                listEl.querySelectorAll('.dropdown-item').forEach(item => {
                    if (item.dataset.value == val) item.classList.add('selected');
                    else item.classList.remove('selected');
                });
            };

            updateHighlight(dom.leftMonthList, leftMonthIdx);
            updateHighlight(dom.leftYearList, leftYearVal);
            updateHighlight(dom.rightMonthList, rightMonthIdx);
            updateHighlight(dom.rightYearList, rightYearVal);

            renderCalendars();
        };

        // Toggle dropdowns
        const setupToggle = (dropdownEl) => {
            dropdownEl.onclick = (e) => {
                e.stopPropagation();
                const isActive = dropdownEl.classList.contains('active');

                // Close all other custom dropdowns
                document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('active'));

                if (!isActive) dropdownEl.classList.add('active');
            };
        };

        setupToggle(dom.leftMonthDropdown);
        setupToggle(dom.leftYearDropdown);
        setupToggle(dom.rightMonthDropdown);
        setupToggle(dom.rightYearDropdown);

        syncUI();
    }

    function initToolbarDropdowns() {
        const dom = getDOMElements();

        const setup = (dropdownEl, listEl, selectedEl, opts, defaultText, stateVarSetter) => {
            // Populate
            listEl.innerHTML = opts.map(opt => `<div class="dropdown-item" data-value="${opt === defaultText ? '' : opt}">${opt}</div>`).join('');

            // Handle Item Click
            listEl.querySelectorAll('.dropdown-item').forEach(item => {
                item.onclick = (e) => {
                    e.stopPropagation();
                    const val = item.dataset.value;
                    selectedEl.textContent = item.textContent;

                    // Update State and Filter
                    stateVarSetter(val);

                    // Close
                    dropdownEl.classList.remove('active');

                    // Highlight
                    listEl.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');

                    filterData();
                };
            });

            // Handle dropdown toggle
            dropdownEl.onclick = (e) => {
                e.stopPropagation();
                // Close other dropdowns first
                document.querySelectorAll('.custom-dropdown').forEach(d => {
                    if (d !== dropdownEl) d.classList.remove('active');
                });
                dropdownEl.classList.toggle('active');
            };
        };




    }

    function renderCalendars() {
        const dom = getDOMElements();

        const render = (container, viewDate) => {
            container.innerHTML = '';
            const year = viewDate.getFullYear();
            const month = viewDate.getMonth();

            const firstDayRaw = new Date(year, month, 1).getDay();
            const firstDay = (firstDayRaw === 0) ? 6 : firstDayRaw - 1; // 0=Mon, 6=Sun
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Prefill empty days
            for (let i = 0; i < firstDay; i++) {
                container.insertAdjacentHTML('beforeend', '<div class="calendar-day empty"></div>');
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const date = new Date(year, month, d);
                let cls = "calendar-day";

                if (selectedStartDate && date.toDateString() === selectedStartDate.toDateString()) cls += " selected range-start";
                if (selectedEndDate && date.toDateString() === selectedEndDate.toDateString()) cls += " selected range-end";
                if (selectedStartDate && selectedEndDate && date > selectedStartDate && date < selectedEndDate) cls += " in-range";

                const today = new Date();
                const isToday = date.getDate() === today.getDate() && 
                                date.getMonth() === today.getMonth() && 
                                date.getFullYear() === today.getFullYear();
                if (isToday) cls += " today";

                const dayEl = document.createElement('div');
                dayEl.className = cls;
                dayEl.textContent = d;
                dayEl.onclick = (e) => {
                    e.stopPropagation();
                    handleDateClick(date);
                };
                container.appendChild(dayEl);
            }
        };

        render(dom.leftCalendar, currentViewLeft);
        render(dom.rightCalendar, currentViewRight);
        updateTempDisplay();
    }

    function handleDateClick(date) {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            selectedStartDate = date;
            selectedEndDate = null;
        } else if (date < selectedStartDate) {
            selectedEndDate = selectedStartDate;
            selectedStartDate = date;
        } else {
            selectedEndDate = date;
        }
        renderCalendars();
    }

    function updateTempDisplay() {
        const dom = getDOMElements();
        const format = (d) => d ? d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : "...";
        dom.tempRangeDisplay.textContent = `${format(selectedStartDate)} — ${format(selectedEndDate)}`;
    }

    function applyFilter() {
        const dom = getDOMElements();
        if (selectedStartDate && selectedEndDate) {
            activeStartDate = selectedStartDate;
            activeEndDate = selectedEndDate;
            const format = (d) => d.toLocaleDateString('vi-VN');
            dom.dateRangeDisplay.textContent = `${format(activeStartDate)} - ${format(activeEndDate)}`;
            dom.analyticsPicker.classList.remove('active');
            filterData();
        } else if (!selectedStartDate && !selectedEndDate) {
            activeStartDate = null;
            activeEndDate = null;
            dom.dateRangeDisplay.textContent = 'Tất cả thời gian';
            dom.analyticsPicker.classList.remove('active');
            filterData();
        }
    }

    function clearFilters() {
        const dom = getDOMElements();
        selectedStartDate = null;
        selectedEndDate = null;
        activeStartDate = null;
        activeEndDate = null;


        dom.dateRangeDisplay.textContent = "dd/mm/yyyy - dd/mm/yyyy";
        dom.sidebarItems.forEach(i => i.classList.remove('active'));
        renderCalendars();
        filterData();
    }

    // --- 8.5 INITIAL DATE RANGE ---
    function initDefaultDateRange() {
        const today = new Date(); // 2026-03-14
        activeStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        activeEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        selectedStartDate = new Date(activeStartDate);
        selectedEndDate = new Date(activeEndDate);

        const format = function (d) {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return dd + '/' + mm + '/' + yyyy;
        };

        const dom = getDOMElements();
        if (dom.dateRangeDisplay) {
            dom.dateRangeDisplay.textContent = format(activeStartDate) + ' - ' + format(activeEndDate);
        }

        // Set sidebar item "Hôm nay" to active
        setTimeout(() => {
            const rangeItems = document.querySelectorAll('.sidebar-item[data-range]');
            rangeItems.forEach(i => {
                if (i.getAttribute('data-range') === 'today') i.classList.add('active');
                else i.classList.remove('active');
            });
        }, 100);
    }

    // Global Toggle Function (Outside setupPicker to be safe)
    window.toggleDateRangePicker = function (e) {
        try {
            e.preventDefault();
            e.stopPropagation();
            const picker = document.getElementById('analyticsPicker');
            if (picker) {
                picker.classList.toggle('active');
                if (picker.classList.contains('active')) {
                    // We need to access initPickerDropdowns. 
                    // Since it's inside IIFE, this function works because it's a closure if defined inside IIFE.
                    // If this script is re-run, window.toggle... is overwritten, which is fine.
                    if (typeof initPickerDropdowns === 'function') initPickerDropdowns();
                }
            }
        } catch (err) {
            console.error("Error toggling date picker:", err);
        }
    };

    // --- setupEventListeners Refactored ---
    function setupPicker() {
        const dom = getDOMElements();

        dom.analyticsPicker.onclick = (e) => e.stopPropagation();

        // Note: onclick is now handled by inline HTML attribute calling window.toggleDateRangePicker

        // Setup global click to close
        document.addEventListener('click', function (e) {
            const picker = document.getElementById('analyticsPicker');
            const trigger = document.getElementById('dateRangeTrigger');
            if (picker && trigger) {
                if (!picker.contains(e.target) && !trigger.contains(e.target)) {
                    picker.classList.remove('active');
                }
            }
        });

        // Initialize toolbar dropdowns
        try {
            if (typeof initToolbarDropdowns === 'function') {
                initToolbarDropdowns();
            }
        } catch (err) {
            console.error("DEBUG: Error in initToolbarDropdowns:", err);
        }

        // --- RESTORED DATE PICKER LISTENERS ---
        if (dom.applyBtn) dom.applyBtn.onclick = applyFilter;
        if (dom.cancelBtn) dom.cancelBtn.onclick = () => {
             dom.analyticsPicker.classList.remove('active');
        };
        if (dom.clearBtn) dom.clearBtn.onclick = clearFilters;

        if (dom.sidebarItems) {
            dom.sidebarItems.forEach(item => {
                item.onclick = (e) => {
                    e.stopPropagation();
                    dom.sidebarItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');

                    const range = item.dataset.range;
                    const now = new Date();
                    let start = new Date(), end = new Date();

                    // Correct logic for ranges
                    switch (range) {
                        case 'all': start = null; end = null; break;
                        case 'today': 
                            // start and end are already 'now'
                            break;
                        case 'last3': start.setDate(now.getDate() - 2); break; // Include today
                        case 'last7': start.setDate(now.getDate() - 6); break;
                        case 'last30': start.setDate(now.getDate() - 29); break;
                        case 'last3mo': start.setMonth(now.getMonth() - 3); break;
                        case 'last6mo': start.setMonth(now.getMonth() - 6); break;
                        case 'last1yr': start.setFullYear(now.getFullYear() - 1); break;
                    }

                    selectedStartDate = start;
                    selectedEndDate = end;
                    
                    // Update calendar view to show the start of the range
                    if (start && end) {
                        currentViewLeft = new Date(start);
                        currentViewRight = new Date(start);
                        currentViewRight.setMonth(start.getMonth() + 1);
                    }

                    renderCalendars();
                };
            });
        }
        // --------------------------------------



        if (dom.bulkPrintBtn) dom.bulkPrintBtn.onclick = null; // Removed
    }

    // --- 9. SETUP EVENT LISTENERS ---
    function setupEventListeners() {
        const dom = getDOMElements();

        // Search
        if (dom.searchInput) {
            dom.searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value.trim();
                filterData();
            });
        }

        // Status Filter
        if (dom.statusFilter) {
            dom.statusFilter.addEventListener('change', (e) => {
                currentFilterStatus = e.target.value;
                filterData();
            });
        }

        // Warehouse Filter
        if (dom.warehouseFilter) {
            dom.warehouseFilter.addEventListener('change', (e) => {
                currentFilterWarehouse = e.target.value;
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

        if (dom.btnPrev) {
            dom.btnPrev.onclick = () => changePage(currentPage - 1);
        }
        if (dom.btnNext) {
            dom.btnNext.onclick = () => changePage(currentPage + 1);
        }

        setupPicker();
    }

    // --- 10. INITIALIZE ---
    // --- 10. INITIALIZE ---
    function init() {
        // Re-fetch DOM elements to ensure they exist
        const dom = getDOMElements();

        // Check if required elements exist, if not retry
        // Also checking for 'analyticsPicker' to ensure the date picker structure is loaded
        if (!dom.tableBody || !dom.paginationNumbers || !dom.analyticsPicker) {
            console.log('Waiting for DOM elements...');
            setTimeout(init, 100);
            return;
        }

        console.log('Initializing pallet list...');
        initDefaultDateRange(); // Set default date to today
        setupEventListeners();
        setupExtraListeners(); // Moved inside init
        filterData();
    }

    // New Pallet Modal Functions Removed

    function setupExtraListeners() {
        // Functions removed
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
