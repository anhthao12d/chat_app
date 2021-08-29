const nodemailer       	= require("nodemailer");
const systemConfig		= require(__path_configs + 'system');

const link 				= '/' + systemConfig.prefixUsers +'/accounts/active-account';
const linkActive		= 'http://localhost:' + systemConfig.port + link.replace('//','/');
const transport         = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: systemConfig.user,
		pass: systemConfig.pass,
	},
	tls : {
		rejectUnauthorized : false,
	}
});
module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  transport.sendMail({
    from: systemConfig.user,
    to: email,
    subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
        <h2>Hello ${systemConfig.user}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${linkActive}/${confirmationCode}> Click here</a>
        </div>`,
  }).catch(err => console.log(err));
};
