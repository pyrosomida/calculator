document.addEventListener("DOMContentLoaded", function () {
  /* variables */
  var calcScreen = document.getElementById('calc_screen');
  calcScreen.innerHTML = 0;
  var calculation = "";
  var currentNum = "";
  var total = 0;
  var buttons = document.querySelectorAll('.button');
  var decimalPoint = false;
  var numFlag = false; /* to indicate when a number is being created and allow only one decimal point */
  var opFlag = false; /* to indicate if an operator is the last entry */
  var evalFlag = false;/* to indicate that equals or percent have been pressed */
  /* /variables */
  /* functions */
  function clearCalc () {
    clearCurrentNum();
    calculation = "";
    opFlag = false;
    total = 0;
  }
  function clearCurrentNum () {
    currentNum = "";
    decimalPoint = false;
    numFlag = false;
  }
  function clearScreen () {
    calcScreen.innerHTML = 0;
    evalFlag = false;
  }
  function displayTotal(t) {
    if (t !== undefined & !evalFlag) {
      evalFlag = true;
      stringTot = t.toString();
      if (stringTot.length > 9) {
        stringTot = stringTot.slice(0,9);
        t = parseFloat(stringTot);
        displayItem(t.toExponential(7));
      } else {
        displayItem(t);
      }
    }
  }
  function tooLong(s) {
    return (s.length >= 9);
  }
  function displayItem (s) {
    s = removeLeadingZeros(s);
    calcScreen.innerHTML = s;
  }
  function removeLeadingZeros(s) {
     var str = s;
     if (str.length > 1) {
      //check for leading zeros
      if (str[0] === '0' && str[1] !== '.') {
        while (str[0] === '0' && str.length > 1) {
          str = str.slice(1);
        }
      }
    }
    return str;
  }
  function addToCalculation (v) {
    calculation = calculation.concat(v);
  }
  function operators () {
    var op = this.innerHTML;
    var op2 = op;
    //check if a number precedes the operator
    if (calculation.length >= 1 && !opFlag) {
      opFlag = true;
      if (op === '×') {
        op2 = '*';
      } else if (op === '÷') {
        op2 = '/';
      }
      addToCalculation(op2);
      displayItem(currentNum+op);
      clearCurrentNum();
      }
  }
  var buttonFunctions = {
    '=': function () {
      if (!evalFlag) {
        clearCurrentNum();
        calculation = removeLeadingZeros(calculation)
        total = eval(calculation);
        displayTotal(total);
        clearCalc();
      }
    },
    '%': function () {
        addToCalculation('/100');
        var equalsButton = buttonFunctions['='];
        equalsButton();
    },
    '.': function () {
      if (!decimalPoint && numFlag) {
        currentNum += '.';
        addToCalculation('.');
        decimalPoint = true;
      }
    },
    'AC': function () {
      clearCalc();
      clearScreen();
    },
    'CE': function () {
      for (var i=0; i<currentNum.length; i++) {
        calculation = calculation.slice(0,-1);
      }
      clearScreen();
      clearCurrentNum();
    },
    '+': operators,
    '-': operators,
    '÷': operators,
    '×': operators,
    'number': function () {
      var val = this.innerHTML;
      opFlag = false;
      if (tooLong(currentNum)) {
        numFlag = false;
      } else {
        numFlag = true;
        currentNum += val;
        addToCalculation(val);
        displayItem(currentNum);
      }
    },
  };

  for (var i=0; i<buttons.length; i++) {
    var b = buttons[i],
        val = b.innerHTML,
        listener = buttonFunctions[val];
    if (listener === undefined) {
      listener = buttonFunctions.number;
    }
    b.onclick = listener;
  }
}); // /docready()