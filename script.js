// Auth Guard & URL Cleaner
(function() {
    // 1. Clean URL: Remove 'index.html' from address bar
    const path = window.location.pathname;
    if (path.endsWith('index.html')) {
        const cleanPath = path.substring(0, path.lastIndexOf('/') + 1);
        window.history.replaceState(null, '', cleanPath + window.location.search);
    }

    // 2. Auth Guard: Redirect to login if not authenticated
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'modules/login/';
    }
})();

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = document.querySelector('.toggle-btn i');
    
    // Close any open flyout before toggling
    if (typeof closeCollapsedFlyout === 'function') closeCollapsedFlyout();
    sidebar.classList.toggle('collapsed');
    
    // Update icon based on state
    if (toggleIcon) {
        if (sidebar.classList.contains('collapsed')) {
            toggleIcon.classList.remove('fa-outdent');
            toggleIcon.classList.add('fa-indent');
        } else {
            toggleIcon.classList.remove('fa-indent');
            toggleIcon.classList.add('fa-outdent');
        }
    }

    // Persist sidebar state
    try {
        localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed') ? 'true' : 'false');
    } catch (e) { }
}

// Restore sidebar state immediately to prevent flash
try {
    const isCollapsed = localStorage.getItem('sidebar_collapsed');
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = document.querySelector('.toggle-btn i');
    
    // Default to collapsed if no preference is saved
    if (sidebar && isCollapsed === 'false') {
        sidebar.classList.remove('collapsed');
        if (toggleIcon) {
            toggleIcon.classList.remove('fa-indent');
            toggleIcon.classList.add('fa-outdent');
        }
    } else if (sidebar) {
        sidebar.classList.add('collapsed');
        if (toggleIcon) {
            toggleIcon.classList.remove('fa-outdent');
            toggleIcon.classList.add('fa-indent');
        }
    }
    // Remove the blocking style from <head> if it exists
    const preStyle = document.getElementById('pre-collapse');
    if (preStyle) preStyle.remove();
} catch (e) { }

// Handle DOMContentLoaded for global tasks
document.addEventListener('DOMContentLoaded', function () {
    // Handle transition overlay
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay && overlay.classList.contains('active')) {
        setTimeout(() => {
            overlay.classList.add('fade-out');
            // Remove pointer events after transition to allow interaction
            setTimeout(() => {
                overlay.classList.remove('active', 'fade-out');
                overlay.style.display = 'none';
            }, 500);
        }, 100);
    } else if (overlay) {
        overlay.style.display = 'none';
    }

    // Display current user
    const currentUser = localStorage.getItem('currentUser') || 'Minh Hưng';
    const profileNames = document.querySelectorAll('.user-info span, .header-name');
    profileNames.forEach(el => {
        if (el.classList.contains('header-name')) {
            el.innerText = currentUser;
        } else if (el.tagName === 'SPAN') {
            el.innerText = currentUser;
        }
    });
});

function toggleSubmenu(element) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('collapsed')) {
        // Show flyout popup instead of expanding sidebar
        showCollapsedFlyout(element);
        return;
    }
    const parent = element.parentElement;
    const submenu = parent.querySelector('.submenu');
    parent.classList.toggle('open');
    submenu.style.maxHeight = parent.classList.contains('open') ? submenu.scrollHeight + "px" : null;
}

let flyoutTimeout = null;

/**
 * Shows a flyout popup next to the clicked menu item when sidebar is collapsed.
 */
function showCollapsedFlyout(menuLinkElement) {
    // Clear any existing close timeout
    if (flyoutTimeout) {
        clearTimeout(flyoutTimeout);
        flyoutTimeout = null;
    }

    // Remove any existing flyout if it's not for this element
    const existing = document.getElementById('sidebar-flyout');
    if (existing) {
        if (menuLinkElement.classList.contains('flyout-active')) {
            return; // Already showing for this element
        }
        closeCollapsedFlyout();
    }

    const menuItem = menuLinkElement.parentElement;
    const submenu = menuItem.querySelector('.submenu');
    if (!submenu) return;

    // Get the submenu links (visible ones only)
    const links = Array.from(submenu.querySelectorAll('a')).filter(a => a.style.display !== 'none');
    if (links.length === 0) return;

    // Get module title
    const linkText = menuLinkElement.querySelector('.link-text');
    const title = linkText ? linkText.innerText.trim() : '';

    // Create flyout container
    const flyout = document.createElement('div');
    flyout.className = 'sidebar-flyout';
    flyout.id = 'sidebar-flyout';

    // Title
    const titleEl = document.createElement('div');
    titleEl.className = 'sidebar-flyout-title';
    titleEl.textContent = title;
    flyout.appendChild(titleEl);

    // Links
    links.forEach(link => {
        const item = document.createElement('div');
        item.className = 'sidebar-flyout-item';
        if (link.classList.contains('sub-active')) {
            item.classList.add('active');
        }

        // Clone icon
        const icon = link.querySelector('i');
        if (icon) {
            item.appendChild(icon.cloneNode(true));
        }

        const span = document.createElement('span');
        span.textContent = link.innerText.trim();
        item.appendChild(span);

        // Click handler
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            closeCollapsedFlyout();
            link.click();
        });

        flyout.appendChild(item);
    });

    // Position the flyout next to the menu item
    const sidebar = document.getElementById('sidebar');
    const sidebarRect = sidebar.getBoundingClientRect();
    const itemRect = menuLinkElement.getBoundingClientRect();

    flyout.style.position = 'fixed';
    flyout.style.left = (sidebarRect.right + 10) + 'px';
    flyout.style.top = itemRect.top + 'px';
    flyout.style.zIndex = '2000';

    document.body.appendChild(flyout);

    // Adjust if flyout overflows viewport bottom
    requestAnimationFrame(() => {
        const flyoutRect = flyout.getBoundingClientRect();
        if (flyoutRect.bottom > window.innerHeight - 10) {
            flyout.style.top = Math.max(10, window.innerHeight - flyoutRect.height - 10) + 'px';
        }
    });

    // Mark the menu item as having an active flyout
    menuLinkElement.classList.add('flyout-active');

    // Add hover listeners to the flyout to keep it open
    flyout.addEventListener('mouseenter', () => {
        if (flyoutTimeout) {
            clearTimeout(flyoutTimeout);
            flyoutTimeout = null;
        }
    });

    flyout.addEventListener('mouseleave', () => {
        flyoutTimeout = setTimeout(() => {
            closeCollapsedFlyout();
        }, 300);
    });

    // Close flyout when clicking outside
    setTimeout(() => {
        document.addEventListener('click', _closeFlyoutOnClickOutside);
    }, 10);
}

function _closeFlyoutOnClickOutside(e) {
    const flyout = document.getElementById('sidebar-flyout');
    if (flyout && !flyout.contains(e.target)) {
        // Also check if clicking another menu-link in collapsed mode (will open new flyout)
        const isMenuLink = e.target.closest('.menu-link');
        if (!isMenuLink) {
            closeCollapsedFlyout();
        }
    }
}

function closeCollapsedFlyout() {
    const existing = document.getElementById('sidebar-flyout');
    if (existing) existing.remove();
    document.querySelectorAll('.menu-link.flyout-active').forEach(el => el.classList.remove('flyout-active'));
    document.removeEventListener('click', _closeFlyoutOnClickOutside);
    
    if (flyoutTimeout) {
        clearTimeout(flyoutTimeout);
        flyoutTimeout = null;
    }
}

/**
 * Initializes hover events for sidebar items to show flyout in collapsed mode.
 */
function initSidebarHover() {
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar.classList.contains('collapsed')) {
                const submenu = this.parentElement.querySelector('.submenu');
                if (!submenu) return;
                
                showCollapsedFlyout(this);
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar.classList.contains('collapsed')) {
                flyoutTimeout = setTimeout(() => {
                    closeCollapsedFlyout();
                }, 300);
            }
        });
    });
}

/**
 * Re-orders the sidebar menu items based on a provided list of module codes.
 * @param {string[]} moduleOrderList - Array of module codes in the new order.
 */
function refreshSidebarOrder(moduleOrderList) {
    const menuList = document.getElementById('menu-list');
    if (!menuList || !moduleOrderList || moduleOrderList.length === 0) return;

    // Get all current menu items
    const menuItems = Array.from(menuList.querySelectorAll('.menu-item'));
    
    // Check which items are actually handled (to avoid duplicate orderings)
    const sortedItems = [];
    
    // First, place items that are in the order list
    moduleOrderList.forEach(code => {
        const item = menuItems.find(el => el.dataset.module === code);
        if (item) sortedItems.push(item);
    });

    // Then, append any items that weren't in the list
    menuItems.forEach(item => {
        if (!sortedItems.includes(item)) {
            sortedItems.push(item);
        }
    });

    // Re-append to the DOM in new order
    sortedItems.forEach(item => {
        menuList.appendChild(item);
    });

    // Persist order in LocalStorage
    try {
        localStorage.setItem('sidebar_module_order', JSON.stringify(moduleOrderList));
    } catch (e) { console.warn('Failed to persist sidebar order', e); }
}

/**
 * Restores sidebar order from LocalStorage.
 */
function restoreSidebarOrder() {
    try {
        const storedOrder = localStorage.getItem('sidebar_module_order');
        if (storedOrder) {
            const orderList = JSON.parse(storedOrder);
            refreshSidebarOrder(orderList);
        }
    } catch (e) { /* ignore */ }
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
        'Quản lý kho': 'modules/warehouse/warehouse.html',
        'Cấu hình Kho': 'modules/warehouse/warehouse-config.html',
        'Quản lý vật chứa': 'modules/pallet/pallet.html',
        'Layout Kho': 'modules/layout/index.html',
        'Lệnh nhập kho': 'modules/inbound/inbound.html',
        'Lệnh xuất kho': 'modules/outbound/outbound.html',
        'Xác nhận nhập kho': 'modules/inbound/inbound.html',
        'Quản lý thiết bị': 'modules/master-data/device-list/device-list.html',
        'Giám sát Thiết bị': 'modules/wcs/device.html',
        'Kanban lệnh': 'modules/kanbanWCS/kanban.html',
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
        'Vật chứa': 'modules/new-container/new-cont.html',
        'Tài nguyên': 'modules/rbac/resource/resource.html',
        'Loại khu vực': 'modules/master-data/node-type/node-type.html',
        // 'Thiết bị': 'modules/master-data/device-list/device-list.html',
        'Phân quyền': 'modules/rbac/permission/permission.html',
        'Dashboard tổng quan': 'modules/dashboard/general-dashboard/general.html',
        'Dashboard chi tiết': 'modules/dashboard/detail-dashboard/detail.html',
        'Hồ sơ': 'modules/info/info.html',
        'Quy cách': 'modules/master-data/method/method.html',
        'Quy cách sản phẩm': 'modules/product-method/product-method.html',
        'Báo cáo Nhập/Xuất': 'modules/statistic/statistic.html',
        'Giám sát hoạt động': 'modules/new-layout/new.html',
        // 'Giao diện kho mới': 'modules/new-layout/new.html',
        'Quản lý lô hàng': 'modules/batch/batch.html',
        'Nhóm vật chứa': 'modules/master-data/container-group/container-group.html',
        'Loại xe': 'modules/bus/bus.html',
        'Dòng sản phẩm': 'modules/product-line/line.html',
        'Xưởng đóng gói': 'modules/package-station/station.html',
        'Khách hàng': 'modules/customer/customer.html',
        'Thị trường': 'modules/master-data/market/market.html',
        'Đơn hàng ERP': 'modules/order/receive/receive.html',
        // 'Đơn hàng xuất': 'modules/order/send/send.html',
        'Theo dõi tồn kho': 'modules/instock/instock.html',
        'Kiểm kê nhập xuất': 'modules/check/check.html'
        // 'Vật chứa mới': 'modules/new-container/new-cont.html',
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

        // Special mapping for Cấu hình Kho to keep Danh sách Kho active
        if (title === 'Cấu hình Kho' && text === 'Danh sách Kho') return true;

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

        // Use the menu item's text for child breadcrumb by default
        childText = match.innerText.trim();

        // If the title is "Phân quyền", force parent to "HỆ THỐNG / VAI TRÒ"
        if (title === 'Phân quyền') {
            parentText = 'Hệ thống / VAI TRÒ';
        }

        // Special Breadcrumb for Cấu hình Kho
        if (title === 'Cấu hình Kho') {
            parentText = 'Danh sách Kho';
            childText = 'Cấu hình Kho';
        }

        // Special Breadcrumb for Layout Kho
        if (title === 'Layout Kho') {
            parentText = 'Danh sách Kho';
            childText = 'Layout Kho';
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

/**
 * Updates sidebar visibility based on module status in localStorage
 */
function updateSidebarVisibility() {
    try {
        const statusRaw = localStorage.getItem('wms_module_status');
        if (!statusRaw) return;
        
        const status = JSON.parse(statusRaw);
        
        // Update top-level menu items
        document.querySelectorAll('.menu-item[data-module]').forEach(item => {
            const moduleCode = item.getAttribute('data-module');
            if (status[moduleCode] === false) {
                item.style.display = 'none';
            } else {
                item.style.display = '';
            }
        });
        
        // Update submenus
        document.querySelectorAll('.submenu a').forEach(link => {
            const code = link.getAttribute('data-code');
            if (!code) return;

            if (status[code] === false) {
                link.style.display = 'none';
            } else {
                link.style.display = '';
            }
        });
    } catch (e) {
        console.warn('Failed to update sidebar visibility', e);
    }
}

// Initial update
document.addEventListener('DOMContentLoaded', updateSidebarVisibility);
window.updateSidebarVisibility = updateSidebarVisibility;

// Load a module HTML (with its CSS/JS) into #main-view
async function loadModule(path) {
    const mainView = document.getElementById('main-view');
    if (!mainView) return;

    // --- Cleanup Mechanism ---
    // If the previous module registered a cleanup function, call it now.
    // This prevents background loops, intervals, and memory leaks.
    if (typeof window.destroyModule === 'function') {
        try {
            window.destroyModule();
        } catch (e) {
            console.warn('Error during module cleanup:', e);
        }
        window.destroyModule = null;
    }

    // cleanup previously injected module assets
    document.querySelectorAll('[data-module-asset]').forEach(n => n.remove());

    try {
        const res = await fetch(`${path}?_v=${Date.now()}`);
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

        // Load stylesheets and scripts
        const linkNodes = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
        const scriptNodes = Array.from(doc.querySelectorAll('script'));

        // Strip link and script tags from the document to prevent the browser from 
        // attempting to load them with incorrect relative paths when setting innerHTML.
        // These assets are handled explicitly with resolved paths.
        doc.querySelectorAll('link[rel="stylesheet"], script').forEach(el => el.remove());

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
    
    // Trigger Sakura transition for logout
    createSakuraTransition(() => {
        // Set transition flag for the next page load
        sessionStorage.setItem('sakura_transitioning', 'true');
        
        // Clear session data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'modules/login/';
    });
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
    { id: 1, title: 'Cảnh báo tồn kho', desc: 'Sản phẩm Chuối Trung Quốc - A456 - TROPICAL sắp hết hàng (còn 5 thùng)', time: '10 phút trước', read: false },
    { id: 2, title: 'Nhập kho thành công', desc: 'Phiếu nhập PN005 (Chuối Nhật Bản - 26CP - DEL MONTE) đã được xác nhận', time: '1 giờ trước', read: false },
    { id: 3, title: 'Bảo trì hệ thống', desc: 'Hệ thống Robot sẽ bảo trì vào 22:00 hôm nay', time: '2 giờ trước', read: true },
];
let currentNotificationFilter = 'all';

function initNotifications() {
    renderNotifications();
}

function switchNotificationTab(filter) {
    currentNotificationFilter = filter;
    
    // Update UI
    const tabs = document.querySelectorAll('.notification-tab');
    tabs.forEach(tab => {
        if (tab.innerText.toLowerCase().includes(filter === 'all' ? 'tất cả' : 'chưa đọc')) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
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

    // Filter notifications
    const filtered = currentNotificationFilter === 'unread' 
        ? notifications.filter(n => !n.read)
        : notifications;

    if (filtered.length === 0) {
        const msg = currentNotificationFilter === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo mới';
        list.innerHTML = `<div class="empty-notification">${msg}</div>`;
        return;
    }

    list.innerHTML = filtered.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}" onclick="readNotification(${n.id})">
            <div class="notification-item-content">
                <div class="notification-title">
                    ${n.title}
                    <span class="notification-time">${n.time}</span>
                </div>
                <div class="notification-desc">${n.desc}</div>
            </div>
            <div class="notification-item-actions">
                <div class="notif-action-btn nav-btn" title="Xem chi tiết" onclick="navigateNotification(${n.id}, event)">
                    <i class="fa-solid fa-location-arrow"></i>
                </div>
                <div class="notif-action-btn delete-btn" title="Xóa thông báo" onclick="deleteNotification(${n.id}, event)">
                    <i class="fa-regular fa-trash-can"></i>
                </div>
            </div>
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

function deleteNotification(id, event) {
    if (event) event.stopPropagation();
    notifications = notifications.filter(n => n.id !== id);
    renderNotifications();
    showToast('Đã xóa thông báo', 'success');
}

function navigateNotification(id, event) {
    if (event) event.stopPropagation();
    const notif = notifications.find(n => n.id === id);
    if (notif) {
        // Navigation based on title
        if (notif.title.includes('tồn kho')) {
            loadPage('Theo dõi tồn kho');
        } else if (notif.title.includes('Nhập kho')) {
            loadPage('Lệnh nhập kho');
        } else if (notif.title.includes('Bảo trì')) {
            loadPage('Quản lý bảo trì');
        } else if (notif.title.includes('xuất kho')) {
            loadPage('Lệnh xuất kho');
        } else {
            showToast('Chức năng điều hướng đang được cập nhật', 'info');
        }
        
        // Mark as read if it wasn't
        readNotification(id);
        
        // Close dropdown
        const dropdown = document.getElementById('notification-dropdown');
        if (dropdown) dropdown.classList.remove('show');
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
    const containers = document.querySelectorAll('.notification-container');
    let clickedInsideNotification = false;
    containers.forEach(c => {
        if (c.contains(e.target)) clickedInsideNotification = true;
    });
    if (!clickedInsideNotification) {
        const dropdown = document.getElementById('notification-dropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});

// Initialize on load
// Initialize on load
document.addEventListener('DOMContentLoaded', function () {
    initNotifications();
    restoreSidebarOrder();
    initSidebarHover();

    // Show Login Success Toast if flag exists
    if (localStorage.getItem('showLoginSuccess') === 'true') {
        setTimeout(() => {
            showToast('Đăng nhập thành công', 'success');
            localStorage.removeItem('showLoginSuccess');
        }, 500); // Small delay to let initial UI settle
    }

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
            loadPage('Giám sát hoạt động');
        }
    } catch (e) {
        console.error("Restoration error:", e);
    }
});

/**
 * Global Sakura Transition Orchestrator
 * @param {Function} callback - Function to execute after the burst animation and flash.
 */
function createSakuraTransition(callback) {
    // Check if blossom effect is active
    const blossomsActive = localStorage.getItem('blossomsActive') === 'true';
    
    if (!blossomsActive) {
        if (callback) callback();
        return;
    }

    const container = document.createElement('div');
    container.className = 'sakura-transition-container active';
    document.body.appendChild(container);

    const flash = document.createElement('div');
    flash.className = 'sakura-flash';
    document.body.appendChild(flash);

    const petalCount = 150;
    const petals = [];

    // Jump straight to Vortex (Tornado)
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        const petalType = Math.floor(Math.random() * 8) + 1;
        petal.className = `transition-petal petal-${petalType} vortex`;
        
        // Random orbit properties
        const radius = 20 + Math.random() * 40; 
        const angle = Math.random() * 360;
        
        petal.style.setProperty('--radius', `${radius}vw`);
        petal.style.setProperty('--angle', `${angle}deg`);
        petal.style.animationDelay = `${i * 0.01}s`;
        
        container.appendChild(petal);
        petals.push(petal);
    }

    // Phase 2: After duration of Tornado, Gather to Center
    setTimeout(() => {
        petals.forEach(petal => {
            petal.classList.remove('vortex');
            petal.style.setProperty('--current-angle', petal.style.getPropertyValue('--angle'));
            
            void petal.offsetWidth;
            petal.classList.add('gathering');
            petal.style.animationDelay = '0s';
        });

        // Phase 3: Burst and Redirect
        setTimeout(() => {
            petals.forEach(petal => {
                petal.classList.remove('gathering');
                
                const burstAngle = Math.random() * Math.PI * 2;
                const distance = 120 + Math.random() * 100;
                const endX = Math.cos(burstAngle) * distance;
                const endY = Math.sin(burstAngle) * distance;
                
                petal.style.setProperty('--end-x', `${endX}vw`);
                petal.style.setProperty('--end-y', `${endY}vh`);
                
                void petal.offsetWidth;
                petal.classList.add('bursting');
            });

            flash.classList.add('active');

            setTimeout(() => {
                if (callback) callback();
            }, 450);

        }, 1100); // Gather duration

    }, 3200); // Tornado duration
}

/**
 * Takes a screenshot of the entire interface and downloads it.
 */
async function takeScreenshot() {
    const btn = document.getElementById('btn-screenshot');
    const icon = btn ? btn.querySelector('i') : null;
    
    // 1. Show loading state
    if (icon) {
        icon.className = 'fas fa-spinner fa-spin';
    }
    if (btn) {
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.7';
    }

    try {
        // 2. Capture the entire body
        // We use a slight delay to ensure any open menus or hovers are cleared (if we want that)
        // But here we capture as is.
        
        const canvas = await html2canvas(document.body, {
            useCORS: true,
            allowTaint: true,
            scale: 2, // Higher quality
            backgroundColor: '#f8fafc', // Match app background
            logging: false,
            onclone: (clonedDoc) => {
                // Optional: You can hide specific elements in the screenshot here
                // For example, hide the screenshot button itself if desired
                const clonedBtn = clonedDoc.getElementById('btn-screenshot');
                if (clonedBtn) clonedBtn.style.display = 'none';
            }
        });

        // 3. Get Module Name for Filename
        let moduleName = localStorage.getItem('wms_last_page') || 'Main';
        if (!moduleName || moduleName === 'Main') {
            const pageTitleEl = document.getElementById('page-title');
            if (pageTitleEl) {
                const childSpan = pageTitleEl.querySelector('span:last-child');
                moduleName = childSpan ? childSpan.innerText.trim() : pageTitleEl.innerText.trim();
            }
        }
        
        // Clean name: only remove characters that are illegal in Windows filenames
        // Illegal: \ / : * ? " < > |
        const cleanName = moduleName
            .replace(/[\\\/:\*\?"<>\|]/g, "_")
            .trim();

        // 4. Convert to image and download
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;
        
        link.download = `${cleanName}.png`;
        link.href = image;
        link.click();

        // 4. Success feedback
        if (typeof showToast === 'function') {
            showToast('Đã chụp và lưu ảnh giao diện thành công!', 'success');
        }
    } catch (error) {
        console.error('Screenshot error:', error);
        if (typeof showToast === 'function') {
            showToast('Lỗi khi chụp ảnh: ' + error.message, 'error');
        }
    } finally {
        // 5. Restore button state
        if (icon) {
            icon.className = 'fa-solid fa-camera';
        }
        if (btn) {
            btn.style.pointerEvents = '';
            btn.style.opacity = '';
        }
    }
}

