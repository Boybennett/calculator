document.addEventListener('DOMContentLoaded', () => {
    // Select the display and all buttons from the DOM
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.buttons-grid button');

    let currentInput = ''; // Stores the current number or operator string
    let firstOperand = null; // Stores the first number in the calculation
    let operator = null; // Stores the selected operator (+, -, *, /)
    let waitingForSecondOperand = false; // Flag to indicate if we are ready for the second number

    // Function to update the display text
    const updateDisplay = () => {
        display.value = currentInput || ''; // If currentInput is empty, show '0'
    };

    // Function to handle number button clicks
    const handleNumber = (number) => {
        if (waitingForSecondOperand) {
            // If we've just pressed an operator, start a new number
            currentInput = number;
            waitingForSecondOperand = false;
        } else {
            // Otherwise, append the number to the current input
            currentInput = currentInput === '0' ? number : currentInput + number;
        }
        updateDisplay();
    };

    // Function to handle decimal point
    const handleDecimal = () => {
        // Prevent multiple decimal points in the same number
        if (waitingForSecondOperand) {
            currentInput = '0.';
            waitingForSecondOperand = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    };

    // Function to handle operators
    const handleOperator = (nextOperator) => {
        // Convert current input to a number
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) {
            // If an operator is pressed consecutively, update the operator
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) {
            // If this is the first number, store it
            firstOperand = inputValue;
        } else if (operator) {
            // If we have an operator and a first number, perform the calculation
            const result = performCalculation(firstOperand, operator, inputValue);
            currentInput = String(result);
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    };

    // Function to perform the actual math
    const performCalculation = (op1, op, op2) => {
        switch (op) {
            case '+': return op1 + op2;
            case '-': return op1 - op2;
            case '*': return op1 * op2;
            case '/': 
                if (op2 === 0) {
                    alert("Cannot divide by zero!");
                    return 0; // Or handle as an error
                }
                return op1 / op2;
            case 'mod': return op1 % op2;
            default: return op2;
        }
    };

    // Function to reset the calculator
    const resetCalculator = () => {
        currentInput = '';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    };

    // Main logic: Add click event listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const buttonValue = event.target.textContent;

            // Handle numbers
            if (!isNaN(parseFloat(buttonValue)) || buttonValue === '.') {
                if (buttonValue === '.') {
                    handleDecimal();
                } else {
                    handleNumber(buttonValue);
                }
                return;
            }

            // Handle operators and special buttons
            switch (buttonValue) {
                case '+':
                case '-':
                case '*':
                case '/':
                case 'mod':
                    handleOperator(buttonValue);
                    break;
                case '=':
                    // Perform final calculation when equals is pressed
                    if (firstOperand !== null && operator && !waitingForSecondOperand) {
                        handleOperator(operator); // Re-use operator logic to calculate the final result
                        operator = null; // Clear the operator after calculation
                    }
                    break;
                case 'C':
                    resetCalculator();
                    break;
            }
        });
    });

    // Initialize the display on page load
    updateDisplay();
});