const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const wpmValue = document.getElementById('wpm-value');
const accuracyValue = document.getElementById('accuracy-value');
const restartBtn = document.getElementById('restart-btn');

// Sample texts for the test
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling a computer what to do.",
    "Learning to type correctly drastically improves your efficiency.",
    "A journey of a thousand miles begins with a single step.",
    "The sky above the port was the color of television, tuned to a dead channel."
];

let targetText = '';
let startTime = 0;
let totalTypedCharacters = 0;
let correctTypedCharacters = 0;
let timer = null;
let isRunning = false;

// --- Core Logic Functions ---

/**
 * Initializes a new typing test.
 */
function initializeTest() {
    // 1. Reset state
    isRunning = false;
    clearTimeout(timer);
    startTime = 0;
    totalTypedCharacters = 0;
    correctTypedCharacters = 0;
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    wpmValue.textContent = 0;
    accuracyValue.textContent = '0%';

    // 2. Select and display new text
    targetText = selectRandomText();
    renderText(targetText);
}

/**
 * Selects a random text from the sample array.
 * @returns {string} The selected text.
 */
function selectRandomText() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    return sampleTexts[randomIndex];
}

/**
 * Renders the target text as individual character spans.
 * @param {string} text The text to render.
 */
function renderText(text) {
    textDisplay.innerHTML = '';
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('char');
        if (index === 0) {
            span.classList.add('current'); // Highlight the first character
        }
        textDisplay.appendChild(span);
    });
}

/**
 * Handles input events from the textarea.
 */
function handleInput() {
    if (!isRunning) {
        startTimer();
        isRunning = true;
    }

    const typedText = textInput.value;
    const currentCharIndex = typedText.length - 1;

    // Check if the test is finished
    if (typedText.length === targetText.length) {
        finishTest();
        return;
    }

    // Process the last typed character
    if (typedText.length > totalTypedCharacters) {
        totalTypedCharacters++;
        
        const currentChar = targetText[currentCharIndex];
        const typedChar = typedText[currentCharIndex];
        
        const charElement = textDisplay.children[currentCharIndex];

        // 1. Update character color/status
        charElement.classList.remove('current');
        if (typedChar === currentChar) {
            charElement.classList.add('correct');
            correctTypedCharacters++;
        } else {
            charElement.classList.add('incorrect');
        }

        // 2. Highlight the next character
        const nextCharElement = textDisplay.children[currentCharIndex + 1];
        if (nextCharElement) {
            nextCharElement.classList.add('current');
        }

    } else if (typedText.length < totalTypedCharacters) {
        // Handle backspace
        totalTypedCharacters--;
        
        // 1. Un-highlight the current character (where the cursor is now)
        const currentElement = textDisplay.children[currentCharIndex + 1];
        if (currentElement) {
            currentElement.classList.remove('current');
        }

        // 2. Reset the previous character
        const prevElement = textDisplay.children[currentCharIndex];
        if (prevElement) {
            // Check if we need to remove a 'correct' count
            const wasCorrect = prevElement.classList.contains('correct');
            if (wasCorrect) {
                correctTypedCharacters--;
            }
            prevElement.classList.remove('correct', 'incorrect');
            prevElement.classList.add('current');
        }
    }

    updateStats();
}

/**
 * Starts the timer and sets the start time.
 */
function startTimer() {
    startTime = new Date().getTime();
    timer = setInterval(updateStats, 1000); // Update stats every second
}

/**
 * Updates WPM and Accuracy metrics.
 */
function updateStats() {
    if (!isRunning && totalTypedCharacters === 0) return;

    const currentTime = new Date().getTime();
    const elapsedTimeInMinutes = (currentTime - startTime) / 60000; // Convert ms to minutes
    
    // WPM: (Total Correct Characters / 5) / Time in Minutes
    const wpm = elapsedTimeInMinutes > 0 ? Math.round((correctTypedCharacters / 5) / elapsedTimeInMinutes) : 0;
    
    // Accuracy: (Correct Characters / Total Characters Typed) * 100
    const accuracy = totalTypedCharacters > 0 
        ? Math.round((correctTypedCharacters / totalTypedCharacters) * 100) 
        : 0;

    wpmValue.textContent = wpm;
    accuracyValue.textContent = `${accuracy}%`;
}

/**
 * Stops the timer and disables the input field upon test completion.
 */
function finishTest() {
    isRunning = false;
    clearTimeout(timer);
    textInput.disabled = true;

    // Ensure final stats are calculated
    updateStats();

    // Remove the 'current' class from the last character
    const lastCharElement = textDisplay.children[targetText.length - 1];
    if (lastCharElement) {
        lastCharElement.classList.remove('current');
    }
}

// --- Event Listeners ---

textInput.addEventListener('input', handleInput);
restartBtn.addEventListener('click', initializeTest);

// --- Initialization ---

initializeTest();