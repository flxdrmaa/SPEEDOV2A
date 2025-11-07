let elements = {};
let speedMode = 1;
let indicators = 0;

const onOrOff = state => state ? 'On' : 'Off';

/**
 * Updates the display of the engine state.
 *
 * @param {boolean} state If true, the engine is on; otherwise, it is off.
 * @description Sets the engine state display based on the provided boolean state.
 */
function setEngine(state) {
    const engineIcon = document.getElementById('engine-icon');
    if (state) {
        engineIcon.classList.add('active');
    } else {
        engineIcon.classList.remove('active');
    }
}

/**
 * Updates the speed display based on the current speed mode.
 * @param {number} speed - The speed value in meters per second (m/s).
 * @description Converts the speed value to the current speed mode and updates the display.
 */
function setSpeed(speed) {
    let displaySpeed;
    switch(speedMode) {
        case 1: // MPH
            displaySpeed = Math.round(speed * 2.236936);
            break;
        case 2: // Knots
            displaySpeed = Math.round(speed * 1.943844);
            break;
        default: // KMH
            displaySpeed = Math.round(speed * 3.6);
    }
    
    // Update speed display
    document.getElementById('speed').textContent = displaySpeed;
    
    // Update needle position
    updateSpeedNeedle(displaySpeed);
}

/**
 * Updates the RPM (Revolutions Per Minute) display.
 * @param {number} rpm - The RPM value to display (0 to 1).
 */
function setRPM(rpm) {
    // Convert normalized RPM (0-1) to actual RPM (0-8000)
    const actualRPM = rpm * 8000;
    document.getElementById('rpm-value').textContent = (actualRPM/1000).toFixed(1) + 'k';
    
    // Update RPM indicators visualization if needed
    updateRPMIndicators(rpm);
}

/**
 * Updates the fuel level display as a percentage.
 * @param {number} fuel - The fuel level (0 to 1).
 */
function setFuel(fuel) {
    const fuelPercentage = fuel * 100;
    const fuelBar = document.getElementById('fuel-bar');
    const fuelText = document.getElementById('fuel-text');
    
    // Update fuel bar width
    fuelBar.style.width = fuelPercentage + '%';
    
    // Update fuel text (assuming 100L tank capacity)
    const fuelLiters = Math.floor(fuel * 100);
    fuelText.textContent = fuelLiters + 'L';
    
    // Change color based on fuel level
    if (fuelPercentage < 15) {
        fuelBar.style.background = 'var(--warning-color)';
        fuelBar.style.boxShadow = '0 0 6px rgba(255, 165, 0, 0.6)';
    } else {
        fuelBar.style.background = 'linear-gradient(90deg, var(--fuel-color), #0088aa)';
        fuelBar.style.boxShadow = '0 0 6px rgba(0, 200, 255, 0.6)';
    }
}

/**
 * Updates the vehicle health display as a percentage.
 * @param {number} health - The vehicle health level (0 to 1).
 */
function setHealth(health) {
    // This could be mapped to temperature or voltage in the current design
    const tempValue = 70 + (health * 30); // 70°C to 100°C range
    document.getElementById('temp-value').textContent = Math.round(tempValue) + '°C';
    
    // Update temperature bar
    const tempBar = document.getElementById('temp-bar');
    tempBar.style.width = (tempValue - 70) * 3.33 + '%'; // Convert to percentage for bar
    
    // Change color based on temperature
    if (tempValue > 95) {
        tempBar.style.background = 'var(--warning-color)';
    } else {
        tempBar.style.background = 'linear-gradient(90deg, var(--success-color), var(--warning-color))';
    }
}

/**
 * Updates the current gear display.
 * @param {number} gear - The current gear to display. 0 represents neutral/reverse.
 */
function setGear(gear) {
    // In the current design, gear could be displayed in the status panel
    // We can add a new status item or repurpose an existing one
    // For now, let's log it or we can add it to the voltage display temporarily
    if (gear === 0) {
        document.getElementById('voltage-value').textContent = 'N';
    } else if (gear === -1) {
        document.getElementById('voltage-value').textContent = 'R';
    } else {
        document.getElementById('voltage-value').textContent = 'G' + gear;
    }
}

/**
 * Updates the headlights status display.
 * @param {number} state - The headlight state (0: Off, 1: On, 2: High Beam).
 */
function setHeadlights(state) {
    const lightsIcon = document.getElementById('lights-icon');
    switch(state) {
        case 1: // On
            lightsIcon.classList.add('active');
            lightsIcon.querySelector('.icon-symbol').textContent = '💡';
            break;
        case 2: // High Beam
            lightsIcon.classList.add('active');
            lightsIcon.querySelector('.icon-symbol').textContent = '🔆';
            break;
        default: // Off
            lightsIcon.classList.remove('active');
            lightsIcon.querySelector('.icon-symbol').textContent = '💡';
    }
}

/**
 * Sets the state of the left turn indicator and updates the display.
 * @param {boolean} state - If true, turns the left indicator on; otherwise, turns it off.
 */
function setLeftIndicator(state) {
    indicators = (indicators & 0b10) | (state ? 0b01 : 0b00);
    updateIndicatorsDisplay();
}

/**
 * Sets the state of the right turn indicator and updates the display.
 * @param {boolean} state - If true, turns the right indicator on; otherwise, turns it off.
 */
function setRightIndicator(state) {
    indicators = (indicators & 0b01) | (state ? 0b10 : 0b00);
    updateIndicatorsDisplay();
}

/**
 * Updates the indicators display based on current state
 */
function updateIndicatorsDisplay() {
    const leftOn = indicators & 0b01;
    const rightOn = indicators & 0b10;
    
    // In the current design, we don't have a dedicated indicators display
    // We could use the existing icons or add visual effects
    // For now, we'll just store the state
}

/**
 * Updates the seatbelt status display.
 * @param {boolean} state - If true, indicates seatbelts are fastened; otherwise, indicates they are not.
 */
function setSeatbelts(state) {
    const seatbeltIcon = document.getElementById('seatbelt-icon');
    if (state) {
        seatbeltIcon.classList.remove('warning');
        seatbeltIcon.querySelector('.icon-symbol').textContent = '🔒';
    } else {
        seatbeltIcon.classList.add('warning');
        seatbeltIcon.querySelector('.icon-symbol').textContent = '🔓';
    }
}

/**
 * Sets the speed display mode and updates the speed unit display.
 * @param {number} mode - The speed mode to set (0: KMH, 1: MPH, 2: Knots).
 */
function setSpeedMode(mode) {
    speedMode = mode;
    const speedUnit = document.querySelector('.speed-unit');
    switch(mode) {
        case 1: // MPH
            speedUnit.textContent = 'MPH';
            break;
        case 2: // Knots
            speedUnit.textContent = 'Knots';
            break;
        default: // KMH
            speedUnit.textContent = 'KMH';
    }
}

/**
 * Updates the door status display.
 * @param {boolean} state - If true, indicates doors are closed; otherwise, indicates they are open.
 */
function setDoors(state) {
    const doorIcon = document.getElementById('door-icon');
    if (state) {
        doorIcon.classList.remove('active');
        doorIcon.querySelector('.icon-symbol').textContent = '🚪';
    } else {
        doorIcon.classList.add('active');
        doorIcon.querySelector('.icon-symbol').textContent = '🚪';
        // You could add warning class if you want it to pulse when open
    }
}

/**
 * Updates the lock status display.
 * @param {boolean} state - If true, indicates doors are locked; otherwise, indicates they are unlocked.
 */
function setLocks(state) {
    const lockIcon = document.getElementById('lock-icon');
    if (state) {
        lockIcon.classList.add('active');
        lockIcon.querySelector('.icon-symbol').textContent = '🔒';
    } else {
        lockIcon.classList.remove('active');
        lockIcon.querySelector('.icon-symbol').textContent = '🔓';
    }
}

/**
 * Updates the speed needle position
 * @param {number} speed - The speed value to display
 */
function updateSpeedNeedle(speed) {
    const needle = document.getElementById('speed-needle');
    // Convert speed to angle (135° to 405° range, but we use -135° to 135° for calculation)
    const minAngle = -135;
    const maxAngle = 135;
    
    // Assuming max speed is 200 for the gauge
    const maxSpeed = 200;
    const clampedSpeed = Math.min(speed, maxSpeed);
    const angle = minAngle + (clampedSpeed / maxSpeed) * (maxAngle - minAngle);
    
    needle.style.setProperty('--rotation', `${angle}deg`);
    needle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

/**
 * Updates RPM indicators visualization
 * @param {number} rpm - Normalized RPM value (0-1)
 */
function updateRPMIndicators(rpm) {
    // This function would update the visual RPM indicators
    // In a more advanced implementation, you could change the color
    // or intensity of the RPM bars based on the current RPM
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements object for backward compatibility
    elements = {
        engine: document.getElementById('engine-icon'),
        speed: document.getElementById('speed'),
        rpm: document.getElementById('rpm-value'),
        fuel: document.getElementById('fuel-text'),
        health: document.getElementById('temp-value'),
        gear: document.getElementById('voltage-value'),
        headlights: document.getElementById('lights-icon'),
        indicators: document.getElementById('indicators'),
        seatbelts: document.getElementById('seatbelt-icon'),
        speedMode: document.querySelector('.speed-unit'),
    };
    
    // Set initial values
    setSpeedMode(0); // Default to KMH
    setEngine(true);
    setHeadlights(1);
    setSeatbelts(true);
    setLocks(true);
    setDoors(true);
});

// Export functions for use in other scripts (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setEngine,
        setSpeed,
        setRPM,
        setFuel,
        setHealth,
        setGear,
        setHeadlights,
        setLeftIndicator,
        setRightIndicator,
        setSeatbelts,
        setSpeedMode,
        setDoors,
        setLocks
    };
}