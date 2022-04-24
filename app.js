const express = require('express');
const { join } = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');

// Create the Express application and set the port number.
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('connected');
});

const app = express();
const port = 3000;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', join(__dirname, './views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));





app.get('/', (req, res) => res.render('home'));

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});
    

app.get('/campgrounds/new', (req, res) => res.render('campgrounds/new'));

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect('/campgrounds/' + campground._id);
});


app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect('/campgrounds/' + req.params.id);
});

app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
    });
    





app.listen(port, () => console.log(`Example app listening on port ${port}!`));