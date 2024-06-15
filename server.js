const express = require("express");
const app = express();
const port = 5678;
app.set("views","templates");
app.set("view engine","pug");
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use("/css", express.static("resources/css", { type: "text/css" }));
app.use("/js", express.static("resources/js", { type: "text/javascript" }));
//app.use("/images", express.static("resources/images", { type: "image/png" }));

let inputs = [];
let score = 0;

app.get("/", (req , res) => {
    res.setHeader("Content-Type","text/html");
    res.status(200).render("main.pug",{score: score});
})


app.post("/api/submit",(req,res) =>{
    res.setHeader("Content-Type","application/json");
    console.log(req.body);
    let body = req.body;
    if (Object.keys(body).length == 0){
        res.status(400).render("fail.pug");
    }
    else{
        if (body["userInput"] != undefined && typeof body["userInput"] === 'boolean'){
            inputs.push(body["userInput"]);
            console.log(inputs);
            if (body["userInput"] === true){
                score++;
            }
            res.status(200).send({"score" : score});
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