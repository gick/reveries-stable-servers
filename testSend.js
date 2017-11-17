    var nodemailer = require("nodemailer");

    var smtpConfig = {
        host: 'SSL0.OVH.NET',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: 'conception@reveries-project.fr',
            pass: 'twXLpAxH1984'
        }
    };

    let transporter = nodemailer.createTransport(smtpConfig)


    let message = {
        envelope: {
            from: 'conception@reveries-project.fr',
            to: ['gicquel.pierreyves@gmail.com']
        },
        raw: `From: conception@reveries-project.fr
To: gicquel.pierreyves@gmail.com
Subject: test message

Hello world!`
    };

    transporter.sendMail(message)