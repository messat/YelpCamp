const express = require('express')
const router = express.Router()
const {isLoggedIn, validateCampground, verifyAuthor} = require('../validateMiddleware.js');
const {index, newCampgroundForm, createCampground, displayCampground, editCampground, updateCampground, deleteCampground} = require('../controller/campgrounds.js')

const catchAsync = require('../utils/catchAsync')

router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn, validateCampground, catchAsync(createCampground))

router.route('/new')
    .get(isLoggedIn, newCampgroundForm)

router.route('/:id')
    .get(catchAsync(displayCampground))
    .put(isLoggedIn, verifyAuthor, validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, verifyAuthor, catchAsync(deleteCampground))

router.route('/:id/edit')
    .get(isLoggedIn, verifyAuthor, catchAsync(editCampground))



module.exports = router