// Cyber Tools JavaScript - Quantum-powered utilities

// Calculator Variables
let calculatorDisplay = '0';
let calculatorHistory = '';
let waitingForOperand = false;
let pendingOperator = null;
let previousValue = 0;

// Weather API Key (you'll need to get a free API key from OpenWeatherMap)
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

// Initialize all tools when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    initializeConverter();
    initializeColorPicker();
    initializeTextTools();
    generatePassword(); // Generate initial password
    initializeCalendar(); // Initialize calendar
    initializeNavbar(); // Initialize navbar enhancements
});

// ==================== CALCULATOR FUNCTIONS ====================

function initializeCalculator() {
    updateCalculatorDisplay();
}

function appendToCalc(value) {
    if (waitingForOperand) {
        calculatorDisplay = value;
        waitingForOperand = false;
    } else {
        calculatorDisplay = calculatorDisplay === '0' ? value : calculatorDisplay + value;
    }
    updateCalculatorDisplay();
}

function setOperator(operator) {
    if (pendingOperator && !waitingForOperand) {
        calculateResult();
    }
    
    previousValue = parseFloat(calculatorDisplay);
    pendingOperator = operator;
    waitingForOperand = true;
    updateCalculatorDisplay();
}

function clearCalculator() {
    calculatorDisplay = '0';
    calculatorHistory = '';
    waitingForOperand = false;
    pendingOperator = null;
    previousValue = 0;
    updateCalculatorDisplay();
}

function deleteLastChar() {
    if (calculatorDisplay.length === 1) {
        calculatorDisplay = '0';
    } else {
        calculatorDisplay = calculatorDisplay.slice(0, -1);
    }
    updateCalculatorDisplay();
}

function calculateResult() {
    if (pendingOperator && !waitingForOperand) {
        const current = parseFloat(calculatorDisplay);
        let result;
        
        switch (pendingOperator) {
            case '+':
                result = previousValue + current;
                break;
            case '-':
                result = previousValue - current;
                break;
            case '*':
                result = previousValue * current;
                break;
            case '/':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                result = previousValue / current;
                break;
            case '%':
                result = previousValue % current;
                break;
        }
        
        calculatorHistory = `${previousValue} ${pendingOperator} ${current} = ${result}`;
        calculatorDisplay = result.toString();
        pendingOperator = null;
        waitingForOperand = true;
        updateCalculatorDisplay();
    }
}

function updateCalculatorDisplay() {
    document.getElementById('calcCurrent').textContent = calculatorDisplay;
    document.getElementById('calcHistory').textContent = calculatorHistory;
}

// ==================== WEATHER FUNCTIONS ====================

async function getWeather() {
    const cityInput = document.getElementById('weatherCity');
    const city = cityInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    if (WEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
        // Demo weather data when no API key is provided
        showDemoWeather(city);
        return;
    }
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            alert('City not found. Please check the spelling.');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function showDemoWeather(city) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const demoData = {
        name: city,
        main: {
            temp: Math.floor(Math.random() * 30) + 5,
            humidity: Math.floor(Math.random() * 40) + 40,
            feels_like: Math.floor(Math.random() * 30) + 5
        },
        weather: [{
            description: 'Partly Cloudy',
            icon: '02d'
        }],
        wind: {
            speed: Math.floor(Math.random() * 20) + 5
        }
    };
    displayWeather(demoData);
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const feelsLike = Math.round(data.main.feels_like);
    
    weatherDisplay.innerHTML = `
        <div class="weather-data">
            <div class="weather-icon">
                <i class="fas fa-cloud-sun"></i>
            </div>
            <div class="weather-temp">${temp}°C</div>
            <div class="weather-desc">${description}</div>
            <div class="weather-details">
                <div>Humidity: ${humidity}%</div>
                <div>Wind: ${windSpeed} m/s</div>
                <div>Feels like: ${feelsLike}°C</div>
                <div>Location: ${data.name}</div>
            </div>
        </div>
    `;
}

// ==================== UNIT CONVERTER FUNCTIONS ====================

const conversionData = {
    length: {
        units: ['Meter', 'Kilometer', 'Centimeter', 'Mile', 'Yard', 'Foot', 'Inch'],
        conversions: {
            'Meter': 1,
            'Kilometer': 1000,
            'Centimeter': 0.01,
            'Mile': 1609.34,
            'Yard': 0.9144,
            'Foot': 0.3048,
            'Inch': 0.0254
        }
    },
    weight: {
        units: ['Kilogram', 'Gram', 'Pound', 'Ounce', 'Ton'],
        conversions: {
            'Kilogram': 1,
            'Gram': 0.001,
            'Pound': 0.453592,
            'Ounce': 0.0283495,
            'Ton': 1000
        }
    },
    temperature: {
        units: ['Celsius', 'Fahrenheit', 'Kelvin'],
        conversions: {
            'Celsius': 'C',
            'Fahrenheit': 'F',
            'Kelvin': 'K'
        }
    },
    area: {
        units: ['Square Meter', 'Square Kilometer', 'Square Foot', 'Square Yard', 'Acre'],
        conversions: {
            'Square Meter': 1,
            'Square Kilometer': 1000000,
            'Square Foot': 0.092903,
            'Square Yard': 0.836127,
            'Acre': 4046.86
        }
    },
    volume: {
        units: ['Liter', 'Milliliter', 'Gallon', 'Cubic Meter', 'Cubic Foot'],
        conversions: {
            'Liter': 1,
            'Milliliter': 0.001,
            'Gallon': 3.78541,
            'Cubic Meter': 1000,
            'Cubic Foot': 28.3168
        }
    }
};

function initializeConverter() {
    updateConverter();
}

function updateConverter() {
    const type = document.getElementById('converterType').value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    // Clear existing options
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    // Add new options
    conversionData[type].units.forEach(unit => {
        fromUnit.add(new Option(unit, unit));
        toUnit.add(new Option(unit, unit));
    });
    
    // Set default values
    if (type === 'temperature') {
        fromUnit.value = 'Celsius';
        toUnit.value = 'Fahrenheit';
    } else {
        fromUnit.value = conversionData[type].units[0];
        toUnit.value = conversionData[type].units[1];
    }
    
    convertUnits();
}

function convertUnits() {
    const type = document.getElementById('converterType').value;
    const fromValue = parseFloat(document.getElementById('fromValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    if (fromValue === 0) {
        document.getElementById('toValue').value = '0';
        return;
    }
    
    let result;
    
    if (type === 'temperature') {
        result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
        result = convertStandard(fromValue, fromUnit, toUnit, type);
    }
    
    document.getElementById('toValue').value = result.toFixed(6);
}

function convertTemperature(value, from, to) {
    let celsius;
    
    // Convert to Celsius first
    switch (from) {
        case 'Celsius':
            celsius = value;
            break;
        case 'Fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'Kelvin':
            celsius = value - 273.15;
            break;
    }
    
    // Convert from Celsius to target unit
    switch (to) {
        case 'Celsius':
            return celsius;
        case 'Fahrenheit':
            return celsius * 9/5 + 32;
        case 'Kelvin':
            return celsius + 273.15;
    }
}

function convertStandard(value, from, to, type) {
    const fromFactor = conversionData[type].conversions[from];
    const toFactor = conversionData[type].conversions[to];
    
    // Convert to base unit, then to target unit
    const baseValue = value * fromFactor;
    return baseValue / toFactor;
}

// ==================== PASSWORD GENERATOR FUNCTIONS ====================

function updatePasswordLength() {
    const slider = document.getElementById('lengthSlider');
    const display = document.getElementById('passwordLength');
    display.textContent = slider.value;
}

function generatePassword() {
    const length = parseInt(document.getElementById('lengthSlider').value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (charset === '') {
        alert('Please select at least one character type');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    document.getElementById('generatedPassword').value = password;
}

function copyPassword() {
    const passwordField = document.getElementById('generatedPassword');
    passwordField.select();
    passwordField.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        showCopyNotification();
    } catch (err) {
        // Fallback for modern browsers
        navigator.clipboard.writeText(passwordField.value).then(() => {
            showCopyNotification();
        });
    }
}

function showCopyNotification() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    copyBtn.style.background = 'linear-gradient(45deg, #00ff00, #00a8ff)';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = 'linear-gradient(45deg, #00f5ff, #00a8ff)';
    }, 2000);
}

// ==================== COLOR PICKER FUNCTIONS ====================

function initializeColorPicker() {
    updateColorFromSliders();
}

function updateColor() {
    const colorInput = document.getElementById('colorInput');
    const color = colorInput.value;
    
    // Update preview and info
    document.getElementById('colorPreview').style.background = color;
    document.getElementById('colorHex').textContent = color;
    
    // Convert hex to RGB
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    
    document.getElementById('colorRgb').textContent = `rgb(${r}, ${g}, ${b})`;
    
    // Update sliders
    document.getElementById('redSlider').value = r;
    document.getElementById('greenSlider').value = g;
    document.getElementById('blueSlider').value = b;
    
    // Update slider labels
    document.getElementById('redValue').textContent = r;
    document.getElementById('greenValue').textContent = g;
    document.getElementById('blueValue').textContent = b;
}

function updateColorFromSliders() {
    const r = document.getElementById('redSlider').value;
    const g = document.getElementById('greenSlider').value;
    const b = document.getElementById('blueSlider').value;
    
    // Update labels
    document.getElementById('redValue').textContent = r;
    document.getElementById('greenValue').textContent = g;
    document.getElementById('blueValue').textContent = b;
    
    // Convert to hex
    const hex = '#' + parseInt(r).toString(16).padStart(2, '0') + 
                parseInt(g).toString(16).padStart(2, '0') + 
                parseInt(b).toString(16).padStart(2, '0');
    
    // Update color input and preview
    document.getElementById('colorInput').value = hex;
    document.getElementById('colorPreview').style.background = hex;
    document.getElementById('colorHex').textContent = hex;
    document.getElementById('colorRgb').textContent = `rgb(${r}, ${g}, ${b})`;
}

// ==================== TEXT TOOLS FUNCTIONS ====================

function initializeTextTools() {
    const textArea = document.getElementById('textInput');
    textArea.addEventListener('input', updateTextStats);
    updateTextStats();
}

function updateTextStats() {
    const text = document.getElementById('textInput').value;
    const charCount = text.length;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lineCount = text === '' ? 0 : text.split('\n').length;
    
    document.getElementById('charCount').textContent = charCount;
    document.getElementById('wordCount').textContent = wordCount;
    document.getElementById('lineCount').textContent = lineCount;
}

function textToUpperCase() {
    const textArea = document.getElementById('textInput');
    textArea.value = textArea.value.toUpperCase();
    updateTextStats();
}

function textToLowerCase() {
    const textArea = document.getElementById('textInput');
    textArea.value = textArea.value.toLowerCase();
    updateTextStats();
}

function textToTitleCase() {
    const textArea = document.getElementById('textInput');
    const text = textArea.value;
    const titleCase = text.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    textArea.value = titleCase;
    updateTextStats();
}

function reverseText() {
    const textArea = document.getElementById('textInput');
    textArea.value = textArea.value.split('').reverse().join('');
    updateTextStats();
}

function countCharacters() {
    const text = document.getElementById('textInput').value;
    const charCount = text.length;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lineCount = text === '' ? 0 : text.split('\n').length;
    
    alert(`Text Analysis:\nCharacters: ${charCount}\nWords: ${wordCount}\nLines: ${lineCount}`);
}

function clearText() {
    document.getElementById('textInput').value = '';
    updateTextStats();
}

// ==================== QUANTUM CALENDAR FUNCTIONS ====================
let currentDate = new Date();
let selectedDate = null;
let events = JSON.parse(localStorage.getItem('cyberCalendarEvents')) || [];

function initializeCalendar() {
    renderCalendar();
    updateCurrentMonth();
    loadEvents();
}

function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    let html = '';
    
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const isCurrentMonth = date.getMonth() === month;
        const isToday = isSameDate(date, new Date());
        const isSelected = selectedDate && isSameDate(date, selectedDate);
        const hasEvent = events.some(event => isSameDate(new Date(event.date), date));
        
        let classes = 'calendar-day';
        if (!isCurrentMonth) classes += ' other-month';
        if (isToday) classes += ' today';
        if (isSelected) classes += ' selected';
        if (hasEvent) classes += ' has-event';
        
        html += `<div class="${classes}" onclick="selectDate('${date.toISOString()}')">${date.getDate()}</div>`;
    }
    
    calendarDays.innerHTML = html;
}

function updateCurrentMonth() {
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        const options = { month: 'long', year: 'numeric' };
        currentMonthElement.textContent = currentDate.toLocaleDateString('en-US', options);
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    updateCurrentMonth();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    updateCurrentMonth();
}

function goToToday() {
    currentDate = new Date();
    selectedDate = null;
    renderCalendar();
    updateCurrentMonth();
}

function selectDate(dateString) {
    const date = new Date(dateString);
    selectedDate = date;
    renderCalendar();
}

function addEvent() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        const eventDate = document.getElementById('eventDate');
        if (eventDate && selectedDate) {
            eventDate.value = selectedDate.toISOString().split('T')[0];
        }
        modal.style.display = 'block';
    }
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'none';
        clearEventForm();
    }
}

function clearEventForm() {
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventDescription').value = '';
    document.getElementById('eventColor').value = '#00f5ff';
}

function saveEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const description = document.getElementById('eventDescription').value.trim();
    const color = document.getElementById('eventColor').value;
    
    if (!title || !date) {
        showNotification('Please fill in at least the title and date', 'error');
        return;
    }
    
    const event = {
        id: Date.now().toString(),
        title,
        date,
        time,
        description,
        color,
        createdAt: new Date().toISOString()
    };
    
    events.push(event);
    saveEvents();
    renderCalendar();
    closeEventModal();
    showNotification('Event saved successfully!', 'success');
}

function deleteEvent(eventId) {
    events = events.filter(event => event.id !== eventId);
    saveEvents();
    renderCalendar();
    showNotification('Event deleted successfully!', 'success');
}

function saveEvents() {
    localStorage.setItem('cyberCalendarEvents', JSON.stringify(events));
}

function loadEvents() {
    events = JSON.parse(localStorage.getItem('cyberCalendarEvents')) || [];
}

function viewEvents() {
    if (events.length === 0) {
        showNotification('No events found. Add some events first!', 'info');
        return;
    }
    
    const eventList = events
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(event => `
            <div class="event-item" style="border-left: 4px solid ${event.color}">
                <div class="event-header">
                    <h4>${event.title}</h4>
                    <button onclick="deleteEvent('${event.id}')" class="delete-event-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="event-details">
                    <p><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
                    ${event.time ? `<p><i class="fas fa-clock"></i> ${event.time}</p>` : ''}
                    ${event.description ? `<p><i class="fas fa-align-left"></i> ${event.description}</p>` : ''}
                </div>
            </div>
        `).join('');
    
    showNotification(`
        <div class="events-list">
            <h3>Your Events (${events.length})</h3>
            ${eventList}
        </div>
    `, 'info', 10000);
}

function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `cyber-notification ${type}`;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('eventModal');
    if (event.target === modal) {
        closeEventModal();
    }
});

// ==================== NAVBAR ENHANCEMENTS ====================
function initializeNavbar() {
    // Navigation progress bar
    window.addEventListener('scroll', updateNavProgress);
    
    // Quick menu functionality
    initializeQuickMenu();
    
    // Mobile menu toggle
    initializeMobileMenu();
    
    // Active link highlighting
    highlightActiveLink();
}

function updateNavProgress() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressFill.style.width = scrollPercent + '%';
    }
}

function initializeQuickMenu() {
    const quickMenuToggle = document.querySelector('.quick-menu-toggle');
    const quickMenuDropdown = document.querySelector('.quick-menu-dropdown');
    
    if (quickMenuToggle && quickMenuDropdown) {
        quickMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            quickMenuDropdown.classList.toggle('active');
        });
        
        // Close quick menu when clicking outside
        document.addEventListener('click', function() {
            quickMenuDropdown.classList.remove('active');
        });
    }
}

function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const cyberMenu = document.querySelector('.cyber-menu');
    
    if (navToggle && cyberMenu) {
        navToggle.addEventListener('click', function() {
            cyberMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

function highlightActiveLink() {
    const links = document.querySelectorAll('.cyber-link');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` || 
                (current === 'home' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ==================== UTILITY FUNCTIONS ====================

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to generate password
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        generatePassword();
    }
    
    // Ctrl/Cmd + K to focus calculator
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('calcCurrent').focus();
    }
});

// Add tool card hover effects
document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animations for weather
function showWeatherLoading() {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = `
        <div class="weather-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading weather data...</p>
        </div>
    `;
}

// Export functions for global access
window.cyberTools = {
    appendToCalc,
    clearCalculator,
    deleteLastChar,
    calculateResult,
    getWeather,
    updateConverter,
    convertUnits,
    updatePasswordLength,
    generatePassword,
    copyPassword,
    updateColor,
    updateColorFromSliders,
    textToUpperCase,
    textToLowerCase,
    textToTitleCase,
    reverseText,
    countCharacters,
    clearText,
    initializeCalendar, // Add new functions to global object
    renderCalendar,
    updateCurrentMonth,
    previousMonth,
    nextMonth,
    goToToday,
    selectDate,
    addEvent,
    closeEventModal,
    clearEventForm,
    saveEvent,
    deleteEvent,
    viewEvents,
    // Navbar functions
    initializeNavbar,
    updateNavProgress,
    initializeQuickMenu,
    initializeMobileMenu,
    highlightActiveLink
};
