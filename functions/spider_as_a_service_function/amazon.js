const amazonScraper = require('amazon-buddy');
const utils = require('./utils.js')

var self = {
	scrapeProduct : async (productId,countryCode) => {
	    try {
	        // Collect 50 products from a keyword 'xbox one'
	        // Default country is US
	        //const products = await amazonScraper.products({ keyword: 'Xbox One', number: 20, country: 'IN' });
	        console.log(productId);
	        const product_by_asin = await amazonScraper.asin({ asin: productId,country: countryCode });
	        return product_by_asin.result;
	    } catch (error) {
	        console.log(error);
	    }
	},
	addProduct : async(productId,country)=>{
		var result = await self.scrapeProduct(productId,country);
		utils.addRowInTable("ecommerce",{"TITLE":result[0].title,"PRODUCT_ID":productId,"COUNTRY":country,"THUMBNAIL_URL":result[0].main_image,"URL":result[0].url})
		return result
	},
	scrapeFromKeyWord : async(keywordText,countryCode,limit,rating)=>{
		const products_rank = await amazonScraper.products({ keyword: keywordText, number: limit, country: countryCode, rating: rating });
		
		//perform sentiment analysis on the keyword before storing it in cache as we show the recent searches in the client
		//await utils.performSentimentAnalysis(keywordText).then(value=>{
			//var sentiment = value.sentiment_prediction[0].document_sentiment.toString();
			
		//});
		var value = await utils.performSentimentAnalysisAndAddInCache(keywordText,products_rank.result.slice(0,10));
		console.log("aamazon val is "+value);
		// if(value != 'Negative'){
		// 	utils.addValueInCache(keywordText,products_rank.result.slice(0,10));
		// }
		return products_rank.result;
	}
}

module.exports = self;