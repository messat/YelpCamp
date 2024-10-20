const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Review = require('./reviews')

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {type: Schema.Types.ObjectId, ref: 'Review'}
    ]
})

campgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
    console.log(doc); // Will not be executed
  });

module.exports= mongoose.model('Campground', campgroundSchema)