var express = require('express');
var app = express();
app.use(express.json()); // This supports the JSON encoded bodies
var catalyst = require('zcatalyst-sdk-node');
var amazon = require('./amazon.js');
var ig = require('./instagram_new.js');
//var crawler = require('./web-crawler.js');
var Crawler = require("crawler");
var utils = require('./utils.js');
var isBot = require('isbot');
//The POST API adds data to persist in the ecomerce table and initiates a cron function to poll the data periodically
app.post('/scrape/amazon', function (req, res) {
	utils.initialize(req,true);
	const productId = req.body.id;
	const countryCode = req.body.country;
	amazon.scrapeProduct(productId,countryCode).then(value=>{
		utils.addRowInTable("pricing_history",{"PRODUCT_ID":productId,"COLLECTION_TIME":Date.now(),"PRICE":value[0].price.current_price});
		res.send(value);
	})
	.catch(e=>{
		console.log("exception"+e.message);
		res.send({"msg":"error"});
	})
});

app.post('/add/amazon', function (req, res) {
	utils.initialize(req,true);
	const productId = req.body.id;
	const countryCode = req.body.country;
	amazon.addProduct(productId,countryCode).then(value=>{
		console.log(value);
		res.send(value);
	})
	.catch(e=>{
		console.log("exception"+e.message);
		res.send({"msg":"error"});
	})
});

app.get('/list/amazon', function (req, res) {
	utils.initialize(req,true,true,true);
	const keyword = req.query.keyword;
	const countryCode = req.query.country;
	const limit = req.query.limit;
	const ratingLower = req.query.ratingLower;
	const ratingUpper = req.query.ratingUpper;
	amazon.scrapeFromKeyWord(keyword,countryCode,limit,[ratingLower,ratingUpper]).then(value=>{
		res.send(value);
	})
	.catch(e=>{
		console.log("exception"+e.message);
		res.send({"msg":"error"});
	})
});

app.get('/recent/amazon', function (req, res) {
	utils.initialize(req,true,true,true);
	const id = 380000000053692;
	utils.getAllValuesInCache(id).then(value=>{
		res.send(value);
	})
	.catch(e=>{
		console.log("exception"+e.message);
		res.send({"msg":"error"});
	})
});

app.get('/pricing/amazon', function (req, res) {
	utils.initialize(req,true,true,true);
	const id = req.query.id? req.query.id:'B08K3GW17S';
	var finalData = {list:[],pid:id}
	//TODO : Move it to query from ecommerce table
	if(id=='B08K3GW17S'){
		finalData.thumnail_url='https://m.media-amazon.com/images/I/319WfTMjpAL._AC_SY879_.jpg';
		finalData.url='https://www.amazon.in/dp/B08K3GW17S';
		finalData.title='Microsoft Xbox X/S Wireless Controller Robot White';
	}else if(id=='B08N5WG761'){
		finalData.thumnail_url='https://m.media-amazon.com/images/I/316Agzc-+UL._AC_SY879_.jpg';
		finalData.url='https://www.amazon.in/dp/B08N5WG761';
		finalData.title='2020 Apple MacBook Pro (13.3-inch/33.78 cm, Apple M1 chip with 8‑core CPU and 8‑core GPU, 8GB RAM, 256GB SSD) - Silver';
	}else{
		finalData.thumnail_url='https://m.media-amazon.com/images/I/41N9-hbLe0L._AC_SY879_.jpg';
		finalData.url='https://www.amazon.in/dp/B08L5VZKWT';
		finalData.title='New Apple iPhone 12 Pro Max (128GB) - Pacific Blue';
	}
	utils.getPricingHistory(id).then(value=>{
		value.forEach(element => {
			finalData.list.push({'price':element.pricing_history.PRICE,'date':element.pricing_history.CREATEDTIME,'ct':element.pricing_history.COLLECTION_TIME});
		});
		res.send(finalData);
	})
	.catch(e=>{
		console.log("pricing exception "+e);
		res.send({"msg":"error"});
	})
});

app.get('/scrape/ig', function (req, res) {
	utils.initialize(req,true,true,true);
	let query = req.query.query;
	const type = req.query.type;
	if(query[0]=='@' || query[0]=='#'){
		query = query.substring(1);
	}
	if(type=="user"){
		ig.scrapeUser(query).then(value=>{
			console.log("scrape ig user"+value);
			res.send(value);
		})
		.catch(e=>{
			console.log("exception"+e.message);
			res.send({"msg":"error"});
		});
	}else{
		ig.scrapeTag(query).then(value=>{
			console.log("scrape ig hashtag"+value);
			res.send(value);
		})
		.catch(e=>{
			console.log("exception"+e.message);
			res.send({"msg":"error"});
		});
	}
});


app.post('/add/ig', function (req, res) {
	utils.initialize(req,true,true,true);
	const userId = req.body.user;
	ig.addUser(userId).then(value=>{
		res.send(value);
	})
	.catch(e=>{
		console.log("exception"+e.message);
		res.send({"msg":"error"});
	});
});

app.get('/list/ig', function (req, res) {
	utils.initialize(req);
	const hash = req.query.hashTag;
	ig.scrapeTag(hash).then(value=>{
		console.log(value);
		res.send(value);
	})
	.catch(e=>{
		console.log("exception"+e.message);
		res.send({"msg":"error"});
	});
});

app.get('/moderate/ig', function (req, res) {
	utils.initialize(req,true,true,true);
	const hash = req.query.hashTag;
	ig.moderateImages(hash).then(value=>{
		console.log(value);
		res.send(value);
	})
	.catch(e=>{
		console.log("exception"+e.message);
		res.send({"msg":"error"});
	});
});

app.get('/get/wc', function (req, res) {
	utils.initialize(req);
	// crawler.crawl().then(value=>{
	// 	console.log(value);
	// 	res.send(value);
	// });
	var url = req.query.url;
	var querySelector = req.query.querySelector;
	var c = new Crawler();
        // var data = await 
    c.direct({
        uri: url,
        skipEventRequest: false, // default to true, direct requests won't trigger Event:'request'
        callback: function(error, response) {
            if(error) {
                console.log(error)
                res.send(error);
            } else {
                var $ = response.$;
                res.send($(querySelector).text());
            }
        }
    });
});

app.get('/isbot', function (req, res) {
	utils.initialize(req);
	var userAgent = req.query.ua;
	res.send(isBot(userAgent));
});

module.exports = app;