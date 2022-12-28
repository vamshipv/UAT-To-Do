const express = require('express');
const app = express();
const dotenv = require("dotenv");
// mongoose for DB Connection
const mongoose = require("mongoose")

const ToDoModel = require("./models/ToDoModel");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//Connection to DB 
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true
}, () => {
    console.log("Connected to DB");
    app.listen(3000, () => console.log("Server Works"));
});

//View engine
app.set("View", "ejs");

// Get Method
app.get('/',(req, res) => {
    ToDoModel.find({}, (err, tasks) => {
        res.render('todo.ejs', {toDoModel: tasks});
    });
});

//Post Method
app.post('/', async(req,res) => {
    const toDoModel = new ToDoModel({
        content: req.body.content
    });
    try {
        await toDoModel.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
    console.log(req.body);
});


