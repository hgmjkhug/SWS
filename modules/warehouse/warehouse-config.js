/**
 * Warehouse Grid Configuration JavaScript
 * Handles grid selection for warehouse layout configuration
 */

(function() {
    'use strict';

    // ---- Security: HTML escape utility ----
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Configuration
    var currentFloor = 1;
    var step = 40;
    
    // Drag selection state
    var isDragging = false;
    var startPos = { r: 0, c: 0 };
    var isSelecting = true;
    var initialSelection = null;
    
    // Mode state
    var currentMode = 'position'; // 'position' or 'goods'

    // State
    var currentWarehouseId = null;
    var currentWarehouse = null;
    var floorConfigs = {}; // Dynamically populated
    var floorTypeData = []; // Data for "Loại vị trí" tab
    var floorTypeIdCounter = 1;
    var activeAreaId = null; // Track which area is being configured on the grid
    var activeLocationId = null; // Track which location type is being configured on the grid
    var selectedEqCodes = {}; // Track selected equipment for bulk assignment
    var currentAssignFloor = 'all'; // 'all' or floor number


    // Initialize selected as empty objects (using object instead of Set for ES5 compatibility)
    function createSelectedSet() {
        return {};
    }

    function hasSelection(set, id) {
        return set && set.hasOwnProperty(id);
    }

    function addSelection(set, id) {
        set[id] = true;
    }

    function removeSelection(set, id) {
        delete set[id];
    }

    function getSelectionCount(set) {
        return Object.keys(set || {}).length;
    }

    function getSelectionKeys(set) {
        return Object.keys(set || {});
    }

    function copySelection(set) {
        var copy = {};
        var keys = Object.keys(set || {});
        for (var i = 0; i < keys.length; i++) {
            copy[keys[i]] = true;
        }
        return copy;
    }

    // Get column name (A, B, C, ... Z, AA, AB, ...)
    function getColName(index) {
        var name = '';
        while (index >= 0) {
            name = String.fromCharCode(65 + (index % 26)) + name;
            index = Math.floor(index / 26) - 1;
        }
        return name;
    }

    // Initialize grid on load
    // initGrid();

    // Click outside to close equipment dropdowns
    document.addEventListener('click', function(e) {
        // Dropdown 1
        var dropdown1 = document.getElementById('initEquipmentList');
        var input1 = document.getElementById('initEquipmentSearch');
        if (dropdown1 && input1 && dropdown1.classList.contains('show')) {
            var wrapper1 = input1.closest('.init-equipment-search-wrapper');
            if (wrapper1 && !wrapper1.contains(e.target)) {
                dropdown1.classList.remove('show');
            }
        }
        
        // Dropdown 2
        var dropdown2 = document.getElementById('initEquipmentList2');
        var input2 = document.getElementById('initEquipmentSearch2');
        if (dropdown2 && input2 && dropdown2.classList.contains('show')) {
            var wrapper2 = input2.closest('.init-equipment-search-wrapper');
            if (wrapper2 && !wrapper2.contains(e.target)) {
                dropdown2.classList.remove('show');
            }
        }

        // Area Product Dropdowns (using common pattern)
        var areaLists = document.querySelectorAll('.init-equipment-list[id^="areaProductList-"]');
        areaLists.forEach(function(list) {
            var areaId = list.id.split('-')[1];
            var container = document.getElementById('areaProductSearch-' + areaId).parentElement;
            if (list.classList.contains('show')) {
                if (!container.contains(e.target) && !list.contains(e.target)) {
                    list.classList.remove('show');
                }
            }
        });

        // Area Type Dropdowns
        var areaTypeLists = document.querySelectorAll('.init-equipment-list[id^="areaTypeList-"]');
        areaTypeLists.forEach(function(list) {
            var areaId = list.id.split('-')[1];
            var container = document.getElementById('areaTypeSearch-' + areaId).parentElement;
            if (list.classList.contains('show')) {
                if (!container.contains(e.target) && !list.contains(e.target)) {
                    list.classList.remove('show');
                }
            }
        });

        // Floor Tab Dropdowns (Removed)
        // var floorTabDds = ['floorTabSelectDropdown', 'floorCustomDropdown'];
        // floorTabDds.forEach(function(id) {
        //     var dd = document.getElementById(id);
        //     if (dd) {
        //         var menu = dd.querySelector('.floor-custom-menu');
        //         if (menu && menu.classList.contains('show') && !dd.contains(e.target)) {
        //             menu.classList.remove('show');
        //         }
        //     }
        // });

        // New floor assignment dropdown
        var floorAssignDd = document.getElementById('floorAssignDropdown');
        if (floorAssignDd) {
            var menu = floorAssignDd.querySelector('.init-dropdown-menu');
            if (menu && menu.classList.contains('show') && !floorAssignDd.contains(e.target)) {
                menu.classList.remove('show');
            }
        }


        // New floor equipment search combobox
        var floorEqWrapper = document.getElementById('floorEqSearchWrapper');
        var floorEqMenu = document.getElementById('floorEquipmentMenu');
        if (floorEqWrapper && floorEqMenu && floorEqMenu.style.display === 'block') {
            if (!floorEqWrapper.contains(e.target)) {
                floorEqMenu.style.display = 'none';
                var chevron = document.getElementById('floorEqChevron');
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            }
        }
    });

    // Performance: cache grid nodes after each initGrid call
    var cachedGridNodes = [];

    function initGrid() {
        if (!floorConfigs[currentFloor]) {
            floorConfigs[currentFloor] = { rows: 18, cols: 27, selected: {}, goods: {} };
        }
        // Ensure 'goods' object exists for older configs
        if (!floorConfigs[currentFloor].goods) {
            floorConfigs[currentFloor].goods = {};
        }
        
        var config = floorConfigs[currentFloor];
        var wrapper = document.getElementById('gridWrapper');
        if (!wrapper) return;
        
        wrapper.innerHTML = '';

        var initLengthInput = document.getElementById('initWarehouseLength');
        var initWidthInput = document.getElementById('initWarehouseWidth');
        
        if (initLengthInput) initLengthInput.value = config.cols;
        if (initWidthInput) initWidthInput.value = config.rows;

        var width = (config.cols - 1) * step;
        var height = (config.rows - 1) * step;
        wrapper.style.width = width + 'px';
        wrapper.style.height = height + 'px';

        // Grid Lines & Labels
        for (var c = 0; c < config.cols; c++) {
            var x = c * step;
            
            // Vertical line (removed per request)
            // var line = document.createElement('div');
            // line.className = 'grid-line-vertical';
            // line.style.left = x + 'px';
            // wrapper.appendChild(line);

            // Column label
            var label = document.createElement('div');
            label.className = 'label-col';
            label.innerText = getColName(c);
            label.style.left = x + 'px';
            wrapper.appendChild(label);
        }

        for (var r = 0; r < config.rows; r++) {
            var y = r * step;
            
            // Horizontal line (removed per request)
            // var hline = document.createElement('div');
            // hline.className = 'grid-line-horizontal';
            // hline.style.top = y + 'px';
            // wrapper.appendChild(hline);

            // Row label
            var rlabel = document.createElement('div');
            rlabel.className = 'label-row';
            rlabel.innerText = r + 1;
            rlabel.style.top = y + 'px';
            wrapper.appendChild(rlabel);
        }

        // Nodes
        for (var row = 0; row < config.rows; row++) {
            for (var col = 0; col < config.cols; col++) {
                var node = document.createElement('div');
                node.className = 'node-hitbox';
                node.style.top = (row * step) + 'px';
                node.style.left = (col * step) + 'px';
                node.dataset.id = row + '-' + col;
                
                // SVG for goods (new requirement)
                var goodsSvg = `
                    <div class="node-goods">
                        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_${row}_${col})">
                        <path d="M18.0341 0.019531L5.2656 1.9016C4.82462 1.9666 4.68267 2.53252 5.04078 2.79794L11.038 7.24299C11.1527 7.32799 11.2982 7.35992 11.438 7.33073L26.329 4.21954C26.8145 4.11811 26.872 3.44788 26.4108 3.26525L18.2911 0.0493199C18.2096 0.0170095 18.1209 0.0067359 18.0341 0.019531Z" fill="#38A0F0"/>
                        <path d="M10.7663 7.57295L4.80274 3.0371C4.47301 2.78632 3.99883 3.02228 4.00005 3.43654L4.03305 14.6538C4.03337 14.7633 4.06963 14.8696 4.13625 14.9565L10.0668 22.6919C10.3576 23.0711 10.9636 22.8655 10.9636 22.3876V7.97092C10.9636 7.81472 10.8906 7.6675 10.7663 7.57295Z" fill="#1D8ADF"/>
                        <path d="M27.3862 4.46063L11.7904 7.84534C11.5605 7.89524 11.3965 8.09868 11.3965 8.33396V23.2908C11.3965 23.6365 11.7389 23.8779 12.0645 23.7617L27.6603 18.1965C27.8593 18.1254 27.9922 17.9369 27.9922 17.7256V4.94926C27.9922 4.6304 27.6978 4.393 27.3862 4.46063Z" fill="#0F6EB8" stroke="#0F6EB8" stroke-width="0.1"/>
                        </g>
                        <defs>
                        <filter id="filter0_d_${row}_${col}" x="0" y="0.0141602" width="32.042" height="31.8271" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4025_17350"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4025_17350" result="shape"/>
                        </filter>
                        </defs>
                        </svg>
                    </div>`;

                var diamondSvg = `
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Connecting lines removed per user request -->
                        <path d="M23.1092 14.6235C22.8193 14.9134 22.3384 14.9134 22.0485 14.6235L19.7504 12.3254L17.4523 14.6235C17.1624 14.9134 16.6816 14.9134 16.3917 14.6235C16.1017 14.3336 16.1017 13.8527 16.3917 13.5628L19.2201 10.7344C19.51 10.4445 19.9908 10.4445 20.2807 10.7344L23.1092 13.5628C23.3991 13.8527 23.3991 14.3336 23.1092 14.6235Z" fill="#076EB8"/>
                        <path d="M23.1092 25.9372L20.2807 28.7656C19.9908 29.0555 19.51 29.0555 19.2201 28.7656L16.3917 25.9372C16.1017 25.6473 16.1017 25.1664 16.3917 24.8765C16.6816 24.5866 17.1624 24.5866 17.4523 24.8765L19.7504 27.1746L22.0485 24.8765C22.3384 24.5866 22.8193 24.5866 23.1092 24.8765C23.3991 25.1664 23.3991 25.6473 23.1092 25.9372Z" fill="#076EB8"/>
                        <path d="M14.6235 23.1088C14.3336 23.3987 13.8528 23.3987 13.5629 23.1088L10.7344 20.2803C10.4445 19.9904 10.4445 19.5096 10.7344 19.2197L13.5629 16.3912C13.8528 16.1013 14.3336 16.1013 14.6235 16.3912C14.9134 16.6812 14.9134 17.162 14.6235 17.4519L12.3254 19.75L14.6235 22.0481C14.9134 22.338 14.9134 22.8188 14.6235 23.1088Z" fill="#076EB8"/>
                        <path d="M28.7654 20.2803L25.937 23.1088C25.6471 23.3987 25.1662 23.3987 24.8763 23.1088C24.5864 22.8188 24.5864 22.338 24.8763 22.0481L27.1744 19.75L24.8763 17.4519C24.5864 17.162 24.5864 16.6812 24.8763 16.3912C25.1662 16.1013 25.6471 16.1013 25.937 16.3912L28.7654 19.2197C29.0553 19.5096 29.0553 19.9904 28.7654 20.2803Z" fill="#076EB8"/>
                    </svg>`;
                node.innerHTML = '<div class="node-dot"></div><div class="node-diamond">' + diamondSvg + '</div><div class="node-direction" style="display:none;"></div>' + goodsSvg;
                
                var id = row + '-' + col;
                
                // Set initial visual state
                if (hasSelection(config.selected, id)) {
                    node.classList.add('active');
                }
                if (hasSelection(config.goods, id)) {
                    node.classList.add('has-goods');
                }

                // Closure to capture row/col
                (function(r, c) {
                    node.onmousedown = function(e) { handleMouseDown(e, r, c); };
                    node.onmouseenter = function(e) { 
                        handleMouseEnter(e, r, c); 
                        showGoodsPopover(e, r, c);
                    };
                    node.onmouseleave = function(e) {
                        hideGoodsPopover();
                    };
                })(row, col);

                wrapper.appendChild(node);
            }
        }

        // Add Column Button
        var btnCol = document.createElement('div');
        btnCol.className = 'add-btn btn-add-col';
        btnCol.innerHTML = '<i class="fas fa-plus"></i>';
        btnCol.onclick = function() {
            floorConfigs[currentFloor].cols++;
            initGrid();
        };
        wrapper.appendChild(btnCol);

        // Add Row Button
        var btnRow = document.createElement('div');
        btnRow.className = 'add-btn btn-add-row';
        btnRow.innerHTML = '<i class="fas fa-plus"></i>';
        btnRow.onclick = function() {
            floorConfigs[currentFloor].rows++;
            initGrid();
        };
        wrapper.appendChild(btnRow);

        // Cache nodes for performance (avoids querySelectorAll on every mouse event)
        cachedGridNodes = wrapper.querySelectorAll('.node-hitbox');

        // Update selection list
        renderSelectionList();
    }

    // Set Selection Mode
    function setMode(mode) {
        currentMode = mode;
        
        // Update styling of buttons
        var btnPos = document.getElementById('btn-mode-position');
        var btnGoods = document.getElementById('btn-mode-goods');
        
        if (mode === 'position') {
            btnPos.classList.add('active');
            btnGoods.classList.remove('active');
        } else {
            btnPos.classList.remove('active');
            btnGoods.classList.add('active');
        }
    }

    // Resizer is initialized in initResizer() called from init()

    // Drag handlers
    var lastR, lastC; // Last coordinates during a drag
    function handleMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        // When dragging ends, perform the final update with isFinal = true
        if (lastR !== undefined && lastC !== undefined) {
            updateSelection(lastR, lastC, true);
        }
    }

    function updateSelection(currentR, currentC, isFinal) {
        var config = floorConfigs[currentFloor];
        var minR = Math.min(startPos.r, currentR);
        var maxR = Math.max(startPos.r, currentR);
        var minC = Math.min(startPos.c, currentC);
        var maxC = Math.max(startPos.c, currentC);

        var targetSet = (currentMode === 'goods') ? config.goods : config.selected;
        
        var newSet = copySelection(initialSelection);
        
        for (var r = minR; r <= maxR; r++) {
            for (var c = minC; c <= maxC; c++) {
                var id = r + '-' + c;
                if (isSelecting) {
                    addSelection(newSet, id);
                    
                    // Side effect: If in Goods mode, also ensure it's Selected (active)
                    if (currentMode === 'goods') {
                         addSelection(config.selected, id);
                    }
                } else {
                    removeSelection(newSet, id);
                }
            }
        }
        
        // Apply back to config
        if (currentMode === 'goods') {
            config.goods = newSet;
        } else {
            config.selected = newSet;
            
            // Side effect: If unselecting in Normal mode, remove Goods status too?
            // Usually, if a cell is not a warehouse position, it can't have goods.
            // So if we remove selection, we should remove goods too.
            // Let's do that for consistency.
            if (!isSelecting) {
                 for (var r = minR; r <= maxR; r++) {
                    for (var c = minC; c <= maxC; c++) {
                        var id = r + '-' + c;
                         if (hasSelection(config.goods, id)) {
                             removeSelection(config.goods, id); // Remove goods flag if not a position anymore
                         }
                    }
                }
            }
        }

        refreshVisuals();
        renderSelectionList();
        
        // During drag (mousemove), we only refresh visuals and selection list (for bottom grid area).
        // Full card re-rendering (Expensive) is only done on mouseup (isFinal = true).
        if (!isFinal) return;

        // Sync back to Area tab if we have an active area
        if (activeAreaId !== null) {
            for (var i = 0; i < areaData.length; i++) {
                if (areaData[i].id === activeAreaId) {
                    // Convert grid IDs back to position labels
                    areaData[i].positions = getSelectionKeys(config.selected).sort(function(a, b) {
                        var partsA = a.split('-').map(Number);
                        var partsB = b.split('-').map(Number);
                        if (partsA[0] !== partsB[0]) return partsA[0] - partsB[0];
                        return partsA[1] - partsB[1];
                    }).map(function(id) {
                        var pts = id.split('-').map(Number);
                        return currentFloor + '-' + getColName(pts[1]) + (pts[0] + 1);
                    });
                    break;
                }
            }
            renderAreaCards();
        }
        
        // Sync back to Location tab if we have an active location
        if (activeLocationId !== null) {
            for (var j = 0; j < locationData.length; j++) {
                if (locationData[j].id === activeLocationId) {
                    locationData[j].positions = getSelectionKeys(config.selected).sort(function(a, b) {
                        var partsA = a.split('-').map(Number);
                        var partsB = b.split('-').map(Number);
                        if (partsA[0] !== partsB[0]) return partsA[0] - partsB[0];
                        return partsA[1] - partsB[1];
                    }).map(function(id) {
                        var pts = id.split('-').map(Number);
                        return currentFloor + '-' + getColName(pts[1]) + (pts[0] + 1);
                    });
                    break;
                }
            }
            renderLocationCards();
        }
    }

    function handleMouseDown(e, r, c) {
        e.preventDefault();
        isDragging = true;
        startPos = { r: r, c: c };
        lastR = r; // Store for potential mouseup call
        lastC = c; // Store for potential mouseup call
        var config = floorConfigs[currentFloor];
        var id = r + '-' + c;
        
        // Determine whether we are adding or removing based on the clicked cell state
        if (currentMode === 'goods') {
             // Logic for goods mode: Toggle 'has-goods'
             isSelecting = !hasSelection(config.goods, id);
             initialSelection = copySelection(config.goods);
        } else {
             // Logic for normal mode: Toggle 'active' (selected)
             isSelecting = !hasSelection(config.selected, id);
             initialSelection = copySelection(config.selected);
        }
        
        updateSelection(r, c, false); // Pass false for isFinal during drag start
    }

    function handleMouseEnter(e, r, c) {
        if (!isDragging) return;
        lastR = r; // Update last coordinates during drag
        lastC = c; // Update last coordinates during drag
        updateSelection(r, c, false); // Pass false for isFinal during drag
    }

    function refreshVisuals() {
    var config = floorConfigs[currentFloor];
    // Use cached nodes for performance; fallback to live query if cache is stale
    var nodes = cachedGridNodes.length > 0 ? cachedGridNodes : document.querySelectorAll('.node-hitbox');
    
    // Build lookup maps up-front (O(n)) to avoid O(n*m) indexOf inside loop
    var areaInfoMap = {};
    for (var a = 0; a < areaData.length; a++) {
        var areaObj = areaData[a];
        for (var p = 0; p < areaObj.positions.length; p++) {
            areaInfoMap[areaObj.positions[p]] = {
                isActive: areaObj.isActive !== false
            };
        }
    }
    
    var allLocPositions = {};
    var locDirectionMap = {};
    for (var l = 0; l < locationData.length; l++) {
        for (var lp = 0; lp < locationData[l].positions.length; lp++) {
            var pos = locationData[l].positions[lp];
            allLocPositions[pos] = true;
            locDirectionMap[pos] = locationData[l].directions || (locationData[l].direction ? [locationData[l].direction] : []);
        }
    }

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var id = node.dataset.id;
        var parts = id.split('-').map(Number);
        var posLabel = getColName(parts[1]) + (parts[0] + 1);
        // Floor-prefixed label used by updateSelection when saving positions
        var posLabelWithFloor = currentFloor + '-' + posLabel;
        
        // 1. Check Active Selection (the one being edited)
        var isActive = hasSelection(config.selected, id);
        if (isActive) {
            node.classList.add('active');
        } else {
            node.classList.remove('active');
        }
        
        // 2. Check Assigned Area
        var areaInfo = areaInfoMap[posLabelWithFloor] || areaInfoMap[posLabel];
        var isAreaAssigned = !!areaInfo;
        var isAreaActive = isAreaAssigned ? areaInfo.isActive : true;

        if (isAreaAssigned) {
            node.classList.add('is-area');
            if (isAreaActive) {
                node.style.backgroundColor = '#e0f2fe'; // Active blue
                node.style.borderColor = '#bae6fd';
            } else {
                node.style.backgroundColor = '#F9FBFC'; // Inactive light gray
                node.style.borderColor = '#e2e8f0';
            }
        } else {
            node.classList.remove('is-area');
            node.classList.remove('inactive-area');
            node.style.backgroundColor = '';
            node.style.borderColor = '';
        }

        // 3. Check Assigned Location (Any location type) - match both formats for compatibility
        var locDirs = locDirectionMap[posLabelWithFloor] || locDirectionMap[posLabel];
        var directionWrapper = node.querySelector('.node-direction');

        if (allLocPositions[posLabelWithFloor] || allLocPositions[posLabel]) {
            node.classList.add('is-location');
            if (directionWrapper) {
                if (locDirs && locDirs.length > 0) {
                    directionWrapper.innerHTML = getLocationIconSVG(locDirs, true);
                    directionWrapper.style.display = 'block';
                } else {
                    directionWrapper.style.display = 'none';
                }
            }
        } else {
            node.classList.remove('is-location');
            if (directionWrapper) {
                directionWrapper.style.display = 'none';
            }
        }

        // 3.5. Area Visualization (Override generic dot color)
        var dot = node.querySelector('.node-dot');
        var diamondWrapper = node.querySelector('.node-diamond');
        var diamondSvg = diamondWrapper ? diamondWrapper.querySelector('svg') : null;
        
        // New logic: Show diamonds for ALL area positions (Active or Inactive)
        if (isAreaAssigned) {
            if (dot) dot.style.display = 'none';
            if (diamondWrapper) {
                diamondWrapper.style.opacity = '1';
                diamondWrapper.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        } else {
            if (dot) dot.style.display = (isActive ? 'none' : 'block');
            if (diamondWrapper) {
                // If not an area but active (selection rect), show diamond, otherwise hide
                diamondWrapper.style.opacity = (isActive ? '1' : '0');
                diamondWrapper.style.transform = 'translate(-50%, -50%) scale(' + (isActive ? '1' : '0') + ')';
            }
        }

        if (diamondSvg) {
            // Reset diamond paths if no area color
            var defaultPaths = diamondSvg.querySelectorAll('path[fill]');
            defaultPaths.forEach(function(dp) {
                dp.style.fill = '';
            });
        }
                // 4. Check Goods
        if (hasSelection(config.goods, id)) {
            node.classList.add('has-goods');
        } else {
            node.classList.remove('has-goods');
        }
    }
    var countEl = document.getElementById('selectedCount');
    if (countEl) {
        countEl.innerText = getSelectionCount(config.selected);
    }
}

    // Render selection list as tags
    function renderSelectionList() {
        var config = floorConfigs[currentFloor];
        var container = document.getElementById('selectionList');
        if (!container) return;
        
        container.innerHTML = '';

        // Sort the IDs for display
        var sortedIds = getSelectionKeys(config.selected).sort(function(a, b) {
            var partsA = a.split('-').map(Number);
            var partsB = b.split('-').map(Number);
            if (partsA[0] !== partsB[0]) return partsA[0] - partsB[0];
            return partsA[1] - partsB[1];
        });

        for (var i = 0; i < sortedIds.length; i++) {
            var id = sortedIds[i];
            var parts = id.split('-').map(Number);
            var r = parts[0];
            var c = parts[1];
            var label = getColName(c) + ':' + (r + 1);

            var tag = document.createElement('div');
            tag.className = 'tag-item';
            
            // Highlight if it has goods
            if (hasSelection(config.goods, id)) {
                tag.style.border = '1px solid #1D8ADF';
                tag.style.color = '#1D8ADF';
                tag.style.fontWeight = '500';
            }
            
            tag.innerHTML = label + ' <span class="tag-remove" data-id="' + id + '">&times;</span>';
            container.appendChild(tag);
        }

        // Add click handlers for remove buttons
        var removeButtons = container.querySelectorAll('.tag-remove');
        for (var j = 0; j < removeButtons.length; j++) {
            removeButtons[j].onclick = function() {
                removeCell(this.getAttribute('data-id'));
            };
        }
    }

    // Remove a single cell
    function removeCell(id) {
        var config = floorConfigs[currentFloor];
        if (hasSelection(config.selected, id)) {
            removeSelection(config.selected, id);
            // Also remove goods property
            if (hasSelection(config.goods, id)) {
                removeSelection(config.goods, id);
            }
            refreshVisuals();
            renderSelectionList();
        }
    }

    // Save configuration
    function saveGridConfig() {
        // Calculate totals across all floors
        var totalLocs = 0;
        for (var f in floorConfigs) {
            if (floorConfigs[f].selected) {
                totalLocs += Object.keys(floorConfigs[f].selected).length;
            }
        }
        
        // Save to parent warehouse store
        if (currentWarehouseId) {
            try {
                var stored = localStorage.getItem('wms_warehouses_v6');
                if (stored) {
                    var list = JSON.parse(stored);
                    var idx = list.findIndex(function(w) { return w.id === currentWarehouseId; });
                    if (idx !== -1) {
                        list[idx].totalLocations = totalLocs;
                        list[idx].configData = floorConfigs; 
                        localStorage.setItem('wms_warehouses_v6', JSON.stringify(list));
                        alert('Đã lưu cấu hình kho thành công!\nTổng vị trí: ' + totalLocs.toLocaleString());
                    }
                }
            } catch (e) {
                alert('Lỗi lưu cấu hình: ' + e.message);
            }
        } else {
            alert('Chưa chọn kho để cấu hình!');
        }
    }

    // ===== GOODS POPOVER LOGIC =====
    var popoverEl = null;
    // Tracks which cells have been *saved* with goods mode (per floor).
    // Only saved goods cells show the hover popover.
    var savedGoodsData = {}; // { [floor]: { [cellId]: true } }

    function showGoodsPopover(e, r, c) {
        var id = r + '-' + c;
        var floorSaved = savedGoodsData[currentFloor] || {};
        
        // Only show popover for cells that were saved with goods mode
        if (!floorSaved[id]) return;

        if (!popoverEl) {
            popoverEl = document.createElement('div');
            popoverEl.className = 'goods-popover';
            document.body.appendChild(popoverEl);
        }

        // Find associated product from areas
        var colName = getColName(c);
        var posLabel = colName + (r + 1);
        var product = null;
        
        for (var i = 0; i < areaData.length; i++) {
            if (areaData[i].positions.indexOf(posLabel) > -1 || areaData[i].positions.indexOf(currentFloor + '-' + posLabel) > -1) {
                if (areaData[i].selectedProducts && areaData[i].selectedProducts.length > 0) {
                    product = areaData[i].selectedProducts[0];
                    break;
                }
            }
        }

        // If no product found, use a demo one
        if (!product) {
            product = { code: 'VT001', name: 'Thép tấm ống hộp', quyTac: 'FIFO' };
        }

        var html = '';
        html += '<div class="popover-title">' + escapeHtml(product.code) + ' - ' + escapeHtml(product.name) + '</div>';
        html += '<div class="popover-row"><strong>Số lượng:</strong> 150 cái</div>';
        html += '<div class="popover-row"><strong>Quy cách:</strong> ' + escapeHtml(product.quyTac || 'FIFO/FEFO') + '</div>';
        html += '<div class="popover-row"><strong>Ngày nhập:</strong> 08:30:27 15/02/2026</div>';
        html += '<div class="popover-row"><strong>Ngày hết hạn:</strong> 15/02/2027</div>';

        popoverEl.innerHTML = html;
        popoverEl.style.display = 'block';

        updatePopoverPosition(e);
    }

    function hideGoodsPopover() {
        if (popoverEl) {
            popoverEl.style.display = 'none';
        }
    }

    function updatePopoverPosition(e) {
        if (!popoverEl) return;
        var padding = 15;
        var x = e.clientX + padding;
        var y = e.clientY + padding;

        // Boundary check
        var rect = popoverEl.getBoundingClientRect();
        if (x + rect.width > window.innerWidth) {
            x = e.clientX - rect.width - padding;
        }
        if (y + rect.height > window.innerHeight) {
            y = e.clientY - rect.height - padding;
        }

        popoverEl.style.left = x + 'px';
        popoverEl.style.top = y + 'px';
    }

    // Monitor mouse move for popover positioning (optional, but makes it feel smoother)
    document.addEventListener('mousemove', function(e) {
        if (popoverEl && popoverEl.style.display === 'block') {
            updatePopoverPosition(e);
        }
    });

    // Zoom functions
    function zoomIn() {
        step += 5;
        initGrid();
    }

    function zoomOut() {
        if (step > 25) {
            step -= 5;
            initGrid();
        }
    }

    // Custom Confirm Modal Logic
    var confirmCallback = null;

    window.showCustomConfirm = function(title, message, callback) {
        document.getElementById('customConfirmTitle').innerText = title;
        document.getElementById('customConfirmMessage').innerText = message;
        confirmCallback = callback;
        document.getElementById('customConfirmModal').style.display = 'flex';
    };

    window.closeCustomConfirm = function() {
        document.getElementById('customConfirmModal').style.display = 'none';
        confirmCallback = null;
    };

    window.executeCustomConfirm = function() {
        if (confirmCallback) {
            confirmCallback();
        }
        window.closeCustomConfirm();
    };

    // Reset current floor
    window.resetCurrentFloor = function() {
        if (!floorConfigs[currentFloor]) return;
        
        var message = 'Bạn có chắc chắn muốn khôi phục mặc định cho Tầng ' + currentFloor + '?\nToàn bộ cấu hình vị trí và hàng hóa tại tầng này sẽ bị xóa.';
        
        window.showCustomConfirm('Xác nhận khôi phục', message, function() {
            floorConfigs[currentFloor].selected = {};
            floorConfigs[currentFloor].goods = {};
            initGrid();
            
            if (window.showToast) {
                window.showToast('Đã khôi phục mặc định cho Tầng ' + currentFloor, 'success');
            }
        });
    };

    // Sync current floor config to all other floors
    window.syncAllFloors = function() {
        if (!floorConfigs[currentFloor]) return;
        
        var message = 'Bạn có chắc chắn muốn đồng bộ cấu hình của tầng hiện tại cho TẤT CẢ các tầng khác?\nThao tác này sẽ ghi đè cấu hình hiện có ở các tầng khác.';
        
        window.showCustomConfirm('Xác nhận đồng bộ', message, function() {
            var source = floorConfigs[currentFloor];
            
            for (var f in floorConfigs) {
                if (parseInt(f) === currentFloor) continue;
                
                floorConfigs[f].rows = source.rows;
                floorConfigs[f].cols = source.cols;
                floorConfigs[f].selected = JSON.parse(JSON.stringify(source.selected));
                floorConfigs[f].goods = JSON.parse(JSON.stringify(source.goods));
            }
            
            // Save automatically after sync
            saveGridConfig();
            
            if (window.showToast) {
                window.showToast('Đồng bộ cấu hình tất cả các tầng thành công!', 'success');
            }
        });
    };
    
    // Load Warehouse from ID
    function loadContext() {
        var idStr = localStorage.getItem('config_warehouse_id');
        if (!idStr) {
            alert("Không tìm thấy thông tin kho cần cấu hình. Vui lòng quay lại danh sách kho.");
            return;
        }
        currentWarehouseId = parseInt(idStr);
        
        try {
            var stored = localStorage.getItem('wms_warehouses_v6');
            if (stored) {
                var list = JSON.parse(stored);
                currentWarehouse = list.find(function(w) { return w.id === currentWarehouseId; }) || null;
            }
        } catch (e) {
            currentWarehouse = null;
        }
        
        // Populate Title or Header if needed (optional)
        var header = document.querySelector('.config-header h3');
        if (header && currentWarehouse) {
            header.innerText = 'Thiết lập cấu hình Kho: ' + currentWarehouse.name;
            renderFloorMenu();
        }
        
        // Restore Config Data if available
        if (currentWarehouse && currentWarehouse.configData) {
            floorConfigs = currentWarehouse.configData;
            // Ensure goods and metadata structure exists
            for (var fg in floorConfigs) {
                if (!floorConfigs[fg].goods) floorConfigs[fg].goods = {};
            }
            // Restore savedGoodsData so hover popovers work after page reload
            for (var fg2 in floorConfigs) {
                if (floorConfigs[fg2].goods && Object.keys(floorConfigs[fg2].goods).length > 0) {
                    savedGoodsData[fg2] = JSON.parse(JSON.stringify(floorConfigs[fg2].goods));
                }
            }
        } else if (currentWarehouse) {
            // Initialize defaults based on floor count
            for (var fi = 1; fi <= currentWarehouse.floors; fi++) {
                if (!floorConfigs[fi]) floorConfigs[fi] = { rows: 18, cols: 27, selected: {}, goods: {} };
            }
        }

        // Restore Floor Type Data (Loại vị trí)
        if (currentWarehouse && currentWarehouse.floorTypes && currentWarehouse.floorTypes.length > 0) {
            floorTypeData = currentWarehouse.floorTypes;
            var maxId = 0;
            floorTypeData.forEach(function(ft) { if (ft.id > maxId) maxId = ft.id; });
            floorTypeIdCounter = maxId + 1;
        } else {
            floorTypeData = [
                { id: 1, name: '', neighborCell: '', image: '', collapsed: false }
            ];
            floorTypeIdCounter = 2;
        }
        
        // Restore Area Data if available
        if (currentWarehouse && currentWarehouse.areas && currentWarehouse.areas.length > 0) {
            areaData = currentWarehouse.areas.map(function(area) {
                // Ensure positions are preserved if they exist, or fallback to empty array
                area.positions = area.positions || [];
                return area;
            });
            // Update counter
            var maxAreaId = 0;
            areaData.forEach(function(a) { if (a.id > maxAreaId) maxAreaId = a.id; });
            areaIdCounter = maxAreaId + 1;
        } else {
            // Default sample if no data
        areaData = [
            {
                id: 1,
                areaCode: '',
                productType: '',
                areaName: '',
                positions: [],
                direction: '',
                collapsed: false,
                isActive: true
            }
        ];
        areaIdCounter = 2;
    }

    // Ensure at least one area by default
    if (areaData.length === 0) {
        areaData.push({
            id: 1,
            areaCode: '',
            productType: '',
            selectedProducts: [], 
            areaName: '',
            positions: [],
            direction: '',
            collapsed: false,
            isActive: true
        });
        areaIdCounter = 2;
    }
    

        // Restore Location Data if available
        if (currentWarehouse && currentWarehouse.locationTypes && currentWarehouse.locationTypes.length > 0) {
            locationData = currentWarehouse.locationTypes.map(function(loc) {
                loc.positions = loc.positions || [];
                return loc;
            });
            var maxLocId = 0;
            locationData.forEach(function(l) { if (l.id > maxLocId) maxLocId = l.id; });
            locationIdCounter = maxLocId + 1;
        } else {
            // Default sample
            locationData = [
                {
                    id: 1,
                    code: 'VTL01',
                    name: 'Vị trí lưu trữ tiêu chuẩn',
                    image: '',
                    positions: [],
                    collapsed: false
                }
            ];
            locationIdCounter = 2;
        }
    }

    // Initialize when DOM is ready
    function init() {
        // Load context first
        loadContext();
        
        // Floor selector
        var floorSelect = document.getElementById('floorSelect');
        if (floorSelect) {
            floorSelect.onchange = function(e) {
                currentFloor = parseInt(e.target.value);
                initGrid();
            };
        }

        // Length input (Khai báo tab) - Single source for grid columns
        var initLengthInput = document.getElementById('initWarehouseLength');
        if (initLengthInput) {
            initLengthInput.oninput = function(e) {
                if (floorConfigs[currentFloor]) {
                    var val = parseInt(e.target.value) || 1;
                    if (val > 52) val = 52; // Enforce max
                    floorConfigs[currentFloor].cols = val;
                    initGrid();
                }
            };
        }

        // Width input (Khai báo tab) - Single source for grid rows
        var initWidthInput = document.getElementById('initWarehouseWidth');
        if (initWidthInput) {
            initWidthInput.oninput = function(e) {
                if (floorConfigs[currentFloor]) {
                    var val = parseInt(e.target.value) || 1;
                    if (val > 50) val = 50; // Enforce max
                    floorConfigs[currentFloor].rows = val;
                    initGrid();
                }
            };
        }

        // Mouse up handler for drag selection
        document.addEventListener('mouseup', handleMouseUp);

        // Reset to floor 1
        currentFloor = 1;
        initGrid();

        // Populate Khai báo tab
        populateInitTab();
        
        // Populate Khai báo tab
        populateInitTab();

        
        // Ensure floor menu is rendered
        renderFloorMenu();
        // Real-time floor count listener in Khai báo tab
        var initFloorsInput = document.getElementById('initWarehouseFloors');
        if (initFloorsInput) {
            initFloorsInput.oninput = function(e) {
                var val = parseInt(e.target.value) || 1;
                if (currentWarehouse) {
                    currentWarehouse.floors = val;
                    // Also update floorConfigs for new floors if they don't exist
                    for (var i = 1; i <= val; i++) {
                        if (!floorConfigs[i]) floorConfigs[i] = { rows: 18, cols: 27, selected: {}, goods: {}, name: '', height: '' };
                    }
                    renderFloorMenu();
                }
            };
        }

        // Set initial tab state
        var savedTabId = localStorage.getItem('warehouse_config_active_tab');
        var activeBtn = document.querySelector('.segment-btn.active');
        
        // Hide config content briefly to prevent flash
        var configContent = document.querySelector('.config-content');
        if (configContent) {
           configContent.style.visibility = 'hidden';
        }
        
        if (savedTabId && savedTabId !== 'floor') {
            // Restore from saved state
            var targetBtn = null;
            var buttons = document.querySelectorAll('.segment-btn');
            for (var i = 0; i < buttons.length; i++) {
                var btnOnClick = buttons[i].getAttribute('onclick') || '';
                if (btnOnClick.includes("setConfigTab('" + savedTabId + "'")) {
                    targetBtn = buttons[i];
                    break;
                }
            }
            setConfigTab(savedTabId, targetBtn || activeBtn);
        } else if (activeBtn) {
            // Default logic if no saved state
            var tabId = 'init'; // Default
            var defaultOnClick = activeBtn.getAttribute('onclick') || '';
            if (defaultOnClick.includes("('area'")) tabId = 'area';
            else if (defaultOnClick.includes("('location'")) tabId = 'location';
            setConfigTab(tabId, activeBtn);
        } else {
            // Fallback if no DOM button found yet
            setConfigTab('init', null);
        }

        
        if (configContent) {
            // Unhide after the correct DOM tab displays
            setTimeout(function() {
                configContent.style.visibility = 'visible';
            }, 50);
        }

        // Initialize Resizer
        initResizer();
    }

    function renderFloorMenu() {
        var headerMenu = document.getElementById('floorCustomMenu');
        
        // Populate header dropdown with floor names
        if (headerMenu) {
            headerMenu.innerHTML = '';
            var floors = 1;
            if (currentWarehouse && currentWarehouse.floors) {
                floors = parseInt(currentWarehouse.floors);
            } else {
                var fcKeys = Object.keys(floorConfigs);
                if (fcKeys.length > 0) {
                    floors = Math.max.apply(null, fcKeys.map(Number));
                }
            }
            for (var i = 1; i <= floors; i++) {
                var item = document.createElement('div');
                item.className = 'floor-custom-item' + (i === currentFloor ? ' active' : '');
                item.innerText = 'Tầng ' + i;
                (function(floorNum) {
                    item.onclick = function(e) {
                        e.stopPropagation();
                        selectFloor(floorNum);
                    };
                })(i);
                headerMenu.appendChild(item);
            }
        }
        
        var headerDisplay = document.getElementById('currentFloorDisplay');
        if (headerDisplay) headerDisplay.innerText = 'Tầng ' + currentFloor;
    }

    // ===== RESIZER LOGIC =====
    function initResizer() {
        var resizer = document.getElementById('configResizer');
        var leftPanel = document.querySelector('.config-left-panel');
        var container = document.querySelector('.config-content');
        if (!resizer || !leftPanel || !container) return;

        // Restore saved width
        var savedWidth = localStorage.getItem('warehouse_config_sidebar_width');
        if (savedWidth) {
            leftPanel.style.width = savedWidth + 'px';
        }

        resizer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            var startX = e.clientX;
            var startWidth = leftPanel.offsetWidth;

            resizer.classList.add('active');
            container.classList.add('resizing');

            function onMouseMove(e) {
                var newWidth = startWidth + (e.clientX - startX);
                // Limits
                if (newWidth < 300) newWidth = 300;
                if (newWidth > 800) newWidth = 800;
                
                leftPanel.style.width = newWidth + 'px';
            }

            function onMouseUp() {
                resizer.classList.remove('active');
                container.classList.remove('resizing');
                localStorage.setItem('warehouse_config_sidebar_width', leftPanel.offsetWidth);
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                
                // Trigger grid resize if needed
                if (typeof initGrid === 'function') initGrid();
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // ===== FLOOR TYPE MANAGEMENT (LOẠI VỊ TRÍ) =====
    function renderFloorTypeCards() {
        var container = document.getElementById('floorTypeCardList');
        if (!container) return;
        
        var html = '';
        for (var i = 0; i < floorTypeData.length; i++) {
            var ft = floorTypeData[i];
            var isCollapsed = ft.collapsed ? ' collapsed' : '';
            
            html += '<div class="location-card' + isCollapsed + '" data-floor-type-id="' + ft.id + '">';
            html += '<div class="card-number-label-container"><span class="card-number-label">Loại vị trí ' + (i + 1) + '</span></div>';
            html += '<div class="location-card-body">';
            
            // Tên loại vị trí
            html += '<div class="location-field">';
            html += '<span class="location-field-label">Tên loại vị trí <span style="color: red;">*</span></span>';
            html += '<div class="location-field-value">';
            html += '<input type="text" value="' + escapeHtml(ft.name || '') + '" oninput="updateFloorTypeField(' + ft.id + ', \'name\', this.value)" placeholder="Ví dụ: Vị trí thường...">';
            html += '</div></div>';

            // Hình ảnh
            html += '<div class="location-field">';
            html += '<span class="location-field-label">Hình ảnh <span style="color: red;">*</span></span>';
            html += '<div class="location-field-value">';
            html += '<div class="floor-image-upload-box" onclick="triggerFloorTypeImageUpload(' + ft.id + ')">';
            html += '<input type="file" id="floorTypeImageInput-' + ft.id + '" accept="image/*" style="display:none;" onchange="handleFloorTypeImageUpload(' + ft.id + ', event)" />';
            if (ft.image) {
                html += '<img src="' + ft.image + '" style="width:100%; height:100%; object-fit:cover; border-radius:4px;" />';
            } else {
                html += '<i class="fas fa-plus" style="color: #8C8C8C; font-size: 14px;"></i>';
            }
            html += '</div></div></div>';
            
            html += '</div>'; // End location-card-body

            // Actions
            html += '<div class="area-card-actions">'; 
            html += '<button class="area-action-btn" onclick="editFloorTypeCard(' + ft.id + ')" title="Chỉnh sửa"><i class="fas fa-pen"></i></button>';
            html += '<button class="area-action-btn delete" onclick="deleteFloorType(' + ft.id + ')" title="Xóa"><i class="fas fa-trash-alt"></i></button>';
            html += '</div>';

            // Toggle collapse
            html += '<div class="location-toggle">';
            html += '<i class="fas fa-chevron-down" onclick="toggleFloorTypeCollapse(' + ft.id + ')"></i>';
            html += '</div>';
            
            html += '</div>'; // End location-card
        }
        container.innerHTML = html;
    }

    function addFloorType() {
        floorTypeData.push({
            id: floorTypeIdCounter++,
            name: '',
            neighborCell: '',
            image: '',
            collapsed: false
        });
        renderFloorTypeCards();
    }

    function deleteFloorType(id) {
        if (floorTypeData.length <= 1) {
            // Giữ ít nhất 1 cái như yêu cầu chung? Tuỳ, nhưng thường card list nên có nút xóa
            // alert('Phải có ít nhất một loại vị trí!');
            // return;
        }
        floorTypeData = floorTypeData.filter(function(ft) { return ft.id !== id; });
        renderFloorTypeCards();
    }

    function toggleFloorTypeCollapse(id) {
        for (var i = 0; i < floorTypeData.length; i++) {
            if (floorTypeData[i].id === id) {
                floorTypeData[i].collapsed = !floorTypeData[i].collapsed;
                break;
            }
        }
        renderFloorTypeCards();
    }

    function editFloorTypeCard(id) {
        for (var i = 0; i < floorTypeData.length; i++) {
            if (floorTypeData[i].id === id) {
                floorTypeData[i].collapsed = false;
                break;
            }
        }
        renderFloorTypeCards();
        var nameInput = document.querySelector('[data-floor-type-id="' + id + '"] input[type="text"]');
        if (nameInput) nameInput.focus();
    }

    function updateFloorTypeField(id, field, value) {
        for (var i = 0; i < floorTypeData.length; i++) {
            if (floorTypeData[i].id === id) {
                floorTypeData[i][field] = value;
                break;
            }
        }
    }

    function toggleFloorTypeDropdown(id) {
        var menu = document.querySelector('#floorTypeDropdown-' + id + ' .init-dropdown-menu');
        if (menu) {
            // Close others
            document.querySelectorAll('#tabContentFloor .init-dropdown-menu').forEach(function(m) {
                if (m !== menu) m.classList.remove('show');
            });
            menu.classList.toggle('show');
        }
    }

    function selectFloorTypeNeighbor(id, code) {
        for (var i = 0; i < floorTypeData.length; i++) {
            if (floorTypeData[i].id === id) {
                floorTypeData[i].neighborCell = code;
                break;
            }
        }
        renderFloorTypeCards();
    }

    function triggerFloorTypeImageUpload(id) {
        var input = document.getElementById('floorTypeImageInput-' + id);
        if (input) input.click();
    }

    function handleFloorTypeImageUpload(id, event) {
        var file = event.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(e) {
            for (var i = 0; i < floorTypeData.length; i++) {
                if (floorTypeData[i].id === id) {
                    floorTypeData[i].image = e.target.result;
                    break;
                }
            }
            renderFloorTypeCards();
        };
        reader.readAsDataURL(file);
    }


    /**
     * Set the current configuration tab (Khởi tạo, Khu vực, Vị trí)
     * @param {string} tab - The tab identifier
     * @param {HTMLElement} btn - The clicked button element
     */
    function setConfigTab(tab, btn) {
        // Save to localStorage
        localStorage.setItem('warehouse_config_active_tab', tab);

        // Update button UI
        var buttons = document.querySelectorAll('.segment-btn');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
        if (btn) btn.classList.add('active');
        
        // Hide all tab contents
        var tabContents = document.querySelectorAll('.tab-content');
        for (var i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }

        // Clear active selection states across all tabs
        activeAreaId = null;
        activeLocationId = null;
        
        // Show the matching tab content
        var configContent = document.querySelector('.config-content');
        if (configContent) {
            if (tab === 'init') {
                configContent.classList.add('grid-hidden');
            } else {
                configContent.classList.remove('grid-hidden');
            }
        }

        
        // Toggle header actions visibility based on tab (only show on area and location)
        var headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            if (tab === 'init') {
                headerActions.style.display = 'none';
            } else {
                headerActions.style.display = 'flex';
            }
        }


        // No inline display modifications here to avoid breaking grid-hidden logic

        if (tab === 'init') {
            var initTab = document.getElementById('tabContentInit');
            if (initTab) initTab.classList.add('active');
            renderFloorMenu();
            populateInitTab();
        } else if (tab === 'area') {
            var areaTab = document.getElementById('tabContentArea');
            if (areaTab) areaTab.classList.add('active');
            // Remove inline display modification: document.querySelector('.grid-area').style.display = 'flex';
            renderAreaCards();
        } else if (tab === 'location') {
            var locTab = document.getElementById('tabContentLocation');
            if (locTab) locTab.classList.add('active');
            // Remove inline display modification: document.querySelector('.grid-area').style.display = 'flex';
            renderLocationCards();
        }
        
        // Refresh grid visualization to show all assigned areas/locations
        if (tab === 'area' || tab === 'location') {
            initGrid(); // Ensure grid is rendered
            refreshVisuals();
        }
    }

    // ===== KHAI BÁO TAB LOGIC =====
    var equipmentData = [
        { group: 'Lifter',        items: ['LIFT-001', 'LIFT-002', 'LIFT-003'] },
        { group: 'Transfer',      items: ['TRANS-001', 'TRANS-002', 'TRANS-003'] },
        { group: 'Stacker Crane', items: ['STACKER-001', 'STACKER-002', 'STACKER-003'] },
        { group: 'AMR',           items: ['AMR-001', 'AMR-002', 'AMR-003'] }
    ];

    // equipmentAssignment: { 'LIFT-001': 'nhap' | 'xuat' | 'danang' }
    var equipmentAssignment = {};
    var eqFilterMode = 'all';
    var EQ_LABELS = { nhap: 'Nhập', xuat: 'Xuất', danang: 'Đa năng' };
    var EQ_FULL_LABELS = { nhap: 'Thiết bị nhập', xuat: 'Thiết bị xuất', danang: 'Thiết bị đa năng' };

    // ---- LocalStorage ----
    function saveEqAssignmentToStorage() {
        if (!currentWarehouseId) return;
        try { localStorage.setItem('wms_eq_assign_v1_' + currentWarehouseId, JSON.stringify(equipmentAssignment)); } catch(e) {}
    }
    function loadEqAssignmentFromStorage() {
        if (!currentWarehouseId) return;
        try {
            var raw = localStorage.getItem('wms_eq_assign_v1_' + currentWarehouseId);
            if (raw) { equipmentAssignment = JSON.parse(raw); }
            else if (currentWarehouse && currentWarehouse.equipmentAssignment) { equipmentAssignment = currentWarehouse.equipmentAssignment; }
            else { equipmentAssignment = {}; }
        } catch(e) { equipmentAssignment = {}; }
    }

    // ---- Filter ----
    function setEqFilter(mode, btn) {
        eqFilterMode = mode;
        document.querySelectorAll('.eq-filter-btn').forEach(function(b) { b.classList.remove('active'); });
        if (btn) btn.classList.add('active');
        renderEqDeviceList();
    }
    function filterEqList() { renderEqDeviceList(); }

    // ---- Assign type ----
    function assignEqType(item, type) {
        if (equipmentAssignment[item] === type) { delete equipmentAssignment[item]; }
        else { equipmentAssignment[item] = type; }
        saveEqAssignmentToStorage();
        renderEqDeviceList();
        renderEqSummaryAccordion();
    }

    // ---- Render device list ----
    function renderEqDeviceList() {
        var container = document.getElementById('eqDeviceList');
        if (!container) return;
        var searchEl = document.getElementById('eqSearchInput');
        var searchTerm = searchEl ? searchEl.value.toLowerCase().trim() : '';
        var html = '';

        // Check if all items in a group are selected
        function isGroupSelected(groupItems) {
            if (groupItems.length === 0) return false;
            return groupItems.every(function(item) { return selectedEqCodes[item]; });
        }

        equipmentData.forEach(function(group, groupIdx) {
            var filteredItems = group.items.filter(function(item) {
                if (searchTerm && item.toLowerCase().indexOf(searchTerm) === -1) return false;
                var assigned = equipmentAssignment[item] || null;
                if (eqFilterMode === 'all') return true;
                if (eqFilterMode === 'unset') return !assigned;
                return assigned === eqFilterMode;
            });
            if (filteredItems.length === 0) return;

            var groupChecked = isGroupSelected(filteredItems);
            html += '<div class="eq-group-header">';
            html += '<input type="checkbox" class="eq-group-checkbox" ' + (groupChecked ? 'checked' : '') + ' onclick="toggleEqGroupSelection(' + groupIdx + ', this.checked)">';
            html += group.group + ' <span class="eq-group-count">' + filteredItems.length + '</span></div>';
            
            filteredItems.forEach(function(item) {
                var assigned = equipmentAssignment[item] || null;
                var isChecked = selectedEqCodes[item] ? 'checked' : '';
                html += '<div class="eq-device-row">';
                html += '<input type="checkbox" class="eq-device-checkbox" ' + isChecked + ' onclick="toggleEqSelection(\'' + item + '\', this.checked)">';
                html += '<span class="eq-device-code" style="flex: 1;">' + item + '</span>';
                html += '<div class="eq-type-pills">';
                ['nhap', 'xuat', 'danang'].forEach(function(type) {
                    var isActive = assigned === type;
                    html += '<button class="eq-type-pill eq-pill-' + type + (isActive ? ' active' : '') + '" onclick="assignEqType(\'' + item + '\', \'' + type + '\')">' + EQ_LABELS[type] + '</button>';
                });
                html += '</div></div>';
            });
        });

        if (!html) html = '<div class="eq-empty">Không tìm thấy thiết bị phù hợp</div>';
        container.innerHTML = html;
    }

    window.toggleEqSelection = function(code, checked) {
        if (checked) selectedEqCodes[code] = true;
        else delete selectedEqCodes[code];
        renderEqDeviceList();
    };

    window.toggleEqGroupSelection = function(groupIdx, checked) {
        var group = equipmentData[groupIdx];
        if (group) {
            group.items.forEach(function(item) {
                if (checked) selectedEqCodes[item] = true;
                else delete selectedEqCodes[item];
            });
        }
        renderEqDeviceList();
    };

    // ---- Floor Assignment Logic ----
    window.toggleFloorAssignDropdown = function() {
        var menu = document.getElementById('floorAssignMenu');
        if (menu) menu.classList.toggle('show');
    };

    window.selectFloorAssign = function(val, text) {
        currentAssignFloor = val;
        var display = document.getElementById('floorAssignDisplay');
        if (display) display.innerText = text;
        var menu = document.getElementById('floorAssignMenu');
        if (menu) menu.classList.remove('show');
    };

    function populateFloorAssignDropdown() {
        var menu = document.getElementById('floorAssignMenu');
        if (!menu) return;
        
        var floors = (currentWarehouse && currentWarehouse.floors) ? parseInt(currentWarehouse.floors) : 1;
        var html = '<div class="init-dropdown-item' + (currentAssignFloor === 'all' ? ' active' : '') + '" onclick="selectFloorAssign(\'all\', \'Toàn kho\')">Toàn kho</div>';
        
        for (var i = 1; i <= floors; i++) {
            html += '<div class="init-dropdown-item' + (currentAssignFloor == i ? ' active' : '') + '" onclick="selectFloorAssign(' + i + ', \'Tầng ' + i + '\')">Tầng ' + i + '</div>';
        }
        menu.innerHTML = html;
    }

    window.bulkAssignFloor = function() {
        var codes = Object.keys(selectedEqCodes);
        if (codes.length === 0) {
            alert('Vui lòng chọn thiết bị để gán!');
            return;
        }

        if (currentAssignFloor === 'all') {
            for (var f in floorConfigs) {
                if (!floorConfigs[f].equipments) floorConfigs[f].equipments = [];
                codes.forEach(function(c) {
                    if (floorConfigs[f].equipments.indexOf(c) === -1) {
                        floorConfigs[f].equipments.push(c);
                    }
                });
            }
        } else {
            var f = currentAssignFloor;
            if (!floorConfigs[f]) floorConfigs[f] = { rows: 18, cols: 27, selected: {}, goods: {}, equipments: [] };
            if (!floorConfigs[f].equipments) floorConfigs[f].equipments = [];
            codes.forEach(function(c) {
                if (floorConfigs[f].equipments.indexOf(c) === -1) {
                    floorConfigs[f].equipments.push(c);
                }
            });
        }

        if (window.showToast) window.showToast('Đã gán thiết bị thành công!', 'success');
        else alert('Đã gán thiết bị thành công!');
        renderEqSummaryAccordion();
    };

    window.bulkUnassignFloor = function() {
        var codes = Object.keys(selectedEqCodes);
        if (codes.length === 0) {
            alert('Vui lòng chọn thiết bị để bỏ gán!');
            return;
        }

        if (currentAssignFloor === 'all') {
            for (var f in floorConfigs) {
                if (floorConfigs[f].equipments) {
                    floorConfigs[f].equipments = floorConfigs[f].equipments.filter(function(c) {
                        return codes.indexOf(c) === -1;
                    });
                }
            }
        } else {
            var f = currentAssignFloor;
            if (floorConfigs[f] && floorConfigs[f].equipments) {
                floorConfigs[f].equipments = floorConfigs[f].equipments.filter(function(c) {
                    return codes.indexOf(c) === -1;
                });
            }
        }

        if (window.showToast) window.showToast('Đã bỏ gán thiết bị thành công!', 'success');
        else alert('Đã bỏ gán thiết bị thành công!');
        renderEqSummaryAccordion();
    };



    // ---- Render summary accordion ----
    function renderEqSummaryAccordion() {
        var container = document.getElementById('eqSummaryAccordion');
        if (!container) return;
        
        // Find floors that actually have equipment
        var floorsWithEq = [];
        for (var f in floorConfigs) {
            if (floorConfigs[f].equipments && floorConfigs[f].equipments.length > 0) {
                floorsWithEq.push(f);
            }
        }
        
        // Sort floors numerically
        floorsWithEq.sort(function(a, b) { return parseInt(a) - parseInt(b); });

        if (floorsWithEq.length === 0) { 
            container.innerHTML = ''; 
            return; 
        }

        var html = '<div class="eq-summary-title">DANH SÁCH THIẾT BỊ THEO TẦNG</div>';
        
        floorsWithEq.forEach(function(f) {
            var floorItems = floorConfigs[f].equipments;
            var floorLabel = (f === 'all' || f === 'Toàn kho') ? 'Toàn kho' : 'Tầng ' + f;
            
            html += '<div class="eq-sum-group">';
            html += '<div class="eq-sum-header" onclick="toggleEqSumGroup(\'' + f + '\')">';
            html += '<div class="eq-sum-header-left">';
            html += '<i class="fas fa-chevron-down eq-sum-chevron" id="eq-sum-chev-' + f + '"></i>';
            html += '<span class="eq-sum-label">' + floorLabel + '</span>';
            html += '<span class="eq-sum-count">' + floorItems.length + '</span>';
            html += '</div></div>';
            
            html += '<div class="eq-sum-items" id="eq-sum-items-' + f + '">';
            floorItems.forEach(function(item) {
                var type = equipmentAssignment[item] || 'unset';
                var typeLabel = EQ_LABELS[type] || 'Chưa gán';
                
                html += '<div class="eq-sum-item" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px;">';
                html += '  <div style="display: flex; align-items: center; gap: 8px;">';
                html += '    <span class="eq-sum-bullet"></span>';
                html += '    <span class="eq-sum-item-name" style="font-weight: 500;">' + item + '</span>';
                if (type !== 'unset') {
                    html += '    <span class="eq-badge eq-badge-' + type + '" style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: ' + (type === 'nhap' ? '#fff7ed' : type === 'xuat' ? '#f0fdf4' : '#eff6ff') + '; color: ' + (type === 'nhap' ? '#c2410c' : type === 'xuat' ? '#15803d' : '#1d4ed8') + '; border: 1px solid currentColor;">' + typeLabel + '</span>';
                }
                html += '  </div>';
                html += '  <button class="eq-sum-remove" onclick="unassignEqFromFloor(\'' + f + '\', \'' + item + '\')" title="Bỏ gán" style="background: none; border: none; color: #94a3b8; cursor: pointer;"><i class="fas fa-times"></i></button>';
                html += '</div>';
            });
            html += '</div></div>';
        });
        container.innerHTML = html;
    }


    function toggleEqSumGroup(id) {
        var items = document.getElementById('eq-sum-items-' + id);
        var chev = document.getElementById('eq-sum-chev-' + id);
        if (items) items.classList.toggle('collapsed');
        if (chev) chev.classList.toggle('rotated');
    }

    window.unassignEqFromFloor = function(floor, item) {
        if (floorConfigs[floor] && floorConfigs[floor].equipments) {
            floorConfigs[floor].equipments = floorConfigs[floor].equipments.filter(function(c) { return c !== item; });
            renderEqSummaryAccordion();
            if (window.showToast) window.showToast('Đã gán thiết bị khỏi tầng!', 'success');
        }
    };

    window.toggleEqSumGroup = toggleEqSumGroup;


    // ---- backward-compat shims ----
    var selectedEquipments = [];
    var selectedEquipments2 = [];
    function renderSelectedEquipment(suffix) {}
    function showEquipmentList(s) {}
    function toggleEquipmentList(s) {}
    function filterEquipmentList(s) {}
    function selectEquipment(item, s) {}
    function removeEquipment(idx, s) {}
    function renderEquipmentAccordion(s) {}
    function toggleAccordionGroup(idx, s) {}

    var warehouseType = 'Kho Tower';

    var productData = [
        { 
            group: 'Kim khí & Sản phẩm phụ', 
            items: [
                { code: 'KK-001', name: 'Bulong Inox 304 M8x20', quyTac: 'FIFO' },
                { code: 'KK-002', name: 'Đai ốc M8', quyTac: 'FIFO' },
                { code: 'KK-003', name: 'Vít tự khoan', quyTac: 'FEFO' },
                { code: 'KK-004', name: 'Nẹp nhôm chữ V', quyTac: 'LIFO' }
            ] 
        },
        { 
            group: 'Dụng cụ cắt gọt', 
            items: [
                { code: 'DC-001', name: 'Mũi khoan bê tông 8mm', quyTac: 'FIFO' },
                { code: 'DC-002', name: 'Lưỡi cưa sắt', quyTac: 'FIFO' },
                { code: 'DC-003', name: 'Mũi phay ngón 10mm', quyTac: 'FEFO' },
                { code: 'DC-004', name: 'Đá mài Hải Dương', quyTac: 'LIFO' }
            ] 
        },
        { 
            group: 'Dụng cụ cầm tay', 
            items: [
                { code: 'CT-001', name: 'Kìm cắt Stanley', quyTac: 'FIFO' },
                { code: 'CT-002', name: 'Mỏ lết 10 inch', quyTac: 'FIFO' },
                { code: 'CT-003', name: 'Tua vít bake PH2', quyTac: 'LIFO' }
            ] 
        },
        { 
            group: 'Sản phẩm Hàn', 
            items: [
                { code: 'VH-001', name: 'Que hàn Kim Tín 3.2mm', quyTac: 'FIFO' },
                { code: 'VH-002', name: 'Kính hàn điện tử', quyTac: 'FEFO' },
                { code: 'VH-003', name: 'Máy hàn Inverter 200A', quyTac: 'LIFO' }
            ] 
        }
    ];

    function populateInitTab() {
        if (!currentWarehouse) return;
        var codeEl = document.getElementById('initWarehouseCode');
        var nameEl = document.getElementById('initWarehouseName');
        var floorsEl = document.getElementById('initWarehouseFloors');
        var lengthEl = document.getElementById('initWarehouseLength');
        var widthEl = document.getElementById('initWarehouseWidth');
        if (codeEl) codeEl.value = currentWarehouse.code || '';
        if (nameEl) nameEl.value = currentWarehouse.name || '';
        if (floorsEl) floorsEl.value = currentWarehouse.floors || '';
        // Use floorConfigs as source of truth for dimensions (synced with grid)
        var config = floorConfigs[currentFloor];
        if (lengthEl) lengthEl.value = config ? config.cols : (currentWarehouse.warehouseLength || 27);
        if (widthEl) widthEl.value = config ? config.rows : (currentWarehouse.warehouseWidth || 18);
        // Restore type
        if (currentWarehouse.warehouseType) {
            warehouseType = currentWarehouse.warehouseType;
        }
        
        // Migrate old default to new default
        if (warehouseType === 'Kho nhập xuất' || !warehouseType) {
            warehouseType = 'Kho Tower';
        }

        var typeDisplay = document.getElementById('initWarehouseTypeDisplay');
        if (typeDisplay) typeDisplay.textContent = warehouseType;
        
        // Disable dropdown toggle
        var typeToggle = document.querySelector('#initWarehouseTypeDropdown .init-dropdown-toggle');
        if (typeToggle) typeToggle.classList.add('disabled');
        
        // Restore equipment assignments (new system)
        loadEqAssignmentFromStorage();
        renderEqDeviceList();
        renderEqSummaryAccordion();
        populateFloorAssignDropdown();
    }


    function toggleInitTypeDropdown() {
        var toggle = document.querySelector('#initWarehouseTypeDropdown .init-dropdown-toggle');
        if (toggle && toggle.classList.contains('disabled')) return;
        
        var menu = document.getElementById('initWarehouseTypeMenu');
        if (menu) menu.classList.toggle('show');
    }

    function selectInitType(value) {
        warehouseType = value;
        var display = document.getElementById('initWarehouseTypeDisplay');
        if (display) display.textContent = value;
        var menu = document.getElementById('initWarehouseTypeMenu');
        if (menu) menu.classList.remove('show');
    }

    function renderSelectedEquipment(suffix) {
        var container = document.getElementById('initSelectedEquipment' + suffix);
        if (!container) return;
        var html = '';
        var currentSelected = (suffix === '2') ? selectedEquipments2 : selectedEquipments;
        
        currentSelected.forEach(function(item, idx) {
            html += '<span class="equipment-tag">' + item;
            html += ' <i class="fas fa-times" onclick="removeEquipment(' + idx + ', \'' + suffix + '\')"></i>';
            html += '</span>';
        });
        container.innerHTML = html;
        
        // Refresh the dropdown if open to show checks
        var list = document.getElementById('initEquipmentList' + suffix);
        if (list && list.classList.contains('show')) {
            var input = document.getElementById('initEquipmentSearch' + suffix);
            if (input && input.value.trim() === '') {
                renderEquipmentAccordion(suffix);
            } else {
                filterEquipmentList(suffix);
            }
        }
    }

    function removeEquipment(idx, suffix) {
        if (suffix === '2') {
            selectedEquipments2.splice(idx, 1);
        } else {
            selectedEquipments.splice(idx, 1);
        }
        renderSelectedEquipment(suffix);
    }

    function toggleEquipmentList(suffix) {
        var list = document.getElementById('initEquipmentList' + suffix);
        if (list) {
            var isShowing = list.classList.toggle('show');
            if (isShowing) {
                var input = document.getElementById('initEquipmentSearch' + suffix);
                if (input && input.value.trim() === '') {
                    renderEquipmentAccordion(suffix);
                } else {
                    filterEquipmentList(suffix);
                }
            }
        }
    }

    function showEquipmentList(suffix) {
        var list = document.getElementById('initEquipmentList' + suffix);
        if (list) {
            list.classList.add('show');
            var input = document.getElementById('initEquipmentSearch' + suffix);
            if (input && input.value.trim() === '') {
                renderEquipmentAccordion(suffix);
            } else {
                filterEquipmentList(suffix);
            }
        }
    }

    function filterEquipmentList(suffix) {
        var input = document.getElementById('initEquipmentSearch' + suffix);
        var list = document.getElementById('initEquipmentList' + suffix);
        if (!input || !list) return;

        var term = input.value.toLowerCase();
        if (term.trim() === '') {
            renderEquipmentAccordion(suffix);
            return;
        }

        var allItems = [];
        equipmentData.forEach(function(g) {
            g.items.forEach(function(item) {
                if (item.toLowerCase().includes(term)) {
                    allItems.push(item);
                }
            });
        });

        if (allItems.length === 0) {
            list.innerHTML = '<div class="item">Không tìm thấy thiết bị</div>';
        } else {
            var currentSelected = (suffix === '2') ? selectedEquipments2 : selectedEquipments;
            list.innerHTML = allItems.map(function(item) {
                var isSelected = currentSelected.includes(item);
                return '<div class="item ' + (isSelected ? 'selected' : '') + '" onclick="selectEquipment(\'' + item + '\', \'' + suffix + '\')">' + 
                       item + 
                       (isSelected ? ' <i class="fas fa-check" style="color: #076EB8; margin-left: 8px;"></i>' : '') +
                       '</div>';
            }).join('');
        }
    }

    function selectEquipment(item, suffix) {
        var currentSelected = (suffix === '2') ? selectedEquipments2 : selectedEquipments;
        if (!currentSelected.includes(item)) {
            currentSelected.push(item);
        } else {
            // Toggle off if already selected in the dropdown
            var idx = currentSelected.indexOf(item);
            if (idx > -1) currentSelected.splice(idx, 1);
        }
        renderSelectedEquipment(suffix);
        
        // Do not hide list to allow multiple selection
    }

    function renderEquipmentAccordion(suffix) {
        var container = document.getElementById('initEquipmentList' + suffix);
        if (!container) return;

        var currentSelected = (suffix === '2') ? selectedEquipments2 : selectedEquipments;

        var html = '<div class="init-equipment-accordion" style="border:none; border-radius:0;">' + 
            equipmentData.map(function(group, gIdx) {
                var itemsHtml = group.items.map(function(item) {
                    var isSelected = currentSelected.includes(item);
                    return '<div class="accordion-item ' + (isSelected ? 'selected' : '') + '" onclick="selectEquipment(\'' + item + '\', \'' + suffix + '\'); event.stopPropagation();">' +
                           '<span>' + item + '</span>' +
                           (isSelected ? '<i class="fas fa-check" style="color: #076EB8; font-size: 10px;"></i>' : '') +
                           '</div>';
                }).join('');

                return '<div class="accordion-group open" id="group-' + suffix + '-' + gIdx + '">' +
                       '<div class="accordion-header" onclick="toggleAccordionGroup(' + gIdx + ', \'' + suffix + '\'); event.stopPropagation();">' +
                       '<span>' + group.group + '</span>' +
                       '<i class="fas fa-chevron-down"></i>' +
                       '</div>' +
                       '<div class="accordion-content" style="display:block;">' + itemsHtml + '</div>' +
                       '</div>';
            }).join('') +
            '</div>';

        container.innerHTML = html;
    }

    function toggleAccordionGroup(idx, suffix) {
        var group = document.getElementById('group-' + suffix + '-' + idx);
        if (group) group.classList.toggle('open');
    }

    // Floor Dropdown Logic
    function toggleFloorDropdown() {
        var menu = document.getElementById('floorCustomMenu');
        if (menu) menu.classList.toggle('show');
    }

    function selectFloor(floorNum) {
        currentFloor = floorNum;
        
        // Sync displays
        var headerDisplay = document.getElementById('currentFloorDisplay');
        if (headerDisplay) headerDisplay.innerText = 'Tầng ' + floorNum;

        var headerMenu = document.getElementById('floorCustomMenu');
        if (headerMenu) headerMenu.classList.remove('show');

        renderFloorMenu(); // Update active state in menu
        initGrid();
    }


    // Save Khai báo tab data
    function saveInitTab() {
        if (!currentWarehouse) {
            alert('Chưa chọn kho để lưu!');
            return;
        }

        var codeEl = document.getElementById('initWarehouseCode');
        var nameEl = document.getElementById('initWarehouseName');
        var floorsEl = document.getElementById('initWarehouseFloors');
        var lengthEl = document.getElementById('initWarehouseLength');
        var widthEl = document.getElementById('initWarehouseWidth');

        if (codeEl) currentWarehouse.code = codeEl.value;
        if (nameEl) currentWarehouse.name = nameEl.value;
        if (floorsEl) currentWarehouse.floors = parseInt(floorsEl.value) || 1;
        if (lengthEl) currentWarehouse.warehouseLength = parseInt(lengthEl.value) || 27;
        if (widthEl) currentWarehouse.warehouseWidth = parseInt(widthEl.value) || 18;
        currentWarehouse.warehouseType = warehouseType;
        currentWarehouse.equipmentAssignment = equipmentAssignment;
        saveEqAssignmentToStorage();

        currentWarehouse.configData = floorConfigs; // Save grid config

        // Save to localStorage
        try {
            var stored = localStorage.getItem('wms_warehouses_v6');
            if (stored) {
                var list = JSON.parse(stored);
                var idx = list.findIndex(function(w) { return w.id === currentWarehouseId; });
                if (idx !== -1) {
                    list[idx] = currentWarehouse;
                    localStorage.setItem('wms_warehouses_v6', JSON.stringify(list));
                }
            }
        } catch (e) {
            alert('Lỗi lưu khai báo: ' + e.message);
            return;
        }

        // Update header
        var header = document.querySelector('.config-header h3');
        if (header) {
            header.innerText = 'Thiết lập cấu hình Kho: ' + (currentWarehouse.code ? currentWarehouse.code + ' - ' : '') + currentWarehouse.name;
        }

        if (window.showToast) {
            window.showToast('Đã lưu thông tin khai báo thành công!', 'success');
        } else {
            alert('Đã lưu thông tin khai báo thành công!');
        }
    }

    // ===== AREA MANAGEMENT =====
    
    // Area data (initialized statically or in loadContext)
    var areaData = [];
    var areaIdCounter = 1;

    // Mock Area Type Data
    var areaTypeData = [
        { id: 1, code: 'LKV01', name: 'Khu vực Chung' },
        { id: 2, code: 'LKV02', name: 'Khu vực Lưu trữ' },
        { id: 3, code: 'LKV03', name: 'Khu vực Nhập hàng' },
        { id: 4, code: 'LKV04', name: 'Khu vực Xuất hàng' },
        { id: 5, code: 'LKV05', name: 'Khu vực Lỗi' }
    ];

    /**
     * Render area cards into the area card list
     */
    function renderAreaCards() {
        var container = document.getElementById('areaCardList');
        if (!container) return;
        
        var html = '';
        for (var i = 0; i < areaData.length; i++) {
            var area = areaData[i];
            var isCollapsed = area.collapsed ? ' collapsed' : '';
            var isActive = (activeAreaId === area.id) ? ' active' : '';
            var isReadonly = (activeAreaId !== area.id) ? ' readonly' : '';
            
            html += '<div class="area-card' + isCollapsed + isActive + isReadonly + '" data-area-id="' + area.id + '">';
            html += '<div class="card-number-label-container"><span class="card-number-label">Khu vực ' + (i + 1) + '</span></div>';
            html += '<div class="area-card-body">';

            // Loại khu vực (Searchable combobox)
            var selectedAreaType = area.selectedAreaType || null;
            var displayType = selectedAreaType ? '[' + selectedAreaType.code + '] ' + selectedAreaType.name : '';
            var hasTypeSelection = selectedAreaType ? ' has-selection' : '';

            html += '<div class="init-info-row init-equipment-section" style="padding: 0;">';
            html += '<label class="area-field-label" style="padding-top: 10px; width: 100px;">Loại khu vực<span style="color: red;">*</span></label>';
            html += '<div class="init-equipment-container" style="flex: 1;">';
            html += '  <div class="init-equipment-search-wrapper' + hasTypeSelection + '">';
            html += '    <div class="init-equipment-search">';
            html += '      <i class="fas fa-search search-icon"></i>';
            html += '      <input type="text" id="areaTypeSearch-' + area.id + '" value="' + displayType + '" placeholder="Tìm theo mã hoặc tên loại..." onfocus="showAreaTypeList(' + area.id + ')" oninput="filterAreaTypeList(' + area.id + ')" ' + (isReadonly ? 'disabled' : '') + ' ' + (selectedAreaType ? 'readonly' : '') + '>';
            
            if (selectedAreaType && !isReadonly) {
                html += '      <i class="fas fa-times clear-icon" title="Xóa" onclick="removeAreaType(' + area.id + ')"></i>';
            }
            html += '      <i class="fas fa-chevron-down toggle-icon" onclick="' + (isReadonly ? '' : 'toggleAreaTypeList(' + area.id + ')') + '"></i>';
            html += '    </div>';
            html += '    <div class="init-equipment-list" id="areaTypeList-' + area.id + '" style="max-height: 200px; overflow-y: auto;"></div>';
            html += '  </div>';
            html += '</div>';
            html += '</div>';
            
            // Mã khu vực
            html += '<div class="area-field area-code">';
            html += '<span class="area-field-label">Mã khu vực</span>';
            html += '<div class="area-field-value">';
            html += '<input type="text" value="' + escapeHtml(area.code || '') + '" onchange="updateAreaField(' + area.id + ', \'code\', this.value)" placeholder="Nhập mã khu vực..." ' + (isReadonly ? 'disabled' : '') + '>';
            html += '</div></div>';
            
            // Tên khu vực
            html += '<div class="area-field">';
            html += '<span class="area-field-label">Tên khu vực<span style="color: red;">*</span></span>';
            html += '<div class="area-field-value">';
            html += '<input type="text" value="' + escapeHtml(area.name || '') + '" onchange="updateAreaField(' + area.id + ', \'name\', this.value)" placeholder="Nhập tên khu vực..." ' + (isReadonly ? 'disabled' : '') + '>';
            html += '</div></div>';
            
            // Màu sắc (Compact Edition)
            var colorType = area.colorType || 'default';
            html += '<div class="area-field" style="align-items: center; display: none;">';
            html += '<span class="area-field-label" style="padding-top: 0;">Màu sắc</span>';
            html += '<div class="area-field-value">';
            html += '<div class="area-color-options" style="display: flex; align-items: center; gap: 15px;">';
            
            // Default Option
            html += '<label class="color-option-item" style="display: flex; align-items: center; gap: 4px; margin: 0; cursor: pointer;">';
            html += '<input type="radio" name="areaColorType-' + area.id + '" value="default" ' + (colorType === 'default' ? 'checked' : '') + ' onchange="updateAreaField(' + area.id + ', \'colorType\', \'default\')" ' + (isReadonly ? 'disabled' : '') + ' style="margin: 0;">';
            html += '<span style="font-size: 13px;">Mặc định</span>';
            html += '</label>';
            
            // Custom Option
            html += '<label class="color-option-item" style="display: flex; align-items: center; gap: 4px; margin: 0; cursor: pointer;">';
            html += '<input type="radio" name="areaColorType-' + area.id + '" value="custom" ' + (colorType === 'custom' ? 'checked' : '') + ' onchange="updateAreaField(' + area.id + ', \'colorType\', \'custom\')" ' + (isReadonly ? 'disabled' : '') + ' style="margin: 0;">';
            html += '<span style="font-size: 13px;">Tùy chỉnh</span>';
            html += '</label>';
            
            // Compact Color Picker (only if custom is selected)
            if (colorType === 'custom') {
                html += '<input type="color" class="area-color-input" value="' + (area.color || '#38A0F0') + '" oninput="updateAreaField(' + area.id + ', \'color\', this.value)" ' + (isReadonly ? 'disabled' : '') + '>';
            }
            
            html += '</div></div></div>';
            
            // Check if selected type should display conditional fields
            var shouldShowConditionalFields = false;
            if (selectedAreaType && (selectedAreaType.code === 'LKV02' || selectedAreaType.code === 'LKV03' || selectedAreaType.code === 'LKV04')) {
                shouldShowConditionalFields = true;
            }

            var conditionalDisplay = shouldShowConditionalFields ? '' : ' style="display: none;"';

            // Sản phẩm (In-bar selection display)
            var selectedProduct = (area.selectedProducts && area.selectedProducts.length > 0) ? area.selectedProducts[0] : null;
            var displayValue = selectedProduct ? '[' + selectedProduct.code + '] ' + selectedProduct.name : '';
            var hasSelectionClass = selectedProduct ? ' has-selection' : '';

            html += '<div class="init-info-row init-equipment-section" style="padding: 0;' + (shouldShowConditionalFields ? '' : ' display: none;') + '">';
            html += '<label class="area-field-label" style="padding-top: 10px;">Sản phẩm <span style="color: red;">*</span></label>';
            html += '<div class="init-equipment-container">';
            html += '  <div class="init-equipment-search-wrapper' + hasSelectionClass + '">';
            html += '    <div class="init-equipment-search">';
            html += '      <i class="fas fa-search search-icon"></i>';
            html += '      <input type="text" id="areaProductSearch-' + area.id + '" value="' + displayValue + '" placeholder="Tìm theo mã hoặc tên sản phẩm..." onfocus="showAreaProductList(' + area.id + ')" oninput="filterAreaProductList(' + area.id + ')" ' + (isReadonly ? 'disabled' : '') + ' ' + (selectedProduct ? 'readonly' : '') + '>';
            
            if (selectedProduct) {
                var badgeClass = 'badge-' + (selectedProduct.quyTac || 'FIFO').toLowerCase();
                html += '      <span class="badge-spec ' + badgeClass + '">' + (selectedProduct.quyTac || 'FIFO') + '</span>';
            }

            if (selectedProduct && !isReadonly) {
                html += '      <i class="fas fa-times clear-icon" title="Xóa sản phẩm" onclick="removeAreaProduct(' + area.id + ', 0)"></i>';
            }
            html += '      <i class="fas fa-chevron-down toggle-icon" onclick="' + (isReadonly ? '' : 'toggleAreaProductList(' + area.id + ')') + '"></i>';
            html += '    </div>';
            html += '    <div class="init-equipment-list" id="areaProductList-' + area.id + '"></div>';
            html += '  </div>';
            html += '</div>';
            html += '</div>';
            
            // Vị trí (Quy cách field removed per user request)
            var areaPositionsCount = area.positions ? area.positions.length : 0;
            html += '<div class="area-field area-position">';
            html += '<span class="area-field-label">Vị trí<span style="color: red;">*</span></span>';
            html += '<div class="area-field-value">';
            html += '<label style="font-size: 13px; display: block; margin-bottom: 5px;">Đã chọn: <strong style="color: #076eb8">' + areaPositionsCount + '</strong> vị trí</label>';
            html += '<div class="area-tags" style="overflow-y: auto; max-height: 120px;">';
        if (area.positions && area.positions.length > 0) {
            for (var j = 0; j < area.positions.length; j++) {
                var pos = area.positions[j];
                html += '<span class="tag-item">' + pos + '<span class="tag-remove" onclick="' + (isReadonly ? '' : 'removeAreaTag(' + area.id + ', \'' + pos + '\')') + '">&times;</span></span>';
            }
        } else {
            html += '<span style="color: #9cb3c9; font-size: 13px; font-style: italic; display: inline-block; padding: 5px;">Chưa chọn vị trí nào</span>';
        }
        html += '</div></div></div>';

            // Sử dụng field (Below Vị trí)
            html += '<div class="area-field" style="align-items: center;">';
            html += '<span class="area-field-label" style="padding-top: 0;">Sử dụng<span style="color: red;">*</span></span>';
            html += '<div class="area-field-value">';
            html += '<label class="switch">';
            html += '<input type="checkbox" ' + (area.isActive !== false ? 'checked' : '') + ' onchange="toggleAreaActive(' + area.id + ', this.checked)" ' + (isReadonly ? 'disabled' : '') + '>';
            html += '<span class="slider"></span>';
            html += '</label>';
            html += '</div></div>';

        // Chiều nhập
        var directionOptions = [
            { value: '', label: 'Chọn chiều nhập' }, // Placeholder option
            { value: 'top-down', label: 'Trên xuống dưới' },
            { value: 'bottom-up', label: 'Dưới lên trên' },
            { value: 'left-right', label: 'Trái sang phải' },
            { value: 'right-left', label: 'Phải sang trái' }
        ];
        
        var currentDirectionLabel = 'Chọn chiều nhập';
            for (var d = 0; d < directionOptions.length; d++) {
                if (directionOptions[d].value === area.direction) {
                    currentDirectionLabel = directionOptions[d].label;
                    break;
                }
            }

            html += '<div class="area-field area-direction" style="' + (shouldShowConditionalFields ? '' : ' display: none;') + '">';
            html += '<span class="area-field-label">Chiều nhập<span style="color: red;">*</span></span>';
            html += '<div class="area-field-value">';
            html += '<div class="area-dropdown' + (isReadonly ? ' disabled' : '') + '" id="areaDirectionDropdown-' + area.id + '">';
            html += '<div class="area-dropdown-toggle" onclick="' + (isReadonly ? '' : 'toggleAreaDirectionDropdown(' + area.id + ')') + '">';
            html += '<span>' + currentDirectionLabel + '</span>';
            html += '<i class="fas fa-chevron-down" style="font-size: 12px; color: #8c8c8c"></i>';
            html += '</div>';
            html += '<div class="area-dropdown-menu">';
            for (var dIdx = 0; dIdx < directionOptions.length; dIdx++) {
                var opt = directionOptions[dIdx];
                if (opt.value === '') continue; // Skip placeholder in the list
                html += '<div class="area-dropdown-item' + (area.direction === opt.value ? ' selected' : '') + '" onclick="selectAreaDirection(' + area.id + ', \'' + opt.value + '\')">' + opt.label + '</div>';
            }
            html += '</div></div>';
            html += '</div></div>';
            
            html += '</div>'; // end area-card-body
            
            // Toggle link
            html += '<div class="area-toggle">';
            html += '<a onclick="toggleAreaCollapse(' + area.id + ')">' + (area.collapsed ? 'Hiện thêm' : 'Ẩn bớt') + '</a>';
            html += '</div>';
            
            // Actions
            html += '<div class="area-card-actions">';
            html += '<button class="area-action-btn edit" onclick="editArea(' + area.id + ')" title="Sửa"><i class="fas fa-pen"></i></button>';
            html += '<button class="area-action-btn delete" onclick="deleteArea(' + area.id + ')" title="Xóa"><i class="fas fa-trash-alt"></i></button>';
            
            html += '</div>'; // end area-card-actions
            
            html += '</div>'; // end area-card
        }
        
        container.innerHTML = html;

        // Post-render completed
    }

    /**
     * Handlers for Rule dropdown
     */
    function toggleAreaRuleDropdown(areaId) {
        var dropdowns = document.querySelectorAll('.area-dropdown');
        dropdowns.forEach(function(d) {
            if (d.id !== 'areaRuleDropdown-' + areaId) {
                d.classList.remove('open');
            }
        });
        
        var dropdown = document.getElementById('areaRuleDropdown-' + areaId);
        if (dropdown && !dropdown.classList.contains('disabled')) {
            dropdown.classList.toggle('open');
        }
    }

    function selectAreaRule(areaId, rule) {
        var area = areaData.find(function(a) { return a.id === areaId; });
        if (area) {
            area.rule = rule;
            renderAreaCards();
            var dropdown = document.getElementById('areaRuleDropdown-' + areaId);
            if (dropdown) dropdown.classList.remove('open');
            saveWarehouseConfig();
        }
    }

    /**
     * Add a new empty area
     */
    function addArea() {
        areaData.push({
            id: areaIdCounter++,
            areaCode: '',
            productType: '',
            selectedProducts: [],
            areaName: '',
            colorType: 'default',
            color: '#38A0F0',
            positions: [],
            direction: '',
            rule: 'FIFO',
            collapsed: false,
            isActive: true
        });
        renderAreaCards();
    }

    /**
     * Toggle area active state
     */
    window.toggleAreaActive = function(areaId, isActive) {
        for (var i = 0; i < areaData.length; i++) {
            if (areaData[i].id === areaId) {
                areaData[i].isActive = isActive;
                break;
            }
        }
        
        // Refresh grid visuals immediately
        refreshVisuals();
        
        // Visual feedback if needed
        if (window.showToast) {
            window.showToast((isActive ? 'Kích hoạt' : 'Ngưng') + ' sử dụng khu vực thành công', 'success');
        }
    };

    /**
     * Delete an area by ID
     */
    function deleteArea(areaId) {
        for (var i = 0; i < areaData.length; i++) {
            if (areaData[i].id === areaId) {
                areaData.splice(i, 1);
                break;
            }
        }
        if (areaData.length === 0) {
            addArea();
        } else {
            renderAreaCards();
        }
    }

    /**
     * Remove a position tag from an area
     */
    function removeAreaTag(areaId, position) {
        for (var i = 0; i < areaData.length; i++) {
            if (areaData[i].id === areaId) {
                var idx = areaData[i].positions.indexOf(position);
                if (idx > -1) {
                    areaData[i].positions.splice(idx, 1);
                    
                    // If this is the active area, also update the grid selection
                    if (activeAreaId === areaId) {
                        var config = floorConfigs[currentFloor];
                        // We need to find which node ID matches this position string
                        // e.g. "A1" -> "0-0"
                        var foundId = null;
                        for (var r = 0; r < config.rows; r++) {
                            for (var c = 0; c < config.cols; c++) {
                                if ((currentFloor + '-' + getColName(c) + (r + 1)) === position) {
                                    foundId = r + '-' + c;
                                    break;
                                }
                            }
                            if (foundId) break;
                        }
                        
                        if (foundId) {
                            removeSelection(config.selected, foundId);
                            refreshVisuals();
                        }
                    }
                }
                break;
            }
        }
        renderAreaCards();
    }

    /**
     * Toggle collapse/expand for an area card
     */
    function toggleAreaCollapse(areaId) {
        for (var i = 0; i < areaData.length; i++) {
            if (areaData[i].id === areaId) {
                areaData[i].collapsed = !areaData[i].collapsed;
                break;
            }
        }
        renderAreaCards();
    }

    /**
     * Update a field on an area
     */
    function updateAreaField(areaId, field, value) {
        for (var i = 0; i < areaData.length; i++) {
            if (areaData[i].id === areaId) {
                areaData[i][field] = value;
                break;
            }
        }
        renderAreaCards();
        // Refresh grid visuals if color details changed
        if (field === 'color' || field === 'colorType' || field === 'areaName') {
            refreshVisuals();
        }
    }

    // Helper to convert HEX to RGBA
    function hexToRgba(hex, alpha) {
        var r = 0, g = 0, b = 0;
        // 3 digits
        if (hex.length == 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        // 6 digits
        } else if (hex.length == 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        return "rgba(" + +r + "," + +g + "," + +b + "," + alpha + ")";
    }

    function toggleAreaProductList(areaId) {
        var list = document.getElementById('areaProductList-' + areaId);
        if (list) {
            var isShowing = list.classList.toggle('show');
            if (isShowing) {
                renderAreaProductAccordion(areaId);
            }
        }
    }

    window.showAreaTypeList = function(areaId) {
        var list = document.getElementById('areaTypeList-' + areaId);
        if (list) {
            list.classList.add('show');
            renderAreaTypeListHTML(areaId, areaTypeData);
        }
    }

    window.toggleAreaTypeList = function(areaId) {
        var list = document.getElementById('areaTypeList-' + areaId);
        if (list) {
            if (list.classList.contains('show')) {
                list.classList.remove('show');
            } else {
                showAreaTypeList(areaId);
            }
        }
    }

    window.filterAreaTypeList = function(areaId) {
        var input = document.getElementById('areaTypeSearch-' + areaId);
        var term = input ? input.value.toLowerCase().trim() : '';

        if (term === '') {
            renderAreaTypeListHTML(areaId, areaTypeData);
            return;
        }

        var results = areaTypeData.filter(function(item) {
            return (item.name && item.name.toLowerCase().indexOf(term) > -1) ||
                   (item.code && item.code.toLowerCase().indexOf(term) > -1);
        });
        
        renderAreaTypeListHTML(areaId, results);
    }

    function renderAreaTypeListHTML(areaId, listData) {
        var list = document.getElementById('areaTypeList-' + areaId);
        if (!list) return;

        if (listData.length === 0) {
            list.innerHTML = '<div style="padding: 10px; text-align: center; color: #64748b; font-size: 13px;">Không tìm thấy loại khu vực</div>';
            return;
        }

        var html = '';
        html += '<div class="init-equipment-items">';
        listData.forEach(function(item) {
            html += '<div class="init-equipment-item" onclick="selectAreaType(' + areaId + ', \'' + item.code + '\', \'' + item.name + '\')" style="padding: 8px 12px; cursor: pointer;">';
            html += '<div style="flex: 1">';
            html += '<div class="eq-name" style="font-weight: 500; color: #1e293b; font-size: 13px;">' + item.name + '</div>';
            html += '<div class="eq-code" style="color: #64748b; font-size: 11px;">' + item.code + '</div>';
            html += '</div></div>';
        });
        html += '</div>';
        
        list.innerHTML = html;
    }

    window.selectAreaType = function(areaId, code, name) {
        for (var i = 0; i < areaData.length; i++) {
            if (areaData[i].id === areaId) {
                areaData[i].selectedAreaType = { code: code, name: name };
                break;
            }
        }
        var list = document.getElementById('areaTypeList-' + areaId);
        if (list) list.classList.remove('show');
        renderAreaCards();
    }

    window.removeAreaType = function(areaId) {
        for (var i = 0; i < areaData.length; i++) {
            if (areaData[i].id === areaId) {
                areaData[i].selectedAreaType = null;
                break;
            }
        }
        renderAreaCards();
    }

    function showAreaProductList(areaId) {
        var list = document.getElementById('areaProductList-' + areaId);
        if (list) {
            list.classList.add('show');
            renderAreaProductAccordion(areaId);
        }
    }

    function filterAreaProductList(areaId) {
        var input = document.getElementById('areaProductSearch-' + areaId);
        var list = document.getElementById('areaProductList-' + areaId);
        if (!input || !list) return;

        var term = input.value.toLowerCase().trim();
        if (term === '') {
            renderAreaProductAccordion(areaId);
            return;
        }

        var results = [];
        productData.forEach(function(group) {
            group.items.forEach(function(item) {
                if (item.code.toLowerCase().includes(term) || item.name.toLowerCase().includes(term)) {
                    results.push(item);
                }
            });
        });

        if (results.length === 0) {
            list.innerHTML = '<div class="init-equipment-list"><div class="item">Không tìm thấy sản phẩm</div></div>';
        } else {
            var area = areaData.find(function(a) { return a.id === areaId; });
            var selectedCodes = (area && area.selectedProducts) ? area.selectedProducts.map(function(p){return p.code;}) : [];
            
            list.innerHTML = results.map(function(item) {
                var isSelected = selectedCodes.indexOf(item.code) > -1;
                var badgeClass = 'badge-' + (item.quyTac || 'FIFO').toLowerCase();
                return '<div class="item ' + (isSelected ? 'selected' : '') + '" onclick="selectAreaProduct(' + areaId + ', \'' + item.code + '\', \'' + item.name + '\')">' + 
                       '[' + item.code + '] ' + item.name + 
                       '<span class="badge-spec ' + badgeClass + '">' + (item.quyTac || 'FIFO') + '</span>' +
                       (isSelected ? ' <i class="fas fa-check" style="color: #076EB8; margin-left: 8px;"></i>' : '') +
                       '</div>';
            }).join('');
        }
    }

    function renderAreaProductAccordion(areaId) {
        var container = document.getElementById('areaProductList-' + areaId);
        if (!container) return;

        var area = areaData.find(function(a) { return a.id === areaId; });
        var selectedCodes = (area && area.selectedProducts) ? area.selectedProducts.map(function(p){return p.code;}) : [];

        var html = '<div class="init-equipment-accordion" style="border:none; border-radius:0;">' + 
            productData.map(function(group, gIdx) {
                var itemsHtml = group.items.map(function(item) {
                    var isSelected = selectedCodes.indexOf(item.code) > -1;
                    var badgeClass = 'badge-' + (item.quyTac || 'FIFO').toLowerCase();
                    return '<div class="accordion-item ' + (isSelected ? 'selected' : '') + '" style="display:flex;align-items:center;gap:6px;" onclick="selectAreaProduct(' + areaId + ', \'' + item.code + '\', \'' + item.name + '\'); event.stopPropagation();">' +
                           '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">[' + item.code + '] ' + item.name + '</span>' +
                           '<span class="badge-spec ' + badgeClass + '">' + (item.quyTac || 'FIFO') + '</span>' +
                           (isSelected ? '<i class="fas fa-check" style="color:#076EB8;font-size:10px;flex-shrink:0;margin-left:auto;"></i>' : '') +
                           '</div>';
                }).join('');

                return '<div class="accordion-group open" id="area-group-' + areaId + '-' + gIdx + '">' +
                       '<div class="accordion-header" onclick="toggleAreaGroup(' + areaId + ', ' + gIdx + '); event.stopPropagation();">' +
                       '<span>' + group.group + '</span>' +
                       '<i class="fas fa-chevron-down"></i>' +
                       '</div>' +
                       '<div class="accordion-content" style="display:block;">' + itemsHtml + '</div>' +
                       '</div>';
            }).join('') +
            '</div>';

        container.innerHTML = html;
    }

    function toggleAreaGroup(areaId, gIdx) {
        var group = document.getElementById('area-group-' + areaId + '-' + gIdx);
        if (group) group.classList.toggle('open');
    }

    function selectAreaProduct(areaId, code, name) {
        var area = areaData.find(function(a) { return a.id === areaId; });
        if (!area) return;
        
        if (!area.selectedProducts) area.selectedProducts = [];
        
        var existingIdx = -1;
        for (var i = 0; i < area.selectedProducts.length; i++) {
            if (area.selectedProducts[i].code === code) {
                existingIdx = i;
                break;
            }
        }

        if (existingIdx === -1) {
            var quyTac = '';
            productData.forEach(function(group) {
                group.items.forEach(function(item) {
                    if (item.code === code) quyTac = item.quyTac || '';
                });
            });
            // Single selection: Replace any existing choices
            area.selectedProducts = [{ code: code, name: name, quyTac: quyTac }];
            // Automatically update area rule based on product specification
            if (quyTac) {
                area.rule = quyTac;
            }
        }
        
        renderAreaCards(); // Re-render to show selection in bar
        if (typeof saveWarehouseConfig === 'function') {
            saveWarehouseConfig();
        }
    }


    function removeAreaProduct(areaId, idx) {
        var area = areaData.find(function(a) { return a.id === areaId; });
        if (area && area.selectedProducts) {
            area.selectedProducts.splice(idx, 1);
            renderAreaCards();
        }
    }

    function toggleAreaDirectionDropdown(areaId) {
        var dropdown = document.getElementById('areaDirectionDropdown-' + areaId);
        if (dropdown) {
            var menu = dropdown.querySelector('.area-dropdown-menu');
            if (menu) {
                // Close other area dropdowns first
                var allMenus = document.querySelectorAll('.area-dropdown-menu');
                allMenus.forEach(function(m) {
                    if (m !== menu) m.classList.remove('show');
                });
                menu.classList.toggle('show');
            }
        }
    }

    function selectAreaDirection(areaId, value) {
        updateAreaField(areaId, 'direction', value);
    }

    /**
     * Edit area (placeholder - can be extended)
     */
    function editArea(areaId) {
        activeAreaId = areaId;
        activeLocationId = null; // Clear location conflict
        
        // Find the area
        var area = null;
        for (var i = 0; i < areaData.length; i++) {
            if (areaData[i].id === areaId) {
                area = areaData[i];
                break;
            }
        }
        
        if (area) {
            var config = floorConfigs[currentFloor];
            // Clear current selection
            config.selected = {};
            
            // Load types from tags back to selection
            // Positions are stored as "floor-ColRow" (e.g. "1-A1") or legacy "ColRow" (e.g. "A1")
            area.positions.forEach(function(pos) {
                for (var r = 0; r < config.rows; r++) {
                    for (var c = 0; c < config.cols; c++) {
                        var cellLabel = getColName(c) + (r + 1);
                        var cellLabelWithFloor = currentFloor + '-' + cellLabel;
                        if (cellLabelWithFloor === pos || cellLabel === pos) {
                            addSelection(config.selected, r + '-' + c);
                            break;
                        }
                    }
                }
            });
            refreshVisuals();
            renderAreaCards();
        }
    }

    function saveAreaTab() {
        if (!currentWarehouse) {
            alert('Chưa chọn kho để lưu!');
            return;
        }

        // Final sync: Ensure current selection is reflected in areaData before saving
        if (activeAreaId) {
            var config = floorConfigs[currentFloor];
            if (config) {
                var areaIdx = areaData.findIndex(function(a) { return a.id === activeAreaId; });
                if (areaIdx !== -1) {
                    areaData[areaIdx].positions = getSelectionKeys(config.selected).sort().map(function(id) {
                        var pts = id.split('-').map(Number);
                        return getColName(pts[1]) + (pts[0] + 1);
                    });
                }
            }
        }

        // Save current areaData to warehouse object
        currentWarehouse.areas = JSON.parse(JSON.stringify(areaData));

        // Save to localStorage
        try {
            var stored = localStorage.getItem('wms_warehouses_v6');
            // ...
            if (stored) {
                var list = JSON.parse(stored);
                var idx = list.findIndex(function(w) { return w.id === currentWarehouseId; });
                if (idx !== -1) {
                    list[idx] = currentWarehouse;
                    localStorage.setItem('wms_warehouses_v6', JSON.stringify(list));
                }
            }
        } catch (e) {
            alert('Lỗi lưu khu vực: ' + e.message);
            return;
        }

        // Reset active state and clear grid selection to return to display mode
        activeAreaId = null;
        var config = floorConfigs[currentFloor];
        if (config) {
            config.selected = {};
        }
        
        refreshVisuals();
        renderAreaCards();

        if (window.showToast) {
            window.showToast('Đã lưu cấu hình khu vực thành công!', 'success');
        } else {
            alert('Đã lưu cấu hình khu vực thành công!');
        }
    }

    // ===== LOCATION MANAGEMENT =====
    var locationData = [];
    var locationIdCounter = 1;

    function renderLocationCards() {
        var container = document.getElementById('locationCardList');
        if (!container) return;
        
        var html = '';
        for (var i = 0; i < locationData.length; i++) {
            var loc = locationData[i];
            var isCollapsed = loc.collapsed ? ' collapsed' : '';
            var isActive = (activeLocationId === loc.id) ? ' active' : '';
            var isReadonly = (activeLocationId !== loc.id) ? ' readonly' : '';
            
            html += '<div class="location-card' + isCollapsed + isActive + isReadonly + '" data-location-id="' + loc.id + '">';
            html += '<div class="card-number-label-container"><span class="card-number-label">Vị trí ' + (i + 1) + '</span></div>';
            html += '<div class="location-card-body">';
            
            // // Mã vị trí
            // html += '<div class="location-field">';
            // html += '<span class="location-field-label">Mã vị trí <span style="color: red;">*</span></span>';
            // html += '<div class="location-field-value">';
            // html += '<input type="text" value="' + (loc.code || '') + '" oninput="updateLocationField(' + loc.id + ', \'code\', this.value)" placeholder="Nhập mã vị trí...">';
            // html += '</div></div>';
            
            // Tên vị trí
            html += '<div class="location-field">';
            html += '<span class="location-field-label">Tên vị trí <span style="color: red;">*</span></span>';
            html += '<div class="location-field-value">';
            html += '<input type="text" value="' + escapeHtml(loc.name || '') + '" oninput="updateLocationField(' + loc.id + ', \'name\', this.value)" placeholder="Nhập tên vị trí...">';
            html += '</div></div>';

            // Loại vị trí
            var locationTypes = ['Vị trí ô trống', 'Vị trí chứa hàng', 'Vị trí sạc pin', 'Vị trí dừng đỗ', 'Vị trí lifter', 'Vị trí đã chứa hàng (Không tạt ngang)'];
            var currentLocType = loc.locationType || 'Vị trí ô trống';
            
            html += '<div class="location-field" style="display: none;">';
            html += '<span class="location-field-label">Loại vị trí <span style="color: red;">*</span></span>';
            html += '<div class="location-field-value">';
            html += '<div class="area-dropdown" id="locationTypeDropdown-' + loc.id + '">';
            html += '<div class="area-dropdown-toggle" onclick="toggleLocationTypeDropdown(' + loc.id + ')">';
            html += '<span>' + currentLocType + '</span>';
            html += '<i class="fas fa-chevron-down" style="font-size: 12px; color: #8c8c8c"></i>';
            html += '</div>';
            html += '<div class="area-dropdown-menu" style="min-width: 200px;">';
            locationTypes.forEach(function(type) {
                var isActive = currentLocType === type;
                html += '<div class="area-dropdown-item' + (isActive ? ' active' : '') + '" onclick="selectLocationType(' + loc.id + ', \'' + type.replace(/'/g, "\\'") + '\')">';
                html += '<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">';
                html += '<span>' + type + '</span>';
                if (isActive) html += '<i class="fas fa-check" style="font-size: 10px;"></i>';
                html += '</div></div>';
            });
            html += '</div></div></div></div>';

            // Positions Selection container
            html += '<div class="location-field area-position" style="margin-bottom: none;">';
            html += '<span class="location-field-label">Vị trí<span style="color: red;">*</span></span>';
            html += '<div class="location-field-value">';
            html += '<label style="font-size: 13px; display: block; margin-bottom: 5px;">Đã chọn: <strong style="color: #076eb8">' + (loc.positions ? loc.positions.length : 0) + '</strong> vị trí</label>';
            html += '<div class="area-tags" style="overflow-y: auto; max-height: 120px; margin-bottom: 0;">';
            if (loc.positions && loc.positions.length > 0) {
                for (var posIdx = 0; posIdx < loc.positions.length; posIdx++) {
                    var pos = loc.positions[posIdx];
                    html += '<span class="tag-item">' + pos + '<span class="tag-remove" onclick="' + (isReadonly ? '' : 'removeLocationTag(' + loc.id + ', \'' + pos + '\')') + '">&times;</span></span>';
                }
            } else {
                html += '<span style="color: #9cb3c9; font-size: 13px; font-style: italic; display: inline-block; padding: 5px;">Chưa chọn vị trí nào</span>';
            }
            html += '</div></div></div>';

            // QR Code (Dynamic)
            var qrCodes = loc.qrCodes || [''];
            if (qrCodes.length === 0) qrCodes = ['']; // At least one input

            var currentPosCount = loc.positions ? loc.positions.length : 0;
            if (activeLocationId === loc.id) {
                var config = floorConfigs[currentFloor];
                if (config && config.selected) {
                    currentPosCount = Object.keys(config.selected).length;
                }
            }
            var isMultiPos = currentPosCount > 1;

            html += '<div class="location-field" style="align-items: flex-start;">';
            html += '<span class="location-field-label" style="padding-top: 10px;">QR Code <span style="color: red;">*</span></span>';
            html += '<div class="location-qr-container" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">';
            
            for (var j = 0; j < qrCodes.length; j++) {
                html += '<div class="location-qr-input-group" style="display: flex; align-items: center; gap: 8px;">';
                if (isMultiPos) {
                    html += '<input type="text" value="' + (qrCodes[j] || '') + '" onchange="updateLocationQRCode(' + loc.id + ', ' + j + ', this.value)" placeholder="Nhập mã QR..." style="flex: 1; height: 36px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; cursor: not-allowed;" disabled title="Chỉ có thể thiết lập mã QR cho 1 vị trí">';
                } else {
                    html += '<input type="text" value="' + (qrCodes[j] || '') + '" onchange="updateLocationQRCode(' + loc.id + ', ' + j + ', this.value)" placeholder="Nhập mã QR..." style="flex: 1; height: 36px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px;">';
                }
                html += '</div>';
            }
            html += '</div></div>';

            // Hướng đi (clockwise: Trên, Phải, Dưới, Trái)
            var directionsList = ['Trên', 'Phải', 'Dưới', 'Trái'];
            var locDirs = loc.directions || (loc.direction ? [loc.direction] : []);
            var dirLabel = locDirs.length > 0 ? locDirs.join(', ') : 'Chọn vị trí';
            
            html += '<div class="location-field">';
            html += '<span class="location-field-label">Hướng đi <span style="color: red;">*</span> <div class="mode-info-tooltip" style="display:inline-flex; margin-left:4px; vertical-align:middle;">';
            html += '<i class="fas fa-info-circle"></i>';
            html += '<span class="tooltip-text">Chiều hướng đi được tính theo chiều kim đồng hồ</span>';
            html += '</div></span>';
            html += '<div class="location-field-value">';
            html += '<div class="area-dropdown" id="locationDirDropdown-' + loc.id + '">';
            html += '<div class="area-dropdown-toggle" onclick="toggleLocationDirDropdown(' + loc.id + ')">';
            html += '<span>' + dirLabel + '</span>';
            html += '<i class="fas fa-chevron-down" style="font-size: 12px; color: #8c8c8c"></i>';
            html += '</div>';
            html += '<div class="area-dropdown-menu" style="min-width: 150px;">';
            directionsList.forEach(function(dir) {
                var isActive = locDirs.indexOf(dir) !== -1;
                html += '<div class="area-dropdown-item' + (isActive ? ' active' : '') + '" onclick="updateLocationDirection(' + loc.id + ', \'' + dir + '\', event)">';
                html += '<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">';
                html += '<span>' + dir + '</span>';
                if (isActive) html += '<i class="fas fa-check" style="font-size: 10px;"></i>';
                html += '</div></div>';
            });
            html += '</div></div></div></div>';

            // Hình ảnh (SVG based on direction)
            html += '<div class="location-field">';
            html += '<span class="location-field-label">Hình ảnh</span>';
            html += '<div class="location-icon-preview-container" title="' + dirLabel + '">';
            html += getLocationIconSVG(locDirs);
            html += '</div></div>';

            html += '</div>'; // end location-card-body
            
            // Actions
            html += '<div class="area-card-actions">'; // Reusing area card css
            html += '<button class="area-action-btn" onclick="editLocationCard(' + loc.id + ')" title="Chỉnh sửa sơ đồ"><i class="fas fa-pen"></i></button>';
            html += '<button class="area-action-btn delete" onclick="deleteLocationCard(' + loc.id + ')" title="Xóa"><i class="fas fa-trash-alt"></i></button>';
            html += '</div>';
            
            // Toggle collapse
            html += '<div class="location-toggle">';
            html += '<a onclick="toggleLocationCollapse(' + loc.id + ')">' + (loc.collapsed ? 'Hiển thị thêm' : 'Ẩn bớt') + '</a>';
            html += '</div>';
            
            html += '</div>';
        }
        
        container.innerHTML = html;
        
        // Ensure active state updates selection list rendering logic
        if (currentMode === 'position') {
            renderSelectionList();
        }
    }

    function addLocationCard() {
        var newCard = {
            id: Date.now(),
            code: '',
            name: '',
            image: '',
            direction: '',
            directions: [],
            locationType: 'Vị trí ô trống',
            qrQuantity: 1,
            qrCodes: [''],
            positions: [],
            collapsed: false
        };
        locationData.push(newCard);
        renderLocationCards();
        // Scroll to bottom
        var list = document.getElementById('locationCardList');
        if (list) {
            setTimeout(function() {
                list.parentElement.scrollTop = list.parentElement.scrollHeight;
            }, 50);
        }
    }

    function deleteLocationCard(id) {
        if (confirm('Bạn có chắc chắn muốn xóa thẻ vị trí này?')) {
            locationData = locationData.filter(function(l) { return l.id !== id; });
            if (activeLocationId === id) {
                activeLocationId = null;
                // clear grid selection
                var config = floorConfigs[currentFloor];
                config.selected = {};
                refreshVisuals();
                renderSelectionList();
            }
            if (locationData.length === 0) {
                addLocationCard();
            } else {
                renderLocationCards();
            }
        }
    }

    function updateLocationField(id, field, value) {
        for (var i = 0; i < locationData.length; i++) {
            if (locationData[i].id === id) {
                locationData[i][field] = value;
                break;
            }
        }
    }

    function toggleLocationCollapse(id) {
        for (var i = 0; i < locationData.length; i++) {
            if (locationData[i].id === id) {
                locationData[i].collapsed = !locationData[i].collapsed;
                break;
            }
        }
        renderLocationCards();
    }

    function triggerLocationImageUpload(id) {
        var input = document.getElementById('locImgInput-' + id);
        if (input) input.click();
    }

    function handleLocationImageUpload(id, inputElem) {
        if (inputElem.files && inputElem.files[0]) {
            var file = inputElem.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                var base64Str = e.target.result;
                updateLocationField(id, 'image', base64Str);
                renderLocationCards();
            };
            reader.readAsDataURL(file);
        }
    }

    function removeLocationImage(id, event) {
        if (event) {
            event.stopPropagation();
        }
        if (confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
            updateLocationField(id, 'image', '');
            renderLocationCards();
        }
    }

    function editLocationCard(id) {
        activeLocationId = id;
        activeAreaId = null; // Clear area conflict
        
        var loc = null;
        for (var i = 0; i < locationData.length; i++) {
            if (locationData[i].id === id) {
                loc = locationData[i];
                break;
            }
        }
        
        if (loc) {
            var config = floorConfigs[currentFloor];
            config.selected = {};
            
            loc.positions.forEach(function(pos) {
                for (var r = 0; r < config.rows; r++) {
                    for (var c = 0; c < config.cols; c++) {
                        var cellLabel = getColName(c) + (r + 1);
                        var cellLabelWithFloor = currentFloor + '-' + cellLabel;
                        if (cellLabelWithFloor === pos || cellLabel === pos) {
                            addSelection(config.selected, r + '-' + c);
                            break;
                        }
                    }
                }
            });
            refreshVisuals();
            renderLocationCards();
            renderAreaCards(); // Re-render to clear area active state visually
        }
    }

    function removeLocationTag(locId, tagLabel) {
        var loc = null;
        for (var i = 0; i < locationData.length; i++) {
            if (locationData[i].id === locId) {
                loc = locationData[i];
                break;
            }
        }
        
        if (!loc) return;
        
        // Remove from array
        loc.positions = loc.positions.filter(function(p) { return p !== tagLabel; });
        
        // Update grid if active
        if (activeLocationId === locId) {
            var config = floorConfigs[currentFloor];
            // Find grid ID for this tag
            for (var r = 0; r < config.rows; r++) {
                for (var c = 0; c < config.cols; c++) {
                    if ((currentFloor + '-' + getColName(c) + (r + 1)) === tagLabel) {
                        removeSelection(config.selected, r + '-' + c);
                        refreshVisuals();
                        break;
                    }
                }
            }
        }
        renderLocationCards();
    }

    function toggleLocationDirDropdown(locId) {
        var menu = document.querySelector('#locationDirDropdown-' + locId + ' .area-dropdown-menu');
        if (menu) {
            // Close other location menus
            document.querySelectorAll('.location-card .area-dropdown-menu').forEach(function(m) {
                if (m !== menu) m.classList.remove('show');
            });
            menu.classList.toggle('show');
        }
    }

    function toggleLocationTypeDropdown(locId) {
        var menu = document.querySelector('#locationTypeDropdown-' + locId + ' .area-dropdown-menu');
        if (menu) {
            document.querySelectorAll('.location-card .area-dropdown-menu').forEach(function(m) {
                if (m !== menu) m.classList.remove('show');
            });
            menu.classList.toggle('show');
        }
    }

    function selectLocationType(locId, type) {
        for (var i = 0; i < locationData.length; i++) {
            if (locationData[i].id === locId) {
                locationData[i].locationType = type;
                break;
            }
        }
        renderLocationCards();
    }

    function updateLocationDirection(locId, dir, event) {
        if (event) event.stopPropagation();
        
        for (var i = 0; i < locationData.length; i++) {
            if (locationData[i].id === locId) {
                var loc = locationData[i];
                if (!loc.directions) {
                    loc.directions = loc.direction ? [loc.direction] : [];
                }
                
                var index = loc.directions.indexOf(dir);
                if (index === -1) {
                    loc.directions.push(dir);
                } else {
                    loc.directions.splice(index, 1);
                }
                
                // Keep .direction for fallback compatibility
                loc.direction = loc.directions.length > 0 ? loc.directions[0] : '';
                break;
            }
        }
        renderLocationCards();
        // Re-open the dropdown after re-render
        setTimeout(function() {
            toggleLocationDirDropdown(locId);
        }, 0);
    }

    function updateLocationQRQuantity(locId, val) {
        var qty = parseInt(val) || 1;
        if (qty < 1) qty = 1;
        for (var i = 0; i < locationData.length; i++) {
            if (locationData[i].id === locId) {
                locationData[i].qrQuantity = qty;
                if (!locationData[i].qrCodes) locationData[i].qrCodes = [];
                while (locationData[i].qrCodes.length < qty) {
                    locationData[i].qrCodes.push('');
                }
                if (locationData[i].qrCodes.length > qty) {
                    locationData[i].qrCodes = locationData[i].qrCodes.slice(0, qty);
                }
                break;
            }
        }
        renderLocationCards();
    }

    function addLocationQRCode(locId) {
        for (var i = 0; i < locationData.length; i++) {
            if (locationData[i].id === locId) {
                if (!locationData[i].qrCodes) locationData[i].qrCodes = [''];
                locationData[i].qrCodes.push('');
                locationData[i].qrQuantity = locationData[i].qrCodes.length;
                break;
            }
        }
        renderLocationCards();
    }

    function removeLocationQRCode(locId, index) {
        for (var i = 0; i < locationData.length; i++) {
            if (locationData[i].id === locId) {
                if (locationData[i].qrCodes && locationData[i].qrCodes.length > 1) {
                    locationData[i].qrCodes.splice(index, 1);
                    locationData[i].qrQuantity = locationData[i].qrCodes.length;
                }
                break;
            }
        }
        renderLocationCards();
    }

    function updateLocationQRCode(locId, index, val) {
        for (var i = 0; i < locationData.length; i++) {
            if (locationData[i].id === locId) {
                if (!locationData[i].qrCodes) locationData[i].qrCodes = [];
                locationData[i].qrCodes[index] = val;
                break;
            }
        }
    }

    function getLocationIconSVG(directions, isForGrid) {
        // Handle both single string (legacy) and array
        var dirs = Array.isArray(directions) ? directions : [directions];
        
        var bgColor = 'rgba(223, 240, 255, 0.5)';
        var borderColor = 'rgba(216, 216, 216, 0.2)';
        var vectorColor = '#7C8DB5';
        var baseDotColor = '#677594';

        var svgStyle = isForGrid ? 'width: 40px; height: 40px;' : 'border: 0.5px solid ' + borderColor + '; background: ' + bgColor + '; box-sizing: border-box; width: 40px; height: 40px;';
        var html = '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="' + svgStyle + '">';
        
        // Define paths for each direction (clockwise: Trên, Phải, Dưới, Trái)
        // Up (Trên)
        if (dirs.indexOf('Trên') !== -1) {
            html += '<path d="M20 0V19.7531" stroke="' + vectorColor + '" stroke-opacity="0.7"/>';
        }
        
        // Right (Phải)
        if (dirs.indexOf('Phải') !== -1) {
            html += '<path d="M20 20H40" stroke="' + vectorColor + '" stroke-opacity="0.7"/>';
        }
        
        // Down (Dưới)
        if (dirs.indexOf('Dưới') !== -1) {
            html += '<path d="M20 19.7529V39.9998" stroke="' + vectorColor + '" stroke-opacity="0.7"/>';
        }
        
        // Left (Trái)
        if (dirs.indexOf('Trái') !== -1) {
            html += '<path d="M0 20H20" stroke="' + vectorColor + '" stroke-opacity="0.7"/>';
        }
        
        // Base point
        html += '<ellipse cx="20" cy="20" rx="2" ry="2" fill="' + baseDotColor + '"/>';
        
        html += '</svg>';
        return html;
    }

    function saveLocationTab() {
        if (!currentWarehouse) {
            alert('Chưa chọn kho để lưu!');
            return;
        }

        // Final sync: Ensure current selection (including goods) is reflected before saving
        if (activeLocationId !== null) {
            var config = floorConfigs[currentFloor];
            for (var i = 0; i < locationData.length; i++) {
                if (locationData[i].id === activeLocationId) {
                    locationData[i].positions = getSelectionKeys(config.selected).sort(function(a,b){
                        var pa = a.split('-').map(Number), pb = b.split('-').map(Number);
                        if (pa[0] !== pb[0]) return pa[0] - pb[0];
                        return pa[1] - pb[1];
                    }).map(function(key) {
                        var pts = key.split('-').map(Number);
                        return currentFloor + '-' + getColName(pts[1]) + (pts[0] + 1);
                    });
                    break;
                }
            }
        }

        currentWarehouse.locationTypes = JSON.parse(JSON.stringify(locationData));
        // Also persist floorConfigs (goods data lives here)
        currentWarehouse.configData = JSON.parse(JSON.stringify(floorConfigs));

        // Snapshot the saved goods state so hover popover only shows for saved cells
        for (var f in floorConfigs) {
            if (floorConfigs[f].goods) {
                savedGoodsData[f] = JSON.parse(JSON.stringify(floorConfigs[f].goods));
            }
        }

        try {
            var stored = localStorage.getItem('wms_warehouses_v6');
            if (stored) {
                var list = JSON.parse(stored);
                var idx = list.findIndex(function(w) { return w.id === currentWarehouseId; });
                if (idx !== -1) {
                    list[idx] = currentWarehouse;
                    localStorage.setItem('wms_warehouses_v6', JSON.stringify(list));
                }
            }
        } catch (e) {
            alert('Lỗi lưu vị trí: ' + e.message);
            return;
        }

        // Reset active location and clear grid selection after save
        activeLocationId = null;
        var cfg = floorConfigs[currentFloor];
        if (cfg) cfg.selected = {};
        refreshVisuals();
        renderLocationCards();

        if (window.showToast) {
            window.showToast('Đã lưu cấu hình vị trí thành công!', 'success');
        } else {
            alert('Đã lưu cấu hình vị trí thành công!');
        }
    }

    // ===== FLOOR TAB UI LOGIC =====
    window.toggleFloorTabDropdown = function() {
        var menu = document.getElementById('floorTabMenu');
        if (menu) {
            if (menu.classList.contains('show')) {
                menu.classList.remove('show');
            } else {
                if (typeof window.populateFloorTabFields === 'function') {
                    window.populateFloorTabFields();
                }
                menu.classList.add('show');
            }
        }
    };

    window.selectFloorTabDropdown = function(floorNum) {
        currentFloor = floorNum;
        initGrid();
        renderFloorMenu();
    };


    window.updateFloorName = function(val) {
        if (floorConfigs[currentFloor]) {
            floorConfigs[currentFloor].name = val;
        }
    };

    // ----- Floor Equipment Accordion -----
    var floorEqFilterText = '';

    window.openFloorEqDropdown = function() {
        var menu = document.getElementById('floorEquipmentMenu');
        var chevron = document.getElementById('floorEqChevron');
        if (menu) {
            menu.style.display = 'block';
            if (chevron) chevron.style.transform = 'rotate(180deg)';
            renderFloorEqAccordion();
        }
    };

    window.closeFloorEqDropdown = function() {
        var menu = document.getElementById('floorEquipmentMenu');
        var chevron = document.getElementById('floorEqChevron');
        if (menu) {
            menu.style.display = 'none';
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    };


    // Expose functions globally
    window.saveGridConfig = saveGridConfig;
    window.zoomIn = zoomIn;
    window.zoomOut = zoomOut;
    window.resetCurrentFloor = resetCurrentFloor;
    window.syncAllFloors = syncAllFloors;
    window.initWarehouseConfigGrid = init;
    window.setMode = setMode;
    window.setConfigTab = setConfigTab;
    window.toggleInitTypeDropdown = toggleInitTypeDropdown;
    window.selectInitType = selectInitType;
    window.toggleFloorDropdown = toggleFloorDropdown;
    window.selectFloor = selectFloor;

    
    window.addFloorType = addFloorType;
    window.deleteFloorType = deleteFloorType;
    window.toggleFloorTypeCollapse = toggleFloorTypeCollapse;
    window.editFloorTypeCard = editFloorTypeCard;
    window.updateFloorTypeField = updateFloorTypeField;
    window.toggleFloorTypeDropdown = toggleFloorTypeDropdown;
    window.selectFloorTypeNeighbor = selectFloorTypeNeighbor;
    window.triggerFloorTypeImageUpload = triggerFloorTypeImageUpload;
    window.handleFloorTypeImageUpload = handleFloorTypeImageUpload;

    window.saveInitTab = saveInitTab;
    
    window.addLocationCard = addLocationCard;
    window.deleteLocationCard = deleteLocationCard;
    window.updateLocationField = updateLocationField;
    window.toggleLocationCollapse = toggleLocationCollapse;
    window.triggerLocationImageUpload = triggerLocationImageUpload;
    window.handleLocationImageUpload = handleLocationImageUpload;
    window.removeLocationImage = removeLocationImage;
    window.editLocationCard = editLocationCard;
    window.removeLocationTag = removeLocationTag;
    window.saveLocationTab = saveLocationTab;

    // Equipment UI Exports
    window.showEquipmentList = showEquipmentList;
    window.toggleEquipmentList = toggleEquipmentList;
    window.filterEquipmentList = filterEquipmentList;
    window.selectEquipment = selectEquipment;
    window.removeEquipment = removeEquipment;
    window.toggleAccordionGroup = toggleAccordionGroup;
    // New inline-assignment equipment system
    window.assignEqType = assignEqType;
    window.setEqFilter = setEqFilter;
    window.filterEqList = filterEqList;
    window.toggleEqSumGroup = toggleEqSumGroup;
    window.toggleLocationDirDropdown = toggleLocationDirDropdown;
    window.updateLocationDirection = updateLocationDirection;
    window.addLocationQRCode = addLocationQRCode;
    window.removeLocationQRCode = removeLocationQRCode;
    window.updateLocationQRCode = updateLocationQRCode;
    window.toggleLocationTypeDropdown = toggleLocationTypeDropdown;
    window.selectLocationType = selectLocationType;
    
    // Floor Assignment Exports
    window.toggleFloorAssignDropdown = toggleFloorAssignDropdown;
    window.selectFloorAssign = selectFloorAssign;
    window.bulkAssignFloor = bulkAssignFloor;
    window.bulkUnassignFloor = bulkUnassignFloor;

    window.addArea = addArea;
    window.deleteArea = deleteArea;
    window.removeAreaTag = removeAreaTag;
    window.toggleAreaCollapse = toggleAreaCollapse;
    window.updateAreaField = updateAreaField;
    window.editArea = editArea;
    window.saveAreaTab = saveAreaTab;
    window.selectAreaProduct = selectAreaProduct;
    window.removeAreaProduct = removeAreaProduct;
    window.showAreaProductList = showAreaProductList;
    window.toggleAreaProductList = toggleAreaProductList;
    window.filterAreaProductList = filterAreaProductList;
    window.toggleAreaDirectionDropdown = toggleAreaDirectionDropdown;
    window.selectAreaDirection = selectAreaDirection;
    window.toggleAreaRuleDropdown = toggleAreaRuleDropdown;
    window.selectAreaRule = selectAreaRule;

    // Auto-init if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();