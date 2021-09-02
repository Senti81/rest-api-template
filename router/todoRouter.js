const express = require('express')
const Todo = require('../model/Todo')
const router = express.Router()

router.post('/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title
  })
  try {
    await todo.save()
    res.status(201).send(todo)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find()
    res.send(todos)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
    if (!todo)
      return res.status(404).send()
    res.send(todo)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/todos/:id', async (req, res) => {
  const _id =  req.params.id
  try {
    const todo = await Todo.findByIdAndUpdate(_id, { completed: req.body.completed })
    if (!todo)
      return res.status(404).send()
    res.send()
  } catch (error) {
    res.status(500).send(error) 
  }
})

router.delete('/todos/:id', async (req, res) => {
  const _id =  req.params.id
  try {
    const todo = await Todo.findByIdAndRemove(_id)
    if (!todo)
      return res.status(400).send()
    res.send(todo)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router