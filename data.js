// Mock data for the dashboard

const dashboardData = {
    kpis: [
        {
            icon: '💰',
            label: 'Revenue',
            value: '$45,231',
            change: '+12.5%',
            trend: 'up'
        },
        {
            icon: '👥',
            label: 'Users',
            value: '8,282',
            change: '+5.2%',
            trend: 'up'
        },
        {
            icon: '📦',
            label: 'Orders',
            value: '1,426',
            change: '-2.1%',
            trend: 'down'
        },
        {
            icon: '📊',
            label: 'Rate',
            value: '3.2%',
            change: '+0.8%',
            trend: 'up'
        }
    ],
    
    salesData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [12000, 19000, 15000, 25000, 22000, 30000]
    },
    
    productsData: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        values: [65, 59, 80, 81]
    },
    
    orders: [
        {
            id: '#ORD-001',
            customer: 'John Doe',
            amount: '$124.99',
            status: 'Completed',
            statusColor: 'green'
        },
        {
            id: '#ORD-002',
            customer: 'Jane Smith',
            amount: '$89.50',
            status: 'Pending',
            statusColor: 'yellow'
        },
        {
            id: '#ORD-003',
            customer: 'Bob Johnson',
            amount: '$234.00',
            status: 'Cancelled',
            statusColor: 'red'
        },
        {
            id: '#ORD-004',
            customer: 'Alice Williams',
            amount: '$156.75',
            status: 'Completed',
            statusColor: 'green'
        },
        {
            id: '#ORD-005',
            customer: 'Charlie Brown',
            amount: '$299.99',
            status: 'Pending',
            statusColor: 'yellow'
        }
    ],
    
    navigation: [
        { icon: '📊', label: 'Dashboard', active: true },
        { icon: '📈', label: 'Analytics', active: false },
        { icon: '👥', label: 'Users', active: false },
        { icon: '⚙️', label: 'Settings', active: false }
    ]
};

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to format numbers
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// Function to get random data for demo purposes
function getRandomData(min, max, count) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}