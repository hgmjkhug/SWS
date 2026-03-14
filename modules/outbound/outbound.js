(function () {
  const ITEMS_PER_PAGE = 20;
  let currentPage = 1;
  let filterPriorityOnly = false;
  
  // --- DATA PERSISTENCE HELPERS ---
  const STORAGE_KEY = 'SWS_OUTBOUND_ORDERS';

  function saveOutboundOrders() {
      try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(outboundData));
      } catch (e) {
          console.error('Error saving to localStorage:', e);
      }
  }

  function loadOutboundOrders() {
      try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
              const parsed = JSON.parse(saved);
              // Convert date strings back to Date objects if needed (rawDate is timestamp or Date)
              return parsed.map(o => {
                  if (o.rawDate) o.rawDate = new Date(o.rawDate);
                  return o;
              });
          }
      } catch (e) {
          console.error('Error loading from localStorage:', e);
      }
      return null;
  }

  // Mock Data Generation
  const MASTER_MATERIALS = [
    {
      code: "MAT-001",
      name: "Thép ống D60",
      category: "Sắt thép",
      method: "FIFO",
    },
    {
      code: "MAT-002",
      name: "Xi măng Hà Tiên",
      category: "Vật liệu xây dựng",
      method: "FIFO",
    },
    {
      code: "MAT-003",
      name: "Gạch men 60x60",
      category: "Gạch ốp lát",
      method: "LIFO",
    },
    {
      code: "MAT-004",
      name: "Sơn Dulux Trong Nhà",
      category: "Sơn & Hóa chất",
      method: "FEFO",
    },
    {
      code: "MAT-005",
      name: "Bóng đèn LED",
      category: "Điện nước",
      method: "FIFO",
    },
    {
      code: "MAT-006",
      name: "Dây điện Cadivi 2.5",
      category: "Điện nước",
      method: "FIFO",
    },
    {
      code: "MAT-007",
      name: "Ống nhựa Bình Minh",
      category: "Điện nước",
      method: "FIFO",
    },
    {
      code: "MAT-008",
      name: "Đá 1x2",
      category: "Vật liệu xây dựng",
      method: "LIFO",
    },
    {
      code: "MAT-009",
      name: "Cát xây dựng",
      category: "Vật liệu xây dựng",
      method: "LIFO",
    },
    {
      code: "MAT-010",
      name: "Gạch ống 4 lỗ",
      category: "Gạch ốp lát",
      method: "FIFO",
    },
  ];

  const USERS = [
    { name: "Đặng Quang Long", id: "user001" },
    { name: "Trần Đức Nam", id: "user002" },
    { name: "Vũ Văn An", id: "user003" },
    { name: "Nguyễn Hoàng An", id: "user004" },
    { name: "Đỗ Hữu Uyên", id: "user005" },
    { name: "Bùi Thanh An", id: "user006" },
    { name: "Đỗ Văn Hải", id: "user007" },
    { name: "Đặng Anh Tâm", id: "user008" },
  ];

  const MOCK_EXPORT_WORKFLOWS = [
    {
      id: 3,
      code: "WF-1002",
      name: "Quy trình xuất kho Tower theo sản phẩm có method FIFO",
    },
    {
      id: 4,
      code: "WF-1003",
      name: "Quy trình xuất kho Tower theo sản phẩm có method LIFO",
    },
    {
      id: 5,
      code: "WF-1004",
      name: "Quy trình xuất kho Tower theo sản phẩm có method FEFO",
    },
    {
      id: 6,
      code: "WF-1005",
      name: "Quy trình xuất kho Stacker crane theo sản phẩm có method FIFO",
    },
    {
      id: 7,
      code: "WF-1006",
      name: "Quy trình xuất kho Stacker crane theo sản phẩm có method LIFO",
    },
    {
      id: 8,
      code: "WF-1007",
      name: "Quy trình xuất kho Stacker crane theo sản phẩm có method FEFO",
    },
    {
      id: 9,
      code: "WF-1008",
      name: "Quy trình xuất kho kho Tower theo pallet",
    },
    {
      id: 10,
      code: "WF-1009",
      name: "Quy trình xuất kho kho Stacker crane theo pallet",
    },
  ];

  const STATUS_LIST = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"];

  // Date Picker State
  let currentLeftDate = new Date();
  let currentRightDate = new Date();
  currentRightDate.setMonth(currentRightDate.getMonth() + 1);

  // Default to today
  const today = new Date();
  let selectedRange = { 
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate()), 
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate()) 
  };
  let tempRange = { start: null, end: null }; // For internal selection before Apply

  let outboundData = loadOutboundOrders();
  if (!outboundData) {
      outboundData = Array.from({ length: 50 }, (_, i) => {
        const id = i + 1;
        const mat =
          MASTER_MATERIALS[Math.floor(Math.random() * MASTER_MATERIALS.length)];
        const user = USERS[Math.floor(Math.random() * USERS.length)];
        const status = STATUS_LIST[Math.floor(Math.random() * STATUS_LIST.length)];
        const qty = Math.floor(Math.random() * 500) + 10;
        const outboundType = Math.random() > 0.5 ? "PALLET" : "MATERIAL";

        // Random Export Workflow
        const wf =
          MOCK_EXPORT_WORKFLOWS[
            Math.floor(Math.random() * MOCK_EXPORT_WORKFLOWS.length)
          ];

        // All records are for today
        const date = new Date(today);
        // Randomize time slightly back for variety
        date.setMinutes(date.getMinutes() - i * 15);
        date.setHours(Math.floor(Math.random() * 24));
        date.setMinutes(Math.floor(Math.random() * 60));

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

          const dateStr = `${hours}:${minutes} - ${day}/${month}/${year}`;
          const dateCode = `${day}${month}${year}`;
      
          // Pallet code logic
          const pallet = `P-A${Math.floor(Math.random() * 10)}-L${Math.floor(Math.random() * 5) + 1}`;
      
          // Generate batches for MATERIAL type according to depletion logic (FIFO/LIFO/FEFO)
          let batches = [];
          if (outboundType === "MATERIAL") {
            let remainingQty = qty;
            
            // Simulate a pool of available receipts for this material
            let availableReceipts = [];
            const poolSize = 10;
            for (let k = 0; k < poolSize; k++) {
                const rTotal = Math.floor(Math.random() * 200) + 50;
                const rDate = new Date(date.getTime() - Math.floor(Math.random() * 5000000000));
                // Simulated expiry date: 6 months to 2 years after receipt
                const rExpiry = new Date(rDate.getTime() + (Math.floor(Math.random() * 18) + 6) * 30 * 24 * 60 * 60 * 1000);
                availableReceipts.push({ total: rTotal, date: rDate, expiry: rExpiry });
            }

            // Sort pool based on method
            if (mat.method === "LIFO") {
                availableReceipts.sort((a, b) => b.date - a.date); // Newest first
            } else if (mat.method === "FEFO") {
                availableReceipts.sort((a, b) => a.expiry - b.expiry); // Earliest expiry first
            } else {
                availableReceipts.sort((a, b) => a.date - b.date); // Oldest first (FIFO)
            }

            for (const receipt of availableReceipts) {
                if (remainingQty <= 0) break;

                const batchQty = Math.min(remainingQty, receipt.total);
                const bPallet = `PL-${Math.floor(Math.random() * 100).toString().padStart(3, "0")}`;
                const bLocation = `K${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 20)}`;
                const bDateStr = `${receipt.date.getHours().toString().padStart(2, "0")}:${receipt.date.getMinutes().toString().padStart(2, "0")} - ${receipt.date.getDate().toString().padStart(2, "0")}/${(receipt.date.getMonth() + 1).toString().padStart(2, "0")}/${receipt.date.getFullYear()}`;
                
                const expDay = String(receipt.expiry.getDate()).padStart(2, "0");
                const expMonth = String(receipt.expiry.getMonth() + 1).padStart(2, "0");
                const expYear = receipt.expiry.getFullYear();
                const bExpiryStr = `${expDay}/${expMonth}/${expYear}`;

                batches.push({
                    inboundCode: `${bPallet}_${mat.code}_${receipt.total}_${receipt.date.toISOString().slice(2,10).replace(/-/g, "")}`,
                    exportedQty: batchQty,
                    totalQty: receipt.total,
                    pallet: bPallet,
                    location: bLocation,
                    date: bDateStr,
                    expiryDate: bExpiryStr
                });

                remainingQty -= batchQty;
            }

            // If we still have remainingQty (unlikely with this pool), just grow the last batch
            if (remainingQty > 0 && batches.length > 0) {
                batches[batches.length - 1].exportedQty += remainingQty;
                batches[batches.length - 1].totalQty = Math.max(batches[batches.length - 1].totalQty, batches[batches.length - 1].exportedQty);
            }
          }
      
          return {
            id: id,
            code: `${pallet}_${mat.code}_${qty}_${dateCode}`,
            materialCode: mat.code,
            materialName: mat.name,
            materialMethod: mat.method,
            quantity: qty,
            date: dateStr,
            status: status,
            creatorId: user.id,
            creatorName: user.name,
            outboundType: outboundType,
            workflow: wf,
            rawDate: date,
            batches: batches,
            priority: Math.random() > 0.8
          };
      }).sort((a, b) => b.rawDate - a.rawDate);
  }

  let filteredData = [...outboundData];

  // Pallet Code Counter
  let palletCounter = 1;

  // Mock Inventory Data (Unique per Material)
  const MOCK_INVENTORY = MASTER_MATERIALS.map((mat) => {
    const batches = Array.from({
      length: Math.floor(Math.random() * 3) + 1,
    }).map((_, i) => {
      const quantity = Math.floor(Math.random() * 100) + 10;
      const pallet = `PL-${String(palletCounter++).padStart(3, "0")}`;
      const location = `K${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 20)}`;
      const createdDate = new Date(
        Date.now() - Math.floor(Math.random() * 10000000000),
      );

      // Format YYMMDD
      const yymmdd = createdDate.toISOString().slice(2, 10).replace(/-/g, "");

      const inputCode = `${pallet}_${mat.code}_${quantity}_${yymmdd}`;

      return {
        inputCode: inputCode,
        quantity: quantity,
        pallet: pallet,
        location: location,
        createdDate: createdDate.toISOString(),
      };
    });

    const totalQuantity = batches.reduce(
      (sum, batch) => sum + batch.quantity,
      0,
    );

    return {
      id: mat.code,
      code: mat.code,
      name: mat.name,
      category: mat.category,
      method: mat.method,
      quantity: totalQuantity,
      batches: batches,
    };
  });

  // Mock Pallet Inventory Data
  const MOCK_PALLET_INVENTORY = Array.from({ length: 50 }, (_, i) => {
    const mat =
      MASTER_MATERIALS[Math.floor(Math.random() * MASTER_MATERIALS.length)];
    const quantity = Math.floor(Math.random() * 100) + 10;
    const pallet = `PL-${String(i + 1).padStart(3, "0")}`;
    const location = `K${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 20)}`;
    const createdDate = new Date(
      Date.now() - Math.floor(Math.random() * 10000000000),
    );

    // Format YYMMDD for input code
    const yymmdd = createdDate.toISOString().slice(2, 10).replace(/-/g, "");
    const inputCode = `${pallet}_${mat.code}_${quantity}_${yymmdd}`;

    return {
      id: `pallet-${i + 1}`,
      palletCode: pallet,
      inputCode: inputCode,
      materialCode: mat.code,
      materialName: mat.name,
      quantity: quantity,
      location: location,
      createdDate: createdDate.toISOString(),
    };
  });

  // Filter State
  let selectedMaterialGroups = new Set();
  let selectedOutboundMethods = new Set();
  let tempSelectedGroups = new Set();

  let tempSelectedMethods = new Set();
  let activeFilterColumn = null;

  window.renderMaterialSelectionTable = function (filterText = "") {
    const tbody = document.getElementById("material-selection-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    const term = filterText.toLowerCase();

    // Reset filters if search text changes (optional, but keeps it simple)
    // For now, let's keep filters active even with search

    const filtered = MOCK_INVENTORY.filter((item) => {
      const matchesSearch =
        item.code.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term);
      const matchesGroup =
        selectedMaterialGroups.size === 0 ||
        selectedMaterialGroups.has(item.category);
      const matchesMethod =
        selectedOutboundMethods.size === 0 ||
        selectedOutboundMethods.has(item.method);

      return matchesSearch && matchesGroup && matchesMethod;
    });

    if (filtered.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center; padding: 20px; color:#64748b;">Không tìm thấy sản phẩm</td></tr>';
      return;
    }

    filtered.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.className = "clickable-row";
      tr.dataset.id = item.id;

      tr.onclick = (e) => {
        // Prevent toggling if clicking directly on input or radio
        if (e.target.tagName === "INPUT") {
          if (e.target.type === "radio") {
            // Check radio logic
            document
              .querySelectorAll("#material-selection-body tr")
              .forEach((r) => r.classList.remove("selected"));
            tr.classList.add("selected");
            const saveBtn = document.getElementById("btn-save-outbound");
            if (saveBtn) saveBtn.disabled = false;
          }
          return;
        }

        // Select the radio when clicking anywhere on the row
        const radio = tr.querySelector(
          `input[type="radio"][value="${item.id}"]`,
        );
        if (radio) {
          radio.checked = true;
          document
            .querySelectorAll("#material-selection-body tr")
            .forEach((r) => r.classList.remove("selected"));
          tr.classList.add("selected");
          // Enable Save Button
          const saveBtn = document.getElementById("btn-save-outbound");
          if (saveBtn) saveBtn.disabled = false;
        }

        // Toggle Sub-table
        const existingSubRow = document.getElementById(`sub-row-${item.id}`);
        if (existingSubRow) {
          existingSubRow.remove();
          tr.classList.remove("expanded");
        } else {
          // Close other open sub-rows (optional, but good for focus)
          document
            .querySelectorAll(".sub-table-row")
            .forEach((row) => row.remove());
          document
            .querySelectorAll(".clickable-row")
            .forEach((r) => r.classList.remove("expanded"));

          tr.classList.add("expanded");
          const subRow = document.createElement("tr");
          subRow.id = `sub-row-${item.id}`;
          subRow.className = "sub-table-row";

          // Format batches
          const batchesHtml = item.batches
            .map((batch) => {
              const date = new Date(batch.createdDate);
              const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} - ${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
              return `
                        <tr>
                            <td>${batch.inputCode}</td>
                            <td style="text-align: center">${batch.quantity}</td>
                            <td style="text-align: center">${batch.pallet}</td>
                            <td style="text-align: center">${batch.location}</td>
                            <td style="text-align: center">${formattedDate}</td>
                        </tr>
                    `;
            })
            .join("");

          subRow.innerHTML = `
                    <td colspan="2" style="padding: 0; background-color: transparent; border: none;"></td>
                    <td colspan="6" style="padding: 0;">
                        <div class="sub-table-container">
                            <table class="sub-table">
                                <thead>
                                    <tr>
                                        <th rowspan="2" style="vertical-align: middle;">Mã lệnh nhập</th>
                                        <th rowspan="2" style="text-align: center; vertical-align: middle;">Số lượng</th>
                                        <th colspan="2" style="text-align: center;">Thông tin lưu</th>
                                        <th rowspan="2" style="text-align: center; vertical-align: middle;">Thời gian tạo</th>
                                    </tr>
                                    <tr>
                                        <th style="font-weight: 500; text-align: center;">Pallet</th>
                                        <th style="font-weight: 500; text-align: center;">Vị trí</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${batchesHtml}
                                </tbody>
                            </table>
                        </div>
                    </td>
                `;

          tr.after(subRow);
        }
      };

      tr.innerHTML = `
            <td style="text-align:center;"><input type="radio" name="selectedMaterial" value="${item.id}"></td>
            <td style="text-align:center;">${index + 1}</td>
            <td style="font-weight:600; color:#334155">${item.code}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td style="text-align: center">
                <span class="method-badge method-${item.method}">${item.method}</span>
            </td>
            <td style="text-align:center; font-weight:600; color:#076EB8">${item.quantity}</td>
            <td style="text-align: right">
                <input type="number" class="form-control quantity-input" id="qty-${item.id}" value="1" min="1" max="${item.quantity}" style="text-align: right; width: 100px;" 
                onclick="event.stopPropagation()"
                oninput="
                    this.value = this.value.replace(/[^0-9]/g, ''); // Remove non-numeric
                    let val = parseInt(this.value);
                    if (isNaN(val) || val <= 0) {
                        this.classList.add('input-error');
                        // Optional: Disable save if any input is invalid?
                    } else if (val > ${item.quantity}) {
                         this.classList.add('input-error');
                    } else {
                         this.classList.remove('input-error');
                    }
                "
                onblur="
                    let val = parseInt(this.value);
                    if (isNaN(val) || val <= 0) {
                        this.value = 1;
                        this.classList.remove('input-error');
                    } else if (val > ${item.quantity}) {
                        this.value = ${item.quantity};
                        this.classList.remove('input-error');
                    }
                "
                >
            </td>
        `;
      tbody.appendChild(tr);
    });
  };

  window.renderPalletSelectionTable = function (searchTerm = "") {
    const tbody = document.getElementById("pallet-selection-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    // Filter MOCK_PALLET_INVENTORY based on searchTerm
    const filteredData = MOCK_PALLET_INVENTORY.filter((item) => {
      if (!searchTerm) return true;
      return item.palletCode.toLowerCase().includes(searchTerm.toLowerCase());
    });

    filteredData.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.className = "clickable-row";
      tr.onclick = (e) => {
        if (e.target.type === "radio") {
          document
            .querySelectorAll("#pallet-selection-body tr")
            .forEach((r) => r.classList.remove("selected"));
          tr.classList.add("selected");
          const saveBtn = document.getElementById("btn-save-outbound");
          if (saveBtn) saveBtn.disabled = false;
          return;
        }

        const radio = tr.querySelector(
          `input[type="radio"][value="${item.id}"]`,
        );
        if (radio) {
          radio.checked = true;
          document
            .querySelectorAll("#pallet-selection-body tr")
            .forEach((r) => r.classList.remove("selected"));
          tr.classList.add("selected");
          const saveBtn = document.getElementById("btn-save-outbound");
          if (saveBtn) saveBtn.disabled = false;
        }
      };

      const date = new Date(item.createdDate);
      const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} - ${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;

      tr.innerHTML = `
            <td style="text-align:center;"><input type="radio" name="selectedPallet" value="${item.id}"></td>
            <td style="text-align:center;">${index + 1}</td>
            <td style="font-weight:600; color:#334155">${item.palletCode}</td>
            <td title="${item.inputCode}"><div class="truncate-cell">${item.inputCode}</div></td>
            <td style="color: #64748b;">${item.materialCode}</td>
            <td style="font-weight: 500; color:#334155">${item.materialName}</td>
            <td style="text-align: center; font-weight: 600; color:#076EB8">${item.quantity}</td>
            <td style="text-align: center;">${formattedDate}</td>
            <td style="text-align: center;">${item.location}</td>
        `;
      tbody.appendChild(tr);
    });
  };

  window.filterPalletSelection = function () {
    const input = document.getElementById("pallet-search-input");
    if (!input) return;
    const searchTerm = input.value.trim();
    renderPalletSelectionTable(searchTerm);
  };

  window.filterMaterialSelection = function () {
    const input = document.getElementById("material-search-input");
    if (input) {
      window.renderMaterialSelectionTable(input.value);
    }
  };

  // --- Column Filter Logic ---

  window.toggleColumnFilter = function (event, columnType) {
    event.stopPropagation();
    const dropdown = document.getElementById(`dropdown-${columnType}`);
    const isActive = dropdown.classList.contains("show");

    // Close all other dropdowns
    document
      .querySelectorAll(".column-filter-dropdown")
      .forEach((d) => d.classList.remove("show"));
    document
      .querySelectorAll(".filter-trigger")
      .forEach((d) => d.classList.remove("active"));
    document
      .querySelectorAll("th")
      .forEach((th) => th.classList.remove("active-filter-header"));

    if (!isActive) {
      dropdown.classList.add("show");
      event.currentTarget.classList.add("active");
      const th = event.currentTarget.closest("th");
      if (th) th.classList.add("active-filter-header");
      activeFilterColumn = columnType;

      // Populate options
      renderFilterOptions(columnType);
    } else {
      activeFilterColumn = null;
    }
  };

  window.closeColumnFilter = function (columnType) {
    const dropdown = document.getElementById(`dropdown-${columnType}`);
    if (dropdown) dropdown.classList.remove("show");
    const trigger = document.querySelector(
      `.header-content .filter-trigger[onclick*="'${columnType}'"]`,
    );
    if (trigger) trigger.classList.remove("active");
    activeFilterColumn = null;
  };

  window.applyColumnFilter = function (columnType) {
    if (columnType === "category") {
      selectedMaterialGroups = new Set(tempSelectedGroups);
    } else if (columnType === "method") {
      selectedOutboundMethods = new Set(tempSelectedMethods);
    }
    closeColumnFilter(columnType);
    window.filterMaterialSelection();
  };

  function renderFilterOptions(columnType) {
    const list = document.getElementById(`list-${columnType}`);
    if (!list) return;

    list.innerHTML = "";

    // Get unique values from MOCK_INVENTORY
    const uniqueValues = new Set(
      MOCK_INVENTORY.map((item) => item[columnType]),
    );
    const currentSelection =
      columnType === "category"
        ? selectedMaterialGroups
        : selectedOutboundMethods;

    // Reset temp selection to current selection
    if (columnType === "category") {
      tempSelectedGroups = new Set(currentSelection);
    } else {
      tempSelectedMethods = new Set(currentSelection);
    }

    uniqueValues.forEach((val) => {
      const item = document.createElement("label");
      item.className = "filter-checkbox-item";

      const isChecked =
        currentSelection.size === 0 || currentSelection.has(val); // Initially all checked if empty? Or empty means all? Let's say empty means all.
      // Logic: If selection is empty, it means "All". But for checkbox UI, usually "All" is distinct.
      // Let's adopt: Empty set = Show All. But in UI, if Empty set, show all unchecked? Or all checked?
      // Better: Empty set = Show All. In UI, checking specific items filters to those.
      // So if size === 0, checks are unchecked?
      // Let's try: Users check what they want to see. If nothing checked, show all (or nothing?).
      // Standard behavior: Nothing checked usually means "All" or "None".
      // Let's implement: If size > 0, only show checked. If size == 0, show all.
      // In UI: If size == 0, all unchecked.

      const checkedState = currentSelection.has(val);

      item.innerHTML = `
            <input type="checkbox" value="${val}" ${checkedState ? "checked" : ""}>
            <span>${val}</span>
        `;

      const checkbox = item.querySelector("input");
      checkbox.onclick = (e) => {
        e.stopPropagation();
        const value = e.target.value;
        const targetSet =
          columnType === "category" ? tempSelectedGroups : tempSelectedMethods;

        if (e.target.checked) {
          targetSet.add(value);
        } else {
          targetSet.delete(value);
        }
      };

      list.appendChild(item);
    });
  }

  // Close filters when clicking outside
  document.addEventListener("click", function (e) {
    if (
      !e.target.closest(".column-filter-dropdown") &&
      !e.target.classList.contains("filter-trigger")
    ) {
      document
        .querySelectorAll(".column-filter-dropdown")
        .forEach((d) => d.classList.remove("show"));
      document
        .querySelectorAll(".filter-trigger")
        .forEach((d) => d.classList.remove("active"));
      document
        .querySelectorAll(".data-table th")
        .forEach((th) => th.classList.remove("active-filter-header"));
    }
  });

  // Status Configuration
  const statusConfig = {
    PENDING: { label: "Đang chờ", class: "status-PENDING" },
    PROCESSING: { label: "Đang xử lý", class: "status-PROCESSING" },
    COMPLETED: { label: "Hoàn thành", class: "status-COMPLETED" },
    CANCELLED: { label: "Lỗi", class: "status-CANCELLED" },
  };

  // Initialize
  function initOutbound() {
    renderOutboundTable();

    // Close dropdowns when clicking outside
    document.addEventListener("click", function (e) {
      // Status Dropdown
      const statusDropdown = document.getElementById("status-dropdown");
      if (statusDropdown && !statusDropdown.contains(e.target)) {
        statusDropdown.classList.remove("open");
      }

      // Type Dropdown
      const typeDropdown = document.getElementById("type-dropdown");
      if (typeDropdown && !typeDropdown.contains(e.target)) {
        typeDropdown.classList.remove("open");
      }

      // Creator Combobox
      const creatorWrapper = document.getElementById(
        "creator-combobox-wrapper",
      );
      const creatorDropdown = document.getElementById(
        "creator-combobox-dropdown",
      );
      const creatorArrow = document.querySelector(".combobox-arrow");
      if (creatorWrapper && !creatorWrapper.contains(e.target)) {
        creatorDropdown?.classList.remove("show");
        creatorArrow?.classList.remove("active");
      }
    });

    // Initial Render of Creator Options
    initCreatorCombobox();

    // Handle Enter key in Add Modal inputs
    const inputs = document.querySelectorAll(
      ".modal-body input, .modal-body select",
    );
    inputs.forEach((input) => {
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          addOutboundOrder();
        }
      });
    });

    // Initialize Date Picker
    initPickerDropdowns();
    renderCalendars();
    setupExtraListeners();

    // Initial Date Display Sync
    const triggerDisplay = document.getElementById("dateRangeDisplay");
    if (triggerDisplay && selectedRange.start && selectedRange.end) {
      const s = selectedRange.start;
      const e = selectedRange.end;
      const dayS = String(s.getDate()).padStart(2, "0");
      const monthS = String(s.getMonth() + 1).padStart(2, "0");
      const dayE = String(e.getDate()).padStart(2, "0");
      const monthE = String(e.getMonth() + 1).padStart(2, "0");
      triggerDisplay.textContent = `${dayS}/${monthS}/${s.getFullYear()} - ${dayE}/${monthE}/${e.getFullYear()}`;
      
      // Also sync temp range so picker matches main display
      tempRange = { ...selectedRange };
      updateRangeDisplay();
    }

    // Horizontal Scroll Synchronization
    const scrollSync = (bodyId, headerId, isTransform = false) => {
      const body = document.getElementById(bodyId);
      const header = document.getElementById(headerId);
      if (body && header) {
        body.addEventListener("scroll", () => {
          if (isTransform) {
            header.style.transform = `translateX(-${body.scrollLeft}px)`;
          } else {
            header.scrollLeft = body.scrollLeft;
          }
        });
      }
    };

    scrollSync("mainBodyScroll", "mainHeaderScroll");
    scrollSync("materialBodyScroll", "materialHeaderTable", true);
    scrollSync("palletBodyScroll", "palletHeaderTable", true);
  }

  // Render Table with Pagination
  function renderOutboundTable() {
    const tbody = document.getElementById("table-body");
    const searchInput = document.getElementById("search-input");
    const filterStatusEl = document.getElementById("filter-status");

    if (!tbody || !searchInput || !filterStatusEl) return;

    const searchTerm = searchInput.value.toLowerCase();
    const filterStatus = filterStatusEl.value;
    const filterType = document.getElementById("filter-type")?.value || "ALL";

    // 1. Filter Data
    filteredData = outboundData.filter((item) => {
      const matchesSearch =
        item.code.toLowerCase().includes(searchTerm) ||
        item.materialCode.toLowerCase().includes(searchTerm) ||
        item.materialName.toLowerCase().includes(searchTerm);

      const matchesStatus =
        filterStatus === "ALL" || item.status === filterStatus;

      const matchesType =
        filterType === "ALL" || item.outboundType === filterType;

      const matchesCreator =
        !selectedCreatorId || item.creatorId === selectedCreatorId;

      const matchesPriority = !filterPriorityOnly || item.priority === true;

      // Date Range Filter
      let matchesDate = true;
      if (selectedRange.start && selectedRange.end) {
        matchesDate = isDateInRange(
          item.rawDate,
          selectedRange.start,
          selectedRange.end,
        );
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesCreator &&
        matchesPriority &&
        matchesDate
      );
    });

    // 2. Pagination Logic
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = filteredData.slice(start, end);

    // 3. Render Rows
    tbody.innerHTML = "";
    if (pageData.length === 0) {
      // Updated styling to be clearer
      tbody.innerHTML =
        '<tr><td colspan="9" style="text-align:center; padding: 40px; color:#64748b; font-style:italic;">Không tìm thấy kết quả phù hợp</td></tr>';
    } else {
      pageData.forEach((item, index) => {
        const statusInfo = statusConfig[item.status] || {
          label: item.status,
          class: "",
        };

        const isPending = item.status === "PENDING";
        const deleteTitle = isPending ? "Xóa" : "Chỉ có thể xóa lệnh đang chờ";
        const deleteDisabled = isPending ? "" : "disabled";
  
        const tr = document.createElement("tr");
        if (item.outboundType === "MATERIAL") {
            tr.className = "clickable-row";
            tr.onclick = (e) => {
                if (e.target.closest('.btn-icon') || e.target.closest('.copy-icon')) return;
                window.toggleOutboundSubTable(item.id, tr);
            };
        }
  
        tr.innerHTML = `
                <td style="text-align:center">${start + index + 1}</td>
                <td>
                    <div class="code-container" style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #475569;">
                        <span class="code-text" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">${item.code}</span>
                        <span class="copy-icon" onclick="copyCode('${item.code}', this, event)" title="Sao chép">
                            <i class="far fa-copy"></i>
                            <span class="copy-popover">Copied!</span>
                        </span>
                    </div>
                </td>

                <td>
                    <div class="product-item" style="position: relative; padding-left: 22px;">
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">
                            <span class="prod-code" style="font-weight: 500; color: #0284c7; font-size: 13px;">${item.materialCode}</span>
                            <span style="font-weight: 600; color: #334155; font-size: 14px; margin-left: 4px;"> - ${item.materialName}</span>
                        </div>
                        <div style="font-size:12px; color:#076EB8; font-weight: 600; margin-top: 4px;">Số lượng: ${item.quantity}</div>
                    </div>
                </td>

                <td style="text-align: center">
                    <span class="outbound-type-badge type-${item.outboundType}">
                        ${item.outboundType === "PALLET" ? "Xuất theo container" : "Xuất theo sản phẩm"}
                    </span>
                </td>
                <!-- <td style="text-align: left;">
                    <div style="color: #475569; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 250px;" title="${item.workflow ? `[${item.workflow.code}] ${item.workflow.name}` : '-'}">
                        ${item.workflow ? `[${item.workflow.code}] ${item.workflow.name}` : '-'}
                    </div>
                </td> -->
                <td style="text-align:center">
                    <span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>
                </td>
                <td style="text-align:center">
                    <label class="priority-toggle-switch">
                        <input type="checkbox" ${item.priority ? 'checked' : ''} disabled>
                        <span class="priority-toggle-slider"></span>
                    </label>
                </td>
                <td style="text-align: left;">
                    <div class="product-item" style="border-bottom:none; min-height: fit-content; padding-left: 18px;">
                        <div style="font-size: 13px; color: #334155;">
                            <span style="font-weight: 600;">Thời gian:</span> ${item.date}
                        </div>
                        <div style="font-size: 13px; color: #334155; margin-top: 2px;">
                            <span style="font-weight: 600;">Người tạo:</span> ${item.creatorName} (${item.creatorId})
                        </div>
                    </div>
                </td>
                <td style="text-align:center">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                        <button class="btn-icon btn-view" title="Xem chi tiết" onclick="event.stopPropagation(); window.showOutboundDetail('${item.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-delete" title="${deleteTitle}" onclick="deleteOutboundItem(${item.id})" ${deleteDisabled}>
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
        tbody.appendChild(tr);
      });
    }

    updateOutboundPagination(totalItems, totalPages);
  }

  // Pagination Controls
  function updateOutboundPagination(totalItems, totalPages) {
    const infoEl = document.getElementById("pagination-info");
    const pageNumsEl = document.getElementById("page-numbers");
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");
    const gotoInput = document.getElementById("goto-page");
    const controlsContainer = document.querySelector(".pagination-controls");

    if (!infoEl) return;

    if (totalItems === 0) {
      infoEl.textContent = "Không có dữ liệu";
      // Hide controls if no data
      if (controlsContainer) controlsContainer.style.visibility = "hidden";
    } else {
      if (controlsContainer) controlsContainer.style.visibility = "visible";

      const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
      const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
      infoEl.textContent = `Hiển thị ${start} - ${end} trong ${totalItems}`;

      // Generate Page Numbers
      if (pageNumsEl) {
        pageNumsEl.innerHTML = "";
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
          startPage = Math.max(1, endPage - maxVisible + 1);
        }
        // Enhance robustness
        startPage = Math.max(1, startPage);
        endPage = Math.min(totalPages, endPage);

        for (let i = startPage; i <= endPage; i++) {
          const btn = document.createElement("button");
          btn.className = "page-btn" + (i === currentPage ? " active" : "");
          btn.textContent = i;
          btn.onclick = () => {
            currentPage = i;
            renderOutboundTable();
          };
          pageNumsEl.appendChild(btn);
        }
      }

      if (prevBtn) prevBtn.disabled = currentPage <= 1;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
      if (gotoInput) {
        gotoInput.max = totalPages;
        gotoInput.value = "";
      }
    }
  }

  function outboundPrevPage() {
    if (currentPage > 1) {
      currentPage--;
      renderOutboundTable();
    }
  }

  function outboundNextPage() {
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderOutboundTable();
    }
  }

  window.toggleOutboundSubTable = function (id, tr) {
    const existingSubRow = document.getElementById(`outbound-sub-row-${id}`);
    if (existingSubRow) {
      existingSubRow.remove();
      tr.classList.remove("expanded");
    } else {
      // Close other open sub-rows
      document.querySelectorAll(".sub-table-row").forEach((row) => row.remove());
      document.querySelectorAll(".clickable-row").forEach((r) => r.classList.remove("expanded"));

      const item = outboundData.find((d) => d.id === id);
      if (!item || !item.batches || item.batches.length === 0) return;

      tr.classList.add("expanded");
      const subRow = document.createElement("tr");
      subRow.id = `outbound-sub-row-${id}`;
      subRow.className = "sub-table-row";

      const batchesHtml = item.batches
        .map((batch) => {
          return `
                <tr>
                    <td style="text-align: left; padding-left: 15px; width: 350px;">${batch.inboundCode}</td>
                    <td style="text-align: center; font-weight: 600; color: #076EB8; width: 130px;">${batch.exportedQty}/${batch.totalQty}</td>
                    <td style="text-align: center; width: 130px;">${batch.pallet}</td>
                    <td style="text-align: center; width: 100px;">${batch.location}</td>
                    <td style="text-align: center; width: 180px;">${batch.date}</td>
                    <td style="text-align: center; width: 150px;">${batch.expiryDate || '-'}</td>
                </tr>
            `;
        })
        .join("");

      subRow.innerHTML = `
            <td colspan="1" style="border:none; background: transparent;"></td>
            <td colspan="6" style="padding: 0;">
                <div class="sub-table-container" style="padding: 10px 20px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);">
                    <table class="sub-table" style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">
                        <thead>
                            <tr style="background-color: #076eb8;">
                                <th style="text-align: left; color: white; padding: 10px 15px; font-weight: 600; width: 350px;">Mã lệnh nhập</th>
                                <th style="text-align: center; color: white; padding: 10px 12px; font-weight: 600; width: 130px;">Đã xuất/Tổng</th>
                                <th style="text-align: center; color: white; padding: 10px 12px; font-weight: 600; width: 130px;">Container</th>
                                <th style="text-align: center; color: white; padding: 10px 12px; font-weight: 600; width: 100px;">Vị trí</th>
                                <th style="text-align: center; color: white; padding: 10px 12px; font-weight: 600; width: 180px;">Thời gian hoàn thành</th>
                                <th style="text-align: center; color: white; padding: 10px 12px; font-weight: 600; width: 150px;">Ngày hết hạn</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${batchesHtml}
                        </tbody>
                    </table>
                </div>
            </td>
        `;

      tr.after(subRow);
    }
  };

  function outboundGotoPage(page) {
    const p = parseInt(page);
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    if (p >= 1 && p <= totalPages) {
      currentPage = p;
      renderOutboundTable();
    }
  }

  // Filter Logic
  function filterOutboundData() {
    currentPage = 1; // Reset to page 1 on search
    renderOutboundTable();
  }

  function toggleOutboundTypeDropdown() {
    const dropdown = document.getElementById("type-dropdown");
    if (dropdown) dropdown.classList.toggle("open");
  }

  function selectOutboundType(value, label) {
    const input = document.getElementById("filter-type");
    const labelEl = document.getElementById("type-selected-label");

    if (input) input.value = value;
    if (labelEl) labelEl.innerText = label;

    // Update active class
    const dropdown = document.getElementById("type-dropdown");
    if (dropdown) {
      dropdown.querySelectorAll(".dropdown-option").forEach((opt) => {
        opt.classList.toggle(
          "active",
          opt.getAttribute("data-value") === value,
        );
      });
      dropdown.classList.remove("open");
    }

    currentPage = 1;
    renderOutboundTable();
  }

  // --- Creator Combobox Logic ---
  let selectedCreatorId = null;

  function initCreatorCombobox() {
    renderCreatorOptions();
  }

  function renderCreatorOptions(filterText = "") {
    const list = document.getElementById("creator-combobox-list");
    if (!list) return;

    const term = filterText.toLowerCase();
    let html = "";

    // "All" option
    if (!term || "tất cả".includes(term)) {
      html += `<li class="combobox-option ${selectedCreatorId === null ? "selected" : ""}" onclick="selectOutboundCreator(null, 'Tất cả')">
            <span>Tất cả</span>
        </li>`;
    }

    USERS.forEach((u) => {
      const searchStr = `${u.id.toLowerCase()} ${u.name.toLowerCase()}`;
      if (!term || searchStr.includes(term)) {
        html += `<li class="combobox-option ${selectedCreatorId === u.id ? "selected" : ""}" onclick="selectOutboundCreator('${u.id}', '${u.name}')">
                <span>${u.name}</span>
                <span class="sub-text">(${u.id})</span>
            </li>`;
      }
    });

    if (html === "") {
      html = `<li class="combobox-option no-results">Không tìm thấy kết quả</li>`;
    }

    list.innerHTML = html;
  }

  function toggleOutboundCreatorCombobox() {
    const dropdown = document.getElementById("creator-combobox-dropdown");
    const arrow = document.querySelector(".combobox-arrow");
    const input = document.getElementById("creator-combobox-input");

    if (dropdown) {
      const isShow = dropdown.classList.contains("show");
      if (!isShow) {
        dropdown.classList.add("show");
        arrow?.classList.add("active");
        input?.focus();
        renderCreatorOptions(input.value === "Tất cả" ? "" : input.value);
      } else {
        dropdown.classList.remove("show");
        arrow?.classList.remove("active");
      }
    }
  }

  // --- Workflow Custom Combobox Logic ---

  // Make mock workflows global if needed for closure in window functions
  if (typeof MOCK_EXPORT_WORKFLOWS !== "undefined") {
    window.GLOBAL_WORKFLOWS = MOCK_EXPORT_WORKFLOWS;
  }

  window.toggleWorkflowCombobox = function (target, event) {
    if (event) event.stopPropagation();

    let wrapper;
    let itemId;

    if (typeof target === "string") {
      itemId = target;
      wrapper = document.getElementById(`wf-combo-${target}`);
    } else {
      wrapper = target;
      itemId = target.dataset.itemId;
    }

    if (!wrapper) return;

    const dropdown = document.getElementById(`wf-list-${itemId}`);
    const input = document.getElementById(`wf-input-${itemId}`);

    // Close all other comboboxes
    document.querySelectorAll(".custom-combobox.active").forEach((el) => {
      if (el !== wrapper) el.classList.remove("active");
    });

    const isActive = wrapper.classList.contains("active");

    if (!isActive) {
      wrapper.classList.add("active");
      renderWorkflowOptions(itemId);
      if (input) {
        input.removeAttribute("readonly");
        input.focus();
      }
    } else {
      // Only toggle off if we clicked the wrapper icon or if it was already active
      wrapper.classList.remove("active");
      if (input) input.setAttribute("readonly", true);
    }
  };

  window.renderWorkflowOptions = function (itemId, filterText = "") {
    const list = document.getElementById(`wf-list-${itemId}`);
    if (!list) return;

    const term = filterText.toLowerCase().trim();
    let html = "";

    // Use global or local mock data
    const workflows = window.GLOBAL_WORKFLOWS || [];

    const matches = workflows.filter(
      (wf) =>
        wf.name.toLowerCase().includes(term) ||
        wf.code.toLowerCase().includes(term),
    );

    if (matches.length > 0) {
      html = matches
        .map(
          (wf) => `
            <div class="combobox-option" onclick="selectWorkflow('${itemId}', '${wf.id}', '${wf.code}', '${wf.name}', event)">
                <span style="color: var(--active-color); font-weight: 600; margin-right: 8px;">[${wf.code}]</span>
                <span>${wf.name}</span>
            </div>
        `,
        )
        .join("");
    } else {
      html = `<div class="combobox-option no-results">Không tìm thấy quy trình</div>`;
    }

    list.innerHTML = html;
  };

  window.filterWorkflowOptions = function (itemId, value) {
    renderWorkflowOptions(itemId, value);
  };

  window.selectWorkflow = function (itemId, wfId, wfCode, wfName, event) {
    if (event) event.stopPropagation();

    const input = document.getElementById(`wf-input-${itemId}`);
    const wrapper = document.getElementById(`wf-combo-${itemId}`);

    if (input) {
      input.value = `[${wfCode}] ${wfName}`;
      input.setAttribute("readonly", true); // restore readonly
      // Store selected value in dataset or a global map if needed for saving
      input.dataset.selectedId = wfId;
      input.classList.remove("input-error"); // clear error if any
    }

    if (wrapper) {
      wrapper.classList.remove("active");
    }
  };

  // Global click outside to close workflow comboboxes
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".custom-combobox")) {
      document.querySelectorAll(".custom-combobox.active").forEach((el) => {
        el.classList.remove("active");
        const input = el.querySelector(".combobox-input");
        if (input) input.setAttribute("readonly", true);
      });
    }
  });
  function handleOutboundCreatorComboboxSearch(inputElement) {
    const val = inputElement.value;
    const dropdown = document.getElementById("creator-combobox-dropdown");

    if (!dropdown.classList.contains("show")) {
      dropdown.classList.add("show");
      document.querySelector(".combobox-arrow")?.classList.add("active");
    }

    renderCreatorOptions(val);
  }

  function selectOutboundCreator(id, text) {
    selectedCreatorId = id;
    const input = document.getElementById("creator-combobox-input");
    if (input) input.value = text;

    const dropdown = document.getElementById("creator-combobox-dropdown");
    if (dropdown) {
      dropdown.classList.remove("show");
      document.querySelector(".combobox-arrow")?.classList.remove("active");
    }

    currentPage = 1;
    renderOutboundTable();
  }

  // Custom Dropdown Logic
  function toggleOutboundStatusDropdown(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("open");
  }

  function copyCode(code, element, event) {
    if (event) event.stopPropagation();

    const showPopover = () => {
      const popover = element.querySelector(".copy-popover");
      if (popover) {
        popover.classList.add("show");
        setTimeout(() => {
          popover.classList.remove("show");
        }, 2000);
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          showPopover();
        })
        .catch((err) => {
          console.error("Clipboard API failed, trying fallback:", err);
          fallbackCopy(code, showPopover);
        });
    } else {
      fallbackCopy(code, showPopover);
    }
  }

  function fallbackCopy(text, onSuccess) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Ensure it's not visible but part of DOM
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        if (onSuccess) onSuccess();
      } else {
        console.error("Fallback copy failed.");
        alert("Không thể sao chép: " + text);
      }
    } catch (err) {
      console.error("Fallback copy error:", err);
      alert("Lỗi sao chép: " + err);
    }
  }
  // --- DATE PICKER LOGIC ---

  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  function formatDate(date) {
    if (!date) return "";
    const d = date.getDate();
    const m = date.toLocaleString("default", { month: "long" });
    const y = date.getFullYear();
    return `${d} ${m} ${y}`;
  }

  function isSameDay(d1, d2) {
    if (!d1 || !d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  function isDateInRange(date, start, end) {
    if (!start || !end || !date) return false;
    const d = new Date(date).setHours(0, 0, 0, 0);
    const s = new Date(start).setHours(0, 0, 0, 0);
    const e = new Date(end).setHours(0, 0, 0, 0);
    return d >= s && d <= e;
  }

  function toggleOutboundDateRangePicker(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const picker = document.getElementById("analyticsPicker");
    if (picker) {
      picker.classList.toggle("active");
      if (picker.classList.contains("active")) {
        renderCalendars();
        initPickerDropdowns();
      }
    }
  }

  function initPickerDropdowns() {
    // Month Dropdowns
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    ["left", "right"].forEach((side) => {
      const current = side === "left" ? currentLeftDate : currentRightDate;
      const monthList = document.getElementById(`${side}MonthList`);
      const yearList = document.getElementById(`${side}YearList`);

      if (monthList) {
        monthList.innerHTML = "";
        months.forEach((m, idx) => {
          const item = document.createElement("div");
          item.className = `dropdown-item ${idx === current.getMonth() ? "selected" : ""}`;
          item.textContent = m;
          item.onclick = (e) => {
            e.stopPropagation();
            current.setMonth(idx);
            document.getElementById(`${side}MonthSelected`).textContent = m;
            // Close dropdown
            const dd = document.getElementById(`${side}MonthDropdown`);
            if (dd) dd.classList.remove("active");
            renderCalendars();
          };
          monthList.appendChild(item);
        });
        document.getElementById(`${side}MonthSelected`).textContent =
          months[current.getMonth()];
      }

      if (yearList) {
        yearList.innerHTML = "";
        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 5; y <= currentYear + 5; y++) {
          const item = document.createElement("div");
          item.className = `dropdown-item ${y === current.getFullYear() ? "selected" : ""}`;
          item.textContent = y;
          item.onclick = (e) => {
            e.stopPropagation();
            current.setFullYear(y);
            document.getElementById(`${side}YearSelected`).textContent = y;
            // Close dropdown
            const dd = document.getElementById(`${side}YearDropdown`);
            if (dd) dd.classList.remove("active");
            renderCalendars();
          };
          yearList.appendChild(item);
        }
        document.getElementById(`${side}YearSelected`).textContent =
          current.getFullYear();
      }
    });
  }

  function renderCalendars() {
    renderCalendar("left", currentLeftDate);
    renderCalendar("right", currentRightDate);
    updateRangeDisplay();
  }

  function renderCalendar(side, date) {
    const grid = document.getElementById(`${side}Calendar`);
    if (!grid) return;

    const container = grid.querySelector(".days-container");
    if (!container) return;
    container.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInMonth = getDaysInMonth(month, year);

    // Adjust for Monday start (0=Sun -> 6, 1=Mon -> 0)
    let startOffset = firstDay === 0 ? 6 : firstDay - 1;

    // Empty slots
    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement("div");
      empty.className = "day empty";
      container.appendChild(empty);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dayDate = new Date(year, month, d);
      const el = document.createElement("div");
      el.className = "day";
      el.textContent = d;

      // Check selection
      if (tempRange.start && isSameDay(dayDate, tempRange.start)) {
        el.classList.add("selected", "range-start");
      }
      if (tempRange.end && isSameDay(dayDate, tempRange.end)) {
        el.classList.add("selected", "range-end");
      }
      if (
        tempRange.start &&
        tempRange.end &&
        isDateInRange(dayDate, tempRange.start, tempRange.end)
      ) {
        el.classList.add("in-range");
      }

      const today = new Date();
      const isToday = dayDate.getDate() === today.getDate() && 
                      dayDate.getMonth() === today.getMonth() && 
                      dayDate.getFullYear() === today.getFullYear();
      if (isToday) el.classList.add("today");

      el.onclick = () => handleDayClick(dayDate);
      container.appendChild(el);
    }
  }

  function handleDayClick(date) {
    if (!tempRange.start || (tempRange.start && tempRange.end)) {
      // Start new range
      tempRange.start = date;
      tempRange.end = null;
    } else {
      // End range
      if (date < tempRange.start) {
        tempRange.end = tempRange.start;
        tempRange.start = date;
      } else {
        tempRange.end = date;
      }
    }
    renderCalendars();
  }

  function updateRangeDisplay() {
    const display = document.getElementById("tempRangeDisplay");
    if (!display) return;

    if (tempRange.start && tempRange.end) {
      display.textContent = `${formatDate(tempRange.start)} — ${formatDate(tempRange.end)}`;
    } else if (tempRange.start) {
      display.textContent = `${formatDate(tempRange.start)} — ...`;
    } else {
      display.textContent = "Chọn khoảng thời gian"; // Or keep default
    }
  }

  function setupExtraListeners() {
    // Toggle dropdowns
    document.querySelectorAll(".custom-dropdown").forEach((dd) => {
      const sel = dd.querySelector(".dropdown-selected");
      if (sel) {
        sel.onclick = (e) => {
          e.stopPropagation();
          // Close others
          document.querySelectorAll(".custom-dropdown").forEach((d) => {
            if (d !== dd) d.classList.remove("active");
          });
          dd.classList.toggle("active");
        };
      }
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
      document
        .querySelectorAll(".custom-dropdown")
        .forEach((d) => d.classList.remove("active"));
    });

    // Sidebar Presets
    document.querySelectorAll(".sidebar-item").forEach((item) => {
      item.onclick = (e) => {
        e.preventDefault(); // Prevent default

        // Active state
        document
          .querySelectorAll(".sidebar-item")
          .forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        const range = item.getAttribute("data-range");
        const today = new Date();

        if (range === "today") {
          tempRange.start = today;
          tempRange.end = today;
        } else if (range === "last3") {
          const start = new Date();
          start.setDate(today.getDate() - 3);
          tempRange.start = start;
          tempRange.end = today;
        } else if (range === "thisweek") {
          const currentDayOfWeek = today.getDay();
          const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
          const start = new Date(today);
          start.setDate(today.getDate() - daysSinceMonday);
          tempRange.start = start;
          tempRange.end = today;
        } else if (range === "last7") {
          const start = new Date();
          start.setDate(today.getDate() - 7);
          tempRange.start = start;
          tempRange.end = today;
        } else if (range === "last30") {
          const start = new Date();
          start.setDate(today.getDate() - 30);
          tempRange.start = start;
          tempRange.end = today;
        } else if (range === "last3mo") {
          const start = new Date();
          start.setMonth(today.getMonth() - 3);
          tempRange.start = start;
          tempRange.end = today;
        } else if (range === "last6mo") {
          const start = new Date();
          start.setMonth(today.getMonth() - 6);
          tempRange.start = start;
          tempRange.end = today;
        } else if (range === "last1yr") {
          const start = new Date();
          start.setFullYear(today.getFullYear() - 1);
          tempRange.start = start;
          tempRange.end = today;
        }

        // Update views
        currentLeftDate = new Date(tempRange.start);
        currentRightDate = new Date(tempRange.end);
        // Ensure they are different months if possible or logic handles it
        if (isSameDay(currentLeftDate, currentRightDate)) {
          currentRightDate.setMonth(currentRightDate.getMonth() + 1);
        }

        renderCalendars();
      };
    });

    // Buttons
    const applyBtn = document.getElementById("applyPicker");
    if (applyBtn) {
      applyBtn.onclick = () => {
        selectedRange = { ...tempRange };

        // Update Trigger Display
        const triggerDisplay = document.getElementById("dateRangeDisplay");
        if (triggerDisplay && selectedRange.start && selectedRange.end) {
          const s = selectedRange.start;
          const e = selectedRange.end;
          triggerDisplay.textContent = `${s.getDate()}/${s.getMonth() + 1}/${s.getFullYear()} - ${e.getDate()}/${e.getMonth() + 1}/${e.getFullYear()}`;
        }

        // Close Picker
        const picker = document.getElementById("analyticsPicker");
        if (picker) picker.classList.remove("active");

        // Filter Data
        renderOutboundTable();
      };
    }

    const cancelBtn = document.getElementById("cancelPicker");
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        const picker = document.getElementById("analyticsPicker");
        if (picker) picker.classList.remove("active");
      };
    }

    const clearBtn = document.getElementById("clearPicker");
    if (clearBtn) {
      clearBtn.onclick = () => {
        tempRange = { start: null, end: null };
        selectedRange = { start: null, end: null };
        document
          .querySelectorAll(".sidebar-item")
          .forEach((i) => i.classList.remove("active"));
        renderCalendars();

        // Update Trigger
        const triggerDisplay = document.getElementById("dateRangeDisplay");
        if (triggerDisplay)
          triggerDisplay.textContent = "dd/mm/yyyy - dd/mm/yyyy";

        // Close and Render
        const picker = document.getElementById("analyticsPicker");
        if (picker) picker.classList.remove("active");

        renderOutboundTable();
      };
    }
  }

  function selectOutboundStatus(value, label) {
    document.getElementById("filter-status").value = value;
    document.getElementById("status-selected-label").textContent = label;

    // Update active class
    const options = document.querySelectorAll(".dropdown-option");
    options.forEach((opt) => {
      if (opt.getAttribute("data-value") === value) {
        opt.classList.add("active");
      } else {
        opt.classList.remove("active");
      }
    });

    // Close Dropdown
    const dropdown = document.getElementById("status-dropdown");
    if (dropdown) dropdown.classList.remove("open");

    currentPage = 1;
    renderOutboundTable();
  }

  // Modal Logic
  function openOutboundModal() {
    const modal = document.getElementById("add-modal");
    if (modal) {
      modal.classList.add("open");
      // Reset form
      const searchInput = document.getElementById("material-search-input");
      if (searchInput) searchInput.value = "";

      // Reset priority toggle
      const priorityToggle = document.getElementById("inputPriorityOutbound");
      if (priorityToggle) priorityToggle.checked = false;

      // Reset selection to MATERIAL (default)
      const materialRadio = document.querySelector(
        'input[name="outbound-type"][value="MATERIAL"]',
      );
      if (materialRadio) {
        materialRadio.checked = true;
        toggleOutboundForm("MATERIAL");
      }
    }
  }

  function toggleOutboundForm(type) {
    const materialForm = document.getElementById("outbound-material-form");
    const palletForm = document.getElementById("outbound-pallet-form");
    const requirement = document.getElementById("pallet-requirement");
    const saveBtn = document.getElementById("btn-save-outbound");

    // Reset visibility
    if (materialForm) materialForm.style.display = "none";
    if (palletForm) palletForm.style.display = "none";

    if (type === "MATERIAL") {
      if (materialForm) {
        materialForm.style.display = "flex";
        // Trigger render if table empty or just to refresh
        window.renderMaterialSelectionTable(
          document.getElementById("material-search-input")?.value || "",
        );
      }
      // Disable save button until selection
      if (saveBtn) saveBtn.disabled = true;
    } else if (type === "PALLET") {
      if (palletForm) {
        palletForm.style.display = "grid"; // Maintain grid layout
      }

      if (requirement) {
        requirement.innerText = "(Bắt buộc)";
        requirement.style.color = "#ef4444";
      }
      const palletInput = document.getElementById("add-pallet");
      if (palletInput) palletInput.focus();

      // Enable save button for Pallet (validation handles the rest)
      if (saveBtn) saveBtn.disabled = false;
    }
  }

  function closeOutboundModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("open");
  }

  // Add Outbound Order
  function addOutboundOrder() {
    const typeRadio = document.querySelector(
      'input[name="outbound-type"]:checked',
    );
    const outboundType = typeRadio ? typeRadio.value : "MATERIAL";

    let materialCode = "";
    let quantity = 0;
    let palletInput = "";
    let matName = "";

    if (outboundType === "PALLET") {
      materialCode = document.getElementById("add-material").value;
      quantity = parseInt(document.getElementById("add-quantity").value || 0);
      palletInput = document.getElementById("add-pallet").value;

      if (!palletInput) {
        if (window.showToast)
          window.showToast("Vui lòng nhập mã pallet!", "error");
        else alert("Vui lòng nhập mã pallet!");
        return;
      }
      if (!materialCode || quantity <= 0) {
        if (window.showToast)
          window.showToast("Vui lòng chọn sản phẩm và nhập số lượng!", "error");
        else alert("Vui lòng chọn sản phẩm và nhập số lượng!");
        return;
      }
      const m = MASTER_MATERIALS.find((x) => x.code === materialCode);
      matName = m ? m.name : "Vật tư";
    } else {
      // MATERIAL TYPE - Get from table
      const selectedRadio = document.querySelector(
        'input[name="selectedMaterial"]:checked',
      );
      if (!selectedRadio) {
        if (window.showToast)
          window.showToast("Vui lòng chọn một sản phẩm từ danh sách!", "error");
        else alert("Vui lòng chọn một sản phẩm từ danh sách!");
        return;
      }

      const selectedId = parseInt(selectedRadio.value);
      const selectedItem = MOCK_INVENTORY.find((i) => i.id === selectedId);

      if (!selectedItem) return;

      // Get quantity from input
      const qtyInput = document.getElementById(`qty-${selectedId}`);
      const inputQty = qtyInput ? parseInt(qtyInput.value) : 0;

      if (!inputQty || inputQty <= 0) {
        if (window.showToast)
          window.showToast(
            "Số lượng xuất phải lá một số nguyên dương!",
            "error",
          );
        else alert("Số lượng xuất phải là một số nguyên dương!");
        return;
      }

      if (inputQty > selectedItem.quantity) {
        if (window.showToast)
          window.showToast(
            `Số lượng xuất (${inputQty}) không được vượt quá số lượng hiện có (${selectedItem.quantity})!`,
            "error",
          );
        else
          alert(
            `Số lượng xuất (${inputQty}) không được vượt quá số lượng hiện có (${selectedItem.quantity})!`,
          );
        return;
      }

      materialCode = selectedItem.code;
      matName = selectedItem.name;
      quantity = inputQty;
      palletInput = ""; // No pallet
    }

    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const dateStr = `${hours}:${minutes} - ${day}/${month}/${year}`;
    const dateCode = `${day}${month}${year}`;

    // Format: pallet_material_quantity_date
    const newCode = `${palletInput}_${materialCode}_${quantity}_${dateCode}`;

    const newOrder = {
      id: Date.now(),
      code: newCode,
      materialCode: materialCode,
      materialName: mat.name,
      quantity: parseInt(quantity),
      date: dateStr,
      status: "PENDING",
      creator: "Đặng Quang Long (user001)",
      outboundType: outboundType,
      rawDate: date,
    };

    outboundData.unshift(newOrder);
    saveOutboundOrders();

    if (window.showToast)
      window.showToast("Thêm phiếu xuất thành công!", "success");

    renderOutboundTable();
    closeOutboundModal("add-modal");
  }

  // Delete Logic
  function deleteOutboundItem(id) {
    if (confirm("Bạn có chắc chắn muốn xóa phiếu xuất này?")) {
      outboundData = outboundData.filter((item) => item.id !== id);
      saveOutboundOrders();
      if (window.showToast)
        window.showToast("Xóa phiếu xuất thành công!", "success");
      renderOutboundTable();
    }
  }

    function showOutboundDetail(id) {
        // Reuse existing sub-table logic or show a specific toast/modal
        // For consistency with clicking the row, we toggle the sub-table if MATERIAL
        const item = outboundData.find(d => d.id == id);
        if (!item) return;

        if (item.outboundType === 'MATERIAL') {
            const trs = document.querySelectorAll('#table-body tr.clickable-row');
            for (let tr of trs) {
                // Approximate ID finding if not stored in dataset
                if (tr.innerText.includes(item.code)) {
                    window.toggleOutboundSubTable(item.id, tr);
                    break;
                }
            }
        } else {
             if (window.showToast) window.showToast(`Chi tiết lệnh ${item.code}`, "info");
             else alert(`Chi tiết lệnh ${item.code}`);
        }
    }
    window.showOutboundDetail = showOutboundDetail;

  function viewOutboundItem(id) {
    showOutboundDetail(id);
  }

  // Run init immediately if DOM is ready
  if (document.getElementById("table-body")) {
    initOutbound();
  } else {
    // Retry initialization if DOM not ready
    const checkInterval = setInterval(() => {
      if (document.getElementById("table-body")) {
        clearInterval(checkInterval);
        initOutbound();
      }
    }, 50);
    // Timeout to stop checking after 2 seconds
    setTimeout(() => clearInterval(checkInterval), 2000);
  }

  // Make functions global
  // Expose functions globally
  window.filterOutboundData = filterOutboundData;
  window.toggleOutboundStatusDropdown = toggleOutboundStatusDropdown;
  window.selectOutboundStatus = selectOutboundStatus;
  window.openOutboundModal = openOutboundModal;
  window.closeOutboundModal = closeOutboundModal;
  window.deleteOutboundItem = deleteOutboundItem;
  window.viewOutboundItem = viewOutboundItem;
  window.copyCode = copyCode;
  window.renderOutboundTable = renderOutboundTable;
  window.outboundPrevPage = outboundPrevPage;
  window.outboundNextPage = outboundNextPage;
  window.outboundGotoPage = outboundGotoPage;
  window.toggleDateRangePicker = toggleOutboundDateRangePicker;
  window.toggleOutboundCreatorCombobox = toggleOutboundCreatorCombobox;
  window.handleOutboundCreatorComboboxSearch =
    handleOutboundCreatorComboboxSearch;
  window.selectOutboundCreator = selectOutboundCreator;
  window.toggleOutboundTypeDropdown = toggleOutboundTypeDropdown;
  window.selectOutboundType = selectOutboundType;

  // Redefine toggleOutboundForm (alias) to handle form switching
  window.toggleOutboundForm = function (type) {
    const materialForm = document.getElementById("outbound-material-form");
    const palletForm = document.getElementById("outbound-pallet-form");

    if (type === "MATERIAL") {
      if (materialForm) materialForm.style.display = "flex";
      if (palletForm) palletForm.style.display = "none";

      // Select first Material radio
      const firstRadio = document.querySelector(
        'input[name="outboundType"][value="MATERIAL"]',
      );
      if (firstRadio) firstRadio.checked = true;

      // Reset save button state
      const saveBtn = document.getElementById("btn-save-outbound");
      if (saveBtn) saveBtn.disabled = true;
    } else if (type === "PALLET") {
      if (materialForm) materialForm.style.display = "none";
      if (palletForm) {
        palletForm.style.display = "flex";
        // Render pallet table if empty
        const tbody = document.getElementById("pallet-selection-body");
        if (tbody && tbody.children.length === 0) {
          renderPalletSelectionTable();
        }
      }

      // Select Pallet radio
      const palletRadio = document.querySelector(
        'input[name="outboundType"][value="PALLET"]',
      );
      if (palletRadio) palletRadio.checked = true;

      // Reset save button state
      const saveBtn = document.getElementById("btn-save-outbound");
      if (saveBtn) saveBtn.disabled = true;
    }
  };

  window.addOutboundOrder = function () {
    const selectedTypeInput = document.querySelector(
      'input[name="outboundType"]:checked',
    );
    const selectedType = selectedTypeInput
      ? selectedTypeInput.value
      : "MATERIAL";

    const isPriority = document.getElementById("inputPriorityOutbound")?.checked || false;

    if (selectedType === "MATERIAL") {
      // Find selected row
      const selectedRow = document.querySelector(
        "#material-selection-body tr.selected",
      );
      if (!selectedRow) {
        alert("Vui lòng chọn sản phẩm!");
        return;
      }

      const materialId = selectedRow.dataset.id;
      const selectedItem = MOCK_INVENTORY.find((item) => item.id == materialId);

      // Get quantity
      const quantityInput = selectedRow.querySelector(".quantity-input");
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

      if (!selectedItem) return;

      // Create Order
      const newId = outboundData.length + 1;
      const date = new Date();
      const dateVal = date.getTime();

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const dateStr = `${hours}:${minutes} - ${day}/${month}/${year}`;

      // Picking a batch
      const batch = selectedItem.batches[0];
      const code = batch ? batch.inputCode : `OUT-${newId}`;

      const newOrder = {
        id: newId,
        code: code,
        materialCode: selectedItem.code,
        materialName: selectedItem.name,
        quantity: quantity,
        date: dateStr,
        status: "PENDING",
        creator: "Bùi Thanh Sơn (user006)",
        outboundType: "MATERIAL",
        priority: isPriority,
        rawDate: dateVal,
      };

      outboundData.unshift(newOrder);
      saveOutboundOrders();
      renderOutboundTable();
      closeOutboundModal("add-modal");

      // Reset selection
      if (selectedRow) selectedRow.classList.remove("selected");
      const radio = selectedRow.querySelector('input[type="radio"]');
      if (radio) radio.checked = false;
      if (quantityInput) quantityInput.value = 1;
    } else if (selectedType === "PALLET") {
      const selectedRadio = document.querySelector(
        'input[name="selectedPallet"]:checked',
      );
      if (!selectedRadio) {
        alert("Vui lòng chọn Pallet để xuất!");
        return;
      }

      const palletId = selectedRadio.value;
      const selectedPallet = MOCK_PALLET_INVENTORY.find(
        (p) => p.id === palletId,
      );

      if (!selectedPallet) return;

      const newId = outboundData.length + 1;
      const date = new Date();
      const dateVal = date.getTime();

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const dateStr = `${hours}:${minutes} - ${day}/${month}/${year}`;

      const newOrder = {
        id: newId,
        code: selectedPallet.inputCode,
        materialCode: selectedPallet.materialCode,
        materialName: selectedPallet.materialName,
        quantity: selectedPallet.quantity,
        date: dateStr,
        status: "PENDING",
        creator: "Bùi Thanh Sơn (user006)",
        outboundType: "PALLET",
        priority: isPriority,
        rawDate: dateVal,
      };

      outboundData.unshift(newOrder);
      saveOutboundOrders();
      renderOutboundTable();
      closeOutboundModal("add-modal");

      // Reset selection
      selectedRadio.checked = false;
      const tr = selectedRadio.closest("tr");
      if (tr) tr.classList.remove("selected");
    }
  };

  const togglePriorityFilter = () => {
    filterPriorityOnly = !filterPriorityOnly;
    const btn = document.getElementById("btn-filter-priority");
    if (btn) {
      if (filterPriorityOnly) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
    currentPage = 1;
    renderOutboundTable();
  };

  window.togglePriorityFilter = togglePriorityFilter;

  // --- IMPORT EXCEL LOGIC ---
  function openOutboundImportModal() {
    const modal = document.getElementById("modal-import-outbound");
    if (modal) modal.classList.add("open");
  }

  function closeOutboundImportModal() {
    const modal = document.getElementById("modal-import-outbound");
    if (modal) modal.classList.remove("open");
  }

  function downloadSampleOutboundImport() {
    const link = document.createElement("a");
    link.href = "../../icons/files/sample_import_outboundOrder.xlsx";
    link.download = "sample_import_outboundOrder.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleOutboundImportFile(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        processOutboundImportData(jsonData); 
      } catch (err) {
        console.error("Error reading Excel:", err);
        if (window.showToast) window.showToast("Có lỗi khi đọc file Excel!", "error");
      }
    };
    reader.readAsArrayBuffer(file);
    input.value = ""; // Reset input
  }

  function processOutboundImportData(allRows) {
    if (!allRows || allRows.length < 4) {
      if (window.showToast) window.showToast("File không có dữ liệu từ dòng 4!", "error");
      return;
    }

    // Dynamic Column Detection (Scan rows 1-3 for keywords)
    let palletIdx = 1;
    let matIdx = 2;
    let qtyIdx = 3;
    let dateIdx = 5;
    let priorityIdx = 8; // Default to inbound pattern

    for (let i = 0; i < 3; i++) {
        const headerRow = allRows[i];
        if (!headerRow) continue;
        headerRow.forEach((cell, idx) => {
            if (!cell) return;
            const val = String(cell).toLowerCase().trim();
            if (val.includes("container") || val.includes("pallet")) palletIdx = idx;
            if (val.includes("sản phẩm") || val.includes("mã sản phẩm")) matIdx = idx;
            if (val.includes("số lượng") || val.includes("sl")) qtyIdx = idx;
            if (val.includes("ngày")) dateIdx = idx;
            if (val.includes("ưu tiên")) priorityIdx = idx;
        });
    }

    const rows = allRows.slice(3);
    const newOrders = [];
    const errors = [];
    const now = new Date();

    rows.forEach((row, index) => {
      // Small optimization: Skip empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || String(cell).trim() === "")) return;

      const palletCode = String(row[palletIdx] || "").trim();
      const matCode = String(row[matIdx] || "").trim();
      const qtyVal = row[qtyIdx];
      const outboundDateStr = String(row[dateIdx] || "").trim();
      const priorityVal = row[priorityIdx];

      const rowNum = index + 4;

      // Rule 1: Priority must exist (0 or 1)
      if (priorityVal === undefined || priorityVal === null || String(priorityVal).trim() === "") {
          errors.push(`Dòng ${rowNum}: Thiếu giá trị Ưu tiên (0 or 1)`);
          return;
      }

      const pVal = String(priorityVal).trim();
      const isPriority = (pVal === "1");
      if (pVal !== "0" && pVal !== "1") {
          errors.push(`Dòng ${rowNum}: Giá trị Ưu tiên không hợp lệ (phải là 0 hoặc 1)`);
          return;
      }

      // Rule: Date handling
      let finalDate = now;
      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      if (outboundDateStr && outboundDateStr !== "undefined") {
          const match = outboundDateStr.match(dateRegex);
          if (match) {
              finalDate = new Date(match[3], match[2] - 1, match[1]);
              // Merge current time into the imported date
              finalDate.setHours(now.getHours());
              finalDate.setMinutes(now.getMinutes());
              finalDate.setSeconds(now.getSeconds());
          }
      }

      const day = String(finalDate.getDate()).padStart(2, "0");
      const month = String(finalDate.getMonth() + 1).padStart(2, "0");
      const year = finalDate.getFullYear();
      const hours = String(finalDate.getHours()).padStart(2, "0");
      const minutes = String(finalDate.getMinutes()).padStart(2, "0");
      const dateStr = `${hours}:${minutes} - ${day}/${month}/${year}`;
      const dateCode = `${day}${month}${year}`;

      let materialCode = "";
      let materialName = "";
      let quantity = 0;
      let outboundType = "";
      let batches = [];

      if (palletCode) {
          // Rule: If Container, Material and Qty must be null/empty in Excel
          if (matCode || (qtyVal !== undefined && qtyVal !== null && qtyVal !== "")) {
              errors.push(`Dòng ${rowNum}: Nếu nhập Mã container thì Mã sản phẩm và Số lượng phải để trống`);
              return;
          }

          // Find pallet in MOCK_PALLET_INVENTORY
          const palletItem = MOCK_PALLET_INVENTORY.find(p => p.palletCode === palletCode);
          if (!palletItem) {
              errors.push(`Dòng ${rowNum}: Không tìm thấy container ${palletCode} trong tồn kho`);
              return;
          }

          materialCode = palletItem.materialCode;
          materialName = palletItem.materialName;
          quantity = palletItem.quantity;
          outboundType = "PALLET";
      } else if (matCode) {
          // Rule: If Product, Container must be null
          if (qtyVal === undefined || qtyVal === null || qtyVal === "") {
              errors.push(`Dòng ${rowNum}: Thiếu số lượng xuất cho sản phẩm ${matCode}`);
              return;
          }

          quantity = parseFloat(qtyVal);
          if (isNaN(quantity) || quantity <= 0) {
              errors.push(`Dòng ${rowNum}: Số lượng không hợp lệ`);
              return;
          }

          // Find material in MOCK_INVENTORY
          const inventoryItem = MOCK_INVENTORY.find(i => i.code === matCode);
          if (!inventoryItem) {
              errors.push(`Dòng ${rowNum}: Không tìm thấy sản phẩm ${matCode} trong danh mục`);
              return;
          }

          if (quantity > inventoryItem.quantity) {
              errors.push(`Dòng ${rowNum}: Số lượng xuất (${quantity}) vượt quá tồn kho hiện có (${inventoryItem.quantity})`);
              return;
          }

          materialCode = inventoryItem.code;
          materialName = inventoryItem.name;
          outboundType = "MATERIAL";

          // Simulate batching for MATERIAL type (like in mock generator)
          let rem = quantity;
          inventoryItem.batches.forEach(b => {
              if (rem <= 0) return;
              const take = Math.min(rem, b.quantity);
              batches.push({
                  inboundCode: b.inputCode,
                  exportedQty: take,
                  totalQty: b.quantity,
                  pallet: b.pallet,
                  location: b.location,
                  date: dateStr,
                  expiryDate: "-"
              });
              rem -= take;
          });
      } else {
          errors.push(`Dòng ${rowNum}: Phải nhập Mã container hoặc Mã sản phẩm`);
          return;
      }

      newOrders.push({
          id: Date.now() + index,
          code: palletCode ? `${palletCode}_${materialCode}_${quantity}_${dateCode}` : `OUT_${materialCode}_${quantity}_${dateCode}`,
          materialCode: materialCode,
          materialName: materialName,
          quantity: quantity,
          date: dateStr,
          status: "PENDING",
          creatorId: "user-import",
          creatorName: "Import System",
          outboundType: outboundType,
          rawDate: finalDate,
          priority: isPriority,
          batches: batches,
          workflow: MOCK_EXPORT_WORKFLOWS[0]
      });
    });

    if (errors.length > 0) {
      if (window.showToast) window.showToast(errors[0], "error");
      return;
    }

    if (newOrders.length > 0) {
      outboundData.unshift(...newOrders);
      saveOutboundOrders();
      renderOutboundTable();
      if (window.showToast) window.showToast(`Đã import thành công ${newOrders.length} lệnh xuất kho!`, "success");
      closeOutboundImportModal();
    }
  }

  // Exposure
  window.openOutboundImportModal = openOutboundImportModal;
  window.closeOutboundImportModal = closeOutboundImportModal;
  window.downloadSampleOutboundImport = downloadSampleOutboundImport;
  window.handleOutboundImportFile = handleOutboundImportFile;
})();
