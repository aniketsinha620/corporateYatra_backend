import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'norris52@ethereal.email',
        pass: 'UNv836NueyGErHbykK'
    }
});


const emailVerificationNodemailer = async (email, OTP) => {

    console.log("emailVerificationNodemailer=>", { email, OTP })

    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
        to: email,
        subject: "EmailVerification for Admin from corporateYatra",
        text: OTP.toString(),
        html: "<b>Hello world?</b>",
    });

    console.log("Message sent: %s", info.messageId);
    return info

}

export default emailVerificationNodemailer