import twilio from 'twilio'




const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


const sendTwillioMessageToAdmin = async(userDetails, newGroup)=>{

const twilioClient = new twilio(accountSid, authToken)



   let message = "";

    if(userDetails){

    message = `A new user has registered in Splitwise.\n\nName: ${userDetails.name}\nEmail: ${userDetails.email}\nDetails: ${JSON.stringify(userDetails)}`;

    }
    else if(newGroup){
      // console.log("newGroup value inside email.js ❤️❤️", newGroup)

     message = ` "${newGroup.groupCreated.name}" -- [${newGroup.groupCreated.email}] has created to this group "${newGroup.groupName}" in Splitwise app.\n\nGroupName: ${newGroup.groupName}\n Participants: ${newGroup.groupMembers}`;

    }





await twilioClient.messages
  .create({
    body: message,
    to: adminPhoneNumber, // Text your number
    from: twilioPhoneNumber, // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));

}

export {sendTwillioMessageToAdmin}