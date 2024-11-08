let currentInput = '';
let operator = '';
let previousInput = '';

// Function to append numbers to the display
function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

// Function to set the operator (+, -, *, /)
function setOperation(op) {
    if (currentInput === '') return; // Avoid setting operation if no number is entered
    if (previousInput !== '') {
        calculateResult();
    }
    operator = op;
    previousInput = currentInput;
    currentInput = '';
}

// Function to clear the display
function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operator = '';
    updateDisplay();
}

// Function to calculate the result
function calculateResult() {
    if (previousInput === '' || currentInput === '') return;
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                result = 'Error'; // Handle division by zero
            } else {
                result = prev / current;
            }
            break;
        default:
            return;
    }

    currentInput = result.toString();
    operator = '';
    previousInput = '';
    updateDisplay();
}

// Function to update the display screen
function updateDisplay() {
    document.getElementById('display').value = currentInput;
}
