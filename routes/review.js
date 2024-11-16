const express= require('express')
const router = express.Router({ mergeParams: true})

const Campground = require('../models/campground.js');
const Review = require('../models/reviews.js')
const {validateReview} = require('../validateMiddleware.js')
const catchAsync = require('../utils/catchAsync')



router.post('/', validateReview, catchAsync(async (req,res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Posted new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req,res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router