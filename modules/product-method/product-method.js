// Mock Data based on "Danh mục chung/Sản phẩm"
const rawData = [
  { code: 'VT001', name: 'Bulong lục giác M8x50', group: 'Kim khí & Vật tư phụ' },
  { code: 'VT002', name: 'Đai ốc M10', group: 'Kim khí & Vật tư phụ' },
  { code: 'VT003', name: 'Long đen phẳng M12', group: 'Kim khí & Vật tư phụ' },
  { code: 'VT004', name: 'Vít gỗ đầu bằng 4x30', group: 'Kim khí & Vật tư phụ' },
  { code: 'VT005', name: 'Mũi khoan sắt 5.0mm', group: 'Dụng cụ Cắt gọt' },
  { code: 'VT006', name: 'Mũi taro M6x1.0', group: 'Dụng cụ Cắt gọt' },
  { code: 'VT007', name: 'Đá mài 100x6x16', group: 'Dụng cụ Cắt gọt' },
  { code: 'VT008', name: 'Đá cắt 355mm', group: 'Dụng cụ Cắt gọt' },
  { code: 'VT009', name: 'Dao phay ngón D10', group: 'Dụng cụ Cắt gọt' },
  { code: 'VT010', name: 'Kim điện 8 inch', group: 'Dụng cụ Cầm tay' }
];

// Generate 45 items based on the pattern
const allProducts = Array.from({ length: 45 }, (_, i) => {
  const base = rawData[i % rawData.length];
  return {
    id: i + 1,
    code: `VT${String(i + 1).padStart(3, '0')}`,
    name: base.name,
    group: base.group,
    method: i % 2 === 0 ? 'FIFO' : i % 3 === 0 ? 'FEFO' : 'LIFO'
  };
});

let filteredProducts = [...allProducts];
let currentPage = 1;
const itemsPerPage = 20;

// Initialize
function initModule() {
  renderTable();
  setupScrollSync();
  populateGroupFilter();
}

function populateGroupFilter() {
  const filterMenu = document.getElementById('group-filter-menu');
  if (!filterMenu) return;
  
  const groups = [...new Set(allProducts.map(p => p.group))];
  let items = `<div class="custom-dropdown-item selected" onclick="selectFilterOption('group', '', 'Tất cả nhóm')">Tất cả nhóm</div>`;
  
  groups.forEach(group => {
    items += `<div class="custom-dropdown-item" onclick="selectFilterOption('group', '${group}', '${group}')">${group}</div>`;
  });
  
  filterMenu.innerHTML = items;
}

// Custom Filter Dropdown Logic
window.toggleFilterDropdown = function (typeOrEl) {
  let menu;
  if (typeof typeOrEl === 'string') {
    menu = document.getElementById(`${typeOrEl}-filter-menu`);
  } else {
    // Row-level dropdown: toggle relative to the element
    menu = typeOrEl.closest('.custom-dropdown').querySelector('.custom-dropdown-menu');
  }
  
  if (!menu) return;

  const isVisible = menu.classList.contains('show');
  document.querySelectorAll('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
  if (!isVisible) menu.classList.add('show');
};

window.selectFilterOption = function (type, value, label) {
  if (type === 'group') {
    const input = document.getElementById('group-filter');
    const display = document.getElementById('group-filter-display');
    if (input) input.value = value;
    if (display) display.innerText = label;
  }

  const menu = document.getElementById(`${type}-filter-menu`);
  if (menu) {
    const items = menu.querySelectorAll('.custom-dropdown-item');
    items.forEach(item => {
      if (item.innerText === label) item.classList.add('selected');
      else item.classList.remove('selected');
    });
    menu.classList.remove('show');
  }

  filterProducts();
};

window.selectBulkOption = function (value, label) {
  const hiddenInput = document.getElementById('bulk-method-select');
  const displayLabel = document.getElementById('method-bulk-display');
  const menu = document.getElementById('method-filter-menu');

  if (hiddenInput) hiddenInput.value = value;
  if (displayLabel) displayLabel.innerText = label;

  if (menu) {
    const items = menu.querySelectorAll('.custom-dropdown-item');
    items.forEach(item => {
      if (item.innerText === label) item.classList.add('selected');
      else item.classList.remove('selected');
    });
    menu.classList.remove('show');
  }
};

window.selectRowOption = function (productId, value) {
  const product = allProducts.find(p => p.id === productId);
  if (product) {
    product.method = value;
    // Sync with filtered list
    const filteredProd = filteredProducts.find(p => p.id === productId);
    if (filteredProd) filteredProd.method = value;
  }

  // Close all menus
  document.querySelectorAll('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
  
  // Re-render only this part or full table
  renderTable();

  // Show global toast
  if (typeof showToast === 'function') {
    showToast('Thiết lập quy cách cho sản phẩm thành công', 'success');
  }
};

// Close filter dropdowns when clicking outside
window.addEventListener('click', function (e) {
  if (!e.target.closest('.custom-dropdown')) {
    const menus = document.querySelectorAll('.custom-dropdown-menu');
    menus.forEach(m => m.classList.remove('show'));
  }
});

// Sync Horizontal Scroll
function setupScrollSync() {
  const scrollHead = document.querySelector('.table-scroll-head');
  const scrollBody = document.querySelector('.table-scroll-body');
  
  if (scrollHead && scrollBody) {
    scrollBody.addEventListener('scroll', () => {
      scrollHead.scrollLeft = scrollBody.scrollLeft;
    });
  }
}

// Render Table
function renderTable() {
  const tableBody = document.getElementById('product-method-table-body');
  const start = (currentPage - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, filteredProducts.length);
  const pageItems = filteredProducts.slice(start, end);

  tableBody.innerHTML = '';
  
  if (pageItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: #64748b;">Không tìm thấy kết quả phù hợp</td></tr>`;
    updatePagination(0);
    return;
  }

  pageItems.forEach((item, index) => {
    const row = document.createElement('tr');
    const methodClass = `method-${item.method.toLowerCase()}`;
    
    row.innerHTML = `
      <td style="text-align: center">
        <input type="checkbox" class="row-checkbox" value="${item.id}" onchange="updateBulkBarVisibility()">
      </td>
      <td style="text-align: center">${start + index + 1}</td>
      <td style="text-align: left; padding-left: 15px">${item.code}</td>
      <td style="text-align: left; padding-left: 15px">${item.name}</td>
      <td style="text-align: left; padding-left: 15px">${item.group}</td>
      <td style="text-align: center">
        <div class="method-badge-container ${methodClass}">
          <div class="custom-dropdown">
            <div class="custom-dropdown-toggle" onclick="toggleFilterDropdown(this)">
              <span>${item.method}</span>
              <i class="fas fa-chevron-down" style="font-size: 8px; opacity: 0.8"></i>
            </div>
            <div class="custom-dropdown-menu">
              <div class="custom-dropdown-item ${item.method === 'FIFO' ? 'selected' : ''}" onclick="selectRowOption(${item.id}, 'FIFO')">FIFO</div>
              <div class="custom-dropdown-item ${item.method === 'FEFO' ? 'selected' : ''}" onclick="selectRowOption(${item.id}, 'FEFO')">FEFO</div>
              <div class="custom-dropdown-item ${item.method === 'LIFO' ? 'selected' : ''}" onclick="selectRowOption(${item.id}, 'LIFO')">LIFO</div>
            </div>
          </div>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  updatePagination(filteredProducts.length);
  updateBulkBarVisibility();
}

// Single Row Update Logic
window.updateSingleMethod = function(selectEl, productId) {
  const newValue = selectEl.value;
  
  // Update local data
  const product = allProducts.find(p => p.id === productId);
  if (product) {
    product.method = newValue;
    // Sync with filtered list
    const filteredProd = filteredProducts.find(p => p.id === productId);
    if (filteredProd) filteredProd.method = newValue;
  }

  // Update visual style of the wrapper container
  const container = selectEl.closest('.method-badge-container');
  if (container) {
    container.className = `method-badge-container method-${newValue.toLowerCase()}`;
  }

  // Show global toast
  if (typeof showToast === 'function') {
    showToast('Thiết lập quy cách cho sản phẩm thành công', 'success');
  }
};

// Bulk Selection & Visibility
let isBulkBarManuallyShown = false;

window.showBulkAssignBar = function() {
  isBulkBarManuallyShown = true;
  updateBulkBarVisibility();
};

function updateBulkBarVisibility() {
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
  const bulkBar = document.getElementById('bulk-action-bar');
  const triggerBtn = document.getElementById('btn-trigger-bulk');
  const selectAll = document.getElementById('select-all');
  const applyBtn = bulkBar ? bulkBar.querySelector('.btn-apply') : null;

  if (!bulkBar) return;

  // Show if items selected OR manually triggered
  const shouldShowBar = checkedCount > 0 || isBulkBarManuallyShown;
  
  if (shouldShowBar) {
    bulkBar.style.display = 'flex';
    if (triggerBtn) triggerBtn.style.display = 'none';
  } else {
    bulkBar.style.display = 'none';
    if (triggerBtn) triggerBtn.style.display = 'flex';
  }

  // Update Apply button state
  if (applyBtn) {
    applyBtn.disabled = checkedCount === 0;
  }

  // Sync select-all checkbox
  if (selectAll && rowCheckboxes.length > 0) {
    selectAll.checked = checkedCount === rowCheckboxes.length;
  }
}

function toggleSelectAll(checkbox) {
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  rowCheckboxes.forEach(cb => {
    cb.checked = checkbox.checked;
  });
  updateBulkBarVisibility();
}

// Bulk Actions
function applyBulkMethod() {
  const methodValue = document.getElementById('bulk-method-select').value;
  const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
  const selectedIds = Array.from(checkedCheckboxes).map(cb => parseInt(cb.value));

  if (selectedIds.length === 0) return;

  // Update data
  allProducts.forEach(p => {
    if (selectedIds.includes(p.id)) {
      p.method = methodValue;
    }
  });

  filteredProducts.forEach(p => {
    if (selectedIds.includes(p.id)) {
      p.method = methodValue;
    }
  });

  renderTable();
  
  // Show global toast
  if (typeof showToast === 'function') {
    showToast('Thiết lập quy cách cho sản phẩm thành công', 'success');
  }
}

function cancelBulkAction() {
  isBulkBarManuallyShown = false;
  const selectAll = document.getElementById('select-all');
  if (selectAll) selectAll.checked = false;
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  rowCheckboxes.forEach(cb => cb.checked = false);
  updateBulkBarVisibility();
}

// Update Pagination UI
function updatePagination(total) {
  const showingRange = document.getElementById('showing-range');
  const totalItems = document.getElementById('total-items');
  const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);

  showingRange.textContent = `${start}-${end}`;
  totalItems.textContent = total;

  const totalPages = Math.ceil(total / itemsPerPage);
  const paginationNumbers = document.getElementById('pagination-numbers');
  paginationNumbers.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `btn-page ${i === currentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      renderTable();
    };
    paginationNumbers.appendChild(btn);
  }

  document.getElementById('btn-prev').disabled = currentPage === 1 || total === 0;
  document.getElementById('btn-next').disabled = currentPage === totalPages || total === 0;
}

// Filter Logic
function filterProducts() {
  const searchTerm = document.getElementById('product-search').value.toLowerCase().trim();
  const groupValue = document.getElementById('group-filter').value;
  
  filteredProducts = allProducts.filter(p => {
    const matchesSearch = p.code.toLowerCase().includes(searchTerm) || 
                          p.name.toLowerCase().includes(searchTerm);
    const matchesGroup = !groupValue || p.group === groupValue;
    return matchesSearch && matchesGroup;
  });
  
  currentPage = 1;
  renderTable();
}

// Pagination Controls
function changePage(delta) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const newPage = currentPage + delta;
  
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderTable();
  }
}

// Run init
document.addEventListener('DOMContentLoaded', initModule);

// Handle cases where the module is loaded via dynamic content loading (matching your script.js patterns if applicable)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initModule();
}
