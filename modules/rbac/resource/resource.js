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
      { id: 101, code: 'DASHBOARD_CHITIET', name: 'Dashboard chi tiết', description: 'Trang dashboard hiển thị số liệu chi tiết.' },
      { id: 102, code: 'GIAMSAT_HOATDONG', name: 'Giám sát hoạt động', description: 'Trang giám sát hoạt động thời gian thực.' },
      { id: 103, code: 'GIAODIEN_KHO_MOI', name: 'Giao diện kho mới', description: 'Giao diện quản lý kho 2D/3D mới.' },
      { id: 201, code: 'DONHANG_NHAP', name: 'Đơn hàng nhập', description: 'Quản lý các đơn hàng nhập từ khách hàng.' },
      { id: 202, code: 'DONHANG_XUAT', name: 'Đơn hàng xuất', description: 'Quản lý các đơn hàng xuất cho khách hàng.' },
      { id: 301, code: 'QUANLY_KHO', name: 'Danh sách Kho', description: 'Quản lý danh sách và cấu hình các kho.' },
      { id: 302, code: 'QUANLY_LOHANG', name: 'Quản lý lô hàng', description: 'Theo dõi và quản lý các lô hàng trong kho.' },
      { id: 303, code: 'QUANLY_TONKHO', name: 'Quản lý tồn kho', description: 'Kiểm kê và theo dõi số lượng tồn kho.' },
      { id: 304, code: 'QUYCACH_SANPHAM', name: 'Quy cách sản phẩm', description: 'Thiết lập quy cách cho từng mã sản phẩm.' },
      { id: 305, code: 'QUANLY_VATCHUA', name: 'Quản lý vật chứa', description: 'Quản lý Pallet, vật chứa không.' },
      { id: 306, code: 'QUANLY_BAOTRI', name: 'Quản lý bảo trì', description: 'Lập lịch và thực hiện bảo trì định kỳ.' },
      { id: 307, code: 'BIENBAN_BANGIAO', name: 'Biên bản bàn giao', description: 'Quản lý các biên bản bàn giao hàng hóa.' },
      { id: 401, code: 'KANBANWCS', name: 'Kanban WCS', description: 'Giao diện điều động thiết bị WCS.' },
      { id: 501, code: 'LENH_NHAPKHO', name: 'Lệnh nhập kho', description: 'Thực hiện các lệnh nhập hàng thực tế.' },
      { id: 601, code: 'LENH_XUATKHO', name: 'Lệnh xuất kho', description: 'Thực hiện các lệnh xuất hàng thực tế.' },
      { id: 701, code: 'QUANLY_QUYTRINH', name: 'Quản lý quy trình', description: 'Cấu hình các bước trong quy trình nghiệp vụ.' },
      { id: 801, code: 'NHOM_THIETBI', name: 'Nhóm thiết bị', description: 'Phân loại các loại thiết bị.' },
      { id: 802, code: 'THIETBI', name: 'Thiết bị', description: 'Quản lý danh mục thiết bị cụ thể.' },
      { id: 803, code: 'DONG_SANPHAM', name: 'Dòng sản phẩm', description: 'Quản lý danh mục dòng sản phẩm.' },
      { id: 804, code: 'NHOM_SANPHAM', name: 'Nhóm sản phẩm', description: 'Phân loại các nhóm sản phẩm.' },
      { id: 805, code: 'SANPHAM', name: 'Sản phẩm', description: 'Quản lý danh mục mã sản phẩm.' },
      { id: 806, code: 'QUYCACH', name: 'Quy cách', description: 'Quản lý danh mục quy cách đóng gói.' },
      { id: 807, code: 'LOAI_XE', name: 'Loại xe', description: 'Quản lý danh mục các loại xe giao nhận.' },
      { id: 808, code: 'NHOM_VATCHUA', name: 'Nhóm vật chứa', description: 'Phân loại các nhóm vật chứa.' },
      { id: 809, code: 'VATCHUA', name: 'Vật chứa', description: 'Quản lý danh mục vật chứa chi tiết.' },
      { id: 810, code: 'DON_VI_TINH', name: 'Đơn vị tính', description: 'Quản lý danh mục các đơn vị đo lường.' },
      { id: 811, code: 'THITRUONG', name: 'Thị trường', description: 'Quản lý danh mục các thị trường.' },
      { id: 812, code: 'KHACHHANG', name: 'Khách hàng', description: 'Quản lý danh mục khách hàng.' },
      { id: 813, code: 'LOAI_KHUVUC', name: 'Loại khu vực', description: 'Quản lý các loại khu vực lưu trữ.' },
      { id: 901, code: 'BAOCAONHAPXUAT', name: 'Báo cáo Nhập/Xuất', description: 'Báo cáo tổng hợp dữ liệu nhập và xuất.' },
      { id: 1001, code: 'TAIKHOAN', name: 'Tài khoản', description: 'Quản lý danh sách người dùng hệ thống.' },
      { id: 1002, code: 'VAITRO', name: 'Vai trò', description: 'Quản lý các nhóm quyền (Role).' },
      { id: 1003, code: 'QUYENHAN', name: 'Quyền hạn', description: 'Chi tiết các quyền hạn cho từng chức năng.' },
      { id: 1004, code: 'CHUCNANG', name: 'Chức năng', description: 'Quản lý cây menu và chức năng hệ thống.' },
      { id: 1005, code: 'TAINGUYEN', name: 'Tài nguyên', description: 'Quản lý các tài nguyên (Resources) bảo mật.' },
      { id: 1101, code: 'TAILIEU_HUONGDAN', name: 'Tài liệu hướng dẫn', description: 'Hướng dẫn sử dụng cho người dùng.' },
      { id: 1102, code: 'QUYTRINH_VANHANH', name: 'Quy trình vận hành', description: 'Tài liệu các bước vận hành chuẩn (SOP).' }
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
      html = '<tr><td colspan="6" class="empty-table-cell">Không tìm thấy dữ liệu</td></tr>';
    } else {
      paginatedItems.forEach((item, index) => {
        const isChecked = selectedIds.has(item.id) ? 'checked' : '';
        html += `
          <tr>
            <td>
              <input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isChecked} onclick="handleRowCheckbox(event, ${item.id})" />
            </td>
            <td>${startIndex + index + 1}</td>
            <td class="resource-code-cell">${item.code}</td>
            <td class="resource-name-cell">${item.name || '<span class="placeholder-text">Chưa có tên</span>'}</td>
            <td class="resource-desc-cell">${item.description || '<span class="placeholder-text">Chưa có mô tả</span>'}</td>
            <td>
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
  function initialize() {
    initData();

    // Synchronization scroll
    const scrollHead = document.querySelector('.table-scroll-head');
    const scrollBody = document.querySelector('.table-scroll-body');

    if (scrollHead && scrollBody) {
        scrollBody.addEventListener('scroll', () => {
            scrollHead.scrollLeft = scrollBody.scrollLeft;
        });
    }
  }

  initialize();

})();
