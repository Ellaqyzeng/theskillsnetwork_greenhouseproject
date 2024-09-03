const plantSettings = {
    "Lettuce": {"temp_range": [16, 18], "humidity_range": [50, 70], "co2_range": [300, 500], "o2_range": [18, 21]},
    "Cucumbers": {"temp_range": [24, 27], "humidity_range": [60, 70], "co2_range": [300, 600], "o2_range": [18, 21]},
    "Eggplant": {"temp_range": [21, 25], "humidity_range": [60, 70], "co2_range": [300, 600], "o2_range": [18, 21]},
    "Tomato": {"temp_range": [20, 24], "humidity_range": [60, 80], "co2_range": [300, 800], "o2_range": [18, 21]},
    "Peas": {"temp_range": [13, 18], "humidity_range": [40, 60], "co2_range": [300, 500], "o2_range": [18, 21]},
    "Peppers": {"temp_range": [20, 25], "humidity_range": [50, 70], "co2_range": [300, 600], "o2_range": [18, 21]}
};

let monitoringData = [];
let isAutomatedControl = false;

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

    let fanStatus = document.getElementById('fanControl').textContent.includes('ON') ? 'ON' : 'OFF';
    let lightStatus = document.getElementById('lightControl').textContent.includes('ON') ? 'ON' : 'OFF';
    let heaterStatus = document.getElementById('heaterControl').textContent.includes('ON') ? 'ON' : 'OFF';
    let wateringStatus = document.getElementById('wateringControl').textContent.includes('ON') ? 'ON' : 'OFF';

    if (isAutomatedControl) {
        if (temp < tempRange[0]) {
            heaterStatus = 'ON';
        } else if (temp > tempRange[1]) {
            fanStatus = 'ON';
        }

        if (humidity < humidityRange[0]) {
            wateringStatus = 'ON';
        }

        // Simulating day/night cycle
        const hour = new Date().getHours();
        lightStatus = (hour >= 6 && hour < 18) ? 'ON' : 'OFF';
    }

    const statusHTML = `
        <p>Temperature: ${temp.toFixed(1)}°C (Ideal: ${tempRange[0]} - ${tempRange[1]}°C)</p>
        <p>Humidity: ${humidity.toFixed(1)}% (Ideal: ${humidityRange[0]} - ${humidityRange[1]}%)</p>
        <p>CO2 Level: ${co2.toFixed(1)} ppm (Ideal: ${co2Range[0]} - ${co2Range[1]} ppm)</p>
        <p>O2 Level: ${o2.toFixed(1)}% (Ideal: ${o2Range[0]} - ${o2Range[1]}%)</p>
        <p>Fan: ${fanStatus}</p>
        <p>Light: ${lightStatus}</p>
        <p>Heater: ${heaterStatus}</p>
        <p>Watering: ${wateringStatus}</p>
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

    const timestamp = new Date().toLocaleString();
    monitoringData.push({ timestamp, temp, humidity, co2, o2 });
    if (monitoringData.length > 48) {
        monitoringData.shift();
    }

    updateMonitoringRecords();
    
    if (isAutomatedControl) {
        document.getElementById('fanControl').textContent = `Fan: ${fanStatus}`;
        document.getElementById('lightControl').textContent = `Light: ${lightStatus}`;
        document.getElementById('heaterControl').textContent = `Heater: ${heaterStatus}`;
        document.getElementById('wateringControl').textContent = `Watering: ${wateringStatus}`;
    }
}

function updateMonitoringRecords() {
    const recordElement = document.getElementById('record');
    recordElement.innerHTML = '<h3>Real-Time Monitoring (Last 48 hours):</h3>';
    monitoringData.forEach(data => {
        recordElement.innerHTML += `<p>${data.timestamp} - Temp: ${data.temp.toFixed(1)}°C, Humidity: ${data.humidity.toFixed(1)}%, CO2: ${data.co2.toFixed(1)} ppm, O2: ${data.o2.toFixed(1)}%</p>`;
    });
}

function toggleAutomatedControl() {
    isAutomatedControl = !isAutomatedControl;
    const automatedControlButton = document.getElementById('automatedControl');
    automatedControlButton.textContent = `Automated Control: ${isAutomatedControl ? 'ON' : 'OFF'}`;
    automatedControlButton.classList.toggle('active', isAutomatedControl);
    
    const controlButtons = document.querySelectorAll('.control-button');
    controlButtons.forEach(button => {
        button.disabled = isAutomatedControl;
    });
}

function toggleControl(controlType) {
    if (!isAutomatedControl) {
        const button = document.getElementById(`${controlType}Control`);
        const isOn = button.textContent.includes('ON');
        button.textContent = `${controlType.charAt(0).toUpperCase() + controlType.slice(1)}: ${isOn ? 'OFF' : 'ON'}`;
        button.classList.toggle('active', !isOn);
    }
}

document.getElementById('automatedControl').addEventListener('click', toggleAutomatedControl);
document.getElementById('fanControl').addEventListener('click', () => toggleControl('fan'));
document.getElementById('lightControl').addEventListener('click', () => toggleControl('light'));
document.getElementById('heaterControl').addEventListener('click', () => toggleControl('heater'));
document.getElementById('wateringControl').addEventListener('click', () => toggleControl('watering'));

setInterval(updateEnvironment, 5000); // Update every 5 seconds
updateEnvironment(); // Initial update