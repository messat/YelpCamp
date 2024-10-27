const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require('./routes/campground.js')
const reviewRoutes = require('./routes/review.js')
const session = require('express-session')
const flash = require('connect-flash')
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

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    next()
})


app.use('/campgrounds', campgroundRoutes)

app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req,res)=>{
    res.render('home')
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