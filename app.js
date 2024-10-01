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



app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/makecampground', async (req,res)=>{
    const camp = new Campground({title: "My Backyard"})
    await camp.save()
    res.send(camp)
})


app.listen(3000, ()=>{
    console.log('Listening on Port 3000')
})