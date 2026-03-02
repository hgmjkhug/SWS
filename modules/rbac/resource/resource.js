(function () {
  // State Management
  let allResources = [];
  let filteredResources = [];
  let currentPage = 1;
  const itemsPerPage = 20;
  let selectedIds = new Set();
  let editingId = null;

  // Initial Sample Data (based on sub-functions level)
  function initData() {
    allResources = [
      { id: 1, code: 'DASHBOARDTONGQUAN', name: 'Dashboard Tổng quan', description: 'Trang dashboard hiển thị số liệu tổng quan của kho.' },
      { id: 2, code: 'DASHBOARDCHITIET', name: 'Dashboard Chi tiết', description: 'Trang dashboard chi tiết từng khu vực.' },
      { id: 3, code: 'DANHSACHKHO', name: 'Danh sách Kho', description: 'Quản lý danh sách các kho trong hệ thống.' },
      { id: 4, code: 'NHOMTHIETBI', name: 'Nhóm thiết bị', description: 'Quản lý các loại nhóm thiết bị.' },
      { id: 5, code: 'THIETBI', name: 'Thiết bị', description: 'Quản lý danh sách thiết bị chi tiết.' },
      { id: 6, code: 'KANBANWCS', name: 'Kanban WCS', description: 'Giao diện kanban điều phối thiết bị.' },
      { id: 7, code: 'QUANLYLENH', name: 'Quản lý Lệnh', description: 'Theo dõi và quản lý các lệnh điều phối.' },
      { id: 8, code: 'QUANLYTHIETBI', name: 'Quản lý Thiết bị (Hệ thống)', description: 'Cấu hình thiết bị hệ thống.' },
      { id: 9, code: 'LICHBAOTRITHIETBI', name: 'Lịch bảo trì thiết bị', description: 'Lập lịch và theo dõi bảo trì.' },
      { id: 10, code: 'GIAMSATTHIETBI', name: 'Giám sát Thiết bị', description: 'Giám sát trạng thái hoạt động thời gian thực.' },
      { id: 11, code: 'TRUYVETNHAPXUAT', name: 'Truy vết nhập xuất', description: 'Tra cứu lịch sử nhập xuất vật tư.' },
      { id: 12, code: 'LENHNHAPKHO', name: 'Lệnh nhập kho', description: 'Quản lý các yêu cầu nhập kho.' },
      { id: 13, code: 'LENHXUATKHO', name: 'Lệnh xuất kho', description: 'Quản lý các yêu cầu xuất kho.' },
      { id: 14, code: 'THEODOITONKHO', name: 'Theo dõi tồn kho', description: 'Cập nhật số lượng tồn kho theo thời gian thực.' },
      { id: 15, code: 'QUANLYBUOC', name: 'Quản lý bước', description: 'Định nghĩa các bước trong quy trình.' },
      { id: 16, code: 'QUANLYQUYTRINH', name: 'Quản lý Quy trình', description: 'Thiết lập các quy trình nghiệp vụ.' },
      { id: 17, code: 'NHOMVATTU', name: 'Nhóm Vật tư', description: 'Phân loại các loại vật tư.' },
      { id: 18, code: 'DANHMUCVATTU', name: 'Danh mục Vật tư', description: 'Danh sách chi tiết vật tư.' },
      { id: 19, code: 'DONVITINH', name: 'Đơn vị tính', description: 'Quản lý đơn vị tính vật tư.' },
      { id: 20, code: 'DANHMUCPALLET', name: 'Danh mục Pallet', description: 'Quản lý các loại pallet dùng trong kho.' },
      { id: 21, code: 'BAOCAONHAPXUAT', name: 'Báo cáo Nhập/Xuất', description: 'Thống kê tình hình nhập xuất.' },
      { id: 22, code: 'TAIKHOAN', name: 'Tài khoản', description: 'Quản lý người dùng hệ thống.' },
      { id: 23, code: 'VAITRO', name: 'Vai trò', description: 'Quản lý phân quyền theo vai trò.' },
      { id: 24, code: 'CHUCNANG', name: 'Chức năng', description: 'Quản lý danh mục chức năng menu.' },
      { id: 25, code: 'TAINGUYEN', name: 'Tài nguyên', description: 'Định nghĩa các tài nguyên hệ thống.' }
    ];
    
    filteredResources = [...allResources];
    renderTable();
  }

  // --- RENDERING LOGIC ---

  function renderTable() {
    const tbody = document.getElementById('resource-table-body');
    if (!tbody) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredResources.length);
    const paginatedItems = filteredResources.slice(startIndex, endIndex);

    let html = '';
    if (paginatedItems.length === 0) {
      html = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #94a3b8;">Không tìm thấy dữ liệu</td></tr>';
    } else {
      paginatedItems.forEach((item, index) => {
        const isChecked = selectedIds.has(item.id) ? 'checked' : '';
        html += `
          <tr>
            <td style="text-align: center">
              <input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isChecked} onclick="handleRowCheckbox(event, ${item.id})" />
            </td>
            <td style="text-align: center">${startIndex + index + 1}</td>
            <td style="font-weight: 600; color: #076eb8;">${item.code}</td>
            <td style="font-weight: 500;">${item.name || '<span style="color: #94a3b8; font-style: italic;">Chưa có tên</span>'}</td>
            <td>${item.description || '<span style="color: #94a3b8; font-style: italic;">Chưa có mô tả</span>'}</td>
            <td style="text-align: center">
              <button class="action-btn" onclick="openResourceModal(${item.id})" title="Chỉnh sửa">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" onclick="openDeleteConfirm(${item.id})" title="Xóa">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        `;
      });
    }

    tbody.innerHTML = html;
    updatePagination();
    updateBulkDeleteUI();
    
    // Auto-check the "all" checkbox if all current items are selected
    const checkAll = document.getElementById('check-all');
    if (checkAll) {
        const currentIds = paginatedItems.map(item => item.id);
        const allSelected = currentIds.length > 0 && currentIds.every(id => selectedIds.has(id));
        checkAll.checked = allSelected;
    }
  }

  function updatePagination() {
    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    const pageInfo = document.getElementById('resource-page-info');
    const pagesContainer = document.getElementById('resource-pages');
    
    if (pageInfo) {
      if (filteredResources.length > 0) {
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, filteredResources.length);
        pageInfo.innerText = `Hiển thị ${start}-${end} trên tổng ${filteredResources.length}`;
      } else {
        pageInfo.innerText = 'Không có dữ liệu';
      }
    }

    if (pagesContainer) {
      let html = '';
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="btn-page ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
      }
      pagesContainer.innerHTML = html;
    }

    document.getElementById('btn-prev').disabled = currentPage === 1;
    document.getElementById('btn-next').disabled = currentPage === totalPages || totalPages === 0;
  }

  function updateBulkDeleteUI() {
    const bulkBtn = document.getElementById('btn-bulk-delete');
    const countSpan = document.getElementById('selected-count');
    if (bulkBtn && countSpan) {
      const count = selectedIds.size;
      countSpan.innerText = count;
      bulkBtn.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // --- EVENT HANDLERS ---

  window.handleSearch = function () {
    const query = document.getElementById('resource-search').value.trim().toLowerCase();
    filteredResources = allResources.filter(item => 
      item.code.toLowerCase().includes(query) || 
      (item.name && item.name.toLowerCase().includes(query))
    );
    currentPage = 1;
    selectedIds.clear(); // Reset selection on search
    renderTable();
  };

  window.goToPage = function (page) {
    currentPage = page;
    renderTable();
  };

  window.prevPage = function () {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  };

  window.nextPage = function () {
    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  };

  window.toggleSelectAll = function () {
    const checkAll = document.getElementById('check-all');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredResources.length);
    const paginatedItems = filteredResources.slice(startIndex, endIndex);

    if (checkAll.checked) {
      paginatedItems.forEach(item => selectedIds.add(item.id));
    } else {
      paginatedItems.forEach(item => selectedIds.delete(item.id));
    }
    renderTable();
  };

  window.handleRowCheckbox = function (event, id) {
    if (event.target.checked) {
      selectedIds.add(id);
    } else {
      selectedIds.delete(id);
    }
    renderTable();
  };

  // --- CRUD MODAL ---

  window.openResourceModal = function (id = null) {
    editingId = id;
    const modal = document.getElementById('resource-modal');
    const title = document.getElementById('resource-modal-title');
    const inputCode = document.getElementById('resource-code');
    const inputName = document.getElementById('resource-name');
    const inputDesc = document.getElementById('resource-desc');
    const errorCode = document.getElementById('resource-code-error');
    const errorName = document.getElementById('resource-name-error');

    // Reset errors
    inputCode.style.borderColor = '#e2e8f0';
    inputName.style.borderColor = '#e2e8f0';
    errorCode.style.display = 'none';
    errorName.style.display = 'none';

    if (id) {
      title.innerText = 'Chỉnh sửa tài nguyên';
      const resource = allResources.find(r => r.id === id);
      if (resource) {
        inputCode.value = resource.code;
        inputName.value = resource.name || '';
        inputDesc.value = resource.description || '';
      }
    } else {
      title.innerText = 'Thêm mới tài nguyên';
      inputCode.value = '';
      inputName.value = '';
      inputDesc.value = '';
    }

    modal.classList.add('show');
  };

  window.closeResourceModal = function () {
    document.getElementById('resource-modal').classList.remove('show');
    editingId = null;
  };

  window.saveResource = function () {
    const code = document.getElementById('resource-code').value.trim();
    const name = document.getElementById('resource-name').value.trim();
    const description = document.getElementById('resource-desc').value.trim();
    
    const inputCode = document.getElementById('resource-code');
    const inputName = document.getElementById('resource-name');
    const errorCode = document.getElementById('resource-code-error');
    const errorName = document.getElementById('resource-name-error');

    let hasError = false;

    if (!code) {
      inputCode.style.borderColor = '#ef4444';
      errorCode.innerText = 'Mã tài nguyên không được để trống';
      errorCode.style.display = 'block';
      hasError = true;
    } else {
      inputCode.style.borderColor = '#e2e8f0';
      errorCode.style.display = 'none';
    }

    if (!name) {
      inputName.style.borderColor = '#ef4444';
      errorName.innerText = 'Tên tài nguyên không được để trống';
      errorName.style.display = 'block';
      hasError = true;
    } else {
      inputName.style.borderColor = '#e2e8f0';
      errorName.style.display = 'none';
    }

    if (hasError) return;

    if (editingId) {
      // Edit
      const index = allResources.findIndex(r => r.id === editingId);
      if (index !== -1) {
        allResources[index].code = code;
        allResources[index].name = name;
        allResources[index].description = description;
      }
    } else {
      // Add
      const newId = allResources.length > 0 ? Math.max(...allResources.map(r => r.id)) + 1 : 1;
      allResources.unshift({
        id: newId,
        code,
        name,
        description
      });
    }

    closeResourceModal();
    handleSearch(); // Refresh filtered list and table
    if (window.showToast) window.showToast(editingId ? 'Cập nhật tài nguyên thành công' : 'Thêm mới tài nguyên thành công', 'success');
  };

  // --- DELETE CONFIRMATION ---

  let deletePayload = null; // { type: 'single'|'bulk', id: number|null }

  window.openDeleteConfirm = function (id) {
    deletePayload = { type: 'single', id: id };
    const modal = document.getElementById('delete-confirm-modal');
    document.getElementById('delete-title').innerText = 'Xác nhận xóa';
    document.getElementById('delete-message').innerHTML = 'Bạn có chắc chắn muốn xóa tài nguyên này không?<br />Hành động này không thể hoàn tác.';
    document.getElementById('btn-confirm-delete').onclick = confirmDelete;
    modal.classList.add('show');
  };

  window.openBulkDeleteConfirm = function () {
    deletePayload = { type: 'bulk' };
    const modal = document.getElementById('delete-confirm-modal');
    document.getElementById('delete-title').innerText = 'Xác nhận xóa hàng loạt';
    document.getElementById('delete-message').innerHTML = `Bạn có chắc chắn muốn xóa <strong>${selectedIds.size}</strong> tài nguyên đã chọn không?<br />Hành động này không thể hoàn tác.`;
    document.getElementById('btn-confirm-delete').onclick = confirmDelete;
    modal.classList.add('show');
  };

  window.closeDeleteConfirm = function () {
    document.getElementById('delete-confirm-modal').classList.remove('show');
  };

  function confirmDelete() {
    if (deletePayload.type === 'single') {
      allResources = allResources.filter(r => r.id !== deletePayload.id);
      selectedIds.delete(deletePayload.id);
    } else {
      allResources = allResources.filter(r => !selectedIds.has(r.id));
      selectedIds.clear();
    }

    closeDeleteConfirm();
    handleSearch(); // Refresh list
    if (window.showToast) window.showToast('Xóa tài nguyên thành công', 'success');
  }

  // --- INIT ---
  initData();

})();
