const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require('./db/connection')

const userRouter = require('./router/userRouter')

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
  console.log('Server is running on port ' + port)
})