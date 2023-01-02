const express = require("express");
const app = express();
const dotenv = require("dotenv");
// mongoose for DB Connection
const mongoose = require("mongoose");
const {body, validationResult} = require('express-validator');

const ToDoModel = require("./models/ToDoModel");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//Connection to DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("Connected to DB");
    app.listen(3000, () => console.log("Server Works"));
  }
);

//View engine
app.set("View", "ejs");

// Get Method
app.get("/", (req, res) => {
  ToDoModel.find({}, (err, tasks) => {
    res.render("todo.ejs", { toDoModel: tasks });
  });
});

//Post Method
app.post("/", body('content').isLength({min:1}), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const toDoModel = new ToDoModel({
    content: req.body.content,
  });
  try {
    await toDoModel.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
  console.log(req.body);
});

//UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    ToDoModel.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { toDoModel: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    ToDoModel.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  ToDoModel.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
