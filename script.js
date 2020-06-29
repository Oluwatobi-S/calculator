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
let dotBtn = false;
let keyBoard = false;
let operation = '';
let pressedKey = '';
let clickedOperator = '';
let firstStoredOperator = '';
let secondStoredOperator = '';
let thirdStoredOperator = '';
let newOperand = 0;
let firstStoredOperand = 0;
let secondStoredOperand;
let thirdStoredOperand;
let displayedResult = 0;

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
    operatorBtn = false;
    numberBtn = false;
    equalBtn = true;
    dotBtn = false;
    keyBoard = false;
    operation = '';
    pressedKey = '';
    clickedOperator = '';
    firstStoredOperator = '';
    secondStoredOperator = '';
    thirdStoredOperator = '';
    newOperand = 0;
    firstStoredOperand = 0;
    secondStoredOperand = undefined;
    thirdStoredOperand = undefined;
    displayedResult = 0;
    displayOperationNode.innerText = '';
    displayResultNode.innerText = '0';
}

function clearLastDigit() {
    if (keyBoard) {clearLastDigitBtnNode.classList.add('keyboard-pressed');}

    if (/[1-9]/.test(displayResultNode.innerText)) {
        let splitNumStrOnDisIntoArr = displayResultNode.innerText.split('');
        splitNumStrOnDisIntoArr.pop();
        if (/[^\d]/.test(splitNumStrOnDisIntoArr[0]) && splitNumStrOnDisIntoArr.length === 1) {
            splitNumStrOnDisIntoArr[0] = 0;
        } else if (splitNumStrOnDisIntoArr.length === 0) {
            splitNumStrOnDisIntoArr[0] = 0;
        }
        let newNumStrOnDis = splitNumStrOnDisIntoArr.join('');
        displayResultNode.innerText = newNumStrOnDis;
        newOperand = Number(newNumStrOnDis);
    }
}

function solvePercentage() {
    if (keyBoard) {percentageBtnNode.classList.add('keyboard-pressed');}

    if (displayedResult >= 1e+90) {
        displayResultNode.innerText = 'Error';
        return;
    }
    if (!operatorBtn) {
        displayedResult = newOperand / 100;
        displayResultNode.innerText = displayedResult;
        newOperand = displayedResult;
    }
    keyBoard = false;
}

function displayOperation() {
    if (dotBtn) {return;}

    for(i = 0; i < operatorBtnNodes.length; i++) {
        if (operatorBtnNodes[i].innerText === pressedKey) {
            operatorBtnNodes[i].classList.add('keyboard-pressed');
        }
    }
    if (displayedResult >= 1e+90) {
        displayResultNode.innerText = 'Error';
        return;
    }
    operatorBtn = true;

    if (secondStoredOperand && secondStoredOperator && numberBtn) {
        thirdStoredOperand = newOperand;
        // console.log('Third Operand = ' + thirdStoredOperand);
    }
    if (firstStoredOperand && !secondStoredOperand && numberBtn) {
        secondStoredOperand = newOperand;
    }
    if (keyBoard) {
        clickedOperator = pressedKey;
        keyBoard = false;
    } else {clickedOperator = this.innerText;}

    if (numberBtn) {
        if (!thirdStoredOperator && secondStoredOperator) {
            thirdStoredOperator = clickedOperator;
        }
        if (!secondStoredOperator && firstStoredOperator) {
            secondStoredOperator = clickedOperator;
        }
        if (!firstStoredOperator) {
            firstStoredOperator = clickedOperator;
        }
    } else if (!numberBtn) {
        if (thirdStoredOperator && secondStoredOperator) {
            thirdStoredOperator = clickedOperator;
        }
        if (secondStoredOperator && firstStoredOperator) {
            secondStoredOperator = clickedOperator;
        }
        if (firstStoredOperator) {
            firstStoredOperator = clickedOperator;
        }
    }
    if (/=/.test(displayOperationNode.innerText)) {
        numberBtn = false;
        displayOperationNode.innerText = firstStoredOperand + clickedOperator;
        return;
    }
    if (displayOperationNode.innerText && numberBtn) {
        equalBtn = false;
        operate();
        numberBtn = false;
        return;
    }
    if (numberBtn) {
        firstStoredOperand = newOperand;
        operation += firstStoredOperand + clickedOperator;
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
    dotBtn = false;
    let clickedNumber;
    if (keyBoard) {
        clickedNumber = Number(pressedKey);
        keyBoard = false;
    } else {clickedNumber = Number(this.innerText);}

    if (/=/.test(displayOperationNode.innerText)) {
        displayOperationNode.innerText = '';
        operation = '';
        displayedResult = 0;
        firstStoredOperand = 0;
        secondStoredOperand = undefined;
        thirdStoredOperand = undefined;
        firstStoredOperator = '';
        secondStoredOperator = '';
        thirdStoredOperator = '';
    }
    if ((displayResultNode.innerText.length === 9) && operatorBtn) {
        displayResultNode.innerText = clickedNumber;
    }
    if (displayResultNode.innerText.length < 9) {
        if ((displayResultNode.innerText === '-') && operatorBtn) {
            operatorBtn = false;
            displayResultNode.innerText += clickedNumber;
        } else if ((displayResultNode.innerText === '0') && (clickedNumber === 0)) {
            operatorBtn = false;
            displayResultNode.innerText = 0;
        } else if (((displayResultNode.innerText === '0') || operatorBtn) && (/[^0]|[^\.]/.test(clickedNumber))) {
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
    let splitNumStrOnDisIntoArr = displayResultNode.innerText.split('');
    (!displayResultNode.innerText.includes('-')) ?
    splitNumStrOnDisIntoArr.unshift('-') : splitNumStrOnDisIntoArr.shift();

    let newNumStrOnDis = splitNumStrOnDisIntoArr.join('');
    displayResultNode.innerText = newNumStrOnDis;
    newOperand = Number(newNumStrOnDis);
}

function addDot() {
    dotBtn = true;
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
    if (dotBtn) {return;}
    
    if (keyBoard) {equalBtnNode.classList.add('keyboard-pressed');}

    if (displayedResult >= 1e+90) {
        displayResultNode.innerText = 'Error';
        return;
    }
    if (equalBtn) {
        // console.log('Equal Used!!!!');
        operation += newOperand + '=';

        if (!secondStoredOperand) {
            if (clickedOperator === '÷' && newOperand === 0) {
                clearAll();
                displayResultNode.innerText = `Can't ÷ 0`;
                return;
            }
            switch (clickedOperator) {
                case '÷': displayedResult = calculate(divide, firstStoredOperand, newOperand); break;
                case 'x': displayedResult = calculate(multiply, firstStoredOperand, newOperand); break;
                case '-': displayedResult = calculate(subtract, firstStoredOperand, newOperand); break;
                case '+': displayedResult = calculate(add, firstStoredOperand, newOperand); break;
            }
        } else {
            if (/÷|x/.test(secondStoredOperator)) {
                // console.log('===Equal with SecondOp / or * Used===');
                if (secondStoredOperator === '÷' && newOperand === 0) {
                    clearAll();
                    displayResultNode.innerText = `Can't ÷ 0`;
                    return;
                }
                switch (secondStoredOperator) {
                    case '÷': iniResult  = calculate(divide, secondStoredOperand, newOperand); break;
                    case 'x': iniResult = calculate(multiply, secondStoredOperand, newOperand); break;
                }
                switch (firstStoredOperator) {
                    case '-': displayedResult  = calculate(subtract, firstStoredOperand, iniResult); break;
                    case '+': displayedResult = calculate(add, firstStoredOperand, iniResult); break;
                }
            } else if (/÷|x/.test(firstStoredOperator)) {
                // console.log('===Equal with firstOp / or * Used===');
                if (firstStoredOperator === '÷' && secondStoredOperand === 0) {
                    clearAll();
                    displayResultNode.innerText = `Can't ÷ 0`;
                    return;
                }
                switch (firstStoredOperator) {
                    case '÷': iniResult  = calculate(divide, firstStoredOperand, secondStoredOperand); break;
                    case 'x': iniResult = calculate(multiply, firstStoredOperand, secondStoredOperand); break;
                }
                switch (secondStoredOperator) {
                    case '-': displayedResult  = calculate(subtract, iniResult, newOperand); break;
                    case '+': displayedResult = calculate(add, iniResult, newOperand); break;
                }
            }
        }
    } else {
        // console.log("Logged This!!!!");
        operation += newOperand + clickedOperator;
        let iniResult;
    
        if (/÷|x/.test(firstStoredOperator)) {
            // console.log('===First@/* Second@-+ Used===');
            if (firstStoredOperator === '÷' && secondStoredOperand === 0) {
                clearAll();
                displayResultNode.innerText = `Can't ÷ 0`;
                return;
            }
            switch (firstStoredOperator) {
                case '÷': displayedResult  = calculate(divide, firstStoredOperand, secondStoredOperand); break;
                case 'x': displayedResult = calculate(multiply, firstStoredOperand, secondStoredOperand); break;
            }
            displayResultNode.innerText = displayedResult;
            firstStoredOperand = displayedResult;
            secondStoredOperand = undefined;
            thirdStoredOperand = undefined;
            firstStoredOperator = clickedOperator;
            secondStoredOperator = '';
            thirdStoredOperator = '';
        } else if (/\-|\+/.test(firstStoredOperator) && /÷|x/.test(secondStoredOperator) && /÷|x/.test(thirdStoredOperator)) {
            // console.log('===First@-+ Second@/* Third@/* Used===');
            if (secondStoredOperator === '÷' && thirdStoredOperand === 0) {
                clearAll();
                displayResultNode.innerText = `Can't ÷ 0`;
                return;
            }
            switch (secondStoredOperator) {
                case '÷': iniResult  = calculate(divide, secondStoredOperand, thirdStoredOperand); break;
                case 'x': iniResult = calculate(multiply, secondStoredOperand, thirdStoredOperand); break;
            }
            switch (firstStoredOperator) {
                case '-': displayedResult  = calculate(subtract, firstStoredOperand, iniResult); break;
                case '+': displayedResult = calculate(add, firstStoredOperand, iniResult); break;
            }
            // console.log('iniResult = ' + iniResult);
            displayResultNode.innerText = displayedResult;
            secondStoredOperand = iniResult;
            thirdStoredOperand = undefined;
            secondStoredOperator = clickedOperator;
            thirdStoredOperator = '';
        } else if (/\-|\+/.test(firstStoredOperator) && /÷|x/.test(secondStoredOperator) && /\-|\+/.test(thirdStoredOperator)) {
            // console.log('===First@-+ Second@/* Third@-+ Used===');
            if (secondStoredOperator === '÷' && thirdStoredOperand === 0) {
                clearAll();
                displayResultNode.innerText = `Can't ÷ 0`;
                return;
            }
            // console.log('secondStoredOperand = ' + secondStoredOperand);
            switch (secondStoredOperator) {
                case '÷': iniResult  = calculate(divide, secondStoredOperand, thirdStoredOperand); break;
                case 'x': iniResult = calculate(multiply, secondStoredOperand, thirdStoredOperand); break;
            }
            switch (firstStoredOperator) {
                case '-': displayedResult  = calculate(subtract, firstStoredOperand, iniResult); break;
                case '+': displayedResult = calculate(add, firstStoredOperand, iniResult); break;
            }
            displayResultNode.innerText = displayedResult;
            firstStoredOperand = displayedResult;
            secondStoredOperand = undefined;
            thirdStoredOperand = undefined;
            firstStoredOperator = clickedOperator;
            secondStoredOperator = '';
            thirdStoredOperator = '';
        } else if (
            (/\-|\+/.test(firstStoredOperator) && /\-|\+/.test(secondStoredOperator)) || 
            (/÷|x/.test(firstStoredOperator) && /÷|x/.test(secondStoredOperator))) {
                // console.log('===First@-+or/* Second@/* Third-+or/* Used===');
                if (firstStoredOperator === '÷' && secondStoredOperand === 0) {
                    clearAll();
                    displayResultNode.innerText = `Can't ÷ 0`;
                    return;
                }
            switch (firstStoredOperator) {
                case '÷': iniResult  = calculate(divide, firstStoredOperand, secondStoredOperand); break;
                case 'x': iniResult = calculate(multiply, firstStoredOperand, secondStoredOperand); break;
                case '-': iniResult  = calculate(subtract, firstStoredOperand, secondStoredOperand); break;
                case '+': iniResult = calculate(add, firstStoredOperand, secondStoredOperand); break;
            }
            if (thirdStoredOperand) {
                if (secondStoredOperator === '÷' && thirdStoredOperand === 0) {
                    clearAll();
                    displayResultNode.innerText = `Can't ÷ 0`;
                    return;
                }
                switch (secondStoredOperator) {
                    case '÷': displayedResult  = calculate(divide, iniResult, thirdStoredOperand); break;
                    case 'x': displayedResult = calculate(multiply, iniResult, thirdStoredOperand); break;
                    case '-': displayedResult  = calculate(subtract, iniResult, thirdStoredOperand); break;
                    case '+': displayedResult = calculate(add, iniResult, thirdStoredOperand); break;
                }
            } else {displayedResult = iniResult;}

            displayResultNode.innerText = displayedResult;
            firstStoredOperand = displayedResult;
            secondStoredOperand = undefined;
            thirdStoredOperand = undefined;
            firstStoredOperator = clickedOperator;
            secondStoredOperator = '';
            thirdStoredOperator = '';
        }
        // console.log('Result is = ' + displayedResult);
        // console.log('clickedOperator = ' + clickedOperator);
        // console.log('firstStoredOperator = ' + firstStoredOperator);
        // console.log('secondStoredOperator = ' + secondStoredOperator);
        // console.log('thirdStoredOperator = ' + thirdStoredOperator);
        // console.log('firstStoredOperand = ' + firstStoredOperand);
        // console.log('secondStoredOperand = ' + secondStoredOperand);
        // console.log('thirdStoredOperand is = ' + thirdStoredOperand);
    }
    
    displayOperationNode.innerText = operation;
    
    (displayedResult.toString().length < 8) ?
        displayResultNode.innerText = displayedResult :
        displayResultNode.innerText = displayedResult.toPrecision(4);

    operatorBtn = true;
    equalBtn = true;
}

function calculate(operator, num1, num2) {
    // console.log('operator: ' + operator);
    // console.log('num1: '+ num1);
    // console.log('num2: ' + num2);
    return operator(num1, num2);
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