
import nodemailer from "nodemailer";

const sendEmailToAdmin = (adminEmail, userDetails, newGroup) => {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      port: 587,
      auth: {
        user: "deepakmasai22@gmail.com",
        pass: "yczxareckbejrbuw",
      },
      connectionTimeout: 30000,
    });
  
     let message = "";

    if(userDetails){

    message = `A new user has registered in Splitwise.\n\nName: ${userDetails.name}\nEmail: ${userDetails.email}\nDetails: ${JSON.stringify(userDetails)}`;

    }
    else if(newGroup){
      // console.log("newGroup value inside email.js ❤️❤️", newGroup)

     message = ` "${newGroup.groupCreated.name}" -- [${newGroup.groupCreated.email}] has created to this group "${newGroup.groupName}" in Splitwise app.\n\nGroupName: ${newGroup.groupName}\n Participants: ${newGroup.groupMembers}`;

    }

    // \nDetails: ${JSON.stringify(newGroup)}



    const mailOptions = {
      from: "deepakmasai22@gmail.com",
      to: adminEmail,
      subject: "New User Registered in Splitwise App",
      text: message,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

  };
  

  export {sendEmailToAdmin}

