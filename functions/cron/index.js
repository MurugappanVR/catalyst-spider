const catalyst = require('zcatalyst-sdk-node');
var amazon = require('./amazon.js');

module.exports = (cronDetails, context) => {
	const catalystApp = catalyst.initialize(context);
	const datastore = catalystApp.datastore();
	let productId = cronDetails.getCronParam('productId');
	let countryCode = cronDetails.getCronParam('country');
	// let remainingExecutionCount = cronDetails.getRemainingExecutionCount();
	// let thisCronDetails = cronDetails.getCronDetails();
	// let projectDetails = cronDetails.getProjectDetails();

	// let remainingTime = context.getRemainingExecutionTimeMs();
	// let executionTime = context.getMaxExecutionTimeMs();

	/* 
        CONTEXT FUNCTIONALITIES
    */
    try{
    	amazon.scrapeProduct(productId,countryCode).then(value=>{
			var tableName = "pricing_history";
			var rowData = {"PRODUCT_ID":productId,"COLLECTION_TIME":Date.now(),"PRICE":value[0].price.current_price};
			var table = datastore.table(tableName);
			var insertPromise = table.insertRow(rowData);
			insertPromise.then((row) => {
				console.log("rowData inserted successfully"+rowData);
				context.closeWithSuccess(); //end of application with success
			}).catch(err => {
				console.log("rowData insertion failed"+err);
				context.closeWithFailure(); //end of application with failure
			});
		})
    }catch(e){
    	console.log("cron failed"+e);
    	context.closeWithFailure(); //end of application with failure
    }
};
