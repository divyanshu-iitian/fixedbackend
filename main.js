document.addEventListener('DOMContentLoaded', async () => {
    const leaderboardBody = document.getElementById('leaderboard-body');
    const leaderboardTable = document.getElementById('leaderboard-table');
    const loadingIndicator = document.querySelector('.loading');

    async function fetchLeaderboard() {
        try {
            const response = await fetch('/api/leaderboard');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            loadingIndicator.textContent = 'Failed to load leaderboard.';
            return [];
        }
    }

    function renderLeaderboard(data) {
        leaderboardBody.innerHTML = ''; // Clear existing data
        if (data.length === 0) {
            loadingIndicator.textContent = 'No data available.';
            return;
        }

        data.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank">${index + 1}</td>
                <td>${user.name || 'Unknown'}</td>
                <td>${user.badge_count || 0}</td>
            `;
            leaderboardBody.appendChild(row);
        });

        loadingIndicator.style.display = 'none';
        leaderboardTable.style.display = 'table';
    }

    const leaderboardData = await fetchLeaderboard();
    renderLeaderboard(leaderboardData);
});