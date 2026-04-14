// Encapsulate in IIFE to avoid global scope pollution and redeclaration errors
(function() {
    console.log('--- Job Module Loading ---');

    // --- Mock Data Constants ---
    // Use const here is fine because it's inside the IIFE function scope
    const MATERIALS = [
        { code: 'MAT-001', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - TROPICAL' },
        { code: 'MAT-002', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - SOFIA' },
        { code: 'MAT-003', name: 'Chuối Trung Quốc/ Chinese bananas - A789 - TROPICAL' },
        { code: 'MAT-004', name: 'Chuối Nhật Bản/ Japanese bananas - 26CP - DEL MONTE' },
        { code: 'MAT-005', name: 'Chuối Nhật Bản/ Japanese bananas - 16CP - SEIKA' },
        { code: 'MAT-006', name: 'Chuối Trung Quốc/ Chinese bananas - CL - DASANG' },
        { code: 'MAT-007', name: 'Chuối Nhật Bản/ Japanese bananas - 14CP - XINFADIN' },
        { code: 'MAT-008', name: 'Chuối Nhật Bản/ Japanese bananas - 28LY - DEL MONTE' }
    ];

    const JOB_TYPES_MAP = {
        'IMPORT_NEW': { text: 'Nhập mới', class: 'badge-import' },
        'IMPORT_RETURN': { text: 'Nhập lại', class: 'badge-import' },
        'IMPORT_DIRECT': { text: 'Nhập chuyền thẳng', class: 'badge-import' },
        'EXPORT_MATERIAL': { text: 'Xuất theo vật tư', class: 'badge-export' },
        'EXPORT_PALLET': { text: 'Xuất theo pallet', class: 'badge-export' }
    };
    const JOB_TYPE_VALUES = Object.keys(JOB_TYPES_MAP);
    const STATUSES = ['PENDING', 'PROCESSING', 'COMPLETED', 'ERROR'];
    
    // WCS process steps - operations performed by lifter, AMR, transfer
    const PROCESS_STEPS = [
        'Lifter thực hiện lấy pallet',
        'Lifter hoàn trả hàng',
        'Lifter di chuyển đến vị trí ô A2',
        'AMR đang lấy pallet',
        'AMR đang đặt pallet vào vị trí nhập',
        'Transfer đang di chuyển pallet ra vị trí xuất',
        'Lifter trở về vị trí ban đầu',
        'Lifter lấy pallet trống'
    ];
    
    // Step statuses with corresponding colors
    const STEP_STATUSES = ['PENDING', 'PROCESSING', 'COMPLETED', 'ERROR'];

    // --- State ---
    let jobData = [];
    let jobFilteredData = [];
    let currentPage = 1;
    const itemsPerPage = 20;
    let filterPriority = false;

    // --- Date Picker State ---
    let selectedStartDate = null;
    let selectedEndDate = null;
    let activeStartDate = null;
    let activeEndDate = null;
    let currentViewLeft = new Date();
    let currentViewRight = new Date();
    currentViewRight.setMonth(currentViewRight.getMonth() + 1);

    // --- Data Generation ---
    function generateMockData(count = 65) {
        const data = [];
        const now = new Date();
        
        for (let i = 0; i < count; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - Math.floor(Math.random() * 60)); 
            date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
            
            const typeValue = JOB_TYPE_VALUES[Math.floor(Math.random() * JOB_TYPE_VALUES.length)];
            const jobStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];
            const mat = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];
            const qty = Math.floor(Math.random() * 200) + 10;
            const palletCode = `P-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
            
            const yy = String(date.getFullYear()).slice(-2);
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            
            const code = `${palletCode}_${mat.code}_${qty}_${yy}/${mm}/${dd}`;
            
            // Randomly assign priority (star)
            const isPriority = Math.random() < 0.2; // 20% priority

            // Generate completedAt for COMPLETED jobs
            let completedAt = null;
            if (jobStatus === 'COMPLETED') {
                const minDuration = 2 * 60 * 1000; // 2 minutes
                const maxDuration = 30 * 60 * 1000; // 30 minutes
                const randomDuration = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
                completedAt = new Date(date.getTime() + randomDuration);
            }

            // Generate process steps with statuses based on job status
            const numSteps = Math.floor(Math.random() * 4) + 2; // 2-5 steps
            const shuffled = [...PROCESS_STEPS].sort(() => 0.5 - Math.random());
            const selectedStepNames = shuffled.slice(0, numSteps);
            
            // Assign status to each step based on job status
            const processSteps = selectedStepNames.map((name, idx) => {
                let stepStatus;
                if (jobStatus === 'COMPLETED') {
                    stepStatus = 'COMPLETED';
                } else if (jobStatus === 'ERROR') {
                    // Last step is error, others completed
                    stepStatus = idx === selectedStepNames.length - 1 ? 'ERROR' : 'COMPLETED';
                } else if (jobStatus === 'PROCESSING') {
                    // First steps completed, one processing, rest pending
                    const processingIdx = Math.floor(numSteps / 2);
                    if (idx < processingIdx) stepStatus = 'COMPLETED';
                    else if (idx === processingIdx) stepStatus = 'PROCESSING';
                    else stepStatus = 'PENDING';
                } else {
                    // PENDING - all steps pending
                    stepStatus = 'PENDING';
                }
                return { name, status: stepStatus };
            });
            
            data.push({
                id: i + 1,
                code: code,
                isPriority: isPriority,
                type: typeValue,
                material: { code: mat.code, name: mat.name, qty: qty },
                createdAt: date,
                completedAt: completedAt,
                status: jobStatus,
                process: processSteps // Array of {name, status} objects
            });
        }
        return data.sort((a,b) => b.createdAt - a.createdAt);
    }

    // --- Helper Functions ---
    function getStatusBadge(status) {
        const map = {
            'PENDING': { class: 'badge-pending', text: 'Đang chờ' },
            'PROCESSING': { class: 'badge-processing', text: 'Đang xử lý' },
            'COMPLETED': { class: 'badge-completed', text: 'Đã hoàn thành' },
            'ERROR': { class: 'badge-error', text: 'Lỗi' }
        };
        const s = map[status] || { class: '', text: status };
        return `<span class="badge ${s.class}">${s.text}</span>`;
    }

    function formatDuration(start, end) {
        if (!start || !end) return '-';
        const diff = Math.abs(end - start);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        let parts = [];
        if (hours > 0) parts.push(`${hours} giờ`);
        if (minutes > 0) parts.push(`${minutes} phút`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds} giây`);
        
        return parts.join(' ');
    }

    // --- Filter Handlers ---
    function applyFilters() {
        const searchInput = document.getElementById('job-search');
        const typeInput = document.getElementById('filter-type');
        const statusInput = document.getElementById('filter-status');

        const sText = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const fType = typeInput ? typeInput.value : 'ALL';
        const fStatus = statusInput ? statusInput.value : 'ALL';
        
        // Get Date Range
        const dateRange = window.JobModule && window.JobModule.getAppliedDateRange 
            ? window.JobModule.getAppliedDateRange() 
            : { start: null, end: null };

        jobFilteredData = jobData.filter(item => {
            const mSearch = item.code.toLowerCase().includes(sText) || 
                           item.material.code.toLowerCase().includes(sText) ||
                           item.material.name.toLowerCase().includes(sText);
            const mType = fType === 'ALL' || item.type === fType;
            const mStatus = fStatus === 'ALL' || item.status === fStatus;
            const mPriority = !filterPriority || item.isPriority;
            
            let mDate = true;
            if (dateRange.start && dateRange.end) {
                const itemDate = new Date(item.createdAt);
                itemDate.setHours(0,0,0,0);
                const start = new Date(dateRange.start).setHours(0,0,0,0);
                const end = new Date(dateRange.end).setHours(0,0,0,0);
                mDate = itemDate >= start && itemDate <= end;
            }

            return mSearch && mType && mStatus && mDate && mPriority;
        });
        
        currentPage = 1;
        renderTable();
    }

    function handleSearch() {
        applyFilters();
    }

    // --- Core Logic ---
    function init() {
        // Initialize data
        jobData = generateMockData(65);
        jobFilteredData = [...jobData];
        currentPage = 1;

        console.log('Job Module Initialized. Data count:', jobData.length);

        // Expose public API to window for HTML event handlers
        window.JobModule = {
            prevPage: prevPage,
            nextPage: nextPage,
            gotoPage: gotoPage,
            handleSearch: handleSearch,
            toggleTypeSelect: toggleTypeSelect,
            selectType: selectType,
            toggleStatusSelect: toggleStatusSelect,
            selectStatus: selectStatus,
            toggleDatePicker: toggleDatePicker,
            togglePriorityFilter: togglePriorityFilter,
            applyFilters: applyFilters
        };

        renderTable();
        
        // Now setup date picker (it adds getAppliedDateRange to window.JobModule)
        setupDatePicker();

        // Horizontal Scroll Sync
        const scrollBody = document.querySelector('.table-scroll-body');
        const scrollHead = document.querySelector('.table-scroll-head');
        if (scrollBody && scrollHead) {
            scrollBody.addEventListener('scroll', () => {
                scrollHead.scrollLeft = scrollBody.scrollLeft;
            });
        }
    }
    
    // Toggle Date Picker
    function toggleDatePicker(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const picker = document.getElementById('analyticsPicker');
        if (picker) {
            const isActive = picker.classList.contains('active');
            picker.classList.toggle('active');
            picker.style.display = isActive ? 'none' : 'flex';
            if (!isActive) {
                initPickerDropdowns();
            }
        }
    }

    function togglePriorityFilter() {
        filterPriority = !filterPriority;
        const btn = document.getElementById('btn-filter-priority');
        if (btn) {
            btn.classList.toggle('active', filterPriority);
        }
        applyFilters();
    }

    function renderTable() {
        const tbody = document.getElementById('job-table-body');
        if (!tbody) {
            console.error('CRITICAL: #job-table-body not found!');
            return;
        }

        const totalItems = jobFilteredData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginated = jobFilteredData.slice(start, end);

        // Render Rows
        if (paginated.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 30px; color:#64748b">Không tìm thấy dữ liệu</td></tr>`;
            const paginationBar = document.querySelector('.pagination-bar');
            if(paginationBar) paginationBar.style.display = 'none';
        } else {
            const paginationBar = document.querySelector('.pagination-bar');
            if(paginationBar) paginationBar.style.display = 'flex';

            tbody.innerHTML = paginated.map((item, index) => {
                const typeInfo = JOB_TYPES_MAP[item.type] || { text: item.type, class: '' };
                const typeBadge = `<span class="badge ${typeInfo.class}">${typeInfo.text}</span>`;
                
                // Format Date
                const d = item.createdAt;
                const hh = String(d.getHours()).padStart(2,'0');
                const min = String(d.getMinutes()).padStart(2,'0');
                const day = String(d.getDate()).padStart(2,'0');
                const mon = String(d.getMonth()+1).padStart(2,'0');
                const yyyy = d.getFullYear();
                const dateFormatted = `${hh}:${min} - ${day}/${mon}/${yyyy}`;
                
                // Content Code with Star logic
                const codeHtml = item.isPriority 
                    ? `<i class="fas fa-star priority-star"></i>${item.code}` 
                    : item.code;

                const durationHtml = formatDuration(item.createdAt, item.completedAt);
                
                const processList = `<div class="process-steps">${item.process.map(p => `<div class="process-step step-${p.status.toLowerCase()}">${p.name}</div>`).join('')}</div>`;
                const realIndex = start + index + 1;

                return `
                    <tr>
                        <td class="text-center">${realIndex}</td>
                        <td class="col-code" style="font-weight:500">${codeHtml}</td>
                        <td class="text-center">${typeBadge}</td>
                        <td class="col-material">
                            <div class="product-item">
                                <div class="prod-code">${item.material.code}</div>
                                <div class="prod-name">${item.material.name}</div>
                                <div style="font-size:12px; color:#64748b">Số lượng: <b>${item.material.qty}</b></div>
                            </div>
                        </td>
                        <td class="text-center">${dateFormatted}</td>
                        <td class="text-center">${durationHtml}</td>
                        <td>${processList}</td>
                    </tr>
                `;
            }).join('');
        }
        updatePagination(totalItems, totalPages);
    }

    function updatePagination(totalItems, totalPages) {
        const infoEl = document.getElementById('job-info');
        const pageNumsEl = document.getElementById('job-pagination');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (!infoEl) return;
        
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        infoEl.textContent = totalItems > 0 ? `Hiển thị ${start} - ${end} trong ${totalItems}` : '';

        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;

        if (pageNumsEl) {
            pageNumsEl.innerHTML = '';
            const maxVisible = 5;
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + maxVisible - 1);
            if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

            for (let i = startPage; i <= endPage; i++) {
                const btn = document.createElement('button');
                btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
                btn.textContent = i;
                btn.onclick = () => { JobModule.gotoPage(i); };
                pageNumsEl.appendChild(btn);
            }
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    }

    function nextPage() {
        const totalPages = Math.ceil(jobFilteredData.length / itemsPerPage) || 1;
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    }

    function gotoPage(page) {
        const totalPages = Math.ceil(jobFilteredData.length / itemsPerPage) || 1;
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            renderTable();
        }
    }

    function toggleTypeSelect() {
        const wrapper = document.getElementById('type-select-wrapper');
        if (wrapper) {
            document.querySelectorAll('.custom-select-wrapper').forEach(el => {
                if (el !== wrapper) el.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        }
    }

    function selectType(value, text, element) {
        document.getElementById('filter-type').value = value;
        document.getElementById('type-select-text').textContent = text;
        document.querySelectorAll('#type-options .custom-option').forEach(opt => opt.classList.remove('selected'));
        if (element) element.classList.add('selected');
        document.getElementById('type-select-wrapper').classList.remove('open');
        applyFilters();
    }

    function toggleStatusSelect() {
        const wrapper = document.getElementById('status-select-wrapper');
        if (wrapper) {
            document.querySelectorAll('.custom-select-wrapper').forEach(el => {
                if (el !== wrapper) el.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        }
    }

    function selectStatus(value, text, element) {
        document.getElementById('filter-status').value = value;
        document.getElementById('status-select-text').textContent = text;
        document.querySelectorAll('#status-options .custom-option').forEach(opt => opt.classList.remove('selected'));
        if (element) element.classList.add('selected');
        document.getElementById('status-select-wrapper').classList.remove('open');
        applyFilters();
    }

    // --- Date Picker Logic ---
    function initPickerDropdowns() {
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 1; i++) years.push(i);

        const populate = (listId, selectedId, opts, isMonth, isLeft) => {
            const listEl = document.getElementById(listId);
            const selectedEl = document.getElementById(selectedId);
            if (!listEl) return;
            listEl.innerHTML = opts.map((opt, i) => {
                const val = isMonth ? i : opt;
                return `<div class="dropdown-item" data-value="${val}">${opt}</div>`;
            }).join('');

            listEl.querySelectorAll('.dropdown-item').forEach(item => {
                item.onclick = (e) => {
                    e.stopPropagation();
                    const val = parseInt(item.dataset.value);
                    if (isMonth) {
                        if (isLeft) currentViewLeft.setMonth(val);
                        else currentViewRight.setMonth(val);
                    } else {
                        if (isLeft) currentViewLeft.setFullYear(val);
                        else currentViewRight.setFullYear(val);
                    }
                    if (selectedEl) selectedEl.textContent = item.textContent;
                    listEl.parentElement.classList.remove('active');
                    renderCalendars();
                };
            });
        };

        const setupToggle = (dropdownId) => {
            const el = document.getElementById(dropdownId);
            if (!el) return;
            el.onclick = (e) => {
                e.stopPropagation();
                const isActive = el.classList.contains('active');
                document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('active'));
                if (!isActive) el.classList.add('active');
            };
        };

        populate('leftMonthList', 'leftMonthSelected', months, true, true);
        populate('rightMonthList', 'rightMonthSelected', months, true, false);
        populate('leftYearList', 'leftYearSelected', years, false, true);
        populate('rightYearList', 'rightYearSelected', years, false, false);
        
        setupToggle('leftMonthDropdown');
        setupToggle('leftYearDropdown');
        setupToggle('rightMonthDropdown');
        setupToggle('rightYearDropdown');
    }

    function renderCalendars() {
        const render = (containerId, viewDate) => {
            const container = document.querySelector(`#${containerId} .days-container`);
            if(!container) return;
            container.innerHTML = '';
            
            const year = viewDate.getFullYear();
            const month = viewDate.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDay = firstDay === 0 ? 6 : firstDay - 1;

            for(let i=0; i<startDay; i++) {
                const div = document.createElement('div');
                div.className = 'calendar-day empty';
                container.appendChild(div);
            }

            for(let i=1; i<=daysInMonth; i++) {
                const d = new Date(year, month, i);
                const div = document.createElement('div');
                let cls = 'calendar-day';
                
                const currentTs = new Date(year, month, i).setHours(0,0,0,0);
                const s = selectedStartDate ? new Date(selectedStartDate).setHours(0,0,0,0) : null;
                const e = selectedEndDate ? new Date(selectedEndDate).setHours(0,0,0,0) : null;

                if (s && currentTs === s) cls += ' selected start';
                if (e && currentTs === e) cls += ' selected end';
                if (s && e && currentTs > s && currentTs < e) cls += ' in-range';

                const today = new Date();
                const isToday = d.getDate() === today.getDate() && 
                                d.getMonth() === today.getMonth() && 
                                d.getFullYear() === today.getFullYear();
                if (isToday) cls += ' today';

                div.className = cls;
                div.textContent = i;
                div.onclick = (e) => {
                    e.stopPropagation();
                    handleDateClick(new Date(year, month, i));
                };
                container.appendChild(div);
            }
        };

        render('leftCalendar', currentViewLeft);
        render('rightCalendar', currentViewRight);
        updateTempDisplay();
    }

    function handleDateClick(date) {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            selectedStartDate = date;
            selectedEndDate = null;
        } else {
            if (date < selectedStartDate) {
                selectedEndDate = selectedStartDate;
                selectedStartDate = date;
            } else {
                selectedEndDate = date;
            }
        }
        renderCalendars();
    }

    function updateTempDisplay() {
        const tempRangeDisplay = document.getElementById('tempRangeDisplay');
        if (!tempRangeDisplay) return;
        const format = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
        if (selectedStartDate && selectedEndDate) {
            tempRangeDisplay.textContent = `${format(selectedStartDate)} - ${format(selectedEndDate)}`;
        } else if (selectedStartDate) {
            tempRangeDisplay.textContent = `${format(selectedStartDate)} - ...`;
        } else {
            tempRangeDisplay.textContent = 'Chọn khoảng thời gian';
        }
    }

    function setupDatePicker() {
        const picker = document.getElementById('analyticsPicker');
        const cancelBtn = document.getElementById('cancelPicker');
        const applyBtn = document.getElementById('applyPicker');
        const clearBtn = document.getElementById('clearPicker');
        const rangeDisplay = document.getElementById('dateRangeDisplay');
        
        if(!picker) return;

        picker.onclick = (e) => e.stopPropagation();

        if (cancelBtn) cancelBtn.onclick = () => { picker.classList.remove('active'); picker.style.display = 'none'; };
        if (clearBtn) clearBtn.onclick = () => {
            selectedStartDate = null; selectedEndDate = null;
            activeStartDate = null; activeEndDate = null;
            if(rangeDisplay) rangeDisplay.textContent = 'dd/mm/yyyy - dd/mm/yyyy';
            picker.classList.remove('active'); picker.style.display = 'none';
            renderCalendars(); applyFilters(); 
        };

        if (applyBtn) {
            applyBtn.onclick = () => {
                activeStartDate = selectedStartDate;
                activeEndDate = selectedEndDate;
                const format = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
                if (activeStartDate && activeEndDate) {
                    if(rangeDisplay) rangeDisplay.textContent = `${format(activeStartDate)} - ${format(activeEndDate)}`;
                } else if (!activeStartDate && !activeEndDate) {
                    if(rangeDisplay) rangeDisplay.textContent = 'Tất cả thời gian';
                } else {
                    if(rangeDisplay) rangeDisplay.textContent = 'dd/mm/yyyy - dd/mm/yyyy';
                }
                picker.classList.remove('active'); picker.style.display = 'none';
                applyFilters();
            };
        }

        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.onclick = () => {
                const range = item.dataset.range;
                const now = new Date();
                selectedEndDate = new Date(now);
                selectedStartDate = new Date(now);
                switch(range) {
                    case 'all': 
                        selectedStartDate = null; 
                        selectedEndDate = null; 
                        break;
                    case 'today': break;
                    case 'last3': selectedStartDate.setDate(now.getDate() - 2); break;
                    case 'last7': selectedStartDate.setDate(now.getDate() - 6); break;
                    case 'last30': selectedStartDate.setDate(now.getDate() - 29); break;
                    case 'last3mo': selectedStartDate.setMonth(now.getMonth() - 3); break;
                }
                if (selectedStartDate) {
                    currentViewLeft = new Date(selectedStartDate);
                    currentViewRight = new Date(selectedStartDate);
                    currentViewRight.setMonth(currentViewRight.getMonth() + 1);
                }
                renderCalendars();
            };
        });

        renderCalendars();
        initPickerDropdowns();

        window.JobModule.getAppliedDateRange = () => {
            return { start: activeStartDate, end: activeEndDate };
        };
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-wrapper')) {
            document.querySelectorAll('.custom-select-wrapper').forEach(el => el.classList.remove('open'));
        }
        const picker = document.getElementById('analyticsPicker');
        const trigger = document.getElementById('dateRangeTrigger');
        if (picker && picker.classList.contains('active') && !picker.contains(e.target) && !trigger.contains(e.target)) {
            picker.classList.remove('active');
            picker.style.display = 'none';
        }
    });

    init();

})();

