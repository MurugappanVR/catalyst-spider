var catalyst = require('zcatalyst-sdk-node');
var fs = require('fs');
const https = require('https');

var catalystApp,datastore,cache,zia;
var db = {
	initialize  : (req,isDataStoreRequired,isCacheRequired,isZiaRequired)=>{
		if(!catalystApp)
		catalystApp = catalyst.initialize(req);
		
		if(!datastore && isDataStoreRequired)
		datastore = catalystApp.datastore();

		if(!cache && isCacheRequired)
		cache = catalystApp.cache();

		if(!zia && isZiaRequired)
		zia = catalystApp.zia();
	},

	addRowInTable : (table,rowData)=>{
		var table = datastore.table(table);
		var insertPromise = table.insertRow(rowData);
		insertPromise.then((row) => {
			console.log("rowData inserted successfully"+rowData);
		}).catch(err => {
			console.log("rowData insertion failed"+err);
		});
	},

	queryTable : (query)=>{
		return new Promise((resolve, reject) => {
			// Queries the table in the Data Store
			catalystApp.zcql().executeZCQLQuery(query).then(queryResponse => {
				resolve(queryResponse);
			}).catch(err => {
				reject(err);
			})
		});
	},

	addValueInCache : async(key,value)=>{
		//Insert Cache using put by passing the key-value pair.
	    try{
	    	let segment = cache.segment(380000000053692);
		    let cachePromise = segment.put(key, value, 6);
		    cachePromise.then((entity) => {
		        return entity;
	        }).catch(err => {
	        	console.log("catch cache e is "+err);
				reject(err);
			});
	    }catch(e){
	    	console.log("cache error is "+e);
	    }
	},

	getPricingHistory : async(productId)=>{
		let queryPromise = new Promise((resolve, reject) => {
			// Queries the table in the Data Store
			var query = "Select * from pricing_history order by createdtime";
			if(productId){
				query="Select * from pricing_history where pricing_history.PRODUCT_ID='"+productId+"' order by createdtime";
			}
			catalystApp.zcql().executeZCQLQuery(query).then(queryResponse => {
				resolve(queryResponse);
			}).catch(err => {
				reject(err);
			})
		});
		let data = await queryPromise;
		return data;
	},

	getAllValuesInCache : async(segmentId)=>{
		let segment = cache.segment(segmentId);
		let cachePromise = segment.get();
    	cachePromise.then((entity) => {
            return entity;
        }).catch(err => {
			console.log("catch cache e is "+err);
			reject(err);
		});

	},

	performSentimentAnalysisAndAddInCache: async(text,value)=>{
		zia.getSentimentAnalysis([text])
		.then((result) => {
			console.log("sentiment is");
			console.log(JSON.stringify(result[0].sentiment_prediction[0].document_sentiment.toString()));
			if(result[0].sentiment_prediction[0].document_sentiment.toString() != "Negative"){
				db.addValueInCache(text,value);
			}
			return result;
		})
		.catch((error) => {
			console.log(error.toString())
			return "Positive";
		});
	},

	performImageModeration: async()=>{
		console.log("https getting image");
		let writeStream;
		var finalData = await https.get('https://instagram.fmaa3-2.fna.fbcdn.net/v/t51.2885-19/s320x320/43818140_2116018831763532_3803033961098117120_n.jpg?_nc_ht=instagram.fmaa3-2.fna.fbcdn.net&_nc_ohc=FkE_ZnIyItkAX-r7DFG&edm=ABfd0MgBAAAA&ccb=7-4&oh=0ce1ff1689f6976c9c898a86f64d6095&oe=613153F2&_nc_sid=7bff83', res => 
		{
			res.pipe(writeStream=fs.createWriteStream('image.jpg'));
			writeStream.on('finish', async function(){
			var result=await zia.moderateImage(fs.createReadStream('./image.jpg'), {mode: 'moderate'}) //Pass the input file and the mode
			.then((res) => {
				return res;
			})
			.catch((err) => console.log("errors is "+err.toString())); //Push errors to Catalyst Logs
			console.log("utils "+result);
			return result;
		});
		});
		//console.log("utils finalData "+JSON.stringify(finalData));
		console.log("https got image");
		return finalData.toString();
		// var result=await zia.moderateImage(fs.createReadStream('./image.jpg'), {mode: 'moderate'}) //Pass the input file and the mode
		// .then((result) => {
		// 	console.log(result);
		// })
		// .catch((err) => console.log("errors is "+err.toString())); //Push errors to Catalyst Logs
		// return result;
	}

}

module.exports = db;