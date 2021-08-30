var Crawler = require("crawler");
 
var self = {
    crawl : async function(){
        var c = new Crawler();
        // var data = await 
        c.direct({
            uri: 'http://www.google.com',
            skipEventRequest: false, // default to true, direct requests won't trigger Event:'request'
            callback: function(error, response) {
                if(error) {
                    console.log(error)
                    return error;
                } else {
                    var $ = response.$;
                    console.log($("title").text());
                    return $("title").text();
                }
            }
        });
        // console.log("data is "+data);
        // return data;

    } 
}
module.exports = self;
 
// Queue just one URL, with default callback