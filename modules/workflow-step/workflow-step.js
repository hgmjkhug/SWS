(function () {
  // --- 1. MOCK DATA ---
  const deviceTypes = [
    { id: 1, code: "AGV-LOAD", name: "AGV Vận chuyển hàng" },
    { id: 2, code: "CRANE-STACK", name: "Cần trục Stacker Crane" },
    { id: 3, code: "CONVEYOR-BELT", name: "Băng tải dây" },
    { id: 4, code: "LIFTER-VERT", name: "Thang máy nâng hàng" },
    { id: 5, code: "SCANNER-GATE", name: "Cổng Scan RFID" },
  ];

  const stepTemplates = [
    { code: "STEP-CHK", name: "Check-in tiếp nhận" },
    { code: "STEP-PIC", name: "Picking lấy hàng" },
    { code: "STEP-QC", name: "Kiểm tra chất lượng (QC)" },
    { code: "STEP-PKG", name: "Đóng gói kiện hàng" },
    { code: "STEP-HND", name: "Bàn giao vận chuyển" },
    { code: "STEP-WGT", name: "Cân trọng lượng" },
    { code: "STEP-LBL", name: "In tem nhãn" },
    { code: "STEP-LOD", name: "Xếp hàng lên xe" },
    { code: "STEP-SRT", name: "Phân loại hàng hóa" },
    { code: "STEP-PUT", name: "Cất hàng vào vị trí" },
  ];

  const mockSteps = Array.from({ length: 35 }, (_, i) => {
    const template = stepTemplates[i % stepTemplates.length];
    // Select SINGLE device type
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];

    return {
      id: i + 1,
      code: `${template.code}-${100 + i}`,
      name: `${template.name} ${i + 1 > stepTemplates.length ? Math.floor((i + 1) / stepTemplates.length) : ""}`.trim(),
      deviceType: deviceType, // Changed from deviceTypes array to single object
      isActive: i % 5 !== 0,
    };

  });

  // --- 2. STATE ---
  let steps = [...mockSteps];
  let filteredData = [...steps];
  const itemsPerPage = 20;
  let currentPage = 1;
  let selectedIds = new Set();
  let pendingToggleId = null;

  // --- 3. DOM ELEMENTS ---
  function getDOM() {
    return {
      tableBody: document.getElementById("stepTableBody"),
      searchInput: document.getElementById("stepSearch"),
      statusDropdown: document.getElementById("statusDropdown"),
      statusSelected: document.getElementById("statusSelected"),
      statusOptions: document.getElementById("statusOptions"),
      deviceTypeDropdown: document.getElementById("deviceTypeDropdown"),
      deviceTypeSelected: document.getElementById("deviceTypeSelected"),
      deviceTypeOptions: document.getElementById("deviceTypeOptions"),
      selectAll: document.getElementById("selectAll"),
      bulkActions: document.getElementById("bulkActions"),
      selectedCount: document.getElementById("selectedCount"),
      paginationInfo: document.getElementById("paginationInfo"),
      pageNumbers: document.getElementById("pageNumbers"),
      prevPage: document.getElementById("prevPage"),
      nextPage: document.getElementById("nextPage"),
      gotoPage: document.getElementById("gotoPage"),

      // Modal
      modal: document.getElementById("stepModal"),
      modalTitle: document.getElementById("modalTitle"),
      stepId: document.getElementById("stepId"),
      stepCode: document.getElementById("stepCode"),
      stepName: document.getElementById("stepName"),
      stepActive: document.getElementById("stepActive"),
      deviceTypeDropdownModal: document.getElementById(
        "deviceTypeDropdownModal",
      ),
      deviceTypeSelectedModal: document.getElementById(
        "deviceTypeSelectedModal",
      ),
      deviceTypeOptionsModal: document.getElementById("deviceTypeOptionsModal"),

      // Confirm
      confirmModal: document.getElementById("confirmModal"),
      confirmStepName: document.getElementById("confirmStepName"),
    };
  }

  // --- 4. RENDER FUNCTIONS ---
  function renderTable() {
    const dom = getDOM();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    if (pageData.length === 0) {
      dom.tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 40px; color: #64748b;">không có dữ liệu để hiển thị</td></tr>`;
      updatePagination();
      return;
    }

    dom.tableBody.innerHTML = pageData
      .map((item, index) => {
        const stt = start + index + 1;
        const deviceTypeHtml = item.deviceType
            ? `<span class="flow-badge" title="${item.deviceType.name}">${item.deviceType.code}</span>`
            : '<span style="color: #94a3b8; font-style: italic;">Chưa gán nhóm</span>';

        const isSelected = selectedIds.has(item.id);

        return `
                <tr class="${isSelected ? "selected-row" : ""}">
                    <td class="col-selection">
                        <input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isSelected ? "checked" : ""}>
                    </td>
                    <td class="col-stt">${stt}</td>
                    <td class="col-code"><span style="font-family: 'Roboto', sans-serif; font-weight: 600; color: #076EB8;">${item.code}</span></td>
                    <td class="col-name" style="font-weight: 500;">${item.name}</td>
                    <td class="col-flows">${deviceTypeHtml}</td>

                    <td class="col-status">
                        <label class="switch">
                            <input type="checkbox" class="status-toggle" data-id="${item.id}" ${item.isActive ? "checked" : ""}>
                            <span class="slider"></span>
                        </label>
                    </td>
                    <td class="col-actions">
                        <div class="actions-cell-content">
                            <button class="action-btn edit-btn" title="Chỉnh sửa" onclick="openStepModal('edit', ${item.id})">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="action-btn delete-btn" title="Xóa" onclick="deleteStep(${item.id})">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
      })
      .join("");

    updatePagination();
    updateBulkActionsBar();
  }

  function updatePagination() {
    const dom = getDOM();
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (currentPage > totalPages) currentPage = totalPages;

    const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    const currentCountSpan = document.getElementById("currentCount");
    const totalCountSpan = document.getElementById("totalCount");

    if (currentCountSpan && totalCountSpan) {
      currentCountSpan.innerText = `${start} - ${end}`;
      totalCountSpan.innerText = totalItems;
    } else {
      dom.paginationInfo.textContent = `Hiển thị ${start} - ${end} trong ${totalItems}`;
    }

    // Render Page Numbers
    let html = "";
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
      }
    } else {
      // Simplified ellipsis logic
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++)
          html += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
        html += '<span class="ellipsis">...</span>';
        html += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
      } else if (currentPage >= totalPages - 2) {
        html += `<button class="page-btn" data-page="1">1</button>`;
        html += '<span class="ellipsis">...</span>';
        for (let i = totalPages - 3; i <= totalPages; i++)
          html += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
      } else {
        html += `<button class="page-btn" data-page="1">1</button>`;
        html += '<span class="ellipsis">...</span>';
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          html += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
        html += '<span class="ellipsis">...</span>';
        html += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
      }
    }
    dom.pageNumbers.innerHTML = html;

    dom.prevPage.disabled = currentPage === 1;
    dom.nextPage.disabled = currentPage === totalPages;
  }

  // --- 5. LOGIC FUNCTIONS ---
  function filterData() {
    const dom = getDOM();
    const searchTerm = dom.searchInput.value.toLowerCase();
    const statusFilter = dom.statusSelected.dataset.value;
    const deviceTypeFilter = dom.deviceTypeSelected
      ? dom.deviceTypeSelected.dataset.value
      : "all";

    filteredData = steps.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm) ||
        item.code.toLowerCase().includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "inactive" && !item.isActive);
      const matchesDeviceType =
        deviceTypeFilter === "all" ||
        (item.deviceTypes &&
          item.deviceTypes.some((d) => d.id.toString() === deviceTypeFilter));
      return matchesSearch && matchesStatus && matchesDeviceType;
    });

    currentPage = 1;
    renderTable();
  }

  function updateBulkActionsBar() {
    const dom = getDOM();
    if (selectedIds.size > 0) {
      dom.bulkActions.classList.remove("hidden");
      dom.selectedCount.textContent = `Đã chọn ${selectedIds.size} mục`;
    } else {
      dom.bulkActions.classList.add("hidden");
    }
  }

  // --- 6. EVENT HANDLERS ---
  window.openStepModal = function (mode = "create", id = null) {
    const dom = getDOM();
    // Reset modal form
    if (mode === "edit" && id) {
      const item = steps.find((s) => s.id === id);
      if (item) {
        dom.modalTitle.textContent = "Chỉnh sửa bước quy trình";
        dom.stepId.value = item.id;
        dom.stepCode.value = item.code;
        dom.stepName.value = item.name;
        dom.stepActive.checked = item.isActive;
        populateDeviceTypeOptions(item.deviceTypes || []);
      }
    } else {
      dom.modalTitle.textContent = "Thêm bước quy trình mới";
      dom.stepId.value = "";
      dom.stepCode.value = "";
      dom.stepName.value = "";
      dom.stepActive.checked = true;
      populateDeviceTypeOptions([]);
    }

    dom.modal.classList.add("show");
  };

  function populateDeviceTypeOptions(selectedDeviceTypes) {
    const dom = getDOM();
    if (!dom.deviceTypeOptionsModal) return;

    const selectedIds = selectedDeviceTypes.map((d) => d.id);
    dom.deviceTypeOptionsModal.innerHTML = deviceTypes
      .map(
        (dt, index) => `
            <div class="option-item" onclick="toggleDeviceTypeOption(${index})">
                <input type="checkbox" id="dt-opt-${index}" data-id="${dt.id}" value="${dt.code}" ${selectedIds.includes(dt.id) ? "checked" : ""}>
                <span>${dt.code} - ${dt.name}</span>
            </div>
        `,
      )
      .join("");
    updateDeviceTypeSelectedDisplay();
  }

  window.toggleDeviceTypeDropdown = function () {
    const dom = getDOM();
    if (dom.deviceTypeDropdownModal) {
      dom.deviceTypeDropdownModal.classList.toggle("active");
    }
  };

  window.toggleDeviceTypeOption = function (index) {
    const checkbox = document.getElementById(`dt-opt-${index}`);
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      updateDeviceTypeSelectedDisplay();
    }
  };

  window.updateDeviceTypeSelectedDisplay = function () {
    const dom = getDOM();
    if (!dom.deviceTypeOptionsModal || !dom.deviceTypeSelectedModal) return;

    const checkboxes = dom.deviceTypeOptionsModal.querySelectorAll(
      '.option-item input[type="checkbox"]',
    );
    const selected = [];
    checkboxes.forEach((cb) => {
      if (cb.checked) {
        const dt = deviceTypes.find((d) => d.id === parseInt(cb.dataset.id));
        if (dt) selected.push(dt);
      }
    });

    const displayEl = dom.deviceTypeSelectedModal;
    displayEl.dataset.value = selected.map((d) => d.id).join(",");

    if (selected.length === 0) {
      displayEl.innerHTML =
        '<span class="selected-placeholder">Chọn nhóm thiết bị...</span><i class="fas fa-chevron-down"></i>';
    } else {
      if (selected.length > 1) {
        displayEl.innerHTML = `<span class="selected-tag" title="${selected[0].name}">${selected[0].code}</span><span class="selected-tag" style="background:#f1f5f9; color:#475569; border-color:#e2e8f0;">+${selected.length - 1}</span><i class="fas fa-chevron-down"></i>`;
      } else {
        displayEl.innerHTML = `<span class="selected-tag" title="${selected[0].name}">${selected[0].code}</span><i class="fas fa-chevron-down"></i>`;
      }
    }
  };

  window.configureStep = function (id) {
    if (window.showToast) window.showToast("Tính năng Đang phát triển", "info");
  };

  window.closeStepModal = function () {
    getDOM().modal.classList.remove("show");
  };

  window.saveStep = function () {
    const dom = getDOM();
    const id = dom.stepId.value;
    const code = dom.stepCode.value;
    const name = dom.stepName.value;
    const isActive = dom.stepActive.checked;

    // Get selected device types
    const selectedDeviceTypeIds =
      dom.deviceTypeSelectedModal && dom.deviceTypeSelectedModal.dataset.value
        ? dom.deviceTypeSelectedModal.dataset.value
            .split(",")
            .map((id) => parseInt(id))
        : [];
    const selectedDeviceTypes = deviceTypes.filter((dt) =>
      selectedDeviceTypeIds.includes(dt.id),
    );

    if (!code || !name) {
      if (window.showToast)
        window.showToast("Vui lòng nhập đầy đủ tên và mã bước!", "error");
      return;
    }

    if (id) {
      // Update
      const index = steps.findIndex((s) => s.id == id);
      if (index !== -1) {
        steps[index] = {
          ...steps[index],
          code,
          name,
          isActive,
          deviceTypes: selectedDeviceTypes,
        };
        if (window.showToast) window.showToast(`Đã cập nhật bước ${code}`);
      }
    } else {
      // Create
      const newId =
        steps.length > 0 ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
      steps.unshift({
        id: newId,
        code,
        name,
        isActive,
        deviceTypes: selectedDeviceTypes,
      });
      if (window.showToast) window.showToast(`Đã thêm bước mới ${code}`);
    }

    closeStepModal();
    filterData();
  };

  window.deleteStep = function (id) {
    if (confirm("Bạn có chắc chắn muốn xóa bước này?")) {
      steps = steps.filter((s) => s.id !== id);
      selectedIds.delete(id);
      if (window.showToast)
        window.showToast("Đã xóa bước quy trình thành công");
      filterData();
    }
  };

  window.handleBulkDelete = function () {
    if (selectedIds.size === 0) return;
    if (
      confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} bước đã chọn?`)
    ) {
      steps = steps.filter((s) => !selectedIds.has(s.id));
      selectedIds.clear();
      if (window.showToast) window.showToast("Đã xóa hàng loạt thành công");
      filterData();
    }
  };

  // --- 7. POPOVER LOGIC ---
  window.handleToggleRequest = function (checkbox, id) {
    const isNowChecked = checkbox.checked;

    if (!isNowChecked) {
      // Revert checkbox state until confirmed
      checkbox.checked = true;
      pendingToggleId = id;

      const dom = getDOM();
      const item = steps.find((s) => s.id === id);
      if (dom.confirmStepName)
        dom.confirmStepName.textContent = item ? item.name : "";

      if (dom.confirmModal) dom.confirmModal.classList.add("show");

      // Position Popover contextually next to the toggle
      const switchContainer = checkbox.closest(".switch");
      const rect = switchContainer.getBoundingClientRect();
      const content = dom.confirmModal ? dom.confirmModal.querySelector(".confirm-content") : null;

      if (content) {
        // Position to the left of the switch with a gap for the arrow
        const popoverWidth = 320;
        const arrowOffset = 26; // Aligns arrow with icon/top area (top: 20px in CSS + half of arrow height)
        
        content.style.left = (rect.left - popoverWidth - 15) + "px";
        content.style.top = (rect.top + rect.height / 2 - arrowOffset) + "px";
      }
    } else {
      // Direct activation
      const item = steps.find((s) => s.id === id);
      if (item) {
        item.isActive = true;
        if (window.showToast)
          window.showToast(`Đã kích hoạt bước ${item.code}`, "success");
      }
    }
  };

  window.closeConfirmModal = function () {
    const dom = getDOM();
    if (dom.confirmModal) dom.confirmModal.classList.remove("show");
    pendingToggleId = null;
  };

  window.confirmDisable = function () {
    if (pendingToggleId) {
      const item = steps.find((s) => s.id === pendingToggleId);
      if (item) {
        item.isActive = false;
        if (window.showToast)
          window.showToast(`Đã ngưng sử dụng bước ${item.code}`);
        renderTable();
      }
      closeConfirmModal();
    }
  };

  // --- 8. INITIALIZATION ---
  function init() {
    const dom = getDOM();

    // Populate Status Dropdown
    dom.statusOptions.innerHTML = `
            <div class="dropdown-item selected" data-value="all">Tất cả trạng thái</div>
            <div class="dropdown-item" data-value="active">Đang sử dụng</div>
            <div class="dropdown-item" data-value="inactive">Ngưng sử dụng</div>
        `;

    // Populate Device Type Dropdown (Filter)
    if (dom.deviceTypeOptions) {
      dom.deviceTypeOptions.innerHTML = `
                <div class="dropdown-item selected" data-value="all">Tất cả nhóm thiết bị</div>
                ${deviceTypes
                  .map(
                    (dt) => `
                    <div class="dropdown-item" data-value="${dt.id}">${dt.code} - ${dt.name}</div>
                `,
                  )
                  .join("")}
            `;
    }

    // Tooltip search listeners
    dom.searchInput.addEventListener("input", () => filterData());

    // Remove old listener if exists (for module reload)
    if (window._workflowStepClickHandler) {
      document.removeEventListener("click", window._workflowStepClickHandler);
    }

    // Named function for click handler
    window._workflowStepClickHandler = function (e) {
      const dropdown = e.target.closest(".custom-dropdown");
      const isDropdownClick = dropdown !== null;

      // Close all dropdowns except the one being clicked
      document
        .querySelectorAll("#workflow-step-view .custom-dropdown")
        .forEach((d) => {
          if (d !== dropdown) d.classList.remove("active");
        });

      if (isDropdownClick) {
        const clickedSelected = e.target.closest(".dropdown-selected");
        const clickedItem = e.target.closest(".dropdown-item");

        if (clickedSelected) {
          // Toggle the dropdown
          e.stopPropagation();
          dropdown.classList.toggle("active");
        } else if (clickedItem) {
          // Single-select logic for status and device type filter
          const value = clickedItem.dataset.value;
          const label = clickedItem.textContent.trim();

          // Check which dropdown this is
          if (dropdown.id === "statusDropdown") {
            const displayEl = document.getElementById("statusSelected");
            if (displayEl) {
              displayEl.dataset.value = value;
              displayEl.textContent = label;
              displayEl.title = label;
            }
          } else if (dropdown.id === "deviceTypeDropdown") {
            const displayEl = document.getElementById("deviceTypeSelected");
            if (displayEl) {
              displayEl.dataset.value = value;
              displayEl.textContent = label;
              displayEl.title = label;
            }
          }

          dropdown
            .querySelectorAll(".dropdown-item")
            .forEach((i) => i.classList.remove("selected"));
          clickedItem.classList.add("selected");
          dropdown.classList.remove("active");
          filterData();
        }
      } else {
        // Clicked outside modals or popovers
        const confirmMdl = document.getElementById("confirmModal");
        if (
          confirmMdl &&
          confirmMdl.classList.contains("show") &&
          e.target === confirmMdl
        ) {
          closeConfirmModal();
        }
      }
    };

    // Add click listener
    document.addEventListener("click", window._workflowStepClickHandler);

    // Table Body listeners
    dom.tableBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("row-checkbox")) {
        const id = parseInt(e.target.dataset.id);
        if (e.target.checked) selectedIds.add(id);
        else selectedIds.delete(id);
        updateBulkActionsBar();
        dom.selectAll.checked = Array.from(
          dom.tableBody.querySelectorAll(".row-checkbox"),
        ).every((cb) => cb.checked);
      }
      if (e.target.classList.contains("status-toggle")) {
        const id = parseInt(e.target.dataset.id);
        handleToggleRequest(e.target, id);
      }
    });

    // Select All handler
    dom.selectAll.addEventListener("change", (e) => {
      const cbs = dom.tableBody.querySelectorAll(".row-checkbox");
      cbs.forEach((cb) => {
        cb.checked = e.target.checked;
        const id = parseInt(cb.dataset.id);
        if (e.target.checked) selectedIds.add(id);
        else selectedIds.delete(id);
      });
      updateBulkActionsBar();
    });

    // Pagination Listeners
    dom.pageNumbers.addEventListener("click", (e) => {
      if (e.target.classList.contains("page-btn")) {
        currentPage = parseInt(e.target.dataset.page);
        renderTable();
      }
    });

    dom.prevPage.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });

    dom.nextPage.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });

    dom.gotoPage.addEventListener("change", (e) => {
      let val = parseInt(e.target.value);
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      if (val < 1) val = 1;
      if (val > totalPages) val = totalPages;
      currentPage = val;
      renderTable();
    });

    renderTable();
  }

  init();
})();
