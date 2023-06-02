const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const send_error_report_email = (api_errors) => {
    const msg = {
        to: 'wmitchell@centricitynow.com',
        from: 'wmitchell@centricitynow.com',
        subject: 'TEST',
        text: 'This is "TEST"',
        html: '<p>This is a test email.</p>',
    };
        sgMail.send(msg)
        .then(() => {
        console.log('Email sent');
    })
        .catch((error) => {
        console.error(error);
    });
}

const function2 = () =>{

}

module.exports = {
    send_error_report_email: send_error_report_email,
    function2: function2,
}