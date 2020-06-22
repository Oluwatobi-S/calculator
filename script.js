const displayOperationNode = document.querySelector('.operation');
const displayResultNode = document.querySelector('.result');
const numberBtnNodes = document.querySelectorAll('.number');
const operatorBtnNodes = document.querySelectorAll('.operator-btn');
const equalBtnNode = document.querySelector('.equal-btn');

let numberBtn = false;
let operatorBtn = false;
let equalBtn = true;
let newOperand = 0;
let storedOperand = 0;
let clickedOperator;
let operation = '';
let result = 0;

numberBtnNodes.forEach(item => item.addEventListener('click', displayNumber));
operatorBtnNodes.forEach(item => item.addEventListener('click', displayOperation));
equalBtnNode.addEventListener('click', operate);

function displayNumber() {
    numberBtn = true;
    let clickedNumber = Number(this.innerText);

    if (/=/.test(displayOperationNode.innerText)) {
        displayOperationNode.innerText = '';
        operation = '';
        storedOperand = 0;
    }

    if (displayResultNode.innerText.length < 9) {
        if ((displayResultNode.innerText === '0') && (clickedNumber === 0)) {
            operatorBtn = false;
            displayResultNode.innerText = 0;
        } else if (((displayResultNode.innerText === '0') || (operatorBtn)) && (/[^0]/.test(clickedNumber))) {
            operatorBtn = false;
            displayResultNode.innerText = clickedNumber;
        } else if (/[1-9]/.test(displayResultNode.innerText) && (!operatorBtn)) {
            displayResultNode.innerText += clickedNumber;
        } else if (/[1-9]/.test(displayResultNode.innerText) && (operatorBtn)) {
            displayResultNode.innerText = clickedNumber;
        }
        
        newOperand = Number(displayResultNode.innerText);
    }
}

function displayOperation() {
    operatorBtn = true;
    clickedOperator = this.innerText;

    if (/=/.test(displayOperationNode.innerText)) {
        numberBtn = false;
        displayOperationNode.innerText = storedOperand + clickedOperator;
        return;
    }

    if (displayOperationNode.innerText && numberBtn) {
        equalBtn = false;
        operate();
        numberBtn = false;
        return;
    }

    if (numberBtn) {
        storedOperand = newOperand;
        operation += storedOperand + clickedOperator;
        displayOperationNode.innerText = operation;
    } else if (!numberBtn) {
        let splitOprtnStrIntoArr = displayOperationNode.innerText.split('');
        splitOprtnStrIntoArr[splitOprtnStrIntoArr.length - 1] = clickedOperator;
        let newOperation = splitOprtnStrIntoArr.join('');
        displayOperationNode.innerText = newOperation;
    }
    numberBtn = false;
}

function operate() {
    if (equalBtn) {
        operation = storedOperand + clickedOperator + newOperand + '='
    } else {
        operation = storedOperand + '+' + newOperand + clickedOperator;
    }
    
    displayOperationNode.innerText = operation;

    if (clickedOperator === "+") {
        result = add(storedOperand, newOperand);
    } else if (clickedOperator === "x") {
        result = multiply(storedOperand, newOperand);
    }
    
    displayResultNode.innerText = result;
    storedOperand = result;
    operatorBtn = true;
    equalBtn = true;
}

function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

function subtract(a, b) {
    return a - b;
}

function divide(a, b) {
    return a / b;
}

function operate1(operator, num1, num2) {
    return operator(num1, num2);
}

// resetDisplayOperation();

// function resetDisplayOperation() {
//     displayOperationNode.innerText = '';
//     storedOperand = 0;
// }