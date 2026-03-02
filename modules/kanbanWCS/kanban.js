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
        // 1. Filter Data (using names now to match the dropdown)
        const filteredTasks = mockTasks.filter(task => {
            const matchesWarehouse = currentWarehouseFilter === 'all' || task.warehouse === currentWarehouseFilter;
            const matchesSearch = task.id.toLowerCase().includes(currentSearchTerm) || 
                                  task.device.toLowerCase().includes(currentSearchTerm);
            return matchesWarehouse && matchesSearch;
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
                        <i class="fas fa-warehouse info-icon"></i>
                        <span>${task.warehouse}</span>
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

})();

