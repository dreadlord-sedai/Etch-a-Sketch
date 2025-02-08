/**
 * Global state variables to track application state
 */
const state = {
    currentMode: 'default',  // Current drawing mode
    pixelSize: 60,          // Current size of each pixel
    isDrawing: false        // Whether user is currently drawing
}

/**
 * Drawing mode configurations
 * Defines behavior for different drawing modes
 */
const drawingModes = {
    default: {
        color: '#6366f1',  // Matches our accent color
        apply: (element) => {
            element.style.backgroundColor = drawingModes.default.color;
        }
    },
    random: {
        apply: (element) => {
            // Generate random RGB values
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            element.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
    },
    shade: {
        apply: (element) => {
            // Get current shade level (0-10)
            let level = parseInt(element.dataset.shadeLevel || '0');
            if (level < 10) {
                level++;
                element.dataset.shadeLevel = level;
                // Calculate opacity based on level
                const opacity = level * 0.1;
                element.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
            }
        }
    }
}

/**
 * Calculates grid dimensions based on pixel size
 * @param {number} pixelSize - Size of each pixel in pixels
 * @returns {number} - Number of squares per side
 */
function calculateGridSize(pixelSize) {
    return Math.floor(960 / pixelSize);
}

/**
 * Creates the drawing grid
 * @param {number} pixelSize - Size of each pixel in pixels
 */
function createGrid(pixelSize) {
    const container = document.getElementById('container');
    container.innerHTML = '';  // Clear existing grid
    
    const gridSize = calculateGridSize(pixelSize);
    const totalSquares = gridSize * gridSize;
    
    // Update UI to show current grid dimensions
    document.getElementById('sizeValue').textContent = `${gridSize} x ${gridSize}`;
    
    // Create grid squares
    for (let i = 0; i < totalSquares; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-square');
        square.style.width = `${pixelSize}px`;
        square.style.height = `${pixelSize}px`;
        
        // Add event listeners for drawing
        square.addEventListener('mousedown', startDrawing);
        square.addEventListener('mouseover', draw);
        square.addEventListener('mouseup', stopDrawing);
        
        container.appendChild(square);
    }
}

/**
 * Starts the drawing process
 * @param {Event} e - Mouse event
 */
function startDrawing(e) {
    state.isDrawing = true;
    draw(e);  // Draw initial pixel
}

/**
 * Handles the drawing logic
 * @param {Event} e - Mouse event
 */
function draw(e) {
    if (!state.isDrawing) return;
    // Apply current drawing mode to the square
    drawingModes[state.currentMode].apply(e.target);
}

/**
 * Stops the drawing process
 */
function stopDrawing() {
    state.isDrawing = false;
}

/**
 * Changes the current drawing mode
 * @param {string} mode - The new drawing mode to set
 */
function setDrawingMode(mode) {
    // Update state
    state.currentMode = mode;
    
    // Update UI
    document.querySelectorAll('.btn-mode').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
}

/**
 * Clears the entire grid
 */
function clearGrid() {
    document.querySelectorAll('.grid-square').forEach(square => {
        square.style.backgroundColor = '';
        square.dataset.shadeLevel = '0';
    });
}

/**
 * Saves the canvas as an image
 * Uses html2canvas library (would need to be added)
 */
function downloadCanvas() {
    alert('Save functionality would go here - requires html2canvas or similar library');
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize grid size slider
    const slider = document.getElementById('gridSize');
    slider.addEventListener('input', (e) => {
        state.pixelSize = parseInt(e.target.value);
        createGrid(state.pixelSize);
    });
    
    // Prevent dragging causing drawing issues
    document.addEventListener('mouseup', stopDrawing);
    
    // Create initial grid
    createGrid(state.pixelSize);
});