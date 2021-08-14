const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../utils/middlewares');

router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({}); //find\show all docs in db
		res.render('campgrounds/index', { campgrounds });
	})
);

router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.get(
	'/:id',
	catchAsync(async (req, res) => {
		//populate returns all info related to provided ID
		const campground = await Campground.findById(req.params.id)
			.populate({
				path: 'reviews',
				populate: {
					path: 'author'
				}
			})
			.populate('author');
		if (!campground) {
			req.flash('error', 'There is no such campground!');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
	})
);

router.post(
	'/',
	isLoggedIn,
	validateCampground,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground); // as usual we accept here an object, so body is an object
		campground.author = req.user._id;
		await campground.save();
		req.flash('success', 'Successfully made a new campground');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		if (!campground) {
			req.flash('error', 'There is no such campground!');
			return res.redirect('/campgrounds');
		}

		res.render('campgrounds/edit', { campground });
	})
);

router.put(
	'/:id',
	isLoggedIn,
	isAuthor,
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
		req.flash('success', 'Successfully updated campground');
		res.redirect(`/campgrounds/${campground._id}`);
	})
);

router.delete(
	'/:id',
	isLoggedIn,
	isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash('success', 'Campground has been deleted successfully');
		res.redirect(`/campgrounds`);
	})
);

module.exports = router;
