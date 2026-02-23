const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors());

app.get("/", function(req, res){
    res.send("Welcome to Node");
});


app.get("/profile", function(req, res){
    res.send("My Profile Page");
})



const server = app.listen(4000, function(){
    console.log("Listening on http://localhost:4000")
})