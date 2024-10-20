const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const Review = require('./models/reviews.js')

const catchAsync = require('./utils/catchAsync')
const ExpressError = require("./utils/ExpressError");
const campground = require('./models/campground');

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

const validateCampground = (req,res,next) =>{
    const {error } = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateReview = (req,res, next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
 


app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/campgrounds', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))


app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/form')
})


app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} =req.params
    const campground = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show', {campground})
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
    const {id} = req.params
    const findCampgroundById = await Campground.findById(id)
    res.render('campgrounds/edit', {findCampgroundById})
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req,res, next)=>{
        const newCampground = new Campground(req.body.campground)
        await newCampground.save()
        res.redirect(`/campgrounds/${newCampground._id}`)
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req,res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req,res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))


app.put('/campgrounds/:id', validateCampground, catchAsync(async(req,res)=>{
    const {id} = req.params
    const {campground} = req.body
    await Campground.findByIdAndUpdate(id, campground, {new: true})
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req,res)=> {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))



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