const express = require('express')
const router = express.Router()
const Campground = require('../models/campground.js');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require("../utils/ExpressError");
const {campgroundSchema} = require("../schemas.js")


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


router.get('/new', (req,res)=>{
    res.render('campgrounds/form')
})


router.get('/:id', catchAsync(async (req, res) => {
    const {id} =req.params
    const campground = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show', {campground})
}))

router.get('/:id/edit', catchAsync(async(req,res)=>{
    const {id} = req.params
    const findCampgroundById = await Campground.findById(id)
    res.render('campgrounds/edit', {findCampgroundById})
}))

router.post('/', validateCampground, catchAsync(async (req,res, next)=>{
        const newCampground = new Campground(req.body.campground)
        await newCampground.save()
        res.redirect(`/campgrounds/${newCampground._id}`)
}))




router.put('/:id', validateCampground, catchAsync(async(req,res)=>{
    const {id} = req.params
    const {campground} = req.body
    await Campground.findByIdAndUpdate(id, campground, {new: true})
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', catchAsync(async (req,res)=> {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

module.exports = router