const displayOperationNode = document.querySelector('.operation');
const displayResultNode = document.querySelector('.result');
const clearAllBtnNode = document.querySelector('.clear-all');
const clearLastDigitBtnNode = document.querySelector('.clear-last-digit');
const percentageBtnNode = document.querySelector('.percentage-btn');
const operatorBtnNodes = document.querySelectorAll('.operator-btn');
const numberBtnNodes = document.querySelectorAll('.number');
const plusMinusBtnNode = document.querySelector('.plus-minus-btn');
const dotBtnNode = document.querySelector('.dot-btn');
const equalBtnNode = document.querySelector('.equal-btn');

let operatorBtn = false;
let numberBtn = false;
let equalBtn = true;
let keyBoard = false;
let operation = '';
let pressedKey = '';
let storedOperator = '';
let clickedOperator = '';
let storedOperand = 0;
let newOperand = 0;
let result = 0;

clearAllBtnNode.addEventListener('click', clearAll);
clearLastDigitBtnNode.addEventListener('click', clearLastDigit);
percentageBtnNode.addEventListener('click', solvePercentage);
operatorBtnNodes.forEach(item => item.addEventListener('click', displayOperation));
numberBtnNodes.forEach(item => item.addEventListener('click', displayNumber));
plusMinusBtnNode.addEventListener('click', addOrRemoveMinus);
dotBtnNode.addEventListener('click', addDot);
equalBtnNode.addEventListener('click', operate);
document.addEventListener('keydown', getPressedKey);
document.addEventListener('keyup', removeKBPClass);

function clearAll() {
    if (keyBoard) {clearAllBtnNode.classList.add('keyboard-pressed');}

    numberBtn = false;
    operatorBtn = false;
    keyBoard = false;
    equalBtn = true;
    newOperand = 0;
    storedOperand = 0;
    clickedOperator = '';
    storedOperator = '';
    operation = '';
    result = 0;
    pressedKey = '';
    displayOperationNode.innerText = '';
    displayResultNode.innerText = '0';
}

function clearLastDigit() {
    if (keyBoard) {clearLastDigitBtnNode.classList.add('keyboard-pressed');}

    if (/[1-9]/.test(displayResultNode.innerText)) {
        let splitNumOnDisStrIntoArr = displayResultNode.innerText.split('');
        splitNumOnDisStrIntoArr.pop();
        if (/[^\d]/.test(splitNumOnDisStrIntoArr[0]) && splitNumOnDisStrIntoArr.length === 1) {
            splitNumOnDisStrIntoArr[0] = 0;
        } else if (splitNumOnDisStrIntoArr.length === 0) {
            splitNumOnDisStrIntoArr[0] = 0;
        }
        let newNumOnDis = splitNumOnDisStrIntoArr.join('');
        displayResultNode.innerText = newNumOnDis;
        newOperand = Number(newNumOnDis);
    }
}

function solvePercentage() {
    if (keyBoard) {percentageBtnNode.classList.add('keyboard-pressed');}

    if (result >= 1e+90) {
        displayResultNode.innerText = 'Error';
        return;
    }
    if (!operatorBtn) {
        result = newOperand / 100;
        displayResultNode.innerText = result;
        newOperand = result;
    }
    keyBoard = false;
}

function displayOperation() {
    for(i = 0; i < operatorBtnNodes.length; i++) {
        if (operatorBtnNodes[i].innerText === pressedKey) {
            operatorBtnNodes[i].classList.add('keyboard-pressed');
        }
    }
    if (result >= 1e+90) {
        displayResultNode.innerText = 'Error';
        return;
    }
    operatorBtn = true;
    storedOperator = clickedOperator;

    if (keyBoard) {
        clickedOperator = pressedKey;
        keyBoard = false;
    } else {
        clickedOperator = this.innerText;
    }
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
        operation = newOperation;
    }
    numberBtn = false;
}

function displayNumber() {
    numberBtn = true;
    let clickedNumber;
    if (keyBoard) {
        clickedNumber = Number(pressedKey);
        keyBoard = false;
    } else {
        clickedNumber = Number(this.innerText);
    }
    if (/=/.test(displayOperationNode.innerText)) {
        displayOperationNode.innerText = '';
        operation = '';
        storedOperand = 0;
    }
    if ((displayResultNode.innerText.length === 9) && operatorBtn) {
        displayResultNode.innerText = clickedNumber;
    }
    if (displayResultNode.innerText.length < 9) {
        if ((displayResultNode.innerText === '-') && (operatorBtn)) {
            operatorBtn = false;
            displayResultNode.innerText += clickedNumber;
        } else if ((displayResultNode.innerText === '0') && (clickedNumber === 0)) {
            operatorBtn = false;
            displayResultNode.innerText = 0;
        } else if (((displayResultNode.innerText === '0') || (operatorBtn)) && (/[^0]|[^\.]/.test(clickedNumber))) {
            operatorBtn = false;
            displayResultNode.innerText = clickedNumber;
        } else if (((displayResultNode.innerText === '-0')) && (/[^0]/.test(clickedNumber))) {
            operatorBtn = false;
            displayResultNode.innerText = '-' + clickedNumber;
        } else if (/[1-9]|\./.test(displayResultNode.innerText) && !operatorBtn) {
            displayResultNode.innerText += clickedNumber;
        } else if (/[1-9]/.test(displayResultNode.innerText) && operatorBtn) {
            displayResultNode.innerText = clickedNumber;
        } else if (displayResultNode.innerText === '0.') {
            displayResultNode.innerText += clickedNumber;
        }
        newOperand = Number(displayResultNode.innerText);
    }
}

function addOrRemoveMinus() {
    if (operatorBtn) {
        displayResultNode.innerText = '-';
        newOperand = Number('-0');
        return;
    }
    let splitNumOnDisStrIntoArr = displayResultNode.innerText.split('');
    (!displayResultNode.innerText.includes('-')) ?
    splitNumOnDisStrIntoArr.unshift('-') : splitNumOnDisStrIntoArr.shift();

    let newNumOnDis = splitNumOnDisStrIntoArr.join('');
    displayResultNode.innerText = newNumOnDis;
    newOperand = Number(newNumOnDis);
}

function addDot() {
    if (keyBoard) {dotBtnNode.classList.add('keyboard-pressed');}

    if (/\d/.test(displayResultNode.innerText) && (operatorBtn)) {
        operatorBtn = false;
        displayResultNode.innerText = '0.';
    }
    if (!displayResultNode.innerText.includes('.')) {
        let splitClkNumStrIntoArr = displayResultNode.innerText.split('');
        splitClkNumStrIntoArr[splitClkNumStrIntoArr.length] = '.';
        let newClickedNum = splitClkNumStrIntoArr.join('');
        displayResultNode.innerText = newClickedNum;
    }
    keyBoard = false;
}

function operate() {
    if (keyBoard) {equalBtnNode.classList.add('keyboard-pressed');}

    if (result >= 1e+90) {
        displayResultNode.innerText = 'Error';
        return;
    }
    if (equalBtn) {
        operation = storedOperand + clickedOperator + newOperand + '=';
        if (/\u{00F7}/u.test(clickedOperator)) {
            if (newOperand === (0 || '.')) {
                clearAll();
                displayResultNode.innerText = 'Impossible';
                return;
            } else {
                result = divide(storedOperand, newOperand);
            }
        } else if (clickedOperator === 'x') {
            result = multiply(storedOperand, newOperand);
        } else if (clickedOperator === '-') {
            result = subtract(storedOperand, newOperand);
        } else if (clickedOperator === '+') {
            result = add(storedOperand, newOperand);
        }
    } else {
        operation += newOperand + clickedOperator;
        if (/\u{00F7}/u.test(storedOperator)) {
            if (newOperand === (0 || '.')) {
                clearAll();
                displayResultNode.innerText = 'Impossible';
                return;
            } else {
                result = divide(storedOperand, newOperand);
            }
        } else if (storedOperator === 'x') {
            result = multiply(storedOperand, newOperand);
        } else if (storedOperator === '-') {
            result = subtract(storedOperand, newOperand);
        } else if (storedOperator === '+') {
            result = add(storedOperand, newOperand);
        }
    }
    
    displayOperationNode.innerText = operation;
    
    (result.toString().length < 8) ?
        displayResultNode.innerText = result :
        displayResultNode.innerText = result.toPrecision(4);

    storedOperand = result;
    operatorBtn = true;
    equalBtn = true;
}

function getPressedKey(pressed) {
    keyBoard = true;
    pressedKey = pressed.key;

    for(i = 0; i < numberBtnNodes.length; i++) {
        if (numberBtnNodes[i].innerText === pressedKey) {
            numberBtnNodes[i].classList.add('keyboard-pressed');
        }
    }
    if (/\d/.test(pressedKey)) {
        displayNumber();
    } else if (/\./.test(pressedKey)) {
        addDot();
    } else if (/\/|\*|-|\+/.test(pressedKey)) {
        if (/\*/.test(pressedKey)) {
            pressedKey = 'x';
        } else if (/\//.test(pressedKey)) {
            pressedKey = '÷';
        }
        displayOperation();
    } else if (/%/.test(pressedKey)) {
        solvePercentage();
    } else if (/=|Enter/.test(pressedKey)) {
        operate();
    } else if (/Backspace/.test(pressedKey)) {
        clearLastDigit();
    } else if (/Delete|Escape/.test(pressedKey)) {
        clearAll();
    }
    keyBoard = false;
}

function removeKBPClass() {
    clearAllBtnNode.classList.remove('keyboard-pressed');
    clearLastDigitBtnNode.classList.remove('keyboard-pressed');
    for(i = 0; i < numberBtnNodes.length; i++) {
        numberBtnNodes[i].classList.remove('keyboard-pressed');
    }
    for(i = 0; i < operatorBtnNodes.length; i++) {
        operatorBtnNodes[i].classList.remove('keyboard-pressed');
    }
    percentageBtnNode.classList.remove('keyboard-pressed');
    dotBtnNode.classList.remove('keyboard-pressed');
    equalBtnNode.classList.remove('keyboard-pressed');
}

let add = (a, b) => a + b;

let multiply = (a, b) => a * b;

let subtract = (a, b) => a - b;

let divide = (a, b) => a / b;