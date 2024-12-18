const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index.js')
const mbxGecoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGecoding({ accessToken: mbxBoxToken})
const moment = require('moment')



module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({}).lean({ virtuals: true });
    campgrounds.sort((a, b) => new Date(b.timePosted) - new Date(a.timePosted));
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
    campground.timePosted = moment(campground.timePosted).fromNow()
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
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground)
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.images = req.files.map(file => ({url: file.path, filename: file.filename}))
    newCampground.author = req.user._id
    newCampground.timePosted = new Date()
    await newCampground.save()
    req.flash('success', 'Successfully created a campground!')
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params
    const {campground} = req.body
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const imgs = req.files.map(file => ({url: file.path, filename: file.filename}))
    const updateCampground = await Campground.findByIdAndUpdate(id, campground, {new: true})
    updateCampground.geometry = geoData.body.features[0].geometry
    updateCampground.images.push(...imgs)
    await updateCampground.save()
    if(req.body.deleteImages){
        for(const filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await updateCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${updateCampground._id}`)
}

module.exports.deleteCampground = async (req,res)=> {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}
