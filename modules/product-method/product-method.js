// Mock Data
const allProducts = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  code: `P-${String(i + 1).padStart(4, '0')}`,
  name: `Sản phẩm mẫu ${i + 1}`,
  group: i % 3 === 0 ? 'Linh kiện' : i % 3 === 1 ? 'Vật tư' : 'Thành phẩm',
  method: i % 2 === 0 ? 'FIFO' : i % 3 === 0 ? 'FEFO' : 'LIFO'
}));

let filteredProducts = [...allProducts];
let currentPage = 1;
const itemsPerPage = 20;

// Initialize
function initModule() {
  renderTable();
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
    row.innerHTML = `
      <td style="text-align: center">
        <input type="checkbox" class="row-checkbox" value="${item.id}" onchange="updateBulkBarVisibility()">
      </td>
      <td style="text-align: center">${start + index + 1}</td>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.group}</td>
      <td><span class="method-text">${item.method}</span></td>
    `;
    tableBody.appendChild(row);
  });

  updatePagination(filteredProducts.length);
  updateBulkBarVisibility();
}

// Bulk Selection & Visibility
function updateBulkBarVisibility() {
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
  const bulkBar = document.getElementById('bulk-action-bar');
  const selectAll = document.getElementById('select-all');

  // Toggle bar visibility
  if (checkedCount > 0) {
    bulkBar.style.display = 'flex';
  } else {
    bulkBar.style.display = 'none';
  }

  // Sync select-all checkbox
  if (rowCheckboxes.length > 0) {
    selectAll.checked = checkedCount === rowCheckboxes.length;
  } else {
    selectAll.checked = false;
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

  // Update original data
  allProducts.forEach(p => {
    if (selectedIds.includes(p.id)) {
      p.method = methodValue;
    }
  });

  // Re-sync filtered data (important if search is active)
  filteredProducts.forEach(p => {
    if (selectedIds.includes(p.id)) {
      p.method = methodValue;
    }
  });

  // Refresh and reset
  renderTable();
  console.log(`Updated ${selectedIds.length} products to ${methodValue}`);
  
  // Notice user (optional, could use toast)
  // showToast(`Đã gán ${methodValue} cho ${selectedIds.length} sản phẩm`, 'success');
}

function cancelBulkAction() {
  const selectAll = document.getElementById('select-all');
  selectAll.checked = false;
  toggleSelectAll(selectAll);
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
  
  filteredProducts = allProducts.filter(p => 
    p.code.toLowerCase().includes(searchTerm) || 
    p.name.toLowerCase().includes(searchTerm)
  );
  
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
