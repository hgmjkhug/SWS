// Kanban WCS Logic
(function() {
    'use strict';

    // Mock Data
    // Mock Data
    const mockTasks = [
        // --- PENDING ---
        { id: 'NK-20231024-001', type: 'Nhập kho', status: 'pending', warehouse: 'Kho A', device: 'AGV-01', step: 'Di chuyển đến vị trí nhận', logs: [{ time: '08:00', msg: 'Tạo lệnh nhập kho' }, { time: '08:05', msg: 'Đang chờ thiết bị' }] },
        { id: 'NK-20231024-005', type: 'Nhập kho', status: 'pending', warehouse: 'Kho B', device: 'Forklift 05', step: 'Chờ xác nhận', logs: [{ time: '12:00', msg: 'Yêu cầu nhập kho thủ công' }] },
        { id: 'NK-20231024-008', type: 'Nhập kho', status: 'pending', warehouse: 'Kho A', device: 'AGV-03', step: 'Đang xếp hàng chờ', logs: [{ time: '08:10', msg: 'Xe đang đợi tại vùng đệm' }] },
        { id: 'XK-20231024-012', type: 'Xuất kho', status: 'pending', warehouse: 'Kho C', device: 'Conveyor 02', step: 'Chờ lệnh xuất', logs: [{ time: '09:00', msg: 'Đơn hàng tạo mới' }] },
        { id: 'NK-20231024-015', type: 'Nhập kho', status: 'pending', warehouse: 'Kho B', device: 'Stacker 01', step: 'Kiểm tra vị trí trống', logs: [{ time: '10:30', msg: 'Hệ thống đang quét vị trí' }] },

        // --- IN PROGRESS ---
        { id: 'XK-20231024-002', type: 'Xuất kho', status: 'in_progress', warehouse: 'Kho B', device: 'Stacker Crane 02', step: 'Nâng pallet lên kệ', logs: [{ time: '09:15', msg: 'Xe đang di chuyển' }, { time: '09:20', msg: 'Đang nâng hàng' }] },
        { id: 'NK-20231024-006', type: 'Nhập kho', status: 'in_progress', warehouse: 'Kho A', device: 'AGV-02', step: 'Đang di chuyển', logs: [{ time: '13:05', msg: 'Đang di chuyển đến vùng đệm' }, { time: '13:10', msg: 'Cập nhật vị trí: Zone B' }] },
        { id: 'XK-20231024-011', type: 'Xuất kho', status: 'in_progress', warehouse: 'Kho A', device: 'Conveyor 01', step: 'Vận chuyển ra cổng', logs: [{ time: '14:00', msg: 'Hàng đã lên băng tải' }] },
        { id: 'NK-20231024-019', type: 'Nhập kho', status: 'in_progress', warehouse: 'Kho C', device: 'Forklift 02', step: 'Đưa hàng vào kệ', logs: [{ time: '15:20', msg: 'Đang thao tác tại Line 3' }] },
        { id: 'NK-20231024-021', type: 'Nhập kho', status: 'in_progress', warehouse: 'Kho B', device: 'AGV-04', step: 'Di chuyển về sạc', logs: [{ time: '16:00', msg: 'Pin yếu, về trạm sạc' }] },
        { id: 'XK-20231024-025', type: 'Xuất kho', status: 'in_progress', warehouse: 'Kho A', device: 'Stacker Crane 01', step: 'Lấy hàng tầng 3', logs: [{ time: '11:45', msg: 'Đang hạ càng nâng' }] },

        // --- COMPLETE ---
        { id: 'NK-20231024-003', type: 'Nhập kho', status: 'complete', warehouse: 'Kho A', device: 'AGV-03', step: 'Hoàn thành', logs: [{ time: '10:00', msg: 'Tạo lệnh' }, { time: '10:30', msg: 'Hoàn thành nhập kho' }] },
        { id: 'XK-20231024-010', type: 'Xuất kho', status: 'complete', warehouse: 'Kho C', device: 'Forklift 01', step: 'Đã xuất kho', logs: [{ time: '08:30', msg: 'Xe tải đã nhận hàng' }] },
        { id: 'NK-20231024-014', type: 'Nhập kho', status: 'complete', warehouse: 'Kho B', device: 'AGV-02', step: 'Về vị trí đỗ', logs: [{ time: '17:00', msg: 'Nhiệm vụ hoàn tất' }] },
        { id: 'NK-20231024-022', type: 'Nhập kho', status: 'complete', warehouse: 'Kho A', device: 'Stacker Crane 03', step: 'Kiểm kê xong', logs: [{ time: '18:15', msg: 'Dữ liệu đã đồng bộ' }] },
        { id: 'XK-20231024-030', type: 'Xuất kho', status: 'complete', warehouse: 'Kho B', device: 'Conveyor 03', step: 'Dừng băng tải', logs: [{ time: '19:00', msg: 'Hết ca làm việc' }] },

        // --- BUG ---
        { id: 'XK-20231024-004', type: 'Xuất kho', status: 'bug', warehouse: 'Kho C', device: 'Conveyor 01', step: 'Lỗi cảm biến', logs: [{ time: '11:00', msg: 'Bắt đầu băng tải' }, { time: '11:05', msg: 'Cảnh báo: Kẹt hàng tại vị trí C1' }] },
        { id: 'NK-20231024-007', type: 'Nhập kho', status: 'bug', warehouse: 'Kho A', device: 'Stacker Crane 01', step: 'Mất kết nối', logs: [{ time: '09:45', msg: 'Không tìm thấy tín hiệu điều khiển' }] },
        { id: 'XK-20231024-018', type: 'Xuất kho', status: 'bug', warehouse: 'Kho B', device: 'AGV-05', step: 'Va chạm vật cản', logs: [{ time: '14:30', msg: 'Cảm biến va chạm kích hoạt' }] },
        { id: 'NK-20231024-029', type: 'Nhập kho', status: 'bug', warehouse: 'Kho C', device: 'Forklift 03', step: 'Lỗi động cơ', logs: [{ time: '10:15', msg: 'Quá nhiệt động cơ nâng' }] },
        { id: 'NK-20231024-033', type: 'Nhập kho', status: 'bug', warehouse: 'Kho A', device: 'System', step: 'Lỗi dữ liệu', logs: [{ time: '15:50', msg: 'Không thể đồng bộ tồn kho' }] }
    ];

    // State
    let currentWarehouseFilter = 'all';
    let currentSearchTerm = '';

    // Date Range Picker State
    const today = new Date();
    // Default to from Monday of current week to today
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
    const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    let startDate = new Date(today);
    startDate.setDate(today.getDate() - daysSinceMonday);
    startDate.setHours(0,0,0,0);
    let endDate = new Date(today);
    endDate.setHours(23,59,59,999);
    
    let tempRange = { start: new Date(startDate), end: new Date(endDate) };
    let selectedRange = { start: new Date(startDate), end: new Date(endDate) };
    
    let currentLeftDate = new Date(startDate);
    let currentRightDate = new Date(endDate);
    if (currentLeftDate.getMonth() === currentRightDate.getMonth() && currentLeftDate.getFullYear() === currentRightDate.getFullYear()) {
        currentRightDate.setMonth(currentRightDate.getMonth() + 1);
    }

    // Initialize Dates for Mock Data
    mockTasks.forEach((t, index) => {
        const date = new Date(today);
        // distribute within the last 7 days to show up in the default filter
        date.setDate(date.getDate() - Math.floor(Math.random() * 5)); 
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));
        
        t.rawDate = date;
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        t.createdDate = `${hours}:${minutes} ${day}/${month}/${year}`;
        
        // Dynamically update logs to be logically after creation time
        if (t.logs && t.logs.length > 0) {
            let logDate = new Date(date);
            t.logs.forEach((log, logIndex) => {
                // Add seconds to make log time after card creation time
                // E.g. first log at 37 seconds, next log a few minutes later
                let addedMinutes = logIndex === 0 ? 0 : Math.floor(Math.random() * 3) + 1;
                logDate.setMinutes(logDate.getMinutes() + addedMinutes);
                
                // Add a random amount of seconds
                let addedSeconds = Math.floor(Math.random() * 45) + 5; 
                logDate.setSeconds(logDate.getSeconds() + addedSeconds);

                const logHours = String(logDate.getHours()).padStart(2, "0");
                const logMinutes = String(logDate.getMinutes()).padStart(2, "0");
                const logSeconds = String(logDate.getSeconds()).padStart(2, "0");
                
                log.time = `${logHours}:${logMinutes}:${logSeconds}`;
            });
        }
    });

    // Initialize function
    function initKanban() {
        // Safety check for DOM readiness
        if (!document.querySelector('.custom-dropdown')) {
            console.warn('Kanban DOM not ready, retrying in 50ms...');
            setTimeout(initKanban, 50);
            return;
        }

        initDropdown();
        initSearch();
        initDatePicker();
        renderBoard();
    }

    // Check if DOM is already loaded (for dynamic loading scenarios)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKanban);
    } else {
        initKanban();
    }

    // Expose for manual re-init if needed
    window.initKanban = initKanban;

    // Initialize Searchable Combobox
    function initDropdown() {
        const dropdown = document.querySelector('.custom-dropdown');
        if(!dropdown) return; // Guard clause
        
        const input = document.getElementById('warehouse-input');
        const options = document.getElementById('warehouse-options');
        const icon = dropdown.querySelector('.combo-icon');

        // Load Warehouses from LocalStorage (Mocked in warehouse module)
        // Usually it's stored under 'wms_warehouses_v5' in the demo
        const stored = localStorage.getItem('wms_warehouses_v5');
        if (stored) {
            try {
                const warehouses = JSON.parse(stored);
                // Keep "All" option (first one)
                const allOption = options.querySelector('[data-value="all"]');
                options.innerHTML = '';
                if(allOption) options.appendChild(allOption);

                // Add Warehouses using the 'name' field
                warehouses.forEach(w => {
                    if (w.status === 'Ngưng sử dụng') return; // Skip inactive
                    const div = document.createElement('div');
                    div.className = 'dropdown-option';
                    div.dataset.value = w.name; // Filter by name to keep it simple
                    div.textContent = w.name;
                    options.appendChild(div);
                });
                
                // Map mock tasks to random real warehouses for demo purposes
                // Only if mockTasks haven't been mapped yet
                if (mockTasks.length > 0 && mockTasks[0].warehouse.startsWith('Kho ')) {
                    const activeWarehouses = warehouses.filter(w => w.status !== 'Ngưng sử dụng').map(w => w.name);
                    if (activeWarehouses.length > 0) {
                        mockTasks.forEach((t, index) => {
                            t.warehouse = activeWarehouses[index % activeWarehouses.length];
                        });
                    }
                }
            } catch(e) {
                console.error('Error parsing warehouses', e);
            }
        } else {
             // Fallback if no local storage found
             const fallbackWarehouses = ['CÔNG TY THÉP', 'TẬP ĐOÀN THACO', 'NHÀ MÁY LẮP RÁP'];
             const allOption = options.querySelector('[data-value="all"]');
             options.innerHTML = '';
             if(allOption) options.appendChild(allOption);
             
             fallbackWarehouses.forEach(w => {
                  const div = document.createElement('div');
                  div.className = 'dropdown-option';
                  div.dataset.value = w;
                  div.textContent = w;
                  options.appendChild(div);
             });
             
             if (mockTasks[0].warehouse.startsWith('Kho ')) {
                  mockTasks.forEach((t, index) => {
                      t.warehouse = fallbackWarehouses[index % fallbackWarehouses.length];
                  });
             }
        }

        // Open dropdown
        function openDropdown() {
            options.classList.add('show');
        }

        // Close dropdown
        function closeDropdown() {
            options.classList.remove('show');
        }

        // Toggle logic
        function toggleDropdown(e) {
            e.stopPropagation();
            if (options.classList.contains('show')) {
                closeDropdown();
            } else {
                openDropdown();
                input.focus();
            }
        }

        // Event Listeners
        // Remove old listeners? No, IIFE creates new functions. 
        // Elements are replaced on module reload, so simple addEventListener is fine.
        
        input.addEventListener('focus', openDropdown);
        
        input.addEventListener('click', (e) => {
            e.stopPropagation();
            openDropdown();
        });

        icon.addEventListener('click', toggleDropdown);

        // Filter Options
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            let hasVisible = false;
            
            // Re-query items in case of updates
            const dynamicItems = options.querySelectorAll('.dropdown-option');

            dynamicItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(term)) {
                    item.style.display = 'block';
                    hasVisible = true;
                } else {
                    item.style.display = 'none';
                }
            });

            // Ensure it's open when typing
            if (!options.classList.contains('show')) {
                openDropdown();
            }
        });

        // Handle Selection (Delegation for dynamic items)
        options.addEventListener('click', (e) => {
            const item = e.target.closest('.dropdown-option');
            if (!item) return;
            
            e.stopPropagation();
            const value = item.dataset.value;
            const text = item.textContent;

            // Update Input
            input.value = text;
            
            // Mark selected style
            const allOpts = options.querySelectorAll('.dropdown-option');
            allOpts.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');

            closeDropdown();

            // Reset Filter (show all options next time)
            setTimeout(() => {
                allOpts.forEach(i => i.style.display = 'block');
            }, 200);

            // Update State & Render
            currentWarehouseFilter = value;
            renderBoard();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            // Garbage collection for event listeners from previous module loads
            if (!dropdown || !dropdown.isConnected) return;
            
            if (!dropdown.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    // Initialize Search
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        if(!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase();
            renderBoard();
        });
    }

    // Render Kanban Board
    function renderBoard() {
        // 1. Filter Data
        const filteredTasks = mockTasks.filter(task => {
            const matchesWarehouse = currentWarehouseFilter === 'all' || task.warehouse === currentWarehouseFilter;
            const matchesSearch = task.id.toLowerCase().includes(currentSearchTerm) || 
                                  task.device.toLowerCase().includes(currentSearchTerm);
            
            let matchesDate = true;
            if (selectedRange.start && selectedRange.end && task.rawDate) {
                const taskDate = new Date(task.rawDate).setHours(0,0,0,0);
                const s = new Date(selectedRange.start).setHours(0,0,0,0);
                const e = new Date(selectedRange.end).setHours(0,0,0,0);
                matchesDate = taskDate >= s && taskDate <= e;
            }
                                  
            return matchesWarehouse && matchesSearch && matchesDate;
        });

        // 2. Clear Columns
        const columns = {
            pending: document.getElementById('col-pending'),
            in_progress: document.getElementById('col-in_progress'),
            complete: document.getElementById('col-complete'),
            bug: document.getElementById('col-bug')
        };

        const counts = {
            pending: 0,
            in_progress: 0,
            complete: 0,
            bug: 0
        };

        // Clear inner HTML
        Object.values(columns).forEach(col => { if(col) col.innerHTML = ''; });

        // 3. Populate Columns
        filteredTasks.forEach(task => {
            const cardHTML = createCardHTML(task);
            if (columns[task.status]) {
                columns[task.status].insertAdjacentHTML('beforeend', cardHTML);
                counts[task.status]++;
            }
        });

        // 4. Update Counts
        const countPending = document.getElementById('count-pending');
        if(countPending) countPending.textContent = counts.pending;
        
        const countInProgress = document.getElementById('count-in_progress');
        if(countInProgress) countInProgress.textContent = counts.in_progress;
        
        const countComplete = document.getElementById('count-complete');
        if(countComplete) countComplete.textContent = counts.complete;
        
        const countBug = document.getElementById('count-bug');
        if(countBug) countBug.textContent = counts.bug;
    }

    // Create Card HTML Template
    function createCardHTML(task) {
        const typeClass = task.type === 'Nhập kho' ? 'type-in' : 'type-out';
        
        // Generate Logs HTML (last 2 logs)
        const logsHTML = task.logs.slice(-2).map(log => `
            <div class="log-item">
                <span class="log-time">${log.time}</span>
                <span class="log-msg">${log.msg}</span>
            </div>
        `).join('');

        return `
            <div class="kanban-card status-${task.status}">
                <div class="card-header">
                    <span class="card-code">${task.id}</span>
                    <span class="card-type ${typeClass}">${task.type}</span>
                </div>
                
                <div class="card-info">
                    <div class="info-row">
                        <i class="fas fa-clock info-icon"></i>
                        <span>${task.createdDate}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-robot info-icon"></i>
                        <span class="text-highlight">${task.device}</span>
                    </div>
                </div>

                <div class="step-badge">
                    <i class="fas fa-shoe-prints"></i>
                    ${task.step}
                </div>

                <div class="card-logs">
                    <div class="log-title">Log Hoạt động</div>
                    ${logsHTML}
                </div>
            </div>
        `;
    }

    // --- DATE PICKER LOGIC ---
    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }
    function formatDate(date) {
        if (!date) return "";
        const d = String(date.getDate()).padStart(2, "0");
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }
    function isSameDay(d1, d2) {
        if (!d1 || !d2) return false;
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    }
    function isDateInRange(date, start, end) {
        if (!start || !end || !date) return false;
        const d = new Date(date).setHours(0, 0, 0, 0);
        const s = new Date(start).setHours(0, 0, 0, 0);
        const e = new Date(end).setHours(0, 0, 0, 0);
        return d >= s && d <= e;
    }
    
    window.toggleDateRangePicker = function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const picker = document.getElementById("analyticsPicker");
        if (picker) {
            picker.classList.toggle("active");
            if (picker.classList.contains("active")) {
                renderCalendars();
                initPickerDropdowns();
            }
        }
    };

    function initDatePicker() {
        const triggerDisplay = document.getElementById("dateRangeDisplay");
        if (triggerDisplay && selectedRange.start && selectedRange.end) {
            triggerDisplay.textContent = `${formatDate(selectedRange.start)} - ${formatDate(selectedRange.end)}`;
        }
        setupExtraListeners();
    }

    function initPickerDropdowns() {
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        ["left", "right"].forEach((side) => {
            const current = side === "left" ? currentLeftDate : currentRightDate;
            const monthList = document.getElementById(`${side}MonthList`);
            const yearList = document.getElementById(`${side}YearList`);
            if (monthList) {
                monthList.innerHTML = "";
                months.forEach((m, idx) => {
                    const item = document.createElement("div");
                    item.className = `dropdown-item ${idx === current.getMonth() ? "selected" : ""}`;
                    item.textContent = m;
                    item.onclick = (e) => {
                        e.stopPropagation();
                        current.setMonth(idx);
                        document.getElementById(`${side}MonthSelected`).textContent = m;
                        const dd = document.getElementById(`${side}MonthDropdown`);
                        if (dd) dd.classList.remove("active");
                        renderCalendars();
                    };
                    monthList.appendChild(item);
                });
                document.getElementById(`${side}MonthSelected`).textContent = months[current.getMonth()];
            }
            if (yearList) {
                yearList.innerHTML = "";
                const currentYear = new Date().getFullYear();
                for (let y = currentYear - 5; y <= currentYear + 5; y++) {
                    const item = document.createElement("div");
                    item.className = `dropdown-item ${y === current.getFullYear() ? "selected" : ""}`;
                    item.textContent = y;
                    item.onclick = (e) => {
                        e.stopPropagation();
                        current.setFullYear(y);
                        document.getElementById(`${side}YearSelected`).textContent = y;
                        const dd = document.getElementById(`${side}YearDropdown`);
                        if (dd) dd.classList.remove("active");
                        renderCalendars();
                    };
                    yearList.appendChild(item);
                }
                document.getElementById(`${side}YearSelected`).textContent = current.getFullYear();
            }
        });
    }

    function renderCalendars() {
        renderCalendar("left", currentLeftDate);
        renderCalendar("right", currentRightDate);
        updateRangeDisplay();
    }

    function renderCalendar(side, date) {
        const grid = document.getElementById(`${side}Calendar`);
        if (!grid) return;
        const container = grid.querySelector(".days-container");
        if (!container) return;
        container.innerHTML = "";
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = getDaysInMonth(month, year);
        let startOffset = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = 0; i < startOffset; i++) {
            const empty = document.createElement("div");
            empty.className = "day empty";
            container.appendChild(empty);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dayDate = new Date(year, month, d);
            const el = document.createElement("div");
            el.className = "day";
            el.textContent = d;
            if (tempRange.start && isSameDay(dayDate, tempRange.start)) el.classList.add("selected", "range-start");
            if (tempRange.end && isSameDay(dayDate, tempRange.end)) el.classList.add("selected", "range-end");
            if (tempRange.start && tempRange.end && isDateInRange(dayDate, tempRange.start, tempRange.end)) el.classList.add("in-range");
            const today = new Date();
            if (isSameDay(dayDate, today)) el.classList.add("today");
            el.onclick = () => handleDayClick(dayDate);
            container.appendChild(el);
        }
    }

    function handleDayClick(date) {
        if (!tempRange.start || (tempRange.start && tempRange.end)) {
            tempRange.start = date;
            tempRange.end = null;
        } else {
            if (date < tempRange.start) {
                tempRange.end = tempRange.start;
                tempRange.start = date;
            } else {
                tempRange.end = date;
            }
        }
        renderCalendars();
    }

    function updateRangeDisplay() {
        const display = document.getElementById("tempRangeDisplay");
        if (!display) return;
        if (tempRange.start && tempRange.end) {
            display.textContent = `${formatDate(tempRange.start)} — ${formatDate(tempRange.end)}`;
        } else if (tempRange.start) {
            display.textContent = `${formatDate(tempRange.start)} — ...`;
        } else {
            display.textContent = "Chọn khoảng thời gian";
        }
    }

    function setupExtraListeners() {
        document.querySelectorAll(".kanban-view .custom-dropdown, .kanban-view .year-dropdown, .kanban-view .month-dropdown").forEach((dd) => {
            const sel = dd.querySelector(".dropdown-selected");
            if (sel) {
                sel.onclick = (e) => {
                    e.stopPropagation();
                    document.querySelectorAll(".kanban-view .custom-dropdown, .kanban-view .year-dropdown, .kanban-view .month-dropdown").forEach((d) => {
                        if (d !== dd) d.classList.remove("active");
                    });
                    dd.classList.toggle("active");
                };
            }
        });
        document.addEventListener("click", () => {
            document.querySelectorAll(".kanban-view .custom-dropdown, .kanban-view .year-dropdown, .kanban-view .month-dropdown").forEach((d) => d.classList.remove("active"));
        });
        document.querySelectorAll(".sidebar-item").forEach((item) => {
            item.onclick = (e) => {
                e.preventDefault();
                document.querySelectorAll(".sidebar-item").forEach((i) => i.classList.remove("active"));
                item.classList.add("active");
                const range = item.getAttribute("data-range");
                const today = new Date();
                
                if (range === "thisweek") {
                    const currentDayOfWeek = today.getDay();
                    const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
                    const start = new Date(today);
                    start.setDate(today.getDate() - daysSinceMonday);
                    tempRange.start = start;
                    tempRange.end = today;
                } else if (range === "today") {
                    tempRange.start = today;
                    tempRange.end = today;
                } else if (range === "last3") {
                    const start = new Date();
                    start.setDate(today.getDate() - 3);
                    tempRange.start = start;
                    tempRange.end = today;
                } else if (range === "last7") {
                    const start = new Date();
                    start.setDate(today.getDate() - 7);
                    tempRange.start = start;
                    tempRange.end = today;
                } else if (range === "last30") {
                    const start = new Date();
                    start.setDate(today.getDate() - 30);
                    tempRange.start = start;
                    tempRange.end = today;
                } else if (range === "last3mo") {
                    const start = new Date();
                    start.setMonth(today.getMonth() - 3);
                    tempRange.start = start;
                    tempRange.end = today;
                } else if (range === "last6mo") {
                    const start = new Date();
                    start.setMonth(today.getMonth() - 6);
                    tempRange.start = start;
                    tempRange.end = today;
                } else if (range === "last1yr") {
                    const start = new Date();
                    start.setFullYear(today.getFullYear() - 1);
                    tempRange.start = start;
                    tempRange.end = today;
                }
                currentLeftDate = new Date(tempRange.start);
                currentRightDate = new Date(tempRange.end);
                if (isSameDay(currentLeftDate, currentRightDate)) {
                    currentRightDate.setMonth(currentRightDate.getMonth() + 1);
                }
                renderCalendars();
            };
        });

        const applyBtn = document.getElementById("applyPicker");
        if (applyBtn) {
            applyBtn.onclick = () => {
                selectedRange = { ...tempRange };
                const triggerDisplay = document.getElementById("dateRangeDisplay");
                if (triggerDisplay && selectedRange.start && selectedRange.end) {
                    triggerDisplay.textContent = `${formatDate(selectedRange.start)} - ${formatDate(selectedRange.end)}`;
                }
                const picker = document.getElementById("analyticsPicker");
                if (picker) picker.classList.remove("active");
                renderBoard();
            };
        }
        const cancelBtn = document.getElementById("cancelPicker");
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                const picker = document.getElementById("analyticsPicker");
                if (picker) picker.classList.remove("active");
                tempRange = { ...selectedRange };
                renderCalendars();
            };
        }
        const clearBtn = document.getElementById("clearPicker");
        if (clearBtn) {
            clearBtn.onclick = () => {
                tempRange = { start: null, end: null };
                selectedRange = { start: null, end: null };
                document.querySelectorAll(".sidebar-item").forEach((i) => i.classList.remove("active"));
                renderCalendars();
                const triggerDisplay = document.getElementById("dateRangeDisplay");
                if (triggerDisplay) triggerDisplay.textContent = "dd/mm/yyyy - dd/mm/yyyy";
                const picker = document.getElementById("analyticsPicker");
                if (picker) picker.classList.remove("active");
                renderBoard();
            };
        }
    }

})();

