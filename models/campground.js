const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Review = require('./reviews');

const ImageSchema = new Schema({
        url: String,
        filename: String
})

ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        }, 
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    reviews: [
        {type: Schema.Types.ObjectId, ref: 'Review'}
    ]
}, opts)

campgroundSchema.virtual('properties.popUpMarkUp').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}" style="font-size: 15px;">${this.title}</a></strong>
    <p style="font-size: 15px;margin-top: 5px;">${this.description.substring(0, 20) + "..."}</p>`
})



campgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
  });

module.exports= mongoose.model('Campground', campgroundSchema)