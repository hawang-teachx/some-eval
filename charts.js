// Chart initialization and configuration

let lineChart = null;
let barChart = null;

// Initialize Line Chart
function initLineChart() {
    const ctx = document.getElementById('lineChart').getContext('2d');
    
    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dashboardData.salesData.labels,
            datasets: [{
                label: 'Sales',
                data: dashboardData.salesData.values,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize Bar Chart
function initBarChart() {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dashboardData.productsData.labels,
            datasets: [{
                label: 'Sales',
                data: dashboardData.productsData.values,
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update chart data (for future interactivity)
function updateChartData(chart, newData) {
    chart.data.datasets[0].data = newData;
    chart.update();
}

// Destroy charts (useful for theme changes or page transitions)
function destroyCharts() {
    if (lineChart) {
        lineChart.destroy();
        lineChart = null;
    }
    if (barChart) {
        barChart.destroy();
        barChart = null;
    }
}

// Initialize all charts
function initAllCharts() {
    initLineChart();
    initBarChart();
}