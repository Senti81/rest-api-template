const express = require('express')
const router = express.Router()
const User = require('../model/User')
const auth = require('../middleware/auth')

// Create new user
router.post('/users', async (req, res) => {
  
  // Check if email already exists
  if (await User.findOne({ email: req.body.email })) {
    return res.status(400).send({error: 'Email already in use'})
  }
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token }) 
  } catch (error) {
    res.status(400).send(error)
  }
})

// Login user
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

// Logout user
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.token = ''
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(400).send(error)
  }
})

// Show current user
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// Change current user
router.put('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch (error) {
    res.status(400).send(error)
  }
}) 

// Delete current user
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (error) {
    res.status(500).send()
  }
})

module.exports = router