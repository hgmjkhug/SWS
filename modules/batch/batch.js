(function () {
    // --- CONFIGURATION & STATE ---
    var BATCH_STORAGE_KEY = 'SWS_BATCH_DATA';
    var PAGE_SIZE = 15;
    var mainCurrentPage = 1;
    var batchSearchQuery = "";
    var statusFilter = "ALL";
    var selectedCreatorFilterId = "ALL";
    var selectedGradeTypeFilter = "ALL";

    // Advanced Date Picker State (Verbatim from Outbound)
    var currentLeftDate = new Date();
    var currentRightDate = new Date();
    currentRightDate.setMonth(currentRightDate.getMonth() + 1);

    var today = new Date();
    var selectedRange = { 
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate()), 
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate()) 
    };
    var tempRange = { start: null, end: null };

    var PRODUCT_TYPES = [
        { id: 'PT01', name: 'Thép ống tròn' },
        { id: 'PT02', name: 'Thép tấm' },
        { id: 'PT03', name: 'Thép hình H' },
        { id: 'PT04', name: 'Thép hình I' },
        { id: 'PT05', name: 'Thép hộp' }
    ];

    var GRADES = [
        { value: 'A', label: 'Phẩm cấp A' },
        { value: 'B', label: 'Phẩm cấp B' },
        { value: 'C', label: 'Phẩm cấp C' },
        { value: 'D', label: 'Phẩm cấp D' }
    ];

    var STAFF_LIST = [
        { id: 'NV001', name: 'Nguyễn Văn An' },
        { id: 'NV002', name: 'Trần Thị Bình' },
        { id: 'NV003', name: 'Lê Văn Cường' },
        { id: 'NV004', name: 'Phạm Minh Dũng' }
    ];

    var STATUS_MAP = {
        'NEW': { label: 'Mới tạo', class: 'status-NEW' },
        'IMPORTING': { label: 'Đang nhập', class: 'status-IMPORTING' },
        'PROCESSING': { label: 'Đang nhập', class: 'status-IMPORTING' }, // Legacy mapping
        'INSTOCK': { label: 'Đã lưu kho', class: 'status-INSTOCK' },
        'EXPORTING': { label: 'Đang xuất', class: 'status-EXPORTING' },
        'OUTSTOCK': { label: 'Đã xuất kho', class: 'status-OUTSTOCK' }
    };

    var MOCK_BATCHES = [];

    // --- PERSISTENCE ---
    function saveBatches() { localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(MOCK_BATCHES)); }
    function loadBatches() {
        try {
            var saved = localStorage.getItem(BATCH_STORAGE_KEY);
            if (saved) {
                var parsed = JSON.parse(saved);
                return parsed.map(function(b) { return Object.assign({}, b, { createdAt: new Date(b.createdAt) }); });
            }
        } catch (e) { console.error("Error loading batches", e); }
        return [];
    }

    // --- GENERATE DATA ---
    function generateMockData() {
        var statusList = ['NEW', 'IMPORTING', 'INSTOCK', 'EXPORTING', 'OUTSTOCK'];
        var codes = ['TH-HP', 'TH-TR', 'TH-TA', 'TH-H', 'TH-I'];
        return Array.from({ length: 120 }, function(_, i) {
            var status = statusList[i % 5];
            var typeIndex = i % PRODUCT_TYPES.length;
            var productType = PRODUCT_TYPES[typeIndex];
            var creator = STAFF_LIST[i % STAFF_LIST.length];
            var createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - (i % 60)); 
            
            var importDate = null, exportDate = null;
            if (['INSTOCK', 'EXPORTING', 'OUTSTOCK'].indexOf(status) !== -1) {
                var iDate = new Date(createdAt); iDate.setDate(iDate.getDate() + 2);
                importDate = iDate.toISOString().split('T')[0];
            }
            if (status === 'OUTSTOCK') {
                var eDate = new Date(createdAt); eDate.setDate(eDate.getDate() + 5);
                exportDate = eDate.toISOString().split('T')[0];
            }
            
            return {
                id: Date.now() + i,
                code: codes[typeIndex] + '-' + String(1060 - i).padStart(4, '0'),
                name: 'Lô thép ' + productType.name + ' - Đợt ' + (Math.floor(i / 5) + 1),
                productType: productType.name,
                grades: ['A', 'B'],
                status: status,
                importDate: importDate,
                exportDate: exportDate,
                creator: creator,
                createdAt: createdAt
            };
        });
    }

    function getDaysInMonth(month, year) { return new Date(year, month + 1, 0).getDate(); }
    function formatDate(date) {
        if (!date) return "";
        var d = new Date(date);
        return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
    }
    function isSameDay(d1, d2) {
        if (!d1 || !d2) return false;
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    }
    function isDateInRange(date, start, end) {
        if (!start || !end || !date) return false;
        var d = new Date(date).setHours(0, 0, 0, 0);
        var s = new Date(start).setHours(0, 0, 0, 0);
        var e = new Date(end).setHours(0, 0, 0, 0);
        return d >= s && d <= e;
    }

    // --- TABLE RENDERING ---
    window.renderTable = function() {
        var tbody = document.getElementById('batch-table-body');
        if (!tbody) return;

        var filtered = MOCK_BATCHES.filter(function(b) {
            var matchesSearch = b.code.toLowerCase().indexOf(batchSearchQuery.toLowerCase()) !== -1 || 
                                b.name.toLowerCase().indexOf(batchSearchQuery.toLowerCase()) !== -1;
            var matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
            var matchesCreator = selectedCreatorFilterId === 'ALL' || b.creator.id === selectedCreatorFilterId;
            var matchesGradeType = selectedGradeTypeFilter === 'ALL' || b.productType === selectedGradeTypeFilter;
            
            var matchesDate = true;
            if (selectedRange.start && selectedRange.end) {
                var start = new Date(selectedRange.start).setHours(0,0,0,0);
                var end = new Date(selectedRange.end).setHours(23,59,59,999);
                matchesDate = b.createdAt >= start && b.createdAt <= end;
            }

            return matchesSearch && matchesStatus && matchesCreator && matchesGradeType && matchesDate;
        });

        var totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
        if (mainCurrentPage > totalPages) mainCurrentPage = totalPages;

        var startIdx = (mainCurrentPage - 1) * PAGE_SIZE;
        var pageData = filtered.slice(startIdx, startIdx + PAGE_SIZE);

        tbody.innerHTML = pageData.map(function(b, index) {
            var statusObj = STATUS_MAP[b.status] || { label: b.status, class: '' };
            return `
                <tr>
                    <td class="text-center">${startIdx + index + 1}</td>
                    <td style="font-weight: 700; color: #076EB8">${b.code}</td>
                    <td style="font-weight: 500">${b.name}</td>
                    <td>${b.productType}</td>
                    <td>${b.grades.join(', ')}</td>
                    <td class="text-center">
                        <span class="status-badge ${statusObj.class}">${statusObj.label}</span>
                    </td>
                    <td>${formatDate(b.importDate)}</td>
                    <td>${formatDate(b.exportDate)}</td>
                    <td>
                        <div style="line-height: 1.4">
                            <strong style="color: #1e293b">${b.creator.name}</strong><br>
                            <span style="color: #64748b; font-size: 11px;">${b.creator.id}</span>
                        </div>
                    </td>
                    <td class="text-center">
                        <div style="display: flex; justify-content: center; gap: 4px">
                            <button class="btn-icon" title="Xem" onclick="window.viewBatch(${b.id})"><i class="fa-regular fa-eye"></i></button>
                            <button class="btn-icon" title="Cây" onclick="window.viewTree(${b.id})"><i class="fa-solid fa-sitemap"></i></button>
                            <button class="btn-icon" title="Sửa" onclick="window.editBatch(${b.id})" ${b.status !== 'NEW' ? 'disabled' : ''}><i class="fa-regular fa-edit"></i></button>
                            <button class="btn-icon" title="Xóa" onclick="window.deleteBatch(${b.id})" ${b.status !== 'NEW' ? 'disabled' : ''} style="color: #ef4444"><i class="fa-regular fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        renderPaginationBar(filtered.length);
        
        // Ensure horizontal scroll sync after re-render if needed
        var headerWrapper = document.getElementById('batch-header-wrapper');
        var bodyWrapper = document.getElementById('batch-body-wrapper');
        if (headerWrapper && bodyWrapper) {
            headerWrapper.scrollLeft = bodyWrapper.scrollLeft;
        }
    };

    function renderPaginationBar(totalItems) {
        var totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
        var container = document.getElementById('main-pagination');
        if (!container) return;

        var html = '';
        
        // Prev Chevron
        html += `<button class="btn-page ${mainCurrentPage === 1 ? 'disabled' : ''}" onclick="window.goToPage(${Math.max(1, mainCurrentPage - 1)})" ${mainCurrentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;

        for (var i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= mainCurrentPage - 2 && i <= mainCurrentPage + 2)) {
                html += `<button class="btn-page ${i === mainCurrentPage ? 'active' : ''}" onclick="window.goToPage(${i})">${i}</button>`;
            } else if (i === 2 && mainCurrentPage > 4) {
                html += `<span style="padding: 0 4px; color: #94a3b8">...</span>`;
            } else if (i === totalPages - 1 && mainCurrentPage < totalPages - 3) {
                html += `<span style="padding: 0 4px; color: #94a3b8">...</span>`;
            }
        }

        // Next Chevron
        html += `<button class="btn-page ${mainCurrentPage === totalPages ? 'disabled' : ''}" onclick="window.goToPage(${Math.min(totalPages, mainCurrentPage + 1)})" ${mainCurrentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;

        container.innerHTML = html;

        var info = document.getElementById('main-info');
        if (info) {
            var start = totalItems === 0 ? 0 : (mainCurrentPage - 1) * PAGE_SIZE + 1;
            var end = Math.min(mainCurrentPage * PAGE_SIZE, totalItems);
            info.innerText = `Hiển thị ${start} - ${end} trong tổng ${totalItems}`;
        }
    }

    window.goToPage = function(p) { mainCurrentPage = parseInt(p); window.renderTable(); };
    window.handleSearch = function(v) { batchSearchQuery = v; mainCurrentPage = 1; window.renderTable(); };

    // --- DROPDOWN LOGIC ---
    window.toggleStatusDropdown = function() {
        var dropdown = document.getElementById('status-dropdown');
        if (dropdown) dropdown.classList.toggle('open');
    };

    window.selectStatusFilter = function(val, label) {
        statusFilter = val;
        var display = document.getElementById('status-selected-label');
        if (display) display.innerText = label;
        
        var dropdown = document.getElementById('status-dropdown');
        if (dropdown) {
            dropdown.querySelectorAll('.dropdown-option').forEach(function(opt) {
                opt.classList.toggle('active', opt.getAttribute('onclick').indexOf("'" + val + "'") !== -1);
            });
            dropdown.classList.remove('open');
        }
        mainCurrentPage = 1; window.renderTable();
    };

    // --- Creator Combobox Logic (Standardized) ---
    function initCreatorFilterCombobox() {
        var input = document.getElementById('creator-filter-input');
        var list = document.getElementById('creator-filter-list');
        var wrapper = document.getElementById('creator-filter-combobox');
        
        if (!input || !list || !wrapper) return;

        input.onfocus = function() {
            renderCreatorFilterOptions(input.value === 'Tất cả' ? '' : input.value);
            wrapper.classList.add('active');
        };

        input.oninput = function() {
            renderCreatorFilterOptions(input.value);
            wrapper.classList.add('active');
        };

        // Close when clicking outside (handled by global listener below)
    }

    function renderCreatorFilterOptions(term) {
        var list = document.getElementById('creator-filter-list');
        if (!list) return;
        
        var filterTerm = (term || "").toLowerCase().trim();
        var html = '';

        // "All" option
        if (!filterTerm || "tất cả".indexOf(filterTerm) !== -1) {
            html += `<div class="combobox-option ${selectedCreatorFilterId === 'ALL' ? 'selected' : ''}" onclick="window.selectCreatorFilter('ALL', 'Tất cả')">
                Tất cả
            </div>`;
        }

        STAFF_LIST.forEach(function(staff) {
            var searchStr = (staff.id + " " + staff.name).toLowerCase();
            if (!filterTerm || searchStr.indexOf(filterTerm) !== -1) {
                html += `<div class="combobox-option ${selectedCreatorFilterId === staff.id ? 'selected' : ''}" onclick="window.selectCreatorFilter('${staff.id}', '${staff.name}')">
                    <span style="font-weight: 600;">${staff.name}</span>
                    <span style="font-size: 11px; color: #64748b; margin-left: 4px;">(${staff.id})</span>
                </div>`;
            }
        });

        if (html === '') {
            html = '<div class="combobox-option no-results">Không tìm thấy người tạo</div>';
        }
        
        list.innerHTML = html;
        list.classList.add('show');
    }

    window.selectCreatorFilter = function(id, name) {
        selectedCreatorFilterId = id;
        var input = document.getElementById('creator-filter-input');
        if (input) {
            input.value = (id === 'ALL' ? '' : name);
            input.blur();
        }
        var list = document.getElementById('creator-filter-list');
        if (list) list.classList.remove('show');
        
        var wrapper = document.getElementById('creator-filter-combobox');
        if (wrapper) wrapper.classList.remove('active');

        mainCurrentPage = 1; window.renderTable();
    };

    // --- Grade Type Combobox Logic ---
    function initGradeTypeFilterCombobox() {
        var input = document.getElementById('grade-type-filter-input');
        var list = document.getElementById('grade-type-filter-list');
        var wrapper = document.getElementById('grade-type-filter-combobox');
        
        if (!input || !list || !wrapper) return;

        input.onfocus = function() {
            renderGradeTypeOptions(input.value);
            wrapper.classList.add('active');
        };

        input.oninput = function() {
            renderGradeTypeOptions(input.value);
            wrapper.classList.add('active');
        };
    }

    function renderGradeTypeOptions(term) {
        var list = document.getElementById('grade-type-filter-list');
        if (!list) return;
        
        var filterTerm = (term || "").toLowerCase().trim();
        var html = '';

        if (!filterTerm || "tất cả loại phẩm cấp".indexOf(filterTerm) !== -1) {
            html += `<div class="combobox-option ${selectedGradeTypeFilter === 'ALL' ? 'selected' : ''}" onclick="window.selectGradeTypeFilter('ALL', 'Tất cả loại phẩm cấp')">
                Tất cả loại phẩm cấp
            </div>`;
        }

        PRODUCT_TYPES.forEach(function(pt) {
            if (!filterTerm || pt.name.toLowerCase().indexOf(filterTerm) !== -1) {
                html += `<div class="combobox-option ${selectedGradeTypeFilter === pt.name ? 'selected' : ''}" onclick="window.selectGradeTypeFilter('${pt.name}', '${pt.name}')">
                    <span style="font-weight: 500;">${pt.name}</span>
                </div>`;
            }
        });

        if (html === '') {
            html = '<div class="combobox-option no-results">Không tìm thấy loại phẩm cấp</div>';
        }
        
        list.innerHTML = html;
        list.classList.add('show');
    }

    window.selectGradeTypeFilter = function(val, label) {
        selectedGradeTypeFilter = val;
        var input = document.getElementById('grade-type-filter-input');
        if (input) {
            input.value = (val === 'ALL' ? '' : label);
            input.blur();
        }
        var list = document.getElementById('grade-type-filter-list');
        if (list) list.classList.remove('show');
        
        var wrapper = document.getElementById('grade-type-filter-combobox');
        if (wrapper) wrapper.classList.remove('active');

        mainCurrentPage = 1; window.renderTable();
    };

    // --- DATE PICKER LOGIC (Verbatim from Outbound) ---
    window.toggleDateRangePicker = function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        var picker = document.getElementById("analyticsPicker");
        if (picker) {
            picker.classList.toggle("active");
            if (picker.classList.contains("active")) {
                renderCalendars();
                initPickerDropdowns();
            }
        }
    };

    function initPickerDropdowns() {
        var months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        ["left", "right"].forEach(function (side) {
            var current = side === "left" ? currentLeftDate : currentRightDate;
            var monthList = document.getElementById(side + "MonthList");
            var yearList = document.getElementById(side + "YearList");
            if (monthList) {
                monthList.innerHTML = "";
                months.forEach(function (m, idx) {
                    var item = document.createElement("div");
                    item.className = "dropdown-item " + (idx === current.getMonth() ? "selected" : "");
                    item.textContent = m;
                    item.onclick = function (e) {
                        e.stopPropagation();
                        current.setMonth(idx);
                        document.getElementById(side + "MonthSelected").textContent = m;
                        var dd = document.getElementById(side + "MonthDropdown");
                        if (dd) dd.classList.remove("active");
                        renderCalendars();
                    };
                    monthList.appendChild(item);
                });
                document.getElementById(side + "MonthSelected").textContent = months[current.getMonth()];
            }
            if (yearList) {
                yearList.innerHTML = "";
                var currentYear = new Date().getFullYear();
                for (var y = currentYear - 5; y <= currentYear + 5; y++) {
                    (function (yr) {
                        var item = document.createElement("div");
                        item.className = "dropdown-item " + (yr === current.getFullYear() ? "selected" : "");
                        item.textContent = yr;
                        item.onclick = function (e) {
                            e.stopPropagation();
                            current.setFullYear(yr);
                            document.getElementById(side + "YearSelected").textContent = yr;
                            var dd = document.getElementById(side + "YearDropdown");
                            if (dd) dd.classList.remove("active");
                            renderCalendars();
                        };
                        yearList.appendChild(item);
                    })(y);
                }
                document.getElementById(side + "YearSelected").textContent = current.getFullYear();
            }
        });
    }

    function renderCalendars() {
        renderCalendar("left", currentLeftDate);
        renderCalendar("right", currentRightDate);
        updateRangeDisplay();
    }

    function renderCalendar(side, date) {
        var grid = document.getElementById(side + "Calendar");
        if (!grid) return;
        var container = grid.querySelector(".days-container");
        if (!container) return;
        container.innerHTML = "";
        var year = date.getFullYear();
        var month = date.getMonth();
        var firstDay = new Date(year, month, 1).getDay();
        var daysInMonth = getDaysInMonth(month, year);
        var startOffset = firstDay === 0 ? 6 : firstDay - 1;
        for (var i = 0; i < startOffset; i++) {
            var empty = document.createElement("div");
            empty.className = "day empty";
            container.appendChild(empty);
        }
        for (var d = 1; d <= daysInMonth; d++) {
            (function (dayNum) {
                var dayDate = new Date(year, month, dayNum);
                var el = document.createElement("div");
                el.className = "day";
                el.textContent = dayNum;
                if (tempRange.start && isSameDay(dayDate, tempRange.start)) el.classList.add("selected", "range-start");
                if (tempRange.end && isSameDay(dayDate, tempRange.end)) el.classList.add("selected", "range-end");
                if (tempRange.start && tempRange.end && isDateInRange(dayDate, tempRange.start, tempRange.end)) el.classList.add("in-range");
                var t = new Date();
                if (dayDate.getDate() === t.getDate() && dayDate.getMonth() === t.getMonth() && dayDate.getFullYear() === t.getFullYear()) el.classList.add("today");
                el.onclick = function (e) { e.stopPropagation(); handleDayClick(dayDate); };
                container.appendChild(el);
            })(d);
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
        var display = document.getElementById("tempRangeDisplay");
        if (!display) return;
        if (tempRange.start && tempRange.end) display.textContent = formatDate(tempRange.start) + " — " + formatDate(tempRange.end);
        else if (tempRange.start) display.textContent = formatDate(tempRange.start) + " — ...";
        else display.textContent = "Chọn khoảng thời gian";
    }

    function setupExtraDatePickerListeners() {
        document.querySelectorAll(".calendar-panel .custom-dropdown").forEach(function (dd) {
            var sel = dd.querySelector(".dropdown-selected");
            if (sel) {
                sel.onclick = function (e) {
                    e.stopPropagation();
                    document.querySelectorAll(".calendar-panel .custom-dropdown").forEach(function (d) {
                        if (d !== dd) d.classList.remove("active");
                    });
                    dd.classList.toggle("active");
                };
            }
        });
        document.querySelectorAll(".analytics-date-picker .sidebar-item").forEach(function (item) {
            item.onclick = function (e) {
                e.preventDefault();
                document.querySelectorAll(".analytics-date-picker .sidebar-item").forEach(function (i) { i.classList.remove("active"); });
                item.classList.add("active");
                var range = item.getAttribute("data-range");
                var t = new Date();
                var start = new Date(t.getFullYear(), t.getMonth(), t.getDate());
                var end = new Date(t.getFullYear(), t.getMonth(), t.getDate());
                if (range === "today") { /* already set */ }
                else if (range === "last3") start.setDate(t.getDate() - 3);
                else if (range === "thisweek") {
                    var day = t.getDay();
                    var diff = day === 0 ? 6 : day - 1;
                    start.setDate(t.getDate() - diff);
                }
                else if (range === "last7") start.setDate(t.getDate() - 7);
                else if (range === "last30") start.setDate(t.getDate() - 30);
                else if (range === "last3mo") start.setMonth(t.getMonth() - 3);
                else if (range === "last6mo") start.setMonth(t.getMonth() - 6);
                else if (range === "last1yr") start.setFullYear(t.getFullYear() - 1);
                tempRange.start = start;
                tempRange.end = end;
                currentLeftDate = new Date(tempRange.start);
                currentRightDate = new Date(tempRange.end);
                if (isSameDay(currentLeftDate, currentRightDate)) currentRightDate.setMonth(currentRightDate.getMonth() + 1);
                renderCalendars();
            };
        });
        var applyBtn = document.getElementById("applyPicker");
        if (applyBtn) {
            applyBtn.onclick = function () {
                selectedRange = { start: tempRange.start, end: tempRange.end };
                var triggerDisplay = document.getElementById("dateRangeDisplay");
                if (triggerDisplay && selectedRange.start && selectedRange.end) {
                    triggerDisplay.textContent = formatDate(selectedRange.start) + " - " + formatDate(selectedRange.end);
                }
                var p = document.getElementById("analyticsPicker");
                if (p) p.classList.remove("active");
                mainCurrentPage = 1; window.renderTable();
            };
        }
        var cancelBtn = document.getElementById("cancelPicker");
        if (cancelBtn) {
            cancelBtn.onclick = function () {
                var p = document.getElementById("analyticsPicker");
                if (p) p.classList.remove("active");
            };
        }
        var clearBtn = document.getElementById("clearPicker");
        if (clearBtn) {
            clearBtn.onclick = function () {
                tempRange = { start: null, end: null };
                selectedRange = { start: null, end: null };
                document.querySelectorAll(".analytics-date-picker .sidebar-item").forEach(function (i) { i.classList.remove("active"); });
                renderCalendars();
                var triggerDisplay = document.getElementById("dateRangeDisplay");
                if (triggerDisplay) triggerDisplay.textContent = "dd/mm/yyyy - dd/mm/yyyy";
                var p = document.getElementById("analyticsPicker");
                if (p) p.classList.remove("active");
                mainCurrentPage = 1; window.renderTable();
            };
        }
    }

    // --- MODALS ---
    window.openCreateModal = function() {
        var modal = document.getElementById('modal-add-batch');
        if (!modal) return;
        // Ensure modal is in the top-level document body (for SPA/Iframe robustness)
        if (modal.parentNode !== document.body) {
            document.body.appendChild(modal);
        }
        modal.classList.add('open');
    };
    window.closeCreateModal = function() { document.getElementById('modal-add-batch').classList.remove('open'); };

    window.editBatch = function(id) {
        var b = MOCK_BATCHES.find(function(x) { return x.id === id; });
        if (!b) return;
        document.getElementById('edit-batch-id').value = b.id;
        document.getElementById('edit-batch-code').value = b.code;
        document.getElementById('edit-batch-name').value = b.name;
        document.getElementById('edit-product-type-input').value = b.productType;
        document.getElementById('modal-edit-batch').classList.add('open');
    };

    window.closeEditModal = function() { document.getElementById('modal-edit-batch').classList.remove('open'); };

    window.saveNewBatch = function() {
        var code = document.getElementById('batch-code').value;
        var name = document.getElementById('batch-name').value;
        if (!code || !name) { alert('Vui lòng điền đủ thông tin'); return; }
        MOCK_BATCHES.unshift({
            id: Date.now(), code: code, name: name, productType: 'Thép ống tròn', grades: ['A'], status: 'NEW', createdAt: new Date(),
            creator: STAFF_LIST[0]
        });
        saveBatches(); window.renderTable(); window.closeCreateModal();
    };

    window.saveEditBatch = function() {
        var id = parseInt(document.getElementById('edit-batch-id').value);
        var name = document.getElementById('edit-batch-name').value;
        var idx = MOCK_BATCHES.findIndex(function(x) { return x.id === id; });
        if (idx !== -1) { MOCK_BATCHES[idx].name = name; saveBatches(); window.renderTable(); window.closeEditModal(); }
    };

    window.deleteBatch = function(id) { if (confirm('Xóa lô hàng này?')) { MOCK_BATCHES = MOCK_BATCHES.filter(function(x) { return x.id !== id; }); saveBatches(); window.renderTable(); } };
    window.viewBatch = function(id) { alert('Xem chi tiết: ' + id); };

    window.viewTree = function(id) {
        var b = MOCK_BATCHES.find(function(x) { return x.id === id; });
        if (!b) return;

        // Use percentages for a truly responsive diagram area (75% of modal)
        // Centers for 4 columns: 100% / 4 / 2 = 12.5%, 37.5%, 62.5%, 87.5%
        var ACTOR_X = { 1: '12.5%', 2: '37.5%', 3: '62.5%', 4: '87.5%' };

        var actors = [
            { id: 1, name: 'Nhân viên',    icon: 'fa-user-tie' },
            { id: 2, name: 'Hệ thống WMS', icon: 'fa-server' },
            { id: 3, name: 'Kho bãi',      icon: 'fa-warehouse' },
            { id: 4, name: 'Vận chuyển',   icon: 'fa-truck-fast' }
        ];

        var steps = [
            {
                key: 'created', label: 'Khởi tạo lô hàng',
                from: 1, to: 2, color: '#076EB8',
                done: true,
                date: formatDate(b.createdAt),
                details: [
                    { label: 'Người thực hiện', value: b.creator.name },
                    { label: 'Mã nhân viên',    value: b.creator.id }
                ]
            },
            {
                key: 'processing', label: 'Hệ thống xử lý dữ liệu',
                from: 2, to: 2, type: 'self', color: '#7c3aed',
                done: ['IMPORTING', 'INSTOCK', 'EXPORTING', 'OUTSTOCK'].indexOf(b.status) !== -1,
                date: ['IMPORTING', 'INSTOCK', 'EXPORTING', 'OUTSTOCK'].indexOf(b.status) !== -1 ? formatDate(b.createdAt) : null,
                details: [
                    { label: 'Phân loại hàng',  value: b.productType },
                    { label: 'Phẩm cấp tiêu chuẩn', value: (b.grades || []).join(', ') }
                ]
            },
            {
                key: 'instock', label: 'Xác nhận nhập kho',
                from: 2, to: 3, color: '#16a34a',
                done: ['INSTOCK', 'EXPORTING', 'OUTSTOCK'].indexOf(b.status) !== -1,
                date: b.importDate ? formatDate(b.importDate) : null,
                details: [
                    { label: 'Thời gian nhập', value: b.importDate ? formatDate(b.importDate) : 'Chưa nhập' },
                    { label: 'Vị trí lưu kho',    value: 'Kho tổng' }
                ]
            },
            {
                key: 'outstock', label: 'Yêu cầu xuất kho',
                from: 3, to: 4, color: '#ea580c',
                done: b.status === 'OUTSTOCK',
                date: b.exportDate ? formatDate(b.exportDate) : null,
                details: [
                    { label: 'Thời gian xuất', value: b.exportDate ? formatDate(b.exportDate) : 'Chưa xuất' },
                    { label: 'Địa điểm giao hàng',  value: 'Công trình dự án' }
                ]
            },
            {
                key: 'done', label: 'Hoàn tất quy trình',
                from: 4, to: 1, type: 'return', color: '#2563eb',
                done: b.status === 'OUTSTOCK',
                date: b.exportDate ? formatDate(b.exportDate) : null,
                details: [
                    { label: 'Trạng thái cuối', value: (STATUS_MAP[b.status] || { label: b.status }).label },
                    { label: 'Đối soát kết quả', value: b.status === 'OUTSTOCK' ? 'Đã bàn giao đầy đủ' : 'Đang xử lý' }
                ]
            }
        ];

        var currentStepIndex = -1;
        steps.forEach(function(s, i) { if (s.done) currentStepIndex = i; });

        // ── ACTOR HEADER ROW ──────────────────────────────────────────────
        var actorsHtml = '<div class="sd-actors"><div class="sd-actor-container">';
        actors.forEach(function(a) {
            var isActive = (currentStepIndex >= 0 && (steps[currentStepIndex].from === a.id || steps[currentStepIndex].to === a.id));
            actorsHtml += '<div class="sd-actor-col">' +
                '<div class="sd-actor-box' + (isActive ? ' sd-actor-active' : '') + '">' +
                    '<i class="fa-solid ' + a.icon + '"></i>' +
                    '<span>' + a.name + '</span>' +
                '</div>' +
            '</div>';
        });
        actorsHtml += '</div><div style="flex:1"></div></div>'; // Placeholder for card column

        // ── MESSAGE ROWS ──────────────────────────────────────────────────
        var rowsHtml = '<div class="sd-rows">';
        steps.forEach(function(s, i) {
            var isDone = s.done;
            var isActive = (i === currentStepIndex);
            var rowMod = isDone ? ' sd-row--done' : (isActive ? ' sd-row--active' : ' sd-row--pending');

            var x1 = ACTOR_X[s.from];
            var x2 = ACTOR_X[s.to];
            var color = isDone ? s.color : '#cbd5e1';
            var isReturn = (s.type === 'return');

            // ── Arrow SVG (Nested SVG Groups for Robust Widescreen Rendering) ──
            var svgArrow = '';
            if (s.type === 'self') {
                // Wrap entire self-loop in a nested SVG anchored at x1
                svgArrow = '<svg class="sd-arrow-svg" xmlns="http://www.w3.org/2000/svg">' +
                    '<svg x="' + x1 + '" y="35" width="100" height="50" overflow="visible">' +
                        '<path d="M 0,0 H 50 V 35 H 0" ' +
                            'fill="none" stroke="' + color + '" stroke-width="3.5" class="sd-arrow-line ' + (isActive ? 'sd-path-animated' : '') + '" ' +
                            'stroke-dasharray="' + (isDone ? 'none' : '6,5') + '"/>' +
                        '<polygon points="0,0 12,-7 12,7" fill="' + color + '" transform="translate(0, 35)"/>' +
                        '<text x="60" y="20" font-size="14" fill="' + color + '" font-weight="800">' + s.label + '</text>' +
                    '</svg>' +
                '</svg>';
            } else {
                var midX = 'calc((' + x1 + ' + ' + x2 + ') / 2)';
                svgArrow = '<svg class="sd-arrow-svg" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="' + x1 + '" y1="40" x2="' + x2 + '" y2="40" ' +
                        'stroke="' + color + '" stroke-width="3.5" class="sd-arrow-line ' + (isActive ? 'sd-path-animated' : '') + '" ' +
                        'stroke-dasharray="' + (isReturn || !isDone ? '9,6' : 'none') + '"/>';
                // Nested SVG reliably anchors arrowhead at percentage x2
                svgArrow += '<svg x="' + x2 + '" y="40" overflow="visible">';
                if (isReturn) {
                    svgArrow += '<polyline points="12,-8 0,0 12,8" fill="none" stroke="' + color + '" stroke-width="3.5"/>';
                } else {
                    svgArrow += '<polygon points="0,0 -12,-8 -12,8" fill="' + color + '"/>';
                }
                svgArrow += '</svg>';
                svgArrow += '<text x="' + midX + '" y="30" text-anchor="middle" font-size="15" ' +
                    'fill="' + color + '" font-weight="900">' + s.label + '</text>';
                svgArrow += '</svg>';
            }

            var detailsHtml = s.details.map(function(d) {
                return '<div class="sd-detail-row"><span>' + d.label + '</span><strong>' + d.value + '</strong></div>';
            }).join('');

            var badgeHtml = isDone
                ? '<span class="sd-badge sd-badge--done"><i class="fa-solid fa-check-double"></i> Hoàn thành</span>'
                : '<span class="sd-badge sd-badge--pending"><i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý</span>';

            rowsHtml +=
                '<div class="sd-row' + rowMod + '" style="--sc:' + s.color + '">' +
                    '<div class="sd-diagram-area">' +
                        '<div class="sd-lifelines">' +
                            actors.map(function(a) {
                                return '<div class="sd-lifeline-col"><div class="sd-lifeline"></div></div>';
                            }).join('') +
                        '</div>' +
                        svgArrow +
                    '</div>' +
                    '<div class="sd-detail-card">' +
                        '<div class="sd-detail-header" style="color:' + s.color + '">' +
                            '<i class="fa-solid fa-shield-heart"></i> ' + s.label +
                        '</div>' +
                        detailsHtml +
                        (s.date ? '<div class="sd-detail-date"><i class="fa-regular fa-clock"></i> Cập nhật: ' + s.date + '</div>' : '') +
                        badgeHtml +
                    '</div>' +
                '</div>';
        });
        rowsHtml += '</div>';

        var diagramHtml = '<div class="sd-wrap">' + actorsHtml + rowsHtml + '</div>';

        // ── Modal ────────────────────────────────────────────────────────
        // ── Modal ────────────────────────────────────────────────────────
        var modal = document.getElementById('modal-lifecycle');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-lifecycle';
            modal.className = 'modal-overlay';
            modal.setAttribute('data-module-asset', 'true');
            modal.innerHTML =
                '<div class="modal-box lifecycle-modal-box">' +
                    '<div class="modal-header">' +
                        '<div style="display:flex;align-items:center;gap:15px;flex:1">' +
                            '<i class="fa-solid fa-sitemap" style="color:#076EB8;font-size:20px"></i>' +
                            '<div class="modal-title" id="lifecycle-modal-title">Vòng đời lô hàng</div>' +
                            '<div class="lifecycle-header-info" id="lifecycle-batch-info"></div>' +
                        '</div>' +
                        '<div class="close-modal" onclick="document.getElementById(\'modal-lifecycle\').classList.remove(\'open\')">' +
                            '<i class="fas fa-times"></i>' +
                        '</div>' +
                    '</div>' +
                    '<div class="modal-body lifecycle-modal-body">' +
                        '<div id="lifecycle-timeline"></div>' +
                    '</div>' +
                    '<div class="modal-footer" style="padding:12px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;">' +
                        '<button class="btn-secondary" onclick="document.getElementById(\'modal-lifecycle\').classList.remove(\'open\')">Đóng</button>' +
                    '</div>' +
                '</div>';
            document.body.appendChild(modal);
        }

        var statusObj = STATUS_MAP[b.status] || { label: b.status, class: '' };
        document.getElementById('lifecycle-modal-title').textContent = 'Vòng đời lô hàng — ' + b.code;
        document.getElementById('lifecycle-batch-info').innerHTML =
            '<div class="lifecycle-info-item"><i class="fa-solid fa-box-open" style="color:#076EB8"></i> <span>Mã lô: <strong>' + b.code + '</strong></span></div>' +
            '<div class="lifecycle-info-item"><i class="fa-solid fa-cube" style="color:#64748b"></i> <span>Sản phẩm: <strong>' + b.name + '</strong></span></div>' +
            '<div class="lifecycle-info-item"><i class="fa-solid fa-tag" style="color:#64748b"></i> <span>Loại: <strong>' + b.productType + '</strong></span></div>' +
            '<div class="lifecycle-info-item"><span class="status-badge ' + statusObj.class + '">' + statusObj.label + '</span></div>';
        
        var tc = document.getElementById('lifecycle-timeline');
        if (tc) tc.innerHTML = diagramHtml;
        modal.classList.add('open');
    };

    // --- INIT ---
    function init() {
        MOCK_BATCHES = loadBatches();
        
        // Data Migration: Convert old PROCESSING status to new IMPORTING
        var hasChanges = false;
        MOCK_BATCHES = MOCK_BATCHES.map(function(b) {
            if (b.status === 'PROCESSING') {
                b.status = 'IMPORTING';
                hasChanges = true;
            }
            return b;
        });
        if (hasChanges) saveBatches();

        if (MOCK_BATCHES.length === 0) { MOCK_BATCHES = generateMockData(); saveBatches(); }
        window.renderTable();
        setupExtraDatePickerListeners();
        initCreatorFilterCombobox();
        initGradeTypeFilterCombobox();

        // Horizontal Sync Scroll Logic
        var headerWrapper = document.getElementById('batch-header-wrapper');
        var bodyWrapper = document.getElementById('batch-body-wrapper');
        if (headerWrapper && bodyWrapper) {
            bodyWrapper.onscroll = function() {
                headerWrapper.scrollLeft = bodyWrapper.scrollLeft;
            };
        }
        
        document.addEventListener('click', function(e) {
            // Status Dropdown
            if (!e.target.closest('.status-custom-dropdown')) { 
                var s = document.getElementById('status-dropdown'); if (s) s.classList.remove('open'); 
            }
            // Date Picker
            if (!e.target.closest('.unified-date-filter')) { 
                var p = document.getElementById('analyticsPicker'); if (p) p.classList.remove('active'); 
            }
            // Date Picker Dropdowns
            if (!e.target.closest('.calendar-panel .custom-dropdown')) {
                document.querySelectorAll('.calendar-panel .custom-dropdown').forEach(function(d) { d.classList.remove('active'); });
            }
            // Creator Combobox
            if (!e.target.closest('.custom-combobox-wrapper')) {
                var cList = document.getElementById('creator-filter-list');
                if (cList) cList.classList.remove('show');
                var cWrapper = document.getElementById('creator-filter-combobox');
                if (cWrapper) cWrapper.classList.remove('active');
            }
            // Grade Type Combobox
            if (!e.target.closest('#grade-type-filter-combobox')) {
                var gList = document.getElementById('grade-type-filter-list');
                if (gList) gList.classList.remove('show');
                var gWrapper = document.getElementById('grade-type-filter-combobox');
                if (gWrapper) gWrapper.classList.remove('active');
            }
        });
    }

    init();
})();