function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function limitInput(inputElement, maxLength) {
    if (inputElement.value.length > maxLength) {
        inputElement.value = inputElement.value.slice(0, maxLength);
    }
}

function editNumbers(){
    const operators = ["+","-","*","/"];

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

    if (operator === "/"){
        while(num2 === 0){
            let num2 = getRandomInt(0, 12);
        }
    }

    switch(operator){
        case "+":
            solution = num1 + num2;
            break;
        case "-":
            solution = num1 - num2;
            break;
        case "*":
            solution = num1 * num2;
            break;
        case "/":
            solution = Math.floor(num1 / num2);
            break;   
    }
    return solution;
}

async function sendPOST(solution){
    const userInput = document.getElementById("userInput");
    let userNum = parseFloat(userInput.value);
    let inputJSON = null;
    if (userNum === solution){
        inputJSON = {"userInput" : true};
    }
    else{
        inputJSON = {"userInput" : false};
    }
    inputJSON = JSON.stringify(inputJSON);
    const response = await fetch("/api/submit", {method:"POST", headers:{"Content-Type" : "application/json"}, body: inputJSON});

    if (response.ok){
        const json = await response.json();
        const score = json.score;
        const scoreDoc = document.getElementById("score");
        scoreDoc.innerText = score;
    }
    userInput.value = "";
    submitButtonListener();
}

function submitButtonListener(){
    const submitButton = document.getElementById("submit");
    let solution = editNumbers();
        submitButton.addEventListener("click", (formEvent) => {
            formEvent.preventDefault();
            sendPOST(solution);
        },{once : true}); 
}

function numBoxListener(){
    const numBoxDoc = document.getElementById("userInput");
    numBoxDoc.addEventListener("keydown",(event) => {
        limitInput(numBoxDoc, 5);
    });
}

window.addEventListener("load",submitButtonListener);

window.addEventListener("load",numBoxListener)