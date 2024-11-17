const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const {storeReturnTo} = require('../validateMiddleware')
const { renderRegisterForm, createNewUser, renderLogin, login, logout } = require('../controller/user')

router.route('/register')
    .get(renderRegisterForm)
    .post(catchAsync(createNewUser))

router.route('/login')
    .get(renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), login)

router.route('/logout')
    .get(logout)

module.exports = router