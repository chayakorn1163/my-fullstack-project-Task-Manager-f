const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongoDB server
mongoose.connect(
  "mongodb+srv://chayakon11643:4lLnsCavhpvcFL6f@cluster0.f34lrtx.mongodb.net/taskmanager?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Task schema and model
const taskSchema = new mongoose.Schema({
  name: String,
  completed: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

// API Endpoints

// GET /tasks: List all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch tasks");
  }
});

// POST /tasks: Add a new task
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      name: req.body.name,
      completed: req.body.completed || false,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create task");
  }
});

// PUT /tasks/:id: Update a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("Task not found");

    task.name = req.body.name || task.name;
    task.completed =
      req.body.completed !== undefined ? req.body.completed : task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update task");
  }
});

// DELETE /tasks/:id: Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send("Task not found");
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete task");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
