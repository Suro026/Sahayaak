document.addEventListener('DOMContentLoaded', function() {
    // --- Page State & Data ---
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.sidebar ul li');
    const loginForm = document.getElementById('login-form');
    const loginPage = document.getElementById('login-page');
    const mainContainer = document.querySelector('.main-container');

    const binData = [
        { id: 'BIN-001', location: 'Park Street', fillLevel: 25, status: 'Normal', type: 'Wet', updated: 1, lat: 22.55, lon: 88.35 },
        { id: 'BIN-002', location: 'Salt Lake, Sector V', fillLevel: 65, status: 'Normal', type: 'Hazardous', updated: 2, lat: 22.57, lon: 88.43 },
        { id: 'BIN-003', location: 'Market Area', fillLevel: 97, status: 'Overflow', type: 'Hazardous', updated: 5, lat: 22.58, lon: 88.38 },
        { id: 'BIN-004', location: 'Gariahat', fillLevel: 80, status: 'Full', type: 'Dry', updated: 1, lat: 22.51, lon: 88.36 },
        { id: 'BIN-005', location: 'Bus Stand', fillLevel: 78, status: 'Normal', type: 'Wet', updated: 2, lat: 22.60, lon: 88.37 },
        { id: 'BIN-006', location: 'Main Plaza', fillLevel: 91, status: 'Almost Full', type: 'Dry', updated: 2, lat: 22.56, lon: 88.40 },
        { id: 'BIN-007', location: 'Medical Center', fillLevel: 73, status: 'Normal', type: 'Hazardous', updated: 2, lat: 22.54, lon: 88.39 },
        { id: 'BIN-008', location: 'Food Court', fillLevel: 97, status: 'Overflow', type: 'Wet', updated: 2, lat: 22.53, lon: 88.34 },
        { id: 'BIN-009', location: 'Shopping Mall', fillLevel: 34, status: 'Normal', type: 'Dry', updated: 2, lat: 22.59, lon: 88.41 },
        { id: 'BIN-010', location: 'Restaurant Strip', fillLevel: 95, status: 'Overflow', type: 'Wet', updated: 2, lat: 22.52, lon: 88.38 },
        { id: 'BIN-011', location: 'Industrial Zone', fillLevel: 56, status: 'Normal', type: 'Hazardous', updated: 2, lat: 22.62, lon: 88.42 },
        { id: 'BIN-012', location: 'Office Complex', fillLevel: 91, status: 'Almost Full', type: 'Dry', updated: 2, lat: 22.55, lon: 88.44 },
    ];

    const alertsData = [
        { binId: 'BIN-003', status: 'Overflow', location: 'Ward 13 - Market Area', time: 5, fillLevel: 97, wasteType: 'Hazardous' },
        { binId: 'BIN-010', status: 'Overflow', location: 'Ward 15 - Restaurant Strip', time: 19, fillLevel: 95, wasteType: 'Wet' },
        { binId: 'BIN-002', status: 'Almost Full', location: 'Ward 12 - Hospital Road', time: 22, fillLevel: 82, wasteType: 'Wet' },
        { binId: 'BIN-006', status: 'Almost Full', location: 'Ward 14 - Main Plaza', time: 12, fillLevel: 91, wasteType: 'Dry' },
    ];


    // --- Functions ---

    // Function to switch between pages
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId + '-page').classList.add('active');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });
        
        // Initialize charts only when the analytics page is shown
        if (pageId === 'analytics') {
            initAnalyticsCharts();
        }
    }

    // Login Handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'admin') {
            loginPage.classList.remove('active');
            mainContainer.classList.add('active');
            showPage('dashboard');
            initDashboard();
        } else {
            alert('Invalid credentials. Please use admin/admin.');
        }
    });
    
    // Logout Handler
    document.querySelector('li[data-page="logout"]').addEventListener('click', (e) => {
        e.preventDefault();
        mainContainer.classList.remove('active');
        loginPage.classList.add('active');
    });

    // Navigation Handler
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            if (pageId !== 'logout') {
                 showPage(pageId);
            }
        });
    });

    // Get color based on fill level
    function getFillColor(level) {
        if (level >= 95) return 'var(--status-critical)';
        if (level >= 80) return 'var(--status-almost-full)';
        return 'var(--status-normal)';
    }
    
    // Get status text based on fill level
    function getStatusText(level) {
        if (level >= 95) return 'OVERFLOW';
        if (level >= 80) return 'ALMOST FULL';
        return 'NORMAL';
    }

    // Populate Bins on Dashboard
    function populateDashboardBins() {
        const container = document.querySelector('.bin-cards-container');
        container.innerHTML = '';
        binData.forEach(bin => {
            const statusText = getStatusText(bin.fillLevel);
            const color = getFillColor(bin.fillLevel);
            
            const card = document.createElement('div');
            card.className = 'bin-card';
            card.innerHTML = `
                <div class="bin-header">
                    <span class="bin-id">${bin.id}</span>
                    <span class="bin-type-icon ${bin.type.toLowerCase()}">${bin.type}</span>
                </div>
                <p class="bin-location">${bin.location}</p>
                <div class="fill-level-bar">
                    <div class="fill-level-progress" style="width: ${bin.fillLevel}%; background-color: ${color};"></div>
                </div>
                <div class="bin-footer">
                    <span class="fill-level-text" style="color: ${color};">${statusText}</span>
                    <span class="fill-level-value">${bin.fillLevel}% Full</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Populate Alerts Page
    function populateAlerts() {
        const container = document.querySelector('.alerts-list');
        container.innerHTML = '';
        alertsData.forEach(alert => {
            const isOverflow = alert.status === 'Overflow';
            const statusClass = isOverflow ? 'overflow' : 'almost-full';
            const item = document.createElement('div');
            item.className = `alert-item ${statusClass}`;
            item.innerHTML = `
                <div class="alert-icon ${statusClass}">
                    ⚠️
                </div>
                <div class="alert-details">
                    <div class="alert-header">
                        <span class="alert-bin-id">${alert.binId}</span>
                        <span class="alert-tag ${statusClass}">${alert.status}</span>
                    </div>
                    <div class="alert-meta">${alert.location} &bull; ${alert.time} min ago</div>
                </div>
                <div class="alert-info">
                    <span class="alert-fill-level">${alert.fillLevel}%</span>
                    <span class="alert-waste-type">${alert.wasteType} Waste</span>
                </div>
                <div class="alert-actions">
                    <button class="btn-action ${isOverflow ? 'btn-urgent' : 'btn-schedule'}">${isOverflow ? 'Urgent Pickup' : 'Schedule Pickup'}</button>
                    <button class="btn-resolve">&#10003;</button> </div>
            `;
            container.appendChild(item);
        });
    }
    
    // Initialize Dashboard
    function initDashboard() {
        populateDashboardBins();
        populateAlerts(); // Also populate alerts data when dashboard initializes
        
        // Initialize Leaflet Map
        const map = L.map('map').setView([22.5726, 88.3639], 12); // Centered on Kolkata
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        binData.forEach(bin => {
            const color = getFillColor(bin.fillLevel);
            const customIcon = L.divIcon({
                className: 'custom-map-marker',
                html: `<div style="background-color:${color};" class="marker-pin"></div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42]
            });

            const marker = L.marker([bin.lat, bin.lon], { icon: customIcon }).addTo(map);
            marker.bindPopup(`<b>${bin.id}</b><br>${bin.location}<br>Fill Level: ${bin.fillLevel}%<br>Status: ${getStatusText(bin.fillLevel)}`);
        });

    }

    // Initialize Analytics Charts
    let wasteTypeChart, avgFillLevelChart, pickupTrendsChart;

    function initAnalyticsCharts() {
        // Waste Type Distribution Chart
        const wasteTypeCtx = document.getElementById('wasteTypeChart').getContext('2d');
        if (wasteTypeChart) wasteTypeChart.destroy();
        wasteTypeChart = new Chart(wasteTypeCtx, {
            type: 'pie',
            data: {
                labels: ['Wet Waste', 'Dry Waste', 'Hazardous'],
                datasets: [{
                    data: [4, 5, 3],
                    backgroundColor: ['#2196f3', '#607d8b', '#9c27b0'],
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // Average Fill Level Chart
        const avgFillLevelCtx = document.getElementById('avgFillLevelChart').getContext('2d');
         if (avgFillLevelChart) avgFillLevelChart.destroy();
        avgFillLevelChart = new Chart(avgFillLevelCtx, {
            type: 'bar',
            data: {
                labels: ['Ward 12', 'Ward 13', 'Ward 14', 'Ward 15'],
                datasets: [{
                    label: 'Avg Fill Level (%)',
                    data: [68, 75, 82, 65],
                    backgroundColor: '#4CAF50'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });

        // Pickup Trends Chart
        const pickupTrendsCtx = document.getElementById('pickupTrendsChart').getContext('2d');
         if (pickupTrendsChart) pickupTrendsChart.destroy();
        pickupTrendsChart = new Chart(pickupTrendsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{
                    label: 'Total Pickups',
                    data: [50, 55, 45, 61, 58],
                    borderColor: '#4CAF50',
                    tension: 0.4,
                    fill: false
                }, {
                    label: 'Urgent Pickups',
                    data: [10, 12, 8, 15, 11],
                    borderColor: '#f44336',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // --- Initial Load ---
    // On load, only the login page should be visible.
    pages.forEach(p => p.classList.remove('active'));
    loginPage.classList.add('active');

});