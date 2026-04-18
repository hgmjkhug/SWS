(function () {
    // --- CONFIGURATION & STATE ---
    var BATCH_STORAGE_KEY = 'SWS_BATCH_DATA_v4';
    var PAGE_SIZE = 20;
    var mainCurrentPage = 1;
    var batchSearchQuery = "";
    var statusFilter = "ALL";
    var selectedCreatorFilterId = "ALL";
    var activeModalPicker = null;


    // Advanced Date Picker State (Verbatim from Outbound)
    var currentLeftDate = new Date();
    var currentRightDate = new Date();
    currentRightDate.setMonth(currentRightDate.getMonth() + 1);

    var today = new Date();
    var selectedRange = { 
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate()), 
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate()) 
    };
    var tempRange = { 
        start: new Date(selectedRange.start), 
        end: new Date(selectedRange.end) 
    };

    var PRODUCT_TYPES = [
        { id: 'PT01', name: 'Chuối Trung Quốc/ Chinese bananas' },
        { id: 'PT02', name: 'Chuối Nhật Bản/ Japanese bananas' }
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

    // Product groups mapped from product module's pham_cap categories
    var PRODUCT_GROUPS = [
        { id: 'A456', name: 'Chuối Trung Quốc - A456' },
        { id: 'A789', name: 'Chuối Trung Quốc - A789' },
        { id: 'B456', name: 'Chuối Trung Quốc - B456' },
        { id: 'B789', name: 'Chuối Trung Quốc - B789' },
        { id: 'CL', name: 'Chuối Trung Quốc - CL' },
        { id: '16CP-TQ', name: 'Chuối Trung Quốc - 16CP' },
        { id: 'CP', name: 'Chuối Trung Quốc - CP' },
        { id: '14CP', name: 'Chuối Nhật Bản - 14CP' },
        { id: '16CP-NB', name: 'Chuối Nhật Bản - 16CP' },
        { id: '26CP', name: 'Chuối Nhật Bản - 26CP' },
        { id: '35CLD', name: 'Chuối Nhật Bản - 35CLD' },
        { id: '18CP', name: 'Chuối Nhật Bản - 18CP' },
        { id: '28CP', name: 'Chuối Nhật Bản - 28CP' },
        { id: '30CP', name: 'Chuối Nhật Bản - 30CP' },
        { id: '36CP', name: 'Chuối Nhật Bản - 36CP' },
        { id: '38CP', name: 'Chuối Nhật Bản - 38CP' },
        { id: '40CP', name: 'Chuối Nhật Bản - 40CP' },
        { id: '43CP', name: 'Chuối Nhật Bản - 43CP' },
        { id: 'B5', name: 'Chuối Nhật Bản - B5' },
        { id: 'B6', name: 'Chuối Nhật Bản - B6' },
        { id: '33CP', name: 'Chuối Nhật Bản - 33CP' },
        { id: '28LY', name: 'Chuối Nhật Bản - 28LY' },
        { id: '35CP', name: 'Chuối Nhật Bản - 35CP' },
        { id: 'RCL', name: 'Chuối Nhật Bản - RCL' }
    ];

    // Products mapped from product module (bananaData structure)
    var INVENTORY_PRODUCTS = [
        { id: 'SP001', code: 'A456 - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - TROPICAL', group: 'A456' },
        { id: 'SP002', code: 'A456 - SOFIA', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - SOFIA', group: 'A456' },
        { id: 'SP003', code: 'A456 - FRUIT WHARF', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - FRUIT WHARF', group: 'A456' },
        { id: 'SP004', code: 'A456 - DASANG', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - DASANG', group: 'A456' },
        { id: 'SP005', code: 'A789 - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - A789 - TROPICAL', group: 'A789' },
        { id: 'SP006', code: 'A789 - SOFIA', name: 'Chuối Trung Quốc/ Chinese bananas - A789 - SOFIA', group: 'A789' },
        { id: 'SP007', code: 'B456 - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - B456 - TROPICAL', group: 'B456' },
        { id: 'SP008', code: 'B456 - SOFIA', name: 'Chuối Trung Quốc/ Chinese bananas - B456 - SOFIA', group: 'B456' },
        { id: 'SP009', code: 'B789 - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - B789 - TROPICAL', group: 'B789' },
        { id: 'SP010', code: 'B789 - SOFIA', name: 'Chuối Trung Quốc/ Chinese bananas - B789 - SOFIA', group: 'B789' },
        { id: 'SP011', code: 'CL - DASANG', name: 'Chuối Trung Quốc/ Chinese bananas - CL - DASANG', group: 'CL' },
        { id: 'SP012', code: '16CP - XINFADIN', name: 'Chuối Trung Quốc/ Chinese bananas - 16CP - XINFADIN', group: '16CP-TQ' },
        { id: 'SP013', code: '16CP - SEIKA', name: 'Chuối Trung Quốc/ Chinese bananas - 16CP - SEIKA', group: '16CP-TQ' },
        { id: 'SP014', code: 'CP - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - CP - TROPICAL', group: 'CP' },
        { id: 'SP015', code: '14CP - XINFADIN', name: 'Chuối Nhật Bản/ Japanese bananas - 14CP - XINFADIN', group: '14CP' },
        { id: 'SP016', code: '16CP - XINFADIN', name: 'Chuối Nhật Bản/ Japanese bananas - 16CP - XINFADIN', group: '16CP-NB' },
        { id: 'SP017', code: '16CP - SEIKA', name: 'Chuối Nhật Bản/ Japanese bananas - 16CP - SEIKA', group: '16CP-NB' },
        { id: 'SP018', code: '26CP - XINFADIN', name: 'Chuối Nhật Bản/ Japanese bananas - 26CP - XINFADIN', group: '26CP' },
        { id: 'SP019', code: '26CP - SEIKA', name: 'Chuối Nhật Bản/ Japanese bananas - 26CP - SEIKA', group: '26CP' },
        { id: 'SP020', code: '26CP - DEL MONTE', name: 'Chuối Nhật Bản/ Japanese bananas - 26CP - DEL MONTE', group: '26CP' },
        { id: 'SP021', code: '35CLD - XINFADIN', name: 'Chuối Nhật Bản/ Japanese bananas - 35CLD - XINFADIN', group: '35CLD' },
        { id: 'SP022', code: '18CP - SEIKA', name: 'Chuối Nhật Bản/ Japanese bananas - 18CP - SEIKA', group: '18CP' },
        { id: 'SP023', code: '28CP - SEIKA', name: 'Chuối Nhật Bản/ Japanese bananas - 28CP - SEIKA', group: '28CP' },
        { id: 'SP024', code: '28CP - DEL MONTE', name: 'Chuối Nhật Bản/ Japanese bananas - 28CP - DEL MONTE', group: '28CP' },
        { id: 'SP025', code: '30CP - SEIKA', name: 'Chuối Nhật Bản/ Japanese bananas - 30CP - SEIKA', group: '30CP' },
        { id: 'SP026', code: '30CP - DEL MONTE', name: 'Chuối Nhật Bản/ Japanese bananas - 30CP - DEL MONTE', group: '30CP' },
        { id: 'SP027', code: '36CP - SEIKA', name: 'Chuối Nhật Bản/ Japanese bananas - 36CP - SEIKA', group: '36CP' },
        { id: 'SP028', code: '38CP - SEIKA', name: 'Chuối Nhật Bản/ Japanese bananas - 38CP - SEIKA', group: '38CP' },
        { id: 'SP029', code: '38CP - DEL MONTE', name: 'Chuối Nhật Bản/ Japanese bananas - 38CP - DEL MONTE', group: '38CP' },
        { id: 'SP030', code: '38CP - SHIMIZU', name: 'Chuối Nhật Bản/ Japanese bananas - 38CP - SHIMIZU', group: '38CP' },
        { id: 'SP031', code: '40CP - SEIKA', name: 'Chuối Nhật Bản/ Japanese bananas - 40CP - SEIKA', group: '40CP' },
        { id: 'SP032', code: '40CP - NHẬT TRƠN', name: 'Chuối Nhật Bản/ Japanese bananas - 40CP - NHẬT TRƠN', group: '40CP' },
        { id: 'SP033', code: '40CP - TAITO', name: 'Chuối Nhật Bản/ Japanese bananas - 40CP - TAITO', group: '40CP' },
        { id: 'SP034', code: '43CP - SEIKA', name: 'Chuối Nhật Bản/ Japanese bananas - 43CP - SEIKA', group: '43CP' },
        { id: 'SP035', code: '43CP - MAINICHI', name: 'Chuối Nhật Bản/ Japanese bananas - 43CP - MAINICHI', group: '43CP' },
        { id: 'SP036', code: 'B5 - SEIKA 13KG', name: 'Chuối Nhật Bản/ Japanese bananas - B5 - SEIKA 13KG', group: 'B5' },
        { id: 'SP037', code: 'B6 - SEIKA 13KG', name: 'Chuối Nhật Bản/ Japanese bananas - B6 - SEIKA 13KG', group: 'B6' },
        { id: 'SP038', code: 'B6 - DELMONTE 13KG', name: 'Chuối Nhật Bản/ Japanese bananas - B6 - DELMONTE 13KG', group: 'B6' },
        { id: 'SP039', code: '33CP - SEIKA 13KG', name: 'Chuối Nhật Bản/ Japanese bananas - 33CP - SEIKA 13KG', group: '33CP' },
        { id: 'SP040', code: '33CP - DEL MONTE', name: 'Chuối Nhật Bản/ Japanese bananas - 33CP - DEL MONTE', group: '33CP' },
        { id: 'SP041', code: '28LY - DEL MONTE', name: 'Chuối Nhật Bản/ Japanese bananas - 28LY - DEL MONTE', group: '28LY' },
        { id: 'SP042', code: '35CP - DEL MONTE', name: 'Chuối Nhật Bản/ Japanese bananas - 35CP - DEL MONTE', group: '35CP' },
        { id: 'SP043', code: 'RCL - DEL MONTE', name: 'Chuối Nhật Bản/ Japanese bananas - RCL - DEL MONTE', group: 'RCL' }
    ];

    var STATUS_MAP = {
        'NEW': { label: 'Mới tạo', class: 'status-NEW' },
        'CHECKED': { label: 'Đã kiểm kê', class: 'status-CHECKED' },
        'PROCESSING': { label: 'Đang thực hiện', class: 'status-PROCESSING' },
        'COMPLETED': { label: 'Hoàn thành', class: 'status-COMPLETED' }
    };

    var MOCK_BATCHES = [];

    // --- PERSISTENCE ---
    function saveBatches() { localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(MOCK_BATCHES)); }
    function loadBatches() {
        try {
            var saved = localStorage.getItem(BATCH_STORAGE_KEY);
            if (saved) {
                var parsed = JSON.parse(saved);
                var batches = Array.isArray(parsed) ? parsed.map(function(b, i) { 
                    var dtStr = b.createdAt || new Date();
                    var obj = Object.assign({}, b, { createdAt: new Date(dtStr) }); 
                    
                    // Auto-repair missing creator so it's not "N/A"
                    if (!obj.creator || !obj.creator.id) {
                        obj.creator = STAFF_LIST[i % STAFF_LIST.length];
                    }

                    // Migration to new lifecycle statuses
                    if (['IMPORTING', 'INSTOCK', 'EXPORTING'].indexOf(obj.status) !== -1) obj.status = 'PROCESSING';
                    if (obj.status === 'OUTSTOCK') obj.status = 'COMPLETED';
                    return obj;
                }).filter(function(b) { return b && b.createdAt && !isNaN(b.createdAt.getTime()); }) : [];
                
                var now = new Date();
                if (batches.length > 0) {
                    var newestTs = Math.max.apply(null, batches.map(function(b) { return b.createdAt.getTime(); }));
                    var newest = new Date(newestTs);
                    var offset = now.setHours(0,0,0,0) - (isNaN(newest.getTime()) ? now.setHours(0,0,0,0) : new Date(newest).setHours(0,0,0,0));
                    
                    MOCK_BATCHES = batches.map(function(b, i) {
                        b.createdAt = new Date(b.createdAt.getTime() + offset);
                        // Migration for new fields
                        if (b.driverName === undefined) b.driverName = 'Nguyễn Văn ' + (i % 10);
                        if (b.plateNumber === undefined) b.plateNumber = '29A-' + (1000 + i);
                        if (b.moocNumber === undefined) b.moocNumber = 'M-' + (200 + i);
                        if (b.contNumber === undefined) b.contNumber = 'C-' + (300 + i);
                        if (b.deliverer === undefined) b.deliverer = 'Công ty Giao Vận ' + (i % 5);
                        if (b.delivererRep === undefined) b.delivererRep = 'Ông A';
                        if (b.receiver === undefined) b.receiver = 'Kho Thaco ID';
                        if (b.receiverRep === undefined) b.receiverRep = 'Bà B';
                        
                        return b;
                    });
                } else {
                    MOCK_BATCHES = generateMockData();
                    saveBatches();
                }
            } else {
                MOCK_BATCHES = generateMockData();
                saveBatches();
            }
        } catch (e) {
            console.error("Error loading batches:", e);
            MOCK_BATCHES = generateMockData();
        }
    }

    function generateMockData() {
        var statusList = ['NEW', 'CHECKED', 'PROCESSING', 'COMPLETED'];
        var codes = ['CN-BN', 'JP-BN'];
        return Array.from({ length: 50 }, function(_, i) {
            var status = (i < 10) ? 'CHECKED' : statusList[i % 4];
            var typeIndex = i % PRODUCT_TYPES.length;
            var productType = PRODUCT_TYPES[typeIndex];
            var creator = STAFF_LIST[i % STAFF_LIST.length];
            var createdAt = new Date();
            // Đảm bảo 30 lô đầu tiên là ngày hôm nay để default nhìn đầy đặn (1-30)
            createdAt.setDate(createdAt.getDate() - (i < 30 ? 0 : (i % 30)));
            
            var exportDate = null;
            if (status === 'COMPLETED') {
                var eDate = new Date(createdAt); eDate.setDate(eDate.getDate() + 5);
                exportDate = eDate.toISOString();
            }

            // Mock quantities: 10 lô CHECKED có sẵn số lượng 1200
            var totalQty = (i < 10) ? 1200 : ((status === 'NEW') ? 0 : 500);
            var executedQty = (status === 'COMPLETED') ? totalQty : ((status === 'PROCESSING') ? Math.floor(totalQty * 0.4) : 0);
            
            return {
                id: Date.now() + i,
                code: codes[typeIndex] + '-' + String(1060 - i).padStart(4, '0'),
                name: (i < 10 ? 'Lô kiểm tồn - ' : 'Lô ') + productType.name + ' - Đợt ' + (Math.floor(i / 5) + 1),
                productType: productType.name,
                grades: ['A', 'B'],
                status: status,
                productType: productType.name,
                totalQty: totalQty,
                executedQty: executedQty,
                creator: creator,
                createdAt: createdAt,

                // New fields for demo
                driverName: 'Nguyễn Văn ' + (i % 10),
                plateNumber: '29A-' + (1000 + i),
                moocNumber: 'M-' + (200 + i),
                contNumber: 'C-' + (300 + i),
                deliverer: 'Công ty Giao Vận ' + (i % 5),
                delivererRep: 'Ông A',
                receiver: 'Kho Thaco ID',
                receiverRep: 'Bà B'
            };
        });
    }

    function getDaysInMonth(month, year) { return new Date(year, month + 1, 0).getDate(); }
    function formatDate(date) {
        if (!date) return "";
        var d = new Date(date);
        return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
    }
    function formatTime(date) {
        if (!date) return "";
        var d = new Date(date);
        return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
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
            var search = (batchSearchQuery || "").toLowerCase();
            var matchesSearch = !search || b.code.toLowerCase().indexOf(search) !== -1 || 
                                 b.name.toLowerCase().indexOf(search) !== -1;
            var matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
            
            var matchesDate = true;
            if (selectedRange.start && selectedRange.end) {
                var s = new Date(selectedRange.start).setHours(0,0,0,0);
                var e = new Date(selectedRange.end).setHours(23,59,59,999);
                var c = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                matchesDate = c >= s && c <= e;
            }
            var matchesCreator = selectedCreatorFilterId === 'ALL' || (b.creator && b.creator.id === selectedCreatorFilterId);
            
            return matchesSearch && matchesStatus && matchesCreator && matchesDate;
        });

        var totalItems = filtered.length;
        var totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
        if (mainCurrentPage > totalPages) mainCurrentPage = totalPages;

        var startIdx = (mainCurrentPage - 1) * PAGE_SIZE;
        var pageData = filtered.slice(startIdx, startIdx + PAGE_SIZE);

        if (totalItems === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center" style="padding:40px; color:#64748b;"><i class="fas fa-box-open" style="font-size:24px; margin-bottom:10px; display:block; opacity:0.5;"></i>Không tìm thấy dữ liệu phù hợp</td></tr>';
            renderPaginationBar(0);
            return;
        }

        tbody.innerHTML = pageData.map(function(b, index) {
            var statusObj = STATUS_MAP[b.status] || { label: b.status, class: '' };
            var createdDateFormatted = formatTime(b.createdAt) + ' ' + formatDate(b.createdAt);

            return `
                <tr>
                    <td class="text-center">${startIdx + index + 1}</td>
                    <td style="font-weight: 700; color: #076EB8">${b.code}</td>
                    <td style="font-weight: 500">${b.name}</td>
                    <td style="text-align:center; font-weight: 700;">${b.totalQty || 0}</td>
                    <td class="text-center" style="font-weight: 700; color: #10b981;">${b.executedQty || 0}</td>
                    <td class="text-center">${createdDateFormatted}</td>
                    <td class="text-center">${formatDate(b.exportDate || b.createdAt)}</td>
                    <td class="text-center">
                        <span class="status-badge ${statusObj.class}">${statusObj.label}</span>
                    </td>
                    <td class="text-center">
                        <div style="line-height: 1.4">
                            <strong style="color: #1e293b">${b.creator ? b.creator.name : 'N/A'}</strong><br>
                            <span style="color: #64748b; font-size: 11px;">${b.creator ? b.creator.id : '-'}</span>
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; justify-content: center; gap: 4px; align-items: center;">
                            <button class="btn-icon" title="Xem" onclick="window.viewBatch('${b.id}')"><i class="far fa-eye"></i></button>
                            <button class="btn-icon" title="Cây quy trình" onclick="window.viewTree('${b.id}')"><i class="fas fa-sitemap"></i></button>
                            
                            <button class="btn-icon" title="Kiểm kê" onclick="window.openInventoryCheck('${b.id}')" ${['PROCESSING', 'COMPLETED'].indexOf(b.status) !== -1 ? 'disabled' : ''}>
                                <i class="fas fa-list-check"></i>
                            </button>



                            <button class="btn-icon" title="Sửa" onclick="window.editBatch('${b.id}')"><i class="far fa-edit"></i></button>
                            <button class="btn-icon" title="Xóa" onclick="window.deleteBatch('${b.id}')" ${b.status !== 'NEW' ? 'disabled' : ''} style="${b.status !== 'NEW' ? 'opacity: 0.3' : 'color: #ef4444'}"><i class="far fa-trash-alt"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        renderPaginationBar(filtered.length);
        
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









    // --- MODALS ---
    window.openCreateModal = function() {
        var modal = document.getElementById('modal-add-batch');
        if (!modal) return;
        if (modal.parentNode !== document.body) {
            document.body.appendChild(modal);
        }
        // Reset fields
        document.getElementById('batch-code').value = '';
        document.getElementById('batch-name').value = '';
        
        // Transport fields
        document.getElementById('batch-driver-name').value = '';
        document.getElementById('batch-plate-number').value = '';
        document.getElementById('batch-mooc-number').value = '';
        document.getElementById('batch-cont-number').value = '';
        
        // Handover fields
        document.getElementById('batch-deliverer').value = '';
        document.getElementById('batch-deliverer-rep').value = '';
        document.getElementById('batch-receiver').value = '';
        document.getElementById('batch-receiver-rep').value = '';

        modal.classList.add('open');
    };
    window.closeCreateModal = function() { document.getElementById('modal-add-batch').classList.remove('open'); };

    window.editBatch = function(id) {
        var b = MOCK_BATCHES.find(function(x) { return x.id == id; });
        if (!b) return;
        document.getElementById('edit-batch-id').value = b.id;
        document.getElementById('edit-batch-code').value = b.code;
        document.getElementById('edit-batch-name').value = b.name;
        
        // Transport
        document.getElementById('edit-batch-driver-name').value = b.driverName || '';
        document.getElementById('edit-batch-plate-number').value = b.plateNumber || '';
        document.getElementById('edit-batch-mooc-number').value = b.moocNumber || '';
        document.getElementById('edit-batch-cont-number').value = b.contNumber || '';

        // Handover
        document.getElementById('edit-batch-deliverer').value = b.deliverer || '';
        document.getElementById('edit-batch-deliverer-rep').value = b.delivererRep || '';
        document.getElementById('edit-batch-receiver').value = b.receiver || '';
        document.getElementById('edit-batch-receiver-rep').value = b.receiverRep || '';

        document.getElementById('modal-edit-batch').classList.add('open');
    };

    window.closeEditModal = function() { document.getElementById('modal-edit-batch').classList.remove('open'); };

    window.saveNewBatch = function() {
        var code = document.getElementById('batch-code').value.trim();
        var name = document.getElementById('batch-name').value.trim();
        if (!code || !name) { alert('Vui lòng điền đủ thông tin bắt buộc (mã lô, tên lô)'); return; }
        
        MOCK_BATCHES.unshift({
            id: Date.now(),
            code: code,
            name: name,
            productType: 'Chuối Trung Quốc/ Chinese bananas',
            grades: ['A'],
            status: 'NEW',
            createdAt: new Date(),
            exportDate: null,
            creator: STAFF_LIST[0],
            totalQty: 0,
            executedQty: 0,
            
            // Transport
            driverName: document.getElementById('batch-driver-name').value.trim(),
            plateNumber: document.getElementById('batch-plate-number').value.trim(),
            moocNumber: document.getElementById('batch-mooc-number').value.trim(),
            contNumber: document.getElementById('batch-cont-number').value.trim(),

            // Handover
            deliverer: document.getElementById('batch-deliverer').value.trim(),
            delivererRep: document.getElementById('batch-deliverer-rep').value.trim(),
            receiver: document.getElementById('batch-receiver').value.trim(),
            receiverRep: document.getElementById('batch-receiver-rep').value.trim()
        });
        saveBatches(); window.renderTable(); window.closeCreateModal();
    };

    window.saveEditBatch = function() {
        var id = document.getElementById('edit-batch-id').value;
        var name = document.getElementById('edit-batch-name').value.trim();
        var idx = MOCK_BATCHES.findIndex(function(x) { return x.id == id; });
        if (idx !== -1) {
            MOCK_BATCHES[idx].name = name;

            // Transport
            MOCK_BATCHES[idx].driverName = document.getElementById('edit-batch-driver-name').value.trim();
            MOCK_BATCHES[idx].plateNumber = document.getElementById('edit-batch-plate-number').value.trim();
            MOCK_BATCHES[idx].moocNumber = document.getElementById('edit-batch-mooc-number').value.trim();
            MOCK_BATCHES[idx].contNumber = document.getElementById('edit-batch-cont-number').value.trim();

            // Handover
            MOCK_BATCHES[idx].deliverer = document.getElementById('edit-batch-deliverer').value.trim();
            MOCK_BATCHES[idx].delivererRep = document.getElementById('edit-batch-deliverer-rep').value.trim();
            MOCK_BATCHES[idx].receiver = document.getElementById('edit-batch-receiver').value.trim();
            MOCK_BATCHES[idx].receiverRep = document.getElementById('edit-batch-receiver-rep').value.trim();

            saveBatches(); window.renderTable(); window.closeEditModal();
        }
    };

    window.deleteBatch = function(id) {
        var b = MOCK_BATCHES.find(function(x) { return x.id == id; });
        if (!b) return;
        if (b.status !== 'NEW') {
            alert('Chỉ có thể xóa lô hàng có trạng thái "Mới tạo".');
            return;
        }
        if (confirm('Xóa lô hàng này?')) {
            MOCK_BATCHES = MOCK_BATCHES.filter(function(x) { return x.id != id; });
            saveBatches(); window.renderTable();
        }
    };
    window.viewBatch = function(id) {
        var b = MOCK_BATCHES.find(function(x) { return x.id == id; });
        if (!b) return;

        document.getElementById('view-modal-title').textContent = 'Chi tiết lô hàng — ' + b.code;

        // General Info
        document.getElementById('view-batch-code').textContent = b.code || '-';
        document.getElementById('view-batch-name').textContent = b.name || '-';

        // Transport
        document.getElementById('view-batch-driver-name').textContent = b.driverName || '-';
        document.getElementById('view-batch-plate-number').textContent = b.plateNumber || '-';
        document.getElementById('view-batch-mooc-number').textContent = b.moocNumber || '-';
        document.getElementById('view-batch-cont-number').textContent = b.contNumber || '-';

        // Handover
        document.getElementById('view-batch-deliverer').textContent = b.deliverer || '-';
        document.getElementById('view-batch-deliverer-rep').textContent = b.delivererRep || '-';
        document.getElementById('view-batch-receiver').textContent = b.receiver || '-';
        document.getElementById('view-batch-receiver-rep').textContent = b.receiverRep || '-';

        document.getElementById('modal-view-batch').classList.add('open');
    };
    window.closeViewModal = function() {
        document.getElementById('modal-view-batch').classList.remove('open');
    };

    // =============================================
    // INVENTORY CHECK (KIỂM KÊ) MODULE
    // =============================================
    var inventorySearchQuery = '';
    var inventoryGroupFilter = 'ALL';
    var inventorySelectedIds = {};
    var currentInventoryBatchId = null;

    window.openInventoryCheck = function(batchId) {
        var b = MOCK_BATCHES.find(function(x) { return x.id == batchId; });
        if (!b) return;
        currentInventoryBatchId = batchId;
        inventorySearchQuery = '';
        inventoryGroupFilter = 'ALL';
        inventorySelectedIds = {};

        var modal = document.getElementById('modal-inventory-check');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-inventory-check';
            modal.className = 'modal-overlay';
            modal.setAttribute('data-module-asset', 'true');
            modal.innerHTML = buildInventoryModalHTML();
            document.body.appendChild(modal);
            setupInventoryEventListeners();
        }

        // Update modal title
        var titleEl = document.getElementById('inventory-modal-title');
        if (titleEl) titleEl.textContent = 'Kiểm kê lô hàng — ' + b.code;

        var batchInfoEl = document.getElementById('inventory-batch-info');
        if (batchInfoEl) {
            var statusObj = STATUS_MAP[b.status] || { label: b.status, class: '' };
            batchInfoEl.innerHTML =
                '<div class="lifecycle-info-item"><i class="fa-solid fa-code-fork fa-rotate-180" style="color: #076eb8;"></i> <span>Mã lô: <strong>' + b.code + '</strong></span></div>' +
                '<div class="lifecycle-info-item"><i class="fa-solid fa-cube" style="color:#64748b"></i> <span>' + b.name + '</span></div>' +
                '<div class="lifecycle-info-item"><span class="status-badge ' + statusObj.class + '">' + statusObj.label + '</span></div>';
        }

        // Reset search and filters
        var searchInput = document.getElementById('inventory-search-input');
        if (searchInput) searchInput.value = '';
        var groupInput = document.getElementById('inventory-group-input');
        if (groupInput) groupInput.value = '';
        var groupSelectedLabel = document.getElementById('inventory-group-selected-label');
        if (groupSelectedLabel) groupSelectedLabel.textContent = 'Tất cả nhóm sản phẩm';

        renderInventoryTable();
        modal.classList.add('open');
    };

    window.closeInventoryCheck = function() {
        var modal = document.getElementById('modal-inventory-check');
        if (modal) modal.classList.remove('open');
    };

    function buildInventoryModalHTML() {
        return '<div class="modal-box inventory-modal-box">' +
            '<div class="modal-header">' +
                '<div style="display:flex;align-items:center;gap:15px;flex:1">' +
                    '<i class="fa-solid fa-list-check" style="color:#076EB8;font-size:20px"></i>' +
                    '<div class="modal-title" id="inventory-modal-title">Kiểm kê sản phẩm</div>' +
                    '<div class="lifecycle-header-info" id="inventory-batch-info"></div>' +
                '</div>' +
                '<div class="close-modal" onclick="window.closeInventoryCheck()">' +
                    '<i class="fas fa-times"></i>' +
                '</div>' +
            '</div>' +
            '<div class="modal-body" style="padding:20px 24px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:0;">' +
                '<!-- Search & Filter Bar -->' +
                '<div class="inventory-toolbar">' +
                    '<div class="inventory-search-box">' +
                        '<i class="fas fa-search"></i>' +
                        '<input type="text" id="inventory-search-input" placeholder="Tìm theo mã sản phẩm, tên sản phẩm..." autocomplete="off">' +
                    '</div>' +
                    '<div class="inventory-group-filter" id="inventory-group-dropdown">' +
                        '<div class="inventory-group-searchable">' +
                            '<i class="fas fa-layer-group inventory-group-icon"></i>' +
                            '<input type="text" id="inventory-group-search-input" class="inventory-group-search" placeholder="Tất cả nhóm sản phẩm" autocomplete="off" onfocus="window.openInventoryGroupDropdown()" oninput="window.filterInventoryGroupOptions(this.value)">' +
                            '<i class="fas fa-chevron-down inventory-group-arrow"></i>' +
                        '</div>' +
                        '<div class="inventory-group-options" id="inventory-group-options"></div>' +
                    '</div>' +
                '</div>' +
                '<!-- Inventory Table (Split Head/Body Architecture) -->' +
                '<div class="inventory-table-container">' +
                    '<div class="inventory-table-head" id="inventory-table-head">' +
                        '<table class="inventory-table">' +
                            '<colgroup>' +
                                '<col style="width:45px">' +
                                '<col style="width:55px">' +
                                '<col style="width:200px">' +
                                '<col style="width:auto">' +
                                '<col style="width:170px">' +
                            '</colgroup>' +
                            '<thead>' +
                                '<tr>' +
                                    '<th class="text-center"><input type="checkbox" id="inventory-select-all" onchange="window.toggleInventorySelectAll(this)"></th>' +
                                    '<th class="text-center">STT</th>' +
                                    '<th>Mã sản phẩm</th>' +
                                    '<th>Tên sản phẩm</th>' +
                                    '<th class="text-center">Số lượng</th>' +
                                '</tr>' +
                            '</thead>' +
                        '</table>' +
                    '</div>' +
                    '<div class="inventory-table-body" id="inventory-table-body-wrapper">' +
                        '<table class="inventory-table">' +
                            '<colgroup>' +
                                '<col style="width:45px">' +
                                '<col style="width:55px">' +
                                '<col style="width:200px">' +
                                '<col style="width:auto">' +
                                '<col style="width:170px">' +
                            '</colgroup>' +
                            '<tbody id="inventory-table-body"></tbody>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="modal-footer" style="padding:12px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;">' +
                '<div class="inventory-footer-info" id="inventory-footer-info">Đã chọn: <strong>0</strong> sản phẩm</div>' +
                '<div style="display:flex;gap:12px">' +
                    '<button class="btn-secondary" onclick="window.closeInventoryCheck()">Đóng</button>' +
                    '<button class="btn-primary" onclick="window.saveInventoryCheck()">Lưu</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    function setupInventoryEventListeners() {
        // Search input
        var searchInput = document.getElementById('inventory-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                inventorySearchQuery = this.value;
                renderInventoryTable();
            });
        }

        // Sync horizontal scroll between head and body
        var bodyWrapper = document.getElementById('inventory-table-body-wrapper');
        var headWrapper = document.getElementById('inventory-table-head');
        if (bodyWrapper && headWrapper) {
            bodyWrapper.addEventListener('scroll', function() {
                headWrapper.scrollLeft = bodyWrapper.scrollLeft;
            });
        }
    }

    function getFilteredInventoryProducts() {
        return INVENTORY_PRODUCTS.filter(function(p) {
            var matchesSearch = !inventorySearchQuery ||
                p.code.toLowerCase().indexOf(inventorySearchQuery.toLowerCase()) !== -1 ||
                p.name.toLowerCase().indexOf(inventorySearchQuery.toLowerCase()) !== -1;
            var matchesGroup = inventoryGroupFilter === 'ALL' || p.group === inventoryGroupFilter;
            return matchesSearch && matchesGroup;
        });
    }

    function renderInventoryTable() {
        var tbody = document.getElementById('inventory-table-body');
        if (!tbody) return;

        var filtered = getFilteredInventoryProducts();

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding:40px;color:#94a3b8;font-size:14px;"><i class="fa-regular fa-folder-open" style="font-size:32px;display:block;margin-bottom:12px;"></i>Không tìm thấy sản phẩm phù hợp</td></tr>';
            updateInventoryFooter();
            return;
        }

        tbody.innerHTML = filtered.map(function(p, index) {
            var isChecked = !!inventorySelectedIds[p.id];
            var qtyVal = (inventorySelectedIds[p.id] && inventorySelectedIds[p.id].perContainer) || '';
            var groupName = (PRODUCT_GROUPS.find(function(g) { return g.id === p.group; }) || {}).name || '';

            return '<tr class="' + (isChecked ? 'row-selected' : '') + '">' +
                '<td class="text-center"><input type="checkbox" class="inventory-row-check" data-product-id="' + p.id + '" ' + (isChecked ? 'checked' : '') + ' onchange="window.toggleInventoryRow(this)"></td>' +
                '<td class="text-center" style="color:#64748b;font-weight:600">' + (index + 1) + '</td>' +
                '<td style="font-weight:700;color:#076EB8">' + p.code + '</td>' +
                '<td><div style="line-height:1.4"><strong style="color:#1e293b">' + p.name + '</strong><br><span style="color:#94a3b8;font-size:11px">' + groupName + '</span></div></td>' +
                '<td class="text-center"><input type="number" class="inventory-number-input" min="1" step="1" placeholder="0" value="' + qtyVal + '" data-product-id="' + p.id + '" data-field="perContainer" oninput="window.onInventoryInputChange(this)" onkeydown="window.preventNonInteger(event)"></td>' +
            '</tr>';
        }).join('');

        updateInventoryFooter();
        updateSelectAllCheckbox();
    }

    function updateInventoryFooter() {
        var footerInfo = document.getElementById('inventory-footer-info');
        if (!footerInfo) return;
        var count = Object.keys(inventorySelectedIds).length;
        footerInfo.innerHTML = 'Đã chọn: <strong>' + count + '</strong> sản phẩm';
    }

    function updateSelectAllCheckbox() {
        var selectAll = document.getElementById('inventory-select-all');
        if (!selectAll) return;
        var filtered = getFilteredInventoryProducts();
        var allChecked = filtered.length > 0 && filtered.every(function(p) { return !!inventorySelectedIds[p.id]; });
        var someChecked = filtered.some(function(p) { return !!inventorySelectedIds[p.id]; });
        selectAll.checked = allChecked;
        selectAll.indeterminate = !allChecked && someChecked;
    }

    window.toggleInventorySelectAll = function(checkbox) {
        var filtered = getFilteredInventoryProducts();
        if (checkbox.checked) {
            filtered.forEach(function(p) {
                if (!inventorySelectedIds[p.id]) {
                    inventorySelectedIds[p.id] = { containerCount: '', perContainer: '' };
                }
            });
        } else {
            filtered.forEach(function(p) {
                delete inventorySelectedIds[p.id];
            });
        }
        renderInventoryTable();
    };

    window.toggleInventoryRow = function(checkbox) {
        var productId = checkbox.getAttribute('data-product-id');
        if (checkbox.checked) {
            inventorySelectedIds[productId] = inventorySelectedIds[productId] || { containerCount: '', perContainer: '' };
        } else {
            delete inventorySelectedIds[productId];
        }
        renderInventoryTable();
    };

    window.onInventoryInputChange = function(input) {
        var productId = input.getAttribute('data-product-id');
        var field = input.getAttribute('data-field');
        // Ensure positive integer only
        var val = input.value.replace(/[^0-9]/g, '');
        if (val !== '' && parseInt(val) <= 0) val = '';
        input.value = val;

        if (!inventorySelectedIds[productId]) {
            inventorySelectedIds[productId] = { containerCount: '', perContainer: '' };
            // Auto-check the row when user types
            var checkbox = document.querySelector('.inventory-row-check[data-product-id="' + productId + '"]');
            if (checkbox) checkbox.checked = true;
            // Add selected styling
            var row = input.closest('tr');
            if (row) row.classList.add('row-selected');
        }
        inventorySelectedIds[productId][field] = val;
        updateInventoryFooter();
        updateSelectAllCheckbox();
    };

    window.preventNonInteger = function(e) {
        // Prevent ., -, e, +
        if (['.', '-', 'e', 'E', '+'].indexOf(e.key) !== -1) {
            e.preventDefault();
        }
    };

    // Product Group Searchable Select
    window.openInventoryGroupDropdown = function() {
        var dropdown = document.getElementById('inventory-group-dropdown');
        if (!dropdown) return;
        dropdown.classList.add('open');
        renderInventoryGroupOptions('');
    };

    window.filterInventoryGroupOptions = function(searchTerm) {
        renderInventoryGroupOptions(searchTerm || '');
    };

    function renderInventoryGroupOptions(searchTerm) {
        var optionsEl = document.getElementById('inventory-group-options');
        if (!optionsEl) return;
        var term = (searchTerm || '').toLowerCase().trim();

        var html = '';
        // "All" option
        if (!term || 'tất cả nhóm sp'.indexOf(term) !== -1) {
            html += '<div class="inventory-group-option ' + (inventoryGroupFilter === 'ALL' ? 'active' : '') + '" onclick="window.selectInventoryGroup(\'ALL\', \'Tất cả nhóm sản phẩm\')">Tất cả nhóm sản phẩm</div>';
        }
        PRODUCT_GROUPS.forEach(function(g) {
            if (!term || g.name.toLowerCase().indexOf(term) !== -1 || g.id.toLowerCase().indexOf(term) !== -1) {
                html += '<div class="inventory-group-option ' + (inventoryGroupFilter === g.id ? 'active' : '') + '" onclick="window.selectInventoryGroup(\'' + g.id + '\', \'' + g.name + '\')">' + g.name + '</div>';
            }
        });
        if (!html) {
            html = '<div class="inventory-group-option" style="color:#94a3b8;cursor:default;text-align:center;">Không tìm thấy nhóm sản phẩm</div>';
        }
        optionsEl.innerHTML = html;
    }

    window.selectInventoryGroup = function(id, name) {
        inventoryGroupFilter = id;
        var input = document.getElementById('inventory-group-search-input');
        if (input) input.value = (id === 'ALL' ? '' : name);
        var dropdown = document.getElementById('inventory-group-dropdown');
        if (dropdown) dropdown.classList.remove('open');
        renderInventoryTable();
    };

    window.saveInventoryCheck = function() {
        var selectedCount = Object.keys(inventorySelectedIds).length;
        if (selectedCount === 0) {
            showToast('Vui lòng chọn ít nhất 1 sản phẩm để kiểm kê.', 'warning');
            return;
        }
        
        var totalQty = 0;
        var valid = true;
        Object.keys(inventorySelectedIds).forEach(function(pid) {
            var data = inventorySelectedIds[pid];
            if (!data.perContainer) {
                valid = false;
            } else {
                totalQty += parseInt(data.perContainer);
            }
        });

        if (!valid) {
            showToast('Vui lòng điền đầy đủ số lượng cho các sản phẩm đã chọn.', 'warning');
            return;
        }

        var bIdx = MOCK_BATCHES.findIndex(function(x) { return x.id == currentInventoryBatchId; });
        if (bIdx !== -1) {
            MOCK_BATCHES[bIdx].totalQty = totalQty;
            MOCK_BATCHES[bIdx].status = 'CHECKED';
            saveBatches();
            window.renderTable();
        }

        showToast('Đã kiểm kê thành công. Tổng số lượng: ' + totalQty, 'success');
        window.closeInventoryCheck();
    };




    window.viewTree = function(id) {
        var b = MOCK_BATCHES.find(function(x) { return x.id == id; });
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
                            '<div style="display: flex; align-items: center; gap: 10px;">' +
                                '<i class="fa-solid fa-shield-heart"></i> ' + s.label +
                            '</div>' +
                            badgeHtml +
                        '</div>' +
                        detailsHtml +
                        (s.date ? '<div class="sd-detail-date"><i class="fa-regular fa-clock"></i> Cập nhật: ' + s.date + '</div>' : '') +
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
            '<div class="lifecycle-info-item"><span class="status-badge ' + statusObj.class + '">' + statusObj.label + '</span></div>';
        
        var tc = document.getElementById('lifecycle-timeline');
        if (tc) tc.innerHTML = diagramHtml;
        modal.classList.add('open');
    };

    // --- INITIALIZATION ---
        var headerWrapper = document.getElementById('batch-header-wrapper');
        var bodyWrapper = document.getElementById('batch-body-wrapper');
        if (headerWrapper && bodyWrapper) {
            bodyWrapper.onscroll = function() {
                headerWrapper.scrollLeft = bodyWrapper.scrollLeft;
            };
        }
        
        document.addEventListener('click', function(e) {
            // Status & Type Dropdowns
            if (!e.target.closest('.status-custom-dropdown')) { 
                var s = document.getElementById('status-dropdown'); if (s) s.classList.remove('open'); 
                var t = document.getElementById('type-dropdown'); if (t) t.classList.remove('open'); 
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
            // Inventory Group Dropdown
            if (!e.target.closest('.inventory-group-filter')) {
                var ig = document.getElementById('inventory-group-dropdown');
                if (ig) ig.classList.remove('open');
            }
        });

    // --- ACCORDION ---
    window.toggleAccordion = function(id) {
        var el = document.getElementById(id);
        if (el) el.classList.toggle('open');
    };

    // --- MODAL INLINE SINGLE DATE PICKER ---
    // activeModalPicker tracks { inputId, containerId }
    var activeModalPicker = null;

    window.toggleModalDatePicker = function(inputId, containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;
        var isOpen = container.style.display === 'block';
        // Close any other open picker first
        document.querySelectorAll('.modal-inline-calendar').forEach(function(c) { c.style.display = 'none'; });
        if (!isOpen) {
            activeModalPicker = { inputId: inputId, containerId: containerId };
            renderModalCalendar(inputId, containerId);
            container.style.display = 'block';
        }
    };

    function parseDisplayDate(str) {
        if (!str) return null;
        var parts = str.split('/');
        if (parts.length !== 3) return null;
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }

    function renderModalCalendar(inputId, containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;
        var inputEl = document.getElementById(inputId);
        var currentVal = inputEl ? inputEl.value : '';
        var selected = parseDisplayDate(currentVal);
        var viewDate = selected ? new Date(selected) : new Date();
        var month = viewDate.getMonth();
        var year = viewDate.getFullYear();

        var months = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
        var curYear = new Date().getFullYear();
        var monthOptions = months.map(function(m, i) {
            return '<option value="' + i + '"' + (i === month ? ' selected' : '') + '>' + m + '</option>';
        }).join('');
        var yearOptions = '';
        for (var y = curYear - 5; y <= curYear + 5; y++) {
            yearOptions += '<option value="' + y + '"' + (y === year ? ' selected' : '') + '>' + y + '</option>';
        }

        // Build days
        var firstDay = new Date(year, month, 1).getDay(); // 0=Sun
        // Convert to Mon-start: Mon=0 ... Sun=6
        var startOffset = (firstDay === 0) ? 6 : firstDay - 1;
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var today = new Date();
        var dayHeaders = ['T2','T3','T4','T5','T6','T7','CN'].map(function(d) {
            return '<div class="day-header">' + d + '</div>';
        }).join('');

        var dayCells = '';
        for (var i = 0; i < startOffset; i++) {
            dayCells += '<div class="cal-day empty"></div>';
        }
        for (var d = 1; d <= daysInMonth; d++) {
            var isSelected = selected && selected.getDate() === d && selected.getMonth() === month && selected.getFullYear() === year;
            var isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
            var cls = 'cal-day' + (isSelected ? ' selected' : '') + (isToday && !isSelected ? ' today-marker' : '') + (isToday && isSelected ? ' selected today-marker' : '');
            dayCells += '<div class="' + cls + '" data-day="' + d + '">' + d + '</div>';
        }

        container.innerHTML =
            '<div class="modal-cal-nav">' +
                '<select id="mc-month-' + containerId + '">' + monthOptions + '</select>' +
                '<select id="mc-year-' + containerId + '">' + yearOptions + '</select>' +
            '</div>' +
            '<div class="modal-cal-grid">' + dayHeaders + dayCells + '</div>' +
            '<div class="modal-cal-footer">' +
                '<button type="button" class="modal-cal-clear" onclick="window.clearModalDate(\'' + inputId + '\',\'' + containerId + '\')">Xóa</button>' +
            '</div>';

        // Month/year select events
        var monthSel = document.getElementById('mc-month-' + containerId);
        var yearSel = document.getElementById('mc-year-' + containerId);
        function rerender() {
            viewDate.setMonth(parseInt(monthSel.value));
            viewDate.setFullYear(parseInt(yearSel.value));
            renderModalCalendar(inputId, containerId);
        }
        if (monthSel) monthSel.onchange = rerender;
        if (yearSel) yearSel.onchange = rerender;

        // Day click events
        container.querySelectorAll('.cal-day[data-day]').forEach(function(cell) {
            cell.onclick = function() {
                var day = parseInt(this.getAttribute('data-day'));
                var newDate = new Date(parseInt(yearSel.value), parseInt(monthSel.value), day);
                var inputField = document.getElementById(inputId);
                if (inputField) {
                    inputField.value = String(day).padStart(2,'0') + '/' + String(newDate.getMonth()+1).padStart(2,'0') + '/' + newDate.getFullYear();
                }
                container.style.display = 'none';
                activeModalPicker = null;
            };
        });
    }

    window.clearModalDate = function(inputId, containerId) {
        var inputField = document.getElementById(inputId);
        if (inputField) inputField.value = '';
        var container = document.getElementById(containerId);
        if (container) container.style.display = 'none';
        activeModalPicker = null;
    };

    // Close modal date pickers when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.modal-date-picker-wrapper')) {
            document.querySelectorAll('.modal-inline-calendar').forEach(function(c) { c.style.display = 'none'; });
            activeModalPicker = null;
        }
    }, true);
    function initCreatorFilterCombobox() {
        var input = document.getElementById('creator-filter-input');
        var list = document.getElementById('creator-filter-list');
        var wrapper = document.getElementById('creator-filter-combobox');
        if (!input || !list || !wrapper) return;

        function renderOptions(term) {
            var filtered = STAFF_LIST.filter(function(s) {
                return !term || s.name.toLowerCase().indexOf(term.toLowerCase()) !== -1;
            });
            
            var html = '<div class="combobox-option ' + (selectedCreatorFilterId === 'ALL' ? 'active' : '') + '" data-id="ALL">Tất cả người tạo</div>';
            filtered.forEach(function(s) {
                html += '<div class="combobox-option ' + (selectedCreatorFilterId === s.id ? 'active' : '') + '" data-id="' + s.id + '">' + s.name + '</div>';
            });
            list.innerHTML = html;
        }

        input.addEventListener('focus', function() {
            renderOptions(this.value);
            list.classList.add('show');
            wrapper.classList.add('active');
        });

        input.addEventListener('input', function() {
            renderOptions(this.value);
            list.classList.add('show');
        });

        list.addEventListener('click', function(e) {
            var opt = e.target.closest('.combobox-option');
            if (!opt) return;
            selectedCreatorFilterId = opt.getAttribute('data-id');
            input.value = (selectedCreatorFilterId === 'ALL') ? '' : opt.textContent;
            list.classList.remove('show');
            wrapper.classList.remove('active');
            window.renderTable();
        });
    }

    function setupExtraDatePickerListeners() {
        // Date picker sidebar range selection
        document.querySelectorAll('.analytics-date-picker .sidebar-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var range = this.getAttribute('data-range');
                document.querySelectorAll('.analytics-date-picker .sidebar-item').forEach(function(i){ i.classList.remove('active'); });
                this.classList.add('active');

                var start = new Date(today);
                var end = new Date(today);
                
                switch(range) {
                    case 'all': start = null; end = null; break;
                    case 'today': break;
                    case 'last3': start.setDate(today.getDate() - 2); break; // 3 days including today
                    case 'thisweek': 
                        var day = today.getDay(); // 0 is Sun
                        var diff = today.getDate() - day + (day === 0 ? -6 : 1); 
                        start = new Date(today.setDate(diff));
                        end = new Date();
                        break;
                    case 'last7': start.setDate(today.getDate() - 6); break;
                    case 'last30': start.setDate(today.getDate() - 29); break;
                    case 'last3mo': start.setMonth(today.getMonth() - 3); break;
                    case 'last6mo': start.setMonth(today.getMonth() - 6); break;
                    case 'last1yr': start.setFullYear(today.getFullYear() - 1); break;
                }
                
                if (start === null) {
                    tempRange.start = null;
                    tempRange.end = null;
                } else {
                    tempRange.start = new Date(start);
                    tempRange.end = new Date(end);
                    // Sync calendars to the new specific range
                    currentLeftDate = new Date(tempRange.start);
                    currentRightDate = new Date(tempRange.start);
                    currentRightDate.setMonth(currentRightDate.getMonth() + 1);
                }
                
                updateCalendarUI();
            });
        });

        // Date Picker Actions
        var applyBtn = document.getElementById('applyPicker');
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                selectedRange.start = tempRange.start ? new Date(tempRange.start) : null;
                selectedRange.end = tempRange.end ? new Date(tempRange.end) : null;
                
                var display = document.getElementById('dateRangeDisplay');
                if (display) {
                    if (!selectedRange.start) {
                        display.textContent = "Tất cả thời gian";
                    } else {
                        display.textContent = formatDate(selectedRange.start) + " - " + formatDate(selectedRange.end);
                    }
                }
                
                var picker = document.getElementById('analyticsPicker');
                if (picker) picker.classList.remove('active');
                window.renderTable();
            });
        }

        var cancelBtn = document.getElementById('cancelPicker');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                var picker = document.getElementById('analyticsPicker');
                if (picker) picker.classList.remove('active');
            });
        }

        var clearBtn = document.getElementById('clearPicker');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                tempRange.start = null;
                tempRange.end = null;
                updateCalendarUI();
            });
        }
    }

    // Function to update the visual calendars inside picker (placeholder - assumes implementation exists or adding it)
    function updateCalendarUI() {
        var tempDisplay = document.getElementById('tempRangeDisplay');
        if (tempDisplay) {
            if (!tempRange.start) {
                tempDisplay.textContent = "Tất cả thời gian";
            } else {
                tempDisplay.textContent = formatDate(tempRange.start) + " - " + formatDate(tempRange.end);
            }
        }
        // These draw functions should exist in your codebase to redraw the grids
        if (typeof renderCalendarPanel === 'function') {
            renderCalendarPanel('leftCalendar', currentLeftDate);
            renderCalendarPanel('rightCalendar', currentRightDate);
        }
    }

    window.toggleDateRangePicker = function(e) {
        var picker = document.getElementById('analyticsPicker');
        if (!picker) return;
        picker.classList.toggle('active');
        if (picker.classList.contains('active')) {
            updateCalendarUI();
        }
        if (e) e.stopPropagation();
    };

    // Need to define renderCalendarPanel as well if it was lost
    function renderCalendarPanel(containerId, viewDate) {
        var container = document.getElementById(containerId);
        if (!container) return;
        var grid = container.querySelector('.days-container');
        if (!grid) return;

        var month = viewDate.getMonth();
        var year = viewDate.getFullYear();
        
        // Update month/year labels
        var monthLabel = containerId === 'leftCalendar' ? 'leftMonthSelected' : 'rightMonthSelected';
        var yearLabel = containerId === 'leftCalendar' ? 'leftYearSelected' : 'rightYearSelected';
        var months = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
        document.getElementById(monthLabel).textContent = months[month];
        document.getElementById(yearLabel).textContent = year;

        var firstDay = new Date(year, month, 1).getDay();
        var startOffset = (firstDay === 0) ? 6 : firstDay - 1;
        var daysInMonth = new Date(year, month + 1, 0).getDate();

        var html = '';
        for (var i = 0; i < startOffset; i++) html += '<div class="day empty"></div>';
        for (var d = 1; d <= daysInMonth; d++) {
            var cur = new Date(year, month, d);
            var isSelected = false;
            var inRange = false;
            var isStart = false;
            var isEnd = false;

            if (tempRange.start && tempRange.end) {
                var s = new Date(tempRange.start).setHours(0,0,0,0);
                var e = new Date(tempRange.end).setHours(0,0,0,0);
                var c = cur.getTime();
                if (c === s) isStart = true;
                if (c === e) isEnd = true;
                if (c >= s && c <= e) inRange = true;
            }

            var cls = 'day';
            if (isStart) cls += ' start-date';
            if (isEnd) cls += ' end-date';
            if (inRange) cls += ' in-range';
            
            html += '<div class="' + cls + '" onclick="window.onDateClick(' + cur.getTime() + ')">' + d + '</div>';
        }
        grid.innerHTML = html;
    }

    window.onDateClick = function(timestamp) {
        var clicked = new Date(timestamp);
        if (!tempRange.start || (tempRange.start && tempRange.end)) {
            tempRange.start = clicked;
            tempRange.end = clicked;
        } else if (clicked < tempRange.start) {
            tempRange.end = tempRange.start;
            tempRange.start = clicked;
        } else {
            tempRange.end = clicked;
        }
        updateCalendarUI();
    };


    function init() {
        loadBatches();
        initCreatorFilterCombobox();
        setupExtraDatePickerListeners();
        
        // Initialize Date Range Display - default to today
        var triggerDisplay = document.getElementById("dateRangeDisplay");
        if (triggerDisplay && selectedRange.start && selectedRange.end) {
            triggerDisplay.textContent = formatDate(selectedRange.start) + " - " + formatDate(selectedRange.end);
        }
        
        // Mark "Hôm nay" as active in picker sidebar
        var todayItem = document.querySelector('.analytics-date-picker .sidebar-item[data-range="today"]');
        if (todayItem) {
            document.querySelectorAll('.analytics-date-picker .sidebar-item').forEach(function(i){ i.classList.remove('active'); });
            todayItem.classList.add('active');
        }

        updateCalendarUI();
        window.renderTable();
    }

    init();
})();