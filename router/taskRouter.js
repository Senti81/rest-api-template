const express = require('express')
const Task = require('../model/Task')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try {
    await task.save()
    res.status(201).send(task)

  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOne({ _id, owner: req.user._id })
    if (!task) return res.status(404).send()
    res.send(task)

  } catch (error) {
    res.status(500).send()
  }
})


router.get('/tasks', auth, async (req, res) => {
  const match = { owner: req.user._id }

  // Filter
  if(req.query.completed) {
    match['completed'] = req.query.completed === 'true'
  }

  // Pagination
  const limit = req.query.limit ? parseInt(req.query.limit) : 0
  const skip = req.query.skip ? parseInt(req.query.skip) : 0

  // Sorting
  const sort = {}
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    const field = parts[0]
    const order = parts[1]
    sort[field] = order === 'asc' ? 1 : -1
  }

  try {
    const tasks = await Task
      .find(match)
      .limit(limit)
      .skip(skip)
      .sort(sort)
    res.send(tasks)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.put('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  try {
    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) 
      return res.status(404).send()

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()
    res.send(task)

  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id})

    if (!task) 
      return res.status(404).send()

    res.send(task)
  } catch (error) {
    res.status(500).send()
  }
})

module.exports = router