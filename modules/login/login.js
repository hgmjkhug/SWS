document.addEventListener('DOMContentLoaded', function() {
    // Clean URL: Remove 'index.html' from address bar for a cleaner look
    const path = window.location.pathname;
    if (path.endsWith('index.html')) {
        const cleanPath = path.substring(0, path.lastIndexOf('/') + 1);
        window.history.replaceState(null, '', cleanPath + window.location.search);
    }

    // Handle transition overlay
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay && overlay.classList.contains('active')) {
        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.classList.remove('active', 'fade-out');
                overlay.style.display = 'none';
            }, 500);
        }, 100);
    } else if (overlay) {
        overlay.style.display = 'none';
    }
    
    // Add login-body class for specific overlay color if needed
    document.body.classList.add('login-body');
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
        // Trigger spectacular Sakura Transition
        createSakuraTransition(() => {
            // Set transition flag for the next page load
            sessionStorage.setItem('sakura_transitioning', 'true');

            // Save session data
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username || 'Admin');
            
            // Redirect to root instead of index.html for clean URL
            window.location.href = '../../';
        });
    }, 800);
});

function createSakuraTransition(callback) {
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
