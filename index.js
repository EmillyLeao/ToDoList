
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const mongo_user = process.env.MONGO_USER;
const mongo_password = process.env.MONGO_PASS;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect(
   `mongodb+srv://${mongo_user}:${mongo_password}@cluster0.dnzd8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`
); 

const taskSchema = {
    name: {
        type: String,
        required: true
    }
};


const Task = mongoose.model("Task", taskSchema);

app.get("/", function (req, res) {

    let today = new Date();
    let options = { 
        weekday: "long", 
        day: "numeric", 
        month: "long" 
    };
    
    let day = today.toLocaleDateString("en-US", options);

  
    Task.find({})
        .then(foundTasks => {
           
            res.render("index", { today: day, tasks: foundTasks });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Erro ao obter tarefas.");
        });
});

app.post("/", function (req, res) {
    const taskName = req.body.newTask;
    if (taskName) {
        const task = new Task({
            name: taskName,
        });


        task.save()
            .then(() => {
                res.redirect("/");
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Erro ao salvar tarefa.");
            });
    } else {
        res.redirect("/");
    }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    Task.findByIdAndDelete(checkedItemId)
        .then(() => {
            console.log("Successfully deleted checked item.");
            res.redirect("/");
        })
        .catch(err => {
            console.log("It was not possible to delete the checked item", err);
            res.redirect("/");
        });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server running at port 3000");
});