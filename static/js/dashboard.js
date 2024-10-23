
// Initialize the map
const map = L.map('map').setView([-20.348404, 57.552152], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = [];

// Initialize the chart
const ctx = document.getElementById('pollutionChart').getContext('2d');
let pollutionChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // X-axis labels (time)
        datasets: [{
            label: 'Pollution Levels',
            data: [], // Y-axis data (pollution levels)
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                    tooltipFormat: 'MMM yyyy'
                }
            },
            y: {
                beginAtZero: true
            }
        }
    }
});

// Function to show spinner
function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

// Function to hide spinner
function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

// Fetch environmental data
async function fetchEnvironmentalData(lat, lon, pollutant) {
    showSpinner();
    console.log("Fetching environmental data for lat:", lat, "lon:", lon);
    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`);
        const pollutionResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`);
        if (!weatherResponse.ok || !pollutionResponse.ok) {
            console.error('Failed to fetch data:', weatherResponse.statusText, pollutionResponse.statusText);
            hideSpinner();
            return;
        }
        const weatherData = await weatherResponse.json();
        const pollutionData = await pollutionResponse.json();

        const historicalPollutionData = await fetchHistoricalPollutionData(lat, lon, pollutant);
        updateEnvironmentalDetails(weatherData, pollutionData, historicalPollutionData, pollutant);
        fetchAIInsights(pollutionData.list[0].components); // Assuming you want insights on the first set of data
    } catch (error) {
        console.error('Error fetching environmental data:', error);
    } finally {
        hideSpinner();
    }
}

// Fetch historical pollution data
async function fetchHistoricalPollutionData(lat, lon, pollutant) {
    const historicalData = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) { // Fetch data for the last 12 months
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const timestamp = Math.floor(month.getTime() / 1000);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${timestamp}&end=${timestamp + 2592000}&appid=${openWeatherApiKey}`); // 2592000 = seconds in a month
        if (response.ok) {
            const data = await response.json();
            const monthlyData = data.list.map(entry => ({
                date: new Date(entry.dt * 1000),
                value: entry.components[pollutant]
            }));
            historicalData.push(...monthlyData);
        } else {
            console.error('Failed to fetch historical data:', response.statusText);
        }
    }
    return historicalData;
}

// Update environmental details
function updateEnvironmentalDetails(weatherData, pollutionData, historicalPollutionData, pollutant) {
    const weatherInfo = `Current Weather: ${weatherData.weather[0].description}, Temperature: ${weatherData.main.temp}°C, Humidity: ${weatherData.main.humidity}%, Wind Speed: ${weatherData.wind.speed} m/s, Pressure: ${weatherData.main.pressure} hPa, Visibility: ${weatherData.visibility} m`;
    document.getElementById('weatherDescription').innerText = weatherInfo;

    const pollutionLevels = pollutionData.list.map(entry => entry.components[pollutant]);
    const timestamps = pollutionData.list.map(entry => new Date(entry.dt * 1000).toLocaleTimeString());

    const historicalLabels = historicalPollutionData.map(entry => entry.date);
    const historicalValues = historicalPollutionData.map(entry => entry.value);

    updateChart(historicalLabels, historicalValues);
    updatePollutionMap(pollutionData.list[0].components, weatherData.coord.lat, weatherData.coord.lon); // Assuming you have a function to update the map based on pollution data

    // Update infographics
    document.getElementById('temperatureValue').innerText = `${weatherData.main.temp}°C`;
    document.getElementById('humidityValue').innerText = `${weatherData.main.humidity}%`;
    document.getElementById('windSpeedValue').innerText = `${weatherData.wind.speed} m/s`;
    document.getElementById('pressureValue').innerText = `${weatherData.main.pressure} hPa`;
    document.getElementById('visibilityValue').innerText = `${weatherData.visibility} m`;

    document.getElementById('coValue').innerText = `${pollutionData.list[0].components.co} µg/m³`;
    document.getElementById('nh3Value').innerText = `${pollutionData.list[0].components.nh3} µg/m³`;
    document.getElementById('noValue').innerText = `${pollutionData.list[0].components.no} µg/m³`;
    document.getElementById('no2Value').innerText = `${pollutionData.list[0].components.no2} µg/m³`;
    document.getElementById('o3Value').innerText = `${pollutionData.list[0].components.o3} µg/m³`;
    document.getElementById('pm2_5Value').innerText = `${pollutionData.list[0].components.pm2_5} µg/m³`;
    document.getElementById('pm10Value').innerText = `${pollutionData.list[0].components.pm10} µg/m³`;
    document.getElementById('so2Value').innerText = `${pollutionData.list[0].components.so2} µg/m³`;
}

// Update the chart
function updateChart(labels, data) {
    pollutionChart.data.labels = labels;
    pollutionChart.data.datasets[0].data = data;
    pollutionChart.update();
}

// Fetch AI insights
async function fetchAIInsights(pollutantData) {
    console.log("Fetching AI insights for pollution data:", pollutantData);
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {role: "system", content: "This system analyzes pollution data to provide insights on air quality and potential health impacts."},
                    {role: "user", content: `Analyze the following pollution data: ${JSON.stringify(pollutantData)} and provide insights on potential health impacts, compliance with WHO standards, and any notable trends or anomalies.`}
                ],
                max_tokens: 200
            })
        });
        if (!response.ok) {
            console.error('Failed to fetch AI insights:', response.statusText);
            return;
        }
        const aiData = await response.json();
        document.getElementById('insightsDescription').innerHTML = aiData.choices[0].message.content.trim().replace(/\n/g, '<br>');
    } catch (error) {
        console.error('Error fetching AI insights:', error);
    }
}

// Add a click event listener to the map
map.on('click', (e) => {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    const pollutant = document.getElementById('pollutantSelect').value;

    // Remove existing marker if any
    if (markers.length > 0) {
        map.removeLayer(markers[0]);
        markers = [];
    }

    // Add a new marker at the clicked location
    const marker = L.marker([lat, lon]).addTo(map);
    markers.push(marker);

    // Fetch environmental data for the new location
    fetchEnvironmentalData(lat, lon, pollutant);
});

// Event listener for pollutant select element
document.getElementById('pollutantSelect').addEventListener('change', () => {
    if (markers.length > 0) {
        const lat = markers[0].getLatLng().lat;
        const lon = markers[0].getLatLng().lng;
        const pollutant = document.getElementById('pollutantSelect').value;
        fetchEnvironmentalData(lat, lon, pollutant);
    }
});

// Set alert for pollution threshold
document.getElementById('setAlert').addEventListener('click', () => {
    const threshold = prompt('Set pollution threshold:');
    alert(`Alert set for pollution levels above ${threshold}`);
});

// Share data on social media
document.getElementById('shareData').addEventListener('click', () => {
    const url = window.location.href;
    const text = 'Check out the real-time pollution data for Mauritius beaches!';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
});

// Initial data fetch
const initialBeach = document.getElementById('beachSelect').selectedOptions[0];
const initialLat = initialBeach.getAttribute('data-lat');
const initialLon = initialBeach.getAttribute('data-lon');
const initialPollutant = document.getElementById('pollutantSelect').value;
fetchEnvironmentalData(initialLat, initialLon, initialPollutant);

// Update pollution maap with markers based on pollution levels
function updatePollutionMap(pollutionLevels, lat, lon) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    Object.keys(pollutionLevels).forEach(pollutant => {
        const level = pollutionLevels[pollutant];
        const color = level > 100 ? 'red' : level > 50 ? 'orange' : 'green';
        const marker = L.circle([lat, lon], {
            color: color,
            radius: 500
        }).addTo(map).bindPopup(`${pollutant.toUpperCase()}: ${level}`);
        markers.push(marker);
    });
}
