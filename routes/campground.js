const express = require('express')
const router = express.Router()
const Campground = require('../models/campground.js');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require("../utils/ExpressError");
const {campgroundSchema} = require("../schemas.js");
const {isLoggedIn} = require('../validateMiddleware.js')


const validateCampground = (req,res,next) =>{
    const {error } = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}



router.get('/', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))


router.get('/new', isLoggedIn, (req,res)=>{
    res.render('campgrounds/form')    
})


router.get('/:id', catchAsync(async (req, res) => {
    const {id} =req.params
    const campground = await Campground.findById(id).populate('reviews')
    if(!campground){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req,res)=>{
    const {id} = req.params
    const findCampgroundById = await Campground.findById(id)
    if(!findCampgroundById){
        req.flash('error', 'Cannot edit campground that does not exist!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {findCampgroundById})
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req,res, next)=>{
        const newCampground = new Campground(req.body.campground)
        await newCampground.save()
        req.flash('success', 'Successfully created a campground!')
        res.redirect(`/campgrounds/${newCampground._id}`)
}))




router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req,res)=>{
    const {id} = req.params
    const {campground} = req.body
    await Campground.findByIdAndUpdate(id, campground, {new: true})
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req,res)=> {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}))

module.exports = router