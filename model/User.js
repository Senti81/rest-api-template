const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true
  }
})

// Self defined method on the user schema
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  
  if (!user) throw new Error('Login failed')  

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) throw new Error('Login failed')
  
  return user
}

// Pre hook middleware (hashing password)
userSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 8)  
})

const User = mongoose.model('User', userSchema)

module.exports = User