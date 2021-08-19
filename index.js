const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
require('./db/connection')

const userRouter = require('./router/userRouter')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(userRouter)

app.get('/', (req, res) => {
  res.status(200).render('base')
})

app.listen(port, () => {
  console.log('Server is running on port ' + port)
})