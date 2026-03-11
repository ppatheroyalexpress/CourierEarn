async function testDashboardFetch() {
    const url = 'https://courier-earn.vercel.app/api/dashboard/summary';
    console.log(`Fetching from: ${url}`);
    try {
        const response = await fetch(url);
        console.log(`Status: ${response.status} ${response.statusText}`);
        const data = await response.json();
        console.log('Response data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testDashboardFetch();
