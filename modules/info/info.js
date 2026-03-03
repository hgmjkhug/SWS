(function() {
    console.log('Profile (info.js) module loaded');

    // Reference elements
    const avatarInput = document.getElementById('avatar-input');
    const avatarDisplay = document.getElementById('profile-avatar-display');
    const nameDisplay = document.getElementById('profile-name-display');
    
    // Global references for user menu updating
    const topBarAvatar = document.querySelector('.user-avatar');
    const topBarName = document.querySelector('.user-info span');
    const dropdownAvatar = document.querySelector('.header-avatar img');
    const dropdownName = document.querySelector('.header-name');

    // Tab Switching Logic
    window.switchTab = function(tabId) {
        // Update Tabs
        document.querySelectorAll('.tab-item').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(tabId === 'tab-info' ? 'btn-tab-info' : 'btn-tab-password');
        if (activeBtn) activeBtn.classList.add('active');

        // Update Content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        const activeContent = document.getElementById(tabId);
        if (activeContent) activeContent.classList.add('active');
    };

    // Trigger file input
    window.triggerAvatarUpload = function() {
        if (avatarInput) avatarInput.click();
    };

    // Handle Image Preview
    window.handleAvatarChange = function(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (avatarDisplay) {
                    avatarDisplay.src = e.target.result;
                    // Store base64 in temporary variable
                    window._tempAvatarData = e.target.result;
                    if (typeof showToast === 'function') {
                        showToast('Đã tải lên ảnh xem trước!', 'info');
                    }
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    // Save Profile Info Changes
    window.saveProfileChanges = function() {
        const fullname = document.getElementById('p-fullname')?.value;
        const email = document.getElementById('p-email')?.value;
        const phone = document.getElementById('p-phone')?.value;
        
        if (!fullname) {
            if (typeof showToast === 'function') {
                showToast('Họ và tên không được để trống!', 'error');
            }
            return;
        }

        // Update UI displays in the profile page
        if (nameDisplay) nameDisplay.textContent = fullname;

        // Update Global UI elements (Header & User Dropdown)
        if (topBarName) topBarName.textContent = fullname;
        if (dropdownName) dropdownName.textContent = fullname;

        if (window._tempAvatarData) {
            if (topBarAvatar) topBarAvatar.src = window._tempAvatarData;
            if (dropdownAvatar) dropdownAvatar.src = window._tempAvatarData;
            // Clear temp data
            delete window._tempAvatarData;
        }

        if (typeof showToast === 'function') {
            showToast('Đã cập nhật thông tin thành công!', 'success');
        }
    };

    // Password Validation Logic
    window.onInputProfilePassword = function(input) {
        input.value = input.value.replace(/\s/g, '');
        const val = input.value;
        
        const requirements = {
            'p-req-length': val.length >= 8,
            'p-req-upper': /[A-Z]/.test(val),
            'p-req-number': /[0-9]/.test(val),
            'p-req-special': /[!@#$%^&*(),.?":{}|<>]/.test(val)
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

        const btn = document.getElementById('btn-save-password');
        if (btn) btn.disabled = !allValid;
        return allValid;
    };

    window.updateProfilePassword = function() {
        const currentPass = document.getElementById('p-current-password').value;
        const newPass = document.getElementById('p-new-password').value;
        const confirmPass = document.getElementById('p-confirm-password').value;

        if (!currentPass || !newPass || !confirmPass) {
            if (typeof showToast === 'function') showToast('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        if (newPass !== confirmPass) {
            if (typeof showToast === 'function') showToast('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }

        if (typeof showToast === 'function') {
            showToast('Cập nhật mật khẩu thành công!', 'success');
        }

        // Reset fields
        document.getElementById('p-current-password').value = '';
        document.getElementById('p-new-password').value = '';
        document.getElementById('p-confirm-password').value = '';
        
        // Reset requirements UI
        const reqs = document.querySelectorAll('.requirement');
        reqs.forEach(req => {
            req.classList.remove('success', 'error');
            const icon = req.querySelector('i');
            if (icon) icon.className = 'fas fa-circle';
        });
    };

    // Cancel / Go Back
    window.cancelEdit = function() {
        if (window.loadPage) {
            const lastPage = localStorage.getItem('wms_last_page') || 'Dashboard tổng quan';
            if (lastPage === 'Hồ sơ') {
                window.loadPage('Dashboard tổng quan');
            } else {
                window.loadPage(lastPage);
            }
        }
    };

})();