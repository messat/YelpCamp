const Campground = require('../models/campground');

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.newCampgroundForm = (req,res)=>{
    res.render('campgrounds/form')    
}

module.exports.displayCampground = async (req, res) => {
    const {id} =req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews', 
        populate: {
        path: 'author'
        }
    }).populate('author')
    if(!campground){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}

module.exports.editCampground = async(req,res)=>{
    const {id} = req.params
    const findCampgroundById = await Campground.findById(id)
    if(!findCampgroundById){
        req.flash('error', 'Cannot edit campground that does not exist!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {findCampgroundById})
}

module.exports.createCampground = async (req,res, next)=>{
    const newCampground = new Campground(req.body.campground)
    newCampground.author = req.user._id
    await newCampground.save()
    req.flash('success', 'Successfully created a campground!')
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params
    const {campground} = req.body
    const updateCampground = await Campground.findByIdAndUpdate(id, campground, {new: true})
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${updateCampground._id}`)
}

module.exports.deleteCampground = async (req,res)=> {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}