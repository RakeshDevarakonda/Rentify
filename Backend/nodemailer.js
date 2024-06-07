import nodemailer from "nodemailer";

 function sendMail(e) {
  if (e.send == "seller") {
    const sendto = e.selleremail;
    const message = `${e.buyername} shown interest in your property`;
    const name = e.buyername;
    
    const email = e.buyeremail;
    const mobilenumber = e.buyernumber;
    const sub = "SomeOne shown interest in your property";
     mailer(sendto,sub,message,name,email,mobilenumber)
  } else {
    const sendto = e.buyeremail;
    const sub = "You have shown interest in this property";
    const message =
      "You have shown interest in this property. Please contact them for more details";
    const name = e.sellername;
    const email = e.selleremail;
    const mobilenumber = e.sellernumber;
     mailer(sendto,sub,message,name,email,mobilenumber)
  }
}



async function  mailer(sendto,sub,message,name,email,mobilenumber){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILERUSERNAME,
            pass: process.env.NODEMAILERPASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SENDEREMAIL,
        to: sendto,
        to: email,

        subject: Nodemailer,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        
        <style>
        
        </style>
        <body>
            <h1>${message}</h1>
            <div>
        
                <table>
                    <tbody>
                      
                        <tr>
                            <td>Name</td>
                            <td>${name}</td>
                        </tr>
                        <tr>
                            <td>email</td>
                            <td>${email}</td>
                        </tr>  <tr>
                            <td>Mobile Number    </td>
                            <td>${mobilenumber}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        
         
        </body>
        </html>`,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (err) {
        console.log('Email send failure with error: ' + err);
    }
}
export default sendMail;
