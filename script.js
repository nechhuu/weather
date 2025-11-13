// OpenWeather API Configuration
const API_KEY = '5d44c8cb9a9e2d710e993a8839e93d21'; // Working API key
const API_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const dayElement = document.getElementById('day');
const dateElement = document.getElementById('date');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const weatherDescriptionElement = document.getElementById('weatherDescription');
const precipitationElement = document.getElementById('precipitation');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const changeLocationBtn = document.getElementById('changeLocationBtn');
const locationModal = document.getElementById('locationModal');
const cityInput = document.getElementById('cityInput');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

// Default location
let currentCity = 'Biarritz';

// Weather icon mapping
const weatherIcons = {
    clear: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="30" fill="currentColor"/>
        <line x1="60" y1="10" x2="60" y2="25" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <line x1="60" y1="95" x2="60" y2="110" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <line x1="110" y1="60" x2="95" y2="60" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <line x1="25" y1="60" x2="10" y2="60" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <line x1="95" y1="25" x2="85" y2="35" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <line x1="35" y1="85" x2="25" y2="95" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <line x1="95" y1="95" x2="85" y2="85" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <line x1="35" y1="35" x2="25" y2="25" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
    clouds: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="50" cy="45" r="15" fill="currentColor"/>
        <line x1="50" y1="15" x2="50" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="50" y1="68" x2="50" y2="75" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="80" y1="45" x2="73" y2="45" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="27" y1="45" x2="20" y2="45" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M35 75 Q 40 70, 50 70 T 65 75 Q 70 80, 75 75 Q 80 70, 90 70 Q 95 70, 95 75 Q 95 85, 85 85 L 45 85 Q 35 85, 35 75 Z" fill="currentColor" opacity="0.7"/>
    </svg>`,
    rain: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <path d="M30 60 Q 35 50, 45 50 T 60 55 Q 65 60, 70 55 Q 75 50, 85 50 Q 95 50, 95 60 Q 95 75, 80 75 L 45 75 Q 30 75, 30 60 Z" fill="currentColor"/>
        <line x1="45" y1="80" x2="45" y2="90" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <line x1="55" y1="85" x2="55" y2="95" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <line x1="65" y1="80" x2="65" y2="90" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <line x1="75" y1="85" x2="75" y2="95" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    snow: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <path d="M30 60 Q 35 50, 45 50 T 60 55 Q 65 60, 70 55 Q 75 50, 85 50 Q 95 50, 95 60 Q 95 75, 80 75 L 45 75 Q 30 75, 30 60 Z" fill="currentColor"/>
        <circle cx="45" cy="85" r="3" fill="currentColor"/>
        <circle cx="55" cy="90" r="3" fill="currentColor"/>
        <circle cx="65" cy="85" r="3" fill="currentColor"/>
        <circle cx="75" cy="90" r="3" fill="currentColor"/>
    </svg>`,
    thunderstorm: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <path d="M30 60 Q 35 50, 45 50 T 60 55 Q 65 60, 70 55 Q 75 50, 85 50 Q 95 50, 95 60 Q 95 75, 80 75 L 45 75 Q 30 75, 30 60 Z" fill="currentColor"/>
        <path d="M55 78 L 50 90 L 57 90 L 52 102 L 65 87 L 58 87 L 62 78 Z" fill="#FFD700"/>
    </svg>`
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute

    // Show loading state
    temperatureElement.textContent = 'Loading...';
    weatherDescriptionElement.textContent = 'Fetching weather data';

    fetchWeather(currentCity);
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    dayElement.textContent = days[now.getDay()];
    dateElement.textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

// Fetch weather data using geocoding approach (more reliable)
async function fetchWeather(city) {
    try {
        // Step 1: Convert city name to coordinates using Geocoding API
        const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );

        if (!geoResponse.ok) {
            throw new Error('Failed to geocode city');
        }

        const geoData = await geoResponse.json();
        console.log('Geocoding data:', geoData);

        if (geoData.length === 0) {
            throw new Error('City not found. Please check the spelling and try again.');
        }

        const { lat, lon, name, country } = geoData[0];

        // Step 2: Get current weather by coordinates
        const currentResponse = await fetch(
            `${API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        if (!currentResponse.ok) {
            const errorData = await currentResponse.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.message || 'Failed to fetch weather data');
        }

        const currentData = await currentResponse.json();
        console.log('Current weather data:', currentData);

        // Step 3: Get forecast data by coordinates
        const forecastResponse = await fetch(
            `${API_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        if (!forecastResponse.ok) {
            const errorData = await forecastResponse.json();
            console.error('Forecast API Error:', errorData);
            throw new Error(errorData.message || 'Failed to fetch forecast data');
        }

        const forecastData = await forecastResponse.json();
        console.log('Forecast data:', forecastData);

        // Update the display with fetched data
        updateCurrentWeather(currentData);
        updateForecast(forecastData);

    } catch (error) {
        console.error('Error fetching weather:', error);
        alert(`Error loading weather data: ${error.message}\n\nPlease check:\n1. City name is correct\n2. API key is valid\n3. Internet connection is working`);

        // Reset to default display
        temperatureElement.textContent = '-- °C';
        weatherDescriptionElement.textContent = 'Unable to load weather';
    }
}

// Update current weather display
function updateCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].main;
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    const precipitation = data.rain ? Math.round(data.rain['1h'] || 0) : 0;
    const country = data.sys.country;

    // Update DOM
    locationElement.textContent = `${data.name}, ${country}`;
    temperatureElement.textContent = `${temp} °C`;
    weatherDescriptionElement.textContent = getWeatherDescription(description);
    humidityElement.textContent = `${humidity}%`;
    windElement.textContent = `${windSpeed} km/h`;
    precipitationElement.textContent = `${precipitation}%`;

    // Update weather icon
    updateWeatherIcon(description.toLowerCase());

    // Update background based on weather
    updateBackground(description.toLowerCase());
}

// Update forecast display
function updateForecast(data) {
    const forecastDays = ['Tue', 'Wed', 'Thu', 'Fry']; // Note: keeping 'Fry' as in original design
    const dailyForecasts = {};

    // Group forecasts by day
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();

        if (!dailyForecasts[dayKey]) {
            dailyForecasts[dayKey] = {
                temps: [],
                weather: item.weather[0].main
            };
        }
        dailyForecasts[dayKey].temps.push(item.main.temp);
    });

    // Get next 4 days
    const days = Object.keys(dailyForecasts).slice(0, 4);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    days.forEach((day, index) => {
        const avgTemp = Math.round(
            dailyForecasts[day].temps.reduce((a, b) => a + b, 0) / dailyForecasts[day].temps.length
        );

        const forecastElement = document.getElementById(`forecast-${index}`);
        if (forecastElement) {
            forecastElement.textContent = `${avgTemp < 10 ? '0' : ''}${avgTemp} °C`;
        }

        // Update day name
        const dayDate = new Date(day);
        const forecastItem = document.querySelectorAll('.forecast-day')[index];
        if (forecastItem) {
            forecastItem.textContent = daysOfWeek[dayDate.getDay()];
        }
    });
}

// Get weather description
function getWeatherDescription(weather) {
    const descriptions = {
        'Clear': 'Sunny',
        'Clouds': 'Cloudy',
        'Rain': 'Rainy',
        'Drizzle': 'Drizzle',
        'Thunderstorm': 'Thunderstorm',
        'Snow': 'Snowy',
        'Mist': 'Misty',
        'Fog': 'Foggy',
        'Haze': 'Hazy'
    };

    return descriptions[weather] || weather;
}

// Update weather icon
function updateWeatherIcon(weather) {
    const iconContainer = document.querySelector('.weather-icon');
    let iconHTML = weatherIcons.clear;

    if (weather.includes('cloud')) {
        iconHTML = weatherIcons.clouds;
    } else if (weather.includes('rain') || weather.includes('drizzle')) {
        iconHTML = weatherIcons.rain;
    } else if (weather.includes('snow')) {
        iconHTML = weatherIcons.snow;
    } else if (weather.includes('thunder')) {
        iconHTML = weatherIcons.thunderstorm;
    }

    iconContainer.innerHTML = iconHTML;
}

// Update background based on weather
function updateBackground(weather) {
    const mainCard = document.querySelector('.main-card');

    if (weather.includes('cloud')) {
        mainCard.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 50%, #5f6b6d 100%)';
    } else if (weather.includes('rain')) {
        mainCard.style.background = 'linear-gradient(135deg, #5a7a8c 0%, #4a6b7c 50%, #3a5a6c 100%)';
    } else if (weather.includes('snow')) {
        mainCard.style.background = 'linear-gradient(135deg, #d4e4f7 0%, #b4c4d7 50%, #94a4b7 100%)';
    } else {
        mainCard.style.background = 'linear-gradient(135deg, #87CEEB 0%, #6B9BD1 50%, #5B7BA8 100%)';
    }
}

// Modal controls
changeLocationBtn.addEventListener('click', () => {
    locationModal.classList.add('active');
    cityInput.focus();
});

cancelBtn.addEventListener('click', () => {
    locationModal.classList.remove('active');
    cityInput.value = '';
});

confirmBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        currentCity = city;
        fetchWeather(city);
        locationModal.classList.remove('active');
        cityInput.value = '';
    }
});

// Enter key to confirm
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        confirmBtn.click();
    }
});

// Close modal on background click
locationModal.addEventListener('click', (e) => {
    if (e.target === locationModal) {
        locationModal.classList.remove('active');
        cityInput.value = '';
    }
});
