document.addEventListener('DOMContentLoaded', function() {
    // Clean URL: Remove 'login.html' from address bar for a cleaner look
    const path = window.location.pathname;
    if (path.endsWith('login.html')) {
        const cleanPath = path.substring(0, path.lastIndexOf('/') + 1);
        window.history.replaceState(null, '', cleanPath + window.location.search);
    }

    // Initialize Transition Overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
    
    // Add login-body class for specific overlay color if needed
    document.body.classList.add('login-body');

    // Fade out overlay when page loads
    setTimeout(() => {
        overlay.classList.add('fade-out');
    }, 100);
});

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    }
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const btn = document.querySelector('.btn-login');
    
    let hasError = false;

    // Reset error states
    document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

    if (!username) {
        usernameInput.closest('.form-group').classList.add('has-error');
        hasError = true;
    }

    if (!password) {
        passwordInput.closest('.form-group').classList.add('has-error');
        hasError = true;
    }

    if (hasError) return;
    
    // Simulate loading state
    btn.disabled = true;
    btn.innerText = 'Đang xử lý...';
    
    setTimeout(() => {
        // Trigger page fade in before redirect
        const overlay = document.querySelector('.page-transition-overlay');
        overlay.classList.remove('fade-out');
        overlay.classList.add('fade-in');
        
        setTimeout(() => {
            // Save session data
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username || 'Admin');
            
            // Redirect to root instead of index.html for clean URL
            window.location.href = '../../';
        }, 500);
    }, 800);
});
