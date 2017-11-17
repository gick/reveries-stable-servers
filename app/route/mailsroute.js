    var nodemailer = require("nodemailer");

    var smtpConfig = {
        host: 'SSL0.OVH.NET',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: 'conception',
            pass: 'twXLpAxH1984'
        }
    };

    let transporter = nodemailer.createTransport(smtpConfig)


    var message = {
        from: 'conception@reveries-project.fr',
        to: 'gicquel.pierreyves@gmail.fr',
        subject: 'Message title',
        text: 'Plaintext version of the message',
        html: '<p>HTML version of the message</p>'
    };

    module.exports = {
        send: function() {
            transporter.sendMail(message)
        }
    }