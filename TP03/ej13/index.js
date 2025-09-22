const $buttons = document.getElementById("calculator-buttons");
const $screenValue = document.getElementById("screen-value");
const $screenResult = document.getElementById("screen-result");

const realValues = $screenResult.innerText; // real values for operations

$buttons.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.matches("button")) {
    switch (e.target.innerText) {
      case "C":
        if (
          $screenValue.innerText !== "0" &&
          $screenValue.innerText.length > 1
        ) {
          $screenValue.innerText = $screenValue.innerText.slice(0, -1);
          //vammos a tener que recalcular result
        } else if ($screenValue.innerText.length === 1) {
          $screenValue.innerText = "0";
          $screenResult.innerText = "0";
        }
        break;

      case "CE":
        $screenValue.innerText = "0";
        $screenResult.innerText = "0";
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if ($screenValue.innerText.slice(-1) === "%") {
          break;
        }

        if ($screenValue.innerText === "0") {
          $screenValue.innerText = e.target.innerText;
        } else {
          $screenValue.innerText += e.target.innerText;
        }

        if (canCalculate($screenValue.innerText)) {
          $screenResult.innerText = calculate($screenValue.innerText);

          if($screenResult.innerText == "Infinity"){
            $screenResult.innerText = "por qué sos así?"
          }
        }

        break;

      case "+":
      case "x":
      case "/":
      case ".":
        if (
          $screenValue.innerText.slice(-1) === "%" &&
          e.target.innerText === "."
        ) {
          break;
        }

        if (
          !isNaN($screenValue.innerText.slice(-1)) ||
          $screenValue.innerText.slice(-1) === "%"
        ) {
          $screenValue.innerText += e.target.innerText;
        }
        break;

      case "%":
        if (!isNaN($screenValue.innerText.slice(-1))) {
          $screenValue.innerText += e.target.innerText;
        }

        if (canCalculate($screenValue.innerText)) {
          $screenResult.innerText = calculate($screenValue.innerText);
        }

        break;

      case "-":
        if (
          !isNaN($screenValue.innerText.slice(-1)) &&
          $screenValue.innerText === "0"
        ) {
          $screenValue.innerText = e.target.innerText;
        } else if ($screenValue.innerText.slice(-1) !== "-") {
          $screenValue.innerText += e.target.innerText;
        }
        break;

      case "=":

          if($screenResult.innerText == "por qué sos así?"){
            $screenValue.innerText = 0
          }
        
        if (canCalculate($screenValue.innerText)) {
          console.log("si puedo :)");

          calculate($screenValue.innerText);
          $screenResult.innerText = calculate($screenValue.innerText);
          $screenValue.innerText = $screenResult.innerText;
        } else {
          console.log("no puedo :(");
        }
        break;
    }
  }
});

function canCalculate(value) {
  if (value[0] === "-") {
    value = value.slice(1, value.length);
  }

  const operators = value.match(/[+\-x\/]/g) || [];
  const numbers = value.match(/[\d.]+/g) || [];

  if (operators.length === numbers.length - 1) {
    return true;
  }

  return false;
}

function calculate(value) {
  const operators = value.match(/[+\-x\/]/g) || [];
  const numbers = value.match(/\d+(\.\d+)?%?/g) || [];

  if (value[0] === "-") {
    numbers[0] = `-${numbers[0]}`;
    operators.shift();
  }

  const newValue = [];

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i].endsWith("%")) {
      numbers[i] = numbers[i].slice(0, -1);
      numbers[i] = (parseFloat(numbers[i]) / 100).toString();
    }

    newValue.push(numbers[i]);

    if (operators[i]) {
      newValue.push(operators[i]);
    }
  }

  return evaluate(newValue);
}

function evaluate(tokens) {
  const output = [];
  const operators = [];
  const precedence = { "+": 1, "-": 1, "x": 2, "/": 2 };

  // pasamos a notación postfija
  tokens.forEach((token) => {
    if (!isNaN(token)) {
      output.push(parseFloat(token));
    } else if (token in precedence) {
      while (
        operators.length &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    }
  });

  while (operators.length) {
    output.push(operators.pop());
  }

  // Evaluar RPN
  const stack = [];
  output.forEach((token) => {
    if (typeof token === "number") {
      stack.push(token);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "x":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
      }
    }
  });

  return stack[0];
}
