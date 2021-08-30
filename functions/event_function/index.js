const catalyst = require('zcatalyst-sdk-node');
const fs = require('fs');
const path = require('path');
module.exports = (event, context) => {

 const app = catalyst.initialize(context);
 const EVENT_DETAILS = event.getSourceDetails();
 //let source = EVENT_DETAILS.type;
 let source = 'alert';
 let action = EVENT_DETAILS.action;
 if (source === 'alert') {
  try {
   let eventData = event.data;
   //let userEmailId = eventData.user_details.email_id;
   let email = app.email();
   let config = {
    from_email: 'murugappan.vr@zohocorp.com', // Replace this with the email you configured
    to_email: 'murugappanvr3@gmail.com',
	subject: 'Threshold breached!',
	content: fs.readFileSync(path.join(__dirname,'invite.html')).toString(),
    html_mode: true
   };
   let mailPromise = email.sendMail(config);
   mailPromise.then((mailObject) => {
    console.log(mailObject);
    context.closeWithSuccess();
   });
  }
  catch (err) {
   console.error(err);
   context.closeWithFailure();
  }

 }
 else {
  console.log("Not a Sign up Event");
  context.closeWithFailure();
 }
}