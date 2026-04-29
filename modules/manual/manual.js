(function () {
  'use strict';

  // Mock Data
  let tasks = [
    {
      id: 1,
      name: "Cấp pallet từ kho mát A đến line sản xuất 1",
      device: "OHT-01",
      creator: "Nguyễn Văn A",
      details: [
        { id: 1, start: "08:00 20/04/2026", end: "08:15 20/04/2026", status: "completed", executor: "Admin" },
        { id: 2, start: "09:00 21/04/2026", end: "09:10 21/04/2026", status: "completed", executor: "Admin" }
      ]
    },
    {
      id: 2,
      name: "Chuyển thành phẩm từ line 2 về kho mát B",
      device: "RGV-05",
      creator: "Trần Thị B",
      details: [
        { id: 1, start: "10:30 22/04/2026", end: "10:45 22/04/2026", status: "processing", executor: "hmhung" }
      ]
    }
  ];

  // Add more mock data for pagination
  for (let i = 3; i <= 45; i++) {
    tasks.push({
      id: i,
      name: `Nhiệm vụ điều phối thủ công số ${i}`,
      device: i % 2 === 0 ? "OHT-03" : "RGV-02",
      creator: i % 3 === 0 ? "Nguyễn Văn A" : "Hoàng Minh Hưng",
      details: [
        { id: 1, start: "08:00 24/04/2026", end: "08:20 24/04/2026", status: "completed", executor: "Admin" }
      ]
    });
  }

  let currentPage = 1;
  const itemsPerPage = 20;
  let filteredTasks = [...tasks];
  let originalBreadcrumb = '';
  let mapZoom = 1.0;
  let selectedModules = [];
  let taskCount = 1;
  let currentMapTarget = 'start';
  let currentMapTaskId = 1;
  const step = 40;
  const actionsList = [
    "Không làm gì cả",
    "Lấy hàng",
    "Bỏ hàng",
    "Giảm tốc cấp 1 (Chậm)",
    "Giảm tốc cấp 2 (Siêu chậm)",
    "Dừng khi di chuyển ở node cuối",
    "Đi nhanh 1/2",
    "Sạc pin"
  ];

  function getColName(index) {
    let name = '';
    while (index >= 0) {
      name = String.fromCharCode(65 + (index % 26)) + name;
      index = Math.floor(index / 26) - 1;
    }
    return name;
  }

  // Table Rendering
  function renderTable() {
    const tbody = document.getElementById('taskTableBody');
    if (!tbody) return;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageTasks = filteredTasks.slice(start, end);

    if (pageTasks.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Không có dữ liệu</td></tr>';
      updatePagination();
      return;
    }

    tbody.innerHTML = pageTasks.map((task, index) => `
      <tr id="task-${task.id}">
        <td><input type="checkbox" class="task-check" data-id="${task.id}" onclick="event.stopPropagation()"></td>
        <td>${start + index + 1}</td>
        <td>
          <div class="task-name-cell">
            <div class="chevron-btn" onclick="window.toggleRow(${task.id})">
              <i class="fas fa-chevron-right"></i>
            </div>
            <span>${task.name}</span>
          </div>
        </td>
        <td>${task.device}</td>
        <td>
          <div class="action-btns">
            <div class="btn-icon btn-play" onclick="window.activateTask(${task.id})" title="Kích hoạt">
              <i class="fas fa-play"></i>
            </div>
            <div class="btn-icon btn-edit" onclick="window.editTask(${task.id})" title="Chỉnh sửa">
              <i class="fas fa-edit"></i>
            </div>
            <div class="btn-icon btn-delete" onclick="window.deleteTask(${task.id})" title="Xóa">
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>
        </td>
      </tr>
      <tr class="child-table-row" id="child-${task.id}">
        <td colspan="5">
          <div class="child-table-container">
            <table class="child-table">
              <thead>
                <tr>
                  <th width="50">STT</th>
                  <th>Thời gian bắt đầu</th>
                  <th>Thời gian kết thúc</th>
                  <th>Trạng thái</th>
                  <th>Người thực hiện</th>
                </tr>
              </thead>
              <tbody>
                ${task.details.map((d, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${d.start}</td>
                    <td>${d.end}</td>
                    <td><span class="badge badge-${d.status}">${getStatusText(d.status)}</span></td>
                    <td>${d.executor}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    `).join('');

    updatePagination();
  }

  function getStatusText(status) {
    const map = {
      'pending': 'Đang chờ',
      'processing': 'Đang xử lý',
      'completed': 'Hoàn thành',
      'error': 'Lỗi'
    };
    return map[status] || status;
  }

  function updatePagination() {
    const totalItems = filteredTasks.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
      pageInfo.innerText = `Hiển thị ${start}-${end} trong tổng số ${totalItems} nhiệm vụ`;
    }

    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    let html = `<div class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="window.changePage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></div>`;
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        html += `<div class="page-btn ${i === currentPage ? 'active' : ''}" onclick="window.changePage(${i})">${i}</div>`;
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        html += `<div class="page-btn disabled">...</div>`;
      }
    }

    html += `<div class="page-btn ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}" onclick="window.changePage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></div>`;
    pagination.innerHTML = html;
  }

  // GLOBAL EXPOSURE
  window.toggleRow = function (id) {
    const row = document.getElementById(`task-${id}`);
    const childRow = document.getElementById(`child-${id}`);
    if (row) row.classList.toggle('expanded');
    if (childRow) childRow.classList.toggle('expanded');
  };

  window.changePage = function (page) {
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
  };

  // Searchable Select Logic
  window.toggleSearchableSelect = function (input) {
    const wrapper = input.parentElement;
    const isActive = wrapper.classList.contains('active');
    
    // Close all others
    document.querySelectorAll('.searchable-select').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.select-input').forEach(i => i.readOnly = true);

    if (!isActive) {
      wrapper.classList.add('active');
      input.readOnly = false;
      input.select(); 
      
      const taskId = input.id.split('-')[1] || 1;
      const baseId = input.id.split('-')[0];
      
      // Render options dynamically based on field type and taskId
      if (baseId === 'actionDisplay') renderActionOptions(taskId);
      if (baseId === 'groupDisplay') renderGroupOptions(taskId);
      if (baseId === 'deviceDisplay') renderDeviceOptions(taskId);
      if (baseId === 'moduleDisplay') renderModuleOptions(taskId);
    }
  };

  function renderGroupOptions(taskId) {
    const options = document.getElementById(`groupOptions-${taskId}`);
    if (!options) return;
    const groups = ['Xe tự hành OHT', 'Xe RGV', 'Shuttle Robot'];
    options.innerHTML = groups.map(g => 
      `<div class="select-option" onclick="window.selectOption('#groupDisplay-${taskId}', '${g}', 'group')">${g}</div>`
    ).join('');
  }

  function renderDeviceOptions(taskId) {
    const options = document.getElementById(`deviceOptions-${taskId}`);
    if (!options) return;
    const devices = ['OHT-01', 'OHT-02', 'RGV-05', 'Shuttle-12'];
    options.innerHTML = devices.map(d => 
      `<div class="select-option" onclick="window.selectOption('#deviceDisplay-${taskId}', '${d}', 'device')">${d}</div>`
    ).join('');
  }

  function renderModuleOptions(taskId) {
    const options = document.getElementById(`moduleOptions-${taskId}`);
    if (!options) return;
    const modules = ['Kho mát A', 'Kho mát B', 'Kho mát C', 'Module nhập', 'Module xuất'];
    options.innerHTML = modules.map(m => 
      `<div class="select-option checkbox-option" onclick="window.toggleMultiOption('#moduleDisplay-${taskId}', '${m}', 'module', event)">
        <input type="checkbox" ${selectedModules.includes(m) ? 'checked' : ''}>
        <span>${m}</span>
      </div>`
    ).join('');
  }

  function renderActionOptions(taskId) {
    const options = document.getElementById(`actionOptions-${taskId}`);
    if (!options) return;
    options.innerHTML = actionsList.map(act => `
      <div class="select-option" onclick="window.selectOption('#actionDisplay-${taskId}', '${act}', 'action')">${act}</div>
    `).join('');
  }

  window.filterSearchableSelect = function (input) {
    const wrapper = input.parentElement;
    const term = input.value.toLowerCase();
    const options = wrapper.querySelectorAll('.select-option');
    
    options.forEach(opt => {
      const text = opt.innerText.toLowerCase();
      opt.style.display = text.includes(term) ? 'block' : 'none';
    });
  };

  window.selectOption = function (inputSelector, value, type) {
    const input = document.querySelector(inputSelector);
    if (!input) return;

    input.value = value;
    input.readOnly = true;
    const wrapper = input.parentElement;
    wrapper.classList.remove('active');
    wrapper.classList.add('has-value');

    // Handle specific filtering logic
    if (type === 'creator') {
      if (value === 'Tất cả người tạo') {
        filteredTasks = [...tasks];
      } else {
        filteredTasks = tasks.filter(t => t.creator === value);
      }
      currentPage = 1;
      renderTable();
    }

    if (type === 'device') {
      const deviceModules = {
        'OHT-01': 'Kho mát A',
        'OHT-02': 'Kho mát B',
        'RGV-05': 'Kho mát C',
        'Shuttle-12': 'Module nhập'
      };
      const taskId = input.id.split('-')[1] || 1;
      const currentModule = deviceModules[value] || 'Chưa xác định';
      const currentModuleInput = document.getElementById(`currentModuleDisplay-${taskId}`);
      if (currentModuleInput) {
        currentModuleInput.value = currentModule;
        currentModuleInput.parentElement.classList.add('has-value');
      }
    }
  };

  window.toggleMultiOption = function (inputSelector, value, type, event) {
    if (event) event.stopPropagation();
    
    const val = value.trim();
    const index = selectedModules.indexOf(val);
    if (index > -1) {
      selectedModules.splice(index, 1);
    } else {
      selectedModules.push(val);
    }
    
    // Update input display
    const input = document.querySelector(inputSelector);
    if (input) {
      input.value = selectedModules.join(', ');
      const wrapper = input.parentElement;
      if (selectedModules.length > 0) {
        wrapper.classList.add('has-value');
      } else {
        wrapper.classList.remove('has-value');
      }
    }
    
    // Update checkboxes visually
    const wrapper = document.querySelector(inputSelector).parentElement;
    const options = wrapper.querySelectorAll('.select-option');
    options.forEach(opt => {
      const span = opt.querySelector('span');
      const checkbox = opt.querySelector('input[type="checkbox"]');
      if (span && checkbox) {
        const optText = span.innerText.trim();
        checkbox.checked = selectedModules.includes(optText);
      }
    });
  };

  window.addNewTask = function() {
    taskCount++;
    const container = document.getElementById('tasksContainer');
    const firstCard = container.querySelector('.task-card');
    if (!firstCard) return;

    const newCard = firstCard.cloneNode(true);
    const taskId = taskCount;
    newCard.id = `task-${taskId}`;
    newCard.querySelector('.task-title').innerText = `Nhiệm vụ ${taskId}`;
    
    // Update IDs of all elements in the new card
    const elementsWithId = newCard.querySelectorAll('[id]');
    elementsWithId.forEach(el => {
      const baseId = el.id.split('-')[0];
      el.id = `${baseId}-${taskId}`;
    });

    // Update onclick events for searchable selects and map wrappers
    const searchableSelectInputs = newCard.querySelectorAll('.searchable-select .select-input');
    searchableSelectInputs.forEach(input => {
      // The onclick is usually window.toggleSearchableSelect(this) which is fine as is
      // But we need to update the clear button's onclick
      const clearBtn = input.parentElement.querySelector('.clear-btn');
      if (clearBtn) {
        const type = clearBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
        clearBtn.setAttribute('onclick', `window.clearSearchableSelect('#${input.id}', '${type}', event)`);
      }
    });

    const mapWrappers = newCard.querySelectorAll('.map-input-wrapper');
    mapWrappers.forEach(wrap => {
      const onclickAttr = wrap.getAttribute('onclick');
      if (onclickAttr) {
        const target = onclickAttr.includes('start') ? 'start' : 'end';
        wrap.setAttribute('onclick', `window.setMapTarget('${target}', ${taskId})`);
      }
    });

    // Clear values
    const inputs = newCard.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
      const wrapper = input.parentElement;
      if (wrapper && wrapper.classList.contains('searchable-select')) {
        wrapper.classList.remove('has-value', 'active');
      }
      if (wrapper && wrapper.classList.contains('map-input-wrapper')) {
        wrapper.classList.remove('active');
      }
    });

    // Update remove button onclick
    const removeBtn = newCard.querySelector('.remove-task-btn');
    if (removeBtn) {
      removeBtn.setAttribute('onclick', `window.removeTask(${taskId})`);
    }

    container.appendChild(newCard);
  };

  window.removeTask = function(id) {
    const cards = document.querySelectorAll('.task-card');
    if (cards.length <= 1) {
      if (window.showToast) window.showToast("Phải có ít nhất một nhiệm vụ", "warning");
      return;
    }
    const card = document.getElementById(`task-${id}`);
    if (card) {
      card.remove();
      // Renumber and update all IDs
      const remainingCards = document.querySelectorAll('.task-card');
      remainingCards.forEach((c, index) => {
        const newIdx = index + 1;
        c.id = `task-${newIdx}`;
        c.querySelector('.task-title').innerText = `Nhiệm vụ ${newIdx}`;
        
        const elementsWithId = c.querySelectorAll('[id]');
        elementsWithId.forEach(el => {
          const baseId = el.id.split('-')[0];
          el.id = `${baseId}-${newIdx}`;
        });

        const searchableSelectInputs = c.querySelectorAll('.searchable-select .select-input');
        searchableSelectInputs.forEach(input => {
          const clearBtn = input.parentElement.querySelector('.clear-btn');
          if (clearBtn) {
            const type = clearBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
            clearBtn.setAttribute('onclick', `window.clearSearchableSelect('#${input.id}', '${type}', event)`);
          }
        });

        const mapWrappers = c.querySelectorAll('.map-input-wrapper');
        mapWrappers.forEach(wrap => {
          const onclickAttr = wrap.getAttribute('onclick');
          if (onclickAttr) {
            const target = onclickAttr.includes('start') ? 'start' : 'end';
            wrap.setAttribute('onclick', `window.setMapTarget('${target}', ${newIdx})`);
          }
        });

        const removeBtn = c.querySelector('.remove-task-btn');
        if (removeBtn) {
          removeBtn.setAttribute('onclick', `window.removeTask(${newIdx})`);
        }
      });
      taskCount = remainingCards.length;
    }
  };

  window.clearSearchableSelect = function (inputSelector, type, event) {
    if (event) event.stopPropagation();
    
    const input = document.querySelector(inputSelector);
    if (!input) return;

    input.value = '';
    input.readOnly = true;
    const wrapper = input.parentElement;
    wrapper.classList.remove('has-value');
    wrapper.classList.remove('active');

    if (type === 'device') {
      const currentModuleInput = document.getElementById('currentModuleDisplay');
      if (currentModuleInput) {
        currentModuleInput.value = '';
        currentModuleInput.parentElement.classList.remove('has-value');
      }
    }

    if (type === 'module') {
      selectedModules = [];
    }

    if (type === 'creator') {
      filteredTasks = [...tasks];
      currentPage = 1;
      renderTable();
    }
  };

  // View Navigation
  window.showAddView = function () {
    document.getElementById('listView').classList.add('d-none');
    document.getElementById('addView').classList.remove('d-none');
    
    // Update global breadcrumb
    const pageTitle = document.getElementById('page-title');
    if (pageTitle && !originalBreadcrumb) {
      originalBreadcrumb = pageTitle.innerHTML;
    }
    
    if (pageTitle) {
      pageTitle.innerHTML = `
        <div class="breadcrumbs" style="display:flex; align-items:center; gap:5px;">
          <span style="color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase;">QUẢN LÝ THIẾT BỊ / ĐIỀU PHỐI THỦ CÔNG /</span>
          <span style="color: #1e293b; font-size: 13px; font-weight: 700; text-transform: uppercase;">THIẾT LẬP ĐIỀU PHỐI</span>
        </div>
      `;
    }

    // Reset task container to only 1 task when showing add view
    const container = document.getElementById('tasksContainer');
    const cards = container.querySelectorAll('.task-card');
    cards.forEach((c, idx) => { if(idx > 0) c.remove(); });
    taskCount = 1;
    
    // Reset task 1 fields
    const firstCard = container.querySelector('.task-card');
    if (firstCard) {
      firstCard.id = 'task-1';
      firstCard.querySelector('.task-title').innerText = 'Nhiệm vụ 1';
      const inputs = firstCard.querySelectorAll('input');
      inputs.forEach(i => i.value = '');
    }

    window.setMapTarget('start', 1); // Default picking mode
    initMap();
    initResizer();
  };

  function initResizer() {
    const resizer = document.getElementById('manualResizer');
    const leftPanel = document.getElementById('manualConfigLeftPanel');
    const container = document.querySelector('.config-content');
    if (!resizer || !leftPanel || !container) return;

    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
      resizer.classList.add('active');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const containerRect = container.getBoundingClientRect();
      let newWidth = e.clientX - containerRect.left;
      
      // Constraints
      if (newWidth < 350) newWidth = 350;
      if (newWidth > 800) newWidth = 800;
      
      leftPanel.style.width = newWidth + 'px';
    });

    window.addEventListener('mouseup', () => {
      if (!isResizing) return;
      isResizing = false;
      document.body.style.cursor = 'default';
      resizer.classList.remove('active');
    });
  }

  window.hideAddView = function () {
    document.getElementById('listView').classList.remove('d-none');
    document.getElementById('addView').classList.add('d-none');
    
    // Clear form inputs
    const formInputs = document.querySelectorAll('.init-info-form input');
    selectedModules = [];
    formInputs.forEach(input => {
      input.value = '';
      const wrapper = input.parentElement;
      if (wrapper.classList.contains('searchable-select')) {
        wrapper.classList.remove('has-value', 'active');
      }
    });

    // Restore global breadcrumb
    const pageTitle = document.getElementById('page-title');
    if (pageTitle && originalBreadcrumb) {
      pageTitle.innerHTML = originalBreadcrumb;
    }
  };

  window.setMapTarget = function (target, taskId = 1) {
    currentMapTarget = target;
    currentMapTaskId = taskId;
    
    const startPoint = document.getElementById(`startPoint-${taskId}`);
    const endPoint = document.getElementById(`endPoint-${taskId}`);
    
    if (!startPoint || !endPoint) return;

    const startWrap = startPoint.parentElement;
    const endWrap = endPoint.parentElement;
    
    // Clear other active targets in this card or all cards
    document.querySelectorAll('.map-input-wrapper').forEach(w => w.classList.remove('active'));

    if (target === 'start') startWrap.classList.add('active');
    if (target === 'end') endWrap.classList.add('active');
  };

  window.saveManual = function () {
    const cards = document.querySelectorAll('.task-card');
    const newAddedTasks = [];
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const taskId = card.id.split('-')[1];
      
      const deviceEl = document.getElementById(`deviceDisplay-${taskId}`);
      const actionEl = document.getElementById(`actionDisplay-${taskId}`);
      
      if (!deviceEl || !actionEl) continue;
      
      const device = deviceEl.value;
      const action = actionEl.value;
      
      if (!device || device === 'Chọn thiết bị') {
        alert(`Vui lòng chọn thiết bị cho Nhiệm vụ ${i + 1}`);
        return;
      }

      if (!action || action === 'Chọn hành động') {
        alert(`Vui lòng chọn hành động cho Nhiệm vụ ${i + 1}`);
        return;
      }

      newAddedTasks.push({
        id: tasks.length + newAddedTasks.length + 1,
        name: "Nhiệm vụ mới tạo " + new Date().toLocaleTimeString(),
        device: device,
        action: action,
        creator: "hmhung",
        details: []
      });
    }

    if (newAddedTasks.length === 0) return;

    newAddedTasks.forEach(t => tasks.unshift(t));
    filteredTasks = [...tasks];
    currentPage = 1;
    renderTable();
    window.hideAddView();
    if (window.showToast) window.showToast(`Thêm mới ${newAddedTasks.length} nhiệm vụ thành công`, "success");
  };

  window.activateTask = function (id) {
    if (window.showToast) window.showToast("Kích hoạt điều phối thủ công thành công", "success");
    const task = tasks.find(t => t.id === id);
    if (task && task.details.length > 0) {
      task.details[0].status = 'processing';
      renderTable();
    }
  };

  window.editTask = function (id) {
    if (window.showToast) window.showToast("Tính năng chỉnh sửa đang được phát triển", "info");
  };

  window.deleteTask = function (id) {
    if (confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
      tasks = tasks.filter(t => t.id !== id);
      filteredTasks = filteredTasks.filter(t => t.id !== id);
      renderTable();
      if (window.showToast) window.showToast("Đã xóa nhiệm vụ", "info");
    }
  };

  window.toggleBulkCheck = function (master) {
    const checks = document.querySelectorAll('.task-check');
    checks.forEach(c => c.checked = master.checked);
  };

  // Search
  const taskSearch = document.getElementById('taskSearch');
  if (taskSearch) {
    taskSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      filteredTasks = tasks.filter(t => t.name.toLowerCase().includes(term));
      currentPage = 1;
      renderTable();
    });
  }

  // Map Logic
  function initMap() {
    const grid = document.getElementById('mainMapGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const rows = 20;
    const cols = 38;
    
    grid.style.width = (cols * step) + 'px';
    grid.style.height = (rows * step) + 'px';
    grid.style.transform = `scale(${mapZoom})`;
    grid.style.transformOrigin = 'top left';

    // Column Labels
    for (let c = 0; c < cols; c++) {
      const label = document.createElement('div');
      label.className = 'label-col';
      label.innerText = getColName(c);
      label.style.left = (c * step) + 'px';
      grid.appendChild(label);
    }

    // Row Labels
    for (let r = 0; r < rows; r++) {
      const label = document.createElement('div');
      label.className = 'label-row';
      label.innerText = r + 1;
      label.style.top = (r * step) + 'px';
      grid.appendChild(label);
    }

    // Nodes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const node = document.createElement('div');
        node.className = 'node-hitbox';
        node.style.top = (r * step) + 'px';
        node.style.left = (c * step) + 'px';
        node.innerHTML = '<div class="node-dot"></div>';
        
        const label = getColName(c) + ':' + (r + 1);
        node.onclick = () => selectNode(label, node);
        grid.appendChild(node);
      }
    }
  }

  window.zoomMap = function(factor) {
    mapZoom *= factor;
    if (mapZoom < 0.5) mapZoom = 0.5;
    if (mapZoom > 2) mapZoom = 2;
    const grid = document.getElementById('mainMapGrid');
    if (grid) grid.style.transform = `scale(${mapZoom})`;
  };

  function selectNode(label, element) {
    document.querySelectorAll('.node-hitbox').forEach(n => n.classList.remove('active'));
    element.classList.add('active');

    if (currentMapTarget === 'start') {
      const input = document.getElementById(`startPoint-${currentMapTaskId}`);
      if (input) input.value = label;
      window.setMapTarget('end', currentMapTaskId); // Auto switch
    } else {
      const input = document.getElementById(`endPoint-${currentMapTaskId}`);
      if (input) input.value = label;
    }
    
    if (window.showToast) window.showToast(`Đã chọn vị trí: ${label}`, "info");
  }

  function initSearchableSelects() {
    // Only init the global filter select (the one in the top bar if exists)
    const creators = [...new Set(tasks.map(t => t.creator))];
    const creatorOptions = document.getElementById('creatorOptions');
    if (creatorOptions) {
      creatorOptions.innerHTML = '<div class="select-option" onclick="window.selectOption(\'#creatorDisplay\', \'Tất cả người tạo\', \'creator\')">Tất cả người tạo</div>' + 
        creators.map(c => `<div class="select-option" onclick="window.selectOption('#creatorDisplay', '${c}', 'creator')">${c}</div>`).join('');
    }
    
    // Individual task select options are now rendered on-the-fly in toggleSearchableSelect
  }

  // Click outside listener
  window.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.searchable-select')) {
      document.querySelectorAll('.searchable-select').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.select-input').forEach(i => i.readOnly = true);
    }
  });

  // INITIALIZE
  renderTable();
  initSearchableSelects();
  initMap();

})();
