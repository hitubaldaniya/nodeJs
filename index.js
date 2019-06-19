
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
var timeAgo = require('node-time-ago');

var colors = require('colors');
var express = require('express')
var moment = require('moment');
var app = express()
var host = ""
var responseData = "Data Object Goes Here..."

function dbInterface() {
	var cb;
	return {}
};

var DBInterface = new dbInterface();
var apiFunction = require('./backend/apiFunction')
var sqlFunction = require('./sqlDB/sqlFunctions')

const bodyParser = require('body-parser'); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/'))

if (process.env.LOCAL) {
  console.log("You are running LOCAL environment.".green)
  host = "http://127.0.0.1:3000"
}else{
  host = "http://127.0.0.1:3000"
}

app.get('/', function(req, res) {
  apiFunction.getOverview().then((result) => {
    res.render('home', { host:host, title:"Cloudoki Dashboard", data: result.body });
	}).catch(err => {
    res.render('404', { host:host, title:"404 page not found", data: "" });
	});
});

app.get('/deleteUser', function(req, res) {
  apiFunction.getDeveloperName().then((result) => {
    res.render('deleteUser', { host:host, title:"Delete Developer", data: result.body });
	}).catch(err => {
    res.render('404', { host:host, title:"404 page not found", data: "" });
	});
});

app.get('/overview', function(req, res) {
  apiFunction.getDevelopers().then((result) => {
    res.render('overview', { host:host, title:"Developers Overview", data: result.body });
	}).catch(err => {
    res.render('404', { host:host, title:"404 page not found", data: "", timeAgo:timeAgo });
	});
});

app.get('/overview/:language', function(req, res) {
  apiFunction.getCompaniesByLang(req, res).then((result) => {
    res.render('overview', { host:host, title:"Overview", data: result.body });
	}).catch(err => {
    res.render('404', { host:host, title:"404 page not found", data: "", timeAgo:timeAgo });
	});
});

app.post('/addDeveloper', function(req, res) {
  apiFunction.addDeveloper(req, res);
});

app.post('/deleteDeveloper', function(req, res) {
  apiFunction.deleteDeveloper(req, res);
});

app.post('/getDeveloper', function(req, res) {
  apiFunction.getDeveloper(req, res);
});

app.post('/editDeveloper', function(req, res) {
  apiFunction.editDeveloper(req, res);
});

app.get('*', function(req, res) {
  res.render('404', { host:host, title:"404 page not found", data: responseData });
});

module.exports = app;
app.listen(port);