const express = require("express"),
  app = express(),
  port = process.env.PORT || 8000,
  cors = require("cors");

const bodyParser = require("body-parser");
const fs = require("fs").promises;

app.use(cors());
app.use(bodyParser.json({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "Connected to Backend server!" });
});

app.post("/add/item", async (req, res) => {
  try {
    // Converting Javascript object (Task Item) to a JSON string
    console.log(`Body: ${JSON.stringify(req.body)}`);
    const taskId = req.body.taskId;
    const task = req.body.task;
    const curDate = req.body.currentDate;
    const dueDate = req.body.dueDate;

    const newTask = {
      taskId: taskId,
      task: task,
      current_date: curDate,
      due_date: dueDate,
    };

    const data = await fs.readFile("database.json");
    const json = JSON.parse(data);
    json.push(newTask);
    await fs.writeFile("database.json", JSON.stringify(json));
    console.log("Successfully wrote to file");
    res.sendStatus(200);
  } catch (err) {
    console.log("error: ", err);
    res.sendStatus(500);
  }
});

app.post("/delete/item", async (req, res) => {
  try {
    // Converting Javascript object (Task Item) to a JSON string
    console.log(`Body: ${JSON.stringify(req.body)}`);
    const taskId = req.body.taskId;

    const data = await fs.readFile("database.json");
    const json = JSON.parse(data);
    const deleted = json.filter((task) => task.taskId != taskId);

    await fs.writeFile("database.json", JSON.stringify(deleted));
    console.log("Successfully wrote to file");
    res.sendStatus(200);
  } catch (err) {
    console.log("error: ", err);
    res.sendStatus(500);
  }
});

app.listen(port, () => console.log("Backend server live on " + port));
