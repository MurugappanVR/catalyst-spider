const Insta = require('scraper-instagram');
const utils = require('./utils.js')
const InstaClient = new Insta();
var self = {
	scrapeTag : async function(hashTag){
		let data = await InstaClient.getHashtag(hashTag)
		.then(hashtagData => {
			return hashtagData;
		})
		.catch(err => {
			console.error(err);
			return err;
		});
		return data;
	},

	scrapeUser : async function(username){
		let data = await InstaClient.getProfile(username)
		.then(profile => profile)
		.catch(err => err);
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