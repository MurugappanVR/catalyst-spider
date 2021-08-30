const amazonScraper = require('amazon-buddy');
const db = require('./databaseUtils.js')

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
		db.addRowInTable("ecommerce",{"TITLE":result[0].title,"PRODUCT_ID":productId,"COUNTRY":country,"THUMBNAIL_URL":result[0].main_image,"URL":result[0].url})
		return result
	}
}

module.exports = self;