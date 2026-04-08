// Role Enum: 1=Admin, 2=Manager, 3=Operator, 4=User
var ROLE_MAP = { 1: 'Admin', 2: 'Manager', 3: 'Operator', 4: 'User' };
var ROLE_REVERSE = { 'Admin': 1, 'Manager': 2, 'Operator': 3, 'User': 4 };
var ITEMS_PER_PAGE = 20;

// Generate mock data (35 accounts)
var accounts = [];
var firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô'];
var middleNames = ['Văn', 'Thị', 'Hữu', 'Minh', 'Quang', 'Đức', 'Thanh', 'Anh', 'Hoàng', 'Tuấn'];
var lastNames = ['An', 'Bình', 'Cường', 'Dũng', 'Em', 'Phong', 'Giang', 'Hải', 'Khoa', 'Long', 'Minh', 'Nam', 'Phú', 'Quân', 'Sơn', 'Tâm', 'Uyên', 'Việt', 'Xuân', 'Yến'];
var roles = ['Admin', 'Manager', 'Operator', 'User'];
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

for (let i = 1; i <= 35; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const mn = middleNames[Math.floor(Math.random() * middleNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullname = `${fn} ${mn} ${ln}`;
    const role = i <= 2 ? 'Admin' : i <= 5 ? 'Manager' : i <= 12 ? 'Operator' : 'User';
    // Randomly assign warehouses based on role
    let whs = [];
    if (role === 'Admin') {
        whs = ['ALL'];
    } else if (role === 'Manager') {
        // Random 1-3 warehouses
        const count = Math.floor(Math.random() * 3) + 1;
        const shuffled = [...availableWarehouses].sort(() => 0.5 - Math.random());
        whs = shuffled.slice(0, count).map(w => w.code);
    } else {
        // Random 1 warehouse (Mandatory)
        whs = [availableWarehouses[Math.floor(Math.random() * availableWarehouses.length)].code];
    }

    // Base role and warehouse
    let permissions = [];
    if (role === 'Admin') {
        permissions.push({ role: 'Admin', warehouses: ['ALL'] });
    } else {
        // First role
        permissions.push({ role: role, warehouses: whs });
        
        // 40% chance for 2nd role (if not Admin)
        if (i > 2 && Math.random() < 0.4) {
            const role2 = role === 'Manager' ? 'Operator' : 'Manager';
            // Random warehouses for role 2 (Mandatory 1-2)
            let whs2 = [];
            const count2 = Math.floor(Math.random() * 2) + 1;
            const shuffled2 = [...availableWarehouses].sort(() => 0.5 - Math.random());
            whs2 = shuffled2.slice(0, count2).map(w => w.code);
            permissions.push({ role: role2, warehouses: whs2 });

            // 10% chance for 3rd role (User)
            if (Math.random() < 0.1) {
                // Must also have at least one warehouse
                const wh3 = [availableWarehouses[Math.floor(Math.random() * availableWarehouses.length)].code];
                permissions.push({ role: 'User', warehouses: wh3 });
            }
        }
    }

    accounts.push({
        id: i,
        accountCode: `user${String(i).padStart(3, '0')}`,
        fullname: fullname,
        email: `${ln.toLowerCase()}${i}@yopmail.com`,
        permissions: permissions,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=random`,
        active: Math.random() > 0.2
    });
}
// Manual overrides removed as loop handles variety

var currentResetId = null;
var pendingImportData = [];
var currentPage = 1;
var filteredData = [...accounts];
var uploadedAvatarData = null;
var openDropdownId = null;
var pendingToggleId = null;
var confirmModal = null;
var pendingDeleteAccountId = null;

// Initialization - always init when script runs (module may be reloaded)
function initAccountModule() {
    const table = document.getElementById('account-data-table');
    if (!table) return;

    filteredData = [...accounts];
    currentPage = 1;
    renderAccounts();
    
    // Explicitly render warehouse filter options
    updateWarehouseFilters();

    // Synchronization scroll
    const scrollHead = document.querySelector('.table-scroll-head');
    const scrollBody = document.querySelector('.table-scroll-body');

    if (scrollHead && scrollBody) {
        scrollBody.addEventListener('scroll', () => {
            scrollHead.scrollLeft = scrollBody.scrollLeft;
        });
    }

    // Global Exposure
    window.closeDeleteConfirm = closeDeleteConfirm;
    window.confirmDeleteAccount = confirmDeleteAccount;
    window.selectStatusFilter = selectStatusFilter;
    window.selectWarehouseFilter = selectWarehouseFilter;
    window.updateWarehouseFilters = updateWarehouseFilters;
    window.filterWarehouseOptions = filterWarehouseOptions;

    // Attach drag & drop listeners to avatar zone
    initAvatarDragAndDrop();
}

function updateWarehouseFilters() {
    const optionsList = document.getElementById('warehouse-options-list');
    if (!optionsList) return;

    let whHtml = `<div class="dropdown-option active" data-value="all" onclick="selectWarehouseFilter('all', 'Tất cả kho')">Tất cả kho</div>`;
    
    if (typeof availableWarehouses !== 'undefined' && availableWarehouses.length > 0) {
        availableWarehouses.forEach(wh => {
            const escapedName = wh.name.replace(/'/g, "\\'");
            const escapedCode = wh.code.replace(/'/g, "\\'");
            whHtml += `<div class="dropdown-option" data-value="${escapedCode}" onclick="selectWarehouseFilter('${escapedCode}', '${wh.name}')">${wh.name}</div>`;
        });
    }
    
    optionsList.innerHTML = whHtml;

    // Reset search input
    const searchInput = document.querySelector('#warehouse-filter-dropdown .dropdown-search-input');
    if (searchInput) searchInput.value = '';
    
    const noResults = document.getElementById('warehouse-no-results');
    if (noResults) noResults.style.display = 'none';
}
const VIET_MAP = {
  à:'a',á:'a',ạ:'a',ả:'a',ã:'a',â:'a',ầ:'a',ấ:'a',ậ:'a',ẩ:'a',ẫ:'a',
  ă:'a',ằ:'a',ắ:'a',ặ:'a',ẳ:'a',ẵ:'a',
  è:'e',é:'e',ẹ:'e',ẻ:'e',ẽ:'e',ê:'e',ề:'e',ế:'e',ệ:'e',ể:'e',ễ:'e',
  ì:'i',í:'i',ị:'i',ỉ:'i',ĩ:'i',
  ò:'o',ó:'o',ọ:'o',ỏ:'o',õ:'o',ô:'o',ồ:'o',ố:'o',ộ:'o',ổ:'o',ỗ:'o',
  ơ:'o',ờ:'o',ớ:'o',ợ:'o',ở:'o',ỡ:'o',
  ù:'u',ú:'u',ụ:'u',ủ:'u',ũ:'u',ư:'u',ừ:'u',ứ:'u',ự:'u',ử:'u',ữ:'u',
  ỳ:'y',ý:'y',ỵ:'y',ỷ:'y',ỹ:'y',
  đ:'d',
  À:'A',Á:'A',Ạ:'A',Ả:'A',Ã:'A',Â:'A',Ầ:'A',Ấ:'A',Ậ:'A',Ẩ:'A',Ẫ:'A',
  Ă:'A',Ằ:'A',Ắ:'A',Ặ:'A',Ẳ:'A',Ẵ:'A',
  È:'E',É:'E',Ẹ:'E',Ẻ:'E',Ẽ:'E',Ê:'E',Ề:'E',Ế:'E',Ệ:'E',Ể:'E',Ễ:'E',
  Ì:'I',Í:'I',Ị:'I',Ỉ:'I',Ĩ:'I',
  Ò:'O',Ó:'O',Ọ:'O',Ỏ:'O',Õ:'O',Ô:'O',Ồ:'O',Ố:'O',Ộ:'O',Ổ:'O',Ỗ:'O',
  Ơ:'O',Ờ:'O',Ớ:'O',Ợ:'O',Ở:'O',Ỡ:'O',
  Ù:'U',Ú:'U',Ụ:'U',Ủ:'U',Ũ:'U',Ư:'U',Ừ:'U',Ứ:'U',Ự:'U',Ử:'U',Ữ:'U',
  Ỳ:'Y',Ý:'Y',Ỵ:'Y',Ỷ:'Y',Ỹ:'Y',
  Đ:'D'
};

// Map được khởi tạo 1 lần duy nhất, dùng lại mãi mãi
const VIET_REGEX = new RegExp(`[${Object.keys(VIET_MAP).join('')}]`, 'g');

function removeVietnameseTones(str) {
  if (!str) return '';
  return str.replace(VIET_REGEX, ch => VIET_MAP[ch]);
}

function filterWarehouseOptions(event) {
    const rawQuery = event.target.value.toLowerCase().trim();
    const query = removeVietnameseTones(rawQuery);
    const options = document.querySelectorAll('#warehouse-options-list .dropdown-option');
    const noResults = document.getElementById('warehouse-no-results');
    let hasResults = false;

    options.forEach(opt => {
        const rawText = opt.textContent.toLowerCase();
        const text = removeVietnameseTones(rawText);
        if (text.includes(query)) {
            opt.classList.remove('hidden-option');
            hasResults = true;
        } else {
            opt.classList.add('hidden-option');
        }
    });

    if (noResults) {
        noResults.style.display = hasResults ? 'none' : 'block';
    }
}

function selectStatusFilter(value, label) {
    const input = document.getElementById('status-filter');
    const labelEl = document.getElementById('status-filter-label');
    const dropdown = document.getElementById('status-filter-dropdown');

    if (input) input.value = value;
    if (labelEl) labelEl.textContent = label;

    // Update active class
    const options = dropdown.querySelectorAll('.dropdown-option');
    options.forEach(opt => {
        if (opt.getAttribute('data-value') === value) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });

    dropdown.classList.remove('open');
    openDropdownId = null;
    filterAccounts();
}

function selectWarehouseFilter(value, label) {
    const input = document.getElementById('warehouse-filter');
    const labelEl = document.getElementById('warehouse-filter-label');
    const dropdown = document.getElementById('warehouse-filter-dropdown');

    if (input) input.value = value;
    if (labelEl) {
        labelEl.textContent = label;
        labelEl.title = label;
    }

    // Update active class
    const options = dropdown.querySelectorAll('.dropdown-option');
    options.forEach(opt => {
        if (opt.getAttribute('data-value') === value) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });

    dropdown.classList.remove('open');
    openDropdownId = null;
    filterAccounts();
}

// Try immediate init
initAccountModule();

// Use MutationObserver to detect when account-data-table is added to DOM
var accountObserver = new MutationObserver((mutations, obs) => {
    if (document.getElementById('account-data-table')) {
        initAccountModule();
        obs.disconnect();
    }
});

// Only observe if table doesn't exist yet
if (!document.getElementById('account-data-table')) {
    accountObserver.observe(document.body, { childList: true, subtree: true });
    setTimeout(initAccountModule, 100);
    setTimeout(initAccountModule, 300);
}

// Register cleanup function
window.destroyModule = function() {
    console.log('Cleaning up Account module...');
    if (accountObserver) {
        accountObserver.disconnect();
    }
};

function renderAccounts() {
    const table = document.getElementById('account-data-table');
    if (!table) return;

    // Remove existing tbodies except the head/foot if any (but here we just remove all tbodies)
    const existingTbodies = table.querySelectorAll('tbody');
    existingTbodies.forEach(tb => tb.remove());

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
        const tbody = document.createElement('tbody');
        tbody.id = 'account-table-body';
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 20px; color: #64748b;">Không tìm thấy dữ liệu</td></tr>';
        table.appendChild(tbody);
    } else {
        pageData.forEach((acc, idx) => {
            const permissions = (acc.permissions && acc.permissions.length > 0)
                ? acc.permissions
                : [{ role: null, warehouses: [] }];

            const rowSpan = permissions.length;
            const tbody = document.createElement('tbody');
            tbody.className = 'account-group-body';

            permissions.forEach((p, pIdx) => {
                const tr = document.createElement('tr');

                // Cells to build
                let cellsHtml = '';

                // Common columns (only render on the first row of the account)
                if (pIdx === 0) {
                    cellsHtml += `
                        <td rowspan="${rowSpan}" style="vertical-align: middle;">
                            <input type="checkbox" class="acc-check" value="${acc.id}">
                        </td>
                        <td rowspan="${rowSpan}" style="vertical-align: middle; text-align: center;">${start + idx + 1}</td>
                        <td rowspan="${rowSpan}" style="vertical-align: middle;">
                            <div style="display: flex; justify-content: center;">
                                <img src="${acc.avatar}" class="avatar-img" alt="${acc.fullname}">
                            </div>
                        </td>
                        <td rowspan="${rowSpan}" style="vertical-align: middle;"><span style="font-family: roboto; font-weight: 600; color: #334155;">${acc.accountCode}</span></td>
                        <td rowspan="${rowSpan}" style="vertical-align: middle;"><div style="font-weight: 500; color: #0f172a;">${acc.fullname}</div></td>
                        <td rowspan="${rowSpan}" style="vertical-align: middle;">${acc.email}</td>
                    `;
                }

                // Role Column (Specific to this row)
                let roleBadge = '';
                if (p.role) {
                    roleBadge = `<span class="role-badge role-${p.role.toLowerCase()}">${p.role}</span>`;
                } else {
                    roleBadge = '<span style="color: #94a3b8; font-size: 13px;">Chưa phân quyền</span>';
                }
                cellsHtml += `<td style="text-align: center;">${roleBadge}</td>`;

                // Warehouse Column (Specific to this row)
                let whContent = '';
                if (p.warehouses && p.warehouses.includes('ALL')) {
                    whContent = '<span class="badge-warehouse all">Tất cả</span>';
                } else if (p.warehouses && p.warehouses.length > 0) {
                     const tags = p.warehouses.map(code => {
                        const wh = availableWarehouses.find(w => w.code === code);
                        const name = wh ? wh.name : code;
                        return `<span class="badge-warehouse" title="${name}">${name}</span>`;
                    }).join('');
                     whContent = `<div style="display: flex; flex-wrap: wrap; gap: 4px;">${tags}</div>`;
                } else {
                    whContent = '<span style="color: #94a3b8; font-size: 13px;">-</span>';
                }
                cellsHtml += `<td>${whContent}</td>`;

                // Action/Active columns (only render on the first row of the account)
                if (pIdx === 0) {
                     cellsHtml += `
                        <td rowspan="${rowSpan}" style="vertical-align: middle;">
                            <label class="switch">
                                <input type="checkbox" ${acc.active ? 'checked' : ''} onchange="handleToggleRequest(this, ${acc.id})">
                                <span class="slider round"></span>
                            </label>
                        </td>
                        <td rowspan="${rowSpan}" style="vertical-align: middle;">
                            <div style="display: flex; gap: 4px; justify-content: center;">
                                <div class="action-icon" title="Chỉnh sửa" onclick="openAccountModal(${acc.id})"><i class="fas fa-edit"></i></div>
                                <div class="action-icon reset" title="Reset mật khẩu" onclick="openResetModal(${acc.id})"><i class="fas fa-key"></i></div>
                                <div class="action-icon delete" title="Xóa" onclick="deleteAccount(${acc.id})"><i class="fas fa-trash"></i></div>
                            </div>
                        </td>
                     `;
                }

                tr.innerHTML = cellsHtml;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
        });
    }
    updatePagination(totalItems, totalPages);
}

function updatePagination(totalItems, totalPages) {
    const infoEl = document.getElementById('pagination-info');
    const pageNumsEl = document.getElementById('page-numbers');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const gotoInput = document.getElementById('goto-page');

    if (!infoEl) return;

    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    infoEl.textContent = totalItems > 0
        ? `Hiển thị ${start} - ${end} trong ${totalItems}`
        : 'Không có dữ liệu';

    // Page numbers
    pageNumsEl.innerHTML = '';
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => { currentPage = i; renderAccounts(); };
        pageNumsEl.appendChild(btn);
    }

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
    if (gotoInput) {
        gotoInput.max = totalPages;
        gotoInput.value = '';
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderAccounts();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        renderAccounts();
    }
}

function gotoPage(page) {
    const p = parseInt(page);
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    if (p >= 1 && p <= totalPages) {
        currentPage = p;
        renderAccounts();
    }
}

// Filter
function filterAccounts() {
    const query = document.getElementById('account-search').value.toLowerCase();
    const roleFilter = document.getElementById('role-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const warehouseFilter = document.getElementById('warehouse-filter').value;

    filteredData = accounts.filter(acc => {
        const matchesQuery = acc.fullname.toLowerCase().includes(query) ||
            acc.accountCode.toLowerCase().includes(query);
        const matchesRole = roleFilter === '' || (acc.permissions && acc.permissions.some(p => p.role === roleFilter));
        
        let matchesStatus = true;
        if (statusFilter === 'active') matchesStatus = acc.active === true;
        else if (statusFilter === 'inactive') matchesStatus = acc.active === false;

        let matchesWarehouse = true;
        if (warehouseFilter !== 'all') {
            matchesWarehouse = acc.permissions && acc.permissions.some(p => 
                p.warehouses && (p.warehouses.includes('ALL') || p.warehouses.includes(warehouseFilter))
            );
        }

        return matchesQuery && matchesRole && matchesStatus && matchesWarehouse;
    });
    currentPage = 1;
    renderAccounts();
}

// Custom Dropdown Logic
function toggleDropdown(id) {
    const el = document.getElementById(id);
    if (!el) return;

    // Close other dropdowns if any
    if (openDropdownId && openDropdownId !== id) {
        const other = document.getElementById(openDropdownId);
        if (other) other.classList.remove('open');
    }

    el.classList.toggle('open');
    const isOpen = el.classList.contains('open');
    openDropdownId = isOpen ? id : null;

    // Focus search input if opening warehouse filter
    if (isOpen && id === 'warehouse-filter-dropdown') {
        const searchInput = el.querySelector('.dropdown-search-input');
        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        }
        // Also ensure options are visible (reset filter)
        const options = el.querySelectorAll('.dropdown-option');
        options.forEach(opt => opt.style.display = 'block');
        const noResults = el.querySelector('.no-results');
        if (noResults) noResults.style.display = 'none';
        const input = el.querySelector('.dropdown-search-input');
        if (input) input.value = '';
    }
}

function selectRole(value, label) {
    const input = document.getElementById('role-filter');
    const labelEl = document.getElementById('role-selected-label');
    const dropdown = document.getElementById('role-dropdown');

    if (input) input.value = value;
    if (labelEl) {
        labelEl.textContent = label;
    }

    // Update active class in options
    const options = dropdown.querySelectorAll('.dropdown-option');
    options.forEach(opt => {
        if (opt.getAttribute('data-value') === value) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });

    // Close dropdown
    dropdown.classList.remove('open');
    openDropdownId = null;

    // Trigger filter
    filterAccounts();
}

// Close dropdown on outside click
document.addEventListener('click', function (e) {
    if (openDropdownId && !e.target.closest('.custom-dropdown')) {
        document.getElementById(openDropdownId).classList.remove('open');
        openDropdownId = null;
    }

    // Close warehouse dropdown on outside click
    const whDropdown = document.getElementById('warehouse-dropdown-container');
    if (whDropdown && !whDropdown.contains(e.target)) {
        const opts = document.getElementById('warehouse-options');
        if (opts) opts.classList.remove('show');
    }

    // Close confirm modal on outside click
    const confirmMdl = document.getElementById('confirmModal');
    if (confirmMdl && confirmMdl.classList.contains('show') && e.target === confirmMdl) {
        closeConfirmModal();
    }

    // Close logout all modal on outside click
    const logoutMdl = document.getElementById('logoutAllModal');
    if (logoutMdl && logoutMdl.classList.contains('show') && e.target === logoutMdl) {
        closeLogoutAllModal();
    }
});

function toggleAll(source) {
    document.querySelectorAll('.acc-check').forEach(chk => chk.checked = source.checked);
}

function toggleStatus(id) {
    const acc = accounts.find(a => a.id === id);
    if (acc) {
        acc.active = !acc.active;
        showToast(`Trạng thái tài khoản ${acc.accountCode} đã được cập nhật`);
    }
}

// Toggle with Confirmation Popover
function handleToggleRequest(checkbox, id) {
    const isNowChecked = checkbox.checked;

    // If turning OFF (was active, now inactive), ask for confirmation
    if (!isNowChecked) {
        // Revert immediately, wait for confirmation
        checkbox.checked = true;
        pendingToggleId = id;

        confirmModal = document.getElementById('confirmModal');
        const acc = accounts.find(a => a.id === id);
        document.getElementById('confirmAccountName').textContent = acc ? acc.fullname : '';

        confirmModal.classList.add('show');

        // Position Popover dynamically
        const switchContainer = checkbox.closest('.switch');
        const rect = switchContainer.getBoundingClientRect();
        const content = confirmModal.querySelector('.confirm-content');

        if (content) {
            const contentHeight = content.offsetHeight || 180;
            // Offset to the left of the switch
            content.style.left = (rect.left - 290) + 'px'; // 280 width + gap
            // Center vertically
            content.style.top = (rect.top + (rect.height / 2) - (contentHeight / 2)) + 'px';
        }
    } else {
        // If turning ON, allow it immediately
        const acc = accounts.find(a => a.id === id);
        if (acc) {
            acc.active = true;
            showToast(`Tài khoản ${acc.accountCode} đã được kích hoạt`);
        }
    }
}

function closeConfirmModal() {
    confirmModal = document.getElementById('confirmModal');
    if (confirmModal) confirmModal.classList.remove('show');
    pendingToggleId = null;
}

function confirmDisable() {
    if (pendingToggleId) {
        const acc = accounts.find(a => a.id === pendingToggleId);
        if (acc) {
            acc.active = false;
            showToast(`Tài khoản ${acc.accountCode} đã được ngưng sử dụng`);
            renderAccounts(); // Refresh to update switch state
        }
        closeConfirmModal();
    }
}

// Account Modal
function openAccountModal(id = null) {
    const modal = document.getElementById('account-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('account-form');
    form.reset();
    document.getElementById('acc-id').value = '';
    resetAvatarUpload();

    if (id) {
        const acc = accounts.find(a => a.id === id);
        if (acc) {
            title.innerText = 'Cập nhật tài khoản';
            document.getElementById('acc-id').value = acc.id;
            document.getElementById('acc-fullname').value = acc.fullname;
            document.getElementById('acc-email').value = acc.email;
            document.getElementById('acc-code').value = acc.accountCode;
            document.getElementById('acc-active').checked = acc.active;

            // Render Permissions
            renderPermissionRows(acc.permissions || []);

            // Show existing avatar in preview zone
            if (acc.avatar) {
                const preview = document.getElementById('avatar-preview');
                const placeholder = document.getElementById('avatar-placeholder');
                if (preview && placeholder) {
                    preview.src = acc.avatar;
                    preview.style.display = 'block';
                    placeholder.style.display = 'none';
                }
            }
        }
    } else {
        title.innerText = 'Thêm mới tài khoản';
        document.getElementById('acc-active').checked = true;
        // Initial empty permission
        renderPermissionRows([{ role: 'User', warehouses: [] }]);
    }
    modal.classList.add('show');
}

function closeAccountModal() {
    document.getElementById('account-modal').classList.remove('show');
    resetAvatarUpload();
}

function saveAccount() {
    const idStr = document.getElementById('acc-id').value;
    const fullname = document.getElementById('acc-fullname').value;
    const email = document.getElementById('acc-email').value;
    const accountCodeInput = document.getElementById('acc-code').value;
    const avatarValue = getAvatarValue();
    const avatar = avatarValue || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=random`;
    const active = document.getElementById('acc-active').checked;

    // Use currentPermissions global instead of manual DOM scraping which was broken
    const permissions = JSON.parse(JSON.stringify(currentPermissions));
    let isValid = true;

    if (permissions.length === 0) isValid = false;
    permissions.forEach(p => {
        if (!p.warehouses || p.warehouses.length === 0) {
            isValid = false;
        }
    });

    if (!fullname || !accountCodeInput) {
        alert('Vui lòng nhập đầy đủ thông tin tài khoản');
        return;
    }

    if (!isValid) {
        alert('Mỗi quyền phải chọn ít nhất một kho');
        return;
    }

    if (idStr) {
        const id = parseInt(idStr);
        const idx = accounts.findIndex(a => a.id === id);
        if (idx !== -1) {
            accounts[idx] = { ...accounts[idx], fullname, email, accountCode: accountCodeInput, avatar, active, permissions };
            showToast('Cập nhật thông tin tài khoản thành công');
        }
    } else {
        const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
        accounts.push({ id: newId, accountCode: accountCodeInput, fullname, email, avatar, active, permissions });
        showToast('Cập nhật thông tin tài khoản thành công');
    }

    closeAccountModal();
    filterAccounts(); // Re-apply filter and render
}

// Reset Password Modal
function openResetModal(id) {
    const acc = accounts.find(a => a.id === id);
    if (acc) {
        currentResetId = id;
        document.getElementById('reset-acc-name').innerText = acc.fullname;
        document.getElementById('reset-modal').classList.add('show');
    }
}

function closeResetModal() {
    document.getElementById('reset-modal').classList.remove('show');
    currentResetId = null;
}

function confirmResetPassword() {
    if (currentResetId) {
        showToast('Đã reset mật khẩu về mặc định!');
        closeResetModal();
    }
}

function deleteAccount(id) {
    pendingDeleteAccountId = id;
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.add('show');
}

function closeDeleteConfirm() {
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.remove('show');
    pendingDeleteAccountId = null;
}

function confirmDeleteAccount() {
    if (pendingDeleteAccountId) {
        accounts = accounts.filter(a => a.id !== pendingDeleteAccountId);
        filterAccounts();
        showToast('Đã xóa tài khoản', 'success');
        closeDeleteConfirm();
    }
}

function logoutAllAccounts(btn) {
    const modal = document.getElementById('logoutAllModal');
    if (modal) {
        modal.classList.add('show');
    }
}


function closeLogoutAllModal() {
    const modal = document.getElementById('logoutAllModal');
    if (modal) modal.classList.remove('show');
}

function confirmLogoutAll() {
    showToast('Đã đăng xuất tất cả các tài khoản', 'success');
    closeLogoutAllModal();
}



// ========== IMPORT EXCEL ==========
function openImportModal() {
    pendingImportData = [];
    document.getElementById('import-file').value = '';
    document.getElementById('selected-file-name').textContent = '';
    document.getElementById('import-preview').style.display = 'none';
    document.getElementById('import-error').style.display = 'none';
    document.getElementById('confirm-import-btn').disabled = true;
    document.getElementById('import-modal').classList.add('show');
}

function closeImportModal() {
    document.getElementById('import-modal').classList.remove('show');
}

function downloadSampleFile() {
    const sampleData = [
        ['Họ và tên', 'Email', 'Tên đăng nhập', 'Vai trò (1=Admin, 2=Manager, 3=Operator, 4=User)'],
        ['Nguyễn Văn Mẫu', 'mau@yopmail.com', 'NV999', 3],
        ['Trần Thị Test', 'test@yopmail.com', 'NV998', 4]
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Accounts');
    ws['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 45 }];
    XLSX.writeFile(wb, 'mau_import_taikhoan.xlsx');
    showToast('Đã tải file mẫu!', 'success');
}

function handleFileSelect(input) {
    const file = input.files[0];
    if (!file) return;

    document.getElementById('selected-file-name').textContent = `📄 ${file.name}`;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            parseImportData(jsonData);
        } catch (err) {
            showImportError('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.');
        }
    };
    reader.readAsArrayBuffer(file);
}

function parseImportData(jsonData) {
    const errorEl = document.getElementById('import-error');
    const previewEl = document.getElementById('import-preview');
    const summaryEl = document.getElementById('import-summary');
    const confirmBtn = document.getElementById('confirm-import-btn');

    if (jsonData.length < 2) {
        showImportError('File không có dữ liệu hoặc chỉ có header.');
        return;
    }

    const rows = jsonData.slice(1);
    const parsed = [];
    const errors = [];

    rows.forEach((row, idx) => {
        const rowNum = idx + 2;
        if (!row || row.length < 4) {
            errors.push(`Dòng ${rowNum}: Thiếu dữ liệu`);
            return;
        }

        const [fullname, email, code, roleNum] = row;

        if (!fullname || !email || !code) {
            errors.push(`Dòng ${rowNum}: Thiếu thông tin bắt buộc`);
            return;
        }

        const roleInt = parseInt(roleNum);
        if (![1, 2, 3, 4].includes(roleInt)) {
            errors.push(`Dòng ${rowNum}: Vai trò không hợp lệ (phải là 1-4)`);
            return;
        }

        parsed.push({
            fullname: String(fullname).trim(),
            email: String(email).trim(),
            code: String(code).trim(),
            role: ROLE_MAP[roleInt]
        });
    });

    errorEl.style.display = 'none';
    previewEl.style.display = 'block';

    if (errors.length > 0) {
        errorEl.innerHTML = `<strong>Lỗi (${errors.length}):</strong><br>` + errors.slice(0, 5).join('<br>') +
            (errors.length > 5 ? `<br>... và ${errors.length - 5} lỗi khác` : '');
        errorEl.style.display = 'block';
    }

    if (parsed.length > 0) {
        pendingImportData = parsed;
        renderPreviewTable(parsed);
        summaryEl.innerHTML = `✅ <strong>${parsed.length}</strong> tài khoản hợp lệ sẵn sàng import`;
        confirmBtn.disabled = false;
    } else {
        summaryEl.innerHTML = '❌ Không có dữ liệu hợp lệ để import';
        confirmBtn.disabled = true;
    }
}

function renderPreviewTable(data) {
    const thead = document.getElementById('preview-thead');
    const tbody = document.getElementById('preview-tbody');

    thead.innerHTML = '<tr><th>Họ và tên</th><th>Email</th><th>Mã NV</th><th>Vai trò</th></tr>';
    tbody.innerHTML = data.map(row => `
        <tr>
            <td>${row.fullname}</td>
            <td>${row.email}</td>
            <td>${row.code}</td>
            <td><span class="role-badge role-${row.role.toLowerCase()}">${row.role}</span></td>
        </tr>
    `).join('');
}

function showImportError(msg) {
    const errorEl = document.getElementById('import-error');
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    document.getElementById('import-preview').style.display = 'none';
    document.getElementById('confirm-import-btn').disabled = true;
}

function confirmImport() {
    if (pendingImportData.length === 0) return;

    let maxId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) : 0;

    pendingImportData.forEach(row => {
        maxId++;
        accounts.push({
            id: maxId,
            accountCode: `user${String(maxId).padStart(3, '0')}`,
            fullname: row.fullname,
            email: row.email,
            code: row.code,
            role: row.role,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.fullname)}&background=random`,
            active: true
        });
    });

    showToast(`Đã import thành công ${pendingImportData.length} tài khoản!`);
    closeImportModal();
    filterAccounts();
}

// Toast - Use global showToast from main script
// Note: This module is loaded in main page context, so window.showToast refers to script.js function
// We just forward calls to ensure the global toast is used

// Avatar Functions

function handleAvatarUpload(input) {
    const file = input.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn file ảnh!', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        uploadedAvatarData = e.target.result;
        const preview = document.getElementById('avatar-preview');
        const placeholder = document.getElementById('avatar-placeholder');

        preview.src = uploadedAvatarData;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function initAvatarDragAndDrop() {
    const zone = document.querySelector('.avatar-upload-zone');
    if (!zone) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        zone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        zone.addEventListener(eventName, () => zone.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        zone.addEventListener(eventName, () => zone.classList.remove('drag-over'), false);
    });

    zone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            handleAvatarUpload({ files: files });
        }
    }, false);
}

function resetAvatarUpload() {
    uploadedAvatarData = null;
    const preview = document.getElementById('avatar-preview');
    const placeholder = document.getElementById('avatar-placeholder');
    const fileInput = document.getElementById('avatar-file');

    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }
    if (placeholder) placeholder.style.display = 'flex';
    if (fileInput) fileInput.value = '';
}

function getAvatarValue() {
    // If a new file was uploaded, return that data
    if (uploadedAvatarData) {
        return uploadedAvatarData;
    }
    // Otherwise return the current src from preview (useful for preserving existing URL/data)
    const preview = document.getElementById('avatar-preview');
    return preview && preview.style.display !== 'none' ? preview.src : '';
}
// Permissions Module Logic
var currentPermissions = [];

function renderPermissionRows(perms = []) {
    currentPermissions = perms.length > 0 ? JSON.parse(JSON.stringify(perms)) : [{ role: 'User', warehouses: [] }];
    const container = document.getElementById('permissions-container');
    if (!container) return;

    container.innerHTML = '';
    currentPermissions.forEach((perm, idx) => {
        const row = document.createElement('div');
        row.className = 'permission-row';
        
        // Get warehouse display value
        let warehouseValue = '';
        if (perm.warehouses && perm.warehouses.length > 0) {
            warehouseValue = perm.warehouses.join(', ');
        }
        
        const isOnlyRow = currentPermissions.length === 1 && idx === 0;
        const isFirstRow = idx === 0;

        row.innerHTML = `
            <div class="permission-row-actions">
                <button type="button" class="btn-icon-add" onclick="addPermissionRow()" title="Thêm phân quyền">
                    <i class="fas fa-plus"></i>
                </button>
                <button type="button" class="btn-icon-remove ${isFirstRow ? 'disabled' : ''}" 
                        ${isFirstRow ? '' : `onclick="removePermissionRow(${idx})"`} 
                        title="${isFirstRow ? 'Không thể xóa quyền mặc định' : 'Xóa phân quyền'}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Vai trò <span class="required">*</span></label>
                <div class="editable-combobox" id="perm-role-dropdown-${idx}">
                    <input type="text" class="combobox-input" 
                           id="perm-role-input-${idx}"
                           readonly
                           value="${perm.role}"
                           onclick="toggleRoleDropdown(event, ${idx})"
                           style="cursor: pointer; caret-color: transparent;">
                    <i class="fas fa-chevron-down combobox-icon" onclick="toggleRoleDropdown(event, ${idx})"></i>
                    <div class="combobox-options" id="perm-role-options-${idx}">
                        ${renderRoleOptions(idx, perm.role)}
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Kho áp dụng <span class="required">*</span></label>
                <div class="editable-combobox" id="perm-wh-dropdown-${idx}">
                    <input type="text" class="combobox-input" 
                           id="perm-wh-input-${idx}"
                           placeholder="Nhập hoặc chọn kho..." 
                           value="${warehouseValue}"
                           onfocus="openPermissionDropdown(${idx})"
                           oninput="handleWarehouseInput(${idx}, this.value)"
                           autocomplete="off">
                    <i class="fas fa-times combobox-clear" 
                       id="perm-wh-clear-${idx}" 
                       onclick="clearPermissionWarehouse(event, ${idx})"
                       style="display: ${warehouseValue ? 'block' : 'none'}"></i>
                    <i class="fas fa-chevron-down combobox-icon" onclick="togglePermissionDropdown(${idx})"></i>
                    <div class="combobox-options" id="perm-wh-options-${idx}">
                        ${renderWhOptions(idx, perm.warehouses, '')}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(row);
    });
}

function renderSelectedWhTags(selected) {
    if (!selected || selected.length === 0) return '';
    if (selected.includes('ALL')) return '<span class="selected-tag all">Tất cả</span>';
    
    if (selected.length > 2) {
        return selected.slice(0, 2).map(code => `<span class="selected-tag">${code}</span>`).join('') + `<span class="selected-tag">+${selected.length - 2}</span>`;
    }
    return selected.map(code => `<span class="selected-tag">${code}</span>`).join('');
}

function renderWhOptions(rowIdx, selected, filterQuery = '') {
    const warehouses = [{ code: 'ALL', name: 'Tất cả các kho' }, ...availableWarehouses];
    const query = filterQuery.toLowerCase().trim();
    
    return warehouses.map((wh, index) => {
        const fullText = wh.code === 'ALL' ? wh.name : `${wh.code} - ${wh.name}`;
        const matchesFilter = !query || fullText.toLowerCase().includes(query) || wh.code.toLowerCase().includes(query);
        
        if (!matchesFilter) return '';
        
        const isSelected = selected.includes(wh.code);
        return `
            <div class="combobox-option ${isSelected ? 'selected' : ''}" 
                 onclick="selectPermissionWarehouse(${rowIdx}, '${wh.code}', '${wh.name.replace(/'/g, "\\'")}')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${fullText}</span>
                    ${isSelected ? '<i class="fas fa-check" style="color: #3b82f6;"></i>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderRoleOptions(rowIdx, currentRole) {
    const roles = ['Admin', 'Manager', 'Operator', 'User'];
    return roles.map(role => {
        const isSelected = role === currentRole;
        return `
            <div class="combobox-option ${isSelected ? 'selected' : ''}" 
                 onclick="selectPermissionRole(event, ${rowIdx}, '${role}')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${role}</span>
                    ${isSelected ? '<i class="fas fa-check" style="color: #3b82f6;"></i>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function toggleRoleDropdown(event, idx) {
    if (event) event.stopPropagation();
    
    // Close ALL dropdowns (including permission warehouses and filters)
    document.querySelectorAll('.editable-combobox, .custom-dropdown').forEach(el => {
        if (el.id !== `perm-role-dropdown-${idx}`) {
            el.classList.remove('open');
        }
    });

    const dropdown = document.getElementById(`perm-role-dropdown-${idx}`);
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

function selectPermissionRole(event, rowIdx, role) {
    if (event) event.stopPropagation();
    
    if (currentPermissions[rowIdx]) {
        // Update model
        currentPermissions[rowIdx].role = role;
        
        // Update input display
        const input = document.getElementById(`perm-role-input-${rowIdx}`);
        if (input) input.value = role;
        
        // Refresh options to show ONLY the correct checkmark for THIS row
        const options = document.getElementById(`perm-role-options-${rowIdx}`);
        if (options) {
            options.innerHTML = renderRoleOptions(rowIdx, role);
        }

        // Close dropdown
        const dropdown = document.getElementById(`perm-role-dropdown-${rowIdx}`);
        if (dropdown) dropdown.classList.remove('open');
    }
}

function addPermissionRow() {
    currentPermissions.push({ role: 'User', warehouses: [] });
    renderPermissionRows(currentPermissions);
}

function removePermissionRow(idx) {
    if (currentPermissions.length <= 1) {
        showToast('Tài khoản phải có ít nhất một quyền', 'warning');
        return;
    }
    currentPermissions.splice(idx, 1);
    renderPermissionRows(currentPermissions);
}



function filterPermissionWarehouses(idx, query) {
    const optionsContainer = document.getElementById(`perm-wh-options-${idx}`);
    if (!optionsContainer) return;

    const dropdown = document.getElementById(`perm-wh-dropdown-${idx}`);
    if (dropdown && !dropdown.classList.contains('open')) {
        dropdown.classList.add('open');
    }

    const perm = currentPermissions[idx];
    if (!perm) return;
    
    // Re-render options with filter
    optionsContainer.innerHTML = renderWhOptions(idx, perm.warehouses, query);
}


function togglePermissionDropdown(idx, forceOpen = false) {
    const dropdown = document.getElementById(`perm-wh-dropdown-${idx}`);
    if (!dropdown) return;

    // Close others
    document.querySelectorAll('.editable-combobox').forEach((el) => {
        if (el.id !== `perm-wh-dropdown-${idx}`) {
            el.classList.remove('open');
        }
    });

    if (forceOpen) {
        dropdown.classList.add('open');
    } else {
        dropdown.classList.toggle('open');
    }
}

function selectPermissionWarehouse(rowIdx, whCode, whName) {
    const perm = currentPermissions[rowIdx];
    if (!perm) return;
    
    // Toggle logic
    if (whCode === 'ALL') {
        if (perm.warehouses.includes('ALL')) {
             perm.warehouses = [];
        } else {
             perm.warehouses = ['ALL'];
        }
    } else {
        // If ALL is present, remove it
        if (perm.warehouses.includes('ALL')) {
             perm.warehouses = [];
        }
        
        const index = perm.warehouses.indexOf(whCode);
        if (index > -1) {
            perm.warehouses.splice(index, 1);
        } else {
            perm.warehouses.push(whCode);
        }
    }
    
    // Update input display
    const inputEl = document.getElementById(`perm-wh-input-${rowIdx}`);
    if (inputEl) {
        inputEl.value = perm.warehouses.join(', ');
        // Keep focus to allow more selections
        inputEl.focus();
        updateClearButton(rowIdx, inputEl.value);
    }
    
    // Refresh options to show checkmarks
    filterPermissionWarehouses(rowIdx, '');
}

function clearPermissionWarehouse(event, rowIdx) {
    if (event) event.stopPropagation(); // Prevent ensuring it doesn't trigger other clicks
    
    const perm = currentPermissions[rowIdx];
    if (perm) {
        perm.warehouses = [];
    }
    
    const inputEl = document.getElementById(`perm-wh-input-${rowIdx}`);
    if (inputEl) {
        inputEl.value = '';
        inputEl.focus();
        updateClearButton(rowIdx, '');
    }
    
    // Refresh options
    filterPermissionWarehouses(rowIdx, '');
}

function updateClearButton(rowIdx, value) {
    const clearBtn = document.getElementById(`perm-wh-clear-${rowIdx}`);
    if (clearBtn) {
        clearBtn.style.display = value ? 'block' : 'none';
    }
}

function handleWarehouseInput(rowIdx, value) {
    const perm = currentPermissions[rowIdx];
    if (!perm) return;
    
    // Update clear button visibility
    updateClearButton(rowIdx, value);
    
    // If user clears the input, clear selection user manual typing
    if (value.trim() === '') {
        perm.warehouses = [];
    }
    
    // Filter options based on input
    // Only filter if it's not a comma-separated list of existing codes (crudely)
    // Actually, improved UX: always filter by the *last* term if it looks like they are typing a new one?
    // For now, let's just filter by what they type.
    // If they type "CSC, VAM", we probably don't want to filter by that string literal.
    // But since this is a "simple" cleanup:
    
    filterPermissionWarehouses(rowIdx, value);
}

function openPermissionDropdown(idx) {
    const dropdown = document.getElementById(`perm-wh-dropdown-${idx}`);
    if (!dropdown) return;
    
    // Close all other dropdowns first
    document.querySelectorAll('.editable-combobox').forEach((el) => {
        if (el.id !== `perm-wh-dropdown-${idx}`) {
            el.classList.remove('open');
        }
    });
    
    dropdown.classList.add('open');
    
    // Refresh options based on current input
    // FIXED: Always show all options on focus, ignore current selection text
    filterPermissionWarehouses(idx, '');
}

function closePermissionDropdown(idx) {
    const dropdown = document.getElementById(`perm-wh-dropdown-${idx}`);
    if (dropdown) {
        dropdown.classList.remove('open');
    }
}

// Close row dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.editable-combobox')) {
        document.querySelectorAll('.editable-combobox').forEach(el => el.classList.remove('open'));
    }
});
