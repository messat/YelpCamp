if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const ExpressError = require("./utils/ExpressError");

const campgroundRoutes = require('./routes/campground.js')
const reviewRoutes = require('./routes/review.js')
const userRoutes = require('./routes/user.js')

const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const mongoSanitize = require('express-mongo-sanitize');


async function mongooseServerConnect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    
    } catch (error) {
        console.log(error)
    }
}

mongooseServerConnect()

mongoose.connection.on("open", () =>{
    console.log("Database connection is open")
})
mongoose.connection.on("connected", ()=> {
    console.log("Database connected")
})
mongoose.connection.on('error', err => {
    console.log("Connection Error:", err);
  })

app.engine('ejs', engine)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(mongoSanitize());
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true}))
app.use(express.static(path.join(__dirname,'/public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/fakeuser', async (req,res)=>{
    const user = new User({email: "hello@gmail.com", username: "greetme"})
    const newUser = await User.register(user, 'Ferrari')
    res.send(newUser)
})

app.all('*', (req,res, next)=>{
    next(new ExpressError("Route not found for campground", 404))
})

app.use((err, req,res, next)=>{
    const {statusCode = 500} = err
    if(!err.message) {
        err.message = "Something went wrong. Please try again"
    }
    res.status(statusCode).render('error', {err})
})


app.listen(3000, ()=>{
    console.log('Listening on Port 3000')
})