const express = require('express')
const router = express.Router()
const Campground = require('../models/campground.js');
const {isLoggedIn, validateCampground, verifyAuthor} = require('../validateMiddleware.js');

const catchAsync = require('../utils/catchAsync')

router.get('/', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))


router.get('/new', isLoggedIn, (req,res)=>{
    res.render('campgrounds/form')    
})


router.get('/:id', catchAsync(async (req, res) => {
    const {id} =req.params
    const campground = await Campground.findById(id).populate('reviews').populate('author')
    if(!campground){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

router.get('/:id/edit', isLoggedIn, verifyAuthor, catchAsync(async(req,res)=>{
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
        newCampground.author = req.user._id
        await newCampground.save()
        req.flash('success', 'Successfully created a campground!')
        res.redirect(`/campgrounds/${newCampground._id}`)
}))




router.put('/:id', isLoggedIn, verifyAuthor, validateCampground, catchAsync(async(req,res)=>{
    const {id} = req.params
    const {campground} = req.body
    const updateCampground = await Campground.findByIdAndUpdate(id, campground, {new: true})
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${updateCampground._id}`)
}))

router.delete('/:id', isLoggedIn, verifyAuthor, catchAsync(async (req,res)=> {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}))

module.exports = router