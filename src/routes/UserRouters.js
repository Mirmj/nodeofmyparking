const routes = require('express').Router()
const userController =require('../controllers/UserControllers')
const express= require('express')
// routes.post('/user',userController.adduser1)
routes.get('/users',userController.getAllUsers)
routes.post('/user',userController.addUser)
routes.delete('/user/:id',userController.deleteUser)
routes.get('/users/:id',userController.getUserById)
routes.post('/user/signup',userController.signUp)
routes.post('/user/login',userController.loginUser)
routes.post('/forgotpassword/:email',userController.forgotPassword)
routes.post('/user/resetpassword',userController.resetpassword)


module.exports =routes