// Encapsulate in IIFE to avoid global scope pollution and re-declaration errors
(function () {

    // Mock Data
    var availableWarehouses = [
        { code: 'CSC', name: 'CÔNG TY THÉP' },
        { code: 'INDUSTRIES', name: 'CÔNG TY TNHH TẬP ĐOÀN CÔNG NGHIỆP TRƯỜNG HẢI' },
        { code: 'VAM', name: 'CÔNG TY TNHH SẢN XUẤT MÁY LẠNH Ô TÔ VINA' },
        { code: 'TACB', name: 'CÔNG TY LINH KIỆN KHUNG THÂN VỎ Ô TÔ' },
        { code: 'LAPRO', name: 'CÔNG TY BẢO HỘ LAO ĐỘNG' },
        { code: 'TOMCDD', name: 'CÔNG TY THIẾT BỊ CƠ KHÍ DÂN DỤNG' },
        { code: 'TUC', name: 'CÔNG TY THACO INDUSTRIES TẠI MỸ' },
        { code: 'DA', name: 'DỰ ÁN MỚI' },
        { code: 'CTMC', name: 'CÔNG TY CƠ KHÍ CHÍNH XÁC & KHUÔN MẪU' },
        { code: 'CASF', name: 'CÔNG TY KEO & DUNG DỊCH CHUYÊN DỤNG' },
        { code: 'TIP', name: 'CÔNG TY NHỰA CÔNG NGHIỆP' },
        { code: 'M&E', name: 'CÔNG TY CƠ ĐIỆN' },
        { code: 'VPĐH', name: 'VPĐH THACO INDUSTRIES' },
        { code: 'TOMC', name: 'CÔNG TY TNHH TỔ HỢP CƠ KHÍ THACO (TOMC)' },
        { code: 'TCMC', name: 'CÔNG TY TNHH TỔ HỢP CƠ KHÍ THACO CHU LAI (TCMC)' },
        { code: 'TSEC', name: 'CÔNG TY THIẾT BỊ CHUYÊN DỤNG' },
        { code: 'CPM', name: 'CÔNG TY BAO BÌ' },
        { code: 'TAI', name: 'CÔNG TY NỘI THẤT Ô TÔ TẢI, BUS' },
        { code: 'CASC', name: 'CÔNG TY NHÍP Ô TÔ' },
        { code: 'TPC', name: 'CÔNG TY LINH KIỆN NHỰA' },
        { code: 'TACC', name: 'CÔNG TY MÁY LẠNH Ô TÔ TẢI, BUS' },
        { code: 'AEE', name: 'CÔNG TY TNHH SẢN XUẤT THIẾT BỊ ĐIỆN Ô TÔ' },
        { code: 'AUTOCOM', name: 'CÔNG TY GHẾ Ô TÔ DU LỊCH' },
        { code: 'R&D', name: 'TRUNG TÂM R&D - INDUSTRIES' },
        { code: 'TMC', name: 'CÔNG TY TNHH TỔ HỢP CƠ KHÍ THACO (TMC)' },
        { code: 'AIM', name: 'CÔNG TY TNHH SẢN XUẤT NỘI THẤT Ô TÔ' },
        { code: 'CAG', name: 'CÔNG TY KÍNH Ô TÔ' },
        { code: 'TCSC', name: 'CÔNG TY TNHH MỘT THÀNH VIÊN GIA CÔNG THÉP CHU LAI - TRƯỜNG HẢI' },
        { code: 'CCMC', name: 'CÔNG TY COMPOSITE' },
        { code: 'TAG', name: 'CÔNG TY KÍNH CAO CẤP' },
        { code: 'TITS', name: 'CÔNG TY SX SMRM & CẤU KIỆN NẶNG' },
        { code: 'AEC', name: 'CÔNG TY TNHH SẢN XUẤT PHỤ TÙNG ĐIỆN Ô TÔ' },
        { code: 'CTSV', name: 'CÔNG TY SX XE CHUYÊN DỤNG' }
    ];

    const groups = ['Shuttle', 'Lifter', 'Transfer', 'Stacker Crane', 'AMR', 'Conveyor', 'OHT'];
    const protocols = ['TCP/IP', 'Modbus TCP', 'Profinet'];
    const deviceTypes = ['Tự hành', 'Cố định'];

    function getDeviceType(group) {
        if (!group) return '';
        const lowerGroup = group.toLowerCase();
        if (lowerGroup.includes('amr') || lowerGroup.includes('shuttle') || lowerGroup.includes('oht')) {
            return 'Tự hành';
        }
        if (lowerGroup.includes('lifter') || lowerGroup.includes('conveyor')) {
            return 'Cố định';
        }
        // Default based on common knowledge of the other groups in the list
        if (lowerGroup.includes('transfer') || lowerGroup.includes('stacker crane')) {
            return 'Cố định';
        }
        return 'Cố định';
    }

    let devices = [
        // 13 Shuttle devices
        ...Array.from({ length: 13 }, (_, i) => ({
            id: i + 1,
            code: `SHUTTLE-${String(i + 1).padStart(3, '0')}`,
            name: `Shuttle ${i + 1}`,
            warehouse: availableWarehouses[i % availableWarehouses.length].code,
            group: 'Shuttle',
            ip: `192.168.1.${100 + i}`,
            port: 8080 + i,
            protocol: protocols[i % protocols.length]
        })),
        // 6 Lifter devices
        ...Array.from({ length: 6 }, (_, i) => ({
            id: 13 + i + 1,
            code: `LIFTER-${String(i + 1).padStart(3, '0')}`,
            name: `Lifter ${i + 1}`,
            warehouse: availableWarehouses[(13 + i) % availableWarehouses.length].code,
            group: 'Lifter',
            ip: `192.168.1.${113 + i}`,
            port: 8093 + i,
            protocol: protocols[(13 + i) % protocols.length]
        }))
    ];

    // State
    let currentPage = 1;
    const pageSize = 20; // Changed to 20
    let filteredDevices = [...devices];
    let selectedDeviceIds = new Set();
    let pendingDeleteDeviceIds = [];

    // Initialization
    function initDeviceModule() {
        initFilters();
        renderTable();
        updatePagination();


    }

    // Expose functions required by HTML event attributes (onclick)
    window.initDeviceModule = initDeviceModule;
    window.copyToClipboard = copyToClipboard;
    window.toggleSelection = toggleSelection;
    window.openEditModal = openEditModal;
    window.confirmDeleteOne = confirmDeleteOne;
    window.toggleSelectAll = toggleSelectAll;
    window.openAddModal = openAddModal;
    window.saveDevice = saveDevice;
    window.closeModal = closeModal;
    window.deleteSelected = deleteSelected;
    window.closeDeleteModal = closeDeleteModal;
    window.confirmDeleteDevice = confirmDeleteDevice;
    window.goToPage = goToPage;
    window.prevPage = prevPage;
    window.nextPage = nextPage;
    // New Filter Exports
    window.openDeviceDropdown = openDeviceDropdown;
    window.toggleDeviceDropdown = toggleDeviceDropdown;
    window.selectDeviceOption = selectDeviceOption;
    window.applyFilters = applyFilters;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDeviceModule);
    } else {
        initDeviceModule();
    }

    // Init Filters
    function initFilters() {
        // Render custom dropdown options for Group (Filter)
        const groupOptions = document.getElementById('group-options');
        if (groupOptions) {
            groupOptions.innerHTML = `
                <div class="dropdown-option active" data-value="" onclick="selectDeviceOption('group', '', 'Tất cả nhóm')">
                    Tất cả nhóm
                </div>
            ` + groups.map(g => `
                <div class="dropdown-option" data-value="${g}" onclick="selectDeviceOption('group', '${g}', '${g}')">
                    ${g}
                </div>
            `).join('');
        }

        // Render custom dropdown options for Type (Filter)
        const typeOptions = document.getElementById('type-options');
        if (typeOptions) {
            typeOptions.innerHTML = `
                <div class="dropdown-option active" data-value="" onclick="selectDeviceOption('type', '', 'Tất cả loại')">
                    Tất cả loại
                </div>
            ` + deviceTypes.map(t => `
                <div class="dropdown-option" data-value="${t}" onclick="selectDeviceOption('type', '${t}', '${t}')">
                    ${t}
                </div>
            `).join('');
        }



        // Modal Protocol dropdown
        const modalProtocolOptions = document.getElementById('modal-protocol-options');
        if (modalProtocolOptions) {
            modalProtocolOptions.innerHTML = protocols.map(p => `
                <div class="dropdown-option" data-value="${p}" onclick="selectDeviceOption('modal-protocol', '${p}', '${p}')">
                    ${p}
                </div>
            `).join('');
        }



        // Modal Group selection (custom dropdown)
        const modalGroupOptions = document.getElementById('modal-group-options');
        if (modalGroupOptions) {
            modalGroupOptions.innerHTML = groups.map(g => `
                <div class="dropdown-option" data-value="${g}" onclick="selectDeviceOption('modal-group', '${g}', '${g}')">
                    ${g}
                </div>
            `).join('');
        }

        // Add Event Listeners
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.addEventListener('input', applyFilters);
    }

    // --- New Warehouse Filter Logic ---



    function openDeviceDropdown(id) {
        const el = document.getElementById(id);
        if (!el) return;

        if (!el.classList.contains('open')) {
            toggleDeviceDropdown(id);
        }
    }

    function toggleDeviceDropdown(id) {
        const el = document.getElementById(id);
        if (!el) return;

        const wasOpen = el.classList.contains('open');

        // Close all other custom dropdowns
        document.querySelectorAll('.custom-dropdown').forEach(d => {
            if (d.id !== id) d.classList.remove('open');
        });

        el.classList.toggle('open');

        // If command dropdown is opened, focus the search input
        if (!wasOpen && id === 'command-dropdown') {
            setTimeout(() => {
                const searchInput = el.querySelector('.filter-search-box input');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    }

    function selectDeviceOption(type, value, label) {
        let container, input, labelEl;
        
        if (type === 'modal-group') {
            container = document.getElementById('modal-group-dropdown');
            input = document.getElementById('device-group');
            labelEl = document.getElementById('modal-group-selected-label');
        } else if (type === 'modal-protocol') {
            container = document.getElementById('modal-protocol-dropdown');
            input = document.getElementById('device-protocol');
            labelEl = document.getElementById('modal-protocol-selected-label');
        } else {
            container = document.getElementById(`${type}-dropdown`);
            input = document.getElementById(`${type}-filter-value`);
            labelEl = document.getElementById(`${type}-selected-label`);
        }

        if (input) input.value = value;
        if (labelEl) {
            labelEl.textContent = label;
            labelEl.title = label; // Tooltip for long names
        }

        if (container) {
            // Update active class
            container.querySelectorAll('.dropdown-option').forEach(opt => {
                if (opt.getAttribute('data-value') === value) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
            container.classList.remove('open');
        }

        if (type !== 'modal-group' && type !== 'modal-protocol') {
            applyFilters();
        }
    }



    function filterCommandOptions(input) {
    }

    // Close on outside click
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.custom-dropdown')) {
            document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
        }
    });

    // Filter Logic
    function applyFilters() {
        const searchInput = document.getElementById('search-input');
        const groupInput = document.getElementById('group-filter-value');
        const typeInput = document.getElementById('type-filter-value');

        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase();
        const groupFilter = groupInput ? groupInput.value : '';
        const typeFilter = typeInput ? typeInput.value : '';

        filteredDevices = devices.filter(device => {
            const matchSearch = device.code.toLowerCase().includes(searchTerm) ||
                device.name.toLowerCase().includes(searchTerm) ||
                device.ip.includes(searchTerm);
            const matchGroup = !groupFilter || device.group === groupFilter;
            const matchType = !typeFilter || getDeviceType(device.group) === typeFilter;

            return matchSearch && matchGroup && matchType;
        });

        currentPage = 1; // Reset to first page
        renderTable();
        updatePagination();
    }

    // Render Table
    function renderTable() {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pageData = filteredDevices.slice(start, end);
        const tbody = document.getElementById('device-table-body');

        if (!tbody) return;

        tbody.innerHTML = '';

        if (pageData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 20px;">Không tìm thấy kết quả</td></tr>';
            return;
        }

        pageData.forEach((device, index) => {
            const tr = document.createElement('tr');
            tr.className = `device-row`;
            const isChecked = selectedDeviceIds.has(device.id);

            tr.innerHTML = `
                <td>
                    <input type="checkbox" class="row-checkbox" value="${device.id}" ${isChecked ? 'checked' : ''} onchange="toggleSelection(${device.id})">
                </td>
                <td>${start + index + 1}</td>
                <td>${device.group}</td>
                <td class="device-code">${device.code}</td>
                <td class="device-name" style="font-weight: 500">${device.name}</td>
                <td>
                    <span class="type-badge ${getDeviceType(device.group) === 'Cố định' ? 'fixed' : 'mobile'}">
                        ${getDeviceType(device.group)}
                    </span>
                </td>
                <td>
                    ${device.ip} 
                    <i class="fa-regular fa-copy btn-copy" onclick="copyToClipboard('${device.ip}', this)" title="Copy IP"></i>
                </td>
                <td>${device.port}</td>
                <td>${device.protocol}</td>
                <td style="text-align: center;">
                    <div class="action-icon" onclick="openEditModal(${device.id})" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="action-icon delete" onclick="confirmDeleteOne(${device.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
        updateSelectAllCheckbox();
        updateBulkDeleteButton();
    }


    // Helper: Format Status
    function formatStatus(status) {
        const map = {
            'idle': 'Idle',
            'in_progress': 'In Progress',
            'waiting': 'Waiting',
            'completed': 'Completed'
        };
        return map[status] || status;
    }

    // Pagination Logic
    function updatePagination() {
        const total = filteredDevices.length;
        const totalPages = Math.ceil(total / pageSize);
        const startRecord = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
        const endRecord = Math.min(currentPage * pageSize, total);

        const infoEl = document.getElementById('pagination-info');
        if (infoEl) infoEl.textContent = `Hiển thị ${startRecord} - ${endRecord} trong ${total}`;

        // Controls
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) prevBtn.disabled = currentPage === 1;

        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) nextBtn.disabled = currentPage === totalPages || total === 0;

        // Page Numbers
        const pageNumbersData = document.getElementById('page-numbers');
        if (pageNumbersData) {
            pageNumbersData.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                if (totalPages > 7 && Math.abs(i - currentPage) > 2 && i !== 1 && i !== totalPages) {
                    if (pageNumbersData.lastChild && pageNumbersData.lastChild.textContent !== '...') {
                        const span = document.createElement('span');
                        span.textContent = '...';
                        span.style.padding = '0 5px';
                        pageNumbersData.appendChild(span);
                    }
                    continue;
                }

                const btn = document.createElement('button');
                btn.classList.add('page-btn');
                if (i === currentPage) btn.classList.add('active');
                btn.textContent = i;
                btn.onclick = () => goToPage(i);
                pageNumbersData.appendChild(btn);
            }
        }
    }

    function goToPage(page) {
        currentPage = page;
        renderTable();
        updatePagination();
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            updatePagination();
        }
    }

    function nextPage() {
        const totalPages = Math.ceil(filteredDevices.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            updatePagination();
        }
    }

    // Selection Logic
    function toggleSelectAll() {
        const selectAllDetails = document.getElementById('select-all').checked;
        const currentPageIds = filteredDevices.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(d => d.id);

        if (selectAllDetails) {
            currentPageIds.forEach(id => selectedDeviceIds.add(id));
        } else {
            currentPageIds.forEach(id => selectedDeviceIds.delete(id));
        }
        renderTable();
    }

    function toggleSelection(id) {
        if (selectedDeviceIds.has(id)) {
            selectedDeviceIds.delete(id);
        } else {
            selectedDeviceIds.add(id);
        }
        updateSelectAllCheckbox();
        updateBulkDeleteButton();
    }

    function updateSelectAllCheckbox() {
        const selectAll = document.getElementById('select-all');
        if (!selectAll) return;
        const currentPageIds = filteredDevices.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(d => d.id);
        const allSelected = currentPageIds.length > 0 && currentPageIds.every(id => selectedDeviceIds.has(id));
        selectAll.checked = allSelected;
    }

    function updateBulkDeleteButton() {
        const btn = document.getElementById('bulk-delete-btn');
        const countSpan = document.getElementById('selected-count');
        const count = selectedDeviceIds.size;

        if (countSpan) countSpan.textContent = count;
        if (btn) btn.disabled = count === 0;
    }

    // Add/Edit Modal Logic
    function openAddModal() {
        document.getElementById('device-id').value = '';
        document.getElementById('modal-title').textContent = 'Thêm mới Thiết bị';

        // Clear Form
        document.getElementById('device-code').value = '';
        document.getElementById('device-name').value = '';
        
        // Reset Custom Dropdown
        document.getElementById('device-group').value = '';
        document.getElementById('modal-group-selected-label').textContent = 'Chọn nhóm thiết bị';
        document.querySelectorAll('#modal-group-dropdown .dropdown-option').forEach(opt => opt.classList.remove('active'));

        document.getElementById('device-ip').value = '';
        document.getElementById('device-port').value = '';

        // Reset Protocol Dropdown
        document.getElementById('device-protocol').value = '';
        document.getElementById('modal-protocol-selected-label').textContent = 'Chọn giao thức';
        document.querySelectorAll('#modal-protocol-dropdown .dropdown-option').forEach(opt => opt.classList.remove('active'));

        document.getElementById('device-modal').classList.add('show');
    }

    function openEditModal(id) {
        const device = devices.find(d => d.id === id);
        if (!device) return;

        document.getElementById('device-id').value = device.id;
        document.getElementById('modal-title').textContent = 'Cập nhật Thiết bị';

        document.getElementById('device-code').value = device.code;
        document.getElementById('device-name').value = device.name;
        
        // Custom Dropdown for Group
        document.getElementById('device-group').value = device.group;
        document.getElementById('modal-group-selected-label').textContent = device.group;
        document.querySelectorAll('#modal-group-dropdown .dropdown-option').forEach(opt => {
            if (opt.getAttribute('data-value') === device.group) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });

        document.getElementById('device-ip').value = device.ip;
        document.getElementById('device-port').value = device.port;

        // Protocol dropdown
        document.getElementById('device-protocol').value = device.protocol || '';
        document.getElementById('modal-protocol-selected-label').textContent = device.protocol || 'Chọn giao thức';
        document.querySelectorAll('#modal-protocol-dropdown .dropdown-option').forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-value') === device.protocol);
        });


        document.getElementById('device-modal').classList.add('show');
    }

    function closeModal() {
        document.getElementById('device-modal').classList.remove('show');
    }

    function saveDevice() {
        const id = document.getElementById('device-id').value;
        const code = document.getElementById('device-code').value.trim();
        const name = document.getElementById('device-name').value.trim();
        const group = document.getElementById('device-group').value;
        const ip = document.getElementById('device-ip').value.trim();
        const port = document.getElementById('device-port').value.trim();
        const protocol = document.getElementById('device-protocol').value;

        if (!code || !name || !group || !protocol) {
            alert('Vui lòng điền đầy đủ các trường bắt buộc!');
            return;
        }

        if (id) {
            // Update
            const index = devices.findIndex(d => d.id == id);
            if (index !== -1) {
                devices[index] = {
                    ...devices[index],
                    code, name, group, ip, port, protocol
                };
            }
        } else {
            // Add
            const newId = Math.max(...devices.map(d => d.id), 0) + 1;
            devices.unshift({
                id: newId,
                code, name, group, ip, port, protocol,
                status: 'idle'
            });
        }

        closeModal();
        applyFilters(); // Re-render
    }

    // Delete Logic
    function confirmDeleteOne(id) {
        pendingDeleteDeviceIds = [id];
        const device = devices.find(d => d.id === id);
        const msgEl = document.getElementById('confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa thiết bị <strong>${device?.code}</strong> không?<br />Hành động này không thể hoàn tác.`;
        }
        document.getElementById('delete-confirm-modal').classList.add('show');
    }

    function deleteSelected() {
        if (selectedDeviceIds.size === 0) return;
        pendingDeleteDeviceIds = Array.from(selectedDeviceIds);
        const msgEl = document.getElementById('confirm-delete-message');
        if (msgEl) {
            msgEl.innerHTML = `Bạn có chắc chắn muốn xóa <strong>${selectedDeviceIds.size}</strong> thiết bị đã chọn không?<br />Hành động này không thể hoàn tác.`;
        }
        document.getElementById('delete-confirm-modal').classList.add('show');
    }

    function closeDeleteModal() {
        document.getElementById('delete-confirm-modal').classList.remove('show');
        pendingDeleteDeviceIds = [];
    }

    function confirmDeleteDevice() {
        if (pendingDeleteDeviceIds.length > 0) {
            devices = devices.filter(d => !pendingDeleteDeviceIds.includes(d.id));
            // Update selectedIds
            pendingDeleteDeviceIds.forEach(id => selectedDeviceIds.delete(id));

            showToast(`Đã xóa ${pendingDeleteDeviceIds.length} thiết bị thành công`);
            closeDeleteModal();
            applyFilters();
        }
    }

    // Copy clipboard
    function copyToClipboard(text, el) {
        if (!navigator.clipboard) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showCopyPopover(el);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textArea);
        } else {
            // Navigator Clipboard API
            navigator.clipboard.writeText(text).then(function () {
                showCopyPopover(el);
            }, function (err) {
                console.error('Async: Could not copy text: ', err);
            });
        }
    }

    function showCopyPopover(el) {
        if (!el) return;

        // Remove existing if any global popover
        const existing = document.querySelector('.copy-popover');
        if (existing) existing.remove();

        // Calculate Position
        const rect = el.getBoundingClientRect();

        // Create Popover
        const popover = document.createElement('div');
        popover.className = 'copy-popover';
        popover.innerText = 'Copied!';

        // Append to body to avoid clipping/stacking issues
        document.body.appendChild(popover);

        // Position it: Center horizontally relative to icon, above the icon
        popover.style.left = (rect.left + rect.width / 2) + 'px';
        popover.style.top = (rect.top - 8) + 'px'; // 8px gap above icon

        // Remove after animation
        setTimeout(() => {
            popover.remove();
        }, 1500);
    }

})();
