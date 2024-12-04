const mongoose = require('mongoose')
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors, phrases} = require('./seedHelpers')

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
  for (let i=0; i< 5; i++){
    const random1000 = Math.floor(Math.random() * 1025)
    const randomPhrases = Math.floor(Math.random() * 11)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '67422100f1f62550c661fa2f',
            title: `${template(descriptors)} ${template(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
               type: 'Point', 
               coordinates: [
                cities[random1000].longitude, 
                cities[random1000].latitude
              ] 
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dvwri8zij/image/upload/v1732386815/NY-Penthouse1_ijytno.jpg',
                  filename: 'YelpCamp/NY-Penthouse1_ijytno',
                },
                {
                  url: 'https://res.cloudinary.com/dvwri8zij/image/upload/v1732386815/NY-Penthouse2_jieb4l.jpg',
                  filename: 'YelpCamp/NY-Penthouse2_jieb4l',
                },
                {
                  url: 'https://res.cloudinary.com/dvwri8zij/image/upload/v1732386815/NY-Penthouse3_ezovwc.jpg',
                  filename: 'YelpCamp/NY-Penthouse3_ezovwc',
                }
              ],
            price: price,
            description: phrases[randomPhrases],
            timePosted: new Date()
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})


