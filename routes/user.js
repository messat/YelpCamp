const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const {storeReturnTo} = require('../validateMiddleware')

router.get('/register', (req, res)=>{
    res.render('users/register')
})

router.post('/register', catchAsync(async (req,res, next) => {
    try {
        const { email, username, password } = req.body
        const newUser = new User({email, username})
        const registeredUser =  await User.register(newUser, password)
        req.login(registeredUser, function(err) {
            if (err) { 
                return next(err); 
                }
            req.flash("success", `Welcome ${username} to Yelp camp! Thank you for registering`)
            res.redirect('/campgrounds')
          });
    } catch (e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res)=>{
    res.render('users/login')
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), async (req,res) => {
    const {username} = req.body
    req.flash('success', `Welcome back, ${username}!`)
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
})

router.get('/logout', (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You are logged out! Goodbye')
        res.redirect('/campgrounds');
      });
})



module.exports = router