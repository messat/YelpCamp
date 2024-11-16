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
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '672b85e34e7e601d91378217',
            title: `${template(descriptors)} ${template(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            price: price,
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo dolor ducimus maxime quaerat tenetur quidem similique nemo sapiente quia dolore illum, animi earum sequi fugiat neque ipsum quae! Tempore, inventore."
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})