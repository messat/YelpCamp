const Campground = require('../models/campground.js');
const Review = require('../models/reviews.js')

module.exports.createReviews = async (req,res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Posted new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReviews = async (req,res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
}