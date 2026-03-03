function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    // Persist sidebar state
    try {
        localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed') ? 'true' : 'false');
    } catch (e) { }
}

// Restore sidebar state on page load
document.addEventListener('DOMContentLoaded', function () {
    try {
        const isCollapsed = localStorage.getItem('sidebar_collapsed');
        if (isCollapsed === 'true') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.add('collapsed');
        }
    } catch (e) { }
});

function toggleSubmenu(element) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        // Update storage when expanding via submenu
        try { localStorage.setItem('sidebar_collapsed', 'false'); } catch (e) { }
    }
    const parent = element.parentElement;
    const submenu = parent.querySelector('.submenu');
    parent.classList.toggle('open');
    submenu.style.maxHeight = parent.classList.contains('open') ? submenu.scrollHeight + "px" : null;
}

function filterMenu() {
    const filter = document.getElementById('menu-search').value.toLowerCase();
    document.querySelectorAll('.menu-item').forEach(item => {
        const text = item.querySelector('.link-text').innerText.toLowerCase();
        let hasMatch = text.includes(filter);
        item.querySelectorAll('.submenu a').forEach(sub => {
            if (sub.innerText.toLowerCase().includes(filter)) { hasMatch = true; sub.style.display = "block"; }
        });
        item.style.display = hasMatch ? "" : "none";
        if (hasMatch && filter.length > 0) item.classList.add('open');
    });
}

function navigate(filePath, title, element) {
    document.getElementById('page-title').innerText = title;
    document.getElementById('app-frame').src = filePath;
    document.querySelectorAll('.submenu a').forEach(el => el.classList.remove('sub-active'));
    if (element) element.classList.add('sub-active');
}

// Backwards-compatible loader used by index.html menu items
function loadPage(title) {
    const pageTitle = document.getElementById('page-title');

    // mapping menu text -> module HTML path
    const moduleMap = {
        'Quản lý Kho': 'modules/warehouse/warehouse.html',
        'Cấu hình Kho': 'modules/warehouse/warehouse-config.html',
        'Quản lý vật chứa': 'modules/pallet/pallet.html',
        'Layout Kho': 'modules/layout/index.html',
        'Lệnh nhập kho': 'modules/inbound/inbound.html',
        'Lệnh xuất kho': 'modules/outbound/outbound.html',
        'Xác nhận nhập kho': 'modules/inbound/inbound.html',
        'Quản lý thiết bị': 'modules/master-data/device/device.html',
        'Giám sát Thiết bị': 'modules/wcs/device.html',
        'Kanban WCS': 'modules/kanbanWCS/kanban.html',
        'Sản phẩm': 'modules/master-data/product/product.html',
        'Tài khoản': 'modules/rbac/account/account.html',
        'Vai trò': 'modules/rbac/role/role.html',
        'Nhóm sản phẩm': 'modules/master-data/category/category.html',
        'Đơn vị tính': 'modules/master-data/unit-of-measure/unit.html',
        'Nhóm thiết bị': 'modules/master-data/device-type/device-type.html',
        // 'Quản lý thiết bị': 'modules/master-data/device/device.html',
        'Danh sách Quy trình': 'modules/workflow/workflow.html',
        'Quản lý bước': 'modules/workflow-step/workflow-step.html',
        'Phân hệ': 'modules/rbac/module/module.html',
        'Chức năng': 'modules/rbac/menu/menu.html',
        'Quản lý bảo trì': 'modules/maintenance/maintenance.html',
        'Quản lý Lệnh': 'modules/wcs/job/job.html',
        'Vật chứa': 'modules/master-data/pallet-list/container.html',
        'Tài nguyên': 'modules/rbac/resource/resource.html',
        'Loại vị trí': 'modules/master-data/node-type/node-type.html',
        'Thiết bị': 'modules/master-data/device-list/device-list.html',
        'Phân quyền': 'modules/rbac/permission/permission.html',
        'Dashboard tổng quan': 'modules/dashboard/general-dashboard/general.html',
        'Dashboard chi tiết': 'modules/dashboard/detail-dashboard/detail.html',
        'Hồ sơ': 'modules/info/info.html',
        'Quy cách': 'modules/master-data/method/method.html',
        'Quản lý sản phẩm': 'modules/product-method/product-method.html',
        // add more mappings here as modules are created
    };

    const mapped = moduleMap[title];
    if (mapped) {
        loadModule(mapped);
    } else {
        // fallback: render simple placeholder
        const mainView = document.getElementById('main-view');
        if (mainView) mainView.innerHTML = `<div style="padding:20px"><h2>${title}</h2><p style="color:#475569">Các chức năng của module "${title}" đang được phát triển</p></div>`;
    }

    // update sidebar active/open state
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(mi => {
        mi.classList.remove('open');
        const sm = mi.querySelector('.submenu');
        if (sm) sm.style.maxHeight = null;
    });
    document.querySelectorAll('.menu-link').forEach(ml => ml.classList.remove('active'));
    document.querySelectorAll('.submenu a').forEach(el => el.classList.remove('sub-active'));

    // Variables for Breadcrumb construction
    let parentText = '';
    let childText = title;

    // find a submenu link that matches the title (by visible text or by the onclick argument), mark it active and open its parent
    const match = Array.from(document.querySelectorAll('.submenu a')).find(el => {
        const text = el.innerText.trim();
        if (text === title) return true;

        // Special mapping for Permission Detail view to keep Role active
        // if (title === 'Phân quyền vai trò' && text === 'Vai trò') return true;

        // Special mapping for Layout Kho to keep Danh sách Kho active
        if (title === 'Layout Kho' && text === 'Danh sách Kho') return true;

        // Special mapping for Cấu hình Kho to keep Quản lý Kho active
        if (title === 'Cấu hình Kho' && text === 'Quản lý Kho') return true;

        const onclick = el.getAttribute('onclick') || '';
        if (onclick.includes(`loadPage('${title}')`)) return true; // Exact match including quotes
        if (onclick.includes(`loadPage("${title}")`)) return true; // Double quotes

        // Special mapping for Permission view to keep Role active
        if (title === 'Phân quyền' && text === 'Vai trò') return true;

        return false;
    });

    if (match) {
        match.classList.add('sub-active');
        const parentMenuItem = match.closest('.menu-item');
        if (parentMenuItem) {
            parentMenuItem.classList.add('open');
            const submenuEl = parentMenuItem.querySelector('.submenu');
            if (submenuEl) submenuEl.style.maxHeight = submenuEl.scrollHeight + 'px';
            const menuLink = parentMenuItem.querySelector('.menu-link');
            if (menuLink) {
                menuLink.classList.add('active');
                // Capture Parent Text
                const linkText = menuLink.querySelector('.link-text');
                if (linkText) parentText = linkText.innerText.trim();
            }
        }
        // If the title is "Phân quyền", force parent to "HỆ THỐNG / VAI TRÒ"
        if (title === 'Phân quyền') {
            parentText = 'Hệ thống / VAI TRÒ';
        }
    } else {
        // fallback: try to match a top-level menu link text
        const topMatch = Array.from(document.querySelectorAll('.menu-link .link-text')).find(span => span.innerText.trim() === title);
        if (topMatch) {
            const ml = topMatch.closest('.menu-link');
            if (ml) {
                ml.classList.add('active');
                // For top level, maybe we treat it as Parent only, or just Child? 
                // Let's treat it as Child text, no Parent text.
                childText = topMatch.innerText.trim();
            }
            const parent = ml ? ml.closest('.menu-item') : null;
            if (parent) {
                parent.classList.add('open');
                const submenuEl = parent.querySelector('.submenu');
                if (submenuEl) submenuEl.style.maxHeight = submenuEl.scrollHeight + 'px';
            }
        }
    }

    // --- RENDER BREADCRUMB TITLE GLOBALLY ---
    if (pageTitle) {
        // If we have a parent text, format as PARENT / CHILD
        if (parentText) {
            pageTitle.innerHTML = `
                <div class="breadcrumbs" style="display:flex; align-items:center; gap:5px;">
                    <span style="color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase;">${parentText} /</span>
                    <span style="color: #1e293b; font-size: 13px; font-weight: 700; text-transform: uppercase;">${childText}</span>
                </div>
            `;
        } else {
            // Just single level
            pageTitle.innerHTML = `
                <div class="breadcrumbs" style="display:flex; align-items:center; gap:5px;">
                    <span style="color: #1e293b; font-size: 13px; font-weight: 700; text-transform: uppercase;">${childText}</span>
                </div>
            `;
        }
    }

    // persist last opened page so it can be restored on reload
    try { localStorage.setItem('wms_last_page', title); } catch (e) { /* ignore */ }
}

// Load a module HTML (with its CSS/JS) into #main-view
async function loadModule(path) {
    const mainView = document.getElementById('main-view');
    if (!mainView) return;

    // cleanup previously injected module assets
    document.querySelectorAll('[data-module-asset]').forEach(n => n.remove());

    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error('Failed to fetch module');
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Resolve base for relative asset paths
        const base = path.replace(/[^/]+$/, '');

        // Also load inline <style> tags from module head
        const styleNodes = Array.from(doc.querySelectorAll('head style'));
        styleNodes.forEach(style => {
            const s = document.createElement('style');
            s.textContent = style.textContent;
            s.setAttribute('data-module-asset', 'true');
            document.head.appendChild(s);
        });

        // Resolve Path Function
        const resolvePath = (assetPath) => {
            if (assetPath.startsWith('http') || assetPath.startsWith('//')) return assetPath;
            if (assetPath.startsWith('/')) return assetPath; // Absolute to domain
            if (assetPath.startsWith('modules/')) return assetPath; // Already relative to root
            return base + assetPath; // Relative to module file
        };

        // Load stylesheets
        const linkNodes = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
        await Promise.all(linkNodes.map(link => {
            return new Promise(resolve => {
                const href = link.getAttribute('href');
                if (!href) { resolve(); return; }

                const fullPath = resolvePath(href);

                const l = document.createElement('link');
                l.rel = 'stylesheet';
                l.href = fullPath;
                l.setAttribute('data-module-asset', 'true');
                l.onload = () => resolve();
                l.onerror = () => {
                    console.error('Failed to load CSS:', fullPath);
                    resolve();
                };
                document.head.appendChild(l);
            });
        }));

        // Inject module content: if the module provides its own `#main-view`, inject only its inner HTML
        // and move other module-level elements (modals, tooltips) to the global document.body so
        // they are not accidentally overwritten by later render calls.
        const moduleInner = doc.querySelector('#main-view');
        if (moduleInner) {
            mainView.innerHTML = moduleInner.innerHTML;
            // append other top-level nodes (except styles/scripts and the moduleInner) to document.body
            Array.from(doc.body.children).forEach(child => {
                if (child === moduleInner) return;
                const tag = (child.tagName || '').toLowerCase();
                if (tag === 'link' || tag === 'script') return; // already handled
                const clone = document.importNode(child, true);
                clone.setAttribute('data-module-asset', 'true');
                document.body.appendChild(clone);
            });
        } else {
            // Insert body content
            mainView.innerHTML = doc.body.innerHTML;
        }

        // Execute Scripts
        const scriptNodes = Array.from(doc.querySelectorAll('script'));
        for (const script of scriptNodes) {
            const s = document.createElement('script');
            if (script.src) {
                s.src = resolvePath(script.getAttribute('src'));
            } else {
                s.textContent = script.textContent;
            }
            s.setAttribute('data-module-asset', 'true');
            document.body.appendChild(s);
        }

        // remember current module path to avoid unnecessary asset removal on re-load
        try { window.__currentModulePath = path; } catch (e) { }

        // --- Post-Load Logic for Cấu hình Kho Context ---
        if (path.includes('modules/warehouse/warehouse-config.html')) {
            // ... (keep existing warehouse-config logic)
        }

        // --- Initialize Scroll Sync for Separated Tables ---
        initTableScrollSync();

    } catch (err) {
        mainView.innerHTML = `<div style="padding:20px;color:#ef4444">Lỗi khi tải module: ${err.message}</div>`;
        console.error(err);
    }
}

/**
 * Synchronizes horizontal scrolling between .table-scroll-head and .table-scroll-body
 */
function initTableScrollSync() {
    const containers = document.querySelectorAll('.table-scroll-container');
    
    containers.forEach(container => {
        const head = container.querySelector('.table-scroll-head');
        const body = container.querySelector('.table-scroll-body');
        
        if (head && body) {
            // Sync horizontal scroll from body to head
            body.onscroll = function() {
                head.scrollLeft = body.scrollLeft;
            };
            
            // Just in case head is scrolled (though scrollbar is hidden)
            head.onscroll = function() {
                body.scrollLeft = head.scrollLeft;
            };
        }
    });
}


// Global Back Function
window.goBackRole = function () {
    localStorage.removeItem('current_role_id');
    localStorage.removeItem('current_role_name');
    if (window.loadPage) window.loadPage('Vai trò');
};

/* User Menu & Profile Modal Logic */
function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const container = document.querySelector('.user-info-container');
    if (container && !container.contains(e.target)) {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});

function openProfileModal() {
    if (window.loadPage) {
        window.loadPage('Hồ sơ');
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.classList.remove('show');
}

function saveProfile() {
    // Dummy save
    closeProfileModal();
    // Use a simple prompt or alert, or better yet, a custom toast if available.
    // For now, just alert.
    alert('Đã cập nhật thông tin hồ sơ thành công!');
}

function logout() {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) modal.classList.add('show');
}

function closeLogoutModal() {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) modal.classList.remove('show');
}

function confirmLogout() {
    closeLogoutModal();
    // Dummy logout success
    showToast('Đăng xuất thành công!', 'success');
}

/* Change Password Logic */
function openChangePasswordModal() {
    const modal = document.getElementById('change-password-modal');
    if (modal) {
        // Reset inputs
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';

        modal.classList.add('show');
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) dropdown.classList.remove('show');

        // Reset validation UI
        const reqs = document.querySelectorAll('.requirement');
        reqs.forEach(req => {
            req.classList.remove('success', 'error');
            const icon = req.querySelector('i');
            if (icon) icon.className = 'fas fa-circle';
        });
        const btn = document.getElementById('btn-update-password');
        if (btn) btn.disabled = true;
    }
}


function closeChangePasswordModal() {
    const modal = document.getElementById('change-password-modal');
    if (modal) modal.classList.remove('show');
}

function onInputPassword(input) {
    // 1. Prevent spaces in real-time
    input.value = input.value.replace(/\s/g, '');
    
    const val = input.value;
    
    // 2. Validate Requirements
    const requirements = {
        'req-length': val.length >= 8,
        'req-upper': /[A-Z]/.test(val),
        'req-number': /[0-9]/.test(val),
        'req-special': /[!@#$%^&*(),.?":{}|<>]/.test(val)
    };

    let allValid = true;
    for (const [id, valid] of Object.entries(requirements)) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle('success', valid);
            el.classList.toggle('error', !valid && val.length > 0);
            
            const icon = el.querySelector('i');
            if(icon) {
                icon.className = valid ? 'fas fa-check-circle' : 'fas fa-circle';
            }
        }
        if (!valid) allValid = false;
    }

    // 3. Enable/Disable Submit Button
    const btn = document.getElementById('btn-update-password');
    if (btn) btn.disabled = !allValid;
    
    return allValid;
}

function updatePassword(event) {
    if (event) event.preventDefault(); // Prevent form submission refresh

    const currentPass = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;

    if (!currentPass || !newPass || !confirmPass) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    // Complexity Validation (Final Check)
    const isComplex = 
        newPass.length >= 8 && 
        /[A-Z]/.test(newPass) && 
        /[0-9]/.test(newPass) && 
        /[!@#$%^&*(),.?":{}|<>]/.test(newPass);

    if (!isComplex) {
        showToast('Mật khẩu mới không đáp ứng yêu cầu bảo mật!', 'error');
        return;
    }

    if (newPass !== confirmPass) {
        showToast('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }

    // Dummy success
    closeChangePasswordModal();
    showToast('Cập nhật mật khẩu thành công!', 'success');
}


/* Toast Notification - Green themed with progress bar */
function showToast(message, type = 'success') {
    let container = document.querySelector('.app-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'app-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `app-toast ${type}`;

    // Icon based on type
    let iconClass = 'fa-check-circle';
    let progressColor = 'linear-gradient(90deg, #22c55e, #16a34a)';
    if (type === 'error') {
        iconClass = 'fa-exclamation-circle';
        progressColor = 'linear-gradient(90deg, #ef4444, #dc2626)';
    } else if (type === 'warning') {
        iconClass = 'fa-exclamation-triangle';
        progressColor = 'linear-gradient(90deg, #f59e0b, #d97706)';
    } else if (type === 'info') {
        iconClass = 'fa-info-circle';
        progressColor = 'linear-gradient(90deg, #3b82f6, #2563eb)';
    }

    toast.innerHTML = `
        <i class="fas ${iconClass}" style="font-size: 18px;"></i>
        <span style="flex: 1;">${message}</span>
        <div class="app-toast-progress"></div>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    });

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }, 3000);
}

/* FACTORY SELECTION LOGIC */
const factories = [
    { code: 'CSC', name: 'CÔNG TY THÉP' },
    { code: 'INDUSTRIES', name: 'CÔNG TY TNHH TẬP ĐOÀN CÔNG NGHIỆP TRƯỜNG HẢI' },
    { code: 'VAM', name: 'CÔNG TY TNHH SẢN XUẤT MÁY LẠNH Ô TÔ VINA' },
    { code: 'TACB', name: 'CÔNG TY LINH KIỆN KHUNG THÂN VỎ Ô TÔ' },
    { code: 'LAPRO', name: 'CÔNG TY BẢO HỘ LAO ĐỘNG' },
    { code: 'TOMCDD', name: 'CÔNG TY THIẾT BỊ CƠ KHÍ DÂN DỤNG' },
    { code: 'TUC', name: 'CÔNG TY THACO INDUSTRIES TẠI MỸ' },
    { code: 'DA', name: 'DỰ ÁN MỚI' },
    { code: 'CTMC', name: 'CÔNG TY CƠ KHÍ CHÍNH XÁC & KHUÔN MẪU' },
    { code: 'CASF', name: 'CÔNG TY KEO & DUNG DỊCH CHUYÊN DỤNG' },
    { code: 'TIP', name: 'CÔNG TY NHỰA CÔNG NGHIỆP' },
    { code: 'M&E', name: 'CÔNG TY CƠ ĐIỆN' },
    { code: 'VPĐH', name: 'VPĐH THACO INDUSTRIES' },
    { code: 'TOMC', name: 'CÔNG TY TNHH TỔ HỢP CƠ KHÍ THACO (TOMC)' },
    { code: 'TCMC', name: 'CÔNG TY TNHH TỔ HỢP CƠ KHÍ THACO CHU LAI (TCMC)' },
    { code: 'TSEC', name: 'CÔNG TY THIẾT BỊ CHUYÊN DỤNG' },
    { code: 'CPM', name: 'CÔNG TY BAO BÌ' },
    { code: 'TAI', name: 'CÔNG TY NỘI THẤT Ô TÔ TẢI, BUS' },
    { code: 'CASC', name: 'CÔNG TY NHÍP Ô TÔ' },
    { code: 'TPC', name: 'CÔNG TY LINH KIỆN NHỰA' },
    { code: 'TACC', name: 'CÔNG TY MÁY LẠNH Ô TÔ TẢI, BUS' },
    { code: 'AEE', name: 'CÔNG TY TNHH SẢN XUẤT THIẾT BỊ ĐIỆN Ô TÔ' },
    { code: 'AUTOCOM', name: 'CÔNG TY GHẾ Ô TÔ DU LỊCH' },
    { code: 'R&D', name: 'TRUNG TÂM R&D - INDUSTRIES' },
    { code: 'TMC', name: 'CÔNG TY TNHH TỔ HỢP CƠ KHÍ THACO (TMC)' },
    { code: 'AIM', name: 'CÔNG TY TNHH SẢN XUẤT NỘI THẤT Ô TÔ' },
    { code: 'CAG', name: 'CÔNG TY KÍNH Ô TÔ' },
    { code: 'TCSC', name: 'CÔNG TY TNHH MỘT THÀNH VIÊN GIA CÔNG THÉP CHU LAI - TRƯỜNG HẢI' },
    { code: 'CCMC', name: 'CÔNG TY COMPOSITE' },
    { code: 'TAG', name: 'CÔNG TY KÍNH CAO CẤP' },
    { code: 'TITS', name: 'CÔNG TY SX SMRM & CẤU KIỆN NẶNG' },
    { code: 'AEC', name: 'CÔNG TY TNHH SẢN XUẤT PHỤ TÙNG ĐIỆN Ô TÔ' },
    { code: 'CTSV', name: 'CÔNG TY SX XE CHUYÊN DỤNG' }
];

let currentFactoryCode = 'TOMC';

function initFactorySelector() {
    // Try to load from storage
    const stored = localStorage.getItem('currentFactoryCode');
    if (stored) currentFactoryCode = stored;

    updateFactoryUI();
    renderFactoryList();

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        const container = document.querySelector('.factory-selector-container');
        if (container && !container.contains(e.target)) {
            const dropdown = document.getElementById('factory-dropdown');
            if (dropdown) dropdown.classList.remove('show');
        }
    });
}

function updateFactoryUI() {
    const factory = factories.find(f => f.code === currentFactoryCode) || factories[0];
    const codeEl = document.getElementById('current-factory-code');
    const nameEl = document.getElementById('current-factory-name');

    if (codeEl) codeEl.innerText = factory.code;
    if (nameEl) {
        nameEl.innerText = factory.name;
        nameEl.title = factory.name; // Tooltip for long names
    }
}

function toggleFactoryMenu() {
    const dropdown = document.getElementById('factory-dropdown');
    // Close other menus if needed
    if (document.getElementById('notification-dropdown'))
        document.getElementById('notification-dropdown').classList.remove('show');
    if (document.getElementById('user-dropdown'))
        document.getElementById('user-dropdown').classList.remove('show');

    if (dropdown) {
        dropdown.classList.toggle('show');
        if (dropdown.classList.contains('show')) {
            const input = document.getElementById('factory-search-input');
            if (input) {
                input.value = '';
                input.focus();
                filterFactories(); // Reset list
            }
        }
    }
}

function renderFactoryList(filter = '') {
    const list = document.getElementById('factory-list');
    if (!list) return;

    const term = filter.toLowerCase();
    const filtered = factories.filter(f =>
        f.code.toLowerCase().includes(term) ||
        f.name.toLowerCase().includes(term)
    );

    if (filtered.length === 0) {
        list.innerHTML = '<div style="padding:15px; text-align:center; color:#94a3b8; font-size:13px;">Không tìm thấy kết quả</div>';
        return;
    }

    list.innerHTML = filtered.map(f => `
        <div class="factory-item ${f.code === currentFactoryCode ? 'selected' : ''}" onclick="selectFactory('${f.code}')">
            <span class="f-code">${f.code}</span>
            <span class="f-name">${f.name}</span>
        </div>
    `).join('');
}

function filterFactories() {
    const input = document.getElementById('factory-search-input');
    if (input) renderFactoryList(input.value);
}

function selectFactory(code) {
    currentFactoryCode = code;
    localStorage.setItem('currentFactoryCode', code);
    updateFactoryUI();
    renderFactoryList(); // Re-render to update selected state
    toggleFactoryMenu(); // Close
    // Optional: Reload page or trigger event
    // window.location.reload();
}

// Ensure init is called
document.addEventListener('DOMContentLoaded', initFactorySelector);

/* Notification Logic */
let notifications = [
    { id: 1, title: 'Cảnh báo tồn kho', desc: 'sản phẩm VT001 sắp hết hàng (còn 5)', time: '10 phút trước', read: false },
    { id: 2, title: 'Nhập kho thành công', desc: 'Phiếu nhập PN005 đã được xác nhận', time: '1 giờ trước', read: false },
    { id: 3, title: 'Bảo trì hệ thống', desc: 'Hệ thống sẽ bảo trì vào 22:00 hôm nay', time: '2 giờ trước', read: true },
    { id: 4, title: 'Yêu cầu phê duyệt', desc: 'Có 2 lệnh xuất kho chờ duyệt', time: '5 giờ trước', read: true }
];

function initNotifications() {
    renderNotifications();
}

function renderNotifications() {
    const list = document.getElementById('notification-list');
    const badge = document.getElementById('notification-count');

    if (!list || !badge) return;

    // Count unread
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
        badge.innerText = unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }

    if (notifications.length === 0) {
        list.innerHTML = '<div class="empty-notification">Không có thông báo mới</div>';
        return;
    }

    list.innerHTML = notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}" onclick="readNotification(${n.id})">
            <div class="notification-title">
                ${n.title}
                <span class="notification-time">${n.time}</span>
            </div>
            <div class="notification-desc">${n.desc}</div>
        </div>
    `).join('');
}

function toggleNotificationMenu() {
    const dropdown = document.getElementById('notification-dropdown');
    // Close user dropdown if open
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown) userDropdown.classList.remove('show');

    if (dropdown) dropdown.classList.toggle('show');
}

function readNotification(id) {
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) {
        notif.read = true;
        renderNotifications();
    }
}

function markAllRead() {
    notifications.forEach(n => n.read = true);
    renderNotifications();
    showToast('Đã đọc tất cả thông báo', 'success');
}

function clearAllNotifications() {
    const popover = document.getElementById('confirm-clear-popover');
    if (popover) {
        popover.classList.add('show');
    }
}

function hideClearConfirm() {
    const popover = document.getElementById('confirm-clear-popover');
    if (popover) {
        popover.classList.remove('show');
    }
}

function executeClearAll() {
    notifications = [];
    renderNotifications();
    showToast('Đã xóa tất cả thông báo', 'success');
    hideClearConfirm();

    // Optional: Close dropdown after clearing
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) dropdown.classList.remove('show');
}

function refreshNotifications(btn) {
    // 1. Animation for button
    if (btn) {
        const icon = btn.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
    }

    // 2. Show loading state in list
    const list = document.getElementById('notification-list');
    if (list) {
        list.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 40px 20px; color:#94a3b8; gap:10px;">
                <i class="fas fa-circle-notch fa-spin" style="font-size:24px; color:#3b82f6;"></i>
                <span style="font-size:13px;">Đang làm mới...</span>
            </div>
        `;
    }

    // 3. Simulate Network Delay (1.5s)
    setTimeout(() => {
        // Stop animation
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) icon.classList.remove('fa-spin');
        }

        // Restore list (Mock refreshing functionality)
        // In a real app, this would fetch new data. Here we just re-render.
        renderNotifications();

        // Show Toast
        showToast('Đã làm mới thông báo', 'success');
    }, 600);
}

// Close notification dropdown when clicking outside
document.addEventListener('click', (e) => {
    const container = document.querySelector('.notification-container');
    if (container && !container.contains(e.target)) {
        const dropdown = document.getElementById('notification-dropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});

// Initialize on load
// Initialize on load
document.addEventListener('DOMContentLoaded', function () {
    initNotifications();

    // Restore Last Page if exists
    try {
        const lastPage = localStorage.getItem('wms_last_page');
        if (lastPage) {
            // Check if active view override exists (for workflow config specifically)
            // Actually loadPage triggers workflow which handles the override check.
            // Just loading the page is enough.
            loadPage(lastPage);
        } else {
            // Default page if none
            loadPage('Dashboard Tổng quan');
        }
    } catch (e) {
        console.error("Restoration error:", e);
    }
});

