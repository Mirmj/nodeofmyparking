const mailer = require('nodemailer')

const sendingmail = async (to, subject, text) => {
    const transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mmj983621@gmail.com',
            pass: 'movx alto byxa lgvz'
        }
    })

    const mailOptions = {
        from: 'mmj983621@gmail.com',
        to: to,
        subject: subject,
        html: text
    }

    try {
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', mailResponse);
        return mailResponse;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = {
    sendingmail
}


