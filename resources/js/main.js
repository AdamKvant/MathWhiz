let timerStarted = false;

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
            num2 = getRandomInt(0, 12);
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
    let solution = editNumbers();
    const submitButton = document.getElementById("submit");
        submitButton.addEventListener("click", (formEvent) => {
            formEvent.preventDefault();
            if(!timerStarted){
                setInterval(decrementTimer,1000);
                timerStarted = true;
            }
            sendPOST(solution);
        },{once : true}); 
}

function numBoxListener(){
    const numBoxDoc = document.getElementById("userInput");
    numBoxDoc.addEventListener("keydown",(event) => {
        limitInput(numBoxDoc, 5);
    });
}

function decrementTimer(){
    const timerDoc = document.getElementById("timer");
    let timeSec = timerDoc.innerText.split(":");
    if (timeSec.length > 1){
        timeSec[0] = parseInt(timeSec[0]);
        timeSec[1] = parseInt(timeSec[1]);
        timeSec = 60 * timeSec[0] + timeSec[1];
    }
    else{
        timeSec[0] = parseInt(timeSec[0]);
        timeSec = timeSec[0];
    }
    if (timeSec > 0){
        timeSec--;
    }

    let timeMin = Math.floor(timeSec / 60);
    timeSec = timeSec % 60;
    let timeStr = "";

    if (timeMin > 0){
        timeStr = timeMin + ":" + timeSec;
    }
    else{
            timeStr = timeSec + ""; 
    }

    timerDoc.innerText = timeStr;
}

window.addEventListener("load",submitButtonListener);

window.addEventListener("load",numBoxListener)