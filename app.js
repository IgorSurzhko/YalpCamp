const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection:'));
db.once('open', () => {
	console.log('Database Connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
mongoose.set('useFindAndModify', false); //avoid deprecation warnings

app.use(express.urlencoded({ extended: true })); //parses data from HTML FORMS
app.use(methodOverride('_method')); //prefix for method-override URL
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
	secret: 'thisshouldbeabettersecret!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true, //security flag
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};
app.use(session(sessionConfig));

app.use('/campgrounds', campgrounds);
//to have access to :id we use  (mergeParams: true) inside router file
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
	res.render('home');
});

//if there is no such a route (endpoint)
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Does Not Exist', 404));
});

//error handler, here we get through the @next@ func
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh shoot! Something went wrong';
	res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
	console.log('Serving on port 3000');
});
