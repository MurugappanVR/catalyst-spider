var catalyst = require('zcatalyst-sdk-node');
var catalystApp,datastore;
var db = {
	initialize  : (req)=>{
		if(!catalystApp)
		catalystApp = catalyst.initialize(req);
		
		if(!datastore)
		datastore = catalystApp.datastore();
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
	}
}

module.exports = db;