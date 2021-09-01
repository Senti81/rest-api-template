require('dotenv').config()
require('./db/connection')

const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT

const userRouter = require('./router/userRouter')
const taskRouter = require('./router/taskRouter')
const todoRouter = require('./router/todoRouter')

app.use(cors())
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)
app.use(todoRouter)

app.listen(port, () => {
  console.log('Server is running on port ' + port)
})