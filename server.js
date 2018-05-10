const express = require('express'); //server
const hbs = require('hbs'); //engine view VE
const fs = require('fs'); //file system
const axios = require('axios'); //http library

const port = process.env.PORT || 3000;//heroku

var app = express(); //start of app

//register partials for hbs VE
//{{> header}}
hbs.registerPartials(__dirname + '/views/partials');
//set VE hbs
app.set('view engine', 'hbs');
//always do when make get/post request -> add log to file
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;

	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log(err);
		}
	});
	next();
});

//when mainetance, winthout next so always will be this website
// app.use((req, res, next) => {
// 	res.render('mainetance.hbs', {
// 		pageTitle: 'Sorry not valid xd'
// 	});
// });

//all static and vailable for people html css etc
app.use(express.static(__dirname + '/public'));

//helpers {{getCurrentYear}}
//helpers {{screamIt someVariable}}
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear()
});
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

//home page with axios on top before render
app.get('/', (req, res) => {
	axios.get('https://swapi.co/api/people/1/')
	.then((response) => {
		res.render('home.hbs', {
			pageTitle: 'Home page',
			welcomeMessage: 'Hello I am maslo',
			name: response.data.name,
			data: response.data
		})
	})
	.catch((e) => {
		console.log(e);
	})
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page22'
	});
});

app.get('/projects', (req, res) => {
	res.render('projects.hbs', {
		pageTitle: 'Projects',
		welcomeMessage: 'Hejo mamejo xd',
		projects: {
			first: 'Pomusz',
			second: 'Makrela'
		}
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Ups, page not found!!'
	});
});

//port to listening
app.listen(port, () => {
	console.log(`Server is up on : ${port}`)
});