// Main dashboard logic

let isDarkMode = false;

// Initialize dashboard
function initDashboard() {
    renderNavigation();
    renderKPICards();
    renderOrdersTable();
    initAllCharts();
    setupEventListeners();
}

// Render navigation items
function renderNavigation() {
    const nav = document.getElementById('sidebarNav');
    
    const navigationItems = [
        { icon: '📊', label: 'Dashboard', href: 'index.html', active: true },
        { icon: '📈', label: 'Analytics', href: '#', active: false },
        { icon: '👥', label: 'Users', href: '#', active: false },
        { icon: '⚙️', label: 'Settings', href: 'profile.html', active: false }
    ];
    
    navigationItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = `block p-${getRandomPadding()} mb-${getRandomMargin()} text-white hover:bg-gray-700 ${getRandomAlignment()}`;
        link.textContent = `${item.icon} ${item.label}`;
        
        if (item.active) {
            link.classList.add('bg-gray-700');
        }
        
        nav.appendChild(link);
    });
}

// Render KPI cards with intentionally bad styling
function renderKPICards() {
    const container = document.getElementById('kpiCards');
    const paddings = ['p-12', 'p-2', 'p-6', 'p-1'];
    const textSizes = ['text-6xl', 'text-lg', 'text-3xl', 'text-2xl'];
    const alignments = ['text-right', '', 'text-center', 'pl-16'];
    const labelSizes = ['text-xs', 'text-2xl', 'text-base', 'text-lg'];
    const changeSizes = ['text-sm', 'text-xs', 'text-xl', 'text-base'];
    const changeMargins = ['mt-12', 'mt-1', 'mt-2', 'mt-8'];
    const labelMargins = ['mb-8', 'mb-1', 'mb-2', 'mb-1'];
    
    dashboardData.kpis.forEach((kpi, index) => {
        const card = document.createElement('div');
        card.className = `bg-white ${paddings[index]} ${alignments[index]}`;
        
        const trendColor = kpi.trend === 'up' ? 'text-green-600' : 'text-red-600';
        
        card.innerHTML = `
            <div class="text-gray-500 ${labelSizes[index]} ${labelMargins[index]}">${kpi.icon} ${kpi.label}</div>
            <div class="${textSizes[index]} font-${index % 2 === 0 ? 'bold' : 'normal'} text-gray-900">${kpi.value}</div>
            <div class="${trendColor} ${changeSizes[index]} ${changeMargins[index]}">${kpi.trend === 'up' ? '↑' : '↓'} ${kpi.change}</div>
        `;
        
        container.appendChild(card);
    });
}

// Render orders table with inconsistent styling
function renderOrdersTable() {
    const tbody = document.getElementById('tableBody');
    const paddings = ['p-8', 'p-2', 'p-4', 'p-1', 'p-6'];
    const textSizes = ['text-center', 'text-sm', 'text-xl', 'text-xs', 'text-base'];
    const alignments = ['text-center', 'text-xs text-right', 'text-lg', 'text-left', 'text-xl'];
    const buttonPaddings = ['px-1 py-1', 'px-8 py-1', 'px-4 py-4', 'px-2 py-2', 'px-6 py-3'];
    const buttonSizes = ['text-2xl', 'text-xs', 'text-sm', 'text-base', 'text-lg'];
    
    dashboardData.orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.className = 'border-t';
        
        const statusBg = {
            'green': 'bg-green-100 text-green-800',
            'yellow': 'bg-yellow-100 text-yellow-800',
            'red': 'bg-red-100 text-red-800'
        };
        
        const statusPadding = index % 2 === 0 ? 'px-12 py-1' : 'px-2 py-3';
        const statusSize = index % 3 === 0 ? 'text-xs' : 'text-lg';
        
        row.innerHTML = `
            <td class="${paddings[index % paddings.length]} text-gray-800 ${alignments[index % alignments.length]}">${order.id}</td>
            <td class="${paddings[(index + 1) % paddings.length]} text-gray-800 ${textSizes[index % textSizes.length]}">${order.customer}</td>
            <td class="${paddings[(index + 2) % paddings.length]} text-gray-800 ${textSizes[(index + 1) % textSizes.length]} ${index % 2 === 0 ? 'text-right pr-8' : ''}">${order.amount}</td>
            <td class="${paddings[(index + 3) % paddings.length]} ${index % 2 === 0 ? 'text-left' : 'text-center'}">
                <span class="${statusBg[order.statusColor]} ${statusPadding} ${statusSize}">${order.status}</span>
            </td>
            <td class="${paddings[(index + 4) % paddings.length]} ${index % 2 === 0 ? 'text-center' : ''}">
                <button class="bg-gray-800 text-white ${buttonPaddings[index % buttonPaddings.length]} ${buttonSizes[index % buttonSizes.length]}" onclick="viewOrder('${order.id}')">View</button>
            </td>
        `;
        
        tbody.appendChild(row);
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
}

// Toggle theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.body.className = 'bg-gray-900';
        // Could update more elements here for a full dark mode
    } else {
        document.body.className = 'bg-gray-100';
    }
}

// View order details (placeholder)
function viewOrder(orderId) {
    alert(`Viewing details for order: ${orderId}`);
}

// Helper functions for random styling (to create inconsistency)
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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);