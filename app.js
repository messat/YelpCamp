const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const Campground = require('./models/campground');

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


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(express.urlencoded({ extended: true}))




app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/campgrounds', async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})


app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/form')
})


app.get('/campgrounds/:id', async (req, res) => {
    const {id} =req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
})

app.post('/campgrounds', async (req,res)=>{
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    res.redirect(`/campgrounds/${newCampground._id}`)
})


app.listen(3000, ()=>{
    console.log('Listening on Port 3000')
})