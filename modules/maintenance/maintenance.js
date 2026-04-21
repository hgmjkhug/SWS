(function() {
    const groups = ['Shuttle', 'Lifter'];
    const codes = ['SHUT', 'LIFT'];
    
    let devices = [];
    
    // 13 Shuttles
    for (let i = 1; i <= 13; i++) {
        const lastDate = new Date();
        lastDate.setDate(lastDate.getDate() - Math.floor(Math.random() * 60) - 30);
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 90);
        devices.push({
            id: devices.length + 1,
            code: `SHUT-${String(i).padStart(3, '0')}`,
            name: `Shuttle ${i}`,
            group: 'Shuttle',
            maintenanceCount: Math.floor(Math.random() * 10) + 1,
            lastMaintenance: lastDate,
            nextMaintenance: nextDate,
            selected: false
        });
    }
    
    // 6 Lifters
    for (let i = 1; i <= 6; i++) {
        const lastDate = new Date();
        lastDate.setDate(lastDate.getDate() - Math.floor(Math.random() * 60) - 30);
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 90);
        devices.push({
            id: devices.length + 1,
            code: `LIFT-${String(i).padStart(3, '0')}`,
            name: `Lifter ${i}`,
            group: 'Lifter',
            maintenanceCount: Math.floor(Math.random() * 10) + 1,
            lastMaintenance: lastDate,
            nextMaintenance: nextDate,
            selected: false
        });
    }

    let mainCurrentPage = 1;
    const mainPageSize = 20;
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
        initCustomCalendars();

        // Initialize click outside for custom dropdown
        document.addEventListener('click', function(e) {
            // Modal result dropdown
            const resultWrapper = document.querySelector('.custom-select-wrapper');
            const resultPanel = document.getElementById('result-dropdown-options');
            if (resultPanel && resultPanel.classList.contains('show') && (!resultWrapper || !resultWrapper.contains(e.target))) {
                toggleResultDropdown();
            }

            // Type filter dropdown
            const typeWrapper = document.querySelector('.type-filter-wrapper');
            const typePanel = document.getElementById('type-filter-options');
            if (typePanel && typePanel.classList.contains('show') && (!typeWrapper || !typeWrapper.contains(e.target))) {
                toggleTypeFilterDropdown();
            }

            // Year filter dropdown
            const yearWrapper = document.querySelector('.year-filter-wrapper');
            const yearPanel = document.getElementById('year-filter-options');
            if (yearPanel && yearPanel.classList.contains('show') && (!yearWrapper || !yearWrapper.contains(e.target))) {
                toggleYearDropdown();
            }

            // Month filter dropdown
            const monthWrapper = document.querySelector('.month-filter-wrapper');
            const monthPanel = document.getElementById('month-filter-options');
            if (monthPanel && monthPanel.classList.contains('show') && (!monthWrapper || !monthWrapper.contains(e.target))) {
                toggleMonthDropdown();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.searchable-combobox')) {
                document.getElementById('device-options')?.classList.remove('show');
            }
        });
    }

    // ── Custom Dropdown Logic ───────────────────────────────────────
    window.toggleResultDropdown = function() {
        const panel = document.getElementById('result-dropdown-options');
        const trigger = document.getElementById('result-dropdown-trigger');
        if(!panel) return;
        panel.classList.toggle('show');
        if (panel.classList.contains('show')) {
            trigger.style.borderColor = '#076EB8';
            trigger.style.boxShadow = '0 0 0 3px rgba(7, 110, 184, 0.15)';
        } else {
            trigger.style.borderColor = '';
            trigger.style.boxShadow = '';
        }
    };

    window.selectResult = function(value, text, element) {
        document.getElementById('modal-result').value = value;
        document.getElementById('modal-result-text').textContent = text;
        
        document.querySelectorAll('#result-dropdown-options .custom-option').forEach(opt => opt.classList.remove('selected'));
        if(element) element.classList.add('selected');

        toggleResultDropdown();
    };

    window.toggleTypeFilterDropdown = function() {
        const panel = document.getElementById('type-filter-options');
        const trigger = document.getElementById('type-filter-trigger');
        if(!panel) return;
        panel.classList.toggle('show');
        if (panel.classList.contains('show')) {
            trigger.classList.add('active');
        } else {
            trigger.classList.remove('active');
        }
    };

    window.selectTypeFilter = function(value, text, element) {
        document.getElementById('device-type-filter').value = value;
        document.getElementById('selected-type-text').textContent = text;
        
        document.querySelectorAll('#type-filter-options .custom-option').forEach(opt => opt.classList.remove('selected'));
        if(element) element.classList.add('selected');

        toggleTypeFilterDropdown();
        filterMaintenanceList();
    };

    window.toggleMonthDropdown = function() {
        const panel = document.getElementById('month-filter-options');
        const trigger = document.getElementById('month-filter-trigger');
        if(!panel) return;
        panel.classList.toggle('show');
        trigger.classList.toggle('active', panel.classList.contains('show'));
    };

    window.selectMonth = function(value, text, element) {
        document.getElementById('month-select').value = value;
        document.getElementById('selected-month-text').textContent = text;
        document.querySelectorAll('#month-filter-options .custom-option').forEach(opt => opt.classList.remove('selected'));
        if(element) element.classList.add('selected');
        toggleMonthDropdown();
        renderCalendar();
    };

    window.toggleYearDropdown = function() {
        const panel = document.getElementById('year-filter-options');
        const trigger = document.getElementById('year-filter-trigger');
        if(!panel) return;
        panel.classList.toggle('show');
        trigger.classList.toggle('active', panel.classList.contains('show'));
    };

    window.selectYear = function(value, text, element) {
        document.getElementById('year-select').value = value;
        document.getElementById('selected-year-text').textContent = text;
        document.querySelectorAll('#year-filter-options .custom-option').forEach(opt => opt.classList.remove('selected'));
        if(element) element.classList.add('selected');
        toggleYearDropdown();
        renderCalendar();
    };

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
        const typeFilter = document.getElementById('device-type-filter')?.value || 'all';

        filteredDevices = devices.filter(d => {
            const matchesSearch = d.code.toLowerCase().includes(term) || d.name.toLowerCase().includes(term);
            const matchesType = typeFilter === 'all' || d.group === typeFilter;
            return matchesSearch && matchesType;
        });

        const total = filteredDevices.length;
        const totalPages = Math.ceil(total / mainPageSize);
        if (mainCurrentPage > totalPages && totalPages > 0) mainCurrentPage = totalPages;

        const start = (mainCurrentPage - 1) * mainPageSize;
        const end = start + mainPageSize;
        const pageData = filteredDevices.slice(start, end);

        // Group devices (only those on the current page)
        const grouped = {};
        groups.forEach(g => grouped[g] = []);
        pageData.forEach(d => { if (grouped[d.group]) grouped[d.group].push(d); });

        let itemsOnPage = [];
        let html = '';
        let absIdx = start;

        groups.forEach(groupName => {
            const groupDevices = grouped[groupName];
            if (!groupDevices || groupDevices.length === 0) return;

            const isCollapsed = collapsedGroups[groupName];

            html += `
                <tr class="group-row ${isCollapsed ? 'collapsed' : ''}">
                    <td></td>
                    <td></td>
                    <td onclick="toggleGroup('${groupName}')" style="cursor: pointer; padding: 10px 0;">
                        <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                            <span class="group-toggle-icon" style="margin-right: 6px; margin-bottom: 0;"><i class="fas fa-chevron-down"></i></span>
                            <strong style="font-size: 13px;">${groupName}</strong>
                            <span class="group-badge" style="margin-left: 6px;">${groupDevices.length}</span>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            `;

            if (!isCollapsed) {
                groupDevices.forEach((d, i) => {
                    absIdx++;
                    const nextOverdue = d.nextMaintenance < new Date();
                    html += `
                        <tr data-group="${groupName}">
                            <td class="text-center"><input type="checkbox" ${d.selected ? 'checked' : ''} onchange="toggleDeviceSelection(${d.id})"></td>
                            <td class="text-center" style="color:#94a3b8;font-size:12px">${absIdx}</td>
                            <td style="color:#64748b;font-size:12px"></td>
                            <td><strong style="color:#076EB8">${d.code}</strong></td>
                            <td>${d.name}</td>
                            <td class="text-center">${d.maintenanceCount}</td>
                            <td class="text-center">${formatDate(d.lastMaintenance)}</td>
                            <td class="text-center" style="color:${nextOverdue ? '#ef4444' : '#334155'};font-weight:${nextOverdue ? 700 : 400}">${formatDate(d.nextMaintenance)}</td>
                            <td class="text-center">
                                <div style="display: flex; justify-content: center; gap: 8px;">
                                    <button class="action-icon record" onclick="openMaintenanceModal(${d.id})" title="Ghi nhận bảo trì">
                                        <i class="fas fa-tools" style="font-size:12px"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });
            }
        });

        tbody.innerHTML = html;
        
        // Update pagination info (Exact match with inbound.js)
        const startIdx = (mainCurrentPage - 1) * mainPageSize;
        const startRange = total > 0 ? startIdx + 1 : 0;
        const endRange = Math.min(startIdx + mainPageSize, total);
        const mainInfo = document.getElementById('main-info');
        if (mainInfo) mainInfo.innerText = `Hiển thị ${startRange} - ${endRange} trong ${total}`;
        
        // Render pagination
        renderMainPagination(totalPages, total);
        updateBulkButton();
        
        // Update Select All checkbox state
        const selectAll = document.getElementById('select-all');
        if (selectAll) {
            selectAll.checked = total > 0 && filteredDevices.every(d => d.selected);
        }
    };

    window.toggleGroup = function(groupName) {
        collapsedGroups[groupName] = !collapsedGroups[groupName];
        renderMaintenanceList();
    };

    window.filterMaintenanceList = function() {
        mainCurrentPage = 1;
        renderMaintenanceList();
    };

    window.syncScroll = function(element) {
        const head = element.parentElement.querySelector('.table-scroll-head');
        if (head) head.scrollLeft = element.scrollLeft;
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

    function renderMainPagination(totalPages, totalItems) {
        const container = document.getElementById('main-pagination');
        if (!container) return;
        
        if (totalItems === 0) {
            container.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // Previous button (Exact match with inbound.js)
        html += `<button class="btn-page" ${mainCurrentPage === 1 ? 'disabled' : ''} onclick="goToMainPage(${mainCurrentPage - 1})" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;"><i class="fas fa-chevron-left"></i></button>`;
        
        // Page numbers (Exact match with inbound.js)
        for (let i = 1; i <= totalPages; i++) {
            if (i <= 2 || i > totalPages - 2 || (i >= mainCurrentPage - 1 && i <= mainCurrentPage + 1)) {
                const isActive = i === mainCurrentPage;
                html += `<button class="btn-page ${isActive ? 'active' : ''}" onclick="goToMainPage(${i})" style="padding:6px 12px;border:1px solid ${isActive ? '#0D6BB9' : '#e2e8f0'};border-radius:6px;background:#fff;color:${isActive ? '#0D6BB9' : '#334155'};cursor:pointer;font-weight:${isActive ? '600' : '400'};">${i}</button>`;
            } else if (i === 3 && mainCurrentPage > 4) {
                html += `<span style="padding:0 6px;color:#64748b;">...</span>`;
            } else if (i === totalPages - 2 && mainCurrentPage < totalPages - 3) {
                html += `<span style="padding:0 6px;color:#64748b;">...</span>`;
            }
        }
        
        // Next button (Exact match with inbound.js)
        html += `<button class="btn-page" ${mainCurrentPage === totalPages ? 'disabled' : ''} onclick="goToMainPage(${mainCurrentPage + 1})" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;"><i class="fas fa-chevron-right"></i></button>`;
        
        container.innerHTML = html;
        
        // Clear go-to-page input
        const goPageInput = document.getElementById('main-go-page');
        if (goPageInput) goPageInput.value = '';
    }

    window.goToMainPage = function(page) {
        const total = filteredDevices.length;
        const totalPages = Math.max(1, Math.ceil(total / mainPageSize));
        if (page < 1 || page > totalPages) return;
        mainCurrentPage = page;
        renderMaintenanceList();
    };

    window.goToMainPageFromInput = function() {
        const input = document.getElementById('main-go-page');
        const page = parseInt(input?.value);
        if (!page || isNaN(page)) return;
        goToMainPage(page);
    };

    // ── Modals ──────────────────────────────────────────────────────
    window.openMaintenanceModal = function(id) {
        const device = devices.find(d => d.id === id);
        if (!device) return;
        activeDeviceId = id;
        
        const groupEl = document.getElementById('modal-device-group');
        if (groupEl) groupEl.value = device.group;
        
        document.getElementById('modal-device-code').value = device.code;
        document.getElementById('modal-device-name').value = device.name;
        
        const dateInput = document.getElementById('modal-maintenance-date');
        const nextDateInput = document.getElementById('modal-next-maintenance-date');
        
        if (dateInput) {
            const d = new Date();
            pdaState['maint'].selected = new Date(d);
            dateInput.value = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
            dateInput.dataset.date = toInputDate(d);
        }

        if (nextDateInput) {
            const nextDate = new Date();
            const cycleDays = device.cycle || 90;
            nextDate.setDate(nextDate.getDate() + cycleDays);
            pdaState['next'].selected = new Date(nextDate);
            nextDateInput.value = ('0' + nextDate.getDate()).slice(-2) + '/' + ('0' + (nextDate.getMonth() + 1)).slice(-2) + '/' + nextDate.getFullYear();
            nextDateInput.dataset.date = toInputDate(nextDate);
        }

        document.getElementById('modal-technician').value = '';
        
        // Reset custom select
        const resultVal = document.getElementById('modal-result');
        const resultText = document.getElementById('modal-result-text');
        if (resultVal) resultVal.value = 'ok';
        if (resultText) resultText.textContent = 'Hoàn thành - Thiết bị hoạt động tốt';
        document.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
        const firstOption = document.querySelector('.custom-option:first-child');
        if (firstOption) firstOption.classList.add('selected');

        document.getElementById('modal-note').value = '';
        document.getElementById('maintenance-modal-title').textContent = `Ghi nhận bảo trì thiết bị ${device.name}- ${device.code}`;
        document.getElementById('maintenance-modal').classList.add('show');
    };

    window.saveMaintenance = function() {
        const device = devices.find(d => d.id === activeDeviceId);
        if (!device) return;
        const dateInput = document.getElementById('modal-maintenance-date');
        const nextDateInput = document.getElementById('modal-next-maintenance-date');
        const technicianInput = document.getElementById('modal-technician');
        const resultInput = document.getElementById('modal-result');
        const noteInput = document.getElementById('modal-note');
        
        const dateStr = dateInput?.dataset.date;
        const nextDateStr = nextDateInput?.dataset.date;
        
        if (dateStr) {
            device.lastMaintenance = new Date(dateStr);
            if (nextDateStr) {
                device.nextMaintenance = new Date(nextDateStr);
            } else {
                device.nextMaintenance = new Date(dateStr);
                const cycleDays = device.cycle || 90;
                device.nextMaintenance.setDate(device.nextMaintenance.getDate() + cycleDays);
            }
            device.maintenanceCount++;
            
            // Save additional fields
            device.history = device.history || [];
            device.history.push({
                date: new Date(dateStr),
                technician: technicianInput?.value || '',
                result: resultInput?.value || 'ok',
                note: noteInput?.value || ''
            });
            
            // Current status update
            device.lastTechnician = technicianInput?.value || '';
            device.lastResult = resultInput?.value || 'ok';
            device.lastNote = noteInput?.value || '';
        }
        closeModal('maintenance-modal');
        showToast(`Đã ghi nhận bảo trì cho ${device.code}`, 'success');
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
        const panel = document.getElementById('year-filter-options');
        const selectedYearInput = document.getElementById('year-select');
        const selectedYearText = document.getElementById('selected-year-text');
        const selectedMonthInput = document.getElementById('month-select');
        const selectedMonthText = document.getElementById('selected-month-text');
        
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        
        // Month init
        selectedMonthInput.value = currentMonth;
        selectedMonthText.textContent = `Tháng ${currentMonth + 1}`;
        const monthOptions = document.querySelectorAll('#month-filter-options .custom-option');
        monthOptions.forEach((opt, idx) => {
            if(idx === currentMonth) opt.classList.add('selected');
            else opt.classList.remove('selected');
        });

        // Year init
        selectedYearInput.value = currentYear;
        selectedYearText.textContent = currentYear;
        
        if (panel) {
            panel.innerHTML = '';
            for (let y = currentYear - 2; y <= currentYear + 2; y++) {
                const div = document.createElement('div');
                div.className = 'custom-option' + (y === currentYear ? ' selected' : '');
                div.textContent = y;
                div.onclick = function() { selectYear(y, y, this); };
                panel.appendChild(div);
            }
        }
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

    // ── PDA Custom Calendar Logic ────────────────────────────────────
    const pdaState = {
        maint: { month: new Date().getMonth(), year: new Date().getFullYear(), selected: null, temp: null, inputId: 'modal-maintenance-date' },
        next: { month: new Date().getMonth(), year: new Date().getFullYear(), selected: null, temp: null, inputId: 'modal-next-maintenance-date' }
    };

    window.initCustomCalendars = function() {
        const types = ['maint', 'next'];
        types.forEach(type => {
            const mount = document.getElementById(`calendar-mount-${type}`);
            if (mount) {
                mount.innerHTML = `
<div id="pda-calendar-dropdown-${type}" class="pda-calendar-dropdown">
  <div class="pda-cal-container">
    <div class="pda-cal-sidebar">
      <div class="pda-cal-option" onclick="addQuickDays('${type}', 30)">30 Ngày</div>
      <div class="pda-cal-option" onclick="addQuickDays('${type}', 90)">90 Ngày</div>
      <div class="pda-cal-option" onclick="addQuickDays('${type}', 180)">180 Ngày</div>
      <div class="pda-cal-option" onclick="addQuickYears('${type}', 1)">1 Năm</div>
      <div class="pda-cal-option" onclick="addQuickYears('${type}', 3)">3 Năm</div>
      <div class="pda-cal-option" onclick="addQuickYears('${type}', 5)">5 Năm</div>
    </div>
    <div class="pda-cal-main">
      <div class="pda-cal-header">
        <button type="button" class="pda-cal-nav" onclick="pdaCalPrevMonth('${type}')"><i class="fas fa-chevron-left"></i></button>
        <div class="pda-cal-selectors" style="display: flex; gap: 8px;">
          <div class="custom-dropdown month-dropdown" id="pdaMonthDropdown-${type}" style="width: 100px;">
            <div class="dropdown-selected" id="pdaMonthSelected-${type}">Tháng</div>
            <div class="dropdown-list month-grid" id="pdaMonthList-${type}"></div>
          </div>
          <div class="custom-dropdown year-dropdown" id="pdaYearDropdown-${type}" style="width: 80px;">
            <div class="dropdown-selected" id="pdaYearSelected-${type}">Năm</div>
            <div class="dropdown-list year-grid" id="pdaYearList-${type}"></div>
          </div>
        </div>
        <button type="button" class="pda-cal-nav" onclick="pdaCalNextMonth('${type}')"><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="pda-cal-weekdays">
        <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
      </div>
      <div id="pda-cal-days-${type}" class="pda-cal-days"></div>
      <div class="pda-cal-footer">
        <button type="button" class="pda-cal-btn-secondary" onclick="closePdaCalendar('${type}')">Hủy</button>
        <button type="button" class="pda-cal-btn-primary" onclick="pdaCalApply('${type}')">Áp dụng</button>
      </div>
    </div>
  </div>
</div>`;
            }
        });

        document.addEventListener('click', function(e) {
            types.forEach(type => {
                const wrapper = document.getElementById(pdaState[type].inputId)?.closest('.pda-datepicker-wrapper');
                const dropdown = document.getElementById(`pda-calendar-dropdown-${type}`);
                if (wrapper && dropdown && !wrapper.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        });
    };

    window.togglePdaCalendar = function(type) {
        const dropdown = document.getElementById(`pda-calendar-dropdown-${type}`);
        if (!dropdown) return;
        
        if (dropdown.classList.contains('active')) {
            closePdaCalendar(type);
        } else {
            const st = pdaState[type];
            if (st.selected) {
                st.temp = new Date(st.selected);
                st.month = st.temp.getMonth();
                st.year = st.temp.getFullYear();
            } else {
                st.temp = null;
                st.month = new Date().getMonth();
                st.year = new Date().getFullYear();
            }
            
            document.querySelectorAll(`#pda-calendar-dropdown-${type} .pda-cal-option`).forEach(opt => opt.classList.remove('active'));
            dropdown.classList.add('active');
            renderPdaCalendar(type);
        }
    };

    window.closePdaCalendar = function(type) {
        const dropdown = document.getElementById(`pda-calendar-dropdown-${type}`);
        if (dropdown) dropdown.classList.remove('active');
    };

    window.pdaCalPrevMonth = function(type) {
        pdaState[type].month--;
        if (pdaState[type].month < 0) {
            pdaState[type].month = 11;
            pdaState[type].year--;
        }
        renderPdaCalendar(type);
    };

    window.pdaCalNextMonth = function(type) {
        pdaState[type].month++;
        if (pdaState[type].month > 11) {
            pdaState[type].month = 0;
            pdaState[type].year++;
        }
        renderPdaCalendar(type);
    };

    window.renderPdaCalendar = function(type) {
        const st = pdaState[type];
        const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        const shortMonths = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

        const mSel = document.getElementById(`pdaMonthSelected-${type}`);
        const mList = document.getElementById(`pdaMonthList-${type}`);
        const ySel = document.getElementById(`pdaYearSelected-${type}`);
        const yList = document.getElementById(`pdaYearList-${type}`);
        
        if (mList && mList.children.length === 0) {
            mList.innerHTML = shortMonths.map((m, i) => `<div class="dropdown-item" data-value="${i}">${m}</div>`).join('');
            mList.querySelectorAll('.dropdown-item').forEach(item => {
                item.onclick = function(e) {
                    e.stopPropagation();
                    st.month = parseInt(item.dataset.value);
                    renderPdaCalendar(type);
                    document.getElementById(`pdaMonthDropdown-${type}`).classList.remove('active');
                };
            });
        }
        
        if (yList) {
            yList.innerHTML = '';
            const startYear = st.year - 5;
            for(let y = startYear; y <= startYear + 11; y++) {
                const div = document.createElement('div');
                div.className = 'dropdown-item' + (y === st.year ? ' selected' : '');
                div.dataset.value = y;
                div.textContent = y;
                div.onclick = function(e) {
                    e.stopPropagation();
                    st.year = y;
                    renderPdaCalendar(type);
                    document.getElementById(`pdaYearDropdown-${type}`).classList.remove('active');
                };
                yList.appendChild(div);
            }
        }

        if (mSel) mSel.textContent = monthNames[st.month];
        if (ySel) ySel.textContent = st.year;
        
        if(mList) mList.querySelectorAll('.dropdown-item').forEach(i => i.classList.toggle('selected', parseInt(i.dataset.value) === st.month));

        const mDrop = document.getElementById(`pdaMonthDropdown-${type}`);
        if (mDrop && !mDrop.dataset.init) {
            mDrop.dataset.init = 'true';
            mDrop.onclick = function(e) {
                e.stopPropagation();
                const isActive = mDrop.classList.contains('active');
                document.getElementById(`pdaYearDropdown-${type}`)?.classList.remove('active');
                mDrop.classList.toggle('active', !isActive);
            };
        }

        const yDrop = document.getElementById(`pdaYearDropdown-${type}`);
        if (yDrop && !yDrop.dataset.init) {
            yDrop.dataset.init = 'true';
            yDrop.onclick = function(e) {
                e.stopPropagation();
                const isActive = yDrop.classList.contains('active');
                document.getElementById(`pdaMonthDropdown-${type}`)?.classList.remove('active');
                yDrop.classList.toggle('active', !isActive);
            };
        }

        const container = document.getElementById(`pda-cal-days-${type}`);
        if (!container) return;
        container.innerHTML = '';
        
        const firstDay = new Date(st.year, st.month, 1);
        const lastDay = new Date(st.year, st.month + 1, 0);
        const startDayOfWeek = (firstDay.getDay() + 6) % 7;
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const prevMonthLastDay = new Date(st.year, st.month, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pda-cal-day other-month';
            btn.textContent = prevMonthLastDay - i;
            const d = new Date(st.year, st.month - 1, prevMonthLastDay - i);
            btn.onclick = function() { pdaSelectDate(type, d); };
            container.appendChild(btn);
        }
        
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pda-cal-day';
            btn.textContent = day;
            const d = new Date(st.year, st.month, day);
            if (d.getTime() === today.getTime()) btn.classList.add('today');
            if (st.temp && d.getTime() === st.temp.getTime()) btn.classList.add('selected');
            
            btn.onclick = function() { pdaSelectDate(type, d); };
            container.appendChild(btn);
        }
        
        const remaining = 42 - container.children.length;
        for (let i = 1; i <= remaining; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pda-cal-day other-month';
            btn.textContent = i;
            const d = new Date(st.year, st.month + 1, i);
            btn.onclick = function() { pdaSelectDate(type, d); };
            container.appendChild(btn);
        }
    };

    window.pdaSelectDate = function(type, date) {
        pdaState[type].temp = new Date(date);
        document.querySelectorAll(`#pda-calendar-dropdown-${type} .pda-cal-option`).forEach(opt => opt.classList.remove('active'));
        renderPdaCalendar(type);
    };

    window.pdaCalApply = function(type) {
        const st = pdaState[type];
        if (st.temp) {
            st.selected = new Date(st.temp);
            const input = document.getElementById(st.inputId);
            if (input) {
                input.value = ('0' + st.selected.getDate()).slice(-2) + '/' + ('0' + (st.selected.getMonth()+1)).slice(-2) + '/' + st.selected.getFullYear();
                input.dataset.date = toInputDate(st.selected);
            }
        }
        closePdaCalendar(type);
    };

    window.addQuickDays = function(type, days) {
        const d = new Date();
        d.setHours(0,0,0,0);
        d.setDate(d.getDate() + days);
        const st = pdaState[type];
        st.month = d.getMonth();
        st.year = d.getFullYear();
        st.temp = new Date(d);
        renderPdaCalendar(type);
        
        const sidebar = document.querySelector(`#pda-calendar-dropdown-${type} .pda-cal-sidebar`);
        if (sidebar) {
            sidebar.querySelectorAll('.pda-cal-option').forEach(opt => {
                opt.classList.toggle('active', opt.textContent.includes(days + ' Ngày'));
            });
        }
    };

    window.addQuickYears = function(type, years) {
        const d = new Date();
        d.setHours(0,0,0,0);
        d.setFullYear(d.getFullYear() + years);
        const st = pdaState[type];
        st.month = d.getMonth();
        st.year = d.getFullYear();
        st.temp = new Date(d);
        renderPdaCalendar(type);
        
        const sidebar = document.querySelector(`#pda-calendar-dropdown-${type} .pda-cal-sidebar`);
        if (sidebar) {
            sidebar.querySelectorAll('.pda-cal-option').forEach(opt => {
                opt.classList.toggle('active', opt.textContent.includes(years + ' Năm'));
            });
        }
    };



    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();