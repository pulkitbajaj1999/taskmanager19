import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { SERVER_URL } from '@/constants'
import './Dashboard.css'
import './normalize.css'

const Task = ({ taskData, setTasks, setIsLoading, fetchTasks, showAlert }) => {
  const navigate = useNavigate()
  const handleDeleteTask = async (event) => {
    event.stopPropagation()
    setIsLoading(true)
    try {
      await axios.delete(SERVER_URL + `/api/v1/tasks/${taskData._id}`)
    } catch (error) {
      console.log(error)
      showAlert(error.message)
    } finally {
      setIsLoading(false)
      fetchTasks()
    }
  }

  const handleEditTask = async (event) => {
    console.log(event)
    event.stopPropagation()

    let taskId = taskData?._id
    navigate(`/edittask/${taskId}`)
  }

  const handleToggleTask = async (event) => {
    const el = event.target
    setIsLoading(true)
    try {
      await axios.patch(SERVER_URL + `/api/v1/toggle/${taskData._id}`)
    } catch (error) {
      console.log(error)
      showAlert(error.message)
    } finally {
      setIsLoading(false)
      fetchTasks()
    }
  }

  const { completed, name, _id } = taskData
  return (
    <div
      className={completed ? `single-task task-completed` : `single-task`}
      onClick={handleToggleTask}
    >
      <h5>
        <span>
          <i className="far fa-check-circle"></i>
        </span>
        {name}
      </h5>
      <div className="task-links">
        <button className="edit-link" onClick={handleEditTask}>
          <i className="fas fa-edit"></i>
        </button>
        <button type="button" className="delete-btn" onClick={handleDeleteTask}>
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  )
}

function Dashboard() {
  let [tasks, setTasks] = useState([])
  let [isLoading, setIsLoading] = useState(false)
  const [isAlert, setIsAlert] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [taskName, setTaskName] = useState('')
  // const tasksDOM = document.querySelector('.tasks')
  // const loadingDOM = document.querySelector('.loading-text')
  // const formDOM = document.querySelector('.task-form')
  // const taskInputDOM = document.querySelector('.task-input')
  // const formAlertDOM = document.querySelector('.form-alert')
  const tasksRef = useRef(null)
  const taskInputRef = useRef(null)
  const alertInputRef = useRef(null)

  const handleTaskSubmit = async (e) => {
    e.preventDefault()
    try {
      let response = await axios.post(SERVER_URL + '/api/v1/tasks', { name: taskName })
      console.log(response)
      if (response?.data?.error) {
        throw new Error(response?.error)
      } else {
        setTaskName('')
        fetchTasks()
        showAlert('success, task added')
      }
    } catch (error) {
      let alertText = error?.response?.data?.error || error?.message || 'error while creating task'
      showAlert(alertText, 'fail')
    }
  }

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(SERVER_URL + '/api/v1/tasks', {})
      const tasks = response?.data?.tasks
      if (tasks) {
        setTasks(tasks)
      }
    } catch (error) {
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }

  const showAlert = async (alertText, type = 'success') => {
    setIsAlert(true)
    setAlertText(alertText)
    setTimeout(() => {
      setIsAlert(false)
      setAlertText('')
    }, 3000)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <>
      <form className="task-form" onSubmit={handleTaskSubmit}>
        <h4>task manager</h4>
        <div className="form-control">
          <input
            ref={taskInputRef}
            type="text"
            name="name"
            className="task-input"
            placeholder="e.g. wash dishes"
            value={taskName}
            onChange={(e) => {
              setTaskName(e.target.value)
            }}
          />
          <button type="submit" className="btn submit-btn">
            submit
          </button>
        </div>
        <div ref={alertInputRef} className={alertText ? 'form-alert text-success' : 'form-alert'}>
          {alertText}
        </div>
      </form>
      {!isLoading && (
        <section className="tasks-container">
          <p className="loading-text">Loading...</p>
          <div ref={tasksRef} className="tasks">
            {tasks.length === 0 && <h5 className="empty-list">No tasks in your list</h5>}
            {tasks &&
              tasks.length > 0 &&
              tasks.map((task) => (
                <Task
                  key={task?._id}
                  taskData={task}
                  setTasks={setTasks}
                  fetchTasks={fetchTasks}
                  setIsLoading={setIsLoading}
                  showAlert={showAlert}
                />
              ))}
          </div>
        </section>
      )}
    </>
  )
}

export default Dashboard
