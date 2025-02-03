import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SERVER_URL } from '@/constants'

function EditTask() {
  const params = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState()
  const [taskName, setTaskName] = useState()
  const [taskChecked, setTaskChecked] = useState()
  let [alertText, setAlertText] = useState('')

  const fetchTaskData = async () => {
    setIsLoading(true)
    try {
      let response = await axios.get(SERVER_URL + `/api/v1/tasks/${params.id}`)
      let taskData = response?.data?.task
      if (taskData) {
        setData(taskData)
        setTaskName(taskData.name)
        setTaskChecked(taskData.completed ? true : false)
      }
      if (response.errors) {
        throw Error('error while fetching task')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      let reponse = await axios.patch(SERVER_URL + `/api/v1/tasks/${data._id}`, {
        name: taskName,
        completed: !!taskChecked,
      })
    } catch (err) {
      let alertText = err?.response?.data?.error || err?.message || 'error while editing task'
      showAlert(alertText)
    }
  }

  const handleClickCancel = async () => {
    navigate('/')
  }

  const showAlert = async (alertText, type = 'success') => {
    setAlertText(alertText)
    setTimeout(() => {
      setAlertText('')
    }, 3000)
  }

  useEffect(() => {
    fetchTaskData()
  }, [])

  return (
    <>
      <form className="single-task-form">
        <h4>Edit Task</h4>
        <div className="form-control">
          <label>Task ID</label>
          <p className="task-edit-id">{data?._id}</p>
        </div>
        <div className="form-control">
          <label> Name</label>
          <input
            type="text"
            name="name"
            className="task-edit-name"
            value={taskName}
            onChange={(e) => {
              setTaskName(e.target.value)
            }}
          />
        </div>
        <div className="form-control">
          <label>completed</label>
          <input
            type="checkbox"
            name="completed"
            className="task-edit-completed"
            checked={taskChecked}
            onChange={(e) => {
              setTaskChecked(!!e.target.checked)
            }}
          />
        </div>
        <div className="edit-form-action-buttons">
          <button type="button" className="block btn task-edit-btn" onClick={handleClickCancel}>
            close
          </button>
          <button type="submit" className="block btn task-edit-btn" onClick={handleFormSubmit}>
            save
          </button>
        </div>
        <Link to="/" pclassName="btn back-link"></Link>
        {alertText && (
          <div className={alertText ? 'form-alert text-success' : 'form-alert'}>{alertText}</div>
        )}
      </form>
    </>
  )
}

export default EditTask
