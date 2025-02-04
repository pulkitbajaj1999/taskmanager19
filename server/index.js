const fs = require("fs")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")

const { Task } = require("./database/models")
const app = express()
app.use(bodyParser.json({}))
app.use(cors())

app.post("/api/v1/tasks", async (req, res, next) => {
  let { name, completed } = req.body
  console.log("body-------", req.body)
  if (!name)
    return res.status(400).json({
      error: "title is required",
    })
  let newtask = new Task({ name, completed })
  let result = await newtask.save()
  res.status(200).json({
    result: result,
  })
})

app.get("/api/v1/tasks", async (req, res, next) => {
  let tasks = await Task.find({})
  return res.status(200).json({
    tasks: tasks,
  })
})

app.get("/api/v1/tasks/:id", async (req, res, next) => {
  let { id } = req.params
  let task = await Task.findById(id)

  return res.status(200).json({
    task: task,
  })
})

app.patch("/api/v1/tasks/:id", async (req, res, next) => {
  let { id } = req.params
  let { name, completed } = req.body
  if (!name)
    return res.status(400).json({
      error: "title is required",
    })
  console.log(req.body)
  let result = await Task.findByIdAndUpdate(id, {
    completed: completed,
    name: name,
  })

  return res.status(201).json({
    result: result,
  })
})

app.patch("/api/v1/toggle/:id", async (req, res, next) => {
  let { id } = req.params
  console.log(req.body)
  let task = await Task.findById(id)
  let result = await Task.findByIdAndUpdate(id, {
    completed: !task.completed,
  })

  return res.status(201).json({
    result: result,
  })
})

app.delete("/api/v1/tasks/:id", async (req, res, next) => {
  let { id } = req.params
  let result = await Task.findByIdAndDelete(id)
  return res.status(201).json({
    result: result,
  })
})

const PORT = process.env.PORT || 8000
const MONGODB_URI =
  process.env.MONGODB_URI ||
  `mongodb://root_user:root_pass@localhost:27017/taskmanager19?authSource=admin`

app.listen(PORT, (err) => {
  if (err) {
    console.error("error while listening")
  }
  console.info(`server started on port: ${PORT}`)
})

console.info("connecting to mongodb")
mongoose
  .connect(MONGODB_URI)
  .then((info) => {
    console.log(`connected to mongodb------`)
  })
  .catch((err) => {
    console.error(err)
  })
