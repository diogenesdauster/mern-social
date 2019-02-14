import User from '../models/user.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import profileImage from './../../client/assets/images/profile-pic.png'

const create = (req, res, next) => {
  const user = new User(req.body)
  user.save((err, result) => {
    if (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.status(200).json({
      message: 'Successfully signed up!'
    })
  })
}
const list = (req, res, next) => {
  User.find((err, users) => {
    if(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(users)
  }).select('name email updated created')
}
const userByID = (req, res, next, id) =>{
  User.findById(id).exec((err, user) => {
    if(err || !user){
      return res.status(400).json({
        error: 'User not found'
      })
    }
    req.profile = user
    next()
  })
}
const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}
const update = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true

  form.parse(req, (err,fields, files) => {
    if(err){
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }

    let user = req.profile
    user = _.extend(user, req.body)
    user.updated = Date.now()
    if(files.photo){
      user.photo.data = fs.readFileSync(files.photo.path)
      user.photo.contentType = files.photo.type
    }
    user.save((err) => {
      if(err){
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      user.hashed_password = undefined
      user.salt = undefined
      res.json(user)
    })

  })

}
const remove = (req, res, next) => {
  let user = req.profile
  user.remove((err, deletedUser) => {
    if(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  })
}

const photo = (req, rest, next) =>{
  if(req.profile.photo.data){
    res.set("Content-Type", req.profile.photo.contentType)
    return res.send(req.profile.data)
  }
  next()
}

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+profileImage)
}


export default { create, userByID, read, list, remove, update }
