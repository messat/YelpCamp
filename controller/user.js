const User = require('../models/user')


module.exports.renderRegisterForm = (req, res)=>{
    res.render('users/register')
}

module.exports.createNewUser = async (req,res, next) => {
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
}

module.exports.renderLogin = (req, res)=>{
    res.render('users/login')
}

module.exports.login = async (req,res) => {
    const {username} = req.body
    req.flash('success', `Welcome back, ${username}!`)
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You are logged out! Goodbye')
        res.redirect('/campgrounds');
      });
}