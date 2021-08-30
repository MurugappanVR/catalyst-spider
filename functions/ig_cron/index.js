const catalyst = require('zcatalyst-sdk-node');
const Insta = require('scraper-instagram');
const InstaClient = new Insta();

var crawl = async function(username){
	let data = await InstaClient.getProfile(username)
	.then(profile => profile)
	.catch(err => err);
	return data;
}

module.exports = (cronDetails, context) => {
	const catalystApp = catalyst.initialize(context);
	const datastore = catalystApp.datastore();
	let userId = cronDetails.getCronParam('user');

	/* 
        CONTEXT FUNCTIONALITIES
    */
    try{
    	crawl(userId).then(result=>{
			console.log("result is "+result);
			var tableName = "socialtrends_history";
			var rowData = {"POSTS":result.posts,"FOLLOWERS":result.followers,"FOLLOWING":result.following,"USER_NAME":userId};
			var table = datastore.table(tableName);
			var insertPromise = table.insertRow(rowData);
			insertPromise.then((row) => {
				console.log("rowData inserted successfully"+JSON.stringify(rowData));
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
	//context.closeWithSuccess(); //end of application with success
	// context.closeWithFailure(); //end of application with failure
};
