const plantSettings = {
    "Lettuce": {"temp_range": [16, 18], "humidity_range": [50, 70], "co2_range": [300, 500], "o2_range": [18, 21]},
    "Cucumbers": {"temp_range": [24, 27], "humidity_range": [60, 70], "co2_range": [300, 600], "o2_range": [18, 21]},
    "Eggplant": {"temp_range": [21, 25], "humidity_range": [60, 70], "co2_range": [300, 600], "o2_range": [18, 21]},
    "Tomato": {"temp_range": [20, 24], "humidity_range": [60, 80], "co2_range": [300, 800], "o2_range": [18, 21]},
    "Peas": {"temp_range": [13, 18], "humidity_range": [40, 60], "co2_range": [300, 500], "o2_range": [18, 21]},
    "Peppers": {"temp_range": [20, 25], "humidity_range": [50, 70], "co2_range": [300, 600], "o2_range": [18, 21]}
};

let monitoringData = []; // To store the last 48 hours of monitoring data

function getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
}

function updateEnvironment() {
    const plant = document.getElementById('plantSelect').value;
    const temp = getRandomValue(15, 35);
    const humidity = getRandomValue(30, 90);
    const co2 = getRandomValue(250, 900);
    const o2 = getRandomValue(15, 25);
    const tempRange = plantSettings[plant].temp_range;
    const humidityRange = plantSettings[plant].humidity_range;
    const co2Range = plantSettings[plant].co2_range;
    const o2Range = plantSettings[plant].o2_range;

    let heaterStatus = 'OFF';
    let coolerStatus = 'OFF';
    if (temp < tempRange[0]) {
        heaterStatus = 'ON';
    } else if (temp > tempRange[1]) {
        coolerStatus = 'ON';
    }

    const statusHTML = `
        <p>Temperature: ${temp.toFixed(1)}°C (Ideal: ${tempRange[0]} - ${tempRange[1]}°C)</p>
        <p>Humidity: ${humidity.toFixed(1)}% (Ideal: ${humidityRange[0]} - ${humidityRange[1]}%)</p>
        <p>CO2 Level: ${co2.toFixed(1)} ppm (Ideal: ${co2Range[0]} - ${co2Range[1]} ppm)</p>
        <p>O2 Level: ${o2.toFixed(1)}% (Ideal: ${o2Range[0]} - ${o2Range[1]}%)</p>
        <p>Heater: ${heaterStatus}</p>
        <p>Cooler: ${coolerStatus}</p>
    `;
    document.getElementById('status').innerHTML = statusHTML;

    const alerts = [];
    if (temp < tempRange[0] || temp > tempRange[1]) {
        alerts.push(`Temperature out of range for ${plant}!`);
    }
    if (humidity < humidityRange[0] || humidity > humidityRange[1]) {
        alerts.push(`Humidity out of range for ${plant}!`);
    }
    if (co2 < co2Range[0] || co2 > co2Range[1]) {
        alerts.push(`CO2 level out of range for ${plant}!`);
    }
    if (o2 < o2Range[0] || o2 > o2Range[1]) {
        alerts.push(`O2 level out of range for ${plant}!`);
    }

    const alertsElement = document.getElementById('alerts');
    if (alerts.length > 0) {
        alertsElement.innerHTML = 'Alerts:<br>' + alerts.join('<br>');
    } else {
        alertsElement.innerHTML = 'No alerts.';
    }

    // Record the current data for the past 48 hours
    const timestamp = new Date().toLocaleString();
    monitoringData.push({ timestamp, temp, humidity, co2, o2 });
    if (monitoringData.length > 48) {
        monitoringData.shift(); // Keep only the last 48 records
    }

    updateMonitoringRecords();
}

function updateMonitoringRecords() {
    const recordElement = document.getElementById('record');
    recordElement.innerHTML = '<h3>Real-Time Monitoring (Last 48 hours):</h3>';
    monitoringData.forEach(data => {
        recordElement.innerHTML += `<p>${data.timestamp} - Temp: ${data.temp.toFixed(1)}°C, Humidity: ${data.humidity.toFixed(1)}%, CO2: ${data.co2.toFixed(1)} ppm, O2: ${data.o2.toFixed(1)}%</p>`;
    });
}

// Manual adjustments
function adjustIdealValues(type) {
    const newValue = parseFloat(prompt(`Enter new ideal value for ${type}:`));
    if (isNaN(newValue)) {
        alert('Invalid input. Please enter a number.');
        return;
    }
    const plant = document.getElementById('plantSelect').value;
    if (type === 'CO2') {
        const min = plantSettings[plant].co2_range[0];
        const max = plantSettings[plant].co2_range[1];
        if (newValue < min || newValue > max) {
            alert(`Value out of range! Ideal CO2 level should be between ${min} and ${max} ppm.`);
            return;
        }
        plantSettings[plant].co2_range[1] = newValue;
    } else if (type === 'O2') {
        const min = plantSettings[plant].o2_range[0];
        const max = plantSettings[plant].o2_range[1];
        if (newValue < min || newValue > max) {
            alert(`Value out of range! Ideal O2 level should be between ${min} and ${max}%.`);
            return;
        }
        plantSettings[plant].o2_range[1] = newValue;
    } else if (type === 'Temp') {
        const min = plantSettings[plant].temp_range[0];
        const max = plantSettings[plant].temp_range[1];
        if (newValue < min || newValue > max) {
            alert(`Value out of range! Ideal temperature should be between ${min} and ${max}°C.`);
            return;
        }
        plantSettings[plant].temp_range[1] = newValue;
    } else if (type === 'Humidity') {
        const min = plantSettings[plant].humidity_range[0];
        const max = plantSettings[plant].humidity_range[1];
        if (newValue < min || newValue > max) {
            alert(`Value out of range! Ideal humidity should be between ${min} and ${max}%.`);
            return;
        }
        plantSettings[plant].humidity_range[1] = newValue;
    }
}

document.getElementById('updateButton').addEventListener('click', updateEnvironment);

document.getElementById('adjustCO2').addEventListener('click', () => adjustIdealValues('CO2'));
document.getElementById('adjustO2').addEventListener('click', () => adjustIdealValues('O2'));
document.getElementById('adjustTemp').addEventListener('click', () => adjustIdealValues('Temp'));
document.getElementById('adjustHumidity').addEventListener('click', () => adjustIdealValues('Humidity'));
