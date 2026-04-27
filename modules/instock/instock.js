// Products data extracted from Product Module
const bananaData = [
  {
    "dong_san_pham": "Chuối Trung Quốc/ Chinese bananas",
    "categories": [
      {
        "pham_cap": "A456",
        "products": [
          { "stt": 1, "loai_thung": "TROPICAL" },
          { "stt": 2, "loai_thung": "SOFIA" },
          { "stt": 3, "loai_thung": "FRUIT WHARF" },
          { "stt": 4, "loai_thung": "DASANG" }
        ]
      },
      {
        "pham_cap": "A789",
        "products": [
          { "stt": 5, "loai_thung": "TROPICAL" },
          { "stt": 6, "loai_thung": "SOFIA" }
        ]
      },
      {
        "pham_cap": "CL",
        "products": [
          { "stt": 11, "loai_thung": "DASANG" },
          { "stt": 12, "loai_thung": "XINFADIN" },
          { "stt": 13, "loai_thung": "SEIKA" },
          { "stt": 14, "loai_thung": "TROPICAL" }
        ]
      }
    ]
  },
  {
    "dong_san_pham": "Chuối Nhật Bản/ Japanese bananas",
    "categories": [
      {
        "pham_cap": "14CP",
        "products": [
          { "stt": 15, "loai_thung": "XINFADIN" },
          { "stt": 16, "loai_thung": "SEIKA" },
          { "stt": 17, "loai_thung": "DASANG" }
        ]
      },
      {
        "pham_cap": "16CP",
        "products": [
          { "stt": 18, "loai_thung": "XINFADIN" },
          { "stt": 19, "loai_thung": "SEIKA" },
          { "stt": 20, "loai_thung": "DEL MONTE" }
        ]
      },
      {
        "pham_cap": "26CP",
        "products": [
          { "stt": 21, "loai_thung": "XINFADIN" },
          { "stt": 22, "loai_thung": "SEIKA" },
          { "stt": 23, "loai_thung": "DEL MONTE" },
          { "stt": 24, "loai_thung": "SHIMIZU" },
          { "stt": 25, "loai_thung": "TAITO" }
        ]
      },
      {
        "pham_cap": "30CP",
        "products": [
          { "stt": 26, "loai_thung": "SEIKA" },
          { "stt": 27, "loai_thung": "DEL MONTE" },
          { "stt": 28, "loai_thung": "XINFADIN" },
          { "stt": 29, "loai_thung": "DASANG" },
          { "stt": 30, "loai_thung": "TROPICAL" },
          { "stt": 31, "loai_thung": "NHẬT TRƠN" },
          { "stt": 32, "loai_thung": "TAITO" },
          { "stt": 33, "loai_thung": "MAINICHI" },
          { "stt": 34, "loai_thung": "SEIKA 13KG" },
          { "stt": 35, "loai_thung": "DELMONTE 13KG" }
        ]
      }
    ]
  }
];

// Mock Data
let instockData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 20;

// Date Picker State
let instockSelectedStartDate = null;
let instockSelectedEndDate = null;
let instockActiveStartDate = null;
let instockActiveEndDate = null;
let instockCurrentViewLeft = new Date();
let instockCurrentViewRight = new Date();
instockCurrentViewRight.setMonth(instockCurrentViewRight.getMonth() + 1);

// Product groups (Categories) collected from bananaData
let productGroups = [];
let instockBatchCodes = [];
let instockSubSortDir = 'none'; // 'none' | 'asc' | 'desc'
let instockExpandedRowId = null; 

// Initialize Data
function initMockData() {
  const products = [];
  const groupsSet = new Set();
  const batchIdsSet = new Set();

  bananaData.forEach(line => {
    line.categories.forEach(cat => {
      const groupValue = `${line.dong_san_pham} - ${cat.pham_cap}`;
      groupsSet.add(groupValue);
      
      cat.products.forEach(p => {
        const fullName = `${line.dong_san_pham} - ${cat.pham_cap} - ${p.loai_thung}`;
        const prodCode = `${cat.pham_cap} - ${p.loai_thung}`;
        
        // Generate history first
        const history = generateMockHistory(prodCode);
        
        // Collect batch IDs
        history.forEach(h => {
          if (h.batchId) batchIdsSet.add(h.batchId);
        });

        // Ensure total quantity is positive by forcing a large initial Nhập
        let totalQty = 0;
        history.forEach(h => {
          const isInput = h.type.startsWith("Nhập");
          if (isInput) totalQty += h.quantity;
          else totalQty -= h.quantity;
        });

        // If negative (shouldn't happen with our refined history logic but as a safety)
        if (totalQty < 0) {
            history[0].type = "Nhập mới";
            history[0].quantity += Math.abs(totalQty) + 20;
            totalQty = history.reduce((sum, h) => sum + (h.type.startsWith("Nhập") ? h.quantity : -h.quantity), 0);
        }

        products.push({
          id: prodCode,
          name: fullName,
          group: groupValue,
          unit: "Thùng",
          quantity: totalQty,
          history: history
        });
      });
    });
  });

  instockData = products;
  filteredData = [...instockData];
  productGroups = Array.from(groupsSet);
  instockBatchCodes = Array.from(batchIdsSet);
  renderInstockTable();
  populateGroupDropdown();
}

function generateMockHistory(productId) {
  const history = [];
  const types = ["Nhập kho", "Xuất kho"];
  const statuses = ["Đã nhập kho", "Đã xuất kho"];
  const users = [
    { fullname: "Trần Đức Nam", username: "usernam02" },
    { fullname: "Đỗ Hữu Uyên", username: "user005" },
    { fullname: "Nguyễn Hoàng An", username: "user004" }
  ];

  const warehouses = ["A", "B", "C"];
  const columns = ["A", "B", "C", "D", "E"];
  const containerPrefixes = ["PL-WOOD-01", "PL-PLASTIC-02", "BOX-PLASTIC-03", "BOX-STD-04", "CAGE-IRON-05"];

  const count = Math.floor(Math.random() * 5) + 3;
  for (let i = 1; i <= count; i++) {
    // Force first item to be "Nhập mới" to ensure positive stock
    const isInput = i === 1 ? true : Math.random() > 0.4;
    let type;
    if (isInput) {
      type = Math.random() > 0.2 ? "Nhập mới" : "Nhập lại";
    } else {
      type = Math.random() > 0.2 ? "Xuất bán hàng" : "Xuất hủy";
    }
    const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
    const floor = Math.floor(Math.random() * 2) + 1;
    const col = columns[Math.floor(Math.random() * columns.length)];
    const row = Math.floor(Math.random() * 10) + 1;
    const location = `Kho mát ${warehouse} - ${floor}-${col}${row}`;

    // Random container prefix
    const prefix = containerPrefixes[Math.floor(Math.random() * containerPrefixes.length)];
    const containerId = `${prefix}_${i}`;

    const randomDate = (daysBack) => {
      const d = new Date();
      d.setSeconds(0);
      d.setMilliseconds(0);
      d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
      d.setHours(Math.floor(Math.random() * 24));
      d.setMinutes(Math.floor(Math.random() * 60));
      return d;
    };

    const formatDateShort = (d) => {
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${hh}:${mm} ${dd}/${mo}/${yyyy}`;
    };

    // Allow history to go back further so we can see expired items
    const dateCreated = randomDate(15); 
    const dateExecuted = new Date(dateCreated.getTime() + (Math.floor(Math.random() * 120) + 15) * 60000); // 15-135 mins later
    
    // Random shelf life between 3 and 10 days
    const shelfLifeDays = Math.floor(Math.random() * 8) + 3;
    const expiryDate = new Date(dateExecuted.getTime() + shelfLifeDays * 24 * 60 * 60 * 1000);

    const formatDateOnly = (d) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mo}/${yyyy}`;
    };

    // Random Batch ID (matching batch module codes like CN-BN-1060)
    const batchCode = (Math.random() > 0.5 ? 'CN-BN-' : 'JP-BN-') + (1000 + Math.floor(Math.random() * 60));

    const batchName = (batchCode.startsWith('CN') ? 'Lô hàng Chuối Trung Quốc' : 'Lô hàng Chuối Nhật Bản') + ' - Đợt ' + (Math.floor(Math.random() * 5) + 1);

    history.push({
      id: `${batchCode}-${productId}-${i}`,
      containerId: containerId,
      batchId: batchCode,
      batchName: batchName,
      type: type,
      quantity: Math.floor(Math.random() * 50) + 5,
      location: location,
      createdAt: formatDateShort(dateCreated),
      executedAt: formatDateShort(dateExecuted),
      expiryDate: formatDateOnly(expiryDate),
      expiryTimestamp: expiryDate.getTime(),
      status: isInput ? "Đã nhập kho" : "Đã xuất kho",
      creator: users[Math.floor(Math.random() * users.length)]
    });
  }
  return history;
}

// Calculate storage duration from executedAt string ("HH:MM DD/MM/YYYY") to now
function calcStorageDuration(executedAt) {
  if (!executedAt) return null;
  // Parse "HH:MM DD/MM/YYYY"
  const match = executedAt.match(/(\d{2}):(\d{2})\s+(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return null;
  const [, hh, mm, dd, mo, yyyy] = match;
  const from = new Date(+yyyy, +mo - 1, +dd, +hh, +mm, 0);
  const now = new Date();
  let diffMs = now - from;
  if (diffMs < 0) diffMs = 0;

  const totalMinutes = Math.floor(diffMs / 60000);
  const days    = Math.floor(totalMinutes / 1440);
  const hours   = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0)    parts.push(`${days} ngày`);
  if (hours > 0)   parts.push(`${hours} giờ`);
  if (minutes > 0) parts.push(`${minutes} phút`);
  
  // Return only the first 2 parts to keep it concise
  return parts.slice(0, 2).join(' ');
}

// Global helper for consistent date parsing
function parseInstockDateTime(str) {
  if (!str) return 0;
  const m = str.match(/(\d{2}):(\d{2})\s+(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return 0;
  // Date constructor args: year, month (0-indexed), day, hours, minutes
  return new Date(+m[5], +m[4] - 1, +m[3], +m[1], +m[2]).getTime();
}

// Render Functions
function renderInstockTable() {
  const tbody = document.getElementById("instock-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  const pageData = filteredData.slice(startIndex, endIndex);

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="text-center">Không tìm thấy sản phẩm nào</td></tr>`;
    updatePaginationControls(0);
    return;
  }

  pageData.forEach((item, index) => {
    const row = document.createElement("tr");
    row.className = "clickable-row";
    if (item.id === instockExpandedRowId) row.classList.add("expanded");
    row.id = `row-${item.id}`;
    row.onclick = () => toggleRowExpansion(item.id);

    // Calculate dynamic balances based on date range
    let tonDau = 0, nhapMoi = 0, nhapLai = 0, xuatBanHang = 0, xuatHuy = 0, tonCuoi = 0;
    
    const startDate = instockActiveStartDate ? new Date(instockActiveStartDate).setHours(0,0,0,0) : 0;
    const endDate = instockActiveEndDate ? new Date(instockActiveEndDate).setHours(23,59,59,999) : Infinity;

    item.history.forEach(h => {
      const hTime = parseInstockDateTime(h.executedAt);
      const qty = h.quantity || 0;
      const isInput = h.type.startsWith("Nhập");

      if (hTime < startDate) {
        tonDau += isInput ? qty : -qty;
      } else if (hTime >= startDate && hTime <= endDate) {
        if (h.type === "Nhập mới") {
          nhapMoi += qty;
        } else if (h.type === "Nhập lại") {
          nhapLai += qty;
        } else if (h.type === "Xuất bán hàng") {
          xuatBanHang += qty;
        } else if (h.type === "Xuất hủy") {
          xuatHuy += qty;
        }
      }
    });

    tonCuoi = tonDau + nhapMoi + nhapLai - xuatBanHang - xuatHuy;

    row.innerHTML = `
      <td class="text-center">${startIndex + index + 1}</td>
      <td>
        <span class="product-code-cell">
          <i class="fas fa-chevron-right chevron-icon"></i>
          <strong>${item.id}</strong>
        </span>
      </td>
      <td>${item.name}</td>
      <td>${item.group}</td>
      <td class="text-center"><span class="qty-cell" style="color: #64748b;">${tonDau}</span></td>
      <td class="text-center"><span class="qty-cell" style="color: #10b981;">${nhapMoi}</span></td>
      <td class="text-center"><span class="qty-cell" style="color: #34d399;">${nhapLai}</span></td>
      <td class="text-center"><span class="qty-cell" style="color: #f59e0b;">${xuatBanHang}</span></td>
      <td class="text-center"><span class="qty-cell" style="color: #f43f5e;">${xuatHuy}</span></td>
      <td class="text-center"><span class="qty-cell" style="font-weight: 700; color: #076eb8;">${tonCuoi}</span></td>
      <td class="text-center">${item.unit}</td>
    `;
    tbody.appendChild(row);

    // Hidden child row
    const subRow = document.createElement("tr");
    subRow.className = "sub-table-row";
    subRow.id = `sub-row-${item.id}`;
    subRow.style.display = (item.id === instockExpandedRowId) ? "table-row" : "none";
    subRow.innerHTML = `
      <td colspan="11">
        <div class="sub-table-container">
          <table class="sub-table">
            <colgroup>
              <col style="width: 3%">
              <col style="width: 12%">
              <col style="width: 15%">
              <col style="width: 9%">
              <col style="width: 5%">
              <col style="width: 10%">
              <col style="width: 10.5%">
              <col style="width: 10.5%">
              <col style="width: 8%">
              <col style="width: 8%">
              <col style="width: 9%">
            </colgroup>
            <thead>
              <tr>
                <th class="text-center">STT</th>
                <th>Mã vật chứa</th>
                <th>Lô hàng</th>
                <th class="text-center">Loại lệnh</th>
                <th class="text-center">Số lượng</th>
                <th class="text-center">Vị trí lưu kho</th>
                <th class="text-center">Ngày tạo</th>
                <th class="text-center">Ngày hoàn thành</th>
                <th class="text-center" style="cursor:pointer;" onclick="toggleInstockSubSort(event)">
                  TG tồn kho 
                  <i class="fas ${instockSubSortDir === 'none' ? 'fa-sort' : (instockSubSortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down')}" 
                     style="margin-left:4px; color:${instockSubSortDir === 'none' ? '#94a3b8' : '#076eb8'}"></i>
                </th>
                <th class="text-center">Ngày hết hạn</th>
                <th class="text-center">Tình trạng</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                let sortedHistory = [...item.history];
                if (instockSubSortDir !== 'none') {
                  sortedHistory.sort((a, b) => {
                    const timeA = parseInstockDateTime(a.executedAt) || 0;
                    const timeB = parseInstockDateTime(b.executedAt) || 0;
                    // Duration is (Now - ExecutedAt). 
                    // So Ascending Duration = 1d, 2d, 3d... => timeA should be Latest to Earliest => timeB - timeA
                    // Descending Duration = 10d, 9d, 8d... => timeA should be Earliest to Latest => timeA - timeB
                    if (instockSubSortDir === 'asc') return timeB - timeA; 
                    return timeA - timeB;
                  });
                }
                return sortedHistory.map((h, i) => `
                <tr>
                  <td class="text-center">${i + 1}</td>
                  <td>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="font-weight: 600; color: #076eb8;">${h.containerId || 'P-N0' + (i+1) + '-L' + (i+1)}</span>
                      <i class="fa-regular fa-copy" style="cursor:pointer; color:#94a3b8; font-size:12px;" onclick="copyToClipboard('${h.containerId}', this)" title="Sao chép"></i>
                    </div>
                  </td>
                  <td>
                    <div style="font-size:13px; font-weight: 600; color: #0284c7;">${h.batchId}</div>
                    <div style="font-size:11px; color: #64748b; margin-top: 1px;">${h.batchName || 'Lô hàng mặc định'}</div>
                  </td>
                  <td class="text-center">
                    <span class="type-badge ${h.type.startsWith('Nhập') ? 'type-in' : 'type-out'}">
                      ${h.type}
                    </span>
                  </td>
                  <td class="text-center">${h.quantity}</td>
                  <td class="text-center" style="font-weight: 600; color: #076eb8;">
                    ${h.type.startsWith('Xuất') ? '<span style="color:#94a3b8;font-weight:400;">—</span>' : h.location}
                  </td>
                  <td class="text-center" style="white-space: nowrap;">${h.createdAt}</td>
                  <td class="text-center" style="white-space: nowrap;">${h.executedAt}</td>
                  <td class="text-center">
                    ${h.type.startsWith('Nhập')
                      ? `<span class="storage-duration-badge">${calcStorageDuration(h.executedAt) || '—'}</span>`
                      : `<span style="color:#94a3b8;font-size:12px;">—</span>`
                    }
                  </td>
                  <td class="text-center">${h.expiryDate || '—'}</td>
                  <td class="text-center">
                    <span class="status-badge ${new Date() > h.expiryTimestamp ? 'status-out' : 'status-in'}">
                      ${new Date() > h.expiryTimestamp ? 'Quá hạn' : 'Bình thường'}
                    </span>
                  </td>
                </tr>
              `).join('');
              })()}
            </tbody>
          </table>
        </div>
      </td>
    `;
    tbody.appendChild(subRow);
  });

  updatePaginationControls(filteredData.length);
}

function toggleRowExpansion(id) {
  const row = document.getElementById(`row-${id}`);
  const subRow = document.getElementById(`sub-row-${id}`);
  if (!row || !subRow) return;

  const isExpanded = row.classList.contains("expanded");

  // Close other expanded rows
  document.querySelectorAll(".clickable-row.expanded").forEach(r => {
    if (r.id !== `row-${id}`) {
      r.classList.remove("expanded");
      const subId = r.id.replace('row-', 'sub-row-');
      const sub = document.getElementById(subId);
      if (sub) sub.style.display = "none";
    }
  });

  if (isExpanded) {
    row.classList.remove("expanded");
    subRow.style.display = "none";
    instockExpandedRowId = null;
  } else {
    row.classList.add("expanded");
    subRow.style.display = "table-row";
    instockExpandedRowId = id;
  }
}

// Filtering Logic
function filterInstockData() {
  const searchText = document.getElementById("instock-search-input").value.toLowerCase();
  const selectedGroup = document.getElementById("group-combobox-input").value;
  const selectedBatch = document.getElementById("batch-combobox-input").value;

  filteredData = instockData.filter(item => {
    const matchText = item.id.toLowerCase().includes(searchText) || 
                      item.name.toLowerCase().includes(searchText);
    const matchGroup = selectedGroup === "Tất cả" || selectedGroup === "" || item.group === selectedGroup;
    const matchBatch = selectedBatch === "Tất cả lô hàng" || selectedBatch === "" || 
                        item.history.some(h => h.batchId === selectedBatch);
    
    // Date filter: check if any movement in history falls within range
    let matchDate = true;
    if (instockActiveStartDate && instockActiveEndDate) {
      matchDate = item.history.some(h => {
        const hTime = parseInstockDateTime(h.executedAt);
        if (hTime === 0) return false;
        const compareStart = new Date(instockActiveStartDate); compareStart.setHours(0,0,0,0);
        const compareEnd = new Date(instockActiveEndDate); compareEnd.setHours(23,59,59,999);
        return hTime >= compareStart.getTime() && hTime <= compareEnd.getTime();
      });
    }

    return matchText && matchGroup && matchBatch && matchDate;
  });

  currentPage = 1;
  renderInstockTable();
}

// Pagination Controls
function updatePaginationControls(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationInfo = document.getElementById("pagination-info");
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  if (paginationInfo) {
    paginationInfo.innerText = `Hiển thị ${startIndex} - ${endIndex} trên tổng ${totalItems}`;
  }

  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  const pageNumbers = document.getElementById("page-numbers");
  if (pageNumbers) {
    pageNumbers.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const pageNum = document.createElement("div");
        pageNum.className = `page-num ${i === currentPage ? "active" : ""}`;
        pageNum.innerText = i;
        pageNum.onclick = () => {
          currentPage = i;
          renderInstockTable();
        };
        pageNumbers.appendChild(pageNum);
      }
  }
}

function instockPrevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderInstockTable();
  }
}

function instockNextPage() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderInstockTable();
  }
}

function instockGotoPage(val) {
  const page = parseInt(val);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderInstockTable();
  }
}

// Combobox Functionality
// --- Date Range Picker Logic (Reused from Inbound) ---
function initInstockDefaultDateRange() {
  const today = new Date();
  instockActiveStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  instockActiveEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  
  const start = new Date(today);
  start.setDate(today.getDate() - 3);
  instockSelectedStartDate = start;
  instockSelectedEndDate = new Date();
  
  instockActiveStartDate = instockSelectedStartDate;
  instockActiveEndDate = instockSelectedEndDate;

  const fmt = d => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const display = document.getElementById('instockDateRangeDisplay');
  if (display) display.textContent = fmt(instockActiveStartDate) + ' - ' + fmt(instockActiveEndDate);

  setTimeout(() => {
    document.querySelectorAll('#instockAnalyticsPicker .sidebar-item[data-range]').forEach(i => {
      i.classList.toggle('active', i.getAttribute('data-range') === 'last3');
    });
  }, 100);
}

function initInstockDatePicker() {
  const trigger = document.getElementById('instockDateRangeTrigger');
  const picker = document.getElementById('instockAnalyticsPicker');
  const applyBtn = document.getElementById('instockApplyPicker');
  const cancelBtn = document.getElementById('instockCancelPicker');
  const clearBtn = document.getElementById('instockClearPicker');
  const rangeItems = document.querySelectorAll('#instockAnalyticsPicker .sidebar-item[data-range]');
  if (!trigger || !picker) return;

  const fmt = d => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  trigger.onclick = e => {
    e.stopPropagation();
    picker.classList.toggle('active');
    if (picker.classList.contains('active')) {
      initInstockPickerDropdowns();
      renderInstockCalendars();
    }
  };
  picker.onclick = e => e.stopPropagation();

  applyBtn?.addEventListener('click', () => {
    if (instockSelectedStartDate && instockSelectedEndDate) {
      instockActiveStartDate = instockSelectedStartDate;
      instockActiveEndDate = instockSelectedEndDate;
      document.getElementById('instockDateRangeDisplay').textContent = fmt(instockActiveStartDate) + ' - ' + fmt(instockActiveEndDate);
      picker.classList.remove('active');
      currentPage = 1;
      filterInstockData();
    } else if (!instockSelectedStartDate && !instockSelectedEndDate) {
      instockActiveStartDate = null;
      instockActiveEndDate = null;
      document.getElementById('instockDateRangeDisplay').textContent = 'Tất cả thời gian';
      picker.classList.remove('active');
      currentPage = 1;
      filterInstockData();
    }
  });

  cancelBtn?.addEventListener('click', () => {
    instockSelectedStartDate = instockActiveStartDate;
    instockSelectedEndDate = instockActiveEndDate;
    picker.classList.remove('active');
  });

  clearBtn?.addEventListener('click', () => {
    instockSelectedStartDate = null;
    instockSelectedEndDate = null;
    instockActiveStartDate = null;
    instockActiveEndDate = null;
    document.getElementById('instockDateRangeDisplay').textContent = 'dd/mm/yyyy - dd/mm/yyyy';
    rangeItems.forEach(i => i.classList.remove('active'));
    renderInstockCalendars();
    currentPage = 1;
    filterInstockData();
  });

  rangeItems.forEach(item => {
    item.onclick = e => {
      e.stopPropagation();
      rangeItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const range = item.getAttribute('data-range');
      const today = new Date();
      let start = new Date(), end = new Date();
      switch (range) {
        case 'all': start = null; end = null; break;
        case 'today': start = today; end = today; break;
        case 'last3': start.setDate(today.getDate() - 3); break;
        case 'thisweek': { const dow = today.getDay(); start.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1)); break; }
        case 'last7': start.setDate(today.getDate() - 7); break;
        case 'last30': start.setDate(today.getDate() - 30); break;
        case 'last3mo': start.setMonth(today.getMonth() - 3); break;
        case 'last6mo': start.setMonth(today.getMonth() - 6); break;
        case 'last1yr': start.setFullYear(today.getFullYear() - 1); break;
      }
      instockSelectedStartDate = start;
      instockSelectedEndDate = end;
      if (start && end) {
        instockCurrentViewLeft = new Date(start);
        instockCurrentViewRight = new Date(end);
        if (instockCurrentViewLeft.getMonth() === instockCurrentViewRight.getMonth() && instockCurrentViewLeft.getFullYear() === instockCurrentViewRight.getFullYear()) {
          instockCurrentViewRight.setMonth(instockCurrentViewRight.getMonth() + 1);
        }
      }
      renderInstockCalendars();
      updateInstockTempDisplay();
    };
  });

  document.addEventListener('click', e => {
    if (!picker.contains(e.target) && !trigger.contains(e.target)) picker.classList.remove('active');
  });
}

function initInstockPickerDropdowns() {
  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const shortMonths = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

  const populate = (listId, selectedId, opts, isMonth, isLeft) => {
    const listEl = document.getElementById(listId);
    const selectedEl = document.getElementById(selectedId);
    if (!listEl || !selectedEl) return;
    listEl.innerHTML = opts.map((opt, idx) => `<div class="dropdown-item" data-value="${isMonth ? idx : opt}">${opt}</div>`).join('');
    listEl.querySelectorAll('.dropdown-item').forEach(item => {
      item.onclick = e => {
        e.stopPropagation();
        const val = parseInt(item.getAttribute('data-value'));
        if (isMonth) {
          if (isLeft) instockCurrentViewLeft.setMonth(val);
          else instockCurrentViewRight.setMonth(val);
          selectedEl.textContent = months[val];
        } else {
          if (isLeft) instockCurrentViewLeft.setFullYear(val);
          else instockCurrentViewRight.setFullYear(val);
          selectedEl.textContent = val;
        }
        listEl.parentElement.classList.remove('active');
        renderInstockCalendars();
      };
    });
  };

  populate('instockLeftMonthList', 'instockLeftMonthSelected', shortMonths, true, true);
  populate('instockRightMonthList', 'instockRightMonthSelected', shortMonths, true, false);
  populate('instockLeftYearList', 'instockLeftYearSelected', years, false, true);
  populate('instockRightYearList', 'instockRightYearSelected', years, false, false);

  document.getElementById('instockLeftMonthSelected').textContent = months[instockCurrentViewLeft.getMonth()];
  document.getElementById('instockLeftYearSelected').textContent = instockCurrentViewLeft.getFullYear();
  document.getElementById('instockRightMonthSelected').textContent = months[instockCurrentViewRight.getMonth()];
  document.getElementById('instockRightYearSelected').textContent = instockCurrentViewRight.getFullYear();

  ['instockLeftMonthDropdown', 'instockLeftYearDropdown', 'instockRightMonthDropdown', 'instockRightYearDropdown'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onclick = e => {
      e.stopPropagation();
      const isActive = el.classList.contains('active');
      document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('active'));
      if (!isActive) el.classList.add('active');
    };
  });
}

function renderInstockCalendars() {
  const leftContainer = document.querySelector('#instockLeftCalendar .days-container');
  const rightContainer = document.querySelector('#instockRightCalendar .days-container');
  if (!leftContainer || !rightContainer) return;

  const render = (container, viewDate) => {
    container.innerHTML = '';
    const year = viewDate.getFullYear(), month = viewDate.getMonth();
    const firstDayRaw = new Date(year, month, 1).getDay();
    const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) container.insertAdjacentHTML('beforeend', '<div class="calendar-day empty"></div>');
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      let cls = 'calendar-day';
      if (instockSelectedStartDate && date.toDateString() === instockSelectedStartDate.toDateString()) cls += ' selected range-start';
      if (instockSelectedEndDate && date.toDateString() === instockSelectedEndDate.toDateString()) cls += ' selected range-end';
      if (instockSelectedStartDate && instockSelectedEndDate && date > instockSelectedStartDate && date < instockSelectedEndDate) cls += ' in-range';
      if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) cls += ' today';
      const dayEl = document.createElement('div');
      dayEl.className = cls;
      dayEl.textContent = d;
      dayEl.onclick = e => {
        e.stopPropagation();
        handleInstockDateClick(date);
      };
      container.appendChild(dayEl);
    }
  };

  render(leftContainer, instockCurrentViewLeft);
  render(rightContainer, instockCurrentViewRight);
  updateInstockTempDisplay();
}

function handleInstockDateClick(date) {
  if (!instockSelectedStartDate || (instockSelectedStartDate && instockSelectedEndDate)) {
    instockSelectedStartDate = date;
    instockSelectedEndDate = null;
  } else if (date < instockSelectedStartDate) {
    instockSelectedEndDate = instockSelectedStartDate;
    instockSelectedStartDate = date;
  } else {
    instockSelectedEndDate = date;
  }
  renderInstockCalendars();
}

function updateInstockTempDisplay() {
  const el = document.getElementById('instockTempRangeDisplay');
  if (!el) return;
  const fmt = d => d ? d.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '...';
  el.textContent = fmt(instockSelectedStartDate) + ' — ' + fmt(instockSelectedEndDate);
}

// --- Original Logic ---
function populateGroupDropdown() {
  const list = document.getElementById("group-combobox-list");
  if (!list) return;
  list.innerHTML = `<li class="combobox-option selected" onclick="selectGroup('Tất cả')">Tất cả</li>`;
  
  productGroups.forEach(group => {
    const li = document.createElement("li");
    li.className = "combobox-option";
    li.innerText = group;
    li.onclick = () => selectGroup(group);
    list.appendChild(li);
  });
}

function toggleInstockGroupCombobox() {
  const dropdown = document.getElementById("group-combobox-dropdown");
  if (dropdown) dropdown.classList.toggle("show");
}

function selectGroup(group) {
  const input = document.getElementById("group-combobox-input");
  if (input) input.value = group;
  
  // Update selection style
  const options = document.querySelectorAll("#group-combobox-list .combobox-option");
  options.forEach(opt => {
    if (opt.innerText === group) opt.classList.add("selected");
    else opt.classList.remove("selected");
  });
  
  const dropdown = document.getElementById("group-combobox-dropdown");
  if (dropdown) dropdown.classList.remove("show");
  filterInstockData();
}

function handleInstockGroupComboboxSearch(input) {
  const searchText = input.value.toLowerCase();
  const dropdown = document.getElementById("group-combobox-dropdown");
  if (dropdown) dropdown.classList.add("show");
  
  const options = document.querySelectorAll("#group-combobox-list .combobox-option");
  options.forEach(opt => {
    const text = opt.innerText.toLowerCase();
    if (text.includes(searchText)) {
      opt.style.display = "block";
    } else {
      opt.style.display = "none";
    }
  });
}

// Close dropdown when clicking outside
window.addEventListener("click", (e) => {
  const groupDropdown = document.getElementById("group-combobox-dropdown");
  if (groupDropdown && !e.target.closest("#group-combobox-wrapper") && !e.target.closest("#group-combobox-dropdown")) {
    groupDropdown.classList.remove("show");
  }
  const batchDropdown = document.getElementById("batch-combobox-dropdown");
  if (batchDropdown && !e.target.closest("#batch-combobox-wrapper") && !e.target.closest("#batch-combobox-dropdown")) {
    batchDropdown.classList.remove("show");
  }
});

// --- Batch Filter Implementation ---
function populateBatchDropdown() {
  const list = document.getElementById("batch-combobox-list");
  if (!list) return;
  list.innerHTML = `<li class="combobox-option selected" onclick="selectInstockBatch('Tất cả lô hàng')">Tất cả lô hàng</li>`;
  
  instockBatchCodes.sort().forEach(batchId => {
    const li = document.createElement("li");
    li.className = "combobox-option";
    li.innerText = batchId;
    li.onclick = () => selectInstockBatch(batchId);
    list.appendChild(li);
  });
}

function initInstockBatchCombobox() {
  const input = document.getElementById("batch-combobox-input");
  const arrow = document.getElementById("batch-combobox-arrow");
  if (!input || !arrow) return;

  input.onclick = () => toggleInstockBatchCombobox();
  arrow.onclick = (e) => {
    e.stopPropagation();
    toggleInstockBatchCombobox();
  };

  input.onkeyup = (e) => {
    handleInstockBatchComboboxSearch(e.target);
  };
}

function toggleInstockBatchCombobox() {
  const dropdown = document.getElementById("batch-combobox-dropdown");
  if (dropdown) dropdown.classList.toggle("show");
}

function selectInstockBatch(batchId) {
  const input = document.getElementById("batch-combobox-input");
  if (input) input.value = batchId;
  
  const options = document.querySelectorAll("#batch-combobox-list .combobox-option");
  options.forEach(opt => {
    if (opt.innerText === batchId) opt.classList.add("selected");
    else opt.classList.remove("selected");
  });
  
  const dropdown = document.getElementById("batch-combobox-dropdown");
  if (dropdown) dropdown.classList.remove("show");
  filterInstockData();
}

function handleInstockBatchComboboxSearch(input) {
  const searchText = input.value.toLowerCase();
  const dropdown = document.getElementById("batch-combobox-dropdown");
  if (dropdown) dropdown.classList.add("show");
  
  const options = document.querySelectorAll("#batch-combobox-list .combobox-option");
  options.forEach(opt => {
    const text = opt.innerText.toLowerCase();
    opt.style.display = text.includes(searchText) ? "block" : "none";
  });
}

async function exportInstockExcel() {
  if (typeof ExcelJS === 'undefined') {
    alert("Vui lòng đợi thư viện Excel tải xong!");
    return;
  }

  // ── Template column mapping (1-based) ──────────────────────────────────────
  // B(2)=TT, E(5)=Loại thùng, G(7)=Phẩm cấp, I(9)=ĐVT
  // J(10)=Tồn đầu, K(11)=Nhập mới, L(12)=Nhập lại
  // M(13)=Xuất bán, N(14)=Xuất hủy, O(15)=Tồn cuối
  // P(16)=Tồn 1-3 ngày, Q(17)=Tồn 4-7 ngày, R(18)=Tồn 8-10 ngày
  // S(19)=Tồn 11-15 ngày, T(20)=Tồn >15 ngày
  const COL = { TT:2, LOAI_THUNG:5, PHAM_CAP:7, DVT:9,
                TON_DAU:10, NHAP_MOI:11, NHAP_LAI:12,
                XUAT_BAN:13, XUAT_HUY:14, TON_CUOI:15,
                TON_1_3:16, TON_4_7:17, TON_8_10:18, TON_11_15:19, TON_GT15:20 };
  const DATA_START_ROW   = 9;
  const TEMPLATE_N_ROWS  = 6;
  // ───────────────────────────────────────────────────────────────────────────

  // ── Helper: calculate storage-time buckets for one item ───────────────────
  // Logic: Calculate aging buckets for the Tồn cuối (Closing Balance) as of the endDate.
  // We look at ALL history up to endDate to find which batches are still in hand.
  function calcStorageBuckets(item) {
    const endDate = instockActiveEndDate ? instockActiveEndDate.getTime() : Infinity;
    const now     = Date.now();

    const inEntries  = [];
    const outEntries = [];
    item.history.forEach(h => {
      const t = parseInstockDateTime(h.executedAt);
      if (t <= endDate) {
        if (h.type.startsWith("Nhập")) inEntries.push({ t, qty: h.quantity || 0 });
        else                            outEntries.push({ qty: h.quantity || 0 });
      }
    });

    // Sort Nhập by time (oldest first) for FIFO
    inEntries.sort((a, b) => a.t - b.t);

    // Total quantity exported within range
    let totalOut = outEntries.reduce((s, e) => s + e.qty, 0);

    // FIFO: consume oldest Nhập batches first with the total out quantity
    const remaining = [];
    for (const e of inEntries) {
      if (totalOut <= 0) {
        remaining.push({ t: e.t, qty: e.qty });
      } else if (totalOut >= e.qty) {
        totalOut -= e.qty; // fully consumed
      } else {
        remaining.push({ t: e.t, qty: e.qty - totalOut });
        totalOut = 0;
      }
    }

    // Bucket remaining by age (days since executedAt)
    let b1_3 = 0, b4_7 = 0, b8_10 = 0, b11_15 = 0, bGt15 = 0;
    remaining.forEach(({ t, qty }) => {
      const days = (now - t) / (1000 * 60 * 60 * 24);
      if      (days <= 3)  b1_3   += qty;
      else if (days <= 7)  b4_7   += qty;
      else if (days <= 10) b8_10  += qty;
      else if (days <= 15) b11_15 += qty;
      else                 bGt15  += qty;
    });

    return { b1_3, b4_7, b8_10, b11_15, bGt15 };
  }

  try {
    // ── 1. Calculate data for each filtered item ──────────────────────────────
    const startDate = instockActiveStartDate ? instockActiveStartDate.getTime() : 0;
    const endDate   = instockActiveEndDate   ? instockActiveEndDate.getTime()   : Infinity;

    const rows = filteredData.map((item, idx) => {
      let tonDau = 0, nhapMoi = 0, nhapLai = 0, xuatBan = 0, xuatHuy = 0;
      item.history.forEach(h => {
        const t   = parseInstockDateTime(h.executedAt);
        const qty = h.quantity || 0;
        if (t < startDate) {
          tonDau += h.type.startsWith("Nhập") ? qty : -qty;
        } else if (t >= startDate && t <= endDate) {
          if      (h.type === "Nhập mới")      nhapMoi += qty;
          else if (h.type === "Nhập lại")       nhapLai += qty;
          else if (h.type === "Xuất bán hàng") xuatBan += qty;
          else if (h.type === "Xuất hủy")       xuatHuy += qty;
        }
      });
      const loaiThung = item.name.split(" - ").pop().trim();
      const phamCap   = item.group;
      const buckets   = calcStorageBuckets(item);
      return {
        tt: idx + 1,
        loaiThung,
        phamCap,
        dvt: item.unit || "Thùng",
        tonDau,
        nhapMoi,
        nhapLai,
        xuatBan,
        xuatHuy,
        tonCuoi: tonDau + nhapMoi + nhapLai - xuatBan - xuatHuy,
        ...buckets,
      };
    });

    // ── 2. Load template ──────────────────────────────────────────────────────
    const workbook = new ExcelJS.Workbook();
    let ws;

    const templatePaths = [
      'asset/files/instock_report.xlsx',
      'instock_report.xlsx',
      './instock_report.xlsx',
    ];
    let loaded = false;
    for (const path of templatePaths) {
      try {
        const res = await fetch(path);
        if (res.ok) {
          await workbook.xlsx.load(await res.arrayBuffer());
          ws = workbook.getWorksheet(1);
          loaded = true;
          break;
        }
      } catch (_) { /* try next */ }
    }

    if (!loaded || !ws) {
      alert("Không tìm thấy file template instock_report.xlsx. Vui lòng đặt file vào đúng thư mục.");
      return;
    }

    // ── 3. Clone row style helper ─────────────────────────────────────────────
    function copyCellStyle(src, dst) {
      if (src.font)      dst.font      = Object.assign({}, src.font);
      if (src.fill)      dst.fill      = JSON.parse(JSON.stringify(src.fill));
      if (src.border)    dst.border    = JSON.parse(JSON.stringify(src.border));
      if (src.alignment) dst.alignment = Object.assign({}, src.alignment);
      dst.numFmt = src.numFmt || 'General';
    }

    // ── 4. Expand / shrink data rows to match rows.length ────────────────────
    const nData       = rows.length;
    const lastDataRow = DATA_START_ROW + TEMPLATE_N_ROWS - 1;

    if (nData > TEMPLATE_N_ROWS) {
      const toInsert = nData - TEMPLATE_N_ROWS;
      ws.spliceRows(lastDataRow + 1, 0, ...Array(toInsert).fill([]));
      for (let i = 0; i < toInsert; i++) {
        const newR = lastDataRow + 1 + i;
        for (let c = 1; c <= 20; c++) {
          copyCellStyle(ws.getCell(DATA_START_ROW, c), ws.getCell(newR, c));
        }
      }
    } else if (nData < TEMPLATE_N_ROWS) {
      const toRemove = TEMPLATE_N_ROWS - nData;
      ws.spliceRows(DATA_START_ROW + nData, toRemove);
    }

    // ── 5. Fill data into rows ────────────────────────────────────────────────
    // Auto-fit widths: track max char length per column
    let maxLoaiThung = 10, maxPhamCap = 10;

    rows.forEach((r, i) => {
      const rowNum = DATA_START_ROW + i;

      ws.getCell(rowNum, COL.TT).value = r.tt;

      // Loại thùng – center align + track width
      const cellLT = ws.getCell(rowNum, COL.LOAI_THUNG);
      cellLT.value = r.loaiThung;
      cellLT.alignment = { horizontal: 'center', vertical: 'center', wrapText: false };
      if (r.loaiThung.length > maxLoaiThung) maxLoaiThung = r.loaiThung.length;

      // Phẩm cấp – track width
      const cellPC = ws.getCell(rowNum, COL.PHAM_CAP);
      cellPC.value = r.phamCap;
      if (r.phamCap.length > maxPhamCap) maxPhamCap = r.phamCap.length;

      ws.getCell(rowNum, COL.DVT     ).value = r.dvt;
      ws.getCell(rowNum, COL.TON_DAU ).value = r.tonDau || 0;
      ws.getCell(rowNum, COL.NHAP_MOI).value = r.nhapMoi || 0;
      ws.getCell(rowNum, COL.NHAP_LAI).value = r.nhapLai || 0;
      ws.getCell(rowNum, COL.XUAT_BAN).value = r.xuatBan || 0;
      ws.getCell(rowNum, COL.XUAT_HUY).value = r.xuatHuy || 0;

      // Fill explicit value for compatibility, formula as backup
      const tonCuoiCell = ws.getCell(rowNum, COL.TON_CUOI);
      tonCuoiCell.value = r.tonCuoi;
      // tonCuoiCell.value = { formula: `J${rowNum}+K${rowNum}+L${rowNum}-M${rowNum}-N${rowNum}`, result: r.tonCuoi };

      // Storage-time buckets
      ws.getCell(rowNum, COL.TON_1_3  ).value = r.b1_3   || 0;
      ws.getCell(rowNum, COL.TON_4_7  ).value = r.b4_7   || 0;
      ws.getCell(rowNum, COL.TON_8_10 ).value = r.b8_10  || 0;
      ws.getCell(rowNum, COL.TON_11_15).value = r.b11_15 || 0;
      ws.getCell(rowNum, COL.TON_GT15 ).value = r.bGt15  || 0;
    });

    // Apply auto-fit column widths (add padding)
    ws.getColumn(COL.LOAI_THUNG).width = maxLoaiThung + 3;
    ws.getColumn(COL.PHAM_CAP  ).width = maxPhamCap   + 3;

    // ── 6. Update TỔNG row formulas with explicit results ───────────────────
    const totalRow = DATA_START_ROW + nData;
    const firstR   = DATA_START_ROW;
    const lastR    = DATA_START_ROW + nData - 1;

    // Calculate totals in JS for the "result" field (better compatibility)
    const totals = {};
    const colsToSum = [
      COL.TON_DAU, COL.NHAP_MOI, COL.NHAP_LAI,
      COL.XUAT_BAN, COL.XUAT_HUY, COL.TON_CUOI,
      COL.TON_1_3, COL.TON_4_7, COL.TON_8_10, COL.TON_11_15, COL.TON_GT15
    ];
    colsToSum.forEach(c => totals[c] = 0);
    
    rows.forEach(r => {
      totals[COL.TON_DAU]  += (r.tonDau || 0);
      totals[COL.NHAP_MOI] += (r.nhapMoi || 0);
      totals[COL.NHAP_LAI] += (r.nhapLai || 0);
      totals[COL.XUAT_BAN] += (r.xuatBan || 0);
      totals[COL.XUAT_HUY] += (r.xuatHuy || 0);
      totals[COL.TON_CUOI] += (r.tonCuoi || 0);
      totals[COL.TON_1_3]  += (r.b1_3 || 0);
      totals[COL.TON_4_7]  += (r.b4_7 || 0);
      totals[COL.TON_8_10] += (r.b8_10 || 0);
      totals[COL.TON_11_15]+= (r.b11_15 || 0);
      totals[COL.TON_GT15] += (r.bGt15 || 0);
    });

    colsToSum.forEach(c => {
      const colLetter = ws.getColumn(c).letter;
      const cell = ws.getCell(totalRow, c);
      cell.value = {
        formula: `SUM(${colLetter}${firstR}:${colLetter}${lastR})`,
        result: totals[c]
      };
      // Force numeric format to avoid ##### if template has Date format
      cell.numFmt = '#,##0';
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    // Auto-fit quantity columns if needed
    for (let c = 10; c <= 20; c++) {
      if (ws.getColumn(c).width < 10) ws.getColumn(c).width = 10;
    }

    // ── 7. Update date in header ──────────────────────────────────────────────
    const now  = new Date();
    const dd   = String(now.getDate()).padStart(2, '0');
    const mm   = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    ws.getCell('Q4').value = `Ngày: ${dd} / ${mm}/ ${yyyy}`;

    // ── 8. Save ───────────────────────────────────────────────────────────────
    const buffer  = await workbook.xlsx.writeBuffer();
    const blob    = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const dateStr = `${dd}-${mm}-${yyyy}`;
    saveAs(blob, `Báo cáo tồn kho ${dateStr}.xlsx`);

    if (window.showToast) window.showToast('Xuất báo cáo thành công!', 'success');
  } catch (err) {
    console.error("Excel Export Error:", err);
    alert("Có lỗi xảy ra khi xuất báo cáo: " + err.message);
  }
}

// Initialize on Load
function initInstockModule() {
  initMockData();
  initInstockDefaultDateRange();
  initInstockDatePicker();
  
  populateGroupDropdown();
  populateBatchDropdown();
  initInstockBatchCombobox();
  
  filterInstockData();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInstockModule);
} else {
    initInstockModule();
}

// ── Copy to Clipboard ──────────────────────────────────────────
function copyToClipboard(text, el) {
  if (!navigator.clipboard) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand('copy'); showCopyPopover(el); } catch (e) { }
      document.body.removeChild(ta);
  } else {
      navigator.clipboard.writeText(text).then(() => showCopyPopover(el));
  }
}

function showCopyPopover(el) {
  if (!el) return;
  document.querySelector('.copy-popover')?.remove();
  const rect = el.getBoundingClientRect();
  const popover = document.createElement('div');
  popover.className = 'copy-popover';
  popover.innerText = 'Copied!';
  document.body.appendChild(popover);
  popover.style.left = (rect.left + rect.width / 2) + 'px';
  popover.style.top = (rect.top - 8) + 'px';

  // Basic styling for popover if not in CSS
  popover.style.position = 'fixed';
  popover.style.backgroundColor = '#334155';
  popover.style.color = '#fff';
  popover.style.padding = '4px 8px';
  popover.style.borderRadius = '4px';
  popover.style.fontSize = '12px';
  popover.style.zIndex = '10000';
  popover.style.transform = 'translateX(-50%)';
  popover.style.pointerEvents = 'none';

  setTimeout(() => popover.remove(), 1000);
}

// ── Sub-table Sorting ──────────────────────────────────────────
function toggleInstockSubSort(event) {
  if (event) event.stopPropagation();
  if (instockSubSortDir === 'none') instockSubSortDir = 'asc';
  else if (instockSubSortDir === 'asc') instockSubSortDir = 'desc';
  else instockSubSortDir = 'none';
  renderInstockTable();
}
