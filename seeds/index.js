const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect(process.env.DB_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 300; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: '611ba6af35f57b2a3c62363e',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,

			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem aperiam et maxime sint quos assumenda ab minima quae odit quidem totam culpa voluptate, obcaecati enim possimus tempora incidunt in eum!',
			price,
			geometry: {
				type: 'Point',
				coordinates: [cities[random1000].longitude, cities[random1000].latitude]
			},
			images: [
				{
					url: 'https://res.cloudinary.com/doytl5yki/image/upload/v1629206279/YelpCamp/dbmokdmphnaky5yguxew.jpg',
					filename: 'YelpCamp/dbmokdmphnaky5yguxew'
				},
				{
					url: 'https://res.cloudinary.com/doytl5yki/image/upload/v1629206279/YelpCamp/dbmokdmphnaky5yguxew.jpg',
					filename: 'YelpCamp/dbmokdmphnaky5yguxew'
				}
			]
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
