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

// Product groups (Categories) collected from bananaData
let productGroups = [];

// Initialize Data
function initMockData() {
  const products = [];
  const groupsSet = new Set();

  bananaData.forEach(line => {
    line.categories.forEach(cat => {
      const groupValue = `${line.dong_san_pham} - ${cat.pham_cap}`;
      groupsSet.add(groupValue);
      
      cat.products.forEach(p => {
        const fullName = `${line.dong_san_pham} - ${cat.pham_cap} - ${p.loai_thung}`;
        const prodCode = `${cat.pham_cap} - ${p.loai_thung}`;
        
        // Generate history first
        const history = generateMockHistory(prodCode);
        
        // Ensure total quantity is positive by forcing a large initial Nhập
        let totalQty = 0;
        history.forEach(h => {
          if (h.type === "Nhập kho") totalQty += h.quantity;
          else if (h.type === "Xuất kho") totalQty -= h.quantity;
        });

        // If negative (shouldn't happen with our refined history logic but as a safety)
        if (totalQty < 0) {
            history[0].type = "Nhập kho";
            history[0].status = "Đã nhập kho";
            history[0].quantity += Math.abs(totalQty) + 20;
            totalQty = history.reduce((sum, h) => sum + (h.type === "Nhập kho" ? h.quantity : -h.quantity), 0);
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

  productGroups = Array.from(groupsSet).sort();

  instockData = [...products];
  filteredData = [...instockData];
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
    // Force first item to be "Nhập kho" to ensure positive stock
    const isInput = i === 1 ? true : Math.random() > 0.4;
    const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
    const floor = Math.floor(Math.random() * 2) + 1;
    const col = columns[Math.floor(Math.random() * columns.length)];
    const row = Math.floor(Math.random() * 10) + 1;
    const location = `Kho mát ${warehouse} - ${floor}-${col}${row}`;

    // Random container prefix
    const prefix = containerPrefixes[Math.floor(Math.random() * containerPrefixes.length)];
    const containerId = `${prefix}_${i}`;

    history.push({
      id: `ORD-${productId}-${i}`,
      containerId: containerId,
      type: isInput ? "Nhập kho" : "Xuất kho",
      quantity: Math.floor(Math.random() * 50) + 5,
      location: location,
      createdAt: "10:30 14/04/2026",
      executedAt: "11:15 14/04/2026",
      status: isInput ? "Đã nhập kho" : "Đã xuất kho",
      creator: users[Math.floor(Math.random() * users.length)]
    });
  }
  return history;
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
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">Không tìm thấy sản phẩm nào</td></tr>`;
    updatePaginationControls(0);
    return;
  }

  pageData.forEach((item, index) => {
    const row = document.createElement("tr");
    row.className = "clickable-row";
    row.id = `row-${item.id}`;
    row.onclick = () => toggleRowExpansion(item.id);
    row.innerHTML = `
      <td class="text-center">${startIndex + index + 1}</td>
      <td><strong>${item.id}</strong></td>
      <td>${item.name}</td>
      <td>${item.group}</td>
      <td class="text-center"><span class="qty-cell">${item.quantity}</span></td>
      <td class="text-center">${item.unit}</td>
    `;
    tbody.appendChild(row);

    // Hidden child row
    const subRow = document.createElement("tr");
    subRow.className = "sub-table-row";
    subRow.id = `sub-row-${item.id}`;
    subRow.style.display = "none";
    subRow.innerHTML = `
      <td colspan="6">
        <div class="sub-table-container">
          <table class="sub-table">
            <thead>
              <tr>
                <th class="text-center">STT</th>
                <th>Mã lệnh</th>
                <th>Mã vật chứa</th>
                <th class="text-center">Loại lệnh</th>
                <th class="text-center">Số lượng</th>
                <th class="text-center">Vị trí lưu kho</th>
                <th class="text-center">Ngày tạo</th>
                <th class="text-center">Ngày thực hiện</th>
                <th class="text-center">Tình trạng</th>
                <th class="text-center">Người tạo</th>
              </tr>
            </thead>
            <tbody>
              ${item.history.map((h, i) => `
                <tr>
                  <td class="text-center">${i + 1}</td>
                  <td>${h.id}</td>
                  <td style="font-weight: 500; color: #475569;">${h.containerId}</td>
                  <td class="text-center">
                    <span class="type-badge ${h.type === 'Nhập kho' ? 'type-in' : 'type-out'}">
                      ${h.type}
                    </span>
                  </td>
                  <td class="text-center">${h.quantity}</td>
                  <td class="text-center" style="font-weight: 600; color: #076eb8;">${h.location}</td>
                  <td class="text-center">${h.createdAt}</td>
                  <td class="text-center">${h.executedAt}</td>
                  <td class="text-center">
                    <span class="status-badge ${h.status === 'Đã nhập kho' ? 'status-in' : 'status-out'}">
                      ${h.status}
                    </span>
                  </td>
                  <td class="text-center">
                    <div class="user-info" style="align-items: center;">
                      <span class="user-fullname">${h.creator.fullname}</span>
                      <span class="user-username">${h.creator.username}</span>
                    </div>
                  </td>
                </tr>
              `).join('')}
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
  } else {
    row.classList.add("expanded");
    subRow.style.display = "table-row";
  }
}

// Filtering Logic
function filterInstockData() {
  const searchText = document.getElementById("instock-search-input").value.toLowerCase();
  const selectedGroup = document.getElementById("group-combobox-input").value;

  filteredData = instockData.filter(item => {
    const matchText = item.id.toLowerCase().includes(searchText) || 
                      item.name.toLowerCase().includes(searchText);
    const matchGroup = selectedGroup === "Tất cả" || selectedGroup === "" || item.group === selectedGroup;
    return matchText && matchGroup;
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
  const dropdown = document.getElementById("group-combobox-dropdown");
  if (dropdown && !e.target.closest("#group-combobox-wrapper") && !e.target.closest("#group-combobox-dropdown")) {
    dropdown.classList.remove("show");
  }
});

async function exportInstockExcel() {
  if (typeof ExcelJS === 'undefined') {
    alert("Vui lòng đợi thư viện Excel tải xong!");
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ton_Kho');

    // Title
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'DANH SÁCH TỒN KHO CHI TIẾT';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF076EB8' } // Primary Blue
    };

    // Headers
    const headerRow = worksheet.addRow(['STT', 'Mã sản phẩm', 'Tên sản phẩm', 'Nhóm sản phẩm', 'Số lượng', 'Đơn vị tính']);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF334155' } // Slate color
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { horizontal: 'center' };
    });

    // Content
    filteredData.forEach((item, index) => {
      const row = worksheet.addRow([
        index + 1,
        item.id,
        item.name,
        item.group,
        item.quantity,
        item.unit
      ]);

      // Alignments & Borders
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (colNumber === 1 || colNumber === 5 || colNumber === 6) {
          cell.alignment = { horizontal: 'center' };
        }
        if (colNumber === 5) {
          cell.font = { color: { argb: 'FF076EB8' }, bold: true };
        }
      });
    });

    // Column Widths
    worksheet.getColumn(1).width = 8;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 50;
    worksheet.getColumn(4).width = 40;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;

    // Save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Dữ liệu tồn kho ${new Date().toISOString().split('T')[0]}.xlsx`);

    if (window.showToast) window.showToast('Xuất file Excel thành công!', 'success');
  } catch (err) {
    console.error("Excel Export Error:", err);
    alert("Có lỗi xảy ra khi xuất file Excel.");
  }
}

// Initialize on Load
document.addEventListener("DOMContentLoaded", initMockData);

// Fallback init
if (document.readyState === "complete" || document.readyState === "interactive") {
    initMockData();
}
