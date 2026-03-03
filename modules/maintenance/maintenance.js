(function() {
    const groups = ['Lifter', 'Transfer', 'Stacker Crane', 'AMR'];
    const prefixes = ['LIFT', 'TRANS', 'STACKER', 'AMR'];

    let devices = Array.from({ length: 100 }, (_, i) => {
        const gIdx = i % 4;
        const seq = Math.floor(i / 4) + 1;
        const code = `${prefixes[gIdx]}-${String(seq).padStart(3, '0')}`;
        const maintenanceCount = Math.floor(Math.random() * 10) + 1;
        const lastDate = new Date();
        lastDate.setDate(lastDate.getDate() - Math.floor(Math.random() * 60) - 30);
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 90);
        return {
            id: i + 1, code, name: `${groups[gIdx]} ${seq}`, group: groups[gIdx],
            maintenanceCount, lastMaintenance: lastDate, nextMaintenance: nextDate, selected: false
        };
    });

    let currentPage = 1;
    const pageSize = 20;
    let filteredDevices = [...devices];
    let activeTab = 'list';
    let selectedYear = new Date().getFullYear();
    let selectedMonth = new Date().getMonth();
    let searchDeviceInCalendar = '';
    let collapsedGroups = {};
    let activeDeviceId = null;

    function init() {
        renderMaintenanceList();
        initYearSelect();
        renderCalendar();
        initDeviceCombobox();
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.searchable-combobox')) {
                document.getElementById('device-options').classList.remove('show');
            }
        });
    }

    window.switchMaintenanceTab = function(tab) {
        activeTab = tab;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const onclick = btn.getAttribute('onclick') || '';
            btn.classList.toggle('active', onclick.includes(`'${tab}'`) || onclick.includes(`"${tab}"`));
        });
        document.querySelectorAll('.tab-content').forEach(c => {
            c.classList.toggle('active', c.id === `tab-${tab}`);
        });
        if (tab === 'list') renderMaintenanceList();
        else renderCalendar();
    };

    // ── Accordion List ──────────────────────────────────────────────
    window.renderMaintenanceList = function() {
        const tbody = document.getElementById('maintenance-list-body');
        if (!tbody) return;

        const term = (document.getElementById('device-search')?.value || '').toLowerCase();
        filteredDevices = devices.filter(d =>
            d.code.toLowerCase().includes(term) || d.name.toLowerCase().includes(term)
        );

        const total = filteredDevices.length;
        const totalPages = Math.ceil(total / pageSize);
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pageData = filteredDevices.slice(start, end);

        // Group devices (only those on the current page)
        const grouped = {};
        groups.forEach(g => grouped[g] = []);
        pageData.forEach(d => { if (grouped[d.group]) grouped[d.group].push(d); });

        let globalIdx = start;
        let html = '';

        groups.forEach(groupName => {
            const groupDevices = grouped[groupName];
            if (!groupDevices || groupDevices.length === 0) return;

            const isCollapsed = collapsedGroups[groupName];
            const allSelectedInGroup = groupDevices.length > 0 && groupDevices.every(d => d.selected);
            const someSelectedInGroup = !allSelectedInGroup && groupDevices.some(d => d.selected);

            html += `
                <tr class="group-row ${isCollapsed ? 'collapsed' : ''}">
                    <td class="text-center">
                        <input type="checkbox" class="group-checkbox" 
                               ${allSelectedInGroup ? 'checked' : ''} 
                               ${someSelectedInGroup ? 'style="opacity: 0.7; accent-color: #94a3b8"' : ''}
                               onchange="window.toggleGroupSelection('${groupName}', this.checked)" 
                               onclick="event.stopPropagation()">
                    </td>
                    <td colspan="9" onclick="toggleGroup('${groupName}')" style="cursor: pointer;">
                        <span class="group-toggle-icon"><i class="fas fa-chevron-down"></i></span>
                        <strong style="font-size: 14px;">${groupName}</strong>
                        <span class="group-badge">${groupDevices.length}</span>
                    </td>
                </tr>
            `;

            if (!isCollapsed) {
                groupDevices.forEach((d, i) => {
                    globalIdx++;
                    const nextOverdue = d.nextMaintenance < new Date();
                    html += `
                        <tr data-group="${groupName}">
                            <td class="text-center"><input type="checkbox" ${d.selected ? 'checked' : ''} onchange="toggleDeviceSelection(${d.id})"></td>
                            <td class="text-center" style="color:#94a3b8;font-size:12px">${globalIdx}</td>
                            <td style="color:#64748b;font-size:12px">${groupName}</td>
                            <td><strong style="color:#076EB8">${d.code}</strong></td>
                            <td>${d.name}</td>
                            <td class="text-center">${d.maintenanceCount}</td>
                            <td class="text-center">${formatDate(d.lastMaintenance)}</td>
                            <td class="text-center" style="color:${nextOverdue ? '#ef4444' : '#334155'};font-weight:${nextOverdue ? 700 : 400}">${formatDate(d.nextMaintenance)}</td>
                            <td class="text-center">
                                <button class="action-icon record" onclick="openMaintenanceModal(${d.id})" title="Ghi nhận bảo trì">
                                    <i class="fas fa-tools" style="font-size:12px"></i>
                                </button>
                            </td>
                            <td class="text-center">
                                <button class="action-icon edit" onclick="openEditModal(${d.id})" title="Chỉnh sửa thông tin">
                                    <i class="fas fa-pen" style="font-size:12px"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
            }
        });

        tbody.innerHTML = html;
        updatePagination();
        updateBulkButton();
    };

    window.toggleGroup = function(groupName) {
        collapsedGroups[groupName] = !collapsedGroups[groupName];
        renderMaintenanceList();
    };

    window.filterMaintenanceList = function() {
        currentPage = 1;
        renderMaintenanceList();
    };

    window.toggleGroupSelection = function(groupName, checked) {
        // Toggle selection for all devices in this group that are currently filtered
        filteredDevices.forEach(d => {
            if (d.group === groupName) d.selected = checked;
        });
        renderMaintenanceList();
    };

    window.toggleDeviceSelection = function(id) {
        const device = devices.find(d => d.id === id);
        if (device) device.selected = !device.selected;
        renderMaintenanceList(); // Re-render to update group checkboxes
    };

    window.toggleSelectAll = function(checkbox) {
        filteredDevices.forEach(d => d.selected = checkbox.checked);
        renderMaintenanceList();
    };

    function updateBulkButton() {
        const selectedCount = devices.filter(d => d.selected).length;
        const btn = document.getElementById('btn-bulk-maintenance');
        const countSpan = document.getElementById('selected-count');
        if (btn) btn.disabled = selectedCount === 0;
        if (countSpan) countSpan.textContent = selectedCount;
    }

    function updatePagination() {
        const total = filteredDevices.length;
        const totalPages = Math.ceil(total / pageSize);
        const info = document.getElementById('pagination-info');
        if (info) {
            const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
            const end = Math.min(currentPage * pageSize, total);
            info.textContent = `Hiển thị ${start} - ${end} trong ${total} thiết bị`;
        }

        const controls = document.getElementById('pagination-controls');
        if (controls) {
            if (totalPages <= 1) {
                controls.innerHTML = '';
                return;
            }

            let html = `
                <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                if (totalPages > 5 && Math.abs(i - currentPage) > 1 && i !== 1 && i !== totalPages) {
                    if (!html.endsWith('...')) html += '<span style="padding: 0 8px; color: #94a3b8">...</span>';
                    continue;
                }
                html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }

            html += `
                <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
            controls.innerHTML = html;
        }
    }

    window.goToPage = function(p) {
        currentPage = p;
        renderMaintenanceList();
    };

    // ── Modals ──────────────────────────────────────────────────────
    window.openMaintenanceModal = function(id) {
        const device = devices.find(d => d.id === id);
        if (!device) return;
        activeDeviceId = id;
        document.getElementById('modal-device-code').value = device.code;
        document.getElementById('modal-device-name').value = device.name;
        document.getElementById('modal-maintenance-date').value = toInputDate(new Date());
        document.getElementById('modal-technician').value = '';
        document.getElementById('modal-result').value = 'ok';
        document.getElementById('modal-note').value = '';
        document.getElementById('maintenance-modal-title').textContent = `Ghi nhận bảo trì - ${device.code}`;
        document.getElementById('maintenance-modal').classList.add('show');
    };

    window.saveMaintenance = function() {
        const device = devices.find(d => d.id === activeDeviceId);
        if (!device) return;
        const dateStr = document.getElementById('modal-maintenance-date').value;
        if (dateStr) {
            device.lastMaintenance = new Date(dateStr);
            device.nextMaintenance = new Date(dateStr);
            device.nextMaintenance.setDate(device.nextMaintenance.getDate() + 90);
            device.maintenanceCount++;
        }
        closeModal('maintenance-modal');
        showToast(`Đã ghi nhận bảo trì cho ${device.code}`, 'success');
        renderMaintenanceList();
    };

    window.openEditModal = function(id) {
        const device = devices.find(d => d.id === id);
        if (!device) return;
        activeDeviceId = id;
        document.getElementById('edit-device-code').value = device.code;
        document.getElementById('edit-cycle').value = 90;
        document.getElementById('edit-last-date').value = toInputDate(device.lastMaintenance);
        document.getElementById('edit-next-date').value = toInputDate(device.nextMaintenance);
        document.getElementById('edit-note').value = '';
        document.getElementById('edit-modal').classList.add('show');
    };

    window.saveEdit = function() {
        const device = devices.find(d => d.id === activeDeviceId);
        if (!device) return;
        const lastDateVal = document.getElementById('edit-last-date').value;
        const nextDateVal = document.getElementById('edit-next-date').value;
        if (lastDateVal) device.lastMaintenance = new Date(lastDateVal);
        if (nextDateVal) device.nextMaintenance = new Date(nextDateVal);
        closeModal('edit-modal');
        showToast(`Đã cập nhật thông tin bảo trì cho ${device.code}`, 'success');
        renderMaintenanceList();
    };

    window.closeModal = function(id) {
        document.getElementById(id).classList.remove('show');
    };

    window.handleBulkMaintenance = function() {
        const selected = devices.filter(d => d.selected);
        if (confirm(`Tiến hành bảo trì cho ${selected.length} thiết bị đã chọn?`)) {
            selected.forEach(device => {
                device.lastMaintenance = new Date();
                device.nextMaintenance = new Date();
                device.nextMaintenance.setDate(device.nextMaintenance.getDate() + 90);
                device.maintenanceCount++;
                device.selected = false;
            });
            showToast(`Đã bảo trì thành công ${selected.length} thiết bị`, 'success');
            renderMaintenanceList();
        }
    };

    // ── Calendar ─────────────────────────────────────────────────────
    function initYearSelect() {
        const select = document.getElementById('year-select');
        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 2; y <= currentYear + 2; y++) {
            const opt = document.createElement('option');
            opt.value = y; opt.textContent = y;
            if (y === currentYear) opt.selected = true;
            select.appendChild(opt);
        }
        document.getElementById('month-select').value = new Date().getMonth();
    }

    window.renderCalendar = function() {
        const year = parseInt(document.getElementById('year-select').value);
        const month = parseInt(document.getElementById('month-select').value);
        const grid = document.getElementById('calendar-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        let startDay = firstDay.getDay() - 1;
        if (startDay === -1) startDay = 6;

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) grid.appendChild(createDayEl(prevMonthLastDay - i, true));
        for (let i = 1; i <= lastDay.getDate(); i++) grid.appendChild(createDayEl(i, false, year, month));
        const remaining = 42 - grid.children.length;
        for (let i = 1; i <= remaining; i++) grid.appendChild(createDayEl(i, true));
    };

    function createDayEl(day, isOtherMonth, year, month) {
        const div = document.createElement('div');
        const today = new Date();
        const isToday = !isOtherMonth && year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
        div.className = `calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;

        const dayNum = document.createElement('span');
        dayNum.className = 'day-number';
        dayNum.textContent = day;
        div.appendChild(dayNum);

        if (!isOtherMonth) {
            const date = new Date(year, month, day);
            const dateStr = formatDate(date);

            const dayDevices = devices.filter(d => {
                const matchSearch = !searchDeviceInCalendar ||
                    d.code.toLowerCase().includes(searchDeviceInCalendar.toLowerCase()) ||
                    d.name.toLowerCase().includes(searchDeviceInCalendar.toLowerCase());
                return matchSearch && (formatDate(d.lastMaintenance) === dateStr || formatDate(d.nextMaintenance) === dateStr);
            });

            const MAX_SHOW = 3;
            let shown = 0;

            dayDevices.forEach(d => {
                const isDone = formatDate(d.lastMaintenance) === dateStr;
                const isPending = formatDate(d.nextMaintenance) === dateStr;

                if ((isDone || isPending) && shown < MAX_SHOW) {
                    const chip = document.createElement('div');
                    chip.className = `cal-chip ${isDone ? 'done' : 'pending'}`;
                    chip.innerHTML = `
                        <i class="fas ${isDone ? 'fa-check-circle' : 'fa-clock'}"></i>
                        <span class="cal-chip-code">${d.code}</span>
                    `;
                    chip.title = `${d.name} - ${isDone ? 'Đã bảo trì' : 'Chưa bảo trì'}`;
                    div.appendChild(chip);
                    shown++;
                }
            });

            if (dayDevices.length > MAX_SHOW) {
                const more = document.createElement('div');
                more.className = 'cal-more';
                more.textContent = `+${dayDevices.length - MAX_SHOW} khác`;
                div.appendChild(more);
            }
        }
        return div;
    }

    // ── Combobox ─────────────────────────────────────────────────────
    function initDeviceCombobox() {
        const input = document.querySelector('#device-combobox input');
        const list = document.getElementById('device-options');
        const clearBtn = document.getElementById('combobox-clear');

        window.showDeviceOptions = () => {
            list.classList.add('show');
            renderDeviceOptions('');
        };

        window.filterDeviceOptions = (inp) => {
            renderDeviceOptions(inp.value);
            clearBtn.style.display = inp.value ? 'flex' : 'none';
        };

        window.clearDeviceFilter = () => {
            input.value = '';
            searchDeviceInCalendar = '';
            clearBtn.style.display = 'none';
            list.classList.remove('show');
            renderCalendar();
        };

        function renderDeviceOptions(term) {
            const filtered = devices.filter(d =>
                d.code.toLowerCase().includes(term.toLowerCase()) ||
                d.name.toLowerCase().includes(term.toLowerCase())
            ).slice(0, 10);

            if (filtered.length === 0) {
                list.innerHTML = '<div class="option-empty"><i class="fas fa-search" style="margin-right:6px;color:#cbd5e1"></i>Không tìm thấy</div>';
            } else {
                list.innerHTML = filtered.map(d => `
                    <div class="option-item" onclick="selectDeviceCalendar('${d.code}', '${d.name}')">
                        <span class="option-code">${d.code}</span>
                        <span class="option-name">${d.name}</span>
                    </div>
                `).join('');
            }
        }

        window.selectDeviceCalendar = (code, name) => {
            input.value = `${code} - ${name}`;
            searchDeviceInCalendar = code;
            list.classList.remove('show');
            document.getElementById('combobox-clear').style.display = 'flex';
            renderCalendar();
        };
    }

    // ── Helpers ───────────────────────────────────────────────────────
    function formatDate(date) {
        if (!date) return '';
        const d = date.getDate(), m = date.getMonth() + 1, y = date.getFullYear();
        return `${String(d).padStart(2,'0')}/${String(m).padStart(2,'0')}/${y}`;
    }

    function toInputDate(date) {
        if (!date) return '';
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function showToast(msg, type = 'success') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 12px 20px;
            background: ${type === 'success' ? '#22c55e' : '#ef4444'}; color: #fff;
            border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            z-index: 9999; animation: slideIn 0.3s forwards; font-size: 13px; font-weight: 600;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();