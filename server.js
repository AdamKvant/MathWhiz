// Express.js setup
const express = require("express");
const app = express();
const port = 5678;
app.set("views","templates");
app.set("view engine","pug");

// Middleware
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use("/css", express.static("resources/css", { type: "text/css" }));
app.use("/js", express.static("resources/js", { type: "text/javascript" }));
// Might use images at some point?
//app.use("/images", express.static("resources/images", { type: "image/png" }));

// List of booleans representing correctness of player answers.
let inputs = [];

// Player score
let score = 0;

// Boolean that checks if the timer has been altered or not.
let timeAltered = false;

// GET request for main page.
app.get("/", (req , res) => {
    score = 0;
    res.setHeader("Content-Type","text/html");
    res.status(200).render("main.pug",{score: score});
})

// POST request for user answer.s
app.post("/api/submit",(req,res) =>{
    res.setHeader("Content-Type","application/json");
    let body = req.body;
    if (Object.keys(body).length == 0){
        res.status(400).render("fail.pug");
    }
    else{
        
        // CASE: User skips the question (enters nothing).
        // Subtract 1 from their score.
        console.log(body["userInput"],body["correctTime"])
        if (body["userInput"] === null && body["correctTime"] != undefined 
            && typeof body["correctTime"] === 'boolean'){
            score--;
            inputs.push(body["userInput"]);
            res.status(200).send({"score" : score});
        }


        // CASE: Check if JSON is correct.
        else if (body["userInput"] != undefined && typeof body["userInput"] === 'boolean'
            && body["correctTime"] != undefined && typeof body["correctTime"] === 'boolean'
        ){
            // Push new answer bool onto the inputs list.
            inputs.push(body["userInput"]);
            console.log(inputs);

            // CASE: If time was altered, update timeAltered.
            if (body["correctTime"] === false){
                timeAltered = true;
            }

            // CASE: If the user answer was correct, return true.
            if (body["userInput"] === true){
                score++;
            }
            
            res.status(200).send({"score" : score});
        }
        else{
            res.setHeader("Content-Type","text/html");
            res.status(404).render("404.pug");
        }
    }
});





// 404 Page
app.use((req,res,next)=>{
    res.status(404).render("404.pug");
})
app.listen(port , () => {
  console.log(`MathWhiz listening on port ${port}`)
})