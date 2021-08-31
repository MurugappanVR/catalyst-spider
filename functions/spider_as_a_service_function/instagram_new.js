//faced authentication & too many requests in below package 
//const Insta = require('scraper-instagram');
const utils = require('./utils.js')
//const InstaClient = new Insta();

var ig = require('instagram-scraping');

var self = {
	scrapeTag : async function(hashTag){
		let data = await ig.scrapeTag(hashTag)
		.then(hashtagData => {
			return hashtagData;
		})
		.catch(err => {
			console.error(err);
			return err;
		});
		console.log("ig scrape tag data is "+data);
		return data;
	},

	scrapeUser : async function(username){
		let data = await ig.scrapeUserPage(username)
		.then(profile => profile)
		.catch(err => err);
		console.log("ig scrape user data is "+data);
		return data;
	},

	addUser : async(userId)=>{
		var result = await self.scrapeUser(userId);
		utils.addRowInTable("socialmedia",{"USER_ID":result.id,"DISPLAY_NAME":result.name,"USER_NAME":userId,"WEBSITE":result.website,"PIC":result.pic,"SOCIAL_URL":result.link});
		return result
	},

	moderateImages : async()=>{
		var result=await utils.performImageModeration();
		return result;
	}
}
module.exports = self;