// Profile page logic

let isDarkMode = false;

// Initialize profile page
function initProfile() {
    renderNavigation();
    setupEventListeners();
}

// Render navigation items
function renderNavigation() {
    const nav = document.getElementById('sidebarNav');
    
    const navigationItems = [
        { icon: '📊', label: 'Dashboard', href: 'index.html' },
        { icon: '📈', label: 'Analytics', href: '#' },
        { icon: '👥', label: 'Users', href: '#' },
        { icon: '⚙️', label: 'Settings', href: 'profile.html' }
    ];
    
    navigationItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = `block p-${getRandomPadding()} mb-${getRandomMargin()} text-white hover:bg-gray-700 ${getRandomAlignment()}`;
        link.textContent = `${item.icon} ${item.label}`;
        
        // Highlight current page
        if ((item.href === 'profile.html' && window.location.pathname.includes('profile')) ||
            (item.label === 'Settings')) {
            link.classList.add('bg-gray-700');
        }
        
        nav.appendChild(link);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Notification button
    document.getElementById('notificationBtn').addEventListener('click', () => {
        alert('You have 3 new notifications!');
    });
    
    // Profile button
    document.getElementById('profileBtn').addEventListener('click', () => {
        window.location.href = 'profile.html';
    });

    // Logo button
    document.getElementById('logoBtn')?.addEventListener('click', () => {
        window.location.href = '/';
    })
    
    // Form inputs - add some interactivity
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#3B82F6';
        });
        input.addEventListener('blur', function() {
            this.style.borderColor = '#D1D5DB';
        });
    });
    
    // Save button
    const saveBtn = document.querySelector('button.bg-gray-800');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProfile);
    }
    
    // Cancel button
    const cancelBtn = document.querySelector('button.bg-gray-300');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Delete account button
    const deleteBtn = document.querySelector('button.bg-red-600');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteAccount);
    }
    
    // Change photo button
    const changePhotoBtn = document.querySelector('button.bg-gray-800.text-white.px-12');
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', changePhoto);
    }
}

// Toggle theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.body.className = 'bg-gray-900';
    } else {
        document.body.className = 'bg-gray-100';
    }
}

// Save profile
function saveProfile() {
    // Get form values
    const fullName = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const phone = document.querySelector('input[type="tel"]').value;
    
    // Show loading state
    const saveBtn = document.querySelector('button.bg-gray-800');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert(`Profile saved successfully!\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}`);
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        
        // Add new activity log entry
        addActivityLog('Updated profile information', 'Just now');
    }, 1000);
}

// Delete account
function deleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone!');
    
    if (confirmed) {
        const doubleConfirm = confirm('This is your last chance! Delete account permanently?');
        
        if (doubleConfirm) {
            alert('Account deletion initiated. You will receive a confirmation email shortly.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}

// Change photo
function changePhoto() {
    alert('Photo upload feature coming soon!\n\nIn a real application, this would open a file picker.');
}

// Add activity log entry
function addActivityLog(action, time) {
    const activityContainer = document.querySelector('.space-y-1');
    const newActivity = document.createElement('div');
    newActivity.className = 'border-l-4 border-green-500 pl-4 py-2';
    newActivity.innerHTML = `
        <p class="text-gray-800 font-semibold">${action}</p>
        <p class="text-gray-500 text-sm mt-1">${time}</p>
    `;
    activityContainer.insertBefore(newActivity, activityContainer.firstChild);
}

// Helper functions for random styling
function getRandomPadding() {
    const paddings = [1, 2, 4, 6];
    return paddings[Math.floor(Math.random() * paddings.length)];
}

function getRandomMargin() {
    const margins = [1, 2, 8, 12];
    return margins[Math.floor(Math.random() * margins.length)];
}

function getRandomAlignment() {
    const alignments = ['text-left', 'text-center', 'text-right', ''];
    return alignments[Math.floor(Math.random() * alignments.length)];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initProfile);