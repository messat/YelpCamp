const mongoose = require('mongoose')
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

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

const template = (arr)=> arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i=0; i< 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            title: `${template(descriptors)} ${template(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})