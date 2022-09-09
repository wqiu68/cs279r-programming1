const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//models
const TodoTask = require("./models/TodoTask");

dotenv.config();

// allows access to the css file
app.use("/static", express.static("public"));

// Urlencoded will allow us to extract the data from the form by adding her to the body property of the request
app.use(express.urlencoded({ extended: true }));

// //connection to db
// mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");

    app.listen(process.env.PORT, () => console.log("Server Up and running"));
});


// viewing engine cofiguration
app.set("view engine", "ejs");

// sends the message on the local host
// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

//POST METHOD
// by adding this we can see the new information being inputted in the database
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
    });

//UPDATE
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;

        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
    });
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});


// app.listen(3000, () => console.log("Server Up and running"));

