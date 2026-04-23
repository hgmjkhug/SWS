// Workflow Builder Logic

// Dirty State Tracking & Global References
window.isWorkflowDirty = false;
let globalSaveStepsLocal = null;

// --- GLOBAL BACK/SAVE FUNCTIONS ---
// Defined globally so they exist immediately even if init is slow

window.saveWorkflowFinal = function() {
    if (!globalSaveStepsLocal) {
        console.error("Save function not initialized");
        return;
    }
    // 1. Force save current state to local storage
    globalSaveStepsLocal();
    
    // 2. Reset dirty flag
    window.isWorkflowDirty = false;
    
    // 3. Show Success Toast
    if (window.showToast) {
        window.showToast('Thiết lập quy trình thành công!', 'success');
    } else {
        alert('Thiết lập quy trình thành công!');
    }
}

window.tryCloseWorkflowConfig = function() {
    if (window.isWorkflowDirty) {
        // Show custom modal
        const modal = document.getElementById('confirmExitModal');
        if (modal) modal.style.display = 'block';
    } else {
        // Safe to exit
        window.forceExitWorkflowConfig();
    }
}

window.confirmExit = function() {
    window.closeExitConfirmModal();
    window.forceExitWorkflowConfig();
}

window.closeExitConfirmModal = function() {
    const modal = document.getElementById('confirmExitModal');
    if (modal) modal.style.display = 'none';
}

window.forceExitWorkflowConfig = function() {
    if (window.clearWorkflowConfigState && window.loadPage) {
        window.clearWorkflowConfigState(); 
        window.loadPage('Quản lý quy trình');
    } else {
        console.error("Navigation functions not found");
        // Fallback
        if(window.loadPage) window.loadPage('Quản lý quy trình');
    }
}

function initWorkflowConfig(workflowId, workflowName) {
    // Reset global ref
    globalSaveStepsLocal = null;

    const flowchartList = document.getElementById('flowchart-list');
    const svgCanvas = document.getElementById('svg-canvas');
    const canvasContainer = document.getElementById('canvasContainer');

    const configuredStepsSpan = document.getElementById('configuredSteps');
    const totalAvailableStepsSpan = document.getElementById('totalAvailableSteps');
    const nameDisplay = document.getElementById('workflowNameDisplay');
    const stepList = document.getElementById('stepList');

    if (nameDisplay && workflowName) {
        nameDisplay.querySelector('span').innerText = workflowName;
    }

    if (!flowchartList || !svgCanvas || !canvasContainer) {
        console.error("Workflow Builder elements not found!");
        return;
    }

    // --- HELPER FUNCTIONS (Define early to avoid ReferenceErrors) ---
    
    // Updated createNode with value support
    window.createNodeHTML = function (name, actionType = '', deviceId = '', params = [], properties = {}) {
        const div = document.createElement('div');
        div.className = 'node';
        div.dataset.name = name;
        // Store properties in dataset for persistence
        div.dataset.properties = JSON.stringify(properties || {});
        
        // Add click listener for selection
        div.onclick = function(e) {
            // Prevent triggering if clicking delete button or inputs directly
            if (e.target.closest('.del-node-btn') || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON') {
                return;
            }
            if (window.selectNode) window.selectNode(this);
            e.stopPropagation(); // Prevent bubbling to document
        };

        // Populate Device Options
        // Note: deviceTypes is defined below, but since this is assigned to window.createNodeHTML, 
        // it will be called AFTER deviceTypes is defined. However, for absolute safety, 
        // let's ensure deviceTypes is also available.
        const dtSource = [
            { id: 1, code: 'AGV-LOAD', name: 'AGV Vận chuyển hàng' },
            { id: 2, code: 'CRANE-STACK', name: 'Cần trục Stacker Crane' },
            { id: 3, code: 'CONVEYOR-BELT', name: 'Băng tải dây' },
            { id: 4, code: 'LIFTER-VERT', name: 'Thang máy nâng hàng' },
            { id: 5, code: 'SCANNER-GATE', name: 'Cổng Scan RFID' },
            { id: 6, code: 'SHUTTLE', name: 'Shuttle đi theo ray' }
        ];

        const deviceOptionsHtml = dtSource.map(dt => {
            return `<option value="${dt.id}">${dt.code} - ${dt.name}</option>`;
        }).join('');


        div.innerHTML = `
            <button class="del-node-btn" onclick="deleteNode(this)">×</button>
            <div class="node-header">
                <span class="stt-badge">Bước <span class="num">0</span></span>
                <strong style="color: #076EB8; font-size: 13px;">${name}</strong>
            </div>
            <div class="node-body">
                <label class="label">Nhóm thiết bị áp dụng</label>
                <select class="select-device" onchange="saveStepsTrigger()" disabled style="background-color: #f1f5f9; cursor: not-allowed;">
                    <option value="">Chọn nhóm thiết bị</option>
                    ${deviceOptionsHtml}
                </select>
            </div>
        `;

        // Explicitly set the value to handle type safety
        if (deviceId) {
            const select = div.querySelector('.select-device');
            if (select) select.value = deviceId;
        }

        return div;
    }

    // --- STEP DATA ---
    const deviceTypes = [
        { id: 1, code: 'AGV-LOAD', name: 'AGV Vận chuyển hàng' },
        { id: 2, code: 'CRANE-STACK', name: 'Cần trục Stacker Crane' },
        { id: 3, code: 'CONVEYOR-BELT', name: 'Băng tải dây' },
        { id: 4, code: 'LIFTER-VERT', name: 'Thang máy nâng hàng' },
        { id: 5, code: 'SCANNER-GATE', name: 'Cổng Scan RFID' },
        { id: 6, code: 'SHUTTLE', name: 'Shuttle đi theo ray' }
    ];

    const stepTemplates = [];
    const STORAGE_KEY_AVAILABLE = `workflow_available_steps_${workflowId}`;
    let availableSteps = [];

    function saveAvailableSteps() {
        localStorage.setItem(STORAGE_KEY_AVAILABLE, JSON.stringify(availableSteps));
    }

    function loadAvailableSteps() {
        const data = localStorage.getItem(STORAGE_KEY_AVAILABLE);
        if (data) {
            try {
                availableSteps = JSON.parse(data);
            } catch (e) {
                console.error("Error loading available steps", e);
                availableSteps = [];
            }
        } else {
            // Default steps if none exist for this workflow? 
            // Better to start empty as requested.
            availableSteps = [];
        }
    }
    loadAvailableSteps(); // Initial load

    // --- Sidebar Step Creation Combobox ---
    function initSidebarDeviceCombobox() {
        const dropdown = document.getElementById('sidebar-device-dropdown');
        if (!dropdown) return;

        const input = document.getElementById('sidebar-device-input');
        const optionsContainer = document.getElementById('sidebar-device-options');
        const icon = dropdown.querySelector('.combo-icon');
        const hiddenValue = document.getElementById('sidebar-device-value');

        // Populate Options
        let html = '';
        deviceTypes.forEach(dt => {
            html += `<div class="dropdown-option" data-value="${dt.id}">${dt.code} - ${dt.name}</div>`;
        });
        optionsContainer.innerHTML = html;

        function openDropdown() {
            dropdown.classList.add('active');
            optionsContainer.classList.add('show');
        }

        function closeDropdown() {
            dropdown.classList.remove('active');
            optionsContainer.classList.remove('show');
        }

        input.addEventListener('focus', openDropdown);
        input.addEventListener('click', (e) => {
            e.stopPropagation();
            openDropdown();
        });

        if(icon) icon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (optionsContainer.classList.contains('show')) closeDropdown();
            else openDropdown();
        });

        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const items = optionsContainer.querySelectorAll('.dropdown-option');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(term) ? 'block' : 'none';
            });
            if (!optionsContainer.classList.contains('show')) openDropdown();
        });

        optionsContainer.addEventListener('click', (e) => {
            const item = e.target.closest('.dropdown-option');
            if (!item) return;
            e.stopPropagation();
            const value = item.dataset.value;
            const text = item.textContent;
            input.value = text;
            if (hiddenValue) hiddenValue.value = value;
            closeDropdown();
        });

        document.addEventListener('click', (e) => {
            if (dropdown && !dropdown.contains(e.target)) closeDropdown();
        });
    }
    initSidebarDeviceCombobox();

    window.addNewAvailableStep = function() {
        const inputName = document.getElementById('sidebar-new-step-name');
        const inputDevice = document.getElementById('sidebar-device-input');
        const hiddenDevice = document.getElementById('sidebar-device-value');

        const name = inputName.value.trim();
        const deviceId = hiddenDevice.value;

        if (!name) {
            if (window.showToast) window.showToast('Vui lòng nhập tên bước', 'error');
            else alert('Vui lòng nhập tên bước');
            return;
        }

        if (!deviceId) {
            if (window.showToast) window.showToast('Vui lòng chọn nhóm thiết bị', 'error');
            else alert('Vui lòng chọn nhóm thiết bị');
            return;
        }

        const device = deviceTypes.find(dt => dt.id.toString() === deviceId);
        const newId = availableSteps.length > 0 ? Math.max(...availableSteps.map(s => s.id)) + 1 : 1;
        const code = `STEP-${100 + newId}`;

        availableSteps.push({
            id: newId,
            code: code,
            name: name,
            deviceTypes: [device]
        });

        // Reset inputs
        inputName.value = '';
        inputDevice.value = '';
        hiddenDevice.value = '';

        saveAvailableSteps();
        renderStepList();
        if (window.showToast) window.showToast('Đã thêm bước vào danh sách chọn', 'success');
    };

    window.removeAvailableStep = function(id) {
        availableSteps = availableSteps.filter(s => s.id !== id);
        saveAvailableSteps();
        renderStepList();
    };

    // --- Editable Device Combobox Logic ---
    function initDeviceCombobox() {
        const dropdown = document.getElementById('device-type-dropdown');
        if (!dropdown) return;

        const input = document.getElementById('device-input');
        const optionsContainer = document.getElementById('device-options-list');
        const icon = dropdown.querySelector('.combo-icon');
        const hiddenFilter = document.getElementById('deviceTypeFilter');

        // Populate Options
        let html = '';
        // "All" Option
        html += `<div class="dropdown-option selected" data-value="all">Tất cả nhóm thiết bị</div>`;
        
        deviceTypes.forEach(dt => {
            html += `<div class="dropdown-option" data-value="${dt.id}">${dt.code} - ${dt.name}</div>`;
        });
        optionsContainer.innerHTML = html;

        // Functions
        function openDropdown() {
            dropdown.classList.add('active');
            optionsContainer.classList.add('show');
        }

        function closeDropdown() {
            dropdown.classList.remove('active');
            optionsContainer.classList.remove('show');
        }

        function toggleDropdown(e) {
            e.stopPropagation();
            if (optionsContainer.classList.contains('show')) {
                closeDropdown();
            } else {
                openDropdown();
                input.focus();
            }
        }

        // Event Listeners
        input.addEventListener('focus', openDropdown);
        input.addEventListener('click', (e) => {
            e.stopPropagation();
            openDropdown();
        });

        if(icon) icon.addEventListener('click', toggleDropdown);

        // Filter Options on Input
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const items = optionsContainer.querySelectorAll('.dropdown-option');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(term)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            if (!optionsContainer.classList.contains('show')) {
                openDropdown();
            }
            
            // If empty, maybe reset filter to 'all'? 
            // Better to let user clear it and select 'all' explicitly or handle separately.
            // For now, only explicit selection triggers filter update.
        });

        // Handle Selection
        optionsContainer.addEventListener('click', (e) => {
            const item = e.target.closest('.dropdown-option');
            if (!item) return;

            e.stopPropagation();
            const value = item.dataset.value;
            const text = item.textContent;

            // Update UI
            input.value = text;
            const allOpts = optionsContainer.querySelectorAll('.dropdown-option');
            allOpts.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');

            // Update State
            if (hiddenFilter) hiddenFilter.value = value;
            
            closeDropdown();

            // Reset Filter Visibility
            setTimeout(() => {
                allOpts.forEach(i => i.style.display = 'block');
            }, 200);

            // Trigger Main Filter
            renderStepList();
        });

        // Close on Outside Click
        document.addEventListener('click', (e) => {
            if (dropdown && !dropdown.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    // Initialize Combobox
    initDeviceCombobox();

    // --- Render Step List ---
    let stepListSortable = null;

    function initStepListSortable() {
        // Destroy old instance if exists
        if (stepListSortable) {
            stepListSortable.destroy();
            stepListSortable = null;
        }

        // Create new Sortable instance for stepList
        if (stepList && stepList.querySelectorAll('.step-item').length > 0) {
            stepListSortable = new Sortable(stepList, {
                group: {
                    name: 'workflow-group',
                    pull: 'clone',
                    put: false
                },
                animation: 150,
                sort: false,
                draggable: '.step-item',
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                onStart: function () {
                    if (flowchartList) flowchartList.classList.add('drop-active');
                },
                onEnd: function () {
                    if (flowchartList) flowchartList.classList.remove('drop-active');
                }
            });
        }
    }

    // Init End Step Sortable ONCE (separate from step list)
    function initEndStepSortable() {
        const sidebarFooter = document.querySelector('.sidebar-footer-step');
        if (sidebarFooter && sidebarFooter.querySelector('.step-item')) {
            new Sortable(sidebarFooter, {
                group: {
                    name: 'workflow-group',
                    pull: 'clone',
                    put: false
                },
                sort: false,
                draggable: '.step-item',
                onStart: function () {
                    if (flowchartList) flowchartList.classList.add('drop-active');
                },
                onEnd: function () {
                    if (flowchartList) flowchartList.classList.remove('drop-active');
                }
            });
        }
    }
    initEndStepSortable(); // Run once on init

    // Function to add step to canvas via click
    function addStepToCanvas(stepCode, stepName) {
        // Find the full step object to get default devices
        const stepObj = availableSteps.find(s => s.code === stepCode);
        const defaultDevice = (stepObj && stepObj.deviceTypes && stepObj.deviceTypes.length > 0)
            ? stepObj.deviceTypes[0].id
            : '';

        const newNode = createNodeHTML(stepName, '', defaultDevice);
        newNode.dataset.stepCode = stepCode;
        flowchartList.appendChild(newNode);

        updateLogic();
        saveStepsLocal();
        drawLines();

        // Scroll to new node
        requestAnimationFrame(() => {
             const canvasCont = document.getElementById('canvasContainer');
             if (canvasCont) {
                 canvasCont.scrollTo({
                     top: canvasCont.scrollHeight,
                     behavior: 'smooth'
                 });
             }
             newNode.style.animation = 'highlight 1s';
        });
    }

    function renderStepList() {
        if (!stepList) return;

        // Update total available steps count
        if (totalAvailableStepsSpan) totalAvailableStepsSpan.textContent = availableSteps.length;

        if (availableSteps.length === 0) {
            stepList.innerHTML = '<div class="step-list-empty"><i class="fas fa-inbox"></i><br>Chưa có bước nào. Hãy tạo bước mới để thiết lập quy trình.</div>';
            return;
        }

        stepList.innerHTML = availableSteps.map(step => `
            <div class="step-item" data-step-id="${step.id}" data-step-code="${step.code}" data-step-name="${step.name}">
                <button class="delete-step-btn" onclick="event.stopPropagation(); removeAvailableStep(${step.id})" title="Xóa bước này">
                    <i class="fas fa-times"></i>
                </button>
                <div class="step-item-code">${step.code}</div>
                <div class="step-item-name">${step.name}</div>
                <div class="step-item-devices">
                    ${step.deviceTypes.map(d => `<span class="step-device-badge">${d.code}</span>`).join('')}
                </div>
            </div>
        `).join('');

        // Add click handlers to each step-item
        stepList.querySelectorAll('.step-item').forEach(item => {
            item.addEventListener('click', function () {
                const code = this.dataset.stepCode;
                const name = this.dataset.stepName;
                addStepToCanvas(code, name);
            });
        });

        // Re-init Sortable after rendering new elements
        initStepListSortable();
    }

    // Initial render
    renderStepList();

    // --- 1. LOCAL STORAGE & DATA MANAGEMENT ---
    const STORAGE_KEY = `workflow_steps_${workflowId}`;
    let currentZoom = 1;

    function loadSteps() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            let steps = [];
            let hasEndNode = false;

            // Handle both legacy array format and new object format
            if (Array.isArray(parsed)) {
                steps = parsed;
            } else {
                steps = parsed.steps || [];
                hasEndNode = !!parsed.hasEndNode;
            }

            flowchartList.innerHTML = ''; // Clear current
            
            // Re-append static nodes and SVG
            const startNode = document.createElement('div');
            startNode.id = 'node-start';
            startNode.className = 'node-special node-start';
            startNode.innerHTML = '<i class="fa-solid fa-play"></i> Bắt đầu';
            flowchartList.appendChild(startNode);
            flowchartList.appendChild(svgCanvas);

            // Restore regular steps
            steps.forEach(step => {
                const node = createNodeHTML(step.name, step.actionType, step.device, step.params, step.properties);
                flowchartList.appendChild(node);
            });

            // Restore End node if it were saved
            if (hasEndNode) {
                const endNode = document.createElement('div');
                endNode.id = 'node-end';
                endNode.className = 'node-special node-end';
                endNode.innerHTML = `
                    <button class="del-node-btn" onclick="removeEndNode()" title="Xóa kết thúc"><i class="fas fa-times"></i></button>
                    <i class="fa-solid fa-stop"></i> Kết thúc
                `;
                flowchartList.appendChild(endNode);
            }

            updateLogic();
        } else {
            // New workflow, ensure empty but keep SVG
            updateLogic();
        }
        window.isWorkflowDirty = false;
    }


    function saveStepsLocal() {
        const nodes = flowchartList.querySelectorAll('.node'); // Only select .node classes, ignore .node-special
        const steps = [];
        nodes.forEach(node => {
            const name = node.dataset.name || '';
            const actionTypeEl = node.querySelector('.input-action-type');
            const actionType = actionTypeEl ? actionTypeEl.value : '';
            const deviceEl = node.querySelector('.select-device');
            const device = deviceEl ? deviceEl.value : '';

            // Collect Properties (Hidden Dataset)
            let properties = {};
            try {
                properties = JSON.parse(node.dataset.properties || '{}');
            } catch (e) {
                console.error("Error parsing node properties", e);
            }

            steps.push({ name, actionType, device, properties });
        });

        // Check for End Node presence
        const hasEndNode = !!document.getElementById('node-end');

        const storageData = {
            steps: steps,
            hasEndNode: hasEndNode
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
        updateTotalCountCanvas();
        window.isWorkflowDirty = true; // Mark as dirty on change
    }

    // Link global reference (CRITICAL)
    globalSaveStepsLocal = saveStepsLocal;

    function updateTotalCountCanvas() {
        // Update the count in sidebar (workflow steps configured)
        const count = flowchartList.querySelectorAll('.node').length;
        if (configuredStepsSpan) configuredStepsSpan.textContent = count;
    }


    // --- 2. INIT SORTABLE ---

    // Init Main Flowchart Sortable (accepts from sidebar)
    new Sortable(flowchartList, {
        group: {
            name: 'workflow-group',
            pull: false,
            put: true
        },
        animation: 150,
        ghostClass: 'sortable-ghost',
        filter: 'svg, .node-special', // Ignore SVG and static nodes
        draggable: '.node, .step-item', // Accept both nodes and sidebar step-items
        onAdd: function (evt) {
            console.log("Item added to flowchart canvas", evt.item);
            // Convert step-item to node
            const itemEl = evt.item;

            // Handle "End" node drop
            if (itemEl.dataset.isEndNode === "true") {
                // If end node already exists on canvas, just remove the dropped clone
                const existingEnd = document.getElementById('node-end');
                if (existingEnd) {
                    itemEl.remove();
                } else {
                    // Create the actual sticky end node
                    const endNode = document.createElement('div');
                    endNode.id = 'node-end';
                    endNode.className = 'node-special node-end';
                    endNode.innerHTML = `
                        <button class="del-node-btn" onclick="removeEndNode()" title="Xóa kết thúc"><i class="fas fa-times"></i></button>
                        <i class="fa-solid fa-stop"></i> Kết thúc
                    `;
                    itemEl.parentNode.replaceChild(endNode, itemEl);
                }
                updateLogic();
                saveStepsLocal();
                drawLines();
                return;
            }

            // Check if it's a step-item from sidebar
            if (itemEl.classList.contains('step-item')) {
                const stepName = itemEl.dataset.stepName || 'Bước mới';
                const stepCode = itemEl.dataset.stepCode || '';
                const stepIdStr = itemEl.dataset.stepId;
                const stepId = parseInt(stepIdStr);

                console.log("Dropped step-item:", { stepName, stepCode, stepIdStr, stepId });

                // Find step data for defaults
                const stepObj = availableSteps.find(s => s.id === stepId || s.id.toString() === stepIdStr);
                if (stepObj) {
                    console.log("Found step data:", stepObj);
                } else {
                    console.warn("Could not find step data for ID:", stepId);
                }

                const defaultDevice = (stepObj && stepObj.deviceTypes && stepObj.deviceTypes.length > 0)
                    ? stepObj.deviceTypes[0].id
                    : '';

                // Create proper node
                const newNode = createNodeHTML(stepName, '', defaultDevice);
                newNode.dataset.stepCode = stepCode;

                // Insert node before itemEl, then remove itemEl
                itemEl.parentNode.insertBefore(newNode, itemEl);
                itemEl.remove();

                // Auto Scroll & Highlight (Same as addStepToCanvas)
                requestAnimationFrame(() => {
                    const canvasCont = document.getElementById('canvasContainer');
                    if (canvasCont) {
                        canvasCont.scrollTo({
                            top: canvasCont.scrollHeight,
                            behavior: 'smooth'
                        });
                    }
                    newNode.style.animation = "highlight 1s";
                });
            }

            flowchartList.classList.remove('drop-active');

            // Immediately update logic and draw connecting arrows
            updateLogic();
            saveStepsLocal();
            drawLines();
        },
        onEnd: function () {
            flowchartList.classList.remove('drop-active');
            updateLogic();
            saveStepsLocal();
            drawLines();
        },
        onChange: function () {
            requestAnimationFrame(drawLines);
        }
    });

    // --- 3. HELPER FUNCTIONS ---

    // (createNodeHTML moved to top)

    // Global wrappers for internal storage access
    window.saveStepsTrigger = function () {
        saveStepsLocal();
    }

    window.saveStepDirectly = function () {
        // console.log("DEBUG: saveStepDirectly called");
        const flowchartList = document.getElementById('flowchart-list');
        if (!flowchartList) {
            // console.error("DEBUG: flowchart-list not found!");
            return;
        }

        const count = flowchartList.querySelectorAll('.node').length + 1;
        const name = `Bước ${count}`;

        const newNode = createNodeHTML(name);
        flowchartList.appendChild(newNode);

        // Immediate Logic Update & Save
        if (window.updateLogic) window.updateLogic();
        if (window.saveStepsTrigger) window.saveStepsTrigger();

        // Auto Scroll & Highlight
        requestAnimationFrame(() => {
            // Scroll CANVAS CONTAINER instead of main-view
            const canvasCont = document.getElementById('canvasContainer');
            if (canvasCont) {
                canvasCont.scrollTo({
                    top: canvasCont.scrollHeight,
                    behavior: 'smooth'
                });
            }

            // Re-draw after scroll starts, and a bit later
            if (window.drawLines) {
                drawLines();
                setTimeout(drawLines, 50);
                setTimeout(drawLines, 150);
            }

            // Highlight
            newNode.style.animation = "highlight 1s";
        });
    }
    let nodeToDelete = null;
    window.deleteNode = function (btn) {
        nodeToDelete = btn.parentElement;
        const modal = document.getElementById('deleteStepModal');
        const content = modal ? modal.querySelector('.confirm-content') : null;

        if (modal && content) {
            modal.style.display = 'block';

            // Re-bind confirm button
            const confirmBtn = document.getElementById('confirmDeleteBtn');
            if (confirmBtn) {
                confirmBtn.onclick = function () {
                    if (nodeToDelete) {
                        nodeToDelete.remove();
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                updateLogic();
                                saveStepsLocal();
                            }, 50);
                        });
                        nodeToDelete = null;
                        closeDeleteModal();
                    }
                };
            }

            // Position next to the 'x' button
            const rect = btn.getBoundingClientRect();
            // Offset to the left of the button
            content.style.left = (rect.left - 315) + 'px'; // content width (300) + gap (15)
            // Center arrow vertically with button
            content.style.top = (rect.top - 15) + 'px';
        }
    }

    window.closeDeleteModal = function () {
        const modal = document.getElementById('deleteStepModal');
        if (modal) modal.style.display = 'none';
        nodeToDelete = null;
    }

    window.removeEndNode = function () {
        const endNode = document.getElementById('node-end');
        if (endNode) {
            endNode.remove();
            saveStepsLocal();
            updateLogic();
        }
    }


    // Logic Updates
    window.updateLogic = function () {
        // Ensure Start node and SVG are persistent and at the top
        const startNode = document.getElementById('node-start');
        if (startNode && flowchartList.firstChild !== startNode) {
            flowchartList.prepend(startNode);
        }
        if (!flowchartList.contains(svgCanvas)) {
            // After startNode if it exists
            if (startNode) startNode.after(svgCanvas);
            else flowchartList.prepend(svgCanvas);
        }

        const nodes = flowchartList.querySelectorAll('.node');
        nodes.forEach((node, idx) => {
            const numSpan = node.querySelector('.num');
            if (numSpan) numSpan.innerText = idx + 1;

            // Re-attach change listeners if needed (simplification)
            node.querySelectorAll('input, select').forEach(i => {
                if (!i.onchange) i.onchange = saveStepsLocal;
            });
        });
        updateTotalCountCanvas();
        drawLines();
    }

    // --- 6. ADVANCED UI ACTIONS ---
    let isHorizontal = false;

    window.toggleFlowDirection = function () {
        isHorizontal = !isHorizontal;
        if (flowchartList) {
            if (isHorizontal) {
                flowchartList.classList.add('flow-horizontal');
                if (window.showToast) window.showToast('Đã chuyển sang chế độ xem NGANG');
            } else {
                flowchartList.classList.remove('flow-horizontal');
                if (window.showToast) window.showToast('Đã chuyển sang chế độ xem DỌC');
            }
            // Reset Zoom to avoid confusion when switching
            currentZoom = 1;
            applyZoom();

            // Wait for transition to finish/start before drawing
            setTimeout(drawLines, 300);
        }
    }

    window.zoomWorkflow = function (delta) {
        currentZoom = Math.min(Math.max(currentZoom + delta, 0.3), 2); // Limit 30% to 200%
        applyZoom();
    }

    window.resetZoom = function () {
        currentZoom = 1;
        applyZoom();
    }

    function applyZoom() {
        if (flowchartList) {
            // Update origin based on mode
            flowchartList.style.transformOrigin = isHorizontal ? 'center center' : 'top center';
            flowchartList.style.transform = `scale(${currentZoom})`;
            // Lines are redrawn on next scroll or manually
            drawLines();
        }
    }

    // Drawing Lines (SVG) - Optimized using internal coordinates
    window.drawLines = function () {
        if (!svgCanvas || !flowchartList) return;

        const defs = svgCanvas.querySelector('defs');
        svgCanvas.innerHTML = '';
        if (defs) svgCanvas.appendChild(defs);

        const nodes = Array.from(flowchartList.querySelectorAll('.node-special, .node'));

        if (nodes.length < 2) return;

        // Determine mode dynamically from class or state
        const isHoriz = flowchartList.classList.contains('flow-horizontal');

        for (let i = 0; i < nodes.length - 1; i++) {
            const startNode = nodes[i];
            const endNode = nodes[i + 1];

            // Use offset properties relative to the container (flowchartList)
            // Note: offsetLeft/Top are relative to offsetParent. 
            // If flowchartList is position:relative, this works perfectly.

            let x1, y1, x2, y2;

            if (isHoriz) {
                // Horizontal: Right Middle -> Left Middle
                x1 = startNode.offsetLeft + startNode.offsetWidth;
                y1 = startNode.offsetTop + (startNode.offsetHeight / 2);
                x2 = endNode.offsetLeft;
                y2 = endNode.offsetTop + (endNode.offsetHeight / 2);
            } else {
                // Vertical: Bottom Center -> Top Center
                // Force X to be exactly center of container to prevent slight offsets/slants
                const centerX = flowchartList.clientWidth / 2;
                x1 = centerX;
                y1 = startNode.offsetTop + startNode.offsetHeight;
                x2 = centerX;
                y2 = endNode.offsetTop;
            }

            // Safety check for display:none
            if (startNode.offsetWidth === 0) continue;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

            // Create path d attribute
            let dString = `M ${x1} ${y1} `;

            // Optional: Curve logic could go here, but straight line is fine usually
            // For purely straight lines:
            dString += `L ${x2} ${y2}`;

            path.setAttribute("d", dString);
            path.setAttribute("stroke", "#3498db");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("fill", "none");
            path.setAttribute("marker-end", "url(#arrow)");
            svgCanvas.appendChild(path);
        }

        // Update SVG Size to cover scrollable area
        if (nodes.length > 0) {
            const lastNode = nodes[nodes.length - 1];
            if (isHoriz) {
                const totalWidth = lastNode.offsetLeft + lastNode.offsetWidth + 200;
                // Height needs to cover the tallest node or just container height
                const totalHeight = flowchartList.scrollHeight;
                svgCanvas.style.width = totalWidth + 'px';
                svgCanvas.style.height = totalHeight + 'px';
            } else {
                const totalHeight = lastNode.offsetTop + lastNode.offsetHeight + 100;
                svgCanvas.style.height = totalHeight + 'px';
                svgCanvas.style.width = '100%';
            }
        }
    }

    // START
    // START
    loadSteps();

    // --- PROPERTIES PANEL LOGIC ---
    let selectedNodeRef = null;

    // Operation Sequence Mock Data
    const locationNodes = [
        { id: 'N1', name: 'Khu vực nhập hàng', direction: 'Trên, Phải', floor: 1, aisle: 'A', row: 1 },
        { id: 'N2', name: 'Kệ A1', direction: 'Phải', floor: 1, aisle: 'A', row: 2 },
        { id: 'N3', name: 'Kệ A2', direction: 'Phải', floor: 1, aisle: 'A', row: 3 },
        { id: 'N4', name: 'Khu vực kiểm tra', direction: 'Dưới, Trái', floor: 1, aisle: 'B', row: 1 },
        { id: 'N5', name: 'Cửa thang máy 1', direction: 'Trái', floor: 1, aisle: 'C', row: 1 },
        { id: 'N6', name: 'Khu vực sạc', direction: 'Trên, Dưới', floor: 1, aisle: 'D', row: 1 },
        { id: 'N7', name: 'Kệ B1', direction: 'Phải', floor: 2, aisle: 'A', row: 1 },
        { id: 'N8', name: 'Kệ B2', direction: 'Dưới, Phải', floor: 2, aisle: 'A', row: 2 },
        { id: 'N9', name: 'Đóng gói', direction: 'Dưới, Trái', floor: 2, aisle: 'B', row: 1 },
        { id: 'N10', name: 'Xuất hàng', direction: 'Trái', floor: 2, aisle: 'C', row: 1 }
    ];

    const actionOptions = [
        { id: 'NONE', name: 'Không làm gì cả' },
        { id: 'PICK', name: 'Lấy hàng' },
        { id: 'DROP', name: 'Bỏ hàng' },
        { id: 'SLOW1', name: 'Giảm tốc cấp 1 (Chậm)' },
        { id: 'SLOW2', name: 'Giảm tốc cấp 2 (Siêu chậm)' },
        { id: 'STOP_END', name: 'Dừng khi di chuyển ở node cuối' },
        { id: 'FAST_HALF', name: 'Đi nhanh 1/2' },
        { id: 'CHARGE', name: 'Sạc pin' }
    ];

    window.selectNode = function(node) {
        // Deselect previous
        if (selectedNodeRef) {
            selectedNodeRef.classList.remove('selected');
        }

        selectedNodeRef = node;
        node.classList.add('selected');

        // Show Panel
        const panel = document.getElementById('propertiesPanel');
        if (panel) {
            panel.classList.add('open');
            
            // Update Header with Step Number and Name
            const nodes = Array.from(flowchartList.querySelectorAll('.node'));
            const idx = nodes.indexOf(node);
            const stepNumEl = document.getElementById('prop-step-number');
            const stepNameEl = document.getElementById('prop-step-name');
            if (stepNumEl) stepNumEl.textContent = idx !== -1 ? idx + 1 : '';
            if (stepNameEl) stepNameEl.textContent = node.dataset.name || '';
        }

        // Load Data
        let props = {};
        try {
            props = JSON.parse(node.dataset.properties || '{}');
        } catch(e) { props = {}; }

        // Render Sequences
        renderSequences(props.sequences || []);

        // Populate Fields
        document.getElementById('prop-speed').value = props.speed || 'NORMAL';
        // Update display text for speed
        const speedMap = { 'NORMAL': 'Bình thường', 'FAST': 'Nhanh', 'SLOW': 'Chậm' };
        document.getElementById('prop-speed-display').value = speedMap[props.speed || 'NORMAL'];

        document.getElementById('prop-door-time').value = props.doorTime || '';
        document.getElementById('prop-battery-threshold').value = props.batteryThreshold || '';
        document.getElementById('prop-retry-scan').value = props.retryScan || '';
        document.getElementById('prop-fork-speed').value = props.forkSpeed || '';
        document.getElementById('prop-allowed-error').value = props.allowedError || '';
        document.getElementById('prop-max-payload').value = props.maxPayload || '';
        
        const audioLabel = document.getElementById('audio-filename');
        if (audioLabel) {
            audioLabel.textContent = props.audioFileName || 'Chọn file âm thanh...';
        }
    }

    // --- Sequence Management Functions ---
    window.renderSequences = function(sequences) {
        const container = document.getElementById('sequence-container');
        if (!container) return;
        container.innerHTML = '';
        
        if (sequences.length === 0) {
            // Bao gồm 1 card by default as requested
            addNewSequence(true); 
            return;
        }

        sequences.forEach((seq, index) => {
            renderSequenceCard(seq, index);
        });
    }

    window.addNewSequence = function(isInitial = false) {
        const container = document.getElementById('sequence-container');
        if (!container) return;
        
        const index = container.querySelectorAll('.sequence-card').length;
        const seq = { locationStartId: '', locationEndId: '', actionType: 'NONE' };
        
        renderSequenceCard(seq, index);
    }

    function renderSequenceCard(seq, index) {
        const container = document.getElementById('sequence-container');
        const card = document.createElement('div');
        card.className = 'sequence-card sequence-readonly';
        card.dataset.index = index;
        
        // Support both old (locationId) and new (locationStartId/locationEndId) data format
        const startId = seq.locationStartId || seq.locationId || '';
        const endId = seq.locationEndId || '';
        const hasStart = !!startId;
        const hasEnd = !!endId;
        const hasAnyLocation = hasStart || hasEnd;
        const locStart = locationNodes.find(l => l.id === startId);
        const locEnd = locationNodes.find(l => l.id === endId);
        const action = actionOptions.find(a => a.id === seq.actionType) || actionOptions[0];

        card.innerHTML = `
            <div class="sequence-card-header">
                <span class="sequence-title">Trình tự ${index + 1}</span>
                <div class="sequence-card-actions">
                    <button type="button" class="btn-edit-sequence" onclick="toggleSequenceEdit(${index})" title="Chỉnh sửa">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button type="button" class="btn-remove-sequence" onclick="removeSequence(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            
            <div class="form-group">
                <label>Vị trí đầu</label>
                <div class="custom-dropdown sequence-location-dropdown loc-start-dropdown" id="loc-start-dropdown-${index}">
                    <div class="combo-wrapper">
                        <input type="text" class="combo-input loc-start-input" placeholder="Tìm kiếm vị trí..." 
                               value="${locStart ? locStart.name : ''}" autocomplete="off">
                        <i class="fas fa-times combo-clear ${locStart ? 'show' : ''}"></i>
                        <i class="fas fa-chevron-down combo-icon"></i>
                    </div>
                    <div class="dropdown-options loc-start-options"></div>
                    <input type="hidden" class="loc-start-value" value="${startId}">
                </div>
            </div>

            <div class="form-group" style="margin-top: 12px;">
                <label>Vị trí cuối</label>
                <div class="custom-dropdown sequence-location-dropdown loc-end-dropdown" id="loc-end-dropdown-${index}">
                    <div class="combo-wrapper">
                        <input type="text" class="combo-input loc-end-input" placeholder="Tìm kiếm vị trí..." 
                               value="${locEnd ? locEnd.name : ''}" autocomplete="off">
                        <i class="fas fa-times combo-clear ${locEnd ? 'show' : ''}"></i>
                        <i class="fas fa-chevron-down combo-icon"></i>
                    </div>
                    <div class="dropdown-options loc-end-options"></div>
                    <input type="hidden" class="loc-end-value" value="${endId}">
                </div>
            </div>

            <div class="direction-box" style="display: ${hasAnyLocation ? 'flex' : 'none'}">
                <div class="direction-info">
                    <div class="coord-label">Vị trí đầu: <span class="loc-start-coord">${locStart ? `${locStart.floor}-${locStart.aisle}${locStart.row}` : '-'}</span></div>
                    <div class="coord-label">Vị trí cuối: <span class="loc-end-coord">${locEnd ? `${locEnd.floor}-${locEnd.aisle}${locEnd.row}` : '-'}</span></div>
                    <div class="direction-label">Hướng di chuyển: <span class="loc-direction">${locStart ? locStart.direction : (locEnd ? locEnd.direction : '')}</span></div>
                </div>
            </div>

            <div class="form-group" style="margin-top: 12px;">
                <label>Tác vụ</label>
                <div class="custom-dropdown sequence-action-dropdown" id="act-dropdown-${index}">
                    <div class="combo-wrapper">
                        <input type="text" class="combo-input act-input" placeholder="Chọn hoặc tìm tác vụ..." 
                               value="${action.id !== 'NONE' ? action.name : ''}" autocomplete="off">
                        <i class="fas fa-times combo-clear ${seq.actionType !== 'NONE' ? 'show' : ''}"></i>
                        <i class="fas fa-chevron-down combo-icon"></i>
                    </div>
                    <div class="dropdown-options act-options"></div>
                    <input type="hidden" class="seq-action-type" value="${action.id}">
                </div>
            </div>
        `;
        
        container.appendChild(card);
        initLocationDropdown(card, index, 'start');
        initLocationDropdown(card, index, 'end');
        initActionDropdown(card, index);
    }

    function getLocationName(id) {
        const loc = locationNodes.find(l => l.id === id);
        return loc ? loc.name : '';
    }

    // type = 'start' or 'end'
    function initLocationDropdown(card, index, type) {
        const dropdown = card.querySelector('.loc-' + type + '-dropdown');
        const input = dropdown.querySelector('.loc-' + type + '-input');
        const optionsContainer = dropdown.querySelector('.loc-' + type + '-options');
        const hiddenValue = dropdown.querySelector('.loc-' + type + '-value');
        const coordValue = card.querySelector('.loc-' + type + '-coord');
        const directionValue = card.querySelector('.loc-direction');
        const directionBox = card.querySelector('.direction-box');
        const clearBtn = dropdown.querySelector('.combo-clear');
        const comboWrapper = dropdown.querySelector('.combo-wrapper');
        const chevronIcon = comboWrapper.querySelector('.combo-icon');

        function populateOptions(filter) {
            var f = (filter || '').toLowerCase();
            var html = '';
            locationNodes.forEach(function(loc) {
                if (!f || loc.name.toLowerCase().includes(f)) {
                    html += '<div class="dropdown-option" data-id="' + loc.id + '">' + loc.name + '</div>';
                }
            });
            optionsContainer.innerHTML = html || '<div class="dropdown-option" style="color:#94a3b8;pointer-events:none;">Không tìm thấy</div>';
        }

        function openDropdown() {
            populateOptions(input.value);
            dropdown.classList.add('active');
            optionsContainer.classList.add('show');
        }

        function closeDropdown() {
            dropdown.classList.remove('active');
            optionsContainer.classList.remove('show');
        }

        function updateDirectionBox() {
            var startVal = card.querySelector('.loc-start-value').value;
            var endVal = card.querySelector('.loc-end-value').value;
            var hasAny = !!startVal || !!endVal;
            directionBox.style.display = hasAny ? 'flex' : 'none';
            // Update direction text from start location if available, else from end
            var startLoc = locationNodes.find(function(l) { return l.id === startVal; });
            var endLoc = locationNodes.find(function(l) { return l.id === endVal; });
            if (startLoc) directionValue.textContent = startLoc.direction;
            else if (endLoc) directionValue.textContent = endLoc.direction;
            else directionValue.textContent = '';
        }

        // Chevron click - toggle
        if (chevronIcon) {
            chevronIcon.style.pointerEvents = 'auto';
            chevronIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                if (optionsContainer.classList.contains('show')) closeDropdown();
                else { openDropdown(); input.focus(); }
            });
        }

        // Input click - always open
        input.addEventListener('click', function(e) {
            e.stopPropagation();
            openDropdown();
        });

        // Input typing - filter
        input.addEventListener('input', function(e) {
            populateOptions(e.target.value);
            dropdown.classList.add('active');
            optionsContainer.classList.add('show');
            if (e.target.value) clearBtn.classList.add('show');
            else clearBtn.classList.remove('show');
        });

        // X button - use mousedown to fire before blur
        clearBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            input.value = '';
            hiddenValue.value = '';
            coordValue.textContent = '-';
            clearBtn.classList.remove('show');
            updateDirectionBox();
            closeDropdown();
            if (window.saveProperties) window.saveProperties(true);
        });

        // Select option - use mousedown to fire before blur
        optionsContainer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            var opt = e.target.closest('.dropdown-option');
            if (opt && opt.dataset.id) {
                var loc = locationNodes.find(function(l) { return l.id === opt.dataset.id; });
                if (!loc) return;
                input.value = loc.name;
                hiddenValue.value = loc.id;
                coordValue.textContent = loc.floor + '-' + loc.aisle + loc.row;
                updateDirectionBox();
                clearBtn.classList.add('show');
                closeDropdown();
                if (window.saveProperties) window.saveProperties(true);
            }
        });

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    function initActionDropdown(card, index) {
        const dropdown = card.querySelector('.sequence-action-dropdown');
        const input = dropdown.querySelector('.act-input');
        const optionsContainer = dropdown.querySelector('.act-options');
        const hiddenValue = dropdown.querySelector('.seq-action-type');
        const clearBtn = dropdown.querySelector('.combo-clear');
        const comboWrapper = dropdown.querySelector('.combo-wrapper');
        const chevronIcon = comboWrapper.querySelector('.combo-icon');

        function populateOptions(filter) {
            var f = (filter || '').toLowerCase();
            var html = '';
            actionOptions.forEach(function(opt) {
                if (!f || opt.name.toLowerCase().includes(f)) {
                    html += '<div class="dropdown-option" data-id="' + opt.id + '">' + opt.name + '</div>';
                }
            });
            optionsContainer.innerHTML = html || '<div class="dropdown-option" style="color:#94a3b8;pointer-events:none;">Không tìm thấy</div>';
        }

        function openDropdown() {
            populateOptions(input.value);
            dropdown.classList.add('active');
            optionsContainer.classList.add('show');
        }

        function closeDropdown() {
            dropdown.classList.remove('active');
            optionsContainer.classList.remove('show');
        }

        // Chevron click - toggle
        if (chevronIcon) {
            chevronIcon.style.pointerEvents = 'auto';
            chevronIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                if (optionsContainer.classList.contains('show')) closeDropdown();
                else { openDropdown(); input.focus(); }
            });
        }

        // Input click - always open
        input.addEventListener('click', function(e) {
            e.stopPropagation();
            openDropdown();
        });

        // Input typing - filter
        input.addEventListener('input', function(e) {
            populateOptions(e.target.value);
            dropdown.classList.add('active');
            optionsContainer.classList.add('show');
            var isDefault = !e.target.value || e.target.value === 'Không làm gì cả';
            if (!isDefault) clearBtn.classList.add('show');
            else clearBtn.classList.remove('show');
        });

        // X button - use mousedown to fire before blur
        clearBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            input.value = '';
            hiddenValue.value = 'NONE';
            clearBtn.classList.remove('show');
            closeDropdown();
            if (window.saveProperties) window.saveProperties(true);
        });

        // Select option - use mousedown to fire before blur
        optionsContainer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            var opt = e.target.closest('.dropdown-option');
            if (opt && opt.dataset.id) {
                var act = actionOptions.find(function(a) { return a.id === opt.dataset.id; });
                if (!act) return;
                input.value = act.name;
                hiddenValue.value = act.id;
                if (act.id !== 'NONE') clearBtn.classList.add('show');
                else clearBtn.classList.remove('show');
                closeDropdown();
                if (window.saveProperties) window.saveProperties(true);
            }
        });

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    window.toggleSequenceEdit = function(index) {
        const container = document.getElementById('sequence-container');
        const cards = container.querySelectorAll('.sequence-card');
        if (!cards[index]) return;
        const card = cards[index];
        const editBtn = card.querySelector('.btn-edit-sequence');
        const isReadonly = card.classList.contains('sequence-readonly');
        if (isReadonly) {
            card.classList.remove('sequence-readonly');
            if (editBtn) editBtn.classList.add('editing');
        } else {
            card.classList.add('sequence-readonly');
            if (editBtn) editBtn.classList.remove('editing');
        }
    }

    window.removeSequence = function(index) {
        const container = document.getElementById('sequence-container');
        const cards = container.querySelectorAll('.sequence-card');
        if (cards.length > 1) {
            cards[index].remove();
            // Re-index remaining cards
            container.querySelectorAll('.sequence-card').forEach((card, idx) => {
                card.dataset.index = idx;
                card.querySelector('.sequence-title').textContent = `Trình tự ${idx + 1}`;
                card.querySelector('.btn-remove-sequence').setAttribute('onclick', `removeSequence(${idx})`);
                card.querySelector('.btn-edit-sequence').setAttribute('onclick', `toggleSequenceEdit(${idx})`);
            });
        } else {
            // Keep at least one card, just clear it
            const card = cards[0];
            card.querySelector('.loc-start-input').value = '';
            card.querySelector('.loc-start-value').value = '';
            card.querySelector('.loc-start-coord').textContent = '-';
            card.querySelector('.loc-start-dropdown .combo-clear').classList.remove('show');

            card.querySelector('.loc-end-input').value = '';
            card.querySelector('.loc-end-value').value = '';
            card.querySelector('.loc-end-coord').textContent = '-';
            card.querySelector('.loc-end-dropdown .combo-clear').classList.remove('show');

            card.querySelector('.loc-direction').textContent = '';
            card.querySelector('.direction-box').style.display = 'none';
            
            card.querySelector('.act-input').value = '';
            card.querySelector('.seq-action-type').value = 'NONE';
            card.querySelector('.sequence-action-dropdown .combo-clear').classList.remove('show');
        }
    }

    window.deselectNode = function() {
        if (selectedNodeRef) {
            selectedNodeRef.classList.remove('selected');
            selectedNodeRef = null;
        }
        const panel = document.getElementById('propertiesPanel');
        if (panel) panel.classList.remove('open');
        
        // Hide dropdown
        const speedDrodown = document.getElementById('speedDropdown');
        const list = document.getElementById('speedOptionsList');
        if(speedDrodown) speedDrodown.classList.remove('active');
        if(list) list.style.display = 'none';
    }

    // File Input Special Handling
    const fileInput = document.getElementById('prop-audio-file');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                document.getElementById('audio-filename').textContent = file.name;
            }
        });
    }

    // Speed Dropdown Logic
    window.toggleSpeedDropdown = function() {
        const dropdown = document.getElementById('speedDropdown');
        const list = document.getElementById('speedOptionsList');
        const wrapper = dropdown.querySelector('.combo-wrapper');

        if (!dropdown || !list || !wrapper) return;

        if (list.parentElement !== document.body) {
            document.body.appendChild(list);
        }

        const isActive = dropdown.classList.contains('active');
        
        if (!isActive) {
            dropdown.classList.add('active');
            const rect = wrapper.getBoundingClientRect();
            list.style.top = (rect.bottom + 4) + 'px';
            list.style.left = rect.left + 'px';
            list.style.width = rect.width + 'px';
            list.style.display = 'block';
            list.style.zIndex = '9999';
        }
    }

    document.addEventListener('scroll', function() {
        const dropdown = document.getElementById('speedDropdown');
        const list = document.getElementById('speedOptionsList');
        if (dropdown && dropdown.classList.contains('active')) {
             dropdown.classList.remove('active');
             if(list) list.style.display = 'none';
        }
    }, true);

    window.selectSpeed = function(value, text) {
        document.getElementById('prop-speed').value = value;
        document.getElementById('prop-speed-display').value = text;
        
        const dropdown = document.getElementById('speedDropdown');
        const list = document.getElementById('speedOptionsList');
        if(dropdown) dropdown.classList.remove('active');
        if(list) list.style.display = 'none';

        if (typeof saveProperties === 'function') {
            saveProperties(true);
        }
    }

    window.saveProperties = function(silent = false) {
        if (!selectedNodeRef) return;

        let props = {};
        try {
            props = JSON.parse(selectedNodeRef.dataset.properties || '{}');
        } catch(e) { props = {} }

        // Gather basic values
        props.speed = document.getElementById('prop-speed').value;
        props.doorTime = document.getElementById('prop-door-time').value;
        props.batteryThreshold = document.getElementById('prop-battery-threshold').value;
        props.retryScan = document.getElementById('prop-retry-scan').value;
        props.forkSpeed = document.getElementById('prop-fork-speed').value;
        props.allowedError = document.getElementById('prop-allowed-error').value;
        props.maxPayload = document.getElementById('prop-max-payload').value;
        props.audioFileName = document.getElementById('audio-filename').textContent;

        // Gather Sequence values
        const seqCards = document.querySelectorAll('.sequence-card');
        props.sequences = Array.from(seqCards).map(card => {
            return {
                locationStartId: card.querySelector('.loc-start-value').value,
                locationEndId: card.querySelector('.loc-end-value').value,
                direction: card.querySelector('.loc-direction').textContent,
                actionType: card.querySelector('.seq-action-type').value
            };
        });

        // Save back to node
        selectedNodeRef.dataset.properties = JSON.stringify(props);
        
        saveStepsLocal();

        if (!silent) {
            if (typeof showToast === 'function') {
                showToast('Thiết lập thuộc tính cho bước thành công', 'success');
            } else {
                alert('Thiết lập thuộc tính cho bước thành công');
            }
        }
    }

    window.closePropertiesPanel = function() {
        deselectNode();
    }

    window.toggleAccordion = function(header) {
        const item = header.parentElement;
        item.classList.toggle('active');
    }

}
