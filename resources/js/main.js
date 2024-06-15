function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


function editNumbers(){
    const operators = ["+","-","x","/"];

    let solution = 0;

    const opIndex = getRandomInt(0,3);

    const operator = operators[opIndex];

    const operatorDoc = document.getElementById("operator");
    const num1Doc = document.getElementById("num1");
    const num2Doc = document.getElementById("num2");

    let num1 = getRandomInt(0, 12);
    let num2 = getRandomInt(0, 12);

    num1Doc.innerText = num1;
    num2Doc.innerText = num2;
    operatorDoc.innerText = operator;

    switch(operator){
        case "+":
            solution = num1 + num2;
            break;
        case "-":
            solution = num1 - num2;
            break;
        case "x":
            solution = num1 * num2;
            break;
        case "/":
            solution = Math.floor(num1 / num2);
            break;   
    }
    return solution;
}


function submitButtonListener(){

    const submitButton = document.getElementById("submit");




}

window.addEventListener("load",submitButtonListener);
window.addEventListener("load",editNumbers);