// Encapsulate in IIFE to avoid global scope pollution and redeclaration errors
(function() {
    console.log('--- Job Module Loading ---');

    // --- Mock Data Constants ---
    // Use const here is fine because it's inside the IIFE function scope
    const MATERIALS = [
        { code: 'MAT-001', name: 'Thép ống D60' },
        { code: 'MAT-002', name: 'Xi măng Hà Tiên' },
        { code: 'MAT-003', name: 'Gạch men 60x60' },
        { code: 'MAT-004', name: 'Sơn Dulux Trong Nhà' },
        { code: 'MAT-005', name: 'Bóng đèn LED Rạng Đông' },
        { code: 'MAT-006', name: 'Dây điện Cadivi' },
        { code: 'MAT-007', name: 'Ống nhựa Bình Minh' },
        { code: 'MAT-008', name: 'Kính cường lực 10mm' }
    ];

    const JOB_TYPES = ['Nhập kho', 'Xuất kho'];
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
            
            const typeRaw = JOB_TYPES[Math.floor(Math.random() * JOB_TYPES.length)];
            const jobStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];
            const mat = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];
            const qty = Math.floor(Math.random() * 200) + 10;
            const palletCode = `P-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
            
            const yy = String(date.getFullYear()).slice(-2);
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            
            const code = `${palletCode}_${mat.code}_${qty}_${yy}/${mm}/${dd}`;
            
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
                type: typeRaw === 'Nhập kho' ? 'IMPORT' : 'EXPORT',
                material: { code: mat.code, name: mat.name, qty: qty },
                createdAt: date,
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

    // --- Core Logic ---
    function init() {
        // Initialize data
        jobData = generateMockData(65);
        jobFilteredData = [...jobData];
        currentPage = 1;

        console.log('Job Module Initialized. Data count:', jobData.length);

        renderTable();
        
        // Expose public API to window for HTML event handlers FIRST
        // (before setupDatePicker which adds getAppliedDateRange to JobModule)
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
            applyFilters: applyFilters
        };
        
        // Now setup date picker (it adds getAppliedDateRange to window.JobModule)
        setupDatePicker();
        
    
        console.log('Filter dropdowns setup complete');
    }
    
    // Toggle Date Picker (exposed globally for HTML onclick)
    function toggleDatePicker(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const picker = document.getElementById('analyticsPicker');
        if (picker) {
            picker.classList.toggle('active');
            if (picker.classList.contains('active')) {
                initPickerDropdowns();
            }
        }
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
                const typeBadge = item.type === 'IMPORT' 
                    ? `<span class="badge badge-import">Nhập kho</span>` 
                    : `<span class="badge badge-export">Xuất kho</span>`;
                
                // Format Date
                const d = item.createdAt;
                const hh = String(d.getHours()).padStart(2,'0');
                const min = String(d.getMinutes()).padStart(2,'0');
                const day = String(d.getDate()).padStart(2,'0');
                const mon = String(d.getMonth()+1).padStart(2,'0');
                const yyyy = d.getFullYear();
                const dateFormatted = `${hh}:${min} - ${day}/${mon}/${yyyy}`;
                
                const processList = `<div class="process-steps">${item.process.map(p => `<div class="process-step step-${p.status.toLowerCase()}">${p.name}</div>`).join('')}</div>`;
                const realIndex = start + index + 1;

                return `
                    <tr>
                        <td class="text-center">${realIndex}</td>
                        <td class="col-code" style="font-weight:500">${item.code}</td>
                        <td>${typeBadge}</td>
                        <td class="col-material">
                            <div class="product-item">
                                <div class="prod-code">${item.material.code}</div>
                                <div class="prod-name">${item.material.name}</div>
                                <div style="font-size:12px; color:#64748b">Số lượng: <b>${item.material.qty}</b></div>
                            </div>
                        </td>
                        <td>${dateFormatted}</td>
                        <td>${processList}</td>
                        <td class="text-center">
                            <button class="btn-icon" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
                            ${item.status === 'ERROR' ? '<button class="btn-icon" style="color:#ef4444" title="Xem lỗi"><i class="fas fa-exclamation-triangle"></i></button>' : ''}
                        </td>
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

        // Update Prev/Next states
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;

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
                btn.onclick = () => { currentPage = i; renderTable(); };
                pageNumsEl.appendChild(btn);
            }
        }
    }

    // --- Pagination Functions ---
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

    function handleSearch() {
        applyFilters();
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
        const dom = {
            leftMonthList: document.getElementById('leftMonthList'),
            leftMonthSelected: document.getElementById('leftMonthSelected'),
            leftMonthDropdown: document.getElementById('leftMonthDropdown'),
            leftYearList: document.getElementById('leftYearList'),
            leftYearSelected: document.getElementById('leftYearSelected'),
            leftYearDropdown: document.getElementById('leftYearDropdown'),
            
            rightMonthList: document.getElementById('rightMonthList'),
            rightMonthSelected: document.getElementById('rightMonthSelected'),
            rightMonthDropdown: document.getElementById('rightMonthDropdown'),
            rightYearList: document.getElementById('rightYearList'),
            rightYearSelected: document.getElementById('rightYearSelected'),
            rightYearDropdown: document.getElementById('rightYearDropdown'),
        };

        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 1; i++) years.push(i);

        const populate = (listEl, selectedEl, opts, isMonth, isLeft) => {
            if (!listEl) return;
            listEl.innerHTML = opts.map((opt, i) => {
                const val = isMonth ? i : opt;
                return `<div class="dropdown-item" data-value="${val}">${opt}</div>`;
            }).join('');

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

                    selectedEl.textContent = item.textContent;
                    listEl.parentElement.classList.remove('active');
                    
                    // Highlight selected
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

            if (dom.leftMonthSelected) dom.leftMonthSelected.textContent = months[leftMonthIdx];
            if (dom.leftYearSelected) dom.leftYearSelected.textContent = leftYearVal;
            if (dom.rightMonthSelected) dom.rightMonthSelected.textContent = months[rightMonthIdx];
            if (dom.rightYearSelected) dom.rightYearSelected.textContent = rightYearVal;
        };

        const setupToggle = (dropdownEl) => {
            if (!dropdownEl) return;
            dropdownEl.onclick = (e) => {
                e.stopPropagation();
                const isActive = dropdownEl.classList.contains('active');
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

    function renderCalendars() {
        const render = (containerId, viewDate, monthSelectedId, yearSelectedId) => {
            const container = document.querySelector(`#${containerId} .days-container`);
            if(!container) return;
            container.innerHTML = '';
            
            // Update header text if elements exist (redundant with syncUI but safe)
            const mEl = document.getElementById(monthSelectedId);
            const yEl = document.getElementById(yearSelectedId);
            if(mEl) mEl.textContent = `Tháng ${viewDate.getMonth() + 1}`;
            if(yEl) yEl.textContent = viewDate.getFullYear();

            const year = viewDate.getFullYear();
            const month = viewDate.getMonth();
            
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDay = firstDay === 0 ? 6 : firstDay - 1;

            // Empty slots
            for(let i=0; i<startDay; i++) {
                const div = document.createElement('div');
                div.className = 'calendar-day empty';
                container.appendChild(div);
            }

            // Days
            for(let i=1; i<=daysInMonth; i++) {
                const d = new Date(year, month, i);
                const div = document.createElement('div');
                let cls = 'calendar-day';
                
                // Check selection
                const t = d.getTime();
                d.setHours(0,0,0,0);
                const currentTs = d.getTime();
                
                const s = selectedStartDate ? new Date(selectedStartDate).setHours(0,0,0,0) : null;
                const e = selectedEndDate ? new Date(selectedEndDate).setHours(0,0,0,0) : null;

                if (s && currentTs === s) cls += ' selected start';
                if (e && currentTs === e) cls += ' selected end';
                if (s && e && currentTs > s && currentTs < e) cls += ' in-range';

                div.className = cls;
                div.textContent = i;
                div.onclick = (e) => {
                    e.stopPropagation();
                    handleDateClick(new Date(year, month, i));
                };
                container.appendChild(div);
            }
        };

        render('leftCalendar', currentViewLeft, 'leftMonthSelected', 'leftYearSelected');
        render('rightCalendar', currentViewRight, 'rightMonthSelected', 'rightYearSelected');
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

        picker.addEventListener('click', (e) => e.stopPropagation());

        if (cancelBtn) {
            cancelBtn.onclick = () => {
                picker.classList.remove('active');
                picker.style.display = 'none';
            };
        }

        if (clearBtn) {
            clearBtn.onclick = () => {
                selectedStartDate = null;
                selectedEndDate = null;
                activeStartDate = null;
                activeEndDate = null;
                rangeDisplay.textContent = 'dd/mm/yyyy - dd/mm/yyyy';
                picker.classList.remove('active');
                picker.style.display = 'none';
                renderCalendars();
                applyFilters(); 
            };
        }

        if (applyBtn) {
            applyBtn.onclick = () => {
                activeStartDate = selectedStartDate;
                activeEndDate = selectedEndDate;
                
                const format = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;

                if (activeStartDate && activeEndDate) {
                    rangeDisplay.textContent = `${format(activeStartDate)} - ${format(activeEndDate)}`;
                } else {
                    rangeDisplay.textContent = 'dd/mm/yyyy - dd/mm/yyyy';
                }
                
                picker.classList.remove('active');
                picker.style.display = 'none';
                applyFilters();
            };
        }

        // Quick Ranges
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.onclick = () => {
                const range = item.dataset.range;
                const now = new Date();
                selectedEndDate = new Date(now);
                selectedStartDate = new Date(now);

                switch(range) {
                    case 'today': break;
                    case 'last3': selectedStartDate.setDate(now.getDate() - 2); break;
                    case 'last7': selectedStartDate.setDate(now.getDate() - 6); break;
                    case 'last30': selectedStartDate.setDate(now.getDate() - 29); break;
                    case 'last3mo': selectedStartDate.setMonth(now.getMonth() - 3); break;
                    case 'last6mo': selectedStartDate.setMonth(now.getMonth() - 6); break;
                    case 'last1yr': selectedStartDate.setFullYear(now.getFullYear() - 1); break;
                }
                
                // Sync views
                currentViewLeft = new Date(selectedStartDate);
                currentViewRight = new Date(selectedStartDate);
                currentViewRight.setMonth(currentViewRight.getMonth() + 1);
                
                renderCalendars();
                initPickerDropdowns(); // Update dropdown text
            };
        });

        // Initialize
        renderCalendars();
        initPickerDropdowns();

        // Expose applied dates to filter scope
        window.JobModule.getAppliedDateRange = () => {
            return { start: activeStartDate, end: activeEndDate };
        };
    }

    // --- Filter Handlers (Updated) ---
    function applyFilters() {
        console.log('--- applyFilters called ---');
        
        const searchInput = document.getElementById('job-search');
        const typeInput = document.getElementById('filter-type');
        const statusInput = document.getElementById('filter-status');

        const sText = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const fType = typeInput ? typeInput.value : 'ALL';
        const fStatus = statusInput ? statusInput.value : 'ALL';
        
        console.log('Filter values:', { sText, fType, fStatus });
        console.log('Total jobData:', jobData.length);
        
        // Get Date Range
        const dateRange = window.JobModule.getAppliedDateRange ? window.JobModule.getAppliedDateRange() : { start: null, end: null };

        jobFilteredData = jobData.filter(item => {
            const mKey = item.code.toLowerCase().includes(sText);
            const mType = fType === 'ALL' || item.type === fType;
            const mStatus = fStatus === 'ALL' || item.status === fStatus;
            
            let mDate = true;
            if (dateRange.start && dateRange.end) {
                // Normalize Item Date
                const itemDate = new Date(item.createdAt);
                itemDate.setHours(0,0,0,0);
                
                const start = new Date(dateRange.start); 
                start.setHours(0,0,0,0);
                
                const end = new Date(dateRange.end); 
                end.setHours(0,0,0,0);
                
                mDate = itemDate >= start && itemDate <= end;
            }

            return mKey && mType && mStatus && mDate;
        });
        
        console.log('Filtered data count:', jobFilteredData.length);
        
        currentPage = 1;
        renderTable();
    }

    // --- Toggle/Select Functions for Filters ---
    function toggleTypeSelect() {
        const wrapper = document.getElementById('type-select-wrapper');
        if (wrapper) {
            // Close other dropdowns first
            document.querySelectorAll('.custom-select-wrapper').forEach(el => {
                if (el !== wrapper) el.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        }
    }

    function selectType(value, text, element) {
        document.getElementById('filter-type').value = value;
        document.getElementById('type-select-text').textContent = text;
        
        // Update selected state
        document.querySelectorAll('#type-options .custom-option').forEach(opt => opt.classList.remove('selected'));
        if (element) element.classList.add('selected');
        
        document.getElementById('type-select-wrapper').classList.remove('open');
        applyFilters();
    }

    function toggleStatusSelect() {
        const wrapper = document.getElementById('status-select-wrapper');
        if (wrapper) {
            // Close other dropdowns first
            document.querySelectorAll('.custom-select-wrapper').forEach(el => {
                if (el !== wrapper) el.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        }
    }

    function selectStatus(value, text, element) {
        document.getElementById('filter-status').value = value;
        document.getElementById('status-select-text').textContent = text;
        
        // Update selected state
        document.querySelectorAll('#status-options .custom-option').forEach(opt => opt.classList.remove('selected'));
        if (element) element.classList.add('selected');
        
        document.getElementById('status-select-wrapper').classList.remove('open');
        applyFilters();
    }

    function handleSearch() {
        applyFilters();
    }

    // Close dropdowns globally
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-wrapper')) {
            document.querySelectorAll('.custom-select-wrapper').forEach(el => el.classList.remove('open'));
        }
    });

    // Start
    init();

})();

