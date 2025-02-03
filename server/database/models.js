const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TaskSchema = new Schema({
  name: { type: String },
  completed: { type: Boolean, default: false },
})

const Task = mongoose.model("Task", TaskSchema)

module.exports = { Task }
