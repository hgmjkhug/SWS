

// Mock pallet data
const mockPalletData = {
    'A1': {
        code: 'PL-001',
        name: 'Pallet A1',
        importTime: '2026-01-23 14:30:00',
        materialCode: 'MAT-1001',
        materialName: 'Thép cuộn',
        quantity: 100,
        weight: 5000,
        remainingQuantity: 30
    },
    'A2': {
        code: 'PL-002',
        name: 'Pallet A2',
        importTime: '2026-01-22 10:15:00',
        materialCode: 'MAT-1002',
        materialName: 'Nhôm tấm',
        quantity: 50,
        weight: 2500,
        remainingQuantity: 20
    }
};

let activePalletCard = null;
let tooltip = null;
let flatLayout = null;
let craneLayout = null; // New Crane Layout State
let towerLayout = null; // New Tower Layout State
let pendingFlat = null;
let pendingCrane = null; // New Pending Crane State
let pendingFlatActive = 1;
let selectedBuffer = null;
let selectedBuffers = {};
let blockToDelete = null;

const LS_KEY_FLAT = 'wms_flat_layout_v1';
const LS_KEY_CRANE = 'wms_crane_layout_v1';
const LS_KEY_TOWER = 'wms_tower_layout_v1';
const LS_KEY_TAB = 'wms_layout_selected_tab';

// Toast notification (local to layout module - renamed to avoid global conflict)
function layoutShowToast(message, type = 'success') {
    // Use global toast if available, otherwise fallback to local
    if (window.showToast && window.showToast !== layoutShowToast) {
        window.showToast(message, type);
        return;
    }
    
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Pallet card functions
function hidePalletCard() {
    if (activePalletCard) {
        activePalletCard.remove();
        activePalletCard = null;
    }
}

function showPalletCard(e, palletId) {
    hidePalletCard();
    
    // Get pallet from static data or generate dynamic mock data
    let pallet = mockPalletData[palletId];
    
    if (!pallet) {
        // Generate dynamic mock data for Tower (T1-F2-P3) and Crane (C1-R2-C3) IDs
        const materials = [
            { code: 'MAT-1001', name: 'Thép cuộn' },
            { code: 'MAT-1002', name: 'Nhôm tấm' },
            { code: 'MAT-1003', name: 'Đồng thanh' },
            { code: 'MAT-1004', name: 'Inox 304' },
            { code: 'MAT-1005', name: 'Sắt vuông' }
        ];
        
        // Generate consistent data based on palletId hash
        const hash = palletId.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
        const absHash = Math.abs(hash);
        const material = materials[absHash % materials.length];
        const quantity = 50 + (absHash % 150);
        const weight = 500 + (absHash % 4500);
        
        pallet = {
            code: `PL-${(absHash % 9000 + 1000)}`,
            name: `Pallet ${palletId}`,
            importTime: `2026-01-${(absHash % 28 + 1).toString().padStart(2, '0')} ${(absHash % 24).toString().padStart(2, '0')}:${(absHash % 60).toString().padStart(2, '0')}:00`,
            materialCode: material.code,
            materialName: material.name,
            quantity: quantity,
            weight: weight,
            remainingQuantity: Math.floor(quantity * (0.3 + (absHash % 70) / 100))
        };
    }
    
    const card = document.createElement('div');
    card.className = 'pallet-hover-card';
    card.innerHTML = `
        <div class="pallet-card-header">${pallet.code}</div>
        <div class="pallet-card-row">
            <span class="pallet-card-label">Tên pallet:</span>
            <span class="pallet-card-value">${pallet.name}</span>
        </div>
        <div class="pallet-card-row">
            <span class="pallet-card-label">Thời gian nhập:</span>
            <span class="pallet-card-value">${pallet.importTime}</span>
        </div>
        <div class="pallet-card-row">
            <span class="pallet-card-label">Vật tư:</span>
            <span class="pallet-card-value">${pallet.materialCode} - ${pallet.materialName}</span>
        </div>
        <div class="pallet-card-row">
            <span class="pallet-card-label">Số lượng:</span>
            <span class="pallet-card-value">${pallet.quantity} cái</span>
        </div>
        <div class="pallet-card-row">
            <span class="pallet-card-label">Khối lượng:</span>
            <span class="pallet-card-value">${pallet.weight} kg</span>
        </div>
        <div class="pallet-card-row">
            <span class="pallet-card-label">Số lượng còn lại:</span>
            <span class="pallet-card-value">${pallet.remainingQuantity} cái</span>
        </div>
    `;
    
    document.body.appendChild(card);
    activePalletCard = card;
    
    const rect = e.target.getBoundingClientRect();
    card.style.left = (rect.right + 10) + 'px';
    card.style.top = rect.top + 'px';
}

// Main warehouse layout render
function renderWarehouseLayout(container) {
    container.innerHTML = `
        <div class="layout-tabs">
            <div id="tab-tower" class="tab-btn active" onclick="switchTab('tower')">Kho Tower</div>
            <div id="tab-crane" class="tab-btn" onclick="switchTab('crane')">Kho Stacker Crane</div>
            <div id="tab-flat" class="tab-btn" onclick="switchTab('flat')">Kho Flat</div>
        </div>
        <div class="layout-controls">
            <div style="display:flex; gap:10px">
                <select style="padding:6px; border:1px solid #ddd; border-radius:4px">
                    <option>Zone A (Nguyên Vật Liệu)</option>
                </select>
            </div>
            <div style="margin-left:12px; display:flex; align-items:center;">
                <button id="layout-action-btn" class="btn-primary" onclick="handleLayoutAction()">Thêm layout</button>
            </div>
        </div>
        <div class="warehouse-visual-container" style="position: relative;">
            <div class="legend-group" style="position: absolute; top: 15px; right: 15px; background: white; padding: 8px 12px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 10;">
                <div class="legend-item"><div class="dot" style="background:#f1f5f9; border:1px solid #cbd5e1"></div> Trống</div>
                <div class="legend-item"><div class="dot" style="background:#22c55e"></div> Có hàng</div>
                <div class="legend-item"><div class="dot" style="background:#ef4444"></div> Lỗi</div>
            </div>
            <div id="view-tower" style="display:flex; justify-content:center; align-items:flex-end; gap:0; background:#cbd5e1; padding:40px; border-radius:8px; min-height:550px">
                <!-- Content rendered by renderTowerLayout -->
            </div>
            <div id="view-crane" class="placeholder-box hidden">
                <div id="crane-render" class="stacker-render-wrapper"></div>
            </div>
            <div id="view-flat" class="placeholder-box hidden" style="padding:12px;">
                <div id="flat-render" style="background:white; padding:12px; border-radius:8px; min-height:200px; border:1px solid #e6eef6; width:100%; height:100%;"></div>
            </div>
    `;
} // Closing renderWarehouseLayout

function renderTowerLayout() {
    // alert('Call renderTowerLayout'); // Debug
    const container = document.getElementById('view-tower');
    if(!container) { console.error('view-tower not found'); return; }
    container.innerHTML = ''; 
    
    if(!towerLayout) { console.warn('towerLayout is null'); }
    else if(!towerLayout.blocks) { console.warn('towerLayout.blocks is missing'); }
    
    if(!towerLayout || !towerLayout.blocks || towerLayout.blocks.length === 0) {
         container.innerHTML = `
            <div class="empty-state-message" style="width:100%; height:100%">
                Chưa có layout kho, hãy thêm layout kho
            </div>
         `;
         updateLayoutButton();
         return;
    }
    
    // alert('Rendering ' + towerLayout.blocks.length + ' blocks');
    
    // Render Blocks as Towers
    // Mock UI had: Tower 1 - Lifter - Tower 2.
    // If we have blocks, we treat them as towers.
    // If 2 blocks, render T1 - Lifter - T2.
    // If >2, render T1 - T2 - Lifter - T3... or just T1 T2 T3.
    // User said "render ra như UI hiện tại". UI had 2 towers.
    // I will try to support N towers.
    
    towerLayout.blocks.forEach((block, index) => {
        const towerId = index + 1;
        
        // Wrapper to contain title + tower block  
        const wrapperEl = document.createElement('div');
        wrapperEl.style.cssText = "display:flex; flex-direction:column; align-items:stretch; gap:8px;";
        
        // Block title - separate element with its own background
        const titleEl = document.createElement('div');
        titleEl.style.cssText = "text-align:center; font-weight:800; color:#1e293b; background:white; padding:8px 16px; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.1);";
        titleEl.innerText = block.name || 'Block '+towerId;
        wrapperEl.appendChild(titleEl);
        
        const towerEl = document.createElement('div');
        towerEl.className = 'rack-tower';
        towerEl.id = 'tower-block-' + towerId;
        towerEl.style.cssText = "display:flex; flex-direction:column-reverse; background:white; border-radius:8px; padding:10px; position:relative; box-shadow: 0 4px 12px rgba(0,0,0,0.1);";
        
        // Render Levels (Rows)
        for(let r=1; r<=block.rows; r++) {
            const row = document.createElement('div');
            row.className = 'rack-level';
            row.style.cssText = "display:flex; gap:8px; padding:6px; border-bottom:2px solid #94a3b8; background:#f8fafc; position:relative";
            
            if(index === 0) {
                const idx = document.createElement('div');
                idx.style.cssText = "position:absolute; left:-40px; width:35px; height:100%; display:flex; align-items:center; justify-content:flex-end; font-size:11px; font-weight:bold; color:#64748b";
                idx.innerText=`F${r}`; 
                row.appendChild(idx);
            }
            
            for(let c=1; c<=block.cols; c++) {
                const slot = document.createElement('div');
                slot.style.cssText = "display:flex; border:1px dashed #cbd5e1; padding:2px; background:white; border-radius:4px; position:relative";
                
                const lbl = document.createElement('div');
                lbl.style.cssText = "position:absolute; bottom:-18px; width:100%; text-align:center; font-size:9px; font-weight:bold; color:#64748b";
                lbl.innerText=`P${c}`; 
                slot.appendChild(lbl);
                
                const bin = createTowerBin(towerId, r, c);
                slot.appendChild(bin);
                row.appendChild(slot);
            }
            towerEl.appendChild(row);
        }
        wrapperEl.appendChild(towerEl);
        container.appendChild(wrapperEl);
    });
    
    // Insert lifter between block 1 and 2 if both exist
    if(towerLayout.blocks.length >= 2) {
        const block1 = document.getElementById('tower-block-1');
        const block2 = document.getElementById('tower-block-2');
        if(block1 && block2) {
            const lifter = document.createElement('div');
            lifter.className = 'lift-shaft-dynamic';
            lifter.style.height = block1.offsetHeight + 'px';
            lifter.style.marginTop = '30px'; // Align with title height
            lifter.innerHTML = '<div class="lift-cabin"><span>🔼</span>LIFT<span>🔽</span></div>';
            // block2 is now inside a wrapper, so we need to insert before wrapper2
            const wrapper2 = block2.parentElement;
            if(wrapper2 && wrapper2.parentElement === container) {
                container.insertBefore(lifter, wrapper2);
            }
        }
    }
}

function createTowerBin(t, f, p) {
    const status = getMockStatus(t, f, p); // Reuse mock status logic or random
    const d = document.createElement('div');
    d.className = `sub-bin bin-${status}`;
    // Use styling for singular bin
    d.style.cssText = "width:35px; height:40px; display:flex; flex-direction:column; justify-content:center; align-items:center; font-size:9px; border-radius:2px; margin:0 1px; cursor:pointer; transition:all 0.2s ease; border:1px solid transparent";
    
    // Label logic
    const label = `P${p}`; // Bin label
    const type = 'BIN'; 
    
    if(status==='occupied') { 
        d.style.background="#22c55e"; 
        d.style.color="white"; 
        d.innerHTML=`<i class="fas fa-box"></i><span style="font-size:7px">${label}</span>`; 
    } else if(status==='error') { 
        d.style.background="#ef4444"; 
        d.style.color="white"; 
        d.innerHTML=`<i class="fas fa-exclamation-triangle"></i><span style="font-size:7px">${label}</span>`; 
    } else { 
        d.style.background="#f1f5f9"; 
        d.style.color="#cbd5e1"; 
        d.innerText=label; 
    }

    // Interaction: Hover Card (Same as Flat)
    // Need a unique ID for pallet card content
    const palletId = `T${t}-F${f}-P${p}`;
    d.addEventListener('mouseenter', (e) => showPalletCard(e, palletId));
    d.addEventListener('mouseleave', hidePalletCard);
    
    return d;
}

function hideTooltip() { 
    if(!tooltip) ensureTooltip(); 
    if(tooltip) tooltip.style.display='none'; 
}

// Tab switching
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');

    document.getElementById('view-tower').classList.toggle('hidden', tab !== 'tower');
    document.getElementById('view-crane').classList.toggle('hidden', tab !== 'crane');
    document.getElementById('view-flat').classList.toggle('hidden', tab !== 'flat');

    if (tab === 'crane') {
        renderStackerCraneLayout();
    } else if (tab === 'tower') {
        try {
            renderTowerLayout();
        } catch(e) {
            console.error('Error rendering Tower layout:', e);
        }
    }
    
    updateLayoutButton(); // Update button state

    try { 
        localStorage.setItem(LS_KEY_TAB, tab); 
    } catch(e) {}
}

function handleLayoutAction() {
    // Determine active tab
    const activeTab = document.querySelector('.tab-btn.active');
    if(!activeTab) return;
    
    if(activeTab.id === 'tab-flat' || activeTab.id === 'tab-tower') {
        openFlatEditModal();
    } else if(activeTab.id === 'tab-crane') {
        openCraneEditModal();
    } else {
        showToast('Tính năng này chưa được hỗ trợ cho tab này.', 'info');
    }
}

// Utility functions
function getModuleEl(id) {
    let el = document.getElementById(id);
    if(el) return el;
    const mv = document.getElementById('main-view');
    if(mv) el = mv.querySelector('#'+id);
    return el;
}

function updateLayoutButton() {
    const btn = document.getElementById('layout-action-btn');
    if(!btn) return;
    
    const activeTab = document.querySelector('.tab-btn.active');
    if(!activeTab) return;
    
    if(activeTab.id === 'tab-flat') {
        btn.style.display = 'block';
        btn.innerText = flatLayout ? 'Sửa layout' : 'Thêm layout';
    } else if(activeTab.id === 'tab-crane') {
        btn.style.display = 'block';
        btn.innerText = craneLayout ? 'Sửa layout' : 'Thêm layout';
    } else if(activeTab.id === 'tab-tower') {
        btn.style.display = 'block';
        // Fix: Check if towerLayout actually has blocks
        btn.innerText = (towerLayout && towerLayout.blocks && towerLayout.blocks.length > 0) ? 'Sửa layout' : 'Thêm layout'; 
    } else {
        // Hide for others if not editable
        btn.style.display = 'none'; 
    }
}

// Block management
function addBlockSection(container, index, cols, rows, name) {
    const blockHTML = `
        <div class="block-card">
            <div class="block-header">
                <div class="title-area">
                    <h2 class="block-title">${name || `Block ${index}`}</h2>
                    <input type="text" class="title-input" value="${name || `Block ${index}`}" />
                    <button type="button" class="btn-icon btn-edit" title="Sửa tên block">✏️</button>
                </div>
                <button type="button" class="btn-icon delete" title="Xóa block" ${index === 1 ? 'style="display:none"' : ''}>🗑️</button>
            </div>
            <div class="input-group">
                <label class="input-label">Số dòng</label>
                <input type="number" min="1" class="input-field" value="${rows || 6}" placeholder="Nhập số dòng..." />
            </div>
            <div class="input-group">
                <label class="input-label">Số cột</label>
                <input type="number" min="1" class="input-field" value="${cols || 10}" placeholder="Nhập số cột..." />
            </div>
        </div>
    `;
    
    const blockEl = document.createElement('div');
    blockEl.innerHTML = blockHTML.trim();
    const card = blockEl.querySelector('.block-card');
    
    const editBtn = card.querySelector('.btn-edit');
    const titleArea = card.querySelector('.title-area');
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        titleArea.classList.add('editing');
        const input = titleArea.querySelector('.title-input');
        input.focus();
        input.select();
    });
    
    const titleInput = card.querySelector('.title-input');
    const titleLabel = card.querySelector('.block-title');
    
    titleInput.addEventListener('blur', () => {
        titleLabel.textContent = titleInput.value || `Block ${index}`;
        titleArea.classList.remove('editing');
    });
    
    titleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            titleInput.blur();
        }
    });
    
    const deleteBtn = card.querySelector('.delete');
    deleteBtn.addEventListener('click', () => {
        const wrapper = document.getElementById('blocks-wrapper');
        const blockCount = wrapper ? wrapper.querySelectorAll('.block-card').length : 1;
        if (blockCount > 1) {
            requestDelete(deleteBtn);
        }
    });
    
    setTimeout(() => {
        const wrapper = document.getElementById('blocks-wrapper');
        if (wrapper) {
            const allCards = wrapper.querySelectorAll('.block-card');
            allCards.forEach(c => {
                const btn = c.querySelector('.delete');
                if (btn) {
                    btn.disabled = allCards.length === 1;
                }
            });
        }
    }, 0);
    
    container.appendChild(card);
}

function gatherBlocksFromModal() {
    const container = document.getElementById('blocks-wrapper');
    if(!container) return null;
    const cards = Array.from(container.querySelectorAll('.block-card'));
    if(!cards || cards.length===0) return null;
    const blocks = cards.map(c=>{
        const inputs = c.querySelectorAll('.input-field');
        const titleEl = c.querySelector('.block-title');
        const name = titleEl ? titleEl.innerText : '';
        const rows = inputs.length > 0 ? Number(inputs[0].value) || 0 : 0;
        const cols = inputs.length > 1 ? Number(inputs[1].value) || 0 : 0;
        return { name: name, cols: cols, rows: rows };
    });
    return blocks;
}

function addBlock() {
    const container = document.getElementById('blocks-wrapper');
    if(!container) return;
    const allCards = container.querySelectorAll('.block-card');
    let nextBlockNum = 1;
    allCards.forEach(card => {
        const title = card.querySelector('.block-title');
        if (title && title.textContent) {
            const match = title.textContent.match(/Block (\d+)/);
            if (match) {
                const num = parseInt(match[1]);
                if (num >= nextBlockNum) nextBlockNum = num + 1;
            }
        }
    });
    addBlockSection(container, nextBlockNum, null, null);
    const newCard = container.querySelector('.block-card:last-child');
    if(newCard){ 
        newCard.classList.add('new-item');
        setTimeout(()=>newCard.classList.remove('new-item'), 300);
        newCard.scrollIntoView({behavior:'smooth', block:'center'});
    }
    updateDeleteButtonStates();
}

function updateDeleteButtonStates() {
    const wrapper = document.getElementById('blocks-wrapper');
    if (!wrapper) return;
    const allCards = wrapper.querySelectorAll('.block-card');
    allCards.forEach((c, idx) => {
        const btn = c.querySelector('.delete');
        if (btn) {
            if (idx === 0) {
                btn.style.display = 'none';
            } else {
                btn.style.display = '';
                btn.disabled = allCards.length === 1;
            }
        }
    });
}

// Delete modal
function requestDelete(button) {
    blockToDelete = button.closest('.block-card');
    document.getElementById('delete-modal').classList.add('show');
}

function closeModal() {
    document.getElementById('delete-modal').classList.remove('show');
    blockToDelete = null;
}

function confirmDelete() {
    if (blockToDelete) {
        blockToDelete.classList.add('deleting');
        setTimeout(() => {
            if (blockToDelete && blockToDelete.parentNode) {
                blockToDelete.remove();
                updateDeleteButtonStates();
            }
        }, 400); 
    }
    closeModal();
}

// LocalStorage functions
function loadPersistedState() {
    try {
        const raw = localStorage.getItem(LS_KEY_FLAT);
        if(raw) {
            flatLayout = JSON.parse(raw);
        }
        const rawCrane = localStorage.getItem(LS_KEY_CRANE);
        if(rawCrane) {
            craneLayout = JSON.parse(rawCrane);
        }
        const rawTower = localStorage.getItem(LS_KEY_TOWER);
        if(rawTower) {
            towerLayout = JSON.parse(rawTower);
        }
        const tab = localStorage.getItem(LS_KEY_TAB);
        if(tab) {
            setTimeout(()=>{ try{ switchTab(tab); }catch(e){} }, 0);
        }
    } catch(e) { 
        console.warn('Failed to load persisted layout', e); 
    }
}

function persistFlatLayout() {
    try {
        if(flatLayout) localStorage.setItem(LS_KEY_FLAT, JSON.stringify(flatLayout));
        else localStorage.removeItem(LS_KEY_FLAT);
    } catch(e){ 
        console.warn('Failed to persist flat layout', e); 
    }
}

// Modal functions
function openFlatEditModal() {
    let m = document.getElementById('modal-flat-edit');
    if(!m) {
        const mv = document.getElementById('main-view');
        m = mv ? mv.querySelector('#modal-flat-edit') : null;
    }
    if(!m) { 
        console.warn('modal-flat-edit not found'); 
        return; 
    }
    m.style.display = 'flex';
    m.classList.add('show');
    const container = document.getElementById('blocks-wrapper');
    if(!container) { 
        console.warn('blocks-wrapper not found in modal'); 
        return; 
    }
    container.innerHTML = '';
    
    // Determine which layout data to load
    let sourceLayout = flatLayout;
    try {
        const activeTab = document.querySelector('.tab-btn.active');
        if(activeTab && activeTab.id === 'tab-tower') {
            sourceLayout = towerLayout;
        }
    } catch(e) {}

    if(sourceLayout && sourceLayout.blocks && Array.isArray(sourceLayout.blocks) && sourceLayout.blocks.length > 0) {
        sourceLayout.blocks.forEach((b, idx) => {
            addBlockSection(container, idx+1, b.cols || 10, b.rows || 6, b.name || `Block ${idx+1}`);
        });
    } else {
        addBlockSection(container, 1, 10, 6, 'Block 1');
    }
    // updateFlatAddEditButton(); // Removing undefined call
}

function closeFlatEditModal() { 
    const m = document.getElementById('modal-flat-edit');
    if(m) {
        m.classList.remove('show');
        m.style.display = 'none';
    }
}

function startFlatBufferSelection() {
    const blocks = gatherBlocksFromModal();
    if(!blocks || blocks.length===0) return alert('Bạn phải thêm ít nhất 1 block');
    for(const b of blocks) { 
        if(!b.cols || !b.rows) return alert('Số cột và số dòng phải lớn hơn 0'); 
    }
    pendingFlat = { blocks: blocks.slice(), count: blocks.length };
    closeFlatEditModal();
    pendingFlatActive = 1;
    selectedBuffers = {};
    selectedBuffer = null;
    renderFlatPreviewBlocks(pendingFlat.blocks, true, pendingFlatActive);
    const mb = document.getElementById('modal-flat-buffer'); 
    if(mb) { 
        mb.style.display = 'flex';
        mb.classList.add('show');
    }
    const coordEl = document.getElementById('flat-buffer-coord'); 
    if(coordEl) coordEl.innerText = `Chọn ô buffer cho Kho ${pendingFlatActive} / ${pendingFlat.count}`;
    const saveBtn = document.getElementById('flat-buffer-save'); 
    if(saveBtn) saveBtn.disabled = true;
}

function closeFlatBufferModal() { 
    const m = document.getElementById('modal-flat-buffer'); 
    if(m) {
        m.classList.remove('show');
        m.style.display = 'none';
    }
    pendingFlat = null; 
}

function backToEditModal() {
    closeFlatBufferModal();
    openFlatEditModal();
}

function renderFlatPreviewBlocks(blocks, interactive, activeBlock) {
    if(!Array.isArray(blocks) || blocks.length===0) return;
    const container = document.getElementById('flat-buffer-preview') || document.getElementById('flat-render');
    if(!container) return;
    container.innerHTML = '';
    const wrapper = document.createElement('div'); 
    wrapper.className = 'flat-multi';
    for(let i=0;i<blocks.length;i++) {
        const b = blocks[i];
        const w = i+1;
        const cols = Number(b.cols) || 1;
        const rows = Number(b.rows) || 1;
        const grid = document.createElement('div'); 
        grid.className = 'flat-grid';
        grid.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
        grid.style.display = 'grid'; 
        grid.style.gap = '8px';
        const label = document.createElement('div'); 
        label.style.textAlign='center'; 
        label.style.marginBottom='8px'; 
        label.style.fontWeight='700'; 
        label.innerText = (b && b.name) ? b.name : `Kho ${w}`;
        const block = document.createElement('div'); 
        block.style.display='flex'; 
        block.style.flexDirection='column'; 
        block.style.alignItems='center';
        if(activeBlock && activeBlock===w) { 
            block.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.06)'; 
            block.style.padding='8px'; 
            block.style.borderRadius='8px'; 
        }
        block.appendChild(label);
        for(let r=1;r<=rows;r++){
            for(let c=1;c<=cols;c++){
                const cell = document.createElement('div');
                cell.className = 'flat-cell';
                cell.dataset.r = r; 
                cell.dataset.c = c; 
                cell.dataset.w = w;
                cell.innerText = `${r}-${c}`;
                cell.style.width='50px'; 
                cell.style.height='50px'; 
                cell.style.display='flex'; 
                cell.style.alignItems='center'; 
                cell.style.justifyContent='center'; 
                cell.style.border='1px solid #e6eef6'; 
                cell.style.borderRadius='6px'; 
                cell.style.cursor='pointer'; 
                cell.style.background='#f8fafc';
                if(selectedBuffers && selectedBuffers[w] && selectedBuffers[w].r==r && selectedBuffers[w].c==c) 
                    cell.classList.add('buffer-selected');
                if(interactive) { 
                    if(!activeBlock || activeBlock===w) 
                        cell.onclick = () => { handleFlatCellClick(cell); }; 
                }
                grid.appendChild(cell);
            }
        }
        block.appendChild(grid);
        wrapper.appendChild(block);
    }
    container.appendChild(wrapper);
}

function handleFlatCellClick(cellEl) {
    const w = Number(cellEl.dataset.w) || 1;
    const r = Number(cellEl.dataset.r);
    const c = Number(cellEl.dataset.c);
    if(pendingFlat && pendingFlat.count>1) {
        selectedBuffers[w] = { r, c };
        document.querySelectorAll('#flat-buffer-preview .flat-cell.buffer-selected').forEach(e=>e.classList.remove('buffer-selected'));
        Object.keys(selectedBuffers).forEach(k=>{
            const sel = selectedBuffers[k];
            const el = document.querySelector(`#flat-buffer-preview .flat-cell[data-w="${k}"][data-r="${sel.r}"][data-c="${sel.c}"]`);
            if(el) el.classList.add('buffer-selected');
        });
        if(pendingFlatActive < pendingFlat.count) {
            pendingFlatActive++;
            renderFlatPreviewBlocks(pendingFlat.blocks, true, pendingFlatActive);
            const coordEl = document.getElementById('flat-buffer-coord'); 
            if(coordEl) coordEl.innerText = `Chọn ô buffer cho Kho ${pendingFlatActive} / ${pendingFlat.count}`;
        } else {
            const coordEl = document.getElementById('flat-buffer-coord'); 
            if(coordEl) coordEl.innerText = 'Đã chọn buffer cho tất cả kho';
        }
        const ready = Object.keys(selectedBuffers).length >= (pendingFlat ? pendingFlat.count : 1);
        const saveBtn = document.getElementById('flat-buffer-save'); 
        if(saveBtn) saveBtn.disabled = !ready;
    } else {
        document.querySelectorAll('.flat-cell.buffer-selected').forEach(e=>e.classList.remove('buffer-selected'));
        cellEl.classList.add('buffer-selected');
        selectedBuffer = { w: w, r: r, c: c };
        const coord = `K${selectedBuffer.w}-R${selectedBuffer.r}-C${selectedBuffer.c}`;
        const label = document.getElementById('flat-buffer-coord'); 
        if(label) label.innerText = coord;
        const saveBtn = document.getElementById('flat-buffer-save'); 
        if(saveBtn) saveBtn.disabled = false;
    }
}

function saveFlatLayout() {
    if(!pendingFlat) return alert('Không có layout để lưu');
    if(pendingFlat.count > 1) {
        const ready = selectedBuffers && Object.keys(selectedBuffers).length >= pendingFlat.count;
        if(!ready) return alert('Bạn phải chọn ô Buffer cho tất cả các kho trước khi lưu');
        flatLayout = { 
            blocks: pendingFlat.blocks.slice().map(b => ({ 
                name: b.name || `Block ${pendingFlat.blocks.indexOf(b) + 1}`,
                cols: Number(b.cols) || 10,
                rows: Number(b.rows) || 6
            })), 
            count: pendingFlat.count || pendingFlat.blocks.length, 
            buffers: selectedBuffers 
        };
    } else {
        if(!selectedBuffer) return alert('Bạn phải chọn 1 ô làm ô Buffer trước khi lưu');
        const pb = pendingFlat.blocks[0] || { cols: 0, rows: 0 };
        flatLayout = { 
            blocks: [{ 
                name: pb.name || 'Block 1', 
                cols: Number(pb.cols) || 10, 
                rows: Number(pb.rows) || 6
            }], 
            count: 1, 
            buffer: selectedBuffer 
        };
    }
    const activeTab = document.querySelector('.tab-btn.active');
    
    // Save to Tower state if active
    if(activeTab && activeTab.id === 'tab-tower') {
        towerLayout = flatLayout; // Reuse the structure 
        // Actually, if we use the same modal, 'flatLayout' variable was modified by pendingFlat logic above.
        // Wait, lines 702/714 set 'flatLayout'.
        // So I should move 'flatLayout' content to 'towerLayout' and REVERT 'flatLayout' if needed, 
        // OR better: in lines 702/714 assigned to a temp variable, then assign to target layout based on tab.
        // But for minimal diff, I will reassign here.
        towerLayout = JSON.parse(JSON.stringify(flatLayout)); 
        // Restore flatLayout from LS to avoid overwriting it in memory? 
        // Or cleaner: Assign to correct variable logic was earlier. 
        // Let's just persist both correctly.
        try {
            localStorage.setItem(LS_KEY_TOWER, JSON.stringify(towerLayout));
        } catch(e) {}
        
        // Reload flatLayout from storage to ensure we didn't corrupt the Flat tab state?
        // Yes, if user switches back to flat, we expect flat layout.
        const raw = localStorage.getItem(LS_KEY_FLAT);
        flatLayout = raw ? JSON.parse(raw) : null;
        
        showToast('Layout kho Tower đã được lưu thành công', 'success');
        switchTab('tower'); // Will trigger renderTowerLayout
    } else {
        persistFlatLayout(); // Saves 'flatLayout' to LS_KEY_FLAT
        showToast('Layout kho Flat đã được lưu thành công', 'success');
        switchTab('flat');
        renderFlatLayout();
    }

    closeFlatBufferModal();
    const saveBtn = document.getElementById('flat-buffer-save'); 
    if(saveBtn) saveBtn.disabled = true;
    
    // Re-render handled by switchTab
}

function renderFlatLayout() {
    const renderEl = document.getElementById('flat-render'); 
    if(!renderEl) return;
    renderEl.innerHTML = '';
    const activeTab = document.querySelector('.tab-btn.active');
    // If no active tab found, assume default or proceed if possible, but safer to check.
    const isCraneTab = activeTab && activeTab.id === 'tab-crane';

    if(!flatLayout || isCraneTab) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-state-message';
        if(isCraneTab) {
             emptyMsg.style.display = 'none'; // Don't show anything here for crane
        } else {
             emptyMsg.innerText = 'Chưa có layout kho, hãy thêm layout kho';
             renderEl.appendChild(emptyMsg);
        }
        updateLayoutButton();
        return;
    }
    updateLayoutButton();
    const blocks = (flatLayout.blocks && Array.isArray(flatLayout.blocks)) ? flatLayout.blocks : (flatLayout.count ? Array.from({length:flatLayout.count}, ()=>({ cols: flatLayout.cols || 10, rows: flatLayout.rows || 6 })) : [{cols: flatLayout.cols||10, rows: flatLayout.rows||6}]);
    const wrapper = document.createElement('div'); 
    wrapper.className = 'flat-multi render-multi'; 
    wrapper.style.display = 'flex'; 
    wrapper.style.flexDirection = 'row'; 
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.gap = '16px';
    
    for(let i=0;i<blocks.length;i++){
        const b = blocks[i];
        const w = i+1;
        const cols = Number(b.cols) || 1;
        const rows = Number(b.rows) || 1;
        
        const blockContainer = document.createElement('div');
        blockContainer.className = 'layout-block-container';
        blockContainer.style.borderColor = i % 2 === 0 ? '#2563eb' : '#f97316';
        
        const blockName = document.createElement('div');
        blockName.className = 'layout-block-name';
        blockName.style.borderBottomColor = i % 2 === 0 ? '#2563eb' : '#f97316';
        blockName.innerText = (b && b.name) ? b.name : `Kho ${w}`;
        blockContainer.appendChild(blockName);
        
        const block = document.createElement('div'); 
        block.style.display='flex'; 
        block.style.flexDirection='column'; 
        block.style.alignItems='center'; 
        block.style.gap='8px';
        
        const grid = document.createElement('div'); 
        grid.className='flat-grid'; 
        grid.style.gridTemplateColumns = `repeat(${cols}, 50px)`; 
        grid.style.display='grid'; 
        grid.style.gap='8px';
        
        for(let r=1;r<=rows;r++){
            for(let c=1;c<=cols;c++){
                const cell = document.createElement('div');
                cell.className = 'flat-cell';
                cell.dataset.r = r; 
                cell.dataset.c = c; 
                cell.dataset.w = w;
                cell.innerText = '';
                cell.style.width='50px'; 
                cell.style.height='50px'; 
                cell.style.display='flex'; 
                cell.style.alignItems='center'; 
                cell.style.justifyContent='center'; 
                cell.style.border='1px solid #e6eef6'; 
                cell.style.borderRadius='6px'; 
                cell.style.cursor='default';
                cell.style.transition = 'all 0.3s ease';
                
                const buf = (flatLayout.buffers && flatLayout.buffers[w]) || flatLayout.buffer;
                if(buf && buf.r===r && buf.c===c) { 
                    cell.classList.add('buffer-cell-pulse');
                    cell.style.border = '2px solid var(--danger-color)'; 
                    cell.style.backgroundColor = '#fff5f5';
                }
                
                const status = getMockStatus(w,r,c);
                if(status==='occupied' || status==='error'){
                    const tile = document.createElement('div'); 
                    tile.style.width='28px'; 
                    tile.style.height='28px'; 
                    tile.style.borderRadius='4px'; 
                    tile.style.display='flex'; 
                    tile.style.alignItems='center'; 
                    tile.style.justifyContent='center'; 
                    tile.style.color='#fff'; 
                    tile.style.fontSize='11px'; 
                    tile.style.fontWeight='700'; 
                    tile.style.boxShadow='0 2px 6px rgba(2,6,23,0.06)'; 
                    tile.style.position='relative'; 
                    tile.style.zIndex='2'; 
                    tile.style.pointerEvents='none';
                    let palletId = '';
                    if(status==='occupied') { 
                        tile.style.background='#16a34a'; 
                        tile.innerText='A1'; 
                        tile.title='Có hàng'; 
                        palletId = 'A1';
                    } else { 
                        tile.style.background='#ef4444'; 
                        tile.innerText='A2'; 
                        tile.title='Lỗi'; 
                        palletId = 'A2';
                    }
                    cell.innerText=''; 
                    cell.style.position='relative'; 
                    cell.style.cursor='pointer';
                    const holder = document.createElement('div'); 
                    holder.style.display='flex'; 
                    holder.style.alignItems='center'; 
                    holder.style.justifyContent='center'; 
                    holder.style.width='100%'; 
                    holder.style.height='100%'; 
                    holder.appendChild(tile); 
                    cell.appendChild(holder);
                    
                    cell.addEventListener('mouseenter', (e) => showPalletCard(e, palletId));
                    cell.addEventListener('mouseleave', hidePalletCard);
                }
                grid.appendChild(cell);
            }
        }
        block.appendChild(grid); 
        blockContainer.appendChild(block);
        wrapper.appendChild(blockContainer);
    }
    renderEl.appendChild(wrapper);
}

function getMockStatus(w,r,c) {
    const v = (w*73856093) ^ (r*19349663) ^ (c*83492791);
    const n = Math.abs(v) % 100;
    if(n < 8) return 'occupied';
    if(n >= 8 && n < 12) return 'error';
    return 'empty';
}



// --- Stacker Crane Logic ---

function persistCraneLayout() {
    try {
        if(craneLayout) localStorage.setItem(LS_KEY_CRANE, JSON.stringify(craneLayout));
        else localStorage.removeItem(LS_KEY_CRANE);
    } catch(e) { console.warn(e); }
}

function openCraneEditModal() {
    let m = document.getElementById('modal-crane-edit');
    if(!m) return;
    m.style.display = 'flex';
    m.classList.add('show');
    
    // Default or existing values
    const rows = (craneLayout && craneLayout.rows) ? craneLayout.rows : 2;
    const cols = (craneLayout && craneLayout.cols) ? craneLayout.cols : 20;
    const blocks = (craneLayout && craneLayout.totalBlocks) ? craneLayout.totalBlocks : 2;
    
    document.getElementById('crane-rows').value = rows;
    document.getElementById('crane-cols').value = cols;
    document.getElementById('crane-blocks').value = blocks;
    
    previewCraneModal();
}

function previewCraneModal() {
    const rows = parseInt(document.getElementById('crane-rows').value) || 2;
    const cols = parseInt(document.getElementById('crane-cols').value) || 20;
    const totalBlocks = parseInt(document.getElementById('crane-blocks').value) || 2;
    
    const container = document.getElementById('crane-preview-modal');
    if(!container) return;
    
    container.innerHTML = '';
    container.appendChild(createCraneVisual(rows, cols, totalBlocks, false));
}

function createCraneVisual(rows, cols, totalBlocks, interactive = false) {
    // Layout: Top Blocks - Conveyor - Bottom Blocks
    // Split blocks evenly
    const topCount = Math.ceil(totalBlocks / 2);
    const bottomCount = Math.floor(totalBlocks / 2);
    
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '20px';
    wrapper.style.alignItems = 'center';
    
    // Top Side
    const topSide = document.createElement('div');
    topSide.style.display = 'flex';
    topSide.style.gap = '15px';
    for(let i=0; i<topCount; i++) {
        topSide.appendChild(createMiniBlock(`Block ${i+1}`, rows, cols, i+1, interactive));
    }
    wrapper.appendChild(topSide);
    
    // Conveyor
    const conveyor = document.createElement('div');
    conveyor.style.height = '40px';
    conveyor.style.width = '100%';
    conveyor.style.background = 'repeating-linear-gradient(45deg, #334155, #334155 10px, #475569 10px, #475569 20px)';
    conveyor.style.borderRadius = '4px';
    conveyor.style.display = 'flex';
    conveyor.style.alignItems = 'center';
    conveyor.style.justifyContent = 'center';
    conveyor.style.color = '#fff';
    conveyor.style.fontWeight = 'bold';
    conveyor.style.letterSpacing = '2px';
    conveyor.innerText = 'CONVEYOR SYSTEM';
    wrapper.appendChild(conveyor);
    
    // Bottom Side
    const bottomSide = document.createElement('div');
    bottomSide.style.display = 'flex';
    bottomSide.style.gap = '15px';
    for(let i=0; i<bottomCount; i++) {
        bottomSide.appendChild(createMiniBlock(`Block ${topCount + i + 1}`, rows, cols, topCount + i + 1, interactive));
    }
    wrapper.appendChild(bottomSide);
    
    return wrapper;
}


// Updated createMiniBlock to handle interactivity
function createMiniBlock(name, rows, cols, blockIndex, interactive) {
    const el = document.createElement('div');
    el.style.border = '1px solid #94a3b8';
    el.style.background = 'white';
    el.style.padding = '5px';
    el.style.borderRadius = '4px';
    
    const title = document.createElement('div');
    title.innerText = name;
    title.style.fontSize = '11px';
    title.style.textAlign = 'center';
    title.style.marginBottom = '2px';
    el.appendChild(title);
    
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gap = '1px';
    const pRows = Math.min(rows, 4);
    const pCols = Math.min(cols, 6);
    
    grid.style.gridTemplateColumns = `repeat(${pCols}, 8px)`;
    
    for(let i=0; i<pRows*pCols; i++) {
        const cell = document.createElement('div');
        cell.className = 'crane-cell';
        cell.style.width = '8px';
        cell.style.height = '8px';
        cell.style.background = '#e2e8f0';
        cell.style.cursor = interactive ? 'pointer' : 'default';
        
        const r = Math.floor(i / pCols) + 1;
        const c = (i % pCols) + 1;
        
        if(interactive) {
             cell.dataset.b = blockIndex; // Store block index
             cell.dataset.r = r;
             cell.dataset.c = c;
             cell.onclick = () => handleCraneBufferClick(blockIndex, r, c);
        }

        grid.appendChild(cell);
    }
    el.appendChild(grid);
    
    if(rows > 4 || cols > 6) {
        const info = document.createElement('div');
        info.innerText = `(${rows}x${cols})`;
        info.style.fontSize = '9px';
        info.style.textAlign = 'center';
        info.style.color = '#64748b';
        el.appendChild(info);
    }
    
    return el;
}

function startCraneBufferSelection() {
    const rows = parseInt(document.getElementById('crane-rows').value);
    const cols = parseInt(document.getElementById('crane-cols').value);
    const totalBlocks = parseInt(document.getElementById('crane-blocks').value);
    
    if(isNaN(rows) || isNaN(cols) || isNaN(totalBlocks)) return alert('Vui lòng nhập số hợp lệ');
    
    pendingCrane = { rows, cols, totalBlocks };
    closeCraneEditModal();
    
    document.getElementById('modal-crane-buffer').style.display = 'flex';
    document.getElementById('modal-crane-buffer').classList.add('show');
    
    renderCraneBufferPreview();
}

function renderCraneBufferPreview() {
    const container = document.getElementById('crane-buffer-preview');
    container.innerHTML = '';
    // Simplify: Just show list of blocks to pick one buffer for each?
    // Or pick 1 buffer global?
    // Let's allow picking 1 buffer cell per block (like flat layout) or just one entry point.
    // Stacker crane usually has 1 input/output per aisle.
    // Let's assume 1 buffer for the whole system for now, or per block.
    // User logic: "Chọn ô buffer".
    // I'll render clickable blocks.
    
    // Enable interactivity
    const wrapper = createCraneVisual(pendingCrane.rows, pendingCrane.cols, pendingCrane.totalBlocks, true);
    container.appendChild(wrapper);
    
    // Add instruction
    const msg = document.createElement('div');
    msg.innerText = 'Click vào tên Block HOẶC các ô để chọn làm điểm buffer (Mỗi block 1 điểm)';
    msg.style.padding = '10px';
    msg.style.textAlign = 'center';
    msg.style.color = '#3b82f6';
    msg.style.fontSize = '12px';
    container.appendChild(msg);
    
    // Highlight existing selection
    if(selectedBuffers) {
        Object.keys(selectedBuffers).forEach(blockId => {
            const sel = selectedBuffers[blockId];
            if(sel) {
               // Logic to highlight
            }
        });
    }
}

// Handler for Crane Buffer Selection inside the visual
function handleCraneBufferClick(blockIndex, r, c) {
    if(!selectedBuffers) selectedBuffers = {};
    
    // Toggle or Set? Let's say Set 1 per block.
    selectedBuffers[blockIndex] = { r, c };
    
    // Re-render highlight
    const allCells = document.querySelectorAll('#crane-buffer-preview .crane-cell');
    allCells.forEach(cell => cell.classList.remove('buffer-active'));
    
    Object.keys(selectedBuffers).forEach(bId => {
        const s = selectedBuffers[bId];
        // Find cell
        // This requires createCraneVisual to add data attributes to cells
        const target = document.querySelector(`#crane-buffer-preview .crane-cell[data-b="${bId}"][data-r="${s.r}"][data-c="${s.c}"]`);
        if(target) target.classList.add('buffer-active');
    });
    
    // Update Text
    const label = document.getElementById('crane-buffer-coord'); 
    if(label) label.innerText = `Đã chọn buffer cho ${Object.keys(selectedBuffers).length} block`;
}


function saveCraneLayout() {
    if(!pendingCrane) return;
    craneLayout = {
        rows: pendingCrane.rows,
        cols: pendingCrane.cols,
        totalBlocks: pendingCrane.totalBlocks,
        buffers: selectedBuffers // Save selections
    };
    persistCraneLayout();
    
    closeCraneBufferModal();
    switchTab('crane');
    renderStackerCraneLayout(); // Refresh view
    showToast('Layout Stacker Crane đã lưu!');
}

function closeCraneEditModal() {
    const m = document.getElementById('modal-crane-edit');
    if(m) {
        m.classList.remove('show');
        m.style.display = 'none';
    }
}

function closeCraneBufferModal() {
    const m = document.getElementById('modal-crane-buffer');
    if(m) {
        m.classList.remove('show');
        m.style.display = 'none';
    }
}

function backToCraneEditModal() {
    closeCraneBufferModal();
    openCraneEditModal();
}

// Override renderStackerCraneLayout
function renderStackerCraneLayout() {
    const container = document.getElementById('view-crane');
    if(!container) return;
    // container.classList.remove('hidden'); // Removed to respect switchTab logic
    container.innerHTML = '';
    
    if(!craneLayout) {
         container.innerHTML = `
            <div class="empty-state-message" style="width:100%; height:100%">
            Chưa có layout kho, hãy thêm layout kho            
            </div>
         `;
         return;
    }
    
    const wrapper = document.createElement('div');
    wrapper.style.padding = '40px';
    wrapper.style.background = '#f1f5f9';
    wrapper.style.borderRadius = '8px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '30px';
    
    // Reuse visual generation but with full detail?
    // Let's build a proper render here.
    
    const topCount = Math.ceil(craneLayout.totalBlocks / 2);
    const bottomCount = Math.floor(craneLayout.totalBlocks / 2);
    
    // Top
    const topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.gap = '20px';
    for(let i=0; i<topCount; i++) {
        topRow.appendChild(createFullBlock(`Block ${i+1}`, craneLayout.rows, craneLayout.cols, i+1));
    }
    wrapper.appendChild(topRow);
    
    // Animated Conveyor
    const conveyor = document.createElement('div');
    conveyor.className = 'conveyor-belt-animated';
    conveyor.id = 'crane-conveyor';
    conveyor.innerText = ''; // Clear text, using CSS animationBG
    
    // Spawn pallets logic
    startConveyorAnimation(conveyor);

    wrapper.appendChild(conveyor);
    
    // Bottom
    const botRow = document.createElement('div');
    botRow.style.display = 'flex';
    botRow.style.gap = '20px';
    for(let i=0; i<bottomCount; i++) {
        botRow.appendChild(createFullBlock(`Block ${topCount + i + 1}`, craneLayout.rows, craneLayout.cols, topCount + i + 1));
    }
    wrapper.appendChild(botRow);
    
    container.appendChild(wrapper);
}

// Animation Loop System
let conveyorInterval = null;
function startConveyorAnimation(container) {
    if(conveyorInterval) clearInterval(conveyorInterval);
    
    // Clear existing items
    const existing = container.querySelectorAll('.pallet-item-anim');
    existing.forEach(e => e.remove());
    
    const spawn = () => {
        if(!document.getElementById('view-crane') || document.getElementById('view-crane').classList.contains('hidden')) {
             return; // Stop if not visible
        }
        
        const pallet = document.createElement('div');
        pallet.className = 'pallet-item-anim';
        pallet.innerText = 'P-'+Math.floor(Math.random()*900+100);
        pallet.style.left = '100%'; // Start from right
        
        container.appendChild(pallet);
        
        // Animate manually to control position if needed, or use CSS keyframes for movement
        // Since user wants "scrolling", CSS animation on parent moves background.
        // But for items, we need to move them independently or with the flow.
        // Let's use simple JS animation for items to move Right to Left
        
        let pos = 100;
        const speed = 0.5; // % per frame approx
        
        const anim = setInterval(() => {
            if(!pallet.parentNode) { clearInterval(anim); return; }
            pos -= speed;
            pallet.style.left = pos + '%';
            
            if(pos < -10) {
                pallet.remove();
                clearInterval(anim);
            }
        }, 16);
    };
    
    conveyorInterval = setInterval(spawn, 2500);
    spawn();
}

function createFullBlock(name, rows, cols, blockId) {
    const el = document.createElement('div');
    el.className = 'layout-block-container';
    el.style.background = 'white';
    
    const title = document.createElement('div');
    title.className = 'layout-block-name';
    title.innerText = name;
    el.appendChild(title);
    
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gap = '4px';
    grid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    
    for(let r=1; r<=rows; r++) {
        for(let c=1; c<=cols; c++) {
            const cell = document.createElement('div');
            cell.style.width = '30px';
            cell.style.height = '30px';
            cell.style.border = '1px solid #e2e8f0';
            cell.style.borderRadius = '4px';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.fontSize = '8px';
            cell.style.fontWeight = '600';
            cell.style.color = '#64748b';
            
            const status = getMockStatus(blockId, r, c);
            if (status === 'occupied') {
                cell.style.background = '#22c55e';
                cell.style.color = 'white';
                cell.innerHTML = `<i class="fas fa-box" style="font-size:10px"></i>`;
            } else if (status === 'error') {
                cell.style.background = '#ef4444';
                cell.style.color = 'white';
                cell.innerHTML = `<i class="fas fa-exclamation-triangle" style="font-size:10px"></i>`;
            } else {
                cell.style.background = '#fefefe';
                cell.innerText = `${r}-${c}`;
            }
            
            // Interaction - hover card like Tower and Flat
            cell.style.cursor = 'pointer';
            const palletId = `C${blockId}-R${r}-C${c}`;
            cell.addEventListener('mouseenter', (e) => showPalletCard(e, palletId));
            cell.addEventListener('mouseleave', hidePalletCard);
            grid.appendChild(cell);
        }
    }
    el.appendChild(grid);
    return el;
}


function getMockStatus(w,r,c) {
    const v = (w*73856093) ^ (r*19349663) ^ (c*83492791);
    const n = Math.abs(v) % 100;
    if(n < 8) return 'occupied';
    if(n >= 8 && n < 12) return 'error';
    return 'empty';
}

// Initialize
const moduleMain = document.getElementById('main-view');
if(moduleMain) {
    renderWarehouseLayout(moduleMain);
    loadPersistedState();

    // If no tab was restored (first load), force render default tab (Tower)
    if (!localStorage.getItem(LS_KEY_TAB)) {
        switchTab('tower');
    }
    
    updateLayoutButton();
}