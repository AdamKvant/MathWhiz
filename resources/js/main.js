// boolean - True if timer is started, false otherwise.
let timerStarted = false;

// int (false if time is altered) - Tracks countdown of the timer.
let timerTracker = null;

// Returns a random int between min and max (both inclusive).
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Limits the input size to maxlength characters. I use 5 in the current iteration.
  function limitInput(inputElement, maxLength) {
    if (inputElement.value.length > maxLength) {
        inputElement.value = inputElement.value.slice(0, maxLength);
    }
}

// Generates new numbers on the screen. Returns the solution to the operation.
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

    // CASE: Divide by zero covered.
    if (operator === "/"){
        while(num2 === 0){
            num2 = getRandomInt(0, 12);
        }
    }

    // Perform the operation and generate solution.
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

// Returns the current total of seconds on the timer.
function getTimer(){
    const timerDoc = document.getElementById("timer");
    let timeSec = timerDoc.innerText.split(":");
    //CASE: Minutes
    if (timeSec.length > 1){
        timeSec[0] = parseInt(timeSec[0]);
        timeSec[1] = parseInt(timeSec[1]);
        timeSec = 60 * timeSec[0] + timeSec[1];
    }
    //CASE: Only seconds
    else{
        timeSec[0] = parseInt(timeSec[0]);
        timeSec = timeSec[0];
    }

    //CASE: Initially sets timerTracker to first value from the timer.
    if (timerTracker === null){
        timerTracker = timeSec;
    }
    return timeSec;
}

// Sends a POST request with the user's answer.
// Verifies that the time in the timer is correct.
// Updates the score accordingly.
async function sendPOST(solution){
    const userInput = document.getElementById("userInput");
    let userNum = parseFloat(userInput.value);
    let inputJSON = null;

    let correctTimeBool = false;

    const currentTime = getTimer();

    // Shrink the timerTracker by a second.
    if( timerTracker != false && timerTracker >= currentTime){
        correctTimeBool = true;
        timerTracker = currentTime;
    }
    

    if (userNum === solution){
        inputJSON = {"userInput" : true, "correctTime" : correctTimeBool};
    }
    else{
        inputJSON = {"userInput" : false, "correctTime" : correctTimeBool};
    }
    inputJSON = JSON.stringify(inputJSON);
    const response = await fetch("/api/submit", {method:"POST", headers:{"Content-Type" : "application/json"}, body: inputJSON});

    if (response.ok){
        const json = await response.json();
        const score = json.score;
        const scoreDoc = document.getElementById("score");
        if (correctTimeBool && timerTracker != false){
            scoreDoc.innerText = score;
        }
        else{
            scoreDoc.innerText = "Altered timer caught."
            timerTracker = false;
        }
        
    }
    //Clears input box, and creates a new submitButtonListener with a new question.
    userInput.value = "";
    submitButtonListener();
}

// Generates a new question and solution.
// Creates a new eventListener and starts the timer if needed.
// Sends POST request on trigger.
// Each eventListener only lasts for one trigger.
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

// Creates an eventListener on the number input box.
// Used to dynamically limit character count.
function numBoxListener(){
    const numBoxDoc = document.getElementById("userInput");
    numBoxDoc.addEventListener("keydown",(event) => {
        limitInput(numBoxDoc, 5);
    });
}

// Decrements the timer by one second.
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

//Boilerplate
window.addEventListener("load",submitButtonListener);
window.addEventListener("load",numBoxListener);