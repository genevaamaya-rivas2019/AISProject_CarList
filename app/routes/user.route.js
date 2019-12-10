module.exports = function (app) {

	var express = require("express");
	var router = express.Router();

	const users = require('../controllers/user.controller.js');
	app.use(express.static('public'))


	router.use(function (req, res, next) {
		console.log("/" + req.method);
		next();
	});

	app.get('/', (req, res) => {
		res.sendFile(__dirname+'/test.html');
	});

	// Save a User to MongoDB
	// app.post('/api/users/save', users.save);


	app.get("/item/retrieve/:id", (req, res) => {
		if (req.params.id != "all") {
			users.findOne(res, req.params.id)
		} else {
			users.findAll(res)

		}
	})
	// Retrieve all Users
	app.get('/item/create', (req, res) => {
		users.save(req.query, res)
	});

	app.get('/item/delete/:id', (req, res) => {
		users.delete(req, res);
	});

	app.put('/item/update', (req, res) => {
		// users.save(req.query,res);	
		// console.log(req.body);
		console.log("update : ");
		
		console.log(req.body);
		
		// users.delete(req,res);
		// let id = req.params.id;
		users.update(res, req.body);
	});

	app.put('/item/search/:id',(req, res) =>{
		console.log("Search...........")
		console.log(req.params.id)
		users.searchOne(res, req.params.id)
	})

	app.get("*", (req, res) => {
		res.sendFile("views/404.html");
	});
}