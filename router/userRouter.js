const express = require('express')
const router = express.Router()
const User = require('../model/User')

// Show all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).send(users)
  } catch (error) {
    res.status(400).send(error)
  }
})

// GET one
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).send()
    }
    res.status(200).send(user)
  } catch (error) {
    res.status(500).send()
  }
})

// Create new user
router.post('/users', async (req, res) => {

  // Check if email already exists
  if (await User.findOne({ email: req.body.email })) {
    return res.status(400).send({error: 'Email already in use'})
  }
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user) 
  } catch (error) {
    res.status(400).send(error)
  }
})

// Login user
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    res.send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Change user
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    })
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (error) {
    res.status(400).send(error)
  }
}) 

// delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (error) {
    res.status(500).send()
  }
})

module.exports = router